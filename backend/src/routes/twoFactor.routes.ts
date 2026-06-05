import { Router } from 'express';
import {
  generateSecret,
  verifyAndEnable,
  disable,
  getStatus,
  generateBackupCodes,
  verifyToken,
} from '@/controllers/twoFactor.controller';
import { authenticate } from '@/middleware/auth';

const router = Router();

router.post('/generate', generateSecret);
router.post('/verify', verifyAndEnable);
router.post('/disable', authenticate, disable);
router.get('/status', authenticate, getStatus);
router.post('/backup-codes', authenticate, generateBackupCodes);
router.post('/verify-token', verifyToken);

export default router;
