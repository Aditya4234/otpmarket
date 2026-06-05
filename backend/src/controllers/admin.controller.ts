import { Response } from 'express';
import mongoose from 'mongoose';
import User from '@/models/User';
import Wallet from '@/models/Wallet';
import Order from '@/models/Order';
import Service from '@/models/Service';
import Category from '@/models/Category';
import Ticket from '@/models/Ticket';
import Transaction from '@/models/Transaction';
import Withdrawal from '@/models/Withdrawal';
import Notification from '@/models/Notification';
import { AuthRequest } from '@/types';
import { asyncHandler } from '@/utils/asyncHandler';
import {
  SuccessResponse,
  CreatedResponse,
  NotFoundResponse,
  BadRequestResponse,
} from '@/utils/apiResponse';
import { buildPaginationQuery } from '@/utils/helpers';
import { uploadToCloudinary } from '@/services/cloudinary.service';

export const getDashboardStats = asyncHandler(async (_req: AuthRequest, res: Response) => {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  const [
    totalUsers,
    totalOrders,
    totalServices,
    totalTickets,
    todayStats,
    monthlyStats,
    yearlyRevenueResult,
    ordersByDay,
    topServices,
    recentUsers,
    pendingWithdrawals,
    totalAgents,
    recentOrders,
  ] = await Promise.all([
    User.countDocuments(),
    Order.countDocuments(),
    Service.countDocuments({ isActive: true }),
    Ticket.countDocuments({ status: { $ne: 'closed' } }),
    Order.aggregate([
      { $match: { createdAt: { $gte: startOfToday } } },
      {
        $group: {
          _id: null,
          orders: { $sum: 1 },
          revenue: { $sum: '$totalPrice' },
        },
      },
    ]),
    Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth },
          status: { $in: ['completed', 'active'] },
        },
      },
      {
        $group: {
          _id: null,
          orders: { $sum: 1 },
          revenue: { $sum: '$totalPrice' },
        },
      },
    ]),
    Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfYear },
          status: { $in: ['completed', 'active'] },
        },
      },
      {
        $group: {
          _id: null,
          revenue: { $sum: '$totalPrice' },
        },
      },
    ]),
    Order.aggregate([
      {
        $match: { createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
          revenue: { $sum: '$totalPrice' },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    Order.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: '$service', count: { $sum: 1 }, revenue: { $sum: '$totalPrice' } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'services',
          localField: '_id',
          foreignField: '_id',
          as: 'service',
        },
      },
      { $unwind: { path: '$service', preserveNullAndEmptyArrays: true } },
      { $project: { 'service.name': 1, 'service.slug': 1, count: 1, revenue: 1 } },
    ]),
    User.find().sort({ createdAt: -1 }).limit(10).lean(),
    Withdrawal.countDocuments({ status: 'pending' }),
    User.countDocuments({ role: 'agent' }),
    Order.find()
      .populate('service', 'name slug')
      .sort({ createdAt: -1 })
      .limit(10)
      .lean(),
  ]);

  return new SuccessResponse('Dashboard stats fetched successfully', {
    totalUsers,
    totalAgents,
    totalOrders,
    totalRevenue: yearlyRevenueResult[0]?.revenue || 0,
    pendingWithdrawals,
    recentOrders,
    overview: {
      totalUsers,
      totalOrders,
      totalServices,
      totalTickets,
      totalAgents,
    },
    revenue: {
      today: todayStats[0]?.revenue || 0,
      thisMonth: monthlyStats[0]?.revenue || 0,
      thisYear: yearlyRevenueResult[0]?.revenue || 0,
    },
    orders: {
      today: todayStats[0]?.orders || 0,
      thisMonth: monthlyStats[0]?.orders || 0,
    },
    charts: {
      ordersByDay,
    },
    topServices,
    usersByRole: {},
    recentUsers,
  }).send(res);
});

