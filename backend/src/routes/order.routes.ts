import { Router } from 'express';
import {
  createOrder,
  getOrders,
  getOrder,
  checkOTP,
  cancelOrder,
} from '@/controllers/order.controller';
import { authenticate } from '@/middleware/auth';

const router = Router();

router.use(authenticate);

router.post('/', createOrder);
router.get('/', getOrders);
router.get('/:orderId', getOrder);
router.get('/:orderId/otp', checkOTP);
router.post('/:orderId/cancel', cancelOrder);

export default router;
