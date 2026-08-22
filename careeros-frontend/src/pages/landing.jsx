import { useNavigate } from 'react-router-dom';

function Landing() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-[#FAF9FB] px-6 py-12">
      <div className="mx-auto flex min-h-[80vh] max-w-6xl items-center">
        <div className="w-full overflow-hidden rounded-3xl border border-[#E9E4EA] bg-white shadow-sm">
          <div className="relative px-8 py-16 sm:px-12 lg:px-16">
            <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-violet-100/60 blur-3xl" />

            <div className="relative max-w-3xl">
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-violet-600">
                Career intelligence platform
              </p>

              <h1 className="text-4xl font-bold tracking-tight text-[#29252D] sm:text-5xl lg:text-6xl">
                Build your career with CareerOS.
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-7 text-[#756F7A] sm:text-lg">
                Manage your goals, skills, projects, applications, and
                career intelligence in one place.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => navigate('/register')}
                  className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-md"
                >
                  Get Started
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  Sign In
                </button>
              </div>

              <div className="mt-12 grid gap-4 sm:grid-cols-3">
                <Feature
                  title="Goals"
                  description="Turn career ambitions into actionable plans."
                />

                <Feature
                  title="Skills"
                  description="Understand what you know and what to learn next."
                />

                <Feature
                  title="AI Insights"
                  description="Use career intelligence to make better decisions."
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function Feature({ title, description }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
      <h2 className="text-sm font-bold text-slate-900">
        {title}
      </h2>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {description}
      </p>
    </div>
  );
}

export default Landing;