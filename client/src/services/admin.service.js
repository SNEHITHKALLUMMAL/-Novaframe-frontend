import { apiClient } from './apiClient.js';

export async function fetchAdminOverview() {
  const { data } = await apiClient.get('/admin/overview');
  return data.data;
}

export async function fetchAdminUsers(params) {
  const { data } = await apiClient.get('/admin/users', { params });
  return data.data;
}

export async function setUserRole(id, role) {
  const { data } = await apiClient.patch(`/admin/users/${id}/role`, { role });
  return data.data.user;
}

export async function setUserActive(id, isActive) {
  const { data } = await apiClient.patch(`/admin/users/${id}/status`, { isActive });
  return data.data.user;
}

export async function fetchAdminJobs(params) {
  const { data } = await apiClient.get('/admin/jobs', { params });
  return data.data;
}

export async function fetchAdminModels() {
  const { data } = await apiClient.get('/admin/models');
  return data.data.models;
}

export async function fetchAvailableAdapters() {
  const { data } = await apiClient.get('/admin/models/adapters');
  return data.data.adapterKeys;
}

export async function createAdminModel(payload) {
  const { data } = await apiClient.post('/admin/models', payload);
  return data.data.model;
}

export async function updateAdminModel(id, updates) {
  const { data } = await apiClient.patch(`/admin/models/${id}`, updates);
  return data.data.model;
}

export async function deleteAdminModel(id) {
  await apiClient.delete(`/admin/models/${id}`);
}

export async function fetchModelVersions(modelId) {
  const { data } = await apiClient.get(`/admin/models/${modelId}/versions`);
  return data.data.versions;
}

export async function createModelVersion(modelId, payload) {
  const { data } = await apiClient.post(`/admin/models/${modelId}/versions`, payload);
  return data.data.version;
}

export async function deleteModelVersion(versionId) {
  await apiClient.delete(`/admin/model-versions/${versionId}`);
}

export async function fetchAdminSubscriptions(params) {
  const { data } = await apiClient.get('/admin/subscriptions', { params });
  return data.data;
}

export async function fetchAdminStorage() {
  const { data } = await apiClient.get('/admin/storage');
  return data.data;
}

export async function fetchAdminConfig() {
  const { data } = await apiClient.get('/admin/config');
  return data.data;
}

export async function fetchAuditLogs(params) {
  const { data } = await apiClient.get('/admin/audit-logs', { params });
  return data.data;
}

export async function adminDeleteVideo(id) {
  await apiClient.delete(`/admin/videos/${id}`);
}
