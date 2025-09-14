import pandas as pd
import psycopg2

# Leer CSV
df = pd.read_csv('pacientes.csv', sep=';')

# Conectar PostgreSQL
conn = psycopg2.connect(
    host="localhost",
    dbname="govet",
    user="postgres",
    password=""
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
