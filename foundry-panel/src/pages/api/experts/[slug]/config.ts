---
// src/pages/api/experts/[slug]/config.ts
import type { APIRoute } from 'astro';

const MCP_URL = 'https://foundry-mcp.oficinadesarrollo33.workers.dev';

export const GET: APIRoute = async ({ params, props }) => {
  const { slug } = params;
  
  try {
    const res = await fetch(`${MCP_URL}/api/v1/experts/${slug}/config`);
    const data = await res.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export const PUT: APIRoute = async ({ params, request }) => {
  const { slug } = params;
  const body = await request.json();
  
  try {
    const res = await fetch(`${MCP_URL}/api/v1/experts/${slug}/config`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    return new Response(JSON.stringify(data), {
      status: res.status,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
