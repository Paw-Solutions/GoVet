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

export async function obtenerTratamientosProximos() {
  try {
    console.log("Obteniendo tratamientos...");
    const response = await fetch(`${API_URL}/consultas/tratamientos/vacunas/nombre/`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

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