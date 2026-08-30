import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { getDashboard } from '../../services/api';

function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function fetchDashboard() {
      try {
        const data = await getDashboard();

        if (!cancelled) {
          setDashboard(data);
          setError('');
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : 'Unable to load dashboard.',
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    fetchDashboard();

    return () => {
      cancelled = true;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-slate-200 border-t-pink-500" />

          <p className="mt-4 text-sm text-slate-500">
            Loading your workspace...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <h1 className="font-serif text-lg font-bold text-red-900">
            Dashboard unavailable
          </h1>

          <p className="mt-2 text-sm text-red-700">
            {error}
          </p>
        </div>
      </div>
    );
  }

  const stats = dashboard?.stats ?? {};

  const totalGoals = stats.total_goals ?? 0;
  const completedGoals = stats.completed_goals ?? 0;

  const goalProgress =
    totalGoals > 0
      ? Math.min(
          100,
          (completedGoals / totalGoals) * 100,
        )
      : 0;

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-pink-600">
          Career workspace
        </p>

        <h1 className="mt-2 font-serif text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
          Your dashboard
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
          Your career progress, goals, projects, tasks,
          applications, and resources in one place.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Active goals"
          value={stats.active_goals ?? 0}
        />

        <StatCard
          label="Pending tasks"
          value={stats.pending_tasks ?? 0}
        />

        <StatCard
          label="Active projects"
          value={stats.active_projects ?? 0}
        />

        <Link
          to="/applications"
          className="group rounded-2xl border border-[#F3E8D2] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-pink-200 hover:shadow-md"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Applications
              </p>

              <p className="mt-3 font-serif text-3xl font-bold text-slate-900">
                {stats.total_applications ?? 0}
              </p>
            </div>

            <span className="rounded-lg bg-[#FFF8E7] px-3 py-2 text-xs font-bold text-[#9A7620]">
              Open
            </span>
          </div>

          <p className="mt-3 text-xs font-medium text-slate-500">
            Track your job applications
          </p>
        </Link>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">
            Career progress
          </p>

          <h2 className="mt-2 font-serif text-2xl font-bold text-slate-900">
            Build momentum, one goal at a time.
          </h2>

          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">
            Turn your career plans into measurable goals
            and track your progress from one workspace.
          </p>

          <Link
            to="/goals"
            className="mt-5 inline-flex rounded-xl bg-pink-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-pink-600"
          >
            Manage goals
          </Link>
        </div>

        <div className="rounded-3xl border border-[#F3E8D2] bg-linear-to-br from-[#FFF8E7] to-pink-50 p-7">
          <p className="text-sm font-semibold text-pink-700">
            Goals overview
          </p>

          <p className="mt-4 font-serif text-5xl font-bold text-slate-900">
            {totalGoals}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            total goals
          </p>

          <div className="mt-6 h-2 overflow-hidden rounded-full bg-white">
            <div
              className="h-full rounded-full bg-pink-400 transition-all"
              style={{
                width: `${goalProgress}%`,
              }}
            />
          </div>

          <p className="mt-3 text-xs font-medium text-slate-500">
            {completedGoals} completed
          </p>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <DashboardLink
          to="/tasks"
          title="Tasks"
          value={stats.total_tasks ?? 0}
          description="Work required to reach your goals."
        />

        <DashboardLink
          to="/projects"
          title="Projects"
          value={stats.total_projects ?? 0}
          description="Your practical work and projects."
        />

        <DashboardLink
          to="/resources"
          title="Resources"
          value={stats.total_resources ?? 0}
          description="Learning material saved in CareerOS."
        />
      </section>

      <section>
        <Link
          to="/applications"
          className="group block rounded-3xl border border-[#F3E8D2] bg-white p-7 shadow-sm transition hover:-translate-y-0.5 hover:border-pink-200 hover:shadow-md"
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-pink-600">
                Career pipeline
              </p>

              <h2 className="mt-2 font-serif text-3xl font-bold text-slate-900">
                Applications
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Manage your opportunities, deadlines,
                interviews, and application status.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-[#FFF8E7] px-5 py-4 text-center">
                <p className="font-serif text-3xl font-bold text-slate-900">
                  {stats.total_applications ?? 0}
                </p>

                <p className="text-xs font-semibold text-[#9A7620]">
                  applications
                </p>
              </div>

              <span className="rounded-xl bg-pink-500 px-4 py-3 text-sm font-bold text-white">
                Open applications
              </span>
            </div>
          </div>
        </Link>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <DashboardFeature
          to="/skills"
          label="Skills"
          title="Build your skills"
          description="Track your abilities and proficiency levels."
          button="Open skills"
        />

        <DashboardFeature
          to="/skill-gaps"
          label="Skill gaps"
          title="Close your gaps"
          description="Track missing and developing skills."
          button="Open skill gaps"
        />

        <DashboardFeature
          to="/career-targets"
          label="Career direction"
          title="Career Targets"
          description="Define your target roles and the skills you need."
          button="Manage targets →"
        />

        <DashboardFeature
          to="/resume-analysis"
          label="CareerOS AI"
          title="Resume Analysis"
          description="Upload your resume, compare it with a job description, and discover your match score, skills, weaknesses, and recommendations."
          button="Open Resume AI"
          highlighted
        />
      </section>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">
        {label}
      </p>

      <p className="mt-3 font-serif text-3xl font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}

function DashboardLink({
  to,
  title,
  value,
  description,
}) {
  return (
    <Link
      to={to}
      className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-pink-200 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-700">
            {title}
          </p>

          <p className="mt-3 font-serif text-2xl font-bold text-slate-900">
            {value}
          </p>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {description}
          </p>
        </div>

        <span className="rounded-lg bg-[#FFF8E7] px-3 py-2 text-xs font-bold text-[#9A7620]">
          Open
        </span>
      </div>
    </Link>
  );
}

function DashboardFeature({
  to,
  label,
  title,
  description,
  button,
  highlighted = false,
}) {
  return (
    <Link
      to={to}
      className={[
        'group block rounded-3xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg',
        highlighted
          ? 'border-yellow-200'
          : 'border-pink-100 hover:border-pink-200',
      ].join(' ')}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-sans text-sm font-bold uppercase tracking-wider text-pink-500">
            {label}
          </p>

          <h2 className="mt-2 font-serif text-2xl font-bold text-slate-900">
            {title}
          </h2>

          <p className="mt-2 max-w-md font-sans text-sm leading-6 text-slate-500">
            {description}
          </p>
        </div>

        {highlighted && (
          <div className="rounded-2xl bg-yellow-300 px-4 py-3 font-sans text-sm font-bold text-slate-900">
            Open
          </div>
        )}
      </div>

      {!highlighted && (
        <span className="mt-5 inline-flex rounded-xl bg-[#FFF8E7] px-4 py-2 text-sm font-bold text-amber-700">
          {button}
        </span>
      )}

      {highlighted && (
        <span className="mt-5 inline-flex rounded-xl bg-pink-500 px-4 py-2 text-sm font-bold text-white">
          {button}
        </span>
      )}
    </Link>
  );
}

export default Dashboard;