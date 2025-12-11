"""
Router público del backend para exponer:
- GET /whatsapp/qr
- GET /whatsapp/status
- GET /whatsapp/notificar
- POST /whatsapp/cerrar-sesion
- POST /whatsapp/desvincular
- POST /whatsapp/iniciar

Estas rutas son el "punto de entrada" único para clientes. Internamente
llaman al microservicio whatsapp-ms mediante el cliente httpx.
"""

from typing import Optional

from fastapi import APIRouter, HTTPException, Query, status, Depends

from services.whatsapp_client import (
    get_qr,
    get_status,
    notificar,
    cerrar_sesion,
    desvincular,
    iniciar,
)

from deps.auth import require_admin_key

router = APIRouter(
    prefix="/whatsapp",
    tags=["whatsapp"],
)


@router.get("/qr", dependencies=[Depends(require_admin_key)])
async def whatsapp_qr():
    """
    Devuelve el último QR disponible para emparejar la sesión de WhatsApp.
    Respuesta esperada: { "qr": string|null }
    """
    return await get_qr()


@router.get("/status")
async def whatsapp_status():
    """
    Indica si el microservicio está conectado a WhatsApp.
    Respuesta esperada: { "conectado": bool }
    """
    return await get_status()


@router.get("/notificar")
async def whatsapp_notificar(
    numero: str = Query(..., description="Número MSISDN con prefijo país, ej: 569XXXXXXXX"),
    nombre: str = Query(..., description="Nombre del tutor"),
    paciente: str = Query(..., description="Nombre del paciente"),
    fecha: str = Query(..., description="Fecha de la consulta"),
    hora: Optional[str] = Query(None, description="Hora de la consulta"),
):
    """
    Reenvía la solicitud de notificación al microservicio.
    Valida parámetros mínimos antes de llamar.
    """
    # Validaciones mínimas (ejemplo: Chile con '569' al inicio)
    if not numero.startswith("569") or len(numero) < 11:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="El número debe iniciar con 569 y tener longitud válida.",
        )

    return await notificar(numero=numero, nombre=nombre, paciente=paciente, fecha=fecha, hora=hora)


# --- Nuevas acciones de control de sesión ---


@router.post("/cerrar-sesion", dependencies=[Depends(require_admin_key)])
async def whatsapp_cerrar_sesion():
    """
    Cierra la sesión actual (desconecta el socket) sin borrar credenciales.
    Respuesta esperada: { ok: bool, mensaje: string }
    """
    return await cerrar_sesion()


@router.post("/desvincular", dependencies=[Depends(require_admin_key)])
async def whatsapp_desvincular():
    """
    Desvincula el dispositivo: realiza logout y borra credenciales locales.
    Respuesta esperada: { ok: bool, mensaje: string }
    """
    return await desvincular()


@router.post("/iniciar", dependencies=[Depends(require_admin_key)])
async def whatsapp_iniciar():
    """
    Inicia/reconecta la sesión con el microservicio (según estado).
    Respuesta esperada: { ok: bool, mensaje: string }
    """
    return await iniciar()