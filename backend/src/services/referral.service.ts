import crypto from 'crypto';
import Referral, { ReferralCode } from '@/models/Referral';
import Wallet from '@/models/Wallet';
import { ApiError } from '@/utils/apiResponse';

export const generateReferralCode = async (userId: string) => {
  const existing = await ReferralCode.findOne({ user: userId });
  if (existing) return existing;

  const code = crypto.randomBytes(3).toString('hex').toUpperCase();
  return ReferralCode.create({ user: userId, code });
};

export const getReferralCode = async (userId: string) => {
  return ReferralCode.findOne({ user: userId, isActive: true });
};

export const processReferral = async (referralCode: string, newUserId: string) => {
  const refCode = await ReferralCode.findOne({ code: referralCode, isActive: true });
  if (!refCode) throw new ApiError(400, 'Invalid referral code');
  if (refCode.user.toString() === newUserId) throw new ApiError(400, 'Cannot refer yourself');

  const existing = await Referral.findOne({ referredUser: newUserId });
  if (existing) throw new ApiError(400, 'Already referred');

  const referral = await Referral.create({
    referrer: refCode.user,
    referredUser: newUserId,
    code: referralCode,
    status: 'pending',
    commissionRate: refCode.commissionRate,
  });

  refCode.totalReferrals += 1;
  await refCode.save();

  return referral;
};

export const completeReferral = async (referralId: string, orderAmount: number) => {
  const referral = await Referral.findById(referralId);
  if (!referral || referral.status !== 'pending') return null;

  const commission = (orderAmount * referral.commissionRate) / 100;
  referral.earnedAmount += commission;
  referral.orderCount += 1;
  referral.status = 'completed';
  referral.completedAt = new Date();
  await referral.save();

  const wallet = await Wallet.findOne({ user: referral.referrer });
  if (wallet) {
    wallet.balance += commission;
    wallet.totalDeposited += commission;
    await wallet.save();
  }

  const refCode = await ReferralCode.findOne({ user: referral.referrer });
  if (refCode) {
    refCode.totalEarnings += commission;
    await refCode.save();
  }

  return commission;
};

export const getReferralStats = async (userId: string) => {
  const [refCode, referrals, totalEarned] = await Promise.all([
    ReferralCode.findOne({ user: userId }),
    Referral.find({ referrer: userId }).populate('referredUser', 'name email createdAt'),
    Referral.aggregate([
      { $match: { referrer: userId as any, status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$earnedAmount' } } },
    ]),
  ]);

  return {
    code: refCode?.code,
    commissionRate: refCode?.commissionRate || 10,
    totalReferrals: refCode?.totalReferrals || 0,
    totalEarnings: totalEarned[0]?.total || 0,
    referrals: referrals || [],
  };
};

export const listReferrals = async (query: any) => {
  const { page = 1, limit = 10, status } = query;
  const filter: any = {};
  if (status) filter.status = status;

  const [referrals, total] = await Promise.all([
    Referral.find(filter)
      .populate('referrer', 'name email')
      .populate('referredUser', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Referral.countDocuments(filter),
  ]);

  return {
    data: referrals,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};
