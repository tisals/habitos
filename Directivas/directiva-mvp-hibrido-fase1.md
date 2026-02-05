# Directiva: MVP Híbrido - Fase 1 Piloto
**Proyecto:** La Llave de tu Potencial  
**Versión:** 1.0  
**Fecha:** 2025-02-05  
**Responsable:** Equipo de Desarrollo

---

## 1. Misión

Definir y ejecutar la estrategia de implementación del MVP Fase 1 como una **Progressive Web App (PWA)** basada en React + TypeScript, manteniendo la arquitectura frontend actual mientras se documenta la realidad técnica y se prepara el camino para una futura migración a backend PHP/Laravel.

Esta directiva reconcilia la **visión arquitectónica** descrita en `requerimientos.md` (PHP/Laravel + DDD) con la **implementación real** (React SPA + LocalStorage), estableciendo un puente claro entre ambas.

---

## 2. Responsabilidad Única

**Esta directiva es responsable de:**
- Documentar la arquitectura real del MVP (React + TypeScript + Vite + LocalStorage)
- Convertir la aplicación actual en una PWA funcional (offline-first, instalable)
- Organizar el código frontend según mejores prácticas (carpetas, separación de responsabilidades)
- Implementar la identidad visual definida en `Directiva_identidad_visual.md`
- Establecer el plan de migración hacia la arquitectura backend descrita en `requerimientos.md`

**NO es responsable de:**
- Implementar el backend PHP/Laravel (esto es Fase 2+)
- Crear la base de datos relacional (esto es Fase 2+)
- Implementar autenticación con servidor (esto es Fase 2+)
- Desarrollar funcionalidades fuera del alcance del MVP

---

## 3. Entradas y Salidas (I/O)

### Entradas
| Entrada | Tipo | Fuente | Descripción |
|---------|------|--------|-------------|
| `requerimientos.md` | Documento | Directivas/ | Visión arquitectónica y funcional del sistema completo |
| `Directiva_identidad_visual.md` | Documento | Directivas/ | Paleta de colores, tipografía, reglas de diseño |
| `directiva_ux_experiencia_usuario.md` | Documento | Directivas/ | Principios de UX, flujos de usuario |
| `directiva_modos_ritual.md` | Documento | Directivas/ | Lógica de rituales (manual vs asistido) |
| `ajustes_fase_1_piloto.md` | Documento | Directivas/ | Plan de integración de directivas |
| Código actual | React/TS | views/, App.tsx, constants.tsx | Implementación existente |

### Salidas
| Salida | Tipo | Destino | Descripción |
|--------|------|---------|-------------|
| PWA funcional | Aplicación | public/, dist/ | App instalable, offline-first |
| `manifest.json` | JSON | public/ | Configuración PWA (nombre, iconos, colores) |
| `service-worker.js` | JavaScript | public/ | Cache de assets, estrategia offline |
| Iconos PWA | PNG | public/assets/icons/ | 192x192, 512x512, favicon |
| Estructura organizada | Carpetas | src/ | services/, hooks/, utils/, components/ |
| `constants.tsx` actualizado | TypeScript | raíz | Variables de color, configuración centralizada |
| Documentación técnica | Markdown | Directivas/ | Arquitectura real, decisiones técnicas |

---

## 4. Arquitectura Real del MVP (Fase 1)

