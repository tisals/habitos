# Directiva: Cambio de Nombre A.R.A. → P.I.T.

**Versión**: 1.0  
**Fecha**: Febrero 2026  
**Estado**: Activa  
**Tipo**: Actualización de Nomenclatura y Conceptualización

---

## 1. ¿Para qué sirve esto? (Misión)

Esta directiva documenta y guía el proceso de cambio de nombre del ritual **A.R.A.** (Activación, Revisión, Acción) a **P.I.T.** (Pausa · Intención · Tracción). El objetivo es actualizar toda la documentación, código, assets y referencias en el proyecto para reflejar el nuevo nombre y concepto, manteniendo la coherencia en toda la aplicación.

---

## 2. Responsabilidad Única

Documentar y ejecutar el cambio de nomenclatura del ritual de rescate/salvavidas de **A.R.A.** a **P.I.T.**, asegurando que:

1. El concepto del ritual se actualice para reflejar la nueva filosofía
2. Todas las referencias en código, documentación y assets se actualicen consistentemente
3. La identidad visual se ajuste (colores, iconos, etc.)
4. No se rompa ninguna funcionalidad existente

---

## 3. Entradas y Salidas (I/O)

### Entradas
- **Nombre anterior**: A.R.A. (Activación, Revisión, Acción)
- **Nombre nuevo**: P.I.T. (Pausa · Intención · Tracción)
- **Nueva conceptualización**:
  - **Pausa**: Cortas el patrón de lo que estás haciendo (y retienes los pensamientos negativos que estás persiguiendo)
  - **Intención**: Defines tu nueva intención como si se lo estuvieras contando a un amigo
  - **Tracción**: El primer paso pequeño para arrancar sin fricción
- **Archivos afectados**: Código TypeScript/TSX, directivas Markdown, assets de audio, configuración de colores

### Salidas
- Código actualizado con `RitualType.PIT` en lugar de `RitualType.ARA`
- Carpeta de audios renombrada: `public/assets/audio/rituals/pit/`
- Constantes de color actualizadas: `pit-primary`, `pit-secondary`
- Documentación actualizada en todas las directivas y README
- Ritual funcional con el nuevo nombre y descripción

---

## 4. Lógica Paso a Paso

### Fase 1: Actualización de Código

#### 1.1. Actualizar Tipos y Enums
**Archivo**: `src/types/index.ts` y `types.ts` (legacy)

```typescript
// ANTES
export enum RitualType {
  CAFE = 'CAFE',
  ARA = 'ARA',
  LIFE = 'LIFE'
}

// DESPUÉS
export enum RitualType {
  CAFE = 'CAFE',
  PIT = 'PIT',
  LIFE = 'LIFE'
}
```

#### 1.2. Actualizar Constantes de Rituales
**Archivo**: `src/constants/data.ts` y `constants.tsx` (legacy)

Cambiar:
- `id: 'ritual_ara'` → `id: 'ritual_pit'`
- `slug: 'ara'` → `slug: 'pit'`
- `name: 'Ritual A.R.A.'` → `name: 'Ritual P.I.T.'`
- `type: RitualType.ARA` → `type: RitualType.PIT`
- `description: 'Tu salvavidas en medio del caos para recuperar el control.'` → `description: 'Tu herramienta de rescate para romper patrones negativos y retomar el control.'`

**Actualizar pasos del ritual**:
```typescript
steps: [
  {
    id: 1,
    title: 'Pausa',
    duration: 60,
    description: 'Corta el patrón de lo que estás haciendo. Detén los pensamientos negativos que estás persiguiendo. Respira profundo.',
    audioPath: '/assets/audio/rituals/pit/pausa.MP3',
    checkpoints: ['Detuve lo que estaba haciendo', 'Identifiqué el patrón negativo']
  },
  {
    id: 2,
    title: 'Intención',
    duration: 90,
    description: 'Define tu nueva intención como si se lo estuvieras contando a un amigo. Sé específico y positivo.',
    audioPath: '/assets/audio/rituals/pit/intencion.MP3',
    checkpoints: ['Definí mi nueva intención', 'La expresé en voz alta o por escrito']
  },
  {
    id: 3,
    title: 'Tracción',
    duration: 60,
    description: 'Identifica el primer paso pequeño para arrancar sin fricción. Algo tan simple que no puedas decir que no.',
    audioPath: '/assets/audio/rituals/pit/traccion.MP3',
    checkpoints: ['Identifiqué mi primer paso', 'Estoy listo para ejecutarlo']
  }
]
```

