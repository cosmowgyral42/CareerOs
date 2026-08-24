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
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-slate-200 border-t-violet-600" />

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
          <h1 className="text-lg font-bold text-red-900">
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
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-600">
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

        <StatCard
          label="Applications"
          value={stats.total_applications ?? 0}
        />
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
            className="mt-6 inline-flex rounded-xl bg-pink-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-pink-700"
          >
            Manage goals
          </Link>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-linear-to-br from-violet-50 to-indigo-50 p-7">
          <p className="text-sm font-semibold text-violet-700">
            Goals overview
          </p>

          <p className="mt-4 text-5xl font-bold text-slate-900">
            {stats.total_goals ?? 0}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            total goals
          </p>

          <div className="mt-6 h-2 overflow-hidden rounded-full bg-white">
            <div
              className="h-full rounded-full bg-violet-600 transition-all"
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
          className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-md"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-700">
                Tasks
              </p>

              <p className="mt-3 text-2xl font-bold text-slate-900">
                {stats.total_tasks ?? 0}
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Work required to reach your goals.
              </p>
            </div>

            <span className="rounded-lg bg-violet-50 px-3 py-2 text-xs font-bold text-violet-700 transition group-hover:bg-violet-100">
              Open
            </span>
          </div>
        </Link>

        <Link
          to="/projects"
          className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-md"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-700">
                Projects
              </p>

              <p className="mt-3 text-2xl font-bold text-slate-900">
                {stats.total_projects ?? 0}
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Your practical work and projects.
              </p>
            </div>

            <span className="rounded-lg bg-violet-50 px-3 py-2 text-xs font-bold text-violet-700 transition group-hover:bg-violet-100">
              Open
            </span>
          </div>
        </Link>

        <Link
          to="/resources"
          className="group rounded-2xl border border-[#F3E8D2] bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-pink-200 hover:shadow-md"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-serif text-sm font-semibold text-slate-700">
                Resources
              </p>

              <p className="mt-3 font-serif text-2xl font-bold text-slate-900">
                {stats.total_resources ?? 0}
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Learning material saved in CareerOS.
              </p>
           </div>

           <span className="rounded-lg bg-[#FFF8E7] px-3 py-2 text-xs font-bold text-[#9A7620] transition group-hover:bg-pink-50 group-hover:text-pink-700">
             Open
           </span>
         </div>
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

      <p className="mt-3 text-3xl font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}


export default Dashboard;