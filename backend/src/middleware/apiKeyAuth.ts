import { Request, Response, NextFunction } from 'express';
import { validateApiKey } from '@/services/apiKey.service';

export const apiKeyAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const apiKey = req.headers['x-api-key'] as string;

    if (!apiKey) {
      res.status(401).json({
        success: false,
        message: 'API key is required. Provide it in the x-api-key header.',
      });
      return;
    }

    const result = await validateApiKey(apiKey);
    if (!result) {
      res.status(401).json({
        success: false,
        message: 'Invalid or expired API key',
      });
      return;
    }

    (req as any).apiKeyInfo = result;
    (req as any).user = { id: result.userId, role: 'api' };
    (req as any).tenantId = result.tenantId;

    const permission = req.method === 'GET' ? 'read' : 'write';
    if (!result.permissions.includes(permission) && !result.permissions.includes('*')) {
      res.status(403).json({
        success: false,
        message: `API key does not have '${permission}' permission`,
      });
      return;
    }

    next();
  } catch (error) {
    next(error);
  }
};
