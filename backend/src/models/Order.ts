import mongoose, { Document, Schema } from 'mongoose';
import { generateOrderId } from '@/utils/helpers';

export interface IOrderDocument extends Document {
  orderId: string;
  user: mongoose.Types.ObjectId;
  service: mongoose.Types.ObjectId;
  number?: string;
  country?: string;
  platform?: string;
  amount: number;
  quantity: number;
  totalPrice: number;
  status: 'pending' | 'active' | 'completed' | 'refunded' | 'cancelled' | 'expired';
  otpCode?: string;
  otpReceivedAt?: Date;
  expiryAt?: Date;
  refundedAt?: Date;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrderDocument>(
  {
    orderId: {
      type: String,
      unique: true,
      default: generateOrderId,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    service: {
      type: Schema.Types.ObjectId,
      ref: 'Service',
      required: [true, 'Service is required'],
    },
    number: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
    },
    platform: {
      type: String,
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: 0,
    },
    quantity: {
      type: Number,
      default: 1,
      min: 1,
    },
    totalPrice: {
      type: Number,
      min: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'completed', 'refunded', 'cancelled', 'expired'],
      default: 'pending',
    },
    otpCode: {
      type: String,
    },
    otpReceivedAt: {
      type: Date,
    },
    expiryAt: {
      type: Date,
    },
    refundedAt: {
      type: Date,
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model<IOrderDocument>('Order', orderSchema);
export default Order;
