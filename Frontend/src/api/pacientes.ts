// Componente: Gestor de pacientes - Frontend
const API_URL = import.meta.env.VITE_API_URL || "/api";

// Interfaz para crear un paciente (SIN rut_tutor)
export interface PacienteCreate {
  nombre: string;
  id_raza: number;
  sexo: string;
  color: string;
  fecha_nacimiento: string;
  codigo_chip?: string;
  esterilizado?: boolean;
}

export interface PacienteData {
  id_paciente: number;
  nombre: string;
  fecha_nacimiento: string | null;
  color: string | null;
  esterilizado: boolean | null;
  id_raza: number | null;
  raza: string | null;
  especie: string | null;
  tutor: {
    nombre: string | null;
    apellido_paterno: string | null;
    apellido_materno: string | null;
    rut: string | null;
    telefono: number | null;
    email: string | null;
  } | null;
  sexo?: string;
  codigo_chip?: string;
}

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

// Función para crear un paciente (paso 1)
export async function crearPaciente(formData: PacienteCreate) {
  try {
    console.log("Enviando datos del paciente al servidor:", formData);
    const response = await fetch(`${API_URL}/pacientes/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Error del servidor:", errorData);
      throw new Error(
        `Error en la petición: ${response.status} - ${errorData}`
      );
    }

    const data = await response.json();
    console.log("Paciente creado exitosamente:", data);
    return data;
  } catch (error) {
    console.error("Error creando paciente:", error);
    throw error;
  }
}

// Función para asociar un tutor a un paciente (paso 2)
export async function asociarTutorAPaciente(
  rutTutor: string,
  idPaciente: number,
  fecha: string = new Date().toISOString().split("T")[0]
) {
  try {
    console.log(`Asociando tutor ${rutTutor} al paciente ${idPaciente}`);
    const response = await fetch(
      `${API_URL}/tutores/${rutTutor}/pacientes/${idPaciente}?fecha=${fecha}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Error del servidor al asociar tutor:", errorData);
      throw new Error(
        `Error en la petición: ${response.status} - ${errorData}`
      );
    }

    const data = await response.json();
    console.log("Tutor asociado exitosamente:", data);
    return data;
  } catch (error) {
    console.error("Error asociando tutor al paciente:", error);
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

// Función para obtener pacientes de un tutor específico
export async function obtenerPacientesPorTutor(
  rutTutor: string
): Promise<PacienteData[]> {
  try {
    console.log(`Obteniendo pacientes del tutor ${rutTutor}...`);
    const response = await fetch(
      `${API_URL}/pacientes/tutor/${encodeURIComponent(rutTutor)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        // No hay pacientes para este tutor, retornar array vacío
        return [];
      }
      throw new Error(`Error en la petición: ${response.status}`);
    }

    const data = await response.json();
    console.log("Pacientes del tutor obtenidos:", data);
    return data;
  } catch (error) {
    console.error("Error obteniendo pacientes del tutor:", error);
    throw error;
  }
}

{
  /* Actualizar relacion paciente tutor */
}
export async function actualizarTutorDePaciente(
  idPaciente: number,
  rutTutor: string
): Promise<PacienteData> {
  const API_URL = import.meta.env.VITE_API_URL || "/api";
  try {
    const url = `${API_URL}/pacientes/${encodeURIComponent(
      idPaciente
    )}/tutor/${encodeURIComponent(rutTutor)}`;

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      throw new Error(
        `Error ${response.status} al actualizar tutor del paciente: ${errorText}`
      );
    }

    const data = (await response.json()) as PacienteData;
    return data;
  } catch (err) {
    console.error("actualizarTutorDePaciente error:", err);
    throw err;
  }
}

{
  /* Actualizar informacion paciente */
}
export async function actualizarPaciente(
  idPaciente: number,
  payload: PacienteCreate
): Promise<PacienteData> {
  try {
    const response = await fetch(`${API_URL}/pacientes/${idPaciente}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      throw new Error(
        `Error ${response.status} al actualizar paciente: ${errorText}`
      );
    }

    const data = (await response.json()) as PacienteData;
    return data;
  } catch (err) {
    console.error("actualizarPaciente error:", err);
    throw err;
  }
}
