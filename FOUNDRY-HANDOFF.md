# FOUNDRY - Handoff de Sesión v2

## 📋 Estado Actual

### Recursos Desplegados

| Recurso | URL/ID | Estado |
|---------|--------|--------|
| **MCP Server** | `foundry-mcp.oficinadesarrollo33.workers.dev` | ✅ Online (v2.0) |
| **Panel SSR** | `5de41352.foundry-panel.pages.dev` | ✅ Online |
| **D1 Database** | `foundry-db` | ✅ Schema v2 |
| **R2 Bucket** | `foundry-docs` | ✅ Listo para ingest |
| **Vectorize Index** | `foundry-docs` | ⚠️ Sin datos (modelo no disponible) |
| **Workers AI** | `@cf/zai-org/glm-4.7-flash` | ✅ Activo |

---

## 🏗️ Arquitectura v2

```
┌─────────────────────────────────────────────────────────────┐
│                    FOUNDRY MCP SERVER                       │
│  foundry-mcp.oficinadesarrollo33.workers.dev              │
│                                                              │
│  Endpoints Docs:                                            │
│  - GET  /api/v1/experts/:slug/config    → GET/PUT config │
│  - GET  /api/v1/experts/:slug/docs      → List docs      │
│  - GET  /api/v1/experts/:slug/search?q= → Search (LIKE)  │
│  - POST /api/v1/experts/:slug/chat     → Chat + retrieval│
│                                                              │
│  Endpoints Ingest:                                          │
│  - POST /api/v1/ingest             → Single doc          │
│  - POST /api/v1/ingest/bulk        → Bulk docs           │
└────────────────────────────┬────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    D1 DATABASE                              │
│  Tablas:                                                   │
│  - experts (7 seed)                                       │
│  - projects (1: astro-security)                          │
│  - docs (metadata)                                        │
│  - expert_configs (configuración granular)                │
│  - project_experts (asignaciones)                         │
│  - chat_sessions                                          │
└────────────────────────────┬────────────────────────────────┘
                           │
              ┌────────────┴────────────┐
              ▼                              ▼
┌─────────────────────────┐    ┌─────────────────────────┐
│      R2 BUCKET         │    │     VECTORIZE         │
│   foundry-docs         │    │   foundry-docs        │
│   (markdown storage)   │    │   (sin uso - fallback)│
└─────────────────────────┘    └─────────────────────────┘
```

---

## 🏷️ Tags System

```
stack_tags:   [astro, cloudflare, workers, d1, kv, r2, tailwind, telegram, ai]
tipo_tags:    [auth, middleware, security, seo, components, ui, workflows, copy]
experto_tags: [turing, kammler, zhukov, bernays, kojima, tarantino, ogilvy]
```

### Estructura de Títulos

```
{tipo}/{stack}/{nombre}

Ejemplos:
- auth/cloudflare/pbkdf2-password-hashing
- workflows/telegram/lead-capture-flow
- seo/astro/local-business-schema
- components/astro/service-card
```

---

## 📁 Archivos del Proyecto

```
foundry-mcp/
├── src/
│   ├── index.ts          # Main handler + routes (v2.0)
│   ├── docs.ts           # Docs API (search con LIKE fallback)
│   ├── ingest.ts         # Ingest pipeline + AI Tagger
│   └── browser.ts        # Browser tools
├── scripts/
│   └── astro-security-docs.ts  # Docs de ejemplo (no subidos)
├── wrangler.toml         # Config with R2, Vectorize
└── package.json

FOUNDRY-SCHEMA-v2.sql    # Schema D1 completo
FOUNDRY-HANDOFF.md       # Este archivo
```

---

## ✅ Completado

- [x] Schema D1 v2 con tablas completas
- [x] 7 expertos seedeados en D1
- [x] Proyecto astro-security configurado
- [x] Worker con endpoints de ingest
- [x] AI Tagger (clasifica contenido con tags)
- [x] Búsqueda por tags/LIKE (fallback cuando embedding no disponible)
- [x] Deploy a producción
- [x] Commit a GitHub

---

## 🔜 Pendiente

### Prioridad Alta

1. **Ejecutar schema en D1 remoto**
   ```bash
   npx wrangler d1 execute foundry-db --remote --file=FOUNDRY-SCHEMA-v2.sql
   ```

2. **Subir docs de ejemplo**
   - Usar el script `foundry-mcp/scripts/astro-security-docs.ts`
   - O hacer ingest manual de docs

3. **Habilitar embedding**
   - El modelo `@cf/baai/bge-base-en-v1.5` no está disponible
   - Alternativas: usar otro modelo de embedding o seguir con LIKE

### Prioridad Media

4. **Panel de Configuración**
   - UI para editar config de expertos
   - Endpoint ya existe: `PUT /api/v1/experts/:slug/config`

5. **Más docs para otros expertos**
   - Bernays (SEO)
   - Kammler (Astro)
   - Tarantino (Telegram)

---

## 🔧 Comandos Útiles

```bash
# Deploy Worker
cd foundry-mcp && npx wrangler deploy

# Test API
curl https://foundry-mcp.oficinadesarrollo33.workers.dev/api/v1/experts/hans-kammler/config
curl https://foundry-mcp.oficinadesarrollo33.workers.dev/api/v1/experts/hans-kammler/docs

# Ingest documento
curl -X POST https://foundry-mcp.oficinadesarrollo33.workers.dev/api/v1/ingest \
  -H "Content-Type: application/json" \
  -d '{"title": "auth/cloudflare/pbkdf2", "content": "...", "expert_id": "exp_kammler"}'

# Buscar
curl "https://foundry-mcp.oficinadesarrollo33.workers.dev/api/v1/experts/hans-kammler/search?q=password"

# Query D1
npx wrangler d1 execute foundry-db --remote --command "SELECT * FROM experts"
```

---

## 📊 Expertos Disponibles

| ID | Nombre | Área |
|----|--------|------|
| exp_turing | Alan Turing | Workers & Cloudflare |
| exp_kammler | Hans Kammler | Astro & Auth |
| exp_zhukov | Grigori Zhukov | AI Workflows |
| exp_bernays | Edward Bernays | SEO & Strategy |
| exp_kojima | Hideo Kojima | Frontend Components |
| exp_tarantino | Quentin Tarantino | Telegram Mini Apps |
| exp_ogilvy | David Ogilvy | Copywriting |

---

## 🎯 Para Continuar

1. **Ejecutar schema en remoto** (si no se ha hecho)
2. **Subir docs iniciales** para probar el sistema
3. **Probar búsqueda** con documentos reales
4. **Desarrollar Panel** para gestión de docs

---

## 📝 Notas

- **Cuenta Cloudflare**: oficinadesarrollo33@gmail.com
- **Account ID**: b3a89fc9524552b7ab3202269f1ab6f3
- **Repo GitHub**: https://github.com/desarrollo33-lab/foundry-mcp
- **Worker**: foundry-mcp.oficinadesarrollo33.workers.dev
- **Panel**: 5de41352.foundry-panel.pages.dev
