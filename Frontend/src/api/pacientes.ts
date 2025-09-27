const API_URL = import.meta.env.VITE_API_URL;

export interface PacienteData {
  nombre: string;
  id_raza: number;
  sexo: string;
  color: string;
  fecha_nacimiento: string;
  codigo_chip?: string;
}

export interface Paciente {
  id_paciente: number;
  nombre: string;
  id_raza: number;
  sexo: string;
  color: string;
  fecha_nacimiento: string;
  codigo_chip?: string;
  fecha_registro: string;
}

export async function registrarPaciente(pacienteData: PacienteData) {
  try {
    console.log("Registrando paciente...", pacienteData);
    const response = await fetch(`${API_URL}/pacientes/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pacienteData),
    });

    if (!response.ok) {
      throw new Error(`Error al registrar paciente: ${response.status}`);
    }

    const data = await response.json();
    console.log("Paciente registrado:", data);
    return data;
  } catch (error) {
    console.error("Error registrando paciente:", error);
    throw error;
  }
}

export async function obtenerPacientes() {
  try {
    console.log("Obteniendo pacientes...");
    const response = await fetch(`${API_URL}/pacientes/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error al obtener pacientes: ${response.status}`);
    }

    const data = await response.json();
    console.log("Pacientes obtenidos:", data);
    return data;
  } catch (error) {
    console.error("Error obteniendo pacientes:", error);
    throw error;
  }
}
