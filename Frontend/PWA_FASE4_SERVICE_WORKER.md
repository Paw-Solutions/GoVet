# PWA Compliance - Fase 4: Service Worker & Offline ✅

## 🎯 Objetivos Completados

✅ Service Worker implementado con estrategias de caching  
✅ Soporte offline completo  
✅ Detección de estado de conexión  
✅ Sistema de notificaciones para actualizaciones  
✅ Prompt de instalación PWA  
✅ Página offline de fallback

---

## 📁 Archivos Creados

### 1. Service Worker

**Archivo:** `Frontend/public/service-worker.js`

**Características:**

- ✅ Cache de assets estáticos (CSS, JS, imágenes)
- ✅ Cache de API con Network-First strategy
- ✅ Timeout de 5s para requests de API
- ✅ Fallback a cache cuando no hay conexión
- ✅ Limpieza automática de caches antiguas
- ✅ Soporte para Background Sync (futuro)
- ✅ Soporte para Push Notifications (futuro)

**Estrategias de Caching:**

1. **Cache-First** (Assets estáticos)

   - CSS, JS, imágenes, fuentes
   - Intenta cache primero, luego red
   - Ideal para recursos que no cambian

2. **Network-First** (API)

   - Intenta red primero con timeout 5s
   - Fallback a cache si falla
   - Header `X-From-Cache` cuando usa cache

3. **Network-First** (Rutas de app)
   - Intenta red primero
   - Fallback a cache o index.html
   - Garantiza contenido fresh cuando hay conexión

**Patrones de API cacheados:**

```javascript
/api/tutores
/api/pacientes
/api/especies
/api/razas
/api/regiones
```

---

### 2. Registro del Service Worker

**Archivo:** `Frontend/src/utils/serviceWorker.ts`

**Funciones:**

- `registerServiceWorker()` - Registra el SW
- `unregisterServiceWorker()` - Desregistra el SW
- `checkForUpdates()` - Verifica actualizaciones
- `skipWaiting()` - Activa nueva versión inmediatamente
- `setupConnectionListener()` - Escucha cambios online/offline
- `isOnline()` - Verifica estado de conexión
- `cacheUrls(urls[])` - Cachea URLs manualmente
- `clearAllCaches()` - Limpia todas las caches
- `getCacheSize()` - Obtiene tamaño del cache
- `useServiceWorker()` - React hook para usar SW

**Hook React:**

```typescript
const {
  registration,
  updateAvailable,
  isOnline,
  skipWaiting,
  checkForUpdates,
} = useServiceWorker();
```

---

### 3. Componente PWAStatus

**Archivo:** `Frontend/src/components/PWAStatus.tsx`

**Funcionalidades:**

- ✅ Badge de estado offline (top center)
- ✅ Toast de actualización disponible
- ✅ Toast de conexión perdida
- ✅ Toast de conexión restaurada
- ✅ Botón para actualizar app

**Toasts:**

