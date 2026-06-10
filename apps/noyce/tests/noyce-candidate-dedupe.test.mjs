import assert from "node:assert/strict";
import { test } from "node:test";

const { computeDedupeKey, computeFallbackDedupeKey, normalizedContentHash } = await import(
  "../lib/sources/noyce-source-adapter.ts"
);
const { dedupeCandidates } = await import("../lib/sources/source-dedupe.ts");

function candidate(id, core) {
  const full = {
    title: null,
    buyer: null,
    buyerCnpj: null,
    city: null,
    uf: null,
    numeroEdital: null,
    numeroProcesso: null,
    estimatedValue: null,
    publicationDate: null,
    proposalDeadline: null,
    ...core,
  };
  return {
    candidateId: id,
    source: "pncp",
    accessMode: "public_api",
    snapshotId: "snap",
    ...full,
    ibge: null,
    modalityCode: null,
    sourceUrl: null,
    contentHash: id,
    normalizedHash: normalizedContentHash(full),
    dedupeKey: computeDedupeKey(full),
    fallbackDedupeKey: computeFallbackDedupeKey(full),
    duplicateStatus: "unique",
    evidence: [],
    missingData: [],
    decision: "GO_COM_TAREFAS",
  };
}

const base = {
  buyer: "PREFEITURA DE GOIANIA",
  buyerCnpj: "01067479000146",
  title: "Reforma da escola municipal centro",
  city: "Goiânia",
  uf: "GO",
  numeroEdital: "045/2026",
  numeroProcesso: "PROC-1",
  estimatedValue: 800000,
  proposalDeadline: "2026-07-01T09:00:00",
};

test("dedupeKey + normalizedHash idênticos => exact_duplicate", () => {
  const a = candidate("A", base);
  const b = candidate("B", { ...base });
  const { report, unique } = dedupeCandidates([a, b]);
  assert.equal(a.duplicateStatus, "unique");
  assert.equal(b.duplicateStatus, "exact_duplicate");
  assert.equal(report.exact, 1);
  assert.equal(unique.length, 1);
});

test("mesmo órgão/objeto/data mas edital e valor diferentes => semantic_duplicate", () => {
  const a = candidate("A", base);
  const b = candidate("B", { ...base, numeroEdital: "999/2026", numeroProcesso: "PROC-2", estimatedValue: 815000 });
  const { report } = dedupeCandidates([a, b]);
  assert.equal(b.duplicateStatus, "semantic_duplicate");
  assert.equal(report.semantic, 1);
});

test("título com forte sobreposição no mesmo órgão/data => possible_duplicate", () => {
  const a = candidate("A", base);
  const b = candidate("B", {
    ...base,
    title: "Reforma da escola municipal bairro norte",
    numeroEdital: "777/2026",
    numeroProcesso: "PROC-9",
    estimatedValue: 790000,
  });
  const { report } = dedupeCandidates([a, b]);
  assert.equal(b.duplicateStatus, "possible_duplicate");
  assert.equal(report.possible, 1);
});

test("candidatos distintos permanecem unique", () => {
  const a = candidate("A", base);
  const b = candidate("B", {
    buyer: "PREFEITURA DE ANAPOLIS",
    buyerCnpj: "01111111000100",
    title: "Aquisição de notebooks",
    city: "Anápolis",
    uf: "GO",
    numeroEdital: "100/2026",
    numeroProcesso: "PROC-X",
    estimatedValue: 200000,
    proposalDeadline: "2026-08-10T09:00:00",
  });
  const { report } = dedupeCandidates([a, b]);
  assert.equal(report.unique, 2);
  assert.equal(report.exact + report.semantic + report.possible, 0);
});
