const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;

/**
 * Carga el script de Google Identity Services (GSI)
 */
export function loadGoogleScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.getElementById("google-client-js")) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.id = "google-client-js";
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error("No se pudo cargar Google Identity Services"));
    document.head.appendChild(script);
  });
}

/**
 * Muestra el prompt de Google y retorna el ID Token (JWT) en response.credential
 * Nota: El prompt puede decidir no mostrarse; como alternativa, usa renderGoogleButton.
 */
export async function getIdToken(): Promise<string> {
  await loadGoogleScript();

  return new Promise((resolve, reject) => {
    const google = (window as any).google;
    if (!google?.accounts?.id) {
      reject(new Error("GSI no está disponible"));
      return;
    }

    google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: (response: any) => {
        const idToken = response?.credential;
        if (!idToken) {
          reject(new Error("No se obtuvo ID token de Google"));
          return;
        }
        resolve(idToken);
      },
      auto_select: false,
    });

    // Intento de One Tap; puede no mostrarse según criterios de Google
    google.accounts.id.prompt((notification: any) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        // No rechazamos aquí: el caller puede usar renderGoogleButton para forzar el botón clásico.
        console.warn("One Tap no se mostró; usa renderGoogleButton para el botón clásico.");
      }
    });
  });
}

/**
 * Renderiza el botón oficial de Google en el contenedor indicado (por id).
 * Al hacer clic, se llamará al callback con el ID Token.
 */
export async function renderGoogleButton(containerId: string, onToken: (idToken: string) => void) {
  await loadGoogleScript();

  const google = (window as any).google;
  if (!google?.accounts?.id) {
    throw new Error("GSI no está disponible");
  }

  google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback: (response: any) => {
      const idToken = response?.credential;
      if (idToken) onToken(idToken);
    },
    auto_select: false,
  });

  const container = document.getElementById(containerId);
  if (!container) {
    throw new Error(`No se encontró contenedor #${containerId} para renderizar el botón`);
  }

  google.accounts.id.renderButton(container, {
    theme: "outline",
    size: "large",
    text: "signin_with", // texto estándar
    shape: "rectangular",
    logo_alignment: "left",
    width: 240,
  });
}