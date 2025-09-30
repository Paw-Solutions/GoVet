from datetime import date
from sqlalchemy import create_engine, between, or_, func, desc
from sqlalchemy.orm import Session, sessionmaker
from schemas import (
    PacienteBase, PacienteCreate, PacienteResponse,
    RazaBase, RazaCreate, RazaResponse,
    EspecieBase, EspecieCreate, EspecieResponse,
    TutorBase, TutorCreate, TutorPacienteResponse, TutorResponse,
    TutorPacienteBase,
    TratamientoBase, TratamientoCreate, TratamientoResponse,
    consultaTratamientoBase, consultaTratamientoCreate, consultaTratamientoResponse,
    ConsultaBase, ConsultaCreate, ConsultaResponse
)
from fastapi import FastAPI, Depends, HTTPException, Query
from pydantic import BaseModel
from database import Base, engine
import models # Donde están las tablas de la base de datos
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Annotated, Optional
from database import engine, SessionLocal
from dotenv import load_dotenv
import os
from prefix_middleware import StripAPIPrefixMiddleware

# Cargar variables de entorno desde el archivo .env
load_dotenv()

app = FastAPI()

app.add_middleware(StripAPIPrefixMiddleware)


# CORS
allowed_origins = os.getenv("ALLOWED_ORIGINS", "").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],  # Allows all HTTP methods
    allow_headers=["*"],  # Allows all headers
)

models.Base.metadata.create_all(bind=engine) # Crear tablas en la base de datos

# Crear una sesión para cada solicitud
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]



# HU 4: Como Veterinaria, quiero poder almacenar al tutor con su RUT y nombre, para poder tener su información para consultas futuras
""" RUTAS PARA TUTORES (dueños de mascotas) """
# Ruta POST para añadir un dueño
@app.post("/tutores/", response_model=TutorResponse)
def crear_tutor(tutor: TutorCreate, db: Session = Depends(get_db)):
    db_tutor = models.Tutor(**tutor.dict())
    db.add(db_tutor)
    db.commit()
    db.refresh(db_tutor)
    return db_tutor

# Ruta GET para obtener un dueño por su RUT
@app.get("/tutores/{rut}", response_model=TutorResponse)
def obtener_tutor(rut: str, db: Session = Depends(get_db)):
    db_tutor = db.query(models.Tutor).filter(models.Tutor.rut == rut).first()
    if db_tutor is None:
        raise HTTPException(status_code=404, detail="Tutor no encontrado")
    return db_tutor

# Ruta GET para obtener todos los dueños
@app.get("/tutores/", response_model=List[TutorResponse])
def obtener_todos_los_tutores(db: Session = Depends(get_db)):
    db_tutores = db.query(models.Tutor).all()
    if not db_tutores:
        raise HTTPException(status_code=404, detail="No se encontraron tutores")
    return db_tutores

# Ruta GET para obtener tutores con paginación
# Opción alternativa más corta
@app.get("/tutores/paginated/")
def obtener_tutores_paginados(
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=100),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    offset = (page - 1) * limit
    query = db.query(models.Tutor)
    
    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            or_(
                models.Tutor.nombre.ilike(search_pattern),
                models.Tutor.apellido_paterno.ilike(search_pattern),
                models.Tutor.apellido_materno.ilike(search_pattern),
                models.Tutor.rut.ilike(search_pattern),
                models.Tutor.email.ilike(search_pattern)
            )
        )
    
    total_count = query.count()
    tutores_db = query.order_by(models.Tutor.rut).offset(offset).limit(limit).all()
    
    total_pages = (total_count + limit - 1) // limit
    has_next = page < total_pages
    has_previous = page > 1
    
    # Usar el esquema Pydantic para convertir cada objeto
    tutores_serializados = [TutorResponse.model_validate(tutor).model_dump() for tutor in tutores_db]
    
    return {
        "tutores": tutores_serializados,
        "pagination": {
            "current_page": page,
            "total_pages": total_pages,
            "total_count": total_count,
            "limit": limit,
            "has_next": has_next,
            "has_previous": has_previous,
            "next_page": page + 1 if has_next else None,
            "previous_page": page - 1 if has_previous else None
        }
    }

