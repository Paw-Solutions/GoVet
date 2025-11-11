# 📚 API: Obtener Pacientes por Tutor

## ✅ Función Implementada

### 📍 Ubicación

`Frontend/src/api/pacientes.ts`

---

## 📝 Función: `obtenerPacientesPorTutor`

### **Descripción**

Obtiene todos los pacientes asociados a un tutor específico mediante su RUT.

### **Firma**

```typescript
export async function obtenerPacientesPorTutor(
  rutTutor: string
): Promise<PacienteData[]>;
```

### **Parámetros**

- `rutTutor` (string): RUT del tutor (ej: "12345678-9")

### **Retorna**

- `Promise<PacienteData[]>`: Array de pacientes asociados al tutor

### **Errores**

Lanza un error si:

- La petición HTTP falla
- El servidor responde con un código de error
- El RUT del tutor no existe

---

## 🔧 Implementación

```typescript
export async function obtenerPacientesPorTutor(
  rutTutor: string
): Promise<PacienteData[]> {
  try {
    console.log(`Obteniendo pacientes del tutor ${rutTutor}...`);
    const response = await fetch(
      `${API_URL}/tutores/${encodeURIComponent(rutTutor)}/pacientes`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      throw new Error(
        `Error ${response.status} al obtener pacientes del tutor: ${errorText}`
      );
    }

    const data = await response.json();
    console.log(`Pacientes del tutor ${rutTutor} obtenidos:`, data);
    return data as PacienteData[];
  } catch (error) {
    console.error(`Error obteniendo pacientes del tutor ${rutTutor}:`, error);
    throw error;
  }
}
```

---

## 🚀 Uso

### **Ejemplo Básico**

```typescript
import { obtenerPacientesPorTutor } from "../api/pacientes";

const rutTutor = "12345678-9";

try {
  const pacientes = await obtenerPacientesPorTutor(rutTutor);
  console.log("Pacientes encontrados:", pacientes);
  // pacientes es un array de PacienteData
} catch (error) {
  console.error("Error:", error);
}
```

### **Ejemplo en Componente React**

```typescript
import { useState, useEffect } from "react";
import { obtenerPacientesPorTutor, PacienteData } from "../api/pacientes";

const MiComponente = () => {
  const [pacientes, setPacientes] = useState<PacienteData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const cargarPacientes = async (rutTutor: string) => {
    setLoading(true);
    setError("");
    try {
      const data = await obtenerPacientesPorTutor(rutTutor);
      setPacientes(data);
    } catch (err) {
      setError("Error al cargar pacientes");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPacientes("12345678-9");
  }, []);

  return (
    <div>
      {loading && <p>Cargando...</p>}
      {error && <p>{error}</p>}
      {pacientes.map((p) => (
        <div key={p.id_paciente}>{p.nombre}</div>
      ))}
    </div>
  );
};
```

### **Ejemplo en ModalAgendarCita**

```typescript
// Carga automática cuando se selecciona un tutor
useEffect(() => {
  const cargarPacientes = async () => {
    if (tutorSeleccionado?.rut) {
      setLoadingPacientes(true);
      try {
        const pacientes = await obtenerPacientesPorTutor(tutorSeleccionado.rut);
        setPacientesDelTutor(pacientes);
      } catch (error) {
        console.error("Error cargando pacientes:", error);
        present({
          message: "Error al cargar pacientes del tutor",
          duration: 3000,
          color: "danger",
        });
        setPacientesDelTutor([]);
      } finally {
        setLoadingPacientes(false);
      }
    }
  };

  cargarPacientes();
}, [tutorSeleccionado]);
```

---

## 📊 Interface: PacienteData

```typescript
export interface PacienteData {
  id_paciente: number;
  nombre: string;
  fecha_nacimiento: string | null;
  color: string | null;
  esterilizado: boolean | null;
  id_raza: number | null;
  raza: string | null;
  especie: string | null;
  tutor: {
    nombre: string | null;
    apellido_paterno: string | null;
    apellido_materno: string | null;
    rut: string | null;
    telefono: number | null;
    email: string | null;
  } | null;
  sexo?: string;
  codigo_chip?: string;
}
```

---

## 🔗 Endpoint Backend Requerido

### **URL**

```
GET /tutores/{rut}/pacientes
```

### **Parámetros de URL**

- `rut`: RUT del tutor (ej: "12345678-9")

### **Respuesta Exitosa (200)**

