#!/usr/bin/env node
/**
 * AIOS Delegate — Universal CLI bridge between Codex, Gemini, Claude, and jarvis Mind Clones.
 *
 * WHY (not MCP):
 *   MCP handshakes are fragile (fail in Antigravity, version mismatches in Codex).
 *   This bridge uses plain subprocess + shared files — works in EVERY IDE that has a
 *   terminal (Claude Code, Codex, Antigravity, Gemini, Cursor) with zero handshake risk.
 *
 * ROLES / BILLING (Constitution Article VII — avoid PROGRAMMATIC Claude for automation):
 *   - `codex exec`              = OpenAI billing — PRIMARY surface: reasoning + bulk/programmatic execution
 *   - `gemini -p`               = Google billing (Flash is cheapest) — classification / cheap bulk
 *   - jarvis (self-consult)     = local files, no LLM billing for the routing layer itself
 *   - `claude -p` (--to claude) = ⚠️ PROGRAMMATIC → draws the SEPARATE metered pool post-2026-06-15
 *                                 (full API rates, no rollover). Use sparingly, never in loops/automation.
 *                                 Interactive Claude (you type) is UNCHANGED & preferred for long reasoning.
 *
 * USAGE:
 *   node .aios-core/infrastructure/scripts/delegate.js --to codex  "refactor X across these files"
 *   node .aios-core/infrastructure/scripts/delegate.js --to jarvis --topic "pricing" --limit 3
 *   node .aios-core/infrastructure/scripts/delegate.js --to codex --model gpt-5.5 --sandbox workspace-write "task"
 *   node .aios-core/infrastructure/scripts/delegate.js --to gemini "classify these 200 leads as hot/warm/cold"
 *   node .aios-core/infrastructure/scripts/delegate.js --to gemini --agent architect "evaluate this design tradeoff"
 *   echo "long task from stdin" | node .aios-core/infrastructure/scripts/delegate.js --to codex -
 *
 * FLAGS:
 *   --to <codex|gemini|jarvis|claude>  target system (default: codex).
 *                                `claude` = programmatic claude -p (warns: separate metered pool post-2026-06-15).
 *   --model <id>                 override model (codex + gemini)
 *   --sandbox <mode>             read-only | workspace-write | danger-full-access (default: read-only)
 *                                (gemini maps: read-only→plan, workspace-write→auto_edit, danger-full-access→yolo)
 *   --effort <low|medium|high>   reasoning effort (codex only)
 *   --topic <str>                jarvis: search topic
 *   --expert <id>                jarvis: specific expert to consult
 *   --project <name>             jarvis: project context
 *   --agent <name>               jarvis: calling agent
 *   --limit <n>                  jarvis: number of experts (default: 3)
 *   --json                       request machine-readable output where supported
 */

'use strict';

const { spawnSync } = require('child_process');
const path = require('path');

// Auto-load repo .env (zero-dep) so provider keys propagate to delegated CLIs.
try { require('./lib/load-env').loadEnv(); } catch { /* .env optional */ }

const CODEX_EXE = process.env.AIOS_CODEX_BIN
  || 'C:/Users/kingp/AppData/Roaming/npm/node_modules/@openai/codex/node_modules/@openai/codex-win32-x64/vendor/x86_64-pc-windows-msvc/codex/codex.exe';

// Gemini CLI is an npm global shim. On Windows the resolvable name is `gemini.cmd`.
const GEMINI_EXE = process.env.AIOS_GEMINI_BIN
  || (process.platform === 'win32' ? 'gemini.cmd' : 'gemini');

const JARVIS_SELF = path.join(__dirname, '..', '..', 'core', 'jarvis', 'self-consultation.js');
const JARVIS_ENGINE = path.join(__dirname, '..', '..', 'core', 'jarvis', 'consultation-engine.js');

// Optional: reuse the existing Flash/Pro selector (graceful — bridge must work even if absent).
let GeminiModelSelector = null;
try {
  ({ GeminiModelSelector } = require('../../core/orchestration/gemini-model-selector'));
} catch {
  GeminiModelSelector = null;
}

// Default Gemini model when neither --model nor the selector resolves one.
const GEMINI_DEFAULT_MODEL = 'gemini-2.0-flash';

// Map the shared --sandbox flag to Gemini's --approval-mode vocabulary.
const GEMINI_APPROVAL = {
  'read-only': 'plan',
  'workspace-write': 'auto_edit',
  'danger-full-access': 'yolo',
};

function parseArgs(argv) {
  const opts = { to: 'codex', sandbox: 'read-only', limit: '3', _positional: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--to') opts.to = argv[++i];
    else if (a === '--model') opts.model = argv[++i];
    else if (a === '--sandbox') opts.sandbox = argv[++i];
    else if (a === '--effort') opts.effort = argv[++i];
    else if (a === '--topic') opts.topic = argv[++i];
    else if (a === '--expert') opts.expert = argv[++i];
    else if (a === '--project') opts.project = argv[++i];
    else if (a === '--agent') opts.agent = argv[++i];
    else if (a === '--limit') opts.limit = argv[++i];
    else if (a === '--json') opts.json = true;
    else opts._positional.push(a);
  }
  return opts;
}

function readStdin() {
  try {
    return require('fs').readFileSync(0, 'utf8').trim();
  } catch {
    return '';
  }
}

