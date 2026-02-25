# FOUNDRY - Handoff de Sesión

## 📋 Estado Actual del Proyecto

### Recursos Desplegados en Cloudflare

| Recurso | URL/ID | Estado |
|---------|--------|--------|
| **MCP Server** | `foundry-mcp.oficinadesarrollo33.workers.dev` | ✅ Online |
| **Panel SSR** | `5de41352.foundry-panel.pages.dev` | ✅ Online |
| **D1 Database** | `foundry-db` (c884943b-...) | ✅ 7 expertos + 28 workflows |
| **AI Gateway** | `foundry` (ID: foundry) | ✅ Configurado |
| **Workers AI** | `@cf/zai-org/glm-4.7-flash` | ✅ Activo |
| **Browser Rendering** | `BROWSER` binding | ✅ Configurado |

---

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                    FOUNDRY MCP SERVER                       │
│  foundry-mcp.oficinadesarrollo33.workers.dev              │
│                                                              │
│  Endpoints:                                                 │
│  - GET  /health          → Health check (v1.2.0)           │
│  - GET  /mcp            → Lista tools (24 tools)           │
│  - POST /mcp            → JSON-RPC MCP                     │
│  - POST /ai             → AI completions (Workers AI)       │
│  - POST /ai/:expert_slug → AI con personalidad dedicada     │
│  - POST /workflow/:id   → Ejecutar workflow                │
│  - GET  /experts        → CRUD expertos                     │
│  - POST /experts        → Crear experto                     │
│  - GET  /workflows      → List workflows                   │
│                                                              │
│  MCP Tools (24):                                           │
│  - foundry_list_experts                                    │
│  - foundry_get_expert                                      │
│  - foundry_list_workflows                                  │
│  - foundry_run_workflow                                    │
│  - foundry_ai_complete                                     │
│  - foundry_create_expert (CRUD)                            │
│  - foundry_update_expert (CRUD)                            │
│  - foundry_delete_expert (CRUD)                            │
│  - foundry_create_workflow (CRUD)                          │
│  - foundry_update_workflow (CRUD)                          │
│  - foundry_delete_workflow (CRUD)                          │
│  - foundry_list_sessions                                   │
│  - foundry_get_session                                     │
│  - foundry_seo_search          ← NEW (Bernays)              │
│  - foundry_preview_component       ← NEW (Kojima)          │
│  - foundry_preview_tma            ← NEW (Tarantino)        │
│  - foundry_browser_navigate                                │
│  - foundry_browser_screenshot                              │
│  - foundry_browser_extract                                │
│  └─────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    D1 DATABASE                              │
│  foundry-db                                                │
│                                                              │
│  Tablas:                                                   │
│  - organizations                                           │
│  - projects                                                │
│  - experts (7 + browser_skills column)                      │
│  - project_experts                                        │
│  - workflows (28 seed)                                    │
│  - sessions                                               │
│  - audit_logs                                             │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    PANEL SSR (Astro)                        │
│  5de41352.foundry-panel.pages.dev                         │
│                                                              │
│  Pages (Metal Gear / Terminal Style):                      │
│  - / (The Horizon) - Dashboard principal                  │
│  - /guild (The Guild) - Gestionar Experts                 │
│  - /forge (The Forge) - Gestionar Workflows               │
│  - /void (The Void) - System status & API reference        │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Archivos del Proyecto

```
goose-hints/
├── FOUNDRY-BRAND.md              ← Brand guidelines
├── FOUNDRY-ARCHITECTURE.md       ← Arquitectura multi-proyecto
├── FOUNDRY-D1-SCHEMA.sql         ← Schema D1
├── wrangler.toml                  ← Config Worker (v1.2.0)
├── update_experts.sql             ← Datos completos de expertos
├── add_workflows.sql              ← 28 workflows
├── add_browser_skills.sql         ← NEW: browser_skills column
├── update_browser_skills.sql      ← NEW: expert skills
├── foundry-mcp/
│   ├── package.json              ← @cloudflare/puppeteer added
│   └── src/
│       ├── index.ts              ← MCP Server v1.2.0
│       └── browser.ts            ← NEW: Browser Rendering tools
└── foundry-panel/
    ├── astro.config.mjs
    ├── package.json
    └── src/pages/
        ├── index.astro            ← The Horizon
        ├── guild.astro           ← The Guild
        ├── forge.astro           ← The Forge
        └── void.astro            ← The Void
```

