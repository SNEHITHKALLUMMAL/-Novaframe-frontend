import axios from 'axios';
import { store } from '../store/index.js';
import { clearUser } from '../store/slices/authSlice.js';

/**
 * Single shared Axios instance. All feature services (auth, generations,
 * videos, etc.) import this rather than creating their own client.
 */
export const apiClient = axios.create({
  baseURL: '/api/v1',
  withCredentials: true,
  timeout: 15_000,
});

let refreshPromise = null;

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