export const getUsers = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { page, limit, skip, sort } = buildPaginationQuery(req.query as any);

  const filter: Record<string, unknown> = {};

  if (req.query.role) {
    filter.role = req.query.role;
  }

  if (req.query.status) {
    filter.isActive = req.query.status === 'active';
  }

  if (req.query.search) {
    filter.$or = [
      { name: { $regex: req.query.search as string, $options: 'i' } },
      { email: { $regex: req.query.search as string, $options: 'i' } },
    ] as Record<string, unknown>[];
  }

  if (req.query.startDate && req.query.endDate) {
    filter.createdAt = {
      $gte: new Date(req.query.startDate as string),
      $lte: new Date(req.query.endDate as string),
    };
  }

  const [total, users] = await Promise.all([
    User.countDocuments(filter),
    User.find(filter).sort(sort).skip(skip).limit(limit).lean(),
  ]);

  const userIds = users.map((u) => u._id);
  const wallets = await Wallet.find({ user: { $in: userIds } }).lean();
  const walletMap: Record<string, any> = {};
  for (const w of wallets) {
    walletMap[w.user.toString()] = w;
  }

  const usersWithWallets = users.map((u) => ({
    ...u,
    wallet: walletMap[u._id.toString()] || null,
  }));

  const totalPages = Math.ceil(total / limit);

  return new SuccessResponse('Users fetched successfully', usersWithWallets, {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  }).send(res);
});

export const getUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const user = await User.findById(id);
  if (!user) {
    return new NotFoundResponse('User not found').send(res);
  }

  const [wallet, transactions, orders] = await Promise.all([
    Wallet.findOne({ user: id }),
    Transaction.find({ user: id }).sort({ createdAt: -1 }).limit(20).lean(),
    Order.find({ user: id })
      .populate('service', 'name slug')
      .sort({ createdAt: -1 })
      .limit(20)
      .lean(),
  ]);

  return new SuccessResponse('User fetched successfully', {
    user,
    wallet,
    recentTransactions: transactions,
    recentOrders: orders,
  }).send(res);
});

export const updateUserStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { isActive } = req.body;

  const user = await User.findById(id);
  if (!user) {
    return new NotFoundResponse('User not found').send(res);
  }

  if (user.role === 'admin' && req.user?._id !== id) {
    return new BadRequestResponse('Cannot deactivate another admin').send(res);
  }

  user.isActive = isActive;
  await user.save();

  const action = isActive ? 'activated' : 'deactivated';

  await Notification.create({
    user: user._id,
    title: `Account ${action}`,
    message: `Your account has been ${action} by an administrator.`,
    type: 'system',
  });

  return new SuccessResponse(`User ${action} successfully`, { user }).send(res);
});

export const updateUserRole = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { userId, role } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    return new NotFoundResponse('User not found').send(res);
  }

  if (user.role === 'admin' && req.user?._id?.toString() !== userId) {
    return new BadRequestResponse('Cannot change another admin\'s role').send(res);
  }

  user.role = role;
  await user.save();

  await Notification.create({
    user: user._id,
    title: 'Role Updated',
    message: `Your account role has been changed to ${role}.`,
    type: 'system',
  });

  return new SuccessResponse(`User role updated to ${role}`, { user }).send(res);
});

export const getServices = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { page, limit, skip, sort } = buildPaginationQuery(req.query as any);

  const filter: Record<string, unknown> = {};

  if (req.query.isActive !== undefined) {
    filter.isActive = req.query.isActive === 'true';
  }

  if (req.query.isAvailable !== undefined) {
    filter.isAvailable = req.query.isAvailable === 'true';
  }

  if (req.query.category) {
    filter.category = req.query.category;
  }

  if (req.query.search) {
    filter.name = { $regex: req.query.search as string, $options: 'i' };
  }

  if (req.query.type) {
    filter.type = req.query.type;
  }

  if (req.query.country) {
    filter.country = { $regex: req.query.country as string, $options: 'i' };
  }

  const [total, services] = await Promise.all([
    Service.countDocuments(filter),
    Service.find(filter)
      .populate('category', 'name slug')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
  ]);

  const totalPages = Math.ceil(total / limit);

  return new SuccessResponse('Services fetched successfully', services, {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  }).send(res);
});

export const createService = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { name, category, description, price, originalPrice, country, countryCode, provider, type } = req.body;

  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const existingService = await Service.findOne({ slug });
  if (existingService) {
    return new BadRequestResponse('A service with this name already exists').send(res);
  }

  const categoryExists = await Category.findById(category);
  if (!categoryExists) {
    return new NotFoundResponse('Category not found').send(res);
  }

  const serviceData: Record<string, unknown> = {
    name,
    slug,
    category,
    description,
    price,
    country,
    countryCode,
    provider,
    type,
    images: [],
  };

  if (originalPrice) serviceData.originalPrice = originalPrice;

  const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
  const imageFiles = files?.images || files?.gallery || [];
  if (imageFiles.length > 0) {
    const uploadPromises = imageFiles.map((file) =>
      uploadToCloudinary(file.buffer, { folder: 'services' }),
    );
    const results = await Promise.all(uploadPromises);
    serviceData.images = results.map((r) => ({ url: r.url, publicId: r.publicId }));
  }

  const service = await Service.create(serviceData);

  return new CreatedResponse('Service created successfully', service).send(res);
});

