// ===== SERVICE WORKER PARA CRM DOCUMENTATION =====

const CACHE_NAME = 'crm-docs-v2.0.0';
const STATIC_CACHE = 'crm-static-v2.0.0';
const DYNAMIC_CACHE = 'crm-dynamic-v2.0.0';

// Recursos críticos para cache inmediato
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/assets/css/style.css',
    '/assets/js/main.js',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-core.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/autoloader/prism-autoloader.min.js'
];

// Estrategias de cache
const CACHE_STRATEGIES = {
    STATIC: 'cache-first',
    DYNAMIC: 'stale-while-revalidate',
    API: 'network-first',
    IMAGES: 'cache-first'
};

// Instalación del Service Worker
self.addEventListener('install', (event) => {
    console.log('🚀 Service Worker instalando...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log('📦 Cacheando recursos estáticos...');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => {
                console.log('✅ Recursos estáticos cacheados correctamente');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('❌ Error cacheando recursos estáticos:', error);
            })
    );
});

// Activación del Service Worker
self.addEventListener('activate', (event) => {
    console.log('🔄 Service Worker activando...');
    
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        // Eliminar caches antiguos
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            console.log('🗑️ Eliminando cache antiguo:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('✅ Service Worker activado correctamente');
                return self.clients.claim();
            })
    );
});

// Interceptar peticiones
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Solo procesar peticiones GET
    if (request.method !== 'GET') {
        return;
    }
    
    // Estrategia según el tipo de recurso
    if (isStaticAsset(request)) {
        event.respondWith(cacheFirst(request));
    } else if (isImage(request)) {
        event.respondWith(cacheFirst(request));
    } else if (isAPI(request)) {
        event.respondWith(networkFirst(request));
    } else {
        event.respondWith(staleWhileRevalidate(request));
    }
});

// Estrategia: Cache First (para recursos estáticos)
async function cacheFirst(request) {
    try {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.error('Error en cacheFirst:', error);
        return new Response('Error de red', { status: 503 });
    }
}

// Estrategia: Network First (para APIs)
async function networkFirst(request) {
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.log('Red no disponible, usando cache...');
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        return new Response('Sin conexión', { status: 503 });
    }
}

// Estrategia: Stale While Revalidate (para contenido dinámico)
async function staleWhileRevalidate(request) {
    try {
        const cache = await caches.open(DYNAMIC_CACHE);
        const cachedResponse = await cache.match(request);
        
        // Intentar actualizar en background
        const fetchPromise = fetch(request).then(networkResponse => {
            if (networkResponse.ok) {
                cache.put(request, networkResponse.clone());
            }
            return networkResponse;
        }).catch(() => {
            // Ignorar errores de red
        });
        
        // Retornar cache si existe, sino esperar la red
        if (cachedResponse) {
            return cachedResponse;
        }
        
        return await fetchPromise;
    } catch (error) {
        console.error('Error en staleWhileRevalidate:', error);
        return new Response('Error de red', { status: 503 });
    }
}

// Verificar si es un recurso estático
function isStaticAsset(request) {
    const url = new URL(request.url);
    return STATIC_ASSETS.includes(url.pathname) ||
           url.pathname.startsWith('/assets/') ||
           url.pathname.endsWith('.css') ||
           url.pathname.endsWith('.js');
}

// Verificar si es una imagen
function isImage(request) {
    const url = new URL(request.url);
    return url.pathname.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i) ||
           request.headers.get('accept')?.includes('image');
}

// Verificar si es una API
function isAPI(request) {
    const url = new URL(request.url);
    return url.pathname.includes('/graphql') ||
           url.pathname.includes('/api/') ||
           url.pathname.includes('/mcp/');
}

