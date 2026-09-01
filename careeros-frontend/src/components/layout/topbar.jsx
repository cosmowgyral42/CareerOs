import {
  LogOut,
  Menu,
  UserRound,
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../context/useAuth';

function Topbar({
  onLogout,
  onOpenMobileSidebar,
}) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const initials =
    user?.full_name
      ?.split(' ')
      .filter(Boolean)
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'C';

  function handleProfileClick() {
    navigate('/profile');
  }

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-slate-200/80 bg-[#F8F9FC]/90 backdrop-blur-xl">
      <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onOpenMobileSidebar}
            aria-label="Open navigation menu"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-pink-200 hover:bg-pink-50 hover:text-pink-600 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-pink-300 focus:ring-offset-2 lg:hidden"
          >
            <Menu size={20} />
          </button>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-500">
              Your career workspace
            </p>

            <p className="hidden text-xs text-slate-400 sm:block">
              Build your future, one step at a time.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {user?.full_name && (
            <div className="hidden text-right md:block">
              <p className="max-w-48 truncate text-sm font-semibold text-slate-700">
                {user.full_name}
              </p>

              <p className="text-xs text-slate-400">
                CareerOS member
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={handleProfileClick}
            aria-label="Open profile settings"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-pink-500 to-pink-600 text-sm font-bold text-white shadow-md transition duration-200 hover:-translate-y-0.5 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-pink-300 focus:ring-offset-2"
          >
            {user?.full_name ? (
              initials
            ) : (
              <UserRound size={18} />
            )}
          </button>

          <button
            type="button"
            onClick={onLogout}
            className="hidden items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-500 transition duration-200 hover:bg-slate-100 hover:text-slate-900 sm:inline-flex"
          >
            <LogOut size={17} />

            <span>
              Log out
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Topbar;
