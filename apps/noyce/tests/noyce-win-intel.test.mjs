import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import {
  WIN_TABS,
  deriveDeterministicSignals,
  buildWinIntelRequest,
  parseWinIntel,
  mergeWinIntel,
} from "../lib/noyce-win-intel.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Carrega um MarketStructure REAL do snapshot PNCP (DF Obras: concentrado, incumbente STARK 88,5%).
const snapshot = JSON.parse(
  readFileSync(join(__dirname, "../lib/data/competitor-500km-research.json"), "utf8"),
);
const realMarket = snapshot.orgaos.find((o) => o.competitors && o.competitors.length > 0);

const ERM_FIXTURE = {
  meta: { orgao: "Secretaria de Obras", cnpjOrgao: "00394742000149", municipioIbge: null, modalidade: 6, valorEstimado: 1000000, dataPublicacao: null, dataSessao: null, criterioJulgamento: "menor preço", regimeExecucao: null },
  economicoFinanceira: { exigePL: true, percentualPL: 10, indices: { LC: 1.0, LG: 1.0, SG: 1.0 }, justificativaPresente: true, garantiaPropostaPct: 1, clausula: null },
  tecnica: { profissional: [{ servico: "Engenheiro civil", qtdMin: 1, un: "un" }], operacional: [{ servico: "Pavimentação", qtdMin: 5000, qtdObjeto: 10000, un: "m²" }], parcelasMaiorRelevancia: ["Pavimentação asfáltica"], tetoQuantitativo: null, somatorio: { permitido: true }, aceitaAcervoConsorcio: true, restricaoTempoLocal: false, marcaSemSimilar: false, clausula: null },
  juridica: { declaracoes: ["Não emprega menor", "Idoneidade", "ME/EPP"], clausula: null },
  fiscalTrabalhista: { CNDs: ["Federal", "FGTS", "CNDT"], SICAF: true, clausula: null },
};

test("fixture: o snapshot real tem um órgão com competidores", () => {
  assert.ok(realMarket, "esperava ao menos um MarketStructure com competidores no snapshot");
  assert.ok(realMarket.priceBand && realMarket.priceBand.sampleSize > 0);
});

test("determinístico: mercado concentrado gera proposta (faixa real) + técnica (incumbente), com fonte", () => {
  const signals = deriveDeterministicSignals({ market: realMarket, erm: ERM_FIXTURE });
  const tabs = signals.map((s) => s.tab);
  assert.ok(tabs.includes("proposta"), "esperava sugestão de proposta a partir do priceBand");
  assert.ok(tabs.includes("tecnica"), "esperava sugestão técnica a partir do incumbente");
  // Toda sugestão determinística carrega fonte (proveniência) não-vazia.
  for (const s of signals) {
    assert.ok(s.fonte && s.fonte.length > 0, `sugestão [${s.tab}] sem fonte`);
    assert.ok(["grounded", "inferred", "gap"].includes(s.grounding));
  }
  // A sugestão técnica cita o incumbente real (STARK).
  const tec = signals.find((s) => s.tab === "tecnica");
  assert.match(tec.detalhe, /STARK/i);
});

test("determinístico: sem mercado (cobertura zero) → nenhuma sugestão inventada", () => {
  const signals = deriveDeterministicSignals({ market: null, erm: ERM_FIXTURE });
  assert.equal(signals.length, 0);
});

test("anti-alucinação: nenhuma sugestão determinística inventa número fora do dado", () => {
  const signals = deriveDeterministicSignals({ market: realMarket, erm: ERM_FIXTURE });
  // A faixa de preço citada tem de bater com o priceBand real (mediana formatada aparece no texto).
  const prop = signals.find((s) => s.tab === "proposta");
  assert.ok(prop, "esperava sugestão de proposta");
  // n= da amostra real precisa aparecer (rastreabilidade), não um número solto.
  assert.match(prop.detalhe + prop.fonte, new RegExp(`n=${realMarket.priceBand.sampleSize}`));
});

