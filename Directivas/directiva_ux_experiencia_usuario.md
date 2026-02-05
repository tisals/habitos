# DIRECTIVA: UX - Experiencia de Usuario (Principios de Diseño)

> **Responsable:** Todo el equipo de desarrollo (Backend + Frontend)  
> **Archivo Asociado:** Todos los archivos de la app (esta directiva gobierna la experiencia completa)  
> **Estado:** Activo  
> **Última Mejora:** 2026-02-03  
> **Versión:** 1.0.0

---

## 1. ¿Para qué sirve esto? (Misión)

Esta directiva define los principios de experiencia de usuario que TODA la app debe seguir. No es opcional. Es la diferencia entre una app que se siente como nativa y una que se siente como web. Es la diferencia entre una app que engancha y una que se abandona. Sin estos principios, la app será solo código funcional sin alma.

---

## 2. Responsabilidad Única (SOLID)

Esta directiva NO es código. Es el **contrato de experiencia** que todo el equipo debe respetar. Cada pantalla, cada botón, cada animación, cada mensaje debe pasar por el filtro de estos principios antes de implementarse.

---

## 3. Principios de UX Obligatorios

### Principio 1: Mobile-First Obligatorio
**¿Qué significa?**
- Diseñar primero para móvil, luego adaptar a desktop.
- Uso con una mano (pulgar alcanza todo).
- Botones grandes (mínimo 44x44px).
- Navegación tipo bottom navigation (como Instagram/WhatsApp).

**¿Por qué?**
- El 90% de los usuarios usarán la app en móvil.
- Si se siente torpe en móvil, se abandona.

**Reglas concretas:**
- ✅ Navegación principal en la parte inferior (bottom navigation).
- ✅ Botones de acción principal en la parte inferior (fácil de alcanzar con pulgar).
- ✅ Máximo 4 opciones en bottom navigation.
- ✅ Iconos + texto en navegación (no solo iconos).
- ❌ Menús hamburguesa (difícil de alcanzar).
- ❌ Botones pequeños (< 44x44px).
- ❌ Scrolls horizontales.

---

### Principio 2: Una Acción Principal por Pantalla
**¿Qué significa?**
- Cada pantalla tiene UN objetivo claro.
- Un botón principal destacado.
- Cero distracciones.

**¿Por qué?**
- Reduce carga cognitiva.
- Aumenta tasa de completado.
- Evita parálisis por análisis.

**Reglas concretas:**
- ✅ Un botón principal por pantalla (color destacado, grande).
- ✅ Acciones secundarias en color neutro (menos prominentes).
- ✅ Máximo 3 opciones visibles al mismo tiempo.
- ❌ Múltiples botones del mismo color y tamaño.
- ❌ Pantallas con más de 5 opciones.
- ❌ Formularios largos (dividir en pasos).

**Ejemplos:**
- **Dashboard:** Acción principal = "Empezar C.A.F.É." (botón grande, color primario).
- **Ritual:** Acción principal = "Empezar ritual" (botón grande, color primario).
- **Perfil:** Acción principal = "Guardar cambios" (botón grande, color primario).

---

### Principio 3: Feedback Visual Inmediato
**¿Qué significa?**
- Cada acción del usuario tiene respuesta visual instantánea.
- Nunca dejar al usuario preguntándose "¿funcionó?".

**¿Por qué?**
- Genera confianza.
- Reduce ansiedad.
- Mejora percepción de velocidad.

**Reglas concretas:**
- ✅ Botones cambian de color al hacer clic (estado activo).
- ✅ Loaders/spinners mientras se procesa algo.
- ✅ Mensajes de confirmación después de acciones importantes ("Ritual completado ✅").
- ✅ Animaciones suaves (fade, slide) entre pantallas.
- ✅ Checkmarks animados al completar algo.
- ❌ Acciones sin feedback visual.
- ❌ Esperas largas sin indicador de progreso.
- ❌ Mensajes de error sin explicación clara.

**Ejemplos:**
- Usuario hace clic en "Empezar ritual" → Botón cambia a "Cargando..." con spinner → Pantalla de ritual aparece con animación fade.
- Usuario completa ritual → Checkmark animado aparece → Mensaje "Ritual completado ✅" con confetti → Redirige a dashboard después de 2 segundos.

---

