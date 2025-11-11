# PWA Compliance - Fase 3: CSS Consolidation ✅

## Sistema de Diseño Implementado

### 📁 Nueva Estructura de Archivos CSS

```
Frontend/src/styles/
├── index.css              # 🆕 Archivo principal (importa todo)
├── tokens.css             # 🆕 Design tokens (variables)
├── base.css               # 🆕 Estilos base y utilidades
├── BottomTabs.css         # ✅ Componente de navegación
├── botonAnadir.css        # ♻️ Optimizado con tokens
├── home.css               # ♻️ Optimizado con tokens
├── ver.css                # Página Ver
├── calendario.css         # Página Calendario
├── registroTutor.css      # Página Registro Tutor
├── registroPaciente.css   # Página Registro Paciente
├── rellenarFicha.css      # Página Rellenar Ficha
├── verPacientes.css       # Componente Ver Pacientes
├── escogerPaciente.css    # Modal Escoger Paciente
├── modalEscogerPaciente.css
├── modalBuscarTutor.css
├── SegmentedView.css
├── SearchBar.css
├── BarraLateral.css       # ⚠️ Obsoleto (no importado)
└── ExploreContainer.css   # ⚠️ Obsoleto (no importado)
```

---

## 🎨 Design Tokens (tokens.css)

### Colores

```css
/* Primarios */
--color-primary: #dc8add
--color-primary-shade: #c279c2
--color-primary-tint: #e097e0

/* Secundarios */
--color-secondary: #9141ac
--color-tertiary: #613583

/* Estados */
--color-success: #2dd36f
--color-warning: #ffc409
--color-danger: #eb445a
--color-info: #3880ff

/* Neutros */
--color-light: #f6f8fc
--color-medium: #92949c
--color-dark: #222428

/* Texto */
--text-color: #000000
--text-color-secondary: #666666
--text-color-tertiary: #999999

/* Bordes */
--border-color: #e0e0e0
```

### Espaciado (Base 4px)

```css
--spacing-xs: 4px      /* 0.25rem */
--spacing-sm: 8px      /* 0.5rem */
--spacing-md: 16px     /* 1rem */
--spacing-lg: 24px     /* 1.5rem */
--spacing-xl: 32px     /* 2rem */
--spacing-2xl: 48px    /* 3rem */
--spacing-3xl: 64px    /* 4rem */
```

### Tipografía

```css
/* Tamaños */
--font-size-xs: 11px
--font-size-sm: 12px
--font-size-base: 14px
--font-size-md: 16px
--font-size-lg: 18px
--font-size-xl: 20px
--font-size-2xl: 24px

/* Pesos */
--font-weight-light: 300
--font-weight-normal: 400
--font-weight-medium: 500
--font-weight-semibold: 600
--font-weight-bold: 700
```

### Border Radius

```css
--radius-sm: 4px
--radius-md: 8px
--radius-lg: 12px
--radius-xl: 16px
--radius-2xl: 24px
--radius-full: 9999px

/* Específicos */
--radius-card: 12px
--radius-button: 8px
--radius-input: 8px
--radius-modal: 16px
```

### Sombras

```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05)
--shadow-base: 0 1px 3px rgba(0, 0, 0, 0.1)
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.07)
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1)
--shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.1)

/* Específicas */
--shadow-card: var(--shadow-md)
--shadow-modal: var(--shadow-xl)
--shadow-button: var(--shadow-sm)
--shadow-header: 0 2px 8px rgba(0, 0, 0, 0.08)
```

### Transiciones

```css
--transition-fast: 150ms ease-in-out
--transition-base: 250ms ease-in-out
--transition-slow: 350ms ease-in-out
```

### Z-Index

```css
--z-index-dropdown: 1000
--z-index-sticky: 1020
--z-index-fixed: 1030
--z-index-modal-backdrop: 1040
--z-index-modal: 1050
--z-index-popover: 1060
--z-index-tooltip: 1070
--z-index-toast: 1080
```

---

## 🧰 Utility Classes (base.css)

### Spacing

```css
.mt-xs, .mt-sm, .mt-md, .mt-lg, .mt-xl  /* Margin top */
.mb-xs, .mb-sm, .mb-md, .mb-lg, .mb-xl  /* Margin bottom */
.ml-xs, .ml-sm, .ml-md, .ml-lg          /* Margin left */
.mr-xs, .mr-sm, .mr-md, .mr-lg          /* Margin right */
.pt-xs, .pt-sm, .pt-md, .pt-lg          /* Padding top */
.pb-xs, .pb-sm, .pb-md, .pb-lg; /* Padding bottom */
```

### Text

```css
.text-center,
.text-left,
.text-right .text-primary,
.text-secondary,
.text-tertiary .text-success,
.text-danger,
.text-warning .text-xs,
.text-sm,
.text-base,
.text-lg,
.text-xl .text-light,
.text-normal,
.text-medium,
.text-semibold,
.text-bold;
```

### Display & Flex

```css
.d-none,
.d-block,
.d-flex,
.d-inline,
.d-inline-block .flex-row,
.flex-column,
.flex-wrap,
.flex-nowrap .justify-start,
.justify-center,
.justify-end,
.justify-between .align-start,
.align-center,
.align-end,
.align-stretch;
```

### Size

```css
.w-full,
.w-auto .h-full,
.h-auto;
```

### Border & Shadow

