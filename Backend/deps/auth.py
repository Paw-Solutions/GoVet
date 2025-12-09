from fastapi import Header, HTTPException, status
import os

ADMIN_KEY = os.getenv("WHATSAPP_ADMIN_KEY")

async def require_admin_key(x_admin_key: str = Header(None)):
    """
    Valida una API Key enviada en el header X-Admin-Key.
    Solo se usa para endpoints sensibles (ej: /whatsapp/qr).
    """
    if ADMIN_KEY is None:
        # Si no está configurado, se permite temporalmente (útil en dev)
        return
    if x_admin_key != ADMIN_KEY:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing admin key"
        )