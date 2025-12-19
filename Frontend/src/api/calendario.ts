// Componente: Gestor de citas
import { fetchWithAuth } from "./http"; // Para proteger endpoints con Oauth

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
export async function getEventsDay(
  date: string, 
  idToken?: string | null 
): Promise<CalendarEvent[]> {
  const response = await fetchWithAuth(
    `${API_URL}/events/day?date=${date}`,
    { 
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }, 
    idToken
  );

  if (!response.ok) {
    throw new Error(`Error al obtener eventos del día ${response.status}`);
  }
  //console.log("Get day events response:", response);

  const data = await response.json();
  return data.events;
}

// Eventos de la semana
export async function getEventsWeek(
  startDate: string,
  endDate: string,
  idToken?: string | null 
): Promise<CalendarEvent[]> {
  const response = await fetchWithAuth(
    `${API_URL}/events/week?start_date=${startDate}&end_date=${endDate}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    },
    idToken
  );

  if (!response.ok) {
    throw new Error(`Error al obtener eventos de la semana ${response.status}`);
  }
  //console.log("Get week events response:", response);
  const data = await response.json();
  return data.events;
}

// Eventos del mes
export async function getEventsMonth(
  year: number,
  month: number,
  idToken?: string | null 
): Promise<CalendarEvent[]> {
  const response = await fetchWithAuth(
    `${API_URL}/events/month?year=${year}&month=${month}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    },
    idToken
  );
  //console.log("Get month events response:", response);
  if (!response.ok) {
    throw new Error(`Error al obtener eventos del mes ${response.status}`);
  }

  const data = await response.json();
  return data.events;
}

export async function deleteEvent(
  eventId: string,
 idToken?: string | null 
): Promise<void> {
  const response = await fetchWithAuth(
    `${API_URL}/events/${eventId}`, 
    {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    },
  idToken
  );
  //console.log("Delete response:", response);

  if (!response.ok) {
    throw new Error(`Error al eliminar evento ${response.status}`);
  }
}

// Crear evento
export async function createEvent(
  event: CalendarEventCreate,
  idToken?: string | null 
): Promise<CalendarEvent> {
  const response = await fetchWithAuth(
    `${API_URL}/events`, 
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event),
    },
    idToken
  );

  if (!response.ok) {
    throw new Error(`Error al crear evento ${response.status}`);
  }

  return await response.json();
}