# HU 3: Como Veterinaria, quiero poder almacenar el paciente por su nombre y raza para indentificarlos y buscarlos facilmente
""" RUTAS PARA PACIENTES (mascotas) """
# Ruta POST para añadir un paciente
@app.post("/pacientes/", response_model=PacienteResponse)
def crear_paciente(paciente: PacienteCreate, db: Session = Depends(get_db)):
    db_paciente = models.Paciente(**paciente.dict())
    db.add(db_paciente)
    db.commit()
    db.refresh(db_paciente)
    return db_paciente

# Ruta GET para obtener un paciente por su ID
@app.get("/pacientes/{id_paciente}", response_model=PacienteResponse)
def obtener_paciente(id_paciente: int, db: Session = Depends(get_db)):
    db_paciente = db.query(models.Paciente).filter(models.Paciente.id_paciente == id_paciente).first()
    if db_paciente is None:
        raise HTTPException(status_code=404, detail="Paciente no encontrado")
    return db_paciente

# Ruta GET para obtener pacientes por su nombre
@app.get("/pacientes/nombre/{nombre}", response_model=List[PacienteResponse])
def obtener_pacientes_por_nombre(nombre: str, db: Session = Depends(get_db)):
    db_pacientes = db.query(models.Paciente).filter(models.Paciente.nombre.ilike(f"%{nombre}%")).all() # el ilike no diferencia mayusculas o minusculas asi facilitamos la busqueda al no ser tan estricta
    if not db_pacientes:
        raise HTTPException(status_code=404, detail="No se encontraron pacientes con ese nombre")
    return db_pacientes

# Ruta GET para obtener pacientes por su raza (nombre de la raza)
@app.get("/pacientes/raza/{nombre_raza}", response_model=List[PacienteResponse])
def obtener_pacientes_por_raza(nombre_raza: str, db: Session = Depends(get_db)):
    db_pacientes = db.query(models.Paciente).join(models.Raza).filter(models.Raza.nombre.ilike(f"%{nombre_raza}%")).all()
    if not db_pacientes:
        raise HTTPException(status_code=404, detail="No se encontraron pacientes con esa raza")
    return db_pacientes

# Ruta GET para obtener todos los pacientes
@app.get("/pacientes/", response_model=List[PacienteResponse])
def obtener_todos_los_pacientes(db: Session = Depends(get_db)):
    db_pacientes = db.query(models.Paciente).all()
    if not db_pacientes:
        raise HTTPException(status_code=404, detail="No se encontraron pacientes")
    return db_pacientes

# Rut GET para obtener todos los pacientes por rut de su tutor
@app.get("/pacientes/tutor/{rut}", response_model=List[PacienteResponse])
def obtener_pacientes_por_rut_tutor(rut: str, db: Session = Depends(get_db)):
    db_pacientes = db.query(models.Paciente).join(models.TutorPaciente).filter(models.TutorPaciente.rut == rut).all()
    if not db_pacientes:
        raise HTTPException(status_code=404, detail="No se encontraron pacientes para ese tutor")
    return db_pacientes

