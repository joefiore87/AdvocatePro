import { z } from 'zod';

// Content update validation schema
export const contentUpdateSchema = z.object({
  categoryId: z.string().regex(/^[a-zA-Z0-9_]+$/),
  itemId: z.string().regex(/^[a-zA-Z0-9_]+$/),
  value: z.string().min(1).max(10000)
});

// Content initialization validation schema
export const contentInitSchema = z.object({
  force: z.boolean().optional()
});

// User role validation schema
export const userRoleSchema = z.object({
  email: z.string().email(),
  role: z.enum(['admin', 'customer'])
});