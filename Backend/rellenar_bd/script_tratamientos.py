import psycopg2
import os
import csv
import sys
""" Ejecutar: """
# docker exec -it govet-backend-1  python /app/rellenar_bd/script_tratamientos.py

# --- Configuración de la Conexión ---
# Lee las variables de entorno o usa valores por defecto
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_NAME = os.getenv("DB_NAME", "govet")
DB_USER = os.getenv("POSTGRES_USER", "postgres")
DB_PASSWORD = os.getenv("POSTGRES_PASSWORD", "")
DB_SCHEMA = "govet"
# El CSV puede pasarse por variable de entorno CSV_FILE_PATH.
# Por defecto buscamos el archivo junto a este script (más robusto dentro de contenedores).
THIS_DIR = os.path.dirname(os.path.abspath(__file__))
CSV_FILE_NAME = os.getenv("CSV_FILE_PATH", os.path.join(THIS_DIR, "tratamientos.csv"))

def poblar_tratamientos():
    """
    Lee un archivo CSV y carga los datos en la tabla govet.tratamiento.
    """
    
    # Verificar si el archivo CSV existe (mostramos la ruta buscada para depuración)
    if not os.path.exists(CSV_FILE_NAME):
        print(f"Error: No se encontró el archivo CSV en la ruta esperada: '{CSV_FILE_NAME}'")
        print("Asegúrate de que el archivo exista en esa ruta dentro del contenedor o exporta CSV_FILE_PATH con la ruta correcta.")
        sys.exit(1)

    conn = None
    cur = None
    tratamientos_insertados = 0
    
    try:
        # Conectar a la base de datos PostgreSQL
        conn = psycopg2.connect(
            host=DB_HOST,
            dbname=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD
        )
        cur = conn.cursor()
        print("Conexión a la base de datos establecida exitosamente.")

        # Abrir y leer el archivo CSV
        with open(CSV_FILE_NAME, mode='r', encoding='utf-8') as file:
            # Usar DictReader para leer el CSV como un diccionario
            reader = csv.DictReader(file)
            
            for row in reader:
                nombre = row.get('nombre')
                descripcion = row.get('descripcion')
                
                # Validar que los datos no estén vacíos
                if not nombre or not descripcion:
                    print(f"Advertencia: Se omitió una fila por datos incompletos: {row}")
                    continue

                try:
                    # Insertar datos en la tabla evitando duplicados SIN depender de
                    # una constraint UNIQUE en la columna 'nombre'. Usamos una
                    # INSERT ... SELECT ... WHERE NOT EXISTS(...) que funciona
                    # aunque la tabla no tenga un índice único.
                    cur.execute(f"""
                        INSERT INTO {DB_SCHEMA}.tratamiento (nombre, descripcion)
                        SELECT %s, %s
                        WHERE NOT EXISTS (
                            SELECT 1 FROM {DB_SCHEMA}.tratamiento WHERE nombre = %s
                        );
                    """, (nombre, descripcion, nombre))

                    # rowcount será 1 si se insertó, 0 si ya existía
                    if cur.rowcount and cur.rowcount > 0:
                        tratamientos_insertados += 1
                        
                except Exception as e:
                    print(f"Error insertando tratamiento '{nombre}': {e}")
                    conn.rollback()  # Revertir esta inserción fallida
                
        # Commit de la transacción final
        conn.commit()
        print(f"\n Se insertaron {tratamientos_insertados} nuevos tratamientos exitosamente.")
        
        # Consultar total para confirmar
        cur.execute(f"SELECT COUNT(*) FROM {DB_SCHEMA}.tratamiento")
        total_tratamientos = cur.fetchone()[0]
        print(f"Total de tratamientos en la tabla: {total_tratamientos}")

    except psycopg2.OperationalError as e:
        print(f"Error de conexión a la base de datos: {e}")
        print("Asegúrate de que PostgreSQL esté corriendo y las credenciales (host, dbname, user, password) sean correctas.")
    except Exception as e:
        print(f"Ocurrió un error inesperado: {e}")
        if conn:
            conn.rollback() # Revertir todo si hay un error mayor
    finally:
        # Cerrar cursor y conexión
        if cur:
            cur.close()
        if conn:
            conn.close()
            print("Conexión a la base de datos cerrada.")

if __name__ == "__main__":
    poblar_tratamientos()