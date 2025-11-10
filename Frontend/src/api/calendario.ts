export interface CalendarEvent {
  summary: string;                     // Título del evento
  location?: string;                   // Dirección o lugar
  description?: string;                // Descripción del evento
  start: string;
  end: string;
  attendees?: Attendee[];              // Lista de asistentes
}

export interface Attendee {
  email: string;                       // Correo del asistente
}

export interface ReminderOverride {
  method: 'email' | 'popup' | string;  // Método de recordatorio
  minutes: number;                     // Minutos antes del evento
}

export interface Reminders {
  useDefault: boolean;                 // Si usa los recordatorios por defecto del calendario
  overrides?: ReminderOverride[];      // Lista de recordatorios personalizados
}


const API_URL = import.meta.env.VITE_API_URL;

export async function getEventsDay(day: string): Promise<CalendarEvent[]> {
  const response = await fetch(`${API_URL}/events/dia?day=${day}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  console.log("Obteniendo eventos..")
  if (!response.ok) {
    throw new Error("Error al obtener eventos");
  }
  const data = await response.json();
  console.log(data.events);
  return data.events;
}

export async function getEventsWeek(start_day: string): Promise<CalendarEvent[]> {
  const response = await fetch(`${API_URL}/events/semana?start_day=${start_day}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  console.log("Obteniendo eventos de la semana..")
  if (!response.ok) {
    throw new Error("Error al obtener eventos de la semana");
  }
  const data = await response.json();
  console.log(data.events);
  return data.events;
}

async function getEventsMonth(month: string): Promise<CalendarEvent[]> {
  const response = await fetch(`${API_URL}/events/mes?month=${month}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  console.log("Obteniendo eventos del mes..")
  if (!response.ok) {
    throw new Error("Error al obtener eventos del mes");
  }
  const data = await response.json();
  console.log(data.events);
  return data.events;
}

async function createEvent(event: CalendarEvent): Promise<CalendarEvent> {
  const response = await fetch(`${API_URL}/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(event),
  });
  console.log("Creando evento..")
  if (!response.ok) {
    throw new Error("Error creando el evento");
  }

  return await response.json();
}