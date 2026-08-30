import { apiClient } from './apiClient.js';

export async function uploadImage(file, onProgress) {
  const formData = new FormData();
  formData.append('file', file);

  const { data } = await apiClient.post('/uploads', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (event) => {
      if (onProgress && event.total) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    },
  });

  return data.data; // { file: UploadedFile, url }
}
