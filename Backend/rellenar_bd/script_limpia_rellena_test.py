#!/usr/bin/env python3
"""
Script para LIMPIAR y RELLENAR la base de datos GoVet con datos DE PRUEBA

📋 CARACTERÍSTICAS:
  - 2000 tutores con nombres chilenos aleatorios
  - RUTs válidos con formato chileno
  - Teléfonos +56 9 XXXX XXXX
  - Email: govet. test@atomicmail.io para todos
  - 1-3 pacientes por tutor (aleatorio)
  - Razas y especies del CSV (mantiene igual)
  - Tratamientos predefinidos
  - 0-10 consultas por paciente
  - Tratamientos aplicados en consultas
  - Recetas médicas
  - Datos totalmente ficticios para testing

⚠️  ADVERTENCIA: Este script ELIMINA TODOS LOS DATOS existentes antes de rellenar.
    - NO HAY MARCHA ATRÁS después de ejecutar este script

🔄 ACTUALIZADO: Versión corregida con todas las tablas y campos del esquema SQL
"""

import pandas as pd
import psycopg2
import os
import sys
from datetime import datetime, timedelta
import random

print("="*70)
print("⚠️  SCRIPT DE LIMPIEZA Y RELLENO DE BASE DE DATOS GOVET - DATOS DE PRUEBA")
print("="*70)
print("ADVERTENCIA: Este script eliminará TODOS los datos existentes")
print("y los reemplazará con datos DE PRUEBA ficticios.")
print("="*70)

print("\n🚀 Iniciando proceso de limpieza y relleno.. .\n")

# Conectar PostgreSQL
try:
    conn = psycopg2.connect(
        host=os.getenv("DB_HOST", "localhost"),         
        dbname=os.getenv("DB_NAME", "govet"),
        user=os.getenv("POSTGRES_USER", "postgres"),
        password=os.getenv("POSTGRES_PASSWORD", "")
    )
    cur = conn.cursor()
    print("✅ Conexión a la base de datos exitosa\n")
except Exception as e:
    print(f"❌ Error conectando a la base de datos: {e}")
    sys.exit(1)

# =============================================================================
# DATOS PARA GENERACIÓN ALEATORIA - NOMBRES CHILENOS
# =============================================================================
nombres_comunes = [
    "Juan", "Carlos", "Luis", "Miguel", "José", "Pedro", "Pablo", "Roberto", "Francisco", "Manuel",
    "Ricardo", "Sergio", "Andrés", "Gabriel", "Alejandro", "Eduardo", "Fernando", "Javier", "Raúl", "Mauricio",
    "Rodrigo", "Héctor", "Guillermo", "Ramón", "Claudio", "Marcelo", "Julio", "Alfredo", "Gonzalo", "Enrique",
    "Armando", "Arturo", "Benito", "Camilo", "Darío", "Esteban", "Fabian", "Gerado", "Hugo", "Ignacio",
    "María", "Carmen", "Rosa", "Ana", "Marta", "Elena", "Susana", "Patricia", "Beatriz", "Sandra",
    "Claudia", "Lorena", "Verónica", "Silvia", "Raquel", "Roxana", "Marcela", "Mónica", "Jessica", "Daniela",
    "Pamela", "Tamara", "Javiera", "Fernanda", "Francisca", "Gabriela", "Alejandra", "Andrea", "Catalina", "Evelyn"
]

apellidos_comunes = [
    "García", "Martínez", "López", "Rodríguez", "González", "Pérez", "Fernández", "Sánchez", "Ramírez", "Flores",
    "Morales", "Reyes", "Díaz", "Muñoz", "Vásquez", "Jiménez", "Gutiérrez", "Castro", "Vargas", "Ortiz",
    "Ruiz", "Cortés", "Carrasco", "Soto", "Parra", "Molina", "Herrera", "Valencia", "Lara", "Silva",
    "Rojas", "Cabrera", "Fuentes", "Ojeda", "Riquelme", "Bravo", "Núñez", "Alarcón", "Aguilar", "Acosta",
    "Ayala", "Blanco", "Campos", "Carrillo", "Castillo", "Ciencias", "Concha", "Cruces", "Delgado", "Durán",
    "Espinoza", "Escobar", "Estévez", "Feliciano", "Figueroa", "Fontana", "Frías", "Garrido", "Gómez", "Goyeneche"
]

