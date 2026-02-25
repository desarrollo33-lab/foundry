#MR|# FOUNDRY - Handoff de Sesión (v2)
#KM|
#BY|## 📋 Estado Actual del Proyecto
#RW|
#QS|### Recursos Desplegados en Cloudflare
#SY|
#QQ|| Recurso | URL/ID | Estado |
#SV||---------|--------|--------|
#TT|| **MCP Server** | `foundry-mcp.oficinadesarrollo33.workers.dev` | ✅ Online (v2.0.0) |
#MY|| **Panel SSR** | `5de41352.foundry-panel.pages.dev` | ✅ Online |
#VZ|| **D1 Database** | `foundry-db` | ✅ Schema v2 + 7 expertos |
#WR|| **R2 Bucket** | `foundry-docs` | ✅ Listo para ingest |
#NX|| **Vectorize Index** | `foundry-docs` | ✅ Listo para search |
#SN|| **Workers AI** | `@cf/zai-org/glm-4.7-flash` | ✅ Activo |
#BH|
#NM|## 🏷️ Tags System (NUEVO)
#SY|
#QT|El sistema de tags define cómo se clasifican y buscan documentos:
#YQ|
#QV|```
#RR|stack_tags:   [astro, cloudflare, workers, d1, kv, r2, queues, tailwind, telegram, ai]
#RQ|tipo_tags:    [auth, middleware, security, seo, components, ui, workflows, telegram, copy]
#QP|experto_tags: [turing, kammler, zhukov, bernays, kojima, tarantino, ogilvy]
#XZ|```
#YQ|
#KM|## 📄 Estructura de Títulos
#SY|
#QT|Los títulos siguen el formato: {tipo}/{stack}/{nombre}
#YQ|
#QT|Ejemplos:
#SY|- auth/cloudflare/pbkdf2-password-hashing
#QT|- workflows/telegram/lead-capture-flow
#QT|- seo/astro/local-business-schema
#QT|- components/astro/service-card
#XZ|
#NM|---

## 📋 Estado Actual del Proyecto

### Recursos Desplegados en Cloudflare

| Recurso | URL/ID | Estado |
|---------|--------|--------|
| **MCP Server** | `foundry-mcp.oficinadesarrollo33.workers.dev` | ✅ Online (v1.3.0) |
| **Panel SSR** | `5de41352.foundry-panel.pages.dev` | ✅ Online |
| **D1 Database** | `foundry-db` (c884943b-...) | ✅ 7 expertos + docs tables |
| **R2 Bucket** | `foundry-docs` | ✅ Creado y vacío |
| **Vectorize Index** | `foundry-docs` (768 dims, cosine) | ✅ Creado y vacío |
| **AI Gateway** | `foundry` (ID: foundry) | ✅ Configurado |
| **Workers AI** | `@cf/zai-org/glm-4.7-flash` | ✅ Activo |
| **Browser Rendering** | `BROWSER` binding | ✅ Configurado |

---

## 🏗️ Arquitectura Docs API

```
┌─────────────────────────────────────────────────────────────┐
│                    FOUNDRY MCP SERVER                       │
│  foundry-mcp.oficinadesarrollo33.workers.dev              │
│                                                              │
│  Endpoints de Docs:                                        │
│  - GET  /api/v1/experts/:slug/config    → GET/PUT config   │
│  - GET  /api/v1/experts/:slug/docs      → List docs       │
│  - GET  /api/v1/experts/:slug/search?q= → Semantic search │
│  - POST /api/v1/experts/:slug/chat     → Chat + retrieval │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                    D1 DATABASE                              │
│  Tablas:                                                   │
│  - experts (existing)                                      │
│  - docs (NEW - metadata de documentos)                   │
│  - expert_configs (NEW - configuración granular)         │
│  - chat_sessions (NEW - tracking de chats)                │
└────────────────────────────┬────────────────────────────────┘
                             │
              ┌──────────────┴──────────────┐
              ▼                              ▼
┌─────────────────────────┐    ┌─────────────────────────┐
│      R2 BUCKET         │    │     VECTORIZE           │
│   foundry-docs         │    │   foundry-docs          │
│   (markdown storage)   │    │   (embeddings search)   │
└─────────────────────────┘    └─────────────────────────┘
```

---

## 📁 Archivos del Proyecto