test("buildWinIntelRequest: monta LlmRequest schema-locked com órgão + ERM no prompt", () => {
  const req = buildWinIntelRequest({
    market: realMarket,
    erm: ERM_FIXTURE,
    certame: { titulo: "Pavimentação de via", orgao: realMarket.orgaoName, valorEstimado: 1000000 },
  });
  assert.ok(req.system && /estrategista de licita/i.test(req.system));
  assert.ok(req.schema, "request precisa de schema (structured output)");
  assert.match(req.user, /Pavimenta/); // certame
  assert.match(req.user, /EXIGÊNCIAS DO EDITAL/); // ERM resumido
  assert.match(req.user, /VENCEDORES/); // histórico do órgão
  assert.equal(req.effort, "high");
});

test("buildWinIntelRequest: sem ERM, instrui a IA a usar só o histórico e marcar inferred", () => {
  const req = buildWinIntelRequest({ market: realMarket, erm: null });
  assert.match(req.user, /ainda não extraído/i);
});

test("parseWinIntel: aceita itens válidos e descarta malformados (tab inválida / sem título)", () => {
  const parsed = parseWinIntel({
    suggestions: [
      { tab: "proposta", titulo: "BDI competitivo", detalhe: "Ajustar BDI", porque: "x", fonte: "y", impacto: "alto", grounding: "grounded" },
      { tab: "INVALIDA", titulo: "lixo", detalhe: "lixo" }, // tab fora do enum → descarta
      { tab: "fiscal", titulo: "", detalhe: "sem título" }, // sem título → descarta
      { tab: "juridica", titulo: "Declaração extra", detalhe: "Anexar", impacto: "xpto", grounding: "zzz" }, // normaliza defaults
    ],
  });
  assert.equal(parsed.length, 2);
  assert.equal(parsed[0].tab, "proposta");
  const jur = parsed.find((p) => p.tab === "juridica");
  assert.equal(jur.impacto, "medio"); // default anti-lixo
  assert.equal(jur.grounding, "inferred"); // default anti-lixo
});

test("parseWinIntel: entrada não-objeto / sem array → []", () => {
  assert.deepEqual(parseWinIntel(null), []);
  assert.deepEqual(parseWinIntel({ suggestions: "nope" }), []);
});

test("mergeWinIntel: agrupa por aba, determinísticas primeiro, dedupe por título, ordena por impacto", () => {
  const det = deriveDeterministicSignals({ market: realMarket, erm: ERM_FIXTURE });
  const ia = [
    { tab: "fiscal", titulo: "SICAF em dia", detalhe: "Manter cadastro SICAF nível VI", porque: "p", fonte: "f", impacto: "baixo", grounding: "inferred" },
    { tab: "tecnica", titulo: "Quebre a vantagem do incumbente com acervo equivalente", detalhe: "dup", porque: "p", fonte: "f", impacto: "alto", grounding: "inferred" },
    { tab: "proposta", titulo: "BDI enxuto", detalhe: "Reduzir BDI", porque: "p", fonte: "f", impacto: "alto", grounding: "inferred" },
  ];
  const merged = mergeWinIntel(det, ia);
  // Estrutura tem todas as abas.
  for (const t of WIN_TABS) assert.ok(Array.isArray(merged[t]));
  // Fiscal só tem a da IA (determinístico não cobre fiscal aqui).
  assert.equal(merged.fiscal.length, 1);
  // Técnica NÃO duplica o título do incumbente (dedupe case-insensitive).
  const titulosTec = merged.tecnica.map((s) => s.titulo.toLowerCase());
  const dupCount = titulosTec.filter((t) => t.includes("incumbente")).length;
  assert.equal(dupCount, 1, "esperava dedupe do título do incumbente");
  // Proposta ordena alto antes de baixo.
  if (merged.proposta.length >= 2) {
    assert.ok(merged.proposta[0].impacto === "alto");
  }
});
