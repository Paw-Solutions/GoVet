// Helpers compartidos para notificaciones y formateo de fechas

import { PacienteData } from "../api/pacientes";
import { TutorData } from "../api/tutores";

/**
 * Valida si un email tiene un formato válido
 */
export const isValidEmail = (email: string | undefined | null): boolean => {
  if (!email) return false;

  // Verificar que no sea "NaN", vacío o solo espacios
  if (email === "NaN" || email.trim() === "") return false;

  // Validación básica de formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Calcula la fecha de envío de notificación según el tipo seleccionado
 */
export const calcularFechaNotificacion = (
  tipo: string,
  fechaHoraIso: string
): Date => {
  if (!fechaHoraIso) return new Date();
  const fecha = new Date(fechaHoraIso);

  if (tipo === "diaAnterior") {
    fecha.setDate(fecha.getDate() - 1);
    return fecha;
  }
  if (tipo === "semanaAntes") {
    fecha.setDate(fecha.getDate() - 7);
    return fecha;
  }
  if (tipo === "minutos") {
    fecha.setMinutes(fecha.getMinutes() - 145);
    // Si la fecha resultante está en el pasado, enviar ahora
    if (fecha < new Date()) return new Date();
    return fecha;
  }
  // 'ahora' o cualquier otro caso
  return new Date();
};

/**
 * Formatea una fecha y hora en formato legible en español
 * Ejemplo: "Lunes 15 de Enero, 2025 a las 09:00"
 */
export const formatearFechaHoraCompleta = (
  fecha: string,
  hora: string
): string => {
  // Combinar fecha y hora
  const [hours, minutes] = hora.split(":");
  const fechaObj = new Date(fecha);
  fechaObj.setHours(parseInt(hours), parseInt(minutes), 0, 0);

  const fechaFormateada = fechaObj.toLocaleDateString("es-CL", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const horaFormateada = fechaObj.toLocaleTimeString("es-CL", {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Capitalizar primera letra del día
  const fechaCapitalizada =
    fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1);

  return `${fechaCapitalizada} a las ${horaFormateada}`;
};

/**
 * Interface para representar un tratamiento genérico (vacuna o desparasitación)
 */
export interface TratamientoInfo {
  nombre: string;
  marca?: string;
  numero_de_serie?: string;
  dosis?: string;
}

/**
 * Construye el HTML del email de notificación para vacunas
 */
export const buildVacunaNotificationEmail = (
  tratamientos: TratamientoInfo[],
  paciente: PacienteData,
  tutor: TutorData,
  fechaHora: string,
  ubicacion: string,
  tipoTratamiento: "vacuna" | "desparasitacion" = "vacuna"
): string => {
  const fechaObj = new Date(fechaHora);
  const fechaFormateada = fechaObj.toLocaleDateString("es-CL", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const horaFormateada = fechaObj.toLocaleTimeString("es-CL", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const tipoTexto =
    tipoTratamiento === "vacuna" ? "Vacunación" : "Desparasitación";
  const tratamientoTexto =
    tipoTratamiento === "vacuna" ? "vacuna(s)" : "desparasitación";

  const listaTratamientos = tratamientos
    .map((t) => {
      let info = `<li><strong>${t.nombre}</strong>`;
      if (t.marca) info += ` - Marca: ${t.marca}`;
      if (t.numero_de_serie) info += ` - N° Serie: ${t.numero_de_serie}`;
      info += `</li>`;
      return info;
    })
    .join("");

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #dc8add 0%, #9141ac 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; }
        .info-box { background: #f6f8fc; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #dc8add; }
        .footer { background: #f6f8fc; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px; color: #666; }
        ul { list-style: none; padding-left: 0; }
        li { padding: 5px 0; }
        .highlight { color: #9141ac; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🐾 Recordatorio de ${tipoTexto}</h1>
          <p>GoVet - Sistema de Gestión Veterinaria</p>
        </div>
        <div class="content">
          <h2>Hola ${tutor.nombre} ${tutor.apellido_paterno},</h2>
          <p>Le recordamos que tiene una cita programada de <strong>${tratamientoTexto}</strong> para su mascota.</p>
          
          <div class="info-box">
            <h3>📋 Detalles de la Cita</h3>
            <p><strong>Paciente:</strong> ${paciente.nombre}</p>
            <p><strong>Fecha:</strong> ${fechaFormateada}</p>
            <p><strong>Hora:</strong> ${horaFormateada}</p>
            ${
              ubicacion ? `<p><strong>Ubicación:</strong> ${ubicacion}</p>` : ""
            }
          </div>

          <div class="info-box">
            <h3>💉 ${tipoTexto} a Aplicar</h3>
            <ul>
              ${listaTratamientos}
            </ul>
          </div>

          <p><strong>Importante:</strong> Por favor llegue 10 minutos antes de la hora programada.</p>
          <p>Si necesita reprogramar o cancelar la cita, póngase en contacto con nosotros lo antes posible.</p>
        </div>
        <div class="footer">
          <p>Este es un mensaje automático, por favor no responda a este correo.</p>
          <p>© 2025 GoVet - Sistema de Gestión Veterinaria</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
