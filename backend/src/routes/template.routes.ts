import { Router } from 'express';
import {
  seedDefaults,
  listTemplates,
  getTemplate,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  sendTestEmail,
  renderPreview,
} from '@/controllers/template.controller';
import { authenticate } from '@/middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', listTemplates);
router.get('/:id', getTemplate);
router.post('/', createTemplate);
router.post('/seed', seedDefaults);
router.post('/render-preview', renderPreview);
router.put('/:id', updateTemplate);
router.delete('/:id', deleteTemplate);
router.post('/:id/test', sendTestEmail);

export default router;
