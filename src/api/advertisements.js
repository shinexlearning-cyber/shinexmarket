import { api } from './client';

export async function getAdPricing() {
  const res = await api.get('/advertisements/pricing');
  return res.data; // [{ id, duration_days, price, is_active }]
}

export async function createAdvertisement({ title, description, duration_id }, imageFile) {
  const form = new FormData();
  form.append('title', title);
  if (description) form.append('description', description);
  form.append('duration_id', duration_id);
  form.append('image', imageFile);
  const res = await api.post('/advertisements', form, { isForm: true });
  return res.data.advertisement;
}

export async function payForAdvertisement(id) {
  const res = await api.post(`/advertisements/${id}/pay`);
  return res.data; // { authorization_url, reference, payment_id }
}

export async function getAdPaymentStatus(id) {
  const res = await api.get(`/advertisements/${id}/payment`);
  return res.data;
}

export async function getMyAdvertisements({ page = 1, limit = 20 } = {}) {
  return api.get(`/advertisements/my?page=${page}&limit=${limit}`);
}
