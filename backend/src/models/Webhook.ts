import mongoose, { Document, Schema } from 'mongoose';

export interface IWebhook extends Document {
  user: mongoose.Types.ObjectId;
  tenant?: mongoose.Types.ObjectId;
  name: string;
  url: string;
  events: string[];
  secret: string;
  status: 'active' | 'paused' | 'failed';
  headers: Record<string, string>;
  retryCount: number;
  maxRetries: number;
  timeout: number;
  lastTriggeredAt?: Date;
  lastSuccessAt?: Date;
  lastFailureAt?: Date;
  lastError?: string;
  consecutiveFailures: number;
  deliveries: IWebhookDelivery[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IWebhookDelivery {
  event: string;
  payload: any;
  status: 'success' | 'failed' | 'retrying';
  responseCode?: number;
  responseBody?: string;
  error?: string;
  attempt: number;
  duration: number;
  deliveredAt: Date;
}

const webhookSchema = new Schema<IWebhook>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    tenant: { type: Schema.Types.ObjectId, ref: 'Tenant' },
    name: { type: String, required: true },
    url: { type: String, required: true },
    events: [{ type: String, required: true }],
    secret: { type: String, required: true },
    status: {
      type: String,
      enum: ['active', 'paused', 'failed'],
      default: 'active',
    },
    headers: { type: Schema.Types.Mixed, default: {} },
    retryCount: { type: Number, default: 0 },
    maxRetries: { type: Number, default: 3 },
    timeout: { type: Number, default: 5000 },
    lastTriggeredAt: { type: Date },
    lastSuccessAt: { type: Date },
    lastFailureAt: { type: Date },
    lastError: { type: String },
    consecutiveFailures: { type: Number, default: 0 },
    deliveries: [
      {
        event: { type: String, required: true },
        payload: { type: Schema.Types.Mixed },
        status: { type: String, enum: ['success', 'failed', 'retrying'] },
        responseCode: { type: Number },
        responseBody: { type: String },
        error: { type: String },
        attempt: { type: Number },
        duration: { type: Number },
        deliveredAt: { type: Date, default: Date.now },
      },
    ],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<IWebhook>('Webhook', webhookSchema);
