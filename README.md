# SHINEX Marketplace — User Frontend

Mobile-first SHINEX marketplace frontend for buyers and sellers. The project uses the supplied SHINEX API as its only source of marketplace data and keeps the existing JWT authentication flow.

## Run locally

```bash
pnpm install
pnpm --filter @workspace/shinex-user-frontend dev
```

The scaffold requires `PORT` and `BASE_PATH` when starting Vite. The workspace runtime supplies those values. For a standalone run:

```bash
PORT=5173 BASE_PATH=/ pnpm dev
```

## Build and preview

```bash
PORT=5173 BASE_PATH=/ pnpm build
PORT=5173 BASE_PATH=/ pnpm preview
```

## Configuration

Copy `.env.example` to `.env`:

- `VITE_SHINEX_API_URL`: public API base. Production should use `https://shinex-marketplace.onrender.com/api`; when omitted during Vite development, the frontend uses a same-origin proxy to that backend to avoid local-preview CORS restrictions.

The API client sends `credentials: include` and attaches the backend-issued Bearer token after login. The token is the only browser-persisted auth value; marketplace records are never stored locally.

## Architecture

- `src/lib/shinex-api.ts` is a small typed fetch client using the exact routes documented by the supplied backend.
- `src/App.tsx` contains the mobile-first shell, route states and product/seller/auth flows.
- Version 1 intentionally exposes no cart, checkout, order or purchase flow. Customers discover products and contact sellers directly through WhatsApp; the existing backend remains unchanged so future e-commerce features can be reintroduced cleanly.
- Product creation uses the documented multipart fields and preserves the backend’s pending-review state.
- PWA assets live in `public/`; registration can be added by the host shell without changing API behavior.

## Deployment

Build the project with the same `VITE_SHINEX_API_URL` used by the deployed API and serve `dist/public` from a static host with SPA fallback to `index.html`.