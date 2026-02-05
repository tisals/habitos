# DIRECTIVA: Clase de Base de Datos (Persistence Layer)

> **Responsable:** DatabaseService (o similar)
> **Archivo Asociado:** `src/Domains/Database/DatabaseService.php` (ejemplo, ajustar según framework)
> **Estado:** Activo
> **Última Mejora:** 2026-02-04
> **Versión:** 1.0.0

---

## 1. ¿Para qué sirve esto? (Misión)

Esta clase es el punto de acceso para todas las operaciones de persistencia de datos en la aplicación. Su misión es encapsular la lógica de interacción con la base de datos, proporcionando una interfaz limpia y consistente para guardar, recuperar, actualizar y eliminar información. Sin ella, la aplicación no podría almacenar ningún dato de usuario, rituales, o progreso.

---

## 2. Responsabilidad Única (SOLID)

`DatabaseService` SOLO maneja la persistencia de datos. No contiene lógica de negocio, no valida reglas de negocio, no envía notificaciones, ni procesa eventos. Solo se encarga de la comunicación con la base de datos, asegurando que los datos se almacenen y recuperen de manera eficiente y segura.

---

## 3. Entradas y Salidas (I/O)

### Qué recibe (Inputs):
- **Modelos de datos:** (Ej: `User`, `Ritual`, `RitualCompletion` objetos o arrays de datos).
- **Condiciones de búsqueda:** (Ej: `$user_id` int, `$ritual_id` int, `$date` string, `$limit` int).
- **Datos a actualizar:** (Ej: `$data` array, `$id` int).

### Qué entrega (Outputs):
- **Modelos de datos:** (Ej: `User` objeto, lista de `RitualCompletion` objetos).
- **Booleanos:** (Ej: `true` si la operación fue exitosa, `false` si falló).
- **Excepciones:** (Ej: `DatabaseException` en caso de error de conexión o query).
- **IDs:** (Ej: `last_inserted_id` int).

**Ejemplo:**
```
Input:  $user_data = ['name' => 'John Doe', 'email' => 'john@example.com']
Output: User object (con el ID asignado si es inserción)
Action: Inserta un nuevo usuario en la tabla `users` o actualiza uno existente.
```

---

## 4. El Paso a Paso (Lógica)

### Ejemplo para `DatabaseService::saveUser(User $user)`:
1.  **Validación interna de datos:** Asegurar que el objeto `User` tiene los campos mínimos requeridos (no validación de negocio, sino de estructura). (Esto podría delegarse a un validador si la clase se hace muy grande, pero la responsabilidad principal sigue siendo guardar el objeto válido).
2.  **Preparación de la query:** Construir la sentencia SQL (INSERT o UPDATE) o usar un ORM (Eloquent, Doctrine) para mapear el objeto a la base de datos.
3.  **Ejecución de la query:** Ejecutar la operación en la base de datos.
4.  **Manejo de errores:** Capturar posibles excepciones de la base de datos (ej. duplicados, errores de conexión) y convertirlas en excepciones de la aplicación (`DatabaseException`).
5.  **Retorno:** Devolver el objeto `User` actualizado (con su ID si fue una inserción) o lanzar una excepción.

---

## 5. Reglas de Oro (Restricciones y Seguridad)

### SIEMPRE:
- ✅ Usar prepared statements o un ORM con protección contra SQL injection.
- ✅ Validar tipos de datos antes de interactuar con la DB.
- ✅ Implementar manejo de errores robusto para todas las operaciones de DB.
- ✅ Usar índices en las tablas para búsquedas frecuentes (user_id, ritual_id, date).
- ✅ Mantener las transacciones si se necesitan múltiples operaciones atómicas.
- ✅ Sanitizar inputs del usuario *antes* de que lleguen a la capa de persistencia.

### NUNCA:
- ❌ Construir queries SQL con concatenación directa de variables de usuario.
- ❌ Realizar consultas pesadas dentro de bucles sin paginación o caching.
- ❌ Exponer credenciales de la base de datos en el código fuente o logs.
- ❌ Mezclar lógica de negocio con la lógica de persistencia.
- ❌ Ignorar errores de la base de datos; siempre deben ser capturados y manejados.

---

## 6. Dependencias (Qué necesita para funcionar)

- Necesita una instancia del controlador de la base de datos (PDO, mysqli, o una conexión ORM como Eloquent/DBAL).
- Puede depender de clases de modelos (User, Ritual, etc.) para tipado de datos.
- Un sistema de logging para errores de DB.

---

## 7. Casos Borde y "Trampas" Conocidas

### Limitaciones Conocidas:
- **Conexión perdida:** La aplicación debe manejar la reconexión o fallas elegantes si la base de datos no está disponible.
- **Bloqueos de tablas:** Operaciones concurrentes pueden causar bloqueos. Considerar transacciones y bloqueos a nivel de fila si es necesario.
- **Errores de unicidad:** Intentar insertar un registro con una clave única ya existente debe ser manejado explícitamente.
- **Grandes volúmenes de datos:** La inserción o recuperación de muchos registros debe ser optimizada (batch inserts, paginación).

### Errores Comunes y Soluciones:
| Error | Por qué pasa | Cómo evitarlo |
| :--- | :--- | :--- |
| SQLSTATE[HY000]: General error: 1364 Field '...' doesn't have a default value | Campo NOT NULL sin valor | Asegurar que todos los campos requeridos se provean al insertar/actualizar. |
| SQLSTATE[23000]: Integrity constraint violation: 1062 Duplicate entry '...' for key '...' | Intento de insertar un valor duplicado en columna UNIQUE | Capturar la excepción y notificar al usuario (ej. "Email ya registrado"). |
| PDOException: SQLSTATE[HY000] [2002] Connection refused | Base de datos no accesible | Verificar configuración de DB, estado del servidor, credenciales. Implementar reintentos con backoff. |

---

## 8. Bitácora de Aprendizaje (Memoria del Sistema)

| Fecha | Qué falló | Por qué pasó | Cómo lo arreglamos para siempre |
| :--- | :--- | :--- | :--- |
| 2026-02-04 | Lenta recuperación de usuarios activos | La query de `get_active_users` no usaba un índice en el campo `last_login` | Agregamos índice en `last_login` a la tabla `users` y cacheamos el resultado por 5 minutos. |

---

## 9. Flujo de Integración (Cómo se conecta con el resto)

```mermaid
graph TD
    A[Servicio de Lógica de Negocio (Ej: UserService)] --> B{DatabaseService};
    B -- 