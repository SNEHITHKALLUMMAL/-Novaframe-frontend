import { apiClient } from './apiClient.js';

export async function fetchModels(type) {
  const { data } = await apiClient.get('/models', { params: type ? { type } : undefined });
  return data.data.models;
}
