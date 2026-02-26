// =============================================================================
// FOUNDRY CONFIG
// Centralized configuration for Foundry Panel
// Edit MCP_BASE_URL here to change the server URL
// =============================================================================

// MCP Server URLs - Override with environment variables in production
const MCP_BASE_URL = import.meta.env.MCP_URL || 'https://foundry-mcp.YOUR_ACCOUNT.workers.dev';

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
