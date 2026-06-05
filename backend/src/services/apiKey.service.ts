import crypto from 'crypto';
import ApiKey from '@/models/ApiKey';
import { ApiError } from '@/utils/apiResponse';

export const createApiKey = async (userId: string, data: any) => {
  const rawKey = `otp_${crypto.randomBytes(32).toString('hex')}`;
  const keyPrefix = rawKey.substring(0, 12);

  const apiKey = await ApiKey.create({
    user: userId,
    tenant: data.tenantId,
    name: data.name,
    key: crypto.createHash('sha256').update(rawKey).digest('hex'),
    keyPrefix,
    permissions: data.permissions || ['read'],
    ipWhitelist: data.ipWhitelist || [],
    rateLimitPerMinute: data.rateLimitPerMinute || 60,
    expiresAt: data.expiresAt,
  });

  return { apiKey: apiKey.toObject(), rawKey };
};

export const validateApiKey = async (rawKey: string): Promise<any> => {
  const hash = crypto.createHash('sha256').update(rawKey).digest('hex');
  const apiKey = await ApiKey.findOne({ key: hash, isActive: true });

  if (!apiKey) return null;
  if (apiKey.status !== 'active') return null;
  if (apiKey.expiresAt && apiKey.expiresAt < new Date()) {
    apiKey.status = 'expired';
    await apiKey.save();
    return null;
  }

  apiKey.lastUsedAt = new Date();
  apiKey.usageCount += 1;
  await apiKey.save();

  return {
    userId: apiKey.user,
    tenantId: apiKey.tenant,
    permissions: apiKey.permissions,
  };
};

export const listApiKeys = async (userId: string) => {
  return ApiKey.find({ user: userId, isActive: true }).select('-key');
};

export const revokeApiKey = async (keyId: string, userId: string) => {
  const apiKey = await ApiKey.findOneAndUpdate(
    { _id: keyId, user: userId },
    { status: 'revoked', revokedAt: new Date(), revokedBy: userId as any },
    { new: true }
  );
  if (!apiKey) throw new ApiError(404, 'API key not found');
  return apiKey;
};

export const updateApiKey = async (keyId: string, userId: string, data: any) => {
  const apiKey = await ApiKey.findOneAndUpdate(
    { _id: keyId, user: userId },
    { $set: data },
    { new: true }
  ).select('-key');

  if (!apiKey) throw new ApiError(404, 'API key not found');
  return apiKey;
};
