import { Router } from 'express';
import {
  getWallet,
  addMoney,
  verifyPayment,
  getTransactions,
  requestWithdrawal,
  getWithdrawals,
  cancelWithdrawal,
} from '@/controllers/wallet.controller';
import { authenticate } from '@/middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', getWallet);
router.get('/transactions', getTransactions);
router.post('/deposit', addMoney);
router.post('/verify-deposit', verifyPayment);
router.post('/withdrawals', requestWithdrawal);
router.get('/withdrawals', getWithdrawals);
router.patch('/withdrawals/:id/cancel', cancelWithdrawal);

export default router;