export const updateService = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const service = await Service.findById(id);
  if (!service) {
    return new NotFoundResponse('Service not found').send(res);
  }

  const { name, category, description, price, originalPrice, country, countryCode, provider, type, isActive, isAvailable } = req.body;

  if (name) {
    service.name = name;
    service.slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  if (category) service.category = category;
  if (description !== undefined) service.description = description;
  if (price !== undefined) service.price = price;
  if (originalPrice !== undefined) service.originalPrice = originalPrice;
  if (country) service.country = country;
  if (countryCode) service.countryCode = countryCode;
  if (provider) service.provider = provider;
  if (type) service.type = type;
  if (isActive !== undefined) service.isActive = isActive;
  if (isAvailable !== undefined) service.isAvailable = isAvailable;

  const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
  const imageFiles = files?.images || files?.gallery || [];
  if (imageFiles.length > 0) {
    const uploadPromises = imageFiles.map((file) =>
      uploadToCloudinary(file.buffer, { folder: 'services' }),
    );
    const results = await Promise.all(uploadPromises);
    const newImages = results.map((r) => ({ url: r.url, publicId: r.publicId }));
    service.images = [...service.images, ...newImages];
  }

  await service.save();

  return new SuccessResponse('Service updated successfully', service).send(res);
});

export const deleteService = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const service = await Service.findById(id);
  if (!service) {
    return new NotFoundResponse('Service not found').send(res);
  }

  service.isActive = false;
  await service.save();

  return new SuccessResponse('Service deactivated successfully').send(res);
});

export const getCategories = asyncHandler(async (req: AuthRequest, res: Response) => {
  const filter: Record<string, unknown> = {};
  if (req.query.isActive !== undefined) {
    filter.isActive = req.query.isActive === 'true';
  }

  const categories = await Category.find(filter).sort({ displayOrder: 1, name: 1 }).lean();

  const categoriesWithCount = await Promise.all(
    categories.map(async (cat) => {
      const serviceCount = await Service.countDocuments({ category: cat._id });
      return { ...cat, serviceCount };
    }),
  );

  return new SuccessResponse('Categories fetched successfully', categoriesWithCount).send(res);
});

export const createCategory = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { name, description, icon, displayOrder } = req.body;

  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const existingCategory = await Category.findOne({ slug });
  if (existingCategory) {
    return new BadRequestResponse('A category with this name already exists').send(res);
  }

  const category = await Category.create({
    name,
    slug,
    description,
    icon,
    displayOrder: displayOrder || 0,
  });

  return new CreatedResponse('Category created successfully', category).send(res);
});

export const updateCategory = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const category = await Category.findById(id);
  if (!category) {
    return new NotFoundResponse('Category not found').send(res);
  }

  const { name, description, icon, displayOrder, isActive } = req.body;

  if (name) {
    category.name = name;
    category.slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  if (description !== undefined) category.description = description;
  if (icon !== undefined) category.icon = icon;
  if (displayOrder !== undefined) category.displayOrder = displayOrder;
  if (isActive !== undefined) category.isActive = isActive;

  await category.save();

  return new SuccessResponse('Category updated successfully', category).send(res);
});

export const deleteCategory = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const category = await Category.findById(id);
  if (!category) {
    return new NotFoundResponse('Category not found').send(res);
  }

  const serviceCount = await Service.countDocuments({ category: id, isActive: true });
  if (serviceCount > 0) {
    return new BadRequestResponse(
      `Cannot delete category. ${serviceCount} active service(s) are linked to it. Deactivate them first.`,
    ).send(res);
  }

  await Category.findByIdAndDelete(id);

  return new SuccessResponse('Category deleted successfully').send(res);
});

