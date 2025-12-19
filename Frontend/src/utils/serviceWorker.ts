/* ============================================
   SERVICE WORKER REGISTRATION
   Registro y gestión del Service Worker
   ============================================ */

/**
 * Registra el Service Worker si el navegador lo soporta
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  // Verificar soporte
  if (!("serviceWorker" in navigator)) {
    //console.log("Service Worker no soportado en este navegador");
    return null;
  }

  try {
    //console.log("[SW Registration] Registrando Service Worker...");

    const registration = await navigator.serviceWorker.register(
      "/service-worker.js",
      { scope: "/" }
    );

    /*console.log(
      "[SW Registration] Service Worker registrado:",
      registration.scope
    );*/

    // Manejar actualizaciones
    registration.addEventListener("updatefound", () => {
      const newWorker = registration.installing;
      //console.log("[SW Registration] Nueva versión encontrada");

      if (newWorker) {
        newWorker.addEventListener("statechange", () => {
          //console.log("[SW Registration] Estado:", newWorker.state);

          if (
            newWorker.state === "installed" &&
            navigator.serviceWorker.controller
          ) {
            // Hay una nueva versión disponible
            //console.log("[SW Registration] Nueva versión lista");
            notifyUpdate();
          }
        });
      }
    });

    return registration;
  } catch (error) {
    console.error("[SW Registration] Error al registrar:", error);
    return null;
  }
}

/**
 * Desregistra el Service Worker
 */
export async function unregisterServiceWorker(): Promise<boolean> {
  if (!("serviceWorker" in navigator)) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      const success = await registration.unregister();
      //console.log("[SW Registration] Service Worker desregistrado:", success);
      return success;
    }
    return false;
  } catch (error) {
    console.error("[SW Registration] Error al desregistrar:", error);
    return false;
  }
}

/**
 * Verifica si hay una actualización disponible
 */
export async function checkForUpdates(): Promise<void> {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      await registration.update();
      //console.log("[SW Registration] Verificación de actualización completada");
    }
  } catch (error) {
    console.error("[SW Registration] Error al verificar actualización:", error);
  }
}

/**
 * Fuerza la activación del nuevo Service Worker
 */
export function skipWaiting(): void {
  if (navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({ type: "SKIP_WAITING" });
  }
}

/**
 * Notifica al usuario sobre una actualización disponible
 */
function notifyUpdate(): void {
  // Crear evento personalizado
  const event = new CustomEvent("sw-update-available", {
    detail: {
      message: "Nueva versión disponible",
      timestamp: Date.now(),
    },
  });

  window.dispatchEvent(event);

  //console.log("[SW Registration] Evento de actualización disparado");
}

/**
 * Escucha cambios en el estado de conexión
 */
export function setupConnectionListener(): void {
  window.addEventListener("online", () => {
    //console.log("[Connection] Conexión restaurada");
    const event = new CustomEvent("connection-changed", {
      detail: { online: true },
    });
    window.dispatchEvent(event);
  });

  window.addEventListener("offline", () => {
    //console.log("[Connection] Conexión perdida");
    const event = new CustomEvent("connection-changed", {
      detail: { online: false },
    });
    window.dispatchEvent(event);
  });
}

/**
 * Verifica el estado actual de conexión
 */
export function isOnline(): boolean {
  return navigator.onLine;
}

/**
 * Cachea URLs específicas manualmente
 */
export function cacheUrls(urls: string[]): void {
  if (navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: "CACHE_URLS",
      payload: urls,
    });
  }
}

/**
 * Limpia todas las caches
 */
export async function clearAllCaches(): Promise<void> {
  if ("caches" in window) {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)));
    //console.log("[SW Registration] Todas las caches eliminadas");
  }
}

/**
 * Obtiene el tamaño estimado del cache
 */
export async function getCacheSize(): Promise<number> {
  if ("storage" in navigator && "estimate" in navigator.storage) {
    const estimate = await navigator.storage.estimate();
    return estimate.usage || 0;
  }
  return 0;
}

/**
 * Hook de React para usar el Service Worker
 */
export function useServiceWorker() {
  const [registration, setRegistration] =
    React.useState<ServiceWorkerRegistration | null>(null);
  const [updateAvailable, setUpdateAvailable] = React.useState(false);
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);

  React.useEffect(() => {
    // Registrar Service Worker
    registerServiceWorker().then((reg) => {
      setRegistration(reg);
    });

    // Escuchar actualizaciones
    const handleUpdate = () => setUpdateAvailable(true);
    window.addEventListener("sw-update-available", handleUpdate);

    // Escuchar cambios de conexión
    const handleConnectionChange = (e: CustomEvent) => {
      setIsOnline(e.detail.online);
    };
    window.addEventListener(
      "connection-changed",
      handleConnectionChange as EventListener
    );

    setupConnectionListener();

    return () => {
      window.removeEventListener("sw-update-available", handleUpdate);
      window.removeEventListener(
        "connection-changed",
        handleConnectionChange as EventListener
      );
    };
  }, []);

  return {
    registration,
    updateAvailable,
    isOnline,
    skipWaiting,
    checkForUpdates,
  };
}

// React import para el hook
import * as React from "react";
