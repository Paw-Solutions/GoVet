import os
import time
import json
import base64
import logging
from typing import Optional, Dict, Any, List

import requests
from fastapi import HTTPException, Depends, Header
from jose import jwt
from jose.exceptions import ExpiredSignatureError, JWTClaimsError, JWTError

# Variables de entorno requeridas
OIDC_ISSUER = os.getenv("OIDC_ISSUER", "").strip()
OIDC_AUDIENCE = os.getenv("OIDC_AUDIENCE", "").strip()  # opcional según proveedor
OIDC_JWKS_URL = os.getenv("OIDC_JWKS_URL", "").strip()
ALLOWED_EMAILS = [e.strip() for e in os.getenv("ALLOWED_EMAILS", "").split(",") if e.strip()]
ALLOWED_SUBS = [s.strip() for s in os.getenv("ALLOWED_SUBS", "").split(",") if s.strip()]

if not OIDC_ISSUER or not OIDC_JWKS_URL:
    logging.warning("OIDC_ISSUER y OIDC_JWKS_URL deben estar configurados en entorno.")

# Cache simple de JWKS
_JWKS_CACHE: Dict[str, Any] = {}
_JWKS_CACHE_EXP = 0
_JWKS_TTL_SECONDS = 3600  # 1 hora

def _get_jwks() -> Dict[str, Any]:
    global _JWKS_CACHE, _JWKS_CACHE_EXP
    now = time.time()
    if _JWKS_CACHE and _JWKS_CACHE_EXP > now:
        return _JWKS_CACHE
    try:
        resp = requests.get(OIDC_JWKS_URL, timeout=5)
        resp.raise_for_status()
        _JWKS_CACHE = resp.json()
        _JWKS_CACHE_EXP = now + _JWKS_TTL_SECONDS
        return _JWKS_CACHE
    except Exception as e:
        logging.exception("Error obteniendo JWKS: %s", e)
        raise HTTPException(status_code=500, detail="No se pudo obtener JWKS del proveedor")

def _find_key(jwks: Dict[str, Any], kid: str) -> Optional[Dict[str, Any]]:
    for key in jwks.get("keys", []):
        if key.get("kid") == kid:
            return key
    return None

def _decode_header(token: str) -> Dict[str, Any]:
    try:
        header_b64 = token.split(".")[0]
        pad = "=" * (-len(header_b64) % 4)
        header_json = base64.urlsafe_b64decode(header_b64 + pad)
        return json.loads(header_json)
    except Exception:
        return {}

def validate_token(token: str) -> Dict[str, Any]:
    if not token:
        raise HTTPException(status_code=401, detail="Falta token")
    header = _decode_header(token)
    kid = header.get("kid")
    jwks = _get_jwks()
    key = _find_key(jwks, kid) if kid else None

    options = {
        "verify_signature": True,
        "verify_aud": bool(OIDC_AUDIENCE),
        "verify_exp": True,
        "verify_iss": True,
    }

    try:
        claims = jwt.decode(
            token,
            jwks,  # python-jose permite pasar JWKS; si se requiere una key, se puede seleccionar
            options=options,
            audience=OIDC_AUDIENCE if OIDC_AUDIENCE else None,
            issuer=OIDC_ISSUER,
        )
    except ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expirado")
    except JWTClaimsError as e:
        raise HTTPException(status_code=401, detail=f"Claims inválidos: {str(e)}")
    except JWTError as e:
        # Fallback: si el paquete requiere key específica, intentar con la pública encontrada
        if key:
            try:
                claims = jwt.decode(
                    token,
                    key,
                    options=options,
                    audience=OIDC_AUDIENCE if OIDC_AUDIENCE else None,
                    issuer=OIDC_ISSUER,
                )
            except Exception as e2:
                raise HTTPException(status_code=401, detail=f"Token inválido: {str(e2)}")
        else:
            raise HTTPException(status_code=401, detail=f"Token inválido: {str(e)}")

    # Lista blanca por email o sub
    email = claims.get("email")
    sub = claims.get("sub")
    email_ok = (email in ALLOWED_EMAILS) if ALLOWED_EMAILS else False
    sub_ok = (sub in ALLOWED_SUBS) if ALLOWED_SUBS else False

    if not (email_ok or sub_ok):
        raise HTTPException(status_code=403, detail="Usuario no autorizado")

    return claims

def get_current_user(authorization: Optional[str] = Header(None)) -> Dict[str, Any]:
    """
    Dependency para FastAPI: extrae y valida 'Authorization: Bearer <token>'
    """
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(status_code=401, detail="Authorization Bearer requerido")
    token = authorization.split(" ", 1)[1].strip()
    claims = validate_token(token)
    return claims