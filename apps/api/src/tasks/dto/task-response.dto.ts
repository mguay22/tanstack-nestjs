import { createZodDto } from 'nestjs-zod';
import { TaskSchema } from '@repo/shared-types';

export class TaskResponseDto extends createZodDto(TaskSchema) {}
