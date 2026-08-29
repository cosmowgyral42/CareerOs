import {
  useEffect,
  useState,
} from 'react';

import {
  LogOut,
  Mail,
  Save,
  Settings,
  Sparkles,
  User,
  Clock3,
  BriefcaseBusiness,
  CalendarDays,
  Timer,
  ShieldCheck,
} from 'lucide-react';

import {
  getMyProfile,
  updateMyProfile,
  removeToken,
} from '../../services/api';

import { useNavigate } from 'react-router-dom';


const TIMEZONES = [
  'UTC',
  'Asia/Kolkata',
  'America/New_York',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Asia/Dubai',
  'Asia/Singapore',
  'Asia/Tokyo',
  'Australia/Sydney',
];


function ProfileSettings() {
  const navigate = useNavigate();

  const [profile, setProfile] =
    useState(null);

  const [formData, setFormData] =
    useState({
      full_name: '',
      target_role: '',
      graduation_year: '',
      weekly_hours: '',
      tech_stack_summary: '',
      timezone: 'UTC',
    });

  const [isLoading, setIsLoading] =
    useState(true);

  const [isSaving, setIsSaving] =
    useState(false);

  const [error, setError] =
    useState('');

  const [success, setSuccess] =
    useState('');


  useEffect(() => {
    let cancelled = false;

    async function fetchProfile() {
      try {
        const data =
          await getMyProfile();

        if (cancelled) {
          return;
        }

        setProfile(data);

        setFormData({
          full_name:
            data.full_name || '',
          target_role:
            data.target_role || '',
          graduation_year:
            data.graduation_year ?? '',
          weekly_hours:
            data.weekly_hours ?? '',
          tech_stack_summary:
            data.tech_stack_summary || '',
          timezone:
            data.timezone || 'UTC',
        });

        setError('');
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : 'Unable to load profile.',
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    fetchProfile();

    return () => {
      cancelled = true;
    };
  }, []);


  function handleChange(event) {
    const {
      name,
      value,
    } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }


  async function handleSubmit(event) {
    event.preventDefault();

    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        full_name:
          formData.full_name.trim(),
        target_role:
          formData.target_role.trim() ||
          null,
        graduation_year:
          formData.graduation_year
            ? Number(
                formData.graduation_year,
              )
            : null,
        weekly_hours:
          formData.weekly_hours
            ? Number(
                formData.weekly_hours,
              )
            : null,
        tech_stack_summary:
          formData.tech_stack_summary.trim() ||
          null,
        timezone:
          formData.timezone,
      };

      const updatedProfile =
        await updateMyProfile(payload);

      setProfile(updatedProfile);

      setSuccess(
        'Profile settings saved successfully.',
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to save profile settings.',
      );
    } finally {
      setIsSaving(false);
    }
  }


  function handleLogout() {
    removeToken();

    navigate(
      '/login',
      {
        replace: true,
      },
    );
  }


  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-pink-100 border-t-pink-500" />

          <p className="mt-4 text-sm font-medium text-slate-500">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }


  if (error && !profile) {
    return (
      <div className="mx-auto max-w-6xl">
        <div className="rounded-3xl border border-red-200 bg-red-50 p-6 shadow-sm">
          <h1 className="font-serif text-xl font-bold text-red-900">
            Profile unavailable
          </h1>

          <p className="mt-2 text-sm text-red-700">
            {error}
          </p>
        </div>
      </div>
    );
  }


  const initial =
    profile?.full_name
      ?.charAt(0)
      ?.toUpperCase() ||
    'U';


  return (
    <div className="relative mx-auto max-w-6xl space-y-8 overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.35]"
        style={{
          backgroundImage:
            'radial-gradient(circle, #f9a8d4 1px, transparent 1px)',
          backgroundSize:
            '24px 24px',
        }}
      />


      <section className="rounded-3xl border border-pink-100 bg-white/80 p-6 shadow-lg shadow-pink-100/40 backdrop-blur-xl sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-5">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl border border-pink-100 bg-pink-50 text-3xl font-bold text-pink-600 shadow-sm">
              {initial}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-pink-500">
                  Your CareerOS
                </p>

                <Sparkles
                  size={16}
                  className="text-yellow-500"
                />
              </div>

              <h1 className="mt-2 font-serif text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Profile & Settings
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Keep your career workspace
                personal, accurate, and aligned
                with your goals.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-yellow-200 bg-yellow-50 px-4 py-3 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-yellow-700">
              Account status
            </p>

            <div className="mt-1 flex items-center gap-2">
              <ShieldCheck
                size={17}
                className="text-yellow-600"
              />

              <span className="text-sm font-bold text-slate-800">
                Active
              </span>
            </div>
          </div>
        </div>
      </section>


      {error && profile && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700 shadow-sm">
          {error}
        </div>
      )}


      {success && (
        <div className="rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-medium text-green-700 shadow-sm">
          {success}
        </div>
      )}


      <div className="grid gap-6 lg:grid-cols-[1.65fr_0.85fr]">
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-pink-100 bg-white/85 p-6 shadow-lg shadow-pink-100/30 backdrop-blur-xl sm:p-8"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-pink-50 p-3 text-pink-600">
              <User size={21} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Profile details
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Update the information that
                shapes your CareerOS workspace.
              </p>
            </div>
          </div>


          <div className="mt-7 grid gap-5">
            <Field
              label="Full name"
              icon={<User size={17} />}
            >
              <input
                type="text"
                name="full_name"
                value={
                  formData.full_name
                }
                onChange={
                  handleChange
                }
                required
                minLength="2"
                maxLength="100"
                className="input-style"
                placeholder="Your full name"
              />
            </Field>


            <Field
              label="Target role"
              icon={
                <BriefcaseBusiness
                  size={17}
                />
              }
            >
              <input
                type="text"
                name="target_role"
                value={
                  formData.target_role
                }
                onChange={
                  handleChange
                }
                maxLength="100"
                className="input-style"
                placeholder="Example: AI Engineer"
              />
            </Field>


            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="Graduation year"
                icon={
                  <CalendarDays
                    size={17}
                  />
                }
              >
                <input
                  type="number"
                  name="graduation_year"
                  value={
                    formData.graduation_year
                  }
                  onChange={
                    handleChange
                  }
                  min="2000"
                  max="2100"
                  className="input-style"
                  placeholder="2030"
                />
              </Field>


              <Field
                label="Weekly learning hours"
                icon={
                  <Timer size={17} />
                }
              >
                <input
                  type="number"
                  name="weekly_hours"
                  value={
                    formData.weekly_hours
                  }
                  onChange={
                    handleChange
                  }
                  min="0"
                  max="168"
                  className="input-style"
                  placeholder="10"
                />
              </Field>
            </div>


            <Field
              label="Tech stack summary"
              icon={
                <Sparkles size={17} />
              }
            >
              <textarea
                name="tech_stack_summary"
                value={
                  formData.tech_stack_summary
                }
                onChange={
                  handleChange
                }
                maxLength="2000"
                rows="5"
                className="input-style resize-none"
                placeholder="Example: React, FastAPI, PostgreSQL, Python..."
              />
            </Field>


            <div className="border-t border-pink-100 pt-6">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-yellow-50 p-2.5 text-yellow-600">
                  <Clock3 size={18} />
                </div>

                <div>
                  <h3 className="font-bold text-slate-900">
                    Timezone
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Used for timezone-aware
                    CareerOS features and daily
                    activity logic.
                  </p>
                </div>
              </div>


              <select
                name="timezone"
                value={
                  formData.timezone
                }
                onChange={
                  handleChange
                }
                className="input-style mt-4"
              >
                {TIMEZONES.map(
                  (timezone) => (
                    <option
                      key={timezone}
                      value={timezone}
                    >
                      {timezone}
                    </option>
                  ),
                )}
              </select>
            </div>


            <div className="flex flex-col gap-3 border-t border-pink-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs leading-5 text-slate-400">
                Your information is saved
                securely to your CareerOS
                account.
              </p>

              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-pink-500 px-5 py-3 text-sm font-bold text-white shadow-md shadow-pink-200 transition hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save size={17} />

                {isSaving
                  ? 'Saving...'
                  : 'Save changes'}
              </button>
            </div>
          </div>
        </form>


        <aside className="space-y-6">
          <div className="rounded-3xl border border-yellow-100 bg-white/85 p-6 shadow-lg shadow-yellow-100/30 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-yellow-50 p-3 text-yellow-600">
                <Mail size={20} />
              </div>

              <div>
                <h2 className="font-bold text-slate-900">
                  Account
                </h2>

                <p className="text-sm text-slate-500">
                  Your account identity
                </p>
              </div>
            </div>


            <div className="mt-6 space-y-4">
              <InfoItem
                label="Email"
                value={
                  profile?.email ||
                  'Not available'
                }
              />

              <InfoItem
                label="Member ID"
                value={
                  profile?.id
                    ? `#${profile.id}`
                    : 'Not available'
                }
              />

              <InfoItem
                label="Status"
                value={
                  profile?.is_active
                    ? 'Active'
                    : 'Inactive'
                }
              />
            </div>
          </div>


          <div className="rounded-3xl border border-pink-100 bg-white/85 p-6 shadow-lg shadow-pink-100/30 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-pink-50 p-3 text-pink-600">
                <Settings size={20} />
              </div>

              <div>
                <h2 className="font-bold text-slate-900">
                  Session
                </h2>

                <p className="text-sm text-slate-500">
                  Manage your access
                </p>
              </div>
            </div>


            <button
              type="button"
              onClick={handleLogout}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-600 transition hover:bg-red-100"
            >
              <LogOut size={17} />

              Log out
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}


function Field({
  label,
  icon,
  children,
}) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700">
        <span className="text-pink-500">
          {icon}
        </span>

        {label}
      </span>

      {children}
    </label>
  );
}


function InfoItem({
  label,
  value,
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 break-all text-sm font-semibold text-slate-700">
        {value}
      </p>
    </div>
  );
}


export default ProfileSettings;