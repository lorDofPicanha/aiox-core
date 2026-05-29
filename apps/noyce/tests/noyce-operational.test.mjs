import assert from "node:assert/strict";
import { test } from "node:test";

const { buildNextStep, describeLacuna, legalDecisionAction, operationalState, lacunaTasks } = await import(
  "../lib/noyce-operational.ts"
);

function opp(over = {}) {
  return {
    proposalDeadline: "2026-06-04T12:00:00Z",
    opportunityScore: 80,
    confidenceScore: 80,
    missingData: [],
    analysisRun: { blockers: [] },
    ...over,
  };
}

test("ready opportunity yields a concrete proposal action with owner + deadline", () => {
  const action = buildNextStep(opp());
  assert.equal(action.tone, "ready");
  assert.match(action.headline, /Monte a proposta/);
  assert.equal(action.owner, "Comercial ENIAC");
  assert.ok(action.deadline);
  assert.ok(action.why.length > 0);
});

test("blocked opportunity turns lacunas into a named task, not a passive label", () => {
  const action = buildNextStep(opp({ confidenceScore: 60, missingData: ["visita_tecnica", "ata"] }));
  assert.equal(action.tone, "blocked");
  assert.match(action.headline, /Visita técnica/);
  // the blocking lacuna's owner leads the action
  assert.equal(action.owner, "Engenharia ENIAC");
  assert.match(action.why, /Confiança em 60%/);
});

test("describeLacuna maps a machine key into an actionable task with owner + impact", () => {
  const task = describeLacuna("anexos_tecnicos");
  assert.equal(task.blocking, true);
  assert.equal(task.owner, "Engenharia ENIAC");
  assert.match(task.action, /anexos técnicos/i);
  assert.ok(task.impact.length > 0);

  const unknown = describeLacuna("foo_bar");
  assert.equal(unknown.blocking, false);
  assert.equal(unknown.label, "foo bar"); // underscores humanised, never shown raw
});

test("lacunaTasks expands every missingData entry", () => {
  const tasks = lacunaTasks(opp({ missingData: ["ata", "anexos_tecnicos"] }));
  assert.equal(tasks.length, 2);
  assert.deepEqual(
    tasks.map((t) => t.key),
    ["ata", "anexos_tecnicos"],
  );
});

test("legalDecisionAction prints the real action + owner and keeps external acts blocked", () => {
  const da = legalDecisionAction({
    decisionType: "manifest_appeal_intent",
    recommendedAction: "Preparar critério de decisão antes da janela.",
    externalActBlocked: true,
    blockingLacunas: [],
  });
  assert.equal(da.action, "Preparar critério de decisão antes da janela.");
  assert.equal(da.owner, "Operação ENIAC");
  assert.equal(da.externalBlocked, true);
  assert.match(da.note, /bloqueado por design/);
});

test("operationalState reflects the confidence gate", () => {
  assert.equal(operationalState(opp({ confidenceScore: 60 })).tone, "blocked");
  assert.equal(operationalState(opp()).tone, "ready");
  assert.equal(operationalState(opp({ opportunityScore: 60, confidenceScore: 75 })).tone, "review");
});
