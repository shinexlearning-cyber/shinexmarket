/* SHINEX Marketplace — service worker
 *
 * Scope: app-shell caching for installability + basic offline resilience.
 * This intentionally does NOT cache API responses (product data, prices,
 * favorites, etc.) — those must always come fresh from the real backend
 * at https://shinex-marketplace.onrender.com/api, never served stale
 * from a cache pretending to be live marketplace data.
 *
 * Push notifications: the "push" and "notificationclick" handlers below
 * are scaffolding only. They will do nothing until the backend exposes a
 * push subscription endpoint and sends real Web Push messages with a
 * VAPID key — at that point, wire the subscribe call (see index.js) and
 * these handlers will already be in place to receive and route them.
 */

const CACHE_NAME = "shinex-shell-v1";
const APP_SHELL = ["/", "/index.html", "/manifest.json", "/icons/icon.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Never intercept API calls — always go to the network so marketplace
  // data (products, users, favorites, payments, etc.) is always live.
  if (url.pathname.startsWith("/api") || url.origin.includes("onrender.com")) {
    return;
  }

  if (request.mode === "navigate") {
    // Network-first for page navigations, falling back to the cached
    // app shell when offline.
    event.respondWith(
      fetch(request).catch(() => caches.match("/index.html"))
    );
    return;
  }

  // Cache-first for static app-shell assets.
  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request))
  );
});

// --- Push notification scaffolding (inactive until wired to a real
// backend push endpoint + VAPID key) ---
self.addEventListener("push", (event) => {
  if (!event.data) return;
  let payload;
  try {
    payload = event.data.json();
  } catch (e) {
    payload = { title: "SHINEX", body: event.data.text() };
  }
  event.waitUntil(
    self.registration.showNotification(payload.title || "SHINEX", {
      body: payload.body || "",
      icon: "/icons/icon.svg",
      badge: "/icons/icon.svg",
      data: payload.data || {},
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const target = (event.notification.data && event.notification.data.url) || "/";
  event.waitUntil(
    self.clients.matchAll({ type: "window" }).then((clientsArr) => {
      const existing = clientsArr.find((c) => c.url.includes(self.location.origin));
      if (existing) return existing.focus();
      return self.clients.openWindow(target);
    })
  );
});
