import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const { buildSuspicionSignals, dataLimiteImpugnacao } = await import("../lib/noyce-suspicion.ts");

const baseDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "lib", "data");
const legalConstants = JSON.parse(readFileSync(path.join(baseDir, "legal-constants.json"), "utf8"));
const feriadosNacionais = JSON.parse(readFileSync(path.join(baseDir, "feriados-nacionais.json"), "utf8"));

const economicClause = {
  numero: "12.1",
  texto: "Exigencias economico-financeiras do edital.",
  pagina: 18,
};

const technicalClause = {
  numero: "13.4",
  texto: "Exigencias de qualificacao tecnica do edital.",
  pagina: 22,
};

function baseErm(overrides = {}) {
  return {
    meta: {
      orgao: "Prefeitura Sintetica",
      cnpjOrgao: null,
      municipioIbge: null,
      modalidade: "concorrencia",
      valorEstimado: 1000000,
      dataPublicacao: "2026-01-02",
      dataSessao: "2026-01-20",
      criterioJulgamento: "menor preco",
      regimeExecucao: "empreitada global",
      ...(overrides.meta ?? {}),
    },
    economicoFinanceira: {
      exigePL: null,
      percentualPL: null,
      indices: {},
      justificativaPresente: null,
      garantiaPropostaPct: null,
      clausula: economicClause,
      ...(overrides.economicoFinanceira ?? {}),
    },
    tecnica: {
      profissional: [],
      operacional: [],
      parcelasMaiorRelevancia: ["estrutura"],
      tetoQuantitativo: null,
      somatorio: { permitido: null },
      aceitaAcervoConsorcio: null,
      restricaoTempoLocal: null,
      marcaSemSimilar: null,
      clausula: technicalClause,
      ...(overrides.tecnica ?? {}),
    },
    juridica: {
      declaracoes: [],
      clausula: null,
      ...(overrides.juridica ?? {}),
    },
    fiscalTrabalhista: {
      CNDs: [],
      SICAF: null,
      clausula: null,
      ...(overrides.fiscalTrabalhista ?? {}),
    },
  };
}

function signalsFor(erm) {
  return buildSuspicionSignals(erm, legalConstants, feriadosNacionais);
}

test("T1.2 dispara quando garantia de proposta e 2%", () => {
  const signals = signalsFor(baseErm({ economicoFinanceira: { garantiaPropostaPct: 2 } }));

  assert.equal(signals.length, 1);
  assert.equal(signals[0].tipo, "GARANTIA_PROPOSTA_ACIMA_LIMITE");
  assert.equal(signals[0].severidade, "alta");
});

test("T1.3 dispara quando ha qtdMin operacional sem parcela de maior relevancia", () => {
  const signals = signalsFor(
    baseErm({
      tecnica: {
        operacional: [{ servico: "EDIFICACAO_ALVENARIA", qtdMin: 300, qtdObjeto: 1000, un: "m2" }],
        parcelasMaiorRelevancia: null,
      },
    }),
  );

  assert.equal(signals.length, 1);
  assert.equal(signals[0].tipo, "QUANTITATIVO_ATESTADO_SEM_PARCELA");
  assert.equal(signals[0].severidade, "alta");
});

test("T1.4 dispara com qtdMin em 60% do objeto e silencia com 40%", () => {
  const high = signalsFor(
    baseErm({
      tecnica: {
        operacional: [{ servico: "DRENAGEM", qtdMin: 600, qtdObjeto: 1000, un: "m2" }],
      },
    }),
  );
  const low = signalsFor(
    baseErm({
      tecnica: {
        operacional: [{ servico: "DRENAGEM", qtdMin: 400, qtdObjeto: 1000, un: "m2" }],
      },
    }),
  );

  assert.equal(high.length, 1);
  assert.equal(high[0].tipo, "QUANTITATIVO_ACIMA_TETO");
  assert.equal(high[0].severidade, "media");
  assert.equal(low.length, 0);
});

test("null-silence: campos ausentes nao geram sinal sintetico", () => {
  const signals = signalsFor(
    baseErm({
      meta: { dataPublicacao: null, dataSessao: null, criterioJulgamento: null, regimeExecucao: null },
      economicoFinanceira: {
        exigePL: null,
        indices: {},
        justificativaPresente: null,
        garantiaPropostaPct: null,
        clausula: null,
      },
      tecnica: {
        operacional: [{ servico: "DRENAGEM", qtdMin: null, qtdObjeto: null, un: "m2" }],
        parcelasMaiorRelevancia: null,
        restricaoTempoLocal: null,
        marcaSemSimilar: null,
        clausula: null,
      },
    }),
  );

  assert.deepEqual(signals, []);
});

test('T1.7 apenas pede "revisar manualmente"', () => {
  const signals = signalsFor(
    baseErm({
      economicoFinanceira: {
        exigePL: true,
        indices: { LC: 1 },
        justificativaPresente: false,
      },
    }),
  );

  assert.equal(signals.length, 1);
  assert.equal(signals[0].tipo, "INDICE_ECON_FIN_SEM_JUSTIFICATIVA");
  assert.equal(signals[0].severidade, "revisao");
  assert.equal(signals[0].acao, "revisar manualmente");
});

test("dataLimiteImpugnacao pula fim de semana e feriado nacional", () => {
  const deadline = dataLimiteImpugnacao("2026-01-05", legalConstants, feriadosNacionais);

  assert.equal(deadline, "2025-12-30");
});
