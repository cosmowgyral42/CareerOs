import { useEffect, useState } from 'react';

import {
  createSkill,
  deleteSkill,
  getSkills,
  updateSkill,
} from '../../services/api';

const LEVELS = [
  'beginner',
  'intermediate',
  'advanced',
  'expert',
];

const LEVEL_PROGRESS = {
  beginner: 25,
  intermediate: 50,
  advanced: 75,
  expert: 100,
};

function Skills() {
  const [skills, setSkills] = useState([]);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [level, setLevel] = useState('beginner');

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadSkills() {
      try {
        const data = await getSkills();

        if (!cancelled) {
          setSkills(Array.isArray(data) ? data : []);
          setError('');
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : 'Unable to load skills.',
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadSkills();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      setError('Skill name is required.');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const createdSkill = await createSkill({
        name: trimmedName,
        category: category.trim() || null,
        description: description.trim() || null,
        level,
      });

      const skillWithLevel = {
        ...createdSkill,
        level: createdSkill.level || level,
      };

      setSkills((currentSkills) => [
        ...currentSkills,
        skillWithLevel,
      ].sort((a, b) =>
        a.name.localeCompare(b.name),
      ));

      setName('');
      setCategory('');
      setDescription('');
      setLevel('beginner');

      setSuccess('Skill added successfully.');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to add skill.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleLevelChange(
    skillId,
    newLevel,
  ) {
    setUpdatingId(skillId);
    setError('');
    setSuccess('');

    try {
      const updatedSkill = await updateSkill(
        skillId,
        {
          level: newLevel,
        },
      );

      setSkills((currentSkills) =>
        currentSkills.map((skill) =>
          skill.id === skillId
            ? {
                ...skill,
                ...updatedSkill,
                level:
                  updatedSkill.level ||
                  newLevel,
              }
            : skill,
        ),
      );

      setSuccess('Skill level updated.');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to update skill level.',
      );
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleDelete(skillId) {
    setDeletingId(skillId);
    setError('');
    setSuccess('');

    try {
      await deleteSkill(skillId);

      setSkills((currentSkills) =>
        currentSkills.filter(
          (skill) => skill.id !== skillId,
        ),
      );

      setSuccess('Skill removed successfully.');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to remove skill.',
      );
    } finally {
      setDeletingId(null);
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-pink-100 border-t-pink-500" />

          <p className="mt-4 text-sm text-slate-500">
            Loading your skills...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-pink-500">
          Career development
        </p>

        <h1 className="mt-2 font-serif text-4xl font-bold tracking-tight text-slate-900">
          Skills
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
          Build your skill library, track your
          proficiency, and understand where you need
          to improve.
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

      <section className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <div className="rounded-3xl border border-pink-100 bg-white p-6 shadow-sm">
          <div className="rounded-2xl bg-[#FFF8E7] p-5">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-700">
              Add capability
            </p>

            <h2 className="mt-2 font-serif text-2xl font-bold text-slate-900">
              Add a skill
            </h2>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-6 space-y-5"
          >
            <div>
              <label
                htmlFor="skill-name"
                className="text-sm font-semibold text-slate-700"
              >
                Skill name
              </label>

              <input
                id="skill-name"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="Python"
                maxLength={100}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
              />
            </div>

            <div>
              <label
                htmlFor="skill-category"
                className="text-sm font-semibold text-slate-700"
              >
                Category
              </label>

              <input
                id="skill-category"
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value)
                }
                placeholder="Backend"
                maxLength={100}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
              />
            </div>

            <div>
              <label
                htmlFor="skill-description"
                className="text-sm font-semibold text-slate-700"
              >
                Description
              </label>

              <textarea
                id="skill-description"
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                placeholder="What are you learning?"
                rows={4}
                className="mt-2 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
              />
            </div>

            <div>
              <label
                htmlFor="skill-level"
                className="text-sm font-semibold text-slate-700"
              >
                Current level
              </label>

              <select
                id="skill-level"
                value={level}
                onChange={(event) =>
                  setLevel(event.target.value)
                }
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
              >
                {LEVELS.map((skillLevel) => (
                  <option
                    key={skillLevel}
                    value={skillLevel}
                  >
                    {capitalize(skillLevel)}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-pink-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting
                ? 'Adding...'
                : 'Add skill'}
            </button>
          </form>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-semibold text-slate-500">
                Your skill library
              </p>

              <h2 className="mt-1 font-serif text-3xl font-bold text-slate-900">
                {skills.length} skill
                {skills.length === 1 ? '' : 's'}
              </h2>
            </div>

            <div className="rounded-full bg-[#FFF8E7] px-4 py-2 text-xs font-bold text-amber-700">
              Keep building
            </div>
          </div>

          {skills.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-dashed border-pink-200 bg-pink-50/40 p-10 text-center">
              <h3 className="font-serif text-xl font-bold text-slate-800">
                Your skill library is empty
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Add your first skill using the form.
              </p>
            </div>
          ) : (
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {skills.map((skill) => {
                const currentLevel =
                  skill.level || 'beginner';

                const progress =
                  LEVEL_PROGRESS[currentLevel] || 25;

                return (
                  <article
                    key={skill.id}
                    className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-pink-200 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h3 className="font-serif text-xl font-bold text-slate-900">
                          {skill.name}
                        </h3>

                        {skill.category && (
                          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-pink-500">
                            {skill.category}
                          </p>
                        )}
                      </div>

                      <div className="h-3 w-3 shrink-0 rounded-full bg-pink-300" />
                    </div>

                    {skill.description && (
                      <p className="mt-4 text-sm leading-6 text-slate-500">
                        {skill.description}
                      </p>
                    )}

                    <div className="mt-5">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                        <span>Skill level</span>

                        <span>
                          {capitalize(currentLevel)}
                        </span>
                      </div>

                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-pink-50">
                        <div
                          className="h-full rounded-full bg-pink-300 transition-all"
                          style={{
                            width: `${progress}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="mt-5">
                      <label
                        htmlFor={`level-${skill.id}`}
                        className="text-xs font-semibold text-slate-600"
                      >
                        Update level
                      </label>

                      <select
                        id={`level-${skill.id}`}
                        value={currentLevel}
                        disabled={
                          updatingId === skill.id
                        }
                        onChange={(event) =>
                          handleLevelChange(
                            skill.id,
                            event.target.value,
                          )
                        }
                        className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 disabled:opacity-60"
                      >
                        {LEVELS.map((skillLevel) => (
                          <option
                            key={skillLevel}
                            value={skillLevel}
                          >
                            {capitalize(skillLevel)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(skill.id)
                      }
                      disabled={
                        deletingId === skill.id
                      }
                      className="mt-5 rounded-lg border border-red-100 px-3 py-2 text-xs font-bold text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {deletingId === skill.id
                        ? 'Removing...'
                        : 'Remove skill'}
                    </button>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export default Skills;