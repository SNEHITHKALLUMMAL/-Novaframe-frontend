import { apiClient } from './apiClient.js';

export async function fetchProjects() {
  const { data } = await apiClient.get('/projects');
  return data.data.projects;
}

export async function createProject(payload) {
  const { data } = await apiClient.post('/projects', payload);
  return data.data.project;
}

export async function updateProject(id, payload) {
  const { data } = await apiClient.patch(`/projects/${id}`, payload);
  return data.data.project;
}

export async function deleteProject(id) {
  await apiClient.delete(`/projects/${id}`);
}
