# DIRECTIVA: Modos de Ritual (Manual vs Asistido)

> **Responsable:** RitualController.php + ritual-player.js + audio-manager.js  
> **Archivo Asociado:** `src/Http/Controllers/RitualController.php` + `assets/js/ritual-player.js` + `assets/js/audio-manager.js` + `resources/views/ritual.blade.php`  
> **Estado:** Activo  
> **Última Mejora:** 2026-02-03  
> **Versión:** 1.0.0

---

## 1. ¿Para qué sirve esto? (Misión)

Este componente permite que el usuario elija cómo quiere experimentar cada ritual: con audio guiado paso a paso (Modo Asistido) o con música relajante y pasos escritos a su ritmo (Modo Manual). Es el diferenciador clave de la app: no es rígida, se adapta al estado mental del usuario. Sin esta flexibilidad, la app sería solo otra app de hábitos genérica.

---

## 2. Responsabilidad Única (SOLID)

**RitualController.php** SOLO maneja la lógica de mostrar el ritual, registrar su inicio y su completado. No calcula rachas, no procesa pagos, no maneja audio (eso es del frontend).

**ritual-player.js** SOLO maneja la lógica de reproducción del ritual (temporizadores, avance de pasos, botones). No guarda en DB, no calcula rachas.

**audio-manager.js** SOLO maneja la reproducción de audio (guiado o música relajante). No maneja lógica de ritual, no guarda datos.

**ritual.blade.php** SOLO renderiza la interfaz del ritual. No contiene lógica de negocio, solo presenta pasos y captura acciones.

---

## 3. Entradas y Salidas (I/O)

### Qué recibe (Inputs):
- **Usuario autenticado:** `Auth::user()` desde Laravel.
- **Ritual seleccionado:** ID del ritual (C.A.F.É., L.I.F.E., A.R.A.).
- **Modo elegido:** 'assisted' o 'manual' (desde selector en UI).
- **Preferencia guardada:** Campo `default_ritual_mode` en tabla `users`.
- **Acceso del usuario:** Nivel y suscripción (para validar si puede usar audio guiado).
- **Acciones del usuario:** Clic en "Empezar ritual", "Siguiente paso", "Marcar como completado", "Pausar audio".

### Qué entrega (Outputs):
- **Vista renderizada:** Pantalla de ritual con pasos y selector de modo.
- **Reproducción de audio:** Audio guiado o música relajante según modo.
- **Registro de completado:** Guarda en tabla `ritual_completions` con modo usado.
- **Actualización de estado del día:** Marca ritual como completado en dashboard.
- **Feedback visual:** Mensaje "Ritual completado ✅" con animación.
- **Logs:** Registro de modo usado para métricas.
- **Evento:** Dispara evento `RitualCompleted` con datos del ritual y modo.

**Ejemplo:**
```
Input:  Usuario elige C.A.F.É. en modo asistido
Output: Reproduce audio guiado de C.A.F.É. (cafe-guided.mp3)
        Muestra temporizador de 5 minutos
        Al terminar, guarda en DB: { ritual_id: 1, mode: 'assisted', completed_at: '2026-02-03 07:30:00' }
Action: Evento RitualCompleted disparado
UI:     Dashboard actualiza C.A.F.É. como completado ✅
```

---

## 4. El Paso a Paso (Lógica)

### Flujo de Carga de Pantalla de Ritual (GET /ritual/{id}):
1. **Autenticación:** Verificar que el usuario está logueado.
2. **Cargar datos del ritual:** Nombre, descripción, pasos, duración estimada.
3. **Verificar acceso:**
   - Si es A.R.A. y el usuario no es premium, mostrar pantalla de upgrade.
   - Si es L.I.F.E. en modo asistido y el usuario no es premium, bloquear audio guiado.
4. **Cargar preferencia de modo:** Leer `default_ritual_mode` del usuario.
5. **Cargar archivos de audio:**
   - Modo asistido: URL del audio guiado (ej: `cafe-guided.mp3`).
   - Modo manual: URL de música relajante (ej: `relaxing-music-1.mp3`).
6. **Renderizar vista:** Pasar todos los datos a `ritual.blade.php`.
7. **Precargar selector de modo:** Mostrar toggle con modo preferido seleccionado.

### Flujo de Inicio de Ritual (Usuario hace clic en "Empezar ritual"):
1. **Capturar modo elegido:** Leer valor del selector (assisted/manual).
2. **Validar acceso al modo:**
   - Si elige asistido y no tiene acceso, mostrar mensaje de upgrade.
   - Si tiene acceso, continuar.
