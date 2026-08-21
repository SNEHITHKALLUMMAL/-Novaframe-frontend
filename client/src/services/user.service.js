import { apiClient } from './apiClient.js';

export async function updateMyProfile(payload) {
  const { data } = await apiClient.patch('/users/me', payload);
  return data.data.user;
}

export async function changeMyPassword(payload) {
  const { data } = await apiClient.patch('/users/me/password', payload);
  return data.data;
}

export async function deleteMyAccount(password) {
  const { data } = await apiClient.delete('/users/me', { data: { password } });
  return data.data;
}