### Principio 4: Mensajes Inteligentes (No Robóticos)
**¿Qué significa?**
- La app habla como un coach, no como una máquina.
- Mensajes personalizados según contexto.
- Tono empático, directo, sin tecnicismos.

**¿Por qué?**
- Genera conexión emocional.
- Aumenta adherencia.
- Diferencia la app de otras genéricas.

**Reglas concretas:**
- ✅ Usar nombre del usuario en mensajes ("Buenos días, Alejandro").
- ✅ Mensajes según estado del día:
  - Si no ha hecho nada: "Tu día está intacto. Empecemos por ganar tu mañana."
  - Si hizo C.A.F.É.: "Ya ganaste la mañana. No dejes el día abierto, cierra con L.I.F.E."
  - Si ganó el día: "¡Día ganado! 🎉 Mañana vamos por el día 8."
- ✅ Mensajes de contención si rompe racha: "Respira. Un día no define tu progreso. Hoy empezamos de nuevo."
- ❌ Mensajes genéricos ("Bienvenido", "Acción completada").
- ❌ Mensajes de culpa ("Perdiste tu racha", "Fallaste").
- ❌ Tecnicismos ("Error 404", "Request failed").

**Ejemplos de mensajes inteligentes:**
- **Dashboard vacío:** "Tu día está intacto. Empecemos por ganar tu mañana con C.A.F.É."
- **Racha rota:** "Respira. Un día no define tu progreso. Hoy empezamos de nuevo. 💪"
- **Primer día ganado:** "¡Lo lograste! Este es el primer día de muchos. 🎉"
- **Racha de 7 días:** "7 días seguidos. Esto ya es un hábito. 🔥"

---

### Principio 5: Sin Culpa (Diseño Compasivo)
**¿Qué significa?**
- Si el usuario falla, el mensaje es de contención, no de castigo.
- No usar lenguaje negativo ("perdiste", "fallaste", "fracasaste").
- Enfocarse en el siguiente paso, no en el error.

**¿Por qué?**
- La culpa genera abandono.
- La compasión genera adherencia.
- El objetivo es transformación, no perfección.

**Reglas concretas:**
- ✅ Mensajes de contención si rompe racha.
- ✅ Enfocarse en el siguiente paso ("Hoy empezamos de nuevo").
- ✅ Celebrar pequeños logros ("Hiciste C.A.F.É. 3 veces esta semana, eso es progreso").
- ❌ Mensajes de culpa ("Perdiste tu racha de 10 días").
- ❌ Comparaciones negativas ("Otros usuarios tienen rachas más largas").
- ❌ Lenguaje de fracaso ("Fallaste", "No lo lograste").

**Ejemplos:**
- **Racha rota:** "Respira. Un día no define tu progreso. Hoy empezamos de nuevo. 💪" (NO: "Perdiste tu racha de 10 días").
- **No hizo ritual en 3 días:** "Te extrañamos. ¿Listo para retomar?" (NO: "Llevas 3 días sin hacer nada").

---

### Principio 6: Transiciones Suaves (Sensación de App Nativa)
**¿Qué significa?**
- Animaciones entre pantallas (fade, slide).
- Cero recargas de página completa.
- Cero saltos bruscos.

**¿Por qué?**
- Genera sensación de app nativa.
- Mejora percepción de calidad.
- Reduce fricción.

**Reglas concretas:**
- ✅ Transiciones fade o slide entre pantallas (200-300ms).
- ✅ Animaciones suaves en botones (hover, active).
- ✅ Scroll suave (smooth scroll).
- ✅ Modales/pop-ups con animación de entrada (fade + scale).
- ❌ Recargas de página completa.
- ❌ Saltos bruscos entre pantallas.
- ❌ Animaciones muy lentas (> 500ms).

**Ejemplos:**
- Usuario hace clic en ritual → Pantalla actual hace fade out → Pantalla de ritual hace fade in.
- Usuario abre pop-up → Modal aparece con fade + scale desde el centro.

---

### Principio 7: Modo Offline Básico
**¿Qué significa?**
- Si no hay conexión, mostrar último estado conocido.
- Mensaje claro de que no hay conexión.
- No romper la app.

**¿Por qué?**
- Evita frustración.
- Permite ver progreso histórico sin conexión.
- Genera confianza.