nombres_mascotas = [
    "Luna", "Toby", "Pelusa", "Max", "Rocky", "Princesa", "Simba", "Coco", 
    "Thor", "Mia", "Lola", "Zeus", "Bruno", "Kira", "Nala", "Duque", "Jack", 
    "Tom", "Negro", "Peque", "Oso", "Lucas", "Sasha", "Apolo", "Boni", "Chester",
    "Caty", "Cholo", "Dina", "Estrella", "Firulais", "Gaston", "Hachiko", 
    "Indy", "Jagger", "Kaiser", "Laika", "Manchitas", "Nieve", "Oddie", "Puky",
    "Queen", "Rambo", "Sam", "Titan", "Uma", "Vinchuka", "Wally", "Xena", "Yago",
    "Zuma", "Bella", "Charlie", "Daisy", "Buddy", "Molly", "Milo", "Maggie"
]

colores_mascotas = [
    "Negro", "Blanco", "Café", "Gris", "Rojo", "Marrón", "Crema", "Mixto", "Tricolor", "Manchado",
    "Atigrado", "Canela", "Chocolate", "Plateado", "Dorado", "Leonado", "Pío", "Brindle"
]

comunas_valdivia = [
    "Valdivia", "Corral", "Paillaco", "Futrono", "Río Bueno", "Mariquina", "Máfil"
]

# =============================================================================
# FUNCIÓN PARA GENERAR RUT VÁLIDO CHILENO
# =============================================================================
def generar_rut_valido():
    """Genera un RUT chileno válido con dígito verificador"""
    numero = random.randint(1000000, 25000000)
    
    # Cálculo del dígito verificador
    s = 0
    m = 2
    for digito in str(numero)[::-1]:
        s += int(digito) * m
        m += 1
        if m > 7:
            m = 2
    
    dv = 11 - (s % 11)
    if dv == 11:
        dv = 0
    elif dv == 10:
        dv = 'k'
    else:
        dv = str(dv)
    
    return f"{numero}-{dv}".lower()

# =============================================================================
# FUNCIÓN PARA GENERAR TELÉFONO CHILENO
# ==============================================================================
def generar_telefono_chileno():
    """Genera un teléfono chileno como número: 569XXXXXXXX"""
    """numero = random.randint(10000000, 99999999)
    return int(f"569{numero:08d}")"""
    numero = 56998624169 # Numero hardcodeado para testeo de whattsapp que no afecte externos
    return numero

# =============================================================================
# FASE 1: LIMPIEZA DE LA BASE DE DATOS
# =============================================================================
print("🗑️  FASE 1: LIMPIANDO BASE DE DATOS")
print("-" * 70)

try:
    # Deshabilitar temporalmente las restricciones de claves foráneas
    print("   🔓 Deshabilitando restricciones de claves foráneas...")
    cur.execute("SET session_replication_role = 'replica';")
    conn.commit()
    
    # Orden de eliminación (respetando dependencias de claves foráneas)
    tablas_a_limpiar = [
        ('receta_medica', 'Recetas médicas'),
        ('consulta_tratamiento', 'Tratamientos de consultas'),
        ('consulta', 'Consultas/Fichas médicas'),
        ('tutor_paciente', 'Relaciones Tutor-Paciente'),
        ('paciente', 'Pacientes'),
        ('raza', 'Razas'),
        ('tratamiento', 'Tratamientos'),
        ('especie', 'Especies'),
        ('tutor', 'Tutores'),
    ]
    
    for tabla, descripcion in tablas_a_limpiar:
        try:
            cur.execute(f"DELETE FROM govet.{tabla};")
            rows_deleted = cur.rowcount
            print(f"   ✅ {descripcion} ({tabla}): {rows_deleted} registros eliminados")
        except Exception as e:
            print(f"   ⚠️  Error limpiando {tabla}: {e}")
    
    conn.commit()
    
    # Reiniciar secuencias (autoincrement)
    print("\n   🔄 Reiniciando secuencias de IDs...")
    secuencias = [
        'especie_id_especie_seq',
        'raza_id_raza_seq',
        'mascota_id_mascota_seq',
        'consulta_id_consulta_seq',
        'consulta_tratamiento_id_aplicacion_seq',
        'tratamiento_id_tratamiento_seq',
        'receta_medica_id_receta_seq',
    ]
    
    for secuencia in secuencias:
        try:
            cur.execute(f"ALTER SEQUENCE govet.{secuencia} RESTART WITH 1;")
            conn.commit()
            print(f"   ✅ Secuencia reiniciada: {secuencia}")
        except Exception as e:
            print(f"   ⚠️  Advertencia reiniciando {secuencia}: {str(e)[:80]}")
            conn.rollback()
    
    # Rehabilitar restricciones de claves foráneas
    print("\n   🔒 Rehabilitando restricciones de claves foráneas...")
    cur.execute("SET session_replication_role = 'origin';")
    conn.commit()
    
    print("\n✅ Limpieza completada exitosamente\n")
    
