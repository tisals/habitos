# REQUERIMIENTOS: La Llave de tu Potencial (Arquitectura Híbrida)

## 1\. Visión del Sistema

**La Llave de tu Potencial** es una aplicación híbrida (Web App + App descargable para Play Store) diseñada para ayudar a profesionales y líderes a construir hábitos sostenibles mediante rituales diarios guiados, seguimiento de rachas y un sistema de autoconocimiento progresivo.

El sistema prioriza:

* **Simplicidad cognitiva:** Una acción principal por pantalla.

* **Regulación del sistema nervioso:** No solo productividad, sino bienestar emocional.

* **Experiencia mobile-first:** Diseñada como app nativa desde el día 1.

* **Mejora continua basada en uso real:** El sistema aprende de los patrones de los usuarios.

**Diferenciador clave:** No es otra app de hábitos genérica. Es un sistema de 3 rituales científicamente diseñados (C.A.F.É., L.I.F.E., P.I.T.) con modos de uso adaptables (manual/asistido) y un modelo de niveles que personaliza la experiencia según el estado del usuario.

---

## 2\. Los Tres Componentes (Arquitectura Fundamental)

### 🧠 Componente 1: La Arquitectura (Directivas) - `directivas/`

**¿Qué es?** La Fuente de la Verdad. Archivos Markdown que definen objetivos, entradas, salidas, lógica, experiencia de usuario y trampas conocidas.

**¿Por qué existe?** Porque el código sin documentación es una bomba de tiempo. Cada clase, cada pantalla, cada decisión de UX debe estar escrita en una directiva. Cuando algo falla, la directiva se actualiza. Cuando alguien nuevo llega, lee la directiva primero.

**Regla de Oro:** Si aprendes una nueva restricción (ej. "El audio de fondo no funciona en iOS si no se activa con interacción del usuario"), DEBES escribir esto en la Directiva inmediatamente.

**Estructura:**

```
directivas/
├── directiva_ejemplo.md                    # Plantilla maestra
├── directiva-class-database.md             # Persistencia (usuarios, rituales, rachas)
├── directiva-class-ritual-engine.md        # Orquestador de rituales
├── directiva-class-user-progress.md        # Lógica de rachas y día ganado
├── directiva-class-settings.md             # Configuración y preferencias
├── directiva-class-auth.md                 # Autenticación y roles
├── directiva-class-diagnostics.md          # Sistema de diagnóstico y niveles
├── directiva-class-subscription.md         # Lógica de suscripción y premium
├── directiva-ux-experiencia-usuario.md     # Principios de UX y navegación
├── directiva-perfil-usuario.md             # Pantalla de perfil y preferencias
├── directiva-modos-ritual.md               # Modo manual vs asistido
├── directiva-notificaciones.md             # Sistema de notificaciones
├── directiva-app-hibrida.md                # PWA y preparación para Play Store
└── directiva-admin-ui.md                   # Panel de administración
```

**Formato:** SOPs (Procedimientos Operativos Estándar) de alto nivel. Sin bloques de código, solo lógica, pasos, advertencias y principios de experiencia. Estilo mixto: estructura clara + lenguaje humano.

---

### 🔧 Componente 2: La Construcción - `src/` + `assets/` + `admin/`

**¿Qué es?** Código limpio y determinista (TypeScript/React/Vite para frontend, con una capa de Servicios/Repositorios desacoplada), todo siguiendo patrones SOLID.

**¿Por qué existe?** Porque la directiva es el plano, pero el código es la casa. Aquí es donde vive la lógica real.

**Estructura:**

