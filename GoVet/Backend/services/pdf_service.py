from datetime import date, datetime
from fastapi import HTTPException
from sqlalchemy.orm import Session, joinedload
from jinja2 import Environment, FileSystemLoader, select_autoescape
from weasyprint import HTML
import os
import locale

import models  

# Crea una ruta absoluta para templates
# Toma la direccion de la carpeta del archivo actual, sube un nivel con ".." y entra a la carpeta "templates"
TEMPLATES_DIR = os.path.join(os.path.dirname(__file__), "..", "templates")

# Crea el environment de jinja2, es decir como trabaja los HTML
env = Environment(
    loader=FileSystemLoader(TEMPLATES_DIR),         # Directorio de templates 
    autoescape=select_autoescape(["html", "xml"])   # Proteje el PDF de ejecutar comandos del HTML
)

# Formato edad a partir de fecha de nacimiento
def _edad(fecha_nac: date) -> str:
    if not fecha_nac:
        return "—"
    hoy = date.today()
    años = hoy.year - fecha_nac.year - ((hoy.month, hoy.day) < (fecha_nac.month, fecha_nac.day))
    meses = (hoy.month - fecha_nac.month - (1 if hoy.day < fecha_nac.day else 0)) % 12
    if años < 1:
        return f"{meses} meses"
    return f"{años} años {meses} m."

# Formato fecha
def _format_fecha(fecha: date) -> str:
    if not fecha: return "—"
    return fecha.strftime("%d-%m-%Y")

# Formato fecha en texto largo (ej: "09 de septiembre de 2024")
def _format_fecha_larga(fecha: date) -> str:
    if not fecha: return "—"
    meses = [
        "enero", "febrero", "marzo", "abril", "mayo", "junio",
        "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
    ]
    return f"{fecha.day} de {meses[fecha.month - 1]} de {fecha.year}"

# Formato sexo
def _format_sexo(sexo: str) -> str:
    if not sexo: return "—"
    sexo_map = {"M": "Macho", "H": "Hembra", "m": "Macho", "h": "Hembra"}
    return sexo_map.get(sexo, sexo)

# Funcion para leer una consulta y devolver bytes de un pdf generado a partir de esta y una plantilla
# "-> bytes" Aclara que se estan entregando bytes, no string, no objetos, bytes
def generar_pdf_consulta(db: Session, id_consulta: int) -> bytes: 
    consulta = db.query(models.Consulta).filter(models.Consulta.id_consulta == id_consulta).first()
    if not consulta:
        raise HTTPException(status_code=404, detail="Consulta no encontrada")

    paciente = consulta.paciente
    tutor = consulta.tutor

    template = env.get_template("consulta_pdf.html") # Plantilla HTML a usar c
    html = template.render( # Convierte plantilla a un HTML real entregandole variables
        consulta=consulta,
        paciente=paciente,
        tutor=tutor,
        edad=_edad(paciente.fecha_nacimiento) if paciente else "—",
        sexo=(paciente.sexo if paciente and paciente.sexo else "—"),
        fecha_consulta=_format_fecha(consulta.fecha_consulta),
        generado=datetime.now().strftime("%d-%m-%Y %H:%M")
    ) 

    pdf_bytes = HTML(string=html).write_pdf() # WeasyPrint convierte HTML a un PDF
    return pdf_bytes # Se devuelven los bytes del pdf


# Funcion para generar certificado de transporte de animales de compañía
def generar_certificado_transporte(db: Session, id_paciente: int) -> bytes:
    # Buscar paciente con sus relaciones
    paciente = db.query(models.Paciente).options(
        joinedload(models.Paciente.raza).joinedload(models.Raza.especie),
        joinedload(models.Paciente.tutores).joinedload(models.TutorPaciente.tutor)
    ).filter(models.Paciente.id_paciente == id_paciente).first()
    
    if not paciente:
        raise HTTPException(status_code=404, detail="Paciente no encontrado")
    
    # Obtener tutor (el primero asociado)
    if not paciente.tutores or len(paciente.tutores) == 0:
        raise HTTPException(status_code=404, detail="El paciente no tiene tutor asociado")
    
    tutor = paciente.tutores[0].tutor
    
    # Obtener historial de vacunación/desparasitación
    # Filtra tratamientos que contengan "Vacuna" o "Desparasit" en el tipo
    vacunas = db.query(models.ConsultaTratamiento).options(
        joinedload(models.ConsultaTratamiento.tratamiento)
    ).filter(
        models.ConsultaTratamiento.id_paciente == id_paciente
    ).join(
        models.Tratamiento
    ).filter(
        (models.Tratamiento.tipo_tratamiento.ilike("%vacuna%")) |
        (models.Tratamiento.tipo_tratamiento.ilike("%desparasit%")) |
        (models.Tratamiento.tipo_tratamiento.ilike("%antiparasit%"))
    ).order_by(
        models.ConsultaTratamiento.fecha_tratamiento.desc()
    ).all()
    
    # Renderizar template
    template = env.get_template("certificado_transporte_pdf.html")
    html = template.render(
        paciente=paciente,
        tutor=tutor,
        vacunas=vacunas,
        edad=_edad(paciente.fecha_nacimiento) if paciente else "—",
        sexo=_format_sexo(paciente.sexo) if paciente else "—",
        fecha_nacimiento=_format_fecha(paciente.fecha_nacimiento) if paciente else "—",
        fecha_actual=_format_fecha_larga(date.today()),
        fecha_generacion=datetime.now().strftime("%d-%m-%Y %H:%M")
    )
    
    pdf_bytes = HTML(string=html).write_pdf()
    return pdf_bytes


