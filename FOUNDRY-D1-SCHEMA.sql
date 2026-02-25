-- FOUNDRY D1 Schema
-- Run with: npx wrangler d1 execute foundry-db --local --file=schema.sql

-- =====================================================
-- ORGANIZATIONS
-- =====================================================
CREATE TABLE organizations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    settings TEXT DEFAULT '{}',
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_orgs_slug ON organizations(slug);

-- =====================================================
-- PROJECTS
-- =====================================================
CREATE TABLE projects (
    id TEXT PRIMARY KEY,
    org_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT DEFAULT '',
    settings TEXT DEFAULT '{}',
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    UNIQUE(org_id, slug)
);

CREATE INDEX idx_projects_org ON projects(org_id);
CREATE INDEX idx_projects_slug ON projects(slug);

-- =====================================================
-- EXPERTS (Global Templates)
-- =====================================================
CREATE TABLE experts (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    philosophy TEXT DEFAULT '',
    color TEXT DEFAULT '#8B8D94',
    avatar_url TEXT,
    
    -- Knowledge sections (markdown)
    personality TEXT DEFAULT '',
    expertise TEXT DEFAULT '',
    methodology TEXT DEFAULT '',
    
    -- Capabilities
    tools TEXT DEFAULT '[]',  -- JSON array
    focus_areas TEXT DEFAULT '[]',  -- JSON array
    
    -- Scope
    scope TEXT DEFAULT 'global',  -- 'global' or 'project'
    
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_experts_slug ON experts(slug);

-- =====================================================
-- PROJECT EXPERTS (Project-specific configuration)
-- =====================================================
CREATE TABLE project_experts (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    expert_id TEXT NOT NULL REFERENCES experts(id) ON DELETE CASCADE,
    
    -- Customization per project
    custom_prompts TEXT DEFAULT '{}',  -- JSON
    
    -- Enabled workflows
    workflow_ids TEXT DEFAULT '[]',  -- JSON array
    
    -- Status
    enabled INTEGER DEFAULT 1,
    sort_order INTEGER DEFAULT 0,
    
    UNIQUE(project_id, expert_id)
);

CREATE INDEX idx_proj_experts_project ON project_experts(project_id);

-- =====================================================
-- WORKFLOWS
-- =====================================================
CREATE TABLE workflows (
    id TEXT PRIMARY KEY,
    expert_id TEXT NOT NULL REFERENCES experts(id) ON DELETE CASCADE,
    project_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
    
    name TEXT NOT NULL,
    description TEXT DEFAULT '',
    prompt_template TEXT NOT NULL,
    
    input_type TEXT DEFAULT 'text',  -- 'text', 'audit', 'code', 'file'
    output_type TEXT DEFAULT 'code', -- 'code', 'audit', 'brief', 'report'
    
    -- Collaboration
    collaboration TEXT DEFAULT '{}',  -- JSON
    
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_workflows_expert ON workflows(expert_id);
CREATE INDEX idx_workflows_project ON workflows(project_id);

-- =====================================================
-- SESSIONS
-- =====================================================
CREATE TABLE sessions (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    expert_id TEXT NOT NULL REFERENCES experts(id) ON DELETE CASCADE,
    workflow_id TEXT REFERENCES workflows(id) ON DELETE SET NULL,
    
    -- Context
    input TEXT DEFAULT '',
    context TEXT DEFAULT '',
    
    -- Execution
    status TEXT DEFAULT 'pending',  -- 'pending', 'running', 'completed', 'failed'
    started_at TEXT DEFAULT (datetime('now')),
    completed_at TEXT,
    
    -- Output
    output TEXT DEFAULT '',
    output_type TEXT,
    
    -- Metadata
    mcp_client TEXT DEFAULT '',  -- 'goose', 'opencode', 'kilo', etc.
    metadata TEXT DEFAULT '{}'  -- JSON
    
);

CREATE INDEX idx_sessions_project ON sessions(project_id);
CREATE INDEX idx_sessions_expert ON sessions(expert_id);
CREATE INDEX idx_sessions_status ON sessions(status);

-- =====================================================
-- AUDIT LOGS (Optional - for tracking changes)
-- =====================================================
CREATE TABLE audit_logs (
    id TEXT PRIMARY KEY,
    project_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
    entity_type TEXT NOT NULL,  -- 'expert', 'workflow', 'session'
    entity_id TEXT NOT NULL,
    action TEXT NOT NULL,  -- 'create', 'update', 'delete'
    changes TEXT DEFAULT '{}',  -- JSON of changes
    actor TEXT DEFAULT 'system',
    created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_project ON audit_logs(project_id);

-- =====================================================
-- DEFAULT EXPERTS SEED DATA
-- =====================================================
INSERT INTO experts (id, name, slug, title, philosophy, color, focus_areas, scope) VALUES
    ('exp_turing', 'Alan Turing', 'alan-turing', 'Workers & Cloudflare Expert', 'Funciona si resuelve el problema', '#00D4FF', '["Workers", "D1/KV/R2", "Edge AI"]', 'global'),
    ('exp_kammler', 'Hans Kammler', 'hans-kammler', 'Astro & Auth Specialist', 'Resultados a cualquier costo', '#FFB800', '["Astro", "Auth", "Middleware"]', 'global'),
    ('exp_zhukov', 'Grigori Zhukov', 'grigori-zhukov', 'AI Workflows Strategist', 'Siempre tener plan B', '#DC2626', '["AI", "Queues", "GLM"]', 'global'),
    ('exp_bernays', 'Edward Bernays', 'edward-bernays', 'SEO & Strategy Master', 'Las historias venden mas que datos', '#E11D48', '["SEO", "Briefs", "Strategy"]', 'global'),
    ('exp_kojima', 'Hideo Kojima', 'hideo-kojima', 'Frontend Components Architect', 'Every object tells a story', '#EC4899', '["Zero JS", "UI", "Design"]', 'global'),
    ('exp_tarantino', 'Quentin Tarantino', 'quentin-tarantino', 'Telegram Mini Apps Director', 'Divide en CAPITULOS, no features', '#F97316', '["Telegram", "Mini Apps", "Leads"]', 'global'),
    ('exp_ogilvy', 'David Ogilvy', 'david-ogilvy', 'Copywriting Legend', 'El headline es 80% del exito', '#84CC16', '["Copy", "CTAs", "Headlines"]', 'global');

-- =====================================================
-- DEFAULT WORKFLOWS SEED (for Alan Turing as example)
-- =====================================================
INSERT INTO workflows (id, expert_id, name, description, prompt_template, input_type, output_type) VALUES
    ('wf_turing_worker', 'exp_turing', 'Crear Worker', 'Diseña Worker desde requirements', 'DISEÑA WORKER para: {input}\n\nIncluye: código TypeScript, tipos, manejo de errores, env bindings.', 'text', 'code'),
    ('wf_turing_audit', 'exp_turing', 'Auditoría API', 'Analiza endpoints de API', 'AUDITORÍA API de: {input}\n\nAnaliza: seguridad, performance, tipos, error handling.', 'text', 'audit'),
    ('wf_turing_d1', 'exp_turing', 'Integración D1/KV', 'Diseña integración con D1/KV/R2', 'DISEÑA INTEGRACIÓN para: {input}\n\nIncluye: schema, queries, bindings, tipos TypeScript.', 'text', 'code'),
    ('wf_turing_fix', 'exp_turing', 'Desde auditoría', 'Recibe auditoría y corrige', 'LEE ESTA AUDITORÍA Y CORRIGE EL WORKER:\n\n{input}\n\nGenera código corregido + explicación.', 'audit', 'code');

-- Add more workflows for other experts as needed...
