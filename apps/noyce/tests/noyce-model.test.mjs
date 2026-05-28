import assert from "node:assert/strict";
import { test } from "node:test";

const { isExternalActSafelyBlocked, legalReviewLabel } = await import("../lib/noyce-model.ts");

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

test("external legal act stays blocked and requires human approval", () => {
  const decision = {
    id: "decision-appeal-intent",
    decisionType: "manifest_appeal_intent",
    recommendedAction: "Prepare criterio, but do not submit.",
    basis: "legal_review_needed",
    confidenceScore: 64,
    blockingLacunas: [],
    humanApprovalRequired: true,
    externalActBlocked: true,
  };

  assert.equal(isExternalActSafelyBlocked(decision), true);
  assert.equal(legalReviewLabel(decision), "revisao obrigatoria");
});

test("external legal act without human approval is unsafe", () => {
  const decision = {
    id: "decision-unsafe-counterarguments",
    decisionType: "submit_counterarguments",
    recommendedAction: "Submit automatically",
    basis: "fact",
    confidenceScore: 90,
    blockingLacunas: [],
    humanApprovalRequired: false,
    externalActBlocked: true,
  };

  assert.equal(isExternalActSafelyBlocked(decision), false);
});

test("appeal intent and appeal reasons remain separate objects", () => {
  const appealIntent = {
    id: "intent-live-session",
    windowStatus: "unknown",
    groundsSummary: "Possivel discussao de habilitacao.",
    humanDecision: "needs_lawyer_review",
    submissionStatus: "blocked_not_automated",
  };
  const appealReasons = {
    id: "reasons-live-session",
    intentId: "intent-live-session",
    draftStatus: "outline",
    argumentTopics: ["habilitacao", "diligencia/saneamento"],
    reviewOwner: "Revisao juridica humana",
    externalSubmissionStatus: "blocked_not_automated",
  };

  assert.notEqual(appealIntent.id, appealReasons.id);
  assert.equal(appealReasons.intentId, appealIntent.id);
  assert.equal(appealIntent.submissionStatus, "blocked_not_automated");
  assert.equal(appealReasons.externalSubmissionStatus, "blocked_not_automated");
});
