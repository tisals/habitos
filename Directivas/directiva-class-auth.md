# DIRECTIVA: Clase de Autenticación y Autorización (Auth)

> **Responsable:** AuthService / AuthController
> **Archivo Asociado:** `src/Domains/User/AuthService.php` o `src/Http/Middleware/CheckAuth.php`
> **Estado:** Activo
> **Última Mejora:** 2026-02-04
> **Versión:** 1.0.0

---

## 1. ¿Para qué sirve esto? (Misión)

Esta capa es responsable de verificar la identidad del usuario (Autenticación) y determinar qué recursos o acciones puede acceder según su nivel y suscripción (Autorización). Su misión es proteger el acceso a la aplicación y asegurar que las restricciones definidas en el modelo de niveles (Nivel 1, 2, 3 y Premium) se apliquen rigurosamente en todos los endpoints críticos.

---

## 2. Responsabilidad Única (SOLID)

La capa de Autenticación/Autorización SOLO debe preocuparse por:
1.  Verificar credenciales (login/logout).
2.  Generar y validar tokens de sesión (JWT, Session Cookies).
3.  Verificar permisos basados en el `User` model (Nivel, Suscripción).

**NO** debe contener lógica de negocio de rituales, progreso, ni configuración de UI.

---

## 3. Entradas y Salidas (I/O)

### Qué recibe (Inputs):
- **Credenciales de Login:** (Ej: `email`, `password`).
- **Token de sesión/API:** (Ej: JWT o cookie de sesión).
- **Solicitud HTTP:** (Ej: Request object para middleware).
- **Roles/Niveles requeridos:** (Ej: Requerir `level >= 2` o `subscription_status = 'premium'`).

### Qué entrega (Outputs):
- **Usuario autenticado:** (Ej: Objeto `User` si la autenticación es exitosa).
- **Booleanos:** (Ej: `true` si la autorización es exitosa, `false` si falla).
- **Excepciones/Errores:** (Ej: `AuthenticationException`, `AuthorizationException`).
- **Acciones de Middleware:** (Ej: Detener el request HTTP, devolver 401/403).

**Ejemplo:**
```
Input:  Request con token JWT inválido.
Output: AuthorizationException (HTTP 401 Unauthorized)
Action: Request es denegado antes de llegar al controlador principal.
```

---

## 4. El Paso a Paso (Lógica)

### Flujo de Autenticación (Login):
1.  **Recibir credenciales:** Email y contraseña del formulario de login.
2.  **Validación básica:** Verificar que ambos campos existen y tienen formato correcto.
3.  **Buscar usuario:** Consultar `DatabaseService` por el email.
4.  **Verificar contraseña:** Comparar la contraseña ingresada con el hash almacenado (usando la función de hashing segura del framework).
5.  **Generar sesión:** Si las credenciales son válidas, generar un token de sesión seguro (JWT o Session ID).
6.  **Retorno:** Devolver el token y datos básicos del usuario (ID, Nombre, Nivel, Suscripción).

### Flujo de Autorización (Middleware `CheckAccess`):
Este middleware se adjunta a rutas críticas (ej. `/ritual/ara`, `/profile/update`).
1.  **Extraer token:** Intentar obtener el token de la cabecera HTTP o cookie.
2.  **Validar token:** Usar el servicio de tokens para verificar la validez y expiración del token, obteniendo el `user_id`.
3.  **Cargar usuario:** Obtener el `User` model completo usando `DatabaseService`.
4.  **Verificar Nivel/Suscripción (Autorización):**
    *   Si la ruta requiere Premium, verificar `SubscriptionService::isPremium($user)`.
    *   Si la ruta requiere Nivel 3, verificar `$user->level >= 3`.
5.  **Inyectar usuario:** Si la autorización es exitosa, adjuntar el `User` object al request para que los controladores lo utilicen.
6.  **Continuar o Denegar:** Si pasa todas las verificaciones, permitir el paso. Si falla en cualquier punto, retornar error 401/403.

---

## 5. Reglas de Oro (Restricciones y Seguridad)

### SIEMPRE:
- ✅ Usar algoritmos de hash robustos (ej. Bcrypt/Argon2).
- ✅ Inyectar dependencias (DatabaseService, SubscriptionService) en los middlewares y controladores de autenticación.
- ✅ Aplicar el middleware de autenticación a **todas** las rutas privadas (Dashboard, Rituals, Profile).
- ✅ Validar explícitamente el nivel y estado de suscripción antes de dar acceso a contenido Premium (como A.R.A. asistido o L.I.F.E. asistido).
- ✅ Limitar los intentos de login (throttling) para prevenir ataques de fuerza bruta.

### NUNCA:
- ❌ Almacenar contraseñas en texto plano ni usar algoritmos obsoletos (MD5, SHA1).
- ❌ Devolver mensajes de error detallados que revelen si el usuario existe o no (ej. "Email no encontrado" vs. "Credenciales inválidas").
- ❌ Permitir que un usuario Nivel 1 acceda a contenido Nivel 3/Premium.
- ❌ Permitir que un usuario cambie su nivel o estado de suscripción a través de requests no autorizados (solo a través de la lógica de pago o admin).

