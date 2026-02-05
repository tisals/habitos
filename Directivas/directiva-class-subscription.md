# DIRECTIVA: Clase de Gestión de Suscripciones (Subscription)

> **Responsable:** SubscriptionService / SubscriptionController
> **Archivo Asociado:** `src/Domains/Subscription/SubscriptionService.php` o similar
> **Estado:** Activo
> **Última Mejora:** 2026-02-04
> **Versión:** 1.0.0

---

## 1. ¿Para qué sirve esto? (Misión)

Esta clase es responsable de gestionar todo lo relacionado con el estado de pago y acceso Premium del usuario. Su misión es verificar si un usuario tiene acceso a funcionalidades de pago (L.I.F.E. asistido, A.R.A. completo) basándose en su estado de suscripción y fecha de expiración. Es la guardiana de los límites de monetización del producto.

---

## 2. Responsabilidad Única (SOLID)

`SubscriptionService` SOLO se encarga de:
1.  Verificar si una suscripción está activa y no expirada.
2.  Determinar qué nivel de acceso corresponde al estado actual de la suscripción (ej. Premium activo, Trial expirado).
3.  Gestionar la lógica de renovación/cambio de planes.

**NO** se encarga de procesar pagos (eso es tarea de un conector externo como Wompi/Stripe) ni de actualizar el nivel del usuario (eso es de `DiagnosticService` o `AdminController`).

---

## 3. Entradas y Salidas (I/O)

### Qué recibe (Inputs):
- **Usuario:** (Ej: `User` objeto, para consultar su relación con `Subscription` model).
- **Tipo de acceso requerido:** (Ej: 'full_audio_life', 'ara_ritual_access').

### Qué entrega (Outputs):
- **Estado de acceso:** (Ej: `boolean` para indicar si tiene acceso a una función específica).
- **Datos de suscripción:** (Ej: Fecha de expiración, plan actual).
- **Excepciones:** (Ej: `SubscriptionNotActiveException`).
- **Eventos:** (Ej: `SubscriptionRenewed`, `SubscriptionUpgraded`).

**Ejemplo:**
```
Input:  $user = UserObject, $requiredAccess = 'full_audio_life'
Output: true
Action: Verifica que $user->subscription->is_active == true Y que la fecha de expiración es futura.
```

---

## 4. El Paso a Paso (Lógica)

### Flujo de Verificación de Acceso (\`SubscriptionService::checkAccess($user, $accessType)\`):
1.  **Cargar suscripción:** Obtener el registro de suscripción asociado al `$user` a través de `DatabaseService`.
2.  **Verificar estado activo:** Comprobar si la suscripción existe y si `status` es 'active' o 'trialing'.
3.  **Verificar expiración:** Si está activa, comprobar si `expires_at` es posterior a la fecha/hora actual (UTC).
4.  **Determinar Acceso Específico (Según Requerimientos.md, Sección 4):**
    *   Si `$accessType` es 'full\_audio\_life', verificar que el nivel del usuario es 3 **Y** la suscripción es 'premium'.
    *   Si `$accessType` es 'ara\_ritual\_access', verificar que la suscripción es 'premium'.
5.  **Retorno:** Devolver `true` si pasa todas las verificaciones; de lo contrario, lanzar una excepción de autorización o devolver `false`.

### Flujo de Procesamiento de Renovación (Webhook de Pasarela de Pago):
*Este flujo es disparado externamente y debe ser resiliente.*
1.  **Recibir webhook:** Capturar la notificación del proveedor de pagos (Wompi, Stripe, etc.).
2.  **Validar firma:** Verificar la firma del webhook para asegurar que es legítimo.
3.  **Actualizar registro:** Usar `DatabaseService` para actualizar la tabla `subscriptions` con el nuevo estado ('active', 'pending\_renewal') y la nueva fecha de expiración (`expires_at`).
4.  **Disparar evento:** Emitir `SubscriptionRenewed` o `SubscriptionUpgraded`.
5.  **Retorno:** Respuesta HTTP 200 OK al proveedor de pagos.

---

## 5. Reglas de Oro (Restricciones y Seguridad)

### SIEMPRE:
- ✅ La verificación de acceso debe ser **server-side** y rigurosa. Nunca confiar en el estado del frontend.
- ✅ Todas las fechas deben manejarse en UTC.
- ✅ Los webhooks deben validarse criptográficamente antes de procesar cualquier dato.
- ✅ Los cambios de plan o el estado final de la suscripción deben ser la fuente de verdad para el acceso Premium.

### NUNCA:
- ❌ Exponer la fecha de expiración real o detalles de pago en la respuesta de la API a un cliente no autorizado.
- ❌ Permitir que un usuario inicie un ritual (ej. A.R.A.) si la lógica de este servicio indica que su suscripción expiró hace un día.
- ❌ Guardar información sensible de tarjetas de crédito; solo almacenar el ID de la transacción/cliente del proveedor de pagos.

