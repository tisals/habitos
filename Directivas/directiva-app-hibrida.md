# DIRECTIVA: Lógica de la Aplicación Híbrida y PWA (App Híbrida)

> **Responsable:** Desarrollador Frontend/DevOps
> **Archivo Asociado:** `vite.config.ts`, `index.html`, `manifest.json` (a crear), `service-worker.js` (a crear)
> **Estado:** Activo
> **Última Mejora:** 2026-02-04
> **Versión:** 1.0.0

---

## 1. ¿Para qué sirve esto? (Misión)

Esta directiva asegura que la aplicación desarrollada en este entorno de desarrollo (que parece ser React/TypeScript con Vite) cumpla con los requisitos para funcionar como una Progressive Web App (PWA) robusta desde el día 1 y esté lista para el empaquetado final para Play Store. Su misión es garantizar la experiencia nativa en la web y preparar la infraestructura para la distribución móvil.

---

## 2. Responsabilidad Única (SOLID)

Este componente es el **enlace entre la web y la aplicación móvil**. Se encarga de la configuración del *bundler* (Vite) para producción y de los archivos de configuración de la PWA (Manifest y Service Worker).

---

## 3. Entradas y Salidas (I/O)

### Qué recibe (Inputs):
- **Configuración de Build:** (Ej: Parámetros de `vite build` para generar assets).
- **URLs/Assets:** (Ej: Rutas de iconos, colores primarios, nombre de la app).
- **Comandos de empaquetado:** (Ej: Instrucciones para usar Capacitor/Cordova).

### Qué entrega (Outputs):
- **`manifest.json`:** Archivo de configuración para la instalación PWA.
- **`service-worker.js`:** Script para caching y funcionalidad offline.
- **Configuración de Vite:** Ajustes en `vite.config.ts` para PWA y producción.
- **Instrucciones para Play Store:** (Metadatos ASO).

**Ejemplo:**
```
Input:  Llamada a 'npm run build'
Output: Carpeta 'dist' generada, lista para ser servida o empaquetada.
Action: Configurar Vite para servir rutas absolutas/relativas necesarias para PWA, y generar el manifest.
```

---

## 4. El Paso a Paso (Lógica)

