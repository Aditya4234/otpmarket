import { Response } from 'express';
import { AuthRequest } from '@/types';
import { asyncHandler } from '@/utils/asyncHandler';
import { SuccessResponse } from '@/utils/apiResponse';
import * as analyticsService from '@/services/analytics.service';

export const getDashboardAnalytics = asyncHandler(async (req: AuthRequest, res: Response) => {
  const analytics = await analyticsService.getDashboardAnalytics(req.query.tenantId as string);
  return new SuccessResponse('Dashboard analytics fetched successfully', analytics).send(res);
});

export const getUserAnalytics = asyncHandler(async (req: AuthRequest, res: Response) => {
  const analytics = await analyticsService.getUserAnalytics(req.params.userId);
  return new SuccessResponse('User analytics fetched successfully', analytics).send(res);
});

export const getAgentAnalytics = asyncHandler(async (req: AuthRequest, res: Response) => {
  const analytics = await analyticsService.getAgentAnalytics(req.params.agentId);
  return new SuccessResponse('Agent analytics fetched successfully', analytics).send(res);
});

export const getSystemAnalytics = asyncHandler(async (_req: AuthRequest, res: Response) => {
  const analytics = await analyticsService.getSystemAnalytics();
  return new SuccessResponse('System analytics fetched successfully', analytics).send(res);
});
