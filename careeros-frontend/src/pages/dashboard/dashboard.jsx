import { useEffect, useState } from 'react';

import { getDashboard } from '../../services/api';
import { useAuth } from '../../context/useAuth';

function Dashboard() {
  const { user } = useAuth();

  const [dashboard, setDashboard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const firstName =
    user?.full_name?.split(' ')[0] || 'there';

  useEffect(() => {
    async function loadDashboard() {
      try {
        setIsLoading(true);
        setError('');

        const data = await getDashboard();

        setDashboard(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Unable to load your dashboard.',
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-violet-600" />

          <p className="mt-4 text-sm font-medium text-slate-500">
            Loading your CareerOS workspace...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-red-200 bg-red-50 p-6">
        <h2 className="font-bold text-red-900">
          Unable to load dashboard
        </h2>

        <p className="mt-2 text-sm leading-6 text-red-700">
          {error}
        </p>
      </div>
    );
  }

  const stats = dashboard?.stats ?? {};

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Header */}
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-600">
          CareerOS workspace
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Welcome back, {firstName}.
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
          Keep your career momentum moving. Your goals, projects,
          applications, and career intelligence live here.
        </p>
      </section>

      {/* Overview */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <OverviewCard
          label="Active goals"
          value={stats.active_goals ?? 0}
          description={`${stats.completed_goals ?? 0} completed`}
        />

        <OverviewCard
          label="Pending tasks"
          value={stats.pending_tasks ?? 0}
          description={`${stats.completed_tasks ?? 0} completed`}
        />

        <OverviewCard
          label="Active projects"
          value={stats.active_projects ?? 0}
          description={`${stats.total_projects ?? 0} total projects`}
        />

        <OverviewCard
          label="Applications"
          value={stats.active_applications ?? 0}
          description={`${stats.total_applications ?? 0} total applications`}
        />
      </section>

      {/* Career overview */}
      <section className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <CareerProgress stats={stats} />

        <AiInsight />
      </section>

      {/* Activity */}
      <section className="grid gap-6 lg:grid-cols-2">
        <CareerActivity stats={stats} />

        <ResourceOverview stats={stats} />
      </section>
    </div>
  );
}

function OverviewCard({
  label,
  value,
  description,
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <p className="text-sm font-medium text-slate-500">
        {label}
      </p>

      <div className="mt-4 flex items-end justify-between gap-4">
        <p className="text-3xl font-bold tracking-tight text-slate-900">
          {value}
        </p>

        <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
          Active
        </span>
      </div>

      <p className="mt-2 text-xs text-slate-400">
        {description}
      </p>
    </article>
  );
}

function CareerProgress({ stats }) {
  const totalGoals = stats.total_goals ?? 0;
  const completedGoals = stats.completed_goals ?? 0;

  const progress =
    totalGoals > 0
      ? Math.round((completedGoals / totalGoals) * 100)
      : 0;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-900">
            Career trajectory
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Your current career activity
          </p>
        </div>

        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
          {progress > 0 ? 'On track' : 'Getting started'}
        </span>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-slate-600">
            Goal completion
          </span>

          <span className="font-bold text-slate-900">
            {progress}%
          </span>
        </div>

        <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-linear-to-r from-violet-500 to-indigo-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <ProgressItem
          label="Goals"
          value={stats.total_goals ?? 0}
        />

        <ProgressItem
          label="Projects"
          value={stats.total_projects ?? 0}
        />

        <ProgressItem
          label="Resources"
          value={stats.total_resources ?? 0}
        />
      </div>
    </section>
  );
}

function ProgressItem({ label, value }) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-xs font-medium text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-lg font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}

function AiInsight() {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-violet-100 bg-linear-to-br from-violet-50 via-white to-indigo-50 p-6 shadow-sm">
      <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-violet-200/30 blur-3xl" />

      <div className="relative">
        <span className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold text-violet-700 shadow-sm">
          AI insight
        </span>

        <h2 className="mt-5 text-xl font-bold tracking-tight text-slate-900">
          Your next move matters.
        </h2>

        <p className="mt-3 text-sm leading-6 text-slate-600">
          Use your goals, skills, projects, and applications
          to make smarter career decisions with CareerOS.
        </p>

        <button
          type="button"
          className="mt-6 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          View career insights
        </button>
      </div>
    </section>
  );
}

function CareerActivity({ stats }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-lg font-bold text-slate-900">
          Career activity
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          A quick overview of your current workload.
        </p>
      </div>

      <div className="mt-6 space-y-3">
        <ActivityRow
          label="Pending tasks"
          value={stats.pending_tasks ?? 0}
        />

        <ActivityRow
          label="Active projects"
          value={stats.active_projects ?? 0}
        />

        <ActivityRow
          label="Active applications"
          value={stats.active_applications ?? 0}
        />
      </div>
    </section>
  );
}

function ActivityRow({ label, value }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-4">
      <div className="flex items-center gap-3">
        <div className="h-2.5 w-2.5 rounded-full bg-violet-500" />

        <p className="text-sm font-medium text-slate-700">
          {label}
        </p>
      </div>

      <span className="text-sm font-bold text-slate-900">
        {value}
      </span>
    </div>
  );
}

function ResourceOverview({ stats }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-lg font-bold text-slate-900">
          Career resources
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Keep useful career material organized in one place.
        </p>
      </div>

      <div className="mt-6 rounded-2xl bg-slate-50 p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Saved resources
        </p>

        <p className="mt-2 text-3xl font-bold text-slate-900">
          {stats.total_resources ?? 0}
        </p>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Resources currently saved in your CareerOS workspace.
        </p>
      </div>
    </section>
  );
}

export default Dashboard;