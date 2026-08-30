import { apiClient } from './apiClient.js';

export async function fetchMyUsage() {
  const { data } = await apiClient.get('/usage/me');
  return data.data;
}
