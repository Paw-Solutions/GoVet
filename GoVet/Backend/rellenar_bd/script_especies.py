import pandas as pd
import psycopg2
import os

# Leer CSV
df = pd.read_csv('/app/rellenar_bd/especies.csv', sep=';')

# Conectar PostgreSQL
conn = psycopg2.connect(
    host=os.getenv("DB_HOST", "localhost"),         # valor por defecto localhost
    dbname=os.getenv("DB_NAME", "govet"),
    user=os.getenv("POSTGRES_USER", "postgres"),
    password=os.getenv("POSTGRES_PASSWORD", "")
)
cur = conn.cursor()

# Insertar especies
for _, row in df.iterrows():
    nombre = row['nombre_especie']
    nombre_comun = row['nombre_comun']
    if pd.notna(nombre):
        cur.execute("""
            INSERT INTO govet.especie (id_especie, nombre_cientifico, nombre_comun)
            VALUES (DEFAULT, %s, %s)
            ON CONFLICT DO NOTHING;
        """, (nombre, nombre_comun))

conn.commit()
cur.close()
conn.close()
