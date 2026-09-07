# SHINEX Marketplace — User & Seller Web App

A React + Vite + PWA frontend for the existing SHINEX marketplace backend
(Express + Supabase + Cloudinary + Paystack). One account, buy or sell —
no separate buyer/seller sign-ups.

This app talks **only** to endpoints that exist in the SHINEX backend today.
See "Known gaps" below for what the backend doesn't support yet.

## Project structure

```
src/
  api/          Thin fetch wrappers, one file per backend route group
  components/   Shared UI (nav, cards, states, modals, icons)
  context/      AuthContext (session/JWT handling)
  pages/        One folder/file per screen
  styles/       Design tokens + global CSS (no CSS framework)
public/
  icons/        PWA icons
```

## Getting started

```bash
npm install
cp .env.example .env      # then set VITE_API_BASE_URL to your backend
npm run dev                # http://localhost:5173
```

## Production build

```bash
npm run build      # outputs to dist/
npm run preview     # preview the production build locally
```

## Environment variables

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Base URL of the SHINEX Express API, e.g. `https://your-backend.onrender.com/api` |

No secret keys (Supabase service role, Paystack secret, Cloudinary secret) ever
belong in this app — they stay server-side, as the backend already does.

## Authentication

JWT-based, matching the backend exactly: `POST /auth/login` and
`/auth/register` return a token, stored in `localStorage` and sent as
`Authorization: Bearer <token>` on every authenticated request
(see `src/api/client.js`). A 401 response clears the stored token.

## Deployment

This is a static SPA after `npm run build` — deploy the `dist/` folder to
any static host (Netlify, Vercel, Cloudflare Pages, S3+CloudFront, etc.).
Because it's a client-side router (React Router), configure your host to
rewrite all paths to `index.html`.

## Known gaps (backend doesn't support these yet)

The backend (as provided) has **no** cart, checkout, orders, shipping,
returns/refunds, wallet/payouts, in-app messaging, reviews/ratings, or a
CMS for legal pages. Rather than fake these, this app:

- Uses **WhatsApp deep links** as the real buyer→seller contact method
  (the backend already stores/validates a seller's WhatsApp number).
- Leaves the Legal section as an editable shell (`src/pages/legal/`) —
  add your real policy copy there.
- Skips "change password while logged in" (no such endpoint exists) and
  instead offers the real forgot/reset-password email flow from Settings.
- Skips notification-preference toggles, 2FA, and login/session history —
  none of these exist in the `users` table or auth middleware.

If/when the backend adds any of these, the corresponding page is the
natural place to wire it up — the API layer in `src/api/` is organized
by backend route file for exactly this reason.
