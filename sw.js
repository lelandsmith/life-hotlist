const CACHE_NAME = 'hotlist-v38-no-cache';
const urlsToCache = [];

// Install event - NO CACHING
self.addEventListener('install', event => {
  console.log('Service worker installed - NO CACHING ENABLED');
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - ALWAYS USE NETWORK, NO CACHE
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    }).catch(() => {
      // Only fallback to network without cache headers
      return fetch(event.request);
    })
  );
});