3. **Registrar inicio:** POST a `/ritual/{id}/start` con `{ mode: 'assisted' }`.
4. **Backend guarda inicio:** Tabla `ritual_sessions` (opcional, para métricas de abandono).
5. **Iniciar reproducción:**
   - **Modo asistido:** Reproducir audio guiado, mostrar temporizador, deshabilitar botón "Siguiente" hasta 50% del paso.
   - **Modo manual:** Reproducir música relajante en loop, mostrar pasos con checkboxes, habilitar botón "Marcar como completado".
6. **Mostrar botón "¿Por qué hacemos esto?":** Siempre visible, abre pop-up con trasfondo científico.

### Flujo de Modo Asistido (Audio Guiado):
1. **Reproducir audio guiado:** `audio-manager.js` carga y reproduce el archivo MP3.
2. **Mostrar temporizador:** Cuenta regresiva del tiempo del paso actual.
3. **Deshabilitar botón "Siguiente":** Hasta que pase el 50% del tiempo del paso.
4. **Al llegar al 50%:** Habilitar botón "Siguiente" (pero no forzar avance).
5. **Usuario hace clic en "Siguiente":** Avanzar al siguiente paso, reproducir siguiente segmento de audio.
6. **Repetir hasta último paso.**
7. **Al terminar último paso:** Mostrar botón "Marcar como completado".
8. **Usuario hace clic en "Marcar como completado":** POST a `/ritual/{id}/complete` con `{ mode: 'assisted' }`.

### Flujo de Modo Manual (Música Relajante):
1. **Reproducir música relajante en loop:** `audio-manager.js` carga y reproduce el archivo MP3 en loop continuo.
2. **Mostrar pasos escritos:** Lista de pasos con checkboxes opcionales (no obligatorios).
3. **Usuario avanza a su ritmo:** Puede marcar checkboxes o no, no hay temporizador.
4. **Botón "Marcar como completado" siempre visible:** Usuario decide cuándo terminar.
5. **Usuario hace clic en "Marcar como completado":** POST a `/ritual/{id}/complete` con `{ mode: 'manual' }`.

### Flujo de Completado de Ritual (POST /ritual/{id}/complete):
1. **Validación:** Verificar que el usuario está autenticado y que el ritual existe.
2. **Sanitización:** Limpiar input `mode` (solo 'assisted' o 'manual').
3. **Guardar en DB:** Tabla `ritual_completions` con:
   - `user_id`, `ritual_id`, `mode`, `completed_at`.
4. **Actualizar estado del día:** Llamar a `UpdateStreak` action.
5. **Disparar evento:** `RitualCompleted` con datos del ritual.
6. **Registrar métrica:** Log de modo usado (para análisis de preferencias).
7. **Retornar respuesta:** JSON con `{ success: true, message: "Ritual completado ✅", day_won: true/false }`.
8. **Feedback en UI:** Mostrar mensaje de felicitación con animación.
9. **Redirigir a dashboard:** Después de 2 segundos.

### Flujo de Pop-up "¿Por qué hacemos esto?":
1. **Usuario hace clic en botón "¿Por qué hacemos esto?".**
2. **JS abre modal:** `ritual-player.js` muestra pop-up con:
   - **Base científica:** Explicación respaldada por investigación.
   - **Beneficio emocional:** Qué sentirás al hacerlo.
   - **Cuándo usarlo:** Contexto ideal para este ritual.
3. **Usuario lee y cierra modal.**
4. **Registrar métrica:** Log de apertura de pop-up (señal de interés en trasfondo).

---

## 5. Reglas de Oro (Restricciones y Seguridad)

### SIEMPRE:
- ✅ Verificar autenticación antes de mostrar o iniciar ritual.
- ✅ Validar acceso al modo asistido según nivel y suscripción.
- ✅ Sanitizar input de modo (solo 'assisted' o 'manual').
- ✅ Guardar modo usado en cada completado (para métricas).
- ✅ Permitir pausar/reanudar audio en cualquier momento.
- ✅ Mostrar feedback visual inmediato en cada acción.
- ✅ Registrar inicio y completado de ritual (para métricas de abandono).
- ✅ Precargar audio antes de iniciar ritual (evitar lag).
- ✅ Usar CSRF token en todos los requests POST.

