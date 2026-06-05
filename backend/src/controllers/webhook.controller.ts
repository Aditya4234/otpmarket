import { Response } from 'express';
import { AuthRequest } from '@/types';
import { asyncHandler } from '@/utils/asyncHandler';
import { SuccessResponse, CreatedResponse } from '@/utils/apiResponse';
import * as webhookService from '@/services/webhook.service';

export const createWebhook = asyncHandler(async (req: AuthRequest, res: Response) => {
  const webhook = await webhookService.createWebhook(req.user!._id, req.body);
  return new CreatedResponse('Webhook created successfully', webhook).send(res);
});

export const listWebhooks = asyncHandler(async (req: AuthRequest, res: Response) => {
  const webhooks = await webhookService.listWebhooks(req.user!._id);
  return new SuccessResponse('Webhooks fetched successfully', webhooks).send(res);
});

export const updateWebhook = asyncHandler(async (req: AuthRequest, res: Response) => {
  const webhook = await webhookService.updateWebhook(req.params.id, req.user!._id, req.body);
  return new SuccessResponse('Webhook updated successfully', webhook).send(res);
});

export const deleteWebhook = asyncHandler(async (req: AuthRequest, res: Response) => {
  const webhook = await webhookService.deleteWebhook(req.params.id, req.user!._id);
  return new SuccessResponse('Webhook deleted successfully', webhook).send(res);
});

export const regenerateSecret = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await webhookService.regenerateWebhookSecret(req.params.id, req.user!._id);
  return new SuccessResponse('Webhook secret regenerated successfully', result).send(res);
});

export const testWebhook = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { event, payload } = req.body;
  const results = await webhookService.triggerWebhook(event, undefined, payload);
  return new SuccessResponse('Webhook test completed', results).send(res);
});
