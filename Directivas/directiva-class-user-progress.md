# DIRECTIVA: Clase de Progreso del Usuario (User Progress)

> **Responsable:** UserProgressService (o similar)
> **Archivo Asociado:** `src/Domains/UserProgress/UserProgressService.php` (ejemplo, ajustar según framework)
> **Estado:** Activo
> **Última Mejora:** 2026-02-04
> **Versión:** 1.0.0

---

## 1. ¿Para qué sirve esto? (Misión)

Esta clase es responsable de calcular, almacenar y gestionar el progreso del usuario dentro de la aplicación, incluyendo el seguimiento de rachas, la determinación de "días ganados" y el historial de completados de rituales. Su misión es motivar al usuario y proporcionar métricas claras sobre su adherencia a los hábitos. Sin ella, el sistema de gamificación y seguimiento no sería funcional.

---

## 2. Responsabilidad Única (SOLID)

`UserProgressService` SOLO maneja la lógica de las métricas de progreso del usuario. No se encarga de la ejecución de rituales (eso es de `RitualEngineService`), ni de la persistencia de datos (eso es de `DatabaseService`), ni de la visualización en la UI. Su rol es calcular y mantener el estado de progreso del usuario de forma precisa y consistente.

---

## 3. Entradas y Salidas (I/O)

### Qué recibe (Inputs):
- **Usuario:** (Ej: `User` objeto, para identificar al usuario).
- **Completado de ritual:** (Ej: `RitualCompletion` objeto o evento, para actualizar el progreso).
- **Fecha:** (Ej: `$date` string, para cálculos de días ganados).

### Qué entrega (Outputs):
- **Progreso del usuario:** (Ej: `UserProgress` objeto con racha actual, días ganados, etc.).
- **Booleanos:** (Ej: `true` si el día fue ganado, `false` si no).
- **Excepciones:** (Ej: `ProgressException` en caso de error en el cálculo o almacenamiento).
- **Eventos:** (Ej: `StreakUpdated`, `DayWon`).

**Ejemplo:**
```
Input:  $user = UserObject, $ritualCompletion = RitualCompletionObject (C.A.F.É. completado hoy)
Output: Actualiza la racha del usuario y marca el día como potencialmente ganado.
Action: Dispara evento StreakUpdated si la racha cambia, o DayWon si aplica.
```

---

## 4. El Paso a Paso (Lógica)

### Flujo de Actualización de Racha (`UserProgressService::updateStreak(User $user, DateTime $date = null)`):
1.  **Obtener último progreso:** Consultar `DatabaseService` para el `UserDailyStatus` del día anterior o el más reciente.
2.  **Determinar si el día anterior fue ganado:** Si el día anterior fue ganado y consecutivo al actual.
3.  **Calcular nueva racha:**
    *   Si el ritual actual completa un día consecutivo al anterior ganado, incrementar la racha.
    *   Si hay un salto en días o el día anterior no fue ganado, resetear la racha a 1 (si el día actual es ganado).
    *   Si el día actual no es ganado, la racha se mantiene o se rompe.
4.  **Guardar racha:** Actualizar el campo `current_streak` en la tabla `users` a través de `DatabaseService`.
5.  **Disparar evento:** Emitir `StreakUpdated` evento si la racha ha cambiado.

### Flujo de Cálculo de "Día Ganado" (`UserProgressService::calculateDayWon(User $user, DateTime $date = null)`):
1.  **Obtener rituales requeridos:** Consultar los rituales que el usuario debe completar para ganar el día, según su `nivel` y `preferencias` (`RitualService` o `SettingsService`).
2.  **Obtener rituales completados hoy:** Consultar `DatabaseService` para todos los `RitualCompletion` del `$user` para `$date`.
3.  **Comparar:** Verificar si el usuario ha completado todos los rituales requeridos para su nivel.
4.  **Marcar día como ganado:** Si todos los rituales requeridos fueron completados, actualizar `day_won = true` en la tabla `user_daily_status` a través de `DatabaseService` para la `$date`.
5.  **Disparar evento:** Emitir `DayWon` evento si el día fue marcado como ganado.
6.  **Retorno:** Devolver `true` si el día fue ganado.

---

## 5. Reglas de Oro (Restricciones y Seguridad)

### SIEMPRE:
- ✅ Utilizar UTC para todos los cálculos de fecha y hora para evitar problemas de zona horaria.
- ✅ Asegurar que la racha solo se incremente si los días son **consecutivos** y el día anterior fue ganado.
- ✅ La lógica de "día ganado" debe ser configurable según el nivel del usuario (`requerimientos.md` Sección 4).
- ✅ Actualizar las métricas de progreso de forma transaccional si hay múltiples operaciones en la base de datos involucradas.
- ✅ Proteger la información de progreso para que solo el usuario autenticado pueda acceder a ella.

### NUNCA:
- ❌ Permitir que el frontend envíe directamente la racha actual o el estado de "día ganado"; siempre debe calcularse en el backend.
- ❌ Ignorar el nivel del usuario al calcular los rituales requeridos para "día ganado".
- ❌ Hacer cálculos de racha o progreso basados en la hora del servidor sin considerar la zona horaria del usuario.
- ❌ Exponer datos de progreso de un usuario a otro.

---

## 6. Dependencias (Qué necesita para funcionar)