### 4.1. Stack Tecnológico Actual

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (MVP Fase 1)                │
├─────────────────────────────────────────────────────────┤
│  React 18 + TypeScript + Vite                           │
│  Tailwind CSS (CDN)                                     │
│  LocalStorage (persistencia)                            │
│  PWA (manifest.json + service-worker.js)                │
│  Audio API (rituales asistidos)                         │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                  NAVEGADOR DEL USUARIO                  │
│  - Cache de Service Worker                              │
│  - LocalStorage (datos de usuario, progreso)            │
│  - Audio playback                                       │
└─────────────────────────────────────────────────────────┘
```

### 4.2. Estructura de Carpetas (Objetivo)

```
/
├── Directivas/                    # Documentación técnica
│   ├── requerimientos.md
│   ├── Directiva_identidad_visual.md
│   ├── directiva_ux_experiencia_usuario.md
│   ├── directiva_modos_ritual.md
│   ├── directiva-mvp-hibrido-fase1.md (ESTA DIRECTIVA)
│   └── ...
├── public/
│   ├── manifest.json              # PWA manifest
│   ├── service-worker.js          # Service Worker
│   ├── assets/
│   │   ├── icons/                 # Iconos PWA (192, 512, favicon)
│   │   └── audio/                 # Audios de rituales
│   └── index.html
├── src/                           # Código fuente organizado
│   ├── components/                # Componentes reutilizables
│   │   ├── ui/                    # Botones, Cards, Inputs
│   │   └── ritual/                # Componentes específicos de rituales
│   ├── views/                     # Vistas principales (Dashboard, Ritual, etc.)
│   ├── services/                  # Lógica de negocio
│   │   ├── StorageService.ts      # Abstracción de LocalStorage
│   │   ├── RitualEngine.ts        # Motor de rituales
│   │   └── AudioService.ts        # Gestión de audio
│   ├── hooks/                     # Custom React hooks
│   │   ├── useLocalStorage.ts
│   │   └── useRitualProgress.ts
│   ├── utils/                     # Utilidades
│   │   ├── dateHelpers.ts
│   │   └── validators.ts
│   ├── types/                     # Definiciones TypeScript
│   │   └── index.ts
│   ├── constants/                 # Constantes y configuración
│   │   ├── colors.ts              # Paleta de colores
│   │   ├── rituals.ts             # Datos de rituales
│   │   └── config.ts              # Configuración general
│   ├── App.tsx                    # Componente raíz
│   └── index.tsx                  # Entry point
├── dist/                          # Build de producción
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

**Nota:** La estructura actual tiene archivos en la raíz (`App.tsx`, `constants.tsx`, `types.ts`, `views/`). Esta directiva propone reorganizarlos dentro de `src/` para mejor mantenibilidad.

---

## 5. Lógica Paso a Paso

### 5.1. Fase 1A: Conversión a PWA (Prioridad ALTA)

#### Paso 1: Crear `public/manifest.json`
```json
{
  "name": "La Llave de tu Potencial",
  "short_name": "La Llave",
  "description": "Transforma tu vida con rituales diarios de productividad",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0A0E27",
  "theme_color": "#00D1FF",
  "orientation": "portrait",
  "icons": [
    {
      "src": "/assets/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/assets/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

#### Paso 2: Crear `public/service-worker.js`
- Estrategia: **Cache-First** para assets estáticos (HTML, CSS, JS, imágenes, audio)
- Estrategia: **Network-First** para datos dinámicos (si se agrega API en el futuro)
- Versión de cache: `v1-llave-potencial`

#### Paso 3: Registrar Service Worker en `index.html`
```html
<script>
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then(reg => console.log('SW registered:', reg))
        .catch(err => console.log('SW registration failed:', err));
    });
  }
</script>
```

#### Paso 4: Crear iconos PWA
- Generar `icon-192.png` (192x192)
- Generar `icon-512.png` (512x512)
- Generar `favicon.ico` (32x32)
- Usar colores de identidad visual: fondo `#0A0E27`, símbolo de llave en `#00D1FF`

#### Paso 5: Actualizar `index.html`
- Agregar `<link rel="manifest" href="/manifest.json">`
- Agregar meta tags para PWA (theme-color, apple-mobile-web-app-capable)
- Agregar iconos de Apple Touch

### 5.2. Fase 1B: Implementar Identidad Visual (Prioridad ALTA)

#### Paso 6: Crear `src/constants/colors.ts`
```typescript
export const COLORS = {
  core: {
    deepBlue: '#0A0E27',
    electricBlue: '#00D1FF',
    softWhite: '#F8F9FA',
  },
  rituals: {
    ara: { primary: '#00D1FF', secondary: '#0066FF' },
    cafe: { primary: '#FF6B35', secondary: '#FFB627' },
    life: { primary: '#00E5A0', secondary: '#00C896' },
  },
  support: {
    success: '#00E5A0',
    warning: '#FFB627',
    neutral: '#6C757D',
    background: '#F8F9FA',
  },
};
```

#### Paso 7: Configurar Tailwind CSS personalizado
- Opción A: Migrar de CDN a instalación local (`npm install -D tailwindcss`)
- Opción B: Usar CDN con configuración inline en `index.html`
- Definir colores personalizados en `tailwind.config.js` o script de configuración

