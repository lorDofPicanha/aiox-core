import assert from "node:assert/strict";
import { test } from "node:test";

function classifyAction(opportunityScore, confidenceScore, hasConflict, hasDeadline) {
  if (hasConflict) return "revisao obrigatoria";
  if (opportunityScore >= 70 && confidenceScore >= 70) return "priorizar agora";
  if (opportunityScore >= 70 && confidenceScore < 70) return "promissora, mas incompleta";
  if (opportunityScore >= 55 && hasDeadline) return "avaliar rapido";
  return "ignorar ou revisar manualmente";
}

test("conflict forces manual review", () => {
  assert.equal(classifyAction(80, 80, true, true), "revisao obrigatoria");
});

test("high score with low confidence is not strong recommendation", () => {
  assert.equal(classifyAction(80, 35, false, true), "promissora, mas incompleta");
});

test("medium opportunity with deadline asks for fast review", () => {
  assert.equal(classifyAction(58, 40, false, true), "avaliar rapido");
});
