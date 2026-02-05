# DIRECTIVA: Clase de Diagnóstico y Niveles (Diagnostics)

> **Responsable:** DiagnosticService / DiagnosticController
> **Archivo Asociado:** `src/Domains/Diagnostics/DiagnosticService.php` o similar
> **Estado:** Activo
> **Última Mejora:** 2026-02-04
> **Versión:** 1.0.0

---

## 1. ¿Para qué sirve esto? (Misión)

Esta clase gestiona el proceso de diagnóstico inicial del usuario y determina su Nivel de Adherencia/Burnout (Nivel 1, 2 o 3). Su misión es proporcionar una base objetiva para personalizar la experiencia inicial del usuario, guiándolo hacia el ritual más apropiado para su estado actual, tal como se describe en `requerimientos.md` (Sección 4).

---

## 2. Responsabilidad Única (SOLID)

`DiagnosticService` SOLO se encarga de:
1.  Definir las preguntas del diagnóstico (físicas y emocionales).
2.  Calcular el puntaje a partir de las respuestas.
3.  Asignar el Nivel (1, 2 o 3) basado en el puntaje.
4.  Persistir el resultado del diagnóstico inicial.

**NO** se encarga de la lógica del ritual, la autenticación, ni el cambio de preferencias.

---

## 3. Entradas y Salidas (I/O)

### Qué recibe (Inputs):
- **Respuestas del usuario:** (Ej: Array de respuestas a las 5-7 preguntas del diagnóstico inicial, con puntuaciones 1-5).
- **ID de usuario:** (Ej: `$user_id` int).
- **Datos de nivel preexistentes:** (Para verificar si el diagnóstico ya se completó).

### Qué entrega (Outputs):
- **Nivel asignado:** (Ej: `int` 1, 2, o 3).
- **Resultado del diagnóstico:** (Ej: Objeto o array con puntajes por área: Energía, Enfoque, Ruido Mental).
- **Booleanos:** (Ej: `true` si el diagnóstico se guardó con éxito).
- **Excepciones:** (Ej: `DiagnosticException` si las respuestas son inválidas o incompletas).

**Ejemplo:**
```
Input:  Respuestas = [E: 4, F: 2, R: 5] (Energía, Enfoque, Ruido)
Output: Nivel Asignado = 1 (Usuario Burnout Alto)
Action: Guarda el resultado en la tabla `diagnostic_results` y actualiza el campo `level` en la tabla `users`.
```

---

## 4. El Paso a Paso (Lógica)

### Flujo de Presentación del Diagnóstico (GET /onboarding/diagnose):
1.  **Verificar sesión:** Asegurar que el usuario está logueado y que no tiene un `DiagnosticResult` previo.
2.  **Cargar preguntas:** Obtener la lista estática de preguntas y opciones de respuesta desde una configuración o directamente en el servicio.
3.  **Renderizar vista:** Mostrar las preguntas en un flujo guiado (máximo 1 pregunta por pantalla, acorde a Principio 2 de UX).

### Flujo de Cálculo y Guardado (`DiagnosticService::processResults(User $user, array $responses)`):
1.  **Validación de Respuestas:** Verificar que todas las preguntas esperadas fueron respondidas y que los valores están en el rango esperado (ej: 1 a 5).
2.  **Ponderación de Respuestas:** Aplicar el mapeo definido para cada respuesta a las tres métricas clave (Energía, Enfoque, Ruido Mental).
3.  **Cálculo del Nivel (Basado en Requerimientos.md, Sección 4):**
    *   Si `Ruido Mental` es alto (ej: >= 4) y `Enfoque` es bajo (ej: <= 3) → **Nivel 1**.
    *   Si el usuario está en rango intermedio y cumple criterios de C.A.F.É. → **Nivel 2**.
    *   Si el usuario está en rango alto/comprometido → **Nivel 3**.
    *   *Nota:* La lógica precisa debe ser fina y estar documentada en la Bitácora.
4.  **Persistir Resultados:** Guardar el resultado completo en `DatabaseService` (tabla `diagnostic_results`).
5.  **Actualizar Usuario:** Actualizar el campo `level` en la tabla `users` a través de `DatabaseService`.
6.  **Disparar Evento:** Emitir `UserLevelAssigned` evento.
7.  **Retorno:** Devolver el Nivel asignado.

---

## 5. Reglas de Oro (Restricciones y Seguridad)

### SIEMPRE:
- ✅ El diagnóstico solo debe poder ejecutarse **una vez** por usuario (o permitir reejecución controlada desde Perfil, pero el inicial es único).
- ✅ Las preguntas y la lógica de puntuación deben ser fáciles de auditar y actualizar.
- ✅ La asignación de nivel debe seguir estrictamente el modelo de niveles definido en `requerimientos.md`.
- ✅ El proceso debe ser guiado (UX Principio 2), respondiendo una pregunta a la vez.
- ✅ Las respuestas deben ser protegidas contra manipulación (se validan en el backend).