export const getAgents = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { page, limit, skip, sort } = buildPaginationQuery(req.query as any);

  const filter: Record<string, unknown> = { role: 'agent' };

  if (req.query.search) {
    filter.$or = [
      { name: { $regex: req.query.search as string, $options: 'i' } },
      { email: { $regex: req.query.search as string, $options: 'i' } },
    ] as Record<string, unknown>[];
  }

  const [total, agents] = await Promise.all([
    User.countDocuments(filter),
    User.find(filter).sort(sort).skip(skip).limit(limit).lean(),
  ]);

  const agentIds = agents.map((a) => a._id);
  const wallets = await Wallet.find({ user: { $in: agentIds } }).lean();
  const walletMap: Record<string, any> = {};
  for (const w of wallets) {
    walletMap[w.user.toString()] = w;
  }

  const agentsWithWallets = agents.map((a) => ({
    ...a,
    wallet: walletMap[a._id.toString()] || null,
  }));

  const totalPages = Math.ceil(total / limit);

  return new SuccessResponse('Agents fetched successfully', agentsWithWallets, {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  }).send(res);
});

export const verifyAgent = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { isVerified } = req.body;

  const user = await User.findById(id);
  if (!user) {
    return new NotFoundResponse('Agent not found').send(res);
  }

  if (user.role !== 'agent') {
    return new BadRequestResponse('User is not an agent').send(res);
  }

  user.isVerified = isVerified;
  await user.save();

  const action = isVerified ? 'verified' : 'unverified';

  await Notification.create({
    user: user._id,
    title: `Agent ${action}`,
    message: `Your agent account has been ${action} by an administrator.`,
    type: 'system',
  });

  return new SuccessResponse(`Agent ${action} successfully`, { user }).send(res);
});

export const getAllOrders = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { page, limit, skip, sort } = buildPaginationQuery(req.query as any);

  const filter: Record<string, unknown> = {};

  if (req.query.status) {
    filter.status = req.query.status;
  }

  if (req.query.userId) {
    filter.user = req.query.userId;
  }

  if (req.query.serviceId) {
    filter.service = req.query.serviceId;
  }

  const [total, orders] = await Promise.all([
    Order.countDocuments(filter),
    Order.find(filter)
      .populate('user', 'name email')
      .populate('service', 'name slug')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
  ]);

  const totalPages = Math.ceil(total / limit);

  return new SuccessResponse('Orders fetched successfully', orders, {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  }).send(res);
});

export const getTransactions = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { page, limit, skip, sort } = buildPaginationQuery(req.query as any);

  const filter: Record<string, unknown> = {};

  if (req.query.type) {
    filter.type = req.query.type;
  }

  if (req.query.status) {
    filter.status = req.query.status;
  }

  if (req.query.userId) {
    filter.user = req.query.userId;
  }

  if (req.query.startDate && req.query.endDate) {
    filter.createdAt = {
      $gte: new Date(req.query.startDate as string),
      $lte: new Date(req.query.endDate as string),
    };
  }

  const [total, transactions] = await Promise.all([
    Transaction.countDocuments(filter),
    Transaction.find(filter)
      .populate('user', 'name email')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
  ]);

  const totalPages = Math.ceil(total / limit);

  return new SuccessResponse('Transactions fetched successfully', transactions, {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  }).send(res);
});

export const getWithdrawals = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { page, limit, skip, sort } = buildPaginationQuery(req.query as any);

  const filter: Record<string, unknown> = {};

  if (req.query.status) {
    filter.status = req.query.status;
  }

  if (req.query.userId) {
    filter.user = req.query.userId;
  }

  if (req.query.paymentMethod) {
    filter.paymentMethod = req.query.paymentMethod;
  }

  const [total, withdrawals] = await Promise.all([
    Withdrawal.countDocuments(filter),
    Withdrawal.find(filter)
      .populate('user', 'name email')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
  ]);

  const totalPages = Math.ceil(total / limit);

  return new SuccessResponse('Withdrawals fetched successfully', withdrawals, {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  }).send(res);
});

export const approveWithdrawal = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const withdrawal = await Withdrawal.findById(id);
  if (!withdrawal) {
    return new NotFoundResponse('Withdrawal request not found').send(res);
  }

  if (withdrawal.status !== 'pending') {
    return new BadRequestResponse(`Cannot approve a ${withdrawal.status} withdrawal`).send(res);
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    withdrawal.status = 'completed';
    withdrawal.processedBy = req.user?._id as any;
    withdrawal.processedAt = new Date();
    await withdrawal.save({ session });

    const wallet = await Wallet.findById(withdrawal.wallet).session(session);
    if (wallet) {
      wallet.totalWithdrawn += withdrawal.amount;
      await wallet.save({ session });
    }

    const existingTransaction = await Transaction.findOne({
      reference: withdrawal.withdrawalId,
      type: 'withdrawal',
    }).session(session);

    if (existingTransaction) {
      existingTransaction.status = 'success';
      existingTransaction.balanceAfter = wallet?.balance || 0;
      await existingTransaction.save({ session });
    }

    await session.commitTransaction();

    await Notification.create({
      user: withdrawal.user,
      title: 'Withdrawal Approved',
      message: `Your withdrawal of ₹${withdrawal.amount} has been approved and processed.`,
      type: 'wallet',
      metadata: { withdrawalId: withdrawal._id },
    });

    return new SuccessResponse('Withdrawal approved successfully', withdrawal).send(res);
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});