```
la-llave-potencial/
├── src/
│   ├── Domains/
│   │   ├── Ritual/
│   │   │   ├── Models/
│   │   │   │   └── Ritual.php              # Modelo de ritual
│   │   │   ├── Actions/
│   │   │   │   ├── CompleteRitual.php      # Marcar ritual completado
│   │   │   │   └── SwitchRitualMode.php    # Cambiar modo manual/asistido
│   │   │   ├── Repositories/
│   │   │   │   ├── RitualRepositoryInterface.php
│   │   │   │   └── EloquentRitualRepository.php
│   │   │   └── DTOs/
│   │   │       └── RitualCompletionDTO.php
│   │   ├── UserProgress/
│   │   │   ├── Models/
│   │   │   │   ├── RitualCompletion.php    # Registro de completados
│   │   │   │   └── UserDailyStatus.php     # Estado diario y rachas
│   │   │   └── Actions/
│   │   │       ├── UpdateStreak.php        # Actualizar racha
│   │   │       └── CalculateDayWon.php     # Calcular día ganado
│   │   ├── Diagnostics/
│   │   │   ├── Models/
│   │   │   │   └── DiagnosticResult.php    # Resultado de diagnóstico
│   │   │   └── Actions/
│   │   │       └── AssignLevel.php         # Asignar nivel al usuario
│   │   ├── User/
│   │   │   ├── Models/
│   │   │   │   └── User.php                # Usuario con preferencias
│   │   │   └── Actions/
│   │   │       ├── UpdatePreferences.php   # Actualizar preferencias
│   │   │       └── ToggleNotifications.php # Activar/desactivar notificaciones
│   │   └── Subscription/
│   │       ├── Models/
│   │       │   └── Subscription.php        # Estado de suscripción
│   │       └── Actions/
│   │           └── UpgradeToPremium.php    # Upgrade manual/automático
│   └── Http/
│       ├── Controllers/
│       │   ├── DashboardController.php     # Dashboard principal
│       │   ├── RitualController.php        # Ejecución de rituales
│       │   ├── ProfileController.php       # Pantalla de perfil
│       │   ├── DiagnosisController.php     # Diagnóstico inicial
│       │   ├── PlansController.php         # Planes y suscripción
│       │   └── Admin/
│       │       ├── RitualAdminController.php
│       │       ├── UserAdminController.php
│       │       └── MetricsAdminController.php
│       └── Middleware/
│           ├── CheckSubscription.php       # Verificar acceso premium
│           └── CheckLevel.php              # Verificar nivel de usuario
├── assets/
│   ├── css/
│   │   ├── app.css                         # Estilos principales (Tailwind)
│   │   ├── themes/
│   │   │   ├── light.css                   # Tema claro
│   │   │   └── dark.css                    # Tema oscuro
│   │   └── components/
│   │       ├── ritual-card.css             # Componente de ritual
│   │       ├── profile.css                 # Pantalla de perfil
│   │       └── modal.css                   # Pop-ups y modales
│   ├── js/
│   │   ├── app.js                          # Lógica principal (Alpine.js)
│   │   ├── ritual-player.js                # Reproductor de rituales
│   │   ├── audio-manager.js                # Gestión de audio (música/guías)
│   │   ├── theme-switcher.js               # Cambio de tema claro/oscuro
│   │   └── notification-handler.js         # Manejo de notificaciones
│   └── audio/
│       ├── ambient/
│       │   ├── relaxing-music-1.mp3        # Música relajante modo manual
│       │   └── relaxing-music-2.mp3
│       └── guided/
│           ├── cafe-guided.mp3             # Audio guiado C.A.F.É.
│           ├── life-guided.mp3             # Audio guiado L.I.F.E.
│           └── PIT-guided.mp3              # Audio guiado P.I.T.
├── admin/
│   └── admin-dashboard.php                 # Panel de administración
├── public/
│   ├── index.php                           # Punto de entrada
│   ├── manifest.json                       # PWA manifest
│   └── service-worker.js                   # Service worker para PWA
├── database/
│   └── migrations/                         # Migraciones de base de datos
├── README.md                               # Bitácora técnica e instalación
├── CHANGELOG.md                            # Registro de versiones
└── requerimientos.md                       # Este archivo
```

**Regla de Oro:** Cada clase tiene una responsabilidad única (SOLID). No mezcles persistencia con lógica de negocio. No mezcles UX con backend. No mezcles audio con autenticación.

---

### 👁️ Componente 3: El Observador (Tú, el Ingeniero)

**¿Qué es?** El enlace entre la Intención y la Ejecución. Eres el bibliotecario del sistema y el guardián de la experiencia del usuario.

**¿Por qué existe?** Porque el código no se escribe solo, y los errores no se arreglan solos. Tú eres quien:

* Lee la directiva antes de programar.

* Ejecuta el código y observa qué pasa.

* Si algo falla, arreglas el código Y actualizas la directiva.

* Aseguras que el sistema "aprenda" de sus propios errores.

* **Validas que la experiencia se sienta como app nativa.**

**Tu Protocolo (Obligatorio):**

