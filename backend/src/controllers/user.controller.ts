import { Response } from 'express';
import User from '@/models/User';
import Wallet from '@/models/Wallet';
import Order from '@/models/Order';
import Notification from '@/models/Notification';
import { AuthRequest } from '@/types';
import { asyncHandler } from '@/utils/asyncHandler';
import {
  SuccessResponse,
  NotFoundResponse,
} from '@/utils/apiResponse';
import { uploadToCloudinary, deleteFromCloudinary } from '@/services/cloudinary.service';
import { buildPaginationQuery } from '@/utils/helpers';

export const updateProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { name, phone } = req.body;

  const user = await User.findById(req.user?._id);
  if (!user) {
    return new NotFoundResponse('User not found').send(res);
  }

  if (name) user.name = name;
  if (phone) user.phone = phone;

  if (req.file) {
    if (user.avatar?.publicId) {
      await deleteFromCloudinary(user.avatar.publicId);
    }

    const result = await uploadToCloudinary(req.file.buffer, {
      folder: 'avatars',
      publicId: `user_${user._id}`,
    });

    user.avatar = {
      url: result.url,
      publicId: result.publicId,
    };
  }

  await user.save();

  return new SuccessResponse('Profile updated successfully', { user }).send(res);
});

export const getDashboard = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?._id;

  const [wallet, orderStats, recentOrders] = await Promise.all([
    Wallet.findOne({ user: userId }),
    Order.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: '$amount' },
          activeOrders: {
            $sum: { $cond: [{ $in: ['$status', ['pending', 'active']] }, 1, 0] },
          },
          completedOrders: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] },
          },
          cancelledOrders: {
            $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] },
          },
        },
      },
    ]),
    Order.find({ user: userId })
      .populate('service', 'name slug')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(),
  ]);

  const stats = orderStats[0] || {
    totalOrders: 0,
    totalSpent: 0,
    activeOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
  };

  return new SuccessResponse('Dashboard fetched successfully', {
    wallet,
    stats,
    recentOrders,
  }).send(res);
});

export const getNotifications = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?._id;
  const { page, limit, skip, sort } = buildPaginationQuery(req.query as any);

  const filter = { user: userId };

  const [total, notifications] = await Promise.all([
    Notification.countDocuments(filter),
    Notification.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
  ]);

  const unreadCount = await Notification.countDocuments({ user: userId, isRead: false });

  const totalPages = Math.ceil(total / limit);

  return new SuccessResponse('Notifications fetched successfully', notifications, {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
    unreadCount,
  }).send(res);
});

export const markNotificationRead = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user?._id;

  const notification = await Notification.findOneAndUpdate(
    { _id: id, user: userId },
    { isRead: true, readAt: new Date() },
    { new: true },
  );

  if (!notification) {
    return new NotFoundResponse('Notification not found').send(res);
  }

  return new SuccessResponse('Notification marked as read', notification).send(res);
});

export const markAllNotificationsRead = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?._id;

  await Notification.updateMany(
    { user: userId, isRead: false },
    { isRead: true, readAt: new Date() },
  );

  return new SuccessResponse('All notifications marked as read').send(res);
});
