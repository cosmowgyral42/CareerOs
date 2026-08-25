import { useEffect, useState } from 'react';

import {
  addTargetSkill,
  createCareerTarget,
  deleteCareerTarget,
  deleteTargetSkill,
  getCareerTargets,
  getSkills,
  getTargetSkills,
  updateCareerTarget,
} from '../../services/api';

const EMPTY_TARGET = {
  title: '',
  target_role: '',
  target_level: '',
  description: '',
  target_date: '',
  is_active: true,
};

const EMPTY_SKILL = {
  skill_id: '',
  importance: 'required',
};

function getErrorMessage(error, fallback) {
  return error instanceof Error
    ? error.message
    : fallback;
}

export default function CareerTargets() {
  const [targets, setTargets] = useState([]);
  const [skills, setSkills] = useState([]);
  const [skillsByTarget, setSkillsByTarget] =
    useState({});

  const [targetForm, setTargetForm] =
    useState({ ...EMPTY_TARGET });

  const [skillForm, setSkillForm] =
    useState({ ...EMPTY_SKILL });

  const [targetModalOpen, setTargetModalOpen] =
    useState(false);

  const [skillModalOpen, setSkillModalOpen] =
    useState(false);

  const [editingTargetId, setEditingTargetId] =
    useState(null);

  const [selectedTargetId, setSelectedTargetId] =
    useState(null);

  const [loading, setLoading] = useState(true);
  const [savingTarget, setSavingTarget] =
    useState(false);
  const [savingSkill, setSavingSkill] =
    useState(false);

  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadPage() {
      try {
        setLoading(true);
        setError('');

        const [
          targetResponse,
          skillResponse,
        ] = await Promise.all([
          getCareerTargets(),
          getSkills(),
        ]);

        if (!active) {
          return;
        }

        const loadedTargets =
          Array.isArray(targetResponse)
            ? targetResponse
            : [];

        const loadedSkills =
          Array.isArray(skillResponse)
            ? skillResponse
            : [];

        setTargets(loadedTargets);
        setSkills(loadedSkills);

        const skillEntries =
          await Promise.all(
            loadedTargets.map(
              async (target) => {
                try {
                  const response =
                    await getTargetSkills(
                      target.id,
                    );

                  return [
                    target.id,
                    Array.isArray(response)
                      ? response
                      : [],
                  ];
                } catch {
                  return [target.id, []];
                }
              },
            ),
          );

        if (!active) {
          return;
        }

        setSkillsByTarget(
          Object.fromEntries(
            skillEntries,
          ),
        );
      } catch (err) {
        if (active) {
          setError(
            getErrorMessage(
              err,
              'Unable to load career targets.',
            ),
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadPage();

    return () => {
      active = false;
    };
  }, []);

  function openCreateTarget() {
    setEditingTargetId(null);
    setTargetForm({
      ...EMPTY_TARGET,
    });
    setError('');
    setTargetModalOpen(true);
  }

  function openEditTarget(target) {
    setEditingTargetId(target.id);

    setTargetForm({
      title: target.title || '',
      target_role:
        target.target_role || '',
      target_level:
        target.target_level || '',
      description:
        target.description || '',
      target_date:
        target.target_date || '',
      is_active:
        target.is_active ?? true,
    });

    setError('');
    setTargetModalOpen(true);
  }

  function closeTargetModal() {
    if (savingTarget) {
      return;
    }

    setTargetModalOpen(false);
    setEditingTargetId(null);
    setTargetForm({
      ...EMPTY_TARGET,
    });
  }

  function handleTargetChange(event) {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setTargetForm((current) => ({
      ...current,
      [name]:
        type === 'checkbox'
          ? checked
          : value,
    }));
  }

  async function handleTargetSubmit(event) {
    event.preventDefault();

    if (
      !targetForm.title.trim() ||
      !targetForm.target_role.trim()
    ) {
      setError(
        'Target title and target role are required.',
      );
      return;
    }

    try {
      setSavingTarget(true);
      setError('');

      const payload = {
        title: targetForm.title.trim(),
        target_role:
          targetForm.target_role.trim(),
        target_level:
          targetForm.target_level.trim() ||
          null,
        description:
          targetForm.description.trim() ||
          null,
        target_date:
          targetForm.target_date || null,
        is_active:
          targetForm.is_active,
      };

      if (editingTargetId === null) {
        const created =
          await createCareerTarget(
            payload,
          );

        setTargets((current) => [
          created,
          ...current,
        ]);

        setSkillsByTarget((current) => ({
          ...current,
          [created.id]: [],
        }));
      } else {
        const updated =
          await updateCareerTarget(
            editingTargetId,
            payload,
          );

        setTargets((current) =>
          current.map((target) =>
            target.id === editingTargetId
              ? updated
              : target,
          ),
        );
      }

      closeTargetModal();
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          'Unable to save career target.',
        ),
      );
    } finally {
      setSavingTarget(false);
    }
  }

  async function handleDeleteTarget(targetId) {
    if (
      !window.confirm(
        'Delete this career target?',
      )
    ) {
      return;
    }

    try {
      setError('');

      await deleteCareerTarget(targetId);

      setTargets((current) =>
        current.filter(
          (target) =>
            target.id !== targetId,
        ),
      );

      setSkillsByTarget((current) => {
        const next = {
          ...current,
        };

        delete next[targetId];

        return next;
      });
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          'Unable to delete career target.',
        ),
      );
    }
  }

  async function refreshTargetSkills(targetId) {
    const response =
      await getTargetSkills(targetId);

    const loaded =
      Array.isArray(response)
        ? response
        : [];

    setSkillsByTarget((current) => ({
      ...current,
      [targetId]: loaded,
    }));
  }

  function openAddSkill(targetId) {
    setSelectedTargetId(targetId);
    setSkillForm({
      ...EMPTY_SKILL,
    });
    setError('');
    setSkillModalOpen(true);
  }

  function closeSkillModal() {
    if (savingSkill) {
      return;
    }

    setSkillModalOpen(false);
    setSelectedTargetId(null);
    setSkillForm({
      ...EMPTY_SKILL,
    });
  }

  async function handleSkillSubmit(event) {
    event.preventDefault();

    if (selectedTargetId === null) {
      setError(
        'Please select a career target.',
      );
      return;
    }

    if (!skillForm.skill_id) {
      setError(
        'Please select a skill.',
      );
      return;
    }

    try {
      setSavingSkill(true);
      setError('');

      await addTargetSkill(
        selectedTargetId,
        {
          skill_id: Number(
            skillForm.skill_id,
          ),
          importance:
            skillForm.importance,
        },
      );

      await refreshTargetSkills(
        selectedTargetId,
      );

      closeSkillModal();
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          'Unable to add target skill.',
        ),
      );
    } finally {
      setSavingSkill(false);
    }
  }

  async function handleRemoveSkill(
    targetId,
    targetSkillId,
  ) {
    try {
      setError('');

      await deleteTargetSkill(
        targetId,
        targetSkillId,
      );

      await refreshTargetSkills(targetId);
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          'Unable to remove target skill.',
        ),
      );
    }
  }

  function getSkillName(skillId) {
    const skill = skills.find(
      (item) => item.id === skillId,
    );

    return skill?.name || `Skill #${skillId}`;
  }

  return (
    <main className="min-h-screen bg-[#fffdf9] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-sans text-sm font-bold uppercase tracking-[0.2em] text-pink-500">
              Career planning
            </p>

            <h1 className="mt-2 font-serif text-4xl font-bold tracking-tight text-slate-900">
              Career Targets
            </h1>

            <p className="mt-2 max-w-2xl font-sans text-sm leading-6 text-slate-600">
              Create your career destination and
              define the skills required to reach
              it.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateTarget}
            className="rounded-2xl bg-pink-500 px-6 py-3 font-sans text-sm font-bold text-white shadow-sm transition hover:bg-pink-600"
          >
            + Add career target
          </button>
        </header>

        {error && (
          <div className="mb-6 rounded-2xl border border-pink-200 bg-pink-50 px-4 py-3 font-sans text-sm font-semibold text-pink-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-3xl border border-yellow-200 bg-white p-10 text-center font-sans text-sm text-slate-500 shadow-sm">
            Loading career targets...
          </div>
        ) : targets.length === 0 ? (
          <section className="rounded-3xl border border-yellow-200 bg-white p-10 text-center shadow-sm">
            <h2 className="font-serif text-2xl font-bold text-slate-900">
              Start your career plan
            </h2>

            <p className="mt-2 font-sans text-sm text-slate-500">
              Create a career target first, then
              add the skills required for it.
            </p>

            <button
              type="button"
              onClick={openCreateTarget}
              className="mt-6 rounded-2xl bg-yellow-300 px-6 py-3 font-sans text-sm font-bold text-slate-900 transition hover:bg-yellow-400"
            >
              + Add career target
            </button>
          </section>
        ) : (
          <section className="grid gap-6 lg:grid-cols-2">
            {targets.map((target) => {
              const targetSkills =
                skillsByTarget[target.id] ||
                [];

              return (
                <article
                  key={target.id}
                  className="rounded-3xl border border-yellow-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-sans text-xs font-bold uppercase tracking-wider text-pink-500">
                        {target.target_level ||
                          'Career target'}
                      </p>

                      <h2 className="mt-1 font-serif text-2xl font-bold text-slate-900">
                        {target.title}
                      </h2>

                      <p className="mt-1 font-sans text-sm font-semibold text-slate-700">
                        {target.target_role}
                      </p>
                    </div>

                    <span className="rounded-full bg-yellow-100 px-3 py-1 font-sans text-xs font-bold text-yellow-800">
                      {target.is_active
                        ? 'Active'
                        : 'Inactive'}
                    </span>
                  </div>

                  {target.description && (
                    <p className="mt-4 font-sans text-sm leading-6 text-slate-600">
                      {target.description}
                    </p>
                  )}

                  <div className="mt-6 rounded-2xl bg-[#fff9df] p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-serif text-xl font-bold text-slate-900">
                          Target skills
                        </h3>

                        <p className="mt-1 font-sans text-xs text-slate-500">
                          Skills you need for this
                          target.
                        </p>
                      </div>

                      <span className="rounded-full bg-white px-3 py-1 font-sans text-xs font-bold text-slate-700">
                        {targetSkills.length}
                      </span>
                    </div>

                    {targetSkills.length === 0 ? (
                      <div className="mt-4 rounded-2xl border border-dashed border-yellow-300 bg-white p-4">
                        <p className="font-sans text-sm text-slate-500">
                          No target skills added yet.
                        </p>
                      </div>
                    ) : (
                      <div className="mt-4 space-y-2">
                        {targetSkills.map(
                          (targetSkill) => (
                            <div
                              key={
                                targetSkill.id
                              }
                              className="flex items-center justify-between rounded-xl bg-white px-4 py-3"
                            >
                              <div>
                                <p className="font-sans text-sm font-bold text-slate-800">
                                  {getSkillName(
                                    targetSkill.skill_id,
                                  )}
                                </p>

                                <p className="mt-1 font-sans text-xs capitalize text-slate-500">
                                  {targetSkill.importance ||
                                    'required'}
                                </p>
                              </div>

                              <button
                                type="button"
                                onClick={() =>
                                  handleRemoveSkill(
                                    target.id,
                                    targetSkill.id,
                                  )
                                }
                                className="font-sans text-xs font-bold text-pink-500 hover:text-pink-700"
                              >
                                Remove
                              </button>
                            </div>
                          ),
                        )}
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        openAddSkill(
                          target.id,
                        )
                      }
                      className="mt-4 block w-full cursor-pointer rounded-xl bg-yellow-300 px-5 py-3 font-sans text-sm font-bold text-slate-900 transition hover:bg-yellow-400 active:scale-[0.99]"
                    >
                      + Add target skill
                    </button>
                  </div>

                  <div className="mt-5 flex gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        openEditTarget(target)
                      }
                      className="rounded-xl border border-pink-200 px-4 py-2 font-sans text-sm font-bold text-pink-600 transition hover:bg-pink-50"
                    >
                      Edit target
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDeleteTarget(
                          target.id,
                        )
                      }
                      className="rounded-xl border border-slate-200 px-4 py-2 font-sans text-sm font-bold text-slate-600 transition hover:bg-slate-50"
                    >
                      Delete
                    </button>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>

      {targetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/50 p-4">
          <form
            onSubmit={handleTargetSubmit}
            className="w-full max-w-lg rounded-3xl bg-white p-7 shadow-2xl"
          >
            <p className="font-sans text-sm font-bold text-pink-500">
              Career planning
            </p>

            <h2 className="mt-1 font-serif text-2xl font-bold text-slate-900">
              {editingTargetId === null
                ? 'Add career target'
                : 'Edit career target'}
            </h2>

            <div className="mt-6 space-y-4">
              <input
                name="title"
                value={targetForm.title}
                onChange={
                  handleTargetChange
                }
                placeholder="Target title"
                required
                className="w-full rounded-xl border border-yellow-200 px-4 py-3 font-sans text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
              />

              <input
                name="target_role"
                value={
                  targetForm.target_role
                }
                onChange={
                  handleTargetChange
                }
                placeholder="Target role"
                required
                className="w-full rounded-xl border border-yellow-200 px-4 py-3 font-sans text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
              />

              <input
                name="target_level"
                value={
                  targetForm.target_level
                }
                onChange={
                  handleTargetChange
                }
                placeholder="Target level"
                className="w-full rounded-xl border border-yellow-200 px-4 py-3 font-sans text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
              />

              <input
                type="date"
                name="target_date"
                value={
                  targetForm.target_date
                }
                onChange={
                  handleTargetChange
                }
                className="w-full rounded-xl border border-yellow-200 px-4 py-3 font-sans text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
              />

              <textarea
                name="description"
                value={
                  targetForm.description
                }
                onChange={
                  handleTargetChange
                }
                placeholder="Description"
                rows={4}
                className="w-full resize-none rounded-xl border border-yellow-200 px-4 py-3 font-sans text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
              />

              <label className="flex items-center gap-3 font-sans text-sm font-semibold text-slate-700">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={
                    targetForm.is_active
                  }
                  onChange={
                    handleTargetChange
                  }
                  className="h-4 w-4 accent-pink-500"
                />
                Active career target
              </label>
            </div>

            <div className="mt-7 flex justify-end gap-3">
              <button
                type="button"
                onClick={
                  closeTargetModal
                }
                disabled={savingTarget}
                className="rounded-xl border border-slate-200 px-5 py-3 font-sans text-sm font-bold text-slate-600"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={savingTarget}
                className="rounded-xl bg-pink-500 px-5 py-3 font-sans text-sm font-bold text-white hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {savingTarget
                  ? 'Saving...'
                  : editingTargetId === null
                    ? 'Add career target'
                    : 'Save changes'}
              </button>
            </div>
          </form>
        </div>
      )}

      {skillModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-4">
          <form
            onSubmit={handleSkillSubmit}
            className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl"
          >
            <p className="font-sans text-sm font-bold text-pink-500">
              Skill planning
            </p>

            <h2 className="mt-1 font-serif text-2xl font-bold text-slate-900">
              Add target skill
            </h2>

            <p className="mt-2 font-sans text-sm text-slate-500">
              Choose a skill from your existing
              skills.
            </p>

            <div className="mt-6 space-y-5">
              <div>
                <label
                  htmlFor="target-skill"
                  className="font-sans text-sm font-bold text-slate-700"
                >
                  Skill
                </label>

                <select
                  id="target-skill"
                  value={
                    skillForm.skill_id
                  }
                  onChange={(event) =>
                    setSkillForm(
                      (current) => ({
                        ...current,
                        skill_id:
                          event.target.value,
                      }),
                    )
                  }
                  required
                  className="mt-2 w-full rounded-xl border border-yellow-200 bg-white px-4 py-3 font-sans text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
                >
                  <option value="">
                    Select a skill
                  </option>

                  {skills.map((skill) => (
                    <option
                      key={skill.id}
                      value={skill.id}
                    >
                      {skill.name}
                    </option>
                  ))}
                </select>

                {skills.length === 0 && (
                  <p className="mt-2 rounded-xl bg-pink-50 p-3 font-sans text-xs font-semibold text-pink-600">
                    Create a skill in the Skills
                    section first.
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="skill-importance"
                  className="font-sans text-sm font-bold text-slate-700"
                >
                  Importance
                </label>

                <select
                  id="skill-importance"
                  value={
                    skillForm.importance
                  }
                  onChange={(event) =>
                    setSkillForm(
                      (current) => ({
                        ...current,
                        importance:
                          event.target.value,
                      }),
                    )
                  }
                  className="mt-2 w-full rounded-xl border border-yellow-200 bg-white px-4 py-3 font-sans text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
                >
                  <option value="required">
                    Required
                  </option>

                  <option value="preferred">
                    Preferred
                  </option>

                  <option value="nice_to_have">
                    Nice to have
                  </option>
                </select>
              </div>
            </div>

            <div className="mt-7 flex justify-end gap-3">
              <button
                type="button"
                onClick={
                  closeSkillModal
                }
                disabled={savingSkill}
                className="rounded-xl border border-slate-200 px-5 py-3 font-sans text-sm font-bold text-slate-600"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={
                  savingSkill ||
                  !skillForm.skill_id ||
                  skills.length === 0
                }
                className="rounded-xl bg-pink-500 px-5 py-3 font-sans text-sm font-bold text-white hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {savingSkill
                  ? 'Adding...'
                  : 'Add target skill'}
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}