import { useState } from 'react';
import { Outlet } from 'react-router-dom';

import { useAuth } from '../context/useAuth';

import Sidebar from '../components/layout/sidebar';
import Topbar from '../components/layout/topbar';

function AppLayout() {
  const { logout } = useAuth();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] =
    useState(false);

  function closeMobileSidebar() {
    setIsMobileSidebarOpen(false);
  }

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-slate-900">
      <div className="flex min-h-screen">
        <Sidebar
          isMobileSidebarOpen={isMobileSidebarOpen}
          onCloseMobileSidebar={closeMobileSidebar}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar
            onLogout={logout}
            onOpenMobileSidebar={() =>
              setIsMobileSidebarOpen(true)
            }
          />

          <main className="flex-1 px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

export default AppLayout;