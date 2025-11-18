// Utilidades de validación para formularios
// Validación de RUT chileno (formato)
export const validarFormatoRut = (rut: string): boolean => {
  if (!rut || rut.trim() === "") return false;

  // Eliminar puntos y guión
  const rutLimpio = rut.replace(/\./g, "").replace(/-/g, "");

  // Debe tener entre 8 y 9 caracteres (7-8 dígitos + verificador)
  if (rutLimpio.length < 8 || rutLimpio.length > 9) return false;

  // El último carácter debe ser un dígito o K
  const verificador = rutLimpio.slice(-1).toUpperCase();
  if (!/^[0-9K]$/.test(verificador)) return false;

  // Los caracteres anteriores deben ser dígitos
  const cuerpo = rutLimpio.slice(0, -1);
  if (!/^\d+$/.test(cuerpo)) return false;

  return true;
};

// Validación de email
export const validarEmail = (email: string): boolean => {
  if (!email || email.trim() === "") return false;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

// Validación de teléfono (debe tener al menos 8 dígitos)
export const validarTelefono = (telefono: string): boolean => {
  if (!telefono || telefono.trim() === "") return false;

  // Eliminar espacios y caracteres no numéricos
  const telefonoLimpio = telefono.replace(/\D/g, "");

  // Debe tener al menos 8 dígitos (considerando teléfonos chilenos)
  return telefonoLimpio.length >= 8;
};

// Validación de campo obligatorio
export const validarCampoObligatorio = (valor: string): boolean => {
  return valor !== null && valor !== undefined && valor.trim() !== "";
};

// Validación de nombre (solo letras, espacios y algunos caracteres especiales)
export const validarNombre = (nombre: string): boolean => {
  if (!validarCampoObligatorio(nombre)) return false;

  // Permite letras (incluidas con tildes), espacios, guiones y apóstrofes
  const nombreRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'-]+$/;
  return nombreRegex.test(nombre.trim()) && nombre.trim().length >= 2;
};

// Mensajes de error
export const mensajesError = {
  rutInvalido: "El RUT ingresado no tiene un formato válido",
  rutRequerido: "El RUT es obligatorio",
  nombreRequerido: "El nombre es obligatorio",
  nombreInvalido: "El nombre solo puede contener letras",
  apellidoRequerido: "El apellido es obligatorio",
  apellidoInvalido: "El apellido solo puede contener letras",
  direccionRequerida: "La dirección es obligatoria",
  telefonoRequerido: "El teléfono es obligatorio",
  telefonoInvalido: "El teléfono debe tener al menos 8 dígitos",
  emailRequerido: "El email es obligatorio",
  emailInvalido: "El email no tiene un formato válido",
  regionRequerida: "La región es obligatoria",
  comunaRequerida: "La comuna es obligatoria",
};
