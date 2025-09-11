import pandas as pd
import psycopg2

# Leer CSV
df = pd.read_csv('especies.csv', sep=';')

# Conectar PostgreSQL
conn = psycopg2.connect(
    host="localhost",
    dbname="govet_db",
    user="postgres",
    password=""
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
