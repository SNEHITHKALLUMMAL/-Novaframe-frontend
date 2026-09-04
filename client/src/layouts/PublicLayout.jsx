import { Outlet } from 'react-router-dom';

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-background bg-tech-grid">
      <Outlet />
    </div>
  );
}
