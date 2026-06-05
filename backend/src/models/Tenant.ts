import mongoose, { Document, Schema } from 'mongoose';

export interface ITenant extends Document {
  name: string;
  slug: string;
  domain?: string;
  logo?: string;
  favicon?: string;
  primaryColor: string;
  secondaryColor: string;
  plan: 'free' | 'starter' | 'professional' | 'enterprise';
  status: 'active' | 'suspended' | 'cancelled';
  features: string[];
  maxUsers: number;
  maxAgents: number;
  storageLimit: number;
  contactEmail: string;
  contactPhone?: string;
  address?: string;
  subscription?: mongoose.Types.ObjectId;
  settings: Record<string, any>;
  createdBy: mongoose.Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const tenantSchema = new Schema<ITenant>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    domain: { type: String, unique: true, sparse: true },
    logo: { type: String },
    favicon: { type: String },
    primaryColor: { type: String, default: '#3b82f6' },
    secondaryColor: { type: String, default: '#8b5cf6' },
    plan: {
      type: String,
      enum: ['free', 'starter', 'professional', 'enterprise'],
      default: 'free',
    },
    status: {
      type: String,
      enum: ['active', 'suspended', 'cancelled'],
      default: 'active',
    },
    features: [{ type: String }],
    maxUsers: { type: Number, default: 10 },
    maxAgents: { type: Number, default: 5 },
    storageLimit: { type: Number, default: 100 },
    contactEmail: { type: String, required: true },
    contactPhone: { type: String },
    address: { type: String },
    subscription: { type: Schema.Types.ObjectId, ref: 'Subscription' },
    settings: { type: Schema.Types.Mixed, default: {} },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<ITenant>('Tenant', tenantSchema);
