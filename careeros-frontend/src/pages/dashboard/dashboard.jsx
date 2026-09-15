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
        setIsLoading(true);

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
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-pink-100 border-t-pink-500" />

          <p className="mt-4 text-sm font-medium text-slate-500">
            Loading your workspace...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl">
        <div className="rounded-3xl border border-red-200 bg-red-50 p-6 shadow-sm">
          <h1 className="text-lg font-bold text-red-900">
            Dashboard unavailable
          </h1>

          <p className="mt-2 text-sm leading-6 text-red-700">
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
          Math.round(
            (completedGoals / totalGoals) * 100,
          ),
        )
      : 0;

  return (
    <div className="mx-auto max-w-7xl space-y-8">

      {/* Header */}

      <section>
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-pink-600">
          Career workspace
        </p>

        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
          Your dashboard
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
          Your career progress, goals, projects, tasks,
          applications, and resources in one place.
        </p>
      </section>


      {/* Primary statistics */}

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
          highlighted
        />

      </section>


      {/* Goal progress */}

      <section className="app-card p-6 sm:p-7">

        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <p className="text-sm font-bold uppercase tracking-[0.14em] text-pink-600">
              Progress overview
            </p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
              Goal completion
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Track how much of your planned work
              is already completed.
            </p>

          </div>


          <div className="rounded-2xl bg-yellow-50 px-5 py-4 text-center">

            <p className="text-3xl font-extrabold text-slate-900">
              {goalProgress}%
            </p>

            <p className="mt-1 text-xs font-bold text-yellow-700">
              completed
            </p>

          </div>

        </div>


        <div className="mt-6 h-3 overflow-hidden rounded-full bg-pink-50">

          <div
            className="h-full rounded-full bg-linear-to-r from-pink-500 to-yellow-400 transition-all duration-500"
            style={{
              width: `${goalProgress}%`,
            }}
          />

        </div>


        <div className="mt-3 flex justify-between text-xs font-medium text-slate-500">

          <span>
            {completedGoals} completed
          </span>

          <span>
            {totalGoals} total goals
          </span>

        </div>

      </section>


      {/* Workspace navigation */}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

        <DashboardLink
          to="/goals"
          title="Goals"
          value={stats.total_goals ?? 0}
          description="Plan and track your career objectives."
        />

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


      {/* Applications */}

      <section>

        <Link
          to="/applications"
          className="group block rounded-3xl border border-yellow-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-pink-300 hover:shadow-lg sm:p-7"
        >

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <p className="text-sm font-bold uppercase tracking-[0.14em] text-pink-600">
                Career pipeline
              </p>

              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Applications
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Manage your opportunities, deadlines,
                interviews, and application status.
              </p>

            </div>


            <div className="flex items-center gap-4">

              <div className="rounded-2xl bg-yellow-50 px-5 py-4 text-center">

                <p className="text-3xl font-extrabold text-slate-900">
                  {stats.total_applications ?? 0}
                </p>

                <p className="text-xs font-bold text-yellow-700">
                  applications
                </p>

              </div>


              <span className="rounded-xl bg-pink-500 px-4 py-3 text-sm font-bold text-white shadow-sm transition-all duration-200 group-hover:-translate-y-0.5 group-hover:bg-pink-600 group-hover:shadow-md">
                Open applications
              </span>

            </div>

          </div>

        </Link>

      </section>


      {/* Career tools */}

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
          button="Manage targets"
        />

        <DashboardFeature
          to="/career-recommendations"
          label="AI career intelligence"
          title="Career Recommendations"
          description="Compare your target role with a real job description and get AI-powered insights, skill gaps, roadmap steps, and next actions."
          button="Open Career AI"
          highlighted
        />

        <DashboardFeature
          to="/resume-analysis"
          label="CareerOS AI"
          title="Resume Analysis"
          description="Upload your resume, compare it with a job description, and discover your match score, strengths, weaknesses, and recommendations."
          button="Open Resume AI"
        />

      </section>

    </div>
  );
}


function StatCard({
  label,
  value,
  highlighted = false,
}) {
  return (
    <div
      className={[
        'app-card app-card-hover p-5',
        highlighted
          ? 'border-yellow-200 bg-yellow-50/40'
          : '',
      ].join(' ')}
    >

      <p className="text-sm font-semibold text-slate-500">
        {label}
      </p>

      <p className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">
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
      className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-pink-300 hover:shadow-lg"
    >

      <div className="flex items-start justify-between gap-4">

        <div>

          <p className="text-sm font-bold text-slate-700">
            {title}
          </p>

          <p className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900">
            {value}
          </p>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {description}
          </p>

        </div>


        <span className="rounded-lg bg-yellow-50 px-3 py-2 text-xs font-bold text-yellow-700 transition-all duration-200 group-hover:bg-pink-500 group-hover:text-white group-hover:shadow-sm">
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
        'group block rounded-3xl border bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-pink-300 hover:shadow-lg',
        highlighted
          ? 'border-yellow-200 bg-yellow-50/30'
          : 'border-pink-100',
      ].join(' ')}
    >

      <div className="flex items-start justify-between gap-4">

        <div>

          <p className="text-sm font-bold uppercase tracking-[0.14em] text-pink-500">
            {label}
          </p>

          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            {title}
          </h2>

          <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
            {description}
          </p>

        </div>


        <span className="shrink-0 rounded-xl bg-yellow-100 px-3 py-2 text-xs font-bold text-yellow-700 transition-all duration-200 group-hover:bg-pink-500 group-hover:text-white group-hover:shadow-sm">
          Open
        </span>

      </div>


      <span
        className={[
          'mt-5 inline-flex rounded-xl px-4 py-2 text-sm font-bold transition-all duration-200',
          highlighted
            ? 'bg-pink-500 text-white group-hover:bg-pink-600'
            : 'bg-yellow-50 text-yellow-700 group-hover:bg-pink-50 group-hover:text-pink-700',
        ].join(' ')}
      >
        {button}
      </span>

    </Link>
  );
}


export default Dashboard;
