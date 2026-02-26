# Fase 1: Estabilidad - Plan de Mejoras

## TL;DR

> **Objetivo**: Corregir bugs críticos que rompen la aplicación y limpiar códigobasura para establecer una base sólida.

> **Entregables**:
> - [x] Bug de `selectedExpert` en forge.astro corregido
> - [x] Bug de `stats` en void.astro corregido
> - [x] Archivos .wrangler eliminados del repositorio
> - [x] package.json raíz limpiado/eliminado
> - [x] Referencias API no usadas removidas de config.ts

> **Esfuerzo Estimado**: Short (2-3 horas)
> **Ejecución Paralela**: NO - tareas secuenciales con dependencias
> **Ruta Crítica**: Bug fixes → Limpieza → Verificación

---

## Contexto

### Problemas Identificados en Auditoría

| Bug | Archivo | Severity | Impacto |
|-----|---------|----------|---------|
| `selectedExpert` no definido | forge.astro | 🔴 CRÍTICO | Rompe filtrado de workflows |
| `stats` no definido | void.astro | 🔴 CRÍTICO | Error en dashboard de sistema |
| Archivos .wrangler en git | raíz | 🟡 MINOR | Código generado que no debería estar |
| package.json no funcional | raíz | 🟡 MINOR | Confusión y posible error |
| APIs no implementadas | config.ts | 🟡 MINOR | Referencias rotas |

---

## Objetivos de la Fase 1

### Must Have (No negociable)
1. ✅ Corregir bug de `selectedExpert` en forge.astro
2. ✅ Corregir bug de `stats` en void.astro
3. ✅ Eliminar .wrangler del repositorio
4. ✅ Limpiar package.json raíz

### Should Have (Importante)
5. 🔲 Remover referencias API no implementadas de config.ts
6. 🔲 Verificar que el servidor inicia correctamente

### Could Have (Nice to have)
7. ♻️ Eliminar duplicación entre admin.astro y guild.astro

---

## Estrategia de Verificación

> **VERIFICACIÓN AGENT-EXECUTED** — Sin intervención manual.

### Test de Integración
- [ ] `curl http://localhost:8787/forge?expert=hideo-kojima` → 200 OK
- [ ] `curl http://localhost:8787/void` → 200 OK (no error de undefined)
- [ ] Verificar que stats.experts y stats.workflows muestran valores correctos

### Build Verification
- [ ] `npm run build` en foundry-panel → sin errores
- [ ] `npx wrangler dev` → servidor inicia sin errores de TypeScript

---

## Plan de Ejecución

### Wave 1: Bug Fixes (Críticos)

#### Tarea 1: Corregir `selectedExpert` en forge.astro

**Qué hacer**:
- Agregar línea para obtener `selectedExpert` desde URL params
- El código actual usa `selectedExpert` pero nunca lo define
- Línea 7 debe agregar: `const selectedExpert = url.searchParams.get('expert');`

**Ubicación**: `foundry-panel/src/pages/forge.astro`, línea ~7

**QA Scenarios**:

```
Scenario: Filtrar workflows por experto desde URL
  Tool: Bash (curl)
  Preconditions: Servidor corriendo en localhost:8787
  Steps:
    1. curl "http://localhost:8787/forge?expert=hideo-kojima"
    2. Verificar que la respuesta es HTML válido (no error 500)
    3. Verificar que el filtro está activo (contiene "hideo-kojima" en clase)
  Expected Result: Página carga sin errores, filtro activo en UI
  Failure Indicators: "ReferenceError: selectedExpert is not defined"
  Evidence: .sisyphus/evidence/fase1-task1-filter-test.html

Scenario: Cargar todos los workflows sin filtro
  Tool: Bash (curl)
  Preconditions: Ninguna
  Steps:
    1. curl "http://localhost:8787/forge"
    2. Verificar que "[ALL]" tiene clase "active"
  Expected Result: Muestra todos los workflows
  Evidence: .sisyphus/evidence/fase1-task1-all-workflows.html
```

**Dependencias**: Ninguna
**Bloquea**: Ninguna

---

#### Tarea 2: Corregir `stats` en void.astro

**Qué hacer**:
- Agregar definición del objeto `stats` al inicio del código
- El código intenta acceder a `stats.experts` y `stats.workflows` pero `stats` no está definido
- Agregar después de línea 5: `let stats = { experts: 0, workflows: 0 };`

**Ubicación**: `foundry-panel/src/pages/void.astro`, línea ~5

**QA Scenarios**:

```
Scenario: Dashboard de sistema carga correctamente
  Tool: Bash (curl)
  Preconditions: Servidor corriendo
  Steps:
    1. curl "http://localhost:8787/void"
    2. Verificar que la página carga sin errores
    3. Buscar en HTML: "EXPERTS" y "WORKFLOWS" con valores numéricos
  Expected Result: Muestra estadísticas正确as (0 o más)
  Failure Indicators: "ReferenceError: stats is not defined"
  Evidence: .sisyphus/evidence/fase1-task2-void-dashboard.html
```