# Funcion para generar consentimiento informado
def generar_consentimiento_informado(
    db: Session, 
    id_paciente: int,
    procedimiento: str = None,
    indicaciones: str = None,
    objetivos: str = None,
    peso: float = None,
    autorizaciones_adicionales: list = None,
    testigo_requerido: bool = False
) -> bytes:
    # Buscar paciente con sus relaciones
    paciente = db.query(models.Paciente).options(
        joinedload(models.Paciente.raza).joinedload(models.Raza.especie),
        joinedload(models.Paciente.tutores).joinedload(models.TutorPaciente.tutor)
    ).filter(models.Paciente.id_paciente == id_paciente).first()
    
    if not paciente:
        raise HTTPException(status_code=404, detail="Paciente no encontrado")
    
    # Obtener tutor (el primero asociado)
    if not paciente.tutores or len(paciente.tutores) == 0:
        raise HTTPException(status_code=404, detail="El paciente no tiene tutor asociado")
    
    tutor = paciente.tutores[0].tutor
    
    # Información del médico (hardcoded por ahora, se puede parametrizar)
    medico = {
        "nombre": "Dra. Daniela Alejandra Otárola Arancibia",
        "rut": "16.372.666-1",
        "titulo": "Médica Veterinaria"
    }
    
    # Renderizar template
    template = env.get_template("consentimiento_informado_pdf.html")
    html = template.render(
        paciente=paciente,
        tutor=tutor,
        medico=medico,
        procedimiento=procedimiento,
        indicaciones=indicaciones,
        objetivos=objetivos,
        peso=peso,
        autorizaciones_adicionales=autorizaciones_adicionales or [],
        testigo_requerido=testigo_requerido,
        edad=_edad(paciente.fecha_nacimiento) if paciente.fecha_nacimiento else "—",
        sexo=_format_sexo(paciente.sexo) if paciente.sexo else "—",
        fecha_generacion=datetime.now().strftime("%d-%m-%Y %H:%M")
    )
    
    pdf_bytes = HTML(string=html).write_pdf()
    return pdf_bytes


# Funcion para generar orden de exámenes
def generar_orden_examenes(
    db: Session,
    id_paciente: int,
    id_consulta: int = None,
    examenes: list = None,
    observaciones: str = None
) -> bytes:
    # Buscar paciente con sus relaciones
    paciente = db.query(models.Paciente).options(
        joinedload(models.Paciente.raza).joinedload(models.Raza.especie),
        joinedload(models.Paciente.tutores).joinedload(models.TutorPaciente.tutor)
    ).filter(models.Paciente.id_paciente == id_paciente).first()
    
    if not paciente:
        raise HTTPException(status_code=404, detail="Paciente no encontrado")
    
    # Obtener tutor (el primero asociado)
    if not paciente.tutores or len(paciente.tutores) == 0:
        raise HTTPException(status_code=404, detail="El paciente no tiene tutor asociado")
    
    tutor = paciente.tutores[0].tutor
    
    # Consulta opcional
    consulta = None
    if id_consulta:
        consulta = db.query(models.Consulta).filter(
            models.Consulta.id_consulta == id_consulta
        ).first()
    
    # Información del médico
    medico = {
        "nombre": "Dra. Daniela Alejandra Otárola Arancibia",
        "rut": "16.372.666-1",
        "titulo": "Médica Veterinaria"
    }
    
    # Renderizar template
    template = env.get_template("orden_de_examenes_pdf.html")
    html = template.render(
        paciente=paciente,
        tutor=tutor,
        consulta=consulta,
        medico=medico,
        examenes=examenes or [],
        observaciones=observaciones,
        edad=_edad(paciente.fecha_nacimiento) if paciente.fecha_nacimiento else "—",
        sexo=_format_sexo(paciente.sexo) if paciente.sexo else "—",
        fecha_generacion=datetime.now().strftime("%d-%m-%Y %H:%M")
    )
    
    pdf_bytes = HTML(string=html).write_pdf()
    return pdf_bytes


