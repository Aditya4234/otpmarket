import { Router } from 'express';
import {
  createTicket,
  getTickets,
  getTicket,
  addMessage,
  closeTicket,
} from '@/controllers/ticket.controller';
import { authenticate } from '@/middleware/auth';

const router = Router();

router.use(authenticate);

router.post('/', createTicket);
router.get('/', getTickets);
router.get('/:ticketId', getTicket);
router.post('/:ticketId/messages', addMessage);
router.patch('/:ticketId/close', closeTicket);

export default router;