### NUNCA:
- ❌ Forzar avance de paso antes del 50% del tiempo en modo asistido (mala UX).
- ❌ Reproducir audio automáticamente sin interacción del usuario (iOS lo bloquea).
- ❌ Permitir acceso a modo asistido sin validar suscripción.
- ❌ Recargar página al cambiar de modo (mala UX).
- ❌ Permitir marcar como completado sin haber iniciado el ritual (gaming del sistema).
- ❌ Reproducir múltiples audios al mismo tiempo (confusión).
- ❌ Olvidar detener audio al salir de la pantalla de ritual (sigue sonando en background).

---

## 6. Dependencias (Qué necesita para funcionar)

**Backend (RitualController.php):**
- Necesita `Ritual` model para leer datos del ritual.
- Necesita `RitualCompletion` model para guardar completados.
- Necesita `User` model para leer preferencias y acceso.
- Necesita `Subscription` model para validar acceso a modo asistido.
- Necesita `UpdateStreak` action para actualizar racha.
- Necesita middleware `auth` para proteger rutas.
- Necesita middleware `CheckSubscription` para validar acceso premium.

**Frontend (ritual.blade.php):**
- Necesita Alpine.js para interactividad.
- Necesita Tailwind CSS para estilos.
- Necesita `ritual-player.js` para lógica de reproducción.
- Necesita `audio-manager.js` para manejo de audio.
- Necesita archivos de audio (MP3) hosteados en servidor o CDN.

**JavaScript:**
- Necesita `fetch()` o `axios` para requests AJAX.
- Necesita `Audio` API del navegador para reproducir audio.
- Necesita `setInterval()` para temporizadores.
- Necesita `localStorage` para recordar último modo usado.

---

## 7. Casos Borde y "Trampas" Conocidas

### Limitaciones Conocidas:
- **Audio no se reproduce automáticamente en iOS:** Safari requiere que el audio se inicie con interacción del usuario. Solución: reproducir audio solo después de clic en "Empezar ritual".
- **Audio sigue sonando al salir de la pantalla:** Si el usuario navega a otra pantalla sin terminar el ritual, el audio sigue. Solución: detener audio en evento `beforeunload` o al cambiar de ruta.
- **Música relajante puede ser muy larga:** Si el archivo es muy pesado, tarda en cargar. Solución: comprimir audio a bitrate razonable (128kbps) y usar lazy loading.
- **Usuario puede hacer gaming del sistema:** Marcar como completado sin hacer el ritual. Solución: registrar tiempo de inicio y completado, si es < 1 minuto, marcar como sospechoso.
- **Temporizador se desincroniza con audio:** Si el audio tarda en cargar, el temporizador empieza antes. Solución: iniciar temporizador solo cuando el audio empieza a reproducirse.

### Errores Comunes y Soluciones:
| Error | Por qué pasa | Cómo evitarlo |
| :--- | :--- | :--- |
| Audio no se reproduce | Usuario no interactuó antes o archivo no existe | Verificar que el audio se inicia con clic y que el archivo existe |
| Temporizador no avanza | `setInterval()` no está corriendo o hay error en JS | Verificar consola de errores y que `setInterval()` se inicia correctamente |
| Botón "Siguiente" no se habilita | Lógica de 50% mal calculada | Verificar que `currentTime / duration >= 0.5` |
| Audio se reproduce dos veces | Se llama `play()` múltiples veces | Verificar que solo se llama una vez al iniciar paso |
| Modo no se guarda | Request POST falla o no se envía | Verificar que el request se envía correctamente y que el backend responde |

---

## 8. Bitácora de Aprendizaje (Memoria del Sistema)

| Fecha | Qué falló | Por qué pasó | Cómo lo arreglamos para siempre |
| :--- | :--- | :--- | :--- |
| 2026-02-03 | Audio no se reproducía en iOS | Safari bloquea autoplay sin interacción del usuario | Movimos `audio.play()` al evento de clic en "Empezar ritual" |
| 2026-02-03 | Temporizador se desincronizaba con audio | Temporizador empezaba antes de que el audio cargara | Iniciamos temporizador en evento `audio.onplay` |
| 2026-02-03 | Audio seguía sonando al salir de pantalla | No detuvimos audio en evento de navegación | Agregamos `audio.pause()` en evento `beforeunload` |
| 2026-02-03 | Usuario podía marcar completado sin hacer ritual | No validábamos tiempo mínimo | Agregamos validación: si tiempo < 1 minuto, marcar como sospechoso |

> **Nota de Implementación:** Si encuentras un nuevo error, **primero** arréglalo en el script, y **luego** documenta la regla aquí para evitar regresiones futuras.

---

## 9. Flujo de Integración (Cómo se conecta con el resto)

