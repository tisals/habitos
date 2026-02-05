# DIRECTIVA: Pantalla de Perfil de Usuario

> **Responsable:** ProfileController.php + profile.blade.php  
> **Archivo Asociado:** `src/Http/Controllers/ProfileController.php` + `resources/views/profile.blade.php` + `assets/js/theme-switcher.js` + `assets/js/notification-handler.js`  
> **Estado:** Activo  
> **Última Mejora:** 2026-02-03  
> **Versión:** 1.0.0

---

## 1. ¿Para qué sirve esto? (Misión)

Esta pantalla centraliza toda la información del usuario y sus preferencias de experiencia. Es el lugar donde el usuario controla cómo quiere vivir la app: tema claro/oscuro, notificaciones, modo de ritual preferido, y ve su progreso histórico. Sin esta pantalla, el usuario no tiene control sobre su experiencia.

---

## 2. Responsabilidad Única (SOLID)

**ProfileController.php** SOLO maneja la lógica de mostrar y actualizar el perfil del usuario. No ejecuta rituales, no calcula rachas, no procesa pagos. Solo lee y actualiza preferencias y datos del usuario.

**profile.blade.php** SOLO renderiza la interfaz del perfil. No contiene lógica de negocio, solo presenta datos y captura cambios.

**theme-switcher.js** SOLO maneja el cambio de tema claro/oscuro. No toca notificaciones ni otras preferencias.

**notification-handler.js** SOLO maneja la activación/desactivación de notificaciones. No toca temas ni otras preferencias.

---

## 3. Entradas y Salidas (I/O)

### Qué recibe (Inputs):
- **Usuario autenticado:** `Auth::user()` desde Laravel.
- **Preferencias actuales:** Desde tabla `users` (campos: `theme_preference`, `notifications_enabled`, `default_ritual_mode`).
- **Progreso histórico:** Desde tabla `user_daily_status` (racha más larga, total días ganados).
- **Diagnóstico:** Desde tabla `diagnostic_results` (nivel asignado, preguntas contestadas).
- **Suscripción:** Desde tabla `subscriptions` (estado: free/premium, fecha de renovación).
- **Acciones del usuario:** Toggle de tema, toggle de notificaciones, cambio de modo ritual preferido.

### Qué entrega (Outputs):
- **Vista renderizada:** Pantalla de perfil con toda la información.
- **Actualización de preferencias:** Guarda cambios en tabla `users`.
- **Feedback visual:** Mensaje de confirmación "Preferencias actualizadas ✅".
- **Logs:** Registro de cambios de preferencias para métricas.
- **Evento:** Dispara evento `UserPreferencesUpdated` para que otros componentes se enteren.

**Ejemplo:**
```
Input:  Usuario hace clic en toggle de tema oscuro
Output: Campo `theme_preference` en DB cambia de 'light' a 'dark'
Action: Evento UserPreferencesUpdated disparado
UI:     Tema de la app cambia inmediatamente sin recargar página
```

---

## 4. El Paso a Paso (Lógica)

### Flujo de Carga de Pantalla (GET /profile):
1. **Autenticación:** Verificar que el usuario está logueado (`Auth::check()`).
2. **Cargar datos del usuario:** Nombre, email, nivel, estado de suscripción.
3. **Cargar preferencias:** Tema actual, notificaciones activadas, modo ritual preferido.
4. **Cargar progreso histórico:**
   - Racha más larga (query a `user_daily_status`).
   - Total de días ganados (count de días con `day_won = true`).
   - Total de rituales completados (count de `ritual_completions`).
5. **Cargar diagnóstico:** Preguntas contestadas, nivel asignado.
6. **Renderizar vista:** Pasar todos los datos a `profile.blade.php`.
7. **Aplicar tema actual:** Cargar CSS correspondiente (light.css o dark.css).

### Flujo de Actualización de Preferencias (POST /profile/update):
1. **Validación:** Verificar que el request viene del usuario autenticado.
2. **Sanitización:** Limpiar inputs (`theme_preference`, `notifications_enabled`, `default_ritual_mode`).
3. **Validación de valores:**
   - `theme_preference`: solo 'light' o 'dark'.
   - `notifications_enabled`: solo true o false.
   - `default_ritual_mode`: solo 'assisted' o 'manual'.
4. **Actualización en DB:** Guardar cambios en tabla `users`.
5. **Disparar evento:** `UserPreferencesUpdated` con los datos actualizados.
6. **Registrar métrica:** Log de cambio de preferencia (para análisis de uso).
7. **Retornar respuesta:** JSON con `{ success: true, message: "Preferencias actualizadas" }`.
8. **Feedback en UI:** Mostrar mensaje de confirmación sin recargar página.

