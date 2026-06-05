import { Response } from 'express';
import mongoose from 'mongoose';
import Wallet from '@/models/Wallet';
import Transaction from '@/models/Transaction';
import Withdrawal from '@/models/Withdrawal';
import Payment from '@/models/Payment';
import { AuthRequest } from '@/types';
import { asyncHandler } from '@/utils/asyncHandler';
import {
  SuccessResponse,
  NotFoundResponse,
  BadRequestResponse,
} from '@/utils/apiResponse';
import { createRazorpayOrder, verifyRazorpaySignature } from '@/services/razorpay.service';
import { buildPaginationQuery, generatePaymentId } from '@/utils/helpers';

export const getWallet = asyncHandler(async (req: AuthRequest, res: Response) => {
  const wallet = await Wallet.findOne({ user: req.user?._id });
  if (!wallet) {
    return new NotFoundResponse('Wallet not found').send(res);
  }

  const [totalTransactions, totalDeposits, totalWithdrawals, recentTransactions] =
    await Promise.all([
      Transaction.countDocuments({ user: req.user?._id }),
      Transaction.aggregate([
        {
          $match: {
            user: req.user?._id,
            type: 'deposit',
            status: 'success',
          },
        },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      Transaction.aggregate([
        {
          $match: {
            user: req.user?._id,
            type: 'withdrawal',
            status: 'success',
          },
        },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      Transaction.find({ user: req.user?._id })
        .sort({ createdAt: -1 })
        .limit(10)
        .lean(),
    ]);

  return new SuccessResponse('Wallet fetched successfully', {
    wallet,
    stats: {
      totalTransactions,
      totalDeposited: totalDeposits[0]?.total || 0,
      totalWithdrawn: totalWithdrawals[0]?.total || 0,
    },
    recentTransactions,
  }).send(res);
});

export const addMoney = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { amount } = req.body;

  const wallet = await Wallet.findOne({ user: req.user?._id });
  if (!wallet) {
    return new NotFoundResponse('Wallet not found').send(res);
  }

  if (wallet.isFrozen) {
    return new BadRequestResponse('Your wallet is frozen. Please contact support.').send(res);
  }

  const razorpayOrder = await createRazorpayOrder({
    amount: Math.round(amount * 100),
    currency: 'INR',
    receipt: generatePaymentId(),
    notes: {
      userId: req.user?._id?.toString() || '',
      walletId: wallet._id.toString(),
    },
  });

  const payment = await Payment.create({
    paymentId: generatePaymentId(),
    user: req.user?._id,
    order: null,
    razorpayOrderId: razorpayOrder.id,
    amount,
    currency: 'INR',
    status: 'created',
    description: `Wallet deposit of ₹${amount}`,
    metadata: {
      walletId: wallet._id,
    },
  });

  const transaction = await Transaction.create({
    user: req.user?._id,
    wallet: wallet._id,
    type: 'deposit',
    amount,
    fees: 0,
    netAmount: amount,
    status: 'pending',
    description: `Wallet deposit of ₹${amount}`,
    reference: payment.paymentId,
    balanceBefore: wallet.balance,
    balanceAfter: wallet.balance,
  });

  payment.transaction = transaction._id;
  await payment.save();

  return new SuccessResponse('Payment order created successfully', {
    razorpayOrderId: razorpayOrder.id,
    razorpayKeyId: process.env.RAZORPAY_KEY_ID,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
    paymentId: payment.paymentId,
  }).send(res);
});

export const verifyPayment = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    return new BadRequestResponse('Missing payment verification details').send(res);
  }

  const isValid = verifyRazorpaySignature({
    orderId: razorpayOrderId,
    paymentId: razorpayPaymentId,
    signature: razorpaySignature,
  });

  if (!isValid) {
    return new BadRequestResponse('Payment verification failed. Invalid signature.').send(res);
  }

  const payment = await Payment.findOne({ razorpayOrderId });
  if (!payment) {
    return new NotFoundResponse('Payment record not found').send(res);
  }

  if (payment.status === 'paid') {
    return new BadRequestResponse('Payment has already been verified').send(res);
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    payment.razorpayPaymentId = razorpayPaymentId;
    payment.razorpaySignature = razorpaySignature;
    payment.status = 'paid';
    payment.method = req.body.method || 'upi';
    await payment.save({ session });

    const wallet = await Wallet.findOne({ user: req.user?._id }).session(session);
    if (!wallet) {
      throw new Error('Wallet not found');
    }

    wallet.balance += payment.amount;
    wallet.totalDeposited += payment.amount;
    wallet.lastTransaction = new Date();
    await wallet.save({ session });

    const transaction = await Transaction.findById(payment.transaction).session(session);
    if (transaction) {
      transaction.status = 'success';
      transaction.balanceAfter = wallet.balance;
      transaction.metadata = {
        ...(transaction.metadata || {}),
        razorpayPaymentId,
        razorpaySignature,
      };
      await transaction.save({ session });
    }

    await session.commitTransaction();

    return new SuccessResponse('Payment verified and wallet credited successfully', {
      balance: wallet.balance,
      amount: payment.amount,
      transactionId: payment.transaction,
    }).send(res);
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});

export const getTransactions = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?._id;
  const { page, limit, skip, sort } = buildPaginationQuery(req.query as any);

  const filter: Record<string, unknown> = { user: userId };

  if (req.query.type) {
    filter.type = req.query.type;
  }

  if (req.query.status) {
    filter.status = req.query.status;
  }

  if (req.query.startDate && req.query.endDate) {
    filter.createdAt = {
      $gte: new Date(req.query.startDate as string),
      $lte: new Date(req.query.endDate as string),
    };
  }

  const [total, transactions] = await Promise.all([
    Transaction.countDocuments(filter),
    Transaction.find(filter).sort(sort).skip(skip).limit(limit).lean(),
  ]);

  const totalPages = Math.ceil(total / limit);

  return new SuccessResponse('Transactions fetched successfully', transactions, {
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

  const fee = Math.round(amount * 0.02 * 100) / 100;
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
    description: `Withdrawal request of ₹${amount} via ${paymentMethod.toUpperCase()}`,
    reference: withdrawal.withdrawalId,
    balanceBefore: wallet.balance + amount,
    balanceAfter: wallet.balance,
  });

  return new SuccessResponse('Withdrawal request submitted successfully', withdrawal).send(res);
});

export const getWithdrawals = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?._id;
  const { page, limit, skip, sort } = buildPaginationQuery(req.query as any);

  const filter: Record<string, unknown> = { user: userId };

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

export const cancelWithdrawal = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const withdrawal = await Withdrawal.findOne({
    _id: id,
    user: req.user?._id,
    status: 'pending',
  });

  if (!withdrawal) {
    return new NotFoundResponse('Withdrawal request not found or cannot be cancelled').send(res);
  }

  const wallet = await Wallet.findOne({ user: req.user?._id });
  if (!wallet) {
    return new NotFoundResponse('Wallet not found').send(res);
  }

  withdrawal.status = 'cancelled';
  await withdrawal.save();

  wallet.balance += withdrawal.amount;
  wallet.totalWithdrawn -= withdrawal.amount;
  wallet.lastTransaction = new Date();
  await wallet.save();

  return new SuccessResponse('Withdrawal request cancelled successfully', {
    withdrawal,
    balance: wallet.balance,
  }).send(res);
});
