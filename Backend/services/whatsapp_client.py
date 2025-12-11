"""
Cliente HTTP asíncrono para comunicarse con el microservicio whatsapp-ms.
- Centraliza la URL base, timeouts y manejo de errores.
- Se usa desde el router público del backend.
"""

import os
from typing import Any, Dict, Optional

import httpx
from fastapi import HTTPException, status

# URL base del microservicio; configurable por env.
WHATSAPP_MS_BASE_URL = os.getenv("WHATSAPP_MS_BASE_URL", "http://whatsapp-ms:3000")

# Timeouts razonables: 3s connect, 5s total
DEFAULT_TIMEOUT = httpx.Timeout(timeout=5.0, connect=3.0)


async def get_qr() -> Dict[str, Any]:
    """
    GET /qr -> { "qr": string|null }
    """
    url = f"{WHATSAPP_MS_BASE_URL}/qr"
    try:
        async with httpx.AsyncClient(timeout=DEFAULT_TIMEOUT) as client:
            resp = await client.get(url)
    except httpx.RequestError as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"WhatsApp service unavailable: {str(e)}",
        )
    return _parse_json_or_raise(resp)


async def get_status() -> Dict[str, Any]:
    """
    GET /status -> { "conectado": bool }
    """
    url = f"{WHATSAPP_MS_BASE_URL}/status"
    try:
        async with httpx.AsyncClient(timeout=DEFAULT_TIMEOUT) as client:
            resp = await client.get(url)
    except httpx.RequestError as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"WhatsApp service unavailable: {str(e)}",
        )
    return _parse_json_or_raise(resp)


async def notificar(
    numero: str, nombre: str, paciente: str, fecha: str, hora: Optional[str]
) -> Dict[str, Any]:
    """
    GET /notificar con query params; reenvía la solicitud de notificación.
    """
    url = f"{WHATSAPP_MS_BASE_URL}/notificar"
    params = {
        "numero": numero,
        "nombre": nombre,
        "paciente": paciente,
        "fecha": fecha,
    }
    if hora is not None:
        params["hora"] = hora

    try:
        async with httpx.AsyncClient(timeout=DEFAULT_TIMEOUT) as client:
            resp = await client.get(url, params=params)
    except httpx.RequestError as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"WhatsApp service unavailable: {str(e)}",
        )
    return _parse_json_or_raise(resp)


# --- Nuevas acciones de control de sesión ---


async def cerrar_sesion() -> Dict[str, Any]:
    """
    POST /cerrar-sesion -> desconecta el socket sin borrar credenciales.
    Respuesta esperada: { ok: bool, mensaje: string }
    """
    url = f"{WHATSAPP_MS_BASE_URL}/cerrar-sesion"
    try:
        async with httpx.AsyncClient(timeout=DEFAULT_TIMEOUT) as client:
            resp = await client.post(url)
    except httpx.RequestError as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"WhatsApp service unavailable: {str(e)}",
        )
    return _parse_json_or_raise(resp)


async def desvincular() -> Dict[str, Any]:
    """
    POST /desvincular -> logout + borra credenciales locales.
    Respuesta esperada: { ok: bool, mensaje: string }
    """
    url = f"{WHATSAPP_MS_BASE_URL}/desvincular"
    try:
        async with httpx.AsyncClient(timeout=DEFAULT_TIMEOUT) as client:
            resp = await client.post(url)
    except httpx.RequestError as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"WhatsApp service unavailable: {str(e)}",
        )
    return _parse_json_or_raise(resp)


async def iniciar() -> Dict[str, Any]:
    """
    POST /iniciar -> inicia/reconecta la sesión en el microservicio.
    Respuesta esperada: { ok: bool, mensaje: string }
    """
    url = f"{WHATSAPP_MS_BASE_URL}/iniciar"
    try:
        async with httpx.AsyncClient(timeout=DEFAULT_TIMEOUT) as client:
            resp = await client.post(url)
    except httpx.RequestError as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"WhatsApp service unavailable: {str(e)}",
        )
    return _parse_json_or_raise(resp)


def _parse_json_or_raise(resp: httpx.Response) -> Dict[str, Any]:
    """
    Propaga errores 4xx/5xx del microservicio y valida que la respuesta sea JSON.
    """
    if resp.status_code >= 400:
        try:
            data = resp.json()
            detail = data.get("error") or data
        except Exception:
            detail = resp.text
        raise HTTPException(status_code=resp.status_code, detail=detail)

    try:
        return resp.json()
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Invalid response from WhatsApp service (non-JSON).",
        )