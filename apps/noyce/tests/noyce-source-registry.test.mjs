import assert from "node:assert/strict";
import { test } from "node:test";

const {
  canRunSourceNow,
  canReadPublicNow,
  getDiscoveryRoute,
  isScrapingProhibited,
  getSourceDefinition,
  listBlockedSources,
  listSourcesAllowedNow,
  noyceSources,
} = await import("../lib/noyce-source-registry.ts");

test("source registry includes all ENIAC priority and official sources", () => {
  assert.deepEqual(
    noyceSources.map((source) => source.source),
    ["pncp", "comprasgov", "bll", "bnc", "pcp", "sislog"],
  );

  for (const source of ["bll", "bnc", "pcp"]) {
    assert.equal(getSourceDefinition(source)?.priority, "p0");
  }
});

test("open-data sources (PNCP + ComprasGov) run autonomously now; private portals do not", () => {
  assert.deepEqual(listSourcesAllowedNow().map((source) => source.source), ["pncp", "comprasgov"]);
  assert.equal(canRunSourceNow("pncp"), true);
  assert.equal(canRunSourceNow("comprasgov"), true);

  for (const source of ["bll", "bnc", "pcp", "sislog"]) {
    assert.equal(canRunSourceNow(source), false);
    assert.equal(getSourceDefinition(source)?.automationStatus, "blocked_until_vault");
  }
});

test("public reading is legally clear for the official + silent-tolerated portals, not PCP", () => {
  for (const source of ["pncp", "comprasgov", "bll", "bnc"]) {
    assert.equal(canReadPublicNow(source), true);
  }
  // PCP expressly forbids automated reading/scraping
  assert.equal(canReadPublicNow("pcp"), false);
  assert.equal(canReadPublicNow("sislog"), false);
});

test("discovery routes through PNCP for every private portal; open APIs use self", () => {
  assert.equal(getDiscoveryRoute("pncp"), "self");
  assert.equal(getDiscoveryRoute("comprasgov"), "self");
  for (const source of ["bll", "bnc", "pcp", "sislog"]) {
    assert.equal(getDiscoveryRoute(source), "pncp");
  }
});

test("PCP scraping is hard-blocked by ToS; it never crawls", () => {
  assert.equal(isScrapingProhibited("pcp"), true);
  assert.equal(getSourceDefinition("pcp")?.adapterStatus, "blocked");
  assert.equal(getSourceDefinition("pcp")?.vaultGates, 2); // vault + permissão expressa ECUSTOMIZE
  for (const source of ["pncp", "comprasgov", "bll", "bnc"]) {
    assert.equal(isScrapingProhibited(source), false);
  }
});

test("binding acts are human-only across every source", () => {
  for (const def of noyceSources) {
    assert.deepEqual([...def.humanRequiredActs], ["lance", "declaracao", "proposta", "recurso"]);
  }
});

test("reviewed portals carry a legal review reference; sislog still pending", () => {
  // The three private operators got the calibrated-review status.
  for (const source of ["bll", "bnc", "pcp"]) {
    assert.equal(getSourceDefinition(source)?.tosStatus, "reviewed_calibrated");
  }
  // Every reviewed source (incl. ComprasGov, which is open_public) cites its review doc.
  for (const source of ["bll", "bnc", "pcp", "comprasgov"]) {
    assert.ok(getSourceDefinition(source)?.legalReview);
  }
  assert.equal(getSourceDefinition("comprasgov")?.tosStatus, "ok_public_only");
  assert.equal(getSourceDefinition("sislog")?.tosStatus, "pending_review");
  assert.equal(getSourceDefinition("pncp")?.tosStatus, "ok_public_only");
});

test("blocked source list exposes the authenticated portals that still need onboarding", () => {
  const blocked = listBlockedSources().map((source) => source.source);
  assert.ok(blocked.includes("bll"));
  assert.ok(blocked.includes("bnc"));
  assert.ok(blocked.includes("pcp"));
  assert.ok(blocked.includes("sislog"));
  // ComprasGov is open-data → no longer blocked
  assert.ok(!blocked.includes("comprasgov"));
});