#### Paso 8: Actualizar componentes con paleta de colores
- Reemplazar colores hardcoded por variables de `colors.ts`
- Aplicar regla 60-30-10 (60% Deep Blue, 30% Soft White, 10% Electric Blue)
- Usar colores de ritual dinámicamente según `ritual.type`

### 5.3. Fase 1C: Organizar Estructura de Código (Prioridad MEDIA)

#### Paso 9: Crear carpeta `src/` y mover archivos
```bash
mkdir src
mkdir src/components src/views src/services src/hooks src/utils src/types src/constants
mv App.tsx src/
mv index.tsx src/
mv types.ts src/types/index.ts
mv views/* src/views/
```

#### Paso 10: Crear `src/services/StorageService.ts`
- Abstraer acceso a LocalStorage
- Métodos: `getUser()`, `saveUser()`, `getRituals()`, `saveCompletion()`
- Manejo de errores (quota exceeded, JSON parse errors)

#### Paso 11: Crear `src/services/RitualEngine.ts`
- Lógica de progreso de ritual (pasos, timer)
- Cálculo de puntos y niveles
- Validación de completitud

#### Paso 12: Crear `src/services/AudioService.ts`
- Gestión de reproducción de audio
- Preload de archivos
- Control de volumen y pausa

#### Paso 13: Crear hooks personalizados
- `useLocalStorage.ts`: Hook para sincronizar estado con LocalStorage
- `useRitualProgress.ts`: Hook para gestionar progreso de ritual activo

#### Paso 14: Actualizar imports en todos los archivos
- Cambiar rutas relativas según nueva estructura
- Verificar que no haya imports rotos

### 5.4. Fase 1D: Documentación y Testing (Prioridad MEDIA)

#### Paso 15: Crear `Directivas/arquitectura-real-mvp.md`
- Documentar stack tecnológico real
- Diagramas de flujo de datos
- Decisiones técnicas y trade-offs

#### Paso 16: Actualizar `README.md`
- Instrucciones de instalación y desarrollo
- Comandos de build y deploy
- Estructura de carpetas explicada

#### Paso 17: Testing manual
- Probar instalación PWA en móvil (Android/iOS)
- Verificar funcionamiento offline
- Validar identidad visual en todos los rituales
- Comprobar persistencia de datos en LocalStorage

---

## 6. Reglas de Oro

### SIEMPRE:
1. **Mantener compatibilidad offline**: Todos los assets críticos deben estar en cache
2. **Usar variables de color**: Nunca hardcodear colores, usar `colors.ts`
3. **Validar datos de LocalStorage**: Siempre manejar casos de datos corruptos o ausentes
4. **Seguir principios de UX**: Mobile-first, una acción principal por pantalla
5. **Documentar decisiones técnicas**: Actualizar directivas cuando se tomen decisiones importantes
6. **Respetar identidad visual**: Aplicar paleta de colores según ritual activo
7. **Optimizar assets**: Comprimir imágenes y audio para carga rápida
8. **Probar en dispositivos reales**: No confiar solo en emuladores

### NUNCA:
1. **Hardcodear colores**: Usar siempre variables centralizadas
2. **Ignorar errores de LocalStorage**: Puede estar lleno o deshabilitado
3. **Asumir conectividad**: La app debe funcionar 100% offline
4. **Mezclar lógica de negocio con UI**: Separar en services/
5. **Olvidar actualizar Service Worker**: Cambiar versión de cache al actualizar assets
6. **Usar dependencias pesadas**: Mantener bundle pequeño (<500KB)
7. **Ignorar accesibilidad**: Contrastar colores, tamaños de fuente legibles
8. **Desviarse del MVP**: No agregar features fuera del alcance definido

---

## 7. Dependencias

### 7.1. Dependencias Técnicas
| Dependencia | Versión | Propósito |
|-------------|---------|-----------|
| React | ^18.x | Framework UI |
| TypeScript | ^5.x | Type safety |
| Vite | ^5.x | Build tool |
| Tailwind CSS | ^3.x | Estilos (migrar de CDN a local) |

### 7.2. Dependencias de Directivas
- `Directiva_identidad_visual.md`: Paleta de colores, tipografía, reglas de diseño
- `directiva_ux_experiencia_usuario.md`: Principios de UX, flujos de usuario
- `directiva_modos_ritual.md`: Lógica de rituales (manual vs asistido)
- `requerimientos.md`: Visión general del sistema

