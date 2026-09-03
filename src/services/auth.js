import { apiRequest, tokenStore } from './apiClient'
import { ENDPOINTS } from './endpoints'

export async function register(payload) {
  const data = await apiRequest(ENDPOINTS.auth.register.path, { method: 'POST', body: payload })
  if (data?.token) tokenStore.set(data.token)
  return data
}

export async function login(payload) {
  const data = await apiRequest(ENDPOINTS.auth.login.path, { method: 'POST', body: payload })
  if (data?.token) tokenStore.set(data.token)
  return data
}

export async function logout() {
  try {
    await apiRequest(ENDPOINTS.auth.logout.path, { method: 'POST' })
  } finally {
    tokenStore.clear()
  }
}

export async function fetchCurrentUser() {
  return apiRequest(ENDPOINTS.auth.me.path)
}

export async function updateProfile(formData) {
  return apiRequest(ENDPOINTS.auth.updateProfile.path, {
    method: 'PATCH',
    body: formData,
    isFormData: true
  })
}
