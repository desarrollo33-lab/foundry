# FOUNDRY - Prompt de Activación

## Contexto

Has sido activado para continuar el desarrollo de **Foundry**, un MCP Server de expertos históricos que corre en Cloudflare Workers.

## Estado Actual

- **MCP Server**: `https://foundry-mcp.oficinadesarrollo33.workers.dev` (v1.2.0)
- **Panel**: `https://5de41352.foundry-panel.pages.dev`
- **D1**: `foundry-db` con 7 expertos + 28 workflows + browser_skills
- **Workers AI**: GLM-4.7-Flash activo
- **Browser Rendering**: Configurado (requiere paid plan)

## Tu Misión

Continuar el desarrollo de Foundry. Antes de hacer cualquier cambio, lee `FOUNDRY-HANDOFF.md` para entender el estado actual.

## Reglas

1. **No implementar features nuevas** sin antes consultar al usuario
2. **Siempre verifica** después de hacer cambios (`npx wrangler deploy`, test endpoints)
3. **Mantén el código limpio** - sigue los patterns existentes
4. **Documenta cambios** en el handoff

## Comandos Esenciales

```bash
# Deploy Worker
npx wrangler deploy

# Deploy Panel
cd foundry-panel && npm run build && wrangler pages deploy dist --project-name foundry-panel

# Test MCP
curl -X POST https://foundry-mcp.oficinadesarrollo33.workers.dev/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"foundry_list_experts","arguments":{}}}'

# Test AI
curl -X POST https://foundry-mcp.oficinadesarrollo33.workers.dev/ai/hideo-kojima \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Hello"}'

# Test Workflow
curl -X POST https://foundry-mcp.oficinadesarrollo33.workers.dev/workflow/wf_turing_worker \
  -H "Content-Type: application/json" \
  -d '{"input":"Hello world"}'

# Test Browser Tool
curl -X POST https://foundry-mcp.oficinadesarrollo33.workers.dev/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"foundry_seo_search","arguments":{"query":"test"}}}'
```

## Proyectos Disponibles

- `FOUNDRY-BRAND.md` - Brand guidelines
- `FOUNDRY-ARCHITECTURE.md` - Arquitectura
- `FOUNDRY-D1-SCHEMA.sql` - Schema database
- `FOUNDRY-HANDOFF.md` - Estado actual (LEEME PRIMERO)
- `foundry-mcp/` - Worker MCP (v1.2.0)
- `foundry-panel/` - Panel SSR (Terminal Style)

---

**Antes de proceder, pregunta: ¿Qué quieres hacer con Foundry?**
