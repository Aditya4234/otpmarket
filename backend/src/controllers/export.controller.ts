import { Response } from 'express';
import { AuthRequest } from '@/types';
import { asyncHandler } from '@/utils/asyncHandler';
import * as exportService from '@/services/export.service';

export const exportOrders = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { format, data, title } = req.body;
  const filename = format === 'pdf'
    ? await exportService.exportToPDF(data, [], title || 'Orders Export')
    : await exportService.exportToExcel(data, [], title || 'Orders Export');
  const filePath = exportService.getExportFilePath(filename);
  return res.download(filePath, filename);
});

export const exportUsers = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { format, data, title } = req.body;
  const filename = format === 'pdf'
    ? await exportService.exportToPDF(data, [], title || 'Users Export')
    : await exportService.exportToExcel(data, [], title || 'Users Export');
  const filePath = exportService.getExportFilePath(filename);
  return res.download(filePath, filename);
});

export const exportTransactions = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { format, data, title } = req.body;
  const filename = format === 'pdf'
    ? await exportService.exportToPDF(data, [], title || 'Transactions Export')
    : await exportService.exportToExcel(data, [], title || 'Transactions Export');
  const filePath = exportService.getExportFilePath(filename);
  return res.download(filePath, filename);
});