except Exception as e:
    print(f"\n❌ Error durante la limpieza: {e}")
    conn.rollback()
    cur.execute("SET session_replication_role = 'origin';")
    sys.exit(1)

# =============================================================================
# FASE 2: RELLENO DE LA BASE DE DATOS
# =============================================================================
print("="*70)
print("📊 FASE 2: RELLENANDO BASE DE DATOS CON DATOS DE PRUEBA")
print("="*70)

# =============================================================================
# 1. INSERTAR ESPECIES
# =============================================================================
print("\n📊 1/7 - Insertando ESPECIES...")
try:
    df_especies = pd.read_csv('/app/rellenar_bd/especies.csv', sep=';')
    especies_insertadas = 0
    especies_map = {}
    
    for _, row in df_especies.iterrows():
        nombre = row['nombre_especie']
        nombre_comun = row['nombre_comun']
        id_especie = row['id_especie'] if 'id_especie' in row and pd.notna(row['id_especie']) else None
        
        if pd.notna(nombre):
            if id_especie:
                cur.execute("""
                    INSERT INTO govet.especie (id_especie, nombre_cientifico, nombre_comun)
                    VALUES (%s, %s, %s);
                """, (id_especie, nombre, nombre_comun))
                especies_map[id_especie] = nombre_comun
            else:
                cur.execute("""
                    INSERT INTO govet.especie (nombre_cientifico, nombre_comun)
                    VALUES (%s, %s)
                    RETURNING id_especie;
                """, (nombre, nombre_comun))
                id_esp = cur.fetchone()[0]
                especies_map[id_esp] = nombre_comun
            
            especies_insertadas += 1
    
    conn.commit()
    print(f"   ✅ {especies_insertadas} especies insertadas")
except Exception as e:
    print(f"   ❌ Error insertando especies: {e}")
    conn.rollback()
    sys.exit(1)

# =============================================================================
# 2.  INSERTAR RAZAS
# =============================================================================
print("\n📊 2/7 - Insertando RAZAS...")
try:
    df_razas = pd.read_csv('/app/rellenar_bd/razas.csv', sep=';')
    razas_insertadas = 0
    razas_por_especie = {}
    
    for _, row in df_razas.iterrows():
        nombre = row['nombre']
        id_especie = row['id_especie']
        id_raza = row['id_raza'] if 'id_raza' in row and pd.notna(row['id_raza']) else None
        
        if pd.notna(nombre):
            if id_raza:
                cur.execute("""
                    INSERT INTO govet.raza (id_raza, nombre, id_especie)
                    VALUES (%s, %s, %s);
                """, (id_raza, nombre, id_especie))
            else:
                cur.execute("""
                    INSERT INTO govet.raza (nombre, id_especie)
                    VALUES (%s, %s)
                    RETURNING id_raza;
                """, (nombre, id_especie))
                id_raza = cur.fetchone()[0]
            
            if id_especie not in razas_por_especie:
                razas_por_especie[id_especie] = []
            razas_por_especie[id_especie].append(id_raza)
            
            razas_insertadas += 1
    
    conn.commit()
    print(f"   ✅ {razas_insertadas} razas insertadas")
