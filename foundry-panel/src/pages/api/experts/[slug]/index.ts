export const prerender = false;

const MCP_URL = 'https://foundry-mcp.oficinadesarrollo33.workers.dev/mcp';

async function callMCP(method: string, args: Record<string, unknown>) {
  const res = await fetch(MCP_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: Math.floor(Math.random() * 10000),
      method: 'tools/call',
      params: { name: method, arguments: args }
    })
  });
  const data = await res.json();
  if (data?.result?.content) {
    return JSON.parse(data.result.content[0].text);
  }
  return { results: [], error: data };
}

export async function GET({ params, request }) {
  const { slug } = params;
  const accept = request.headers.get('Accept') || '';
  const prefersMarkdown = accept.includes('text/markdown');

  const expert = await callMCP('foundry_get_expert', { expert_id: slug });

  if (!expert || expert.error) {
    return new Response(`Error: Expert not found: ${slug}`, { status: 404 });
  }

  if (prefersMarkdown) {
    const md = formatExpertMarkdown(expert);
    return new Response(md, {
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
        'Vary': 'Accept'
      }
    });
  }

  return new Response(JSON.stringify(expert, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}

function formatExpertMarkdown(e: any): string {
  const focusAreas = typeof e.focus_areas === 'string' 
    ? JSON.parse(e.focus_areas || '[]') 
    : (e.focus_areas || []);
  const tools = typeof e.tools === 'string' 
    ? JSON.parse(e.tools || '[]') 
    : (e.tools || []);
  
  const focus = focusAreas.join(', ');
  
  const lines = [
    '---',
    `title: ${e.name} - Expert`,
    `description: ${e.title} - ${e.philosophy}`,
    `focus: ${focus}`,
    `philosophy: ${e.philosophy}`,
    '---',
    '',
    `# ${e.name}`,
    '',
    `> **${e.title}**`,
    '',
    `*Philosophy: "${e.philosophy}"*`,
    '',
    '---',
    '',
    '## Focus Areas',
    '',
    focus,
    '',
    '---',
    ''
  ];

  if (e.personality) {
    lines.push('## Personalidad', '');
    lines.push(e.personality);
    lines.push('');
  }

  if (e.expertise) {
    lines.push('---', '');
    lines.push('## Expertise', '');
    lines.push(e.expertise);
    lines.push('');
  }

  if (e.methodology) {
    lines.push('---', '');
    lines.push('## Metodología', '');
    lines.push(e.methodology);
    lines.push('');
  }

  if (tools && tools.length > 0) {
    lines.push('---', '');
    lines.push('## Herramientas', '');
    for (const tool of tools) {
      lines.push(`- ${tool}`);
    }
    lines.push('');
  }

  lines.push('---', '');
  lines.push('## Workflows', '');
  lines.push(`Disponible en: [/api/experts/${e.slug}/workflows](/api/experts/${e.slug}/workflows)`);
  lines.push('');

  lines.push('---', '');
  lines.push('## Uso', '');
  lines.push('```bash');
  lines.push(`curl -H "Accept: text/markdown" \\`);
  lines.push(`  https://foundry-panel.pages.dev/api/experts/${e.slug}`);
  lines.push('');
  lines.push('# Obtener en JSON');
  lines.push(`curl https://foundry-panel.pages.dev/api/experts/${e.slug}`);
  lines.push('```');
  lines.push('');

  return lines.join('\n');
}
