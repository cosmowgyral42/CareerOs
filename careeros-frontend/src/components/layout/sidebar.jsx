import { NavLink } from 'react-router-dom';
import {
  BriefcaseBusiness,
  ChartNoAxesCombined,
  FileText,
  FolderKanban,
  GraduationCap,
  LayoutDashboard,
  ListChecks,
  LogOut,
  Rocket,
  Settings,
  Sparkles,
  Target,
} from 'lucide-react';

import { removeToken } from '../../services/api/authStorage';

const navigationItems = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Goals',
    path: '/goals',
    icon: Target,
  },
  {
    label: 'Tasks',
    path: '/tasks',
    icon: ListChecks,
  },
  {
    label: 'Projects',
    path: '/projects',
    icon: FolderKanban,
  },
  {
    label: 'Resources',
    path: '/resources',
    icon: FileText,
  },
  {
    label: 'Applications',
    path: '/applications',
    icon: BriefcaseBusiness,
  },
  {
    label: 'Skills',
    path: '/skills',
    icon: GraduationCap,
  },
  {
    label: 'Skill Gaps',
    path: '/skill-gaps',
    icon: ChartNoAxesCombined,
  },
  {
    label: 'Career Targets',
    path: '/career-targets',
    icon: Target,
  },
  {
    label: 'Resume AI',
    path: '/resume-analysis',
    icon: Sparkles,
  },
  {
    label: 'Career AI',
    path: '/career-recommendations',
    icon: Rocket,
  },
];

const accountItems = [
  {
    label: 'Profile & Settings',
    path: '/profile-settings',
    icon: Settings,
  },
];

function Sidebar() {
  function handleLogout() {
    removeToken();
    window.location.href = '/login';
  }

  return (
    <aside className="hidden h-screen w-64 shrink-0 flex-col border-r border-pink-100 bg-white/80 backdrop-blur-xl lg:sticky lg:top-0 lg:flex">
      {/* Logo */}
      <div className="relative flex h-16 items-center overflow-hidden border-b border-pink-100 px-6">
        <div className="absolute inset-0 opacity-40">
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                'radial-gradient(circle, #f9a8d4 1px, transparent 1px)',
              backgroundSize: '18px 18px',
            }}
          />
        </div>

        <NavLink
          to="/dashboard"
          className="relative flex items-center gap-2 text-xl font-black tracking-tight text-slate-900"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-pink-100 text-pink-600 shadow-sm">
            <Sparkles size={18} />
          </span>

          <span>
            Career
            <span className="text-pink-600">OS</span>
          </span>
        </NavLink>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-6">
        <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
          Workspace
        </p>

        {navigationItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                [
                  'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200',
                  isActive
                    ? 'bg-pink-100 text-pink-700 shadow-sm'
                    : 'text-slate-500 hover:bg-pink-50 hover:text-slate-900',
                ].join(' ')
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={[
                      'flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-all duration-200',
                      isActive
                        ? 'bg-pink-200 text-pink-700 shadow-sm'
                        : 'bg-slate-100 text-slate-500 group-hover:bg-yellow-100 group-hover:text-yellow-700',
                    ].join(' ')}
                  >
                    <Icon size={17} strokeWidth={2.2} />
                  </span>

                  <span className="truncate">
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}

        {/* Account Section */}
        <div className="mt-8 border-t border-pink-100 pt-5">
          <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
            Account
          </p>

          {accountItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  [
                    'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200',
                    isActive
                      ? 'bg-pink-100 text-pink-700 shadow-sm'
                      : 'text-slate-500 hover:bg-pink-50 hover:text-slate-900',
                  ].join(' ')
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={[
                        'flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-all',
                        isActive
                          ? 'bg-pink-200 text-pink-700'
                          : 'bg-slate-100 text-slate-500 group-hover:bg-yellow-100 group-hover:text-yellow-700',
                      ].join(' ')}
                    >
                      <Icon size={17} strokeWidth={2.2} />
                    </span>

                    <span>
                      {item.label}
                    </span>
                  </>
                )}
              </NavLink>
            );
          })}

          <button
            type="button"
            onClick={handleLogout}
            className="group mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-slate-500 transition-all duration-200 hover:bg-yellow-50 hover:text-yellow-700"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition-all group-hover:bg-yellow-100 group-hover:text-yellow-700">
              <LogOut size={17} strokeWidth={2.2} />
            </span>

            <span>
              Logout
            </span>
          </button>
        </div>
      </nav>

      {/* Bottom Motivation Card */}
      <div className="border-t border-pink-100 p-4">
        <div className="relative overflow-hidden rounded-2xl border border-pink-100 bg-pink-50/70 p-4 shadow-sm">
          <div className="absolute right-3 top-3 text-yellow-500">
            <Sparkles size={18} />
          </div>

          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-yellow-100 text-yellow-700">
              <Rocket size={16} />
            </span>

            <p className="text-sm font-bold text-slate-900">
              Keep moving
            </p>
          </div>

          <p className="mt-3 text-xs leading-5 text-slate-500">
            Turn your career goals into consistent daily progress.
          </p>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;