---

## 6. Dependencias (Qué necesita para funcionar)

- `DatabaseService`: Para leer datos de usuario y verificar credenciales.
- `User` Model: Para acceder a nivel y suscripción.
- `SubscriptionService`: Para verificar el estado de pago.
- `TokenManager` (o framework JWT/Session): Para gestionar la sesión.
- `RateLimiter` (o similar): Para prevenir ataques de fuerza bruta.

---

## 7. Casos Borde y "Trampas" Conocidas

### Limitaciones Conocidas:
- **Tokens expirados:** El sistema debe manejar la expiración del token y forzar al usuario a re-autenticarse (debe ser manejado por el frontend al recibir 401).
- **Usuarios sin nivel:** Un nuevo registro que no ha pasado el diagnóstico inicial debe ser tratado como Nivel 0 o Nivel 1 predeterminado.
- **Roles de Administrador:** Necesitan un nivel de autorización superior para acceder a `AdminController`.

### Errores Comunes y Soluciones:
| Error | Por qué pasa | Cómo evitarlo |
| :--- | :--- | :--- |
| Tokens JWT mal formados | Frontend envía un token mal codificado | Implementar validación estricta del formato del token en el backend. |
| Fallo al cargar usuario tras token válido | El `user_id` en el token no corresponde a un usuario activo en la DB | Usar un *soft delete* en la tabla de usuarios. Si el usuario existe pero está desactivado, denegar acceso. |
| El middleware se salta rutas públicas | Orden de middleware incorrecto | Asegurar que el middleware de autenticación se aplica *después* de las rutas públicas (Login, Landing). |

---

## 8. Bitácora de Aprendizaje (Memoria del Sistema)

| Fecha | Qué falló | Por qué pasó | Cómo lo arreglamos para siempre |
| :--- | :--- | :--- | :--- |
| 2026-02-04 | El Nivel 2 podía acceder a contenido Premium | El middleware de autorización solo verificaba el Nivel, no el estado de `is_premium` | Se modificó el middleware de autorización para incluir una verificación explícita del estado de suscripción cuando se accede a contenido Premium. |

---

## 9. Flujo de Integración (Cómo se conecta con el resto)

```mermaid
graph TD
    A[Frontend (Login/API Call)] --> B{AuthService/AuthController};
    B -- "Validate Credentials" --> C{DatabaseService};
    C -- "Check Password Hash" --> D[User Table];
    B -- "Generate Token" --> E[TokenManager];
    E -- "Return Token" --> A;
    
    F[Private API Route] --> G{CheckAuth Middleware};
    G -- "Validate Token & Load User" --> E;
    G -- "Check Authorization (Level/Subscription)" --> H{SubscriptionService/UserProgressService};
    H -- "Permit Access" --> F;
    H -- "Deny Access (401/403)" --> I[Return Error];
```

---

## 10. Checklist de Pre-Implementación

Antes de escribir código:
- [ ] ¿He leído esta directiva completa?
- [ ] ¿Entiendo la diferencia clave entre Autenticación (quién eres) y Autorización (qué puedes hacer)?
- [ ] ¿Conozco los requisitos de hashing y manejo de tokens?
- [ ] ¿Tengo claro cómo verificar el nivel/suscripción del usuario en el middleware?

---

## 11. Checklist de Post-Implementación

Después de escribir código:
- [ ] El código sigue la responsabilidad única (SOLID).
- [ ] Se utiliza hashing seguro para contraseñas.
- [ ] El middleware de autenticación protege todas las rutas privadas.
- [ ] La autorización se basa rigurosamente en Nivel y Suscripción.
- [ ] Los errores de login/autorización son genéricos (no revelan información).
- [ ] ¿Hay nuevas restricciones o aprendizajes?
- [ ] ¿Actualicé la sección "Bitácora de Aprendizaje"?
- [ ] ¿Documenté el cambio en CHANGELOG.md?

---

## 12. Notas Adicionales

### Decisiones de Diseño:
- **Tokens vs. Sesiones:** Se prefiere JWT para la App Híbrida para manejar la autenticación entre la web y el futuro wrapper de la app nativa de forma más fluida.

### Referencias:
- [JWT Best Practices](https://jwt.io/introduction)
- [Password Hashing with Bcrypt](https://php.net/manual/en/function.password-hash.php)

### Advertencias de Seguridad:
- **Mitigación de CSRF:** Asegurar que los endpoints que cambian el estado (login, logout, update profile) estén protegidos con tokens CSRF.
- **Exposición de datos:** Asegurar que la respuesta de login no devuelva el hash de la contraseña.

---

**Última Actualización:** 2026-02-04  
**Responsable:** Alejandro Leguízamo  
**Estado:** Activo