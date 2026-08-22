function Topbar({ onMenuClick, user, onLogout }) {
  const userInitial = user?.full_name?.charAt(0)?.toUpperCase() || 'C';

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

          {user?.full_name && (
            <p className="text-xs text-slate-400">
              Welcome back, {user.full_name}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          className="hidden rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:border-slate-300 hover:text-slate-900 sm:block"
        >
          Search
        </button>

        <div className="hidden text-right sm:block">
          <p className="text-sm font-semibold text-slate-800">
            {user?.full_name || 'CareerOS User'}
          </p>

          <p className="text-xs text-slate-400">
            {user?.email || ''}
          </p>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-violet-500 to-indigo-500 text-sm font-semibold text-white">
          {userInitial}
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
        >
          Log out
        </button>
      </div>
    </header>
  );
}

export default Topbar;