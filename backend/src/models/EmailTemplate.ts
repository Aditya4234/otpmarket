import mongoose, { Document, Schema } from 'mongoose';

export interface IEmailTemplate extends Document {
  tenant?: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  category: 'auth' | 'order' | 'payment' | 'notification' | 'marketing' | 'kyc' | 'support';
  subject: string;
  body: string;
  htmlBody: string;
  variables: string[];
  design: {
    headerColor: string;
    footerColor: string;
    buttonColor: string;
    logoUrl?: string;
    footerText: string;
  };
  isDefault: boolean;
  isEditable: boolean;
  version: number;
  status: 'active' | 'draft' | 'archived';
  lastTestedAt?: Date;
  metadata: Record<string, any>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const emailTemplateSchema = new Schema<IEmailTemplate>(
  {
    tenant: { type: Schema.Types.ObjectId, ref: 'Tenant' },
    name: { type: String, required: true },
    slug: { type: String, required: true },
    category: {
      type: String,
      enum: ['auth', 'order', 'payment', 'notification', 'marketing', 'kyc', 'support'],
      required: true,
    },
    subject: { type: String, required: true },
    body: { type: String, required: true },
    htmlBody: { type: String, required: true },
    variables: [{ type: String }],
    design: {
      headerColor: { type: String, default: '#3b82f6' },
      footerColor: { type: String, default: '#1e293b' },
      buttonColor: { type: String, default: '#3b82f6' },
      logoUrl: { type: String },
      footerText: { type: String, default: '© {{year}} OTPMart. All rights reserved.' },
    },
    isDefault: { type: Boolean, default: false },
    isEditable: { type: Boolean, default: true },
    version: { type: Number, default: 1 },
    status: { type: String, enum: ['active', 'draft', 'archived'], default: 'active' },
    lastTestedAt: { type: Date },
    metadata: { type: Schema.Types.Mixed, default: {} },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<IEmailTemplate>('EmailTemplate', emailTemplateSchema);
