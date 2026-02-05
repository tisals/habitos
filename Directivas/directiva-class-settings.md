# DIRECTIVA: Clase de Configuración y Preferencias (Settings)

> **Responsable:** SettingsService (o similar)
> **Archivo Asociado:** `src/Domains/Settings/SettingsService.php` (ejemplo, ajustar según framework)
> **Estado:** Activo
> **Última Mejora:** 2026-02-04
> **Versión:** 1.0.0

---

## 1. ¿Para qué sirve esto? (Misión)

Esta clase es el punto central para gestionar la configuración global de la aplicación y las preferencias específicas de cada usuario. Su misión es proporcionar una interfaz consistente para leer y escribir ajustes como el tema visual, el modo de ritual por defecto, la activación de notificaciones y cualquier otra configuración que afecte el comportamiento de la app. Asegura que la aplicación se adapte a las necesidades del usuario y que los ajustes globales puedan ser modificados fácilmente.

---

## 2. Responsabilidad Única (SOLID)

`SettingsService` SOLO gestiona la lectura y escritura de configuraciones y preferencias. No contiene lógica de negocio compleja, no interactúa con la base de datos directamente para datos transaccionales (delegaría a `DatabaseService`), ni maneja la interfaz de usuario. Su rol es ser un "key-value store" inteligente para la configuración.

---

## 3. Entradas y Salidas (I/O)

### Qué recibe (Inputs):
- **Clave de configuración:** (Ej: `$key` string, para identificar el ajuste: `theme_preference`, `notifications_enabled`).
- **Valor de configuración:** (Ej: `$value` mixed, el nuevo valor para el ajuste).
- **Usuario:** (Ej: `User` objeto, para preferencias específicas de usuario).

### Qué entrega (Outputs):
- **Valor de configuración:** (Ej: `string`, `boolean`, `int` el valor actual del ajuste).
- **Booleanos:** (Ej: `true` si la operación fue exitosa, `false` si falló).
- **Excepciones:** (Ej: `SettingsException` en caso de clave no válida o error al guardar).
- **Eventos:** (Ej: `SettingsUpdated`, `UserPreferencesUpdated`).

**Ejemplo:**
```
Input:  $key = "theme_preference", $value = "dark", $user = UserObject
Output: true
Action: Actualiza la preferencia de tema del usuario en la base de datos.
```

---

## 4. El Paso a Paso (Lógica)

### Flujo de Obtención de Configuración Global (`SettingsService::getGlobalSetting($key)`):
1.  **Validar clave:** Verificar que `$key` es una configuración global reconocida.
2.  **Recuperar de cache/DB:** Intentar recuperar el valor de la caché. Si no está, consultar `DatabaseService` (tabla `app_settings`).
3.  **Retorno:** Devolver el valor de la configuración. Si no existe, devolver un valor por defecto.

### Flujo de Actualización de Configuración Global (`SettingsService::setGlobalSetting($key, $value)`):
1.  **Validar clave y valor:** Verificar que `$key` es una configuración global reconocida y que `$value` es válido para esa clave.
2.  **Guardar en DB/cache:** Actualizar el valor en la base de datos a través de `DatabaseService` y invalidar/actualizar la caché.
3.  **Disparar evento:** Emitir `SettingsUpdated` evento.
4.  **Retorno:** Devolver `true` si la operación fue exitosa.

### Flujo de Obtención de Preferencia de Usuario (`SettingsService::getUserPreference(User $user, $key)`):
1.  **Validar clave:** Verificar que `$key` es una preferencia de usuario reconocida (ej. `theme_preference`, `notifications_enabled`).
2.  **Recuperar de User model:** Obtener el valor del campo correspondiente del objeto `User`.
3.  **Retorno:** Devolver el valor de la preferencia. Si no existe, devolver un valor por defecto.

### Flujo de Actualización de Preferencia de Usuario (`SettingsService::setUserPreference(User $user, $key, $value)`):
1.  **Validar clave y valor:** Verificar que `$key` es una preferencia de usuario reconocida y que `$value` es válido para esa clave.
2.  **Actualizar en User model/DB:** Actualizar el campo correspondiente en el objeto `User` y persistir a través de `DatabaseService`.
3.  **Disparar evento:** Emitir `UserPreferencesUpdated` evento.
4.  **Retorno:** Devolver `true` si la operación fue exitosa.

---

## 5. Reglas de Oro (Restricciones y Seguridad)

### SIEMPRE:
- ✅ Validar todas las claves y valores de configuración para evitar datos inconsistentes o maliciosos.
- ✅ Proteger las configuraciones sensibles (ej. claves API) para que no sean accesibles públicamente.
- ✅ Utilizar un sistema de caché para configuraciones globales accedidas frecuentemente para mejorar el rendimiento.
- ✅ Separar las configuraciones globales de las preferencias de usuario para mantener la responsabilidad única.
- ✅ Usar el `User` model para almacenar preferencias de usuario directamente, para evitar una tabla de preferencias genérica si no es necesario.

### NUNCA:
- ❌ Exponer todas las configuraciones a través de una API sin control de acceso.
- ❌ Permitir que un usuario modifique configuraciones globales sin permisos de administrador.
- ❌ Confiar en el frontend para enviar valores de configuración sin validación en el backend.
- ❌ Almacenar contraseñas o datos sensibles directamente en esta clase; delegar a servicios de seguridad.

