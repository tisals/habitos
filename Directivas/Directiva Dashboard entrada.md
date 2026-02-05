# Directiva: Pantalla de Inicio (Dashboard Diario)
## Proyecto: La Llave de tu Potencial

### 0. Idea fuerza (para no perdernos)
Esta pantalla existe para que el usuario piense: **“sé exactamente qué hacer hoy. y es fácil.”**

Nada de menús eternos. Nada de culpa. Un solo siguiente paso claro.

---

### 1. Misión
Convertir el estado actual del usuario (energía, enfoque, ruido mental y momento del día) en una recomendación **simple y accionable**:

- Qué ritual hacer ahora.
- Cuánto tarda.
- Qué gana si lo hace.

---

### 2. Responsabilidad Única (Single Responsibility)
**Orquestar la experiencia diaria**: mostrar métricas mínimas + racha + recomendación del día + acceso directo a los rituales.

No enseña teoría. No configura perfil. No vende. Solo guía el “hoy”.

---

### 3. Entradas / Salidas (I/O)

#### Entradas
- `user_id`
- `tema` (claro/oscuro)
- `preferencias_notificaciones` (on/off)
- `nivel_suscripcion` (free/premium/founder)
- `zona_horaria`
- `estado_hoy` (si existe):
  - `energia_1_5`
  - `enfoque_1_5`
  - `ruido_mental_1_5`
  - `ultimo_ritual` (CAFÉ / LIFE / PIT / none)
  - `timestamp`
- `racha_actual` (días)
- `rituales_disponibles` (según nivel)
- `historial_7_dias` (resumen: completó ritual sí/no)

#### Salidas
- UI renderizada con:
  - saludo + “micro diagnóstico” (3 sliders o quick taps)
  - 1 recomendación principal (CTA)
  - acceso a rituales (botones)
  - racha + progreso semanal
  - mensaje inteligente (1 línea)

- Eventos de analítica:
  - `dashboard_viewed`
  - `state_check_completed`
  - `cta_recommendation_clicked`
  - `ritual_started` / `ritual_completed`
  - `manual_mode_selected` / `assisted_mode_selected`

---

### 4. Estructura de UI (Mobile-first)

#### 4.1 Header
- “Hola, {nombre}”
- Micro copy: “¿Cómo estás hoy?”
- Icono rápido a Perfil (sin distraer)

**Color base:** Azul Maestro `#1A2B48` (texto/íconos). Fondo Off-White `#F8FAFC`.

#### 4.2 Check-in de 20 segundos (las 3 métricas)
- Energía (1–5)
- Enfoque (1–5)
- Ruido mental (1–5)

**Regla:** si el usuario ya registró hoy, se muestra como “editable” pero colapsado.

**Acentos:**
- Enfoque → Cian `#00D1FF`
- Energía/Logro → Ámbar `#FF9F1C`
- Calma/Noche → Verde `#2EC4B6`

#### 4.3 Recomendación principal (One Primary Action)
Tarjeta grande con:
- “Tu mejor jugada ahora”
- Ritual sugerido (CAFÉ / LIFE / PIT)
- Duración (2/5/8 min)
- Botón: “Empezar”
- Toggle visible: “Asistido / Manual” (default según último uso)

#### 4.4 Progreso
- Racha (🔥) + texto humano
- Mini calendario 7 días (solo completado/no completado)

**Regla anti-culpa:** si no hay completado, no usar grises tristes. Usar neutros.

#### 4.5 Accesos directos
Botones secundarios:
- C.A.F.É.
- L.I.F.E.
- P.I.T.

**Regla:** el CTA principal siempre es más fuerte que estos.

---

### 5. Lógica de Recomendación (simple, explicable)

> La recomendación debe poder explicarse en una frase. Si no, está demasiado compleja.

#### 5.1 Determinar “momento del día”
- Mañana: 05:00–11:59
- Tarde: 12:00–17:59
- Noche: 18:00–04:59

#### 5.2 Heurística base (V1)
- Si `ruido_mental >= 4` → recomendar **P.I.T. (2–5 min)**
- Si mañana y `enfoque <= 3` → recomendar **C.A.F.É. (5 min)**
- Si noche o `energia <= 2` → recomendar **L.I.F.E. (5 min)**
- Si todo está “ok” (>=3) → recomendar ritual pendiente del día (para balance)

