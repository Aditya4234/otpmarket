import { Response } from 'express';
import mongoose from 'mongoose';
import Order from '@/models/Order';
import Service from '@/models/Service';
import Wallet from '@/models/Wallet';
import Transaction from '@/models/Transaction';
import Notification from '@/models/Notification';
import { AuthRequest } from '@/types';
import { asyncHandler } from '@/utils/asyncHandler';
import {
  SuccessResponse,
  NotFoundResponse,
  BadRequestResponse,
} from '@/utils/apiResponse';
import { buildPaginationQuery, generateOrderId } from '@/utils/helpers';
import { getIO } from '@/services/socket.service';

const ORDER_CANCELLATION_MINUTES = 5;

export const createOrder = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { serviceId, country, platform, quantity = 1 } = req.body;

  const service = await Service.findById(serviceId);
  if (!service || !service.isActive || !service.isAvailable) {
    return new NotFoundResponse('Service not found or unavailable').send(res);
  }

  const wallet = await Wallet.findOne({ user: req.user?._id });
  if (!wallet) {
    return new NotFoundResponse('Wallet not found').send(res);
  }

  if (wallet.isFrozen) {
    return new BadRequestResponse('Your wallet is frozen. Please contact support.').send(res);
  }

  const totalAmount = service.price * quantity;

  if (wallet.balance < totalAmount) {
    return new BadRequestResponse(
      `Insufficient balance. Required: ₹${totalAmount}, Available: ₹${wallet.balance}`,
    ).send(res);
  }

  const virtualNumber = mockAssignNumber(service.country, service.type);
  const expiryAt = new Date(Date.now() + 60 * 60 * 1000);

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    wallet.balance -= totalAmount;
    wallet.totalSpent += totalAmount;
    wallet.lastTransaction = new Date();
    await wallet.save({ session });

    const order = await Order.create(
      [{
        orderId: generateOrderId(),
        user: req.user?._id,
        service: service._id,
        number: virtualNumber,
        country: country || service.country,
        platform: platform || service.type,
        amount: service.price,
        quantity,
        totalPrice: totalAmount,
        status: 'active',
        expiryAt,
        metadata: {
          serviceName: service.name,
          provider: service.provider,
          countryCode: service.countryCode,
        },
      }],
      { session },
    );

    await Transaction.create(
      [{
        user: req.user?._id,
        wallet: wallet._id,
        type: 'purchase',
        amount: totalAmount,
        fees: 0,
        netAmount: -totalAmount,
        status: 'success',
        description: `Purchase of ${service.name} - ${virtualNumber}`,
        reference: order[0].orderId,
        balanceBefore: wallet.balance + totalAmount,
        balanceAfter: wallet.balance,
      }],
      { session },
    );

    await session.commitTransaction();

    try {
      const notification = await Notification.create({
        user: req.user?._id,
        title: 'Order Created',
        message: `Your order for ${service.name} is active. Number: ${virtualNumber}`,
        type: 'order',
        link: `/orders/${order[0].orderId}`,
        metadata: { orderId: order[0]._id, serviceName: service.name },
      });

      const io = getIO();
      if (io) {
        io.to(req.user?._id?.toString() || '').emit('order:created', {
          order: order[0],
          notification,
        });
      }
    } catch {
      // Non-critical: notification/emit failure should not break the flow
    }

    return new SuccessResponse('Order created successfully', order[0]).send(res);
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});

export const getOrders = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?._id;
  const { page, limit, skip, sort } = buildPaginationQuery(req.query as any);

  const filter: Record<string, unknown> = { user: userId };

  if (req.query.status) {
    filter.status = req.query.status;
  }

  if (req.query.startDate && req.query.endDate) {
    filter.createdAt = {
      $gte: new Date(req.query.startDate as string),
      $lte: new Date(req.query.endDate as string),
    };
  }

  const [total, orders] = await Promise.all([
    Order.countDocuments(filter),
    Order.find(filter)
      .populate('service', 'name slug price type country')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
  ]);

  const totalPages = Math.ceil(total / limit);

  return new SuccessResponse('Orders fetched successfully', orders, {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  }).send(res);
});

