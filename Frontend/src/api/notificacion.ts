// Componente: Gestor de notificaciones - Frontend
import { fetchWithAuth } from "./http";

// Estructura que espera el backend
export interface NotificacionPayload {
  email: string; // destinatario
  cuerpo: string; // HTML o texto plano que espera tu backend (schemas.EmailSchema)
  asunto?: string; // opcional
}

const API_URL = import.meta.env.VITE_API_URL;

// Componente: Despachador de notificaciones - Frontend
/**
 * Envía una notificación (correo) al backend.
 * @param payload - { email, cuerpo, asunto? }
 * @returns respuesta JSON del backend o null si no retorna JSON
 */
export async function enviarNotificacion(
  payload: NotificacionPayload, 
  fechaEnvio: string,
  idToken?: string | null ) {
  try {
    if (!fechaEnvio) {
      throw new Error("fechaEnvio es requerida para la ruta /email/{fecha_envio}");
    }

    const url = `${API_URL}/email/${encodeURIComponent(fechaEnvio)}`;

    const res = await fetchWithAuth(
      url,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
      idToken
    );

    if (!res.ok) {
      // intenta extraer detalle del error del backend
      let bodyText = `HTTP ${res.status}`;
      try {
        const json = await res.json();
        bodyText = json?.detail || json?.message || JSON.stringify(json);
      } catch {
        bodyText = await res.text().catch(() => bodyText);
      }
      throw new Error(`Error enviando notificación: ${bodyText}`);
    }

    // si el backend retorna JSON, lo devolvemos; si no, devolvemos null
    try {
      const data = await res.json();
      //console.log("Respuesta del backend (notificación):", data);
      return data;
    } catch {
      //console.log("Notificación enviada correctamente (sin body JSON). status:", res.status);
      return null;
    }
  } catch (error) {
    console.error("Error en enviarNotificacion:", error);
    throw error;
  }
}