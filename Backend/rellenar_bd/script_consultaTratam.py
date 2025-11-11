import psycopg2
import os
from datetime import datetime, timedelta
import random
import sys

# --- Configuración de la Conexión ---
# Lee las variables de entorno o usa valores por defecto
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_NAME = os.getenv("DB_NAME", "govet")
DB_USER = os.getenv("POSTGRES_USER", "postgres")
DB_PASSWORD = os.getenv("POSTGRES_PASSWORD", "")
DB_SCHEMA = "govet"

# --- Datos para generar consultas realistas (Copiado de tu script) ---
motivos_consulta = [
    "Control de rutina", "Vacunación anual", "Desparasitación", "Consulta por vómitos",
    "Consulta por diarrea", "Esterilización", "Control post-operatorio", "Limpieza dental",
    "Problemas dermatológicos", "Cojera o dolor articular", "Control de peso", "Problemas respiratorios",
    "Control geriátrico", "Consulta por apatía", "Control de embarazo", "Problemas oculares",
    "Problemas auditivos", "Herida o traumatismo", "Control de enfermedad crónica", "Segunda opinión"
]
diagnosticos_perros = [
    "Paciente sano - Control preventivo", "Gastroenteritis leve", "Dermatitis alérgica", "Otitis externa",
    "Displasia de cadera leve", "Obesidad - Plan nutricional", "Gingivitis", "Parásitos intestinales",
    "Artritis degenerativa", "Conjuntivitis", "Infección de vías urinarias", "Tos de las perreras",
    "Lipoma benigno", "Herida superficial", "Deshidratación leve"
]
diagnosticos_gatos = [
    "Paciente sano - Control preventivo", "Gastroenteritis leve", "Dermatitis por pulgas", "Otitis por ácaros",
    "Enfermedad renal crónica inicial", "Sobrepeso - Plan nutricional", "Gingivoestomatitis", "Parásitos intestinales",
    "Cistitis idiopática felina", "Conjuntivitis", "Hipertiroidismo leve", "Complejo respiratorio felino",
    "Lipidosis hepática", "Herida por pelea", "Deshidratación leve"
]
estados_pelaje = ["Normal", "Opaco", "Brillante", "Reseco", "Graso", "Con caspa", "Irregular"]
condiciones_corporales = ["1/5 - Caquéctico", "2/5 - Delgado", "3/5 - Ideal", "4/5 - Sobrepeso", "5/5 - Obeso"]
mucosas = ["Rosadas", "Pálidas", "Congestivas", "Ictéricas", "Cianóticas"]
dht_estados = ["< 2 segundos (normal)", "2-3 segundos (leve deshidratación)", "> 3 segundos (deshidratación moderada)"]
nodulos_estados = ["Normales", "Aumentados", "Dolorosos", "No palpables"]
auscultacion = ["Normal", "Soplo grado I/VI", "Soplo grado II/VI", "Frecuencia aumentada", "Frecuencia disminuida", "Crepitaciones leves"]
observaciones_opciones = [
    "Se realizan recomendaciones generales.", "Se indica tratamiento. Control en 7 días.",
    "Se toman muestras para análisis de laboratorio.", "Propietario refiere mejoría. Se continúa tratamiento.",
    "Se administra medicación. Próximo control en 15 días.", "Se realiza procedimiento sin complicaciones.",
    "Se entregan indicaciones por escrito al tutor.", "Paciente cooperador durante examen clínico.",
    "Se agenda cirugía programada.", None
]

# --- Función Helper para Fechas (Copiado de tu script) ---
def fecha_aleatoria():
    inicio = datetime(2025, 1, 1)
    fin = datetime(2025, 12, 31)
    delta = fin - inicio
    random_days = random.randint(0, delta.days)
    return inicio + timedelta(days=random_days)

# Opciones de dosis para rellenar la relación consulta_tratamiento
dosis_opciones = [
    "1 comprimido", "2 comprimidos", "1 ml", "2 ml", "Aplicar tópicamente una vez",
    "Aplicar tópicamente dos veces al día", "0.5 mg/kg", "1 mg/kg", "0.1 ml/kg"
]

