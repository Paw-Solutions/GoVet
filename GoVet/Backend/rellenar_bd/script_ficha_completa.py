#!/usr/bin/env python3
import psycopg2
from datetime import date, timedelta
import os

# Conexión a la base de datos
conn = psycopg2.connect(
    host=os.getenv('DB_HOST', 'db'),
    dbname=os.getenv('DB_NAME', 'govet'),
    user=os.getenv('POSTGRES_USER', 'postgres'),
    password=os.getenv('POSTGRES_PASSWORD', '')
)
cur = conn.cursor()

# Obtener un paciente existente
cur.execute('SELECT id_paciente FROM govet.paciente LIMIT 1')
id_paciente = cur.fetchone()[0]

# Obtener el RUT del tutor asociado
cur.execute('SELECT rut FROM govet.tutor_paciente WHERE id_paciente = %s LIMIT 1', (id_paciente,))
rut = cur.fetchone()[0]

# Insertar consulta con TODOS los campos
cur.execute('''
    INSERT INTO govet.consulta (
        id_paciente, rut, fecha_consulta, motivo, examen_clinico, diagnostico, 
        observaciones, peso, temperatura, frecuencia_cardiaca, frecuencia_respiratoria, 
        tllc, mucosas, condicion_corporal, estado_pelaje, estado_piel, 
        nodulos_linfaticos, "auscultacion_cardiaca-toraxica", dht, indicaciones_generales
    ) VALUES (
        %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s
    ) RETURNING id_consulta
''', (
    id_paciente, rut, date.today(), 
    'Control completo test CLI', 
    'Examen físico general normal. Mucosas rosadas e hidratadas. Pelaje brillante.',
    'Paciente sano - Control preventivo',
    'Control rutinario. Paciente en buenas condiciones generales.',
    12.5, 38.5, 95, 28, 1.5,
    'Rosadas y brillantes', 'Normal', 'Brillante', 'Normal',
    'Normales', 'Sin hallazgos patológicos', 2, 
    'Mantener dieta actual. Control en 6 meses.'
))

id_consulta = cur.fetchone()[0]
print(f'✅ Consulta creada con ID: {id_consulta}')

# Insertar 2 recetas médicas
cur.execute('''
    INSERT INTO govet.receta_medica (id_consulta, medicamento, dosis, frecuencia, duracion, numero_serie)
    VALUES (%s, %s, %s, %s, %s, %s)
''', (id_consulta, 'Amoxicilina', '500mg', 8, 7, 'ABC123'))
print('✅ Receta 1 agregada: Amoxicilina 500mg cada 8h por 7 días')

cur.execute('''
    INSERT INTO govet.receta_medica (id_consulta, medicamento, dosis, frecuencia, duracion)
    VALUES (%s, %s, %s, %s, %s)
''', (id_consulta, 'Meloxicam', '0.2mg/kg', 24, 5))
print('✅ Receta 2 agregada: Meloxicam 0.2mg/kg cada 24h por 5 días')

# Insertar vacuna (tratamiento)
cur.execute('SELECT id_tratamiento, id_paciente FROM govet.tratamiento t CROSS JOIN (SELECT %s as id_paciente) p WHERE nombre ILIKE %s LIMIT 1', (id_paciente, '%antirrábica%'))
result = cur.fetchone()
if result:
    id_trat_vacuna, id_pac = result
    # Próxima dosis en 1 año (365 días)
    proxima_dosis_vacuna = date.today() + timedelta(days=365)
    cur.execute('''
        INSERT INTO govet.consulta_tratamiento (id_consulta, id_paciente, id_tratamiento, fecha_tratamiento, dosis, marca, numero_serial, proxima_dosis)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    ''', (id_consulta, id_pac, id_trat_vacuna, date.today(), '1ml', 'Rabisin', 'VAC789', proxima_dosis_vacuna))
    print(f'✅ Vacuna agregada: Antirrábica (próxima dosis: {proxima_dosis_vacuna})')

# Insertar antiparasitario
cur.execute('SELECT id_tratamiento FROM govet.tratamiento WHERE nombre ILIKE %s LIMIT 1', ('%Desparasitación Interna%',))
result = cur.fetchone()
if result:
    id_trat_desp = result[0]
    # Próxima dosis en 3 meses (90 días)
    proxima_dosis_desp = date.today() + timedelta(days=90)
    cur.execute('''
        INSERT INTO govet.consulta_tratamiento (id_consulta, id_paciente, id_tratamiento, fecha_tratamiento, dosis, marca, proxima_dosis)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
    ''', (id_consulta, id_paciente, id_trat_desp, date.today(), '1 tableta', 'Bravecto', proxima_dosis_desp))
    print(f'✅ Antiparasitario agregado: Desparasitación Interna (próxima dosis: {proxima_dosis_desp})')

conn.commit()
print(f'\n🎉 Ficha médica completa creada con ID: {id_consulta}')
print(f'   - Paciente ID: {id_paciente}')
print(f'   - Constantes vitales: ✓')
print(f'   - Examen físico: ✓')
print(f'   - Diagnóstico: ✓')
print(f'   - 2 Recetas médicas: ✓')
print(f'   - 1 Vacuna: ✓')
print(f'   - 1 Antiparasitario: ✓')

cur.close()
conn.close()
