// Ficha data interface
export interface FichaData {
  id_paciente: number;
  rut: string;
  fecha_consulta: string;
  motivo: string;
  diagnostico: string;
  observaciones: string;
  dht: string;
  nodulos_linfaticos: string;
  mucosas: string;
  peso: number;
  auscultacion_cardiaca_toraxica: string;
  estado_pelaje: string;
  condicion_corporal: string;
  id_consulta: number;
  motivo_consulta?: string; // ← Agregar para compatibilidad con backend
  
  // Información relacionada del paciente
  paciente?: {
    id_paciente: number;
    nombre: string;
    color?: string;
    sexo?: string;
    fecha_nacimiento?: string;
    codigo_chip?: string;
    raza?: string;
    especie?: string;
  };
  
  // Información relacionada del tutor
  tutor?: {
    nombre: string;
    apellido_paterno?: string;
    apellido_materno?: string;
    rut: string;
    telefono?: string;
    email?: string;
  };
}

export interface PaginatedResponse {
  fichas: FichaData[];
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
const API_URL = import.meta.env.VITE_API_URL;

export async function obtenerFichasPaginadas(
  page: number = 1,
  limit: number = 50,
  search?: string
): Promise<PaginatedResponse> {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (search) {
      params.append("search", search);
    }

    console.log(`Obteniendo consultas página ${page}...`);
    const response = await fetch(`${API_URL}/consultas/paginated/?${params}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error en la petición: ${response.status}`);
    }

    const data = await response.json();
    console.log("Consultas paginadas obtenidas:", data);
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
export async function obtenerFichaPorId(id_consulta: number): Promise<FichaData> {
  try {
    const url = `${API_URL}/consulta/${id_consulta}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const ficha: FichaData = await response.json();
    
    return {
      ...ficha,
      motivo: ficha.motivo_consulta || ficha.motivo || ''
    };

  } catch (error) {
    console.error(`Error fetching ficha ${id_consulta}:`, error);
    throw error;
  }
}

/**
 * Busca fichas por criterios específicos
 * @param searchParams - Parámetros de búsqueda
 * @returns Promise con las fichas que coinciden
 */
export async function buscarFichas(searchParams: {
  pacienteNombre?: string;
  tutorRut?: string;
  fechaDesde?: string;
  fechaHasta?: string;
  diagnostico?: string;
}): Promise<FichaData[]> {
  try {
    const params = new URLSearchParams();
    
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value && value.trim()) {
        params.append(key, value.trim());
      }
    });

    const url = `${API_URL}/consultas/search/?${params.toString()}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const fichas: FichaData[] = await response.json();
    
    return fichas.map(ficha => ({
      ...ficha,
      motivo: ficha.motivo_consulta || ficha.motivo || ''
    }));

  } catch (error) {
    console.error('❌ Error searching fichas:', error);
    throw error;
  }
}

/**
 * Función helper para formatear fecha para la API
 * @param date - Objeto Date o string de fecha
 * @returns String de fecha en formato ISO
 */
export function formatDateForAPI(date: Date | string): string {
  if (typeof date === 'string') {
    return new Date(date).toISOString().split('T')[0];
  }
  return date.toISOString().split('T')[0];
}

/**
 * Función helper para calcular la edad de un paciente
 * @param fechaNacimiento - Fecha de nacimiento del paciente
 * @returns String con la edad calculada
 */
export function calcularEdadPaciente(fechaNacimiento?: string): string {
  if (!fechaNacimiento) return 'Edad desconocida';
  
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

