import { Response } from 'express';
import { AuthRequest } from '@/types';
import { asyncHandler } from '@/utils/asyncHandler';
import { SuccessResponse } from '@/utils/apiResponse';
import * as activityLogService from '@/services/activityLog.service';

export const listLogs = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await activityLogService.getActivityLogs(req.query);
  return new SuccessResponse('Activity logs fetched successfully', result.data, result.pagination).send(res);
});

export const getUserSummary = asyncHandler(async (req: AuthRequest, res: Response) => {
  const summary = await activityLogService.getUserActivitySummary(req.params.userId);
  return new SuccessResponse('User activity summary fetched successfully', summary).send(res);
});

export const getAuditTrail = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { resource, resourceId } = req.params;
  const trail = await activityLogService.getAuditTrail(resource, resourceId);
  return new SuccessResponse('Audit trail fetched successfully', trail).send(res);
});
