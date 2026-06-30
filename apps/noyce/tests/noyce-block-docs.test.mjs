// Fase 2 (29/Jun): cada bloco de habilitação vira um DOCUMENTO no dossiê.
// Com um ERM completo + acervo, buildReviewDossier passa a emitir seções-documento de
// Qualificação Técnica, Econômico-Financeira e Garantia de Proposta (condicional), alimentadas
// pelo cruzamento ACERVO REAL × ERM ao vivo (buildHabilitationResult).
import assert from "node:assert/strict";
import { test } from "node:test";

const { buildReviewDossier } = await import("../lib/noyce-review.ts");

const CCP = {
  identity: { razaoSocial: "ENIAC EMPREENDIMENTOS LTDA", cnpj: "36.819.268/0001-05", creaEmpresa: "CREA-GO 39711", porte: "ME", regime: "Simples", sedeMunicipioIbge: "5200258" },
  rts: [],
  acervo: [],
  financials: [
    {
      exercicio: 2025, patrimonioLiquido: 919170.54, capitalSocial: null, ativoCirc: 927943.53,
      passivoCirc: 8772.99, ativoTotal: 927943.53, realizavelLongoPrazo: 0, exigivelLongoPrazo: 0,
      receitaBruta: 314963.26, resultado: 29170.54, fonte: "BALANÇO PATRIMONIAL 2025.pdf",
    },
  ],
  regularity: [],
  derived: { capabilityByService: {} },
};

const OPP = {
  id: "opp-bd", source: "pncp", title: "Reforma de escola", buyer: "Prefeitura de Águas Lindas",
  city: "Águas Lindas de Goiás", uf: "GO", estimatedValue: 1000000, proposalDeadline: "2026-07-10T13:00:00Z",
  market: null, habilitationChecklist: [],
};

// ERM completo (mesma forma do extractErm/curado) com requisito técnico + garantia 1%.
const FULL_ERM = {
  meta: { orgao: "", cnpjOrgao: null, municipioIbge: null, modalidade: null, valorEstimado: null, dataPublicacao: null, dataSessao: null, criterioJulgamento: null, regimeExecucao: null, objetoComum: null },
  economicoFinanceira: { exigePL: true, percentualPL: 10, indices: { LC: 1, LG: 1, SG: 1 }, justificativaPresente: true, garantiaPropostaPct: 1, clausula: null },
  tecnica: { profissional: [{ servico: "REFORMA_PREDIAL", qtdMin: 100, un: "m2" }], operacional: [], parcelasMaiorRelevancia: null, tetoQuantitativo: null, somatorio: { permitido: null }, aceitaAcervoConsorcio: null, restricaoTempoLocal: null, marcaSemSimilar: null, clausula: null },
  juridica: { declaracoes: [], clausula: null },
  fiscalTrabalhista: { CNDs: [], SICAF: null, clausula: null },
};

test("ERM completo: cada bloco de habilitação vira uma seção-documento", () => {
  const items = buildReviewDossier(OPP, CCP, FULL_ERM);
  const secoes = new Set(items.map((i) => i.secao));
  assert.ok(secoes.has("Qualificação Técnica (documento)"), "falta documento de Qualificação Técnica");
  assert.ok(secoes.has("Qualificação Econômico-Financeira (documento)"), "falta documento Econômico-Financeira");
  assert.ok(secoes.has("Garantia de Proposta (documento)"), "falta documento de Garantia (ERM exige 1%)");
});

test("documento técnico traz o requisito do edital cruzado com o acervo", () => {
  const items = buildReviewDossier(OPP, CCP, FULL_ERM);
  const tec = items.filter((i) => i.secao === "Qualificação Técnica (documento)");
  assert.ok(tec.length >= 1, "deveria haver ao menos 1 item técnico");
  assert.ok(tec.some((i) => /Status:/.test(i.valorMotor)), "item técnico deve reportar status do motor");
});

test("documento econômico-financeiro referencia o balanço real (anexar)", () => {
  const items = buildReviewDossier(OPP, CCP, FULL_ERM);
  const ef = items.filter((i) => i.secao === "Qualificação Econômico-Financeira (documento)");
  const balanco = ef.find((i) => /Balanço/i.test(i.label));
  assert.ok(balanco, "deve haver item de balanço");
  assert.equal(balanco.requerCorrecao, true, "balanço assinado é documento real — exige anexar");
  assert.ok(/2025/.test(balanco.label), "referencia o exercício mais recente");
});

test("garantia condicional: calcula o valor ≈ % do estimado e cita art. 96", () => {
  const items = buildReviewDossier(OPP, CCP, FULL_ERM);
  const g = items.find((i) => i.secao === "Garantia de Proposta (documento)");
  assert.ok(g, "garantia deve aparecer quando o ERM marca o percentual");
  assert.ok(/art\.?\s*96/i.test(g.valorMotor), "deve citar modalidades do art. 96");
  // 1% de R$ 1.000.000 = R$ 10.000
  assert.ok(/10\.000/.test(g.valorMotor), "deve estimar o valor da garantia (1% de 1.000.000)");
});

test("sem garantia no ERM: nenhum documento de garantia é gerado", () => {
  const ermSemGarantia = { ...FULL_ERM, economicoFinanceira: { ...FULL_ERM.economicoFinanceira, garantiaPropostaPct: null } };
  const items = buildReviewDossier(OPP, CCP, ermSemGarantia);
  assert.ok(!items.some((i) => i.secao === "Garantia de Proposta (documento)"), "garantia não deve aparecer sem exigência");
});
