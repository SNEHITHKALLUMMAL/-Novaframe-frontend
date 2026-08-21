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
