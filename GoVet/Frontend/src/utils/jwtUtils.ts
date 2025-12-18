/**
 * Utilidades para decodificar y validar JWT tokens
 */

interface JWTPayload {
  email?: string;
  sub?: string;
  exp?: number;
  iss?: string;
  aud?: string;
  [key: string]: any;
}

/**
 * Decodifica un JWT sin verificar la firma
 * Solo para extraer información del payload en el cliente
 */
export const decodeJWT = (token: string): JWTPayload | null => {
  try {
    // El JWT tiene formato: header.payload.signature
    const parts = token.split(".");
    if (parts.length !== 3) {
      console.error("Token JWT inválido: formato incorrecto");
      return null;
    }

    // Decodificar el payload (segunda parte)
    const payload = parts[1];

    // Agregar padding si es necesario para base64
    const paddedPayload = payload + "=".repeat((4 - (payload.length % 4)) % 4);

    // Decodificar de base64
    const decodedPayload = atob(
      paddedPayload.replace(/-/g, "+").replace(/_/g, "/")
    );

    // Parsear JSON
    return JSON.parse(decodedPayload) as JWTPayload;
  } catch (error) {
    console.error("Error decodificando JWT:", error);
    return null;
  }
};

/**
 * Verifica si el token ha expirado
 */
export const isTokenExpired = (token: string): boolean => {
  const payload = decodeJWT(token);
  if (!payload || !payload.exp) {
    return true;
  }

  // exp está en segundos, Date.now() en milisegundos
  const expirationTime = payload.exp * 1000;
  const currentTime = Date.now();

  return currentTime >= expirationTime;
};

/**
 * Extrae el email del token JWT
 */
export const extractEmailFromToken = (token: string): string | null => {
  const payload = decodeJWT(token);
  return payload?.email || null;
};

/**
 * Valida si un email está en la lista de emails permitidos
 */
export const isEmailAllowed = (email: string): boolean => {
  // Lista de emails permitidos desde el .env
  const allowedEmails = import.meta.env.VITE_ALLOWED_EMAILS || "";

  if (!allowedEmails) {
    console.warn("VITE_ALLOWED_EMAILS no está configurado");
    return false;
  }

  const emailList = allowedEmails
    .split(",")
    .map((e: string) => e.trim().toLowerCase())
    .filter((e: string) => e.length > 0);

  return emailList.includes(email.toLowerCase());
};

/**
 * Valida un token JWT completo:
 * - Verifica que no esté expirado
 * - Extrae el email
 * - Valida que el email esté autorizado
 */
export const validateToken = (
  token: string
): { valid: boolean; email?: string; error?: string } => {
  // Verificar expiración
  if (isTokenExpired(token)) {
    return {
      valid: false,
      error: "El token ha expirado",
    };
  }

  // Extraer email
  const email = extractEmailFromToken(token);
  if (!email) {
    return {
      valid: false,
      error: "No se pudo extraer el email del token",
    };
  }

  // Validar email contra lista permitida
  if (!isEmailAllowed(email)) {
    return {
      valid: false,
      email,
      error: `El email ${email} no está autorizado para acceder al sistema`,
    };
  }

  return {
    valid: true,
    email,
  };
};