1. **Consultar Directiva:** Antes de tocar código, se lee su directiva en `directivas/`.

2. **Planear el Cambio:** Si la lógica o UX cambia, se actualiza la directiva **antes** que el código.

3. **Implementar:** Código limpio, SOLID, con logs de depuración y pensando en mobile-first.

4. **Retroalimentar:** Si algo falló en la ejecución o la UX se siente torpe, se anota en el "Historial de Aprendizaje" de la directiva.

---

## 3\. El Flujo Principal del Usuario (Lógica de Negocio)

Este es el corazón de la app. Define cómo el usuario interactúa con los rituales y cómo el sistema responde.

### Flujo de Onboarding (Primera Vez)

```
Usuario abre la app por primera vez
    ↓
[1] Pantalla de bienvenida
    - Explicación breve de los 3 rituales
    - Botón "Empezar"
    ↓
[2] Registro/Login
    - Nombre, email, contraseña
    - O login con Google (a futuro)
    ↓
[3] Diagnóstico inicial (5-7 preguntas)
    - Evaluar nivel de burnout
    - Evaluar capacidad de adherencia
    - Calcular score → asignar nivel (1, 2 o 3)
    ↓
[4] Explicación personalizada según nivel
    - Nivel 1: "Empezaremos suave, solo con el ritual de mañana"
    - Nivel 2: "Vamos a trabajar mañana y noche"
    - Nivel 3: "Tienes acceso al sistema completo (con upgrade a premium)"
    ↓
[5] Dashboard principal
    - Ver rituales disponibles según nivel
    - Estado del día: vacío (aún no ha hecho nada)
```

### Flujo de Uso Diario (Usuario Recurrente)

```
Usuario abre la app
    ↓
[1] Dashboard principal
    - Saludo personalizado: "Buenos días, Alejandro"
    - Estado del día:
      - C.A.F.É.: ✅ hecho / ⭕ pendiente
      - L.I.F.E.: ✅ hecho / ⭕ pendiente
      - P.I.T.: disponible como botón de emergencia
    - Racha actual: "7 días ganados seguidos 🔥"
    - Mensaje inteligente según estado:
      - Si no ha hecho nada: "Tu día está intacto. Empecemos por ganar tu mañana."
      - Si hizo C.A.F.É.: "Ya ganaste la mañana. No dejes el día abierto, cierra con L.I.F.E."
      - Si ganó el día: "¡Día ganado! 🎉 Mañana vamos por el día 8."
    ↓
[2] Usuario hace clic en un ritual (ej: C.A.F.É.)
    ↓
[3] Pantalla de ritual
    - Título: "Ritual C.A.F.É."
    - Selector de modo visible:
      - 🎧 Modo Asistido (audio guiado)
      - ✍️ Modo Manual (música relajante)
    - Botón "¿Por qué hacemos esto?" → abre pop-up con:
      - Base científica
      - Beneficio emocional
      - Cuándo usarlo
    - Botón "Empezar ritual"
    ↓
[4a] Si elige Modo Asistido:
    - Audio guiado paso a paso
    - Temporizador visible
    - Botón "Siguiente" (se habilita al 50% del tiempo)
    - Al terminar: "Ritual completado ✅"
    ↓
[4b] Si elige Modo Manual:
    - Música relajante de fondo (loop)
    - Pasos escritos en pantalla
    - Usuario avanza a su ritmo
    - Botón "Marcar como completado"
    ↓
[5] Registro en base de datos
    - user_id, ritual_id, completed_at, mode_used
    - Actualizar estado del día
    - Recalcular racha si aplica
    ↓
[6] Volver al dashboard
    - Mostrar ritual como completado
    - Actualizar mensaje inteligente
```

### Flujo de Ritual P.I.T. (Salvavidas)

```
Usuario siente que el día se está saliendo de control
    ↓
[1] Hace clic en botón "P.I.T." (siempre visible en dashboard)
    ↓
[2] Verificar acceso
    - Nivel 1: no disponible (mostrar mensaje de upgrade)
    - Nivel 2: teaser bloqueado
    - Nivel 3 + Premium: acceso completo
    ↓
[3] Si tiene acceso:
    - Pantalla de P.I.T. con 3 pasos:
      - A – Atrapa (respiración guiada)
      - R – Reta (definir siguiente acción)
      - A – Afirma (compromiso de foco)
    - Modo asistido por defecto (audio corto, 2-3 min)
    ↓
[4] Registro de uso
    - user_id, ritual_id, completed_at
    - No afecta racha (es un salvavidas, no un ritual diario)
    ↓
[5] Mensaje de contención
    - "Respira. Ya recuperaste el control. Ahora enfócate en lo siguiente."
```

