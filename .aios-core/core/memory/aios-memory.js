#!/usr/bin/env node
/**
 * AIOS Memory
 *
 * Local-first persistent memory with a Graphiti-ready outbox.
 *
 * Storage:
 *   .aios-core/data/memory/events.jsonl
 *   .aios-core/data/memory/facts.json
 *   .aios-core/data/memory/decisions.json
 *   .aios-core/data/memory/summaries/*.md
 *   .aios-core/data/memory/graphiti-outbox.jsonl
 */

'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const AIOS_ROOT = path.resolve(__dirname, '..', '..', '..');
const MEMORY_DIR = path.join(AIOS_ROOT, '.aios-core', 'data', 'memory');
const EVENTS_FILE = path.join(MEMORY_DIR, 'events.jsonl');
const FACTS_FILE = path.join(MEMORY_DIR, 'facts.json');
const DECISIONS_FILE = path.join(MEMORY_DIR, 'decisions.json');
const SUMMARIES_DIR = path.join(MEMORY_DIR, 'summaries');
const GRAPHITI_OUTBOX = path.join(MEMORY_DIR, 'graphiti-outbox.jsonl');
const GRAPHITI_STATE = path.join(MEMORY_DIR, 'graphiti-state.json');

const SCHEMA_VERSION = 'aios-memory-v1';

function ensureMemoryDirs() {
  fs.mkdirSync(MEMORY_DIR, { recursive: true });
  fs.mkdirSync(SUMMARIES_DIR, { recursive: true });
  for (const file of [EVENTS_FILE, GRAPHITI_OUTBOX]) {
    if (!fs.existsSync(file)) fs.writeFileSync(file, '', 'utf8');
  }
  if (!fs.existsSync(FACTS_FILE)) writeJson(FACTS_FILE, []);
  if (!fs.existsSync(DECISIONS_FILE)) writeJson(DECISIONS_FILE, []);
  if (!fs.existsSync(GRAPHITI_STATE)) writeJson(GRAPHITI_STATE, { schemaVersion: SCHEMA_VERSION, syncedIds: [] });
}

function readJson(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return fallback;
  }
}

function writeJson(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

function appendJsonl(file, obj) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.appendFileSync(file, `${JSON.stringify(obj)}\n`, 'utf8');
}

function readJsonl(file) {
  if (!fs.existsSync(file)) return [];
  return fs
    .readFileSync(file, 'utf8')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      try {
        return JSON.parse(line);
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

function sha(input) {
  return crypto.createHash('sha256').update(input).digest('hex').slice(0, 16);
}

function now() {
  return new Date().toISOString();
}

function slug(input) {
  return String(input || 'memory')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_]+/g, '-')
    .slice(0, 80) || 'memory';
}

function parseArgs(argv) {
  const opts = { _: [] };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (!next || next.startsWith('--')) opts[key] = true;
      else {
        opts[key] = next;
        i += 1;
      }
    } else {
      opts._.push(a);
    }
  }
  return opts;
}

function splitTags(value) {
  if (!value) return [];
  return String(value)
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean);
}

function tokenize(text) {
  return new Set(
    String(text || '')
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[^\w\s-]/g, ' ')
      .split(/\s+/)
      .filter((x) => x.length > 2),
  );
}

function score(query, item) {
  const q = tokenize(query);
  if (q.size === 0) return 0;
  const haystack = [
    item.title,
    item.text,
    item.summary,
    item.decision,
    item.rationale,
    item.project,
    item.agent,
    ...(item.tags || []),
  ].join(' ');
  const h = tokenize(haystack);
  let hits = 0;
  for (const token of q) if (h.has(token)) hits += 1;
  return hits / Math.sqrt(Math.max(h.size, 1));
}