# Ruta GET para obtener pacientes con paginación y búsqueda avanzada
@app.get("/pacientes/paginated/")
def obtener_pacientes_paginados(
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=100),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    offset = (page - 1) * limit
    
    # Query con joins para obtener información relacionada
    query = db.query(
        models.Paciente,
        models.Raza.nombre.label('raza_nombre'),
        models.Especie.nombre_comun.label('especie_nombre'),
        models.Tutor.nombre.label('tutor_nombre'),
        models.Tutor.apellido_paterno.label('tutor_apellido_paterno'),
        models.Tutor.apellido_materno.label('tutor_apellido_materno'),
        models.Tutor.rut.label('tutor_rut'),
        models.Tutor.telefono.label('tutor_telefono'),
        models.Tutor.email.label('tutor_email')
    ).join(
        models.Raza, models.Paciente.id_raza == models.Raza.id_raza, isouter=True
    ).join(
        models.Especie, models.Raza.id_especie == models.Especie.id_especie, isouter=True
    ).join(
        models.TutorPaciente, models.Paciente.id_paciente == models.TutorPaciente.id_paciente, isouter=True
    ).join(
        models.Tutor, models.TutorPaciente.rut == models.Tutor.rut, isouter=True
    )
    
    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            or_(
                models.Paciente.nombre.ilike(search_pattern),
                models.Raza.nombre.ilike(search_pattern),
                models.Especie.nombre_comun.ilike(search_pattern),
                models.Tutor.nombre.ilike(search_pattern),
                models.Tutor.apellido_paterno.ilike(search_pattern),
                models.Tutor.rut.ilike(search_pattern)
            )
        )
    
    # Contar total sin aplicar offset/limit
    total_count = query.count()
    
    # Aplicar paginación y obtener resultados
    results = query.order_by(models.Paciente.id_paciente).offset(offset).limit(limit).all()
    
    total_pages = (total_count + limit - 1) // limit
    has_next = page < total_pages
    has_previous = page > 1
    
    # Construir respuesta personalizada con información completa
    pacientes_serializados = []
    for result in results:
        paciente = result[0]  # El objeto Paciente
        
        # Construir el diccionario con información completa
        paciente_dict = {
            "id_paciente": paciente.id_paciente,
            "nombre": paciente.nombre,
            "fecha_nacimiento": paciente.fecha_nacimiento.isoformat() if paciente.fecha_nacimiento else None,
            "color": paciente.color,
            "sexo": paciente.sexo,
            "esterilizado": paciente.esterilizado,
            "id_raza": paciente.id_raza,
            # Información de la raza
            "raza": result.raza_nombre if result.raza_nombre else None,
            # Información de la especie
            "especie": result.especie_nombre if result.especie_nombre else None,
            # Información del tutor
            "tutor": {
                "nombre": result.tutor_nombre if result.tutor_nombre else None,
                "apellido_paterno": result.tutor_apellido_paterno if result.tutor_apellido_paterno else None,
                "apellido_materno": result.tutor_apellido_materno if result.tutor_apellido_materno else None,
                "rut": result.tutor_rut if result.tutor_rut else None,
                "telefono": result.tutor_telefono if result.tutor_telefono else None,
                "email": result.tutor_email if result.tutor_email else None
            } if result.tutor_nombre else None
        }
        
        pacientes_serializados.append(paciente_dict)

    return {
        "pacientes": pacientes_serializados,
        "pagination": {
            "current_page": page,
            "total_pages": total_pages,
            "total_count": total_count,
            "limit": limit,
            "has_next": has_next,
            "has_previous": has_previous,
            "next_page": page + 1 if has_next else None,
            "previous_page": page - 1 if has_previous else None
        }
    }

""" RUTAS PARA ASOCIAR TUTORES Y PACIENTES """
# Ruta POST para asociar un tutor a un paciente (tutor_paciente)
@app.post("/tutores/{rut_tutor}/pacientes/{id_paciente}", response_model=TutorPacienteResponse)
def asociar_tutor_a_paciente(rut_tutor: str, id_paciente: int, fecha: date, db: Session = Depends(get_db)):
    db_tutor = db.query(models.Tutor).filter(models.Tutor.rut == rut_tutor).first()
    db_paciente = db.query(models.Paciente).filter(models.Paciente.id_paciente == id_paciente).first()
    if not db_tutor:
        raise HTTPException(status_code=404, detail="Tutor no encontrado")
    if not db_paciente:
        raise HTTPException(status_code=404, detail="Paciente no encontrado")
    db_tutor_paciente = models.TutorPaciente(rut=rut_tutor, id_paciente=id_paciente, fecha=fecha)
    db.add(db_tutor_paciente)
    db.commit()
    db.refresh(db_tutor_paciente)
    return db_tutor_paciente

# Ruta para ver mascotas asociadas a un tutor
@app.get("/tutores/{rut}/pacientes/", response_model=List[PacienteResponse])
def obtener_mascotas_por_tutor(rut: str, db: Session = Depends(get_db)):
    db_tutor = db.query(models.Tutor).filter(models.Tutor.rut == rut).first()
    if not db_tutor:
        raise HTTPException(status_code=404, detail="Tutor no encontrado")
    db_mascotas = db.query(models.Paciente).join(models.TutorPaciente).filter(models.TutorPaciente.rut == rut).all()
    if not db_mascotas:
        raise HTTPException(status_code=404, detail="No se encontraron mascotas para ese tutor")
    return db_mascotas

""" RUTAS PARA RAZAS """
# Ruta POST para añadir una raza
@app.post("/razas/", response_model=RazaResponse)
def crear_raza(raza: RazaCreate, db: Session = Depends(get_db)):
    db_raza = models.Raza(**raza.dict())
    db.add(db_raza)
    db.commit()
    db.refresh(db_raza)
    return db_raza

