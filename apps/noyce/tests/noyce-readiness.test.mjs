import assert from "node:assert/strict";
import { test } from "node:test";

const { buildReadinessReport, validateReadinessReport } = await import("../lib/noyce-readiness.ts");

test("readiness report keeps authenticated automation blocked", () => {
  const report = buildReadinessReport();
  const blockedSources = report.sourceGovernance.filter((source) => source.tosStatus === "pending_review");

  assert.ok(blockedSources.length >= 5);
  assert.equal(report.validation.ok, true);
  assert.deepEqual(validateReadinessReport(report), []);
  assert.ok(blockedSources.every((source) => source.automationStatus === "blocked_until_vault"));
});

test("readiness report exposes tomorrow morning human blockers", () => {
  const report = buildReadinessReport();
  const blockerIds = report.humanBlockers.map((blocker) => blocker.id);

  assert.ok(blockerIds.includes("eniac-cnpj-razao-social"));
  assert.ok(blockerIds.includes("portal-credentials-vault"));
  assert.ok(blockerIds.includes("portal-tos-review"));
  assert.ok(blockerIds.includes("prod-release-approval"));
  assert.equal(report.phases.fase6, "blocked_human");
  assert.equal(report.phases.fase8, "ready_for_dry_run");
  assert.equal(report.phases.fase11, "blocked_human");
});

test("pilot steps cannot run real sources without blocker resolution", () => {
  const report = buildReadinessReport();
  const realRun = report.pilotSteps.find((step) => step.id === "pilot-real-source-run");

  assert.ok(realRun);
  assert.equal(realRun.allowedNow, false);
  assert.equal(realRun.blockerId, "portal-tos-review");
});
