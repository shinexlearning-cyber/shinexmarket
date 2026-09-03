import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// SHINEX frontend build config.
// PWA is configured from day one (manifest + service worker + app-shell
// caching) per the product spec: installable now, packageable for
// Play Store / App Store later via a PWA wrapper (e.g. Bubblewrap/Capacitor).
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/favicon.svg'],
      manifest: {
        name: 'SHINEX Marketplace',
        short_name: 'SHINEX',
        description: 'Discover, sell and advertise on SHINEX — the marketplace app.',
        theme_color: '#6C3FC5',
        background_color: '#FFFFFF',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        scope: '/',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        // App-shell caching only — never cache API responses here, since
        // marketplace data (products, prices, favorites) must always be
        // fresh from the real backend, not served stale from cache.
        globPatterns: ['**/*.{js,css,html,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/api/'),
            handler: 'NetworkOnly'
          }
        ]
      }
    })
  ],
  server: {
    port: 5173
  }
})