export const rejectWithdrawal = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { reason } = req.body;

  const withdrawal = await Withdrawal.findById(id);
  if (!withdrawal) {
    return new NotFoundResponse('Withdrawal request not found').send(res);
  }

  if (withdrawal.status !== 'pending') {
    return new BadRequestResponse(`Cannot reject a ${withdrawal.status} withdrawal`).send(res);
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    withdrawal.status = 'rejected';
    withdrawal.rejectedReason = reason || 'Rejected by administrator';
    withdrawal.processedBy = req.user?._id as any;
    withdrawal.processedAt = new Date();
    await withdrawal.save({ session });

    const wallet = await Wallet.findById(withdrawal.wallet).session(session);
    if (wallet) {
      wallet.balance += withdrawal.amount;
      wallet.lastTransaction = new Date();
      await wallet.save({ session });

      const balanceBefore = wallet.balance - withdrawal.amount;

      await Transaction.create(
        [{
          user: withdrawal.user,
          wallet: wallet._id,
          type: 'refund',
          amount: withdrawal.amount,
          fees: 0,
          netAmount: withdrawal.amount,
          status: 'success',
          description: `Refund for rejected withdrawal ${withdrawal.withdrawalId}`,
          reference: withdrawal.withdrawalId,
          balanceBefore,
          balanceAfter: wallet.balance,
        }],
        { session },
      );
    }

    await session.commitTransaction();

    await Notification.create({
      user: withdrawal.user,
      title: 'Withdrawal Rejected',
      message: `Your withdrawal of ₹${withdrawal.amount} has been rejected. Reason: ${reason || 'No reason provided'}`,
      type: 'wallet',
      metadata: { withdrawalId: withdrawal._id },
    });

    return new SuccessResponse('Withdrawal rejected successfully', withdrawal).send(res);
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});

export const getTickets = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { page, limit, skip, sort } = buildPaginationQuery(req.query as any);

  const filter: Record<string, unknown> = {};

  if (req.query.status) {
    filter.status = req.query.status;
  }

  if (req.query.priority) {
    filter.priority = req.query.priority;
  }

  if (req.query.category) {
    filter.category = req.query.category;
  }

  if (req.query.userId) {
    filter.user = req.query.userId;
  }

  if (req.query.assignedTo) {
    filter.assignedTo = req.query.assignedTo;
  }

  const [total, tickets] = await Promise.all([
    Ticket.countDocuments(filter),
    Ticket.find(filter)
      .select('-messages')
      .populate('user', 'name email')
      .populate('assignedTo', 'name email')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
  ]);

  const totalPages = Math.ceil(total / limit);

  return new SuccessResponse('Tickets fetched successfully', tickets, {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  }).send(res);
});

export const assignTicket = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { assignedTo } = req.body;

  const ticket = await Ticket.findById(id);
  if (!ticket) {
    return new NotFoundResponse('Ticket not found').send(res);
  }

  const agent = await User.findById(assignedTo);
  if (!agent || (agent.role !== 'admin' && agent.role !== 'agent')) {
    return new BadRequestResponse('Assigned user must be an admin or agent').send(res);
  }

  ticket.assignedTo = assignedTo;
  if (ticket.status === 'open') {
    ticket.status = 'in_progress';
  }
  await ticket.save();

  await Notification.create({
    user: assignedTo,
    title: 'Ticket Assigned',
    message: `Ticket ${ticket.ticketId}: ${ticket.subject} has been assigned to you.`,
    type: 'ticket',
    link: `/admin/tickets/${ticket._id}`,
    metadata: { ticketId: ticket._id },
  });

  return new SuccessResponse('Ticket assigned successfully', ticket).send(res);
});

