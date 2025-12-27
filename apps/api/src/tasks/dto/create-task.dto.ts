import { createZodDto } from 'nestjs-zod';
import { CreateTaskDtoSchema } from '@repo/shared-types';

export class CreateTaskDto extends createZodDto(CreateTaskDtoSchema) {}
