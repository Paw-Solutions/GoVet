# Scripts de Relleno de Base de Datos GoVet

Este directorio contiene scripts para poblar la base de datos GoVet con datos iniciales.

## 📂 Archivos Disponibles

### Scripts Principales

1. **`script_rellena_ERTPPt.py`** - Relleno sin limpieza

   - Agrega datos sin eliminar los existentes
   - Genera consultas médicas aleatorias (1-4 por paciente)
   - Usa `ON CONFLICT DO NOTHING` para evitar duplicados
   - Seguro para ejecutar múltiples veces
   - ✅ **Recomendado para agregar datos adicionales**

2. **`script_limpia_rellena_ERTPPt.py`** - Limpieza completa y relleno
   - ⚠️ **ELIMINA TODOS LOS DATOS** existentes
   - Reinicia las secuencias (IDs) desde 1
   - Rellena con datos limpios desde cero
   - Genera consultas médicas aleatorias (1-4 por paciente)
   - ⚠️ **NO HAY MARCHA ATRÁS** - usar con precaución

### Scripts Individuales (legacy)

- `script_especies.py` - Solo especies
- `script_razas.py` - Solo razas
- `script_tutores.py` - Solo tutores
- `script_pacientes.py` - Solo pacientes
- `script_paciente_tutor.py` - Solo relaciones tutor-paciente
- `script_consultas.py` - Genera consultas médicas de prueba

## 🚀 Uso

### Opción 1: Relleno sin limpieza (Seguro)

```bash
# Desde el directorio raíz del proyecto
docker-compose exec backend python /app/rellenar_bd/script_rellena_ERTPPt.py
```

Este script:

- ✅ Preserva los datos existentes
- ✅ Agrega nuevos registros de los CSV
- ✅ Genera consultas médicas aleatorias (1-4 por paciente)
- ✅ Ignora duplicados automáticamente
- ✅ Seguro para producción

### Opción 2: Limpieza completa y relleno (⚠️ DESTRUCTIVO)

```bash
# Desde el directorio raíz del proyecto
docker-compose exec backend python /app/rellenar_bd/script_limpia_rellena_ERTPPt.py
```

⚠️ **ADVERTENCIA**: Este script:

- ❌ ELIMINA todas las consultas
- ❌ ELIMINA todas las relaciones tutor-paciente
- ❌ ELIMINA todos los pacientes
- ❌ ELIMINA todos los tutores
- ❌ ELIMINA todas las razas
- ❌ ELIMINA todas las especies
- ❌ ELIMINA todos los tratamientos
- 🔄 Reinicia los IDs a 1
- ✅ Rellena con datos desde cero

**Solo usar en desarrollo o cuando necesites resetear completamente la BD**

## 📊 Orden de Inserción (ERTPPtC)

Los scripts siguen este orden para respetar las dependencias de claves foráneas:

1. **E** - Especies (`govet.especie`)
2. **R** - Razas (`govet.raza`) - Depende de Especies
3. **T** - Tutores (`govet.tutor`)
4. **P** - Pacientes (`govet.paciente`) - Depende de Razas
5. **Pt** - Paciente_Tutor (`govet.tutor_paciente`) - Depende de Tutores y Pacientes
6. **C** - Consultas (`govet.consulta`) - Depende de Pacientes y Tutores

## 📁 Archivos CSV Requeridos

Los scripts buscan estos archivos en `/app/rellenar_bd/`:

- `especies.csv` - Lista de especies (perros, gatos, etc.)
- `razas.csv` - Razas asociadas a especies
- `tutores.csv` - Información de dueños/tutores
- `pacientes.csv` - Datos de mascotas/pacientes
- `paciente_tutor.csv` - Relaciones entre tutores y sus mascotas

### Formato de CSV

Todos los CSV deben usar:

- **Separador**: `;` (punto y coma)
- **Encoding**: UTF-8
- **Headers**: Primera fila con nombres de columnas

## 🏥 Generación de Consultas Médicas

Los scripts generan automáticamente consultas (fichas médicas) para demostración:

### Características:

