import { apiClient } from './apiClient.js';

export async function createGeneration(payload) {
  const { data } = await apiClient.post('/generations', payload);
  return data.data.job;
}

export async function fetchGeneration(id) {
  const { data } = await apiClient.get(`/generations/${id}`);
  return data.data.job;
}

export async function cancelGeneration(id) {
  const { data } = await apiClient.post(`/generations/${id}/cancel`);
  return data.data.job;
}
