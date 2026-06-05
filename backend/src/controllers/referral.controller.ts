import { Response } from 'express';
import { AuthRequest } from '@/types';
import { asyncHandler } from '@/utils/asyncHandler';
import { SuccessResponse, CreatedResponse } from '@/utils/apiResponse';
import * as referralService from '@/services/referral.service';

export const generateCode = asyncHandler(async (req: AuthRequest, res: Response) => {
  const code = await referralService.generateReferralCode(req.user!._id);
  return new CreatedResponse('Referral code generated successfully', code).send(res);
});

export const getStats = asyncHandler(async (req: AuthRequest, res: Response) => {
  const stats = await referralService.getReferralStats(req.user!._id);
  return new SuccessResponse('Referral stats fetched successfully', stats).send(res);
});

export const listReferrals = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await referralService.listReferrals(req.query);
  return new SuccessResponse('Referrals fetched successfully', result.data, result.pagination).send(res);
});

export const processReferral = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { code } = req.body;
  const referral = await referralService.processReferral(code, req.user!._id);
  return new SuccessResponse('Referral processed successfully', referral).send(res);
});
