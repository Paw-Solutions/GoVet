import makeWASocket, { useMultiFileAuthState } from "@whiskeysockets/baileys";
import qrcode from "qrcode-terminal";

export let ultimoQR = null;
let socketGlobal = null; // guardamos la conexión para otras rutas

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
      console.log("Conectado a WhatsApp");
    }

    if (connection === "close") {
      console.log("Conexión cerrada, reconectando...");
      iniciarWhatsapp();
    }
  });
}

export function getSocket() {
  return socketGlobal;
}
