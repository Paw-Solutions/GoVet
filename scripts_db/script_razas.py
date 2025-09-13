import pandas as pd
import psycopg2

# Leer CSV
df = pd.read_csv('razas.csv', sep=';')

# Conectar PostgreSQL
conn = psycopg2.connect(
    host="localhost",
    dbname="govet",
    user="postgres",
    password=""
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