### NUNCA:
- ❌ Permitir que un usuario cambie su nivel manualmente (solo por el resultado del diagnóstico o si es administrador).
- ❌ Incluir preguntas sobre el plan de pago en el diagnóstico inicial (solo para perfilar adherencia).
- ❌ Usar esta clase para calcular rachas o progreso diario (eso es para `UserProgressService`).

---

## 6. Dependencias (Qué necesita para funcionar)

- `DatabaseService`: Para guardar el resultado en `diagnostic_results` y actualizar el nivel en `users`.
- `User` Model: Para saber si el usuario ya tiene un resultado.
- `EventDispatcher` (o similar): Para notificar a otros sistemas sobre el nuevo nivel asignado.

---

## 7. Casos Borde y "Trampas" Conocidas

### Limitaciones Conocidas:
- **Diagnóstico no completado:** Si el usuario llega al Dashboard sin diagnóstico, la UI debe mostrar una pantalla de Onboarding/Diagnóstico en lugar de la vista normal.
- **Respuestas incompletas:** Si el frontend falla y no envía todas las respuestas, el backend debe detectarlo y no intentar calcular el nivel, sino pedir la información faltante.
- **Escala de las preguntas:** Si se añaden más preguntas, la lógica de ponderación debe ser revisada.

### Errores Comunes y Soluciones:
| Error | Por qué pasa | Cómo evitarlo |
| :--- | :--- | :--- |
| Nivel 1 asignado a un usuario de alto rendimiento | La lógica de nivel es demasiado agresiva o las métricas de entrada están sesgadas | Revisar y ajustar los umbrales de puntuación para Nivel 1, 2 y 3. |
| Diagnóstico se guarda dos veces | El usuario hace clic en "Enviar" dos veces | Implementar idempotencia en el endpoint de guardado (ej. verificar si ya existe un registro para hoy). |

---

## 8. Bitácora de Aprendizaje (Memoria del Sistema)

| Fecha | Qué falló | Por qué pasó | Cómo lo arreglamos para siempre |
| :--- | :--- | :--- | :--- |
| 2026-02-04 | El diagnóstico inicial era confuso | Las preguntas eran muy teóricas. | Simplificamos a 3 preguntas claras (Energía, Enfoque, Ruido) con sliders de 1-5, como se menciona en `Directiva Dashboard entrada.md` (aunque el check-in es diario, el concepto es el mismo). |

---

## 9. Flujo de Integración (Cómo se conecta con el resto)

```mermaid
graph TD
    A[OnboardingView (Frontend)] --> B{DiagnosticController};
    B -- "processResults()" --> C{DiagnosticService::processResults()};
    C -- "Calcular Nivel" --> D[Lógica de Nivel];
    C -- "Persistir Resultado" --> E{DatabaseService};
    C -- "Actualizar Nivel en User" --> F[User Model];
    C -- "Dispara Evento" --> G[EventListeners];
    G --> H[UserService (para configurar dashboard inicial)];
    G --> I[DashboardController];
```

---

## 10. Checklist de Pre-Implementación

Antes de escribir código:
- [ ] ¿He leído esta directiva completa?
- [ ] ¿Entiendo la correlación entre las respuestas (1-5) y el nivel asignado (1, 2, 3)?
- [ ] ¿Sé cuáles son las 5-7 preguntas exactas? (Deben estar documentadas aquí o en un archivo de configuración).
- [ ] ¿Tengo claro dónde se guarda el resultado (tabla `diagnostic_results`) y dónde se actualiza el nivel (tabla `users`)?

---

## 11. Checklist de Post-Implementación

Después de escribir código:
- [ ] El diagnóstico se ejecuta solo una vez y persiste correctamente.
- [ ] El nivel asignado se refleja en el `User` model.
- [ ] El flujo de UX es de una sola acción por pantalla (Principio 2 de UX).
- [ ] El resultado es auditable (todo el proceso de cálculo guardado).
- [ ] ¿Hay nuevas restricciones o aprendizajes?
- [ ] ¿Actualicé la sección "Bitácora de Aprendizaje"?
- [ ] ¿Documenté el cambio en CHANGELOG.md?

---

## 12. Notas Adicionales

### Decisiones de Diseño:
- **Diagnóstico Único:** El diagnóstico inicial es un rito de iniciación. No debe ser trivial, pero tampoco largo. 5-7 preguntas es el máximo.
- **Acoplamiento con Niveles:** Este servicio es el ÚNICO que debe escribir en el campo `level` del usuario.

### Referencias:
- [UX para flujos de onboarding](https://www.nngroup.com/articles/onboarding-user-experience/)
- [Escalas de medición (Likert Scale)](https://en.wikipedia.org/wiki/Likert_scale)

### Advertencias de Seguridad:
- **No exponer el algoritmo:** La lógica exacta de ponderación de las respuestas para asignar el nivel no debería ser obvia en el código cliente o en las respuestas de la API (aunque esté en el código fuente).

---

**Última Actualización:** 2026-02-04  
**Responsable:** Alejandro Leguízamo  
**Estado:** Activo