import psycopg2
import os

# EJECUTAR CON:
# docker exec -it govet-backend-1 python /app/rellenar_bd/script_eliminar_datos_prueba.py

# Conectar a PostgreSQL
conn = psycopg2.connect(
    host=os.getenv("DB_HOST", "localhost"),
    dbname=os.getenv("DB_NAME", "govet"),
    user=os.getenv("POSTGRES_USER", "postgres"),
    password=os.getenv("POSTGRES_PASSWORD", "")
)
cur = conn.cursor()

# Eliminar dependencias primero (para evitar errores por FK)
# 1. Eliminar consultas del paciente de prueba
cur.execute("""
    DELETE FROM govet.consulta
    WHERE id_paciente = %s;
""", (100000,))

# 2. Eliminar relación tutor-paciente
cur.execute("""
    DELETE FROM govet.tutor_paciente
    WHERE id_paciente = %s OR rut IN (%s, %s);
""", (100000, "11.111.111-1", "11.111.112-2"))

# 3. Eliminar paciente de prueba
cur.execute("""
    DELETE FROM govet.paciente
    WHERE id_paciente = %s;
""", (100000,))

# 4. Eliminar tutores de prueba
cur.execute("""
    DELETE FROM govet.tutor
    WHERE rut IN (%s, %s);
""", ("11.111.111-1", "11.111.112-2"))

conn.commit()
cur.close()
conn.close()

print("✅ Datos de prueba eliminados correctamente.")
