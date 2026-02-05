# DIRECTIVA: Sistema de Notificaciones

> **Responsable:** NotificationService / NotificationHandler.js
> **Archivo Asociado:** `src/Domains/Notification/NotificationService.php` o similar, `assets/js/notification-handler.js`
> **Estado:** Activo
> **Última Mejora:** 2026-02-04
> **Versión:** 1.0.0

---

## 1. ¿Para qué sirve esto? (Misión)

Esta capa es responsable de comunicar proactivamente al usuario sobre su progreso y recordatorios, respetando siempre sus preferencias de privacidad y modo de uso. Su misión es enviar notificaciones oportunas (recordatorios de rituales, rachas ganadas, estado de suscripción) sin ser invasivo o molesto, manteniendo la promesa de diseño compasivo.

---

## 2. Responsabilidad Única (SOLID)

El sistema de notificaciones debe ser modular y desacoplado:
1.  **`NotificationService` (Backend):** Gestiona la lógica de *cuándo* y *qué* notificar (ej. "El usuario X debe ser notificado a las 8:00 AM sobre C.A.F.É."). Se encarga de disparar la notificación al proveedor (Firebase/APN para push, o el sistema de email).
2.  **`notification-handler.js` (Frontend):** Gestiona la interacción con la API de Notificaciones del navegador/OS (solicitar permiso, manejar notificaciones locales, escuchar eventos).

**NO** debe contener lógica de negocio (ej. ¿Qué es un ritual?).

---

## 3. Entradas y Salidas (I/O)

### Qué recibe (Inputs):
- **Usuario:** (`User` object) para consultar `notifications_enabled` y preferencias de horario.
- **Tipo de notificación:** (Ej: 'ritual_reminder', 'streak_milestone', 'subscription_expiring').
- **Datos contextuales:** (Ej: Nombre del ritual, racha actual, tiempo de expiración).
- **Tokens de dispositivo:** (Para notificaciones push en el wrapper nativo).

### Qué entrega (Outputs):
- **Confirmación de envío:** (Ej: `true` si el proveedor de notificaciones aceptó el mensaje).
- **Permiso del usuario:** (Ej: Estado de `Notification.permission` en el cliente).
- **Eventos:** (Ej: `NotificationSent`, `NotificationPermissionDenied`).

**Ejemplo:**
```
Input:  $user = UserObject (notifications_enabled=true, reminder_time=08:00 UTC), $type = 'ritual_reminder' (C.A.F.É.)
Output: true (Envío exitoso)
Action: Dispara una notificación push/local a las 08:00 UTC para el ritual C.A.F.É.
```

---

## 4. El Paso a Paso (Lógica)

### Flujo de Recordatorio de Ritual (Backend Scheduler/Cron Job):
1.  **Activación:** El scheduler corre periódicamente (ej. cada hora) o se activa por eventos (ej. al completar un ritual).
2.  **Consulta de Usuarios a notificar:** `NotificationService` consulta a `SettingsService` y `UserProgressService` para obtener la lista de usuarios que:
    *   Tienen las notificaciones activadas (desde `directiva-class-settings.md`).
    *   Tienen habilitado el recordatorio para ese ritual (ej. C.A.F.É. para mañana).
    *   No han completado el ritual hoy.
    *   Su hora de notificación preferida coincide con la hora actual.
3.  **Construcción del mensaje:** Usar la lógica de "Mensajes Inteligentes" de `directiva-ux-experiencia-usuario.md` para crear un texto empático.
4.  **Envío:**
    *   **Push (Futuro App Nativa):** Enviar payload a Firebase Cloud Messaging (FCM) o APN.
    *   **Local (PWA/Web):** Usar `ServiceWorker` para disparar notificaciones locales (si el usuario lo permite).
5.  **Registro:** Guardar en la DB (tabla `notifications_log`) que se envió la notificación.

### Flujo de Permisos en el Cliente (Frontend JS):
1.  **Solicitud de permiso:** Al cargar el perfil, si el usuario tiene `notifications_enabled=true` pero el navegador no ha dado permiso, `notification-handler.js` pide permiso al usuario.
2.  **Manejo de respuesta:**
    *   Si acepta: Disparar evento `NotificationPermissionGranted` y enviar token al backend si es necesario.
    *   Si rechaza/ignora: Actualizar `notifications_enabled` a `false` en el backend (vía `SettingsService`) para respetar su decisión y detener futuros intentos.
3.  **Manejo de Notificaciones Locales:** Si se recibe un evento de notificación local (ej. de un service worker), mostrar el mensaje diseñado.

---

## 5. Reglas de Oro (Restricciones y Seguridad)

### SIEMPRE:
- ✅ Respetar la preferencia del usuario de activarlas/desactivarlas (desde Perfil).
- ✅ **Solo notificar sobre progreso/recordatorios, NUNCA vender.**
- ✅ Usar mensajes empáticos y sin culpa (UX Principio 4/5).
- ✅ Para PWA/Web, usar Service Workers para notificaciones locales cuando la app esté cerrada, si es posible.
- ✅ Para el MVP (Web App), enfocarse en notificaciones locales si el usuario está en la web; si no, priorizar la recolección de datos para Push futuras.

