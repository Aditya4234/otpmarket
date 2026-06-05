import mongoose, { Document, Schema } from 'mongoose';

export interface ISubscription extends Document {
  tenant: mongoose.Types.ObjectId;
  plan: 'free' | 'starter' | 'professional' | 'enterprise';
  status: 'active' | 'past_due' | 'cancelled' | 'expired' | 'trial';
  billingCycle: 'monthly' | 'yearly';
  amount: number;
  currency: string;
  startDate: Date;
  endDate: Date;
  trialEndsAt?: Date;
  cancelledAt?: Date;
  paymentMethod: 'razorpay' | 'stripe' | 'paypal' | 'bank_transfer';
  paymentGatewaySubscriptionId?: string;
  paymentGatewayCustomerId?: string;
  invoices: IInvoice[];
  lastPaymentDate?: Date;
  nextBillingDate?: Date;
  features: string[];
  metadata: Record<string, any>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IInvoice extends Document {
  subscription: mongoose.Types.ObjectId;
  tenant: mongoose.Types.ObjectId;
  invoiceNumber: string;
  amount: number;
  currency: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled' | 'refunded';
  paymentMethod?: string;
  paymentGatewayInvoiceId?: string;
  paidAt?: Date;
  dueDate: Date;
  lineItems: {
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  taxAmount: number;
  totalAmount: number;
  pdfUrl?: string;
  notes?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const invoiceSchema = new Schema<IInvoice>(
  {
    subscription: { type: Schema.Types.ObjectId, ref: 'Subscription', required: true },
    tenant: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
    invoiceNumber: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    status: {
      type: String,
      enum: ['draft', 'sent', 'paid', 'overdue', 'cancelled', 'refunded'],
      default: 'draft',
    },
    paymentMethod: { type: String },
    paymentGatewayInvoiceId: { type: String },
    paidAt: { type: Date },
    dueDate: { type: Date, required: true },
    lineItems: [
      {
        description: { type: String, required: true },
        quantity: { type: Number, required: true },
        unitPrice: { type: Number, required: true },
        total: { type: Number, required: true },
      },
    ],
    taxAmount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    pdfUrl: { type: String },
    notes: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const subscriptionSchema = new Schema<ISubscription>(
  {
    tenant: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true, unique: true },
    plan: {
      type: String,
      enum: ['free', 'starter', 'professional', 'enterprise'],
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'past_due', 'cancelled', 'expired', 'trial'],
      default: 'trial',
    },
    billingCycle: { type: String, enum: ['monthly', 'yearly'], default: 'monthly' },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    trialEndsAt: { type: Date },
    cancelledAt: { type: Date },
    paymentMethod: {
      type: String,
      enum: ['razorpay', 'stripe', 'paypal', 'bank_transfer'],
    },
    paymentGatewaySubscriptionId: { type: String },
    paymentGatewayCustomerId: { type: String },
    invoices: [invoiceSchema],
    lastPaymentDate: { type: Date },
    nextBillingDate: { type: Date },
    features: [{ type: String }],
    metadata: { type: Schema.Types.Mixed, default: {} },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Invoice = mongoose.model<IInvoice>('Invoice', invoiceSchema);
export default mongoose.model<ISubscription>('Subscription', subscriptionSchema);
