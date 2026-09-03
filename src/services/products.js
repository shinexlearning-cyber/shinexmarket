import { apiRequest } from './apiClient'
import { ENDPOINTS } from './endpoints'

const withId = (path, id) => path.replace(':id', id)

export async function fetchProducts(params = {}) {
  const query = new URLSearchParams(params).toString()
  const path = query ? `${ENDPOINTS.products.list.path}?${query}` : ENDPOINTS.products.list.path
  return apiRequest(path)
}

export async function fetchProduct(id) {
  return apiRequest(withId(ENDPOINTS.products.detail.path, id))
}

export async function fetchCategories() {
  return apiRequest(ENDPOINTS.products.categories.path)
}

export async function createProduct(formData) {
  // formData: FormData instance (title, price, category, description, images[])
  return apiRequest(ENDPOINTS.products.create.path, {
    method: 'POST',
    body: formData,
    isFormData: true
  })
}

export async function updateProduct(id, formData) {
  return apiRequest(withId(ENDPOINTS.products.update.path, id), {
    method: 'PATCH',
    body: formData,
    isFormData: true
  })
}

export async function deleteProduct(id) {
  return apiRequest(withId(ENDPOINTS.products.delete.path, id), { method: 'DELETE' })
}
