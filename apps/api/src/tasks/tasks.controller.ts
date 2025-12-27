import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ZodSerializerInterceptor } from 'nestjs-zod';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskResponseDto } from './dto/task-response.dto';
import { DeleteTaskResponseDto } from './dto/delete-task-response.dto';

@ApiTags('tasks')
@Controller('tasks')
@UseInterceptors(ZodSerializerInterceptor)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({ status: 201, description: 'Task created successfully', type: TaskResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  create(@Body() createTaskDto: CreateTaskDto): TaskResponseDto {
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tasks' })
  @ApiQuery({ name: 'status', required: false, enum: ['todo', 'in-progress', 'done'] })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiResponse({ status: 200, description: 'List of tasks', type: [TaskResponseDto] })
  findAll(
    @Query('status') status?: string,
    @Query('search') search?: string,
  ): TaskResponseDto[] {
    return this.tasksService.findAll(status, search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a task by ID' })
  @ApiResponse({ status: 200, description: 'Task found', type: TaskResponseDto })
  @ApiResponse({ status: 404, description: 'Task not found' })
  findOne(@Param('id') id: string): TaskResponseDto {
    return this.tasksService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a task' })
  @ApiResponse({ status: 200, description: 'Task updated successfully', type: TaskResponseDto })
  @ApiResponse({ status: 404, description: 'Task not found' })
  update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ): TaskResponseDto {
    return this.tasksService.update(id, updateTaskDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task' })
  @ApiResponse({ status: 200, description: 'Task deleted successfully', type: DeleteTaskResponseDto })
  @ApiResponse({ status: 404, description: 'Task not found' })
  remove(@Param('id') id: string): DeleteTaskResponseDto {
    this.tasksService.remove(id);
    return { success: true };
  }
}
