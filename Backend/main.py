from sqlalchemy import create_engine, between, or_, func
from sqlalchemy.orm import Session, sessionmaker
from schemas import (
    PacienteBase, PacienteCreate, PacienteResponse,
    RazaBase, RazaCreate, RazaResponse,
    EspecieBase, EspecieCreate, EspecieResponse,
    TutorBase, TutorCreate, TutorResponse,
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

app = FastAPI()
models.Base.metadata.create_all(bind=engine) # Crear tablas en la base de datos

# Crear una sesión para cada solicitud
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Orígenes permitidos
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods
    allow_headers=["*"],  # Allows all headers
)

""" RUTAS PARA DUEÑOS """
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


# HU 3: Como Veterinaria, quiero poder almacenar el paciente por su nombre y raza para indentificarlos y buscarlos facilmente
""" Rutas para pacientes """
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
    db_pacientes = db.query(models.Paciente).filter(models.Paciente.nombre.ilike(f"%{nombre}%")).all()
    if not db_pacientes:
        raise HTTPException(status_code=404, detail="No se encontraron pacientes con ese nombre")
    return db_pacientes

""" Rutas para razas """
# Ruta POST para añadir una raza
@app.post("/razas/", response_model=RazaResponse)
def crear_raza(raza: RazaCreate, db: Session = Depends(get_db)):
    db_raza = models.Raza(**raza.dict())
    db.add(db_raza)
    db.commit()
    db.refresh(db_raza)
    return db_raza


""" Rutas para especies """
# Ruta POST para añadir una especie
@app.post("/especies/", response_model=EspecieResponse)
def crear_especie(especie: EspecieCreate, db: Session = Depends(get_db)):
    db_especie = models.Especie(**especie.dict())
    db.add(db_especie)
    db.commit()
    db.refresh(db_especie)
    return db_especie