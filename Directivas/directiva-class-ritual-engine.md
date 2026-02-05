# DIRECTIVA: Clase de Motor de Rituales (Ritual Engine)

> **Responsable:** RitualEngineService (o similar)
> **Archivo Asociado:** `src/Domains/Ritual/RitualEngineService.php` (ejemplo, ajustar según framework)
> **Estado:** Activo
> **Última Mejora:** 2026-02-04
> **Versión:** 1.0.0

---

## 1. ¿Para qué sirve esto? (Misión)

Esta clase es el orquestador central de todos los rituales en la aplicación. Su misión es gestionar el ciclo de vida de un ritual, desde su inicio hasta su completado, aplicando la lógica de negocio asociada a cada tipo de ritual y modo (manual/asistido). Asegura que los rituales se ejecuten de manera consistente y que se registren correctamente, siendo el corazón de la experiencia del usuario con el producto.

---

## 2. Responsabilidad Única (SOLID)

`RitualEngineService` SOLO orquesta y dirige el flujo de los rituales. No se encarga de la persistencia de datos (eso es responsabilidad de `DatabaseService`), ni de la reproducción de audio (eso es del frontend `audio-manager.js`), ni de la visualización (eso es de `RitualView.tsx`). Su rol es aplicar las reglas de negocio de los rituales y coordinar las interacciones entre los diferentes componentes del sistema.

---

## 3. Entradas y Salidas (I/O)

### Qué recibe (Inputs):
- **ID del ritual:** (Ej: `$ritual_id` int).
- **Modo de ritual seleccionado:** (Ej: `$mode` string: 'manual' o 'assisted').
- **Usuario actual:** (Ej: `User` objeto, para validación de acceso y preferencias).
- **Acciones del usuario:** (Ej: `start_ritual`, `complete_step`, `complete_ritual`).

### Qué entrega (Outputs):
- **Estado del ritual:** (Ej: `RitualSession` objeto con estado actual, progreso).
- **Booleanos:** (Ej: `true` si la acción fue exitosa, `false` si falló).
- **Excepciones:** (Ej: `RitualException` si el ritual no es válido o el usuario no tiene acceso).
- **Eventos:** (Ej: `RitualStarted`, `RitualStepCompleted`, `RitualCompleted`).

**Ejemplo:**
```
Input:  $ritual_id = 1 (C.A.F.É.), $mode = 'assisted', $user = UserObject
Output: RitualSession object (con estado inicial, primer paso)
Action: Dispara evento RitualStarted, prepara los datos para el frontend.
```

---

## 4. El Paso a Paso (Lógica)

### Flujo de Inicio de Ritual (`RitualEngineService::startRitual($ritualId, $mode, User $user)`):
1.  **Validar ritual:** Verificar que `$ritualId` corresponde a un ritual válido y activo.
2.  **Validar acceso:** Usar `SubscriptionService` y `UserProgressService` para determinar si el `$user` tiene permiso para el `$ritualId` y el `$mode` (ej. L.I.F.E. asistido para premium).
3.  **Crear sesión de ritual:** Registrar el inicio del ritual en la base de datos a través de `DatabaseService` (tabla `ritual_sessions`), incluyendo `user_id`, `ritual_id`, `mode`, `started_at`.
4.  **Preparar primer paso:** Obtener la información del primer paso del ritual.
5.  **Disparar evento:** Emitir `RitualStarted` evento con los detalles de la sesión.
6.  **Retorno:** Devolver un objeto `RitualSession` con el estado inicial del ritual.

### Flujo de Completado de Ritual (`RitualEngineService::completeRitual($sessionId, User $user)`):
1.  **Validar sesión:** Verificar que `$sessionId` es válido y pertenece al `$user`.
2.  **Actualizar sesión:** Marcar la sesión como completada en la base de datos a través de `DatabaseService` (tabla `ritual_sessions`), actualizando `completed_at`.
3.  **Actualizar progreso del usuario:** Llamar a `UserProgressService::updateStreak(User $user)` y `UserProgressService::calculateDayWon(User $user)`.
4.  **Disparar evento:** Emitir `RitualCompleted` evento con los detalles de la sesión y el progreso actualizado.
5.  **Retorno:** Devolver `true` si la operación fue exitosa.

---

## 5. Reglas de Oro (Restricciones y Seguridad)

### SIEMPRE:
- ✅ Validar el ID del ritual y el modo antes de iniciar cualquier operación.
- ✅ Verificar los permisos del usuario para acceder a un ritual o modo específico (especialmente para contenido premium).
- ✅ Registrar el inicio y el fin de cada sesión de ritual para métricas de uso y abandono.
- ✅ Asegurar que la clase no tenga conocimiento de la implementación de la base de datos (delegar a `DatabaseService`).
- ✅ Disparar eventos claros (`RitualStarted`, `RitualCompleted`) para desacoplar la lógica de otros componentes.

### NUNCA:
- ❌ Permitir que un usuario inicie un ritual sin estar autenticado.
- ❌ Permitir que un usuario acceda a modos premium sin suscripción válida.
- ❌ Modificar directamente el estado de las rachas o días ganados; siempre delegar a `UserProgressService`.
- ❌ Contener lógica de interfaz de usuario o reproducción de medios (audio/video).
- ❌ Confiar en el tiempo de completado enviado desde el frontend sin validación en el backend.

---

## 6. Dependencias (Qué necesita para funcionar)