### Garantías del Sistema

* **Nunca dejar al usuario sin claridad.** Siempre sabe qué hacer ahora.

* **Trazabilidad completa.** Cada ritual completado se registra con modo usado.

* **Experiencia adaptable.** El sistema respeta el nivel y preferencias del usuario.

* **Sin culpa.** Si rompe racha, el mensaje es de contención, no de castigo.

---

## 4\. Modelo de Niveles y Accesos (Lógica de Negocio)

### Nivel 1 – Gratis total (entrada suave)

**Perfil:** Personas muy quemadas, baja adherencia, necesitan empezar con lo mínimo.

**Accesos:**

* **C.A.F.É.:** Completo (manual + audio guiado).

* **L.I.F.E.:** No disponible (se muestra como "vendrá después de avanzar").

* **P.I.T.:** No disponible.

**Objetivo:** Qué logren hacer C.A.F.É. al menos 3 días seguidos antes de agregar más.

---

### Nivel 2 – Gratis pero limitado

**Perfil:** Tiene algo de base, puede manejar dos rituales.

**Accesos:**

* **C.A.F.É.:** Completo (manual + audio).

* **L.I.F.E.:** Solo modo manual (audios bloqueados como contenido premium).

* **P.I.T.:** Teaser bloqueado ("Disponible en versión premium").

**Objetivo:** Validar que pueden sostener mañana + noche antes de ofrecer premium.

---

### Nivel 3 – Ideal para plan pago

**Perfil:** Listo para trabajar mañana + noche + rescates.

**Antes de pagar (modo free limitado):**

* **C.A.F.É.:** Completo (manual + audio).

* **L.I.F.E.:** Solo manual, audios bloqueados.

* **P.I.T.:** Bloqueado completo.

**Después de pagar (modo premium):**

* **C.A.F.É.:** Igual (ya lo tenían).

* **L.I.F.E.:** Manual + audios desbloqueados.

* **P.I.T.:** Ritual completo (manual + audio).

**Objetivo:** Convertir a usuarios que ya probaron el sistema y quieren la experiencia completa.

---

## 5\. Pantalla de Perfil (Mejora #1)

### Responsabilidad

Centralizar toda la información del usuario y sus preferencias de experiencia.

### Contenido de la pantalla

**Sección 1: Información del usuario**

* Nombre

* Email

* Nivel actual (1, 2 o 3)

* Estado de suscripción:

  * Free

  * Premium (con fecha de renovación si aplica)

**Sección 2: Preferencias de experiencia**

* 🌗 **Modo de tema:**

  * Claro / Oscuro

  * Toggle visible y funcional

* 🔔 **Notificaciones:**

  * Activar / Desactivar

  * Si están activadas, mostrar horarios configurados

* 🎧 **Preferencia de modo ritual:**

  * Asistido (audio guiado) por defecto

  * Manual (música relajante) por defecto

  * El sistema recuerda la última elección

**Sección 3: Progreso**

* Preguntas del diagnóstico contestadas (con opción de revisar)

* Rachas históricas:

  * Racha más larga

  * Total de días ganados

  * Total de rituales completados

**Sección 4: Acciones**

* Ver planes (si no es premium)

* Ayuda / FAQ

* Cerrar sesión

* Eliminar cuenta (a futuro)

### Regla de validación Micro SaaS

> Si el usuario entra al perfil, está comprometido. Ese evento es señal de engagement real y debe registrarse como métrica.

---

## 6\. Modos de Ritual: Manual vs Asistido (Mejora #2)

### Responsabilidad

Permitir que el usuario elija cómo quiere experimentar cada ritual según su estado mental y preferencias.

### Modo Asistido (Audio Guiado)

**¿Qué es?**

* Guía paso a paso con voz humana.

* Temporizadores por paso.

* UX dirigida: el usuario solo sigue instrucciones.

**¿Cuándo usarlo?**

* Cuando el usuario necesita estructura.

* Cuando está aprendiendo el ritual.

* Cuando quiere desconectar y solo seguir.