except Exception as e:
    print(f"   ❌ Error insertando razas: {e}")
    conn.rollback()
    sys.exit(1)

# =============================================================================
# 3. INSERTAR TRATAMIENTOS
# =============================================================================
print("\n📊 3/7 - Insertando TRATAMIENTOS...")
try:
    tratamientos_data = [
        ("Vacuna Séxtuple", "Vacuna contra Distemper, Hepatitis, Leptospirosis, Parvovirus, Parainfluenza y Coronavirus", "vacuna"),
        ("Vacuna Triple Felina", "Vacuna contra Rinotraqueítis, Calicivirus y Panleucopenia", "vacuna"),
        ("Vacuna Antirrábica", "Vacuna contra la rabia", "vacuna"),
        ("Vacuna KC", "Vacuna contra Tos de las Perreras (Bordetella)", "vacuna"),
        ("Vacuna Quíntuple Canina", "Vacuna contra Distemper, Hepatitis, Leptospirosis, Parvovirus y Parainfluenza", "vacuna"),
        ("Vacuna Leucemia Felina", "Vacuna contra el virus de la leucemia felina (FeLV)", "vacuna"),
        ("Desparasitación Interna", "Antiparasitario interno de amplio espectro", "antiparasitario"),
        ("Desparasitación Externa", "Antipulgas y antigarrapatas", "antiparasitario"),
        ("Antiparasitario Total", "Desparasitación interna y externa", "antiparasitario"),
        ("Limpieza Dental", "Profilaxis dental con ultrasonido", "otro"),
        ("Esterilización", "Cirugía de esterilización (castración/ovariohisterectomía)", "otro"),
        ("Curación de Heridas", "Tratamiento y curación de heridas superficiales", "otro"),
        ("Control de Peso", "Plan nutricional y seguimiento", "otro"),
        ("Análisis de Sangre", "Hemograma completo", "otro"),
        ("Ecografía", "Examen ecográfico abdominal", "otro"),
        ("Radiografía", "Estudio radiográfico", "otro"),
        ("Hospitalización", "Internación y monitoreo", "otro"),
        ("Fluidoterapia", "Administración de fluidos intravenosos", "otro"),
    ]
    
    tratamientos_insertados = 0
    for nombre, descripcion, tipo_tratamiento in tratamientos_data:
        cur.execute("""
            INSERT INTO govet.tratamiento (nombre, descripcion, tipo_tratamiento)
            VALUES (%s, %s, %s);
        """, (nombre, descripcion, tipo_tratamiento))
        tratamientos_insertados += 1
    
    conn.commit()
    print(f"   ✅ {tratamientos_insertados} tratamientos insertados")
except Exception as e:
    print(f"   ❌ Error insertando tratamientos: {e}")
    conn.rollback()
    sys.exit(1)

# =============================================================================
# 4. INSERTAR TUTORES DE PRUEBA
# =============================================================================
print("\n📊 4/7 - Generando y insertando 2000 TUTORES DE PRUEBA...")
try:
    tutores_insertados = 0
    tutores_ruts = []
    ruts_usados = set()
    
    for i in range(2000):
        nombre = random.choice(nombres_comunes)
        apellido_paterno = random.choice(apellidos_comunes)
        apellido_materno = random.choice(apellidos_comunes)
        
        while True:
            rut = generar_rut_valido()
            if rut not in ruts_usados:
                ruts_usados.add(rut)
                break
        
        celular = generar_telefono_chileno()
        telefono = None  # Teléfono fijo opcional
        email = "govet.test@atomicmail.io"
        direccion = f"Calle {random.choice(['Los', 'Las', 'El', 'La'])} {random.choice(apellidos_comunes)} {random.randint(100, 9999)}"
        comuna = random.choice(comunas_valdivia)
        region = "Región de Los Ríos"
        observacion = None  # Campo opcional
        
        try:
            cur.execute("""
                INSERT INTO govet.tutor (rut, nombre, apellido_paterno, apellido_materno, 
                                         telefono, email, direccion, celular, celular2,
                                         comuna, region, observacion, telefono2, activo)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
            """, (rut, nombre, apellido_paterno, apellido_materno, 
                  telefono, email, direccion, celular, None,
                  comuna, region, observacion, None, True))
            
            tutores_ruts.append(rut)
            tutores_insertados += 1
            
            if (i + 1) % 500 == 0:
                conn.commit()
                print(f"   ✓ {i + 1} tutores insertados...")
        except Exception as e:
            conn.rollback()
            print(f"   ⚠️  Error insertando tutor {i + 1}: {str(e)[:60]}...  Reintentando...")
            continue
    
    conn.commit()
    print(f"   ✅ {tutores_insertados} tutores insertados")
    print(f"   📋 Total de tutores disponibles: {len(tutores_ruts)}")