---

## 🔧 Comandos Útiles

```bash
# Deploy Worker MCP
cd goose-hints && npx wrangler deploy

# Build + Deploy Panel
cd foundry-panel && npm run build && wrangler pages deploy dist --project-name foundry-panel

# D1 Queries
wrangler d1 execute foundry-db --remote --command "SELECT * FROM experts"

# Ver logs
wrangler tail

# Test AI endpoint
curl -X POST https://foundry-mcp.oficinadesarrollo33.workers.dev/ai/hideo-kojima \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Hello"}'

# Test workflow
curl -X POST https://foundry-mcp.oficinadesarrollo33.workers.dev/workflow/wf_turing_worker \
  -H "Content-Type: application/json" \
  -d '{"input":"Create a hello world"}'

# Test browser tool (requires paid plan)
curl -X POST https://foundry-mcp.oficinadesarrollo33.workers.dev/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"foundry_seo_search","arguments":{"query":"cloudflare workers"}}}'
```

---

## 📊 Expertos (7) + Browser Skills

| ID | Nombre | Title | Browser Skills |
|----|--------|-------|----------------|
| exp_turing | Alan Turing | Workers & Cloudflare Expert | - |
| exp_kammler | Hans Kammler | Astro & Auth Specialist | - |
| exp_zhukov | Grigori Zhukov | AI Workflows Strategist | - |
| exp_bernays | Edward Bernays | SEO & Strategy Master | search_google, extract_serp, analyze_competitor, scrape_content |
| exp_kojima | Hideo Kojima | Frontend Components Architect | preview_component, screenshot, extract_html, test_accessibility |
| exp_tarantino | Quentin Tarantino | Telegram Mini Apps Director | preview_tma, test_flow, debug_network, extract_elements |
| exp_ogilvy | David Ogilvy | Copywriting Legend | - |

---

## ✅ Checklist de Verificación

- [x] D1 creada y con schema
- [x] 7 expertos seed
- [x] Datos completos de expertos (personality, expertise, methodology)
- [x] 28 workflows seed
- [x] Worker MCP desplegado (v1.2.0)
- [x] Panel SSR desplegado (Terminal Style)
- [x] Workers AI configurado
- [x] GLM-4.7-Flash como default
- [x] AI Gateway creado
- [x] CRUD endpoints (/experts, /workflows)
- [x] Dedicated AI endpoints (/ai/:slug)
- [x] Dedicated workflow endpoint (/workflow/:id)
- [x] Browser Rendering binding configurado
- [x] Browser skills en D1 (columna browser_skills)
- [x] 6 Browser Tools implementados

---

## 🔜 Pendiente / Siguientes Pasos

### Prioridad Media
1. **BYOK** - Configurar AI Gateway con keys de Anthropic/Groq
2. **Zero Trust Access** - Proteger el panel

### Prioridad Baja
3. **Sandboxes** - Si se necesita ejecutar código arbitrario
4. **Docs Mode** - Docs interactivas con browser skills
5. **MCP Apps** - Integración más profunda con Goose/OpenCode

---

## 🔑 Variables de Entorno

```env
# No requiere vars adicionales - todo configurado via bindings
# D1, AI y Browser binding configurados en wrangler.toml
```

---

## 📝 Notas

- **Cuenta Cloudflare**: oficinadesarrollo33@gmail.com
- **Account ID**: b3a89fc9524552b7ab3202269f1ab6f3
- **AI Gateway**: https://gateway.ai.cloudflare.com/v1/b3a89fc9524552b7ab3202269f1ab6f3/foundry
- **Modelo default**: @cf/zai-org/glm-4.7-flash (131K contexto, tool calling)
- **Precio Workers AI**: $0.011/1K neurons, 10K gratis/día
- **Browser Rendering**: Requiere Workers Paid plan ($5+/mes)

---

## 🎨 Panel Design

- **Style**: Metal Gear / Terminal
- **Colors**: 
  - Background: #12151a
  - Cards: #1a1f26
  - Terminal Green: #4ade80
  - Text: #e2e8f0
  - Text Dim: #94a3b8
- **Fonts**: Share Tech Mono, JetBrains Mono
- **Effects**: CRT scanlines, blink animation
