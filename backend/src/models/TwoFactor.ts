import mongoose, { Document, Schema } from 'mongoose';
import crypto from 'crypto';

export interface ITwoFactor extends Document {
  user: mongoose.Types.ObjectId;
  method: 'app' | 'sms' | 'email';
  secret?: string;
  phoneNumber?: string;
  email?: string;
  isEnabled: boolean;
  isVerified: boolean;
  backupCodes: IBackupCode[];
  trustedDevices: ITrustedDevice[];
  lastVerifiedAt?: Date;
  failedAttempts: number;
  lockedUntil?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBackupCode {
  code: string;
  used: boolean;
  usedAt?: Date;
}

export interface ITrustedDevice {
  deviceId: string;
  userAgent: string;
  ip: string;
  trustedUntil: Date;
  lastUsedAt: Date;
}

const twoFactorSchema = new Schema<ITwoFactor>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    method: { type: String, enum: ['app', 'sms', 'email'], default: 'app' },
    secret: { type: String },
    phoneNumber: { type: String },
    email: { type: String },
    isEnabled: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    backupCodes: [
      {
        code: { type: String, required: true },
        used: { type: Boolean, default: false },
        usedAt: { type: Date },
      },
    ],
    trustedDevices: [
      {
        deviceId: { type: String, required: true },
        userAgent: { type: String, required: true },
        ip: { type: String, required: true },
        trustedUntil: { type: Date, required: true },
        lastUsedAt: { type: Date, default: Date.now },
      },
    ],
    lastVerifiedAt: { type: Date },
    failedAttempts: { type: Number, default: 0 },
    lockedUntil: { type: Date },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

twoFactorSchema.pre('save', function (next) {
  if (this.isNew && !this.secret) {
    this.secret = crypto.randomBytes(20).toString('hex');
    const codes: IBackupCode[] = [];
    for (let i = 0; i < 10; i++) {
      codes.push({
        code: crypto.randomBytes(4).toString('hex').toUpperCase(),
        used: false,
      });
    }
    this.backupCodes = codes;
  }
  next();
});

export default mongoose.model<ITwoFactor>('TwoFactor', twoFactorSchema);