#### 1.3. Actualizar Referencias en Vistas
**Archivos afectados**:
- `src/views/DashboardView.tsx`
- `src/views/AdminView.tsx`
- `src/views/PlansView.tsx`
- `src/views/LandingView.tsx`

Buscar y reemplazar:
- `RitualType.ARA` → `RitualType.PIT`
- `'ritual_ara'` → `'ritual_pit'`
- `araCompletions` → `pitCompletions`
- Textos descriptivos que mencionen "A.R.A." o "ARA"

#### 1.4. Actualizar App.tsx
**Archivo**: `src/App.tsx`

Cambiar referencias en la lógica de rachas y completados:
- `ritual_ara` → `ritual_pit`

#### 1.5. Actualizar Colores en Tema
**Archivo**: `src/constants/theme.ts`

```typescript
// ANTES
ara: {
  primary: '#FF6B6B',
  secondary: '#FF8E8E'
}

// DESPUÉS
pit: {
  primary: '#FF6B6B',
  secondary: '#FF8E8E'
}
```

**Archivo**: `index.html` (configuración Tailwind inline)

```javascript
// ANTES
'ara-primary': '#FF6B6B',
'ara-secondary': '#FF8E8E',

// DESPUÉS
'pit-primary': '#FF6B6B',
'pit-secondary': '#FF8E8E',
```

### Fase 2: Actualización de Assets

#### 2.1. Renombrar Carpeta de Audios
```bash
# Renombrar carpeta
mv public/assets/audio/rituals/ara public/assets/audio/rituals/pit

# Renombrar archivos de audio (si es necesario)
# atrapa.MP3 → pausa.MP3
# reta.MP3 → intencion.MP3
# afirma.MP3 → traccion.MP3
```

### Fase 3: Actualización de Documentación

#### 3.1. Actualizar README.md
Cambiar:
- `A.R.A. (Activación, Revisión, Acción): Ritual matutino de 15 min` → `P.I.T. (Pausa · Intención · Tracción): Ritual de rescate de 3-5 min`
- Todas las menciones de "A.R.A." o "ARA" en descripciones

#### 3.2. Actualizar Directivas
**Archivos afectados**:
- `Directivas/requerimientos.md`
- `Directivas/directiva_modos_ritual.md`
- `Directivas/directiva-mvp-hibrido-fase1.md`
- `Directivas/Directiva_identidad_visual.md`
- `plan_rituales.md`

Buscar y reemplazar:
- "A.R.A." → "P.I.T."
- "ARA" → "PIT"
- Actualizar descripciones conceptuales del ritual

#### 3.3. Actualizar Directiva de Identidad Visual
**Archivo**: `Directivas/Directiva_identidad_visual.md`

