# DIRECTIVA: Interfaz de Administración (Admin UI)

> **Responsable:** AdminController / AdminDashboard.php
> **Archivo Asociado:** `views/AdminView.tsx` (frontend) o `admin/admin-dashboard.php` (si es un backend PHP separado)
> **Estado:** Activo
> **Última Mejora:** 2026-02-04
> **Versión:** 1.0.0

---

## 1. ¿Para qué sirve esto? (Misión)

Esta directiva define la interfaz de administración, un panel separado para que los administradores del sistema gestionen usuarios, rituales, configuraciones y monitoreen métricas clave (como se especifica en `requerimientos.md`, Sección 11). Su misión es proporcionar las herramientas necesarias para la operación y el crecimiento del producto, manteniendo la seguridad y la claridad para los administradores.

---

## 2. Responsabilidad Única (SOLID)

La interfaz de administración SOLO debe permitir a los usuarios con rol de administrador (definido en `directiva-class-auth.md`) realizar tareas de gestión y monitoreo. No debe contener lógica de cara al usuario final ni afectar la experiencia del usuario regular. Su objetivo es la eficiencia y seguridad de la gestión interna.

---

## 3. Entradas y Salidas (I/O)

### Qué recibe (Inputs):
- **Credenciales de Administrador:** (Usuario con rol `admin` o similar).
- **Parámetros de búsqueda/filtrado:** (Ej: `$user_id`, `$ritual_name`, `$date_range`).
- **Datos para crear/editar:** (Ej: Nuevos rituales, configuración global).

### Qué entrega (Outputs):
- **Listas de datos:** (Ej: Usuarios, rituales, suscripciones).
- **Métricas agregadas:** (Ej: Días ganados, rachas promedio, conversiones).
- **Confirmación de acciones:** (Ej: "Usuario editado exitosamente").
- **Excepciones de seguridad:** (Ej: `UnauthorizedAccessException` si no es admin).

**Ejemplo:**
```
Input:  Admin hace clic en "Ver usuarios"
Output: Lista paginada de usuarios con ID, Nombre, Email, Nivel, Suscripción.
Action: Muestra la interfaz de gestión de usuarios.
```

---

## 4. El Paso a Paso (Lógica)

### Flujo de Acceso al Panel (`GET /admin/dashboard`):
1.  **Autenticación y Autorización:** `AuthService` (o middleware) verifica que el usuario está logueado y tiene rol de `admin`.
2.  **Cargar Resumen:** `AdminController` carga un resumen de métricas clave (`UserProgressService`, `SubscriptionService`) para el dashboard principal (ej. usuarios activos, nuevas suscripciones).
3.  **Renderizar UI:** Muestra el `AdminDashboard.php` o `AdminView.tsx` con enlaces a secciones específicas (Usuarios, Rituales, Métricas).

### Flujo de Gestión de Usuarios (`GET /admin/users`, `POST /admin/users/{id}/edit`):
1.  **Listar Usuarios:** `AdminController` consulta a `DatabaseService` (o `UserService`) para obtener una lista paginada de usuarios.
2.  **Editar Usuario:** Permite al administrador modificar el nivel, el estado de suscripción, o bloquear/desactivar un usuario.
    *   Validar datos de entrada estrictamente en el backend.
    *   Disparar eventos (`UserUpdated`, `SubscriptionChanged`).

### Flujo de Gestión de Rituales (`GET /admin/rituals`, `POST /admin/rituals/new`):
1.  **Listar Rituales:** Muestra todos los rituales con sus detalles (nombre, duración, modos, audios).
2.  **Crear/Editar Rituales:** Permite al administrador añadir nuevos rituales o modificar los existentes (ej. cambiar audios, pasos).

### Flujo de Monitoreo de Métricas (`GET /admin/metrics`):
1.  **Consultar Métricas:** `AdminController` llama a `AnalyticsService` (o directamente a `UserProgressService`, `SubscriptionService`) para obtener las métricas definidas en `requerimientos.md` (Sección 11).
2.  **Visualizar:** Muestra gráficos y tablas con datos agregados (ej. % de activación, rachas promedio, tasa de conversión).

---

## 5. Reglas de Oro (Restricciones y Seguridad)

### SIEMPRE:
- ✅ **Todas las rutas de administración deben estar protegidas por middleware de autorización estricto.**
- ✅ Registrar cada acción de administrador (quién hizo qué y cuándo).
- ✅ Validar todos los inputs del administrador en el backend para prevenir inyección SQL/XSS.
- ✅ La interfaz debe ser clara y funcional, sin distracciones de diseño de cara al usuario final.
- ✅ Las métricas deben ser las definidas en `requerimientos.md` (Sección 11) y ser coherentes.

### NUNCA:
- ❌ Permitir acceso al panel de administración a usuarios que no tengan el rol explícito de `admin`.
- ❌ Exponer información sensible de usuarios (contraseñas, datos de pago completos).
- ❌ Permitir acciones destructivas (borrar datos) sin una confirmación de doble factor (ej. contraseña de admin).
- ❌ Mezclar código de administración con código de la aplicación de usuario final.

