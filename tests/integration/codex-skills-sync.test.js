'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');

const {
  syncSkills,
  buildSkillPlan,
} = require('../../.aios-core/infrastructure/scripts/codex-skills-sync/index');

describe('Codex Skills Sync', () => {
  let tmpRoot;

  beforeEach(() => {
    tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'aios-codex-skills-'));
  });

  afterEach(() => {
    fs.rmSync(tmpRoot, { recursive: true, force: true });
  });

  it('prepares the local skills directory without generating agent activators', () => {
    const localSkillsDir = path.join(tmpRoot, '.codex', 'skills');
    const result = syncSkills({
      localSkillsDir,
      dryRun: false,
    });

    expect(result.generated).toBe(0);
    expect(fs.existsSync(localSkillsDir)).toBe(true);
    expect(fs.existsSync(path.join(localSkillsDir, 'aios-architect', 'SKILL.md'))).toBe(false);
    expect(result.message).toContain('.codex/agents');
  });

  it('supports global directory preparation when --global mode is enabled', () => {
    const localSkillsDir = path.join(tmpRoot, '.codex', 'skills');
    const globalSkillsDir = path.join(tmpRoot, '.codex-home', 'skills');

    const result = syncSkills({
      localSkillsDir,
      globalSkillsDir,
      global: true,
      dryRun: false,
    });

    expect(result.generated).toBe(0);
    expect(result.globalSkillsDir).toBe(globalSkillsDir);
    expect(fs.existsSync(globalSkillsDir)).toBe(true);
    expect(fs.existsSync(path.join(globalSkillsDir, 'aios-dev', 'SKILL.md'))).toBe(false);
  });

  it('treats globalOnly as global directory preparation and skips local writes', () => {
    const localSkillsDir = path.join(tmpRoot, '.codex', 'skills');
    const globalSkillsDir = path.join(tmpRoot, '.codex-home', 'skills');

    const result = syncSkills({
      localSkillsDir,
      globalSkillsDir,
      globalOnly: true,
      dryRun: false,
    });

    expect(result.generated).toBe(0);
    expect(result.globalSkillsDir).toBe(globalSkillsDir);
    expect(fs.existsSync(localSkillsDir)).toBe(false);
    expect(fs.existsSync(globalSkillsDir)).toBe(true);
  });

  it('buildSkillPlan documents that skills are not agent launchers', () => {
    const plan = buildSkillPlan(path.join(tmpRoot, '.codex', 'skills'));

    expect(plan.generated).toBe(0);
    expect(plan.message).toContain('agent activator generation is disabled');
  });
});
