import crypto from 'crypto';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import TwoFactor from '@/models/TwoFactor';
import { ApiError } from '@/utils/apiResponse';

export const generateTwoFactorSecret = async (userId: string) => {
  const secret = speakeasy.generateSecret({
    name: `OTPMart:${userId}`,
    length: 20,
  });

  await TwoFactor.findOneAndUpdate(
    { user: userId },
    {
      user: userId,
      secret: secret.base32,
      method: 'app',
      isEnabled: false,
      isVerified: false,
    },
    { upsert: true, new: true }
  );

  const qrCode = await QRCode.toDataURL(secret.otpauth_url!);

  return {
    secret: secret.base32,
    qrCode,
    otpauthUrl: secret.otpauth_url,
  };
};

export const verifyAndEnable2FA = async (userId: string, token: string) => {
  const twoFactor = await TwoFactor.findOne({ user: userId });
  if (!twoFactor || !twoFactor.secret) throw new ApiError(400, '2FA not initialized');

  const verified = speakeasy.totp.verify({
    secret: twoFactor.secret,
    encoding: 'base32',
    token,
    window: 2,
  });

  if (!verified) throw new ApiError(400, 'Invalid verification code');

  twoFactor.isEnabled = true;
  twoFactor.isVerified = true;
  await twoFactor.save();

  return { message: '2FA enabled successfully', backupCodes: twoFactor.backupCodes };
};

export const verifyTwoFactorToken = async (userId: string, token: string): Promise<boolean> => {
  const twoFactor = await TwoFactor.findOne({ user: userId });
  if (!twoFactor || !twoFactor.isEnabled) return true;

  if (twoFactor.lockedUntil && twoFactor.lockedUntil > new Date()) {
    throw new ApiError(429, 'Too many attempts. Try again later.');
  }

  let verified = false;

  if (twoFactor.method === 'app' && twoFactor.secret) {
    verified = speakeasy.totp.verify({
      secret: twoFactor.secret,
      encoding: 'base32',
      token,
      window: 2,
    });
  }

  if (!verified) {
    verified = twoFactor.backupCodes.some(
      (bc) => bc.code === token && !bc.used
    );
    if (verified) {
      const code = twoFactor.backupCodes.find((bc) => bc.code === token);
      if (code) {
        code.used = true;
        code.usedAt = new Date();
      }
    }
  }

  if (verified) {
    twoFactor.failedAttempts = 0;
    twoFactor.lastVerifiedAt = new Date();
    await twoFactor.save();
    return true;
  }

  twoFactor.failedAttempts += 1;
  if (twoFactor.failedAttempts >= 5) {
    twoFactor.lockedUntil = new Date(Date.now() + 30 * 60 * 1000);
    twoFactor.failedAttempts = 0;
  }
  await twoFactor.save();

  return false;
};

export const disableTwoFactor = async (userId: string, token: string) => {
  const verified = await verifyTwoFactorToken(userId, token);
  if (!verified) throw new ApiError(400, 'Invalid verification code');

  await TwoFactor.findOneAndUpdate(
    { user: userId },
    { isEnabled: false, isVerified: false, secret: null }
  );

  return { message: '2FA disabled successfully' };
};

export const getTwoFactorStatus = async (userId: string) => {
  const twoFactor = await TwoFactor.findOne({ user: userId });
  return {
    isEnabled: twoFactor?.isEnabled || false,
    method: twoFactor?.method || null,
    isVerified: twoFactor?.isVerified || false,
  };
};

export const generateBackupCodes = async (userId: string) => {
  const codes = Array.from({ length: 10 }, () =>
    crypto.randomBytes(4).toString('hex').toUpperCase()
  );

  await TwoFactor.findOneAndUpdate(
    { user: userId },
    {
      backupCodes: codes.map((code) => ({ code, used: false })),
    }
  );

  return codes;
};
