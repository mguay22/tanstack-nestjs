import { z } from 'zod';

// Task status enum
export const TaskStatusSchema = z.enum(['todo', 'in-progress', 'done']);
export type TaskStatus = z.infer<typeof TaskStatusSchema>;

// Base Task schema
export const TaskSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1, 'Title is required'),
  description: z.string(),
  status: TaskStatusSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Task = z.infer<typeof TaskSchema>;

// Create Task DTO schema
export const CreateTaskDtoSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  description: z.string().optional().default(''),
});

export type CreateTaskDto = z.infer<typeof CreateTaskDtoSchema>;

// Update Task DTO schema
export const UpdateTaskDtoSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters').optional(),
  description: z.string().optional(),
  status: TaskStatusSchema.optional(),
});

export type UpdateTaskDto = z.infer<typeof UpdateTaskDtoSchema>;

// Query params schema for filtering tasks
export const TaskQueryParamsSchema = z.object({
  status: TaskStatusSchema.optional(),
  search: z.string().optional(),
});

export type TaskQueryParams = z.infer<typeof TaskQueryParamsSchema>;
