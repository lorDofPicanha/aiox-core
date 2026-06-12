// Testes do checklist de habilitação CALCULADO (owner 12/Jun: "o Noyce faz sozinho")
// + contrato da invariante "concorrência nunca desclassifica".
import assert from "node:assert/strict";
import { test } from "node:test";

const { buildHabilitationChecklist } = await import("../lib/noyce-checklist.ts");
const { buildTriage } = await import("../lib/noyce-operational.ts");
const { calculateOpportunityScore, classifyAction } = await import("../lib/noyce-model.ts");

const ASOF = "2026-05-23T00:00:00Z";

function ccpBase(overrides = {}) {
  return {
    identity: { tradeName: "ENIAC" },
    rts: [{ nome: "Alice Ramos Silva" }, { nome: "Rodrigo Piloto Amaro" }],
    acervo: [{ numero: "1" }, { numero: "2" }, { numero: "3" }, { numero: "4" }, { numero: "5" }],
    financials: [
      { exercicio: 2024, patrimonioLiquido: 76361.76, ativoCirc: 77061.76, passivoCirc: 700 },
      { exercicio: 2025, patrimonioLiquido: 919170.54, ativoCirc: 927943.53, passivoCirc: 8772.99 },
    ],
    regularity: [],
    derived: { capabilityByService: { "execucao-edificio-alvenaria": {}, "drenagem": {}, "pavimentacao": {} } },
    ...overrides,
  };
}

test("fiscal: vault sem certidões → missing com instrução de anexar", () => {
  const items = buildHabilitationChecklist(ccpBase(), {
    estimatedValue: 1_000_000,
    proposalDeadline: "2026-06-30T13:00:00Z",
    habilitationResult: null,
    asOf: ASOF,
  });
  const fiscal = items.find((i) => i.label === "Fiscal e trabalhista");
  assert.equal(fiscal.status, "missing");
  assert.match(fiscal.note, /anexe|certid/i);
});

test("fiscal: certidões vigentes na sessão → ok automático", () => {
  const ccp = ccpBase({
    regularity: [
      { id: "cnd-fed", tipo: "CND Federal", status: "vigente", validade: "2026-12-01", fonte: "RFB" },
      { id: "crf", tipo: "CRF-FGTS", status: "vigente", validade: "2026-08-01", fonte: "Caixa" },
    ],
  });
  const items = buildHabilitationChecklist(ccp, {
    estimatedValue: 1_000_000,
    proposalDeadline: "2026-06-30T13:00:00Z",
    habilitationResult: null,
    asOf: ASOF,
  });
  const fiscal = items.find((i) => i.label === "Fiscal e trabalhista");
  assert.equal(fiscal.status, "ok");
});

test("fiscal: certidão vencendo ANTES da sessão → missing (conferência contra a data)", () => {
  const ccp = ccpBase({
    regularity: [{ id: "cndt", tipo: "CNDT", status: "vigente", validade: "2026-06-10", fonte: "TST" }],
  });
  const items = buildHabilitationChecklist(ccp, {
    estimatedValue: null,
    proposalDeadline: "2026-06-30T13:00:00Z",
    habilitationResult: null,
    asOf: ASOF,
  });
  const fiscal = items.find((i) => i.label === "Fiscal e trabalhista");
  assert.equal(fiscal.status, "missing");
  assert.match(fiscal.note, /CNDT/);
});

test("econ-fin: PL real 2025 → teto solo R$9,19mi, edital 2,83M habilita solo com folga", () => {
  const items = buildHabilitationChecklist(ccpBase(), {
    estimatedValue: 2_831_789.56,
    proposalDeadline: null,
    habilitationResult: null,
    asOf: ASOF,
  });
  const econ = items.find((i) => i.label === "Econômico-financeira");
  assert.equal(econ.status, "ok");
  assert.match(econ.note, /9,19 mi/);
  assert.match(econ.note, /folga 3,2/);
});

test("econ-fin: valor acima do teto solo → aponta consórcio (não NO-GO cego)", () => {
  const items = buildHabilitationChecklist(ccpBase(), {
    estimatedValue: 12_000_000,
    proposalDeadline: null,
    habilitationResult: null,
    asOf: ASOF,
  });
  const econ = items.find((i) => i.label === "Econômico-financeira");
  assert.equal(econ.status, "missing");
  assert.match(econ.note, /consórcio/i);
});

test("técnica sem edital parseado → warning com inventário do acervo (5 docs)", () => {
  const items = buildHabilitationChecklist(ccpBase(), {
    estimatedValue: 500_000,
    proposalDeadline: null,
    habilitationResult: null,
    asOf: ASOF,
  });
  const tec = items.find((i) => i.label === "Qualificação técnica");
  assert.equal(tec.status, "warning");
  assert.match(tec.note, /5 documentos/);
});

test("proposta: sessão a 3 dias → warning de urgência; encerrada → missing", () => {
  const urgente = buildHabilitationChecklist(ccpBase(), {
    estimatedValue: null,
    proposalDeadline: "2026-05-26T13:00:00Z",
    habilitationResult: null,
    asOf: ASOF,
  }).find((i) => i.label === "Proposta e planilha");
  assert.equal(urgente.status, "warning");
  const encerrada = buildHabilitationChecklist(ccpBase(), {
    estimatedValue: null,
    proposalDeadline: "2026-05-01T13:00:00Z",
    habilitationResult: null,
    asOf: ASOF,
  }).find((i) => i.label === "Proposta e planilha");
  assert.equal(encerrada.status, "missing");
});

// ── Invariante: concorrência NUNCA desclassifica ─────────────────────────────
// "concorrência tem em todo lugar, isso não é motivo para desclassificar" (owner 12/Jun).
// Contrato: triagem, score e ação não aceitam nem reagem a dados de mercado.

test("invariante: triagem ignora campos de mercado (verdict idêntico com ou sem)", () => {
  const base = { title: "Execução de obra de pavimentação", distanceKm: 50, estimatedValue: 900_000, proposalDeadline: "2026-06-30T13:00:00Z" };
  const semMercado = buildTriage(base);
  const comMercado = buildTriage({ ...base, market: { hhi: 9800, concentration: "concentrado" }, competitors: 12 });
  assert.equal(semMercado.verdict, comMercado.verdict);
  assert.equal(semMercado.score, comMercado.score);
});

test("invariante: score e ação não têm componente de concorrência", () => {
  const input = {
    source: "pncp", city: "Goiânia", distanceKm: 170, estimatedValue: 1_000_000,
    proposalDeadline: "2026-06-30T13:00:00Z", stage: "monitorar", hasConflict: false,
    missingData: [], asOf: ASOF,
  };
  const score = calculateOpportunityScore(input);
  for (const component of score.components) {
    assert.doesNotMatch(component.label, /concorr|mercado|hhi|incumb/i);
  }
  // classifyAction só olha scores/conflito/prazo — concorrência alta não pode rebaixar
  const action = classifyAction(80, 80, false, true);
  assert.equal(action, "priorizar agora");
});
