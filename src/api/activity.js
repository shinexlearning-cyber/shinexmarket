import { api } from './client';

export async function getActivity({ page = 1, limit = 20 } = {}) {
  return api.get(`/activity?page=${page}&limit=${limit}`);
}
