# SHINEX Frontend

A fresh, app-first React frontend for SHINEX, built to connect to the existing
backend at `https://shinex-marketplace.onrender.com/api`.

## Status: architecture-complete, endpoints unconfirmed

I could not inspect your live API — `shinex-marketplace.onrender.com` blocks
automated fetching via robots.txt, and this build environment has no outbound
network access to call it another way. So while the **app is fully wired**
(routing, auth flow, PWA, loading/error/empty states, product cards, sell
form, etc.), every API path lives in **one file** you need to correct:

  → `src/services/endpoints.js`

Every entry there is marked `status: 'assumed'` (a guessed REST convention)
or `status: 'missing'` (a feature the spec wants but no plausible endpoint
exists — those pages currently show a "not available yet" state instead of
fake data, e.g. Activity). Once you send me your real routes — a Postman
export, an OpenAPI spec, or just your Express/Nest route files — I'll update
this one file and wire it up properly; no other file should need to change,
since every page reads through `src/services/*.js`, which reads through
`endpoints.js`.

## What's built

- **App shell**: desktop three-line-menu drawer + mobile fixed bottom nav,
  no footer, no traditional website layout
- **Design system**: Tailwind tokens for the purple/white brand with green as
  a secondary success/price color (`tailwind.config.js`)
- **Routing**: Home, Product Detail, Sell, Favorites, Activity, Advertise,
  Public Shop, Profile, Settings, Login/Register, with auth-gated routes
- **Auth**: token-based session via `useAuth`, persisted in `localStorage`
  (session token only — not used as a data store)
- **Real states everywhere**: loading skeletons, inline errors (no
  `alert()`), and honest empty states — nothing renders fake products,
  sellers, prices, or activity
- **PWA**: manifest, service worker (via `vite-plugin-pwa`), installable,
  app-shell cached — API responses are explicitly `NetworkOnly` so
  marketplace data is never served stale

## Still needed from you

1. **Real API routes** — see above, this unblocks everything else
2. **App icons** — drop 192×192, 512×512, and a 512×512 maskable PNG into
   `public/icons/` (referenced in `vite.config.js`); I used a text
   placeholder logo, a real mark would look sharper
3. **Cloudinary / Paystack flow specifics** — once I can see how your backend
   expects uploads and payment initiation (direct-to-Cloudinary signed
   upload vs. proxy through your API; Paystack inline vs. redirect), I'll
   finish the Sell image upload and Advertise checkout flow precisely to
   match — right now Sell posts `FormData` directly to your `/products`
   endpoint, which is the most common pattern but may not match yours

## Run it

```bash
npm install
cp .env.example .env   # point VITE_API_BASE_URL at your API if different
npm run dev
```

## Structure

```
src/
  components/   ProductCard, EmptyState, RequireAuth, etc.
  layouts/      AppShell, TopHeader, DesktopDrawer, BottomNav
  pages/        one file per route
  services/     apiClient.js (fetch wrapper) + endpoints.js (route registry)
                + products.js / auth.js (typed service functions)
  hooks/        useAuth.jsx
  styles/       Tailwind entry
```
