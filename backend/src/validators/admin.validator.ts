import { z } from 'zod';

const mongoIdRegex = /^[0-9a-fA-F]{24}$/;

export const updateUserRoleSchema = z.object({
  role: z
    .enum(['user', 'agent', 'admin'], {
      message: 'Role must be user, agent, or admin',
    }),
  userId: z
    .string()
    .regex(mongoIdRegex, 'Invalid user ID'),
});

export const settingsSchema = z
  .record(
    z.string().min(1, 'Setting key is required'),
    z.union([z.string(), z.number(), z.boolean()])
  )
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one setting is required',
  });

export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>;
export type SettingsInput = z.infer<typeof settingsSchema>;
