const CACHE_NAME = 'sci-calc-v3';
const BASE = '/Sci-Calc';
const ASSETS = [
  BASE + '/',
  BASE + '/index.html',
];

self.addEventListener('install', (e) => {
  // Pre-cache shell HTML, then immediately take over from old SW
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  // Delete ALL old caches, then claim all clients so they reload with new SW
  e.waitUntil(
    caches.keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;

  const url = new URL(e.request.url);
  const isHtml = url.pathname.endsWith('/') ||
                 url.pathname.endsWith('.html') ||
                 url.pathname === BASE;

  // Never intercept the service worker script itself
  if (url.pathname.endsWith('sw.js')) return;

  if (isHtml) {
    // Network-first for HTML: always try to fetch fresh, fall back to cache
    e.respondWith(
      fetch(e.request)
        .then((res) => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((c) => c.put(e.request, clone));
          }
          return res;
        })
        .catch(() => caches.match(e.request))
    );
  } else {
    // Cache-first for versioned assets (JS/CSS/fonts/images)
    e.respondWith(
      caches.match(e.request).then((cached) =>
        cached ||
        fetch(e.request).then((res) => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((c) => c.put(e.request, clone));
          }
          return res;
        })
      )
    );
  }
});
