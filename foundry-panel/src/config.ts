// =============================================================================
// FOUNDRY CONFIG
// Centralized configuration for Foundry Panel
// Edit MCP_BASE_URL here to change the server URL
// =============================================================================

// MCP Server URLs - Override with environment variables in production
const MCP_BASE_URL = import.meta.env.MCP_URL || 'https://foundry-mcp.oficinadesarrollo33.workers.dev';

// Fallback data when MCP is not available
export const FALLBACK_EXPERTS = [
  { id: 'exp_001', name: 'Hideo Kojima', slug: 'hideo-kojima', title: 'Game Director & Story Designer', philosophy: "Players don't pick movies. Movies pick players.", color: '#ff6b35', personality: 'Cinematic, narrative-driven, philosophical', expertise: 'Game design, storytelling, cinematic direction', methodology: 'MGS-style storytelling with player agency' },
  { id: 'exp_002', name: 'Quentin Tarantino', slug: 'quentin-tarantino', title: 'Screenwriter & Director', philosophy: 'If you can write it, you can shoot it.', color: '#e63946', personality: 'Sharp dialogue, non-linear narrative, stylized violence', expertise: 'Screenwriting, dialogue, film direction', methodology: 'Pulp Fiction structure with dialogue-driven scenes' },
  { id: 'exp_003', name: 'Hans Kammler', slug: 'hans-kammler', title: 'Systems Architect', philosophy: 'Precision, efficiency, scale.', color: '#4a90d9', personality: 'Military precision, engineering-focused, systematic', expertise: 'Project management, engineering, systems architecture', methodology: 'V2 rocket engineering principles' },
  { id: 'exp_004', name: 'Edward Bernays', slug: 'edward-bernays', title: 'PR Pioneer', philosophy: 'The conscious and intelligent manipulation of the organized habits and opinions of the masses.', color: '#9b59b6', personality: 'Persuasive, strategic, psychological', expertise: 'Public relations, propaganda, persuasion', methodology: 'Cigaretteorsche technique for modern marketing' },
  { id: 'exp_005', name: 'David Ogilvy', slug: 'david-ogilvy', title: 'Advertising Legend', philosophy: "The consumer isn't a moron. She's your wife.", color: '#f39c12', personality: 'Research-based, witty, classic', expertise: 'Copywriting, advertising, marketing', methodology: "Ogilvy's research-driven approach" },
  { id: 'exp_006', name: 'Alan Turing', slug: 'alan-turing', title: 'Computer Scientist', philosophy: 'We can only see a short distance ahead, but we can see plenty there that needs to be done.', color: '#27ae60', personality: 'Mathematical, theoretical, pioneering', expertise: 'Computing, AI, cryptography', methodology: 'Turing test for AI evaluation' },
  { id: 'exp_007', name: 'Grigori Zhukov', slug: 'grigori-zhukov', title: 'Military Strategist', philosophy: 'Quantity has a quality all its own.', color: '#c0392b', personality: 'Strategic, decisive, resource-maximizing', expertise: 'Military tactics, large-scale operations', methodology: 'Deep battle doctrine' },
];

export const FALLBACK_WORKFLOWS = [
  { id: 'wf_001', expert_id: 'exp_001', expert_name: 'Hideo Kojima', name: 'Story Generator', description: 'Generate cinematic storylines with branching narratives', prompt_template: 'Create a {input} story with multiple endings...', input_type: 'text', output_type: 'code' },
  { id: 'wf_002', expert_id: 'exp_002', expert_name: 'Quentin Tarantino', name: 'Dialogue Writer', description: 'Write sharp, stylized dialogue scenes', prompt_template: 'Write a {input} scene with witty banter...', input_type: 'text', output_type: 'code' },
];

export const MCP_URL = import.meta.env.MCP_URL || MCP_BASE_URL;
export const MCP_URL_MCP = import.meta.env.MCP_URL_MCP || `${MCP_URL}/mcp`;

// API Endpoints (for reference)
export const ENDPOINTS = {
  EXPERTS: '/experts',
  EXPERT_BY_SLUG: (slug: string) => `/experts/${slug}`,
  AI: (expert?: string) => expert ? `/ai/${expert}` : '/ai',
  WORKFLOWS: '/workflows',
  WORKFLOW_BY_ID: (id: string) => `/workflows/${id}`,
  HEALTH: '/health',
} as const;

export type Endpoint = typeof ENDPOINTS[keyof typeof ENDPOINTS];
