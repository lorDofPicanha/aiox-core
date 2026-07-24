#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const { parseAgentDirs } = require('../ide-sync/agent-parser');

const ALLOWED_EXTRA_SKILLS = new Set([
  // Migration archive skill: preserves Claude-era project memory for Codex.
  'aios-memory',
]);

function getDefaultOptions() {
  const projectRoot = process.cwd();
  return {
    projectRoot,
    sourceDirs: [
      path.join(projectRoot, '.aios-core', 'development', 'agents'),
      path.join(projectRoot, '.codex', 'agents'),
    ],
    skillsDir: path.join(projectRoot, '.codex', 'skills'),
    strict: false,
    quiet: false,
    json: false,
  };
}

function parseArgs(argv = process.argv.slice(2)) {
  const args = new Set(argv);
  return {
    strict: args.has('--strict'),
    quiet: args.has('--quiet') || args.has('-q'),
    json: args.has('--json'),
  };
}

function isParsableAgent(agent) {
  return !agent.error || agent.error === 'YAML parse failed, using fallback extraction';
}

function getAgentSkillId(agentId) {
  const id = String(agentId || '').trim();
  return id.startsWith('aios-') ? id : `aios-${id}`;
}

function listSkillDirs(skillsDir) {
  if (!fs.existsSync(skillsDir)) return [];
  return fs.readdirSync(skillsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .filter((entry) => fs.existsSync(path.join(skillsDir, entry.name, 'SKILL.md')))
    .map((entry) => entry.name);
}

function isAgentActivatorSkill(content, agent) {
  return (
    content.includes(`.aios-core/development/agents/${agent.filename}`) ||
    content.includes(`generate-greeting.js ${agent.agentId}`) ||
    (content.includes('Activator') && content.includes('Activation Protocol') && content.includes('source of truth'))
  );
}

function validateCodexSkills(options = {}) {
  const resolved = { ...getDefaultOptions(), ...options };
  const errors = [];
  const warnings = [];

  if (!fs.existsSync(resolved.skillsDir)) {
    errors.push(`Skills directory not found: ${resolved.skillsDir}`);
    return { ok: false, checked: 0, errors, warnings, forbiddenAgentSkills: [] };
  }

  const agents = parseAgentDirs(resolved.sourceDirs).filter(isParsableAgent);
  const agentBySkillId = new Map(
    agents.map((agent) => [
      getAgentSkillId(agent.id),
      {
        agentId: agent.id,
        filename: agent.filename,
      },
    ]),
  );

  const forbiddenAgentSkills = [];
  for (const skillId of listSkillDirs(resolved.skillsDir)) {
    const skillPath = path.join(resolved.skillsDir, skillId, 'SKILL.md');
    let content = '';
    try {
      content = fs.readFileSync(skillPath, 'utf8');
    } catch (error) {
      errors.push(`${skillId}: unable to read skill file (${error.message})`);
      continue;
    }

    const matchingAgent = agentBySkillId.get(skillId);
    if (matchingAgent && isAgentActivatorSkill(content, matchingAgent)) {
      forbiddenAgentSkills.push(skillId);
      errors.push(
        `${skillId}: agent activator stored as a skill; keep the agent in .codex/agents and reserve .codex/skills for reusable skills`,
      );
      continue;
    }

    if (resolved.strict && skillId.startsWith('aios-') && !ALLOWED_EXTRA_SKILLS.has(skillId) && matchingAgent) {
      forbiddenAgentSkills.push(skillId);
      errors.push(`${skillId}: agent-like skill id is not allowed in strict mode`);
    }
  }

  if (agents.length === 0) {
    warnings.push('No parseable agents found in sourceDirs');
  }

  return {
    ok: errors.length === 0,
    checked: listSkillDirs(resolved.skillsDir).length,
    errors,
    warnings,
    forbiddenAgentSkills,
  };
}

function formatHumanReport(result) {
  if (result.ok) {
    return `Codex skills validation passed (${result.checked} skill(s) checked; agent activators forbidden)`;
  }

  const lines = [
    `Codex skills validation failed (${result.errors.length} issue(s))`,
    ...result.errors.map((error) => `- ${error}`),
  ];

  if (result.warnings.length > 0) {
    lines.push(...result.warnings.map((warning) => `Warning: ${warning}`));
  }
  return lines.join('\n');
}

function main() {
  const args = parseArgs();
  const result = validateCodexSkills(args);

  if (!args.quiet) {
    if (args.json) {
      console.log(JSON.stringify(result, null, 2));
    } else {
      console.log(formatHumanReport(result));
    }
  }

  if (!result.ok) {
    process.exitCode = 1;
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  validateCodexSkills,
  parseArgs,
  getDefaultOptions,
  getAgentSkillId,
};
