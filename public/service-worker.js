// Minimal service worker that allows external API calls
// This overrides any default service worker behavior

self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  event.waitUntil(self.clients.claim());
});

// Allow all fetch requests to pass through without CSP restrictions
self.addEventListener('fetch', (event) => {
  // Pass through all requests without modification
  event.respondWith(fetch(event.request));
});
