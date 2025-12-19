// src/api/regiones.ts
// Componente: Gestor de fichas clinicas
const API_URL = import.meta.env.VITE_API_URL || "/api"; // usa tu variable de entorno

export async function obtenerRegiones() {
  try {
    //console.log("Obteniendo regiones desde el backend...");
    const response = await fetch(`${API_URL}/regiones/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error al obtener regiones: ${response.status}`);
    }

    const data = await response.json();
    //console.log("Regiones obtenidas desde backend:", data);
    return data;
  } catch (error) {
    console.error("Error obteniendo regiones:", error);
    throw error;
  }
}
