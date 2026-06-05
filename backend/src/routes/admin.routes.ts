import { Router } from 'express';
import {
  getDashboardStats,
  getUsers,
  getUser,
  updateUserStatus,
  updateUserRole,
  getServices,
  createService,
  updateService,
  deleteService,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getAgents,
  verifyAgent,
  getAllOrders,
  getTransactions,
  getWithdrawals,
  approveWithdrawal,
  rejectWithdrawal,
  getTickets,
  assignTicket,
  updateTicketStatus,
  getRevenueReport,
  updateSettings,
} from '@/controllers/admin.controller';
import { authenticate, authorize } from '@/middleware/auth';
import { uploadFields } from '@/middleware/multerUpload';

const router = Router();

router.use(authenticate, authorize('admin'));

router.get('/dashboard', getDashboardStats);
router.get('/reports', getRevenueReport);

router.get('/users', getUsers);
router.get('/users/:id', getUser);
router.patch('/users/:id/status', updateUserStatus);
router.patch('/users/:id/role', updateUserRole);

router.get('/agents', getAgents);
router.patch('/agents/:id/verify', verifyAgent);

router.get('/services', getServices);
router.post('/services', uploadFields, createService);
router.put('/services/:id', uploadFields, updateService);
router.delete('/services/:id', deleteService);

router.get('/categories', getCategories);
router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

router.get('/orders', getAllOrders);

router.get('/transactions', getTransactions);

router.get('/withdrawals', getWithdrawals);
router.patch('/withdrawals/:id/approve', approveWithdrawal);
router.patch('/withdrawals/:id/reject', rejectWithdrawal);
router.patch('/withdrawals/:id/process', approveWithdrawal);

router.get('/tickets', getTickets);
router.patch('/tickets/:id/status', updateTicketStatus);
router.patch('/tickets/:id/assign', assignTicket);

router.patch('/settings', updateSettings);

export default router;
