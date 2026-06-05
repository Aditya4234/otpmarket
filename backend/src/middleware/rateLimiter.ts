import { Request, Response, NextFunction } from 'express';

export const rateLimitByApiKey = () => {
  const store = new Map<string, { count: number; resetAt: number }>();

  return (req: Request, res: Response, next: NextFunction) => {
    const apiKeyInfo = (req as any).apiKeyInfo;
    if (!apiKeyInfo) return next();

    const key = apiKeyInfo.userId.toString();
    const limit = apiKeyInfo.rateLimitPerMinute || 60;
    const now = Date.now();

    let record = store.get(key);

    if (!record || record.resetAt < now) {
      record = { count: 0, resetAt: now + 60000 };
      store.set(key, record);
    }

    record.count += 1;

    res.setHeader('X-RateLimit-Limit', limit);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, limit - record.count));
    res.setHeader('X-RateLimit-Reset', Math.ceil(record.resetAt / 1000));

    if (record.count > limit) {
      return res.status(429).json({
        success: false,
        message: 'Rate limit exceeded. Try again later.',
      });
    }

    next();
  };
};
