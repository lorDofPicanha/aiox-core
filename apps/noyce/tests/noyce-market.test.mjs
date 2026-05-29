import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

// Reads the real PNCP competitor snapshot directly (relative path) so the test does not
// depend on @/ alias resolution. Locks in the anti-fake contract: every winner row is real,
// grounded, and carries a citable source; inference/gap fields are labelled, never invented.
const snapshotPath = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "lib",
  "data",
  "market-snapshot.json",
);
const snapshot = JSON.parse(readFileSync(snapshotPath, "utf8"));

test("snapshot exposes real grounded competitors (no fabricated Alfa/Beta, real CNPJs)", () => {
  const withData = snapshot.orgaos.filter((o) => Array.isArray(o.competitors) && o.competitors.length);
  assert.ok(withData.length >= 3, `expected >=3 órgãos with data, got ${withData.length}`);

  for (const orgao of withData) {
    assert.ok(["pulverizado", "moderado", "concentrado"].includes(orgao.concentration));
    assert.equal(typeof orgao.hhi, "number");
    assert.ok(orgao.hhi >= 0 && orgao.hhi <= 10000);

    for (const competitor of orgao.competitors) {
      assert.doesNotMatch(competitor.name, /Concorrente (Alfa|Beta)/, "no fabricated competitor names");
      assert.match(String(competitor.cnpj), /^\d{11,14}$/, "competitor carries a real CNPJ");
      assert.equal(competitor.grounding, "grounded", "winner rows are grounded in real contracts");
      assert.equal(typeof competitor.winCount, "number");
      assert.equal(typeof competitor.totalWonBRL, "number");
      assert.equal(typeof competitor.sharePct, "number");
      assert.ok(Array.isArray(competitor.sourceContractIds), "carries citable PNCP source ids");
    }
  }
});

test("inference/gap fields are labelled honestly, never invented", () => {
  for (const orgao of snapshot.orgaos.filter((o) => Array.isArray(o.competitors) && o.competitors.length)) {
    for (const competitor of orgao.competitors) {
      // avgDiscount needs the estimate join — must be null until measured, never fabricated.
      assert.ok(competitor.avgDiscountPct === null || typeof competitor.avgDiscountPct === "number");
      // ENIAC head-to-head is a structural gap (PNCP /contratos exposes only the winner).
      assert.equal(competitor.vsEniac.grounding, "gap");
    }
  }
});

test("price band is real percentiles with a sample size, not synthetic multipliers", () => {
  for (const orgao of snapshot.orgaos.filter((o) => Array.isArray(o.competitors) && o.competitors.length)) {
    const band = orgao.priceBand;
    assert.equal(typeof band.sampleSize, "number");
    assert.ok(["grounded", "inferred"].includes(band.grounding));
    if (band.p25BRL !== null && band.p75BRL !== null) {
      assert.ok(band.p25BRL <= band.p75BRL, "P25 must not exceed P75");
    }
  }
});
