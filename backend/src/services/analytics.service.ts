import Order from '@/models/Order';
import User from '@/models/User';
import Transaction from '@/models/Transaction';
import Wallet from '@/models/Wallet';
import ActivityLog from '@/models/ActivityLog';

export const getDashboardAnalytics = async (tenantId?: string) => {
  const match: any = {};
  if (tenantId) match.tenant = tenantId;

  const [
    totalRevenue,
    totalOrders,
    totalUsers,
    totalAgents,
    revenueByDay,
    ordersByStatus,
    topServices,
  ] = await Promise.all([
    Order.aggregate([
      { $match: { ...match, paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]),
    Order.countDocuments(match),
    User.countDocuments({ ...match, role: 'user' }),
    User.countDocuments({ ...match, role: 'agent' }),
    Order.aggregate([
      { $match: { ...match, paymentStatus: 'paid' } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$totalPrice' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 30 },
    ]),
    Order.aggregate([
      { $match: match },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
    Order.aggregate([
      { $match: match },
      { $group: { _id: '$service', count: { $sum: 1 }, revenue: { $sum: '$totalPrice' } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $lookup: { from: 'services', localField: '_id', foreignField: '_id', as: 'service' },
      },
      { $unwind: { path: '$service', preserveNullAndEmptyArrays: true } },
      { $project: { name: '$service.name', count: 1, revenue: 1 } },
    ]),
  ]);

  return {
    totalRevenue: totalRevenue[0]?.total || 0,
    totalOrders,
    totalUsers,
    totalAgents,
    revenueByDay,
    ordersByStatus,
    topServices,
  };
};

export const getUserAnalytics = async (userId: string) => {
  const [totalOrders, totalSpent, ordersByStatus, recentActivity, walletInfo] = await Promise.all([
    Order.countDocuments({ user: userId }),
    Order.aggregate([
      { $match: { user: userId as any, paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]),
    Order.aggregate([
      { $match: { user: userId as any } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
    ActivityLog.find({ user: userId }).sort({ createdAt: -1 }).limit(10).select('action description createdAt'),
    Wallet.findOne({ user: userId }),
  ]);

  return {
    totalOrders,
    totalSpent: totalSpent[0]?.total || 0,
    walletBalance: walletInfo?.balance || 0,
    ordersByStatus,
    recentActivity,
  };
};

export const getAgentAnalytics = async (agentId: string) => {
  const [totalEarnings, totalOrders, pendingAmount, performanceByDay] = await Promise.all([
    Transaction.aggregate([
      { $match: { user: agentId as any, type: 'earnings', status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]),
    Order.countDocuments({ agent: agentId }),
    Transaction.aggregate([
      { $match: { user: agentId as any, type: 'earnings', status: 'pending' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]),
    Order.aggregate([
      { $match: { agent: agentId as any } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
          revenue: { $sum: '$totalPrice' },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 30 },
    ]),
  ]);

  return {
    totalEarnings: totalEarnings[0]?.total || 0,
    totalOrders,
    pendingAmount: pendingAmount[0]?.total || 0,
    performanceByDay,
  };
};

export const getSystemAnalytics = async () => {
  const [activeUsers, totalTransactions] = await Promise.all([
    User.countDocuments({ isActive: true }),
    Transaction.aggregate([
      { $group: { _id: null, count: { $sum: 1 }, total: { $sum: '$amount' } } },
    ]),
  ]);

  return {
    activeUsers,
    totalTransactions: totalTransactions[0]?.count || 0,
    totalTransactionVolume: totalTransactions[0]?.total || 0,
  };
};
