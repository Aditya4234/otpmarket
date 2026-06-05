import { Response } from 'express';
import { AuthRequest } from '@/types';
import { asyncHandler } from '@/utils/asyncHandler';
import { SuccessResponse, CreatedResponse, NotFoundResponse } from '@/utils/apiResponse';
import * as tenantService from '@/services/tenant.service';

export const listTenants = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await tenantService.listTenants(req.query);
  return new SuccessResponse('Tenants fetched successfully', result.data, result.pagination).send(res);
});

export const getTenant = asyncHandler(async (req: AuthRequest, res: Response) => {
  const tenant = await tenantService.getTenantById(req.params.id);
  return new SuccessResponse('Tenant fetched successfully', tenant).send(res);
});

export const createTenant = asyncHandler(async (req: AuthRequest, res: Response) => {
  const tenant = await tenantService.createTenant(req.body);
  return new CreatedResponse('Tenant created successfully', tenant).send(res);
});

export const updateTenant = asyncHandler(async (req: AuthRequest, res: Response) => {
  const tenant = await tenantService.updateTenant(req.params.id, req.body);
  return new SuccessResponse('Tenant updated successfully', tenant).send(res);
});

export const suspendTenant = asyncHandler(async (req: AuthRequest, res: Response) => {
  const tenant = await tenantService.suspendTenant(req.params.id);
  if (!tenant) return new NotFoundResponse('Tenant not found').send(res);
  return new SuccessResponse('Tenant suspended successfully', tenant).send(res);
});

export const activateTenant = asyncHandler(async (req: AuthRequest, res: Response) => {
  const tenant = await tenantService.activateTenant(req.params.id);
  if (!tenant) return new NotFoundResponse('Tenant not found').send(res);
  return new SuccessResponse('Tenant activated successfully', tenant).send(res);
});

export const getTenantStats = asyncHandler(async (req: AuthRequest, res: Response) => {
  const stats = await tenantService.getTenantStats(req.params.id);
  return new SuccessResponse('Tenant stats fetched successfully', stats).send(res);
});
