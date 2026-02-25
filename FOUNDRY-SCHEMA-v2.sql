-- FOUNDRY Enhanced Schema v2
-- Tags System: stack, tipo, experto, proyecto

-- =====================================================
-- PROJECTS
-- =====================================================
CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    org_id TEXT DEFAULT 'default',
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT DEFAULT '',
    
    -- Stack tags (JSON array)
    stack_tags TEXT DEFAULT '[]',
    
    -- Configuración del proyecto
    settings TEXT DEFAULT '{}',
    theme TEXT DEFAULT '{}',
    
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    UNIQUE(org_id, slug)
);

CREATE INDEX idx_projects_org ON projects(org_id);
CREATE INDEX idx_projects_slug ON projects(slug);

-- =====================================================
-- EXPERTS (Global Templates)
-- =====================================================
CREATE TABLE IF NOT EXISTS experts (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    philosophy TEXT DEFAULT '',
    color TEXT DEFAULT '#8B8D94',
    avatar_url TEXT,
    
    -- Knowledge sections (markdown) - base del experto
    personality TEXT DEFAULT '',
    expertise TEXT DEFAULT '',
    methodology TEXT DEFAULT '',
    
    -- Capabilities
    tools TEXT DEFAULT '[]',
    focus_areas TEXT DEFAULT '[]',
    
    -- Stack tags aplicables a este experto
    stack_tags TEXT DEFAULT '[]',
    tipo_tags TEXT DEFAULT '[]',
    
    scope TEXT DEFAULT 'global',
    
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_experts_slug ON experts(slug);

-- =====================================================
-- DOCS (Tagged Documents)
-- =====================================================
CREATE TABLE IF NOT EXISTS docs (
    id TEXT PRIMARY KEY,
    expert_id TEXT REFERENCES experts(id) ON DELETE SET NULL,
    project_id TEXT REFERENCES projects(id) ON DELETE SET NULL,
    
    -- Title structure: {tipo}/{stack}/{nombre}
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    
    -- Tags system (no nivel)
    stack_tags TEXT DEFAULT '[]',    -- ["astro", "cloudflare", "d1"]
    tipo_tags TEXT DEFAULT '[]',      -- ["auth", "middleware", "seo"]
    experto_tags TEXT DEFAULT '[]',   -- ["kammler", "tarantino"]
    
    -- Metadata
    difficulty TEXT DEFAULT 'intermediate',
    r2_key TEXT NOT NULL,
    content_hash TEXT,
    
    version TEXT DEFAULT '1.0.0',
    version_count INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    
    UNIQUE(expert_id, slug),
    UNIQUE(project_id, slug)
);

CREATE INDEX idx_docs_expert ON docs(expert_id);
CREATE INDEX idx_docs_project ON docs(project_id);
CREATE INDEX idx_docs_slug ON docs(slug);

-- =====================================================
-- EXPERT CONFIGS (Granular)
-- =====================================================
CREATE TABLE IF NOT EXISTS expert_configs (
    expert_id TEXT PRIMARY KEY REFERENCES experts(id) ON DELETE CASCADE,
    
    -- AI Configuration
    ai_model TEXT DEFAULT '@cf/zai-org/glm-4.7-flash',
    ai_temperature REAL DEFAULT 0.7,
    ai_max_tokens INTEGER DEFAULT 4000,
    ai_system_prompt_override TEXT,
    
    -- Document retrieval
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
    
    -- Output formatting
    output_format TEXT DEFAULT 'markdown',
    output_include_sources INTEGER DEFAULT 1,
    output_include_metadata INTEGER DEFAULT 0,
    
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- =====================================================
-- CHAT SESSIONS
-- =====================================================
CREATE TABLE IF NOT EXISTS chat_sessions (
    id TEXT PRIMARY KEY,
    expert_id TEXT NOT NULL REFERENCES experts(id) ON DELETE CASCADE,
    project_id TEXT REFERENCES projects(id) ON DELETE SET NULL,
    user_id TEXT,
    config_snapshot TEXT,
    messages_count INTEGER DEFAULT 0,
    tokens_used INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_sessions_expert ON chat_sessions(expert_id);
CREATE INDEX idx_sessions_project ON chat_sessions(project_id);
CREATE INDEX idx_sessions_user ON chat_sessions(user_id);

-- =====================================================
-- SEED: DEFAULT EXPERTS
-- =====================================================
INSERT OR IGNORE INTO experts (id, name, slug, title, philosophy, color, focus_areas, stack_tags, tipo_tags, scope) VALUES
    ('exp_turing', 'Alan Turing', 'alan-turing', 'Workers & Cloudflare Expert', 'Funciona si resuelve el problema', '#00D4FF', 
     '["Workers", "D1/KV/R2", "Edge AI"]', 
     '["workers", "cloudflare", "d1", "kv", "r2", "queues"]',
     '["audit", "api", "integration", "performance"]',
     'global'),
     
    ('exp_kammler', 'Hans Kammler', 'hans-kammler', 'Astro & Auth Specialist', 'Resultados a cualquier costo', '#FFB800', 
     '["Astro", "Auth", "Middleware"]',
     '["astro", "cloudflare", "d1", "kv", "middleware"]',
     '["auth", "middleware", "security", "audit"]',
     'global'),
     
    ('exp_zhukov', 'Grigori Zhukov', 'grigori-zhukov', 'AI Workflows Strategist', 'Siempre tener plan B', '#DC2626', 
     '["AI", "Queues", "GLM"]',
     '["workers", "ai", "queues", "workflows"]',
     '["workflows", "ai", "automation"]',
     'global'),
     
    ('exp_bernays', 'Edward Bernays', 'edward-bernays', 'SEO & Strategy Master', 'Las historias venden mas que datos', '#E11D48', 
     '["SEO", "Briefs", "Strategy"]',
     '["astro", "cloudflare", "seo"]',
     '["seo", "strategy", "briefs", "copy"]',
     'global'),
     
    ('exp_kojima', 'Hideo Kojima', 'hideo-kojima', 'Frontend Components Architect', 'Every object tells a story', '#EC4899', 
     '["Zero JS", "UI", "Design"]',
     '["astro", "tailwind", "components"]',
     '["components", "ui", "design", "accessibility"]',
     'global'),
     
    ('exp_tarantino', 'Quentin Tarantino', 'quentin-tarantino', 'Telegram Mini Apps Director', 'Divide en CAPITULOS, no features', '#F97316', 
     '["Telegram", "Mini Apps", "Leads"]',
     '["telegram", "workers", "astro"]',
     '["telegram", "mini-app", "leads", "ui"]',
     'global'),
     
    ('exp_ogilvy', 'David Ogilvy', 'david-ogilvy', 'Copywriting Legend', 'El headline es 80% del exito', '#84CC16', 
     '["Copy", "CTAs", "Headlines"]',
     '["astro", "copy"]',
     '["copy", "headlines", "cta", "messaging"]',
     'global');

-- =====================================================
-- SEED: ASTRO SECURITY PROJECT
-- =====================================================
INSERT OR IGNORE INTO projects (id, org_id, name, slug, description, stack_tags, settings) VALUES
    ('proj_astro_security', 'default', 'Astro Security', 'astro-security', 
     'Empresa de seguridad Chile - Instalación 24h, Monitoreo 24/7',
     '["astro", "cloudflare", "d1", "kv", "r2", "tailwind", "telegram"]',
     '{"theme": {"primary": "#FF4F00", "accent": "international-orange"}, "metas": ["seguridad-maxima", "zero-js"]}');

-- =====================================================
-- SEED: PROJECT-EXPERT ASSIGNMENTS
-- =====================================================
CREATE TABLE IF NOT EXISTS project_experts (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    expert_id TEXT NOT NULL REFERENCES experts(id) ON DELETE CASCADE,
    custom_prompts TEXT DEFAULT '{}',
    workflow_ids TEXT DEFAULT '[]',
    enabled INTEGER DEFAULT 1,
    sort_order INTEGER DEFAULT 0,
    UNIQUE(project_id, expert_id)
);

INSERT OR IGNORE INTO project_experts (id, project_id, expert_id, sort_order) VALUES
    ('pe_astro_kammler', 'proj_astro_security', 'exp_kammler', 1),
    ('pe_astro_tarantino', 'proj_astro_security', 'exp_tarantino', 2),
    ('pe_astro_bernays', 'proj_astro_security', 'exp_bernays', 3),
    ('pe_astro_zhukov', 'proj_astro_security', 'exp_zhukov', 4),
    ('pe_astro_kojima', 'proj_astro_security', 'exp_kojima', 5);
