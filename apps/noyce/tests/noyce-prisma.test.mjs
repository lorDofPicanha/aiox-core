import test from "node:test";
import assert from "node:assert/strict";

const { validateAnalysis } = await import("../lib/agents/guardrails.ts");
const { runAnalysis, PRISMA_DEFINITION } = await import("../lib/agents/analysis-agent.ts");

function fakeClient(json, opts = {}) {
  return {
    id: "fake",
    async complete() {
      if (opts.throws) throw new Error("boom");
      if (opts.refusal) return { text: "", json: null, model: "fake", refusal: true };
      return { text: JSON.stringify(json), json, model: "fake" };
    },
  };
}

const VALID_ANALYSIS = {
  opportunityScore: 72,
  confidenceScore: 84,
  resumo: "Oportunidade competitiva em reforma escolar, com preço viável se a ENIAC ficar abaixo da mediana PNCP.",
  faixaPreco: { p25: 980000, mediana: 1120000, p75: 1280000, fonte: "market-snapshot PNCP 500km" },
  concorrencia: {
    incumbente: "Construtora Alfa Ltda",
    hhi: 0.31,
    vencedores: [{ cnpj: "00.000.000/0001-00", nome: "Construtora Alfa Ltda", valor: 1100000 }],
    fonte: "vencedores-reais-pncp-500km",
  },
  riscos: [{ descricao: "Prazo de execução apertado para mobilização", severidade: "media", fonte: "edital item 6.1" }],
  pontosImpugnacao: [{ ponto: "Exigência de visita técnica obrigatória", baseLegal: "Lei 14.133 art. 63", fonte: "edital item 9.4" }],
  fonte: ["edital item 6.1", "market-snapshot PNCP 500km"],
};

const input = {
  objeto: "Reforma de escola municipal",
  editalExcerpt: "Objeto: reforma de escola. Prazo de execução: 180 dias. Item 9.4 visita técnica.",
  marketResumo: "PNCP 500km: mediana 1.12M, incumbente Alfa.",
};

// ── guardrail ──
test("validateAnalysis: válido passa", () => {
  assert.equal(validateAnalysis(VALID_ANALYSIS).ok, true);
});

test("validateAnalysis: risco sem fonte → viola proveniência", () => {
  const bad = { ...VALID_ANALYSIS, riscos: [{ ...VALID_ANALYSIS.riscos[0], fonte: "" }] };
  const r = validateAnalysis(bad);
  assert.equal(r.ok, false);
  assert.ok(r.violations.some((v) => v.rule === "provenance"));
});

test("validateAnalysis: score fora de 0..100 → viola schema", () => {
  const r = validateAnalysis({ ...VALID_ANALYSIS, opportunityScore: 101 });
  assert.equal(r.ok, false);
  assert.ok(r.violations.some((v) => v.rule === "schema" && v.field === "opportunityScore"));
});

test("validateAnalysis: resumo com ato vinculante → bloqueado", () => {
  const r = validateAnalysis({ ...VALID_ANALYSIS, resumo: "Protocolei o recurso no portal." });
  assert.equal(r.ok, false);
  assert.ok(r.violations.some((v) => v.rule === "human_act"));
});

// ── runAnalysis ──
test("runAnalysis: happy path usa a saída da LLM (source=llm)", async () => {
  const res = await runAnalysis(input, fakeClient(VALID_ANALYSIS));
  assert.equal(res.source, "llm");
  assert.equal(res.opportunityScore, 72);
  assert.equal(res.concorrencia.vencedores[0].nome, "Construtora Alfa Ltda");
});

test("runAnalysis: recusa → fallback pendente", async () => {
  const res = await runAnalysis(input, fakeClient(null, { refusal: true }));
  assert.equal(res.source, "guardrail_fallback");
  assert.equal(res.opportunityScore, 0);
  assert.ok(res.pendencias.length > 0);
});

test("runAnalysis: erro do cliente → fallback pendente", async () => {
  const res = await runAnalysis(input, fakeClient(null, { throws: true }));
  assert.equal(res.source, "guardrail_fallback");
  assert.equal(res.confidenceScore, 0);
  assert.ok(res.pendencias.length > 0);
});

test("runAnalysis: violação de guardrail → fallback pendente", async () => {
  const bad = { ...VALID_ANALYSIS, concorrencia: { ...VALID_ANALYSIS.concorrencia, fonte: "" } };
  const res = await runAnalysis(input, fakeClient(bad));
  assert.equal(res.source, "guardrail_fallback");
  assert.ok(res.pendencias.some((p) => /fonte/.test(p)));
});

test("PRISMA_DEFINITION usa Opus 4.8", () => {
  assert.equal(PRISMA_DEFINITION.model, "claude-opus-4-8");
});
