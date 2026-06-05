import { Response } from 'express';
import { AuthRequest } from '@/types';
import { asyncHandler } from '@/utils/asyncHandler';
import { SuccessResponse } from '@/utils/apiResponse';
import * as twoFactorService from '@/services/twoFactor.service';

export const generateSecret = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await twoFactorService.generateTwoFactorSecret(req.user!._id);
  return new SuccessResponse('2FA secret generated successfully', result).send(res);
});

export const verifyAndEnable = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { token } = req.body;
  const result = await twoFactorService.verifyAndEnable2FA(req.user!._id, token);
  return new SuccessResponse(result.message, { backupCodes: result.backupCodes }).send(res);
});

export const disable = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { token } = req.body;
  const result = await twoFactorService.disableTwoFactor(req.user!._id, token);
  return new SuccessResponse(result.message).send(res);
});

export const getStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
  const status = await twoFactorService.getTwoFactorStatus(req.user!._id);
  return new SuccessResponse('2FA status fetched successfully', status).send(res);
});

export const generateBackupCodes = asyncHandler(async (req: AuthRequest, res: Response) => {
  const codes = await twoFactorService.generateBackupCodes(req.user!._id);
  return new SuccessResponse('Backup codes generated successfully', { codes }).send(res);
});

export const verifyToken = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { token } = req.body;
  const valid = await twoFactorService.verifyTwoFactorToken(req.user!._id, token);
  return new SuccessResponse('Token verified successfully', { valid }).send(res);
});