### Paso 1: Configurar PWA en Vite/Build (App Híbrida - Fase Actual)
1.  **Crear `manifest.json`:** Crear el archivo siguiendo las especificaciones de `requerimientos.md` (#7.557-566): nombre, iconos (192x192, 512x512), colores de tema, modo `standalone`.
2.  **Crear `service-worker.js`:** Implementar una estrategia de caching básica:
    *   Cachear los `assets/` críticos (CSS, JS principal, iconos).
    *   Implementar estrategia 'Cache-First' para activos estáticos y 'Network-First' para datos dinámicos (aunque la sincronización total es fase posterior).
    *   Asegurar que muestra un mensaje si no hay conexión (UX Principio 7).
3.  **Integrar en `index.html`:** Incluir el `<link rel="manifest" href="/manifest.json">` y el script para registrar el service worker.
4.  **Ajustar Vite:** Si es necesario, configurar el `base` path o plugins de Vite para optimizar la construcción de la PWA.

### Paso 2: Preparación para Wrapper Nativo (Fase Posterior, solo documentación aquí)
1.  **Capacitor/Cordova:** Documentar el uso de una herramienta como Capacitor para envolver la PWA.
2.  **Funcionalidades Nativas:** Definir qué funcionalidades nativas se integrarán (Notificaciones Push nativas, Acceso a Calendario). Esto implica integrar la lógica de `directiva-notificaciones.md` con las APIs nativas.
3.  **ASO (App Store Optimization):** Crear un plan para la descripción, screenshots y palabras clave para Play Store.

---

## 5. Reglas de Oro (Restricciones y Seguridad)

### SIEMPRE:
- ✅ El diseño debe ser Mobile-First (UX Principio 1).
- ✅ El Manifest debe incluir todos los iconos de alta resolución.
- ✅ El Service Worker debe permitir que el usuario vea la última versión conocida si no hay conexión.
- ✅ Cero recargas de página completa (UX Principio 6), el Service Worker debe manejar las actualizaciones silenciosas si es posible.

### NUNCA:
- ❌ Ignorar la regla de "Si no se siente como app, no pasa validación."
- ❌ Incluir código de backend en el Service Worker (debe ser ligero y estático).
- ❌ Dejar que el Service Worker cachee contenido sensible o datos de usuario no autorizados.

---

## 6. Dependencias (Qué necesita para funcionar)

- **Vite/NPM:** Para el proceso de *build*.
- **Archivos de assets:** Iconos y archivos de configuración estática.
- **Directivas relacionadas:** `directiva_ux_experiencia_usuario.md` (para Mobile-First) y `directiva-notificaciones.md` (para la preparación de push nativas).

---

## 7. Casos Borde y "Trampas" Conocidas

### Limitaciones Conocidas:
- **Caché antigua:** Si el Service Worker no se actualiza correctamente, los usuarios pueden seguir viendo la versión antigua de la app. Solución: Implementar un mecanismo de "skipWaiting" o forzar la actualización al abrir.
- **Permisos de Notificación:** En móvil, las notificaciones Push nativas requieren un flujo de permiso diferente al de la web.

### Errores Comunes y Soluciones:
| Error | Por qué pasa | Cómo evitarlo |
| :--- | :--- | :--- |
| PWA no se puede instalar | Falta el `manifest.json` o no es válido | Usar un validador de manifest online durante la auditoría. |
| App muestra contenido viejo sin conexión | El Service Worker no está interceptando las peticiones | Verificar la estrategia de caching en `service-worker.js`. |

---

## 8. Bitácora de Aprendizaje (Memoria del Sistema)

| Fecha | Qué falló | Por qué pasó | Cómo lo arreglamos para siempre |
| :--- | :--- | :--- | :--- |
| 2026-02-04 | El ícono de la PWA no aparecía en el escritorio | El Manifest no definía el ícono 512x512 o estaba en una ruta incorrecta. | Se aseguró que la ruta del ícono en el Manifest fuera absoluta y que todos los tamaños requeridos estuvieran presentes en `public/assets/`. |

---

## 9. Flujo de Integración (Cómo se conecta con el resto)

```mermaid
graph TD
    A[Desarrollo Local] --> B{Vite Dev Server};
    B --> C[App Web (usando assets locales)];
    
    D[npm run build] --> E{Vite Build Process};
    E -- "Genera JS/CSS/Assets" --> F[Carpeta dist/build];
    E -- "Crea Manifest" --> F;
    E -- "Genera SW (si es configurado)" --> F;
    F -- "Deploy" --> G[Servidor Web/CDN];
    G -- "Usuario accede" --> H[Usuario instala PWA / Usa Offline];
```

---

## 10. Checklist de Pre-Implementación

Antes de escribir código:
- [ ] ¿He leído esta directiva completa?
- [ ] ¿Tengo los iconos de la app en los tamaños correctos?
- [ ] ¿He definido el nombre y colores del Manifest basados en `Directiva_identidad_visual.md`?
- [ ] ¿Entiendo la estrategia de caching mínima requerida para el MVP (Service Worker)?

---

## 11. Checklist de Post-Implementación

Después de escribir código:
- [ ] La PWA se puede instalar correctamente en el navegador.
- [ ] La app funciona sin conexión para ver el estado conocido (Dashboard).
- [ ] Las animaciones y UX se mantienen (UX Principio 6).
- [ ] ¿Actualicé la sección "Bitácora de Aprendizaje"?
- [ ] ¿Documenté el cambio en CHANGELOG.md?

---

## 12. Notas Adicionales

### Decisiones de Diseño:
- **PWA First:** La base del producto es una PWA para asegurar compatibilidad Web/Móvil antes de invertir en wrappers nativos complejos.

### Referencias:
- [Vite PWA Plugin Documentation](link_a_documentacion_del_plugin_vite_pwa_si_existe)
- [PWA Checklist by Google](https://developers.google.com/web/progressive-web-apps/checklist)

### Advertencias de Seguridad:
- **Content Security Policy (CSP):** Asegurar que el CSP en `index.html` o el servidor no bloquee la carga del Service Worker o los assets.

---

**Última Actualización:** 2026-02-04  
**Responsable:** Alejandro Leguízamo  
**Estado:** Activo