function delegateToCodex(opts) {
  const promptArg = opts._positional.filter((p) => p !== '-').join(' ').trim();
  const stdinTask = (promptArg === '' || opts._positional.includes('-')) ? readStdin() : '';
  const task = promptArg || stdinTask;
  if (!task) {
    console.error('delegate --to codex: no task provided (arg or stdin)');
    process.exit(1);
  }

  const args = ['exec', '--sandbox', opts.sandbox, '--skip-git-repo-check'];
  if (opts.model) args.push('-c', `model="${opts.model}"`);
  if (opts.effort) args.push('-c', `model_reasoning_effort="${opts.effort}"`);
  if (opts.json) args.push('--json');
  args.push(task);

  const res = spawnSync(CODEX_EXE, args, { stdio: 'inherit', encoding: 'utf8' });
  process.exit(res.status === null ? 1 : res.status);
}

function geminiAuthConfigured() {
  // Env-based auth (any of these is enough for the Gemini CLI).
  if (process.env.GEMINI_API_KEY
    || process.env.GOOGLE_GENAI_USE_VERTEXAI
    || process.env.GOOGLE_GENAI_USE_GCA) {
    return true;
  }
  // File-based auth (~/.gemini/settings.json).
  try {
    const home = process.env.USERPROFILE || process.env.HOME || '';
    return require('fs').existsSync(path.join(home, '.gemini', 'settings.json'));
  } catch {
    return false;
  }
}

function resolveGeminiModel(opts, task) {
  // 1) Explicit override always wins.
  if (opts.model) return opts.model;
  // 2) Use the Flash/Pro selector when available (by agent role + task complexity).
  if (GeminiModelSelector) {
    try {
      const selector = new GeminiModelSelector();
      const sel = selector.selectModel(task, opts.agent || null);
      if (sel && sel.model) return sel.model;
    } catch {
      // fall through to default
    }
  }
  // 3) Cheapest sensible default.
  return GEMINI_DEFAULT_MODEL;
}

function delegateToGemini(opts) {
  const promptArg = opts._positional.filter((p) => p !== '-').join(' ').trim();
  const stdinTask = (promptArg === '' || opts._positional.includes('-')) ? readStdin() : '';
  const task = promptArg || stdinTask;
  if (!task) {
    console.error('delegate --to gemini: no task provided (arg or stdin)');
    process.exit(1);
  }

  // Pre-flight: the Gemini CLI prints an auth notice but exits 0, so a silent
  // success would otherwise look like a real (empty) answer. Warn loudly.
  if (!geminiAuthConfigured()) {
    console.error('⚠️  Gemini CLI auth not detected. Set GEMINI_API_KEY (or GOOGLE_GENAI_USE_VERTEXAI /');
    console.error('⚠️  GOOGLE_GENAI_USE_GCA), or configure ~/.gemini/settings.json. The call will return an');
    console.error('⚠️  auth notice instead of an answer (and the CLI still exits 0).\n');
  }

  const model = resolveGeminiModel(opts, task);
  const approval = GEMINI_APPROVAL[opts.sandbox] || 'plan';

  const args = ['-m', model, '--approval-mode', approval];
  if (opts.json) args.push('-o', 'json');
  args.push('-p', task); // -p value passed as a discrete argv entry → no shell, no injection.

  console.error(`→ gemini (${model}, approval=${approval})`);
  const res = spawnSync(GEMINI_EXE, args, { stdio: 'inherit', encoding: 'utf8' });
  process.exit(res.status === null ? 1 : res.status);
}

function delegateToJarvis(opts) {
  // If --expert given → consult single; if --topic given → search; else recommend
  let args;
  if (opts.expert) {
    const question = opts._positional.join(' ').trim();
    args = [JARVIS_SELF, 'consult', '--expert', opts.expert, '--question', question];
    if (opts.project) args.push('--project', opts.project);
    if (opts.agent) args.push('--agent', opts.agent);
  } else if (opts.topic) {
    args = [JARVIS_ENGINE, 'search', '--topic', opts.topic, '--limit', opts.limit];
  } else {
    const question = opts._positional.join(' ').trim();
    args = [JARVIS_SELF, 'conclave', '--question', question, '--experts', opts.limit];
    if (opts.project) args.push('--project', opts.project);
    if (opts.agent) args.push('--agent', opts.agent);
  }

  const res = spawnSync('node', args, { stdio: 'inherit', encoding: 'utf8' });
  process.exit(res.status === null ? 1 : res.status);
}

function delegateToClaude(opts) {
  // `claude -p` is PROGRAMMATIC usage: post-2026-06-15 it draws the SEPARATE Agent SDK
  // credit pool (full API rates, no rollover) — NOT your interactive subscription.
  // Interactive Claude (you type in the terminal/IDE) is unchanged and is preferred for
  // long reasoning. For bulk/automation use --to codex / --to gemini. Warn, don't block.
  console.error('⚠️  --to claude runs `claude -p` (PROGRAMMATIC) → separate metered pool post-2026-06-15.');
  console.error('⚠️  For bulk/automation prefer --to codex or --to gemini. Interactive Claude is unchanged.\n');
  const task = opts._positional.filter((p) => p !== '-').join(' ').trim() || readStdin();
  if (!task) {
    console.error('delegate --to claude: no task provided');
    process.exit(1);
  }
  const res = spawnSync('claude', ['-p', task], { stdio: 'inherit', encoding: 'utf8' });
  process.exit(res.status === null ? 1 : res.status);
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  switch (opts.to) {
    case 'codex': return delegateToCodex(opts);
    case 'gemini': return delegateToGemini(opts);
    case 'jarvis': return delegateToJarvis(opts);
    case 'claude': return delegateToClaude(opts);
    default:
      console.error(`Unknown target: ${opts.to} (use codex|gemini|jarvis|claude)`);
      process.exit(1);
  }
}

main();
