import { Router } from 'express';
import {
  createSession,
  sendMessage,
  assignChat,
  closeChat,
  rateChat,
  getActiveChats,
  getChatHistory,
  listChats,
  getChatById,
} from '@/controllers/chat.controller';
import { authenticate, authorize } from '@/middleware/auth';

const router = Router();

router.use(authenticate);

router.post('/sessions', createSession);
router.post('/:id/messages', sendMessage);
router.patch('/:id/assign', authorize('admin'), assignChat);
router.patch('/:id/close', closeChat);
router.post('/:id/rate', rateChat);
router.get('/active', getActiveChats);
router.get('/history', getChatHistory);
router.get('/', authorize('admin'), listChats);
router.get('/:id', getChatById);

export default router;
