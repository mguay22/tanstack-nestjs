// Re-export shared types
export type {
  Task,
  TaskStatus,
  CreateTaskDto,
  UpdateTaskDto,
  TaskQueryParams,
} from '@repo/shared-types';

// Frontend-specific type for filtering (includes 'all')
import type { TaskStatus as TS } from '@repo/shared-types';
export type TaskStatusFilter = TS | 'all';
