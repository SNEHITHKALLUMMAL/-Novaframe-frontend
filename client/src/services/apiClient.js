import axios from 'axios';
import { store } from '../store/index.js';
import { clearUser } from '../store/slices/authSlice.js';

/**
 * Single shared Axios instance. All feature services (auth, generations,
 * videos, etc.) import this rather than creating their own client.
 *
 * baseURL defaults to a relative path, which works when the frontend and
 * API share an origin (e.g. both behind the same nginx/reverse proxy).
 * In the target production topology the frontend is on Vercel and the API
 * is on Render — different origins — so VITE_API_URL must be set at build
 * time to the full API origin (e.g. https://api.novaframe.example/api/v1).
 * withCredentials + the backend's CORS `credentials: true` + a specific
 * (non-wildcard) FRONTEND_URL origin are what make the cross-origin cookie
 * auth flow work; see server/src/app.js.
 */
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  withCredentials: true,
  timeout: 15_000,
});

let refreshPromise = null;

/**
 * Exposed so useAuth (and potentially other hooks) can avoid dispatching
 * clearUser() while a refresh is in flight — prevents a brief
 * unauthenticated flash / redirect to /login during the refresh window.
 */
export function isRefreshing() {
  return refreshPromise !== null;
}

/**
 * On a 401 from any request other than the refresh/login/register calls
 * themselves, attempt exactly one silent refresh (deduplicated across
 * concurrent requests via refreshPromise) and retry the original request
 * once. If the refresh itself fails, clear client-side auth state so
 * ProtectedRoute redirects to /login instead of the app looping on 401s.
 */
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;

    const isAuthEndpoint =
      config?.url?.includes('/auth/refresh') ||
      config?.url?.includes('/auth/login') ||
      config?.url?.includes('/auth/register');

    if (response?.status !== 401 || isAuthEndpoint || config._retried) {
      return Promise.reject(error);
    }

    config._retried = true;

    try {
      refreshPromise ??= apiClient.post('/auth/refresh').finally(() => {
        refreshPromise = null;
      });
      await refreshPromise;
      return apiClient(config);
    } catch (refreshError) {
      store.dispatch(clearUser());
      return Promise.reject(refreshError);
    }
  }
);
