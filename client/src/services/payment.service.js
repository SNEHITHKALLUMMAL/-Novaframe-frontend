import { apiClient } from './apiClient.js';

export async function fetchPayments() {
  const { data } = await apiClient.get('/payments');
  return data.data.payments;
}
