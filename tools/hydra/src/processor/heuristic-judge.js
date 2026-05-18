/**
 * @module heuristic-judge
 * @description Deterministic, LLM-free scoring + extraction for HYDRA.
 *
 * Activated when:
 *   - HYDRA_HEURISTIC_MODE=1  (explicit force, even with API keys)
 *   - OR no LLM API key is set (auto-fallback)
 *
 * Replaces:
 *   - scoreContent()       (curator/llm-judge.js)  →  scoreHeuristic()
 *   - extractWisdom()      (processor/extractor.js) →  extractWisdomHeuristic()
 *   - summarize()          (processor/extractor.js) →  summarizeHeuristic()
 *   - labelAndRate()       (processor/extractor.js) →  labelAndRateHeuristic()
 *
 * Quality:
 *   - tier classification ≈ 80% accuracy vs LLM judge on a manual sample
 *     (validated subjectively; no benchmark set)
 *   - insights/summary are first-sentence extractive (no abstractive summarization)
 *   - tags + entities work well; quotes need text inside "..." to populate
 *
 * Cost: zero. No external calls, no API keys, no quota.
 */

import { classifyTier } from '../curator/scoring-rubric.js';

// ---------------------------------------------------------------------------
// Mode detection
// ---------------------------------------------------------------------------

export function isHeuristicMode() {
  if (process.env.HYDRA_HEURISTIC_MODE === '1') return true;
  return !(
    process.env.ANTHROPIC_API_KEY ||
    process.env.DEEPSEEK_API_KEY ||
    process.env.OPENAI_API_KEY
  );
}

// ---------------------------------------------------------------------------
// Domain keyword bank
// ---------------------------------------------------------------------------
// Curated from squad-crm/squad-ai/squad-design/squad-highticket domains.yaml
// files. Covers the common HYDRA-routable domains. Add new entries when
// new domains land — heuristic falls back to baseline score if domain
// not found.

const DOMAIN_KEYWORDS = {
  'crm-saas': [
    'crm', 'sales pipeline', 'deal stage', 'lead management', 'lead scoring',
    'sales automation', 'churn', 'retention', 'mrr', 'arr', 'pipeline velocity',
    'pipedrive', 'hubspot', 'salesforce', 'close.io', 'twenty crm', 'agendor',
    'rd station', 'piperun', 'revops', 'sales operations',
  ],
  'whatsapp-business': [
    'whatsapp', 'waba', 'whatsapp business', 'cloud api', 'template', 'hsm',
    'click-to-whatsapp', 'webhook', 'wamid', 'meta business', 'twilio',
    'take blip', 'z-api', 'zenvia', 'unoflow', 'bsp', 'consent', 'opt-in',
  ],
  engenharia: [
    'next.js', 'react', 'typescript', 'node.js', 'supabase', 'postgres', 'rls',
    'row-level security', 'multi-tenant', 'tenant isolation', 'inngest',
    'webhooks', 'idempotency', 'rate limit', 'observability', 'tracing',
    'sentry', 'opentelemetry', 'vercel', 'edge', 'serverless', 'queue',
    'bullmq', 'trpc', 'graphql', 'microservices', 'architecture', 'docker',
    'kubernetes', 'ci/cd', 'devops',
  ],
  product: [
    'product management', 'discovery', 'continuous discovery', 'plg',
    'product-led growth', 'rice', 'ice', 'jtbd', 'jobs-to-be-done',
    'user research', 'user interviews', 'mvp', 'product-market fit', 'pmf',
    'north star', 'okr', 'roadmap', 'marty cagan', 'teresa torres',
  ],
  'customer-ops': [
    'customer success', 'csm', 'onboarding', 'activation', 'time-to-value',
    'churn prevention', 'renewal', 'expansion', 'nps', 'csat',
    'customer health', 'qbr', 'voc', 'voice of customer', 'support automation',
  ],
  legal: [
    'lgpd', 'anpd', 'gdpr', 'compliance', 'privacidade', 'data privacy',
    'patricia peck', 'consentimento', 'consent', 'ropa', 'dpa',
    'data processing agreement', 'dpo', 'encarregado', 'right to erasure',
    'data portability', 'cookie banner', 'cmp', 'cross-border', 'data residency',
    'cdc', 'codigo de defesa do consumidor', 'marco civil', 'legitimo interesse',
    'legitimate interest',
  ],
  negocios: [
    'saas pricing', 'freemium', 'trial', 'b2b sales', 'b2b saas', 'mrr',
    'arr', 'cac', 'ltv', 'payback', 'gtm', 'go-to-market', 'startup',
    'fundraising', 'bootstrap', 'indie hacker', 'solopreneur', 'jason lemkin',
    'patrick campbell', 'profitwell', 'saastr', 'reforge',
  ],
  marketing: [
    'funil', 'conversao', 'google ads', 'facebook ads', 'meta ads',
    'copywriting', 'lead', 'growth', 'seo', 'cpc', 'cpa', 'roas', 'capi',
    'conversion api', 'offline conversions', 'mql', 'sql', 'lead scoring',
    'attribution',
  ],
  'ai-ml': [
    'llm', 'gpt', 'claude', 'anthropic', 'openai', 'gemini', 'embedding',
    'rag', 'retrieval', 'fine-tuning', 'prompt engineering', 'tool use',
    'structured output', 'tokens', 'vector database', 'pinecone', 'weaviate',
    'langchain', 'llamaindex', 'agent', 'reasoning', 'inference',
    'classification', 'sentiment', 'extraction', 'nlp', 'transformer',
  ],
  'design-systems': [
    'design system', 'design tokens', 'component library', 'storybook',
    'tailwind', 'shadcn', 'radix', 'figma', 'tokens', 'theming',
    'accessibility', 'wcag', 'aria',
  ],
};

