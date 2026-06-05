import { Router } from 'express';
import {
  getDashboardAnalytics,
  getUserAnalytics,
  getAgentAnalytics,
  getSystemAnalytics,
} from '@/controllers/analytics.controller';
import { authenticate, authorize } from '@/middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/dashboard', authorize('admin'), getDashboardAnalytics);
router.get('/user', getUserAnalytics);
router.get('/agent', getAgentAnalytics);
router.get('/system', authorize('admin'), getSystemAnalytics);

export default router;
