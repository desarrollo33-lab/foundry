# Plan de Limpieza: Eliminar Código Basura

## Objetivo
Limpiar el código identificado en la auditoría para mejorar calidad y mantener consistencia.

---

## Tareas de Limpieza

### 1. ✅ index.astro - Variables y Catch

**Problemas a corregir:**
- Línea 6: `let workflows: any[] = [];` - NO se usa (no se asigna el resultado del fetch)
- Líneas 13-14: Fetch a `/workflows` no asigna resultado
- Líneas 15-17: Catch vacío sin manejo para usuario

**Corrección:**
```typescript
// ANTES (líneas 5-17):
let experts: any[] = [];
let workflows: any[] = [];

try {
  const res = await fetch(`${MCP_URL}/experts`);
  const data = await res.json();
  experts = data.results || [];
  
  const wfRes = await fetch(`${MCP_URL}/workflows`);
  const wfData = await wfRes.json();
} catch (e) {
  console.error(e);
}

// DESPUÉS:
let experts: any[] = [];
let workflows: any[] = [];

try {
  const res = await fetch(`${MCP_URL}/experts`);
  const data = await res.json();
  experts = data.results || [];
  
  const wfRes = await fetch(`${MCP_URL}/workflows`);
  const wfData = await wfRes.json();
  workflows = wfData.results || [];
} catch (e) {
  console.error('Failed to fetch dashboard data:', e);
}
```

**También corregir stat hardcodeado:**
```html
<!-- ANTES (línea 182): -->
<div class="stat-value">0</div><div class="stat-label">PROJECTS</div>

<!-- DESPUÉS: -->
<div class="stat-value">-</div><div class="stat-label">PROJECTS</div>
```

---

### 2. ✅ guild.astro - Error de sintaxis HTML

**Problema:** Línea 172 - Falta cierre de tag

**Corrección:**
```astro
<!-- ANTES: -->
<input type="hidden" name="expert_id" value={expert.slug}/<button

<!-- DESPUÉS: -->
<input type="hidden" name="expert_id" value={expert.slug}><button
```

---

### 3. ✅ index.ts - Función truncada + Duplicación

**Problemas:**
- Línea 120: Función truncada (línea incompleta)
- Línea 80: `getResponseText()` duplicado en docs.ts

**Corrección - extraer función compartida:**
```typescript
// Crear archivo: src/shared/utils.ts

export function getResponseText(response: any): string {
  const respText = response.response || response;
  
  if (typeof respText === 'string') {
    try {
      const parsed = JSON.parse(respText);
      if (parsed.response) {
        try {
          const nested = typeof parsed.response === 'string' ? JSON.parse(parsed.response) : parsed.response;
          return nested.choices?.[0]?.message?.content || nested.content || respText;
        } catch {
          return parsed.choices?.[0]?.message?.content || parsed.content || respText;
        }
      }
      return parsed.choices?.[0]?.message?.content || parsed.content || respText;
    } catch {
      return respText;
    }
  }
  
  if (respText.choices) {
    return respText.choices[0]?.message?.content || respText.content || JSON.stringify(respText);
  }
  
  return respText.content || respText.result || JSON.stringify(response);
}

export function buildExpertSystemPrompt(expert: any): string {
  if (expert.base_prompt && expert.base_prompt.trim() !== "") {
    return expert.base_prompt;
  }
  
  let sp = `You are ${expert.name}, ${expert.title}.`;
  if (expert.philosophy) sp += `\n\nPhilosophy: "${expert.philosophy}"`;
  if (expert.personality) sp += `\n\n${expert.personality}`;
  if (expert.expertise) sp += `\n\nYour expertise:\n${expert.expertise}`;
  if (expert.methodology) sp += `\n\nYour methodology:\n${expert.methodology}`;
  
  return sp;
}
```

**Luego importar en index.ts y docs.ts:**
```typescript
import { getResponseText, buildExpertSystemPrompt } from './shared/utils';
```

---

### 4. ✅ void.astro - URL hardcodeada

**Problema:** Línea 136 - URL hardcodeada

**Corrección:**
```typescript
// En config.ts ya existe MCP_URL, usar eso
// void.astro - cambiar de:
<span class="deploy-val">foundry-mcp.oficinadesarrollo33.workers.dev</span>

// A:
<span class="deploy-val">{MCP_URL.replace('https://', '')}</span>
```

---

### 5. ✅ config.ts - URL default

**Problema:** URL hardcodeada como fallback

**Corrección:**
```typescript
// ANTES:
const MCP_BASE_URL = 'https://foundry-mcp.oficinadesarrollo33.workers.dev';

// DESPUÉS (usar solo env o requerir configuración):
const MCP_BASE_URL = import.meta.env.MCP_URL || 'https://foundry-mcp.YOUR_ACCOUNT.workers.dev';
// Nota: Forzar al usuario a configurar su propia URL
```

---

### 6. ✅ types.ts - Duplicación ExpertConfig

**Problema:** ExpertConfig definido en types.ts Y docs.ts

**Corrección:**
- Eliminar ExpertConfig de docs.ts
- Importar desde types.ts
- docs.ts línea 15-34 eliminar
- docs.ts línea 1 agregar: `import type { ExpertConfig } from './types';`

---

### 7. ✅ ingest.ts - Comentarios de debug

**Problema:** Línea 170 - console.log de debug

**Corrección:**
```typescript
// ANTES (línea 170):
console.log('Vectorize upsert successful for:', docId);

// DESPUÉS:
console.info('[Ingest] Document vectorized successfully', { docId });
```

---

## Resumen de Archivos a Modificar

| Archivo | Cambio |
|---------|--------|
| `foundry-panel/src/pages/index.astro` | Corregir workflows fetch + catch + stat |
| `foundry-panel/src/pages/guild.astro` | Corregir HTML tag |
| `foundry-mcp/src/index.ts` | Importar funciones compartidas |
| `foundry-mcp/src/docs.ts` | Importar funciones共享 + eliminar duplicados |
| `foundry-mcp/src/config.ts` | Mejorar URL default |
| `foundry-panel/src/pages/void.astro` | Usar variable dinámica |
| `foundry-mcp/src/ingest.ts` | Limpiar logs |
| `foundry-mcp/src/shared/utils.ts` | **NUEVO** - funciones compartidas |

---

## Ejecución Sugerida

Ejecutar con: `/start-work` o ejecutar manualmente las ediciones enumerateadas arriba.
