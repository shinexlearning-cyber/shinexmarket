import { api } from './client';

function qs(params) {
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') usp.set(k, v);
  });
  const s = usp.toString();
  return s ? `?${s}` : '';
}

export async function listProducts(params = {}) {
  const res = await api.get(`/products${qs(params)}`);
  return res; // { success, data: [...], pagination }
}

export async function getProduct(id) {
  const res = await api.get(`/products/${id}`);
  return res.data;
}

export async function getCategories() {
  const res = await api.get('/products/categories/all');
  return res.data;
}

export async function getMyListings({ status, page = 1, limit = 50 } = {}) {
  const res = await api.get(`/products/mine/all${qs({ status, page, limit })}`);
  return res; // { data, plan: { name, active_listing_limit }, pagination }
}

export async function createProduct(fields, images) {
  const form = new FormData();
  Object.entries(fields).forEach(([k, v]) => { if (v !== undefined && v !== null) form.append(k, v); });
  (images || []).forEach((file) => form.append('images', file));
  const res = await api.post('/products', form, { isForm: true });
  return res.data.product;
}

export async function updateProduct(id, fields, images) {
  const form = new FormData();
  Object.entries(fields).forEach(([k, v]) => { if (v !== undefined && v !== null) form.append(k, v); });
  (images || []).forEach((file) => form.append('images', file));
  const res = await api.put(`/products/${id}`, form, { isForm: true });
  return res.data.product;
}

export async function deleteProduct(id) {
  return api.del(`/products/${id}`);
}

export async function setSold(id, is_sold) {
  const res = await api.patch(`/products/${id}/sold`, { is_sold });
  return res.data;
}
