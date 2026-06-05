import mongoose, { Document, Schema } from 'mongoose';

export interface ITransactionDocument extends Document {
  user: mongoose.Types.ObjectId;
  wallet: mongoose.Types.ObjectId;
  type: 'deposit' | 'withdrawal' | 'purchase' | 'refund' | 'commission' | 'admin_adjustment';
  amount: number;
  fees: number;
  netAmount: number;
  currency: string;
  status: 'pending' | 'success' | 'failed' | 'refunded';
  description: string;
  reference?: string;
  balanceBefore: number;
  balanceAfter: number;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const transactionSchema = new Schema<ITransactionDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    wallet: {
      type: Schema.Types.ObjectId,
      ref: 'Wallet',
      required: true,
    },
    type: {
      type: String,
      enum: ['deposit', 'withdrawal', 'purchase', 'refund', 'commission', 'admin_adjustment'],
      required: [true, 'Transaction type is required'],
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
    currency: {
      type: String,
      default: 'INR',
      uppercase: true,
    },
    status: {
      type: String,
      enum: ['pending', 'success', 'failed', 'refunded'],
      default: 'pending',
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    reference: {
      type: String,
      index: true,
    },
    balanceBefore: {
      type: Number,
      required: true,
    },
    balanceAfter: {
      type: Number,
      required: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
  },
  { timestamps: true }
);

transactionSchema.index({ user: 1, createdAt: -1 });

const Transaction = mongoose.model<ITransactionDocument>('Transaction', transactionSchema);
export default Transaction;
