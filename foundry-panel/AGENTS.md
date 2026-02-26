# AGENTS.md - foundry-panel

**Generated:** 2026-02-26

## OVERVIEW

Astro + Cloudflare Pages SSR frontend for managing AI experts and workflows.

## STRUCTURE

```
foundry-panel/
├── src/
│   ├── config.ts       # MCP_URL, FALLBACK_EXPERTS, ENDPOINTS
│   └── pages/
│       ├── index.astro # Horizon (dashboard)
│       ├── guild.astro # Expert list/management
│       ├── forge.astro # Workflow builder
│       └── void.astro  # Raw API playground
├── astro.config.mjs    # SSR adapter config
└── public/images/     # Expert avatars
```

## WHERE TO LOOK

| Task | Location |
|------|----------|
| Page routes | `src/pages/*.astro` (4 routes) |
| MCP config | `src/config.ts` (MCP_URL, FALLBACK_EXPERTS) |
| SSR adapter | `astro.config.mjs` (output: server) |
| Expert images | `public/images/{slug}.jpg` |

## CONVENTIONS

- **SSR**: `output: 'server'` with `@astrojs/cloudflare`
- **Data fetching**: Server-side in frontmatter, fallback to FALLBACK_EXPERTS on error
- **Styling**: Embedded `<style>` blocks with CSS variables
- **Routing**: File-based (index, guild, forge, void)

## ANTI-PATTERNS

- No `.astro` components (all inline)
- No external CSS frameworks
- No client-side JS (pure SSR)

## COMMANDS

```bash
# Build + deploy
cd foundry-panel && npm run build && npx wrangler pages deploy dist
```
