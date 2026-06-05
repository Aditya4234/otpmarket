import { Router } from 'express';
import {
  getDashboard,
  getNumbers,
  updateNumberStatus,
  getEarnings,
  getWithdrawals,
  requestWithdrawal,
  getOTPLogs,
} from '@/controllers/agent.controller';
import { authenticate, authorize } from '@/middleware/auth';

const router = Router();

router.use(authenticate, authorize('agent'));

router.get('/dashboard', getDashboard);
router.get('/numbers', getNumbers);
router.patch('/numbers/:orderId/status', updateNumberStatus);
router.get('/earnings', getEarnings);
router.get('/withdrawals', getWithdrawals);
router.post('/withdrawals', requestWithdrawal);
router.get('/otp-logs', getOTPLogs);

export default router;
