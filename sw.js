// Service Worker para PWA - TS Base
const CACHE_NAME = 'tsbase-v1.0.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/admin.html',
  '/dashboard.html',
  '/pizzaria.html',
  '/manifest.json'
];

// Instalação do Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('✅ Cache aberto');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.log('❌ Erro ao adicionar ao cache:', error);
      })
  );
});

// Busca em cache (ignorando extensões do Chrome e requisições POST)
self.addEventListener('fetch', event => {
  const url = event.request.url;
  
  // Ignorar requisições de extensões do Chrome
  if (url.startsWith('chrome-extension://')) {
    return;
  }
  
  // Ignorar requisições POST (como envio de formulários)
  if (event.request.method === 'POST') {
    console.log('📤 Ignorando requisição POST (não cacheada):', url);
    return;
  }
  
  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (response && response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            })
            .catch(err => console.log('Erro no cache:', err));
        }
        return response;
      })
      .catch(() => {
        return caches.match(event.request)
          .then(response => {
            if (response) {
              return response;
            }
            return caches.match('/');
          });
      })
  );
});

// Atualização do Service Worker
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('🗑️ Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});