# Ruta GET para obtener una raza por su nombre
@app.get("/razas/nombre/{nombre}", response_model=List[RazaResponse])
def obtener_razas_por_nombre(nombre: str, db: Session = Depends(get_db)):
    db_razas = db.query(models.Raza).filter(models.Raza.nombre.ilike(f"%{nombre}%")).all()
    if not db_razas:
        raise HTTPException(status_code=404, detail="No se encontraron razas con ese nombre")
    return db_razas

# Ruta GET para obtener todas las razas
@app.get("/razas/", response_model=List[RazaResponse])  
def obtener_todas_las_razas(db: Session = Depends(get_db)):
    db_razas = db.query(models.Raza).all()
    if not db_razas:
        raise HTTPException(status_code=404, detail="No se encontraron razas")
    return db_razas

# Ruta GET para obtener todas las razas mediante el nombre común de la especie
@app.get("/razas/especie/{nombre_especie}", response_model=List[RazaResponse])
def obtener_razas_por_especie(nombre_especie: str, db: Session = Depends(get_db)):
    db_razas = db.query(models.Raza).join(models.Especie).filter(models.Especie.nombre_comun.ilike(f"%{nombre_especie}%")).all()
    if not db_razas:
        raise HTTPException(status_code=404, detail="No se encontraron razas para esa especie")
    return db_razas

""" RUTAS PARA ESPECIE """
# Ruta POST para añadir una especie
@app.post("/especies/", response_model=EspecieResponse)
def crear_especie(especie: EspecieCreate, db: Session = Depends(get_db)):
    db_especie = models.Especie(**especie.dict())
    db.add(db_especie)
    db.commit()
    db.refresh(db_especie)
    return db_especie

# Ruta GET para obtener una especie por su nombre común o científico
@app.get("/especies/nombre/{nombre}", response_model=List[EspecieResponse])
def obtener_especies_por_nombre(nombre: str, db: Session = Depends(get_db)):
    db_especies = db.query(models.Especie).filter(
        or_(
            models.Especie.nombre_cientifico.ilike(f"%{nombre}%"),
            models.Especie.nombre_comun.ilike(f"%{nombre}%")
        )
    ).all()
    if not db_especies:
        raise HTTPException(status_code=404, detail="No se encontraron especies con ese nombre")
    return db_especies

# Ruta GET para obtener todas las especies
@app.get("/especies/", response_model=List[EspecieResponse])
def obtener_todas_las_especies(db: Session = Depends(get_db)):
    db_especies = db.query(models.Especie).all()
    if not db_especies:
        raise HTTPException(status_code=404, detail="No se encontraron especies")
    return db_especies

# HU 7: Como veterinaria quiero buscar pacientes, tutores y fichas con su información 
# clave para recuperar información importante de forma flexible y rápida
""" RUTAS PARA FICHAS DE PACIENTES (CONSULTAS) """
# Ruta POST para añadir una consulta
@app.post("/consultas/", response_model=ConsultaResponse)
def crear_consulta(consulta: ConsultaCreate, db: Session = Depends(get_db)):
    db_consulta = models.Consulta(**consulta.dict())
    db.add(db_consulta)
    db.commit()
    db.refresh(db_consulta)
    return db_consulta

# Ruta GET para obtener una consulta por su ID
@app.get("/consultas/{id_consulta}", response_model=ConsultaResponse)
def obtener_consulta_por_id(id_consulta: int, db: Session = Depends(get_db)):
    db_consulta = db.query(models.Consulta).filter(models.Consulta.id_consulta == id_consulta).first()
    if not db_consulta:
        raise HTTPException(status_code=404, detail="Consulta no encontrada")
    return db_consulta

# Ruta GET para obtener todas las consultas
@app.get("/consultas/", response_model=List[ConsultaResponse])
def obtener_todas_las_consultas(db: Session = Depends(get_db)):
    db_consultas = db.query(models.Consulta).order_by(desc(models.Consulta.fecha_consulta)).all()
    if not db_consultas:
        raise HTTPException(status_code=404, detail="No se encontraron consultas")
    return db_consultas

# Ruta GET para obtener consultas por nombre de paciente
@app.get("/consultas/paciente/{nombre_paciente}", response_model=List[ConsultaResponse])
def obtener_consultas_por_nombre_paciente(nombre_paciente: str, db: Session = Depends(get_db)):
    db_consultas = db.query(models.Consulta).join(models.Paciente).filter(models.Paciente.nombre.ilike(f"%{nombre_paciente}%")).order_by(desc(models.Consulta.fecha_consulta)).all()
    if not db_consultas:
        raise HTTPException(status_code=404, detail="No se encontraron consultas para ese paciente")
    return db_consultas

