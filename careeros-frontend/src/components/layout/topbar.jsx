function Topbar({ onMenuClick }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200/80 bg-[#F8F9FC]/90 px-4 backdrop-blur sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Open navigation"
          className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 shadow-sm hover:text-slate-900 lg:hidden"
          onClick={onMenuClick}
        >
          ☰
        </button>

        <div>
          <p className="text-sm font-medium text-slate-500">
            Your career workspace
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          className="hidden rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:border-slate-300 hover:text-slate-900 sm:block"
        >
          Search
        </button>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 text-sm font-semibold text-white">
          C
        </div>
      </div>
    </header>
  );
}

export default Topbar;