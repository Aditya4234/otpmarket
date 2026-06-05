import ActivityLog from '@/models/ActivityLog';

interface LogActivityParams {
  userId?: string;
  tenantId?: string;
  action: string;
  resource: string;
  resourceId?: string;
  description: string;
  details?: any;
  ip: string;
  userAgent?: string;
  sessionId?: string;
  severity?: 'info' | 'warning' | 'error' | 'critical';
  status?: 'success' | 'failure' | 'pending';
  duration?: number;
  metadata?: Record<string, any>;
}

export const logActivity = async (params: LogActivityParams) => {
  try {
    await ActivityLog.create({
      user: params.userId,
      tenant: params.tenantId,
      action: params.action,
      resource: params.resource,
      resourceId: params.resourceId,
      description: params.description,
      details: params.details,
      ip: params.ip,
      userAgent: params.userAgent || '',
      sessionId: params.sessionId,
      severity: params.severity || 'info',
      status: params.status || 'success',
      duration: params.duration,
      metadata: params.metadata || {},
    });
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
};

export const getActivityLogs = async (query: any) => {
  const {
    page = 1, limit = 20, userId, tenantId, action, resource,
    severity, status, startDate, endDate, search,
  } = query;

  const filter: any = {};
  if (userId) filter.user = userId;
  if (tenantId) filter.tenant = tenantId;
  if (action) filter.action = action;
  if (resource) filter.resource = resource;
  if (severity) filter.severity = severity;
  if (status) filter.status = status;
  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) filter.createdAt.$gte = new Date(startDate);
    if (endDate) filter.createdAt.$lte = new Date(endDate);
  }
  if (search) {
    filter.$or = [
      { description: { $regex: search, $options: 'i' } },
      { action: { $regex: search, $options: 'i' } },
    ];
  }

  const [logs, total] = await Promise.all([
    ActivityLog.find(filter)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    ActivityLog.countDocuments(filter),
  ]);

  return {
    data: logs,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

export const getUserActivitySummary = async (userId: string) => {
  const [totalLogs, actions, lastLogin] = await Promise.all([
    ActivityLog.countDocuments({ user: userId }),
    ActivityLog.aggregate([
      { $match: { user: userId as any } },
      { $group: { _id: '$action', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]),
    ActivityLog.findOne({ user: userId, action: 'login' })
      .sort({ createdAt: -1 })
      .select('createdAt ip'),
  ]);

  return { totalLogs, frequentActions: actions, lastLogin };
};

export const getAuditTrail = async (resource: string, resourceId: string) => {
  return ActivityLog.find({ resource, resourceId })
    .populate('user', 'name email role')
    .sort({ createdAt: -1 });
};
