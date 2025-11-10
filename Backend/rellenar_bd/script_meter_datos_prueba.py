import pandas as pd
import psycopg2
import os
from datetime import date

# EJECUTAR CON:
# docker exec -it govet-backend-1 python /app/rellenar_bd/script_meter_datos_prueba.py

# Conectar PostgreSQL
conn = psycopg2.connect(
    host=os.getenv("DB_HOST", "localhost"),         # valor por defecto localhost
    dbname=os.getenv("DB_NAME", "govet"),
    user=os.getenv("POSTGRES_USER", "postgres"),
    password=os.getenv("POSTGRES_PASSWORD", "")
)
cur = conn.cursor()

# Tutor de prueba 1 Juan
cur.execute("""
        INSERT INTO govet.tutor (rut, nombre, apellido_paterno, apellido_materno, telefono, telefono2, celular, celular2, region, comuna, direccion, email, observacion)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT DO NOTHING;
    """, ("11.111.111-1", "Juan", "apellido1", "apellido2", "123456789", "123456789", "123456789", "123456789", "Los rios", "Valdivia", "calle falsa 11", "correo.electronico@gmail.com", "Tutor de prueba 1"))

# Tutor de prueba 2 Pablo
cur.execute("""
        INSERT INTO govet.tutor (rut, nombre, apellido_paterno, apellido_materno, telefono, telefono2, celular, celular2, region, comuna, direccion, email, observacion)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT DO NOTHING;
    """, ("11.111.112-2", "Pablo", "apellido1", "apellido2", "123456789", "123456789", "123456789", "123456789", "Los lagos", "Osorno", "calle falsa 22", "correo.electronico153@gmail.com", "Tutor de prueba 2"))

# Paciente de prueba 
cur.execute("""
    INSERT INTO govet.paciente (id_paciente, nombre, color, sexo, esterilizado, fecha_nacimiento, id_raza, codigo_chip)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    ON CONFLICT DO NOTHING;
""", (100000, "Juan", "Blanco", "M", False, "2024-02-01", 1, ""))

# Relacion paciente y tutor Juan
cur.execute("""
            INSERT INTO govet.tutor_paciente (id_paciente, rut)
            VALUES (%s, %s)
            ON CONFLICT DO NOTHING;
        """, (100000, "11.111.111-1"))

# Consulta
cur.execute("""
    INSERT INTO govet.consulta (
        id_paciente, rut, diagnostico, estado_pelaje, peso, condicion_corporal,
        mucosas, dht, nodulos_linfaticos, "auscultacion_cardiaca-toraxica",
        observaciones, fecha_consulta, motivo
    )
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    ON CONFLICT DO NOTHING;
""", (
    100000,                        
    "11.111.111-1",                
    "Chequeo general",            
    "Normal",                     
    12.4,                          
    "Buena",                       
    "Rosas",                       
    "Normal",                      
    "Sin inflamación",             
    "Ritmo cardiaco normal",      
    "Mascota tranquila y en buen estado",  
    date(2025, 10, 1),             
    "Revisión anual"               
))


conn.commit()
cur.close()
conn.close()
