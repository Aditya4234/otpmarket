import { Router } from 'express';
import {
  listAlerts,
  resolveAlert,
  getFraudStats,
} from '@/controllers/fraud.controller';
import { authenticate, authorize } from '@/middleware/auth';

const router = Router();

router.use(authenticate, authorize('admin'));

router.get('/', listAlerts);
router.get('/stats', getFraudStats);
router.patch('/:id/resolve', resolveAlert);

export default router;
