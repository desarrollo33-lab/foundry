# STUDIO_HANDOFF.md - Updated 2026-02-27

## 🎯 Requirement: MoltWorker + Cloudflare SDK for /studio

**User Requirement (IRREVERSIBLE)**:
- Use MoltWorker architecture pattern
- 100% Cloudflare infrastructure
- Editor and viewer for ZeroJS components ONLY
- No Java, No TypeScript execution
- Only ZeroJS component code

---

## ✅ IMPLEMENTATION COMPLETE - 2026-02-27

### What's Done:

| Component | Status | Notes |
|-----------|--------|-------|
| `/studio/execute` endpoint | ✅ DONE | Uses Cloudflare Sandbox SDK |
| Container deployment | ✅ DONE | `cloudflare/sandbox:0.7.0` |
| Worker deployment | ✅ DONE | `foundry-mcp.oficinadesarrollo33.workers.dev` |
| Code execution | ✅ DONE | JavaScript execution working |

### Working Endpoint:

```bash
curl -X POST https://foundry-mcp.oficinadesarrollo33.workers.dev/studio/execute \
  -H "Content-Type: application/json" \
  -d '{"code":"console.log(\"Hello!\")"}'
```

Response:
```json
{
  "success": true,
  "output": "Hello!",
  "stdout": ["Hello!\n"],
  "stderr": [],
  "exitCode": 0,
  "executionTimeMs": 3500
}
```

---

## Architecture: MoltWorker Pattern

```
┌─────────────────────────────────────────────────────────────────────┐
│                    MoltWorker Architecture                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────┐     ┌──────────────────┐     ┌────────────────┐  │
│  │   Client    │────►│  Cloudflare      │────►│   Sandbox       │  │
│  │  (Browser)  │     │  Worker          │     │  Container      │  │
│  │             │     │  (Proxy + Logic) │     │  (Node.js)      │  │
│  │             │◄────│                  │◄────│                 │  │
│  └─────────────┘     └──────────────────┘     └────────────────┘  │
│                              │                      │               │
│                              ▼                      │               │
│                     ┌──────────────────┐            │               │
│                     │  Durable Object │◄────────────┘               │
│                     │  (State + Life)  │                             │
│                     └──────────────────┘                             │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Files Modified

### Backend (foundry-mcp)

```
foundry-mcp/
├── wrangler.toml              # ✅ Added Sandbox container + DO binding
├── Dockerfile                 # ✅ Created with cloudflare/sandbox:0.7.0
└── src/
    ├── index.ts              # ✅ Added Sandbox export, Env type updated
    └── handlers/
        ├── executor.ts       # ✅ Implemented executeCode with Sandbox SDK
        └── sandbox.ts         # ✅ Implemented executeWithSandbox using runCode API
```

### Key Code Changes:

**wrangler.toml**:
```toml
[[containers]]
class_name = "Sandbox"
image = "./Dockerfile"

[[durable_objects.bindings]]
class_name = "Sandbox"
name = "Sandbox"

[[migrations]]
tag = "v1"
new_sqlite_classes = ["Sandbox"]
```

**executor.ts** (simplified):
```typescript
import { getSandbox } from "@cloudflare/sandbox";

export async function executeCode(request: ExecuteRequest, env) {
  const sandbox = getSandbox(env.Sandbox, sessionId);
  const result = await sandbox.runCode(code, {
    language: "javascript",
    timeout: 15000,
  });
  return formatResult(result);
}
```

---

## What's NOT Done (For Next Session)

### Phase 1 - Editor UI (STUDIO_PAGE)
- [ ] Monaco Editor component
- [ ] Component Selector dropdown
- [ ] Preview Panel
- [ ] Component List
- [ ] Connect frontend to `/studio/execute`

### Phase 2 - Full Integration
- [ ] `/studio/chat` endpoint with ClawBot
- [ ] `/api/v1/components/*` endpoints
- [ ] Component persistence in D1

### Phase 3 - Advanced
- [ ] WebSocket for real-time
- [ ] Persistent sandbox sessions
- [ ] Full OpenClaw integration

---

## Cloudflare Resources

| Resource | Value |
|----------|-------|
| Worker URL | `https://foundry-mcp.oficinadesarrollo33.workers.dev` |
| Container | `registry.cloudflare.com/b3a89fc9524552b7ab3202269f1ab6f3/foundry-mcp-sandbox:cc00b42f` |
| DO Namespace | `e296be1a7f4041629df3f20d6238502e` |
| D1 Database | `foundry-db` |

---

## To Deploy Again (Local Docker Required)

```bash
cd foundry-mcp
npx wrangler deploy
```

**Requirements**:
1. Docker running locally
2. Image `cloudflare/sandbox:0.7.0` available locally

---

## Testing the Endpoint

```bash
# Basic
curl -X POST https://foundry-mcp.oficinadesarrollo33.workers.dev/studio/execute \
  -H "Content-Type: application/json" \
  -d '{"code":"console.log(\"test\")"}'

# Math
curl -X POST https://foundry-mcp.oficinadesarrollo33.workers.dev/studio/execute \
  -H "Content-Type: application/json" \
  -d '{"code":"console.log(5 + 10)"}'

# Arrays
curl -X POST https://foundry-mcp.oficinadesarrollo33.workers.dev/studio/execute \
  -H "Content-Type: application/json" \
  -d '{"code":"console.log([1,2,3].map(x => x * 2))"}'
```

---

## Questions for Next Session

1. Should the frontend editor allow editing ZeroJS components?
2. Do you want to persist components to D1 database?
3. Which ZeroJS components should be prioritized in the UI?
4. Need to integrate `/studio/chat` for AI assistance?

---

## References

- Cloudflare Sandbox Docs: https://developers.cloudflare.com/sandbox/
- Code Interpreter Guide: https://developers.cloudflare.com/sandbox/guides/code-execution/
- MoltWorker Blog: https://blog.cloudflare.com/moltworker-self-hosted-ai-agent/
