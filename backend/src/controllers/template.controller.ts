import { Response } from 'express';
import { AuthRequest } from '@/types';
import { asyncHandler } from '@/utils/asyncHandler';
import { SuccessResponse, CreatedResponse } from '@/utils/apiResponse';
import * as templateService from '@/services/template.service';

export const listTemplates = asyncHandler(async (req: AuthRequest, res: Response) => {
  const templates = await templateService.getTemplates(req.query.category as string);
  return new SuccessResponse('Templates fetched successfully', templates).send(res);
});

export const getTemplate = asyncHandler(async (req: AuthRequest, res: Response) => {
  const template = await templateService.getTemplate(req.params.id);
  return new SuccessResponse('Template fetched successfully', template).send(res);
});

export const createTemplate = asyncHandler(async (req: AuthRequest, res: Response) => {
  const template = await templateService.createTemplate(req.body);
  return new CreatedResponse('Template created successfully', template).send(res);
});

export const updateTemplate = asyncHandler(async (req: AuthRequest, res: Response) => {
  const template = await templateService.updateTemplate(req.params.id, req.body);
  return new SuccessResponse('Template updated successfully', template).send(res);
});

export const deleteTemplate = asyncHandler(async (req: AuthRequest, res: Response) => {
  const template = await templateService.deleteTemplate(req.params.id);
  return new SuccessResponse('Template deleted successfully', template).send(res);
});

export const seedDefaults = asyncHandler(async (_req: AuthRequest, res: Response) => {
  await templateService.seedDefaultTemplates();
  return new SuccessResponse('Default templates seeded successfully').send(res);
});

export const sendTestEmail = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { slug, to, variables } = req.body;
  const result = await templateService.sendTemplateEmail(slug, to, variables);
  return new SuccessResponse(result.message).send(res);
});

export const renderPreview = asyncHandler(async (req: AuthRequest, res: Response) => {
  const template = await templateService.getTemplate(req.params.id);
  const rendered = templateService.renderTemplate(template, req.body.variables || {});
  return new SuccessResponse('Template rendered successfully', rendered).send(res);
});
