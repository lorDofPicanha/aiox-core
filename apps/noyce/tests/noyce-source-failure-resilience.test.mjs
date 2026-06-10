import assert from "node:assert/strict";
import { test } from "node:test";

const { runAdapters } = await import("../lib/sources/noyce-source-adapter.ts");
const { createPncpPublicAdapter } = await import("../lib/sources/pncp-public-adapter.ts");
const { createManualImportAdapter } = await import("../lib/sources/manual-import-adapter.ts");

test("falha de fetch numa fonte não derruba as demais (ok:false isolado)", async () => {
  const failingFetch = async () => {
    throw new Error("ECONNRESET");
  };
  const pncp = createPncpPublicAdapter();
  const manual = createManualImportAdapter({
    source: "bll",
    mapping: { buyer: "orgao", title: "objeto", proposalDeadline: "prazo" },
    csvDelimiter: ";",
  });
  const csv = ["orgao;objeto;prazo", "PREF;Obra;2026-07-01T09:00:00"].join("\n");

  const results = await runAdapters([
    { adapter: pncp, input: { capturedBy: "t", fetchImpl: failingFetch } },
    { adapter: manual, input: { capturedBy: "t", originalFileName: "x.csv", contentType: "text/csv", content: csv } },
  ]);

  assert.equal(results.length, 2);
  const pncpResult = results.find((r) => r.source === "pncp");
  const manualResult = results.find((r) => r.source === "bll");
  assert.equal(pncpResult.ok, false);
  assert.ok(pncpResult.errors.length > 0);
  assert.equal(manualResult.ok, true);
  assert.equal(manualResult.candidates.length, 1);
});

test("adapter que lança exceção é capturado pelo orquestrador, não propaga", async () => {
  const explodingAdapter = {
    source: "pcp",
    accessMode: "authenticated_pending_vault",
    canRunNow: () => false,
    run: async () => {
      throw new Error("boom inesperado");
    },
  };
  const manual = createManualImportAdapter({ source: "bnc", mapping: { buyer: "orgao", title: "objeto" }, csvDelimiter: ";" });
  const csv = ["orgao;objeto", "PREF;Obra"].join("\n");

  const results = await runAdapters([
    { adapter: explodingAdapter, input: { capturedBy: "t" } },
    { adapter: manual, input: { capturedBy: "t", originalFileName: "y.csv", contentType: "text/csv", content: csv } },
  ]);

  assert.equal(results.length, 2);
  const pcp = results.find((r) => r.source === "pcp");
  assert.equal(pcp.ok, false);
  assert.match(pcp.errors[0], /boom inesperado/);
  assert.equal(results.find((r) => r.source === "bnc").ok, true);
});
