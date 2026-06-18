// Noyce knowledge base (RAG) — load + chunk + BM25 retrieval. Dependency-free.
//
// Corpus = curated markdown in lib/data/knowledge-base/. Each doc has YAML frontmatter
// (title/docId/tags/sourceRefs) and is split into chunks by `##`/`###` headings so each
// retrievable unit is a self-contained section. Retrieval is lexical BM25 with a heading/
// tag boost — deterministic, testable, and never silently empty (see RetrievalResponse.empty).
//
// Agents call retrieveContext(query) and inject the returned, source-cited block into their
// prompt. To swap in embeddings later, add a parallel scorer and blend it in retrieve().

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type {
  KnowledgeChunk,
  KnowledgeDoc,
  KnowledgeIndex,
  RetrievalResponse,
  RetrievalResult,
} from "./knowledge-types.ts";
import { termFrequencies, tokenize } from "./tokenize.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const DEFAULT_KB_DIR = path.resolve(__dirname, "..", "data", "knowledge-base");

const BM25_K1 = 1.5;
const BM25_B = 0.75;

function slugify(s: string): string {
  return tokenize(s).join("-").slice(0, 60) || "secao";
}

// Minimal frontmatter parser (we only need scalar strings + simple inline arrays).
function parseFrontmatter(raw: string): { meta: Record<string, unknown>; body: string } {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return { meta: {}, body: raw };
  const meta: Record<string, unknown> = {};
  for (const line of m[1].split("\n")) {
    const kv = line.match(/^(\w+)\s*:\s*(.*)$/);
    if (!kv) continue;
    const key = kv[1];
    let val: unknown = kv[2].trim();
    const sv = String(val);
    if (sv.startsWith("[") && sv.endsWith("]")) {
      val = sv
        .slice(1, -1)
        .split(",")
        .map((x) => x.trim().replace(/^["']|["']$/g, ""))
        .filter(Boolean);
    } else {
      val = sv.replace(/^["']|["']$/g, "");
    }
    meta[key] = val;
  }
  return { meta, body: m[2] };
}

function asStringArray(v: unknown): string[] {
  if (Array.isArray(v)) return v.map(String);
  if (typeof v === "string" && v) return [v];
  return [];
}

// Split a doc body into heading-delimited chunks, tracking the heading breadcrumb.
export function chunkDoc(
  docId: string,
  title: string,
  tags: string[],
  sourceRefs: string[],
  body: string,
): KnowledgeChunk[] {
  const lines = body.split("\n");
  const chunks: KnowledgeChunk[] = [];
  const stack: Array<{ level: number; text: string }> = [];
  let current: { heading: string; level: number; buf: string[] } | null = null;

  const flush = () => {
    if (!current) return;
    const text = current.buf.join("\n").trim();
    if (text || current.heading) {
      const headingPath = stack.map((s) => s.text);
      chunks.push({
        id: `${docId}#${slugify(current.heading)}`,
        docId,
        title,
        heading: current.heading,
        headingPath,
        text,
        tags,
        sourceRefs,
      });
    }
    current = null;
  };

  // intro (text before the first heading) becomes a chunk under the doc title
  current = { heading: title, level: 1, buf: [] };

  for (const line of lines) {
    const h = line.match(/^(#{2,4})\s+(.*)$/);
    if (h) {
      flush();
      const level = h[1].length;
      const text = h[2].trim();
      while (stack.length && stack[stack.length - 1].level >= level) stack.pop();
      stack.push({ level, text });
      current = { heading: text, level, buf: [] };
    } else {
      current.buf.push(line);
    }
  }
  flush();
  return splitLongChunks(chunks.filter((c) => c.text.length > 0 || c.heading !== title));
}

// PDF-sourced docs (CATs, editais) carry little/no markdown structure, so a section can be
// one huge blob that ruins BM25 ranking. Split any oversized chunk into paragraph-bounded
// sub-chunks so each retrievable unit stays focused.
const MAX_CHUNK_CHARS = 1600;
function splitLongChunks(chunks: KnowledgeChunk[]): KnowledgeChunk[] {
  const out: KnowledgeChunk[] = [];
  for (const chunk of chunks) {
    if (chunk.text.length <= MAX_CHUNK_CHARS) {
      out.push(chunk);
      continue;
    }
    const paras = chunk.text.split(/\n\s*\n/);
    let buf: string[] = [];
    let part = 0;
    const flushPart = () => {
      const text = buf.join("\n\n").trim();
      if (!text) return;
      part += 1;
      out.push({ ...chunk, id: `${chunk.id}~p${part}`, heading: part === 1 ? chunk.heading : `${chunk.heading} (cont. ${part})`, text });
      buf = [];
    };
    let size = 0;
    for (const p of paras) {
      if (size + p.length > MAX_CHUNK_CHARS && buf.length) flushPart();
      buf.push(p);
      size += p.length;
    }
    flushPart();
  }
  return out;
}

// Recursively collect .md files (curated corpus at the root + ingested sources in subdirs
// like eniac-acervo/, editais-ref/).
function listMarkdown(dir: string): string[] {
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...listMarkdown(full));
    else if (entry.name.endsWith(".md") && entry.name.toLowerCase() !== "readme.md") out.push(full);
  }
  return out.sort();
}

export function loadKnowledgeDocs(dir: string = DEFAULT_KB_DIR): KnowledgeDoc[] {
  if (!fs.existsSync(dir)) return [];
  const files = listMarkdown(dir);
  const docs: KnowledgeDoc[] = [];
  for (const file of files) {
    // Normalize CRLF/BOM — Windows-authored docs (e.g. Python write_text) use \r\n, which
    // otherwise breaks the frontmatter match and drops title/tags/sourceRefs.
    const raw = fs.readFileSync(file, "utf8").replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
    const { meta, body } = parseFrontmatter(raw);
    const docId = String(meta.docId ?? path.basename(file).replace(/\.md$/, ""));
    const title = String(meta.title ?? docId);
    const tags = asStringArray(meta.tags);
    const sourceRefs = asStringArray(meta.sourceRefs);
    const audience = meta.audience ? String(meta.audience) : null;
    const chunks = chunkDoc(docId, title, tags, sourceRefs, body);
    docs.push({ docId, title, tags, audience, sourceRefs, chunks });
  }
  return docs;
}

// Tokens that get indexed for a chunk: heading + tags carry extra weight (repeated) so a
// query matching a section title or tag ranks above an incidental body mention.
function indexTokens(chunk: KnowledgeChunk): string[] {
  const heading = tokenize([chunk.heading, ...chunk.headingPath].join(" "));
  const tags = tokenize(chunk.tags.join(" "));
  const body = tokenize(chunk.text);
  return [...heading, ...heading, ...tags, ...tags, ...body];
}

export function buildIndex(chunks: KnowledgeChunk[]): KnowledgeIndex {
  const termFreqs: Array<Map<string, number>> = [];
  const lengths: number[] = [];
  const docFreq = new Map<string, number>();
  for (const chunk of chunks) {
    const tokens = indexTokens(chunk);
    const tf = termFrequencies(tokens);
    termFreqs.push(tf);
    lengths.push(tokens.length);
    for (const term of tf.keys()) docFreq.set(term, (docFreq.get(term) ?? 0) + 1);
  }
  const avgLength = lengths.length ? lengths.reduce((a, b) => a + b, 0) / lengths.length : 0;
  return { chunks, docFreq, termFreqs, lengths, avgLength, builtAt: new Date().toISOString() };
}

function idf(index: KnowledgeIndex, term: string): number {
  const df = index.docFreq.get(term) ?? 0;
  const n = index.chunks.length;
  return Math.log((n - df + 0.5) / (df + 0.5) + 1);
}

export function retrieve(index: KnowledgeIndex, query: string, topK = 5): RetrievalResponse {
  const qTokens = [...new Set(tokenize(query))];
  const scored: RetrievalResult[] = [];
  for (let i = 0; i < index.chunks.length; i++) {
    const tf = index.termFreqs[i];
    const len = index.lengths[i];
    let score = 0;
    for (const term of qTokens) {
      const f = tf.get(term);
      if (!f) continue;
      const denom = f + BM25_K1 * (1 - BM25_B + (BM25_B * len) / (index.avgLength || 1));
      score += idf(index, term) * ((f * (BM25_K1 + 1)) / denom);
    }
    if (score > 0) scored.push({ chunk: index.chunks[i], score });
  }
  scored.sort((a, b) => b.score - a.score);
  return { query, results: scored.slice(0, topK), empty: scored.length === 0 };
}

// ── cached default index (build once per process) ──
let cached: { dir: string; index: KnowledgeIndex } | null = null;

export function getKnowledgeIndex(dir: string = DEFAULT_KB_DIR): KnowledgeIndex {
  if (cached && cached.dir === dir) return cached.index;
  const docs = loadKnowledgeDocs(dir);
  const index = buildIndex(docs.flatMap((d) => d.chunks));
  cached = { dir, index };
  return index;
}

export function resetKnowledgeCache(): void {
  cached = null;
}

// The main entry point agents call: returns a source-cited context block ready to inject
// into a prompt. Always honest about misses — emits an explicit no-match notice instead of
// a confident empty string.
export function retrieveContext(
  query: string,
  opts: { topK?: number; dir?: string; maxChars?: number } = {},
): string {
  const { topK = 4, dir = DEFAULT_KB_DIR, maxChars = 4000 } = opts;
  const index = getKnowledgeIndex(dir);
  const res = retrieve(index, query, topK);
  if (res.empty) {
    return `# Base de conhecimento Noyce — consulta: "${query}"\n\n> Nenhum trecho casou com a consulta. NÃO invente: reformule a busca ou escale para revisão humana.`;
  }
  const blocks: string[] = [`# Base de conhecimento Noyce — consulta: "${query}"`];
  let used = 0;
  for (const { chunk, score } of res.results) {
    const crumb = [chunk.title, ...chunk.headingPath].filter(Boolean).join(" › ");
    const cite = chunk.sourceRefs.length ? ` · fonte: ${chunk.sourceRefs.join(", ")}` : "";
    const body = chunk.text.length > 1200 ? `${chunk.text.slice(0, 1200)}…` : chunk.text;
    const block = `\n## ${crumb}  _(rel. ${score.toFixed(2)}${cite})_\n${body}`;
    if (used + block.length > maxChars) break;
    blocks.push(block);
    used += block.length;
  }
  return blocks.join("\n");
}
