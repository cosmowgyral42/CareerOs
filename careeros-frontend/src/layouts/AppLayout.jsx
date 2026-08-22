import { Outlet } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';

function AppLayout() {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-slate-900">
      <div className="flex min-h-screen">
        <Sidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar onLogout={logout} />

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

export default AppLayout;