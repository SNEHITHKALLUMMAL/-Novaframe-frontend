import { apiClient } from './apiClient.js';

export async function registerRequest({ name, email, password }) {
  const { data } = await apiClient.post('/auth/register', { name, email, password });
  return data.data.user;
}

export async function loginRequest({ email, password }) {
  const { data } = await apiClient.post('/auth/login', { email, password });
  return data.data.user;
}

export async function logoutRequest() {
  await apiClient.post('/auth/logout');
}

export async function fetchCurrentUser() {
  const { data } = await apiClient.get('/auth/me');
  return data.data.user;
}

// Both intentionally do not throw a distinguishable "email not found"
// error — the backend's forgot-password endpoint is deliberately
// enumeration-safe (always the same response, see server's
// docs/SESSIONS.md), so the frontend has nothing more specific to show
// anyway; showing the same generic success message either way is correct
// here, not a missed opportunity for a better error message.
export async function forgotPasswordRequest({ email }) {
  await apiClient.post('/auth/forgot-password', { email });
}

export async function resetPasswordRequest({ token, newPassword }) {
  await apiClient.post('/auth/reset-password', { token, newPassword });
}