**Experiencia técnica:**

* Reproducir audio guiado (MP3 hosteado) no permite descarga.

* Mostrar temporizador visual.

* Botón "Siguiente" se habilita al 50% del tiempo del paso.

* Al terminar, marcar ritual como completado.

---

### Modo Manual (Música Relajante)

**¿Qué es?**

* Texto mínimo con los pasos.

* Música relajante de fondo (loop continuo).

* Usuario avanza a su ritmo.

* Cero interrupciones.

**¿Cuándo usarlo?**

* Cuando el usuario ya conoce el ritual.

* Cuando quiere ir más rápido o más lento.

* Cuando prefiere silencio mental con música de fondo.

**Experiencia técnica:**

* Reproducir música relajante en loop (MP3 hosteado) no permite descargas.

* Mostrar pasos en pantalla con checkboxes opcionales.

* Botón "Marcar como completado" siempre visible.

* Al terminar, marcar ritual como completado.

---

### Reglas UX obligatorias

1. **El cambio de modo debe ser explícito y visible.**

* Selector tipo toggle o botones claros antes de empezar el ritual.

1. **Nunca cambiar de modo sin consentimiento del usuario.**

2. **El sistema recuerda el último modo usado** (guardado en preferencias).

3. **El audio (guiado o música) debe poder pausarse/reanudarse.**

---

### Pop-up de trasfondo / explicación (Mejora #2)

**¿Qué es?**

* Botón "¿Por qué hacemos esto?" visible en la pantalla de cada ritual.

* Al hacer clic, abre un modal/pop-up con:

  * **Base científica:** Breve explicación respaldada por investigación.

  * **Beneficio emocional:** Qué sentirás al hacerlo.

  * **Cuándo usarlo:** Contexto ideal para este ritual.

**Ejemplo para C.A.F.É.:**

> **Base científica:** La claridad matutina aprovecha el pico de cortisol natural (30-45 min después de despertar) para tomar decisiones con menos ruido emocional.
>
> **Beneficio emocional:** Sentirás que el día es tuyo, no del mundo exterior.
>
> Conecta tu enfoque científico + humano. No es decoración, es diferenciación.

**Regla de oro:**

> **Cuándo usarlo:** Antes de revisar correos, redes o mensajes. Idealmente previo a tu café o té.

---

## 7\. Diseño para App Híbrida: Web + Play Store (Mejora #3)

### Responsabilidad

Preparar la app para funcionar como PWA (Progressive Web App) desde el día 1 y estar lista para empaquetarse como app nativa para Play Store.

### Estrategia técnica

**Fase 1: PWA (Ahora)**

* Crear `manifest.json` con:

  * Nombre de la app

  * Iconos (192x192, 512x512)

  * Colores de tema

  * Modo standalone (sin barra de navegador)

* Crear `service-worker.js` para:

  * Cachear assets críticos (CSS, JS, iconos)

  * Funcionar offline (al menos mostrar mensaje)

* Diseño mobile-first obligatorio:

  * Uso con una mano

  * Botones grandes (mínimo 44x44px)

  * Navegación tipo bottom navigation (como Instagram/WhatsApp)

**Fase 2: Wrapper para Play Store (Después)**

* Usar Capacitor o similar para empaquetar la PWA.

* Agregar funcionalidades nativas si es necesario:

  * Notificaciones push nativas

  * Acceso a calendario (para recordatorios)

* Publicar en Play Store con:

  * Screenshots de la app

  * Descripción optimizada para ASO (App Store Optimization)

### Reglas de diseño obligatorias

1. **Si no se siente como app, no pasa validación.**

* Cero scrolls horizontales.

* Cero menús complejos.

* Máximo 1 acción principal por pantalla.

1. **Navegación tipo app nativa:**

* Bottom navigation con 3-4 secciones:

  * 🏠 Inicio (Dashboard)

  * 📊 Progreso (Rachas y estadísticas)

  * 👤 Perfil

  * (Opcional) 🆘 P.I.T. (acceso rápido)

1. **Transiciones suaves:**

* Animaciones entre pantallas (fade, slide).

* Feedback visual inmediato en cada acción.

1. **Modo offline básico:**

* Si no hay conexión, mostrar último estado conocido.

* Mensaje claro: "Sin conexión. Tus datos se sincronizarán cuando vuelvas a estar online."

---