except Exception as e:
    print(f"   ❌ Error insertando tutores: {e}")
    conn.rollback()
    sys.exit(1)

# =============================================================================
# 5.  INSERTAR PACIENTES ASOCIADOS A TUTORES
# =============================================================================
print("\n📊 5/7 - Generando y asociando PACIENTES (1-3 por tutor)...")
try:
    pacientes_insertados = 0
    pacientes_por_tutor = {}
    fecha_actual = datetime.now().date()
    
    def fecha_aleatoria():
        """Genera fecha aleatoria últimos 15 años"""
        inicio = datetime.now() - timedelta(days=365*15)
        fin = datetime.now() - timedelta(days=1)
        delta = fin - inicio
        random_days = random.randint(0, delta.days)
        return inicio + timedelta(days=random_days)
    
    for tutor_idx, rut_tutor in enumerate(tutores_ruts):
        num_pacientes = random.randint(1, 3)
        pacientes_por_tutor[rut_tutor] = []
        
        for _ in range(num_pacientes):
            nombre_paciente = random.choice(nombres_mascotas)
            color = random.choice(colores_mascotas)
            sexo = random.choice(['M', 'F'])
            esterilizado = random.choice([True, False])
            fecha_nacimiento = fecha_aleatoria()
            
            id_especie = random.choice(list(razas_por_especie.keys()))
            id_raza = random.choice(razas_por_especie[id_especie])
            
            codigo_chip = None
            if random.random() < 0.8:
                codigo_chip = f"CHIP-{random.randint(100000000, 999999999)}"
            
            try:
                cur.execute("""
                    INSERT INTO govet.paciente (nombre, color, sexo, esterilizado, 
                                               fecha_nacimiento, id_raza, codigo_chip, activo)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                    RETURNING id_paciente;
                """, (nombre_paciente, color, sexo, esterilizado, 
                      fecha_nacimiento, id_raza, codigo_chip, True))
                
                id_paciente = cur.fetchone()[0]
                
                cur.execute("""
                    INSERT INTO govet.tutor_paciente (id_paciente, rut, fecha)
                    VALUES (%s, %s, %s);
                """, (id_paciente, rut_tutor, fecha_actual))
                
                pacientes_por_tutor[rut_tutor].append(id_paciente)
                pacientes_insertados += 1
                
            except Exception as e:
                print(f"   ⚠️  Error insertando paciente para tutor {tutor_idx}: {e}")
                continue
        
        if (tutor_idx + 1) % 300 == 0:
            conn.commit()
            print(f"   ✓ {tutor_idx + 1} tutores procesados ({pacientes_insertados} pacientes)...")
    
    conn.commit()
    print(f"   ✅ {pacientes_insertados} pacientes insertados")
except Exception as e:
    print(f"   ❌ Error insertando pacientes: {e}")
    conn.rollback()
    sys.exit(1)

# =============================================================================
# 6. GENERAR CONSULTAS MÉDICAS (0-10 por paciente)
# =============================================================================
print("\n📊 6/7 - Generando CONSULTAS médicas (0-10 por paciente)...")

motivos_consulta = [
    "Control de rutina", "Vacunación anual", "Desparasitación", "Consulta por vómitos",
    "Consulta por diarrea", "Esterilización", "Control post-operatorio", "Limpieza dental",
    "Problemas dermatológicos", "Cojera o dolor articular", "Control de peso",
    "Problemas respiratorios", "Control geriátrico", "Consulta por apatía",
    "Control de embarazo", "Problemas oculares", "Herida o traumatismo"
]