#### 5.3 Mensaje inteligente (1 línea)
Formato:
- Observación + permiso + micro acción

Ejemplos:
- “Hoy el ruido está alto. No necesitas exigirte. Haz A.R.A. en 2 minutos.”
- “Tu enfoque está bajito. Un C.A.F.É. corto y arrancas.”
- “Cierra el día suave. L.I.F.E. y a dormir con la mente limpia.”

---

### 6. Reglas de Oro (lo obligatorio)
1. **Una acción primaria por pantalla.** Siempre.
2. **Sin culpa.** Nada de “fallaste”. Usar “hoy retomamos”.
3. **Estado visible.** Al completar un ritual, la pantalla debe reflejarlo de inmediato.
4. **Duraciones realistas.** 2–8 minutos. No más.
5. **60-30-10 de color.** Acentos solo para guiar, no para decorar.
6. **Cero fricción.** Si no hay check-in, permitir “Empezar igual”.

---

### 7. Comportamiento por Modos (Manual vs Asistido)
- **Asistido (default en onboarding):** música suave opcional + instrucciones paso a paso.
- **Manual:** música opcional + lista corta de pasos + cronómetro.

**Regla:** el usuario entiende en 2 segundos cuál modo eligió.

---

### 8. Dependencias
- Directiva: `directiva_identidad_visual_v2` (paleta y reglas de color)
- Directiva: `directiva_modos_ritual` (comportamiento manual/asistido)
- Directiva: `directiva_ux_experiencia_usuario` (principios UX)
- Servicios/Clases:
  - `UserProgressService` (racha, historial)
  - `DailyStateService` (estado del día)
  - `RitualRecommendationService` (heurística recomendación)
  - `AnalyticsTracker` (eventos)

---

### 9. Casos borde (Edge cases)
- Usuario nuevo sin datos → mostrar check-in abierto + recomendar “C.A.F.É. corto (2 min)”
- Usuario entra de noche por primera vez → recomendar L.I.F.E. y activar tema calma si está permitido.
- Usuario con notificaciones off → no insistir. Solo mostrar “Puedes activarlas en Perfil”.
- Sin conexión → mostrar última info + permitir ritual manual (sin analítica online, se sincroniza luego).
- Usuario premium/founder → puede ver mensajes extra o dashboard más rico, pero **sin romper la simplicidad**.

---

### 10. Flujo de Integración (paso a paso)
1. `DashboardController@index` carga:
   - estado hoy
   - racha
   - historial 7 días
   - recomendación
2. Render UI con CTA principal.
3. Al guardar check-in:
   - persistir `DailyState`
   - recalcular recomendación
   - disparar `state_check_completed`
4. Al completar ritual:
   - actualizar racha
   - marcar día como completado
   - mostrar feedback inmediato (sin recargar si se puede)

---

### 11. Checklist Pre-implementación
- [ ] Wireframe mobile (1 pantalla) con CTA principal obvio.
- [ ] Definir componentes UI reutilizables: `MetricChip`, `RecommendationCard`, `StreakWidget`, `WeekDots`.
- [ ] Definir eventos de analítica (nombres exactos).
- [ ] Definir heurística V1 (simple) y dejar espacio para V2.

### 12. Checklist Post-implementación
- [ ] Tiempo de carga < 1.5s en móvil promedio.
- [ ] Contraste validado (WCAG) para textos.
- [ ] Si el usuario completa ritual, la UI cambia al instante.
- [ ] Validar que siempre haya 1 CTA principal.
- [ ] Medir: % usuarios que hacen check-in + % que inician ritual desde recomendación.

---

### 13. Registro de Aprendizaje (Observador)
- Si la gente no hace el check-in, no es “falta de disciplina”. Es fricción. Simplificar.
- Si la gente abre dashboard y no toca el CTA, el copy no está claro o la recomendación no es creíble.
- Si sube racha pero baja calma, estamos incentivando “hacer por hacer”. Ajustar mensajes.