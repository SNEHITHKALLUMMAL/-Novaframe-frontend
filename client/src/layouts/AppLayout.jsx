import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar.jsx';
import { MobileSidebarDrawer } from '../components/MobileSidebarDrawer.jsx';
import { Topbar } from '../components/Topbar.jsx';

export function AppLayout() {
  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      <MobileSidebarDrawer />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
