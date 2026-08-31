import { apiClient } from './apiClient.js';

export async function fetchDashboardSummary() {
  const { data } = await apiClient.get('/dashboard/summary');
  return data.data;
}
