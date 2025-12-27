import { createZodDto } from 'nestjs-zod';
import { TaskQueryParamsSchema } from '@repo/shared-types';

export class TaskQueryParamsDto extends createZodDto(TaskQueryParamsSchema) {}
