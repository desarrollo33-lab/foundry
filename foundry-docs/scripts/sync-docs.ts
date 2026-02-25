/**
 * FOUNDRY Docs Sync Script
 * 
 * Sube la documentación de expertos a:
 * - R2 (almacenamiento de markdown)
 * - D1 (metadatos)
 * - Vectorize (embeddings para búsqueda semántica)
 * 
 * Uso: npx tsx scripts/sync-docs.ts
 */

import { readFile, readdir, stat } from 'fs/promises';
import { join, relative } from 'path';
import matter from 'gray-matter';
import { createClient } from '@cloudflare/workers-sdk';

interface DocMetadata {
  title: string;
  category?: string;
  tags?: string[];
  difficulty?: string;
  author?: string;
  last_updated?: string;
}

interface ExpertConfig {
  expert_id: string;
  name: string;
  version: string;
  [key: string]: unknown;
}

interface ProcessedDoc {
  slug: string;
  content: string;
  metadata: DocMetadata;
  expertId: string;
}

const DOCS_DIR = './foundry-docs/experts';
const R2_BUCKET = 'foundry-docs';

/**
 * Parse frontmatter de markdown
 */
function parseFrontmatter(content: string): { data: DocMetadata; content: string } {
  const { data, content: body } = matter(content);
  return { data, content: body };
}

/**
 * Generate slug from filename
 */
function toSlug(filename: string): string {
  return filename
    .replace(/\.md$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Lee todos los docs de un experto
 */
async function processExpertDocs(expertDir: string): Promise<ProcessedDoc[]> {
  const docsDir = join(expertDir, 'docs');
  const docs: ProcessedDoc[] = [];
  
  try {
    const files = await readdir(docsDir);
    const mdFiles = files.filter(f => f.endsWith('.md'));
    
    for (const file of mdFiles) {
      const content = await readFile(join(docsDir, file), 'utf-8');
      const { data, content: body } = parseFrontmatter(content);
      
      docs.push({
        slug: toSlug(file),
        content: body,
        metadata: data,
        expertId: '',
      });
    }
  } catch (e) {
    // No docs directory
  }
  
  return docs;
}

/**
 * Lee configuración de un experto
 */
async function loadExpertConfig(expertDir: string): Promise<ExpertConfig | null> {
  try {
    const configPath = join(expertDir, '_config.json');
    const content = await, 'utf- readFile(configPath8');
    return JSON.parse(content);
  } catch {
    return null;
  }
}

/**
 * Lee todos los expertos
 */
async function loadAllExperts(): Promise<Map<string, { config: ExpertConfig; docs: ProcessedDoc[] }>> {
  const experts = new Map();
  const expertDirs = await readdir(DOCS_DIR);
  
  for (const dir of expertDirs) {
    const expertDir = join(DOCS_DIR, dir);
    const stats = await stat(expertDir);
    
    if (stats.isDirectory()) {
      const config = await loadExpertConfig(expertDir);
      const docs = await processExpertDocs(expertDir);
      
      if (config) {
        // Assign expert_id to docs
        docs.forEach(doc => doc.expertId = config.expert_id);
        experts.set(config.expert_id, { config, docs });
      }
    }
  }
  
  return experts;
}

/**
 * Genera embedding para un texto
 */
async function generateEmbedding(text: string): Promise<number[]> {
  // This would call Workers AI in production
  // For now, return mock
  console.log(`Generating embedding for: ${text.slice(0, 50)}...`);
  return new Array(1536).fill(0).map(() => Math.random());
}

/**
 * Sube un documento a R2
 */
async function uploadToR2(key: string, content: string): Promise<void> {
  console.log(`📤 Uploading to R2: ${key}`);
  // In production: await env.DOCS_BUCKET.put(key, content);
}

/**
 * Inserta metadatos en D1
 */
async function insertToD1(doc: ProcessedDoc): Promise<void> {
  console.log(`💾 Inserting to D1: ${doc.slug}`);
  // In production:
  // await env.FOUNDRY_DB.prepare(`
  //   INSERT INTO docs (id, expert_id, title, slug, category, tags, difficulty, r2_key)
  //   VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  // `).bind(...)
}

/**
 * Inserta embedding en Vectorize
 */
async function insertToVectorize(doc: ProcessedDoc, embedding: number[]): Promise<void> {
  console.log(`🔢 Inserting to Vectorize: ${doc.slug}`);
  // In production:
  // await env.VECTORIZE.upsert([{ id: doc.slug, values: embedding, metadata: {...} }])
}

/**
 * Main sync function
 */
async function sync() {
  console.log('🚀 Starting Foundry Docs Sync\n');
  
  const experts = await loadAllExperts();
  
  console.log(`📁 Found ${experts.size} experts\n`);
  
  for (const [expertId, { config, docs }] of experts) {
    console.log(`\n📦 Processing: ${config.name} (${expertId})`);
    console.log(`   Docs: ${docs.length}`);
    
    for (const doc of docs) {
      const r2Key = `docs/${expertId}/${doc.slug}.md`;
      
      // 1. Upload to R2
      await uploadToR2(r2Key, doc.content);
      
      // 2. Generate embedding
      const embedding = await generateEmbedding(doc.content);
      
      // 3. Insert to Vectorize
      await insertToVectorize(doc, embedding);
      
      // 4. Insert metadata to D1
      await insertToD1({
        ...doc,
        expertId,
      });
    }
  }
  
  console.log('\n✅ Sync complete!');
}

// Run
sync().catch(console.error);
