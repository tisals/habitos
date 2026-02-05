# Plan para la Implementación de Directivas: Ajustes Fase 1 Piloto (Revisado)

Este documento detalla el plan para integrar las directivas del proyecto "La Llave de tu Potencial" en el proceso de desarrollo, basándose en el análisis de `requerimientos.md` y otras directivas.

## Meta
Crear un plan detallado para integrar las directivas en el proceso de desarrollo del proyecto "La Llave de tu Potencial", asegurando que los principios, flujos de usuario, modelos de niveles, estándares de calidad y métricas definidos en los documentos Markdown se traduzcan en tareas técnicas concretas.

## Fases del Plan

### 1. Auditoría y Creación de Directivas Fundamentales (Ajuste Fase 1 Piloto)
*   **Objetivo:** Asegurar que todas las directivas fundamentales para el MVP sean claras, completas y existan en formato Markdown.
*   **Contexto de Directivas Revisadas:**
    *   [`requerimientos.md`](Directivas/requerimientos.md:1): Visión general, arquitectura, flujos principales, modelo de niveles, etc.
    *   [`Directiva Dashboard entrada.md`](Directivas/Directiva%20Dashboard%20entrada.md:1): Detalles de la pantalla principal, lógica de recomendación, reglas UX.
    *   [`directiva ejemplo.md`](Directivas/directiva%20ejemplo.md:1): Plantilla para nuevas directivas.
    *   [`Directiva_identidad_visual.md`](Directivas/Directiva_identidad_visual.md:1): Paleta de colores, tipografía y reglas visuales.
    *   [`directiva_modos_ritual.md`](Directivas/directiva_modos_ritual.md:1): Lógica y flujo de modos manual/asistido, manejo de audio.
    *   [`directiva_perfil_usuario.md`](Directivas/directiva_perfil_usuario.md:1): Contenido y funcionalidad de la pantalla de perfil, manejo de preferencias.
    *   [`directiva_ux_experiencia_usuario.md`](Directivas/directiva_ux_experiencia_usuario.md:1): Principios generales de UX, checklist de validación.
*   **Tareas:**
    1.  **Validar Consistencia entre Directivas:**
        *   Revisar que las directivas individuales (`Directiva Dashboard entrada.md`, `Directiva_identidad_visual.md`, `directiva_modos_ritual.md`, `directiva_perfil_usuario.md` y `directiva_ux_experiencia_usuario.md`) sean consistentes con los requerimientos generales definidos en `requerimientos.md`.
        *   Identificar y documentar cualquier ambigüedad, solapamiento o conflicto entre ellas.
    2.  **Creación de Directivas Faltantes:**
        *   Crear archivos Markdown para las directivas fundamentales mencionadas en `requerimientos.md` (Sección 2. Componente 1: La Arquitectura), utilizando `directiva ejemplo.md` como plantilla. Estas incluyen:
            *   `directiva-class-database.md`
            *   `directiva-class-ritual-engine.md`
            *   `directiva-class-user-progress.md`
            *   `directiva-class-settings.md`
            *   `directiva-class-auth.md`
            *   `directiva-class-diagnostics.md`
            *   `directiva-class-subscription.md`
            *   `directiva-notificaciones.md`
            *   `directiva-app-hibrida.md`
            *   `directiva-admin-ui.md`
        *   Para cada nueva directiva, rellenar las secciones de Misión, Responsabilidad Única, Entradas/Salidas, y Flujo a alto nivel, basándose en la comprensión de los requerimientos generales y la plantilla.
    3.  **Asegurar la Sección "Bitácora de Aprendizaje":**
        *   Verificar que todas las directivas existentes y nuevas incluyan una sección de "Bitácora de Aprendizaje" (o "Registro de Aprendizaje") para documentar lecciones aprendidas y casos borde, según lo especificado en la `directiva ejemplo.md` y `requerimientos.md`.