Cambiar sección de colores de acento:
```markdown
### Colores de Acento por Ritual

#### P.I.T. (Pausa · Intención · Tracción)
- **Primario**: `#FF6B6B` (Rojo coral energizante)
- **Secundario**: `#FF8E8E` (Coral suave)
- **Psicología**: Urgencia controlada, alerta sin alarma, energía de rescate
- **Uso**: Botón de ritual P.I.T., indicadores de rescate, alertas de patrón negativo
```

---

## 5. Reglas de Oro

### SIEMPRE:
- ✅ Usar "P.I.T." con puntos entre las letras para el nombre completo
- ✅ Mantener la coherencia en todos los archivos (código, docs, assets)
- ✅ Actualizar tanto archivos en `src/` como archivos legacy en raíz
- ✅ Verificar que los paths de audio apunten a la nueva carpeta `pit/`
- ✅ Ejecutar build después de los cambios para detectar errores
- ✅ Mantener el mismo color (#FF6B6B) para continuidad visual
- ✅ Actualizar los pasos del ritual para reflejar la nueva filosofía (Pausa, Intención, Tracción)

### NUNCA:
- ❌ Dejar referencias mixtas (A.R.A. y P.I.T. coexistiendo)
- ❌ Olvidar actualizar los archivos legacy (`types.ts`, `constants.tsx`)
- ❌ Cambiar la funcionalidad del ritual, solo el nombre y concepto
- ❌ Modificar la duración total del ritual (mantener ~3-5 min)
- ❌ Romper la compatibilidad con datos existentes en LocalStorage

---

## 6. Dependencias

### Técnicas
- TypeScript (enums, tipos)
- React (componentes que usan el ritual)
- Tailwind CSS (clases de color personalizadas)
- Sistema de archivos (renombrado de carpetas)

### Archivos Clave
- `src/types/index.ts` - Definición de enums
- `src/constants/data.ts` - Datos de rituales
- `src/constants/theme.ts` - Colores
- `index.html` - Configuración Tailwind
- `public/assets/audio/rituals/pit/` - Audios del ritual
- Todas las vistas en `src/views/`

### Directivas Relacionadas
- `Directiva_identidad_visual.md` - Colores y branding
- `directiva_modos_ritual.md` - Lógica de rituales
- `directiva-mvp-hibrido-fase1.md` - Arquitectura MVP
- `requerimientos.md` - Requerimientos del sistema

---

## 7. Casos Borde y Trampas Conocidas

### Limitaciones
1. **Datos en LocalStorage**: Los usuarios que ya completaron rituales con `ritual_ara` mantendrán ese ID en su historial
   - **Solución**: Mantener compatibilidad leyendo ambos IDs (`ritual_ara` y `ritual_pit`) en las estadísticas

2. **Archivos Legacy**: Existen archivos duplicados en raíz (`types.ts`, `constants.tsx`) que deben actualizarse
   - **Solución**: Actualizar ambos hasta que se eliminen los archivos legacy

3. **Audios Existentes**: Los archivos de audio pueden tener nombres antiguos (atrapa.MP3, reta.MP3, afirma.MP3)
   - **Solución**: Renombrar o crear symlinks, actualizar paths en constantes

### Errores Comunes

| Error | Causa | Solución |
|-------|-------|----------|
| `RitualType.ARA is not defined` | No se actualizó el enum | Actualizar `src/types/index.ts` y `types.ts` |
| Audio no carga (404) | Path apunta a carpeta `ara/` | Verificar que carpeta se renombró a `pit/` |
| Colores no aplican | Clases Tailwind `ara-primary` no existen | Actualizar configuración en `index.html` |
| Build falla | Referencias a `ARA` en código | Buscar todas las referencias con grep |
| Estadísticas no muestran completados | ID cambió de `ritual_ara` a `ritual_pit` | Implementar compatibilidad con ambos IDs |

---

## 8. Métricas y Validación

### Checklist de Implementación

#### Código
- [ ] `src/types/index.ts` - Enum actualizado a `PIT`
- [ ] `types.ts` (legacy) - Enum actualizado a `PIT`
- [ ] `src/constants/data.ts` - Ritual renombrado con nuevos pasos
- [ ] `constants.tsx` (legacy) - Ritual renombrado con nuevos pasos
- [ ] `src/constants/theme.ts` - Colores `pit-primary/secondary`
- [ ] `index.html` - Tailwind config con colores `pit-*`
- [ ] `src/App.tsx` - Referencias actualizadas
- [ ] `src/views/DashboardView.tsx` - Referencias actualizadas
- [ ] `src/views/AdminView.tsx` - Variables `pitCompletions`
- [ ] `src/views/PlansView.tsx` - Textos actualizados
- [ ] `src/views/LandingView.tsx` - Textos actualizados

#### Assets
- [ ] Carpeta renombrada: `public/assets/audio/rituals/pit/`
- [ ] Archivos de audio renombrados o paths actualizados
- [ ] Iconos/imágenes específicas del ritual (si existen)

#### Documentación
- [ ] `README.md` - Todas las menciones actualizadas
- [ ] `Directivas/requerimientos.md` - Concepto actualizado
- [ ] `Directivas/directiva_modos_ritual.md` - Ejemplos con P.I.T.
- [ ] `Directivas/Directiva_identidad_visual.md` - Colores P.I.T.
- [ ] `Directivas/directiva-mvp-hibrido-fase1.md` - Referencias actualizadas
- [ ] `plan_rituales.md` - Estructura de carpetas actualizada

#### Testing
- [ ] `npm run build` - Build exitoso sin errores
- [ ] Ritual P.I.T. se muestra correctamente en Dashboard
- [ ] Audios cargan correctamente en modo asistido
- [ ] Colores se aplican correctamente (botones, cards)
- [ ] Estadísticas muestran completados de P.I.T.
- [ ] LocalStorage guarda correctamente con nuevo ID

### Criterios de Éxito
1. ✅ Cero referencias a "A.R.A." o "ARA" en código y documentación
2. ✅ Build de producción exitoso
3. ✅ Ritual funciona igual que antes, solo con nuevo nombre
4. ✅ Audios cargan sin errores 404
5. ✅ Identidad visual consistente con nuevos colores

---

## 9. Bitácora de Aprendizaje

### Versión 1.0 - Febrero 2026

**Decisión**: Cambio de nombre de A.R.A. a P.I.T.

**Razón**: 
- El nombre "A.R.A." (Activación, Revisión, Acción) no reflejaba adecuadamente la función del ritual como herramienta de rescate
- "P.I.T." (Pausa · Intención · Tracción) comunica mejor el proceso:
  - **Pausa**: Romper el patrón negativo
  - **Intención**: Redefinir el enfoque
  - **Tracción**: Primer paso sin fricción
- Mejora la claridad conceptual para los usuarios

**Impacto**:
- Actualización masiva de código y documentación
- Renombrado de assets (carpetas de audio)
- Actualización de identidad visual (colores)
- Mejora en la comprensión del propósito del ritual

**Lecciones Aprendidas**:
1. Mantener archivos legacy sincronizados durante la transición
2. Usar grep para encontrar todas las referencias antes de cambiar
3. Actualizar documentación en paralelo con código
4. Considerar compatibilidad con datos existentes en LocalStorage

### Casos Reales

| Fecha | Qué pasó | Por qué | Solución |
|-------|----------|---------|----------|
| Feb 2026 | Cambio de nombre A.R.A. → P.I.T. | Mejor claridad conceptual | Actualización sistemática de todo el proyecto |

---

## 10. Integración con Otras Directivas

### Directiva de Identidad Visual
- Actualizar sección de colores de acento para P.I.T.
- Mantener el rojo coral (#FF6B6B) como color primario
- Actualizar ejemplos de uso en componentes

### Directiva de Modos de Ritual
- Los modos manual/asistido se mantienen igual
- Actualizar ejemplos que usen A.R.A. por P.I.T.
- Verificar que la lógica de audio funcione con nuevos paths

### Directiva MVP Híbrido
- Actualizar referencias en la arquitectura
- Verificar que el service worker cachee la nueva carpeta `pit/`
- Actualizar ejemplos de uso

### Requerimientos
- Actualizar flujos de usuario que mencionen A.R.A.
- Actualizar descripción del ritual de rescate
- Mantener la duración de 3-5 minutos

---

## 11. Comandos de Ejecución

### Búsqueda de Referencias
```bash
# Buscar todas las referencias a A.R.A. en código
grep -r "ARA\|A\.R\.A\." --include="*.ts" --include="*.tsx" .

