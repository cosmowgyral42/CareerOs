function Dashboard() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section>
        <p className="text-sm font-semibold text-violet-600">
          Good morning
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
          Your career command center.
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Track your progress, strengthen your skills, and make smarter career
          decisions with CareerOS.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Career progress</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">72%</p>
          <p className="mt-1 text-xs text-emerald-600">
            +8% this month
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Active goals</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">4</p>
          <p className="mt-1 text-xs text-slate-500">2 due this week</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Skills tracked</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">12</p>
          <p className="mt-1 text-xs text-violet-600">
            3 high-priority gaps
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Applications</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">8</p>
          <p className="mt-1 text-xs text-amber-600">
            2 interviews upcoming
          </p>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-900">
            Current career target
          </p>

          <h2 className="mt-2 text-2xl font-bold text-slate-900">
            Backend Engineer
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Focus on backend systems, APIs, databases, cloud infrastructure,
            and production engineering.
          </p>

          <div className="mt-6 h-2 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-violet-500 to-indigo-500" />
          </div>

          <p className="mt-2 text-xs text-slate-500">
            72% career readiness
          </p>
        </div>

        <div className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-indigo-50 p-6 shadow-sm">
          <p className="text-sm font-semibold text-violet-700">
            AI insight
          </p>

          <h2 className="mt-2 text-xl font-bold text-slate-900">
            Your next best move
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            Strengthen your system design fundamentals and ship one
            production-quality backend project.
          </p>

          <button
            type="button"
            className="mt-5 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            View recommendation
          </button>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;