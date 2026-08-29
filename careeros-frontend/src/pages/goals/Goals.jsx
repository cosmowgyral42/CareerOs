import { useEffect, useState } from 'react';

import {
  createGoal,
  deleteGoal,
  getGoals,
  updateGoal,
} from '../../services/api';

import ConfirmDialog from '../../components/common/ConfirmDialog';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import LoadingState from '../../components/common/LoadingState';
import Toast from '../../components/ui/Toast';

const emptyForm = {
  title: '',
  description: '',
  target_date: '',
};

function Goals() {
  const [goals, setGoals] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const [goalToDelete, setGoalToDelete] =
    useState(null);

  const [isDeleting, setIsDeleting] =
    useState(false);

  const [toast, setToast] = useState(null);

  async function fetchGoals() {
    try {
      setIsLoading(true);
      setError('');

      const data = await getGoals();

      setGoals(
        Array.isArray(data)
          ? data
          : [],
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to load goals.',
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchGoals();
  }, []);

  function showToast(message, type = 'success') {
    setToast({
      message,
      type,
    });

    window.setTimeout(() => {
      setToast(null);
    }, 3000);
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function startEdit(goal) {
    setEditingId(goal.id);

    setForm({
      title: goal.title ?? '',
      description: goal.description ?? '',
      target_date: goal.target_date ?? '',
    });

    setError('');
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
    setError('');
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.title.trim()) {
      setError('Goal title is required.');
      showToast(
        'Goal title is required.',
        'error',
      );
      return;
    }

    try {
      setIsSaving(true);
      setError('');

      const payload = {
        title: form.title.trim(),
        description:
          form.description.trim() || null,
        target_date:
          form.target_date || null,
      };

      if (editingId !== null) {
        const updated = await updateGoal(
          editingId,
          payload,
        );

        setGoals((current) =>
          current.map((goal) =>
            goal.id === updated.id
              ? updated
              : goal,
          ),
        );

        showToast(
          'Goal updated successfully.',
        );
      } else {
        const created =
          await createGoal(payload);

        setGoals((current) => [
          created,
          ...current,
        ]);

        showToast(
          'Goal created successfully.',
        );
      }

      setForm(emptyForm);
      setEditingId(null);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Unable to save goal.';

      setError(message);
      showToast(message, 'error');
    } finally {
      setIsSaving(false);
    }
  }

  async function toggleGoal(goal) {
    try {
      setError('');

      const updated = await updateGoal(
        goal.id,
        {
          status:
            goal.status === 'completed'
              ? 'active'
              : 'completed',
        },
      );

      setGoals((current) =>
        current.map((item) =>
          item.id === updated.id
            ? updated
            : item,
        ),
      );

      showToast(
        goal.status === 'completed'
          ? 'Goal marked as active.'
          : 'Goal completed successfully.',
      );
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Unable to update goal.';

      setError(message);
      showToast(message, 'error');
    }
  }

  function requestDelete(goal) {
    setGoalToDelete(goal);
  }

  function cancelDelete() {
    if (!isDeleting) {
      setGoalToDelete(null);
    }
  }

  async function confirmDelete() {
    if (!goalToDelete) {
      return;
    }

    try {
      setIsDeleting(true);
      setError('');

      await deleteGoal(goalToDelete.id);

      setGoals((current) =>
        current.filter(
          (goal) =>
            goal.id !== goalToDelete.id,
        ),
      );

      if (
        editingId === goalToDelete.id
      ) {
        cancelEdit();
      }

      showToast(
        'Goal deleted successfully.',
      );

      setGoalToDelete(null);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Unable to delete goal.';

      setError(message);
      showToast(message, 'error');
    } finally {
      setIsDeleting(false);
    }
  }

  const completedCount = goals.filter(
    (goal) =>
      goal.status === 'completed',
  ).length;

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {toast && (
        <div className="fixed right-4 top-20 z-50 w-full max-w-sm">
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() =>
              setToast(null)
            }
          />
        </div>
      )}

      <ConfirmDialog
        isOpen={Boolean(goalToDelete)}
        title="Delete goal?"
        message={
          goalToDelete
            ? `Are you sure you want to delete "${goalToDelete.title}"? This action cannot be undone.`
            : ''
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        isLoading={isDeleting}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />

      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-600">
          Career planning
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Goals
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-500">
          Turn your ambitions into measurable progress.
        </p>
      </section>

      {error && !isLoading && (
        <ErrorState
          title="Unable to complete action"
          message={error}
          onRetry={fetchGoals}
        />
      )}

      <section className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <div className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {editingId !== null
                ? 'Edit goal'
                : 'Create a goal'}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {editingId !== null
                ? 'Update your goal details.'
                : 'Define your next career milestone.'}
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-6 space-y-4"
          >
            <div>
              <label
                htmlFor="goal-title"
                className="text-sm font-semibold text-slate-700"
              >
                Title
              </label>

              <input
                id="goal-title"
                name="title"
                value={form.title}
                onChange={handleChange}
                maxLength={200}
                required
                placeholder="Become a backend engineer"
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
              />
            </div>

            <div>
              <label
                htmlFor="goal-description"
                className="text-sm font-semibold text-slate-700"
              >
                Description
              </label>

              <textarea
                id="goal-description"
                name="description"
                value={form.description}
                onChange={handleChange}
                maxLength={5000}
                rows={4}
                placeholder="Build production-quality backend systems."
                className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
              />
            </div>

            <div>
              <label
                htmlFor="goal-date"
                className="text-sm font-semibold text-slate-700"
              >
                Target date
              </label>

              <input
                id="goal-date"
                name="target_date"
                type="date"
                value={form.target_date}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
              />
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving
                ? 'Saving...'
                : editingId !== null
                  ? 'Save changes'
                  : 'Create goal'}
            </button>

            {editingId !== null && (
              <button
                type="button"
                onClick={cancelEdit}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Cancel editing
              </button>
            )}
          </form>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  Total goals
                </p>

                <p className="mt-1 text-3xl font-bold text-slate-900">
                  {goals.length}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Completed
                </p>

                <p className="mt-1 text-3xl font-bold text-emerald-600">
                  {completedCount}
                </p>
              </div>
            </div>
          </div>

          {isLoading ? (
            <LoadingState
              message="Loading your goals..."
            />
          ) : error ? null : goals.length === 0 ? (
            <EmptyState
              title="No goals yet"
              message="Create your first career goal."
            />
          ) : (
            goals.map((goal) => (
              <article
                key={goal.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2
                        className={`text-lg font-bold ${
                          goal.status ===
                          'completed'
                            ? 'text-slate-400 line-through'
                            : 'text-slate-900'
                        }`}
                      >
                        {goal.title}
                      </h2>

                      <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
                        {goal.status}
                      </span>
                    </div>

                    {goal.description && (
                      <p className="mt-3 text-sm leading-6 text-slate-500">
                        {goal.description}
                      </p>
                    )}

                    {goal.target_date && (
                      <p className="mt-3 text-xs font-medium text-slate-400">
                        Target:{' '}
                        {goal.target_date}
                      </p>
                    )}
                  </div>

                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        startEdit(goal)
                      }
                      className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        toggleGoal(goal)
                      }
                      className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                    >
                      {goal.status ===
                      'completed'
                        ? 'Mark active'
                        : 'Complete'}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        requestDelete(goal)
                      }
                      className="rounded-xl border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

export default Goals;