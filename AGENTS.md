# PROJECT KNOWLEDGE BASE

**Generated:** 2026-02-26
**Commit:** 360471c
**Branch:** main

## OVERVIEW

Monorepo with 3 Cloudflare Workers projects: MCP backend (AI agent protocol) + Astro frontend panel + OpenClaw sandbox worker.

## STRUCTURE

```
./
├── foundry-mcp/        # Cloudflare Worker - MCP server
│   ├── src/
│   │   ├── index.ts   # Main entry, routes, handlers
│   │   ├── browser.ts # Browser automation tools
│   │   ├── docs.ts    # Expert docs management
│   │   ├── ingest.ts  # Document ingestion
│   │   ├── types.ts   # TypeScript types
│   │   ├── sync/      # GitHub sync
│   │   └── shared/    # Utilities
│   ├── migrations/    # D1 SQL migrations
│   └── tests/         # Bun test suite
├── foundry-panel/     # Astro + Cloudflare Pages frontend
│   ├── src/
│   │   ├── config.ts  # MCP_URL, fallback data
│   │   └── pages/     # .astro pages (index, guild, forge, void)
│   └── public/images/ # Expert avatars
├── foundry-moltworker/ # Cloudflare Sandbox + OpenClaw
│   ├── src/           # Hono worker + React admin UI
│   ├── Dockerfile     # Container image
│   └── wrangler.jsonc # Worker config
├── foundry-docs/       # Expert documentation storage
├── wrangler.toml      # Primary worker config (root)
└── wrangler-pages.toml # Cloudflare Pages config
```

## WHERE TO LOOK

| Task | Location |
|------|----------|
| MCP server routes | `foundry-mcp/src/index.ts` |
| Expert endpoints | `foundry-mcp/src/index.ts` (handleListExperts, handleAIRequest) |
| Browser tools | `foundry-mcp/src/browser.ts` |
| Panel config | `foundry-panel/src/config.ts` |
| Panel pages | `foundry-panel/src/pages/*.astro` |
| D1 migrations | `foundry-mcp/migrations/*.sql` |
| Tests (MCP) | `foundry-mcp/tests/` (Bun) |
| Moltworker entry | `foundry-moltworker/src/index.ts` (Hono) |
| Moltworker tests | `foundry-moltworker/src/**/*.test.ts` (Vitest) |

## CONVENTIONS

- **Cloudflare Workers**: Use `compatibility_flags` in wrangler.toml
- **Astro SSR**: Output mode `server`, adapter `@astrojs/cloudflare`
- **TypeScript**: Standard strict mode
- **Routes**: Pattern matching with regex (`path.match(/^\/pattern$/)`)
- **Path aliases** (panel): `@/*`, `@components/*`, `@layouts/*`, `@lib/*`, `@styles/*`
- **Testing**: foundry-mcp uses Bun, foundry-moltworker uses Vitest, foundry-panel has none
- **Monorepo**: No npm workspaces - independent package.json per project

## ANTI-PATTERNS (THIS PROJECT)

- NO `as any` type suppression
- NO `@ts-ignore` / `@ts-expect-error`
- NO empty catch blocks
- NO TODO/DEPRECATED markers (clean codebase)
- **Panel only**: NO external CSS frameworks, NO client-side JS (pure SSR)
- **Panel only**: NO `.astro` components (all inline)

## MONOREPO INCONSISTENCIES (RISKS)

| Feature | foundry-mcp | foundry-panel | foundry-moltworker |
|---------|-------------|---------------|-------------------|
| Test runner | Bun | **NONE** | Vitest |
| Linting | None | None | oxlint |
| Formatting | None | None | oxfmt |
| tsconfig.json | **MISSING** | Yes | Yes |

**Critical**: Duplicate wrangler.toml with incompatible flags:
- Root: `nodejs_compat_v2`
- foundry-mcp/: `nodejs_compat`
- Deploying from different directories produces different behavior

## COMMANDS

```bash
# Deploy MCP worker
cd foundry-mcp && npx wrangler deploy

# Build + deploy panel
cd foundry-panel && npm run build && npx wrangler pages deploy dist

# Run tests (foundry-mcp)
cd foundry-mcp && bun test

# Run tests (foundry-moltworker)
cd foundry-moltworker && npm test

# Apply D1 migrations
npx wrangler d1 execute foundry-db --file=migrations/v1_add_stocks_and_mcp.sql --remote
```

## NOTES

- MCP worker: `foundry-mcp.oficinadesarrollo33.workers.dev`
- Panel: `*.foundry-panel.pages.dev`
- Database: D1 `foundry-db` (c884943b-97df-403b-8fb8-184c94052a59)
- Images served from R2 via `/images/:slug.jpg` endpoint
- **Risk**: Duplicate wrangler.toml at root + foundry-mcp/ (incompatible compatibility_flags)
- **Risk**: No automated CI/CD for MCP/panel - all deployments manual
