/* ============================================
   GOVET SERVICE WORKER
   PWA Offline Support & Caching Strategy
   ============================================ */

const CACHE_NAME = "govet-v1.0.0";
const API_CACHE_NAME = "govet-api-v1.0.0";

// Assets estáticos para cachear inmediatamente
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/assets/icons/icon-192x192.png",
  "/assets/icons/icon-512x512.png",
];

// Rutas de la aplicación para precachear
const APP_ROUTES = [
  "/",
  "/ver",
  "/calendario",
  "/registro-paciente",
  "/registro-tutor",
  "/rellenar-ficha",
];

// Patrones de API para cachear con network-first
const API_PATTERNS = [
  /\/api\/tutores/,
  /\/api\/pacientes/,
  /\/api\/especies/,
  /\/api\/razas/,
  /\/api\/regiones/,
];

/* ==========================================
   INSTALL - Precachear assets críticos
   ========================================== */
self.addEventListener("install", (event) => {
  console.log("[Service Worker] Installing...");

  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("[Service Worker] Caching static assets");
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log("[Service Worker] Installed successfully");
        return self.skipWaiting(); // Activar inmediatamente
      })
      .catch((error) => {
        console.error("[Service Worker] Install failed:", error);
      })
  );
});

/* ==========================================
   ACTIVATE - Limpiar caches antiguas
   ========================================== */
self.addEventListener("activate", (event) => {
  console.log("[Service Worker] Activating...");

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Eliminar caches antiguas
            if (cacheName !== CACHE_NAME && cacheName !== API_CACHE_NAME) {
              console.log("[Service Worker] Deleting old cache:", cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log("[Service Worker] Activated successfully");
        return self.clients.claim(); // Tomar control inmediatamente
      })
  );
});

/* ==========================================
   FETCH - Estrategias de caching
   ========================================== */
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignorar requests no-HTTP (chrome-extension, etc)
  if (!request.url.startsWith("http")) {
    return;
  }

  // Ignorar Google Calendar API (siempre fresh)
  if (url.hostname.includes("googleapis.com")) {
    return;
  }

  // Estrategia para assets estáticos: Cache-First
  if (isStaticAsset(request)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Estrategia para API: Network-First con fallback
  if (isAPIRequest(url)) {
    event.respondWith(networkFirstAPI(request));
    return;
  }

  // Estrategia para rutas de app: Network-First
  if (isAppRoute(url)) {
    event.respondWith(networkFirstApp(request));
    return;
  }

  // Default: Network-First
  event.respondWith(networkFirst(request));
});

/* ==========================================
   ESTRATEGIAS DE CACHING
   ========================================== */

/**
 * Cache-First: Para assets estáticos (CSS, JS, imágenes)
 * Intenta cache primero, luego red si falla
 */
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.error("[Service Worker] Cache-First failed:", error);
    // Si falla, intentar devolver un fallback
    return new Response("Offline - Asset not available", { status: 503 });
  }
}

/**
 * Network-First: Para rutas de la app
 * Intenta red primero, fallback a cache
 */
async function networkFirstApp(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.log("[Service Worker] Network failed, trying cache...");
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }
    // Fallback a página offline
    return caches.match("/index.html");
  }
}

/**
 * Network-First para API: Con timeout y fallback a cache
 */
async function networkFirstAPI(request) {
  try {
    // Timeout de 5 segundos para API
    const response = await fetchWithTimeout(request, 5000);

    if (response.ok) {
      const cache = await caches.open(API_CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.log("[Service Worker] API failed, trying cache...", error.message);
    const cached = await caches.match(request);

    if (cached) {
      // Agregar header para indicar que es cached
      const clonedResponse = cached.clone();
      const newHeaders = new Headers(clonedResponse.headers);
      newHeaders.set("X-From-Cache", "true");

      return new Response(clonedResponse.body, {
        status: clonedResponse.status,
        statusText: clonedResponse.statusText,
        headers: newHeaders,
      });
    }

    // No hay cache, devolver error
    return new Response(
      JSON.stringify({
        error: "Offline",
        message: "No hay conexión y no hay datos en cache",
      }),
      {
        status: 503,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

/**
 * Network-First genérico
 */
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    return response;
  } catch (error) {
    const cached = await caches.match(request);
    return cached || new Response("Offline", { status: 503 });
  }
}

/* ==========================================
   UTILIDADES
   ========================================== */

/**
 * Verifica si es un asset estático
 */
function isStaticAsset(request) {
  const url = new URL(request.url);
  return (
    request.destination === "style" ||
    request.destination === "script" ||
    request.destination === "image" ||
    request.destination === "font" ||
    url.pathname.startsWith("/assets/") ||
    url.pathname.endsWith(".css") ||
    url.pathname.endsWith(".js") ||
    url.pathname.endsWith(".png") ||
    url.pathname.endsWith(".jpg") ||
    url.pathname.endsWith(".svg") ||
    url.pathname.endsWith(".woff") ||
    url.pathname.endsWith(".woff2")
  );
}

/**
 * Verifica si es una request de API
 */
function isAPIRequest(url) {
  return API_PATTERNS.some((pattern) => pattern.test(url.pathname));
}

/**
 * Verifica si es una ruta de la app
 */
function isAppRoute(url) {
  // Mismo origin y es una ruta conocida
  return (
    url.origin === self.location.origin &&
    APP_ROUTES.some(
      (route) => url.pathname === route || url.pathname.startsWith(route + "/")
    )
  );
}

/**
 * Fetch con timeout
 */
function fetchWithTimeout(request, timeout = 5000) {
  return Promise.race([
    fetch(request),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timeout")), timeout)
    ),
  ]);
}

/* ==========================================
   BACKGROUND SYNC (Future)
   ========================================== */

// Para sincronización en background cuando haya conexión
self.addEventListener("sync", (event) => {
  console.log("[Service Worker] Background sync:", event.tag);

  if (event.tag === "sync-pending-data") {
    event.waitUntil(syncPendingData());
  }
});

async function syncPendingData() {
  // TODO: Implementar sincronización de datos pendientes
  console.log("[Service Worker] Syncing pending data...");
}

/* ==========================================
   PUSH NOTIFICATIONS (Future)
   ========================================== */

self.addEventListener("push", (event) => {
  console.log("[Service Worker] Push received:", event);

  const options = {
    body: event.data ? event.data.text() : "Nueva notificación",
    icon: "/assets/icons/icon-192x192.png",
    badge: "/assets/icons/badge-72x72.png",
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
  };

  event.waitUntil(self.registration.showNotification("GoVet", options));
});

self.addEventListener("notificationclick", (event) => {
  console.log("[Service Worker] Notification clicked:", event);
  event.notification.close();

  event.waitUntil(clients.openWindow("/"));
});

/* ==========================================
   MESSAGE HANDLING
   ========================================== */

self.addEventListener("message", (event) => {
  console.log("[Service Worker] Message received:", event.data);

  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }

  if (event.data && event.data.type === "CACHE_URLS") {
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => cache.addAll(event.data.payload))
    );
  }
});

console.log("[Service Worker] Loaded");
