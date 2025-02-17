import { z } from 'zod';

export const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH'], {
    errorMap: () => ({ message: 'Priority is required' }),
  }),
  dueDate: z.string().optional(),
});