---

## 6. Dependencias (Qué necesita para funcionar)

- `DatabaseService`: Para leer/escribir en la tabla `subscriptions` y la tabla `users` (para el nivel).
- `User` Model: Para asociar la suscripción al usuario.
- `DiagnosticService`: Para consultar el nivel actual del usuario al verificar el acceso al modo asistido completo.
- `WebhookValidator`: Para verificar la autenticidad de las notificaciones externas.
- `EventDispatcher`.

---

## 7. Casos Borde y "Trampas" Conocidas

### Limitaciones Conocidas:
- **Pago fallido:** Si un pago recurrente falla, la suscripción debe entrar en un estado 'past\_due' y la lógica de acceso debe reflejarlo (ej. permitir acceso hasta el final del ciclo facturado).
- **Diferencia de husos horarios:** Al comparar la hora actual con `expires_at`, se debe asegurar que ambas son UTC.
- **Cambios de Nivel:** Si un usuario baja de Nivel 3 a Nivel 2, y estaba usando L.I.F.E. asistido (solo Nivel 3), el acceso debe revocarse inmediatamente.

### Errores Comunes y Soluciones:
| Error | Por qué pasa | Cómo evitarlo |
| :--- | :--- | :--- |
| Acceso Premium denegado por hora | Confusión entre hora local del servidor y UTC | Asegurar que la hora actual siempre se compara en UTC. |
| Webhook duplicado | El proveedor de pagos reintenta el envío | Implementar un \`webhook\_id\` y una tabla de registro de webhooks para asegurar idempotencia. |
| Expiración incorrecta | El cálculo de renovación es erróneo | Siempre basar la nueva fecha de expiración en la fecha de la transacción exitosa, no en la fecha de expiración anterior. |

---

## 8. Bitácora de Aprendizaje (Memoria del Sistema)

| Fecha | Qué falló | Por qué pasó | Cómo lo arreglamos para siempre |
| :--- | :--- | :--- | :--- |
| 2026-02-04 | El Nivel 2 podía acceder a contenido Premium | El middleware de autorización solo verificaba el Nivel, no el estado de \`is\_premium\` | Se modificó el middleware de autorización para incluir una verificación explícita del estado de suscripción cuando se accede a contenido Premium. |

---

## 9. Flujo de Integración (Cómo se conecta con el resto)

```mermaid
graph TD
    A[RitualController (Para L.I.F.E./A.R.A.)] --> B{SubscriptionService::checkAccess()};
    C[ProfileController (Para mostrar estado)] --> B;
    B -- "Verifica Estado" --> D{DatabaseService};
    D -- "Consulta Subscription Table" --> E[Subscription Model];
    B -- "Retorna Acceso" --> A;
    
    F[Webhook Gateway (Externo)] --> G{SubscriptionController::handleWebhook()};
    G --> H{SubscriptionService::processRenewal()};
    H --> D;
    H --> I[Evento SubscriptionRenewed];
```

---

## 10. Checklist de Pre-Implementación

Antes de escribir código:
- [ ] ¿He leído esta directiva completa?
- [ ] ¿Entiendo la jerarquía: Nivel (por diagnóstico) vs. Suscripción (por pago)?
- [ ] ¿Tengo claro qué acceso corresponde a cada nivel/estado de suscripción (ver \`requerimientos.md\` Sección 4)?
- [ ] ¿Sé cómo manejar los webhooks de pagos (validación de firma e idempotencia)?

---

## 11. Checklist de Post-Implementación

Después de escribir código:
- [ ] El código sigue la responsabilidad única (SOLID).
- [ ] Las verificaciones de acceso son **server-side** y estrictas.
- [ ] Las fechas se manejan en UTC.
- [ ] Los webhooks son seguros y atómicos (idempotentes).
- [ ] Los eventos de renovación/upgrade se disparan.
- [ ] ¿Hay nuevas restricciones o aprendizajes?
- [ ] ¿Actualicé la sección "Bitácora de Aprendizaje"?
- [ ] ¿Documenté el cambio en CHANGELOG.md?

---

## 12. Notas Adicionales

### Decisiones de Diseño:
- **Separación de lógica:** El nivel define el acceso potencial (ej. "puede usar A.R.A."), y la suscripción define el acceso real (ej. "tiene A.R.A. activado").

### Referencias:
- [Idempotent Webhooks](https://stripe.com/docs/webhooks/idempotency)
- [Best Practices for API Security](https://owasp.org/www-project-api-security/)

### Advertencias de Seguridad:
- **Data leakage:** Asegurar que las respuestas de autorización/verificación no revelen si una suscripción expiró o si el usuario no existe, solo que el acceso es denegado.

---

**Última Actualización:** 2026-02-04  
**Responsable:** Alejandro Leguízamo  
**Estado:** Activo