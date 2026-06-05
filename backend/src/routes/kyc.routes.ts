import { Router } from 'express';
import {
  submitKYC,
  uploadDocument,
  getStatus,
  listSubmissions,
  verifyKYC,
} from '@/controllers/kyc.controller';
import { authenticate, authorize } from '@/middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/status', getStatus);
router.post('/', submitKYC);
router.post('/documents', uploadDocument);

router.get('/', authorize('admin'), listSubmissions);
router.patch('/:id/verify', authorize('admin'), verifyKYC);

export default router;
