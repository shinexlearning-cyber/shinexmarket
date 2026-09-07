import { api } from './client';

export async function createReport({ target_user_id, target_product_id, target_advertisement_id, reason, description }) {
  return api.post('/reports', { target_user_id, target_product_id, target_advertisement_id, reason, description });
}
export async function getMyReports({ page = 1, limit = 20 } = {}) {
  return api.get(`/reports/my?page=${page}&limit=${limit}`);
}
