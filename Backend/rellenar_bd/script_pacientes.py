import pandas as pd
import psycopg2
import os

# Leer CSV
df = pd.read_csv('/app/rellenar_bd/pacientes.csv', sep=';')

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
    nombre = row['NOMBRE']
    color = row['COLOR']
    sexo = row['SEXO_SIGLA']
    esterilizado = row['ESTERILIZADO']
    if pd.notna(esterilizado):
        esterilizado = bool(int(esterilizado))
    else:
        esterilizado = None
    fecha_nacimiento = row['FECHA NACIMIENTO']
    id_raza = row['ID_RAZA']
    codigo_chip = row['CHIP']

    if pd.notna(nombre):
        cur.execute("""
            INSERT INTO govet.paciente (id_paciente, nombre, color, sexo, esterilizado, fecha_nacimiento, id_raza, codigo_chip)
            VALUES (DEFAULT, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT DO NOTHING;
        """, (nombre, color, sexo, esterilizado, fecha_nacimiento, id_raza, codigo_chip))


conn.commit()
cur.close()
conn.close()
