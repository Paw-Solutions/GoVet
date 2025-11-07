# Script para Generar Consultas Médicas

Este script genera consultas médicas veterinarias de prueba para la base de datos GoVet.

## 📋 Descripción

El script `script_consultas.py` crea consultas médicas realistas con:

- **Motivos de consulta** variados (controles, vacunaciones, emergencias, etc.)
- **Diagnósticos** específicos según la especie (perros vs gatos)
- **Datos clínicos** completos (peso, condición corporal, mucosas, etc.)
- **Fechas** aleatorias entre 2023-2024
- Entre **1 y 4 consultas** por paciente

## 🎯 Características

### Motivos de Consulta (20 tipos)

- Control de rutina
- Vacunación anual
- Desparasitación
- Consultas por síntomas específicos
- Controles post-operatorios
- Y más...

### Diagnósticos Veterinarios

**Para Perros (15 diagnósticos)**

- Paciente sano - Control preventivo
- Gastroenteritis leve
- Dermatitis alérgica
- Otitis externa
- Displasia de cadera leve
- Obesidad - Plan nutricional
- Y más...

**Para Gatos (15 diagnósticos)**

- Paciente sano - Control preventivo
- Gastroenteritis leve
- Dermatitis por pulgas
- Enfermedad renal crónica inicial
- Cistitis idiopática felina
- Y más...

### Datos Clínicos Incluidos

- ✅ Estado del pelaje (7 opciones)
- ✅ Peso aleatorio según especie
  - Perros: 2.5kg - 45kg
  - Gatos: 2kg - 8kg
- ✅ Condición corporal (escala 1/5 a 5/5)
- ✅ Estado de mucosas
- ✅ DHT (tiempo de llenado capilar)
- ✅ Nódulos linfáticos
- ✅ Auscultación cardíaca-torácica
- ✅ Observaciones clínicas

## 🚀 Uso

### Opción 1: Ejecutar en Docker (Recomendado)

```bash
# Desde el directorio raíz del proyecto
docker-compose exec backend python /app/rellenar_bd/script_consultas.py
```

### Opción 2: Ejecutar localmente

```bash
# Asegúrate de tener las variables de entorno configuradas
cd Backend/rellenar_bd
python script_consultas.py
```

## 📊 Variables de Entorno Requeridas

El script usa estas variables de entorno (configuradas en docker-compose.yml):

```bash
DB_HOST=dbase          # Host de la base de datos
DB_NAME=govet          # Nombre de la base de datos
POSTGRES_USER=postgres # Usuario de PostgreSQL
POSTGRES_PASSWORD=     # Contraseña de PostgreSQL
```

## 📈 Resultados Esperados

- ✅ Genera **100-400 consultas** aproximadamente (depende del número de pacientes)
- ✅ Cada paciente tendrá entre **1 y 4 consultas**
- ✅ Las consultas tienen **fechas aleatorias** entre 2023-2024
- ✅ Datos clínicos **realistas y variados**
- ✅ Diagnósticos **apropiados según la especie**

## ⚠️ Requisitos Previos

Antes de ejecutar este script, asegúrate de haber ejecutado:

1. ✅ `script_especies.py` - Especies
2. ✅ `script_razas.py` - Razas
3. ✅ `script_tutores.py` - Tutores
4. ✅ `script_pacientes.py` - Pacientes
5. ✅ `script_paciente_tutor.py` - Relación Paciente-Tutor

## 🔍 Validación

Para verificar que las consultas se insertaron correctamente:

```sql
-- Ver total de consultas
SELECT COUNT(*) FROM govet.consulta;

-- Ver consultas recientes
SELECT
    c.id_consulta,
    p.nombre as paciente,
    c.motivo,
    c.diagnostico,
    c.fecha_consulta
FROM govet.consulta c
INNER JOIN govet.paciente p ON c.id_paciente = p.id_paciente
ORDER BY c.fecha_consulta DESC
LIMIT 10;

-- Ver consultas por paciente
SELECT
    p.nombre,
    COUNT(c.id_consulta) as total_consultas
FROM govet.paciente p
LEFT JOIN govet.consulta c ON p.id_paciente = c.id_paciente
GROUP BY p.nombre
ORDER BY total_consultas DESC;
```

## 🛠️ Personalización

Puedes modificar el script para:

- Cambiar el rango de fechas (línea 60-65)
- Ajustar el número de consultas por paciente (línea 70)
- Agregar más motivos de consulta (línea 32-51)
- Agregar más diagnósticos (líneas 53-95)
- Modificar rangos de peso (líneas 107-111)

## 📝 Notas

- El script solo procesa los primeros **100 pacientes** que tienen tutor asignado
- Las observaciones son opcionales (algunas consultas no tendrán observaciones)
- Los datos son **ficticios** y sirven solo para pruebas
- Se usa `ON CONFLICT DO NOTHING` para evitar duplicados (si se re-ejecuta)

## 🐛 Troubleshooting

**Error: No se encontraron pacientes**

```bash
# Verifica que existan pacientes con tutores
docker-compose exec dbase psql -U postgres -d govet -c "SELECT COUNT(*) FROM govet.tutor_paciente;"
```

**Error de conexión a la base de datos**

```bash
# Verifica que el contenedor de base de datos esté corriendo
docker-compose ps
```

**Error: Duplicate key**

```bash
# El script maneja esto automáticamente, pero puedes limpiar las consultas:
docker-compose exec dbase psql -U postgres -d govet -c "TRUNCATE TABLE govet.consulta CASCADE;"
```
