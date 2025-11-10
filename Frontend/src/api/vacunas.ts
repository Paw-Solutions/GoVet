// API para gestión de vacunas pendientes
// NOTA: Actualmente usa datos mock.
// Cuando se implemente el modelo de vacunas en el backend,
// reemplazar con llamadas reales a la API

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

// ============================================
// DATOS MOCK PARA DEMOSTRACIÓN
// ============================================
// Estos son datos de ejemplo. Cuando se implemente:
// - Crear tabla 'vacuna' en la base de datos
// - Crear modelo Vacuna en Backend/models.py
// - Crear endpoints en Backend/main.py
// - Reemplazar estas funciones con llamadas fetch reales

const vacunasMock: Vacuna[] = [
  {
    id_vacuna: 1,
    id_paciente: 1,
    nombre: "Vacuna Antirrábica",
    fecha_programada: "2025-11-15T10:00:00",
    estado: "pendiente",
    created_at: "2025-11-01T10:00:00",
  },
  {
    id_vacuna: 2,
    id_paciente: 1,
    nombre: "Vacuna Séxtuple",
    fecha_programada: "2025-11-20T14:00:00",
    estado: "pendiente",
    observaciones: "Refuerzo anual",
    created_at: "2025-11-01T10:00:00",
  },
  {
    id_vacuna: 3,
    id_paciente: 2,
    nombre: "Vacuna Antirrábica",
    fecha_programada: "2025-12-01T09:00:00",
    estado: "pendiente",
    created_at: "2025-11-05T15:00:00",
  },
];

let vacunasStorage = [...vacunasMock];

// Simular delay de red
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Obtiene las vacunas pendientes de un paciente específico
 * @param id_paciente - ID del paciente
 * @returns Promise con las vacunas pendientes
 */
export const obtenerVacunasPendientesPorPaciente = async (
  id_paciente: number
): Promise<VacunaPendienteResponse> => {
  await delay(250);

  const ahora = new Date();
  const vacunas = vacunasStorage.filter((v) => {
    const esPaciente = v.id_paciente === id_paciente;
    const esPendiente = v.estado === "pendiente";
    const esFutura = new Date(v.fecha_programada) >= ahora;
    return esPaciente && esPendiente && esFutura;
  });

  // Ordenar por fecha más cercana primero
  vacunas.sort(
    (a, b) =>
      new Date(a.fecha_programada).getTime() -
      new Date(b.fecha_programada).getTime()
  );

  return {
    vacunas,
    count: vacunas.length,
  };
};

/**
 * Obtiene todas las vacunas de un paciente (pendientes y aplicadas)
 * @param id_paciente - ID del paciente
 * @returns Promise con todas las vacunas
 */
export const obtenerVacunasPorPaciente = async (
  id_paciente: number
): Promise<VacunaPendienteResponse> => {
  await delay(250);

  const vacunas = vacunasStorage.filter((v) => v.id_paciente === id_paciente);

  // Ordenar por fecha más reciente primero
  vacunas.sort(
    (a, b) =>
      new Date(b.fecha_programada).getTime() -
      new Date(a.fecha_programada).getTime()
  );

  return {
    vacunas,
    count: vacunas.length,
  };
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
  lote?: string
): Promise<Vacuna> => {
  await delay(300);

  const index = vacunasStorage.findIndex((v) => v.id_vacuna === id_vacuna);
  if (index === -1) {
    throw new Error("Vacuna no encontrada");
  }

  vacunasStorage[index] = {
    ...vacunasStorage[index],
    estado: "aplicada",
    fecha_aplicada,
    lote: lote || vacunasStorage[index].lote,
  };

  return vacunasStorage[index];
};
