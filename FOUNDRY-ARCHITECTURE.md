# FOUNDRY - Multi-Project Architecture

## Overview

Foundry supports multiple **organizations** and **projects**, allowing different teams to maintain separate expert configurations while sharing a common MCP infrastructure.

---

## Hierarchy

```
┌─────────────────────────────────────────────────────────────┐
│                      ORGANIZATION                            │
│  (Company, Team, or Individual)                             │
│  • Owned by account (Cloudflare account)                   │
│  • Contains multiple projects                               │
│  • Has billing/settings                                    │
└─────────────────────┬───────────────────────────────────────┘
                      │
          ┌───────────┴───────────┐
          ▼                       ▼
┌─────────────────┐       ┌─────────────────┐
│    PROJECT A    │       │    PROJECT B    │
│   (Web App)     │       │   (Mobile App)  │
│                 │       │                 │
│  • Experts      │       │  • Experts      │
│  • Workflows    │       │  • Workflows    │
│  • Sessions     │       │  • Sessions     │
└─────────────────┘       └─────────────────┘
```

---

## Data Model

### Organization
```typescript
interface Organization {
  id: string;           // org_xxx
  name: string;         // "Acme Corp"
  slug: string;         // "acme" (URL-friendly)
  created_at: Date;
  updated_at: Date;
  settings: {
    default_model: string;
    timezone: string;
  };
}
```

### Project
```typescript
interface Project {
  id: string;           // prj_xxx
  org_id: string;       // FK to Organization
  name: string;         // "Website Redesign"
  slug: string;         // "website-redesign"
  description: string;
  created_at: Date;
  updated_at: Date;
  settings: {
    default_expert?: string;
    enable_collaboration: boolean;
  };
}
```

### Expert (Template)
```typescript
interface Expert {
  id: string;           // exp_xxx
  name: string;         // "Alan Turing"
  slug: string;         // "alan-turing"
  title: string;        // "Workers & Cloudflare Expert"
  philosophy: string;   // "Funciona si resuelve el problema"
  color: string;        // "#00D4FF"
  avatar_url?: string;
  
  // Knowledge sections
  personality: string; // Markdown
  expertise: string;   // Markdown  
  methodology: string; // Markdown
  
  // Capabilities
  tools: string[];     // ["read_file", "grep", "lsp_*"]
  focus_areas: string[];
  
  // Global vs Project-specific
  scope: "global" | "project";
}
```

### ProjectExpert (Project-specific config)
```typescript
interface ProjectExpert {
  id: string;
  project_id: string;
  expert_id: string;
  
  // Customization per project
  custom_prompts?: {
    activation?: string;
    greeting?: string;
  };
  
  // Enabled workflows for this project
  workflow_ids: string[];
  
  // Active status
  enabled: boolean;
  order: number;
}
```

### Workflow
```typescript
interface Workflow {
  id: string;           // wf_xxx
  expert_id: string;    // FK to Expert
  
  name: string;         // "Crear Worker"
  description: string;
  
  prompt_template: string; // With {input}, {context} placeholders
  
  input_type: "text" | "audit" | "code" | "file";
  output_type: "code" | "audit" | "brief" | "report";
  
  // Collaboration
  collaboration?: {
    accepts_from: string[];   // Expert IDs that can pass output
    input_format: string;
  };
  
  // Project-specific overrides
  project_id?: string;
}
```

### Session
```typescript
interface Session {
  id: string;           // ses_xxx
  project_id: string;
  expert_id: string;
  workflow_id?: string;
  
  // Context
  input: string;
  context?: string;
  
  // Execution
  status: "pending" | "running" | "completed" | "failed";
  started_at: Date;
  completed_at?: Date;
  
  // Output
  output?: string;
  output_type?: string;
  
  // Metadata
  mcp_client?: string;  // "goose", "opencode", etc.
}
```

---

## MCP Tools Structure

### Per-Project Tools

