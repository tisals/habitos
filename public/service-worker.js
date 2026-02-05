const CACHE_NAME = 'llave-potencial-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/index.tsx',
  '/App.tsx',
  '/constants.tsx',
  '/types.ts',
  '/assets/audio/rituals/ara/intro.mp3',
  '/assets/audio/rituals/ara/step1.mp3',
  '/assets/audio/rituals/ara/step2.mp3',
  '/assets/audio/rituals/ara/step3.mp3',
  '/assets/audio/rituals/ara/step4.mp3',
  '/assets/audio/rituals/ara/step5.mp3',
  '/assets/audio/rituals/ara/outro.mp3',
  '/assets/audio/rituals/cafe/intro.mp3',
  '/assets/audio/rituals/cafe/step1.mp3',
  '/assets/audio/rituals/cafe/step2.mp3',
  '/assets/audio/rituals/cafe/step3.mp3',
  '/assets/audio/rituals/cafe/outro.mp3',
  '/assets/audio/rituals/life/intro.mp3',
  '/assets/audio/rituals/life/step1.mp3',
  '/assets/audio/rituals/life/step2.mp3',
  '/assets/audio/rituals/life/step3.mp3',
  '/assets/audio/rituals/life/outro.mp3',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
  'https://cdn.tailwindcss.com'
];

self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching assets');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .catch((error) => {
        console.error('[Service Worker] Cache failed:', error);
      })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request)
          .then((response) => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch((error) => {
            console.error('[Service Worker] Fetch failed:', error);
            if (event.request.destination === 'document') {
              return caches.match('/index.html');
            }
          });
      })
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
