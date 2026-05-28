#!/usr/bin/env node
'use strict';

const fs = require('fs-extra');
const path = require('path');
const os = require('os');

function getCodexHome() {
  return process.env.CODEX_HOME || path.join(os.homedir(), '.codex');
}

function getDefaultOptions() {
  const projectRoot = process.cwd();
  const envLocalDir = process.env.AIOS_CODEX_LOCAL_SKILLS_DIR;
  const envGlobalDir = process.env.AIOS_CODEX_GLOBAL_SKILLS_DIR;
  return {
    projectRoot,
    localSkillsDir: envLocalDir || path.join(projectRoot, '.codex', 'skills'),
    globalSkillsDir: envGlobalDir || path.join(getCodexHome(), 'skills'),
    global: false,
    globalOnly: false,
    dryRun: false,
    quiet: false,
  };
}

function buildSkillPlan(skillsDir) {
  return {
    skillsDir,
    generated: 0,
    message:
      'Codex agent activator generation is disabled. Agents sync to .codex/agents; .codex/skills is reserved for real reusable skills.',
  };
}

function syncSkills(options = {}) {
  const resolved = { ...getDefaultOptions(), ...options };
  if (resolved.globalOnly) {
    resolved.global = true;
  }

  if (!resolved.globalOnly && !resolved.dryRun) {
    fs.ensureDirSync(resolved.localSkillsDir);
  }

  if (resolved.global && !resolved.dryRun) {
    fs.ensureDirSync(resolved.globalSkillsDir);
  }

  const plan = buildSkillPlan(resolved.localSkillsDir);
  return {
    generated: plan.generated,
    localSkillsDir: resolved.localSkillsDir,
    globalSkillsDir: resolved.global || resolved.globalOnly ? resolved.globalSkillsDir : null,
    dryRun: resolved.dryRun,
    message: plan.message,
  };
}

function parseArgs(argv = process.argv.slice(2)) {
  const args = new Set(argv);
  return {
    global: args.has('--global'),
    globalOnly: args.has('--global-only'),
    dryRun: args.has('--dry-run'),
    quiet: args.has('--quiet') || args.has('-q'),
  };
}

function main() {
  const options = parseArgs();
  const result = syncSkills(options);

  if (!options.quiet) {
    if (!options.globalOnly) {
      console.log(`Codex skills directory ready: ${result.localSkillsDir}`);
    }
    if (result.globalSkillsDir) {
      console.log(`Codex global skills directory ready: ${result.globalSkillsDir}`);
    }
    console.log(result.message);
    if (result.dryRun) {
      console.log('Dry-run mode: no files written');
    }
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  buildSkillPlan,
  syncSkills,
  parseArgs,
  getCodexHome,
};
