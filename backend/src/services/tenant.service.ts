import Tenant from '@/models/Tenant';
import Subscription from '@/models/Subscription';
import { ApiError } from '@/utils/apiResponse';

export const createTenant = async (data: any) => {
  const existing = await Tenant.findOne({ slug: data.slug });
  if (existing) throw new ApiError(409, 'Tenant slug already exists');
  return Tenant.create(data);
};

export const getTenantById = async (id: string) => {
  const tenant = await Tenant.findById(id).populate('subscription');
  if (!tenant) throw new ApiError(404, 'Tenant not found');
  return tenant;
};

export const getTenantBySlug = async (slug: string) => {
  return Tenant.findOne({ slug, isActive: true }).populate('subscription');
};

export const updateTenant = async (id: string, data: any) => {
  const tenant = await Tenant.findByIdAndUpdate(id, { $set: data }, { new: true });
  if (!tenant) throw new ApiError(404, 'Tenant not found');
  return tenant;
};

export const suspendTenant = async (id: string) => {
  return Tenant.findByIdAndUpdate(id, { status: 'suspended' }, { new: true });
};

export const activateTenant = async (id: string) => {
  return Tenant.findByIdAndUpdate(id, { status: 'active' }, { new: true });
};

export const listTenants = async (query: any) => {
  const { page = 1, limit = 10, status, plan, search } = query;
  const filter: any = {};
  if (status) filter.status = status;
  if (plan) filter.plan = plan;
  if (search) filter.name = { $regex: search, $options: 'i' };

  const [tenants, total] = await Promise.all([
    Tenant.find(filter)
      .populate('subscription')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Tenant.countDocuments(filter),
  ]);

  return {
    data: tenants,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

export const getTenantStats = async (tenantId: string) => {
  const [tenant, subscription] = await Promise.all([
    Tenant.findById(tenantId),
    Subscription.findOne({ tenant: tenantId }),
  ]);

  return {
    name: tenant?.name,
    plan: tenant?.plan,
    status: tenant?.status,
    subscription: subscription
      ? {
          status: subscription.status,
          amount: subscription.amount,
          nextBillingDate: subscription.nextBillingDate,
        }
      : null,
  };
};
