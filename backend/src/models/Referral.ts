import mongoose, { Document, Schema } from 'mongoose';

export interface IReferral extends Document {
  referrer: mongoose.Types.ObjectId;
  referredUser: mongoose.Types.ObjectId;
  code: string;
  status: 'pending' | 'completed' | 'expired' | 'paid';
  rewardType: 'credit' | 'commission' | 'discount';
  rewardAmount: number;
  rewardCurrency: string;
  commissionRate: number;
  earnedAmount: number;
  paidAmount: number;
  orderCount: number;
  expiresAt?: Date;
  completedAt?: Date;
  metadata: Record<string, any>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IReferralCode extends Document {
  user: mongoose.Types.ObjectId;
  code: string;
  totalReferrals: number;
  totalEarnings: number;
  commissionRate: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const referralSchema = new Schema<IReferral>(
  {
    referrer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    referredUser: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    code: { type: String, required: true, index: true },
    status: {
      type: String,
      enum: ['pending', 'completed', 'expired', 'paid'],
      default: 'pending',
    },
    rewardType: {
      type: String,
      enum: ['credit', 'commission', 'discount'],
      default: 'commission',
    },
    rewardAmount: { type: Number, default: 0 },
    rewardCurrency: { type: String, default: 'INR' },
    commissionRate: { type: Number, default: 10 },
    earnedAmount: { type: Number, default: 0 },
    paidAmount: { type: Number, default: 0 },
    orderCount: { type: Number, default: 0 },
    expiresAt: { type: Date },
    completedAt: { type: Date },
    metadata: { type: Schema.Types.Mixed, default: {} },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const referralCodeSchema = new Schema<IReferralCode>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    code: { type: String, required: true, unique: true, uppercase: true },
    totalReferrals: { type: Number, default: 0 },
    totalEarnings: { type: Number, default: 0 },
    commissionRate: { type: Number, default: 10 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const ReferralCode = mongoose.model<IReferralCode>('ReferralCode', referralCodeSchema);
export default mongoose.model<IReferral>('Referral', referralSchema);
