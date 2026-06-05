import { Router } from 'express';
import {
  generateCode,
  getStats,
  listReferrals,
} from '@/controllers/referral.controller';
import { authenticate, authorize } from '@/middleware/auth';

const router = Router();

router.use(authenticate);

router.post('/code', generateCode);
router.get('/stats', getStats);
router.get('/', authorize('admin'), listReferrals);

export default router;
