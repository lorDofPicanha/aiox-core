import { test } from "node:test";
import assert from "node:assert/strict";

const {
  extractEditalSections,
  extractValorEstimadoHint,
  buildEditalExcerpt,
  extractEdital,
  extractEditalText,
  mergeEditalSources,
} = await import("../lib/edital/extract-edital.ts");
const { parsePncpId } = await import("../lib/edital/pncp-source.ts");

// Edital sintético com a estrutura típica de um edital de obra BR.
const EDITAL = `
PREFEITURA MUNICIPAL DE ÁGUAS LINDAS DE GOIÁS
EDITAL DE CONCORRÊNCIA ELETRÔNICA Nº 012/2026

1. DO OBJETO
Contratação de empresa de engenharia para reforma e ampliação de escola municipal de ensino fundamental, área de 1.350 m².

7. DA HABILITAÇÃO
7.1 QUALIFICAÇÃO TÉCNICA: atestado de capacidade técnica registrado no CREA comprovando execução de obra de edificação pública compatível; admite-se soma de até 2 atestados.
7.2 QUALIFICAÇÃO ECONÔMICO-FINANCEIRA: balanço patrimonial do último exercício com índices de Liquidez Geral, Liquidez Corrente e Solvência Geral maiores ou iguais a 1,0; patrimônio líquido mínimo de 10% do valor estimado.
7.3 REGULARIDADE FISCAL: CND federal, FGTS, CNDT trabalhista, estadual e municipal.

8. DA PROPOSTA
Validade da proposta: 60 (sessenta) dias. Prazo de execução: 180 (cento e oitenta) dias.

9. DO ORÇAMENTO / VALOR ESTIMADO
Valor estimado da contratação: R$ 1.350.000,00. BDI de referência: 22%.

10. DA GARANTIA
Garantia de proposta de 1% do valor estimado.

11. DO CONSÓRCIO
Admite-se participação em consórcio, nos termos do art. 15 da Lei 14.133/2021.

ANEXO V - DECLARAÇÕES
Declaração de elaboração independente de proposta; declaração de inexistência de fato impeditivo; declaração de cumprimento do art. 7º, XXXIII, da CF.
`;

test("extractEditalSections acha as seções principais do edital", () => {
  const s = extractEditalSections(EDITAL);
  assert.match(s.objeto, /reforma e amplia/i);
  assert.match(s.habilitacaoTecnica, /atestado de capacidade/i);
  assert.match(s.habilitacaoEconomica, /liquidez/i);
  assert.match(s.habilitacaoFiscal, /CND|FGTS/i);
  assert.match(s.orcamento, /valor estimado|R\$/i);
  assert.match(s.proposta, /validade|prazo de execu/i);
  assert.match(s.declaracoes, /declara/i);
  assert.match(s.consorcio, /cons[oó]rcio/i);
});

test("extractValorEstimadoHint parseia R$ 1.350.000,00", () => {
  const s = extractEditalSections(EDITAL);
  const v = extractValorEstimadoHint(s, EDITAL);
  assert.equal(v, 1350000);
});

test("buildEditalExcerpt rotula as seções achadas", () => {
  const s = extractEditalSections(EDITAL);
  const ex = buildEditalExcerpt(s);
  assert.match(ex, /### OBJETO/);
  assert.match(ex, /### HABILITAÇÃO TÉCNICA/);
  assert.match(ex, /### DECLARAÇÕES EXIGIDAS/);
});

test("extractEdital (pipeline) entrega excerpt + dica de valor + seções achadas", async () => {
  const r = await extractEdital({ text: EDITAL });
  assert.equal(r.valorEstimadoHint, 1350000);
  assert.ok(r.excerpt.length > 100);
  assert.ok(r.encontradas.includes("objeto"));
  assert.ok(r.encontradas.includes("habilitacaoTecnica"));
  assert.ok(r.encontradas.includes("declaracoes"));
});

test("extractEditalText sem text nem pdfBuffer lança erro claro", async () => {
  await assert.rejects(() => extractEditalText({}), /forneça `text` ou `pdfBuffer`/);
});

test("seções ausentes ficam vazias (nunca inventa)", () => {
  const s = extractEditalSections("Texto qualquer sem cabeçalhos de edital.");
  assert.equal(s.orcamento, "");
  assert.equal(s.habilitacaoTecnica, "");
});

test("mergeEditalSources: por seção, a fonte mais rica vence", () => {
  const edital = `1. DO OBJETO\nReforma de escola.\n9. DO ORÇAMENTO\nValor estimado: R$ 500.000,00.`;
  const planilha = `PLANILHA ORÇAMENTÁRIA\nItem 1 Demolição m³ 60 R$95,00; Item 2 Alvenaria m² 420 R$88,00; Item 3 Pintura m² 1500 R$28,00; Item 4 Cobertura m² 400 R$240,00 (detalhamento completo da planilha do edital).`;
  const merged = mergeEditalSources([
    { label: "Edital", text: edital },
    { label: "Planilha Orçamentária", text: planilha },
  ]);
  // objeto vem do Edital
  assert.match(merged.sections.objeto, /reforma de escola/i);
  // orçamento: o da Planilha (mais longo/rico) deve vencer o do Edital
  assert.match(merged.sections.orcamento, /Item 4 Cobertura/i);
  assert.ok(merged.encontradas.includes("orcamento"));
});

test("parsePncpId decompõe cnpj/ano/sequencial (sem zeros à esquerda)", () => {
  const r = parsePncpId("01409580000138-1-000954/2026");
  assert.equal(r.cnpj, "01409580000138");
  assert.equal(r.ano, "2026");
  assert.equal(r.sequencial, "954");
});
