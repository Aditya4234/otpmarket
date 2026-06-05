import { Response } from 'express';
import { AuthRequest } from '@/types';
import { asyncHandler } from '@/utils/asyncHandler';
import { SuccessResponse, CreatedResponse } from '@/utils/apiResponse';
import * as billingService from '@/services/billing.service';

export const createSubscription = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { tenantId, plan, billingCycle } = req.body;
  const subscription = await billingService.createSubscription(tenantId, plan, billingCycle);
  return new CreatedResponse('Subscription created successfully', subscription).send(res);
});

export const getSubscription = asyncHandler(async (req: AuthRequest, res: Response) => {
  const subscription = await billingService.getSubscription(req.params.tenantId);
  return new SuccessResponse('Subscription fetched successfully', subscription).send(res);
});

export const cancelSubscription = asyncHandler(async (req: AuthRequest, res: Response) => {
  const subscription = await billingService.cancelSubscription(req.params.id);
  return new SuccessResponse('Subscription cancelled successfully', subscription).send(res);
});

export const upgradePlan = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { tenantId, plan, billingCycle } = req.body;
  const subscription = await billingService.createSubscription(tenantId, plan, billingCycle);
  return new SuccessResponse('Plan upgraded successfully', subscription).send(res);
});

export const downgradePlan = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { tenantId, plan, billingCycle } = req.body;
  const subscription = await billingService.createSubscription(tenantId, plan, billingCycle);
  return new SuccessResponse('Plan downgraded successfully', subscription).send(res);
});

export const listInvoices = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await billingService.getInvoices(req.params.tenantId, req.query);
  return new SuccessResponse('Invoices fetched successfully', result.data, result.pagination).send(res);
});

export const generateInvoice = asyncHandler(async (req: AuthRequest, res: Response) => {
  const invoice = await billingService.generateInvoice(req.params.subscriptionId);
  return new CreatedResponse('Invoice generated successfully', invoice).send(res);
});

export const listPlans = asyncHandler(async (_req: AuthRequest, res: Response) => {
  return new SuccessResponse('Plans fetched successfully', billingService.PLANS).send(res);
});
