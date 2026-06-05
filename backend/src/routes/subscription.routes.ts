import { Router } from 'express';
import {
  createSubscription,
  getSubscription,
  cancelSubscription,
  listInvoices,
  generateInvoice,
} from '@/controllers/subscription.controller';
import { authenticate } from '@/middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/:tenantId', getSubscription);
router.post('/', createSubscription);
router.post('/cancel', cancelSubscription);
router.get('/invoices', listInvoices);
router.post('/invoices/generate', generateInvoice);

export default router;
