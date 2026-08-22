import { useAuth } from '../../context/useAuth';

function Dashboard() {
  const { user } = useAuth();

  const firstName = user?.full_name?.split(' ')[0] || 'there';

  return (
    <div className="mx-auto max-w-7xl space-y-8">
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

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <OverviewCard
          label="Career progress"
          value="72%"
          description="Overall progress"
        />

        <OverviewCard
          label="Active goals"
          value="04"
          description="Goals in progress"
        />

        <OverviewCard
          label="Open tasks"
          value="12"
          description="Tasks remaining"
        />

        <OverviewCard
          label="Applications"
          value="08"
          description="Active applications"
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <CareerProgress />

        <AiInsight />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <RecentTasks />

        <RecentApplications />
      </section>
    </div>
  );
}

function OverviewCard({ label, value, description }) {
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

function CareerProgress() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-900">
            Career trajectory
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Backend Engineer
          </p>
        </div>

        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
          On track
        </span>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-slate-600">
            Overall readiness
          </span>

          <span className="font-bold text-slate-900">
            72%
          </span>
        </div>

        <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full w-[72%] rounded-full bg-linear-to-r from-violet-500 to-indigo-500" />
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <ProgressItem
          label="Skills"
          value="78%"
        />

        <ProgressItem
          label="Projects"
          value="65%"
        />

        <ProgressItem
          label="Applications"
          value="54%"
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
          Strengthen your backend portfolio with one production-quality
          project and document the engineering decisions behind it.
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

function RecentTasks() {
  const tasks = [
    'Finish API documentation',
    'Build authentication UI',
    'Add PostgreSQL project',
  ];

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Today&apos;s focus
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Keep the important work moving.
          </p>
        </div>

        <span className="text-sm font-semibold text-violet-600">
          3 tasks
        </span>
      </div>

      <div className="mt-6 space-y-3">
        {tasks.map((task) => (
          <div
            key={task}
            className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4"
          >
            <div className="h-2.5 w-2.5 rounded-full bg-violet-500" />

            <p className="text-sm font-medium text-slate-700">
              {task}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function RecentApplications() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-lg font-bold text-slate-900">
          Application pipeline
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          A quick view of your current opportunities.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <PipelineItem
          label="Applied"
          value="04"
        />

        <PipelineItem
          label="Interview"
          value="02"
        />

        <PipelineItem
          label="Offer"
          value="01"
        />
      </div>

      <div className="mt-6 rounded-xl bg-slate-50 p-4">
        <p className="text-xs font-medium text-slate-500">
          Current focus
        </p>

        <p className="mt-1 text-sm font-semibold text-slate-800">
          Backend engineering roles
        </p>
      </div>
    </section>
  );
}

function PipelineItem({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-center">
      <p className="text-xl font-bold text-slate-900">
        {value}
      </p>

      <p className="mt-1 text-xs font-medium text-slate-500">
        {label}
      </p>
    </div>
  );
}

export default Dashboard;