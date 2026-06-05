import { Request, Response, NextFunction } from 'express';
import { logActivity } from '@/services/activityLog.service';

export const auditLog = (action: string, resource: string) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    const startTime = Date.now();

    const originalEnd = _res.end;
    _res.end = function (...args: any[]) {
      const duration = Date.now() - startTime;
      const status = _res.statusCode < 400 ? 'success' : 'failure';

      logActivity({
        userId: (req as any).user?.id,
        tenantId: (req as any).tenantId,
        action,
        resource,
        resourceId: req.params.id || req.params.tenantId,
        description: `${action} on ${resource}`,
        details: {
          method: req.method,
          path: req.path,
          statusCode: _res.statusCode,
          body: req.method !== 'GET' ? sanitizeBody(req.body) : undefined,
        },
        ip: req.ip || req.socket.remoteAddress || '',
        userAgent: req.headers['user-agent'] || '',
        sessionId: (req as any).sessionId,
        status,
        duration,
      });

      return originalEnd.apply(_res, args as any);
    };

    next();
  };
};

function sanitizeBody(body: any): any {
  if (!body) return body;
  const sanitized = { ...body };
  delete sanitized.password;
  delete sanitized.secret;
  delete sanitized.token;
  delete sanitized.accessToken;
  delete sanitized.refreshToken;
  return sanitized;
}

export const logUserAction = async (req: Request, action: string, description: string, details?: any) => {
  await logActivity({
    userId: (req as any).user?.id,
    tenantId: (req as any).tenantId,
    action,
    resource: req.path,
    description,
    details,
    ip: req.ip || req.socket.remoteAddress || '',
    userAgent: req.headers['user-agent'] || '',
  });
};
