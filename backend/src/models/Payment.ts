import mongoose, { Document, Schema } from 'mongoose';
import { generatePaymentId } from '@/utils/helpers';

export interface IPaymentDocument extends Document {
  paymentId: string;
  user: mongoose.Types.ObjectId;
  order: mongoose.Types.ObjectId;
  transaction: mongoose.Types.ObjectId;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  amount: number;
  currency: string;
  status: 'created' | 'attempted' | 'paid' | 'failed' | 'refunded';
  method?: 'upi' | 'card' | 'netbanking' | 'wallet';
  description?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPaymentDocument>(
  {
    paymentId: {
      type: String,
      unique: true,
      default: generatePaymentId,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    order: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      required: [true, 'Order is required'],
    },
    transaction: {
      type: Schema.Types.ObjectId,
      ref: 'Transaction',
    },
    razorpayOrderId: {
      type: String,
    },
    razorpayPaymentId: {
      type: String,
    },
    razorpaySignature: {
      type: String,
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: 0,
    },
    currency: {
      type: String,
      default: 'INR',
      uppercase: true,
    },
    status: {
      type: String,
      enum: ['created', 'attempted', 'paid', 'failed', 'refunded'],
      default: 'created',
    },
    method: {
      type: String,
      enum: ['upi', 'card', 'netbanking', 'wallet'],
    },
    description: {
      type: String,
      trim: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
  },
  { timestamps: true }
);

const Payment = mongoose.model<IPaymentDocument>('Payment', paymentSchema);
export default Payment;
