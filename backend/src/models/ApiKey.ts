import mongoose, { Document, Schema } from 'mongoose';
import crypto from 'crypto';

export interface IApiKey extends Document {
  user: mongoose.Types.ObjectId;
  tenant?: mongoose.Types.ObjectId;
  name: string;
  key: string;
  keyPrefix: string;
  permissions: string[];
  ipWhitelist: string[];
  rateLimitPerMinute: number;
  lastUsedAt?: Date;
  expiresAt?: Date;
  status: 'active' | 'revoked' | 'expired';
  usageCount: number;
  revokedAt?: Date;
  revokedBy?: mongoose.Types.ObjectId;
  metadata: Record<string, any>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const apiKeySchema = new Schema<IApiKey>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    tenant: { type: Schema.Types.ObjectId, ref: 'Tenant' },
    name: { type: String, required: true, trim: true },
    key: { type: String, required: true, unique: true },
    keyPrefix: { type: String, required: true },
    permissions: [{ type: String }],
    ipWhitelist: [{ type: String }],
    rateLimitPerMinute: { type: Number, default: 60 },
    lastUsedAt: { type: Date },
    expiresAt: { type: Date },
    status: {
      type: String,
      enum: ['active', 'revoked', 'expired'],
      default: 'active',
    },
    usageCount: { type: Number, default: 0 },
    revokedAt: { type: Date },
    revokedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    metadata: { type: Schema.Types.Mixed, default: {} },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

apiKeySchema.pre('save', function (next) {
  if (this.isNew) {
    const rawKey = crypto.randomBytes(32).toString('hex');
    this.keyPrefix = rawKey.substring(0, 8);
    this.key = crypto.createHash('sha256').update(rawKey).digest('hex');
  }
  next();
});

apiKeySchema.methods.validateKey = function (rawKey: string): boolean {
  const hash = crypto.createHash('sha256').update(rawKey).digest('hex');
  return hash === this.key;
};

export default mongoose.model<IApiKey>('ApiKey', apiKeySchema);
