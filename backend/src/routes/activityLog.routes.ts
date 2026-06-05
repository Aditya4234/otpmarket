import { Router } from 'express';
import {
  listLogs,
  getUserSummary,
  getAuditTrail,
} from '@/controllers/activityLog.controller';
import { authenticate, authorize } from '@/middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', authorize('admin'), listLogs);
router.get('/user/:userId/summary', authorize('admin'), getUserSummary);
router.get('/audit/:resource/:resourceId', authorize('admin'), getAuditTrail);

export default router;
