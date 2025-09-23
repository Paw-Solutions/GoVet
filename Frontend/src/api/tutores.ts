// src/api/tutoresApi.ts

const API_URL = import.meta.env.VITE_API_URL; // usa tu variable de entorno

export interface TutorData {
  nombre: string;
  apellido_materno: string;
  apellido_paterno: string;
  rut: string;
  direccion: string;
  telefono: number;
  telefono2: number;
  comuna: string;
  region: string;
  celular: number;
  celular2: number;
  email: string;
}


export async function crearTutor(formData: TutorData) {
  try {
    console.log("Enviando datos al servidor:", formData);
    const response = await fetch(`${API_URL}/tutores`, {
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
    console.error("Error creando tutor:", error);
    throw error;
  }
}


export async function obtenerTutores() {
  try {
    console.log("Obteniendo tutores del servidor...");
    const response = await fetch(`${API_URL}/tutores`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error en la petición: ${response.status}`);
    }

    const data = await response.json();
    console.log("Tutores obtenidos:", data);
    return data;
  } catch (error) {
    console.error("Error obteniendo tutores:", error);
    throw error;
  }
}