```css
.rounded-sm,
.rounded-md,
.rounded-lg,
.rounded-full .shadow-sm,
.shadow-base,
.shadow-md,
.shadow-lg,
.shadow-none;
```

### Responsive Helpers

```css
.hide-xs    /* Ocultar en móviles */
/* Ocultar en móviles */
.hide-sm    /* Ocultar en tablets pequeñas */
.hide-md    /* Ocultar en tablets */
.hide-lg; /* Ocultar en desktop */
```

---

## 🎯 Archivos Optimizados

### ✅ home.css

**Antes:**

```css
border-radius: 1rem !important;
box-shadow: 0 0.25rem 0.75rem rgba(0, 0, 0, 0.1);
margin: 1rem 0;
```

**Después:**

```css
border-radius: var(--radius-card) !important;
box-shadow: var(--shadow-card) !important;
margin: var(--spacing-md) 0;
transition: transform var(--transition-fast);
```

### ✅ botonAnadir.css

**Antes:**

```css
width: 4rem;
height: 4rem;
--box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.2);
transition: all 0.3s ease;
```

**Después:**

```css
width: 64px;
height: 64px;
--box-shadow: var(--shadow-lg);
transition: all var(--transition-fast);
```

---

## 📐 Estilos Base Globales

### Componentes Ionic

```css
/* IonContent */
--padding-start: var(--spacing-page)
--padding-end: var(--spacing-page)

/* IonButton */
--border-radius: var(--radius-button)
--box-shadow: var(--shadow-button)
height: var(--height-button)

/* IonCard */
border-radius: var(--radius-card)
box-shadow: var(--shadow-card)
transition: transform, box-shadow

/* IonInput/IonTextarea */
--border-radius: var(--radius-input)
min-height: var(--height-input)
```

---

## 🔄 Cambios en App.tsx

**Antes:**

```tsx
import "./styles/BottomTabs.css";
```

**Después:**

```tsx
/* GoVet Design System - Sistema consolidado de estilos */
import "./styles/index.css";
```

Un solo import que carga todo el sistema de diseño en orden correcto.

---

## 📊 Beneficios Logrados

### Consistencia

✅ Variables unificadas en todo el proyecto  
✅ Colores consistentes con el tema (#dc8add)  
✅ Espaciado predecible (múltiplos de 4px)  
✅ Tipografía estandarizada

### Mantenibilidad

✅ Cambios centralizados en tokens.css  
✅ Un solo archivo de import (index.css)  
✅ Nomenclatura clara y descriptiva  
✅ Documentación inline en CSS

### Performance

✅ Menos archivos CSS individuales importados  
✅ Variables CSS nativas (no SASS/LESS)  
✅ Transiciones optimizadas  
✅ Shadow DOM respetado (Ionic)

### Escalabilidad

✅ Fácil agregar nuevos tokens  
✅ Utility classes reutilizables  
✅ Sistema extensible  
✅ Compatible con dark mode (futuro)

---

## 🎨 Integración con Ionic

Los tokens se mapean automáticamente a variables Ionic:

```css
--ion-color-primary → var(--color-primary)
--ion-color-secondary → var(--color-secondary)
--ion-background-color → var(--background-color)
--ion-text-color → var(--text-color)
--ion-border-color → var(--border-color)
```

---

## 📝 Guía de Uso

### Ejemplo: Crear un Card Consistente

```tsx
<IonCard className="mt-md">
  <IonCardHeader>
    <IonCardTitle className="text-semibold">Título</IonCardTitle>
  </IonCardHeader>
  <IonCardContent className="pt-md pb-md">Contenido</IonCardContent>
</IonCard>
```

### Ejemplo: Botón con Espaciado

```tsx
<IonButton className="mt-lg mb-md" expand="block">
  Guardar
</IonButton>
```

### Ejemplo: Usar Tokens en Custom CSS

```css
.mi-componente {
  padding: var(--spacing-md);
  background: var(--color-light);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
  transition: all var(--transition-fast);
}

.mi-componente:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}
```

---

## ⚠️ Archivos Obsoletos

### Para Eliminar (Ya no se usan)

- `BarraLateral.css` - Reemplazado por BottomTabs
- `ExploreContainer.css` - Componente no utilizado
- `variables.css` - Reemplazado por tokens.css
- `main.css` - Reemplazado por base.css

---

## 🔜 Próximos Pasos

### Fase 4: Service Worker & Offline

- [ ] Implementar service worker
- [ ] Cache de assets estáticos
- [ ] Offline fallback pages
- [ ] Background sync para formularios

### Fase 5: Performance

- [ ] Code splitting por ruta
- [ ] Lazy loading de componentes
- [ ] Image optimization
- [ ] Bundle analysis

### Mejoras CSS Futuras

- [ ] Optimizar archivos CSS de páginas restantes
- [ ] Dark mode support (CSS variables ya preparadas)
- [ ] Animaciones avanzadas
- [ ] Custom Ionic theme generator

---

## 🧪 Testing

### Visual Regression

- [ ] Verificar que todos los colores se mantienen
- [ ] Revisar espaciado en todas las páginas
- [ ] Probar transiciones y animaciones
- [ ] Validar responsive breakpoints

### Performance

- [ ] Lighthouse CSS bundle size
- [ ] Paint timing
- [ ] Layout shift (CLS)

---

**Fecha:** 11 de noviembre de 2025  
**Fase:** 3 de 5 - CSS Consolidation  
**Estado:** ✅ Completado - Sistema de Diseño Implementado
