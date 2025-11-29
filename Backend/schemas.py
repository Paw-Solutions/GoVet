from typing import Optional
from pydantic import BaseModel, EmailStr
from datetime import date

""" Esquema de datos para la entidad Tutor (dueño de una mascota) """

class TutorBase(BaseModel):
    rut: str
    nombre: str
    apellido_paterno: Optional[str] = None
    apellido_materno: Optional[str] = None
    celular: Optional[int] = None
    celular2: Optional[int] = None
    comuna: Optional[str] = None
    region: Optional[str] = None
    observacion: Optional[str] = None
    telefono: Optional[int] = None
    telefono2: Optional[int] = None
    direccion: Optional[str] = None
    email: Optional[str] = None

    class Config:
        from_attributes = True

class TutorCreate(TutorBase):
    pass

class TutorResponse(TutorBase):
    rut: str

    class Config:
        from_attributes = True

""" Esquema de datos para la entidad Paciente (Mascota) """
# define los campos comunes que se usan tanto para crear como para mostrar mostrar, 
# No incluye el id_paciente, que es generado automáticamente por la base de datos al momento de hacer el commit.
class PacienteBase(BaseModel):
    nombre: str 
    color: str
    sexo: str
    esterilizado: Optional[bool] = None
    fecha_nacimiento: date
    id_raza: int
    codigo_chip: Optional[str] = None
    # permite que los modelos de Pydantic acepten objetos ORM como entrada y 
    # los conviertan en modelos de Pydantic.
    class Config: 
        from_attributes = True

class EventCreate(BaseModel):
    summary: str
    location: Optional[str] = None
    description: str | None = None
    start: str  # ISO datetime format
    end: str    # ISO datetime format
    attendees: Optional[list] = None

    class Config:
        from_attributes = True 

class PacienteCreate(PacienteBase):
    pass # Hereda todos los atributos de PacienteBase

class PacienteResponse(PacienteBase):
    id_paciente: int 
    raza: Optional[str] = None
    especie: Optional[str] = None
    tutor: Optional[TutorResponse] = None

    class Config:
        from_attributes = True 

""" Esquema de datos para la entidad Raza """

class RazaBase(BaseModel):
    nombre: str
    id_especie: int

    class Config:
        from_attributes = True 

class RazaCreate(RazaBase):
    pass

class RazaResponse(RazaBase):
    id_raza: int

    class Config:
        from_attributes = True

""" Esquema de datos para la entidad Especie """

class EspecieBase(BaseModel):
    nombre_cientifico: str
    nombre_comun: str

    class Config:
        from_attributes = True

class EspecieCreate(EspecieBase):
    pass

class EspecieResponse(EspecieBase):
    id_especie: int

    class Config:
        from_attributes = True

""" Esquema de datos para la tabla tutor_paciente """
class TutorPacienteBase(BaseModel):
    rut: str
    id_paciente: int
    fecha: date # Fecha de adopción o de cambio de dueño

    class Config:
        from_attributes = True

class TutorPacienteCreate(TutorPacienteBase):
    pass

class TutorPacienteResponse(TutorPacienteBase):
    rut: str
    id_paciente: int
    fecha: date

    class Config:
        from_attributes = True

""" Esquema de datos para la entidad tratamiento """

class TratamientoBase(BaseModel):
    nombre: str
    descripcion: Optional[str] = None
    tipo_tratamiento: str
    
    class Config:
        from_attributes = True

class TratamientoCreate(TratamientoBase):
    pass

class TratamientoResponse(TratamientoBase):
    id_tratamiento: int

    class Config:
        from_attributes = True

# --------------------------------------------------------------
class consultaTratamientoBase(BaseModel):
    id_consulta: Optional[int] = None
    id_tratamiento: int
    id_paciente: int
    dosis: Optional[str] = None
    fecha_tratamiento: Optional[date] = None
    marca: Optional[str] = None
    proxima_dosis: Optional[date] = None
    numero_serial: Optional[str] = None

    class Config:
        from_attributes = True

class consultaTratamientoCreate(consultaTratamientoBase):
    pass

class consultaTratamientoResponse(consultaTratamientoBase): 
    id_aplicacion: int

    class Config:
        from_attributes = True

# Agregar al final del archivo schemas.py
class consultaTratamientoConDetallesResponse(BaseModel):
    id_consulta: Optional[int] = None
    id_tratamiento: int
    id_paciente: int
    dosis: Optional[str] = None
    fecha_tratamiento: Optional[date] = None
    id_aplicacion: int
    marca: Optional[str] = None
    proxima_dosis: Optional[date] = None
    numero_serial: Optional[str] = None
    # Información adicional
    nombre_tratamiento: str
    descripcion_tratamiento: Optional[str] = None
    nombre_paciente: Optional[str] = None
    
    class Config:
        from_attributes = True

""" Esquema de datos para la entidad consulta """
class ConsultaBase(BaseModel):
    id_paciente: int
    rut: str
    fecha_consulta: Optional[date] = None
    motivo: Optional[str] = None
    diagnostico: Optional[str] = None
    observaciones: Optional[str] = None
    dht: Optional[int] = None
    nodulos_linfaticos: Optional[str] = None
    mucosas: Optional[str] = None
    peso: Optional[float] = None
    auscultacion_cardiaca_toraxica: Optional[str] = None
    estado_pelaje: Optional[str] = None
    condicion_corporal: Optional[str] = None
    tllc: Optional[float] = None
    estado_piel: Optional[str] = None
    frecuencia_respiratoria: Optional[float] = None
    frecuencia_cardiaca: Optional[float] = None
    examen_clinico: Optional[str] = None
    prediagnostico: Optional[str] = None
    pronostico: Optional[str] = None
    indicaciones_generales: Optional[str] = None
    temperatura: Optional[float] = None

    class Config:
        from_attributes = True

class ConsultaCreate(ConsultaBase):
    pass

class ConsultaResponse(ConsultaBase):
    id_consulta: int

    class Config:
        from_attributes = True

""" Esquema de datos para el envío de correos electrónicos """
class EmailSchema(BaseModel):
    email: EmailStr
    cuerpo: str