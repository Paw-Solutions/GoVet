// Componente: Gestor de fichas clínicas - Frontend
import { fetchWithAuth } from "./http"; // ← añadido

// Receta Médica
export interface RecetaData {
  medicamento: string;
  dosis: string;
  frecuencia: number; // en horas
  duracion: number; // en días
  numero_serie?: string;
}

// Tratamiento Aplicado (Vacunas/Antiparasitarios)
export interface TratamientoAplicadoData {
  fecha_tratamiento?: string;
  dosis?: string;
  marca?: string;
  numero_serial?: string;
  proxima_dosis?: string;
  nombre_tratamiento?: string;
  tipo_tratamiento?: string;
}

// Ficha data interface
export interface ConsultaData {
  id_consulta: number;
  id_paciente: number;
  rut: string;
  fecha_consulta: string;
  motivo: string;

  // CONSTANTES VITALES
  peso?: number;
  temperatura?: number;
  frecuencia_cardiaca?: number;
  frecuencia_respiratoria?: number;
  tllc?: number;
  dht?: number; // Deshidratación (%)

  // EXAMEN FÍSICO
  mucosas?: string;
  condicion_corporal?: string;
  estado_pelaje?: string;
  estado_piel?: string;
  nodulos_linfaticos?: string;
  auscultacion_cardiaca_toraxica?: string;

  // DIAGNÓSTICO
  examen_clinico?: string;
  prediagnostico?: string;
  diagnostico?: string;
  pronostico?: string;
  observaciones?: string;

  // PLAN
  indicaciones_generales?: string;

  // RELACIONES
  recetas?: RecetaData[];
  tratamientos?: TratamientoAplicadoData[];

  // CAMPOS LEGACY (compatibilidad)
  motivo_consulta?: string;
  vacunas_inoculadas?: VacunasData[];
  desparasitacion_interna?: DesparasitacionData;
  desparasitacion_externa?: DesparasitacionData;
  receta_medica?: RecetaMedicaData[];
  deshidratacion?: number; // DEPRECATED - No existe en BD
  orden_de_examenes?: string; // DEPRECATED - No existe en BD
  proxima_consulta?: string; // DEPRECATED - No existe en BD

  // Información relacionada del paciente
  paciente?: PacienteData;
  // Información relacionada del tutor
  tutor?: TutorData;
}

export interface RecetaMedicaData {
  medicamento: string;
  dosis: string;
  frecuencia: string /* Frecuencia en días */;
  duracion: string /* Duración en días */;
  numero_de_serie?: string;
}

export interface PacienteData {
  id_paciente: number;
  nombre: string;
  color?: string;
  sexo?: string;
  fecha_nacimiento?: string;
  codigo_chip?: string;
  raza?: string;
  especie?: string;
}

export interface VacunasData {
  nombre_vacuna: string;
  fecha_vacunacion: string;
  marca: string;
  numero_de_serie?: string;
  proxima_dosis?: string;
  requiere_proxima?: boolean;
}

export interface TutorData {
  nombre: string;
  apellido_paterno?: string;
  apellido_materno?: string;
  rut: string;
  telefono?: string;
  email?: string;
}

export interface DesparasitacionData {
  nombre_desparasitante: string;
  fecha_administracion: string;
  marca: string;
  numero_de_serie?: string;
  proxima_dosis?: string;
  requiere_proxima?: boolean;
}

export interface PaginatedResponse {
  consultas: ConsultaData[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_count: number;
    limit: number;
    has_next: boolean;
    has_previous: boolean;
    next_page: number | null;
    previous_page: number | null;
  };
}

// API
const API_URL = import.meta.env.VITE_API_URL || "/api";

// Ruta para crear una nueva consulta/ficha
export async function crearConsulta(
  formData: ConsultaData,
  idToken?: string | null
) {
  try {
    //console.log("Enviando datos al servidor:", formData);
    const response = await fetchWithAuth(
      `${API_URL}/consultas/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      },
      idToken
    );

    if (!response.ok) {
      throw new Error(`Error en la petición: ${response.status}`);
    }

    const data = await response.json();
    //console.log("Respuesta del servidor:", data);
    return data;
  } catch (error) {
    console.error("Error creando consulta:", error);
    throw error;
  }
}

// Ruta para actualizar una consulta/ficha existente
export async function actualizarConsulta(
  id_consulta: number,
  formData: ConsultaData,
  idToken?: string | null
) {
  try {
    //console.log("Actualizando consulta:", id_consulta, formData);
    const response = await fetchWithAuth(
      `${API_URL}/consultas/${id_consulta}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      },
      idToken
    );

    if (!response.ok) {
      throw new Error(`Error en la petición: ${response.status}`);
    }

    const data = await response.json();
    //console.log("Consulta actualizada:", data);
    return data;
  } catch (error) {
    console.error("Error actualizando consulta:", error);
    throw error;
  }
}