```json
{
  "tools": [
    {
      "name": "foundry_list_experts",
      "description": "List available experts for this project",
      "inputSchema": {
        "type": "object",
        "properties": {}
      }
    },
    {
      "name": "foundry_get_expert",
      "description": "Get expert details and configuration",
      "inputSchema": {
        "type": "object",
        "properties": {
          "expert_id": { "type": "string" }
        }
      }
    },
    {
      "name": "foundry_run_workflow",
      "description": "Execute a workflow with an expert",
      "inputSchema": {
        "type": "object",
        "properties": {
          "expert_id": { "type": "string" },
          "workflow_id": { "type": "string" },
          "input": { "type": "string" },
          "context": { "type": "string" }
        }
      }
    },
    {
      "name": "foundry_search_knowledge",
      "description": "Search expert knowledge base",
      "inputSchema": {
        "type": "object",
        "properties": {
          "query": { "type": "string" },
          "expert_id": { "type": "string" }
        }
      }
    },
    {
      "name": "foundry_list_sessions",
      "description": "List recent sessions",
      "inputSchema": {
        "type": "object",
        "properties": {
          "limit": { "type": "number", "default": 10 }
        }
      }
    }
  ]
}
```

---

## API Endpoints

### Organization
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/orgs` | List organizations |
| POST | `/api/orgs` | Create organization |
| GET | `/api/orgs/:id` | Get organization |
| PUT | `/api/orgs/:id` | Update organization |
| DELETE | `/api/orgs/:id` | Delete organization |

### Project
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/orgs/:org_id/projects` | List projects |
| POST | `/api/orgs/:org_id/projects` | Create project |
| GET | `/api/projects/:id` | Get project |
| PUT | `/api/projects/:id` | Update project |
| DELETE | `/api/projects/:id` | Delete project |

### Expert
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects/:id/experts` | List project experts |
| POST | `/api/projects/:id/experts` | Add expert to project |
| PUT | `/api/projects/:id/experts/:expert_id` | Update expert config |
| DELETE | `/api/projects/:id/experts/:expert_id` | Remove expert |

### Workflow
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/experts/:id/workflows` | List workflows |
| POST | `/api/experts/:id/workflows` | Create workflow |
| PUT | `/api/workflows/:id` | Update workflow |
| DELETE | `/api/workflows/:id` | Delete workflow |

### Sessions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects/:id/sessions` | List sessions |
| GET | `/api/sessions/:id` | Get session details |
| DELETE | `/api/sessions/:id` | Delete session |

---

## MCP Server Configuration

### Connection String

```
MCP_SERVER_URL=https://foundry.your-domain.com/mcp
MCP_PROJECT_KEY=prj_xxx
MCP_SERVER_TOKEN=sk_xxx
```

### Goose Configuration Example

```yaml
# goose config.yaml
mcp_servers:
  - id: foundry-prod
    type: http
    name: Foundry Production
    url: https://foundry.your-domain.com/mcp
    headers:
      Authorization: "Bearer sk_xxx"
      X-Project-Key: "prj_xxx"
```

---

## URL Structure (Pages/UI)

```
https://foundry.your-domain.com/
├── /login                      → Zero Trust Auth
├── /dashboard                  → Org selection
├── /org/:slug                  → Org overview
│   ├── /projects               → Project list
│   ├── /settings               → Org settings
│   └── /billing                → Billing
├── /org/:slug/project/:slug    → Project dashboard
│   ├── /experts               → Expert management
│   ├── /workflows             → Workflow builder
│   ├── /sessions              → Session history
│   └── /settings              → Project settings
├── /org/:slug/project/:slug/expert/:expert_slug  → Expert config
└── /org/:slug/project/:slug/session/:session_id  → Session detail
```

---

## Environment Variables

```env
# Required
CF_ACCOUNT_ID=xxx
CF_D1_DATABASE_ID=xxx
AI_GATEWAY_URL=xxx
AI_GATEWAY_API_KEY=xxx

# Optional
AUTH_DOMAIN=xxx
AUTH_CLIENT_ID=xxx
AUTH_CLIENT_SECRET=xxx

# Feature Flags
ENABLE_MCP_SAMPLING=true
ENABLE_MCP_APPS=false
ENABLE_COLLABORATION=true
```

---

## Migration Path (Current → Foundry)

| Current Concept | Foundry Equivalent |
|-----------------|-------------------|
| `.goosehints` file | Expert `personality` + `expertise` |
| `workflows/*.json` | `Workflow` records in D1 |
| `/audits/` folder | `Session` records with output |
| Hardcoded experts | Global `Expert` templates |
| Project-specific hints | `ProjectExpert` customization |
