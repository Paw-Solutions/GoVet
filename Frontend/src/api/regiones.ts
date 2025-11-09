// src/api/regiones.ts

const API_URL = import.meta.env.VITE_API_URL || '/api'; // usa tu variable de entorno

export async function obtenerRegiones() {
  try {
    console.log("Obteniendo regiones del servidor...");
    const response = await fetch(`https://postal-code-api.kainext.cl/v1/regions/with-communes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error al obtener regiones: ${response.status}`);
    }

    const data = await response.json();
    console.log("Regiones obtenidas:", data);
    return data;
  } catch (error) {
    console.error("Error obteniendo regiones:", error);
    throw error;
  }
}