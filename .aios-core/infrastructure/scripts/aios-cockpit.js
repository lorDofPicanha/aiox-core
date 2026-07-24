#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROUTER = path.join(__dirname, 'route.js');
const HANDOFF_DIR = path.join(__dirname, '..', '..', 'tmp', 'route-handoff');

function usage() {
  console.log(`AIOS Cockpit

Usage:
  aios "task"                  Route a task
  aios route "task"            Show recommended route
  aios run "task" [--write]    Route and execute when target supports it
  aios status                  Show recent route handoffs
  aios inbox                   Show pending Claude interactive handoffs
  aios resume <handoff-id>     Show handoff output path

Flags:
  --write       Allow workspace-write for delegated Codex/Gemini execution
  --allow-paid  Reserved for paid provider paths; currently advisory only
`);
}

function stripKnownFlags(args) {
  return args.filter((arg) => arg !== '--write' && arg !== '--allow-paid');
}

function runNodeScript(script, args, options = {}) {
  const res = spawnSync(process.execPath, [script, ...args], {
    stdio: options.stdio || 'inherit',
    encoding: 'utf8',
  });
  return res.status === null ? 1 : res.status;
}

function routeTask(taskArgs, execute) {
  const cleaned = stripKnownFlags(taskArgs);
  if (cleaned.length === 0) {
    usage();
    return 1;
  }

  const routerArgs = execute ? ['--exec', ...cleaned] : cleaned;
  return runNodeScript(ROUTER, routerArgs);
}

function listHandoffs() {
  if (!fs.existsSync(HANDOFF_DIR)) {
    console.log('No Claude handoffs found.');
    return [];
  }

  return fs.readdirSync(HANDOFF_DIR)
    .filter((name) => name.endsWith('.md') && !name.endsWith('.output.md'))
    .sort()
    .reverse()
    .map((name) => {
      const fullPath = path.join(HANDOFF_DIR, name);
      const outputPath = fullPath.replace(/\.md$/, '.output.md');
      return {
        id: path.basename(name, '.md'),
        file: fullPath,
        output: outputPath,
        hasOutput: fs.existsSync(outputPath),
      };
    });
}

function printStatus() {
  const handoffs = listHandoffs();
  if (handoffs.length === 0) return 0;

  console.log('Recent AIOS route handoffs:');
  for (const item of handoffs.slice(0, 10)) {
    const state = item.hasOutput ? 'output-ready' : 'pending';
    console.log(`- ${item.id} [${state}]`);
    console.log(`  prompt: ${item.file}`);
    console.log(`  output: ${item.output}`);
  }
  return 0;
}

function resumeHandoff(id) {
  if (!id) {
    console.error('resume: missing handoff id');
    return 1;
  }

  const file = path.join(HANDOFF_DIR, `${id}.md`);
  const output = path.join(HANDOFF_DIR, `${id}.output.md`);
  if (!fs.existsSync(file)) {
    console.error(`resume: handoff not found: ${id}`);
    return 1;
  }

  console.log(`Prompt: ${file}`);
  console.log(`Output: ${output}`);
  if (fs.existsSync(output)) {
    console.log('');
    console.log(fs.readFileSync(output, 'utf8'));
  }
  return 0;
}

function main(argv = process.argv.slice(2)) {
  const [command, ...rest] = argv;

  if (!command || command === '--help' || command === '-h') {
    usage();
    return 0;
  }

  if (command === 'route') return routeTask(rest, false);
  if (command === 'run') return routeTask(rest, true);
  if (command === 'status' || command === 'inbox') return printStatus();
  if (command === 'resume') return resumeHandoff(rest[0]);

  return routeTask(argv, false);
}

if (require.main === module) {
  process.exit(main());
}

module.exports = { main };
