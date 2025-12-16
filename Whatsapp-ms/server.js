import express from "express";
import cors from "cors";
import {
  iniciarWhatsapp,
  ultimoQR,
  getSocket,
  cerrarSesion,
  desvincular,
} from "./whatsapp.js";

const app = express();
app.use(cors());
app.use(express.json());

// ---- QR ----
// Para enviar el qr a la parte principal
app.get("/qr", async (req, res) => {
  // Si no hay socket activo, intentar iniciar (auto-recovery después de desvinculación)
  const sock = getSocket();
  if (!sock) {
    try {
      await iniciarWhatsapp();
      // Esperar un poco para que se genere el QR
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (e) {
      console.error("Error initializing WhatsApp:", e);
    }
  }

  res.json({ qr: ultimoQR });
});

// ---- Estado ----
// Para ver si esta actualmente el servicio ejecutandose
app.get("/status", (req, res) => {
  const sock = getSocket();
  if (!sock) return res.json({ conectado: false });

  res.json({ conectado: !!sock.user });
});

// ---- Enviar notificación ----
// Para poder enviar la notificacion
// Utiliza los parametros:
// - numero: numero de celular destinatario del mensaje (tiene que tener el 569 al principio)
// - nombre: nombre del tutor al cual va ser enviado la notificacion
// - paciente: nombre del paciente del tutor de la hora agendada
// - fecha: fecha de la consulta
// - hora: hora de la consulta
// ------- Ejemplo de Ejecucion ---------
// http://localhost:6007/notificar?numero=${numero}&nombre=${nombre}&paciente=${paciente}&fecha=${fecha}
app.get("/notificar", async (req, res) => {
  const { numero, nombre, paciente, fecha, hora } = req.query;

  if (!numero) return res.status(400).json({ error: "Falta número" });

  const mensaje = `*🐾 Confirmación de Cita - GoVet*

Hola *${nombre}*,

Tu cita ha sido agendada exitosamente con los siguientes detalles:

━━━━━━━━━━━━━━━━━━━
📅 *Fecha:* ${fecha}
🕐 *Horario:* ${hora}
🐾 *Paciente(s):* ${paciente}
━━━━━━━━━━━━━━━━━━━

Si necesitas cancelar o reprogramar, por favor contáctanos con anticipación.

_Este es un mensaje automático._`;

  const sock = getSocket();
  if (!sock) return res.status(500).json({ error: "No conectado a WhatsApp" });

  try {
    const jid = numero + "@s.whatsapp.net";
    await sock.sendMessage(jid, { text: mensaje });
    res.json({ ok: true, mensaje: "Enviado correctamente" });
  } catch (e) {
    res.status(500).json({ error: "No se pudo enviar" });
  }
});

// ---- Control de sesión ----
// Cerrar sesión: desconectar el socket sin borrar credenciales
app.post("/cerrar-sesion", async (req, res) => {
  try {
    await cerrarSesion();
    res.json({
      ok: true,
      mensaje:
        "Sesión cerrada (socket desconectado). Puedes reconectar con /iniciar.",
    });
  } catch (e) {
    res.status(500).json({ ok: false, error: "Error al cerrar sesión" });
  }
});

// Desvincular: logout y borrar credenciales locales
app.post("/desvincular", async (req, res) => {
  try {
    await desvincular();
    res.json({
      ok: true,
      mensaje:
        "Desvinculación completa. Se requerirá escanear un nuevo QR al iniciar.",
    });
  } catch (e) {
    console.error("Error unlinking WhatsApp:", e);
    res.status(500).json({ ok: false, error: "Error al desvincular" });
  }
});

// Iniciar / Reconectar manualmente
app.post("/iniciar", async (req, res) => {
  console.log("[Microservicio Debug] POST /iniciar recibido");
  try {
    console.log("[Microservicio Debug] Llamando a iniciarWhatsapp()...");
    await iniciarWhatsapp();
    console.log("[Microservicio Debug] iniciarWhatsapp() completado");
    res.json({ ok: true, mensaje: "Inicio/reconexión solicitada." });
  } catch (e) {
    console.error("[Microservicio Debug] ERROR en iniciarWhatsapp():", e);
    res.status(500).json({ ok: false, error: "Error al iniciar/reconectar" });
  }
});

// ---- Inicio ----
// Para ver si esta funcionando
app.get("/", (req, res) => res.send("Backend WhatsApp activo"));

app.listen(6007, () => {
  console.log("Backend corriendo en puerto 6007");
  iniciarWhatsapp();
});
