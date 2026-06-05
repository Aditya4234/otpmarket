import { Router } from 'express';
import { updateProfile, getDashboard } from '@/controllers/user.controller';
import { authenticate } from '@/middleware/auth';
import { uploadSingle } from '@/middleware/multerUpload';

const router = Router();

router.get('/dashboard', authenticate, getDashboard);
router.patch('/profile', authenticate, uploadSingle, updateProfile);

export default router;
