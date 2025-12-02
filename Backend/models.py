from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Date, CHAR, BigInteger, Float
from sqlalchemy.orm import relationship
from database import Base

class Tutor(Base):
    __tablename__ = "tutor"
    __table_args__ = {'schema': 'govet'}
    
    nombre = Column(String)
    telefono = Column(BigInteger, nullable=True) # int8
    email = Column(String, nullable=True)
    direccion = Column(String, nullable=True)
    rut = Column(String, primary_key=True)
    apellido_paterno = Column(String, nullable=True)
    apellido_materno = Column(String, nullable=True)
    celular = Column(BigInteger, nullable=True)
    celular2 = Column(BigInteger, nullable=True)
    comuna = Column(String, nullable=True)
    region = Column(String, nullable=True)
    observacion = Column(String, nullable=True)
    telefono2 = Column(BigInteger, nullable=True)
    activo = Column(Boolean, default=True)

    # Relaciones
    consultas = relationship("Consulta", back_populates="tutor")
    pacientes = relationship("TutorPaciente", back_populates="tutor")

class Especie(Base):
    __tablename__ = "especie"
    __table_args__ = {'schema': 'govet'}
    
    id_especie = Column(BigInteger, primary_key=True)
    nombre_cientifico = Column(String, nullable=False)
    nombre_comun = Column(String, nullable=False)
    
    # Relaciones
    razas = relationship("Raza", back_populates="especie")

class Tratamiento(Base):
    __tablename__ = "tratamiento"
    __table_args__ = {'schema': 'govet'}
    
    id_tratamiento = Column(Integer, primary_key=True)
    nombre = Column(String, nullable=False)
    descripcion = Column(String)
    tipo_tratamiento = Column(String, nullable=False)
    
    # Relaciones
    consultas_tratamientos = relationship("ConsultaTratamiento", back_populates="tratamiento")

class Raza(Base):
    __tablename__ = "raza"
    __table_args__ = {'schema': 'govet'}
    
    id_raza = Column(BigInteger, primary_key=True)
    nombre = Column(String, nullable=False)
    id_especie = Column(BigInteger, ForeignKey('govet.especie.id_especie'), nullable=False)
    
    # Relaciones
    especie = relationship("Especie", back_populates="razas")
    pacientes = relationship("Paciente", back_populates="raza")

class Paciente(Base):
    __tablename__ = "paciente"
    __table_args__ = {'schema': 'govet'}
    
    id_paciente = Column(BigInteger, primary_key=True)
    nombre = Column(String, nullable=False)
    color = Column(String, nullable=False)
    sexo = Column(CHAR(1), nullable=False)
    esterilizado = Column(Boolean, default=False)
    fecha_nacimiento = Column(Date, nullable=False)
    id_raza = Column(BigInteger, ForeignKey('govet.raza.id_raza'), nullable=False)
    codigo_chip = Column(String)
    activo = Column(Boolean, default=True)
    
    # Relaciones
    raza = relationship("Raza", back_populates="pacientes")
    consultas = relationship("Consulta", back_populates="paciente")
    consultas_tratamientos = relationship("ConsultaTratamiento", back_populates="paciente")
    tutores = relationship("TutorPaciente", back_populates="paciente")

class Consulta(Base):
    __tablename__ = "consulta"
    __table_args__ = {'schema': 'govet'}
    
    id_consulta = Column(BigInteger, primary_key=True)
    id_paciente = Column(BigInteger, ForeignKey('govet.paciente.id_paciente'), nullable=False)
    rut = Column(String, ForeignKey('govet.tutor.rut'), nullable=False)
    diagnostico = Column(String)
    estado_pelaje = Column(String)
    peso = Column(Float)
    condicion_corporal = Column(String)
    mucosas = Column(String)
    dht = Column(BigInteger)
    nodulos_linfaticos = Column(String)
    auscultacion_cardiaca_toraxica = Column("auscultacion_cardiaca-toraxica", String)
    observaciones = Column(String)
    fecha_consulta = Column(Date)
    motivo = Column(String)
    tllc = Column(Float)
    estado_piel = Column(String)
    frecuencia_respiratoria = Column(Float)
    frecuencia_cardiaca = Column(Float)
    examen_clinico = Column(String)
    prediagnostico = Column(String)
    pronostico = Column(String)
    indicaciones_generales = Column(String)
    temperatura = Column(Float)
    
    # Relaciones
    paciente = relationship("Paciente", back_populates="consultas")
    tutor = relationship("Tutor", back_populates="consultas")
    tratamientos = relationship("ConsultaTratamiento", back_populates="consulta")

class ConsultaTratamiento(Base):
    __tablename__ = "consulta_tratamiento"
    __table_args__ = {'schema': 'govet'}
    
    id_aplicacion = Column(BigInteger, primary_key=True)
    id_paciente = Column(Integer, ForeignKey('govet.paciente.id_paciente'), nullable=False)
    dosis = Column(String)
    id_consulta = Column(Integer, ForeignKey('govet.consulta.id_consulta'))
    id_tratamiento = Column(Integer, ForeignKey('govet.tratamiento.id_tratamiento'), nullable=False)
    fecha_tratamiento = Column(Date)
    marca = Column(String)
    proxima_dosis = Column(Date)
    numero_serial = Column(String)
    
    # Relaciones
    paciente = relationship("Paciente", back_populates="consultas_tratamientos")
    consulta = relationship("Consulta", back_populates="tratamientos")
    tratamiento = relationship("Tratamiento", back_populates="consultas_tratamientos")

class TutorPaciente(Base):
    __tablename__ = "tutor_paciente"
    __table_args__ = {'schema': 'govet'}
    
    id_paciente = Column(BigInteger, ForeignKey('govet.paciente.id_paciente'), primary_key=True)
    fecha = Column(Date)
    rut = Column(String, ForeignKey('govet.tutor.rut'), primary_key=True)
    
    # Relaciones
    paciente = relationship("Paciente", back_populates="tutores")
    tutor = relationship("Tutor", back_populates="pacientes")