**Reglas concretas:**
- ✅ Cachear último estado del dashboard.
- ✅ Mostrar mensaje claro: "Sin conexión. Tus datos se sincronizarán cuando vuelvas a estar online."
- ✅ Permitir ver progreso histórico sin conexión.
- ❌ Pantalla en blanco si no hay conexión.
- ❌ Mensajes técnicos ("Network error", "Failed to fetch").
- ❌ Permitir acciones que requieren conexión sin avisar.

**Ejemplos:**
- Usuario abre app sin conexión → Dashboard muestra último estado conocido + banner: "Sin conexión. Tus datos se sincronizarán cuando vuelvas a estar online."

---

### Principio 8: Navegación Predecible
**¿Qué significa?**
- El usuario siempre sabe dónde está.
- El usuario siempre sabe cómo volver.
- Cero callejones sin salida.

**¿Por qué?**
- Reduce ansiedad.
- Aumenta confianza.
- Mejora usabilidad.

**Reglas concretas:**
- ✅ Bottom navigation siempre visible (excepto en rituales activos).
- ✅ Botón "Volver" visible en pantallas secundarias.
- ✅ Indicador de pantalla actual en bottom navigation (color destacado).
- ✅ Breadcrumbs en pantallas profundas (opcional).
- ❌ Pantallas sin forma de volver.
- ❌ Navegación inconsistente (a veces bottom, a veces top).
- ❌ Botones "Volver" que no funcionan.

**Ejemplos:**
- Usuario está en dashboard → Bottom navigation muestra "Inicio" destacado.
- Usuario está en ritual → Bottom navigation oculta (para evitar distracciones) + botón "Salir" en esquina superior.

---

### Principio 9: Carga Rápida (Percepción de Velocidad)
**¿Qué significa?**
- La app se siente rápida, incluso si no lo es.
- Skeleton screens mientras carga.
- Lazy loading de contenido pesado.

**¿Por qué?**
- La velocidad percibida es más importante que la velocidad real.
- Reduce abandono.
- Mejora satisfacción.

**Reglas concretas:**
- ✅ Skeleton screens mientras carga contenido (no spinners genéricos).
- ✅ Lazy loading de imágenes y audio.
- ✅ Precargar contenido crítico en background.
- ✅ Optimizar imágenes y audio (compresión).
- ❌ Pantallas en blanco mientras carga.
- ❌ Spinners genéricos sin contexto.
- ❌ Cargar todo al inicio (aumenta tiempo de carga).

**Ejemplos:**
- Dashboard cargando → Skeleton screen con forma de tarjetas de rituales → Contenido real aparece cuando carga.
- Ritual cargando → Skeleton screen con forma de pasos → Contenido real aparece cuando carga.

---

### Principio 10: Accesibilidad Básica
**¿Qué significa?**
- Contraste suficiente en textos.
- Tamaños de fuente legibles.
- Botones con labels claros.

**¿Por qué?**
- Inclusión.
- Mejor usabilidad para todos.
- Cumplimiento de estándares.

**Reglas concretas:**
- ✅ Contraste mínimo 4.5:1 en textos (WCAG AA).
- ✅ Tamaño de fuente mínimo 16px en móvil.
- ✅ Botones con labels claros (no solo iconos).
- ✅ Alt text en imágenes importantes.
- ❌ Textos grises sobre fondo gris claro.
- ❌ Fuentes muy pequeñas (< 14px).
- ❌ Botones sin texto (solo iconos).

---

## 4. Checklist de Validación de UX (Obligatorio)

Antes de dar por terminada cualquier pantalla, validar:

### Checklist de Pantalla:
- [ ] ¿Se siente como app nativa (no como web)?
- [ ] ¿Tiene una acción principal clara?
- [ ] ¿Los botones son grandes (mínimo 44x44px)?
- [ ] ¿La navegación es predecible?
- [ ] ¿Hay feedback visual en cada acción?
- [ ] ¿Los mensajes son inteligentes (no robóticos)?
- [ ] ¿Las transiciones son suaves?
- [ ] ¿Funciona bien con una mano (pulgar alcanza todo)?
- [ ] ¿El contraste de textos es suficiente?
- [ ] ¿Carga rápido o tiene skeleton screen?

### Checklist de Flujo:
- [ ] ¿El usuario sabe dónde está?
- [ ] ¿El usuario sabe cómo volver?
- [ ] ¿El flujo tiene máximo 3 pasos?
- [ ] ¿Cada paso tiene un objetivo claro?
- [ ] ¿Hay feedback visual en cada paso?

