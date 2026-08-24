import { NavLink } from 'react-router-dom';

const navigationItems = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: '⌂',
  },
  {
    label: 'Goals',
    path: '/goals',
    icon: '◎',
  },
  {
    label: 'Tasks',
    path: '/tasks',
    icon: '✓',
  },
  {
    label: 'Projects',
    path: '/projects',
    icon: '◆',
  },
  {
    label: 'Resources',
    path: '/resources',
    icon: '▣',
  },
  {
    label: 'Applications',
    path: '/applications',
    icon: '▤',
  },
];

function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white lg:flex lg:flex-col">
      <div className="flex h-16 items-center border-b border-slate-200 px-6">
        <NavLink
          to="/dashboard"
          className="text-xl font-bold tracking-tight text-slate-900"
        >
          Career<span className="text-pink-700">OS</span>
        </NavLink>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-6">
        <p className="px-3 pb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
          Workspace
        </p>

        {navigationItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              [
                'flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition',
                isActive
                  ? 'bg-violet-50 text-pink-700'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900',
              ].join(' ')
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={[
                    'flex h-8 w-8 items-center justify-center rounded-lg text-sm',
                    isActive
                      ? 'bg-violet-100 text-pink-700'
                      : 'bg-slate-100 text-slate-500',
                  ].join(' ')}
                >
                  {item.icon}
                </span>

                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-slate-200 p-4">
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-sm font-bold text-slate-900">
            Keep moving 🚀
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            Turn your career goals into consistent daily progress.
          </p>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;