import pandas as pd
import psycopg2
import os

# Leer CSV
df = pd.read_csv('/app/rellenar_bd/razas.csv', sep=';')

# Conectar PostgreSQL
conn = psycopg2.connect(
    host=os.getenv("DB_HOST", "localhost"),         
    dbname=os.getenv("DB_NAME", "govet"),
    user=os.getenv("POSTGRES_USER", "postgres"),
    password=os.getenv("POSTGRES_PASSWORD", "")
)
cur = conn.cursor()

# Insertar razas
for _, row in df.iterrows():
    nombre = row['nombre']
    id_especie = row['id_especie']
    if pd.notna(nombre):
        cur.execute("""
            INSERT INTO govet.raza (id_raza, nombre, id_especie)
            VALUES (DEFAULT, %s, %s)
            ON CONFLICT DO NOTHING;
        """, (nombre, id_especie))

conn.commit()
cur.close()
conn.close()
