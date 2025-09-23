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
from fastapi import FastAPI, Depends, HTTPException
from pydantic import BaseModel
from database import Base, engine
import models # Donde están las tablas de la base de datos
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Annotated
from database import engine, SessionLocal
from dotenv import load_dotenv
import os

# Cargar variables de entorno desde el archivo .env
load_dotenv()

app = FastAPI()

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