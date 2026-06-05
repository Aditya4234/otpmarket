import { z } from 'zod';

const mongoIdRegex = /^[0-9a-fA-F]{24}$/;

export const createOrderSchema = z.object({
  serviceId: z
    .string()
    .regex(mongoIdRegex, 'Invalid service ID'),
  country: z
    .string()
    .trim()
    .min(1, 'Country is required'),
  platform: z
    .string()
    .trim()
    .min(1, 'Platform is required'),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