export const updateTicketStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  const ticket = await Ticket.findById(id);
  if (!ticket) {
    return new NotFoundResponse('Ticket not found').send(res);
  }

  const validTransitions: Record<string, string[]> = {
    open: ['in_progress', 'resolved', 'closed'],
    in_progress: ['resolved', 'closed', 'open'],
    resolved: ['closed', 'open'],
    closed: ['open'],
  };

  const allowedTransitions = validTransitions[ticket.status] || [];
  if (!allowedTransitions.includes(status)) {
    return new BadRequestResponse(
      `Cannot transition ticket from "${ticket.status}" to "${status}". Allowed: ${allowedTransitions.join(', ')}`,
    ).send(res);
  }

  ticket.status = status as any;
  if (status === 'resolved') {
    ticket.resolvedAt = new Date();
  } else if (status === 'closed') {
    ticket.closedAt = new Date();
  }
  await ticket.save();

  if (status === 'resolved' || status === 'closed') {
    await Notification.create({
      user: ticket.user,
      title: 'Ticket Updated',
      message: `Your ticket ${ticket.ticketId} has been marked as ${status}.`,
      type: 'ticket',
      link: `/tickets/${ticket.ticketId}`,
      metadata: { ticketId: ticket._id },
    });
  }

  return new SuccessResponse(`Ticket status updated to "${status}"`, ticket).send(res);
});

export const getRevenueReport = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { startDate, endDate, groupBy } = req.query;

  const start = startDate ? new Date(startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const end = endDate ? new Date(endDate as string) : new Date();

  let groupId: any;

  switch (groupBy) {
    case 'hour':
      groupId = {
        year: { $year: '$createdAt' },
        month: { $month: '$createdAt' },
        day: { $dayOfMonth: '$createdAt' },
        hour: { $hour: '$createdAt' },
      };
      break;
    case 'week':
      groupId = {
        isoWeekYear: { $isoWeekYear: '$createdAt' },
        isoWeek: { $isoWeek: '$createdAt' },
      };
      break;
    case 'month':
      groupId = {
        year: { $year: '$createdAt' },
        month: { $month: '$createdAt' },
      };
      break;
    case 'year':
      groupId = { year: { $year: '$createdAt' } };
      break;
    default:
      groupId = {
        year: { $year: '$createdAt' },
        month: { $month: '$createdAt' },
        day: { $dayOfMonth: '$createdAt' },
      };
  }

  const revenue = await Transaction.aggregate([
    {
      $match: {
        createdAt: { $gte: start, $lte: end },
        status: 'success',
        type: { $in: ['deposit', 'purchase', 'refund', 'commission'] },
      },
    },
    {
      $group: {
        _id: groupId,
        totalAmount: { $sum: '$amount' },
        totalFees: { $sum: '$fees' },
        netAmount: { $sum: '$netAmount' },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id': 1 } },
  ]);

  const summary = await Transaction.aggregate([
    {
      $match: {
        createdAt: { $gte: start, $lte: end },
        status: 'success',
      },
    },
    {
      $group: {
        _id: '$type',
        totalAmount: { $sum: '$amount' },
        totalFees: { $sum: '$fees' },
        netAmount: { $sum: '$netAmount' },
        count: { $sum: 1 },
      },
    },
  ]);

  const totals = await Transaction.aggregate([
    {
      $match: {
        createdAt: { $gte: start, $lte: end },
        status: 'success',
        type: { $in: ['deposit', 'purchase', 'commission'] },
      },
    },
    {
      $group: {
        _id: null,
        grossRevenue: { $sum: '$amount' },
        totalFees: { $sum: '$fees' },
        netRevenue: { $sum: '$netAmount' },
        transactionCount: { $sum: 1 },
      },
    },
  ]);

  return new SuccessResponse('Revenue report fetched successfully', {
    period: { start, end },
    summary,
    breakdown: revenue,
    totals: totals[0] || { grossRevenue: 0, totalFees: 0, netRevenue: 0, transactionCount: 0 },
  }).send(res);
});

export const updateSettings = asyncHandler(async (req: AuthRequest, res: Response) => {
  const settings = req.body;

  if (!mongoose.models.Setting) {
    mongoose.model('Setting', new mongoose.Schema({
      key: { type: String, unique: true },
      value: mongoose.Schema.Types.Mixed,
    }));
  }
  const Setting = mongoose.model('Setting');

  const results = [];
  for (const [key, value] of Object.entries(settings)) {
    const updated = await Setting.findOneAndUpdate(
      { key },
      { key, value },
      { upsert: true, new: true },
    );
    results.push(updated);
  }

  return new SuccessResponse('Settings updated successfully', results).send(res);
});
