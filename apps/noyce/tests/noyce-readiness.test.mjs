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
  assert.equal(report.phases.fase6, "ready_for_dry_run");
  assert.equal(report.phases.fase8, "ready_for_dry_run");
  assert.equal(report.phases.fase11, "blocked_human");
});

test("readiness report records ENIAC onboarding metadata without secrets", () => {
  const report = buildReadinessReport();

  assert.equal(report.onboarding.company.cnpj, "36.819.268/0001-05");
  assert.equal(report.onboarding.company.legalName, "ENIAC");
  assert.equal(report.onboarding.company.legalNameStatus, "founder_provided");
  assert.equal(report.onboarding.users.totalExpected, 4);
  assert.equal(report.onboarding.users.masterProfile, "Stafani");
  assert.equal(report.onboarding.users.remainingUsersStatus, "deferred_by_founder");
  assert.deepEqual(report.onboarding.prioritySources, ["bll", "bnc", "pcp"]);
  assert.equal(report.onboarding.publicDryRunAuthorized, true);
  assert.match(report.onboarding.securityNote, /No credentials/);
});

test("priority portal URLs are recorded but authenticated automation stays blocked", () => {
  const report = buildReadinessReport();
  const prioritySources = report.sourceGovernance.filter((source) => ["bll", "bnc", "pcp"].includes(source.source));

  assert.equal(prioritySources.length, 3);
  assert.ok(prioritySources.every((source) => source.portalUrl?.startsWith("https://")));
  assert.ok(prioritySources.every((source) => source.automationStatus === "blocked_until_vault"));
  assert.ok(prioritySources.every((source) => source.tosStatus === "pending_review"));
});

test("pilot steps cannot run real sources without blocker resolution", () => {
  const report = buildReadinessReport();
  const pncpDryRun = report.pilotSteps.find((step) => step.id === "pilot-public-pncp-dry-run");
  const realRun = report.pilotSteps.find((step) => step.id === "pilot-real-source-run");

  assert.ok(pncpDryRun);
  assert.equal(pncpDryRun.allowedNow, true);
  assert.ok(realRun);
  assert.equal(realRun.allowedNow, false);
  assert.equal(realRun.blockerId, "portal-tos-review");
});
