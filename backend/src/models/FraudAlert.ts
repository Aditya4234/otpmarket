import mongoose, { Document, Schema } from 'mongoose';

export interface IFraudAlert extends Document {
  user?: mongoose.Types.ObjectId;
  tenant?: mongoose.Types.ObjectId;
  type: 'login_anomaly' | 'payment_fraud' | 'order_abuse' | 'api_abuse' | 'account_takeover' | 'identity_fraud' | 'chargeback' | 'suspicious_activity';
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'investigating' | 'resolved' | 'false_positive';
  ruleName: string;
  description: string;
  evidence: any;
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
  amount?: number;
  currency?: string;
  riskScore: number;
  affectedResource?: string;
  affectedResourceId?: string;
  assignedTo?: mongoose.Types.ObjectId;
  resolvedBy?: mongoose.Types.ObjectId;
  resolvedAt?: Date;
  resolution?: string;
  metadata: Record<string, any>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const fraudAlertSchema = new Schema<IFraudAlert>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    tenant: { type: Schema.Types.ObjectId, ref: 'Tenant', index: true },
    type: {
      type: String,
      enum: [
        'login_anomaly', 'payment_fraud', 'order_abuse', 'api_abuse',
        'account_takeover', 'identity_fraud', 'chargeback', 'suspicious_activity',
      ],
      required: true,
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      required: true,
    },
    status: {
      type: String,
      enum: ['open', 'investigating', 'resolved', 'false_positive'],
      default: 'open',
    },
    ruleName: { type: String, required: true },
    description: { type: String, required: true },
    evidence: { type: Schema.Types.Mixed },
    ipAddress: { type: String },
    userAgent: { type: String },
    sessionId: { type: String },
    amount: { type: Number },
    currency: { type: String },
    riskScore: { type: Number, default: 0, min: 0, max: 100 },
    affectedResource: { type: String },
    affectedResourceId: { type: String },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
    resolvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    resolvedAt: { type: Date },
    resolution: { type: String },
    metadata: { type: Schema.Types.Mixed, default: {} },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

fraudAlertSchema.index({ status: 1, severity: 1 });
fraudAlertSchema.index({ createdAt: -1 });
fraudAlertSchema.index({ user: 1, type: 1 });

export default mongoose.model<IFraudAlert>('FraudAlert', fraudAlertSchema);