function asGraphitiEpisode(memory) {
  return {
    id: memory.id,
    schemaVersion: SCHEMA_VERSION,
    source: 'aios-memory',
    sourceDescription: `${memory.type} from AIOS memory`,
    episodeName: memory.title || `${memory.type}:${memory.id}`,
    episodeBody: [
      `type: ${memory.type}`,
      `project: ${memory.project || 'global'}`,
      `agent: ${memory.agent || 'unknown'}`,
      `createdAt: ${memory.createdAt}`,
      `tags: ${(memory.tags || []).join(', ')}`,
      '',
      memory.text || memory.summary || memory.decision || '',
      memory.rationale ? `\nrationale:\n${memory.rationale}` : '',
    ].join('\n'),
    referenceTime: memory.createdAt,
    metadata: memory,
  };
}

function remember(opts) {
  ensureMemoryDirs();
  const text = opts._.join(' ').trim();
  if (!text) throw new Error('remember requires text');

  const type = opts.type || 'event';
  const memory = {
    id: `${type}_${sha(`${now()}:${text}`)}`,
    schemaVersion: SCHEMA_VERSION,
    type,
    title: opts.title || text.slice(0, 96),
    text,
    project: opts.project || 'global',
    agent: opts.agent || 'user',
    tags: splitTags(opts.tags),
    createdAt: now(),
    source: opts.source || 'manual',
  };

  appendJsonl(EVENTS_FILE, memory);
  appendJsonl(GRAPHITI_OUTBOX, asGraphitiEpisode(memory));

  if (type === 'fact') {
    const facts = readJson(FACTS_FILE, []);
    facts.push(memory);
    writeJson(FACTS_FILE, facts);
  }

  if (type === 'decision') {
    const decisions = readJson(DECISIONS_FILE, []);
    decisions.push({
      ...memory,
      decision: opts.decision || text,
      rationale: opts.rationale || '',
    });
    writeJson(DECISIONS_FILE, decisions);
  }

  console.log(JSON.stringify(memory, null, 2));
}

