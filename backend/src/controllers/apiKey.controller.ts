import { Response } from 'express';
import { AuthRequest } from '@/types';
import { asyncHandler } from '@/utils/asyncHandler';
import { SuccessResponse, CreatedResponse } from '@/utils/apiResponse';
import * as apiKeyService from '@/services/apiKey.service';

export const createKey = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await apiKeyService.createApiKey(req.user!._id, req.body);
  return new CreatedResponse('API key created successfully', result).send(res);
});

export const listKeys = asyncHandler(async (req: AuthRequest, res: Response) => {
  const keys = await apiKeyService.listApiKeys(req.user!._id);
  return new SuccessResponse('API keys fetched successfully', keys).send(res);
});

export const revokeKey = asyncHandler(async (req: AuthRequest, res: Response) => {
  const key = await apiKeyService.revokeApiKey(req.params.id, req.user!._id);
  return new SuccessResponse('API key revoked successfully', key).send(res);
});

export const updateKeyPermissions = asyncHandler(async (req: AuthRequest, res: Response) => {
  const key = await apiKeyService.updateApiKey(req.params.id, req.user!._id, req.body);
  return new SuccessResponse('API key updated successfully', key).send(res);
});
