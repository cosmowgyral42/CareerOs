import { Link } from 'react-router-dom';

function AuthLayout({
  children,
  title,
  subtitle,
  footerText,
  footerLink,
  footerLabel,
}) {
  return (
    <main className="min-h-screen bg-[#F7F8FC]">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        {/* Brand panel */}
        <section className="relative hidden overflow-hidden bg-slate-950 lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-violet-600/20 blur-3xl" />

          <div className="absolute -bottom-40 -right-32 size-112 rounded-full bg-indigo-500/20 blur-3xl" />

          <div className="relative z-10 p-10">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-violet-500 to-indigo-500 text-sm font-bold text-white shadow-lg shadow-violet-900/30">
                C
              </div>

              <div>
                <p className="font-bold text-white">CareerOS</p>

                <p className="text-xs text-slate-500">
                  Career intelligence
                </p>
              </div>
            </Link>
          </div>

          <div className="relative z-10 px-10 pb-16">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
              Your career command center
            </p>

            <h2 className="max-w-xl text-5xl font-bold leading-tight tracking-tight text-white">
              Turn career goals into measurable progress.
            </h2>

            <p className="mt-6 max-w-lg text-base leading-7 text-slate-400">
              Track your skills, projects, applications and career direction
              while using AI to make smarter decisions.
            </p>

            <div className="mt-10 grid max-w-lg grid-cols-3 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <p className="text-xl font-bold text-white">AI</p>

                <p className="mt-1 text-xs text-slate-500">
                  Career insights
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <p className="text-xl font-bold text-white">360°</p>

                <p className="mt-1 text-xs text-slate-500">
                  Career tracking
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <p className="text-xl font-bold text-white">1</p>

                <p className="mt-1 text-xs text-slate-500">
                  Career workspace
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Form panel */}
        <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8">
          <div className="w-full max-w-md">
            <div className="mb-8 lg:hidden">
              <Link to="/" className="inline-flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-violet-500 to-indigo-500 text-sm font-bold text-white">
                  C
                </div>

                <div>
                  <p className="font-bold text-slate-900">CareerOS</p>

                  <p className="text-xs text-slate-500">
                    Career intelligence
                  </p>
                </div>
              </Link>
            </div>

            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                {title}
              </h1>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {subtitle}
              </p>
            </div>

            {children}

            <p className="mt-8 text-center text-sm text-slate-500">
              {footerText}{' '}
              <Link
                to={footerLink}
                className="font-semibold text-violet-600 transition hover:text-violet-700"
              >
                {footerLabel}
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default AuthLayout;