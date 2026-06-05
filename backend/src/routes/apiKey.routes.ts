import { Router } from 'express';
import {
  createKey,
  listKeys,
  updateKeyPermissions,
  revokeKey,
} from '@/controllers/apiKey.controller';
import { authenticate } from '@/middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', listKeys);
router.post('/', createKey);
router.put('/:id', updateKeyPermissions);
router.delete('/:id', revokeKey);

export default router;