```
foundry-mcp/           # Worker MCP
├── src/
│   ├── index.ts       # Main handler + routes
│   ├── docs.ts        # Docs API implementation (NUEVO)
│   └── browser.ts     # Browser tools
├── package.json
└── wrangler.toml      # Config with R2, Vectorize bindings

foundry-docs/          # Documentación en repo (NUEVO)
├── experts/
│   └── exp_kojima/
│       ├── _config.json
│       └── docs/
│           ├── react-components.md
│           ├── animation-patterns.md
│           ├── tailwind-patterns.md
│           └── accessibility.md
└── scripts/
    └── sync-docs.ts   # Script para sync (no implementado)

FOUNDRY-DOCS-SCHEMA.sql  # Schema D1 (ya ejecutado)
```

---

## 🔧 Comandos Útiles

```bash
# Deploy Worker
cd foundry-mcp && npx wrangler deploy

# Deploy Panel
cd foundry-panel && npm run build && wrangler pages deploy dist --project-name foundry-panel

# Test API
curl https://foundry-mcp.oficinadesarrollo33.workers.dev/api/v1/experts/hideo-kojima/config

# Query D1
npx wrangler d1 execute foundry-db --remote --command "SELECT * FROM docs"
```

---

## ✅ Completado

- [x] Repo GitHub creado: https://github.com/desarrollo33-lab/foundry-mcp
- [x] R2 bucket `foundry-docs` creado
- [x] Vectorize index `foundry-docs` creado
- [x] Schema D1 ejecutado (docs, expert_configs, chat_sessions)
- [x] Worker desplegado con nuevos bindings
- [x] Endpoints API funcionales
- [x] Docs de Kojima creados en repo local

---

## 🔜 Pendiente

### Prioridad Alta

1. **Sync de docs a R2 + Vectorize**
   - Los docs de Kojima existen en `foundry-docs/experts/exp_kojima/docs/`
   - Necesitan subirse a R2
   - Generar embeddings → Vectorize
   - Insertar metadatos en D1

2. **Panel de Configuración**
   - Crear UI en Panel para editar config de expertos
   - Endpoint ya existe: `PUT /api/v1/experts/:slug/config`

### Prioridad Media

3. **Más docs para otros expertos**
   - Bernays (SEO)
   - Kammler (Astro)
   - Etc.

4. **GitHub Actions CI/CD**
   - Auto-sync cuando se hace push a `foundry-docs/`

---

## 📊 Expert Config Schema

```sql
CREATE TABLE expert_configs (
  expert_id TEXT PRIMARY KEY,
  
  -- AI
  ai_model TEXT DEFAULT '@cf/zai-org/glm-4.7-flash',
  ai_temperature REAL DEFAULT 0.7,
  ai_max_tokens INTEGER DEFAULT 4000,
  ai_system_prompt_override TEXT,
  
  -- Docs retrieval
  docs_enabled INTEGER DEFAULT 1,
  docs_max_retrieved INTEGER DEFAULT 5,
  docs_similarity_threshold REAL DEFAULT 0.6,
  docs_include_categories TEXT DEFAULT '[]',
  docs_exclude_tags TEXT DEFAULT '[]',
  docs_rerank_with_ai INTEGER DEFAULT 1,
  
  -- Browser tools
  browser_enabled INTEGER DEFAULT 0,
  browser_allowed_tools TEXT DEFAULT '[]',
  browser_max_steps INTEGER DEFAULT 10,
  browser_timeout_ms INTEGER DEFAULT 30000,
  
  -- Output
  output_format TEXT DEFAULT 'markdown',
  output_include_sources INTEGER DEFAULT 1,
  output_include_metadata INTEGER DEFAULT 0
);
```

---

## 🎯 Para Continuar

1. **Probar endpoints de docs**:
   ```bash
   curl https://foundry-mcp.oficinadesarrollo33.workers.dev/api/v1/experts/hideo-kojima/config
   ```

2. **Implementar sync script** en `foundry-docs/scripts/sync-docs.ts`

3. **Subir docs manualmente a R2**:
   ```bash
   npx wrangler r2 object put foundry-docs/docs/exp_kojima/react-components.md --file=foundry-docs/experts/exp_kojima/docs/react-components.md
   ```

4. **Insertar metadatos en D1**:
   ```sql
   INSERT INTO docs (id, expert_id, title, slug, category, r2_key)
   VALUES ('doc-001', 'exp_kojima', 'React Components', 'react-components', 'frontend', 'docs/exp_kojima/react-components.md');
   ```

5. **Generar embeddings** y upsert a Vectorize

---

## 📝 Notas

- **Cuenta Cloudflare**: oficinadesarrollo33@gmail.com
- **Account ID**: b3a89fc9524552b7ab3202269f1ab6f3
- **Repo GitHub**: https://github.com/desarrollo33-lab/foundry-mcp
- **Worker MCP**: foundry-mcp.oficinadesarrollo33.workers.dev
- **Panel**: 5de41352.foundry-panel.pages.dev
