import assert from "node:assert/strict";
import { test } from "node:test";

const { exportAnalysisRuns, validateAnalysisRunExport } = await import("../lib/noyce-analysis-export.ts");
const { exportSprint0AnalysisRuns } = await import("../lib/noyce-analysis-export.ts");

test("analysis run export keeps scores explainable and bounded", () => {
  const opportunities = [
    {
      id: "fixture-1",
      source: "pncp",
      city: "Anápolis",
      uf: "GO",
      distanceKm: 156,
      estimatedValue: 1380000,
      proposalDeadline: "2026-06-08T13:30:00Z",
      missingData: ["ata"],
      opportunityScore: 82,
      confidenceScore: 75,
      action: "priorizar agora",
      analysisRun: {
        model: "deterministic-v0",
        blockers: ["lacuna: ata"],
        opportunity: {
          score: 82,
          components: [{ label: "Raio operacional", value: 20, max: 25, reason: "Dentro do raio." }],
        },
        confidence: {
          score: 75,
          components: [{ label: "Fonte", value: 35, max: 35, reason: "Fonte publica." }],
        },
      },
    },
  ];

  const runs = exportAnalysisRuns(opportunities);
  assert.equal(runs.length, 1);
  assert.equal(runs[0].schemaVersion, "noyce.analysis_run.v0");
  assert.equal(runs[0].model, "deterministic-v0");
  assert.deepEqual(validateAnalysisRunExport(runs), []);
});

test("sprint 0 export preserves all dry-run analysis runs", () => {
  const dryRunRuns = [
    {
      caseId: "case-a",
      sourceCode: "pncp",
      canonicalKey: "canonical-a",
      opportunityScore: 67,
      confidenceTotal: 24,
      label: "avaliar rapido",
      components: { fitCompany: 80, evidenceQuality: 24 },
      missingData: ["buyer_cnpj"],
      topReasons: ["Valor estimado BRL 1200000"],
    },
    {
      caseId: "case-b",
      sourceCode: "candidate:portal-regional-fixture",
      canonicalKey: "canonical-b",
      opportunityScore: 57,
      confidenceTotal: 21,
      label: "avaliar rapido",
      components: { fitCompany: 80, manualStrategy: 55 },
      missingData: ["proposal_deadline"],
      topReasons: ["Fonte candidata dentro do raio operacional"],
    },
  ];
  const candidates = [
    {
      caseId: "case-a",
      sourceCode: "pncp",
      opportunity: {
        canonicalKey: "canonical-a",
        cityName: "Aguas Lindas de Goias",
        uf: "GO",
        estimatedValue: 1200000,
        proposalDeadline: "2026-06-05T13:00:00Z",
      },
    },
    {
      caseId: "case-b",
      sourceCode: "candidate:portal-regional-fixture",
      opportunity: {
        canonicalKey: "canonical-b",
        cityName: "Unai",
        uf: "MG",
        estimatedValue: 850000,
        proposalDeadline: "2026-06-12T14:00:00Z",
      },
    },
  ];

  const runs = exportSprint0AnalysisRuns(dryRunRuns, candidates);
  assert.equal(runs.length, 2);
  assert.equal(runs[1].sourceCode, "candidate:portal-regional-fixture");
  assert.equal(runs[0].confidenceScore, 24);
  assert.equal(runs[0].components.opportunity.length, 2);
  assert.equal(runs[0].components.confidence.length, 2);
  assert.equal(runs[0].inputs.estimatedValue, 1200000);
  assert.deepEqual(validateAnalysisRunExport(runs, 2), []);
});