---

## 6. Dependencias (Qué necesita para funcionar)

- `AuthService`: Para verificar el rol de administrador.
- `DatabaseService`: Para todas las operaciones de lectura/escritura de datos.
- `User` Model, `Ritual` Model, `Subscription` Model, `UserDailyStatus` Model, `DiagnosticResult` Model: Para interactuar con los datos de la aplicación.
- `UserProgressService`, `SubscriptionService`, `DiagnosticService`: Para obtener datos y métricas consolidadas.
- `AnalyticsService` (futuro): Para métricas avanzadas.

---

## 7. Casos Borde y "Trampas" Conocidas

### Limitaciones Conocidas:
- **Concurrencia de administradores:** Si múltiples administradores editan el mismo recurso simultáneamente, puede haber conflictos. Solución: Bloqueos optimistas o notificaciones de "otro admin está editando".
- **Datos incompletos:** Si las métricas no se registran correctamente en la app, el panel admin mostrará datos erróneos. Solución: Dashboards con validación de datos (ej. "última actualización hace X horas").

### Errores Comunes y Soluciones:
| Error | Por qué pasa | Cómo evitarlo |
| :--- | :--- | :--- |
| Acceso no autorizado | Rol de admin no verificado correctamente | Reforzar el middleware de autorización de admin en todas las rutas. |
| Datos inconsistentes | Un administrador edita un campo sin la lógica de negocio apropiada | Implementar validadores robustos en el backend para cada campo editado por el admin. |
| Gráficos vacíos/incorrectos | Las métricas no se registran o la query es errónea | Verificar el log de eventos de analítica y las consultas de la DB. |

---

## 8. Bitácora de Aprendizaje (Memoria del Sistema)

| Fecha | Qué falló | Por qué pasó | Cómo lo arreglamos para siempre |
| :--- | :--- | :--- | :--- |
| 2026-02-04 | Un usuario regular podía ver la ruta `/admin/dashboard` (aunque estaba vacía) | El middleware de autorización solo redirigía si el usuario no estaba autenticado, no si no tenía el rol `admin`. | Agregamos una verificación explícita de `Auth::user()->role === 'admin'` en el middleware `CheckAdminRole`. |

---

## 9. Flujo de Integración (Cómo se conecta con el resto)

```mermaid
graph TD
    A[Usuario (Admin)] --> B{Login (via AuthService)};
    B -- "Credenciales Válidas + Rol Admin" --> C{AdminController};
    C -- "Accede a /admin/dashboard" --> D{CheckAdminRole Middleware};
    D -- "Renderiza Admin View (AdminView.tsx)" --> E[Panel de Administración];
    C -- "Gestión de Usuarios/Rituales/Métricas" --> F{DatabaseService/User/Ritual/Subscription Models};
    C --> G{UserProgressService/SubscriptionService (para métricas)};
```

---

## 10. Checklist de Pre-Implementación

Antes de escribir código:
- [ ] ¿He leído esta directiva completa?
- [ ] ¿Tengo claro qué rol de usuario se considera "administrador"?
- [ ] ¿Sé qué métricas exactas deben mostrarse en el panel (ver `requerimientos.md` Sección 11)?
- [ ] ¿Entiendo las implicaciones de seguridad de dar acceso a esta interfaz?

---

## 11. Checklist de Post-Implementación

Después de escribir código:
- [ ] Todas las rutas de administración están protegidas.
- [ ] Se registran las acciones de los administradores.
- [ ] La interfaz es clara y funcional.
- [ ] Las métricas se muestran correctamente y son consistentes.
- [ ] ¿Hay nuevas restricciones o aprendizajes?
- [ ] ¿Actualicé la sección "Bitácora de Aprendizaje"?
- [ ] ¿Documenté el cambio en CHANGELOG.md?

---

## 12. Notas Adicionales

### Decisiones de Diseño:
- **Separación de UI:** La UI de administración puede ser más simple, sin las restricciones de "Mobile-First" tan estrictas como la app de usuario final, pero debe ser responsiva para uso en tablets.

### Referencias:
- [Laravel Admin Panels](https://laravel-news.com/admin-panels-for-laravel)
- [OWASP Top 10 for Web Application Security](https://owasp.org/www-project-top-ten/)

### Advertencias de Seguridad:
- **Inyección de SQL:** Es crucial validar *todos* los inputs de los administradores para evitar inyecciones. Un admin malicioso puede causar mucho daño.
- **Control de Acceso Basado en Roles (RBAC):** Asegurar que solo los roles autorizados puedan realizar ciertas acciones (ej. solo el "Super Admin" puede crear otros admins).

---

**Última Actualización:** 2026-02-04  
**Responsable:** Alejandro Leguízamo  
**Estado:** Activo