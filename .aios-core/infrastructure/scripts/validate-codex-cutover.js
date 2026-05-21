#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const { spawnSync } = require('child_process');
const { validateCodexIntegration } = require('./validate-codex-integration');
const { validateCodexSkills } = require('./codex-skills-sync/validate');
const { validatePaths } = require('./validate-paths');

function parseArgs(argv = process.argv.slice(2)) {
  const contractArg = argv.find((arg) => arg.startsWith('--contract='));
  const args = new Set(argv.filter((arg) => !arg.startsWith('--contract=')));
  return {
    json: args.has('--json'),
    quiet: args.has('--quiet') || args.has('-q'),
    contractPath: contractArg ? contractArg.slice('--contract='.length) : null,
  };
}

function defaultContractPath(projectRoot) {
  return path.join(
    projectRoot,
    '.aios-core',
    'infrastructure',
    'contracts',
    'compatibility',
    'codex-cutover-2026-05.yaml',
  );
}

function loadContract(contractPath) {
  const raw = fs.readFileSync(contractPath, 'utf8');
  return yaml.load(raw);
}

function resolveCommand(command, args) {
  if (process.platform !== 'win32' || command !== 'codex') {
    return { command, args };
  }

  const pathEntries = (process.env.PATH || '').split(path.delimiter).filter(Boolean);
  for (const entry of pathEntries) {
    const candidate = path.join(entry, 'codex.ps1');
    if (fs.existsSync(candidate)) {
      return {
        command: 'powershell.exe',
        args: ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', candidate, ...args],
      };
    }
  }

  return { command, args };
}

function runCommand(id, command, args, projectRoot, validate = () => ({ ok: true }), options = {}) {
  const invocation = resolveCommand(command, args);
  const result = spawnSync(invocation.command, invocation.args, {
    cwd: projectRoot,
    encoding: 'utf8',
    timeout: options.timeout || 180000,
  });
  const output = `${result.stdout || ''}${result.stderr || ''}`;
  let validation;

  if (result.status === 0) {
    validation = validate(output);
  } else if (result.error && result.error.code === 'ETIMEDOUT') {
    validation = { ok: false, errors: [`${command} ${args.join(' ')} timed out after ${options.timeout || 180000}ms`] };
  } else if (result.error) {
    validation = { ok: false, errors: [`${command} ${args.join(' ')} failed: ${result.error.message}`] };
  } else {
    validation = { ok: false, errors: [`${command} ${args.join(' ')} exited ${result.status}`] };
  }

  return {
    id,
    ok: result.status === 0 && validation.ok,
    errors: validation.errors || [],
    warnings: validation.warnings || [],
    output,
  };
}

function normalize(id, result) {
  return {
    id,
    ok: Boolean(result && result.ok),
    errors: Array.isArray(result && result.errors) ? result.errors : [],
    warnings: Array.isArray(result && result.warnings) ? result.warnings : [],
    metrics: (result && result.metrics) || {},
  };
}

function runCodexCutoverValidation(options = {}) {
  const projectRoot = options.projectRoot || process.cwd();
  const contractPath = options.contractPath
    ? path.resolve(projectRoot, options.contractPath)
    : defaultContractPath(projectRoot);
  const contract = loadContract(contractPath);

  const checks = [
    runCommand(
      'codex-sync',
      'node',
      ['.aios-core/infrastructure/scripts/ide-sync/index.js', 'validate', '--ide', 'codex', '--strict'],
      projectRoot,
    ),
    normalize('codex-integration', validateCodexIntegration({ projectRoot })),
    normalize('codex-skills', validateCodexSkills({ projectRoot, strict: true, quiet: true })),
    normalize('paths', validatePaths({ projectRoot })),
    runCommand('codex-doctor', 'codex', ['doctor'], projectRoot, (output) => {
      const degradedMatch = output.match(/(\d+)\s+fail degraded/i);
      const degraded = degradedMatch ? Number.parseInt(degradedMatch[1], 10) > 0 : /fail degraded/i.test(output);
      const okSummary = /\b11 ok\b/i.test(output) || /\d+\s+ok/i.test(output);
      return {
        ok: !degraded && okSummary,
        errors: degraded ? ['codex doctor reported degraded checks'] : [],
        warnings: okSummary ? [] : ['codex doctor summary did not include an ok count'],
      };
    }, { timeout: 300000 }),
    runCommand(
      'codex-exec-smoke',
      'codex',
      [
        'exec',
        '--dangerously-bypass-approvals-and-sandbox',
        '--dangerously-bypass-hook-trust',
        'Responda exatamente: codex-cutover-smoke',
      ],
      projectRoot,
      (output) => ({
        ok: output.includes('codex-cutover-smoke'),
        errors: output.includes('codex-cutover-smoke')
          ? []
          : ['codex exec smoke did not return expected marker'],
      }),
      { timeout: 600000 },
    ),
  ];

  const required = Array.isArray(contract.required_checks) ? contract.required_checks : [];
  const byId = Object.fromEntries(checks.map((check) => [check.id, check]));
  const contractViolations = [];

  for (const id of required) {
    if (!byId[id]) {
      contractViolations.push(`contract requires unknown check "${id}"`);
      continue;
    }
    if (!byId[id].ok) {
      contractViolations.push(`required check "${id}" failed`);
    }
  }

  const mcpCount = extractMcpCount(byId['codex-doctor']?.output || '');
  if (
    Number.isInteger(contract.required_mcp_servers) &&
    mcpCount !== null &&
    mcpCount < contract.required_mcp_servers
  ) {
    contractViolations.push(
      `codex doctor reported ${mcpCount} MCP servers; expected at least ${contract.required_mcp_servers}`,
    );
  }

  return {
    ok: contractViolations.length === 0,
    contract: {
      release: contract.release || null,
      path: path.relative(projectRoot, contractPath),
      required_checks: required,
      required_mcp_servers: contract.required_mcp_servers,
    },
    checks,
    mcp_servers_detected: mcpCount,
    contractViolations,
  };
}

function extractMcpCount(output) {
  const match = output.match(/MCP servers\s+(\d+)/i) || output.match(/mcp\s+(\d+)\s+server/i);
  return match ? Number.parseInt(match[1], 10) : null;
}

function formatHumanReport(result) {
  const lines = [];
  lines.push(`Codex Cutover Contract: ${result.contract.release} (${result.contract.path})`);
  lines.push('');
  for (const check of result.checks) {
    lines.push(`${check.ok ? 'PASS' : 'FAIL'} ${check.id}`);
    for (const warning of check.warnings || []) lines.push(`WARN ${warning}`);
    for (const error of check.errors || []) lines.push(`- ${error}`);
  }
  if (result.mcp_servers_detected !== null) {
    lines.push(`MCP servers detected: ${result.mcp_servers_detected}`);
  }
  if (result.contractViolations.length > 0) {
    lines.push('');
    lines.push('FAIL Codex Cutover Contract Violations');
    for (const violation of result.contractViolations) lines.push(`- ${violation}`);
  }
  lines.push('');
  lines.push(result.ok ? 'PASS Codex cutover validation passed' : 'FAIL Codex cutover validation failed');
  return lines.join('\n');
}

function main() {
  const args = parseArgs();
  const result = runCodexCutoverValidation(args);

  if (!args.quiet) {
    console.log(args.json ? JSON.stringify(result, null, 2) : formatHumanReport(result));
  }

  if (!result.ok) {
    process.exitCode = 1;
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  parseArgs,
  runCodexCutoverValidation,
  extractMcpCount,
  formatHumanReport,
};
