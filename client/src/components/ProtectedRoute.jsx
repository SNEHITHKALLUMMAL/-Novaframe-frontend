import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { LoadingState } from './ui/LoadingState.jsx';

export function ProtectedRoute() {
  const { status, isCheckingAuth } = useAuth();
  const location = useLocation();

  if (status === 'unknown' && isCheckingAuth) {
    return <LoadingState label="Checking your session…" className="min-h-screen" />;
  }

  if (status !== 'authenticated') {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
