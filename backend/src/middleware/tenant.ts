import { Request, Response, NextFunction } from 'express';
import Tenant from '@/models/Tenant';

export const tenantMiddleware = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const tenantSlug = req.headers['x-tenant-slug'] as string;
    const tenantId = req.headers['x-tenant-id'] as string;

    if (tenantSlug) {
      const tenant = await Tenant.findOne({ slug: tenantSlug, isActive: true });
      if (tenant) {
        (req as any).tenant = tenant;
        (req as any).tenantId = tenant._id;
      }
    } else if (tenantId) {
      const tenant = await Tenant.findById(tenantId);
      if (tenant) {
        (req as any).tenant = tenant;
        (req as any).tenantId = tenant._id;
      }
    }

    next();
  } catch (error) {
    next();
  }
};

export const requireTenant = (req: Request, res: Response, next: NextFunction): void => {
  if (!(req as any).tenantId) {
    res.status(400).json({
      success: false,
      message: 'Tenant context required. Provide x-tenant-slug or x-tenant-id header.',
    });
    return;
  }
  next();
};
