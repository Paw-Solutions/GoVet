from datetime import date, datetime
from fastapi import HTTPException
from sqlalchemy.orm import Session
from jinja2 import Environment, FileSystemLoader, select_autoescape
from weasyprint import HTML
import os

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