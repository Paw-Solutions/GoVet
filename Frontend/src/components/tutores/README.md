# Componentes de Búsqueda de Tutores

## 📦 Componentes Disponibles

### 1. `TutorItemSimple`

Componente simplificado para mostrar un item de tutor sin botones de acción.

**Props:**

- `tutor: TutorData` - Datos del tutor a mostrar
- `onSelect: () => void` - Función que se ejecuta al hacer click
- `isSelected?: boolean` - (Opcional) Indica si el tutor está seleccionado

**Uso:**

```tsx
import { TutorItemSimple } from "../components/tutores";

<TutorItemSimple
  tutor={tutorData}
  onSelect={() => handleSelectTutor(tutorData)}
  isSelected={selectedTutor?.rut === tutorData.rut}
/>;
```

---

### 2. `BuscadorTutor`

Componente completo de búsqueda de tutores con paginación infinita.

**Props:**

- `onSelectTutor: (tutor: TutorData) => void` - Callback cuando se selecciona un tutor
- `tutorSeleccionado?: TutorData | null` - (Opcional) Tutor actualmente seleccionado
- `autoLoad?: boolean` - (Opcional, default: false) Carga tutores automáticamente al montar
- `placeholder?: string` - (Opcional) Texto del placeholder de búsqueda
- `maxHeight?: string` - (Opcional, default: "400px") Altura máxima del contenedor

**Uso básico:**

```tsx
import { BuscadorTutor } from "../components/tutores";

const [tutorSeleccionado, setTutorSeleccionado] = useState<TutorData | null>(
  null
);

<BuscadorTutor
  onSelectTutor={(tutor) => setTutorSeleccionado(tutor)}
  tutorSeleccionado={tutorSeleccionado}
/>;
```

**Uso avanzado:**

```tsx
<BuscadorTutor
  onSelectTutor={(tutor) => {
    setTutorSeleccionado(tutor);
    setEmailTutor(tutor.email || "");
    setNombreTutor(
      `${tutor.nombre} ${tutor.apellido_paterno} ${tutor.apellido_materno}`
    );
  }}
  tutorSeleccionado={tutorSeleccionado}
  autoLoad={true}
  placeholder="Buscar tutor por nombre, RUT o email..."
  maxHeight="500px"
/>
```

---

### 3. `useTutorSearch` (Hook)

Hook personalizado para manejar la búsqueda y paginación de tutores.

**Valores retornados:**

```typescript
{
  tutores: TutorData[];           // Lista de tutores encontrados
  loading: boolean;               // Estado de carga
  error: string;                  // Mensaje de error
  busqueda: string;               // Texto de búsqueda actual
  hasMoreData: boolean;           // Indica si hay más datos para cargar
  handleSearch: (texto: string) => void;     // Función para buscar
  loadMore: () => Promise<void>;             // Cargar más resultados
  loadTutores: (resetList?: boolean, search?: string) => Promise<void>; // Cargar tutores
  reset: () => void;              // Resetear estado
}
```

**Uso:**

```tsx
import { useTutorSearch } from "../hooks/useTutorSearch";

const MyComponent = () => {
  const { tutores, loading, handleSearch, loadMore, reset } = useTutorSearch();

  // Usar las funciones y valores según necesidad
};
```

---

## 🎨 Estilos

Los componentes usan los siguientes archivos de estilos:

- `styles/ver.css` - Estilos generales compartidos
- `styles/buscadorTutor.css` - Estilos específicos del buscador

Las clases principales son:

- `.tutor-search-container` - Contenedor principal
- `.tutor-seleccionado` - Item de tutor seleccionado
- `.loading-container` - Estado de carga
- `.error-container` - Estado de error
- `.empty-container` - Estado vacío

---

## 🔗 Dependencias

Estos componentes dependen de:

- `@ionic/react` - Framework UI
- `ionicons/icons` - Iconos
- `api/tutores` - API de tutores
- `components/common/SearchBar` - Barra de búsqueda compartida

---

## 📝 Notas

1. El buscador implementa **debounce** de 500ms en la búsqueda
2. La paginación es **infinita** (carga más al hacer scroll)
3. Los datos se obtienen con límite de **50 tutores por página**
4. El hook maneja automáticamente la limpieza de timeouts al desmontar

---

## 🚀 Ejemplo Completo de Integración

```tsx
import React, { useState } from "react";
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
} from "@ionic/react";
import { BuscadorTutor } from "../components/tutores";
import { TutorData } from "../api/tutores";

const MiComponente: React.FC = () => {
  const [tutorSeleccionado, setTutorSeleccionado] = useState<TutorData | null>(
    null
  );
  const [showModal, setShowModal] = useState(false);

  const handleSelectTutor = (tutor: TutorData) => {
    setTutorSeleccionado(tutor);
    console.log("Tutor seleccionado:", tutor);
  };

  return (
    <>
      <IonButton onClick={() => setShowModal(true)}>
        Seleccionar Tutor
      </IonButton>

      <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Buscar Tutor</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <BuscadorTutor
            onSelectTutor={handleSelectTutor}
            tutorSeleccionado={tutorSeleccionado}
            autoLoad={true}
          />
        </IonContent>
      </IonModal>
    </>
  );
};

export default MiComponente;
```
