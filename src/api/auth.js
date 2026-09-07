import { api, setToken } from './client';

export async function register({ full_name, username, email, phone, password, account_type, whatsapp, shop_name, location }) {
  const res = await api.post('/auth/register', { full_name, username, email, phone, password, account_type, whatsapp, shop_name, location }, { auth: false });
  if (res?.data?.token) setToken(res.data.token);
  return res.data;
}

export async function login({ email, password }) {
  const res = await api.post('/auth/login', { email, password }, { auth: false });
  if (res?.data?.token) setToken(res.data.token);
  return res.data;
}

export async function me() {
  const res = await api.get('/auth/me');
  return res.data.user;
}

export async function logout() {
  try { await api.post('/auth/logout'); } finally { setToken(null); }
}

export async function forgotPassword(email) {
  return api.post('/auth/forgot-password', { email }, { auth: false });
}

export async function resetPassword(token, new_password) {
  return api.post('/auth/reset-password', { token, new_password }, { auth: false });
}
