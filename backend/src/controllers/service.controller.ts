import { Response } from 'express';
import Service from '@/models/Service';
import Category from '@/models/Category';
import { AuthRequest } from '@/types';
import { asyncHandler } from '@/utils/asyncHandler';
import { SuccessResponse, NotFoundResponse } from '@/utils/apiResponse';
import { buildPaginationQuery } from '@/utils/helpers';

export const getServices = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { page, limit, skip, sort } = buildPaginationQuery(req.query as any);

  const filter: Record<string, unknown> = { isActive: true };

  if (req.query.category) {
    filter.category = req.query.category;
  }

  if (req.query.country) {
    filter.country = { $regex: req.query.country as string, $options: 'i' };
  }

  if (req.query.type) {
    filter.type = req.query.type;
  }

  if (req.query.search) {
    filter.$or = [
      { name: { $regex: req.query.search as string, $options: 'i' } },
      { description: { $regex: req.query.search as string, $options: 'i' } },
      { tags: { $regex: req.query.search as string, $options: 'i' } },
    ] as Record<string, unknown>[];
  }

  if (req.query.minPrice || req.query.maxPrice) {
    filter.price = {};
    if (req.query.minPrice) {
      (filter.price as Record<string, unknown>).$gte = parseFloat(req.query.minPrice as string);
    }
    if (req.query.maxPrice) {
      (filter.price as Record<string, unknown>).$lte = parseFloat(req.query.maxPrice as string);
    }
  }

  if (req.query.provider) {
    filter.provider = { $regex: req.query.provider as string, $options: 'i' };
  }

  const [total, services] = await Promise.all([
    Service.countDocuments(filter),
    Service.find(filter)
      .populate('category', 'name slug')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
  ]);

  const totalPages = Math.ceil(total / limit);

  return new SuccessResponse('Services fetched successfully', services, {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  }).send(res);
});

export const getServiceBySlug = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { slug } = req.params;

  const service = await Service.findOne({ slug, isActive: true })
    .populate('category', 'name slug description')
    .lean();

  if (!service) {
    return new NotFoundResponse('Service not found').send(res);
  }

  const relatedServices = await Service.find({
    category: service.category,
    _id: { $ne: service._id },
    isActive: true,
  })
    .select('name slug price country type')
    .limit(4)
    .lean();

  return new SuccessResponse('Service fetched successfully', {
    service,
    relatedServices,
  }).send(res);
});

export const getCategories = asyncHandler(async (_req: AuthRequest, res: Response) => {
  const categories = await Category.find({ isActive: true })
    .sort({ displayOrder: 1, name: 1 })
    .lean();

  const categoriesWithCount = await Promise.all(
    categories.map(async (category) => {
      const serviceCount = await Service.countDocuments({
        category: category._id,
        isActive: true,
      });
      return { ...category, serviceCount };
    }),
  );

  return new SuccessResponse('Categories fetched successfully', categoriesWithCount).send(res);
});

export const getCountries = asyncHandler(async (_req: AuthRequest, res: Response) => {
  const countriesWithCodes = await Service.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: { country: '$country', countryCode: '$countryCode' },
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        country: '$_id.country',
        countryCode: '$_id.countryCode',
        count: 1,
      },
    },
    { $sort: { country: 1 } },
  ]);

  return new SuccessResponse('Countries fetched successfully', countriesWithCodes).send(res);
});

export const getFeatured = asyncHandler(async (_req: AuthRequest, res: Response) => {
  const services = await Service.find({ isActive: true, isAvailable: true })
    .populate('category', 'name slug')
    .sort({ createdAt: -1 })
    .limit(12)
    .lean();

  return new SuccessResponse('Featured services fetched successfully', services).send(res);
});
