import { useState } from 'react';
import { Outlet } from 'react-router-dom';

import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import { useAuth } from '../context/useAuth';

function AppLayout() {
  const [
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
  ] = useState(false);

  const { logout } = useAuth();

  function handleOpenMobileSidebar() {
    setIsMobileSidebarOpen(true);
  }

  function handleCloseMobileSidebar() {
    setIsMobileSidebarOpen(false);
  }

  return (
    <div className="min-h-screen bg-[#FAF9FB] text-[#29252D]">
      <div className="flex min-h-screen">
        <Sidebar
          isMobileSidebarOpen={isMobileSidebarOpen}
          onCloseMobileSidebar={handleCloseMobileSidebar}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar
            onLogout={logout}
            onOpenMobileSidebar={handleOpenMobileSidebar}
          />

          <main className="flex-1 px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
            <div className="mx-auto w-full max-w-[1600px]">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default AppLayout;