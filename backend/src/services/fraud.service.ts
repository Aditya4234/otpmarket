import FraudAlert from '@/models/FraudAlert';
import ActivityLog from '@/models/ActivityLog';

interface FraudCheckParams {
  userId?: string;
  tenantId?: string;
  ipAddress: string;
  userAgent?: string;
  action: string;
  amount?: number;
  resource?: string;
  metadata?: Record<string, any>;
}

const FRAUD_RULES = {
  RAPID_FIRE: { name: 'rapid_fire', threshold: 20, window: 60, severity: 'medium' },
  HIGH_AMOUNT: { name: 'high_amount', threshold: 50000, severity: 'high' },
  NEW_ACCOUNT_ACTIVITY: { name: 'new_account_activity', window: 24, threshold: 10, severity: 'medium' },
  UNUSUAL_LOCATION: { name: 'unusual_location', severity: 'high' },
  MULTIPLE_ACCOUNTS: { name: 'multiple_accounts', severity: 'critical' },
};

export const checkForFraud = async (params: FraudCheckParams): Promise<number> => {
  let riskScore = 0;
  const alerts = [];

  const recentActions = await ActivityLog.countDocuments({
    ip: params.ipAddress,
    createdAt: { $gte: new Date(Date.now() - 60 * 1000) },
  });

  if (recentActions > FRAUD_RULES.RAPID_FIRE.threshold) {
    riskScore += 30;
    alerts.push({
      type: 'api_abuse',
      ruleName: FRAUD_RULES.RAPID_FIRE.name,
      severity: 'medium',
      description: `Rapid fire detected: ${recentActions} actions in 60s from IP ${params.ipAddress}`,
    });
  }

  if (params.amount && params.amount > FRAUD_RULES.HIGH_AMOUNT.threshold) {
    riskScore += 25;
    alerts.push({
      type: 'payment_fraud',
      ruleName: FRAUD_RULES.HIGH_AMOUNT.name,
      severity: 'high',
      description: `High value transaction: ${params.amount}`,
      amount: params.amount,
    });
  }

  if (riskScore >= 30) {
    for (const alert of alerts) {
      await FraudAlert.create({
        user: params.userId,
        tenant: params.tenantId,
        ...alert,
        evidence: { ipAddress: params.ipAddress, userAgent: params.userAgent, ...params.metadata },
        ipAddress: params.ipAddress,
        userAgent: params.userAgent,
        amount: params.amount,
        riskScore,
        affectedResource: params.resource,
      });
    }
  }

  return riskScore;
};

export const listFraudAlerts = async (query: any) => {
  const { page = 1, limit = 10, status, severity, type } = query;
  const filter: any = {};
  if (status) filter.status = status;
  if (severity) filter.severity = severity;
  if (type) filter.type = type;

  const [alerts, total] = await Promise.all([
    FraudAlert.find(filter)
      .populate('user', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    FraudAlert.countDocuments(filter),
  ]);

  return {
    data: alerts,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

export const resolveFraudAlert = async (alertId: string, resolution: string, resolvedBy: string) => {
  return FraudAlert.findByIdAndUpdate(
    alertId,
    {
      status: 'resolved',
      resolution,
      resolvedBy: resolvedBy as any,
      resolvedAt: new Date(),
    },
    { new: true }
  );
};

export const getFraudStats = async () => {
  const [total, open, critical, byType] = await Promise.all([
    FraudAlert.countDocuments(),
    FraudAlert.countDocuments({ status: 'open' }),
    FraudAlert.countDocuments({ severity: 'critical', status: { $ne: 'resolved' } }),
    FraudAlert.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
  ]);

  return { total, open, critical, byType };
};
