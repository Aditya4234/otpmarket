import Subscription, { Invoice } from '@/models/Subscription';
import Tenant from '@/models/Tenant';
import { ApiError } from '@/utils/apiResponse';

const PLANS = {
  free: { amount: 0, features: ['basic_orders', 'email_support'], maxUsers: 10, maxAgents: 5 },
  starter: { amount: 999, features: ['basic_orders', 'email_support', 'api_access', 'basic_reports'], maxUsers: 50, maxAgents: 20 },
  professional: { amount: 2999, features: ['unlimited_orders', 'priority_support', 'api_access', 'advanced_reports', 'webhooks', 'custom_branding'], maxUsers: 200, maxAgents: 100 },
  enterprise: { amount: 9999, features: ['unlimited_orders', 'dedicated_support', 'api_access', 'custom_reports', 'webhooks', 'white_label', 'sla_guarantee'], maxUsers: 1000, maxAgents: 500 },
};

export const createSubscription = async (tenantId: string, plan: string, billingCycle: string) => {
  const tenant = await Tenant.findById(tenantId);
  if (!tenant) throw new ApiError(404, 'Tenant not found');

  const planConfig = PLANS[plan as keyof typeof PLANS];
  if (!planConfig) throw new ApiError(400, 'Invalid plan');

  const amount = billingCycle === 'yearly' ? planConfig.amount * 10 : planConfig.amount;
  const startDate = new Date();
  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + (billingCycle === 'yearly' ? 12 : 1));

  const existingSub = await Subscription.findOne({ tenant: tenantId });
  if (existingSub) {
    Object.assign(existingSub, {
      plan, billingCycle, amount, features: planConfig.features,
      startDate, endDate, status: 'active',
    });
    return existingSub.save();
  }

  const subscription = await Subscription.create({
    tenant: tenantId, plan, billingCycle, amount,
    startDate, endDate, status: 'active', features: planConfig.features,
  });

  await Tenant.findByIdAndUpdate(tenantId, {
    plan, maxUsers: planConfig.maxUsers, maxAgents: planConfig.maxAgents,
    subscription: subscription._id,
  });

  return subscription;
};

export const getSubscription = async (tenantId: string) => {
  const sub = await Subscription.findOne({ tenant: tenantId });
  if (!sub) throw new ApiError(404, 'Subscription not found');
  return sub;
};

export const cancelSubscription = async (subscriptionId: string) => {
  const sub = await Subscription.findByIdAndUpdate(
    subscriptionId,
    { status: 'cancelled', cancelledAt: new Date() },
    { new: true }
  );
  if (!sub) throw new ApiError(404, 'Subscription not found');
  return sub;
};

export const generateInvoice = async (subscriptionId: string) => {
  const sub = await Subscription.findById(subscriptionId);
  if (!sub) throw new ApiError(404, 'Subscription not found');

  const invoiceNumber = `INV-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  const invoice = await Invoice.create({
    subscription: subscriptionId,
    tenant: sub.tenant,
    invoiceNumber,
    amount: sub.amount,
    currency: sub.currency,
    dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    lineItems: [
      {
        description: `${sub.plan} Plan (${sub.billingCycle})`,
        quantity: 1,
        unitPrice: sub.amount,
        total: sub.amount,
      },
    ],
    taxAmount: 0,
    totalAmount: sub.amount,
    status: 'sent',
  });

  return invoice;
};

export const getInvoices = async (tenantId: string, query: any) => {
  const { page = 1, limit = 10, status } = query;
  const filter: any = { tenant: tenantId };
  if (status) filter.status = status;

  const [invoices, total] = await Promise.all([
    Invoice.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    Invoice.countDocuments(filter),
  ]);

  return {
    data: invoices,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

export const checkFeatureAccess = async (tenantId: string, feature: string): Promise<boolean> => {
  const tenant = await Tenant.findById(tenantId).populate('subscription');
  if (!tenant || tenant.status !== 'active') return false;
  const sub = tenant.subscription as any;
  return sub?.features?.includes(feature) || false;
};

export { PLANS };