@app.get("/consultas/paginated/")
def obtener_consultas_paginadas(
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=100),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    offset = (page - 1) * limit
    
    # Query con joins para obtener información relacionada
    query = db.query(
        models.Consulta,
        models.Paciente.nombre.label('paciente_nombre'),
        models.Paciente.color.label('paciente_color'),
        models.Paciente.sexo.label('paciente_sexo'),
        models.Paciente.fecha_nacimiento.label('paciente_fecha_nacimiento'),
        models.Paciente.codigo_chip.label('paciente_codigo_chip'),
        models.Raza.nombre.label('raza_nombre'),
        models.Especie.nombre_comun.label('especie_nombre'),
        models.Tutor.nombre.label('tutor_nombre'),
        models.Tutor.apellido_paterno.label('tutor_apellido_paterno'),
        models.Tutor.apellido_materno.label('tutor_apellido_materno'),
        models.Tutor.rut.label('tutor_rut'),
        models.Tutor.telefono.label('tutor_telefono'),
        models.Tutor.email.label('tutor_email')
    ).join(
        models.Paciente, models.Consulta.id_paciente == models.Paciente.id_paciente, isouter=True
    ).join(
        models.Raza, models.Paciente.id_raza == models.Raza.id_raza, isouter=True
    ).join(
        models.Especie, models.Raza.id_especie == models.Especie.id_especie, isouter=True
    ).join(
        models.Tutor, models.Consulta.rut == models.Tutor.rut, isouter=True
    )
    
    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            or_(
                # Búsqueda en datos de la consulta
                models.Consulta.diagnostico.ilike(search_pattern),
                models.Consulta.motivo.ilike(search_pattern),
                models.Consulta.observaciones.ilike(search_pattern),
                # Búsqueda en datos del paciente
                models.Paciente.nombre.ilike(search_pattern),
                models.Paciente.codigo_chip.ilike(search_pattern),
                # Búsqueda en raza y especie
                models.Raza.nombre.ilike(search_pattern),
                models.Especie.nombre_comun.ilike(search_pattern),
                # Búsqueda en datos del tutor
                models.Tutor.nombre.ilike(search_pattern),
                models.Tutor.apellido_paterno.ilike(search_pattern),
                models.Tutor.rut.ilike(search_pattern)
            )
        )
    
    # Contar total sin aplicar offset/limit
    total_count = query.count()
    
    # Aplicar paginación y obtener resultados ordenados por fecha más reciente
    results = query.order_by(desc(models.Consulta.fecha_consulta)).offset(offset).limit(limit).all()
    
    total_pages = (total_count + limit - 1) // limit
    has_next = page < total_pages
    has_previous = page > 1
    
    # Construir respuesta personalizada con información completa
    consultas_serializadas = []
    for result in results:
        consulta = result[0]  # El objeto Consulta
        
        # Construir el diccionario con información completa
        consulta_dict = {
            # Información de la consulta
            "id_consulta": consulta.id_consulta,
            "id_paciente": consulta.id_paciente,
            "rut": consulta.rut,
            "diagnostico": consulta.diagnostico,
            "estado_pelaje": consulta.estado_pelaje,
            "peso": consulta.peso,
            "condicion_corporal": consulta.condicion_corporal,
            "mucosas": consulta.mucosas,
            "dht": consulta.dht,
            "nodulos_linfaticos": consulta.nodulos_linfaticos,
            "auscultacion_cardiaca_toraxica": consulta.auscultacion_cardiaca_toraxica,
            "observaciones": consulta.observaciones,
            "fecha_consulta": consulta.fecha_consulta.isoformat() if consulta.fecha_consulta else None,
            "motivo_consulta": consulta.motivo,  # Renombrado para mayor claridad
            
            # Información del paciente
            "paciente": {
                "id_paciente": consulta.id_paciente,
                "nombre": result.paciente_nombre if result.paciente_nombre else None,
                "color": result.paciente_color if result.paciente_color else None,
                "sexo": result.paciente_sexo if result.paciente_sexo else None,
                "fecha_nacimiento": result.paciente_fecha_nacimiento.isoformat() if result.paciente_fecha_nacimiento else None,
                "codigo_chip": result.paciente_codigo_chip if result.paciente_codigo_chip else None,
                "raza": result.raza_nombre if result.raza_nombre else None,
                "especie": result.especie_nombre if result.especie_nombre else None
            } if result.paciente_nombre else None,
            
            # Información del tutor
            "tutor": {
                "nombre": result.tutor_nombre if result.tutor_nombre else None,
                "apellido_paterno": result.tutor_apellido_paterno if result.tutor_apellido_paterno else None,
                "apellido_materno": result.tutor_apellido_materno if result.tutor_apellido_materno else None,
                "rut": result.tutor_rut if result.tutor_rut else None,
                "telefono": result.tutor_telefono if result.tutor_telefono else None,
                "email": result.tutor_email if result.tutor_email else None
            } if result.tutor_nombre else None
        }
        
        consultas_serializadas.append(consulta_dict)

    return {
        "consultas": consultas_serializadas,  # ← Cambio de "pacientes" a "consultas"
        "pagination": {
            "current_page": page,
            "total_pages": total_pages,
            "total_count": total_count,
            "limit": limit,
            "has_next": has_next,
            "has_previous": has_previous,
            "next_page": page + 1 if has_next else None,
            "previous_page": page - 1 if has_previous else None
        }
    }

