import { z } from 'zod';

const mongoIdRegex = /^[0-9a-fA-F]{24}$/;

export const createServiceSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Service name is required')
    .max(100, 'Service name cannot exceed 100 characters'),
  category: z
    .string()
    .regex(mongoIdRegex, 'Invalid category ID'),
  description: z
    .string()
    .trim()
    .min(10, 'Description must be at least 10 characters')
    .max(2000, 'Description cannot exceed 2000 characters'),
  price: z
    .number()
    .positive('Price must be positive')
    .min(0.01, 'Minimum price is 0.01'),
  country: z
    .string()
    .trim()
    .min(1, 'Country is required'),
  type: z
    .string()
    .trim()
    .min(1, 'Type is required'),
});

export const updateServiceSchema = createServiceSchema.partial();

export const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Category name is required')
    .max(50, 'Category name cannot exceed 50 characters'),
  description: z
    .string()
    .trim()
    .min(1, 'Description is required')
    .max(500, 'Description cannot exceed 500 characters'),
  icon: z
    .string()
    .trim()
    .optional(),
  displayOrder: z
    .number()
    .int('Display order must be an integer')
    .min(0, 'Display order must be a non-negative number'),
});

export type CreateServiceInput = z.infer<typeof createServiceSchema>;
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