- `DatabaseService`: Para registrar sesiones de ritual, actualizar completados.
- `Ritual` Model: Para obtener detalles del ritual (pasos, duración).
- `User` Model: Para obtener datos del usuario y preferencias.
- `SubscriptionService`: Para validar el acceso a modos/rituales premium.
- `UserProgressService`: Para actualizar rachas y días ganados al completar rituales.
- `EventDispatcher` (o similar): Para emitir eventos (`RitualStarted`, `RitualCompleted`).

---

## 7. Casos Borde y "Trampas" Conocidas

### Limitaciones Conocidas:
- **Ritual interrumpido:** Si el usuario cierra la app a mitad de un ritual, la sesión queda abierta. Solución: un cron job puede limpiar sesiones inactivas o marcar como abandonadas.
- **Diferencia horaria:** El cálculo del "día ganado" puede verse afectado por zonas horarias si no se maneja UTC consistentemente.
- **Gaming del sistema:** Un usuario podría intentar enviar múltiples "completado" para el mismo ritual en poco tiempo. Solución: verificar `completed_at` y `started_at` para asegurar una duración mínima.

### Errores Comunes y Soluciones:
| Error | Por qué pasa | Cómo evitarlo |
| :--- | :--- | :--- |
| Ritual no se inicia | ID de ritual inválido o usuario sin permiso | Validar ID y permisos antes de crear sesión. |
| Racha no se actualiza | Error en `UserProgressService` al ser llamado | Asegurar que `UserProgressService` maneja correctamente la lógica de actualización. |
| Múltiples completados para un ritual | El frontend envía múltiples veces el evento de completado | Implementar idempotencia en el endpoint de completado (solo permitir un completado por sesión/día). |

---

## 8. Bitácora de Aprendizaje (Memoria del Sistema)

| Fecha | Qué falló | Por qué pasó | Cómo lo arreglamos para siempre |
| :--- | :--- | :--- | :--- |
| 2026-02-04 | Usuarios premium no podían acceder a L.I.F.E. asistido | `SubscriptionService` no estaba siendo llamado para validar el modo | Agregamos una llamada a `SubscriptionService::hasAccessToAssistedMode($user, $ritualId)` al inicio del ritual. |

---

## 9. Flujo de Integración (Cómo se conecta con el resto)

```mermaid
graph TD
    A[RitualController (Frontend request)] --> B{RitualEngineService};
    B -- "startRitual()" --> C{SubscriptionService};
    B -- "startRitual()" --> D{DatabaseService};
    B -- "completeRitual()" --> E{UserProgressService};
    B -- "completeRitual()" --> F{DatabaseService};
    B -- "Evento RitualStarted" --> G[EventListeners];
    B -- "Evento RitualCompleted" --> H[EventListeners (para Dashboard, Analytics)];
    C -- "Valida acceso" --> B;
    D -- "Guarda sesión" --> B;
    E -- "Actualiza progreso" --> B;
    F -- "Actualiza completado" --> B;
```

---

## 10. Checklist de Pre-Implementación

Antes de escribir código:
- [ ] ¿He leído esta directiva completa?
- [ ] ¿Entiendo la responsabilidad única de `RitualEngineService`?
- [ ] ¿Sé cuáles son los inputs y outputs para `startRitual` y `completeRitual`?
- [ ] ¿Conozco los casos borde (ritual interrumpido, gaming)?
- [ ] ¿Tengo claro qué servicios y modelos necesito inyectar (DatabaseService, SubscriptionService, UserProgressService)?

---

## 11. Checklist de Post-Implementación

Después de escribir código:
- [ ] El código sigue la responsabilidad única (SOLID).
- [ ] Todos los inputs están sanitizados y validados.
- [ ] El acceso a rituales/modos premium se verifica correctamente.
- [ ] Las sesiones de ritual se registran correctamente.
- [ ] Los eventos `RitualStarted` y `RitualCompleted` se disparan.
- [ ] `UserProgressService` se invoca correctamente al completar un ritual.
- [ ] Los logs muestran el flujo correcto.
- [ ] ¿Hay nuevas restricciones o aprendizajes?
- [ ] ¿Actualicé la sección "Bitácora de Aprendizaje"?
- [ ] ¿Documenté el cambio en CHANGELOG.md?
- [ ] ¿Registré las métricas necesarias (inicio/fin de ritual, modo usado)?

---

## 12. Notas Adicionales

### Decisiones de Diseño:
- **Por qué `RitualEngineService` centraliza:** Para tener un punto único de control de la lógica de negocio de los rituales, facilitando la adición de nuevos rituales o modos.
- **Por qué eventos:** Permite que otros componentes reaccionen a los cambios de estado del ritual sin que `RitualEngineService` tenga conocimiento directo de ellos (desacoplamiento).

### Referencias:
- [Patrón Command (para acciones como Start/Complete Ritual)](https://refactoring.guru/design-patterns/command)
- [Event Sourcing (concepto de registro de eventos)](https://martinfowler.com/eaaDev/EventSourcing.html)

### Advertencias de Seguridad:
- **Validación de `user_id`:** Siempre verificar que el `user_id` en la sesión del ritual corresponde al usuario autenticado para evitar manipulaciones.
- **"Replay attacks":** Proteger el endpoint de completado para que no se pueda llamar varias veces seguidas para un mismo ritual y usuario.

---

**Última Actualización:** 2026-02-04  
**Responsable:** Alejandro Leguízamo  
**Estado:** Activo