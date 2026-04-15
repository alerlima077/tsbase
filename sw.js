// Service Worker simplificado para PWA - TS Base
const CACHE_NAME = 'tsbase-v3';

// Instalação
self.addEventListener('install', event => {
    self.skipWaiting();
    console.log('✅ Service Worker instalado');
});

// Busca - NÃO FAZ CACHE de nada para evitar erros
self.addEventListener('fetch', event => {
    // Ignora requisições que não são GET
    if (event.request.method !== 'GET') {
        return;
    }
    
    // Tenta buscar da rede, sem cache
    event.respondWith(
        fetch(event.request).catch(() => {
            // Se falhar, tenta retornar uma resposta básica
            return new Response('Recurso não disponível offline', {
                status: 200,
                headers: new Headers({ 'Content-Type': 'text/plain' })
            });
        })
    );
});

// Ativação
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    console.log('🗑️ Removendo cache:', cache);
                    return caches.delete(cache);
                })
            );
        })
    );
    self.clients.claim();
});