### 2. Mapeo y Desglose de Tareas Técnicas
*   **Objetivo:** Relacionar cada directiva con los componentes de código y desglosar las directivas en tareas técnicas accionables.
*   **Tareas:**
    1.  **Mapeo Detallado:** Para cada directiva (tanto existentes como recién creadas), identificar explícitamente los archivos y componentes de código (`src/`, `assets/`, `views/`) que se verán afectados o deberán ser creados.
    2.  **Desglose de Tareas por Componente:**
        *   Para el `DashboardView.tsx`, `RitualView.tsx` y `ProfileView.tsx` (basado en los archivos existentes en `views/` y las directivas leídas), desglosar las tareas de implementación de UI, lógica de negocio y consumo de datos, haciendo referencia directa a los principios de UX, paleta de colores y lógica de rituales.
        *   Desglosar tareas para los servicios de backend (e.g., `RitualRecommendationService`, `UserProgressService`, `DailyStateService`) que surgieron de las directivas.
    3.  **Definición de Métricas y Logs:** Especificar qué métricas deben registrarse y dónde se deben implementar los eventos de analítica (ej: `dashboard_viewed`, `ritual_started`, `state_check_completed`), de acuerdo con la sección de métricas en `requerimientos.md`.

### 3. Priorización del MVP y Establecimiento del Bucle de Ingeniería de Contexto
*   **Objetivo:** Definir un orden lógico para la implementación, enfocándose en el MVP, e integrar el flujo de trabajo de "ingeniería de contexto".
*   **Tareas:**
    1.  **Priorización del MVP:**
        *   Las tareas relacionadas con el "Flujo de Onboarding (Primera Vez)" y "Flujo de Uso Diario (Usuario Recurrente)" (definidos en `requerimientos.md` y detallados en `Directiva Dashboard entrada.md`, `directiva_modos_ritual.md`, `directiva_perfil_usuario.md`) serán la máxima prioridad.
        *   La implementación de la [`Directiva_identidad_visual.md`](Directivas/Directiva_identidad_visual.md:1) y la [`directiva_ux_experiencia_usuario.md`](Directivas/directiva_ux_experiencia_usuario.md:1) será transversal y se aplicará desde el inicio.
    2.  **Integración del "Bucle de Ingeniería de Contexto":**
        *   Asegurar que cada tarea de desarrollo siga el protocolo de `requerimientos.md` (Paso 1: Consultar/Crear Directiva, Paso 2: Ejecución de Código, Paso 3: Observación y Aprendizaje).
        *   Establecer un proceso formal para la actualización de las directivas con los aprendizajes de la "Bitácora de Aprendizaje", asegurando que los errores y soluciones se documenten para evitar regresiones futuras.

## Diagrama de Flujo del Plan

```mermaid
graph TD
    A[Inicio: Usuario solicita implementar directivas] --> B{Auditoría y Creación de Directivas Fundamentales};
    B --> B1[Validar Consistencia entre Directivas Existentes];
    B1 --> B2[Crear Directivas Faltantes (Clases, Notificaciones, App Híbrida, Admin UI)];
    B2 --> B3[Asegurar 'Bitácora de Aprendizaje' en Todas las Directivas];
    B3 --> C{Mapeo y Desglose de Tareas Técnicas};
    C --> C1[Mapeo Detallado a Componentes de Código (Frontend/Backend)];
    C1 --> C2[Desglose de Tareas para Dashboard, Ritual, Perfil Views];
    C2 --> C3[Definición de Métricas y Eventos de Analítica];
    C3 --> D{Priorización del MVP y Bucle de Ingeniería de Contexto};
    D --> D1[Priorizar Onboarding y Flujos Diarios (MVP)];
    D1 --> D2[Integrar Bucle: Consultar Directiva -> Codificar -> Observar -> Actualizar Directiva];
    D2 --> E[Plan Aprobado por Usuario];
    E --> F[Escribir Plan a Archivo Markdown];
    F --> G{Delegar Tareas al Modo Código (o apropiado)};
    G --> H[Fin: Documentación Completa y Tareas Iniciadas];
```

Este plan revisado aborda explícitamente la creación de directivas faltantes y refuerza la consistencia y el uso de la bitácora de aprendizaje. Ahora que el plan está documentado, se recomienda cambiar al modo `Code` para comenzar la implementación de las tareas definidas, empezando por la creación de las directivas faltantes y la validación de consistencia. La documentación de la tarea está completa y lista para ser implementada en el modo adecuado.))