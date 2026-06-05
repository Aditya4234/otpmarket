import { Response } from 'express';
import Notification from '@/models/Notification';
import { AuthRequest } from '@/types';
import { asyncHandler } from '@/utils/asyncHandler';
import { SuccessResponse, NotFoundResponse } from '@/utils/apiResponse';
import { buildPaginationQuery } from '@/utils/helpers';

export const getNotifications = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?._id;
  const { page, limit, skip, sort } = buildPaginationQuery(req.query as any);

  const filter: Record<string, unknown> = { user: userId };

  if (req.query.type) {
    filter.type = req.query.type;
  }

  if (req.query.isRead === 'true') {
    filter.isRead = true;
  } else if (req.query.isRead === 'false') {
    filter.isRead = false;
  }

  const [total, notifications, unreadCount] = await Promise.all([
    Notification.countDocuments(filter),
    Notification.find(filter).sort(sort).skip(skip).limit(limit).lean(),
    Notification.countDocuments({ user: userId, isRead: false }),
  ]);

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

export const markAsRead = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const notification = await Notification.findOneAndUpdate(
    { _id: id, user: req.user?._id },
    { isRead: true, readAt: new Date() },
    { new: true },
  );

  if (!notification) {
    return new NotFoundResponse('Notification not found').send(res);
  }

  return new SuccessResponse('Notification marked as read', notification).send(res);
});

export const markAllAsRead = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await Notification.updateMany(
    { user: req.user?._id, isRead: false },
    { isRead: true, readAt: new Date() },
  );

  return new SuccessResponse('All notifications marked as read', {
    modifiedCount: result.modifiedCount,
  }).send(res);
});
