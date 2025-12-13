import makeWASocket, { useMultiFileAuthState } from "@whiskeysockets/baileys";
import qrcode from "qrcode-terminal";
import fs from "fs";
import path from "path";

export let ultimoQR = null;
let socketGlobal = null; // guardamos la conexión para otras rutas

// Controla si debemos reconectar automáticamente cuando la conexión se cierra.
// Se desactiva temporalmente cuando cerramos sesión manualmente o desvinculamos.
let shouldAutoReconnect = true;

// Bandera adicional para bloquear reconexiones después de desvinculación explícita
// Solo se resetea cuando se llama manualmente a iniciarWhatsapp() desde /iniciar
let isDeliberateDisconnect = false;

export async function iniciarWhatsapp() {
  // Resetear las banderas de desconexión
  isDeliberateDisconnect = false;
  shouldAutoReconnect = true;

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
      console.log("QR code generated");
    }

    if (connection === "open") {
      ultimoQR = null;

      // Solo permitir reconexión si NO fue una desvinculación deliberada
      if (!isDeliberateDisconnect) {
        shouldAutoReconnect = true;
        console.log("WhatsApp connected successfully");
      } else {
        // Cerrar inmediatamente esta conexión no deseada
        if (sock.ws && sock.ws.close) {
          sock.ws.close();
        }
      }
    }

    if (connection === "close") {
      // Solo reconectar automáticamente si no fue un cierre manual (cerrarSesion/desvincular)
      if (shouldAutoReconnect) {
        console.log("Connection closed, reconnecting...");
        iniciarWhatsapp();
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
  console.log("Starting WhatsApp unlinking process");
  shouldAutoReconnect = false;
  isDeliberateDisconnect = true; // BLOQUEO TOTAL de reconexiones

  // 1) Intentar logout para desvincular el dispositivo a nivel servidor
  if (socketGlobal) {
    try {
      if (socketGlobal.logout) {
        await socketGlobal.logout();
      }
    } catch (e) {
      // Si falla logout, igualmente continuamos con limpieza local
      console.error("Error during logout:", e);
    }

    // 2) Cerrar la conexión si sigue activa
    try {
      if (socketGlobal.ws && socketGlobal.ws.close) {
        socketGlobal.ws.close();
      } else if (socketGlobal.end) {
        await socketGlobal.end();
      }
    } catch (e) {
      console.error("Error closing socket:", e);
    }
  }

  // 3) Esperar a que se liberen los file handles
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // 4) Borrar la carpeta ./auth_info con reintentos
  const authDir = path.resolve("./auth_info");

  let deleteAttempts = 0;
  let deleted = false;

  while (deleteAttempts < 5 && !deleted) {
    deleteAttempts++;

    try {
      if (fs.existsSync(authDir)) {
        // Primero intentar borrar archivos individuales
        const files = fs.readdirSync(authDir);

        for (const file of files) {
          const filePath = path.join(authDir, file);
          try {
            fs.unlinkSync(filePath);
          } catch (e) {
            console.warn(`Could not delete file ${file}:`, e.code);
          }
        }

        // Luego borrar la carpeta
        fs.rmdirSync(authDir);
        deleted = true;
      } else {
        deleted = true;
      }
    } catch (e) {
      console.error(`Deletion attempt ${deleteAttempts} failed:`, e.code);

      if (deleteAttempts < 5) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  }

  if (!deleted) {
    console.error(
      "CRITICAL: Could not delete ./auth_info after 5 attempts - credentials not removed"
    );
  } else {
    console.log("WhatsApp unlinked successfully - credentials removed");
  }

  // 5) Limpiar referencias locales
  socketGlobal = null;
  ultimoQR = null;
}

export function getSocket() {
  return socketGlobal;
}
