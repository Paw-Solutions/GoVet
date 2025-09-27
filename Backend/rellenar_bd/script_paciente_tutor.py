import pandas as pd
import psycopg2
import os

# Leer CSV
df = pd.read_csv('/app/rellenar_bd/paciente_tutor.csv', sep=';')

# Conectar PostgreSQL
conn = psycopg2.connect(
    host=os.getenv("DB_HOST", "localhost"),         
    dbname=os.getenv("DB_NAME", "govet"),
    user=os.getenv("POSTGRES_USER", "postgres"),
    password=os.getenv("POSTGRES_PASSWORD", "")
)
cur = conn.cursor()

# Insertar pacientes
for _, row in df.iterrows():
    id_paciente = row['ID_MASCOTA']
    rut_tutor = row['RUT_TUTOR_CON_DATOS']
    

    if pd.notna(rut_tutor):

        rut_tutor = rut_tutor.lower()

        cur.execute("""
            INSERT INTO govet.tutor_paciente (id_paciente, rut)
            VALUES (%s, %s)
            ON CONFLICT DO NOTHING;
        """, (id_paciente, rut_tutor))


conn.commit()
cur.close()
conn.close()
