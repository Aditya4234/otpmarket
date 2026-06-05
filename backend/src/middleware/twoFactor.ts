import { Request, Response, NextFunction } from 'express';
import { verifyTwoFactorToken } from '@/services/twoFactor.service';
import TwoFactor from '@/models/TwoFactor';

export const requireTwoFactor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const twoFactorToken = req.headers['x-2fa-token'] as string;
    const skipForPath = [
      '/auth/login', '/auth/register', '/auth/2fa/generate',
      '/auth/2fa/verify', '/auth/2fa/status', '/auth/2fa/disable',
    ];

    if (skipForPath.some((path) => req.path.includes(path))) {
      return next();
    }

    if (!twoFactorToken) {
      const twoFactor = await TwoFactor.findOne({ user: userId });
      if (twoFactor?.isEnabled) {
        return res.status(403).json({
          success: false,
          message: '2FA token required',
          requiresTwoFactor: true,
        });
      }
      return next();
    }

    const verified = await verifyTwoFactorToken(userId, twoFactorToken);
    if (!verified) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired 2FA token',
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};
