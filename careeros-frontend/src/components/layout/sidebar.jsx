import { NavLink } from 'react-router-dom';

const navigation = [
  {
    label: 'Dashboard',
    to: '/dashboard',
    icon: '⌂',
  },
  {
    label: 'Goals',
    to: '/goals',
    icon: '◎',
  },
];

function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white lg:block">
      <div className="sticky top-0 flex h-screen flex-col">
        <div className="flex h-16 items-center border-b border-slate-100 px-6">
          <NavLink
            to="/dashboard"
            className="text-xl font-bold tracking-tight text-slate-900"
          >
            Career<span className="text-violet-600">OS</span>
          </NavLink>
        </div>

        <nav className="flex-1 px-4 py-6">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
            Workspace
          </p>

          <div className="space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  [
                    'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition',
                    isActive
                      ? 'bg-violet-50 text-violet-700'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900',
                  ].join(' ')
                }
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50">
                  {item.icon}
                </span>

                {item.label}
              </NavLink>
            ))}
          </div>
        </nav>

        <div className="border-t border-slate-100 p-4">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-semibold text-slate-700">
              CareerOS
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-400">
              Your career workspace.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;