# HU 8: Como Veterinaria quiero ver el detalle de los pacientes, 
# para saber su estado y cuándo es su proxima vacuna y/o cita
""" RUTAS PARA TRATAMIENTOS """
# Ruta POST para añadir un tratamiento
@app.post("/tratamientos/", response_model=TratamientoResponse)
def crear_tratamiento(tratamiento: TratamientoCreate, db: Session = Depends(get_db)):
    db_tratamiento = models.Tratamiento(**tratamiento.dict())
    db.add(db_tratamiento)
    db.commit()
    db.refresh(db_tratamiento)
    return db_tratamiento

# Ruta GET para obtener todos los tratamientos
@app.get("/tratamientos/", response_model=List[TratamientoResponse])
def obtener_todos_los_tratamientos(db: Session = Depends(get_db)):
    db_tratamientos = db.query(models.Tratamiento).all()
    if not db_tratamientos:
        raise HTTPException(status_code=404, detail="No se encontraron tratamientos")
    return db_tratamientos

# Ruta GET para obtener un tratamiento por su nombre
@app.get("/tratamientos/nombre/{nombre}", response_model=TratamientoResponse)
def obtener_tratamiento_por_nombre(nombre: str, db: Session = Depends(get_db)):
    db_tratamiento = db.query(models.Tratamiento).filter(models.Tratamiento.nombre.ilike(f"%{nombre}%")).first()
    if not db_tratamiento:
        raise HTTPException(status_code=404, detail="Tratamiento no encontrado")
    return db_tratamiento

# Ruta POST para consulta_tratamiento
@app.post("/consultas_tratamientos/", response_model=consultaTratamientoResponse)
def crear_consulta_tratamiento(consulta_tratamiento: consultaTratamientoBase, db: Session = Depends(get_db)):
    db_consulta_tratamiento = models.ConsultaTratamiento(**consulta_tratamiento.dict())
    db.add(db_consulta_tratamiento)
    db.commit()
    db.refresh(db_consulta_tratamiento)
    return db_consulta_tratamiento

# Ruta GET para obtener todos los registros de consulta_tratamiento
@app.get("/consultas_tratamientos/", response_model=List[consultaTratamientoResponse])
def obtener_todas_las_consultas_tratamiento(db: Session = Depends(get_db)):
    db_consultas_tratamiento = db.query(models.ConsultaTratamiento).order_by(desc(models.ConsultaTratamiento.fecha_tratamiento)).all()
    if not db_consultas_tratamiento:
        raise HTTPException(status_code=404, detail="No se encontraron tratamientos asociados a consultas")
    return db_consultas_tratamiento

# Ruta GET para obtener registros de consulta_tratamiento por nombre de paciente
@app.get("/consultas_tratamientos/paciente/{nombre_paciente}", response_model=List[consultaTratamientoResponse])
def obtener_consultas_tratamiento_por_nombre_paciente(nombre_paciente: str, db: Session = Depends(get_db)):
    db_consultas_tratamiento = db.query(models.ConsultaTratamiento).join(models.Paciente).filter(models.Paciente.nombre.ilike(f"%{nombre_paciente}%")).order_by(desc(models.ConsultaTratamiento.fecha_tratamiento)).all()
    if not db_consultas_tratamiento:
        raise HTTPException(status_code=404, detail="No se encontraron tratamientos para ese paciente")
    return db_consultas_tratamiento