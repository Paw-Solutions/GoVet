const API_URL = import.meta.env.VITE_API_URL || "/api";
const ADMIN_KEY = import.meta.env.VITE_WHATSAPP_ADMIN_KEY || "";

/**
 * Interface para el estado de conexión de WhatsApp
 */
export interface WhatsAppStatus {
  conectado: boolean;
  phone?: string;
}

/**
 * Interface para la respuesta del QR
 */
export interface WhatsAppQRResponse {
  qr: string | null;
}

/**
 * Interface para respuesta de acciones de control
 */
export interface WhatsAppActionResponse {
  ok: boolean;
  mensaje: string;
}

/**
 * Crea headers con admin key si está disponible
 * NOTA: Actualmente el admin key se expone en el frontend.
 * TODO: Considerar mover la autenticación al backend con tokens de sesión
 * para mayor seguridad en producción.
 */
function getAuthHeaders(): HeadersInit {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (ADMIN_KEY) {
    headers["X-Admin-Key"] = ADMIN_KEY;
  }

  return headers;
}

/**
 * Obtiene el código QR para conectar WhatsApp
 * Requiere admin key en el header X-Admin-Key
 * @returns {Promise<WhatsAppQRResponse>} Objeto con el string del QR o null si ya está conectado
 */
export async function getWhatsAppQR(): Promise<WhatsAppQRResponse> {
  try {
    console.log("Obteniendo código QR de WhatsApp...");

    const response = await fetch(`${API_URL}/whatsapp/qr`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.detail || `Error en la petición: ${response.status}`
      );
    }

    const data: WhatsAppQRResponse = await response.json();
    console.log("QR obtenido:", data.qr ? "Disponible" : "No disponible");
    return data;
  } catch (error) {
    console.error("Error obteniendo código QR de WhatsApp:", error);
    throw error;
  }
}

/**
 * Verifica el estado de conexión de WhatsApp
 * @returns {Promise<WhatsAppStatus>} Objeto con el estado de conexión
 */
export async function getWhatsAppStatus(): Promise<WhatsAppStatus> {
  try {
    console.log("Verificando estado de WhatsApp...");
    const response = await fetch(`${API_URL}/whatsapp/status`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error en la petición: ${response.status}`);
    }

    const data: WhatsAppStatus = await response.json();
    console.log(
      "Estado de WhatsApp:",
      data.conectado ? "Conectado" : "Desconectado"
    );
    return data;
  } catch (error) {
    console.error("Error verificando estado de WhatsApp:", error);
    throw error;
  }
}

/**
 * Cierra la sesión de WhatsApp (desconecta el socket sin borrar credenciales)
 * Requiere admin key en el header X-Admin-Key
 * @returns {Promise<WhatsAppActionResponse>} Resultado de la operación
 */
export async function cerrarSesionWhatsApp(): Promise<WhatsAppActionResponse> {
  try {
    console.log("Cerrando sesión de WhatsApp...");
    const response = await fetch(`${API_URL}/whatsapp/cerrar-sesion`, {
      method: "POST",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.detail || `Error en la petición: ${response.status}`
      );
    }

    const data: WhatsAppActionResponse = await response.json();
    console.log("Sesión cerrada:", data.mensaje);
    return data;
  } catch (error) {
    console.error("Error cerrando sesión de WhatsApp:", error);
    throw error;
  }
}

/**
 * Desvincula el dispositivo de WhatsApp (logout + elimina credenciales)
 * Requiere admin key en el header X-Admin-Key
 * @returns {Promise<WhatsAppActionResponse>} Resultado de la operación
 */
export async function desvincularWhatsApp(): Promise<WhatsAppActionResponse> {
  try {
    console.log("Desvinculando dispositivo de WhatsApp...");
    const response = await fetch(`${API_URL}/whatsapp/desvincular`, {
      method: "POST",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.detail || `Error en la petición: ${response.status}`
      );
    }

    const data: WhatsAppActionResponse = await response.json();
    console.log("Dispositivo desvinculado:", data.mensaje);
    return data;
  } catch (error) {
    console.error("Error desvinculando dispositivo de WhatsApp:", error);
    throw error;
  }
}

/**
 * Inicia/reconecta la sesión de WhatsApp
 * Requiere admin key en el header X-Admin-Key
 * @returns {Promise<WhatsAppActionResponse>} Resultado de la operación
 */
export async function iniciarSesionWhatsApp(): Promise<WhatsAppActionResponse> {
  try {
    console.log("Iniciando sesión de WhatsApp...");
    const response = await fetch(`${API_URL}/whatsapp/iniciar`, {
      method: "POST",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.detail || `Error en la petición: ${response.status}`
      );
    }

    const data: WhatsAppActionResponse = await response.json();
    console.log("Sesión iniciada:", data.mensaje);
    return data;
  } catch (error) {
    console.error("Error iniciando sesión de WhatsApp:", error);
    throw error;
  }
}

/**
 * Envía una notificación de WhatsApp (para uso futuro)
 * @param params Parámetros de la notificación
 */
export async function sendWhatsAppNotification(params: {
  numero: string;
  nombre: string;
  paciente: string;
  fecha: string;
  hora?: string;
}) {
  try {
    console.log("Enviando notificación de WhatsApp...");

    const queryParams = new URLSearchParams({
      numero: params.numero,
      nombre: params.nombre,
      paciente: params.paciente,
      fecha: params.fecha,
    });

    if (params.hora) {
      queryParams.append("hora", params.hora);
    }

    const response = await fetch(
      `${API_URL}/whatsapp/notificar?${queryParams.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.detail || `Error en la petición: ${response.status}`
      );
    }

    const data = await response.json();
    console.log("Notificación enviada:", data);
    return data;
  } catch (error) {
    console.error("Error enviando notificación de WhatsApp:", error);
    throw error;
  }
}
