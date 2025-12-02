const btn = document.getElementById("btn");
const QR_DIV = document.getElementById("qr-container");

// Actualizar QR
// Para pedir el qr
async function actualizarQR() {
    const res = await fetch("http://localhost:3000/qr");
    const data = await res.json();

    if (data.qr) {
        // Considera esto para la parte del qr, si no toy mal esto lo genera
        const url = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(data.qr)}`;
        QR_DIV.innerHTML = `<h3>Escanea este QR:</h3><img src="${url}">`;
    } else {
        QR_DIV.innerHTML = "<p>No hay QR disponible (¿Ya conectado?)</p>";
    }
}

// Actualizar estado
async function actualizarEstado() {
    const res = await fetch("http://localhost:3000/status");
    const data = await res.json();

    if (data.conectado) {
        btn.disabled = false;
        btn.textContent = "Enviar notificación";
    } else {
        btn.disabled = true;
        btn.textContent = "Esperando conexión...";
    }
}

// Enviar notificación de prueba
btn.addEventListener("click", async () => {
    const numero = "569XXXXXX"; //Modifiquen el numero para probarlo
    const nombre = "Tutor";
    const paciente = "Paciente XYZ";
    const fecha = "10/12/2025";
    const hora = "09:00"
    //Asi funciona notificar
    const url = `http://localhost:3000/notificar?numero=${numero}&nombre=${nombre}&paciente=${paciente}&fecha=${fecha}&hora=${hora}`;
    const res = await fetch(url);
    const data = await res.json();

    alert(JSON.stringify(data));
});

// Auto refrescar
setInterval(actualizarQR, 1500);
setInterval(actualizarEstado, 3000);

actualizarQR();
actualizarEstado();
