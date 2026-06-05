import { Router } from 'express';
import {
  createWebhook,
  listWebhooks,
  updateWebhook,
  deleteWebhook,
  regenerateSecret,
} from '@/controllers/webhook.controller';
import { authenticate } from '@/middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', listWebhooks);
router.post('/', createWebhook);
router.put('/:id', updateWebhook);
router.delete('/:id', deleteWebhook);
router.post('/:id/regenerate-secret', regenerateSecret);

export default router;
