import { Response } from 'express';
import Wallet from '@/models/Wallet';
import Order from '@/models/Order';
import Withdrawal from '@/models/Withdrawal';
import Transaction from '@/models/Transaction';
import { AuthRequest } from '@/types';
import { asyncHandler } from '@/utils/asyncHandler';
import {
  SuccessResponse,
  NotFoundResponse,
  BadRequestResponse,
  CreatedResponse,
} from '@/utils/apiResponse';
import { buildPaginationQuery } from '@/utils/helpers';

export const getDashboard = asyncHandler(async (req: AuthRequest, res: Response) => {
  const agentId = req.user?._id;

  const [wallet, orderStats, recentOrders, pendingWithdrawals] = await Promise.all([
    Wallet.findOne({ user: agentId }),
    Order.aggregate([
      { $match: { user: agentId } },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          completedOrders: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] },
          },
          activeOrders: {
            $sum: { $cond: [{ $in: ['$status', ['pending', 'active']] }, 1, 0] },
          },
          cancelledOrders: {
            $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] },
          },
          totalEarned: {
            $sum: {
              $cond: [{ $eq: ['$status', 'completed'] }, '$amount', 0],
            },
          },
        },
      },
    ]),
    Order.find({ user: agentId })
      .populate('service', 'name slug type')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(),
    Withdrawal.countDocuments({ user: agentId, status: 'pending' }),
  ]);

  const stats = orderStats[0] || {
    totalOrders: 0,
    completedOrders: 0,
    activeOrders: 0,
    cancelledOrders: 0,
    totalEarned: 0,
  };

  return new SuccessResponse('Agent dashboard fetched successfully', {
    wallet,
    stats,
    recentOrders,
    pendingWithdrawals,
  }).send(res);
});

export const getNumbers = asyncHandler(async (req: AuthRequest, res: Response) => {
  const agentId = req.user?._id;

  const { page, limit, skip, sort } = buildPaginationQuery(req.query as any);

  const filter: Record<string, unknown> = { user: agentId, number: { $exists: true, $ne: null } };

  if (req.query.status) {
    filter.status = req.query.status;
  }

  if (req.query.country) {
    filter.country = { $regex: req.query.country as string, $options: 'i' };
  }

  const [total, numbers] = await Promise.all([
    Order.countDocuments(filter),
    Order.find(filter)
      .populate('service', 'name slug type price')
      .select('orderId number country platform service status otpCode otpReceivedAt createdAt expiryAt')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
  ]);

  const activeCount = await Order.countDocuments({
    user: agentId,
    status: 'active',
    number: { $exists: true, $ne: null },
  });

  const totalPages = Math.ceil(total / limit);

  return new SuccessResponse('Numbers fetched successfully', numbers, {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
    activeCount,
  }).send(res);
});

export const updateNumberStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { orderId } = req.params;
  const { status } = req.body;

  const order = await Order.findOne({ orderId, user: req.user?._id });
  if (!order) {
    return new NotFoundResponse('Order not found').send(res);
  }

  const validStatuses = ['active', 'completed', 'expired'];
  if (!validStatuses.includes(status)) {
    return new BadRequestResponse(`Status must be one of: ${validStatuses.join(', ')}`).send(res);
  }

  const validTransitions: Record<string, string[]> = {
    active: ['completed', 'expired'],
    pending: ['active', 'completed', 'expired'],
  };

  if (validTransitions[order.status] && !validTransitions[order.status].includes(status)) {
    return new BadRequestResponse(
      `Cannot transition from "${order.status}" to "${status}". Allowed: ${validTransitions[order.status].join(', ')}`,
    ).send(res);
  }

  order.status = status as any;
  if (status === 'completed') {
    order.metadata = {
      ...(order.metadata || {}),
      completedAt: new Date(),
    };
  }
  await order.save();

  return new SuccessResponse('Number status updated successfully', order).send(res);
});