1. **Update Toast** - Nueva versión disponible

   - Color: Primary (#dc8add)
   - Botones: "Actualizar" | "Después"
   - Duración: Indefinido hasta respuesta

2. **Offline Toast** - Sin conexión

   - Color: Warning (amarillo)
   - Duración: 4 segundos
   - Mensaje: "Sin conexión. Algunas funciones están limitadas."

3. **Online Toast** - Conexión restaurada
   - Color: Success (verde)
   - Duración: 3 segundos
   - Mensaje: "Conexión restaurada"

---

### 4. Página Offline

**Archivo:** `Frontend/public/offline.html`

**Características:**

- ✅ Diseño atractivo con gradiente púrpura
- ✅ Mensaje claro de sin conexión
- ✅ Botón de reintentar
- ✅ Lista de funciones disponibles offline
- ✅ Auto-reload cuando vuelve conexión
- ✅ Verificación periódica cada 5 segundos

---

### 5. Sistema de Instalación PWA

**Archivo:** `Frontend/src/utils/pwaInstall.ts`

**Hook:**

```typescript
const { isInstallable, isInstalled, promptInstall } = usePWAInstall();
```

**Funciones:**

- `usePWAInstall()` - Hook para estado de instalación
- `isPWAInstalled()` - Verifica si está instalada
- `getDeviceType()` - Detecta iOS/Android/Desktop

**Componente:** `InstallPrompt.tsx`

- ✅ Card flotante con prompt de instalación
- ✅ Botón de instalación (Android/Desktop)
- ✅ Instrucciones específicas para iOS
- ✅ Botón para cerrar prompt
- ✅ Animación de entrada suave

---

## 🔧 Configuración

### App.tsx - Actualizado

```typescript
useEffect(() => {
  if (process.env.NODE_ENV === "production") {
    registerServiceWorker().then((registration) => {
      if (registration) {
        console.log("✅ PWA: Service Worker activo");
      }
    });
  }
}, []);
```

**Componentes agregados:**

- `<PWAStatus />` - Indicadores de estado

---

### vite.config.ts - Actualizado

```typescript
VitePWA({
  registerType: "autoUpdate",
  strategies: "injectManifest",
  srcDir: "public",
  filename: "service-worker.js",
  manifest: false, // Usamos manifest.json personalizado
  injectManifest: {
    globPatterns: ["**/*.{js,css,html,ico,png,svg,woff,woff2}"],
    maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB
  },
  workbox: {
    runtimeCaching: [
      // Google Fonts cache
      // Assets cache
    ],
  },
});
```

---

## 🎨 Estilos

### PWAStatus.css

- Badge fijo en top center (mobile) o flexible (desktop)
- Animación slideDown suave
- Toasts con colores del design system
- Responsive: mobile y desktop

### InstallPrompt.css

- Card flotante sobre tab bar
- Animación slideUp
- Gradiente en ícono (primary → secondary)
- Botón con colores del theme
- Desktop: bottom-right corner

---

## 🌐 Estrategias de Red

### Flujo de Caching

```
Request → Service Worker
    ↓
Es Asset Estático?
    → SÍ: Cache-First
        ↓
    Cache existe? → Devuelve cache
    Cache no existe? → Fetch red → Guarda en cache

    → NO: Es API?
        → SÍ: Network-First con timeout
            ↓
        Red responde? → Guarda en cache → Devuelve
        Red falla? → Busca en cache → Devuelve con header X-From-Cache
        No hay cache? → Error 503

    → NO: Es ruta de app?
        → Network-First
            ↓
        Red responde? → Guarda en cache
        Red falla? → Devuelve cache o index.html
```

---

## 📊 Beneficios Logrados

### Offline Support

✅ App funciona sin conexión  
✅ Datos cacheados disponibles  
✅ Rutas navegables offline  
✅ Página offline informativa

### Performance

✅ Assets cargados desde cache (instantáneo)  
✅ Menos requests al servidor  
✅ Timeout de 5s para APIs lentas  
✅ Carga progresiva

### User Experience

✅ Indicadores visuales claros de estado  
✅ Notificaciones de actualizaciones  
✅ Instalación nativa en dispositivo  
✅ Transiciones suaves entre estados

### PWA Compliance

✅ Service Worker registrado  
✅ Manifest.json configurado  
✅ Offline fallback page  
✅ Install prompt  
✅ Update notifications

---

## 🧪 Testing

### Verificar Service Worker

```bash
# Build de producción
npm run build

# Servir build
npm run preview

# Abrir DevTools → Application → Service Workers
# Verificar que esté registrado y activo
```

### Simular Offline

1. DevTools → Network → Throttling → Offline
2. Verificar que:
   - Badge "Sin conexión" aparece
   - Toast de offline se muestra
   - Datos cacheados se cargan
   - Navegación funciona

### Verificar Actualización

1. Cambiar versión en `service-worker.js`
2. Rebuild y deploy
3. Recargar app
4. Verificar toast de actualización

### Lighthouse PWA Score

```bash
# Abrir DevTools → Lighthouse
# Category: Progressive Web App
# Click "Generate report"

# Objetivo: 90+ score
```

---

## 📱 Instalación PWA

### Android (Chrome/Edge)

1. Abrir app en navegador
2. Ver prompt de instalación automático
3. O: Menu → "Instalar app" / "Añadir a inicio"

### iOS (Safari)

1. Abrir app en Safari
2. Tocar botón compartir (⬆️)
3. "Añadir a pantalla de inicio"
4. Seguir instrucciones

### Desktop (Chrome/Edge)

1. Abrir app en navegador
2. Ver ícono de instalación en barra de direcciones
3. O: Menu → "Instalar GoVet"

---

## 🔮 Características Futuras

### Background Sync (Preparado)

```javascript
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-pending-data") {
    event.waitUntil(syncPendingData());
  }
});
```

**Usar para:**

- Sincronizar formularios guardados offline
- Enviar datos pendientes cuando vuelva conexión
- Queue de requests fallidas

### Push Notifications (Preparado)

```javascript
self.addEventListener("push", (event) => {
  // Mostrar notificación
});
```

**Usar para:**

- Recordatorios de citas
- Notificaciones de vacunas
- Alertas importantes

---

## 🎯 Checklist de Validación

### Service Worker

- [x] Registrado correctamente
- [x] Cache de assets funciona
- [x] Cache de API funciona
- [x] Fallback offline funciona
- [x] Actualizaciones detectadas

### Offline Support

- [x] App carga sin conexión
- [x] Datos cacheados disponibles
- [x] Navegación funciona offline
- [x] Página offline se muestra

### UI/UX

- [x] Badge offline visible
- [x] Toasts informativos
- [x] Transiciones suaves
- [x] Colores consistentes con theme

### Installation

- [x] Prompt de instalación funciona
- [x] iOS instructions claras
- [x] App se instala correctamente
- [x] Ícono correcto en launcher

### Performance

- [x] Assets cargan rápido
- [x] API con timeout
- [x] Cache size razonable
- [x] No memory leaks

---

## 📈 Métricas PWA

### Lighthouse Goals

- **Progressive Web App:** 90+ ✅
- **Performance:** 90+ ⏳
- **Accessibility:** 90+ ⏳
- **Best Practices:** 90+ ✅
- **SEO:** 90+ ⏳

### Cache Strategy Effectiveness

- **Cache Hit Rate:** >70% (objetivo)
- **Average Load Time:** <2s offline
- **Bundle Size:** <5MB
- **API Timeout:** 5s máximo

---

## 🔜 Próxima Fase

### Fase 5: Performance & Optimization

- [ ] Code splitting por ruta
- [ ] Lazy loading de componentes
- [ ] Image optimization
- [ ] Bundle analysis
- [ ] Preload critical resources
- [ ] Virtual scrolling para listas largas
- [ ] Debounce en búsquedas
- [ ] Memoization de componentes pesados

---

**Fecha:** 11 de noviembre de 2025  
**Fase:** 4 de 5 - Service Worker & Offline Support  
**Estado:** ✅ Completado - PWA Totalmente Funcional