- `DatabaseService`: Para leer y escribir en tablas como `users`, `ritual_completions`, `user_daily_status`.
- `User` Model: Para obtener el nivel y preferencias del usuario.
- `Ritual` Model / `RitualService`: Para obtener la definición de los rituales y sus requerimientos por nivel.
- `SettingsService` (opcional): Para obtener configuraciones globales sobre el sistema de rachas.
- `EventDispatcher` (o similar): Para emitir eventos (`StreakUpdated`, `DayWon`).

---

## 7. Casos Borde y "Trampas" Conocidas

### Limitaciones Conocidas:
- **Cambios de zona horaria del usuario:** Si el usuario viaja y su zona horaria cambia, los cálculos de días consecutivos pueden verse afectados. Solución: Normalizar todo a UTC y mostrar en la zona horaria del usuario en el frontend.
- **Ritual A.R.A. no cuenta para racha:** Como es un "salvavidas", no debe afectar la racha o el "día ganado". Solución: Excluir A.R.A. de los cálculos de `calculateDayWon` y `updateStreak`.
- **Retroactividad de completados:** Si un usuario completa un ritual "tarde" (ej. lo hace hoy pero lo marca para ayer), esto podría afectar el cálculo de rachas pasadas. Solución: Solo considerar los rituales completados en el día actual para el cálculo de la racha actual.

### Errores Comunes y Soluciones:
| Error | Por qué pasa | Cómo evitarlo |
| :--- | :--- | :--- |
| Racha se rompe incorrectamente | Fallo en la lógica de días consecutivos o días ganados | Revisar la consulta de `UserDailyStatus` para el día anterior. Asegurar que `is_consecutive` se calcula bien. |
| Día no se marca como ganado | No se completaron todos los rituales requeridos | Verificar la lógica de `calculateDayWon` contra los `nivel` y `preferencias` del usuario. |
| Rituales de A.R.A. afectan racha | No se excluyó A.R.A. del cálculo | Filtrar `ritual_completions` para excluir `ritual_id` de A.R.A. en los cálculos. |

---

## 8. Bitácora de Aprendizaje (Memoria del Sistema)

| Fecha | Qué falló | Por qué pasó | Cómo lo arreglamos para siempre |
| :--- | :--- | :--- | :--- |
| 2026-02-04 | La racha se calculaba incorrectamente si el usuario tenía un día sin actividad entre dos días ganados | La lógica solo verificaba si el día anterior fue ganado, sin considerar que fuera *consecutivo*. | Añadimos una verificación para que el `timestamp` del día anterior sea exactamente 24 horas antes o el día inmediatamente anterior. |

---

## 9. Flujo de Integración (Cómo se conecta con el resto)

```mermaid
graph TD
    A[RitualEngineService::completeRitual()] --> B{UserProgressService::updateStreak()};
    A --> C{UserProgressService::calculateDayWon()};
    B -- "Actualiza racha en DB (vía DatabaseService)" --> D[User Model];
    C -- "Actualiza día ganado en DB (vía DatabaseService)" --> E[UserDailyStatus Model];
    B --> F[Evento StreakUpdated];
    C --> G[Evento DayWon];
    F --> H[DashboardView (UI)];
    G --> I[DashboardView (UI)];
```

---

## 10. Checklist de Pre-Implementación

Antes de escribir código:
- [ ] ¿He leído esta directiva completa?
- [ ] ¿Entiendo la responsabilidad única de `UserProgressService`?
- [ ] ¿Sé cuáles son los inputs y outputs para `updateStreak` y `calculateDayWon`?
- [ ] ¿Conozco los casos borde (zonas horarias, A.R.A., gaming)?
- [ ] ¿Tengo claro qué modelos y servicios necesito inyectar (DatabaseService, User, Ritual)?
- [ ] ¿Sé cómo manejar los cálculos de fechas en UTC?

---

## 11. Checklist de Post-Implementación

Después de escribir código:
- [ ] El código sigue la responsabilidad única (SOLID).
- [ ] Todos los inputs están sanitizados y validados.
- [ ] La racha se calcula correctamente, considerando días consecutivos.
- [ ] El "día ganado" se calcula según el nivel del usuario y los rituales requeridos.
- [ ] El ritual A.R.A. no afecta la racha o el "día ganado".
- [ ] Los eventos `StreakUpdated` y `DayWon` se disparan correctamente.
- [ ] Los logs muestran el flujo correcto.
- [ ] ¿Hay nuevas restricciones o aprendizajes?
- [ ] ¿Actualicé la sección "Bitácora de Aprendizaje"?
- [ ] ¿Documenté el cambio en CHANGELOG.md?
- [ ] ¿Registré las métricas necesarias (rachas, días ganados)?

---

## 12. Notas Adicionales

### Decisiones de Diseño:
- **Por qué separar `updateStreak` y `calculateDayWon`:** Para mantener la responsabilidad única. Una se encarga de la racha, la otra de si el día cumple los criterios de "ganado". Ambas pueden ser llamadas por el `RitualEngineService` al completar un ritual.
- **Por qué UTC:** Es la mejor práctica para evitar inconsistencias con las zonas horarias de los usuarios.

### Referencias:
- [Working with Dates and Times in PHP](https://php.net/manual/en/datetime.php)
- [Design Patterns for Domain Logic](https://martinfowler.com/eaaDev/DomainLogic.html)

### Advertencias de Seguridad:
- **Manipulación de fechas:** Asegurar que las fechas utilizadas para los cálculos no puedan ser manipuladas por el frontend.
- **Exposición de datos:** Asegurar que solo el usuario pueda ver su propio progreso.

---

**Última Actualización:** 2026-02-04  
**Responsable:** Alejandro Leguízamo  
**Estado:** Activo