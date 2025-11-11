export interface CalendarEvent {
  id: string; // ID único del evento
  summary: string; // Título del evento
  location?: string; // Dirección o lugar
  description?: string; // Descripción del evento
  start: { dateTime: string; timeZone: string };
  end: { dateTime: string; timeZone: string };
  attendees?: Attendee[]; // Lista de asistentes
}

export interface CalendarEventCreate {
  summary: string; // Título del evento
  location?: string; // Dirección o lugar
  description?: string; // Descripción del evento
  start: string; // ✅ String ISO 8601
  end: string;
  attendees?: Attendee[]; // Lista de asistentes
}

export interface Attendee {
  email: string; // Correo del asistente
}

const API_URL = import.meta.env.VITE_API_URL || "/api";

// Eventos del día
export async function getEventsDay(date: string): Promise<CalendarEvent[]> {
  const response = await fetch(`${API_URL}/events/day?date=${date}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error("Error al obtener eventos del día");
  }
  console.log("Get day events response:", response);

  const data = await response.json();
  return data.events;
}

// Eventos de la semana
export async function getEventsWeek(
  startDate: string,
  endDate: string
): Promise<CalendarEvent[]> {
  const response = await fetch(
    `${API_URL}/events/week?start_date=${startDate}&end_date=${endDate}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );

  if (!response.ok) {
    throw new Error("Error al obtener eventos de la semana");
  }
  console.log("Get week events response:", response);
  const data = await response.json();
  return data.events;
}

// Eventos del mes
export async function getEventsMonth(
  year: number,
  month: number
): Promise<CalendarEvent[]> {
  const response = await fetch(
    `${API_URL}/events/month?year=${year}&month=${month}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );
  console.log("Get month events response:", response);
  if (!response.ok) {
    throw new Error("Error al obtener eventos del mes");
  }

  const data = await response.json();
  return data.events;
}

export async function deteleEvent(eventId: string): Promise<void> {
  const response = await fetch(`${API_URL}/events/${eventId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  console.log("Delete response:", response);

  if (!response.ok) {
    throw new Error("Error al eliminar evento");
  }
}

// Crear evento
export async function createEvent(
  event: CalendarEventCreate
): Promise<CalendarEvent> {
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
