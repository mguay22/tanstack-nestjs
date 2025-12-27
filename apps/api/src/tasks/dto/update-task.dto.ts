import { createZodDto } from 'nestjs-zod';
import { UpdateTaskDtoSchema } from '@repo/shared-types';

export class UpdateTaskDto extends createZodDto(UpdateTaskDtoSchema) {}
