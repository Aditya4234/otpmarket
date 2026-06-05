import { Router } from 'express';
import {
  listTenants,
  getTenant,
  createTenant,
  updateTenant,
  suspendTenant,
  activateTenant,
} from '@/controllers/tenant.controller';
import { authenticate, authorize } from '@/middleware/auth';

const router = Router();

router.use(authenticate, authorize('admin'));

router.get('/', listTenants);
router.get('/:id', getTenant);
router.post('/', createTenant);
router.put('/:id', updateTenant);
router.patch('/:id/suspend', suspendTenant);
router.patch('/:id/activate', activateTenant);

export default router;