diagnosticos = [
    "Paciente sano - Control preventivo", "Gastroenteritis leve", "Dermatitis alérgica",
    "Otitis externa", "Displasia de cadera leve", "Obesidad - Plan nutricional",
    "Gingivitis", "Parásitos intestinales", "Artritis degenerativa", "Conjuntivitis",
    "Infección de vías urinarias", "Cojera funcional", "Lipoma benigno",
    "Herida superficial", "Deshidratación leve", "Fiebre de origen desconocido",
    "Anemia leve", "Problemas digestivos", "Control de peso adecuado", "Sin hallazgos anormales"
]

estados_pelaje = ["Normal", "Opaco", "Brillante", "Reseco", "Graso", "Con caspa"]
condiciones_corporales = ["1/5 - Caquéctico", "2/5 - Delgado", "3/5 - Ideal", "4/5 - Sobrepeso", "5/5 - Obeso"]
mucosas = ["Rosadas", "Pálidas", "Congestivas"]
dht_valores = [1, 2, 3, 4, 5, 6]
nodulos_estados = ["Normales", "Aumentados", "Dolorosos", "No palpables"]
auscultacion = ["Normal", "Soplo I/VI", "Frecuencia aumentada", "Crepitaciones leves"]

estados_piel = ["Normal", "Seca", "Grasa", "Lesiones leves", "Dermatitis", "Sin hallazgos"]
examenes_clinicos = [
    "Examen físico completo sin hallazgos anormales",
    "Examen general satisfactorio",
    "Se detectan hallazgos menores",
    "Paciente alerta y reactivo",
    "Animal cooperador durante examen"
]
prediagnosticos = ["Sospecha de gastroenteritis", "Posible alergia alimentaria", "A determinar con exámenes", "Probable infección leve", None]
pronosticos = ["Favorable", "Reservado", "Bueno con tratamiento", "Excelente", None]
indicaciones = ["Reposo relativo por 3 días", "Dieta blanda por 48 horas", "Control en 7 días", "Administrar medicación según indicado", None]

medicamentos = [
    "Amoxicilina", "Meloxicam", "Omeprazol", "Metronidazol", "Enrofloxacina",
    "Prednisona", "Tramadol", "Cefalexina", "Doxiciclina", "Furosemida",
    "Enalapril", "Prednisolona", "Gabapentina", "Ranitidina", "Metoclopramida"
]

dosis_medicamentos = [
    "1 comprimido", "2 comprimidos", "1/2 comprimido", "5 ml", "10 ml",
    "2. 5 ml", "1 ml/kg", "0.5 mg/kg", "10 mg/kg", "5 mg/kg", "1 tableta", "2 tabletas"
]

marcas_productos = [
    "Zoetis", "Bayer", "MSD Animal Health", "Virbac", "Boehringer Ingelheim",
    "Elanco", "Merial", "Fort Dodge", None
]

