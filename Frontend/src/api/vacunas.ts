// API para gestión de vacunas pendientes

// *** ACTUALMENTE NO SE ESTA USANDO ***

import { fetchWithAuth } from "./http";

// TODO: Implementar endpoints en el backend cuando se cree el modelo de Vacuna
const API_URL = import.meta.env.VITE_API_URL || "/api";

export interface Vacuna {
  id_vacuna: number;
  id_paciente: number;
  nombre: string;
  fecha_programada: string;
  fecha_aplicada?: string;
  estado: "pendiente" | "aplicada" | "vencida";
  lote?: string;
  observaciones?: string;
  created_at: string;
}

export interface VacunaPendienteResponse {
  vacunas: Vacuna[];
  count: number;
}

/**
 * Obtiene las vacunas pendientes de un paciente específico
 * @param id_paciente - ID del paciente
 * @returns Promise con las vacunas pendientes
 */
export const obtenerVacunasPendientesPorPaciente = async (
  id_paciente: number,
  idToken?: string | null
): Promise<VacunaPendienteResponse> => {
  const response = await fetchWithAuth(
    `${API_URL}/vacunas/paciente/${id_paciente}/pendientes`,
    {
      method: "GET"
    },
    idToken
  );

  if (!response.ok) {
    throw new Error("Error al obtener vacunas pendientes");
  }

  return await response.json();
};

/**
 * Obtiene todas las vacunas de un paciente (pendientes y aplicadas)
 * @param id_paciente - ID del paciente
 * @returns Promise con todas las vacunas
 */
export const obtenerVacunasPorPaciente = async (
  id_paciente: number,
  idToken?: string | null
): Promise<VacunaPendienteResponse> => {
  const response = await fetchWithAuth(
    `${API_URL}/vacunas/paciente/${id_paciente}`,
    {
      method: "GET"
    },
    idToken
  );

  if (!response.ok) {
    throw new Error("Error al obtener vacunas del paciente");
  }

  return await response.json();
};

/**
 * Marca una vacuna como aplicada
 * @param id_vacuna - ID de la vacuna
 * @param fecha_aplicada - Fecha en que se aplicó
 * @param lote - Lote de la vacuna (opcional)
 * @returns Promise con la vacuna actualizada
 */
export const marcarVacunaAplicada = async (
  id_vacuna: number,
  fecha_aplicada: string,
  lote?: string,
  idToken?: string | null
): Promise<Vacuna> => {
  const response = await fetchWithAuth(
    `${API_URL}/vacunas/${id_vacuna}/aplicar`, 
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fecha_aplicada, lote }),
    },
    idToken
  );

  if (!response.ok) {
    throw new Error("Error al marcar vacuna como aplicada");
  }

  return await response.json();
};
