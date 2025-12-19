import { useState, useEffect } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

interface PWAInstallState {
  isInstallable: boolean;
  isInstalled: boolean;
  promptInstall: () => Promise<void>;
}

/**
 * Hook para detectar si la PWA está instalada o puede instalarse
 */
export function usePWAInstall(): PWAInstallState {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Detectar si ya está instalada
    const isStandalone = window.matchMedia(
      "(display-mode: standalone)"
    ).matches;
    const isInIOS = (window.navigator as any).standalone === true;
    setIsInstalled(isStandalone || isInIOS);

    // Escuchar el evento beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      //console.log("[PWA Install] Prompt disponible");
    };

    // Detectar cuando se instala
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      //console.log("[PWA Install] App instalada");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const promptInstall = async () => {
    if (!deferredPrompt) {
      console.warn("[PWA Install] No hay prompt disponible");
      return;
    }

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      //console.log(`[PWA Install] User choice: ${outcome}`);

      if (outcome === "accepted") {
        setDeferredPrompt(null);
      }
    } catch (error) {
      console.error("[PWA Install] Error al mostrar prompt:", error);
    }
  };

  return {
    isInstallable: !!deferredPrompt && !isInstalled,
    isInstalled,
    promptInstall,
  };
}

/**
 * Verifica si la app está corriendo como PWA instalada
 */
export function isPWAInstalled(): boolean {
  const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
  const isInIOS = (window.navigator as any).standalone === true;
  return isStandalone || isInIOS;
}

/**
 * Detecta el tipo de dispositivo
 */
export function getDeviceType(): "ios" | "android" | "desktop" {
  const userAgent = navigator.userAgent.toLowerCase();

  if (/iphone|ipad|ipod/.test(userAgent)) {
    return "ios";
  }

  if (/android/.test(userAgent)) {
    return "android";
  }

  return "desktop";
}
