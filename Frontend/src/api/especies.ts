// src/api/especies.ts

const API_URL = import.meta.env.VITE_API_URL; // usa tu variable de entorno

export async function obtenerEspecies() {
  try {
    console.log("Obteniendo especies...");
    const response = await fetch(`${API_URL}/especies/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error al obtener especies: ${response.status}`);
    }

    const data = await response.json();
    console.log("Especies obtenidas:", data);
    return data;
  } catch (error) {
    console.error("Error obteniendo especies:", error);
    throw error;
  }
}

export async function obtenerRazas(especieId: string) {
  try {
    console.log(`Obteniendo razas para la especie ID: ${especieId}...`);
    const response = await fetch(`${API_URL}/razas/especie/${especieId}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error al obtener razas: ${response.status}`);
    }

    const data = await response.json();
    console.log(`Razas obtenidas para la especie ID ${especieId}:`, data);
    return data;
  } catch (error) {
    console.error("Error obteniendo razas:", error);
    throw error;
  }
}
