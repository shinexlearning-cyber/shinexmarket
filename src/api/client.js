// Thin fetch wrapper around the existing SHINEX Express backend.
// No mock data and no invented endpoints live here — every path in this
// file maps 1:1 to something in API_DOCUMENTATION.md.

const BASE_URL = import.meta.env?.VITE_API_BASE_URL || 'http://localhost:5000/api';
const TOKEN_KEY = 'shinex_token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}
export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

async function request(path, { method = 'GET', body, isForm = false, auth = true } = {}) {
  const headers = {};
  if (!isForm) headers['Content-Type'] = 'application/json';
  if (auth) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body ? (isForm ? body : JSON.stringify(body)) : undefined
    });
  } catch (networkErr) {
    throw new ApiError('Could not reach the SHINEX server. Check your connection and try again.', 0, null);
  }

  let data = null;
  try {
    data = await res.json();
  } catch {
    // non-JSON response (e.g. 204)
  }

  if (!res.ok) {
    if (res.status === 401) setToken(null);
    throw new ApiError(data?.message || 'Something went wrong. Please try again.', res.status, data);
  }
  return data;
}

export const api = {
  get: (path) => request(path, { method: 'GET' }),
  post: (path, body, opts = {}) => request(path, { method: 'POST', body, ...opts }),
  put: (path, body, opts = {}) => request(path, { method: 'PUT', body, ...opts }),
  patch: (path, body, opts = {}) => request(path, { method: 'PATCH', body, ...opts }),
  del: (path) => request(path, { method: 'DELETE' })
};

export { ApiError };