export const getEarnings = asyncHandler(async (req: AuthRequest, res: Response) => {
  const agentId = req.user?._id;
  const { page, limit, skip, sort } = buildPaginationQuery(req.query as any);

  const filter: Record<string, unknown> = {
    user: agentId,
    type: { $in: ['commission', 'purchase'] },
    status: 'success',
  };

  if (req.query.startDate && req.query.endDate) {
    filter.createdAt = {
      $gte: new Date(req.query.startDate as string),
      $lte: new Date(req.query.endDate as string),
    };
  }

  const [total, earnings] = await Promise.all([
    Transaction.countDocuments(filter),
    Transaction.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
  ]);

  const totals = await Transaction.aggregate([
    {
      $match: {
        user: agentId,
        type: { $in: ['commission', 'purchase'] },
        status: 'success',
      },
    },
    {
      $group: {
        _id: '$type',
        totalAmount: { $sum: '$amount' },
        totalFees: { $sum: '$fees' },
        count: { $sum: 1 },
      },
    },
  ]);

  const totalEarned = totals.reduce((acc, t) => acc + t.totalAmount, 0);
  const totalPages = Math.ceil(total / limit);

  return new SuccessResponse('Earnings fetched successfully', earnings, {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
    summary: {
      totalEarned,
      breakdown: totals,
    },
  }).send(res);
});

export const getWithdrawals = asyncHandler(async (req: AuthRequest, res: Response) => {
  const agentId = req.user?._id;
  const { page, limit, skip, sort } = buildPaginationQuery(req.query as any);

  const filter: Record<string, unknown> = { user: agentId };

  if (req.query.status) {
    filter.status = req.query.status;
  }

  const [total, withdrawals] = await Promise.all([
    Withdrawal.countDocuments(filter),
    Withdrawal.find(filter).sort(sort).skip(skip).limit(limit).lean(),
  ]);

  const totalPages = Math.ceil(total / limit);

  return new SuccessResponse('Withdrawals fetched successfully', withdrawals, {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  }).send(res);
});

export const requestWithdrawal = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { amount, paymentMethod, accountDetails } = req.body;

  const wallet = await Wallet.findOne({ user: req.user?._id });
  if (!wallet) {
    return new NotFoundResponse('Wallet not found').send(res);
  }

  if (wallet.isFrozen) {
    return new BadRequestResponse('Your wallet is frozen. Please contact support.').send(res);
  }

  if (amount > wallet.balance) {
    return new BadRequestResponse('Insufficient wallet balance').send(res);
  }

  const fee = Math.round(amount * 0.01 * 100) / 100;
  const netAmount = amount - fee;

  const withdrawal = await Withdrawal.create({
    user: req.user?._id,
    wallet: wallet._id,
    amount,
    fees: fee,
    netAmount,
    paymentMethod,
    accountDetails:
      paymentMethod === 'bank'
        ? accountDetails.bank
        : paymentMethod === 'upi'
          ? accountDetails.upi
          : accountDetails.usdt,
  });

  wallet.balance -= amount;
  wallet.totalWithdrawn += amount;
  wallet.lastTransaction = new Date();
  await wallet.save();

  await Transaction.create({
    user: req.user?._id,
    wallet: wallet._id,
    type: 'withdrawal',
    amount,
    fees: fee,
    netAmount: -netAmount,
    status: 'pending',
    description: `Withdrawal request of ₹${amount} (Agent)`,
    reference: withdrawal.withdrawalId,
    balanceBefore: wallet.balance + amount,
    balanceAfter: wallet.balance,
  });

  return new CreatedResponse('Withdrawal request submitted successfully', withdrawal).send(res);
});

export const getOTPLogs = asyncHandler(async (req: AuthRequest, res: Response) => {
  const agentId = req.user?._id;
  const { page, limit, skip, sort } = buildPaginationQuery(req.query as any);

  const filter: Record<string, unknown> = {
    user: agentId,
    otpCode: { $exists: true, $ne: null },
  };

  if (req.query.status) {
    filter.status = req.query.status;
  }

  if (req.query.startDate && req.query.endDate) {
    filter.createdAt = {
      $gte: new Date(req.query.startDate as string),
      $lte: new Date(req.query.endDate as string),
    };
  }

  const [total, otpLogs] = await Promise.all([
    Order.countDocuments(filter),
    Order.find(filter)
      .populate('service', 'name slug type')
      .select('orderId number country platform service status otpCode otpReceivedAt createdAt')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
  ]);

  const totalPages = Math.ceil(total / limit);

  return new SuccessResponse('OTP logs fetched successfully', otpLogs, {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  }).send(res);
});
