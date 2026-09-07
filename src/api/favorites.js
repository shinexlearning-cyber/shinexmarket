import { api } from './client';

export const favoriteProduct = (productId) => api.post(`/favorites/product/${productId}`);
export const unfavoriteProduct = (productId) => api.del(`/favorites/product/${productId}`);
export const favoriteSeller = (sellerId) => api.post(`/favorites/seller/${sellerId}`);
export const unfavoriteSeller = (sellerId) => api.del(`/favorites/seller/${sellerId}`);

export async function getFavoriteProducts({ page = 1, limit = 20 } = {}) {
  const res = await api.get(`/favorites/products?page=${page}&limit=${limit}`);
  return res;
}
export async function getFavoriteSellers({ page = 1, limit = 20 } = {}) {
  const res = await api.get(`/favorites/sellers?page=${page}&limit=${limit}`);
  return res;
}
export async function checkProductFavorited(productId) {
  const res = await api.get(`/favorites/product/${productId}/check`);
  return res.data.is_favorited;
}
export async function checkSellerFavorited(sellerId) {
  const res = await api.get(`/favorites/seller/${sellerId}/check`);
  return res.data.is_favorited;
}
