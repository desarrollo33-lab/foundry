# PROJECT KNOWLEDGE BASE

**Generated:** 2026-02-26
**Commit:** 2eb7d4d
**Commit:** 1f15a0c
**Branch:** main

## OVERVIEW

Monorepo with 2 Cloudflare Workers projects: MCP backend (AI agent protocol) + Astro frontend panel for managing experts/workflows.

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
│   │   └── sync/      # GitHub sync
│   └── migrations/    # D1 SQL migrations
├── foundry-panel/     # Astro + Cloudflare Pages frontend
│   └── src/
│       ├── config.ts  # MCP_URL, fallback data
│       └── pages/    # .astro pages (index, guild, forge, void)
├── foundry-docs/      # Expert documentation
└── wrangler-pages.toml
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

## CONVENTIONS

- **Cloudflare Workers**: Use `compatibility_flags = ["nodejs_compat"]` in wrangler.toml
- **Astro SSR**: Output mode `server`, adapter `@astrojs/cloudflare`
- **TypeScript**: Standard strict mode
- **Routes**: Pattern matching with regex (`path.match(/^\/ai\/([a-z0-9-]+)$/)`)

## ANTI-PATTERNS (THIS PROJECT)

- NO `as any` type suppression
- NO `@ts-ignore` / `@ts-expect-error`
- NO empty catch blocks
- NO TODO/DEPRECATED markers (clean codebase)

## COMMANDS

```bash
# Deploy MCP worker
cd foundry-mcp && npx wrangler deploy

# Build + deploy panel
cd foundry-panel && npm run build && npx wrangler pages deploy dist

# Apply D1 migrations
npx wrangler d1 execute foundry-db --file=migrations/v1_add_stocks_and_mcp.sql --remote
```

## NOTES
- MCP worker: `foundry-mcp.oficinadesarrollo33.workers.dev`
- Panel: `*.foundry-panel.pages.dev`
- Database: D1 `foundry-db` (c884943b-97df-403b-8fb8-184c94052a59)
- Images served from R2 via `/images/:slug.jpg` endpoint
- MCP worker: `foundry-mcp.oficinadesarrollo33.workers.dev`
- Panel: `*.foundry-panel.pages.dev`
- Database: D1 `foundry-db` (c884943b-97df-403b-8fb8-184c94052a59)