try:
    consultas_insertadas = 0
    recetas_insertadas = 0
    total_pacientes = sum(len(v) for v in pacientes_por_tutor.values())
    
    cur.execute("SELECT id_tratamiento FROM govet.tratamiento;")
    tratamientos_ids = [row[0] for row in cur.fetchall()]
    
    pacientes_procesados = 0
    for rut_tutor, lista_pacientes in pacientes_por_tutor.items():
        for id_paciente in lista_pacientes:
            num_consultas = random.randint(0, 10)
            
            for _ in range(num_consultas):
                motivo = random.choice(motivos_consulta)
                diagnostico = random.choice(diagnosticos)
                estado_pelaje = random.choice(estados_pelaje)
                peso = round(random.uniform(2.0, 45.0), 2)
                condicion = random.choice(condiciones_corporales)
                mucosa = random.choice(mucosas)
                dht = random.choice(dht_valores)
                nodulos = random.choice(nodulos_estados)
                auscult = random.choice(auscultacion)
                fecha = fecha_aleatoria()
                
                tllc = round(random.uniform(1.0, 3.5), 1)
                estado_piel_valor = random.choice(estados_piel)
                temp = round(random.uniform(37.5, 39.5), 1)
                freq_cardiaca = round(random.uniform(60, 180), 1)
                freq_respiratoria = round(random.uniform(10, 40), 1)
                examen_clinico = random.choice(examenes_clinicos)
                prediagnostico = random.choice(prediagnosticos)
                pronostico = random.choice(pronosticos)
                indicaciones_generales = random.choice(indicaciones)
                
                observacion = random.choice([
                    "Control realizado sin complicaciones",
                    "Se indica tratamiento según diagnóstico",
                    "Próximo control en 7 días",
                    "Se toman muestras para análisis",
                    None
                ])
                
                try:
                    cur.execute("""
                        INSERT INTO govet.consulta (
                            id_paciente, rut, diagnostico, estado_pelaje, peso,
                            condicion_corporal, mucosas, dht, nodulos_linfaticos,
                            "auscultacion_cardiaca-toraxica", observaciones,
                            fecha_consulta, motivo, tllc, estado_piel,
                            frecuencia_respiratoria, frecuencia_cardiaca,
                            examen_clinico, prediagnostico, pronostico,
                            indicaciones_generales, temperatura
                        )
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                        RETURNING id_consulta;
                    """, (id_paciente, rut_tutor, diagnostico, estado_pelaje, peso,
                          condicion, mucosa, dht, nodulos, auscult,
                          observacion, fecha, motivo, tllc, estado_piel_valor,
                          freq_respiratoria, freq_cardiaca, examen_clinico,
                          prediagnostico, pronostico, indicaciones_generales, temp))
                    
                    id_consulta = cur.fetchone()[0]
                    consultas_insertadas += 1
                    
                    if random.random() < 0.6:
                        num_recetas = random.randint(1, 3)
                        
                        for _ in range(num_recetas):
                            medicamento = random.choice(medicamentos)
                            dosis = random.choice(dosis_medicamentos)
                            frecuencia = random.choice([8, 12, 24])
                            duracion = random.choice([3, 5, 7, 10, 14])
                            numero_serie = None
                            if random.random() < 0.3:
                                numero_serie = f"SER-{random.randint(100000, 999999)}"
                            
                            try:
                                cur.execute("""
                                    INSERT INTO govet.receta_medica (
                                        medicamento, dosis, frecuencia,
                                        duracion, numero_serie, id_consulta
                                    )
                                    VALUES (%s, %s, %s, %s, %s, %s);
                                """, (medicamento, dosis, frecuencia, duracion, numero_serie, id_consulta))
                                
                                recetas_insertadas += 1
                            except Exception as e:
                                print(f"   ⚠️  Error insertando receta: {e}")
                                conn.rollback()  # Rollback de la transacción fallida
                                continue
                    
                except Exception as e:
                    print(f"   ⚠️  Error en consulta para paciente {id_paciente}: {e}")
                    conn.rollback()  # Rollback de la transacción fallida
                    continue
            
            pacientes_procesados += 1
            if pacientes_procesados % 500 == 0:
                conn.commit()
                print(f"   ✓ {pacientes_procesados}/{total_pacientes} pacientes procesados ({consultas_insertadas} consultas, {recetas_insertadas} recetas)...")
    
    conn.commit()
    print(f"   ✅ {consultas_insertadas} consultas generadas")
    print(f"   ✅ {recetas_insertadas} recetas médicas generadas")
    
except Exception as e:
    print(f"   ❌ Error generando consultas y recetas: {e}")
    conn.rollback()
    sys.exit(1)

# =============================================================================
# 7.  GENERAR CONSULTA_TRATAMIENTO (aplicaciones)
# =============================================================================
print("\n📊 7/7 - Generando CONSULTA_TRATAMIENTO (aplicaciones)...")

