// Testes do fluxo Interesse → Dossiê → Revisão humana.
// Regra crítica (owner 12/Jun): valor corrigido pelo humano SEMPRE prevalece e trava o item.
import assert from "node:assert/strict";
import { test } from "node:test";

const { buildReviewDossier, mergeReview, reviewProgress } = await import("../lib/noyce-review.ts");

const CCP = {
  identity: {
    razaoSocial: "ENIAC EMPREENDIMENTOS LTDA",
    cnpj: "36.819.268/0001-05",
    creaEmpresa: "CREA-GO 39711",
    porte: "ME",
    regime: "Simples",
    sedeMunicipioIbge: "5200258",
  },
  rts: [],
  acervo: [],
  financials: [],
  regularity: [],
  derived: { capabilityByService: {} },
};

const OPPORTUNITY = {
  id: "opp-1",
  source: "pncp",
  title: "Execução de obra",
  buyer: "Prefeitura de Águas Lindas",
  city: "Águas Lindas de Goiás",
  uf: "GO",
  estimatedValue: 2831789.56,
  proposalDeadline: "2026-06-30T13:00:00Z",
  market: null,
  habilitationChecklist: [
    { label: "Fiscal e trabalhista", status: "missing", note: "Vault sem certidões." },
    { label: "Econômico-financeira", status: "ok", note: "Folga 3,2×." },
  ],
};

test("dossiê pré-preenche certame + 4 frentes + declarações com dados ENIAC + proposta", () => {
  const items = buildReviewDossier(OPPORTUNITY, CCP);
  const secoes = new Set(items.map((i) => i.secao));
  assert.ok(secoes.has("Dados do certame"));
  assert.ok(secoes.has("Habilitação — 4 frentes"));
  assert.ok(secoes.has("Declarações (pré-redigidas)"));
  assert.ok(secoes.has("Proposta"));
  const decl = items.find((i) => i.label.includes("fato impeditivo"));
  assert.match(decl.valorMotor, /ENIAC EMPREENDIMENTOS LTDA/);
  assert.match(decl.valorMotor, /36\.819\.268\/0001-05/);
  for (const item of items) assert.ok(item.proveniencia.length > 0, "todo item tem proveniência");
});

test("correção humana prevalece sobre o motor e fica registrada com o valor original", () => {
  const items = buildReviewDossier(OPPORTUNITY, CCP);
  const alvo = items[0];
  const reviewed = mergeReview(items, {
    [alvo.id]: { status: "corrigido", valorHumano: "Texto definido pelo humano", em: "2026-06-12T12:00:00Z" },
  });
  const item = reviewed.find((i) => i.id === alvo.id);
  assert.equal(item.status, "corrigido");
  assert.equal(item.valorFinal, "Texto definido pelo humano");
  assert.equal(item.valorMotor, alvo.valorMotor, "valor original do motor preservado como histórico");
});

test("re-rodar o motor NÃO sobrescreve correção humana (trava)", () => {
  const state = {};
  const v1 = buildReviewDossier(OPPORTUNITY, CCP);
  state[v1[1].id] = { status: "corrigido", valorHumano: "Valor humano fixo", em: "2026-06-12T12:00:00Z" };
  // motor re-roda (ex.: snapshot atualizado muda o valorMotor)
  const v2 = buildReviewDossier({ ...OPPORTUNITY, estimatedValue: 999999 }, CCP);
  const reviewed = mergeReview(v2, state);
  const item = reviewed.find((i) => i.id === v1[1].id);
  assert.equal(item.valorFinal, "Valor humano fixo", "humano prevalece mesmo com motor recalculado");
});

test("progresso: pendentes contam; 100% revisado = pronto", () => {
  const items = buildReviewDossier(OPPORTUNITY, CCP);
  const none = reviewProgress(mergeReview(items, {}));
  assert.equal(none.done, 0);
  assert.equal(none.ready, false);
  const all = {};
  for (const item of items) all[item.id] = { status: "aprovado", em: "2026-06-12T12:00:00Z" };
  const full = reviewProgress(mergeReview(items, all));
  assert.equal(full.done, full.total);
  assert.equal(full.ready, true);
});
