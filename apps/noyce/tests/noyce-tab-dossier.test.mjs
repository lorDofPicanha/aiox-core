import { test } from "node:test";
import assert from "node:assert/strict";
import { buildTabDossierHtml } from "../lib/noyce-package.ts";

const CCP = { identity: { razaoSocial: "ENIAC ENGENHARIA LTDA", cnpj: "12.345.678/0001-90", sedeMunicipio: "Águas Lindas de Goiás-GO", representanteLegal: { nome: "Lucas Cardoso Fernandes", cpf: "028.045.341-89", cargo: "Administrador", rg: null } } };
const OPP = { title: "Reforma de escola municipal", buyer: "Município X" };

const ERM = {
  meta: { criterioJulgamento: "menor preço", orgao: "Município X", cnpjOrgao: "00000000000191", municipioIbge: null, modalidade: 6, valorEstimado: 1000000, dataPublicacao: null, dataSessao: null, regimeExecucao: null },
  economicoFinanceira: { exigePL: true, percentualPL: 10, indices: { LC: 1.2, LG: null, SG: null }, justificativaPresente: true, garantiaPropostaPct: 1, clausula: null },
  tecnica: { profissional: [{ servico: "Engenheiro civil", qtdMin: 1, un: "un" }], operacional: [{ servico: "Pavimentação", qtdMin: 5000, qtdObjeto: 10000, un: "m²" }], parcelasMaiorRelevancia: ["Pavimentação asfáltica"], tetoQuantitativo: null, somatorio: { permitido: true }, aceitaAcervoConsorcio: true, restricaoTempoLocal: false, marcaSemSimilar: false, clausula: null },
  juridica: { declaracoes: ["Não emprega menor", "Idoneidade"], clausula: null },
  fiscalTrabalhista: { CNDs: ["Federal", "FGTS", "CNDT"], SICAF: true, clausula: null },
};

const reviewed = (over) => ({ id: "x", secao: "Declarações", label: "Decl", valorMotor: "m", proveniencia: "Lei 14.133", valorFinal: "texto final", status: "aprovado", ...over });

test("aba fiscal: lista TODAS as CNDs do edital + SICAF como exigências", () => {
  const html = buildTabDossierHtml({ tab: "fiscal", opportunity: OPP, ccp: CCP, erm: ERM, reviewed: [], winSuggestions: [], generatedAtLabel: "30/06/2026" });
  assert.match(html, /Certidão exigida: Federal/);
  assert.match(html, /Certidão exigida: FGTS/);
  assert.match(html, /Certidão exigida: CNDT/);
  assert.match(html, /Cadastro SICAF/);
});

test("aba técnica: profissional + operacional (com quantitativo) + parcela de relevância", () => {
  const html = buildTabDossierHtml({ tab: "tecnica", opportunity: OPP, ccp: CCP, erm: ERM, reviewed: [], winSuggestions: [], generatedAtLabel: "30/06/2026" });
  assert.match(html, /Profissional: Engenheiro civil/);
  assert.match(html, /Capacidade operacional: Pavimentação/);
  assert.match(html, /5000/); // quantitativo mínimo
  assert.match(html, /Parcela de maior relevância: Pavimentação asfáltica/);
});

test("aba proposta: exige proposta na faixa legal + planilha BDI + critério de julgamento", () => {
  const html = buildTabDossierHtml({ tab: "proposta", opportunity: OPP, ccp: CCP, erm: ERM, reviewed: [], winSuggestions: [], generatedAtLabel: "30/06/2026" });
  assert.match(html, /piso 75%/);
  assert.match(html, /Planilha de composição/);
  assert.match(html, /menor preço/);
});

test("peça aprovada: emite texto assinável + assinatura, SEM marca d'água de rascunho", () => {
  const html = buildTabDossierHtml({
    tab: "juridica", opportunity: OPP, ccp: CCP, erm: ERM,
    reviewed: [reviewed({ secao: "Declarações", label: "Não emprega menor", valorFinal: "Declaramos que não empregamos menor...", status: "aprovado" })],
    winSuggestions: [], generatedAtLabel: "30/06/2026",
  });
  assert.match(html, /Declaramos que não empregamos menor/);
  assert.match(html, /ENIAC ENGENHARIA LTDA/); // assinatura
  assert.doesNotMatch(html, /RASCUNHO — REVISAR ANTES DE USAR/);
  assert.match(html, /pronto para revisão/);
});

test("peça pendente: marca d'água RASCUNHO + NÃO emite texto assinável", () => {
  const html = buildTabDossierHtml({
    tab: "juridica", opportunity: OPP, ccp: CCP, erm: ERM,
    reviewed: [reviewed({ secao: "Declarações", label: "Idoneidade", valorFinal: "texto", status: "pendente" })],
    winSuggestions: [], generatedAtLabel: "30/06/2026",
  });
  assert.match(html, /RASCUNHO — REVISAR ANTES DE USAR/);
  assert.match(html, /só é emitido após revisão humana/);
  assert.doesNotMatch(html, /class="assinatura"/);
});

test("sugestões p/ vencer aparecem na tabela com impacto + fonte", () => {
  const html = buildTabDossierHtml({
    tab: "proposta", opportunity: OPP, ccp: CCP, erm: ERM, reviewed: [],
    winSuggestions: [{ tab: "proposta", titulo: "Faixa real dos vencedores", detalhe: "Posicione entre X e Y", porque: "preço é critério", fonte: "PNCP contratos 123", impacto: "alto", grounding: "grounded" }],
    generatedAtLabel: "30/06/2026",
  });
  assert.match(html, /Sugestões para vencer/);
  assert.match(html, /Faixa real dos vencedores/);
  assert.match(html, /ALTO/);
  assert.match(html, /PNCP contratos 123/);
});

test("sem ERM: documento avisa que as exigências não foram extraídas (não inventa)", () => {
  const html = buildTabDossierHtml({ tab: "fiscal", opportunity: OPP, ccp: CCP, erm: null, reviewed: [], winSuggestions: [], generatedAtLabel: "30/06/2026" });
  assert.match(html, /ERM ainda não extraído/);
});

test("HTML é autocontido (doctype + style + título da aba)", () => {
  const html = buildTabDossierHtml({ tab: "economico_financeira", opportunity: OPP, ccp: CCP, erm: ERM, reviewed: [], winSuggestions: [], generatedAtLabel: "30/06/2026" });
  assert.match(html, /^<!doctype html>/);
  assert.match(html, /<style>/);
  assert.match(html, /Patrimônio líquido mínimo/);
  assert.match(html, /Índice contábil LC/);
});
