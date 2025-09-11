import pandas as pd
import psycopg2

# Leer CSV
df = pd.read_csv('pacientes.csv', sep=';')

# Conectar PostgreSQL
conn = psycopg2.connect(
    host="localhost",
    dbname="govet_db",
    user="postgres",
    password=""
)
cur = conn.cursor()

# Insertar pacientes
for _, row in df.iterrows():
    nombre = row['NOMBRE']
    color = row['COLOR']
    sexo = row['SEXO_SIGLA']
    esterelizado = row['ESTERILIZADO']
    if pd.notna(esterelizado):
        esterelizado = bool(int(esterelizado))
    else:
        esterelizado = None
    fecha_nacimiento = row['FECHA NACIMIENTO']
    id_raza = row['ID_RAZA']
    codigo_chip = row['CHIP']

    if pd.notna(nombre):
        cur.execute("""
            INSERT INTO govet.paciente (id_paciente, nombre, color, sexo, esterelizado, fecha_nacimiento, id_raza, codigo_chip)
            VALUES (DEFAULT, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT DO NOTHING;
        """, (nombre, color, sexo, esterelizado, fecha_nacimiento, id_raza, codigo_chip))


conn.commit()
cur.close()
conn.close()
