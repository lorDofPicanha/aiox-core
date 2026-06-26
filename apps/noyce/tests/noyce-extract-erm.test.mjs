// Extração do ERM (declarações + CNDs exigidas) do texto do edital — faz a completude valer
// em qualquer edital, não só nos curados. Princípio: melhor sobrar que faltar.
import assert from "node:assert/strict";
import { test } from "node:test";

const { extractErm } = await import("../lib/edital/extract-erm.ts");
const { extractEditalSections } = await import("../lib/edital/extract-edital.ts");
const { buildReviewDossier, mergeReview } = await import("../lib/noyce-review.ts");
const { evaluateDocCompleteness } = await import("../lib/eval/doc-completeness.ts");

const EMPTY_SECTIONS = {
  objeto: "", habilitacaoTecnica: "", habilitacaoEconomica: "", habilitacaoFiscal: "",
  orcamento: "", proposta: "", garantia: "", declaracoes: "", consorcio: "",
};

const FISCAL = `7.1 HABILITAÇÃO FISCAL E TRABALHISTA
a) Certidão Negativa de Débitos relativos a Tributos Federais e à Dívida Ativa da União;
b) Certidão Negativa de Débitos Estaduais;
c) Certidão de regularidade com a Fazenda Municipal;
d) Certificado de Regularidade do FGTS (CRF);
e) Certidão Negativa de Débitos Trabalhistas (CNDT);
f) Certidão Negativa de Falência e Recuperação Judicial.`;

const DECLS = `7.5 DECLARAÇÕES
O licitante deverá apresentar:
- Declaração de que não emprega menor de 18 anos em trabalho noturno, salvo aprendiz;
- Declaração de elaboração independente de proposta;
- Declaração de inexistência de fato impeditivo;
- Declaração de cumprimento dos requisitos de habilitação;
- Declaração de inexistência de nepotismo (Súmula Vinculante 13);
- Declaração de reserva de cargos para pessoa com deficiência;
- Declaração de visita técnica ao local da obra.`;

test("extractErm: detecta as CNDs exigidas (6) com confiança alta", () => {
  const { erm, confidence } = extractErm({ ...EMPTY_SECTIONS, habilitacaoFiscal: FISCAL });
  const cnds = erm.fiscalTrabalhista.CNDs.join(" | ");
  assert.match(cnds, /Federais/);
  assert.match(cnds, /Estaduais/);
  assert.match(cnds, /Municipais/);
  assert.match(cnds, /FGTS/);
  assert.match(cnds, /Trabalhistas/);
  assert.match(cnds, /Fal[êe]ncia/);
  assert.equal(confidence.cnds, "alta");
});

test("extractErm: detecta declarações canônicas + específicas do edital", () => {
  const { erm, confidence } = extractErm({ ...EMPTY_SECTIONS, declaracoes: DECLS });
  const labels = erm.juridica.declaracoes;
  // canônicas (por palavra-chave)
  assert.ok(labels.some((l) => /menor/i.test(l)));
  assert.ok(labels.some((l) => /independente/i.test(l)));
  assert.ok(labels.some((l) => /impeditivo/i.test(l)));
  assert.ok(labels.some((l) => /habilita[çc]/i.test(l)));
  assert.ok(labels.some((l) => /nepotismo/i.test(l)));
  assert.ok(labels.some((l) => /defici|PCD|reserva/i.test(l)));
  // específica sem template → capturada como frase do edital, não some
  assert.ok(labels.some((l) => /visita/i.test(l)), "declaração de visita técnica deve ser capturada");
  assert.equal(confidence.declaracoes, "alta");
});

test("extractErm: sem seções → detecta via texto cheio, confiança media (sem corroboração de seção)", () => {
  const full = FISCAL + "\n" + DECLS;
  const { erm, confidence } = extractErm({ ...EMPTY_SECTIONS }, full);
  assert.ok(erm.fiscalTrabalhista.CNDs.length >= 4, "CNDs detectadas no texto cheio");
  assert.ok(erm.juridica.declaracoes.length >= 4, "declarações detectadas no texto cheio");
  // detectou bastante, mas sem a seção p/ corroborar → media, não alta
  assert.equal(confidence.cnds, "media");
  assert.equal(confidence.declaracoes, "media");
});

test("extractErm: 'menor preço' NÃO dispara a declaração de menor (detectRe estrito)", () => {
  const full = "O critério de julgamento será o de MENOR PREÇO global por lote. Não há outras exigências.";
  const { erm } = extractErm({ ...EMPTY_SECTIONS }, full);
  assert.ok(!erm.juridica.declaracoes.some((d) => /menor/i.test(d)), "menor preço não é declaração de menor");
});

test("end-to-end: texto do edital → sections → ERM → dossiê → gate de completude PASS", () => {
  const text = `1. DO OBJETO\nReforma de escola municipal.\n\n${FISCAL}\n\n${DECLS}`;
  const sections = extractEditalSections(text);
  const { erm } = extractErm(sections, text);
  assert.ok(erm.juridica.declaracoes.length >= 5, "ERM deve listar as declarações");
  assert.ok(erm.fiscalTrabalhista.CNDs.length >= 5, "ERM deve listar as CNDs");

  const OPP = { id: "e2e-1", source: "pncp", title: "Reforma de escola", buyer: "Município", city: "X", uf: "GO", estimatedValue: 1000000, proposalDeadline: "2026-07-10T12:00:00Z", market: null, habilitationChecklist: [] };
  const CCP = { identity: { razaoSocial: "ENIAC LTDA", cnpj: "36.819.268/0001-05", porte: "ME", sedeMunicipioIbge: "5200258" }, rts: [], acervo: [], financials: [], regularity: [], derived: { capabilityByService: {} } };

  const reviewed = mergeReview(buildReviewDossier(OPP, CCP, erm), {});
  const r = evaluateDocCompleteness({ erm, reviewed, vault: [], asOf: "2026-07-01T00:00:00Z" });
  // tudo que o ERM exige foi surfado no dossiê (nada silenciosamente ausente)
  assert.equal(r.declaracoes.missing.length, 0, `faltaram: ${r.declaracoes.missing}`);
  assert.equal(r.certidoes.missing.length, 0, `faltaram: ${r.certidoes.missing}`);
  assert.equal(r.coveragePass, true);
});