### Checklist de Mensajes:
- [ ] ¿El mensaje usa el nombre del usuario?
- [ ] ¿El mensaje es empático (no robótico)?
- [ ] ¿El mensaje es claro (sin tecnicismos)?
- [ ] ¿El mensaje es accionable (dice qué hacer ahora)?
- [ ] ¿El mensaje evita culpa o lenguaje negativo?

---

## 5. Casos Borde y "Trampas" Conocidas

### Limitaciones Conocidas:
- **Animaciones en dispositivos lentos:** Pueden sentirse laggy. Solución: detectar dispositivo y reducir animaciones si es necesario.
- **Bottom navigation en pantallas pequeñas:** Puede ocupar mucho espacio. Solución: usar iconos + texto corto.
- **Skeleton screens mal diseñados:** Pueden confundir más que ayudar. Solución: que el skeleton se parezca al contenido real.
- **Mensajes muy largos:** Pueden abrumar. Solución: máximo 2 líneas, ir al grano.

### Errores Comunes y Soluciones:
| Error | Por qué pasa | Cómo evitarlo |
| :--- | :--- | :--- |
| Botones muy pequeños | No se validó tamaño mínimo | Usar mínimo 44x44px |
| Mensajes robóticos | No se personalizó según contexto | Usar nombre del usuario y contexto del día |
| Navegación confusa | No se validó flujo completo | Hacer walkthrough completo antes de lanzar |
| Carga lenta percibida | No se usó skeleton screen | Usar skeleton screen mientras carga |
| Animaciones laggy | Dispositivo lento o animación muy compleja | Reducir complejidad o detectar dispositivo |

---

## 6. Bitácora de Aprendizaje (Memoria del Sistema)

| Fecha | Qué falló | Por qué pasó | Cómo lo arreglamos para siempre |
| :--- | :--- | :--- | :--- |
| 2026-02-03 | Botones muy pequeños en móvil | No validamos tamaño mínimo | Establecimos regla: mínimo 44x44px |
| 2026-02-03 | Mensajes genéricos sin personalización | No usamos contexto del usuario | Agregamos nombre y estado del día en mensajes |
| 2026-02-03 | Navegación confusa en ritual | No había forma clara de volver | Agregamos botón "Salir" visible en esquina superior |

> **Nota de Implementación:** Si encuentras un nuevo problema de UX, **primero** arréglalo, y **luego** documenta la regla aquí para evitar regresiones futuras.

---

## 7. Flujo de Validación de UX (Obligatorio)

### Antes de implementar:
1. **Diseñar en papel o Figma:** Boceto rápido de la pantalla.
2. **Validar con checklist:** ¿Cumple los 10 principios?
3. **Hacer walkthrough mental:** ¿El flujo tiene sentido?
4. **Implementar.**

### Después de implementar:
1. **Probar en móvil real:** No solo en emulador.
2. **Validar con checklist:** ¿Cumple los 10 principios?
3. **Hacer walkthrough real:** ¿El flujo se siente natural?
4. **Ajustar si es necesario.**
5. **Documentar aprendizajes.**

---

## 8. Notas Adicionales

### Decisiones de Diseño:
- **Por qué bottom navigation:** Porque es el estándar en apps nativas y es fácil de alcanzar con pulgar.
- **Por qué una acción principal por pantalla:** Porque reduce carga cognitiva y aumenta tasa de completado.
- **Por qué mensajes inteligentes:** Porque genera conexión emocional y diferencia la app de otras genéricas.
- **Por qué sin culpa:** Porque la culpa genera abandono y el objetivo es transformación, no perfección.

### Referencias:
- [Material Design - Navigation](https://m3.material.io/components/navigation-bar/overview)
- [iOS Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [WCAG 2.1 - Accessibility](https://www.w3.org/WAI/WCAG21/quickref/)
- [Skeleton Screens - UX Collective](https://uxdesign.cc/what-you-should-know-about-skeleton-screens-a820c45a571a)

### Advertencias:
- **No sacrificar UX por funcionalidad:** Si una feature rompe la experiencia, no la implementes.
- **No copiar UX de otras apps sin entender el contexto:** Lo que funciona en Instagram no necesariamente funciona aquí.
- **No ignorar feedback de usuarios reales:** Si dicen que algo es confuso, probablemente lo es.

---

**Última Actualización:** 2026-02-03  
**Responsable:** Alejandro Leguízamo  
**Estado:** Activo  
**Versión:** 1.0.0