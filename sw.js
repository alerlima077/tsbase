// Service Worker para PWA - TS Base
const CACHE_NAME = 'tsbase-v2.0.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/admin.html',
  '/dashboard.html',
  '/pizzaria.html',
  '/manifest.json'
];

// Instalação
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('✅ Cache aberto');
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting(); // Força ativação imediata
});

// Busca em cache - IGNORANDO TUDO QUE NÃO É GET
self.addEventListener('fetch', event => {
  // Só faz cache de requisições GET
  if (event.request.method !== 'GET') {
    return;
  }
  
  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (response && response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});

// Ativação
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim(); // Toma controle imediatamente
});