export async function obtenerConsultasPaginadas(
  page: number = 1,
  limit: number = 50,
  search?: string,
  sortOrder: "desc" | "asc" = "desc",
  idToken?: string | null
): Promise<PaginatedResponse> {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sort_order: sortOrder,
    });

    if (search) {
      params.append("search", search);
    }

    //console.log(`Obteniendo consultas página ${page}...`);
    const response = await fetchWithAuth(
      `${API_URL}/consultas/paginated/?${params}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
      idToken
    );

    if (!response.ok) {
      throw new Error(`Error en la petición: ${response.status}`);
    }

    const data = await response.json();
    //console.log("Consultas paginadas obtenidas:", data);
    return data;
  } catch (error) {
    console.error("Error obteniendo consultas paginadas:", error);
    throw error;
  }
}

/**
 * Obtiene una ficha específica por ID
 * @param id_consulta - ID de la consulta/ficha
 * @returns Promise con la ficha específica
 */
export async function obtenerConsultaPorId(
  id_consulta: number,
  idToken?: string | null
): Promise<ConsultaData> {
  try {
    const response = await fetchWithAuth(
      `${API_URL}/consulta/${id_consulta}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
      idToken
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const ficha: ConsultaData = await response.json();

    return {
      ...ficha,
      motivo: ficha.motivo_consulta || ficha.motivo || "",
    };
  } catch (error) {
    console.error(`Error fetching consulta ${id_consulta}:`, error);
    throw error;
  }
}

/**
 * Busca fichas por criterios específicos
 * @param searchParams - Parámetros de búsqueda
 * @returns Promise con las fichas que coinciden
 */
export async function buscarFichas(
  searchParams: {
    pacienteNombre?: string;
    tutorRut?: string;
    fechaDesde?: string;
    fechaHasta?: string;
    diagnostico?: string;
  },
  idToken?: string | null
): Promise<ConsultaData[]> {
  try {
    const params = new URLSearchParams();

    Object.entries(searchParams).forEach(([key, value]) => {
      if (value && value.trim()) {
        params.append(key, value.trim());
      }
    });

    //const url = `${API_URL}/consultas/search/?${params.toString()}`;

    const response = await fetchWithAuth(
      `${API_URL}/consultas/search/?${params.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
      idToken
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const fichas: ConsultaData[] = await response.json();

    return fichas.map((ficha) => ({
      ...ficha,
      motivo: ficha.motivo_consulta || ficha.motivo || "",
    }));
  } catch (error) {
    console.error("Error searching fichas:", error);
    throw error;
  }
}

/**
 * Función helper para formatear fecha para la API
 * @param date - Objeto Date o string de fecha
 * @returns String de fecha en formato ISO
 */
export function formatDateForAPI(date: Date | string): string {
  if (typeof date === "string") {
    return new Date(date).toISOString().split("T")[0];
  }
  return date.toISOString().split("T")[0];
}

/**
 * Función helper para calcular la edad de un paciente
 * @param fechaNacimiento - Fecha de nacimiento del paciente
 * @returns String con la edad calculada
 */
export function calcularEdadPaciente(fechaNacimiento?: string): string {
  if (!fechaNacimiento) return "Edad desconocida";

  const birthDate = new Date(fechaNacimiento);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - birthDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 30) {
    return `${diffDays} días`;
  } else if (diffDays < 365) {
    return `${Math.floor(diffDays / 30)} meses`;
  } else {
    return `${Math.floor(diffDays / 365)} años`;
  }
}

/**
 * Obtiene todas las consultas de un paciente específico
 * @param idPaciente - ID del paciente
 * @returns Array de consultas del paciente
 */
export async function obtenerConsultasPorPaciente(
  idPaciente: number,
  idToken?: string | null
): Promise<ConsultaData[]> {
  try {
    const response = await fetchWithAuth(
      `${API_URL}/consultas/paciente/${idPaciente}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
      idToken
    );

    if (!response.ok) {
      throw new Error(`Error en la petición: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error obteniendo consultas del paciente:", error);
    throw error;
  }
}

/**
 * Descarga el PDF de una consulta específica
 * @param idConsulta - ID de la consulta
 * @returns Promise con el Blob del PDF
 */
export async function descargarPdfConsulta(
  idConsulta: number,
  idToken?: string | null
): Promise<Blob> {
  try {
    const response = await fetchWithAuth(
      `${API_URL}/consultas/${idConsulta}/pdf`,
      {
        method: "GET",
        headers: {
          Accept: "application/pdf",
        },
      },
      idToken
    );

    if (!response.ok) {
      throw new Error(`Error al descargar PDF: ${response.status}`);
    }

    return await response.blob();
  } catch (error) {
    console.error(`Error descargando PDF de consulta ${idConsulta}:`, error);
    throw error;
  }
}