**Diagrama de flujo:**
```
Usuario hace clic en ritual C.A.F.É. en dashboard
    ↓
GET /ritual/1
    ↓
RitualController::show(1)
    ├─ Carga datos de Ritual model
    ├─ Verifica acceso según Subscription model
    ├─ Carga preferencia de User model
    └─ Carga URLs de audio
    ↓
Renderiza ritual.blade.php con selector de modo
    ↓
Usuario elige modo asistido y hace clic en "Empezar ritual"
    ↓
ritual-player.js captura evento
    ↓
POST /ritual/1/start con { mode: 'assisted' }
    ↓
RitualController::start(1)
    ├─ Valida acceso
    ├─ Guarda inicio en ritual_sessions (opcional)
    └─ Retorna { success: true }
    ↓
audio-manager.js reproduce audio guiado
    ↓
ritual-player.js inicia temporizador
    ↓
Usuario avanza por los pasos
    ↓
Usuario hace clic en "Marcar como completado"
    ↓
POST /ritual/1/complete con { mode: 'assisted' }
    ↓
RitualController::complete(1)
    ├─ Guarda en ritual_completions
    ├─ Llama a UpdateStreak action
    ├─ Dispara evento RitualCompleted
    └─ Retorna { success: true, day_won: true }
    ↓
UI muestra mensaje "Ritual completado ✅"
    ↓
Redirige a dashboard después de 2 segundos
```

---

## 10. Checklist de Pre-Implementación

Antes de escribir código:
- [ ] ¿He leído esta directiva completa?
- [ ] ¿Entiendo la responsabilidad única de cada componente (Controller, JS, audio)?
- [ ] ¿Sé cuáles son los inputs y outputs?
- [ ] ¿Conozco los casos borde (audio en iOS, temporizador desincronizado)?
- [ ] ¿Tengo claro qué modelos necesito (Ritual, RitualCompletion, User, Subscription)?
- [ ] ¿Sé cómo manejar audio en iOS y Android?
- [ ] ¿Tengo los archivos de audio listos y comprimidos?

---

## 11. Checklist de Post-Implementación

Después de escribir código:
- [ ] El código sigue la responsabilidad única (SOLID).
- [ ] Todos los inputs están sanitizados y validados.
- [ ] El audio se reproduce correctamente en iOS y Android.
- [ ] El temporizador está sincronizado con el audio.
- [ ] El audio se detiene al salir de la pantalla.
- [ ] El cambio de modo funciona sin recargar página.
- [ ] El pop-up "¿Por qué hacemos esto?" se muestra correctamente.
- [ ] Los logs muestran el flujo correcto.
- [ ] ¿Hay nuevas restricciones o aprendizajes?
- [ ] ¿Actualicé la sección "Bitácora de Aprendizaje"?
- [ ] ¿Documenté el cambio en CHANGELOG.md?
- [ ] ¿Registré las métricas necesarias (modo usado, apertura de pop-up)?

---

## 12. Notas Adicionales

### Decisiones de Diseño:
- **Por qué dos modos:** Porque el estado mental del usuario varía. A veces necesita estructura (asistido), a veces necesita libertad (manual).
- **Por qué 50% del tiempo para habilitar "Siguiente":** Para evitar que el usuario salte pasos sin hacer el ritual, pero sin forzarlo a esperar todo el tiempo (respeta su ritmo).
- **Por qué música relajante en loop:** Para crear ambiente sin interrupciones, el usuario decide cuándo terminar.
- **Por qué pop-up de trasfondo:** Conecta el enfoque científico con la experiencia emocional, diferencia la app de otras genéricas.

### Referencias:
- [Audio API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/HTMLAudioElement)
- [Autoplay Policy - Chrome](https://developer.chrome.com/blog/autoplay/)
- [Autoplay Policy - Safari](https://webkit.org/blog/7734/auto-play-policy-changes-for-macos/)

### Advertencias de Seguridad:
- **Nunca confiar en tiempo de completado sin validar:** Un usuario malicioso podría enviar `completed_at` falso. Solución: calcular tiempo en backend, no confiar en frontend.
- **Siempre verificar acceso a modo asistido:** No permitir que un usuario free acceda a audio guiado premium.

### Optimizaciones de Audio:
- **Comprimir audio a 128kbps:** Reduce tamaño sin perder calidad perceptible.
- **Usar CDN para audio:** Reduce latencia y mejora velocidad de carga.
- **Precargar audio en background:** Mientras el usuario lee la pantalla de ritual, cargar audio en background.

---

**Última Actualización:** 2026-02-03  
**Responsable:** Alejandro Leguízamo  
**Estado:** Activo