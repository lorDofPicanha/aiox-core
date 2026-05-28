const {
  getAgentClass,
  validateAgentFormat,
} = require('../../.aios-core/infrastructure/scripts/validate-agents');

function makeAgent({ id = 'test-agent', agentClass, autoClaude } = {}) {
  const parsed = {
    agent: {
      id,
      name: 'Test Agent',
      title: 'Test Agent',
      icon: '*',
    },
    commands: [],
  };

  if (agentClass !== undefined) {
    parsed.agent.class = agentClass;
  }

  if (autoClaude !== undefined) {
    parsed.autoClaude = autoClaude;
  }

  return {
    id,
    file: `${id}.md`,
    commands: [],
    dependencies: {},
    parsed,
  };
}

describe('validate-agents class contract', () => {
  test('operational agent without autoClaude fails', () => {
    const result = validateAgentFormat([
      makeAgent({ agentClass: 'operational' }),
    ]);

    expect(result.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: 'MISSING_AUTOCLAUDE',
          agent: 'test-agent',
        }),
      ]),
    );
  });

  test('consultation agent without autoClaude passes', () => {
    const result = validateAgentFormat([
      makeAgent({ agentClass: 'consultation' }),
    ]);

    expect(result.errors).toHaveLength(0);
    expect(result.warnings).toHaveLength(0);
  });

  test('unknown class fails closed as operational', () => {
    const agent = makeAgent({ agentClass: 'experimental' });
    const result = validateAgentFormat([agent]);

    expect(getAgentClass(agent)).toBe('operational');
    expect(result.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ type: 'UNKNOWN_AGENT_CLASS' }),
        expect.objectContaining({ type: 'MISSING_AUTOCLAUDE' }),
      ]),
    );
  });
});
