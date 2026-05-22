#!/usr/bin/env node
/**
 * ingest-curated.mjs
 * Ingests user-curated content into HYDRA pipeline (post-synthesis).
 * Input: JSON via stdin (or --file <path>)
 * Output: routing result + written feed/KB paths
 *
 * Bypasses fetch/score/LLM-extract phases — assumes synthesis is already done
 * (Claude does it in-conversation). Runs through routing + persistence only.
 *
 * Input JSON schema:
 * {
 *   "url": "https://...",            // required
 *   "title": "...",                  // required
 *   "author": "...",                 // optional
 *   "domains": ["ai-ml"],            // required (drives routing)
 *   "tier": "A",                     // optional, default: A
 *   "score": 4.0,                    // optional, default: 4.0
 *   "insights": ["...", "..."],      // required (key insights)
 *   "quotes": ["..."],               // optional (notable quotes)
 *   "tags": [],                      // optional (boost keywords)
 *   "entities": [],                  // optional
 *   "forceClones": ["architect"],    // optional — skip routing, force these clones
 *   "normalizedText": "...",         // optional — saved to originals/ for hallucination ref
 *   "publishedAt": "2026-05-15T..."  // optional, default: now
 * }
 *
 * Usage:
 *   echo '{...}' | node bin/ingest-curated.mjs
 *   node bin/ingest-curated.mjs --file curated.json
 *   node bin/ingest-curated.mjs --file dossier.jsonl  (one JSON per line)
 */

import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const HYDRA_ROOT = path.resolve(__dirname, '..');

import { routeToMindClones } from '../src/distribution/mind-clone-router.js';
import { writeKnowledgeFeed } from '../src/distribution/feed-writer.js';
import { writeToJarvisKB } from '../src/store/jarvis-writer.js';

function makeContentId(url, title) {
  const hash = createHash('sha256').update(`${url}|${title}`).digest('hex').slice(0, 12);
  return `curated-${hash}`;
}

function validateItem(item) {
  const errors = [];
  if (!item.url) errors.push('url required');
  if (!item.title) errors.push('title required');
  if (!Array.isArray(item.domains) || item.domains.length === 0) errors.push('domains[] required');
  if (!Array.isArray(item.insights) || item.insights.length === 0) errors.push('insights[] required');
  if (errors.length > 0) {
    throw new Error(`Validation failed: ${errors.join('; ')}`);
  }
}

/**
 * Process a single curated item end-to-end.
 */
async function processItem(item, options = {}) {
  validateItem(item);

  const contentId = item.contentId || makeContentId(item.url, item.title);
  const publishedAt = item.publishedAt || new Date().toISOString();
  const tier = item.tier || 'A';
  const score = item.score ?? (tier === 'S' ? 4.7 : tier === 'A' ? 4.0 : tier === 'B' ? 3.0 : 2.5);

  // Build content object matching HYDRA internal shape
  const content = {
    title: item.title,
    url: item.url,
    author: item.author || 'curated by user',
    contentId,
    tier,
    score,
    domains: item.domains,
    keywords: item.tags || [],
    tags: item.tags || [],
    entities: item.entities || [],
    insights: item.insights,
    quotes: item.quotes || [],
    publishedAt,
  };

  let routing;

  if (Array.isArray(item.forceClones) && item.forceClones.length > 0) {
    // FORCE mode: skip scoring, route directly to specified clones
    routing = {
      contentId,
      targetClones: item.forceClones.map(cloneId => ({
        id: cloneId,
        relevanceScore: 1.0,
        matchedKeywords: ['user-forced'],
        department: 'forced',
      })),
      forcedRoutes: item.forceClones,
      reasoning: 'user-forced routing',
    };
  } else {
    // AUTO mode: route via standard mind-clone-router
    routing = routeToMindClones(content, {
      minRelevance: options.minRelevance ?? 0.3,
      maxClones: options.maxClones ?? 25,
    });
  }

  // Write feed entries (per-clone markdown files)
  const feedResult = await writeKnowledgeFeed(routing, content, {
    date: publishedAt.slice(0, 10),
  });

  // Write to Jarvis KB (per-domain markdown files)
  const kbResult = await writeToJarvisKB({
    title: item.title,
    url: item.url,
    author: item.author || 'curated by user',
    contentId,
    tier,
    score,
    domains: item.domains,
    tags: item.tags || [],
    entities: item.entities || [],
    summary: item.insights,
    insights: item.insights,
    quotes: item.quotes || [],
    normalizedText: item.normalizedText,
    publishedAt,
  });

  return {
    contentId,
    title: item.title,
    routedTo: routing.targetClones.map(c => c.id),
    feedsWritten: feedResult.written.length,
    feedsErrors: feedResult.errors,
    kbWritten: kbResult.written,
    kbPaths: kbResult.paths,
    kbErrors: kbResult.errors,
  };
}

// ============================================================================
// CLI
// ============================================================================

async function readStdin() {
  return new Promise((resolve, reject) => {
    let data = '';
    process.stdin.setEncoding('utf-8');
    process.stdin.on('data', chunk => { data += chunk; });
    process.stdin.on('end', () => resolve(data));
    process.stdin.on('error', reject);
  });
}

async function main() {
  const args = process.argv.slice(2);
  const fileIdx = args.indexOf('--file');
  const filePath = fileIdx >= 0 ? args[fileIdx + 1] : null;
  const minRelIdx = args.indexOf('--min-relevance');
  const minRelevance = minRelIdx >= 0 ? parseFloat(args[minRelIdx + 1]) : undefined;

  let inputText;
  if (filePath) {
    inputText = readFileSync(filePath, 'utf-8');
  } else {
    inputText = await readStdin();
  }

  // Try parse as JSONL (one JSON per line) or single JSON
  let items = [];
  const trimmed = inputText.trim();
  const lines = trimmed.split('\n').filter(line => line.trim());
  if (trimmed.startsWith('[')) {
    items = JSON.parse(trimmed);
  } else if (lines.length > 1 && lines.every(l => l.trim().startsWith('{'))) {
    // JSONL: multi-line, each starts with { → parse line-by-line
    items = lines.map((line, i) => {
      try {
        return JSON.parse(line);
      } catch (e) {
        throw new Error(`JSONL parse error line ${i + 1}: ${e.message}`);
      }
    });
  } else if (trimmed.startsWith('{')) {
    items = [JSON.parse(trimmed)];
  } else {
    throw new Error('Input is neither JSON object, array, nor JSONL');
  }

  console.log(`Processing ${items.length} curated item(s)...`);

  const results = [];
  for (const item of items) {
    try {
      const r = await processItem(item, { minRelevance });
      results.push({ ok: true, ...r });
      console.log(`✓ ${r.title} → ${r.routedTo.length} clones, ${r.feedsWritten} feeds, ${r.kbPaths.length} KB paths`);
    } catch (err) {
      results.push({ ok: false, error: err.message, item: item.title || item.url });
      console.error(`✗ ${item.title || item.url}: ${err.message}`);
    }
  }

  const ok = results.filter(r => r.ok).length;
  const fail = results.length - ok;
  console.log(`\nDone: ${ok} ok / ${fail} failed`);

  // Print final summary as JSON for programmatic consumption
  console.log('\n---RESULT---');
  console.log(JSON.stringify({ ok, fail, results }, null, 2));

  process.exit(fail > 0 ? 1 : 0);
}

main().catch(err => {
  console.error('Fatal:', err.stack);
  process.exit(2);
});
