const API_URL = import.meta.env.VITE_API_URL || "/api";

export interface CitaPaciente {
  id_paciente: number;
  nombre: string;
}

export interface Cita {
  id_cita: number;
  rut_tutor: string;
  fecha_hora: string;
  motivo: string;
  notas?: string;
  estado: "programada" | "confirmada" | "completada" | "cancelada";
  created_at: string;
  tutor_nombre?: string;
  tutor_apellido_paterno?: string;
  tutor_apellido_materno?: string;
  tutor_telefono?: number;
  tutor_email?: string;
  pacientes: CitaPaciente[];
}

export interface CitaCreate {
  rut_tutor: string;
  fecha_hora: string;
  motivo: string;
  notas?: string;
  pacientes_ids: number[];
}

export interface CitaUpdate {
  fecha_hora?: string;
  motivo?: string;
  notas?: string;
  pacientes_ids?: number[];
  estado?: "programada" | "confirmada" | "completada" | "cancelada";
}

export interface CitasPaginadasResponse {
  citas: Cita[];
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

export interface CitasPorFechaResponse {
  citas: Cita[];
  count: number;
}

// Crear una cita
export const crearCita = async (cita: CitaCreate): Promise<Cita> => {
  const response = await fetch(`${API_URL}/citas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cita),
  });

  if (!response.ok) {
    throw new Error("Error al crear la cita");
  }

  return await response.json();
};

// Obtener una cita por ID
export const obtenerCita = async (id: number): Promise<Cita> => {
  const response = await fetch(`${API_URL}/citas/${id}`);

  if (!response.ok) {
    throw new Error("Cita no encontrada");
  }

  return await response.json();
};

// Obtener todas las citas
export const obtenerTodasLasCitas = async (): Promise<Cita[]> => {
  const response = await fetch(`${API_URL}/citas`);

  if (!response.ok) {
    throw new Error("Error al obtener citas");
  }

  return await response.json();
};

// Obtener citas con paginación
export const obtenerCitasPaginadas = async (
  page: number = 1,
  limit: number = 50,
  search?: string,
  estado?: string
): Promise<CitasPaginadasResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (search) params.append("search", search);
  if (estado) params.append("estado", estado);

  const response = await fetch(`${API_URL}/citas?${params}`);

  if (!response.ok) {
    throw new Error("Error al obtener citas paginadas");
  }

  return await response.json();
};

// Obtener citas por fecha específica
export const obtenerCitasPorFecha = async (
  fecha: string
): Promise<CitasPorFechaResponse> => {
  const response = await fetch(`${API_URL}/citas/fecha/${fecha}`);

  if (!response.ok) {
    throw new Error("Error al obtener citas por fecha");
  }

  return await response.json();
};

// Obtener citas en un rango de fechas
export const obtenerCitasPorRango = async (
  fecha_inicio: string,
  fecha_fin: string
): Promise<CitasPorFechaResponse> => {
  const response = await fetch(
    `${API_URL}/citas/rango?fecha_inicio=${fecha_inicio}&fecha_fin=${fecha_fin}`
  );

  if (!response.ok) {
    throw new Error("Error al obtener citas por rango");
  }

  return await response.json();
};

// Obtener citas de un tutor
export const obtenerCitasPorTutor = async (
  rut: string
): Promise<CitasPorFechaResponse> => {
  const response = await fetch(`${API_URL}/citas/tutor/${rut}`);

  if (!response.ok) {
    throw new Error("Error al obtener citas del tutor");
  }

  return await response.json();
};

// Obtener citas de un paciente
export const obtenerCitasPorPaciente = async (
  id: number
): Promise<CitasPorFechaResponse> => {
  const response = await fetch(`${API_URL}/citas/paciente/${id}`);

  if (!response.ok) {
    throw new Error("Error al obtener citas del paciente");
  }

  return await response.json();
};

// Obtener citas pendientes de un paciente (programadas + confirmadas)
export const obtenerCitasPendientesPorPaciente = async (
  id: number
): Promise<CitasPorFechaResponse> => {
  const response = await fetch(`${API_URL}/citas/paciente/${id}/pendientes`);

  if (!response.ok) {
    throw new Error("Error al obtener citas pendientes");
  }

  return await response.json();
};

// Editar una cita
export const editarCita = async (
  id: number,
  cita: CitaUpdate
): Promise<Cita> => {
  const response = await fetch(`${API_URL}/citas/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cita),
  });

  if (!response.ok) {
    throw new Error("Error al editar la cita");
  }

  return await response.json();
};

// Eliminar/cancelar una cita
export const eliminarCita = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/citas/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Error al eliminar la cita");
  }
};
