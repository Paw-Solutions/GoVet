import psycopg2
import os
from datetime import datetime, timedelta
import random

# Conectar PostgreSQL
conn = psycopg2.connect(
    host=os.getenv("DB_HOST", "localhost"),         
    dbname=os.getenv("DB_NAME", "govet"),
    user=os.getenv("POSTGRES_USER", "postgres"),
    password=os.getenv("POSTGRES_PASSWORD", "")
)
cur = conn.cursor()

# Obtener pacientes existentes con sus tutores
cur.execute("""
    SELECT 
        p.id_paciente, 
        tp.rut,
        p.nombre as nombre_paciente,
        e.nombre_cientifico as especie
    FROM govet.paciente p
    INNER JOIN govet.tutor_paciente tp ON p.id_paciente = tp.id_paciente
    INNER JOIN govet.raza r ON p.id_raza = r.id_raza
    INNER JOIN govet.especie e ON r.id_especie = e.id_especie
    WHERE tp.rut IS NOT NULL
    LIMIT 100;
""")
pacientes = cur.fetchall()

print(f"Se encontraron {len(pacientes)} pacientes con tutores")

# Datos para generar consultas realistas
motivos_consulta = [
    "Control de rutina",
    "Vacunación anual",
    "Desparasitación",
    "Consulta por vómitos",
    "Consulta por diarrea",
    "Esterilización",
    "Control post-operatorio",
    "Limpieza dental",
    "Problemas dermatológicos",
    "Cojera o dolor articular",
    "Control de peso",
    "Problemas respiratorios",
    "Control geriátrico",
    "Consulta por apatía",
    "Control de embarazo",
    "Problemas oculares",
    "Problemas auditivos",
    "Herida o traumatismo",
    "Control de enfermedad crónica",
    "Segunda opinión"
]

diagnosticos_perros = [
    "Paciente sano - Control preventivo",
    "Gastroenteritis leve",
    "Dermatitis alérgica",
    "Otitis externa",
    "Displasia de cadera leve",
    "Obesidad - Plan nutricional",
    "Gingivitis",
    "Parásitos intestinales",
    "Artritis degenerativa",
    "Conjuntivitis",
    "Infección de vías urinarias",
    "Tos de las perreras",
    "Lipoma benigno",
    "Herida superficial",
    "Deshidratación leve"
]

diagnosticos_gatos = [
    "Paciente sano - Control preventivo",
    "Gastroenteritis leve",
    "Dermatitis por pulgas",
    "Otitis por ácaros",
    "Enfermedad renal crónica inicial",
    "Sobrepeso - Plan nutricional",
    "Gingivoestomatitis",
    "Parásitos intestinales",
    "Cistitis idiopática felina",
    "Conjuntivitis",
    "Hipertiroidismo leve",
    "Complejo respiratorio felino",
    "Lipidosis hepática",
    "Herida por pelea",
    "Deshidratación leve"
]

estados_pelaje = ["Normal", "Opaco", "Brillante", "Reseco", "Graso", "Con caspa", "Irregular"]
condiciones_corporales = ["1/5 - Caquéctico", "2/5 - Delgado", "3/5 - Ideal", "4/5 - Sobrepeso", "5/5 - Obeso"]
mucosas = ["Rosadas", "Pálidas", "Congestivas", "Ictéricas", "Cianóticas"]
dht_estados = ["< 2 segundos (normal)", "2-3 segundos (leve deshidratación)", "> 3 segundos (deshidratación moderada)"]
nodulos_estados = ["Normales", "Aumentados", "Dolorosos", "No palpables"]
auscultacion = ["Normal", "Soplo grado I/VI", "Soplo grado II/VI", "Frecuencia aumentada", "Frecuencia disminuida", "Crepitaciones leves"]

# Generar fecha aleatoria entre 2023 y 2024
def fecha_aleatoria():
    inicio = datetime(2023, 1, 1)
    fin = datetime(2024, 12, 31)
    delta = fin - inicio
    random_days = random.randint(0, delta.days)
    return inicio + timedelta(days=random_days)

# Insertar consultas
consultas_insertadas = 0
for paciente in pacientes:
    id_paciente, rut, nombre_paciente, especie = paciente
    
    # Generar entre 1 y 4 consultas por paciente
    num_consultas = random.randint(1, 4)
    
    for _ in range(num_consultas):
        # Seleccionar diagnóstico según especie
        if "Canis" in especie:  # Perros
            diagnostico = random.choice(diagnosticos_perros)
        else:  # Gatos y otros
            diagnostico = random.choice(diagnosticos_gatos)
        
        # Peso aleatorio según especie
        if "Canis" in especie:
            peso = round(random.uniform(2.5, 45.0), 2)  # Perros: 2.5kg - 45kg
        else:
            peso = round(random.uniform(2.0, 8.0), 2)   # Gatos: 2kg - 8kg
        
        # Datos de la consulta
        motivo = random.choice(motivos_consulta)
        estado_pelaje = random.choice(estados_pelaje)
        condicion_corporal = random.choice(condiciones_corporales)
        mucosa = random.choice(mucosas)
        dht = random.choice(dht_estados)
        nodulos = random.choice(nodulos_estados)
        auscult = random.choice(auscultacion)
        fecha = fecha_aleatoria()
        
        # Observaciones aleatorias
        observaciones_opciones = [
            f"Paciente {nombre_paciente} acude a control. Se realizan recomendaciones generales.",
            f"Se indica tratamiento. Control en 7 días.",
            f"Se toman muestras para análisis de laboratorio.",
            f"Propietario refiere mejoría. Se continúa tratamiento.",
            f"Se administra medicación. Próximo control en 15 días.",
            f"Se realiza procedimiento sin complicaciones.",
            "Se entregan indicaciones por escrito al tutor.",
            "Paciente cooperador durante examen clínico.",
            "Se agenda cirugía programada.",
            None  # Algunas sin observaciones
        ]
        observacion = random.choice(observaciones_opciones)
        
        try:
            cur.execute("""
                INSERT INTO govet.consulta (
                    id_paciente, 
                    rut, 
                    diagnostico, 
                    estado_pelaje, 
                    peso, 
                    condicion_corporal, 
                    mucosas, 
                    dht, 
                    nodulos_linfaticos, 
                    "auscultacion_cardiaca-toraxica", 
                    observaciones, 
                    fecha_consulta, 
                    motivo
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (
                id_paciente,
                rut,
                diagnostico,
                estado_pelaje,
                peso,
                condicion_corporal,
                mucosa,
                dht,
                nodulos,
                auscult,
                observacion,
                fecha,
                motivo
            ))
            consultas_insertadas += 1
        except Exception as e:
            print(f"Error insertando consulta para paciente {id_paciente}: {e}")
            conn.rollback()
            continue

conn.commit()
print(f"\n✅ Se insertaron {consultas_insertadas} consultas médicas exitosamente")

cur.close()
conn.close()
