import { Response } from 'express';
import { AuthRequest } from '@/types';
import { asyncHandler } from '@/utils/asyncHandler';
import { SuccessResponse } from '@/utils/apiResponse';
import * as kycService from '@/services/kyc.service';

export const submitKYC = asyncHandler(async (req: AuthRequest, res: Response) => {
  const kyc = await kycService.submitKYC(req.user!._id, req.body);
  return new SuccessResponse('KYC submitted successfully', kyc).send(res);
});

export const uploadDocument = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { documentType } = req.body;
  const kyc = await kycService.uploadKycDocument(req.user!._id, req.file, documentType);
  return new SuccessResponse('Document uploaded successfully', kyc).send(res);
});

export const verifyKYC = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { status, rejectionReason } = req.body;
  const kyc = await kycService.verifyKYC(req.params.id, req.user!._id, status, rejectionReason);
  return new SuccessResponse(`KYC ${status} successfully`, kyc).send(res);
});

export const listSubmissions = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await kycService.listKycSubmissions(req.query);
  return new SuccessResponse('KYC submissions fetched successfully', result.data, result.pagination).send(res);
});

export const getStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
  const kyc = await kycService.getKycStatus(req.user!._id);
  return new SuccessResponse('KYC status fetched successfully', kyc).send(res);
});