// Manejo de mensajes del cliente
self.addEventListener('message', (event) => {
    const { type, payload } = event.data;
    
    switch (type) {
        case 'SKIP_WAITING':
            self.skipWaiting();
            break;
            
        case 'GET_CACHE_INFO':
            getCacheInfo().then(info => {
                event.ports[0].postMessage(info);
            });
            break;
            
        case 'CLEAR_CACHE':
            clearCache().then(() => {
                event.ports[0].postMessage({ success: true });
            });
            break;
            
        case 'UPDATE_CACHE':
            updateCache().then(() => {
                event.ports[0].postMessage({ success: true });
            });
            break;
    }
});

// Obtener información del cache
async function getCacheInfo() {
    try {
        const staticCache = await caches.open(STATIC_CACHE);
        const dynamicCache = await caches.open(DYNAMIC_CACHE);
        
        const staticKeys = await staticCache.keys();
        const dynamicKeys = await dynamicCache.keys();
        
        return {
            staticCache: {
                name: STATIC_CACHE,
                size: staticKeys.length,
                keys: staticKeys.map(req => req.url)
            },
            dynamicCache: {
                name: DYNAMIC_CACHE,
                size: dynamicKeys.length,
                keys: dynamicKeys.map(req => req.url)
            },
            totalSize: staticKeys.length + dynamicKeys.length
        };
    } catch (error) {
        console.error('Error obteniendo info del cache:', error);
        return { error: error.message };
    }
}

// Limpiar cache
async function clearCache() {
    try {
        const cacheNames = await caches.keys();
        await Promise.all(
            cacheNames.map(name => caches.delete(name))
        );
        console.log('🗑️ Cache limpiado correctamente');
    } catch (error) {
        console.error('Error limpiando cache:', error);
        throw error;
    }
}

// Actualizar cache
async function updateCache() {
    try {
        console.log('🔄 Actualizando cache...');
        
        // Limpiar cache dinámico
        const dynamicCache = await caches.open(DYNAMIC_CACHE);
        const keys = await dynamicCache.keys();
        await Promise.all(
            keys.map(key => dynamicCache.delete(key))
        );
        
        // Re-cachear recursos estáticos si es necesario
        const staticCache = await caches.open(STATIC_CACHE);
        for (const asset of STATIC_ASSETS) {
            try {
                const response = await fetch(asset);
                if (response.ok) {
                    await staticCache.put(asset, response);
                }
            } catch (error) {
                console.warn('No se pudo actualizar:', asset);
            }
        }
        
        console.log('✅ Cache actualizado correctamente');
    } catch (error) {
        console.error('Error actualizando cache:', error);
        throw error;
    }
}

// Background sync para funcionalidades offline
self.addEventListener('sync', (event) => {
    if (event.tag === 'background-sync') {
        event.waitUntil(doBackgroundSync());
    }
});

async function doBackgroundSync() {
    try {
        console.log('🔄 Sincronización en background...');
        
        // Aquí se pueden implementar tareas de sincronización
        // como enviar datos offline, actualizar cache, etc.
        
        console.log('✅ Sincronización completada');
    } catch (error) {
        console.error('Error en background sync:', error);
    }
}

// Push notifications (para futuras funcionalidades)
self.addEventListener('push', (event) => {
    if (event.data) {
        const data = event.data.json();
        const options = {
            body: data.body,
            icon: '/assets/images/icon-192x192.png',
            badge: '/assets/images/badge-72x72.png',
            vibrate: [100, 50, 100],
            data: {
                dateOfArrival: Date.now(),
                primaryKey: 1
            },
            actions: [
                {
                    action: 'explore',
                    title: 'Ver más',
                    icon: '/assets/images/checkmark.png'
                },
                {
                    action: 'close',
                    title: 'Cerrar',
                    icon: '/assets/images/xmark.png'
                }
            ]
        };
        
        event.waitUntil(
            self.registration.showNotification(data.title, options)
        );
    }
});

// Manejo de clics en notificaciones
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Manejo de errores globales
self.addEventListener('error', (event) => {
    console.error('Service Worker error:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
    console.error('Service Worker unhandled rejection:', event.reason);
});

console.log('🚀 Service Worker cargado correctamente');