- **Cantidad**: 1 a 4 consultas por paciente
- **Fechas**: Aleatorias entre 2023-2024
- **Datos realistas**:
  - Motivos de consulta (vacunación, control, emergencias, etc.)
  - Diagnósticos específicos por especie (perros vs gatos)
  - Examen físico completo (peso, pelaje, mucosas, DHT, etc.)
  - Pesos apropiados por especie:
    - Perros: 2.5kg - 45kg
    - Gatos: 2kg - 8kg

### Diagnósticos incluidos:

**Perros**: Gastroenteritis, dermatitis alérgica, otitis externa, displasia de cadera, obesidad, gingivitis, artritis, entre otros.

**Gatos**: Dermatitis por pulgas, otitis por ácaros, enfermedad renal crónica, cistitis idiopática felina, hipertiroidismo, entre otros.

### Datos generados:

- Motivo de consulta
- Diagnóstico
- Estado del pelaje
- Peso
- Condición corporal (1/5 a 5/5)
- Mucosas (rosadas, pálidas, congestivas, etc.)
- DHT (tiempo de llenado capilar)
- Nódulos linfáticos
- Auscultación cardíaca-torácica
- Observaciones (opcionales)

## 🔍 Verificación

Después de ejecutar cualquier script, verás un resumen:

```
📊 Total en base de datos:
   - Especies: XX
   - Razas: XXX
   - Tutores: XXX
   - Pacientes: XXX
   - Relaciones Tutor-Paciente: XXX
   - Consultas: XXX
```

### Verificar manualmente desde PostgreSQL:

```sql
-- Contar registros
SELECT COUNT(*) FROM govet.especie;
SELECT COUNT(*) FROM govet.raza;
SELECT COUNT(*) FROM govet.tutor;
SELECT COUNT(*) FROM govet.paciente;
SELECT COUNT(*) FROM govet.tutor_paciente;
SELECT COUNT(*) FROM govet.consulta;

-- Ver últimos registros
SELECT * FROM govet.paciente ORDER BY id_paciente DESC LIMIT 10;
SELECT * FROM govet.tutor ORDER BY rut LIMIT 10;
SELECT * FROM govet.consulta ORDER BY fecha_consulta DESC LIMIT 10;
```

## ⚙️ Variables de Entorno

Los scripts usan estas variables de entorno (configuradas en docker-compose.yml):

- `DB_HOST` - Host de PostgreSQL (default: "localhost")
- `DB_NAME` - Nombre de la base de datos (default: "govet")
- `POSTGRES_USER` - Usuario de PostgreSQL (default: "postgres")
- `POSTGRES_PASSWORD` - Contraseña de PostgreSQL

## 🐛 Troubleshooting

### Error: "Import pandas could not be resolved"

Esto es solo una advertencia del linter. Los scripts funcionan correctamente dentro del contenedor Docker que tiene pandas instalado.

### Error: "File not found"

Asegúrate de que los archivos CSV existen en `Backend/rellenar_bd/`:

```bash
ls -la Backend/rellenar_bd/*.csv
```

### Error: "Permission denied"

Dale permisos de ejecución al script:

```bash
chmod +x Backend/rellenar_bd/script_*.py
```

### Error: "Connection refused"

Verifica que la base de datos esté corriendo:

```bash
docker-compose ps
```

## 📝 Notas

- Los scripts usan `ON CONFLICT DO NOTHING` en el script de relleno para evitar duplicados
- El script de limpieza desactiva temporalmente las restricciones FK durante la limpieza
- Los RUTs se convierten a minúsculas automáticamente para consistencia
- Las secuencias de IDs se reinician solo con el script de limpieza

## 🔐 Seguridad

- El script de limpieza tiene una confirmación comentada (líneas 37-40)
- Descomenta esas líneas para agregar confirmación manual antes de limpiar
- En producción, **NUNCA** uses el script de limpieza sin backup

## 🆘 Soporte

Si encuentras problemas:

1. Revisa los logs del contenedor: `docker-compose logs backend`
2. Verifica la conexión a la BD: `docker-compose exec backend psql -U postgres -d govet`
3. Consulta el estado de las tablas con las queries de verificación
