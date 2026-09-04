import { Navigate, Outlet } from 'react-router-dom';
import { Video, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';

export function ProtectedRoute() {
  const { user, isLoading, isInitializing } = useAuth();

  if (isInitializing || isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-3">
        <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-primary/10">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        </div>
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