### Flujo de Cambio de Tema (JS):
1. **Usuario hace clic en toggle de tema.**
2. **JS captura evento:** `theme-switcher.js` detecta el cambio.
3. **Enviar request AJAX:** POST a `/profile/update` con `{ theme_preference: 'dark' }`.
4. **Esperar respuesta:** Backend actualiza DB y responde.
5. **Aplicar tema inmediatamente:**
   - Remover clase `theme-light` del `<body>`.
   - Agregar clase `theme-dark` al `<body>`.
   - Cargar `dark.css` si no está cargado.
6. **Guardar en localStorage:** Para persistir preferencia en sesión actual.
7. **Mostrar feedback:** Mensaje "Tema actualizado ✅" (desaparece en 2 segundos).

### Flujo de Cambio de Notificaciones (JS):
1. **Usuario hace clic en toggle de notificaciones.**
2. **JS captura evento:** `notification-handler.js` detecta el cambio.
3. **Si activa notificaciones:**
   - Pedir permiso al navegador (`Notification.requestPermission()`).
   - Si el usuario rechaza, revertir toggle y mostrar mensaje.
   - Si acepta, enviar request AJAX a `/profile/update` con `{ notifications_enabled: true }`.
4. **Si desactiva notificaciones:**
   - Enviar request AJAX a `/profile/update` con `{ notifications_enabled: false }`.
5. **Backend actualiza DB y responde.**
6. **Mostrar feedback:** Mensaje "Notificaciones actualizadas ✅".

---

## 5. Reglas de Oro (Restricciones y Seguridad)

### SIEMPRE:
- ✅ Verificar autenticación antes de mostrar o actualizar perfil.
- ✅ Sanitizar todos los inputs del usuario.
- ✅ Validar que los valores de preferencias son válidos (no aceptar valores arbitrarios).
- ✅ Aplicar cambios de tema inmediatamente sin recargar página (mejor UX).
- ✅ Guardar preferencias en localStorage para persistencia en sesión actual.
- ✅ Registrar cambios de preferencias como métricas (para análisis de engagement).
- ✅ Mostrar feedback visual inmediato en cada acción.
- ✅ Usar CSRF token en todos los requests POST.

### NUNCA:
- ❌ Permitir que un usuario vea o edite el perfil de otro usuario.
- ❌ Confiar en valores de preferencias sin validar.
- ❌ Recargar la página completa al cambiar tema o notificaciones (mala UX).
- ❌ Mostrar información sensible (contraseña, tokens) en la pantalla de perfil.
- ❌ Permitir cambiar nivel o suscripción desde el frontend (solo desde admin o proceso de pago).
- ❌ Hacer queries pesadas para cargar progreso histórico (usar índices en DB).

---

## 6. Dependencias (Qué necesita para funcionar)

**Backend (ProfileController.php):**
- Necesita `User` model para leer y actualizar datos del usuario.
- Necesita `UserDailyStatus` model para calcular racha más larga y días ganados.
- Necesita `RitualCompletion` model para contar rituales completados.
- Necesita `DiagnosticResult` model para mostrar nivel asignado.
- Necesita `Subscription` model para mostrar estado de suscripción.
- Necesita middleware `auth` para proteger la ruta.

**Frontend (profile.blade.php):**
- Necesita Alpine.js para interactividad.
- Necesita Tailwind CSS para estilos.
- Necesita `theme-switcher.js` para cambio de tema.
- Necesita `notification-handler.js` para manejo de notificaciones.
- Necesita `light.css` y `dark.css` para temas.

**JavaScript:**
- Necesita `fetch()` o `axios` para requests AJAX.
- Necesita `localStorage` para persistir preferencias en sesión.
- Necesita API de Notificaciones del navegador (`Notification`).

---

## 7. Casos Borde y "Trampas" Conocidas

### Limitaciones Conocidas:
- **Notificaciones en iOS:** Safari requiere que el permiso se pida con interacción del usuario (no automáticamente al cargar página).
- **Tema no persiste entre dispositivos:** Si el usuario usa la app en móvil y desktop, el tema no se sincroniza automáticamente (depende de localStorage). Solución: guardar en DB y cargar desde ahí.
- **Racha más larga puede ser costosa de calcular:** Si el usuario tiene miles de registros, la query puede ser lenta. Solución: cachear este valor y recalcularlo solo cuando cambia.
- **Usuario sin diagnóstico:** Si el usuario se registró pero no completó el diagnóstico, mostrar mensaje "Completa tu diagnóstico para desbloquear más funciones".

