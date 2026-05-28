'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');

const { syncSkills } = require('../../.aios-core/infrastructure/scripts/codex-skills-sync/index');
const { validateCodexSkills } = require('../../.aios-core/infrastructure/scripts/codex-skills-sync/validate');

describe('Codex Skills Validator', () => {
  let tmpRoot;
  let sourceDir;
  let skillsDir;

  beforeEach(() => {
    tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'aios-codex-validate-'));
    sourceDir = path.join(process.cwd(), '.aios-core', 'development', 'agents');
    skillsDir = path.join(tmpRoot, '.codex', 'skills');
  });

  afterEach(() => {
    fs.rmSync(tmpRoot, { recursive: true, force: true });
  });

  it('passes when the skills directory has no agent activators', () => {
    syncSkills({ localSkillsDir: skillsDir, dryRun: false });

    const memorySkill = path.join(skillsDir, 'aios-memory');
    fs.mkdirSync(memorySkill, { recursive: true });
    fs.writeFileSync(path.join(memorySkill, 'SKILL.md'), '# AIOS Memory\n\nReusable memory skill.', 'utf8');

    const result = validateCodexSkills({
      projectRoot: tmpRoot,
      sourceDirs: [sourceDir],
      skillsDir,
      strict: true,
    });

    expect(result.ok).toBe(true);
    expect(result.checked).toBe(1);
    expect(result.errors).toEqual([]);
  });

  it('fails when an AIOS agent activator exists as a skill', () => {
    syncSkills({ localSkillsDir: skillsDir, dryRun: false });
    const target = path.join(skillsDir, 'aios-dev');
    fs.mkdirSync(target, { recursive: true });
    fs.writeFileSync(
      path.join(target, 'SKILL.md'),
      [
        '---',
        'name: aios-dev',
        '---',
        '# AIOS Developer Activator',
        '## Activation Protocol',
        'Load `.aios-core/development/agents/dev.md` as source of truth.',
        'Run `node .aios-core/development/scripts/generate-greeting.js dev`.',
      ].join('\n'),
      'utf8',
    );

    const result = validateCodexSkills({
      projectRoot: tmpRoot,
      sourceDirs: [sourceDir],
      skillsDir,
      strict: true,
    });

    expect(result.ok).toBe(false);
    expect(result.forbiddenAgentSkills).toContain('aios-dev');
    expect(result.errors.some((error) => error.includes('agent activator stored as a skill'))).toBe(true);
  });

  it('allows real reusable skills that are not AIOS agent activators', () => {
    syncSkills({ localSkillsDir: skillsDir, dryRun: false });
    const target = path.join(skillsDir, 'frontend-patterns');
    fs.mkdirSync(target, { recursive: true });
    fs.writeFileSync(path.join(target, 'SKILL.md'), '# Frontend Patterns\n\nReusable frontend guidance.', 'utf8');

    const result = validateCodexSkills({
      projectRoot: tmpRoot,
      sourceDirs: [sourceDir],
      skillsDir,
      strict: true,
    });

    expect(result.ok).toBe(true);
    expect(result.checked).toBe(1);
  });

  it('fails when an agent-like aios-* skill id matches a source agent in strict mode', () => {
    syncSkills({ localSkillsDir: skillsDir, dryRun: false });
    const target = path.join(skillsDir, 'aios-architect');
    fs.mkdirSync(target, { recursive: true });
    fs.writeFileSync(path.join(target, 'SKILL.md'), '# Architect helper', 'utf8');

    const result = validateCodexSkills({
      projectRoot: tmpRoot,
      sourceDirs: [sourceDir],
      skillsDir,
      strict: true,
    });

    expect(result.ok).toBe(false);
    expect(result.forbiddenAgentSkills).toContain('aios-architect');
  });
});
