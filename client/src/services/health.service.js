import { apiClient } from './apiClient.js';

export async function fetchHealth() {
  const { data } = await apiClient.get('/health');
  return data;
}
