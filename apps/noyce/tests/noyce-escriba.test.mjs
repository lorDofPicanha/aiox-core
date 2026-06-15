import test from "node:test";
import assert from "node:assert/strict";

const { computePlanilha, renderPlanilhaCsv } = await import("../lib/noyce-planilha.ts");
const { validateDocumentPackage } = await import("../lib/agents/guardrails.ts");
const { runDocumentDraft } = await import("../lib/agents/document-agent.ts");

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

// ── computePlanilha (número fora da LLM) ──
test("computePlanilha: subtotais, BDI e total calculados em código", () => {
  const p = computePlanilha(
    [
      { descricao: "Alvenaria", unidade: "m²", quantidade: 100, precoUnitario: 50, fonte: "TR 11.2" },
      { descricao: "Pintura", unidade: "m²", quantidade: 200, precoUnitario: 20, fonte: "TR 11.2" },
    ],
    25,
  );
  assert.equal(p.linhas[0].subtotal, 5000);
  assert.equal(p.linhas[1].subtotal, 4000);
  assert.equal(p.subtotalDireto, 9000);
  assert.equal(p.bdiValor, 2250);
  assert.equal(p.total, 11250);
});

test("renderPlanilhaCsv: cabeçalho + itens + TOTAL", () => {
  const csv = renderPlanilhaCsv(computePlanilha([{ descricao: "X", unidade: "un", quantidade: 2, precoUnitario: 10, fonte: "f" }], 0));
  assert.match(csv, /Descrição/);
  assert.match(csv, /TOTAL;20\.00/);
});

// ── guardrail ──
const VALID_DOC = {
  proposta: { validadeDias: 60, prazoExecucao: "180 dias", fonte: "edital item 7" },
  planilhaItens: [{ descricao: "Alvenaria", unidade: "m²", quantidade: 100, precoUnitario: 50, fonte: "TR 11.2" }],
  bdiPct: 25,
  declaracoes: [{ tipo: "ME/EPP", texto: "Declaro enquadramento como ME/EPP.", fonte: "edital item 9" }],
};

test("validateDocumentPackage: válido passa", () => {
  assert.equal(validateDocumentPackage(VALID_DOC).ok, true);
});

test("validateDocumentPackage: item sem fonte → viola proveniência", () => {
  const bad = { ...VALID_DOC, planilhaItens: [{ ...VALID_DOC.planilhaItens[0], fonte: "" }] };
  const r = validateDocumentPackage(bad);
  assert.equal(r.ok, false);
  assert.ok(r.violations.some((v) => v.rule === "provenance"));
});

test("validateDocumentPackage: declaração que EXECUTA ato vinculante → bloqueada", () => {
  const bad = { ...VALID_DOC, declaracoes: [{ tipo: "x", texto: "Protocolei o recurso no portal.", fonte: "f" }] };
  assert.equal(validateDocumentPackage(bad).ok, false);
});

// ── runDocumentDraft ──
test("runDocumentDraft: happy path computa números em código (ignora 'total' da LLM)", async () => {
  const withBogusTotal = {
    ...VALID_DOC,
    planilhaItens: [
      { descricao: "Alvenaria", unidade: "m²", quantidade: 100, precoUnitario: 50, fonte: "TR" },
      { descricao: "Pintura", unidade: "m²", quantidade: 200, precoUnitario: 20, fonte: "TR" },
    ],
    bdiPct: 25,
    total: 999999, // valor mentiroso da LLM — deve ser IGNORADO
  };
  const pkg = await runDocumentDraft({ objeto: "Reforma de escola", editalExcerpt: "..." }, fakeClient(withBogusTotal));
  assert.equal(pkg.source, "llm");
  assert.equal(pkg.planilha.total, 11250); // recalculado em código, não 999999
  assert.ok(pkg.planilhaCsv.includes("TOTAL;11250.00"));
});

test("runDocumentDraft: recusa do modelo → pacote PENDENTE (sem número inventado)", async () => {
  const pkg = await runDocumentDraft({ objeto: "x", editalExcerpt: "..." }, fakeClient(null, { refusal: true }));
  assert.equal(pkg.source, "guardrail_fallback");
  assert.equal(pkg.planilha, null);
  assert.ok(pkg.pendencias.length > 0);
});

test("runDocumentDraft: erro do cliente → pacote PENDENTE", async () => {
  const pkg = await runDocumentDraft({ objeto: "x", editalExcerpt: "..." }, fakeClient(null, { throws: true }));
  assert.equal(pkg.source, "guardrail_fallback");
  assert.equal(pkg.planilha, null);
});

test("runDocumentDraft: item sem fonte → guardrail reprova → PENDENTE", async () => {
  const bad = { ...VALID_DOC, planilhaItens: [{ ...VALID_DOC.planilhaItens[0], fonte: "" }] };
  const pkg = await runDocumentDraft({ objeto: "x", editalExcerpt: "..." }, fakeClient(bad));
  assert.equal(pkg.source, "guardrail_fallback");
  assert.ok(pkg.pendencias.some((p) => /fonte/.test(p)));
});