def poblar_consultas_y_relaciones():
    """
    Crea consultas médicas aleatorias para pacientes existentes y, 
    al mismo tiempo, asigna tratamientos a esas consultas en la
    tabla 'consulta_tratamiento'.
    """
    
    conn = None
    cur = None
    consultas_insertadas = 0
    relaciones_insertadas = 0
    
    try:
        # Conectar a la base de datos PostgreSQL
        conn = psycopg2.connect(
            host=DB_HOST, dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD
        )
        cur = conn.cursor()
        print("Conexión a la base de datos establecida exitosamente.")

        # --- 1. Obtener Pacientes existentes (de tu script) ---
        cur.execute(f"""
            SELECT 
                p.id_paciente, 
                tp.rut,
                p.nombre as nombre_paciente,
                e.nombre_cientifico as especie
            FROM {DB_SCHEMA}.paciente p
            INNER JOIN {DB_SCHEMA}.tutor_paciente tp ON p.id_paciente = tp.id_paciente
            INNER JOIN {DB_SCHEMA}.raza r ON p.id_raza = r.id_raza
            INNER JOIN {DB_SCHEMA}.especie e ON r.id_especie = e.id_especie
            WHERE tp.rut IS NOT NULL
            LIMIT 100;
        """)
        pacientes = cur.fetchall()
        
        if not pacientes:
            print(f"Error: No se encontraron pacientes con tutores en la tabla {DB_SCHEMA}.paciente.")
            sys.exit(1)
        print(f"Se encontraron {len(pacientes)} pacientes para generar consultas.")

        # --- 2. Obtener Tratamientos existentes (de tu script) ---
        cur.execute(f"SELECT id_tratamiento FROM {DB_SCHEMA}.tratamiento")
        tratamiento_rows = cur.fetchall()
        tratamiento_ids = [row[0] for row in tratamiento_rows]

        if not tratamiento_ids:
            print(f"Error: No se encontraron tratamientos en la tabla {DB_SCHEMA}.tratamiento.")
            print("Asegúrate de ejecutar primero el script 'poblar_tratamientos.py'.")
            sys.exit(1)
        print(f"Se encontraron {len(tratamiento_ids)} tratamientos para asignar.")

        # --- 3. Bucle principal para crear Consultas y Relaciones ---
        for paciente in pacientes:
            id_paciente, rut, nombre_paciente, especie = paciente
            
            # Generar entre 1 y 4 consultas por paciente
            num_consultas = random.randint(1, 4)
            
            for _ in range(num_consultas):
                
                # --- A. Preparar datos de la Consulta ---
                if "Canis" in especie:
                    diagnostico = random.choice(diagnosticos_perros)
                    peso = round(random.uniform(2.5, 45.0), 2)
                else:
                    diagnostico = random.choice(diagnosticos_gatos)
                    peso = round(random.uniform(2.0, 8.0), 2)
                
                motivo = random.choice(motivos_consulta)
                estado_pelaje = random.choice(estados_pelaje)
                condicion_corporal = random.choice(condiciones_corporales)
                mucosa = random.choice(mucosas)
                dht = random.choice(dht_estados)
                nodulos = random.choice(nodulos_estados)
                auscult = random.choice(auscultacion)
                fecha = fecha_aleatoria()
                observacion_base = random.choice(observaciones_opciones)
                observacion = f"Paciente {nombre_paciente} acude a consulta. {observacion_base}" if observacion_base else None

                new_consulta_id = None
                try:
                    # --- B. Insertar la Consulta y OBTENER su ID ---
                    cur.execute(f"""
                        INSERT INTO {DB_SCHEMA}.consulta (
                            id_paciente, rut, diagnostico, estado_pelaje, peso, 
                            condicion_corporal, mucosas, dht, nodulos_linfaticos, 
                            "auscultacion_cardiaca-toraxica", observaciones, fecha_consulta, motivo
                        )
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                        RETURNING id_consulta;
                    """, (
                        id_paciente, rut, diagnostico, estado_pelaje, peso,
                        condicion_corporal, mucosa, dht, nodulos,
                        auscult, observacion, fecha, motivo
                    ))
                    
                    # Capturar el ID devuelto
                    new_consulta_id = cur.fetchone()[0]
                    consultas_insertadas += 1

                except Exception as e:
                    print(f"Error insertando consulta para paciente {id_paciente}: {e}")
                    conn.rollback()
                    continue  # Saltar a la siguiente iteración si falla la consulta

                # --- C. Si la consulta se creó, asignar tratamientos ---
                if new_consulta_id:
                    # Decidir cuántos tratamientos asignar (1 a 3)
                    max_trat_posibles = min(3, len(tratamiento_ids))
                    num_tratamientos = random.randint(1, max_trat_posibles)
                    
                    # Seleccionar aleatoriamente Y SIN REPETIR
                    tratamientos_asignados = random.sample(tratamiento_ids, num_tratamientos)
                    
                    for id_tratamiento in tratamientos_asignados:
                        # elegir una dosis y usar la fecha de la consulta como fecha_tratamiento
                        dosis_valor = random.choice(dosis_opciones)
                        fecha_tratamiento_valor = fecha
                        try:
                            # Insertar en la tabla de relación usando patrón WHERE NOT EXISTS
                            # para no depender de una constraint UNIQUE/EXCLUSION en la BD.
                            cur.execute(f"""
                                INSERT INTO {DB_SCHEMA}.consulta_tratamiento (id_consulta, id_tratamiento, id_paciente, dosis, fecha_tratamiento)
                                SELECT %s, %s, %s, %s, %s
                                WHERE NOT EXISTS (
                                    SELECT 1 FROM {DB_SCHEMA}.consulta_tratamiento
                                    WHERE id_consulta = %s AND id_tratamiento = %s
                                );
                            """, (
                                new_consulta_id, id_tratamiento, id_paciente,
                                dosis_valor, fecha_tratamiento_valor,
                                new_consulta_id, id_tratamiento
                            ))

                            # Para INSERT ... SELECT, rowcount será 1 si se insertó, 0 si no (ya existía)
                            if cur.rowcount and cur.rowcount > 0:
                                relaciones_insertadas += 1

                        except Exception as e:
                            print(f"Error insertando relación ({new_consulta_id}, {id_tratamiento}): {e}")
                            conn.rollback() # Solo revertir esta inserción fallida

        # Commit de la transacción final
        conn.commit()
        print(f"\n✅ Proceso completado.")
        print(f"Se insertaron {consultas_insertadas} nuevas consultas.")
        print(f"Se insertaron {relaciones_insertadas} nuevas relaciones en 'consulta_tratamiento'.")

    except psycopg2.OperationalError as e:
        print(f"Error de conexión a la base de datos: {e}")
        print("Asegúrate de que PostgreSQL esté corriendo y las credenciales sean correctas.")
    except Exception as e:
        print(f"Ocurrió un error inesperado: {e}")
        if conn:
            conn.rollback() # Revertir todo si hay un error mayor
    finally:
        # Cerrar cursor y conexión
        if cur:
            cur.close()
        if conn:
            conn.close()
            print("Conexión a la base de datos cerrada.")

if __name__ == "__main__":
    poblar_consultas_y_relaciones()