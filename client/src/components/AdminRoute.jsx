import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { LoadingState } from './ui/LoadingState.jsx';

/**
 * Sits inside ProtectedRoute in the route tree (so auth is already
 * confirmed) and adds the role check. A non-admin is redirected to the
 * regular dashboard rather than shown a 403 page — there's nothing for
 * them to do on an admin page, so send them somewhere useful instead of a
 * dead end.
 */
export function AdminRoute() {
  const { user, isCheckingAuth } = useAuth();

  if (isCheckingAuth) {
    return <LoadingState label="Checking permissions…" className="min-h-screen" />;
  }

  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
