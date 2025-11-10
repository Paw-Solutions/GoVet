export interface CalendarEvent {
  summary: string;                     // Título del evento
  location?: string;                   // Dirección o lugar
  description?: string;                // Descripción del evento
  start: { dateTime: string; timeZone: string };
  end: { dateTime: string; timeZone: string };
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


const API_URL = import.meta.env.VITE_API_URL || '/api';

// Eventos del día
export async function getEventsDay(date: string): Promise<CalendarEvent[]> {
  const response = await fetch(`${API_URL}/events/day?date=${date}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  
  if (!response.ok) {
    throw new Error("Error al obtener eventos del día");
  }
  
  const data = await response.json();
  return data.events;
}

// Eventos de la semana
export async function getEventsWeek(startDate: string): Promise<CalendarEvent[]> {
  const response = await fetch(`${API_URL}/events/week?start_date=${startDate}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  
  if (!response.ok) {
    throw new Error("Error al obtener eventos de la semana");
  }
  
  const data = await response.json();
  return data.events;
}

// Eventos del mes
export async function getEventsMonth(year: number, month: number): Promise<CalendarEvent[]> {
  const response = await fetch(`${API_URL}/events/month?year=${year}&month=${month}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  
  if (!response.ok) {
    throw new Error("Error al obtener eventos del mes");
  }
  
  const data = await response.json();
  return data.events;
}

// Crear evento
export async function createEvent(event: CalendarEvent): Promise<CalendarEvent> {
  const response = await fetch(`${API_URL}/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(event),
  });
  
  if (!response.ok) {
    throw new Error("Error al crear evento");
  }
  
  return await response.json();
}