# Funcion para generar receta médica
def generar_receta_medica(
    db: Session,
    id_paciente: int,
    id_consulta: int = None,
    recetas: list = None,
    observaciones: str = None,
    fecha_receta: str = None
) -> bytes:
    # Buscar paciente con sus relaciones
    paciente = db.query(models.Paciente).options(
        joinedload(models.Paciente.raza).joinedload(models.Raza.especie),
        joinedload(models.Paciente.tutores).joinedload(models.TutorPaciente.tutor)
    ).filter(models.Paciente.id_paciente == id_paciente).first()
    
    if not paciente:
        raise HTTPException(status_code=404, detail="Paciente no encontrado")
    
    # Obtener tutor (el primero asociado)
    if not paciente.tutores or len(paciente.tutores) == 0:
        raise HTTPException(status_code=404, detail="El paciente no tiene tutor asociado")
    
    tutor = paciente.tutores[0].tutor
    
    # Consulta opcional
    consulta = None
    if id_consulta:
        consulta = db.query(models.Consulta).filter(
            models.Consulta.id_consulta == id_consulta
        ).first()
    
    # Información del médico
    medico = {
        "nombre": "Dra. Daniela Alejandra Otárola Arancibia",
        "rut": "16.372.666-1",
        "titulo": "Médica Veterinaria"
    }
    
    # Renderizar template
    template = env.get_template("receta_pdf.html")
    html = template.render(
        paciente=paciente,
        tutor=tutor,
        consulta=consulta,
        medico=medico,
        recetas=recetas or [],
        observaciones=observaciones,
        fecha_receta=fecha_receta,
        edad=_edad(paciente.fecha_nacimiento) if paciente.fecha_nacimiento else "—",
        sexo=_format_sexo(paciente.sexo) if paciente.sexo else "—",
        fecha_generacion=datetime.now().strftime("%d-%m-%Y %H:%M")
    )
    
    pdf_bytes = HTML(string=html).write_pdf()
    return pdf_bytes


# ==================== FUNCIONES AUXILIARES PARA TESTING ====================

def generar_pdf_consulta_desde_datos(datos: dict) -> bytes:
    """
    Genera un PDF de consulta a partir de un diccionario de datos (sin DB).
    Útil para testing y generación de PDFs de ejemplo.
    """
    template = env.get_template("consulta_pdf.html")
    
    consulta = datos.get('consulta', {})
    paciente = datos.get('paciente', {})
    tutor = datos.get('tutor', {})
    
    fecha_nac = paciente.get('fecha_nacimiento')
    fecha_cons = consulta.get('fecha_consulta')
    
    html = template.render(
        consulta=type('obj', (object,), consulta)(),
        paciente=type('obj', (object,), paciente)(),
        tutor=type('obj', (object,), tutor)(),
        edad=_edad(fecha_nac) if fecha_nac else "—",
        sexo=_format_sexo(paciente.get('sexo', '')),
        fecha_consulta=_format_fecha(fecha_cons) if fecha_cons else "—",
        generado=datetime.now().strftime("%d-%m-%Y %H:%M")
    )
    
    pdf_bytes = HTML(string=html).write_pdf()
    return pdf_bytes


def generar_pdf_certificado_transporte(datos: dict) -> bytes:
    """
    Genera un PDF de certificado de transporte a partir de un diccionario de datos (sin DB).
    Útil para testing y generación de PDFs de ejemplo.
    """
    template = env.get_template("certificado_transporte_pdf.html")
    
    paciente = datos.get('paciente', {})
    tutor = datos.get('tutor', {})
    vacunas = datos.get('vacunas', [])
    
    # Convertir diccionarios a objetos para que funcionen con la plantilla
    paciente_obj = type('obj', (object,), paciente)()
    tutor_obj = type('obj', (object,), tutor)()
    vacunas_objs = [type('obj', (object,), v)() for v in vacunas]
    
    fecha_nac = paciente.get('fecha_nacimiento')
    
    html = template.render(
        paciente=paciente_obj,
        tutor=tutor_obj,
        vacunas=vacunas_objs,
        edad=_edad(fecha_nac) if fecha_nac else "—",
        sexo=_format_sexo(paciente.get('sexo', '')),
        fecha_nacimiento=_format_fecha(fecha_nac) if fecha_nac else "—",
        fecha_actual=_format_fecha_larga(date.today()),
        fecha_generacion=datetime.now().strftime("%d-%m-%Y %H:%M")
    )
    
    pdf_bytes = HTML(string=html).write_pdf()
    return pdf_bytes
