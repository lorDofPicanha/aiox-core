'use strict';

const fs = require('fs');
const fsp = require('fs').promises;
const path = require('path');

function candidatePaths(agentId, projectRoot = process.cwd()) {
  const safeId = String(agentId || '').trim();
  if (!safeId) {
    return [];
  }

  return [
    path.join(projectRoot, '.aios-core', 'development', 'agents', `${safeId}.md`),
    path.join(projectRoot, '.codex', 'agents', `${safeId}.md`),
    path.join(projectRoot, '.claude', 'agents', `${safeId}.md`),
    path.join(projectRoot, '.claude', 'commands', 'AIOS', 'agents', `${safeId}.md`),
    path.join(projectRoot, '.codex', 'prompts', `${safeId}.md`),
  ];
}

async function resolveAgentPathAsync(agentId, options = {}) {
  const projectRoot = options.projectRoot || process.cwd();

  for (const candidate of candidatePaths(agentId, projectRoot)) {
    try {
      const stat = await fsp.stat(candidate);
      if (stat.isFile()) {
        return candidate;
      }
    } catch {
      // Try next candidate.
    }
  }

  return null;
}

function resolveAgentPath(agentId, options = {}) {
  const projectRoot = options.projectRoot || process.cwd();

  for (const candidate of candidatePaths(agentId, projectRoot)) {
    try {
      if (fs.statSync(candidate).isFile()) {
        return candidate;
      }
    } catch {
      // Try next candidate.
    }
  }

  return null;
}

module.exports = {
  candidatePaths,
  resolveAgentPath,
  resolveAgentPathAsync,
};
