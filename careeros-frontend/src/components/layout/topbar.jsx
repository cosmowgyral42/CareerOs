import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../context/useAuth';

function Topbar({ onLogout }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const initials =
    user?.full_name
      ?.split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'C';

  function handleProfileClick() {
    navigate('/profile');
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200/80 bg-[#F8F9FC]/90 px-4 backdrop-blur sm:px-6">
      <div>
        <p className="text-sm font-medium text-slate-500">
          Your career workspace
        </p>
      </div>

      <div className="flex items-center gap-3">
        {user?.full_name && (
          <span className="hidden text-sm font-semibold text-slate-600 sm:block">
            {user.full_name}
          </span>
        )}

        <button
          type="button"
          onClick={handleProfileClick}
          aria-label="Open profile settings"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-violet-500 to-indigo-500 text-sm font-semibold text-white shadow-sm transition hover:scale-105 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-pink-300 focus:ring-offset-2"
        >
          {initials}
        </button>

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