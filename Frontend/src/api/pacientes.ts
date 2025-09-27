const API_URL = import.meta.env.VITE_API_URL; // usa tu variable de entorno

// Interfaz para crear un paciente (solo los campos necesarios)
export interface PacienteCreate {
  nombre: string;
  id_raza: number;
  sexo: string;
  color: string;
  fecha_nacimiento: string;
  codigo_chip?: string;
}

export interface PacienteData {
  id_paciente: number;
  nombre: string;
  fecha_nacimiento: string | null; // Formato ISO 8601: "YYYY-MM-DD"
  color: string | null;
  esterilizado: boolean | null;
  id_raza: number | null;
  // Información de la raza
  raza: string | null;
  // Información de la especie
  especie: string | null;
  // Información del tutor
  tutor: {
    nombre: string | null;
    apellido_paterno: string | null;
    apellido_materno: string | null;
    rut: string | null;
    telefono: number | null;
    email: string | null;
  } | null;
  // Campos opcionales que podrías tener en el modelo
  sexo?: string;
  codigo_chip?: string;
}

// Agregar interfaces para la respuesta paginada
export interface PaginatedResponse {
  pacientes: PacienteData[];
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

{
  /* Ruta para crear un nuevo paciente */
}
export async function crearPaciente(formData: PacienteCreate) {
  try {
    console.log("Enviando datos al servidor:", formData);
    const response = await fetch(`${API_URL}/pacientes/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error(`Error en la petición: ${response.status}`);
    }

    const data = await response.json();
    console.log("Respuesta del servidor:", data);
    return data;
  } catch (error) {
    console.error("Error creando paciente:", error);
    throw error;
  }
}

export async function obtenerPacientes() {
  try {
    console.log("Obteniendo pacientes...");
    const response = await fetch(`${API_URL}/pacientes/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error en la petición: ${response.status}`);
    }

    const data = await response.json();
    console.log("Pacientes obtenidos:", data);
    return data;
  } catch (error) {
    console.error("Error obteniendo pacientes:", error);
    throw error;
  }
}

// Nueva función para obtener pacientes paginados
export async function obtenerPacientesPaginados(
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

    console.log(`Obteniendo pacientes página ${page}...`);
    const response = await fetch(`${API_URL}/pacientes/paginated/?${params}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error en la petición: ${response.status}`);
    }

    const data = await response.json();
    console.log("Pacientes paginados obtenidos:", data);
    return data;
  } catch (error) {
    console.error("Error obteniendo pacientes paginados:", error);
    throw error;
  }
}
