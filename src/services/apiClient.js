// Single source of truth for talking to the SHINEX backend.
// Base URL is injected via env so the same build can point at local/staging/prod.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://shinex-marketplace.onrender.com/api'

const TOKEN_KEY = 'shinex_auth_token'

// Auth token persistence. This is the one legitimate client-side-storage use
// case called out in the spec (session state) — NOT a database substitute.
export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY)
}

export class ApiError extends Error {
  constructor(message, { status, data } = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

/**
 * Core request function. Every service module calls through this so
 * auth headers, error shape, and JSON parsing stay consistent app-wide.
 */
export async function apiRequest(path, { method = 'GET', body, headers = {}, isFormData = false } = {}) {
  const token = tokenStore.get()

  const config = {
    method,
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers
    }
  }

  if (body !== undefined) {
    config.body = isFormData ? body : JSON.stringify(body)
  }

  let response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, config)
  } catch (networkErr) {
    throw new ApiError('SHINEX is unreachable right now. Check your connection.', { status: 0 })
  }

  let data = null
  const contentType = response.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    data = await response.json().catch(() => null)
  }

  if (!response.ok) {
    if (response.status === 401) tokenStore.clear()
    throw new ApiError(data?.message || `Request failed (${response.status})`, {
      status: response.status,
      data
    })
  }

  return data
}
