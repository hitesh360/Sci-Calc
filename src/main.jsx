import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Register Service Worker for PWA/offline
// updateViaCache:'none' ensures the browser ALWAYS fetches a fresh sw.js from the
// network when checking for updates (ignores HTTP cache), preventing stale SW issues.
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register(import.meta.env.BASE_URL + 'sw.js', { updateViaCache: 'none' })
      .catch(() => {});

    // When a new service worker takes over (after skipWaiting + clients.claim),
    // reload the page so users always get the freshest version of the app.
    let reloading = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!reloading) {
        reloading = true;
        window.location.reload();
      }
    });
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
