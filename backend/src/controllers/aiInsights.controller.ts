import { Response } from 'express';
import { AuthRequest } from '@/types';
import { asyncHandler } from '@/utils/asyncHandler';
import { SuccessResponse } from '@/utils/apiResponse';
import * as aiInsightsService from '@/services/aiInsights.service';

export const generateDashboardInsights = asyncHandler(async (req: AuthRequest, res: Response) => {
  const insights = await aiInsightsService.generateDashboardInsights(req.user!._id, req.query.tenantId as string);
  return new SuccessResponse('Dashboard insights generated successfully', insights).send(res);
});

export const generateUserInsights = asyncHandler(async (req: AuthRequest, res: Response) => {
  const insights = await aiInsightsService.generateUserInsights(req.params.userId);
  return new SuccessResponse('User insights generated successfully', insights).send(res);
});
