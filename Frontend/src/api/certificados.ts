// Componente: Gestor de certificados PDF - Frontend
import { fetchWithAuth } from "./http";

const API_URL = import.meta.env.VITE_API_URL;

// ==================== INTERFACES ====================

export interface ConsentimientoInformadoRequest {
  procedimiento?: string;
  indicaciones?: string;
  objetivos?: string;
  peso?: number;
  autorizaciones_adicionales?: string[];
  testigo_requerido?: boolean;
}

export interface OrdenExamenesRequest {
  id_consulta?: number;
  examenes?: Array<{
    nombre: string;
    descripcion?: string;
    urgente?: boolean;
  }>;
  observaciones?: string;
}

export interface RecetaMedicaRequest {
  id_consulta?: number;
  recetas?: Array<{
    medicamento: string;
    dosis?: string;
    frecuencia?: number;
    duracion?: number;
    numero_de_serie?: string;
    instrucciones?: string;
    observaciones?: string;
  }>;
  observaciones?: string;
  fecha_receta?: string;
}

// ==================== FUNCIONES API ====================

/**
 * Descarga certificado de transporte para un paciente
 */
export async function descargarCertificadoTransporte(
  idPaciente: number,
  idToken?: string | null
): Promise<Blob> {
  /*console.log(
    `[API] Descargando certificado de transporte para paciente ${idPaciente}`
  );*/
  (
    //`[API] idToken recibido:`,
    idToken ? `${idToken.substring(0, 20)}...` : "NULL"
  );
  const url = `${API_URL}/pacientes/${idPaciente}/certificado-transporte`;
  //console.log(`[API] URL: ${url}`);

  const response = await fetchWithAuth(
    url,
    {
      method: "GET",
      headers: {
        Accept: "application/pdf",
      },
    },
    idToken
  );

  //console.log(`[API] Response status: ${response.status}`);
  //console.log(`[API] Response headers:`, response.headers);

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`[API] Error response:`, errorText);
    throw new Error(
      `Error al descargar certificado: ${response.status} - ${errorText}`
    );
  }

  const blob = await response.blob();
  //console.log(`[API] Blob size: ${blob.size} bytes, type: ${blob.type}`);
  return blob;
}

/**
 * Descarga consentimiento informado para un paciente
 */
export async function descargarConsentimientoInformado(
  idPaciente: number,
  data: ConsentimientoInformadoRequest,
  idToken?: string | null
): Promise<Blob> {
  const response = await fetchWithAuth(
    `${API_URL}/pacientes/${idPaciente}/consentimiento-informado`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/pdf",
      },
      body: JSON.stringify(data),
    },
    idToken
  );

  if (!response.ok) {
    throw new Error(`Error al descargar consentimiento: ${response.status}`);
  }

  return await response.blob();
}

/**
 * Descarga orden de exámenes para un paciente
 */
export async function descargarOrdenExamenes(
  idPaciente: number,
  data: OrdenExamenesRequest,
  idToken?: string | null
): Promise<Blob> {
  const response = await fetchWithAuth(
    `${API_URL}/pacientes/${idPaciente}/orden-examenes`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/pdf",
      },
      body: JSON.stringify(data),
    },
    idToken
  );

  if (!response.ok) {
    throw new Error(`Error al descargar orden de exámenes: ${response.status}`);
  }

  return await response.blob();
}

/**
 * Descarga receta médica para un paciente
 */
export async function descargarRecetaMedica(
  idPaciente: number,
  data: RecetaMedicaRequest,
  idToken?: string | null
): Promise<Blob> {
  const response = await fetchWithAuth(
    `${API_URL}/pacientes/${idPaciente}/receta-medica`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/pdf",
      },
      body: JSON.stringify(data),
    },
    idToken
  );

  if (!response.ok) {
    throw new Error(`Error al descargar receta médica: ${response.status}`);
  }

  return await response.blob();
}

/**
 * Descarga PDF de resumen de consulta
 */
export async function descargarResumenConsulta(
  idConsulta: number,
  idToken?: string | null
): Promise<Blob> {
  const response = await fetchWithAuth(
    `${API_URL}/consultas/${idConsulta}/pdf`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
    idToken
  );

  if (!response.ok) {
    throw new Error(
      `Error al descargar resumen de consulta: ${response.status}`
    );
  }

  return await response.blob();
}

/**
 * Descarga un PDF y lo guarda/comparte según la plataforma
 */
export async function descargarYCompartirPDF(
  blob: Blob,
  nombreArchivo: string
): Promise<void> {
  // Usar Web Share API si está disponible (móvil)
  if (navigator.share && navigator.canShare) {
    try {
      const file = new File([blob], nombreArchivo, { type: "application/pdf" });
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: nombreArchivo,
        });
        return;
      }
    } catch (error) {
      console.log("Error al compartir, descargando en su lugar:", error);
      // Si falla compartir, continúa con descarga
    }
  }

  // Fallback: Descarga tradicional
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = nombreArchivo;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