**Dependencias**: Ninguna
**Bloquea**: Ninguna

---

### Wave 2: Limpieza de Código

#### Tarea 3: Eliminar .wrangler del repositorio

**Qué hacer**:
- Eliminar carpeta `.wrangler/` del repositorio
- Esta carpeta contiene archivos generados automáticamente por `wrangler dev`
- Agregar `.wrangler/` a .gitignore si no existe

**QA Scenarios**:

```
Scenario: Verificar que .wrangler no está en git
  Tool: Bash
  Preconditions: En raíz del proyecto
  Steps:
    1. git status
    2. Verificar que .wrangler/ no aparece como untracked
  Expected Result: .wrangler/ no aparece en git status
  Evidence: .sisyphus/evidence/fase1-task3-git-status.txt
```

**Dependencias**: Tarea 1, Tarea 2
**Bloquea**: Ninguna

---

#### Tarea 4: Limpiar package.json raíz

**Qué hacer**:
- Eliminar o simplificar el package.json en la raíz
- Tiene scripts que no funcionan ("server-launcher.js" no existe)
- Opción A: Eliminar package.json de raíz
- Opción B: Dejar solo con {
  "name": "goose-hints",
  "private": true
}

**QA Scenarios**:

```
Scenario: package.json raíz no causa errores
  Tool: Bash
  Preconditions: Ninguna
  Steps:
    1. npm install en raíz (si existe package.json)
    2. Verificar que no hay errores
  Expected Result: Sin errores o archivo eliminado
  Evidence: .sisyphus/evidence/fase1-task4-npm-status.txt
```

**Dependencias**: Tarea 3
**Bloquea**: Ninguna

---

#### Tarea 5: Limpiar config.ts

**Qué hacer**:
- Remover referencias a endpoints que no existen:
  - `STOCKS: '/api/v1/stocks'`
  - `PROJECTS: '/api/v1/projects'`
  - `MCP_ENDPOINTS: '/api/v1/mcp'`
- Mantener solo los endpoints que realmente existen

**Ubicación**: `foundry-panel/src/config.ts`, líneas 14-24

**QA Scenarios**:

```
Scenario: Verificar config.ts tiene solo endpoints válidos
  Tool: Bash (grep)
  Preconditions: Ninguna
  Steps:
    1. grep -E "STOCKS|PROJECTS|MCP_ENDPOINTS" foundry-panel/src/config.ts
    2. Verificar que no encuentra resultados
  Expected Result: Sin matches
  Evidence: .sisyphus/evidence/fase1-task5-grep-config.txt
```

**Dependencias**: Tarea 4
**Bloquea**: Ninguna

---

### Wave 3: Verificación Final

#### Tarea 6: Build y verificación completa

**Qué hacer**:
- Ejecutar build del proyecto
- Verificar que no hay errores de TypeScript
- Verificar que el servidor inicia correctamente

**QA Scenarios**:

```
Scenario: Build completo sin errores
  Tool: Bash
  Preconditions: En directorio foundry-panel
  Steps:
    1. npm run build
    2. Verificar exit code 0
    3. Verificar que dist/ tiene archivos
  Expected Result: Build exitoso
  Evidence: .sisyphus/evidence/fase1-task6-build-output.txt

Scenario: Servidor inicia sin errores
  Tool: Bash
  Preconditions: Ninguna
  Steps:
    1. timeout 10 npx wrangler dev --port 8788 || true
    2. Verificar que no hay errores críticos en output
  Expected Result: Sin ReferenceError o SyntaxError
  Evidence: .sisyphus/evidence/fase1-task6-server-output.txt
```

**Dependencias**: Tareas 1, 2, 3, 4, 5
**Bloquea**: Ninguna

---

## Lista de Tareas

| # | Tarea | Dependencias | Status |
|---|-------|--------------|--------|
TK|| 1 | Corregir selectedExpert en forge.astro | - | ✅ |
HT|| 2 | Corregir stats en void.astro | - | ✅ |
MT|| 3 | Eliminar .wrangler del repositorio | 1, 2 | ✅ |
KZ|| 4 | Limpiar package.json raíz | 3 | ✅ |
TV|| 5 | Limpiar config.ts | 4 | ✅ |
BQ|| 6 | Build y verificación final | 1-5 | ✅ |

---

## Criterios de Éxito

### Verificación Obligatoria
- [ ] `forge.astro` carga sin error de `selectedExpert`
- [ ] `void.astro` carga sin error de `stats`
- [ ] `.wrangler/` no está en git
- [ ] Build completa sin errores
- [ ] Servidor inicia sin errores críticos

### Métricas de Calidad
- 0 errores de TypeScript
- 0 ReferenceErrors en runtime
- 0 archivos de configuración con referencias rotas
