import { Response } from 'express';
import { AuthRequest } from '@/types';
import { asyncHandler } from '@/utils/asyncHandler';
import { SuccessResponse } from '@/utils/apiResponse';
import * as fraudService from '@/services/fraud.service';

export const listAlerts = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await fraudService.listFraudAlerts(req.query);
  return new SuccessResponse('Fraud alerts fetched successfully', result.data, result.pagination).send(res);
});

export const resolveAlert = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { resolution } = req.body;
  const alert = await fraudService.resolveFraudAlert(req.params.id, resolution, req.user!._id);
  return new SuccessResponse('Fraud alert resolved successfully', alert).send(res);
});

export const getFraudStats = asyncHandler(async (_req: AuthRequest, res: Response) => {
  const stats = await fraudService.getFraudStats();
  return new SuccessResponse('Fraud stats fetched successfully', stats).send(res);
});
