import { useEffect, useState } from 'react';

import {
  createProject,
  deleteProject,
  getProjects,
  updateProject,
} from '../../services/api';

function Projects() {
  const [projects, setProjects] = useState([]);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [techStack, setTechStack] = useState('');
  const [repositoryUrl, setRepositoryUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [targetDate, setTargetDate] = useState('');

  const [editingProjectId, setEditingProjectId] =
    useState(null);

  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] =
    useState('');
  const [editTechStack, setEditTechStack] = useState('');
  const [editRepositoryUrl, setEditRepositoryUrl] =
    useState('');
  const [editLiveUrl, setEditLiveUrl] = useState('');
  const [editTargetDate, setEditTargetDate] =
    useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadProjects() {
      try {
        setError('');

        const data = await getProjects();

        if (!cancelled) {
          setProjects(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : 'Unable to load projects.',
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadProjects();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleCreate(event) {
    event.preventDefault();

    if (!title.trim()) {
      setError('Project title is required.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');

      const project = await createProject({
        title: title.trim(),
        description: description.trim() || null,
        tech_stack: techStack.trim() || null,
        repository_url: repositoryUrl.trim() || null,
        live_url: liveUrl.trim() || null,
        target_date: targetDate || null,
      });

      setProjects((current) => [
        project,
        ...current,
      ]);

      setTitle('');
      setDescription('');
      setTechStack('');
      setRepositoryUrl('');
      setLiveUrl('');
      setTargetDate('');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to create project.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function startEditing(project) {
    setEditingProjectId(project.id);

    setEditTitle(project.title);
    setEditDescription(project.description || '');
    setEditTechStack(project.tech_stack || '');
    setEditRepositoryUrl(
      project.repository_url || '',
    );
    setEditLiveUrl(project.live_url || '');
    setEditTargetDate(project.target_date || '');

    setError('');
  }

  function cancelEditing() {
    setEditingProjectId(null);

    setEditTitle('');
    setEditDescription('');
    setEditTechStack('');
    setEditRepositoryUrl('');
    setEditLiveUrl('');
    setEditTargetDate('');
  }

  async function handleUpdate(projectId) {
    if (!editTitle.trim()) {
      setError('Project title is required.');
      return;
    }

    try {
      setError('');

      const updatedProject = await updateProject(
        projectId,
        {
          title: editTitle.trim(),
          description:
            editDescription.trim() || null,
          tech_stack:
            editTechStack.trim() || null,
          repository_url:
            editRepositoryUrl.trim() || null,
          live_url:
            editLiveUrl.trim() || null,
          target_date:
            editTargetDate || null,
        },
      );

      setProjects((current) =>
        current.map((project) =>
          project.id === updatedProject.id
            ? updatedProject
            : project,
        ),
      );

      cancelEditing();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to update project.',
      );
    }
  }

  async function handleStatusChange(
    project,
    status,
  ) {
    try {
      setError('');

      const updatedProject = await updateProject(
        project.id,
        { status },
      );

      setProjects((current) =>
        current.map((item) =>
          item.id === updatedProject.id
            ? updatedProject
            : item,
        ),
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to update project status.',
      );
    }
  }

  async function handleDelete(projectId) {
    try {
      setError('');

      await deleteProject(projectId);

      setProjects((current) =>
        current.filter(
          (project) => project.id !== projectId,
        ),
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to delete project.',
      );
    }
  }

  if (isLoading) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-8">
        <p className="text-sm font-medium text-slate-500">
          Loading your projects...
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
          Projects
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Track the projects that demonstrate your
          technical growth.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
        <form
          onSubmit={handleCreate}
          className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <h2 className="text-lg font-bold text-slate-900">
            Create project
          </h2>

          <div className="mt-5 space-y-4">
            <ProjectInput
              id="project-title"
              label="Title"
              value={title}
              onChange={setTitle}
              placeholder="CareerOS"
            />

            <ProjectTextarea
              id="project-description"
              label="Description"
              value={description}
              onChange={setDescription}
              placeholder="Describe your project..."
            />

            <ProjectInput
              id="project-tech-stack"
              label="Tech stack"
              value={techStack}
              onChange={setTechStack}
              placeholder="React, FastAPI, PostgreSQL"
            />

            <ProjectInput
              id="project-repository"
              label="Repository URL"
              value={repositoryUrl}
              onChange={setRepositoryUrl}
              placeholder="https://github.com/..."
              type="url"
            />

            <ProjectInput
              id="project-live"
              label="Live URL"
              value={liveUrl}
              onChange={setLiveUrl}
              placeholder="https://..."
              type="url"
            />

            <div>
              <label
                htmlFor="project-target-date"
                className="text-sm font-semibold text-slate-700"
              >
                Target date
              </label>

              <input
                id="project-target-date"
                type="date"
                value={targetDate}
                onChange={(event) =>
                  setTargetDate(event.target.value)
                }
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting
                ? 'Creating...'
                : 'Create project'}
            </button>
          </div>
        </form>

        <div className="space-y-4">
          {projects.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <h2 className="font-bold text-slate-900">
                No projects yet
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Create your first project to start
                building your portfolio history.
              </p>
            </div>
          ) : (
            projects.map((project) => {
              const isEditing =
                editingProjectId === project.id;

              return (
                <article
                  key={project.id}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  {isEditing ? (
                    <div className="space-y-4">
                      <ProjectInput
                        id={`edit-title-${project.id}`}
                        label="Title"
                        value={editTitle}
                        onChange={setEditTitle}
                      />

                      <ProjectTextarea
                        id={`edit-description-${project.id}`}
                        label="Description"
                        value={editDescription}
                        onChange={setEditDescription}
                      />

                      <ProjectInput
                        id={`edit-tech-${project.id}`}
                        label="Tech stack"
                        value={editTechStack}
                        onChange={setEditTechStack}
                      />

                      <ProjectInput
                        id={`edit-repository-${project.id}`}
                        label="Repository URL"
                        value={editRepositoryUrl}
                        onChange={setEditRepositoryUrl}
                        type="url"
                      />

                      <ProjectInput
                        id={`edit-live-${project.id}`}
                        label="Live URL"
                        value={editLiveUrl}
                        onChange={setEditLiveUrl}
                        type="url"
                      />

                      <div>
                        <label
                          htmlFor={`edit-date-${project.id}`}
                          className="text-sm font-semibold text-slate-700"
                        >
                          Target date
                        </label>

                        <input
                          id={`edit-date-${project.id}`}
                          type="date"
                          value={
                            editTargetDate || ''
                          }
                          onChange={(event) =>
                            setEditTargetDate(
                              event.target.value,
                            )
                          }
                          className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
                        />
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            handleUpdate(project.id)
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
                    <>
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-3">
                            <h2 className="text-xl font-bold text-slate-900">
                              {project.title}
                            </h2>

                            <span className="rounded-full bg-pink-50 px-3 py-1 text-xs font-bold capitalize text-pink-700">
                              {project.status}
                            </span>
                          </div>

                          {project.description && (
                            <p className="mt-3 text-sm leading-6 text-slate-500">
                              {project.description}
                            </p>
                          )}

                          {project.tech_stack && (
                            <p className="mt-3 text-sm font-medium text-slate-700">
                              <span className="font-bold">
                                Tech:
                              </span>{' '}
                              {project.tech_stack}
                            </p>
                          )}

                          <div className="mt-4 flex flex-wrap gap-4 text-sm">
                            {project.repository_url && (
                              <a
                                href={project.repository_url}
                                target="_blank"
                                rel="noreferrer"
                                className="font-semibold text-pink-600 hover:text-pink-700"
                              >
                                Repository
                              </a>
                            )}

                            {project.live_url && (
                              <a
                                href={project.live_url}
                                target="_blank"
                                rel="noreferrer"
                                className="font-semibold text-emerald-600 hover:text-emerald-700"
                              >
                                Live project
                              </a>
                            )}
                          </div>

                          {project.target_date && (
                            <p className="mt-3 text-xs font-medium text-slate-400">
                              Target:{' '}
                              {project.target_date}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                        <button
                          type="button"
                          onClick={() =>
                            startEditing(project)
                          }
                          className="rounded-xl bg-pink-50 px-3 py-2 text-xs font-bold text-pink-700 hover:bg-pink-100"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleStatusChange(
                              project,
                              project.status ===
                                'completed'
                                ? 'active'
                                : 'completed',
                            )
                          }
                          className="rounded-xl bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-100"
                        >
                          {project.status ===
                          'completed'
                            ? 'Mark active'
                            : 'Complete'}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(project.id)
                          }
                          className="rounded-xl bg-red-50 px-3 py-2 text-xs font-bold text-red-700 hover:bg-red-100"
                        >
                          Delete
                        </button>
                      </div>
                    </>
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

function ProjectInput({
  id,
  label,
  value,
  onChange,
  placeholder = '',
  type = 'text',
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="text-sm font-semibold text-slate-700"
      >
        {label}
      </label>

      <input
        id={id}
        type={type}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
      />
    </div>
  );
}

function ProjectTextarea({
  id,
  label,
  value,
  onChange,
  placeholder = '',
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="text-sm font-semibold text-slate-700"
      >
        {label}
      </label>

      <textarea
        id={id}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        rows={4}
        className="mt-2 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
      />
    </div>
  );
}

export default Projects;
