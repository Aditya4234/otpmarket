import { Router } from 'express';
import {
  generateDashboardInsights,
  generateUserInsights,
} from '@/controllers/aiInsights.controller';
import { authenticate } from '@/middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/dashboard', generateDashboardInsights);
router.get('/user', generateUserInsights);

export default router;