function recall(opts) {
  ensureMemoryDirs();
  const query = opts._.join(' ').trim();
  if (!query) throw new Error('recall requires a query');

  const limit = Number(opts.limit || 8);
  const project = opts.project || null;
  const seen = new Set();
  const items = [
    ...readJsonl(EVENTS_FILE),
    ...readJson(FACTS_FILE, []),
    ...readJson(DECISIONS_FILE, []),
    ...readSummaries(),
  ].filter((item) => {
    const key = item.id || JSON.stringify(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const ranked = items
    .filter((item) => !project || item.project === project || item.project === 'global')
    .map((item) => ({ ...item, score: score(query, item) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || String(b.createdAt).localeCompare(String(a.createdAt)))
    .slice(0, limit);

  if (opts.json) {
    console.log(JSON.stringify(ranked, null, 2));
    return;
  }

  for (const item of ranked) {
    console.log(`- [${item.type || 'summary'}] ${item.title || item.id} (${item.project || 'global'}, ${item.agent || 'unknown'})`);
    console.log(`  ${item.text || item.summary || item.decision || ''}`.slice(0, 500));
  }
}

function readSummaries() {
  if (!fs.existsSync(SUMMARIES_DIR)) return [];
  return fs
    .readdirSync(SUMMARIES_DIR)
    .filter((file) => file.endsWith('.md'))
    .map((file) => {
      const full = path.join(SUMMARIES_DIR, file);
      return {
        id: file.replace(/\.md$/, ''),
        type: 'summary',
        title: file.replace(/\.md$/, ''),
        summary: fs.readFileSync(full, 'utf8'),
        project: 'global',
        agent: 'aios-memory',
        createdAt: fs.statSync(full).mtime.toISOString(),
      };
    });
}

function decide(opts) {
  const decision = opts._.join(' ').trim();
  remember({
    ...opts,
    type: 'decision',
    decision,
    title: opts.title || `Decision: ${decision.slice(0, 80)}`,
  });
}

function summarize(opts) {
  ensureMemoryDirs();
  const text = opts._.join(' ').trim();
  if (!text) throw new Error('summarize requires text');
  const title = opts.title || `summary-${new Date().toISOString().slice(0, 10)}-${sha(text)}`;
  const file = path.join(SUMMARIES_DIR, `${slug(title)}.md`);
  const body = [
    '---',
    `schemaVersion: ${SCHEMA_VERSION}`,
    `title: ${title}`,
    `project: ${opts.project || 'global'}`,
    `agent: ${opts.agent || 'user'}`,
    `createdAt: ${now()}`,
    `tags: ${splitTags(opts.tags).join(',')}`,
    '---',
    '',
    text,
    '',
  ].join('\n');
  fs.writeFileSync(file, body, 'utf8');
  const memory = {
    id: path.basename(file, '.md'),
    type: 'summary',
    title,
    text,
    project: opts.project || 'global',
    agent: opts.agent || 'user',
    tags: splitTags(opts.tags),
    createdAt: now(),
  };
  appendJsonl(EVENTS_FILE, memory);
  appendJsonl(GRAPHITI_OUTBOX, asGraphitiEpisode(memory));
  console.log(file);
}

function status(opts) {
  ensureMemoryDirs();
  const state = readJson(GRAPHITI_STATE, { syncedIds: [] });
  const outbox = readJsonl(GRAPHITI_OUTBOX);
  const synced = new Set(state.syncedIds || []);
  const payload = {
    memoryDir: MEMORY_DIR,
    events: readJsonl(EVENTS_FILE).length,
    facts: readJson(FACTS_FILE, []).length,
    decisions: readJson(DECISIONS_FILE, []).length,
    summaries: readSummaries().length,
    graphitiOutbox: outbox.length,
    graphitiPending: outbox.filter((x) => !synced.has(x.id)).length,
    graphitiState: GRAPHITI_STATE,
  };
  if (opts.json) console.log(JSON.stringify(payload, null, 2));
  else {
    for (const [k, v] of Object.entries(payload)) console.log(`${k}: ${v}`);
  }
}

function exportGraphiti(opts) {
  ensureMemoryDirs();
  const out = opts.output || path.join(MEMORY_DIR, 'graphiti-episodes.jsonl');
  fs.copyFileSync(GRAPHITI_OUTBOX, out);
  console.log(out);
}

function usage() {
  console.log(`AIOS Memory

Commands:
  init
  remember <text> [--type event|fact|decision] [--project p] [--agent a] [--tags a,b]
  decide <text> [--rationale "..."] [--project p] [--agent a] [--tags a,b]
  recall <query> [--project p] [--limit 8] [--json]
  summarize <text> [--title t] [--project p] [--agent a]
  status [--json]
  graphiti export [--output file]

Examples:
  node .aios-core/core/memory/aios-memory.js remember "Traffic agents execute in Codex; strategy review can go to Claude" --type decision --tags routing
  node .aios-core/core/memory/aios-memory.js recall "como chamar agentes"
`);
}

function main(argv) {
  const command = argv[0];
  const sub = argv[1];
  const opts = parseArgs(argv.slice(command === 'graphiti' ? 2 : 1));

  try {
    if (!command || command === '--help' || command === '-h') usage();
    else if (command === 'init') {
      ensureMemoryDirs();
      status(opts);
    } else if (command === 'remember') remember(opts);
    else if (command === 'decide') decide(opts);
    else if (command === 'recall') recall(opts);
    else if (command === 'summarize') summarize(opts);
    else if (command === 'status') status(opts);
    else if (command === 'graphiti' && sub === 'export') exportGraphiti(opts);
    else {
      usage();
      process.exitCode = 1;
    }
  } catch (error) {
    console.error(`aios-memory: ${error.message}`);
    process.exitCode = 1;
  }
}

if (require.main === module) {
  main(process.argv.slice(2));
}

module.exports = {
  MEMORY_DIR,
  remember,
  recall,
  status,
};
