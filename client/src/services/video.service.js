import { apiClient } from './apiClient.js';

export async function fetchVideos(params) {
  const { data } = await apiClient.get('/videos', { params });
  return data.data; // { videos, total, page, limit }
}

export async function fetchVideo(id) {
  const { data } = await apiClient.get(`/videos/${id}`);
  return data.data.video;
}

export async function renameVideo(id, title) {
  const { data } = await apiClient.patch(`/videos/${id}`, { title });
  return data.data.video;
}

export async function assignVideoProject(id, projectId) {
  const { data } = await apiClient.patch(`/videos/${id}/project`, { projectId });
  return data.data.video;
}

export async function deleteVideo(id) {
  await apiClient.delete(`/videos/${id}`);
}
