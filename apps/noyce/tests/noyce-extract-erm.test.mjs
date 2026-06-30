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

const TECNICA = `9.5 QUALIFICAÇÃO TÉCNICA
a) Registro da empresa na entidade profissional competente (CREA/CAU);
b) Comprovação de possuir no quadro permanente Engenheiro Civil ou Arquiteto;
c) Comprovação de Engenheiro ou Técnico em Segurança do Trabalho;
d) Atestado de capacidade técnico-operacional comprovando execução de 1.500 m² de área construída;
e) Carta de apresentação do responsável técnico.
É permitido o somatório de atestados para comprovação do quantitativo.`;

const ECONOMICA = `9.4 QUALIFICAÇÃO ECONÔMICO-FINANCEIRA
a) Balanço patrimonial do último exercício social;
b) Índice de Liquidez Corrente (LC) maior ou igual a 1,0;
c) Índice de Liquidez Geral (LG) ≥ 1,2;
d) Índice de Solvência Geral (SG) superior a 1,0;
e) Patrimônio líquido mínimo de 10% do valor estimado da contratação;
f) Garantia de proposta de 1% do valor estimado, nos termos do art. 58.`;

const META_TXT = `1.3 O critério de julgamento adotado será o menor preço global, nos termos do art. 33.
Modalidade: Concorrência eletrônica. Valor total estimado de R$ 1.000.000,00.`;

test("extractErm: extrai QUADRO TÉCNICO exigido (resp. técnico/eng/arquiteto) — casa com RTs, não acervo", () => {
  const { erm } = extractErm({ ...EMPTY_SECTIONS, habilitacaoTecnica: TECNICA });
  const q = erm.tecnica.quadroTecnico ?? [];
  assert.ok(q.some((s) => /Engenheiro Civil/i.test(s)), "Engenheiro Civil");
  assert.ok(q.some((s) => /Arquiteto/i.test(s)), "Arquiteto");
  assert.ok(q.some((s) => /Seguran[çc]a do Trabalho/i.test(s)), "Téc. Segurança");
  assert.ok(q.some((s) => /Respons[áa]vel t[ée]cnico/i.test(s)), "Responsável técnico");
  // profissional (serviços/acervo) fica vazio — quadro não polui o matching do motor
  assert.deepEqual(erm.tecnica.profissional, []);
  // somatório de atestados captado
  assert.equal(erm.tecnica.somatorio.permitido, true);
});

test("extractErm: extrai ATESTADO operacional com quantitativo (m²) da seção técnica", () => {
  const { erm } = extractErm({ ...EMPTY_SECTIONS, habilitacaoTecnica: TECNICA, objeto: "Reforma de 1.500 m²." });
  assert.ok(erm.tecnica.operacional.length >= 1);
  const comQtd = erm.tecnica.operacional.find((o) => o.qtdMin && o.qtdMin >= 1000);
  assert.ok(comQtd, "esperava atestado com quantitativo >= 1000");
  assert.match(comQtd.un, /m²|m2/);
});

test("extractErm: extrai ÍNDICES econômicos (LC/LG/SG), PL% e garantia% quando presentes", () => {
  const { erm } = extractErm({ ...EMPTY_SECTIONS, habilitacaoEconomica: ECONOMICA }, ECONOMICA);
  const ef = erm.economicoFinanceira;
  assert.equal(ef.indices.LC, 1);
  assert.equal(ef.indices.LG, 1.2);
  assert.equal(ef.indices.SG, 1);
  assert.equal(ef.exigePL, true);
  assert.equal(ef.percentualPL, 10);
  assert.equal(ef.garantiaPropostaPct, 1);
});

test("extractErm: extrai META (critério de julgamento, modalidade, valor estimado)", () => {
  const { erm } = extractErm({ ...EMPTY_SECTIONS }, META_TXT);
  assert.match(erm.meta.criterioJulgamento, /menor pre[çc]o/i);
  assert.match(erm.meta.modalidade, /concorr[êe]ncia/i);
  assert.equal(erm.meta.valorEstimado, 1000000);
});

test("end-to-end: dossiê PRÉ-PREENCHE Qualificação Técnica/Econômica quando o edital exige", () => {
  const text = `1. DO OBJETO\nReforma de escola de 1.500 m².\n\n${TECNICA}\n\n${ECONOMICA}\n\n${FISCAL}\n\n${DECLS}\n\n${META_TXT}`;
  const sections = extractEditalSections(text);
  const { erm } = extractErm(sections, text);
  assert.ok((erm.tecnica.quadroTecnico ?? []).length >= 2, "técnica deve listar quadro exigido");

  // CCP com 1 Eng. Civil real → a matriz de atendimento deve marcar ATENDE (casa título × RT)
  const OPP = { id: "e2e-tec", source: "pncp", title: "Reforma de escola", buyer: "Município", city: "X", uf: "GO", estimatedValue: 1000000, proposalDeadline: "2026-07-10T12:00:00Z", market: null, habilitationChecklist: [] };
  const CCP = { identity: { razaoSocial: "ENIAC LTDA", cnpj: "36.819.268/0001-05", creaEmpresa: "CREA-GO 39711", porte: "ME", sedeMunicipioIbge: "5200258" }, rts: [{ id: "a", nome: "Alice Ramos", titulo: "Eng. Civil", crea: "CREA-GO 123", rnp: null, vinculo: { tipo: "responsavel_tecnico", desde: "2025-01-01" } }], acervo: [], financials: [{ exercicio: 2025, patrimonioLiquido: 900000, capitalSocial: null, ativoCirc: 920000, passivoCirc: 8000, ativoTotal: 920000, realizavelLongoPrazo: 0, exigivelLongoPrazo: 0, receitaBruta: 0, resultado: null, fonte: "BP 2025" }], regularity: [], derived: { capabilityByService: {} } };
  const items = buildReviewDossier(OPP, CCP, erm);
  const tec = items.find((i) => /Qualifica[çc][ãa]o T[ée]cnica/i.test(i.secao));
  assert.ok(tec, `esperava seção técnica; veio: ${[...new Set(items.map((i) => i.secao))].join(" | ")}`);
  assert.match(tec.valorMotor, /Alice Ramos/, "documento deve listar o RT real");
  assert.match(tec.valorMotor, /Engenheiro Civil: ATENDE/, "Eng. Civil deve ATENDER (Alice é Eng. Civil)");
  // documento econômico preenchido com índice computado
  const econ = items.find((i) => /Econ[ôóo]mico-Financeira/i.test(i.secao));
  assert.ok(econ && /Liquidez Corrente/.test(econ.valorMotor), "doc econômico deve trazer índice computado");
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