export const getOrder = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { orderId } = req.params;

  const order = await Order.findOne({
    orderId,
    user: req.user?._id,
  })
    .populate('service')
    .lean();

  if (!order) {
    return new NotFoundResponse('Order not found').send(res);
  }

  const remainingTime = order.expiryAt
    ? Math.max(0, new Date(order.expiryAt).getTime() - Date.now())
    : 0;

  return new SuccessResponse('Order fetched successfully', {
    order,
    remainingTimeMs: remainingTime,
    isExpired: remainingTime === 0 && order.status === 'active',
  }).send(res);
});

export const checkOTP = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { orderId } = req.params;

  const order = await Order.findOne({
    orderId,
    user: req.user?._id,
  })
    .populate('service', 'name')
    .lean();

  if (!order) {
    return new NotFoundResponse('Order not found').send(res);
  }

  if (order.status !== 'active') {
    return new BadRequestResponse(`Order is ${order.status}. OTP can only be checked on active orders.`).send(res);
  }

  if (order.otpCode) {
    const timeSinceOtpReceived = order.otpReceivedAt
      ? Date.now() - new Date(order.otpReceivedAt).getTime()
      : 0;

    return new SuccessResponse('OTP received for this order', {
      hasOTP: true,
      otpCode: order.otpCode,
      otpReceivedAt: order.otpReceivedAt,
      otpAgeMs: timeSinceOtpReceived,
      number: order.number,
    }).send(res);
  }

  return new SuccessResponse('No OTP received yet for this order', {
    hasOTP: false,
    number: order.number,
  }).send(res);
});

export const cancelOrder = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { orderId } = req.params;
  const { reason } = req.body;

  const order = await Order.findOne({
    orderId,
    user: req.user?._id,
  });

  if (!order) {
    return new NotFoundResponse('Order not found').send(res);
  }

  if (!['pending', 'active'].includes(order.status)) {
    return new BadRequestResponse(`Cannot cancel order in "${order.status}" status`).send(res);
  }

  const orderAge = Date.now() - new Date(order.createdAt).getTime();
  const maxAge = ORDER_CANCELLATION_MINUTES * 60 * 1000;

  if (orderAge > maxAge) {
    return new BadRequestResponse(
      `Order can only be cancelled within ${ORDER_CANCELLATION_MINUTES} minutes of creation`,
    ).send(res);
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    order.status = 'cancelled';
    order.metadata = {
      ...(order.metadata || {}),
      cancelledAt: new Date(),
      cancellationReason: reason || 'Cancelled by user',
    };
    await order.save({ session });

    const refundAmount = (order.totalPrice || order.amount);
    const wallet = await Wallet.findOne({ user: req.user?._id }).session(session);
    if (wallet) {
      wallet.balance += refundAmount;
      wallet.totalSpent -= refundAmount;
      wallet.lastTransaction = new Date();
      await wallet.save({ session });

      await Transaction.create(
        [{
          user: req.user?._id,
          wallet: wallet._id,
          type: 'refund',
          amount: refundAmount,
          fees: 0,
          netAmount: refundAmount,
          status: 'success',
          description: `Refund for cancelled order ${order.orderId}`,
          reference: order.orderId,
          balanceBefore: wallet.balance - refundAmount,
          balanceAfter: wallet.balance,
        }],
        { session },
      );
    }

    await session.commitTransaction();

    try {
      await Notification.create({
        user: req.user?._id,
        title: 'Order Cancelled',
        message: `Order ${order.orderId} has been cancelled. ₹${refundAmount} refunded.`,
        type: 'order',
        link: `/orders/${order.orderId}`,
      });

      const io = getIO();
      if (io) {
        io.to(req.user?._id?.toString() || '').emit('order:cancelled', {
          order,
          refundAmount,
        });
      }
    } catch {
      // Non-critical
    }

    return new SuccessResponse('Order cancelled successfully', {
      order,
      refundAmount,
    }).send(res);
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});

function mockAssignNumber(country: string, _type: string): string {
  const prefixes: Record<string, string[]> = {
    US: ['+1-201', '+1-202', '+1-212', '+1-213', '+1-310'],
    IN: ['+91-98765', '+91-99887', '+91-77665', '+91-88776', '+91-66554'],
    GB: ['+44-20', '+44-77', '+44-79', '+44-75', '+44-78'],
    default: ['+1-555', '+1-666', '+1-777', '+1-888', '+1-999'],
  };

  const countryPrefixes = prefixes[country] || prefixes.default;
  const prefix = countryPrefixes[Math.floor(Math.random() * countryPrefixes.length)];
  const suffix = Math.floor(100000 + Math.random() * 900000);

  return `${prefix}${suffix}`;
}
