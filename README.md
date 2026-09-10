# SHINEX user frontend

Deploy this folder as its own Render Static Site. It is independent from the
admin frontend.

- Render service name: `shinexmarket`
- Build command: `npm install && npm run build`
- Publish directory: `dist`
- Environment variable: `VITE_SHINEX_API_URL=https://shinex-marketplace.onrender.com/api`
- SPA rewrite: `/*` → `/index.html`

If you use a different public URL, update the backend `FRONTEND_URL` environment
variable and add that origin to the backend CORS allowlist.