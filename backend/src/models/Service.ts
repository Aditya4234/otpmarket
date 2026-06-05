import mongoose, { Document, Schema } from 'mongoose';

export interface IServiceDocument extends Document {
  name: string;
  slug: string;
  category: mongoose.Types.ObjectId;
  description?: string;
  price: number;
  originalPrice?: number;
  country: string;
  countryCode: string;
  provider: string;
  minAmount?: number;
  maxAmount?: number;
  type: 'sms' | 'voice' | 'whatsapp';
  isActive: boolean;
  isAvailable: boolean;
  images: { url: string; publicId: string }[];
  processingTime?: string;
  successRate?: number;
  refundPolicy?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const serviceSchema = new Schema<IServiceDocument>(
  {
    name: {
      type: String,
      required: [true, 'Service name is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Service slug is required'],
      unique: true,
      lowercase: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
    },
    originalPrice: {
      type: Number,
      min: 0,
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true,
    },
    countryCode: {
      type: String,
      required: [true, 'Country code is required'],
      trim: true,
    },
    provider: {
      type: String,
      required: [true, 'Provider is required'],
      trim: true,
    },
    minAmount: {
      type: Number,
      min: 0,
    },
    maxAmount: {
      type: Number,
      min: 0,
    },
    type: {
      type: String,
      enum: ['sms', 'voice', 'whatsapp'],
      required: [true, 'Service type is required'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
      },
    ],
    processingTime: {
      type: String,
    },
    successRate: {
      type: Number,
      min: 0,
      max: 100,
    },
    refundPolicy: {
      type: String,
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
  },
  { timestamps: true }
);

const Service = mongoose.model<IServiceDocument>('Service', serviceSchema);
export default Service;