---

## 6. Dependencias (Qué necesita para funcionar)

- `DatabaseService`: Para leer y escribir configuraciones globales y preferencias de usuario.
- `User` Model: Para interactuar con las preferencias de usuario.
- `CacheService` (opcional): Para almacenar configuraciones globales en caché.
- `EventDispatcher` (o similar): Para emitir eventos (`SettingsUpdated`, `UserPreferencesUpdated`).

---

## 7. Casos Borde y "Trampas" Conocidas

### Limitaciones Conocidas:
- **Configuraciones muy dinámicas:** Si hay muchas configuraciones que cambian constantemente, la caché puede ser un problema. Solución: Usar un sistema de caché con invalidación granular o TTL corto.
- **Claves no existentes:** Si se intenta acceder a una clave de configuración que no existe, debe devolver un valor por defecto o lanzar una excepción clara.
- **Concurrencia en actualizaciones:** Si varios administradores actualizan la misma configuración global al mismo tiempo. Solución: Implementar bloqueos a nivel de base de datos o asegurar que solo un administrador pueda editar.

### Errores Comunes y Soluciones:
| Error | Por qué pasa | Cómo evitarlo |
| :--- | :--- | :--- |
| Preferencia de usuario no se guarda | Error en la actualización del `User` model o `DatabaseService` | Verificar logs de `DatabaseService` y la lógica de actualización del `User` model. |
| Configuración global desactualizada | Caché no invalidada correctamente después de una actualización | Asegurar que `CacheService` se invalida o actualiza después de `setGlobalSetting`. |
| Valor de preferencia inválido | El frontend envía un valor no esperado | Implementar validación estricta de valores permitidos para cada clave. |

---

## 8. Bitácora de Aprendizaje (Memoria del Sistema)

| Fecha | Qué falló | Por qué pasó | Cómo lo arreglamos para siempre |
| :--- | :--- | :--- | :--- |
| 2026-02-04 | La preferencia de `default_ritual_mode` no persistía después de un tiempo | Solo se guardaba en `localStorage` del navegador, pero no en la base de datos asociada al `User` model. | Agregamos un campo `default_ritual_mode` en la tabla `users` y se actualiza a través de `SettingsService::setUserPreference`. |

---

## 9. Flujo de Integración (Cómo se conecta con el resto)

```mermaid
graph TD
    A[ProfileController (Frontend request)] --> B{SettingsService};
    A[DashboardController (Frontend request)] --> B;
    B -- "getGlobalSetting() / getUserPreference()" --> C{DatabaseService};
    B -- "setGlobalSetting() / setUserPreference()" --> C;
    C -- "Lee/Escribe DB" --> D[Tablas de Configuración/Usuarios];
    B --> E[Event SettingsUpdated/UserPreferencesUpdated];
    E --> F[EventListeners (para UI, Notificaciones)];
```

---

## 10. Checklist de Pre-Implementación

Antes de escribir código:
- [ ] ¿He leído esta directiva completa?
- [ ] ¿Entiendo la responsabilidad única de `SettingsService`?
- [ ] ¿Sé cuáles son los inputs y outputs para obtener y establecer configuraciones/preferencias?
- [ ] ¿Conozco los casos borde (claves no existentes, concurrencia)?
- [ ] ¿Tengo claro qué modelos y servicios necesito inyectar (DatabaseService, User, CacheService)?

---

## 11. Checklist de Post-Implementación

Después de escribir código:
- [ ] El código sigue la responsabilidad única (SOLID).
- [ ] Todos los inputs están sanitizados y validados.
- [ ] Las configuraciones globales se recuperan de caché si aplica.
- [ ] Las preferencias de usuario se guardan y recuperan correctamente.
- [ ] Los eventos `SettingsUpdated` y `UserPreferencesUpdated` se disparan.
- [ ] Los logs muestran el flujo correcto.
- [ ] ¿Hay nuevas restricciones o aprendizajes?
- [ ] ¿Actualicé la sección "Bitácora de Aprendizaje"?
- [ ] ¿Documenté el cambio en CHANGELOG.md?
- [ ] ¿Registré las métricas necesarias (cambios de preferencias)?

---

## 12. Notas Adicionales

### Decisiones de Diseño:
- **Separación de Global vs. Usuario:** Mantener clara la distinción entre ajustes que afectan a toda la aplicación y aquellos que son específicos de un usuario.
- **Uso del `User` model:** En lugar de una tabla `user_settings` separada, almacenar las preferencias directamente en la tabla `users` si son pocas y simples, para reducir complejidad.

### Referencias:
- [Configuration Management Pattern](https://martinfowler.com/eaaDev/ConfigurationManagement.html)
- [Service Objects Pattern](https://www.martinfowler.com/bliki/ServiceLayer.html)

### Advertencias de Seguridad:
- **Validación de `user_id`:** Al actualizar preferencias de usuario, siempre verificar que el `user_id` del request coincide con el usuario autenticado.
- **Nivel de acceso:** Las configuraciones globales solo deben ser editables por roles autorizados (ej. administradores).

---

**Última Actualización:** 2026-02-04  
**Responsable:** Alejandro Leguízamo  
**Estado:** Activo