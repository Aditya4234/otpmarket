import mongoose, { Document, Schema } from 'mongoose';

export interface IActivityLog extends Document {
  user?: mongoose.Types.ObjectId;
  tenant?: mongoose.Types.ObjectId;
  action: string;
  resource: string;
  resourceId?: string;
  description: string;
  details?: any;
  ip: string;
  userAgent: string;
  sessionId?: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  status: 'success' | 'failure' | 'pending';
  duration?: number;
  location?: {
    country: string;
    city: string;
    coordinates: [number, number];
  };
  metadata: Record<string, any>;
  createdAt: Date;
}

const activityLogSchema = new Schema<IActivityLog>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    tenant: { type: Schema.Types.ObjectId, ref: 'Tenant', index: true },
    action: { type: String, required: true, index: true },
    resource: { type: String, required: true },
    resourceId: { type: String, index: true },
    description: { type: String, required: true },
    details: { type: Schema.Types.Mixed },
    ip: { type: String, required: true },
    userAgent: { type: String, default: '' },
    sessionId: { type: String },
    severity: {
      type: String,
      enum: ['info', 'warning', 'error', 'critical'],
      default: 'info',
    },
    status: {
      type: String,
      enum: ['success', 'failure', 'pending'],
      default: 'success',
    },
    duration: { type: Number },
    location: {
      country: { type: String },
      city: { type: String },
      coordinates: { type: [Number] },
    },
    metadata: { type: Schema.Types.Mixed, default: {} },
    createdAt: { type: Date, default: Date.now, index: true },
  },
  { timestamps: false }
);

activityLogSchema.index({ createdAt: -1 });
activityLogSchema.index({ user: 1, createdAt: -1 });
activityLogSchema.index({ tenant: 1, createdAt: -1 });
activityLogSchema.index({ action: 1, createdAt: -1 });

export default mongoose.model<IActivityLog>('ActivityLog', activityLogSchema);
