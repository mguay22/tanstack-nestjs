import type { Task, CreateTaskDto, UpdateTaskDto } from './types';

const API_URL = import.meta.env.VITE_API_URL;

export const api = {
  tasks: {
    list: async (params?: { status?: string; search?: string }): Promise<Task[]> => {
      const searchParams = new URLSearchParams();
      if (params?.status && params.status !== 'all') {
        searchParams.set('status', params.status);
      }
      if (params?.search) {
        searchParams.set('search', params.search);
      }
      const query = searchParams.toString();
      const res = await fetch(`${API_URL}/tasks${query ? `?${query}` : ''}`);
      if (!res.ok) throw new Error('Failed to fetch tasks');
      return res.json();
    },

    get: async (id: string): Promise<Task> => {
      const res = await fetch(`${API_URL}/tasks/${id}`);
      if (!res.ok) throw new Error('Task not found');
      return res.json();
    },

    create: async (data: CreateTaskDto): Promise<Task> => {
      const res = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create task');
      return res.json();
    },

    update: async (id: string, data: UpdateTaskDto): Promise<Task> => {
      const res = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update task');
      return res.json();
    },

    delete: async (id: string): Promise<void> => {
      const res = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete task');
    },
  },
};
