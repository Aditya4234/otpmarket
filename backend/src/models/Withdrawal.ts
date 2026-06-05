import mongoose, { Document, Schema } from 'mongoose';
import { generateWithdrawalId } from '@/utils/helpers';

export interface IWithdrawalDocument extends Document {
  withdrawalId: string;
  user: mongoose.Types.ObjectId;
  wallet: mongoose.Types.ObjectId;
  amount: number;
  fees: number;
  netAmount: number;
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';
  paymentMethod: 'bank' | 'upi' | 'usdt';
  accountDetails:
    | { bankName: string; accountNumber: string; ifscCode: string; accountHolderName: string }
    | { upiId: string }
    | { usdtAddress: string };
  adminNote?: string;
  processedBy?: mongoose.Types.ObjectId;
  processedAt?: Date;
  rejectedReason?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const withdrawalSchema = new Schema<IWithdrawalDocument>(
  {
    withdrawalId: {
      type: String,
      unique: true,
      default: generateWithdrawalId,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    wallet: {
      type: Schema.Types.ObjectId,
      ref: 'Wallet',
      required: [true, 'Wallet is required'],
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: 0,
    },
    fees: {
      type: Number,
      default: 0,
      min: 0,
    },
    netAmount: {
      type: Number,
      required: [true, 'Net amount is required'],
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'completed', 'cancelled'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: ['bank', 'upi', 'usdt'],
      required: [true, 'Payment method is required'],
    },
    accountDetails: {
      type: Schema.Types.Mixed,
      required: [true, 'Account details are required'],
    },
    adminNote: {
      type: String,
      trim: true,
    },
    processedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    processedAt: {
      type: Date,
    },
    rejectedReason: {
      type: String,
      trim: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
  },
  { timestamps: true }
);

const Withdrawal = mongoose.model<IWithdrawalDocument>('Withdrawal', withdrawalSchema);
export default Withdrawal;
