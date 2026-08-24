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

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-pink-600">
          Career workspace
        </p>

        <h1 className="mt-2 font-serif text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
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

            <span className="rounded-lg bg-[#FFF8E7] px-3 py-2 text-xs font-bold text-[#9A7620] transition group-hover:bg-pink-50 group-hover:text-pink-700">
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
            {stats.total_goals ?? 0}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            total goals
          </p>

          <div className="mt-6 h-2 overflow-hidden rounded-full bg-white">
            <div
              className="h-full rounded-full bg-pink-400 transition-all"
              style={{
                width:
                  stats.total_goals > 0
                    ? `${Math.min(
                        100,
                        ((stats.completed_goals ?? 0) /
                          stats.total_goals) *
                          100,
                      )}%`
                    : '0%',
              }}
            />
          </div>

          <p className="mt-3 text-xs font-medium text-slate-500">
            {stats.completed_goals ?? 0} completed
          </p>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          to="/tasks"
          className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-pink-200 hover:shadow-md"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-700">
                Tasks
              </p>

              <p className="mt-3 font-serif text-2xl font-bold text-slate-900">
                {stats.total_tasks ?? 0}
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Work required to reach your goals.
              </p>
            </div>

            <span className="rounded-lg bg-[#FFF8E7] px-3 py-2 text-xs font-bold text-[#9A7620] group-hover:bg-pink-50 group-hover:text-pink-700">
              Open
            </span>
          </div>
        </Link>

        <Link
          to="/projects"
          className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-pink-200 hover:shadow-md"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-700">
                Projects
              </p>

              <p className="mt-3 font-serif text-2xl font-bold text-slate-900">
                {stats.total_projects ?? 0}
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Your practical work and projects.
              </p>
            </div>

            <span className="rounded-lg bg-[#FFF8E7] px-3 py-2 text-xs font-bold text-[#9A7620] group-hover:bg-pink-50 group-hover:text-pink-700">
              Open
            </span>
          </div>
        </Link>

        <Link
          to="/resources"
          className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-pink-200 hover:shadow-md"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-700">
                Resources
              </p>

              <p className="mt-3 font-serif text-2xl font-bold text-slate-900">
                {stats.total_resources ?? 0}
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Learning material saved in CareerOS.
              </p>
            </div>

            <span className="rounded-lg bg-[#FFF8E7] px-3 py-2 text-xs font-bold text-[#9A7620] group-hover:bg-pink-50 group-hover:text-pink-700">
              Open
            </span>
          </div>
        </Link>
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

              <span className="rounded-xl bg-pink-500 px-4 py-3 text-sm font-bold text-white transition group-hover:bg-pink-600">
                Open applications
              </span>
            </div>
          </div>
        </Link>

        <Link
          to="/skills"
          className="block rounded-3xl border border-pink-100 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-pink-200 hover:shadow-md"
        >
          <p className="text-sm font-semibold text-pink-500">
            Skills
          </p>

          <h2 className="mt-2 font-serif text-2xl font-bold text-slate-900">
            Build your skills
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Track your abilities and proficiency levels.
          </p>

          <span className="mt-5 inline-flex rounded-xl bg-[#FFF8E7] px-4 py-2 text-sm font-bold text-amber-700">
            Open skills
          </span>
        </Link>

        <Link
          to="/skill-gaps"
          className="block rounded-3xl border border-pink-100 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-pink-200 hover:shadow-md"
        >
          <p className="text-sm font-semibold text-pink-500">
            Skill gaps
          </p>

          <h2 className="mt-2 font-serif text-2xl font-bold text-slate-900">
            Close your gaps
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Track missing and developing skills.
          </p>

          <span className="mt-5 inline-flex rounded-xl bg-[#FFF8E7] px-4 py-2 text-sm font-bold text-amber-700">
            Open skill gaps
          </span>
        </Link>
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

export default Dashboard;