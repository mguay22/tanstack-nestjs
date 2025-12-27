import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

const DeleteTaskResponseSchema = z.object({
  success: z.boolean(),
});

export class DeleteTaskResponseDto extends createZodDto(DeleteTaskResponseSchema) {}
