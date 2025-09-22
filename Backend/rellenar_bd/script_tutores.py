import pandas as pd
import psycopg2
import os

# Leer CSV
df = pd.read_csv('/app/rellenar_bd/tutores.csv', sep=';')

# Conectar PostgreSQL
conn = psycopg2.connect(
    host=os.getenv("DB_HOST", "localhost"),         
    dbname=os.getenv("DB_NAME", "govet"),
    user=os.getenv("POSTGRES_USER", "postgres"),
    password=os.getenv("POSTGRES_PASSWORD", "")
)
cur = conn.cursor()

# Insertar tutores
for _, row in df.iterrows():
    rut = row['Rut']
    nombres = row['Nombres']
    apellidoPaterno = row['ApPaterno']
    apellidoMaterno = row['ApMaterno']
    direccion = row['Direccion']
    region = row['Region']
    comuna = row['Comuna']
    telefono1 = (row['Telefono'])
    telefono2 = (row['Telefono2'])
    celular1 = (row['Celular'])
    celular2 = (row['Celular2'])
    email = row['Email']
    observacion = row['Observaciones']

    if pd.notna(telefono1):
        telefono1 = int(telefono1)
    else:
        telefono1 = None

    if pd.notna(telefono2):
        telefono2 = int(telefono2)
    else:
        telefono2 = None

    if pd.notna(celular1):
        celular1 = int(celular1)
    else:
        celular1 = None

    if pd.notna(celular2):
        celular2 = int(celular2)
    else:
        celular2 = None

    cur.execute("""
        INSERT INTO govet.tutor (rut, nombre, apellido_paterno, apellido_materno, telefono, telefono2, celular, celular2, region, comuna, direccion, email, observacion)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT DO NOTHING;
    """, (rut, nombres, apellidoPaterno, apellidoMaterno, telefono1, telefono2, celular1, celular2, region, comuna, direccion, email, observacion))


conn.commit()
cur.close()
conn.close()
