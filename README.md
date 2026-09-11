# SHINEX Marketplace — User Frontend

Standalone React marketplace frontend for the existing SHINEX API.

- API: `REACT_APP_API_URL`
- Render: `npm install && npm run build`, publish `build`
- Client-side paths rewrite to `/index.html`
- Installable PWA with service worker and 192/512 icons
- Google sign-in uses the existing `/api/auth/google` backend contract
- Current release removes Cart/Buy UI and focuses on listings, discovery and WhatsApp seller contact. Backend order/cart data is preserved.
- Subscription and notification screens use the existing backend plus the additive upgrade endpoints.