### 7.3. Archivos Clave
- `public/manifest.json`: Configuración PWA
- `public/service-worker.js`: Cache y offline
- `src/constants/colors.ts`: Paleta de colores
- `src/services/StorageService.ts`: Persistencia
- `index.html`: Entry point, registro de SW

---

## 8. Casos Borde y Trampas Conocidas

### 8.1. Limitaciones Conocidas

| Limitación | Impacto | Solución Actual | Solución Futura |
|------------|---------|-----------------|-----------------|
| LocalStorage limitado a ~5-10MB | Puede llenarse con muchos registros | Limpiar registros antiguos (>90 días) | Migrar a IndexedDB o backend |
| Sin sincronización entre dispositivos | Usuario pierde progreso al cambiar de dispositivo | Exportar/importar datos manualmente | Backend con autenticación |
| Sin notificaciones push reales | Recordatorios solo funcionan con app abierta | Usar notificaciones locales del navegador | Backend con push notifications |
| Audio puede no funcionar en iOS sin interacción | Rituales asistidos requieren tap inicial | Mostrar botón "Iniciar" antes de reproducir | N/A (limitación del navegador) |
| Service Worker no se actualiza inmediatamente | Usuarios pueden ver versión antigua | Implementar estrategia de actualización forzada | N/A (comportamiento estándar) |

### 8.2. Errores Comunes y Soluciones

| Error | Causa | Solución |
|-------|-------|----------|
| "QuotaExceededError" en LocalStorage | Almacenamiento lleno | Implementar limpieza automática de datos antiguos |
| Service Worker no se registra | HTTPS requerido (excepto localhost) | Usar HTTPS en producción, localhost en desarrollo |
| Iconos PWA no aparecen | Rutas incorrectas en manifest.json | Usar rutas absolutas desde raíz (`/assets/icons/...`) |
| Audio no se reproduce en móvil | Autoplay bloqueado por navegador | Requerir interacción del usuario antes de `audio.play()` |
| Colores no se aplican | Tailwind no reconoce clases personalizadas | Configurar `tailwind.config.js` correctamente |
| Imports rotos después de reorganizar | Rutas relativas incorrectas | Usar alias de TypeScript (`@/components`, etc.) |

---

## 9. Métricas y Validación

### 9.1. Métricas de Éxito

| Métrica | Objetivo | Herramienta de Medición |
|---------|----------|-------------------------|
| Lighthouse PWA Score | ≥90/100 | Chrome DevTools > Lighthouse |
| Lighthouse Performance | ≥80/100 | Chrome DevTools > Lighthouse |
| Lighthouse Accessibility | ≥90/100 | Chrome DevTools > Lighthouse |
| Bundle size (gzip) | <500KB | `npm run build` + análisis de dist/ |
| Tiempo de carga inicial | <3s en 3G | Chrome DevTools > Network (throttling) |
| Funcionamiento offline | 100% de features críticas | Prueba manual con DevTools offline |
| Instalabilidad | Prompt de instalación aparece | Prueba en Chrome Android/iOS |

### 9.2. Checklist de Implementación

#### PWA
- [ ] `manifest.json` creado con todos los campos requeridos
- [ ] `service-worker.js` implementado con estrategia de cache
- [ ] Service Worker registrado en `index.html`
- [ ] Iconos PWA generados (192x192, 512x512, favicon)
- [ ] Meta tags PWA agregados a `index.html`
- [ ] Probado en Chrome Android (instalación + offline)
- [ ] Probado en Safari iOS (instalación + offline)
- [ ] Lighthouse PWA score ≥90

#### Identidad Visual
- [ ] `src/constants/colors.ts` creado con paleta completa
- [ ] Tailwind CSS configurado con colores personalizados
- [ ] Regla 60-30-10 aplicada en todas las vistas
- [ ] Colores de ritual aplicados dinámicamente (A.R.A., Café, Life)
- [ ] Tipografía Inter aplicada consistentemente
- [ ] Estados de componentes (hover, active, disabled) implementados
- [ ] Contraste de colores validado (WCAG AA)

#### Estructura de Código
- [ ] Carpeta `src/` creada con subcarpetas (components, views, services, etc.)
- [ ] Archivos movidos a nueva estructura
- [ ] `StorageService.ts` implementado
- [ ] `RitualEngine.ts` implementado
- [ ] `AudioService.ts` implementado
- [ ] Hooks personalizados creados (`useLocalStorage`, `useRitualProgress`)
- [ ] Imports actualizados en todos los archivos
- [ ] Build exitoso sin errores (`npm run build`)

