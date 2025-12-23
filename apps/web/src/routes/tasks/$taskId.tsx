import { createFileRoute, Link, useNavigate, useRouter } from '@tanstack/react-router';
import { useState } from 'react';
import { api } from '../../lib/api';
import type { Task } from '../../lib/types';

export const Route = createFileRoute('/tasks/$taskId')({
  loader: async ({ params }) => {
    return api.tasks.get(params.taskId);
  },
  pendingComponent: () => <TaskLoading />,
  errorComponent: ({ error }) => <TaskError error={error} />,
  component: TaskDetailPage,
});

function TaskLoading() {
  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-gray-200 rounded w-20"></div>
        <div className="h-10 bg-gray-200 rounded w-3/4"></div>
        <div className="h-6 bg-gray-200 rounded w-24"></div>
        <div className="h-24 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}

function TaskError({ error }: { error: Error }) {
  return (
    <div className="p-8 max-w-2xl mx-auto">
      <Link to="/tasks" className="text-blue-600 hover:underline mb-4 inline-block">
        &larr; Back to tasks
      </Link>
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h2 className="text-red-800 text-lg font-semibold">Error loading task</h2>
        <p className="text-red-600 mt-2">{error.message}</p>
      </div>
    </div>
  );
}

function TaskDetailPage() {
  const task = Route.useLoaderData();
  const router = useRouter();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const statusColors: Record<Task['status'], string> = {
    todo: 'bg-gray-100 text-gray-800 border-gray-300',
    'in-progress': 'bg-blue-100 text-blue-800 border-blue-300',
    done: 'bg-green-100 text-green-800 border-green-300',
  };

  const handleStatusChange = async (newStatus: Task['status']) => {
    setIsPending(true);
    try {
      await api.tasks.update(task.id, { status: newStatus });
      router.invalidate();
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setIsPending(false);
    }
  };

  const handleDelete = async () => {
    setIsPending(true);
    try {
      await api.tasks.delete(task.id);
      navigate({ to: '/tasks' });
    } catch (error) {
      console.error('Failed to delete task:', error);
      setIsPending(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <Link to="/tasks" className="text-blue-600 hover:underline mb-6 inline-block">
        &larr; Back to tasks
      </Link>

      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{task.title}</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Edit
            </button>
            <button
              onClick={() => setIsDeleting(true)}
              className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              Delete
            </button>
          </div>
        </div>

        {/* Status Selector - Demonstrates mutations with pending state */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <div className="flex gap-2">
            {(['todo', 'in-progress', 'done'] as const).map((status) => (
              <button
                key={status}
                onClick={() => handleStatusChange(status)}
                disabled={isPending}
                className={`px-4 py-2 rounded-lg text-sm font-medium border-2 transition-all disabled:opacity-50 ${
                  task.status === status
                    ? statusColors[status] + ' border-current'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                }`}
              >
                {status === 'in-progress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
          {isPending && (
            <p className="text-sm text-blue-600 mt-2 animate-pulse">Updating...</p>
          )}
        </div>

        <div className="mb-6">
          <h2 className="text-sm font-medium text-gray-700 mb-2">Description</h2>
          <p className="text-gray-600 whitespace-pre-wrap">
            {task.description || 'No description'}
          </p>
        </div>

        <div className="text-sm text-gray-500 space-y-1 border-t border-gray-200 pt-4">
          <p>Created: {new Date(task.createdAt).toLocaleString()}</p>
          <p>Updated: {new Date(task.updatedAt).toLocaleString()}</p>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <EditTaskModal task={task} onClose={() => setIsEditing(false)} />
      )}

      {/* Delete Confirmation */}
      {isDeleting && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm">
            <h2 className="text-xl font-bold mb-2">Delete Task?</h2>
            <p className="text-gray-600 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setIsDeleting(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isPending}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function EditTaskModal({ task, onClose }: { task: Task; onClose: () => void }) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    try {
      await api.tasks.update(task.id, { title, description });
      router.invalidate();
      onClose();
    } catch (error) {
      console.error('Failed to update task:', error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Edit Task</h2>
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
              disabled={isPending}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isPending ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