## 8\. El Bucle de Ingeniería de Contexto (Obligatorio)

Para que este proyecto no se vuelva un caos de código, seguimos este orden **siempre**:

### Paso 1: Consultar/Crear Directiva

* Antes de escribir una línea de código, se lee la directiva correspondiente.

* Si la tarea es nueva, primero se crea una directiva en Markdown.

* La directiva define QUÉ, POR QUÉ y CÓMO (sin código).

* **Incluye principios de UX si afecta la experiencia del usuario.**

### Paso 2: Ejecución de Código

* Generar código en `/src` para las clases (backend).

* CSS/JS en `/assets` para estilos y lógica del cliente.

* **Basarse estrictamente en la directiva.**

* Usar patrones SOLID: Single Responsibility, Open/Closed, Liskov, Interface Segregation, Dependency Inversion.

* **Validar que la experiencia se siente como app nativa.**

### Paso 3: Observación y Aprendizaje

* Si la ejecución falla, arreglar el código.

* **Si la UX se siente torpe o confusa, arreglar el diseño.**

* **Actualizar la directiva** con la lección aprendida.

* Documentar en la sección "Historial de Aprendizaje" de la directiva.

* Esto asegura que la próxima vez, no cometamos el mismo error.

---

## 9\. Estándares de Calidad

### Seguridad

* **Sanitización:** Siempre validar y sanitizar inputs del usuario.

* **Validación:** Verificar tipos de datos antes de usarlos.

* **Autenticación:** Usar tokens JWT o similar para sesiones.

* **Permisos:** Verificar nivel y suscripción antes de dar acceso a contenido premium.

### Rendimiento

* No hacer consultas pesadas dentro de loops.

* Usar índices en la DB para búsquedas frecuentes (user_id, ritual_id, date).

* Cachear assets estáticos (CSS, JS, audio).

* Lazy loading para audio (no cargar todos los archivos al inicio).

* Optimizar imágenes y audio (compresión sin pérdida de calidad).

### Experiencia de Usuario (UX)

* **Mobile-first obligatorio:** Diseñar primero para móvil, luego adaptar a desktop.

* **Máximo 1 acción principal por pantalla.**

* **Feedback visual inmediato:** Cada acción debe tener respuesta visual (animación, cambio de color, etc.).

* **Mensajes inteligentes:** El dashboard debe hablar como un coach, no como una máquina.

* **Sin culpa:** Si el usuario falla, el mensaje es de contención, no de castigo.

### Mantenibilidad

* Código limpio y comentado.

* Una clase = una responsabilidad.

* Logs detallados para depuración.

* Directivas actualizadas después de cada cambio.

* **Documentar decisiones de UX en las directivas.**

### Testing

* Cada clase debe ser testeable (inyección de dependencias).

* Logs en consola para validar flujos.

* Validar que el sistema de niveles funciona correctamente.

* Validar que el cambio de modo (manual/asistido) funciona sin bugs.

* Validar que el audio se reproduce correctamente en iOS y Android.

---

## 10\. Protocolo de Auto-Corrección (CRÍTICO)

Cuando un script da error o produce un resultado inesperado, activa el **Ciclo de Aprendizaje**:

### Paso 1: Diagnosticar

* Lee el stack trace o mensaje de error.

* Identifica **por qué** falló (¿Error lógico? ¿Timeout? ¿Permiso? ¿UX confusa?).

### Paso 2: Parchear Código o UX

* Arregla el script o el diseño.

* Prueba que funcione.

* **Si es un problema de UX, ajusta el diseño y valida con usuario real si es posible.**

### Paso 3: Parchear Directiva (El Paso de Memoria)

* Abre el archivo `.md` correspondiente en `directivas/`.

* Añade una fila en la sección "Historial de Aprendizaje".

* Escribe explícitamente: _"Nota: No hacer X, porque causa el error Y. En su lugar, hacer Z."_

* **Si es un aprendizaje de UX, documenta qué se sintió mal y cómo se arregló.**

### Paso 4: Verificar

* Ejecuta el script nuevamente para confirmar el arreglo.

* **Si es UX, valida que la experiencia se siente fluida.**

* Asegúrate de que la directiva refleja la solución.

**¿Por qué?** Al actualizar la Directiva, aseguras que la _próxima_ vez que ejecutemos esta tarea (o generemos un script similar), habremos "recordado" la limitación. No cometemos el mismo error dos veces.