const ACTION_WORDS = [
  'how to', 'step by step', 'guide', 'tutorial', 'practical', 'example',
  'recipe', 'pattern', 'best practice', 'checklist', 'should', 'must',
  'do this', 'avoid', 'never', 'always', 'recipe', 'lesson learned',
];

const FILLER_PHRASES = [
  "in today's rapidly evolving", "it's important to note that",
  'in this comprehensive guide', 'in conclusion', 'game-changer',
  'deep dive', 'unlock the power', 'cutting-edge', 'paradigm shift',
  'synergy', 'robust solution', 'seamless integration',
];

// ---------------------------------------------------------------------------
// Scoring (replaces scoreContent)
// ---------------------------------------------------------------------------

/**
 * Heuristic content scorer — same shape as scoreContent.
 * @param {Object} params
 * @param {string} params.title
 * @param {string} params.normalizedText
 * @param {string[]} params.domains
 * @param {number} [params.sourceAuthority]
 */
export function scoreHeuristic(params) {
  const { title = '', normalizedText = '', domains = [], sourceAuthority } = params;
  const lower = (title + '\n' + normalizedText).toLowerCase();
  const words = lower.match(/\b[\p{L}\p{N}]+\b/gu) ?? [];
  const wordCount = words.length;
  const uniqueWords = new Set(words).size;
  const diversity = wordCount > 0 ? uniqueWords / wordCount : 0;

  // 1. Relevance — domain keyword matches
  const keywords = domains.flatMap((d) => DOMAIN_KEYWORDS[d] ?? []);
  let keywordHits = 0;
  for (const kw of keywords) {
    if (lower.includes(kw.toLowerCase())) keywordHits += 1;
  }
  const relevance = clamp(1 + Math.floor(keywordHits / 2), 1, 5);

  // 2. Novelty — lexical diversity + filler penalty
  let fillerHits = 0;
  for (const f of FILLER_PHRASES) {
    if (lower.includes(f)) fillerHits += 1;
  }
  let novelty = 2;
  if (diversity > 0.5) novelty = 5;
  else if (diversity > 0.42) novelty = 4;
  else if (diversity > 0.34) novelty = 3;
  else if (diversity > 0.25) novelty = 2;
  else novelty = 1;
  novelty = clamp(novelty - Math.min(2, fillerHits), 1, 5);

  // 3. Actionability — imperative verbs, code blocks, lists
  const codeBlocks = (normalizedText.match(/```/g) ?? []).length / 2;
  const bulletLines = (normalizedText.match(/^\s*[-*•]\s/gm) ?? []).length;
  const numberedLines = (normalizedText.match(/^\s*\d+\.\s/gm) ?? []).length;
  let actionMatches = 0;
  for (const aw of ACTION_WORDS) {
    if (lower.includes(aw)) actionMatches += 1;
  }
  const actionSignal = codeBlocks * 2 + bulletLines * 0.3 + numberedLines * 0.3 + actionMatches;
  let actionability = 1;
  if (actionSignal > 20) actionability = 5;
  else if (actionSignal > 12) actionability = 4;
  else if (actionSignal > 6) actionability = 3;
  else if (actionSignal > 2) actionability = 2;
  else actionability = 1;

  // 4. Authority — directly from source config
  const authority = sourceAuthority && !Number.isNaN(sourceAuthority)
    ? clamp(Math.round(sourceAuthority), 1, 5)
    : 3;

  // 5. Depth — word count Goldilocks band
  let depth = 1;
  if (wordCount >= 800 && wordCount < 3000) depth = 5;
  else if (wordCount >= 3000 && wordCount < 8000) depth = 4;
  else if (wordCount >= 400 && wordCount < 800) depth = 3;
  else if (wordCount >= 200 && wordCount < 400) depth = 2;
  else if (wordCount >= 8000) depth = 3;
  else depth = 1;

  const scores = { relevance, novelty, actionability, authority, depth };

  const weightedScore =
    relevance * 0.3 + novelty * 0.25 + actionability * 0.2 + authority * 0.15 + depth * 0.1;

  const tierInfo = classifyTier(weightedScore);

  return {
    ...tierInfo,
    weightedScore: Math.round(weightedScore * 100) / 100,
    scores,
    reasoning: `[heuristic] kw=${keywordHits} div=${diversity.toFixed(2)} actSig=${actionSignal.toFixed(1)} words=${wordCount} src_auth=${authority}`,
  };
}

// ---------------------------------------------------------------------------
// Extraction (replaces extractWisdom)
// ---------------------------------------------------------------------------

/**
 * Heuristic wisdom extractor — same shape as extractWisdom.
 * Extractive (no abstractive summarization): picks high-signal sentences
 * from the source text. Tags + entities + quotes via regex.
 *
 * @param {string} numberedText - Text with [P1], [P2] paragraph markers
 * @param {string} title
 */
export function extractWisdomHeuristic(numberedText, title) {
  const paragraphs = parseNumberedText(numberedText);
  const allSentences = paragraphs.flatMap((p) =>
    splitSentences(p.text).map((s) => ({ sentence: s, paragraph: p.number })),
  );

  // Score each sentence: length sweet spot + signal words + numbers
  const scored = allSentences.map(({ sentence, paragraph }) => ({
    sentence,
    paragraph,
    score: scoreSentence(sentence),
  }));

  scored.sort((a, b) => b.score - a.score);
  const topSentences = scored.slice(0, 8);

  const insights = topSentences.slice(0, 6).map((s) => ({
    insight: s.sentence.trim(),
    evidence: s.sentence.trim(),
    sourceParagraph: s.paragraph,
    confidence: clamp(Math.round(s.score / 2), 1, 5),
    type: classifySentenceType(s.sentence),
  }));

  const summary = topSentences
    .slice(0, 5)
    .sort((a, b) => a.paragraph - b.paragraph)
    .map((s) => s.sentence.trim());

  const tags = extractTags(title + ' ' + numberedText);
  const entities = extractEntities(numberedText);
  const quotes = extractQuotes(numberedText);

  // Compute score for tier classification
  const scoringResult = scoreHeuristic({
    title,
    normalizedText: numberedText,
    domains: [],
    sourceAuthority: 3,
  });

  return {
    insights,
    summary,
    tags,
    entities,
    quotes,
    tier: scoringResult.tier,
    scores: scoringResult.scores,
  };
}

// ---------------------------------------------------------------------------
// Summarize (replaces summarize)
// ---------------------------------------------------------------------------

export function summarizeHeuristic(text, title) {
  const sentences = splitSentences(text);
  const scored = sentences.map((s) => ({ s, score: scoreSentence(s) }));
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 5).map((x) => x.s.trim());
}

// ---------------------------------------------------------------------------
// labelAndRate (replaces labelAndRate)
// ---------------------------------------------------------------------------

export function labelAndRateHeuristic(text, title, domains = []) {
  const result = scoreHeuristic({
    title,
    normalizedText: text,
    domains,
  });
  return {
    tier: result.tier,
    scores: result.scores,
    label: result.label,
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function clamp(n, lo, hi) {
  return Math.max(lo, Math.min(hi, n));
}

function parseNumberedText(text) {
  const lines = text.split(/\n\n+/);
  const out = [];
  for (const block of lines) {
    const match = block.match(/^\[P(\d+)\]\s+([\s\S]*)$/);
    if (match) {
      out.push({ number: parseInt(match[1], 10), text: match[2].trim() });
    } else if (block.trim()) {
      out.push({ number: out.length + 1, text: block.trim() });
    }
  }
  return out;
}

function splitSentences(text) {
  return text
    .split(/(?<=[.!?])\s+(?=[A-ZÁÉÍÓÚ])/)
    .map((s) => s.trim())
    .filter((s) => s.length > 20 && s.length < 400);
}

function scoreSentence(s) {
  let score = 0;
  const lower = s.toLowerCase();
  if (s.length > 40 && s.length < 200) score += 2;
  if (/\d/.test(s)) score += 1;
  if (/(should|must|never|always|key|recommend|recommended|important)/i.test(s)) score += 2;
  if (/[A-Z]{2,}|\b[A-Z][a-z]+\s[A-Z][a-z]+\b/.test(s)) score += 1;
  for (const aw of ACTION_WORDS) {
    if (lower.includes(aw)) {
      score += 1;
      break;
    }
  }
  for (const f of FILLER_PHRASES) {
    if (lower.includes(f)) score -= 2;
  }
  return score;
}

function classifySentenceType(s) {
  if (/^\s*"[^"]+"\s*[—-]/.test(s) || /[""].+[""]/.test(s)) return 'quote';
  if (/(should|must|recommend|never|avoid)/i.test(s)) return 'recommendation';
  if (/(framework|pattern|model|approach)/i.test(s)) return 'framework';
  if (/(believe|think|opinion|view)/i.test(s)) return 'opinion';
  return 'fact';
}

function extractTags(text) {
  const lower = text.toLowerCase();
  const tags = new Set();
  for (const [domain, kws] of Object.entries(DOMAIN_KEYWORDS)) {
    for (const kw of kws) {
      if (lower.includes(kw)) {
        tags.add(domain);
        tags.add(kw.replace(/\s+/g, '-'));
      }
    }
  }
  return Array.from(tags).slice(0, 10);
}

function extractEntities(text) {
  const entities = new Set();

  // Proper nouns: two-word capitalized phrases
  const nouns = text.match(/\b[A-Z][a-záéíóú]+(?:\s+[A-Z][a-záéíóú]+){0,2}\b/g) ?? [];
  for (const n of nouns.slice(0, 50)) {
    if (n.length > 3 && n.length < 60) entities.add(n);
  }

  // URLs
  const urls = text.match(/https?:\/\/[^\s)>"']+/g) ?? [];
  for (const u of urls.slice(0, 10)) entities.add(u);

  // Tech/brand acronyms in ALL CAPS
  const acronyms = text.match(/\b[A-Z]{2,6}\b/g) ?? [];
  for (const a of acronyms.slice(0, 20)) {
    if (a.length >= 2 && a.length <= 6) entities.add(a);
  }

  return Array.from(entities).slice(0, 20);
}

function extractQuotes(text) {
  const quotes = new Set();
  const patterns = [
    /"([^"]{20,300})"/g,
    /[""]([^""]{20,300})[""]/g,
    /«([^»]{20,300})»/g,
  ];
  for (const re of patterns) {
    let m;
    while ((m = re.exec(text)) !== null) {
      quotes.add(m[1].trim());
      if (quotes.size >= 5) break;
    }
  }
  return Array.from(quotes).slice(0, 5);
}
