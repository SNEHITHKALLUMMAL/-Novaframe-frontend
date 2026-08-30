import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { LoadingState } from './ui/LoadingState.jsx';
import { isAdminRole } from '../lib/roles.js';

/**
 * Checks both 'admin' and 'super_admin' — the backend's requireRole('admin')
 * treats super_admin as a strict superset (see server's
 * utils/roleAuthorization.js, added when the role was introduced). This
 * frontend check previously only allowed 'admin' exactly, which would
 * have silently locked a super_admin out of the admin UI entirely even
 * though every API call they made would have succeeded — found by
 * tracing the role from the backend change through to every place it's
 * consumed, not just checking the backend in isolation.
 */
export function AdminRoute() {
  const { user, isCheckingAuth } = useAuth();

  if (isCheckingAuth) {
    return <LoadingState label="Checking permissions…" className="min-h-screen" />;
  }

  if (!isAdminRole(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
