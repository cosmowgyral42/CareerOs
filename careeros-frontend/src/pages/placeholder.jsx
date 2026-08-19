function Placeholder({ title }) {
  return (
    <div className="mx-auto max-w-7xl">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold text-violet-600">CareerOS</p>

        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          {title}
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          This workspace is coming next.
        </p>
      </div>
    </div>
  );
}

export default Placeholder;