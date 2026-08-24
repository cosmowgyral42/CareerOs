import { useEffect, useState } from 'react';

import {
  createResource,
  deleteResource,
  getResources,
  updateResource,
} from '../../services/api';

function Resources() {
  const [resources, setResources] = useState([]);

  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [resourceType, setResourceType] =
    useState('other');
  const [topic, setTopic] = useState('');
  const [notes, setNotes] = useState('');

  const [editingResourceId, setEditingResourceId] =
    useState(null);

  const [editTitle, setEditTitle] = useState('');
  const [editUrl, setEditUrl] = useState('');
  const [editResourceType, setEditResourceType] =
    useState('other');
  const [editTopic, setEditTopic] = useState('');
  const [editNotes, setEditNotes] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] =
    useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadResources() {
      try {
        setError('');

        const data = await getResources();

        if (!cancelled) {
          setResources(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : 'Unable to load resources.',
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadResources();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleCreate(event) {
    event.preventDefault();

    if (!title.trim()) {
      setError('Resource title is required.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');

      const resource = await createResource({
        title: title.trim(),
        url: url.trim() || null,
        resource_type:
          resourceType.trim() || 'other',
        topic: topic.trim() || null,
        notes: notes.trim() || null,
        status: 'saved',
      });

      setResources((current) => [
        resource,
        ...current,
      ]);

      setTitle('');
      setUrl('');
      setResourceType('other');
      setTopic('');
      setNotes('');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to create resource.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function startEditing(resource) {
    setEditingResourceId(resource.id);

    setEditTitle(resource.title);
    setEditUrl(resource.url || '');
    setEditResourceType(
      resource.resource_type || 'other',
    );
    setEditTopic(resource.topic || '');
    setEditNotes(resource.notes || '');

    setError('');
  }

  function cancelEditing() {
    setEditingResourceId(null);

    setEditTitle('');
    setEditUrl('');
    setEditResourceType('other');
    setEditTopic('');
    setEditNotes('');
  }

  async function handleUpdate(resourceId) {
    if (!editTitle.trim()) {
      setError('Resource title is required.');
      return;
    }

    try {
      setError('');

      const updatedResource =
        await updateResource(
          resourceId,
          {
            title: editTitle.trim(),
            url: editUrl.trim() || null,
            resource_type:
              editResourceType.trim() || 'other',
            topic: editTopic.trim() || null,
            notes: editNotes.trim() || null,
          },
        );

      setResources((current) =>
        current.map((resource) =>
          resource.id === updatedResource.id
            ? updatedResource
            : resource,
        ),
      );

      cancelEditing();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to update resource.',
      );
    }
  }

  async function handleStatusChange(
    resource,
    status,
  ) {
    try {
      setError('');

      const updatedResource =
        await updateResource(
          resource.id,
          { status },
        );

      setResources((current) =>
        current.map((item) =>
          item.id === updatedResource.id
            ? updatedResource
            : item,
        ),
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to update resource status.',
      );
    }
  }

  async function handleDelete(resourceId) {
    try {
      setError('');

      await deleteResource(resourceId);

      setResources((current) =>
        current.filter(
          (resource) =>
            resource.id !== resourceId,
        ),
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to delete resource.',
      );
    }
  }

  if (isLoading) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-8">
        <p className="text-sm font-medium text-slate-500">
          Loading your resources...
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
          Resources
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Save useful learning material and career
          resources in one place.
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
            Add resource
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Save something useful for your career.
          </p>

          <div className="mt-5 space-y-4">
            <ResourceInput
              id="resource-title"
              label="Title"
              value={title}
              onChange={setTitle}
              placeholder="FastAPI Documentation"
            />

            <ResourceInput
              id="resource-url"
              label="URL"
              value={url}
              onChange={setUrl}
              placeholder="https://..."
              type="url"
            />

            <ResourceInput
              id="resource-type"
              label="Resource type"
              value={resourceType}
              onChange={setResourceType}
              placeholder="documentation"
            />

            <ResourceInput
              id="resource-topic"
              label="Topic"
              value={topic}
              onChange={setTopic}
              placeholder="Backend development"
            />

            <ResourceTextarea
              id="resource-notes"
              label="Notes"
              value={notes}
              onChange={setNotes}
              placeholder="Why this resource is useful..."
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-pink-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-pink-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting
                ? 'Saving...'
                : 'Add resource'}
            </button>
          </div>
        </form>

        <div className="space-y-4">
          {resources.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <h2 className="font-bold text-slate-900">
                No resources yet
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Add your first learning resource.
              </p>
            </div>
          ) : (
            resources.map((resource) => {
              const isEditing =
                editingResourceId === resource.id;

              return (
                <article
                  key={resource.id}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  {isEditing ? (
                    <div className="space-y-4">
                      <ResourceInput
                        id={`edit-title-${resource.id}`}
                        label="Title"
                        value={editTitle}
                        onChange={setEditTitle}
                      />

                      <ResourceInput
                        id={`edit-url-${resource.id}`}
                        label="URL"
                        value={editUrl}
                        onChange={setEditUrl}
                        type="url"
                      />

                      <ResourceInput
                        id={`edit-type-${resource.id}`}
                        label="Resource type"
                        value={editResourceType}
                        onChange={setEditResourceType}
                      />

                      <ResourceInput
                        id={`edit-topic-${resource.id}`}
                        label="Topic"
                        value={editTopic}
                        onChange={setEditTopic}
                      />

                      <ResourceTextarea
                        id={`edit-notes-${resource.id}`}
                        label="Notes"
                        value={editNotes}
                        onChange={setEditNotes}
                      />

                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            handleUpdate(resource.id)
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
                              {resource.title}
                            </h2>

                            <span className="rounded-full bg-pink-50 px-3 py-1 text-xs font-bold capitalize text-pink-700">
                              {resource.status}
                            </span>
                          </div>

                          <div className="mt-3 flex flex-wrap gap-2">
                            <span className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                              {resource.resource_type}
                            </span>

                            {resource.topic && (
                              <span className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                                {resource.topic}
                              </span>
                            )}
                          </div>

                          {resource.notes && (
                            <p className="mt-4 text-sm leading-6 text-slate-500">
                              {resource.notes}
                            </p>
                          )}

                          {resource.url && (
                            <a
                              href={resource.url}
                              target="_blank"
                              rel="noreferrer"
                              className="mt-4 inline-flex font-semibold text-pink-600 hover:text-pink-700"
                            >
                              Open resource
                            </a>
                          )}
                        </div>
                      </div>

                      <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                        <button
                          type="button"
                          onClick={() =>
                            startEditing(resource)
                          }
                          className="rounded-xl bg-pink-50 px-3 py-2 text-xs font-bold text-pink-700 hover:bg-pink-100"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleStatusChange(
                              resource,
                              resource.status ===
                                'completed'
                                ? 'saved'
                                : 'completed',
                            )
                          }
                          className="rounded-xl bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-100"
                        >
                          {resource.status ===
                          'completed'
                            ? 'Mark saved'
                            : 'Complete'}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(resource.id)
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

function ResourceInput({
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

function ResourceTextarea({
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

export default Resources;