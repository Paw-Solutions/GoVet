const API_URL = import.meta.env.VITE_API_URL;

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
  estado: "programada" | "completada" | "cancelada";
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
  estado?: "programada" | "completada" | "cancelada";
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

// ============================================
// DATOS MOCK PARA DEMOSTRACIÓN
// ============================================
// Estos son datos de ejemplo para mostrar la interfaz
// Cuando se integre con Google Calendar, se reemplazará esta lógica

const citasMock: Cita[] = [
  {
    id_cita: 1,
    rut_tutor: "12345678-9",
    fecha_hora: "2025-11-08T10:00:00",
    motivo: "Vacunación anual",
    notas: "Revisar cartilla de vacunación",
    estado: "programada",
    created_at: "2025-11-07T15:30:00",
    tutor_nombre: "Juan",
    tutor_apellido_paterno: "Pérez",
    tutor_apellido_materno: "González",
    tutor_telefono: 987654321,
    tutor_email: "juan@example.com",
    pacientes: [
      { id_paciente: 1, nombre: "Firulais" },
      { id_paciente: 2, nombre: "Michi" },
    ],
  },
  {
    id_cita: 2,
    rut_tutor: "98765432-1",
    fecha_hora: "2025-11-08T14:30:00",
    motivo: "Control general",
    notas: "Paciente nuevo",
    estado: "programada",
    created_at: "2025-11-07T16:00:00",
    tutor_nombre: "María",
    tutor_apellido_paterno: "López",
    tutor_apellido_materno: "Silva",
    tutor_telefono: 912345678,
    tutor_email: "maria@example.com",
    pacientes: [{ id_paciente: 3, nombre: "Luna" }],
  },
  {
    id_cita: 3,
    rut_tutor: "11111111-1",
    fecha_hora: "2025-11-10T09:00:00",
    motivo: "Revisión post-operatoria",
    notas: "Revisar herida quirúrgica",
    estado: "programada",
    created_at: "2025-11-07T14:00:00",
    tutor_nombre: "Pedro",
    tutor_apellido_paterno: "Ramírez",
    tutor_apellido_materno: "Torres",
    tutor_telefono: 956789012,
    tutor_email: "pedro@example.com",
    pacientes: [{ id_paciente: 4, nombre: "Max" }],
  },
];

let citasStorage = [...citasMock];
let nextId = 4;

// Simular delay de red
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Crear una cita
export const crearCita = async (cita: CitaCreate): Promise<Cita> => {
  await delay(500); // Simular latencia de red

  const nuevaCita: Cita = {
    id_cita: nextId++,
    rut_tutor: cita.rut_tutor,
    fecha_hora: cita.fecha_hora,
    motivo: cita.motivo,
    notas: cita.notas,
    estado: "programada",
    created_at: new Date().toISOString(),
    tutor_nombre: "Tutor",
    tutor_apellido_paterno: "Demo",
    tutor_apellido_materno: "Mock",
    tutor_telefono: 999999999,
    tutor_email: "demo@example.com",
    pacientes: cita.pacientes_ids.map((id) => ({
      id_paciente: id,
      nombre: `Paciente ${id}`,
    })),
  };

  citasStorage.push(nuevaCita);
  return nuevaCita;
};

// Obtener una cita por ID
export const obtenerCita = async (id: number): Promise<Cita> => {
  await delay(300);

  const cita = citasStorage.find((c) => c.id_cita === id);
  if (!cita) {
    throw new Error("Cita no encontrada");
  }

  return cita;
};

// Obtener todas las citas
export const obtenerTodasLasCitas = async (): Promise<Cita[]> => {
  await delay(300);
  return [...citasStorage];
};

// Obtener citas con paginación
export const obtenerCitasPaginadas = async (
  page: number = 1,
  limit: number = 50,
  search?: string,
  estado?: string
): Promise<CitasPaginadasResponse> => {
  await delay(400);

  let citas = [...citasStorage];

  if (search) {
    citas = citas.filter(
      (c) =>
        c.tutor_nombre?.toLowerCase().includes(search.toLowerCase()) ||
        c.tutor_apellido_paterno
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        c.rut_tutor.includes(search)
    );
  }

  if (estado) {
    citas = citas.filter((c) => c.estado === estado);
  }

  const total_count = citas.length;
  const total_pages = Math.ceil(total_count / limit);
  const start = (page - 1) * limit;
  const end = start + limit;
  const citasPaginadas = citas.slice(start, end);

  return {
    citas: citasPaginadas,
    pagination: {
      current_page: page,
      total_pages,
      total_count,
      limit,
      has_next: page < total_pages,
      has_previous: page > 1,
      next_page: page < total_pages ? page + 1 : null,
      previous_page: page > 1 ? page - 1 : null,
    },
  };
};

// Obtener citas por fecha específica
export const obtenerCitasPorFecha = async (
  fecha: string
): Promise<CitasPorFechaResponse> => {
  await delay(300);

  const fechaBusqueda = fecha.split("T")[0];
  const citas = citasStorage.filter((c) => {
    const fechaCita = c.fecha_hora.split("T")[0];
    return fechaCita === fechaBusqueda;
  });

  return {
    citas,
    count: citas.length,
  };
};

// Obtener citas en un rango de fechas
export const obtenerCitasPorRango = async (
  fecha_inicio: string,
  fecha_fin: string
): Promise<CitasPorFechaResponse> => {
  await delay(400);

  const inicio = new Date(fecha_inicio);
  const fin = new Date(fecha_fin);

  const citas = citasStorage.filter((c) => {
    const fechaCita = new Date(c.fecha_hora);
    return fechaCita >= inicio && fechaCita <= fin;
  });

  return {
    citas,
    count: citas.length,
  };
};

// Obtener citas de un tutor
export const obtenerCitasPorTutor = async (
  rut: string
): Promise<CitasPorFechaResponse> => {
  await delay(300);

  const citas = citasStorage.filter((c) => c.rut_tutor === rut);

  return {
    citas,
    count: citas.length,
  };
};

// Obtener citas de un paciente
export const obtenerCitasPorPaciente = async (
  id: number
): Promise<CitasPorFechaResponse> => {
  await delay(300);

  const citas = citasStorage.filter((c) =>
    c.pacientes.some((p) => p.id_paciente === id)
  );

  return {
    citas,
    count: citas.length,
  };
};

// Editar una cita
export const editarCita = async (
  id: number,
  cita: CitaUpdate
): Promise<Cita> => {
  await delay(500);

  const index = citasStorage.findIndex((c) => c.id_cita === id);
  if (index === -1) {
    throw new Error("Cita no encontrada");
  }

  const citaActual = citasStorage[index];
  const citaActualizada: Cita = {
    ...citaActual,
    fecha_hora: cita.fecha_hora ?? citaActual.fecha_hora,
    motivo: cita.motivo ?? citaActual.motivo,
    notas: cita.notas !== undefined ? cita.notas : citaActual.notas,
    estado: cita.estado ?? citaActual.estado,
    pacientes: cita.pacientes_ids
      ? cita.pacientes_ids.map((pid) => ({
          id_paciente: pid,
          nombre: `Paciente ${pid}`,
        }))
      : citaActual.pacientes,
  };

  citasStorage[index] = citaActualizada;
  return citaActualizada;
};

// Eliminar/cancelar una cita
export const eliminarCita = async (id: number): Promise<void> => {
  await delay(300);

  const index = citasStorage.findIndex((c) => c.id_cita === id);
  if (index === -1) {
    throw new Error("Cita no encontrada");
  }

  citasStorage.splice(index, 1);
};
