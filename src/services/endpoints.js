// SHINEX API endpoint registry.
//
// I could not inspect the live backend (shinex-marketplace.onrender.com
// blocks automated access, and this dev sandbox has no outbound network),
// so none of these paths are confirmed yet. Every entry below is a
// best-guess REST convention based on the product spec, clearly marked.
//
// DO NOT ship this file as-is. Once you share your real routes
// (Postman collection, OpenAPI spec, or your Express/Nest route files),
// update the paths here — every service module (products.js, auth.js,
// favorites.js, shops.js, ads.js) reads from this file, so a correction
// here is the only place a fix is needed.
//
// status: 'assumed'  -> guessed convention, needs confirmation
// status: 'missing'  -> spec requires this, but no plausible endpoint
//                       exists yet; the feature UI should stay behind a
//                       "coming soon" state until backend support lands
export const ENDPOINTS = {
  auth: {
    register: { path: '/auth/register', method: 'POST', status: 'assumed' },
    login: { path: '/auth/login', method: 'POST', status: 'assumed' },
    logout: { path: '/auth/logout', method: 'POST', status: 'assumed' },
    me: { path: '/auth/me', method: 'GET', status: 'assumed' },
    updateProfile: { path: '/users/me', method: 'PATCH', status: 'assumed' },
    changePassword: { path: '/users/me/password', method: 'PATCH', status: 'assumed' }
  },
  products: {
    list: { path: '/products', method: 'GET', status: 'assumed' },
    detail: { path: '/products/:id', method: 'GET', status: 'assumed' },
    create: { path: '/products', method: 'POST', status: 'assumed' },
    update: { path: '/products/:id', method: 'PATCH', status: 'assumed' },
    delete: { path: '/products/:id', method: 'DELETE', status: 'assumed' },
    categories: { path: '/categories', method: 'GET', status: 'assumed' },
    search: { path: '/products/search', method: 'GET', status: 'assumed' }
  },
  favorites: {
    listProducts: { path: '/favorites/products', method: 'GET', status: 'assumed' },
    addProduct: { path: '/favorites/products/:productId', method: 'POST', status: 'assumed' },
    removeProduct: { path: '/favorites/products/:productId', method: 'DELETE', status: 'assumed' },
    listShops: { path: '/favorites/shops', method: 'GET', status: 'missing' },
    followShop: { path: '/favorites/shops/:username', method: 'POST', status: 'missing' }
  },
  shops: {
    detail: { path: '/shops/:username', method: 'GET', status: 'assumed' },
    myShop: { path: '/shops/me', method: 'GET', status: 'assumed' }
  },
  activity: {
    list: { path: '/activity', method: 'GET', status: 'missing' }
  },
  ads: {
    plans: { path: '/ads/plans', method: 'GET', status: 'assumed' },
    create: { path: '/ads', method: 'POST', status: 'assumed' },
    initiatePayment: { path: '/ads/:id/pay', method: 'POST', status: 'assumed' }
  }
}
