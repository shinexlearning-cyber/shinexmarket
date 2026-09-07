import { api } from './client';

export async function getMyProfile() {
  const res = await api.get('/users/me');
  return res.data.user;
}

export async function updateMyProfile(payload) {
  const res = await api.put('/users/me', payload);
  return res.data.user;
}

export async function uploadAvatar(file) {
  const form = new FormData();
  form.append('image', file);
  const res = await api.post('/users/me/avatar', form, { isForm: true });
  return res.data.user;
}

export async function getPublicProfile(username) {
  const res = await api.get(`/users/${encodeURIComponent(username)}`);
  return res.data;
}

export async function getShop(username, { page = 1, limit = 20 } = {}) {
  const res = await api.get(`/users/${encodeURIComponent(username)}/shop?page=${page}&limit=${limit}`);
  return res.data;
}
