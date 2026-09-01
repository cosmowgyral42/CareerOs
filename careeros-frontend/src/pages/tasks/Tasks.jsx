import { useEffect, useState } from 'react';

import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
} from '../../services/api';

function Tasks() {
  const [tasks, setTasks] = useState([]);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setError('');

        const data = await getTasks();

        if (!cancelled) {
          setTasks(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : 'Unable to load tasks.',
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleCreate(event) {
    event.preventDefault();

    if (!title.trim()) {
      setError('Task title is required.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');

      const task = await createTask({
        title: title.trim(),
        description: description.trim() || null,
      });

      setTasks((current) => [task, ...current]);

      setTitle('');
      setDescription('');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to create task.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function startEditing(task) {
    setEditingTaskId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setError('');
  }

  function cancelEditing() {
    setEditingTaskId(null);
    setEditTitle('');
    setEditDescription('');
  }

  async function handleUpdate(taskId) {
    if (!editTitle.trim()) {
      setError('Task title is required.');
      return;
    }

    try {
      setError('');

      const updatedTask = await updateTask(
        taskId,
        {
          title: editTitle.trim(),
          description:
            editDescription.trim() || null,
        },
      );

      setTasks((current) =>
        current.map((task) =>
          task.id === updatedTask.id
            ? updatedTask
            : task,
        ),
      );

      cancelEditing();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to update task.',
      );
    }
  }

  async function handleComplete(task) {
    try {
      setError('');

      const updatedTask = await updateTask(
        task.id,
        {
          status:
            task.status === 'completed'
              ? 'pending'
              : 'completed',
        },
      );

      setTasks((current) =>
        current.map((item) =>
          item.id === updatedTask.id
            ? updatedTask
            : item,
        ),
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to update task.',
      );
    }
  }

  async function handleDelete(taskId) {
    try {
      setError('');

      await deleteTask(taskId);

      setTasks((current) =>
        current.filter(
          (task) => task.id !== taskId,
        ),
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to delete task.',
      );
    }
  }

  if (isLoading) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-8">
        <p className="text-sm font-medium text-slate-500">
          Loading your tasks...
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-pink-600">
          Career workspace
        </p>

        <h1 className="mt-1 text-3xl font-bold text-slate-900">
          Tasks
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Turn your goals into actionable daily work.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <form
          onSubmit={handleCreate}
          className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <h2 className="text-lg font-bold text-slate-900">
            Create task
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Add something actionable to your workspace.
          </p>

          <div className="mt-5 space-y-4">
            <div>
              <label
                htmlFor="task-title"
                className="text-sm font-semibold text-slate-700"
              >
                Title
              </label>

              <input
                id="task-title"
                value={title}
                onChange={(event) =>
                  setTitle(event.target.value)
                }
                placeholder="Build authentication API"
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
              />
            </div>

            <div>
              <label
                htmlFor="task-description"
                className="text-sm font-semibold text-slate-700"
              >
                Description
              </label>

              <textarea
                id="task-description"
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                rows={4}
                placeholder="What needs to be completed?"
                className="mt-2 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting
                ? 'Creating...'
                : 'Create task'}
            </button>
          </div>
        </form>

        <div className="space-y-3">
          {tasks.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <h2 className="font-bold text-slate-900">
                No tasks yet
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Create your first task to start making progress.
              </p>
            </div>
          ) : (
            tasks.map((task) => {
              const isEditing =
                editingTaskId === task.id;

              return (
                <article
                  key={task.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor={`edit-title-${task.id}`}
                          className="text-sm font-semibold text-slate-700"
                        >
                          Title
                        </label>

                        <input
                          id={`edit-title-${task.id}`}
                          value={editTitle}
                          onChange={(event) =>
                            setEditTitle(
                              event.target.value,
                            )
                          }
                          className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor={`edit-description-${task.id}`}
                          className="text-sm font-semibold text-slate-700"
                        >
                          Description
                        </label>

                        <textarea
                          id={`edit-description-${task.id}`}
                          value={editDescription}
                          onChange={(event) =>
                            setEditDescription(
                              event.target.value,
                            )
                          }
                          rows={3}
                          className="mt-2 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
                        />
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            handleUpdate(task.id)
                          }
                          className="rounded-xl bg-pink-600 px-4 py-2 text-sm font-bold text-white hover:bg-pink-700"
                        >
                          Save changes
                        </button>

                        <button
                          type="button"
                          onClick={cancelEditing}
                          className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex items-center gap-3">
                          <h3
                            className={`font-bold ${
                              task.status === 'completed'
                                ? 'text-slate-400 line-through'
                                : 'text-slate-900'
                            }`}
                          >
                            {task.title}
                          </h3>

                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                              task.status === 'completed'
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-amber-50 text-amber-700'
                            }`}
                          >
                            {task.status === 'completed'
                              ? 'Completed'
                              : 'Pending'}
                          </span>
                        </div>

                        {task.description && (
                          <p className="mt-2 text-sm leading-6 text-slate-500">
                            {task.description}
                          </p>
                        )}
                      </div>

                      <div className="flex shrink-0 flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            handleComplete(task)
                          }
                          className="rounded-xl bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100"
                        >
                          {task.status === 'completed'
                            ? 'Undo'
                            : 'Complete'}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            startEditing(task)
                          }
                          className="rounded-xl bg-pink-50 px-3 py-2 text-xs font-bold text-pink-700 transition hover:bg-pink-100"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(task.id)
                          }
                          className="rounded-xl bg-red-50 px-3 py-2 text-xs font-bold text-red-700 transition hover:bg-red-100"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </article>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}

export default Tasks;
