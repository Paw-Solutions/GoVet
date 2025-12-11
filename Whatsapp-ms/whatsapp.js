import makeWASocket, { useMultiFileAuthState } from "@whiskeysockets/baileys";
import qrcode from "qrcode-terminal";
import fs from "fs";
import path from "path";

export let ultimoQR = null;
let socketGlobal = null; // guardamos la conexión para otras rutas

// Controla si debemos reconectar automáticamente cuando la conexión se cierra.
// Se desactiva temporalmente cuando cerramos sesión manualmente o desvinculamos.
let shouldAutoReconnect = true;

export async function iniciarWhatsapp() {
  //Crea el archivo para las credenciales y que no se pierdan de una
  const { state, saveCreds } = await useMultiFileAuthState("./auth_info");

  const sock = makeWASocket({ auth: state });
  socketGlobal = sock;

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", (update) => {
    const { qr, connection } = update;

    if (qr) {
      ultimoQR = qr;
      qrcode.generate(qr, { small: true });
    }

    if (connection === "open") {
      ultimoQR = null;
      shouldAutoReconnect = true; // si se abre correctamente, permitimos reconexión futura
      console.log("Conectado a WhatsApp");
    }

    if (connection === "close") {
      console.log("Conexión cerrada");
      // Solo reconectar automáticamente si no fue un cierre manual (cerrarSesion/desvincular)
      if (shouldAutoReconnect) {
        console.log("Reconectando...");
        iniciarWhatsapp();
      } else {
        console.log("Reconexión automática desactivada por cierre manual");
      }
    }
  });
}

// Cierra la sesión actual sin borrar credenciales.
// No invalida el dispositivo en WhatsApp; permite reconectar sin QR luego.
export async function cerrarSesion() {
  if (!socketGlobal) {
    return;
  }
  try {
    shouldAutoReconnect = false; // evitar que iniciarWhatsapp() se dispare automáticamente en 'close'
    // Cerrar el socket si existe conexión
    // Baileys expone métodos como logout() (para desvincular) y el socket subyacente para cerrar.
    // Aquí preferimos un cierre "suave" del websocket.
    if (socketGlobal.ws && socketGlobal.ws.close) {
      socketGlobal.ws.close();
    } else if (socketGlobal.end) {
      // Algunos builds de Baileys exponen end()
      await socketGlobal.end();
    }
  } catch (e) {
    // No lanzamos el error, solo registramos
    console.error("Error al cerrar sesión:", e);
  } finally {
    // No borramos credenciales; mantenemos el estado para reconectar luego.
    // Dejamos el socket global referenciado en caso de que quieras consultarlo,
    // pero ya estará en estado cerrado. Si prefieres nulificarlo, puedes hacerlo.
    // Aquí lo mantenemos.
  }
}

// Desvincula completamente: invalida el dispositivo en el servidor y borra credenciales locales.
// La próxima vez que se inicie, se requerirá nuevo QR y se recreará ./auth_info.
export async function desvincular() {
  shouldAutoReconnect = false; // no reconectar automáticamente durante desvinculación

  // 1) Intentar logout para desvincular el dispositivo a nivel servidor
  if (socketGlobal) {
    try {
      if (socketGlobal.logout) {
        await socketGlobal.logout();
      }
    } catch (e) {
      // Si falla logout, igualmente continuamos con limpieza local
      console.error("Error en logout (desvincular):", e);
    }

    // 2) Cerrar la conexión si sigue activa
    try {
      if (socketGlobal.ws && socketGlobal.ws.close) {
        socketGlobal.ws.close();
      } else if (socketGlobal.end) {
        await socketGlobal.end();
      }
    } catch (e) {
      console.error("Error al cerrar el socket tras logout:", e);
    }
  }

  // 3) Borrar la carpeta ./auth_info
  try {
    const authDir = path.resolve("./auth_info");
    if (fs.existsSync(authDir)) {
      // Eliminar recursivamente
      fs.rmSync(authDir, { recursive: true, force: true });
    }
  } catch (e) {
    console.error("Error al borrar ./auth_info:", e);
  }

  // 4) Limpiar referencias locales
  socketGlobal = null;
  ultimoQR = null;
  console.log("Desvinculación completa: credenciales borradas y dispositivo invalidado (si fue posible).");
}

export function getSocket() {
  return socketGlobal;
}