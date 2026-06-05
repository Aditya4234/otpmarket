import { Router } from 'express';
import {
  exportOrders,
  exportUsers,
  exportTransactions,
} from '@/controllers/export.controller';
import { authenticate } from '@/middleware/auth';

const router = Router();

router.use(authenticate);

router.post('/orders', exportOrders);
router.post('/users', exportUsers);
router.post('/transactions', exportTransactions);

export default router;
