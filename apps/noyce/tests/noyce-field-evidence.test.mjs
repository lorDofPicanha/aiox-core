import assert from "node:assert/strict";
import { test } from "node:test";

const { deriveDecision } = await import("../lib/sources/noyce-source-adapter.ts");
const { createManualImportAdapter } = await import("../lib/sources/manual-import-adapter.ts");

const MAPPING = {
  buyer: "orgao",
  title: "objeto",
  city: "municipio",
  uf: "uf",
  estimatedValue: "valor",
  proposalDeadline: "encerramento",
};

test("campo crítico sem evidência vira PENDENTE_DADO", () => {
  const r = deriveDecision({
    title: "Obra X",
    buyer: "PREF",
    proposalDeadline: null, // crítico ausente
    evidence: [
      { field: "title", value: "Obra X", locatorKind: "csvColumn", locator: "objeto", confidence: "strong" },
      { field: "buyer", value: "PREF", locatorKind: "csvColumn", locator: "orgao", confidence: "strong" },
    ],
  });
  assert.ok(r.missingData.includes("proposalDeadline"));
  assert.equal(r.decision, "PENDENTE_DADO");
});

test("todos os críticos com evidência => não fica PENDENTE_DADO", () => {
  const r = deriveDecision({
    title: "Obra X",
    buyer: "PREF",
    proposalDeadline: "2026-07-01T09:00:00",
    evidence: [
      { field: "title", value: "Obra X", locatorKind: "csvColumn", locator: "objeto", confidence: "strong" },
      { field: "buyer", value: "PREF", locatorKind: "csvColumn", locator: "orgao", confidence: "strong" },
      { field: "proposalDeadline", value: "2026-07-01T09:00:00", locatorKind: "csvColumn", locator: "encerramento", confidence: "strong" },
    ],
  });
  assert.deepEqual(r.missingData, []);
  assert.notEqual(r.decision, "PENDENTE_DADO");
});

test("import manual sem coluna de prazo marca PENDENTE_DADO no candidato", async () => {
  const csv = ["orgao;objeto;municipio;uf;valor", "PREF DE X;Reforma de praça;Goiânia;GO;300000"].join("\n");
  const adapter = createManualImportAdapter({ source: "bll", mapping: MAPPING, csvDelimiter: ";" });
  const { candidates } = await adapter.run({
    capturedBy: "t",
    originalFileName: "x.csv",
    contentType: "text/csv",
    content: csv,
  });
  const c = candidates[0];
  assert.ok(c.missingData.includes("proposalDeadline"));
  assert.equal(c.decision, "PENDENTE_DADO");
  // não inventa evidência para o campo ausente
  assert.equal(c.evidence.find((e) => e.field === "proposalDeadline"), undefined);
});

test("import manual completo não fica PENDENTE_DADO", async () => {
  const csv = [
    "orgao;objeto;municipio;uf;valor;encerramento",
    "PREF DE X;Reforma de praça;Goiânia;GO;300000;2026-07-01T09:00:00",
  ].join("\n");
  const adapter = createManualImportAdapter({ source: "bll", mapping: MAPPING, csvDelimiter: ";" });
  const { candidates } = await adapter.run({
    capturedBy: "t",
    originalFileName: "x.csv",
    contentType: "text/csv",
    content: csv,
  });
  assert.notEqual(candidates[0].decision, "PENDENTE_DADO");
});
