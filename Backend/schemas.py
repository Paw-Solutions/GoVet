from typing import Optional
from pydantic import BaseModel, EmailStr
from datetime import date

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
    reminders: Optional[dict] = None
    attendees: Optional[list] = None

    class Config:
        from_attributes = True 

class PacienteCreate(PacienteBase):
    pass # Hereda todos los atributos de PacienteBase

class PacienteResponse(PacienteBase):
    id_paciente: int 

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

""" Esquema de datos para la entidad tutor (dueño de una mascota) """

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
    descripcion: str
    
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
    dosis: str
    fecha_tratamiento: date

    class Config:
        from_attributes = True

class consultaTratamientoCreate(consultaTratamientoBase):
    pass

class consultaTratamientoResponse(consultaTratamientoBase): 
    id_aplicacion: int

    class Config:
        from_attributes = True

""" Esquema de datos para la entidad consulta """
class ConsultaBase(BaseModel):
    id_paciente: int
    rut: str
    fecha_consulta: date
    motivo: str 
    diagnostico: str
    observaciones: str
    dht: str
    nodulos_linfaticos: str
    mucosas: str
    peso: float
    auscultacion_cardiaca_toraxica: str
    estado_pelaje: str
    condicion_corporal: str

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