### NUNCA:
- ❌ Enviar notificaciones si el usuario no ha dado permiso explícito en el navegador.
- ❌ Enviar notificaciones de marketing o promocionales.
- ❌ Enviar notificaciones si el usuario ya completó el ritual correspondiente ese día.
- ❌ Depender de que el usuario tenga la app abierta para los recordatorios (usar push/local).

---

## 6. Dependencias (Qué necesita para funcionar)

- `SettingsService`: Para leer la preferencia de activación y horarios.
- `UserProgressService`: Para saber qué rituales faltan y estado de rachas.
- `RitualService`: Para saber cuándo se debe recordar cada ritual (mañana/noche).
- `DatabaseService`: Para registrar logs de envío.
- **Frontend:** `ServiceWorker` API y `Notification` API del navegador.

---

## 7. Casos Borde y "Trampas" Conocidas

### Limitaciones Conocidas:
- **iOS y Push/Local:** El soporte para notificaciones push en PWA en iOS es limitado o inexistente. La estrategia inicial debe centrarse en la web (recordatorios en la app) y dejar las notificaciones push nativas para la Fase 2 (App Wrapper).
- **Hora del recordatorio:** Si el usuario cambia su zona horaria o el horario de recordatorio, el cálculo debe ser reevaluado para el próximo ciclo.

### Errores Comunes y Soluciones:
| Error | Por qué pasa | Cómo evitarlo |
| :--- | :--- | :--- |
| Usuario recibe notificaciones de ritual ya completado | El check de "completado hoy" es lento o no se ejecuta antes del scheduler. | El scheduler debe consultar el estado actual del día *antes* de construir el mensaje. |
| Notificación de racha no se dispara | El hito de racha no fue registrado como evento | Asegurar que `UserProgressService` dispara `StreakUpdated` o un evento específico de hito. |
| Permiso denegado | Usuario rechaza permiso en el navegador | Respetar el rechazo y desactivar la funcionalidad en el perfil (`SettingsService`). |

---

## 8. Bitácora de Aprendizaje (Memoria del Sistema)

| Fecha | Qué falló | Por qué pasó | Cómo lo arreglamos para siempre |
| :--- | :--- | :--- | :--- |
| 2026-02-04 | Notificación de cumpleaños (futura) llegaba a medianoche UTC | El cron job ejecutaba a UTC 00:00, sin considerar la zona horaria del usuario. | Creamos una tabla de programación basada en zona horaria y usamos un cron job diario que itera sobre los usuarios y calcula su hora local de envío. |

---

## 9. Flujo de Integración (Cómo se conecta con el resto)

```mermaid
graph TD
    A[Scheduler/Cron Job (Back)] --> B{NotificationService::checkAndSendReminders()};
    B -- "Consulta Estado" --> C{UserProgressService, SettingsService};
    C -- "Lista usuarios a notificar" --> B;
    B -- "Payload Mensaje" --> D{Provider API (FCM/Local)};
    D -- "Envío" --> E[Usuario recibe notificación];
    B -- "Log Envío" --> F{DatabaseService};
    
    G[Frontend (Profile/Load)] --> H[notification-handler.js];
    H -- "Request Permission" --> I[Browser API];
    I -- "Acepta" --> J[Enviar token/preferencia a Auth/Settings Service];
```

---

## 10. Checklist de Pre-Implementación

Antes de escribir código:
- [ ] ¿He leído esta directiva completa?
- [ ] ¿Entiendo la diferencia entre notificaciones web (locales/push) y las futuras push nativas?
- [ ] ¿La lógica de *cuándo* enviar se basa en preferencias de usuario y estado del día?
- [ ] ¿El texto de la notificación será empático (UX)?

---

## 11. Checklist de Post-Implementación

Después de escribir código:
- [ ] El sistema respeta la preferencia de activación/desactivación.
- [ ] El sistema respeta la hora de notificación del usuario (ajustada a su zona horaria).
- [ ] El sistema no notifica sobre rituales ya completados ese día.
- [ ] Los mensajes son empáticos y no intrusivos.
- [ ] ¿Actualicé la sección "Bitácora de Aprendizaje"?
- [ ] ¿Documenté el cambio en CHANGELOG.md?

---

## 12. Notas Adicionales

### Decisiones de Diseño:
- **Foco MVP:** Priorizar notificaciones basadas en el estado de la aplicación (recordatorios de rituales pendientes) y las rachas más largas, ya que son los principales impulsores de la adherencia.

### Referencias:
- [Web Push API](https://developer.mozilla.org/en-US/docs/Web/API/Push_API)
- [Service Workers for Background Sync/Notifications](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

### Advertencias de Seguridad:
- **Token de dispositivo:** Si se usa push, el token de dispositivo debe ser gestionado de forma segura y revocarse si el usuario desinstala/cierra sesión.

---

**Última Actualización:** 2026-02-04  
**Responsable:** Alejandro Leguízamo  
**Estado:** Activo