# Buscar en documentación
grep -r "ARA\|A\.R\.A\." --include="*.md" .

# Buscar en configuración
grep -r "ara" --include="*.html" --include="*.json" .
```

### Renombrado de Assets
```bash
# Windows PowerShell
Move-Item -Path "public\assets\audio\rituals\ara" -Destination "public\assets\audio\rituals\pit"

# Linux/Mac
mv public/assets/audio/rituals/ara public/assets/audio/rituals/pit
```

### Validación
```bash
# Build de producción
npm run build

# Verificar que no hay referencias a ARA
grep -r "RitualType\.ARA" src/
```

---

## 12. Conclusión

Este cambio de nomenclatura mejora significativamente la claridad conceptual del ritual de rescate. **P.I.T.** (Pausa · Intención · Tracción) comunica de manera más efectiva el proceso de romper patrones negativos y retomar el control, alineándose mejor con la filosofía de "La Llave de tu Potencial".

La implementación debe ser sistemática y completa, asegurando que no queden referencias al nombre anterior en ninguna parte del proyecto. La compatibilidad con datos existentes en LocalStorage debe mantenerse para no afectar a usuarios que ya hayan usado la aplicación.

**Próximos pasos después de la implementación**:
1. Validar con usuarios piloto que el nuevo nombre es más claro
2. Considerar actualizar los audios con la nueva narrativa
3. Evaluar si los pasos del ritual necesitan ajustes adicionales
4. Documentar feedback de usuarios sobre el cambio
