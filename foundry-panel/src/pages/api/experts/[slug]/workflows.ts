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

  const workflows = await callMCP('foundry_list_workflows', { expert_id: slug });

  if (workflows.error) {
    return new Response(`Error: ${workflows.error}`, { status: 404 });
  }

  if (prefersMarkdown) {
    const md = formatWorkflowsMarkdown(slug, workflows.results || []);
    return new Response(md, {
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
        'Vary': 'Accept'
      }
    });
  }

  return new Response(JSON.stringify(workflows.results || [], null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}

function formatWorkflowsMarkdown(expertSlug: string, workflows: any[]): string {
  const lines = [
    '---',
    `title: ${expertSlug} Workflows`,
    '---',
    '',
    `# Workflows for ${expertSlug}`,
    '',
  ];

  if (workflows.length === 0) {
    lines.push('*No workflows available for this expert.*');
    return lines.join('\n');
  }

  lines.push('## Available Workflows', '');
  lines.push('| ID | Name | Description | Input | Output |');
  lines.push('|----|------|-------------|-------|--------|');

  for (const w of workflows) {
    lines.push(`| ${w.id} | ${w.name} | ${w.description} | ${w.input_type} | ${w.output_type} |`);
  }

  lines.push('');
  lines.push('## Usage', '');
  lines.push('```bash');
  lines.push(`curl -H "Accept: text/markdown" \\`);
  lines.push(`  https://foundry-panel.pages.dev/api/experts/${expertSlug}/workflows`);
  lines.push('```');

  return lines.join('\n');
}
