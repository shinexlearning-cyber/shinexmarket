import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

// Register the service worker for PWA app-shell caching. This does NOT
// subscribe to push notifications on its own — it only enables offline
// app-shell loading and installability. Push subscription (with a real
// VAPID key from the backend) can be wired in later without touching
// this registration.
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err) => {
      console.warn('SHINEX: service worker registration failed', err);
    });
  });
}
