import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { useTasksQuery, useCreateTaskMutation } from '../../lib/queries';
import type { Task, TaskStatusFilter } from '../../lib/types';

type TasksSearch = {
  status?: TaskStatusFilter;
  search?: string;
};

export const Route = createFileRoute('/tasks/')({
  validateSearch: (search: Record<string, unknown>): TasksSearch => ({
    status: (search.status as TaskStatusFilter) || 'all',
    search: (search.search as string) || '',
  }),
  component: TasksPage,
});

function TasksPage() {
  const { status, search } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const [isCreating, setIsCreating] = useState(false);

  // TanStack Query for data fetching with caching
  const { data: tasks, isLoading, error } = useTasksQuery({ status, search });

  const statusColors: Record<Task['status'], string> = {
    todo: 'bg-gray-100 text-gray-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    done: 'bg-green-100 text-green-800',
  };

  const handleStatusFilter = (newStatus: TaskStatusFilter) => {
    navigate({
      search: (prev) => ({ ...prev, status: newStatus }),
    });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    navigate({
      search: (prev) => ({ ...prev, search: e.target.value }),
    });
  };

  if (isLoading) {
    return <TasksLoading />;
  }

  if (error) {
    return <TasksError error={error} />;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
        <button
          onClick={() => setIsCreating(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          + New Task
        </button>
      </div>

      {/* Search & Filter - Demonstrates search params */}
      <div className="mb-6 space-y-4">
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={handleSearch}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <div className="flex gap-2">
          {(['all', 'todo', 'in-progress', 'done'] as const).map((s) => (
            <button
              key={s}
              onClick={() => handleStatusFilter(s)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                status === s
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {s === 'all' ? 'All' : s === 'in-progress' ? 'In Progress' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {!tasks || tasks.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No tasks found. Create one to get started!
          </div>
        ) : (
          tasks.map((task) => (
            <Link
              key={task.id}
              to="/tasks/$taskId"
              params={{ taskId: task.id }}
              className="block p-6 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                  <p className="text-gray-600 mt-1">{task.description}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[task.status]}`}>
                  {task.status}
                </span>
              </div>
            </Link>
          ))
        )}
      </div>

      {/* Create Task Modal */}
      {isCreating && (
        <CreateTaskModal onClose={() => setIsCreating(false)} />
      )}
    </div>
  );
}

function TasksLoading() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="h-12 bg-gray-200 rounded"></div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TasksError({ error }: { error: Error }) {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h2 className="text-red-800 text-lg font-semibold">Error loading tasks</h2>
        <p className="text-red-600 mt-2">{error.message}</p>
        <p className="text-red-500 text-sm mt-4">Make sure the API is running on localhost:3001</p>
      </div>
    </div>
  );
}

function CreateTaskModal({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const createMutation = useCreateTaskMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(
      { title, description },
      { onSuccess: () => onClose() }
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Create New Task</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {createMutation.isPending ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