### Errores Comunes y Soluciones:
| Error | Por qué pasa | Cómo evitarlo |
| :--- | :--- | :--- |
| Tema no cambia al hacer clic | JS no está cargado o hay error en consola | Verificar que `theme-switcher.js` está incluido y sin errores |
| Notificaciones no funcionan | Usuario rechazó permiso o navegador no soporta | Verificar `Notification.permission` antes de pedir permiso |
| Racha más larga muestra 0 | Query mal construida o no hay datos | Verificar que la query usa `MAX()` correctamente |
| Preferencias no se guardan | CSRF token inválido o usuario no autenticado | Verificar que el token está presente en el form |
| Tema se resetea al recargar | No se guarda en DB, solo en localStorage | Guardar en DB y cargar desde ahí al iniciar sesión |

---

## 8. Bitácora de Aprendizaje (Memoria del Sistema)

| Fecha | Qué falló | Por qué pasó | Cómo lo arreglamos para siempre |
| :--- | :--- | :--- | :--- |
| 2026-02-03 | Tema no persistía entre sesiones | Solo guardábamos en localStorage, no en DB | Ahora guardamos en campo `theme_preference` en tabla `users` |
| 2026-02-03 | Toggle de notificaciones no funcionaba en iOS | Safari requiere interacción del usuario para pedir permiso | Movimos `requestPermission()` al evento de clic, no al cargar página |
| 2026-02-03 | Racha más larga tardaba 3 segundos en cargar | Query sin índice en `user_daily_status` | Agregamos índice en `user_id` y `date` |

> **Nota de Implementación:** Si encuentras un nuevo error, **primero** arréglalo en el script, y **luego** documenta la regla aquí para evitar regresiones futuras.

---

## 9. Flujo de Integración (Cómo se conecta con el resto)

**Diagrama de flujo:**
```
Usuario hace clic en "Perfil" en bottom navigation
    ↓
GET /profile
    ↓
ProfileController::show()
    ├─ Carga datos de User model
    ├─ Carga progreso de UserDailyStatus model
    ├─ Carga diagnóstico de DiagnosticResult model
    └─ Carga suscripción de Subscription model
    ↓
Renderiza profile.blade.php con todos los datos
    ↓
Usuario ve pantalla de perfil
    ↓
Usuario cambia tema a oscuro
    ↓
theme-switcher.js captura evento
    ↓
POST /profile/update con { theme_preference: 'dark' }
    ↓
ProfileController::update()
    ├─ Valida input
    ├─ Actualiza campo en DB
    ├─ Dispara evento UserPreferencesUpdated
    └─ Retorna { success: true }
    ↓
JS aplica tema oscuro inmediatamente
    ↓
Usuario ve cambio sin recargar página
```

---

## 10. Checklist de Pre-Implementación

Antes de escribir código:
- [ ] ¿He leído esta directiva completa?
- [ ] ¿Entiendo la responsabilidad única de ProfileController?
- [ ] ¿Sé cuáles son los inputs y outputs?
- [ ] ¿Conozco los casos borde (notificaciones en iOS, tema no persiste)?
- [ ] ¿Tengo claro qué modelos necesito (User, UserDailyStatus, DiagnosticResult, Subscription)?
- [ ] ¿Sé cómo manejar el cambio de tema sin recargar página?

---

## 11. Checklist de Post-Implementación

Después de escribir código:
- [ ] El código sigue la responsabilidad única (SOLID).
- [ ] Todos los inputs están sanitizados y validados.
- [ ] El cambio de tema funciona sin recargar página.
- [ ] Las notificaciones piden permiso correctamente en iOS y Android.
- [ ] Las preferencias se guardan en DB y persisten entre sesiones.
- [ ] Los logs muestran el flujo correcto.
- [ ] ¿Hay nuevas restricciones o aprendizajes?
- [ ] ¿Actualicé la sección "Bitácora de Aprendizaje"?
- [ ] ¿Documenté el cambio en CHANGELOG.md?
- [ ] ¿Registré las métricas necesarias (cambio de tema, activación de notificaciones)?

---

## 12. Notas Adicionales

### Decisiones de Diseño:
- **Por qué guardar preferencias en DB y localStorage:** DB para persistencia entre sesiones y dispositivos, localStorage para aplicar inmediatamente sin esperar respuesta del servidor.
- **Por qué no permitir cambiar nivel desde perfil:** El nivel se asigna según diagnóstico y no debe ser editable por el usuario (evita gaming del sistema).
- **Por qué mostrar racha más larga:** Es un motivador psicológico poderoso ("mi récord fue 21 días, puedo volver a lograrlo").

### Referencias:
- [Notification API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API)
- [localStorage - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [CSRF Protection - Laravel](https://laravel.com/docs/11.x/csrf)

### Advertencias de Seguridad:
- **Nunca confiar en valores de preferencias sin validar:** Un usuario malicioso podría enviar valores arbitrarios (ej: `theme_preference: '<script>alert(1)</script>'`).
- **Siempre verificar autenticación:** No permitir que un usuario no autenticado acceda a `/profile`.

---

**Última Actualización:** 2026-02-03  
**Responsable:** Alejandro Leguízamo  
**Estado:** Activo