import { Router } from 'express';
import {
  getServices,
  getServiceBySlug,
  getCategories,
  getCountries,
  getFeatured,
} from '@/controllers/service.controller';

const router = Router();

router.get('/', getServices);
router.get('/featured', getFeatured);
router.get('/categories', getCategories);
router.get('/countries', getCountries);
router.get('/:slug', getServiceBySlug);

export default router;