#### Documentación
- [ ] `arquitectura-real-mvp.md` creado
- [ ] `README.md` actualizado con instrucciones
- [ ] Decisiones técnicas documentadas en Bitácora de Aprendizaje
- [ ] Diagramas de arquitectura actualizados

---

## 10. Bitácora de Aprendizaje

### Versión 1.0 (2025-02-05)
**Contexto:** Creación de la directiva para reconciliar la visión arquitectónica (PHP/Laravel) con la implementación real (React SPA).

**Decisiones Clave:**
1. **Optar por enfoque híbrido**: Mantener React como MVP, documentar arquitectura real, planear migración futura
2. **Priorizar PWA**: Convertir la app en PWA es crítico para experiencia móvil y offline
3. **Reorganizar código**: Estructura actual (archivos en raíz) no es escalable, mover a `src/`
4. **Centralizar colores**: Crear `colors.ts` para evitar hardcodeo y facilitar cambios de tema

**Lecciones Aprendidas:**
- **LocalStorage es suficiente para MVP**: No necesitamos backend para validar la propuesta de valor
- **PWA permite instalación sin app stores**: Reduce fricción para usuarios piloto
- **Tailwind CDN es limitante**: Migrar a instalación local permite personalización completa
- **Separación de responsabilidades es clave**: Services, hooks y utils facilitan testing y mantenimiento

**Casos Reales:**
- **Problema:** Colores hardcoded en componentes dificultan cambios de identidad visual
  - **Solución:** Crear `colors.ts` centralizado y usar variables en todos los componentes
- **Problema:** Audio no se reproduce automáticamente en iOS
  - **Solución:** Requerir tap del usuario antes de `audio.play()` (botón "Iniciar Ritual")

---

## 11. Integración con Otras Directivas

### 11.1. Directiva de Identidad Visual
- **Dependencia:** Esta directiva implementa los colores, tipografía y reglas definidas en `Directiva_identidad_visual.md`
- **Flujo:** Identidad Visual (define) → MVP Híbrido (implementa) → Código (aplica)
- **Archivos compartidos:** `src/constants/colors.ts`, `tailwind.config.js`

### 11.2. Directiva de UX
- **Dependencia:** Seguir principios de mobile-first, una acción principal, feedback inmediato
- **Flujo:** UX (define principios) → MVP Híbrido (estructura código) → Componentes (aplican)
- **Validación:** Lighthouse Accessibility score ≥90

### 11.3. Directiva de Modos de Ritual
- **Dependencia:** Implementar lógica de manual vs asistido en `RitualEngine.ts` y `AudioService.ts`
- **Flujo:** Modos Ritual (define lógica) → MVP Híbrido (estructura services) → RitualView (consume)
- **Archivos compartidos:** `src/services/RitualEngine.ts`, `src/services/AudioService.ts`

### 11.4. Requerimientos.md
- **Relación:** Esta directiva documenta la **Fase 1** del plan descrito en `requerimientos.md`
- **Divergencia:** `requerimientos.md` describe arquitectura PHP/Laravel, esta directiva implementa React SPA
- **Convergencia futura:** Fase 2+ migrará a backend según `requerimientos.md`

---

## 12. Plan de Migración a Backend (Fase 2+)

### 12.1. Estrategia de Migración

```
FASE 1 (ACTUAL)          FASE 2 (FUTURO)          FASE 3 (LARGO PLAZO)
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│ React SPA    │         │ React SPA    │         │ React SPA    │
│ LocalStorage │   →     │ + API REST   │   →     │ + GraphQL    │
│ PWA          │         │ + Auth       │         │ + WebSockets │
└──────────────┘         └──────────────┘         └──────────────┘
                         ┌──────────────┐         ┌──────────────┐
                         │ PHP/Laravel  │         │ PHP/Laravel  │
                         │ MySQL        │         │ MySQL        │
                         │ JWT Auth     │         │ Redis Cache  │
                         └──────────────┘         └──────────────┘
```

### 12.2. Pasos de Migración (Fase 2)

1. **Crear API REST en Laravel**
   - Endpoints: `/api/user`, `/api/rituals`, `/api/completions`
   - Autenticación: JWT (Laravel Sanctum)
   - Base de datos: MySQL (según `requerimientos.md`)