---

## 11\. Métricas de Validación Micro SaaS (Obligatorio)

Para validar que el MVP funciona, el sistema debe registrar y mostrar estas métricas en el panel admin:

### Métricas de Activación

* % de usuarios registrados que completan al menos 1 C.A.F.É.

* % de usuarios registrados que completan al menos 1 L.I.F.E.

* % de usuarios que logran 1 "día ganado" en la primera semana.

### Métricas de Uso Continuo

* % de usuarios que hacen C.A.F.É. al menos 3 días en las primeras 2 semanas.

* % de usuarios que hacen L.I.F.E. al menos 3 días en las primeras 2 semanas.

* % de usuarios que tienen al menos 2 "días ganados" en las primeras 2 semanas.

* Racha promedio de usuarios activos.

### Métricas por Nivel

* **Nivel 1:**

  * % que usan C.A.F.É. 3+ veces.

* **Nivel 2:**

  * % que usan C.A.F.É. 3+ veces.

  * % que usan L.I.F.E. 3+ veces.

* **Nivel 3:**

  * % que visitan `/planes`.

  * % que hacen clic en "pagar ahora".

### Métricas de Monetización

* % de usuarios que visitan la pantalla de planes.

* % que hacen clic en "pagar ahora" (Wompi / WhatsApp / Stripe).

* % que efectivamente pagan y se les marca `is_premium = true`.

* Tasa de conversión: usuarios activos → premium.

### Métricas de Experiencia

* % de usuarios que entran a la pantalla de perfil (señal de engagement).

* % de usuarios que cambian de modo (manual ↔ asistido).

* % de usuarios que abren el pop-up "¿Por qué hacemos esto?".

* % de usuarios que activan/desactivan notificaciones.

* % de usuarios que cambian de tema (claro ↔ oscuro).

**Regla de oro:**

> Si no puedes medir, no puedes mejorar. Estas métricas son la brújula del producto.

---

## 12\. Checklist de Inicio de Sesión (Pre-Desarrollo)

Antes de tocar código:

* \[ \] ¿Existe una directiva para esta tarea?

* \[ \] ¿He leído la directiva completa?

* \[ \] ¿Entiendo el flujo esperado?

* \[ \] ¿Sé cuáles son los casos borde?

* \[ \] ¿Tengo claro qué clase/archivo debo modificar?

* \[ \] **¿Esta tarea afecta la UX? Si sí, ¿he leído la directiva de UX?**

* \[ \] **¿Esta tarea requiere audio? Si sí, ¿he validado que funciona en iOS y Android?**

---

## 13\. Checklist de Cierre (Post-Desarrollo)

Después de implementar:

* \[ \] El código funciona como se esperaba.

* \[ \] Los logs muestran el flujo correcto.

* \[ \] **La experiencia se siente como app nativa (no como web).**

* \[ \] **El audio (si aplica) funciona correctamente.**

* \[ \] **El cambio de modo (si aplica) funciona sin bugs.**

* \[ \] ¿Hay nuevas restricciones o aprendizajes?

* \[ \] ¿Actualicé la directiva correspondiente?

* \[ \] ¿Documenté el cambio en [CHANGELOG.md](http://CHANGELOG.md)?

* \[ \] **¿Registré las métricas necesarias para validación?**

---

## 14\. Notas Finales

Este documento es el **contrato** entre tú y el sistema. Si lo respetas, la app será robusta, mantenible, escalable y se sentirá como una app nativa desde el día 1. Si lo ignoras, será un caos.

**Recuerda:** La directiva no es un lujo, es una inversión en tu propio futuro. Cada línea que escribas hoy en una directiva te ahorra horas de depuración mañana.

**Diferenciador clave de este proyecto:**

* No es solo código, es experiencia.

* No es solo funcionalidad, es transformación.

* No es solo una app, es un sistema de vida.

**Validación Micro SaaS:**

* Valida uso real antes de agregar features.

* Valida monetización con usuarios reales.

* Valida que la experiencia engancha antes de escalar.

---

**Última Actualización:** 2026-02-05\
**Estado:** Activo - MVP en desarrollo (Arquitectura en Cebolla/Supabase)\
**Responsable:** Alejandro Leguízamo\
**Versión:** 2.0 - Arquitectura Híbrida (Web + Play Store)
