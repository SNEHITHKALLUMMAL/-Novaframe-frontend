import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { PublicLayout } from '../layouts/PublicLayout.jsx';
import { AuthLayout } from '../layouts/AuthLayout.jsx';
import { AppLayout } from '../layouts/AppLayout.jsx';
import { ProtectedRoute } from '../components/ProtectedRoute.jsx';
import { AdminRoute } from '../components/AdminRoute.jsx';
import { LoadingState } from '../components/ui/LoadingState.jsx';

// Eagerly bundled: needed immediately on first load or are small/likely
// first stops (landing, auth, dashboard). Everything past the dashboard is
// lazy-loaded — a first-time visitor pays for the landing/login/dashboard
// bundle, not for the Admin panel's tables and forms they may never open.
import LandingPage from '../pages/LandingPage.jsx';
import LoginPage from '../pages/LoginPage.jsx';
import RegisterPage from '../pages/RegisterPage.jsx';
import DashboardPage from '../pages/DashboardPage.jsx';
import SystemStatusPage from '../pages/SystemStatusPage.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx';

const GeneratePage = lazy(() => import('../pages/GeneratePage.jsx'));
const LibraryPage = lazy(() => import('../pages/LibraryPage.jsx'));
const ProjectsPage = lazy(() => import('../pages/ProjectsPage.jsx'));
const SettingsPage = lazy(() => import('../pages/SettingsPage.jsx'));
const AdminPage = lazy(() => import('../pages/AdminPage.jsx')); // by far the largest — admin-only, most users never load it

function RouteLoadingFallback() {
  return <LoadingState label="Loading…" className="min-h-[50vh]" />;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/status" element={<SystemStatusPage />} />
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route
            path="/generate"
            element={
              <Suspense fallback={<RouteLoadingFallback />}>
                <GeneratePage />
              </Suspense>
            }
          />
          <Route
            path="/library"
            element={
              <Suspense fallback={<RouteLoadingFallback />}>
                <LibraryPage />
              </Suspense>
            }
          />
          <Route
            path="/projects"
            element={
              <Suspense fallback={<RouteLoadingFallback />}>
                <ProjectsPage />
              </Suspense>
            }
          />
          <Route
            path="/settings"
            element={
              <Suspense fallback={<RouteLoadingFallback />}>
                <SettingsPage />
              </Suspense>
            }
          />

          <Route element={<AdminRoute />}>
            <Route
              path="/admin"
              element={
                <Suspense fallback={<RouteLoadingFallback />}>
                  <AdminPage />
                </Suspense>
              }
            />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