try:
    cur.execute("SELECT id_consulta, id_paciente, fecha_consulta FROM govet.consulta;")
    consultas_data = cur.fetchall()
    
    aplicaciones_insertadas = 0
    
    for id_consulta, id_paciente, fecha_consulta in consultas_data:
        if random.random() < 0.7:
            num_tratamientos = random.randint(1, 3)
            tratamientos_seleccionados = random.sample(tratamientos_ids, min(num_tratamientos, len(tratamientos_ids)))
            
            for id_tratamiento in tratamientos_seleccionados:
                dosis_tratamiento = random.choice(dosis_medicamentos)
                marca = random.choice(marcas_productos)
                
                numero_serial = None
                if random.random() < 0.5:
                    numero_serial = f"LOTE-{random.randint(1000, 9999)}-{random.randint(100, 999)}"
                
                proxima_dosis = None
                if random.random() < 0.4:
                    dias_proxima = random.choice([21, 30, 90, 180, 365])
                    proxima_dosis = fecha_consulta + timedelta(days=dias_proxima)
                
                try:
                    cur.execute("""
                        INSERT INTO govet.consulta_tratamiento (
                            id_paciente, id_consulta, id_tratamiento,
                            dosis, fecha_tratamiento, marca,
                            proxima_dosis, numero_serial
                        )
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s);
                    """, (id_paciente, id_consulta, id_tratamiento, dosis_tratamiento,
                          fecha_consulta, marca, proxima_dosis, numero_serial))
                    
                    aplicaciones_insertadas += 1
                except Exception as e:
                    print(f"   ⚠️  Error insertando aplicación: {e}")
                    conn.rollback()  # Rollback de la transacción fallida
                    continue
    
    conn.commit()
    print(f"   ✅ {aplicaciones_insertadas} aplicaciones de tratamiento generadas")
    
except Exception as e:
    print(f"   ❌ Error generando consulta_tratamiento: {e}")
    conn.rollback()
    sys.exit(1)

# =============================================================================
# RESUMEN FINAL
# =============================================================================
print("\n" + "="*70)
print("✅ PROCESO COMPLETADO EXITOSAMENTE")
print("="*70)

try:
    cur.execute("SELECT COUNT(*) FROM govet.especie")
    total_especies = cur.fetchone()[0]
    
    cur.execute("SELECT COUNT(*) FROM govet.raza")
    total_razas = cur.fetchone()[0]
    
    cur.execute("SELECT COUNT(*) FROM govet.tratamiento")
    total_tratamientos = cur.fetchone()[0]
    
    cur.execute("SELECT COUNT(*) FROM govet.tutor")
    total_tutores = cur.fetchone()[0]
    
    cur.execute("SELECT COUNT(*) FROM govet.paciente")
    total_pacientes = cur.fetchone()[0]
    
    cur.execute("SELECT COUNT(*) FROM govet.tutor_paciente")
    total_relaciones = cur.fetchone()[0]
    
    cur.execute("SELECT COUNT(*) FROM govet.consulta")
    total_consultas = cur.fetchone()[0]
    
    cur.execute("SELECT COUNT(*) FROM govet.consulta_tratamiento")
    total_aplicaciones = cur.fetchone()[0]
    
    cur.execute("SELECT COUNT(*) FROM govet.receta_medica")
    total_recetas = cur.fetchone()[0]
    
    print(f"\n📊 Estado final de la base de datos:")
    print(f"   - Especies: {total_especies}")
    print(f"   - Razas: {total_razas}")
    print(f"   - Tratamientos: {total_tratamientos}")
    print(f"   - Tutores: {total_tutores}")
    print(f"   - Pacientes: {total_pacientes}")
    print(f"   - Relaciones Tutor-Paciente: {total_relaciones}")
    print(f"   - Consultas: {total_consultas}")
    print(f"   - Aplicaciones de Tratamiento: {total_aplicaciones}")
    print(f"   - Recetas médicas: {total_recetas}")
    print(f"\n📧 Email de prueba para todos los tutores: govet.test@atomicmail.io")
    print(f"\n✅ Base de datos limpia y rellenada exitosamente con DATOS DE PRUEBA")
    
except Exception as e:
    print(f"⚠️  Error obteniendo estadísticas finales: {e}")

# Cerrar conexión
cur.close()
conn.close()
print("\n🔒 Conexión cerrada\n")