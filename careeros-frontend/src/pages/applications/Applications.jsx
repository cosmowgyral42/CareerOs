import { useEffect, useState } from 'react';

import {
  createApplication,
  deleteApplication,
  getApplications,
  updateApplication,
} from '../../services/api';

const EMPTY_FORM = {
  company_name: '',
  role: '',
  job_url: '',
  status: 'saved',
  applied_date: '',
  deadline: '',
  notes: '',
};

function Applications() {
  const [applications, setApplications] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(EMPTY_FORM);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadApplications() {
      try {
        setError('');

        const data = await getApplications();

        if (!cancelled) {
          setApplications(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : 'Unable to load applications.',
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadApplications();

    return () => {
      cancelled = true;
    };
  }, []);

  function handleFormChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleEditChange(event) {
    const { name, value } = event.target;

    setEditForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleCreate(event) {
    event.preventDefault();

    if (
      !form.company_name.trim() ||
      !form.role.trim()
    ) {
      setError(
        'Company name and role are required.',
      );
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');

      const created = await createApplication({
        company_name: form.company_name.trim(),
        role: form.role.trim(),
        job_url: form.job_url.trim() || null,
        status: form.status || 'saved',
        applied_date: form.applied_date || null,
        deadline: form.deadline || null,
        notes: form.notes.trim() || null,
      });

      setApplications((current) => [
        created,
        ...current,
      ]);

      setForm(EMPTY_FORM);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to create application.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function startEditing(application) {
    setEditingId(application.id);

    setEditForm({
      company_name: application.company_name || '',
      role: application.role || '',
      job_url: application.job_url || '',
      status: application.status || 'saved',
      applied_date: application.applied_date || '',
      deadline: application.deadline || '',
      notes: application.notes || '',
    });

    setError('');
  }

  function cancelEditing() {
    setEditingId(null);
    setEditForm(EMPTY_FORM);
  }

  async function handleUpdate(applicationId) {
    if (
      !editForm.company_name.trim() ||
      !editForm.role.trim()
    ) {
      setError(
        'Company name and role are required.',
      );
      return;
    }

    try {
      setError('');

      const updated = await updateApplication(
        applicationId,
        {
          company_name:
            editForm.company_name.trim(),
          role: editForm.role.trim(),
          job_url:
            editForm.job_url.trim() || null,
          status:
            editForm.status || 'saved',
          applied_date:
            editForm.applied_date || null,
          deadline:
            editForm.deadline || null,
          notes:
            editForm.notes.trim() || null,
        },
      );

      setApplications((current) =>
        current.map((application) =>
          application.id === updated.id
            ? updated
            : application,
        ),
      );

      cancelEditing();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to update application.',
      );
    }
  }

  async function handleStatusChange(
    application,
    status,
  ) {
    try {
      setError('');

      const updated = await updateApplication(
        application.id,
        { status },
      );

      setApplications((current) =>
        current.map((item) =>
          item.id === updated.id
            ? updated
            : item,
        ),
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to update application status.',
      );
    }
  }

  async function handleDelete(applicationId) {
    try {
      setError('');

      await deleteApplication(applicationId);

      setApplications((current) =>
        current.filter(
          (application) =>
            application.id !== applicationId,
        ),
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to delete application.',
      );
    }
  }

  if (isLoading) {
    return (
      <section className="rounded-3xl border border-[#F3E8D2] bg-white p-8">
        <p className="text-sm font-medium text-slate-500">
          Loading your applications...
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <header>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-pink-600">
          Career workspace
        </p>

        <h1 className="mt-2 font-serif text-4xl font-bold tracking-tight text-slate-900">
          Applications
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
          Track the opportunities you are pursuing
          and keep every application organized.
        </p>
      </header>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
        <form
          onSubmit={handleCreate}
          className="h-fit rounded-3xl border border-[#F3E8D2] bg-white p-6 shadow-sm"
        >
          <div className="rounded-2xl bg-[#FFF8E7] p-4">
            <p className="text-sm font-semibold text-[#9A7620]">
              New opportunity
            </p>

            <h2 className="mt-1 font-serif text-2xl font-bold text-slate-900">
              Add application
            </h2>
          </div>

          <div className="mt-6 space-y-4">
            <FormInput
              name="company_name"
              label="Company name"
              value={form.company_name}
              onChange={handleFormChange}
              placeholder="Example: Google"
              required
            />

            <FormInput
              name="role"
              label="Role"
              value={form.role}
              onChange={handleFormChange}
              placeholder="Software Engineer"
              required
            />

            <FormInput
              name="job_url"
              label="Job URL"
              type="url"
              value={form.job_url}
              onChange={handleFormChange}
              placeholder="https://..."
            />

            <FormSelect
              name="status"
              label="Status"
              value={form.status}
              onChange={handleFormChange}
            />

            <FormInput
              name="applied_date"
              label="Applied date"
              type="date"
              value={form.applied_date}
              onChange={handleFormChange}
            />

            <FormInput
              name="deadline"
              label="Deadline"
              type="date"
              value={form.deadline}
              onChange={handleFormChange}
            />

            <FormTextarea
              name="notes"
              label="Notes"
              value={form.notes}
              onChange={handleFormChange}
              placeholder="Interview details, recruiter notes, preparation..."
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-pink-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting
                ? 'Adding...'
                : 'Add application'}
            </button>
          </div>
        </form>

        <div className="space-y-4">
          {applications.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-[#E8DFC8] bg-white p-10 text-center">
              <p className="text-sm font-semibold text-pink-600">
                Your pipeline is empty
              </p>

              <h2 className="mt-2 font-serif text-2xl font-bold text-slate-900">
                No applications yet
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Add your first opportunity to start
                tracking your application journey.
              </p>
            </div>
          ) : (
            applications.map((application) => {
              const isEditing =
                editingId === application.id;

              return (
                <article
                  key={application.id}
                  className="rounded-3xl border border-[#F3E8D2] bg-white p-6 shadow-sm"
                >
                  {isEditing ? (
                    <div className="space-y-4">
                      <h2 className="font-serif text-2xl font-bold text-slate-900">
                        Edit application
                      </h2>

                      <FormInput
                        name="company_name"
                        label="Company name"
                        value={
                          editForm.company_name
                        }
                        onChange={
                          handleEditChange
                        }
                        required
                      />

                      <FormInput
                        name="role"
                        label="Role"
                        value={editForm.role}
                        onChange={
                          handleEditChange
                        }
                        required
                      />

                      <FormInput
                        name="job_url"
                        label="Job URL"
                        type="url"
                        value={editForm.job_url}
                        onChange={
                          handleEditChange
                        }
                      />

                      <FormSelect
                        name="status"
                        label="Status"
                        value={editForm.status}
                        onChange={
                          handleEditChange
                        }
                      />

                      <FormInput
                        name="applied_date"
                        label="Applied date"
                        type="date"
                        value={
                          editForm.applied_date
                        }
                        onChange={
                          handleEditChange
                        }
                      />

                      <FormInput
                        name="deadline"
                        label="Deadline"
                        type="date"
                        value={editForm.deadline}
                        onChange={
                          handleEditChange
                        }
                      />

                      <FormTextarea
                        name="notes"
                        label="Notes"
                        value={editForm.notes}
                        onChange={
                          handleEditChange
                        }
                      />

                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            handleUpdate(
                              application.id,
                            )
                          }
                          className="rounded-xl bg-pink-500 px-4 py-2 text-sm font-bold text-white hover:bg-pink-600"
                        >
                          Save changes
                        </button>

                        <button
                          type="button"
                          onClick={cancelEditing}
                          className="rounded-xl bg-[#FFF8E7] px-4 py-2 text-sm font-bold text-[#9A7620] hover:bg-[#FFF1C7]"
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
                            <h2 className="font-serif text-2xl font-bold text-slate-900">
                              {application.company_name}
                            </h2>

                            <span className="rounded-full bg-pink-50 px-3 py-1 text-xs font-bold capitalize text-pink-700">
                              {application.status}
                            </span>
                          </div>

                          <p className="mt-2 text-base font-semibold text-slate-700">
                            {application.role}
                          </p>

                          <div className="mt-4 flex flex-wrap gap-2">
                            {application.applied_date && (
                              <span className="rounded-lg bg-[#FFF8E7] px-3 py-1 text-xs font-semibold text-[#9A7620]">
                                Applied:{' '}
                                {application.applied_date}
                              </span>
                            )}

                            {application.deadline && (
                              <span className="rounded-lg bg-[#FFF8E7] px-3 py-1 text-xs font-semibold text-[#9A7620]">
                                Deadline:{' '}
                                {application.deadline}
                              </span>
                            )}
                          </div>

                          {application.notes && (
                            <p className="mt-4 text-sm leading-6 text-slate-500">
                              {application.notes}
                            </p>
                          )}

                          {application.job_url && (
                            <a
                              href={
                                application.job_url
                              }
                              target="_blank"
                              rel="noreferrer"
                              className="mt-4 inline-flex font-semibold text-pink-600 hover:text-pink-700"
                            >
                              Open job listing
                            </a>
                          )}
                        </div>
                      </div>

                      <div className="mt-5 flex flex-wrap gap-2 border-t border-[#F4EEE3] pt-4">
                        <button
                          type="button"
                          onClick={() =>
                            startEditing(
                              application,
                            )
                          }
                          className="rounded-xl bg-pink-50 px-3 py-2 text-xs font-bold text-pink-700 hover:bg-pink-100"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleStatusChange(
                              application,
                              application.status ===
                                'completed'
                                ? 'saved'
                                : 'completed',
                            )
                          }
                          className="rounded-xl bg-[#FFF8E7] px-3 py-2 text-xs font-bold text-[#9A7620] hover:bg-[#FFF1C7]"
                        >
                          {application.status ===
                          'completed'
                            ? 'Mark saved'
                            : 'Complete'}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(
                              application.id,
                            )
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

function FormInput({
  name,
  label,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  required = false,
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="text-sm font-semibold text-slate-700"
      >
        {label}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
      />
    </div>
  );
}

function FormSelect({
  name,
  label,
  value,
  onChange,
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="text-sm font-semibold text-slate-700"
      >
        {label}
      </label>

      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
      >
        <option value="saved">Saved</option>
        <option value="applied">Applied</option>
        <option value="interview">Interview</option>
        <option value="offer">Offer</option>
        <option value="rejected">Rejected</option>
        <option value="completed">
          Completed
        </option>
      </select>
    </div>
  );
}

function FormTextarea({
  name,
  label,
  value,
  onChange,
  placeholder = '',
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="text-sm font-semibold text-slate-700"
      >
        {label}
      </label>

      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={4}
        className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
      />
    </div>
  );
}

export default Applications;