2. **Adaptar `StorageService.ts`**
   - Cambiar de LocalStorage a llamadas API
   - Mantener interfaz pública igual (sin romper componentes)
   - Agregar manejo de errores de red

3. **Implementar sincronización**
   - Estrategia: Offline-first con sync al reconectar
   - Usar IndexedDB como cache local
   - Resolver conflictos (last-write-wins o manual)

4. **Migrar datos de usuarios piloto**
   - Script de exportación desde LocalStorage
   - Script de importación a MySQL
   - Validación de integridad de datos

### 12.3. Criterios para Iniciar Fase 2

- [ ] MVP validado con ≥20 usuarios piloto
- [ ] Feedback positivo sobre propuesta de valor
- [ ] Necesidad de sincronización entre dispositivos confirmada
- [ ] LocalStorage alcanzando límites de capacidad
- [ ] Presupuesto aprobado para desarrollo backend

---

## 13. Referencias y Recursos

### 13.1. Documentación Técnica
- [PWA Checklist](https://web.dev/pwa-checklist/)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [LocalStorage Best Practices](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [Tailwind CSS Configuration](https://tailwindcss.com/docs/configuration)

### 13.2. Herramientas de Validación
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [WebPageTest](https://www.webpagetest.org/)
- [PWA Builder](https://www.pwabuilder.com/)
- [Can I Use](https://caniuse.com/) (compatibilidad de navegadores)

### 13.3. Inspiración de Diseño
- [Headspace](https://www.headspace.com/) (rituales de meditación)
- [Duolingo](https://www.duolingo.com/) (gamificación, niveles)
- [Notion](https://www.notion.so/) (UX limpia, mobile-first)

---

## 14. Roadmap Visual

```
┌─────────────────────────────────────────────────────────────────┐
│                        FASE 1: MVP HÍBRIDO                      │
├─────────────────────────────────────────────────────────────────┤
│ Semana 1-2: PWA + Identidad Visual                             │
│  ✓ Crear manifest.json, service-worker.js, iconos              │
│  ✓ Implementar colors.ts y aplicar paleta                      │
│  ✓ Configurar Tailwind personalizado                           │
│                                                                 │
│ Semana 3-4: Reorganización de Código                           │
│  ✓ Crear estructura src/ (services, hooks, utils)              │
│  ✓ Implementar StorageService, RitualEngine, AudioService      │
│  ✓ Crear hooks personalizados                                  │
│                                                                 │
│ Semana 5: Testing y Documentación                              │
│  ✓ Pruebas en dispositivos reales (Android/iOS)                │
│  ✓ Lighthouse audit (PWA, Performance, Accessibility)          │
│  ✓ Documentar arquitectura real en arquitectura-real-mvp.md    │
│                                                                 │
│ Semana 6: Piloto con Usuarios                                  │
│  ✓ Desplegar en servidor HTTPS                                 │
│  ✓ Onboarding de 10-20 usuarios piloto                         │
│  ✓ Recopilar feedback y métricas de uso                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FASE 2: BACKEND + SYNC                       │
│  - Desarrollar API REST en Laravel                              │
│  - Implementar autenticación JWT                                │
│  - Migrar datos a MySQL                                         │
│  - Sincronización offline-first                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 15. Conclusión

Esta directiva establece un **puente pragmático** entre la visión arquitectónica (PHP/Laravel + DDD) y la realidad técnica actual (React SPA + LocalStorage). Al documentar explícitamente esta divergencia y definir un plan de migración claro, permitimos:

1. **Validar rápidamente** la propuesta de valor con usuarios reales (MVP funcional en 6 semanas)
2. **Mantener calidad técnica** (PWA, identidad visual, código organizado)
3. **Preparar el futuro** (estructura de services facilita migración a API)
4. **Transparencia total** (stakeholders entienden qué se está construyendo realmente)

**Próximos pasos inmediatos:**
1. Implementar PWA (manifest, service worker, iconos)
2. Aplicar identidad visual (colors.ts, Tailwind personalizado)
3. Reorganizar código (src/, services, hooks)
4. Probar en dispositivos reales
5. Lanzar piloto con usuarios

---

**Última actualización:** 2025-02-05  
**Próxima revisión:** Después del piloto con usuarios (Semana 6)
