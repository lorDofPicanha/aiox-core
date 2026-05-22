#!/usr/bin/env node
/**
 * AIOS Agent Call - small unified entrypoint for invoking AIOS agents.
 *
 * Usage:
 *   node .aios-core/infrastructure/scripts/agent-call.js aios-master "task"
 *   node .aios-core/infrastructure/scripts/agent-call.js kasim-aslam "review campaign"
 *   node .aios-core/infrastructure/scripts/agent-call.js --list
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const AIOS_ROOT = path.resolve(__dirname, '..', '..', '..');
const DELEGATE = path.join(__dirname, 'delegate.js');
const INDEX_FILE = path.join(AIOS_ROOT, '.aios-core', 'data', 'jarvis-mind-clone-index.json');
const MEMORY_CLI = path.join(AIOS_ROOT, '.aios-core', 'core', 'memory', 'aios-memory.js');

const CODEX_EXEC_AGENTS = new Set([
  'aios-master',
  'analyst',
  'architect',
  'data-engineer',
  'dev',
  'devops',
  'pm',
  'po',
  'qa',
  'sm',
  'squad-creator',
  'ux-design-expert',
]);

function usage() {
  console.log(`AIOS Agent Call

Usage:
  node .aios-core/infrastructure/scripts/agent-call.js <agent-id> <task>
  node .aios-core/infrastructure/scripts/agent-call.js --list

Examples:
  node .aios-core/infrastructure/scripts/agent-call.js aios-master "organize os squads"
  node .aios-core/infrastructure/scripts/agent-call.js kasim-aslam "avalie campanha Google Tocks"
  node .aios-core/infrastructure/scripts/agent-call.js traffic-masters-chief "audite marketing-traffic"
`);
}

function loadAgents() {
  const data = JSON.parse(fs.readFileSync(INDEX_FILE, 'utf8'));
  return Array.isArray(data) ? data : data.agents || [];
}

function normalizeAgentId(id) {
  return String(id || '')
    .trim()
    .replace(/^[@$]/, '')
    .replace(/^aios:/, '');
}

function listAgents() {
  const agents = loadAgents().sort((a, b) => a.id.localeCompare(b.id));
  for (const agent of agents) {
    console.log(`${agent.id}\t${agent.source}\t${agent.department || 'general'}`);
  }
}

function runNode(args) {
  const res = spawnSync('node', args, {
    cwd: AIOS_ROOT,
    stdio: 'inherit',
    encoding: 'utf8',
  });
  process.exit(res.status === null ? 1 : res.status);
}

function recallMemory(task) {
  if (!fs.existsSync(MEMORY_CLI)) return '';
  const res = spawnSync('node', [MEMORY_CLI, 'recall', task, '--limit', '5', '--json'], {
    cwd: AIOS_ROOT,
    encoding: 'utf8',
  });
  if (res.status !== 0 || !res.stdout.trim()) return '';
  try {
    const memories = JSON.parse(res.stdout);
    if (!Array.isArray(memories) || memories.length === 0) return '';
    return [
      'Relevant AIOS memory:',
      ...memories.map((m) => `- [${m.type || 'memory'}] ${m.title || m.id}: ${m.text || m.summary || m.decision || ''}`),
    ].join('\n');
  } catch {
    return '';
  }
}

function main(argv) {
  if (argv.length === 0 || argv.includes('--help') || argv.includes('-h')) {
    usage();
    return;
  }

  if (argv[0] === '--list') {
    listAgents();
    return;
  }

  const agentId = normalizeAgentId(argv[0]);
  const task = argv.slice(1).join(' ').trim();
  if (!agentId || !task) {
    usage();
    process.exit(1);
  }

  const agents = loadAgents();
  const agent = agents.find((a) => a.id === agentId);
  if (!agent) {
    console.error(`agent-call: agent not found: ${agentId}`);
    process.exit(1);
  }

  const memoryContext = recallMemory(task);
  const taskWithMemory = memoryContext ? `${memoryContext}\n\nTask:\n${task}` : task;

  if (CODEX_EXEC_AGENTS.has(agentId) && agent.source === 'aios-agent') {
    runNode([
      DELEGATE,
      '--to',
      'codex',
      '--sandbox',
      'workspace-write',
      `Act as @${agentId} using the AIOS agent definition and handle this task:\n\n${taskWithMemory}`,
    ]);
  }

  runNode([
    DELEGATE,
    '--to',
    'jarvis',
    '--expert',
    agentId,
    '--agent',
    'agent-call',
    taskWithMemory,
  ]);
}

main(process.argv.slice(2));
