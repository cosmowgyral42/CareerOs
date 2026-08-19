function Landing() {
  return (
    <main className="min-h-screen bg-[#FAF9FB] px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-3xl border border-[#E9E4EA] bg-white p-8 shadow-sm">
          <p className="mb-3 text-sm font-medium text-pink-600">
            Career intelligence platform
          </p>

          <h1 className="text-4xl font-bold tracking-tight text-[#29252D]">
            Build your career with CareerOS.
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-[#756F7A]">
            Manage your goals, skills, projects, applications, and career
            intelligence in one place.
          </p>

          <button className="mt-8 rounded-xl bg-pink-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-pink-700">
            Get started
          </button>
        </div>
      </div>
    </main>
  );
}

export default Landing;