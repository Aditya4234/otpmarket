import Order from '@/models/Order';
import Transaction from '@/models/Transaction';
import ActivityLog from '@/models/ActivityLog';

interface InsightResult {
  type: string;
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'success' | 'danger';
  metric?: string;
  trend?: 'up' | 'down' | 'stable';
  percentage?: number;
  recommendation?: string;
}

export const generateDashboardInsights = async (userId?: string, tenantId?: string): Promise<InsightResult[]> => {
  const insights: InsightResult[] = [];

  const recentOrders = await Order.countDocuments({
    createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    ...(userId ? { user: userId } : {}),
    ...(tenantId ? { tenant: tenantId } : {}),
  });

  const yesterdayOrders = await Order.countDocuments({
    createdAt: {
      $gte: new Date(Date.now() - 48 * 60 * 60 * 1000),
      $lt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
    ...(userId ? { user: userId } : {}),
    ...(tenantId ? { tenant: tenantId } : {}),
  });

  if (recentOrders > 0 && yesterdayOrders > 0) {
    const growth = ((recentOrders - yesterdayOrders) / yesterdayOrders) * 100;
    if (Math.abs(growth) > 10) {
      insights.push({
        type: 'order_volume',
        title: growth > 0 ? 'Order Volume Rising' : 'Order Volume Dropping',
        description: `Orders changed by ${Math.abs(growth).toFixed(1)}% compared to yesterday`,
        severity: growth > 0 ? 'success' : 'warning',
        metric: `${recentOrders} orders today`,
        trend: growth > 0 ? 'up' : 'down',
        percentage: Math.abs(growth),
        recommendation: growth > 0
          ? 'Great momentum! Consider scaling your operations.'
          : 'Consider checking if there are any issues with recent services.',
      });
    }
  }

  const pendingOrders = await Order.countDocuments({ status: 'pending' });
  if (pendingOrders > 10) {
    insights.push({
      type: 'backlog',
      title: 'Order Backlog Detected',
      description: `${pendingOrders} orders are pending processing`,
      severity: 'warning',
      metric: `${pendingOrders} pending`,
      trend: 'up',
      recommendation: 'Review pending orders and consider allocating more resources to processing.',
    });
  }

  const failedTransactions = await Transaction.countDocuments({
    status: 'failed',
    createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
  });

  if (failedTransactions > 5) {
    insights.push({
      type: 'payment_issues',
      title: 'Payment Failures Increasing',
      description: `${failedTransactions} transactions failed in the last 24 hours`,
      severity: 'danger',
      metric: `${failedTransactions} failures`,
      trend: 'up',
      recommendation: 'Check payment gateway configuration and investigate recent failures.',
    });
  }

  const recentActivity = await ActivityLog.countDocuments({
    createdAt: { $gte: new Date(Date.now() - 60 * 60 * 1000) },
    severity: 'error',
  });

  if (recentActivity > 10) {
    insights.push({
      type: 'error_spike',
      title: 'Error Rate Spike',
      description: `${recentActivity} errors in the last hour`,
      severity: 'danger',
      metric: `${recentActivity} errors/hr`,
      trend: 'up',
      recommendation: 'Investigate the recent errors in the activity logs.',
    });
  }

  const lowRevenue = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        paymentStatus: 'paid',
      },
    },
    { $group: { _id: null, total: { $sum: '$totalPrice' } } },
  ]);

  const prevWeekRevenue = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
          $lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
        paymentStatus: 'paid',
      },
    },
    { $group: { _id: null, total: { $sum: '$totalPrice' } } },
  ]);

  const currentRev = lowRevenue[0]?.total || 0;
  const prevRev = prevWeekRevenue[0]?.total || 0;

  if (prevRev > 0) {
    const revGrowth = ((currentRev - prevRev) / prevRev) * 100;
    insights.push({
      type: 'revenue_trend',
      title: revGrowth >= 0 ? 'Revenue Growing' : 'Revenue Declining',
      description: `Weekly revenue ${revGrowth >= 0 ? 'increased' : 'decreased'} by ${Math.abs(revGrowth).toFixed(1)}%`,
      severity: revGrowth >= 0 ? 'success' : 'warning',
      metric: `₹${currentRev.toLocaleString()}`,
      trend: revGrowth >= 0 ? 'up' : 'down',
      percentage: Math.abs(revGrowth),
      recommendation: revGrowth < 0
        ? 'Consider running promotions or checking competitor pricing.'
        : 'Keep up the good momentum!',
    });
  }

  if (insights.length === 0) {
    insights.push({
      type: 'all_clear',
      title: 'All Systems Normal',
      description: 'No anomalies detected. Everything is running smoothly.',
      severity: 'success',
      recommendation: 'Keep monitoring for any changes in patterns.',
    });
  }

  return insights;
};

export const generateUserInsights = async (userId: string): Promise<InsightResult[]> => {
  const insights: InsightResult[] = [];

  const [recentOrders] = await Promise.all([
    Order.find({ user: userId }).sort({ createdAt: -1 }).limit(5).select('status totalPrice createdAt'),
  ]);

  const completedOrders = recentOrders.filter((o) => o.status === 'completed').length;
  const total = recentOrders.length;

  if (total > 0) {
    const completionRate = (completedOrders / total) * 100;
    if (completionRate < 50) {
      insights.push({
        type: 'order_completion',
        title: 'Low Order Completion',
        description: `${completionRate.toFixed(0)}% of your recent orders were completed`,
        severity: 'warning',
        metric: `${completionRate.toFixed(0)}%`,
        trend: 'down',
        recommendation: 'Check pending orders or contact support for assistance.',
      });
    }
  }

  return insights;
};
