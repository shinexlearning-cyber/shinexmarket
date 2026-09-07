import { api } from './client';

export async function sendContactMessage({ name, email, phone, subject, message }) {
  return api.post('/contact', { name, email, phone, subject, message }, { auth: false });
}
export async function getContactInfo() {
  const res = await api.get('/contact/info', ).catch(() => null);
  return res?.data;
}
