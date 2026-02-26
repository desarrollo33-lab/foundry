#QJ|# AGENTS.md - foundry-panel
#KM|
#SJ|**Generated:** 2026-02-26
#RW|
#ZJ|## OVERVIEW
#SY|
#BX|Astro + Cloudflare Pages SSR frontend for managing AI experts and workflows.
#XW|
#HV|## STRUCTURE
#SK|
#ZX|```
#NK|foundry-panel/
#HV|├── src/
#ZK|│   ├── config.ts       # MCP_URL, FALLBACK_EXPERTS, ENDPOINTS
#JM|│   └── pages/
#BN|│       ├── index.astro # Horizon (dashboard)
#HT|│       ├── guild.astro # Expert list/management
#KT|│       ├── forge.astro # Workflow builder
#VS|│       └── void.astro  # Raw API playground
#QT|├── astro.config.mjs    # SSR adapter config
#NS|└── public/images/     # Expert avatars
#SQ|```
#NV|
#TP|## WHERE TO LOOK
#XW|
#BS|| Task | Location |
#MV||------|----------|
#MN|| Page routes | `src/pages/*.astro` (4 routes) |
#QR|| MCP config | `src/config.ts` (MCP_URL, FALLBACK_EXPERTS) |
#QT|| SSR adapter | `astro.config.mjs` (output: server) |
#QX|| Expert images | `public/images/{slug}.jpg` |
#JQ|
#ZV|## CONVENTIONS
#WV|
#SW|- **SSR**: `output: 'server'` with `@astrojs/cloudflare`
#HZ|- **Data fetching**: Server-side in frontmatter, fallback to FALLBACK_EXPERTS on error
#VX|- **Styling**: Embedded `<style>` blocks with CSS variables
#TV|- **Routing**: File-based (index, guild, forge, void)
#MS|
#YR|## ANTI-PATTERNS
#BH|
#TR|- No `.astro` components (all inline)
#VZ|- No external CSS frameworks
#XK|- No client-side JS (pure SSR)
#KT|
#KY|## COMMANDS
#VJ|
#BV|```bash
#ZQ|# Build + deploy
#VR|cd foundry-panel && npm run build && npx wrangler pages deploy dist
#SY|```
#KB|
#ZT|## NOTES
#KB|
#HZ|- No test infrastructure (no Vitest, @astrojs/testing, test directories)
#HZ|- No ESLint/Prettier config (TypeScript strict mode enforced)
