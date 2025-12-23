import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from './api';
import type { Task } from './types';

// Query Keys - centralized for easy cache management
export const taskKeys = {
  all: ['tasks'] as const,
  lists: () => [...taskKeys.all, 'list'] as const,
  list: (filters: { status?: string; search?: string }) =>
    [...taskKeys.lists(), filters] as const,
  details: () => [...taskKeys.all, 'detail'] as const,
  detail: (id: string) => [...taskKeys.details(), id] as const,
};

// Queries
export function useTasksQuery(filters: { status?: string; search?: string }) {
  return useQuery({
    queryKey: taskKeys.list(filters),
    queryFn: () => api.tasks.list(filters),
  });
}

export function useTaskQuery(id: string) {
  return useQuery({
    queryKey: taskKeys.detail(id),
    queryFn: () => api.tasks.get(id),
  });
}

// Mutations
export function useCreateTaskMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { title: string; description?: string }) =>
      api.tasks.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
  });
}

export function useUpdateTaskMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Task> }) =>
      api.tasks.update(id, data),
    onSuccess: (updatedTask) => {
      // Update the individual task cache
      queryClient.setQueryData(taskKeys.detail(updatedTask.id), updatedTask);
      // Invalidate lists to refetch
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
  });
}

export function useDeleteTaskMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.tasks.delete(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: taskKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
  });
}
