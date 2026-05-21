#!/usr/bin/env node
/**
 * Hook: Jarvis Auto-Consultation Gate
 *
 * Intercepts user prompts and detects decision triggers that require
 * Mind Clone consultation before proceeding.
 *
 * When a trigger is detected, outputs a reminder to stdout that gets
 * injected into the conversation context.
 *
 * Event: user_prompt_submit
 * Exit: 0 (never blocks — advisory only)
 *
 * @module jarvis-auto-consult-hook
 * @version 1.0.0
 */

'use strict';

const fs = require('fs');
const path = require('path');

// =====================================================
// CONFIGURATION
// =====================================================

const BRIDGE_DATA = 'D:/jarvis/bridge-data';
const GATE_FILE = path.join(BRIDGE_DATA, '.gate-reminder.md');
const CONSULT_LOG = path.join(BRIDGE_DATA, '.last-consult.json');

/** How many minutes a consultation stays "fresh" (skip re-consulting) */
const CONSULT_FRESHNESS_MINUTES = 30;

/** Decision trigger keywords (case-insensitive) */
const TRIGGER_KEYWORDS = [
  // Story & PRD
  'create-story', 'criar story', 'nova story', 'create story',
  'create-doc prd', 'criar prd', 'novo prd', 'new prd',
  // Architecture
  'arquitetura', 'architecture', 'tech stack', 'stack tecnico',
  'design system', 'system design', 'infrastructure',
  // Pricing & Offers
  'pricing', 'precificacao', 'oferta', 'offer', 'monetization',
  'monetizacao', 'plano de precos',
  // Security
  'security', 'seguranca', 'auth', 'autenticacao', 'lgpd', 'hipaa',
  'compliance', 'encryption',
  // UX
  'wireframe', 'user journey', 'jornada do usuario', 'fluxo ux',
  'prototipo', 'prototype',
  // Database
  'schema design', 'migration', 'database design', 'modelo de dados',
  'data model', 'rls policy',
  // Strategic
  'estrategia', 'strategy', 'roadmap', 'gtm', 'go-to-market',
  'posicionamento', 'positioning',
];

/** Skip patterns — don't trigger on these */
const SKIP_PATTERNS = [
  /^(hi|hello|oi|ola|hey|bom dia|boa tarde|boa noite)/i,
  /^(git |npm |ls |cd |cat )/i,
  /typo|formatting|formata/i,
  /skip consult|sem consult|pular consult/i,
  /hotfix|emergency|urgente/i,
  /\*help|\*exit|\*status/i,
  /^\/\w+$/,  // slash commands alone
];

/** Agent-to-expert mapping for quick lookup */
const AGENT_EXPERTS = {
  'architect': ['martin-fowler', 'werner-vogels'],
  'pm': ['eric-ries', 'april-dunford'],
  'dev': ['sarah-drasner', 'simon-willison'],
  'qa': ['gene-kim', 'martin-fowler'],
  'po': ['nir-eyal', 'julie-zhuo'],
  'sm': ['will-larson', 'patty-mccord'],
  'analyst': ['cassie-kozyrkov', 'aswath-damodaran'],
  'data-engineer': ['martin-fowler', 'chip-huyen'],
  'ux-design-expert': ['don-norman', 'dieter-rams'],
  'devops': ['gene-kim', 'kelsey-hightower'],
};

// =====================================================
// LOGIC
// =====================================================

function readStdin() {
  return new Promise((resolve, reject) => {
    let data = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('error', (e) => reject(e));
    process.stdin.on('data', (chunk) => { data += chunk; });
    process.stdin.on('end', () => {
      try { resolve(JSON.parse(data)); }
      catch (e) { reject(e); }
    });
  });
}

function detectTrigger(prompt) {
  const lower = prompt.toLowerCase();

  // Check skip patterns first
  for (const pattern of SKIP_PATTERNS) {
    if (pattern.test(prompt)) return null;
  }

  // Check triggers
  for (const keyword of TRIGGER_KEYWORDS) {
    if (lower.includes(keyword)) {
      return keyword;
    }
  }

  return null;
}

function detectAgent(prompt) {
  const match = prompt.match(/@(\w[\w-]*)/);
  if (match && AGENT_EXPERTS[match[1]]) {
    return match[1];
  }
  return null;
}

function isConsultFresh() {
  try {
    if (!fs.existsSync(CONSULT_LOG)) return false;
    const data = JSON.parse(fs.readFileSync(CONSULT_LOG, 'utf8'));
    const lastConsult = new Date(data.timestamp);
    const now = new Date();
    const diffMin = (now - lastConsult) / 60000;
    return diffMin < CONSULT_FRESHNESS_MINUTES;
  } catch {
    return false;
  }
}

function writeGateReminder(trigger, agent, experts) {
  try {
    fs.mkdirSync(path.dirname(GATE_FILE), { recursive: true });
    const content = [
      `# Jarvis Consultation Reminder`,
      ``,
      `**Trigger detected:** \`${trigger}\``,
      `**Agent:** ${agent || 'unknown'}`,
      `**Recommended experts:** ${experts.join(', ')}`,
      `**Time:** ${new Date().toISOString()}`,
      ``,
      `## Action Required`,
      ``,
      `Run auto-conclave before proceeding:`,
      '```bash',
      `node .aios-core/core/jarvis/self-consultation.js conclave --question "{your question}" --project {project} --agent ${agent || 'aios'}`,
      '```',
      ``,
      `Or consult specific experts:`,
      experts.map(e => `- \`node .aios-core/core/jarvis/self-consultation.js consult --expert "${e}" --question "{question}" --project {project} --agent ${agent || 'aios'}\``).join('\n'),
      ``,
      `After consulting, this reminder will be cleared automatically.`,
    ].join('\n');

    fs.writeFileSync(GATE_FILE, content, 'utf8');
  } catch (e) {
    process.stderr.write(`[jarvis-hook] Failed to write gate reminder: ${e.message}\n`);
  }
}

async function main() {
  try {
    const input = await readStdin();
    const prompt = input.user_prompt || '';

    if (!prompt || prompt.length < 5) {
      process.exit(0);
    }

    // Check if recent consultation exists
    if (isConsultFresh()) {
      process.exit(0);
    }

    const trigger = detectTrigger(prompt);
    if (!trigger) {
      process.exit(0);
    }

    const agent = detectAgent(prompt);
    const experts = agent && AGENT_EXPERTS[agent]
      ? AGENT_EXPERTS[agent]
      : ['martin-fowler', 'alex-hormozi', 'seth-godin'];

    // Write gate reminder file
    writeGateReminder(trigger, agent, experts);

    // Output context injection to stdout
    const output = [
      `<jarvis-gate>`,
      `DECISION TRIGGER DETECTED: "${trigger}"`,
      ``,
      `Before proceeding, consider consulting Jarvis Mind Clones:`,
      `- Recommended experts: ${experts.join(', ')}`,
      `- Run: node .aios-core/core/jarvis/self-consultation.js conclave --question "{decision}" --project {project} --agent ${agent || 'aios'}`,
      `- Or use /expert-consult for interactive consultation`,
      ``,
      `Skip with: "skip consultation" or "sem consulta" in your prompt.`,
      `</jarvis-gate>`,
    ].join('\n');

    process.stdout.write(output);
    process.exit(0);
  } catch (e) {
    // Never block — fail silently
    process.stderr.write(`[jarvis-hook] Error: ${e.message}\n`);
    process.exit(0);
  }
}

main();
