# Manual DevOps – GoVet

Este manual describe cómo instalar, desplegar, operar y mantener GoVet en el servidor del curso, tal como se usa en el Sprint 1.

Estado actual de despliegue:
- Orquestación: Docker Compose
- Servicios: Frontend (Vite dev server), Backend (FastAPI), Base de datos (PostgreSQL)
- Acceso: govet.inf.uach.cl (por la configuración del servidor del curso)

--- 

## Contenido
1. [Arquitectura y servicios](#1-arquitectura-y-servicios)
2. [Requisitos](#2-requisitos)
3. [Variables de entorno (.env)](#3-variables-de-entorno-env)
4. [Primer despliegue (setup)](#4-primer-despliegue-setup)
5. [Despliegue/actualización (release)](#5-despliegue--actualización-release)
6. [Operación diaria (start/stop/restart)](#6-operación-diaria)
7. [Pruebas rápidas (health checks)](#7-pruebas-rápidas-health-checks-y-smoke)
8. [Logs y depuración](#8-logs-y-depuración)
9. [Base de datos (shell, backup, restore)](#9-base-de-datos)
10. [Versionado, releases y rollback](#10-versionado-releases-y-rollback)

---

## 1) Arquitectura y servicios

Componentes (Compose):
- db: PostgreSQL 15
  - Volumen de datos: db_data
  - Script de inicialización: Dbase/generador_schema.sql
- backend: FastAPI + Uvicorn (puerto 4007 interno)
- frontend: Vite (dev server) sirviendo la SPA y proxificando “/api” hacia backend para despliege de desarrollo. Nginx para despliegue de produccion

Red y puertos:
- Compose publica:
  - Frontend: 3007
  - Backend: 4007
  - DB: 5007→5432 
- En el servidor del curso, govet.inf.uach.cl apunta a la app 

---

## 2) Requisitos

- Docker y Docker Compose instalados en el servidor
- Acceso al repositorio
- Permisos para ejecutar docker compose y abrir puertos asignados

---

## 3) Variables de entorno (.env)

Archivo: .env en la raíz del repo. Variables clave:

| Variable         | Ejemplo                                             | Uso |
|------------------|-----------------------------------------------------|-----|
| DATABASE_URL     | postgresql://pawsolutions:garrita@db:5432/govet     | Cadena conexión backend→DB |
| POSTGRES_DB      | govet                                               | Nombre de base |
| POSTGRES_USER    | pawsolutions                                        | Usuario DB |
| POSTGRES_PASSWORD| garrita                                             | Password DB |
| BACKEND_PORT     | 4007                                                | Puerto backend (interno) |
| FRONTEND_PORT    | 3007                                                | Puerto frontend (interno) |
| ALLOWED_ORIGINS  | http://localhost:3007                               | CORS (actualmente permite “*”; ajustar en prod) |
| VITE_API_URL     | /api                                                | Base URL API en el frontend |

---

## 4) Primer despliegue (setup)

1) Clonar o actualizar el repositorio en el servidor:
```
git clone https://github.com/Paw-Solutions/GoVet.git
cd GoVet
```
* Si no se tienen credenciales de git configuradas usar git clone en maquina local y usar scp
```
scp -r /ruta/GoVet usuario@ip_servidor:~
```

2) Preparar .env:
- Copiar/ajustar el .env incluido con credenciales válidas para el servidor.
- Confirmar VITE_API_URL=/api.

3) Construir e iniciar:
```
Dev:  docker compose -f docker-compose.yml up --build
Prod: docker compose -f docker-compose.prod.yml up --build
```

4) Validar contenedores:
```
docker compose ps
```

---

## 5) Despliegue / actualización (release)

Cada vez que corten una versión/tag o hagan pull de cambios aprobados:

1) Obtener cambios:
```
git pull origin main
# o checkout del tag que van a presentar
# git fetch --tags && git checkout <version>
```

2) Recrear servicios:
```
dev:  docker compose -f docker-compose.yml up up --build -d
prod: docker compose -f docker-compose.prod.yml up up --build -d
```

3) Verificar:
- Navegar a govet.inf.uach.cl
- Revisar endpoints (ver sección 7)

---

## 6) Operación diaria

- Iniciar: `docker compose -f docker-compose.prod.yml up up --build -d`
- Detener: `docker compose down`
- Reiniciar un servicio (ej. backend): `docker compose restart backend`
- Ver estado: `docker compose ps`

---

## 7) Pruebas rápidas (health checks y smoke)

Desde un navegador (o curl) apuntando a govet.inf.uach.cl:

- Lista tutores: GET /api/tutores/
- Especies: GET /api/especies/
- Razas por especie: GET /api/razas/especie/{id}

Esperado:
- Respuestas 200
- Sin errores 5xx en logs del backend

---

## 8) Logs y depuración

- Todos los servicios:
```
docker compose logs -f
```

- Servicio específico:
```
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f db
```

- Errores comunes:
  - Backend no arranca: revisar dependencias Python, variables DB, migraciones/DDL.
  - Frontend proxy: confirmar que VITE_API_URL=/api y vite.config.ts define proxy hacia backend:4007.

---

## 9) Base de datos

Acceso a psql:
```
docker exec -it grupo7_db psql -U $POSTGRES_USER -d $POSTGRES_DB
```

Backup (dump):
```
docker exec -t grupo7_db pg_dump -U $POSTGRES_USER -d $POSTGRES_DB > backup_$(date +%F_%H%M).sql
```

Restore (cuidado: sobreescribe estado):
```
cat backup_YYYY-MM-DD_HHMM.sql | docker exec -i grupo7_db psql -U $POSTGRES_USER -d $POSTGRES_DB
```

Script de esquema:
- Se monta como ./Dbase/generador_schema.sql en docker-entrypoint-initdb.d/
- Solo corre automáticamente cuando el volumen está vacío (primer arranque).

---

## 10) Versionado, releases y rollback

- Estándar: Semantic Versioning (vX.Y.Z)
- Crear tag y Release en GitHub (ver CHANGELOG.md)

Despliegue de una versión específica:
```
git fetch --tags
git checkout v0.X.Y
docker compose up --build -d
```

Rollback:
- Checkout del tag anterior (v0.X.(Y-1)) y `docker compose up -f docker-compose.prod.yml --build -d`
- Si hubo cambios de esquema no compatibles, restaurar backup previo a la actualización.

---


