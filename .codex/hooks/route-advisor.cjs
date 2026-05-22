#!/usr/bin/env node
/**
 * Hook: Task Route Advisor (advisory, gated)
 *
 * Intercepts user prompts and suggests the best brain/CLI for the task using
 * the CLI-agnostic router (.aios-core/infrastructure/scripts/route.js).
 *
 * Advisory ONLY — never blocks (exit 0), never auto-executes. It just injects a
 * one-line suggestion into context. The human/agent decides.
 *
 * Event: user_prompt_submit
 * Disable: set AIOS_ROUTE_HOOK=0
 * Noise control: skips acks/greetings/slash-commands and prompts < 4 words;
 *   defers `current` (trivial) and `jarvis` (handled by jarvis-auto-consult).
 *
 * @module route-advisor-hook
 * @version 1.0.0
 */

'use strict';

const path = require('path');
const { spawnSync } = require('child_process');

const ROUTE = path.join(__dirname, '..', '..', '.aios-core', 'infrastructure', 'scripts', 'route.js');

const SKIP = [
  /^\s*(sim|n[ãa]o|ok|okay|blz|beleza|valeu|vlw|isso|certo|continue|continua|vai|segue|pode|aham|t[aá])\s*[.!]?\s*$/i,
  /^\s*(oi|ol[áa]|hi|hello|hey|bom dia|boa tarde|boa noite|e a[íi])/i,
  /^\s*[*/]\w+/,            // slash or star commands
  /skip route|sem rota|n[ãa]o roteia/i,
];

function readStdinRaw() {
  return new Promise((resolve) => {
    let data = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (c) => { data += c; });
    process.stdin.on('end', () => resolve(data));
    process.stdin.on('error', () => resolve(''));
  });
}

async function main() {
  try {
    if (process.env.AIOS_ROUTE_HOOK === '0') process.exit(0);

    const raw = await readStdinRaw();
    let prompt = '';
    try { const j = JSON.parse(raw); prompt = j.user_prompt || j.prompt || ''; }
    catch { prompt = raw; }

    const trimmed = (prompt || '').trim();
    if (trimmed.length < 12) process.exit(0);
    if (trimmed.split(/\s+/).length < 4) process.exit(0);
    for (const re of SKIP) if (re.test(trimmed)) process.exit(0);

    const res = spawnSync('node', [ROUTE, '--json', trimmed], { encoding: 'utf8' });
    if (res.status !== 0 || !res.stdout) process.exit(0);

    let rec;
    try { rec = JSON.parse(res.stdout); } catch { process.exit(0); }

    const t = rec.target;
    // Reduce noise: trivial stays here; jarvis already covered by jarvis-auto-consult.
    if (t === 'current' || t === 'jarvis') process.exit(0);

    const lines = ['<route-advisor>'];
    if (t === 'claude') {
      lines.push('🧭 Rota sugerida: CLAUDE (interativo) — raciocínio profundo / alto risco.');
      lines.push('   Considere resolver numa sessão Claude interativa e trazer o output. NUNCA claude -p.');
    } else {
      lines.push(`🧭 Rota sugerida: ${t.toUpperCase()} — ${rec.reason}`);
      if (rec.command) lines.push(`   ▶ ${rec.command}`);
    }
    lines.push('   (advisory — você decide. Desligar: AIOS_ROUTE_HOOK=0)');
    lines.push('</route-advisor>');

    process.stdout.write(lines.join('\n'));
    process.exit(0);
  } catch (e) {
    process.stderr.write(`[route-advisor] ${e.message}\n`);
    process.exit(0);
  }
}

main();
