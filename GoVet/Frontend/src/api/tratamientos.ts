// Componente: Gestor de próximas vacunas - Frontend
import { fetchWithAuth } from "./http";

export interface ConsultaTratamiento {
    id_consulta: number;
    id_tratamiento: number;
    id_paciente: number;
    dosis: string;
    fecha_tratamiento: string;
    id_aplicacion: number;
    nombre_paciente: string;
    nombre_tratamiento: string;
    descripcion_tratamiento: string;
}

const API_URL = import.meta.env.VITE_API_URL;

export async function obtenerTratamientosProximos(
  idToken?: string | null
) {
  try {
    console.log("Obteniendo tratamientos...");
    const response = await fetchWithAuth(
      `${API_URL}/consultas/tratamientos/vacunas/nombre/`, 
      {
          method: "GET",
          headers: {
              "Content-Type": "application/json",
          },
      },
      idToken
    );

    if (!response.ok) {
      throw new Error(`Error al obtener tratamientos: ${response.status}`);
    }
    const data = await response.json();
    
    console.log("Tratamientos obtenidos:", data);
    return data;
  } catch (error) {
    console.error("Error obteniendo tratamientos:", error);
    throw error;
  }
}

export async function obtenerTratamientosPorPaciente(
  idPaciente: number,
  idToken?: string | null
): Promise<ConsultaTratamiento[]> {
  try {
    console.log(`Obteniendo tratamientos para el paciente ID: ${idPaciente}...`);
    const response = await fetchWithAuth(
      `${API_URL}/consultas/tratamientos/vacunas/paciente/${idPaciente}/proximas/`, 
      {
          method: "GET",
          headers: {
              "Content-Type": "application/json",
          },
      },
      idToken
    );
    
    if (!response.ok) {
      throw new Error(`Error al obtener tratamientos para el paciente: ${response.status}`);
    }
    const data = await response.json();
    console.log(`Tratamientos obtenidos para el paciente ID: ${idPaciente}:`, data);
    return data;
  } catch (error) {
    console.error(`Error obteniendo tratamientos para el paciente ID: ${idPaciente}:`, error);
    throw error;
  }
}