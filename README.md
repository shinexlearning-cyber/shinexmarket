# SHINEX User Frontend

Independent React/Vite marketplace frontend for SHINEX Marketplace.

## Production API
`https://shinex-marketplace.onrender.com/api`

## Run
1. `npm install`
2. Copy `.env.example` to `.env` if you need a different API URL.
3. `npm run dev`
4. `npm run build`

## Render
Deploy as a Static Site with `npm install && npm run build` and publish `dist`. The included `render.yaml` configures SPA fallback.

## PWA
The app includes a manifest, service worker, 192/512 PNG icons, favicon, Apple touch icon and install metadata. The service worker caches only the static app shell; private API responses are not cached.

## API contract
This frontend uses the endpoints documented by the existing SHINEX backend. It does not access Supabase directly and does not contain private keys.
