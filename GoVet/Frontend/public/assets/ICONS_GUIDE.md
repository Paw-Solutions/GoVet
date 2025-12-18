# 📱 Guía de Íconos PWA - GoVet

## Íconos Requeridos

Para cumplir con los estándares PWA, necesitas generar los siguientes íconos con el logo de GoVet en los colores morado/rosa de la marca (#dc8add):

### 📂 Ubicación: `/public/assets/icon/`

```
/public/assets/icon/
├── favicon.png (64x64) - Ya existe
├── icon-152.png (152x152) - iOS
├── icon-167.png (167x167) - iPad Pro
├── icon-180.png (180x180) - iOS
├── icon-192.png (192x192) - Android
├── icon-512.png (512x512) - Android
├── icon-maskable-192.png (192x192) - Android maskable
└── icon-maskable-512.png (512x512) - Android maskable
```

### 📂 Splash Screens: `/public/assets/splash/`

```
/public/assets/splash/
├── splash-640x1136.png - iPhone SE
├── splash-750x1334.png - iPhone 8
├── splash-828x1792.png - iPhone 11
├── splash-1125x2436.png - iPhone X/XS/11 Pro
├── splash-1242x2688.png - iPhone XS Max/11 Pro Max
├── splash-1536x2048.png - iPad
├── splash-1668x2388.png - iPad Pro 11"
└── splash-2048x2732.png - iPad Pro 12.9"
```

## 🎨 Especificaciones de Diseño

### Íconos Regulares

- **Fondo**: Color morado (#dc8add) o degradado morado/rosa
- **Logo**: Blanco o versión light del logo
- **Padding**: 10-15% del tamaño total
- **Formato**: PNG con transparencia (para favicon)

### Íconos Maskables (Android)

- **Safe zone**: Logo debe estar en el 80% central (40% de padding)
- **Fondo**: Color sólido (#dc8add)
- **Forma**: El sistema aplicará máscara (círculo, squircle, etc.)

### Splash Screens

- **Fondo**: Color light (#f6f8fc) o degradado sutil
- **Logo central**: Versión completa de GoVet
- **Texto**: "GoVet - Gestión Veterinaria" (opcional)

## 🛠️ Herramientas Recomendadas

1. **PWA Asset Generator**: https://www.pwabuilder.com/imageGenerator
2. **Favicon Generator**: https://realfavicongenerator.net/
3. **Figma**: Para diseñar los íconos base
4. **ImageMagick**: Para generación por lote

## 📝 Checklist

- [ ] Crear diseño base del ícono (1024x1024)
- [ ] Generar todos los tamaños de íconos
- [ ] Generar versiones maskable
- [ ] Crear splash screens para iOS
- [ ] Probar en diferentes dispositivos
- [ ] Validar con Lighthouse PWA audit

## 🎨 Paleta de Colores

```css
Primary: #dc8add
Secondary: #9141ac
Tertiary: #613583
Light: #f6f8fc
```

---

**Nota**: Mientras generas los íconos reales, la app seguirá funcionando con los placeholders actuales.