```json
[
  {
    "id_paciente": 1,
    "nombre": "Firulais",
    "fecha_nacimiento": "2020-01-15",
    "color": "Café",
    "esterilizado": true,
    "id_raza": 5,
    "raza": "Labrador",
    "especie": "Perro",
    "sexo": "M",
    "codigo_chip": "123456789",
    "tutor": {
      "nombre": "Juan",
      "apellido_paterno": "Pérez",
      "apellido_materno": "González",
      "rut": "12345678-9",
      "telefono": 123456789,
      "email": "juan@example.com"
    }
  },
  {
    "id_paciente": 2,
    "nombre": "Michi",
    "fecha_nacimiento": "2019-05-20",
    "color": "Negro",
    "esterilizado": false,
    "id_raza": 12,
    "raza": "Siamés",
    "especie": "Gato",
    "sexo": "H",
    "codigo_chip": null,
    "tutor": {
      "nombre": "Juan",
      "apellido_paterno": "Pérez",
      "apellido_materno": "González",
      "rut": "12345678-9",
      "telefono": 123456789,
      "email": "juan@example.com"
    }
  }
]
```

### **Respuesta Error (404)**

```json
{
  "detail": "Tutor no encontrado"
}
```

### **Respuesta Error (500)**

```json
{
  "detail": "Error interno del servidor"
}
```

---

## ⚙️ Implementación Backend Sugerida (Python/FastAPI)

```python
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

router = APIRouter()

@router.get("/tutores/{rut}/pacientes", response_model=List[PacienteSchema])
async def obtener_pacientes_por_tutor(
    rut: str,
    db: Session = Depends(get_db)
):
    """
    Obtiene todos los pacientes asociados a un tutor específico
    """
    # Verificar que el tutor existe
    tutor = db.query(Tutor).filter(Tutor.rut == rut).first()
    if not tutor:
        raise HTTPException(
            status_code=404,
            detail=f"Tutor con RUT {rut} no encontrado"
        )

    # Obtener pacientes del tutor
    pacientes = (
        db.query(Paciente)
        .join(RelacionTutorPaciente)
        .filter(RelacionTutorPaciente.rut_tutor == rut)
        .all()
    )

    return pacientes
```

---

## ✅ Integración Actual

### **Componentes que usan esta función:**

1. ✅ `ModalAgendarCita.tsx` - Paso 2: Cargar pacientes del tutor seleccionado

### **Flujo de uso:**

1. Usuario selecciona un tutor en el Paso 1
2. `useEffect` detecta el cambio en `tutorSeleccionado`
3. Se llama a `obtenerPacientesPorTutor(tutorSeleccionado.rut)`
4. Los pacientes se cargan en `pacientesDelTutor`
5. Se muestran en el Paso 2 para selección

---

## 🧪 Testing

### **Casos de Prueba**

1. ✅ Tutor con múltiples pacientes
2. ✅ Tutor sin pacientes (array vacío)
3. ✅ Tutor inexistente (error 404)
4. ✅ Error de red
5. ✅ RUT con formato especial (con guión)

### **Ejemplo de Test**

```typescript
describe("obtenerPacientesPorTutor", () => {
  it("debe retornar pacientes del tutor", async () => {
    const pacientes = await obtenerPacientesPorTutor("12345678-9");
    expect(pacientes).toBeInstanceOf(Array);
    expect(pacientes.length).toBeGreaterThan(0);
    expect(pacientes[0]).toHaveProperty("id_paciente");
    expect(pacientes[0]).toHaveProperty("nombre");
  });

  it("debe manejar tutor sin pacientes", async () => {
    const pacientes = await obtenerPacientesPorTutor("98765432-1");
    expect(pacientes).toEqual([]);
  });

  it("debe lanzar error para tutor inexistente", async () => {
    await expect(obtenerPacientesPorTutor("00000000-0")).rejects.toThrow();
  });
});
```

---

## 📋 Checklist de Implementación

- ✅ Función creada en `pacientes.ts`
- ✅ Tipos TypeScript correctos
- ✅ Manejo de errores
- ✅ Logging para debugging
- ✅ Integración con `ModalAgendarCita`
- ✅ Documentación creada
- ⏳ Endpoint backend implementado
- ⏳ Tests unitarios
- ⏳ Tests de integración

---

## 🔄 Cambios Realizados

### **Limpieza de Código**

- ✅ Eliminada función duplicada `obtenerPacientesDeTutor` de `tutores.ts`
- ✅ Centralizada en `pacientes.ts` donde corresponde
- ✅ Actualizada importación en `ModalAgendarCita.tsx`

### **Mejoras**

- ✅ Mejor manejo de errores con mensajes descriptivos
- ✅ Logging mejorado para debugging
- ✅ Documentación JSDoc
- ✅ Tipo de retorno explícito

---

## 🚀 Próximos Pasos

1. **Implementar endpoint backend** `/tutores/{rut}/pacientes`
2. **Probar integración** completa con datos reales
3. **Agregar tests** unitarios y de integración
4. **Optimizar** con caché si es necesario
5. **Agregar paginación** si el tutor tiene muchos pacientes

---

**Estado**: ✅ Implementación Frontend Completada
**Pendiente**: Backend endpoint
