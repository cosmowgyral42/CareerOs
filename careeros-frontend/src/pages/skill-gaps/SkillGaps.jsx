import { useEffect, useState } from 'react';

import {
  deleteSkillGap,
  getSkillGaps,
  updateSkillGap,
} from '../../services/api';

const STATUSES = [
  'missing',
  'learning',
  'developing',
  'acquired',
];

const IMPORTANCE = [
  'low',
  'medium',
  'high',
];

function SkillGaps() {
  const [skillGaps, setSkillGaps] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadSkillGaps() {
      try {
        const data = await getSkillGaps();

        if (!cancelled) {
          setSkillGaps(
            Array.isArray(data) ? data : [],
          );
          setError('');
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : 'Unable to load skill gaps.',
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadSkillGaps();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleUpdate(
    skillGapId,
    changes,
  ) {
    setUpdatingId(skillGapId);
    setError('');
    setSuccess('');

    try {
      const updated = await updateSkillGap(
        skillGapId,
        changes,
      );

      setSkillGaps((current) =>
        current.map((gap) =>
          gap.id === skillGapId
            ? { ...gap, ...updated }
            : gap,
        ),
      );

      setSuccess('Skill gap updated.');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to update skill gap.',
      );
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleDelete(skillGapId) {
    setDeletingId(skillGapId);
    setError('');
    setSuccess('');

    try {
      await deleteSkillGap(skillGapId);

      setSkillGaps((current) =>
        current.filter(
          (gap) => gap.id !== skillGapId,
        ),
      );

      setSuccess('Skill gap removed.');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to remove skill gap.',
      );
    } finally {
      setDeletingId(null);
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-slate-500">
          Loading skill gaps...
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-pink-500">
          Career development
        </p>

        <h1 className="mt-2 font-serif text-4xl font-bold text-slate-900">
          Skill Gaps
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
          Track the skills you still need to develop
          for your career targets.
        </p>
      </section>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-2xl border border-pink-100 bg-pink-50 p-4 text-sm text-pink-700">
          {success}
        </div>
      )}

      {skillGaps.length === 0 ? (
        <section className="rounded-3xl border border-dashed border-pink-200 bg-white p-12 text-center">
          <h2 className="font-serif text-2xl font-bold text-slate-900">
            No skill gaps yet
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Skill gaps will appear here when they are
            associated with a career target.
          </p>
        </section>
      ) : (
        <section className="grid gap-5 lg:grid-cols-2">
          {skillGaps.map((gap) => {
            const progress =
              gap.status === 'acquired'
                ? 100
                : gap.status === 'developing'
                  ? 75
                  : gap.status === 'learning'
                    ? 50
                    : 25;

            return (
              <article
                key={gap.id}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-pink-500">
                      Skill #{gap.skill_id}
                    </p>

                    <h2 className="mt-2 font-serif text-2xl font-bold text-slate-900">
                      Skill development
                    </h2>
                  </div>

                  <span className="rounded-full bg-[#FFF8E7] px-3 py-1 text-xs font-bold capitalize text-amber-700">
                    {gap.importance}
                  </span>
                </div>

                <div className="mt-6">
                  <div className="flex justify-between text-xs font-semibold text-slate-500">
                    <span>Progress</span>

                    <span>
                      {progress}%
                    </span>
                  </div>

                  <div className="mt-2 h-3 overflow-hidden rounded-full bg-pink-50">
                    <div
                      className="h-full rounded-full bg-pink-300 transition-all"
                      style={{
                        width: `${progress}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor={`status-${gap.id}`}
                      className="text-xs font-semibold text-slate-600"
                    >
                      Status
                    </label>

                    <select
                      id={`status-${gap.id}`}
                      value={gap.status}
                      disabled={
                        updatingId === gap.id
                      }
                      onChange={(event) =>
                        handleUpdate(
                          gap.id,
                          {
                            status:
                              event.target.value,
                          },
                        )
                      }
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
                    >
                      {STATUSES.map((status) => (
                        <option
                          key={status}
                          value={status}
                        >
                          {capitalize(status)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor={`importance-${gap.id}`}
                      className="text-xs font-semibold text-slate-600"
                    >
                      Importance
                    </label>

                    <select
                      id={`importance-${gap.id}`}
                      value={gap.importance}
                      disabled={
                        updatingId === gap.id
                      }
                      onChange={(event) =>
                        handleUpdate(
                          gap.id,
                          {
                            importance:
                              event.target.value,
                          },
                        )
                      }
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
                    >
                      {IMPORTANCE.map(
                        (importance) => (
                          <option
                            key={importance}
                            value={importance}
                          >
                            {capitalize(
                              importance,
                            )}
                          </option>
                        ),
                      )}
                    </select>
                  </div>
                </div>

                {gap.notes && (
                  <p className="mt-5 rounded-2xl bg-[#FFF8E7] p-4 text-sm leading-6 text-slate-600">
                    {gap.notes}
                  </p>
                )}

                <button
                  type="button"
                  onClick={() =>
                    handleDelete(gap.id)
                  }
                  disabled={
                    deletingId === gap.id
                  }
                  className="mt-5 rounded-lg border border-red-100 px-3 py-2 text-xs font-bold text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {deletingId === gap.id
                    ? 'Removing...'
                    : 'Remove gap'}
                </button>
              </article>
            );
          })}
        </section>
      )}
    </div>
  );
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export default SkillGaps;