import { Request, Response, NextFunction } from 'express';
import { logActivity } from '@/services/activityLog.service';

export const auditLog = (action: string, resource: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();

    const originalEnd = res.end;

    res.end = function (...args: any[]) {
      const duration = Date.now() - startTime;
      const status = res.statusCode < 400 ? 'success' : 'failure';

      const resourceId =
        req.params?.id ||
        req.params?.tenantId ||
        null;

      try {
        logActivity({
          userId: (req as any).user?.id,
          tenantId: (req as any).tenantId,
          action,
          resource,
          resourceId: resourceId ?? undefined,
          description: `${action} on ${resource}`,
          details: {
            method: req.method,
            path: req.path,
            statusCode: res.statusCode,
            body:
              req.method !== 'GET'
                ? sanitizeBody(req.body)
                : undefined,
          },
          ip: req.ip || req.socket.remoteAddress || '',
          userAgent: req.headers['user-agent'] || '',
          sessionId: (req as any).sessionId,
          status,
          duration,
        }).catch((error) => {
          console.error('Audit log error:', error);
        });
      } catch (error) {
        console.error('Audit middleware error:', error);
      }

      return originalEnd.apply(res, args as any);
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

export const logUserAction = async (
  req: Request,
  action: string,
  description: string,
  details?: any
) => {
  try {
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
  } catch (error) {
    console.error('logUserAction error:', error);
  }
};