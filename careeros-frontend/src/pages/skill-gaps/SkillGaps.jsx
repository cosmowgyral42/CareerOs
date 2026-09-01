import { useEffect, useState } from 'react';

import ConfirmDialog from '../../components/common/ConfirmDialog';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import LoadingState from '../../components/common/LoadingState';

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

  const [gapToDelete, setGapToDelete] = useState(null);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function loadSkillGaps() {
    setIsLoading(true);
    setError('');

    try {
      const data = await getSkillGaps();

      setSkillGaps(
        Array.isArray(data) ? data : [],
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to load skill gaps.',
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadSkillGaps();
  }, []);

  async function updateGap(
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
            ? {
                ...gap,
                ...updated,
              }
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

  async function removeGap() {
    if (!gapToDelete) {
      return;
    }

    const skillGapId = gapToDelete.id;

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
      setGapToDelete(null);
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
      <LoadingState
        message="Loading skill gaps..."
      />
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-pink-500">
          Career development
        </p>

        <h1 className="page-title">
          Skill gaps
        </h1>

        <p className="page-description max-w-2xl">
          See which skills need attention and turn
          important gaps into actionable development
          work.
        </p>
      </section>

      {error && (
        <ErrorState
          title="Something went wrong"
          message={error}
          onRetry={loadSkillGaps}
        />
      )}

      {success && (
        <div className="rounded-2xl border border-pink-100 bg-pink-50 p-4 text-sm text-pink-700">
          {success}
        </div>
      )}

      {!error && skillGaps.length === 0 && (
        <EmptyState
          title="No skill gaps yet"
          description="Your skill-gap records will appear here once they are created for a career target."
        />
      )}

      {!error && skillGaps.length > 0 && (
        <div className="grid gap-5 lg:grid-cols-2">
          {skillGaps.map((gap) => (
            <article
              key={gap.id}
              className="app-card app-card-hover group p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-pink-500">
                    Skill #{gap.skill_id}
                  </p>

                  <h2 className="mt-2 text-2xl font-bold text-slate-900">
                    Skill gap
                  </h2>
                </div>

                <span className="badge-accent rounded-full px-3 py-1 text-xs font-bold">
                  {capitalize(gap.importance)}
                </span>
              </div>

              <div className="mt-6">
                <p className="text-sm font-semibold text-slate-600">
                  Progress
                </p>

                <div className="mt-2 h-3 overflow-hidden rounded-full bg-pink-50">
                  <div
                    className="h-full rounded-full bg-pink-300 transition-all"
                    style={{
                      width: getProgressWidth(
                        gap.status,
                      ),
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
                      updateGap(
                        gap.id,
                        {
                          status:
                            event.target.value,
                        },
                      )
                    }
                    className="input-style mt-2"
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
                      updateGap(
                        gap.id,
                        {
                          importance:
                            event.target.value,
                        },
                      )
                    }
                    className="input-style mt-2"
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
                  setGapToDelete(gap)
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
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={Boolean(gapToDelete)}
        title="Remove skill gap?"
        message="This skill-gap record will be permanently removed."
        confirmLabel="Remove"
        cancelLabel="Cancel"
        isLoading={
          deletingId === gapToDelete?.id
        }
        onConfirm={removeGap}
        onCancel={() => {
          if (!deletingId) {
            setGapToDelete(null);
          }
        }}
      />
    </div>
  );
}

function capitalize(value = '') {
  return (
    value.charAt(0).toUpperCase() +
    value.slice(1)
  );
}

function getProgressWidth(status) {
  switch (status) {
    case 'acquired':
      return '100%';

    case 'developing':
      return '75%';

    case 'learning':
      return '50%';

    default:
      return '25%';
  }
}

export default SkillGaps;