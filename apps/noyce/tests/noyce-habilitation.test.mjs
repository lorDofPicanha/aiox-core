import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const { withComputedCapabilities } = await import("../lib/noyce-capability.ts");
const { buildHabilitationResult } = await import("../lib/noyce-habilitation.ts");

const ccpPath = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "lib",
  "data",
  "eniac-ccp.json",
);
const seed = withComputedCapabilities(JSON.parse(readFileSync(ccpPath, "utf8")));

const technicalClause = {
  numero: "12.7",
  texto: "Qualificacao tecnica sintetica.",
  pagina: 22,
};

const economicClause = {
  numero: "12.6",
  texto: "Qualificacao economico-financeira sintetica.",
  pagina: 20,
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
      exigePL: false,
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
      parcelasMaiorRelevancia: ["obra"],
      tetoQuantitativo: 0.5,
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

test("alvenaria >= 3000 m2 com somatorio silente atende com ressalva via somaTop2", () => {
  const result = buildHabilitationResult(
    seed,
    baseErm({
      tecnica: {
        operacional: [{ servico: "EDIFICACAO_ALVENARIA", qtdMin: 3000, qtdObjeto: 6000, un: "m2" }],
        somatorio: { permitido: null },
      },
    }),
  );
  const operational = result.porBloco.tecnico_operacional.evaluations[0];

  assert.equal(operational.status, "ATENDE_COM_RESSALVA");
  assert.equal(operational.disponivel, 3235.71);
  // Conclave 12/Jun (A1): cenário conservador exposto — só acervo em NOME DA EMPRESA conta sem ressalva.
  assert.equal(operational.disponivelConservador, 0);
  assert.equal(operational.proveniencia, "inferred");
  assert.ok(operational.tarefas.includes("confirmar somatorio via esclarecimento"));
  // Justen: "emitir CAO via CREA" é juridicamente impossível (Res. CONFEA 1.025/2009) —
  // a tarefa correta é obter atestado do CONTRATANTE em nome da empresa (art. 67, II).
  assert.ok(operational.tarefas.some((t) => t.includes("atestado de capacidade operacional emitido pelo contratante")));
  assert.ok(!operational.tarefas.includes("emitir/anexar CAO operacional"));
  // Gap do delta condicional é SANÁVEL pré-sessão (dá tempo de obter o atestado)
  assert.ok(operational.gaps.some((g) => g.sanabilidade === "SANAVEL" && g.descricao.includes("nome da empresa")));
});

test("A1: CAO em nome da empresa cobre o exigido → ATENDE sem ressalva de eixo", () => {
  const seedComCao = structuredClone(seed);
  seedComCao.acervo.push({
    id: "cao-eniac-1",
    tipo: "CAO_OPERACIONAL",
    numero: "ATESTADO-PM-AL-001",
    rtId: "rt-alice",
    participacaoTecnica: "Individual",
    contratante: "Prefeitura de Aguas Lindas",
    tipoContratante: "publico",
    valor: 900000,
    periodo: "2025",
    status: "Concluida",
    itens: [
      {
        servicoCanonico: "EDIFICACAO_ALVENARIA",
        qtd: 3500,
        unidade: "m2",
        descricaoOriginal: "Atestado em nome da ENIAC",
        clausulaOrigem: null,
      },
    ],
  });
  const result = buildHabilitationResult(
    seedComCao,
    baseErm({
      tecnica: {
        operacional: [{ servico: "EDIFICACAO_ALVENARIA", qtdMin: 3000, qtdObjeto: 6000, un: "m2" }],
        somatorio: { permitido: true },
      },
    }),
  );
  const operational = result.porBloco.tecnico_operacional.evaluations[0];
  assert.equal(operational.status, "ATENDE");
  assert.ok(operational.disponivelConservador >= 3000);
  assert.ok(!operational.tarefas.some((t) => t.includes("atestado de capacidade operacional")));
});

test("alvenaria >= 3000 m2 com maxAtestados=1 vira NAO_ATENDE insanavel e NO_GO", () => {
  const result = buildHabilitationResult(
    seed,
    baseErm({
      tecnica: {
        operacional: [{ servico: "EDIFICACAO_ALVENARIA", qtdMin: 3000, qtdObjeto: 6000, un: "m2" }],
        somatorio: { permitido: true, maxAtestados: 1 },
      },
    }),
  );

  assert.equal(result.porBloco.tecnico_operacional.status, "NAO_ATENDE");
  assert.equal(result.verdict, "NO_GO");
  assert.equal(result.lacunas[0].sanabilidade, "INSANAVEL");
});

test("drenagem >= 800 m2 registra lacuna insanavel faltante de 300 m2", () => {
  const result = buildHabilitationResult(
    seed,
    baseErm({
      tecnica: {
        operacional: [{ servico: "DRENAGEM", qtdMin: 800, qtdObjeto: 1600, un: "m2" }],
        somatorio: { permitido: null },
      },
    }),
  );
  const gap = result.lacunas.find((item) => item.classe === "DRENAGEM");

  assert.equal(result.verdict, "NO_GO");
  assert.ok(gap, "expected DRENAGEM gap");
  assert.equal(gap.faltante, 300);
  assert.equal(gap.unidade, "m2");
  assert.equal(gap.sanabilidade, "INSANAVEL");
});

test("RT sem vinculo gera GO_COM_TAREFAS e nao NO_GO", () => {
  const result = buildHabilitationResult(
    seed,
    baseErm({
      tecnica: {
        profissional: [{ servico: "EDIFICACAO_ALVENARIA", qtdMin: 1620, un: "m2" }],
        somatorio: { permitido: null },
      },
    }),
  );
  const professional = result.porBloco.tecnico_profissional.evaluations[0];

  assert.equal(professional.status, "ATENDE_COM_RESSALVA");
  assert.equal(result.verdict, "GO_COM_TAREFAS");
  assert.notEqual(result.verdict, "NO_GO");
  assert.equal(professional.gaps[0].sanabilidade, "SANAVEL");
});

test("edital de R$ 2.830.000 com PL real (919k) atende econ-fin: teto solo cobre sem consorcio", () => {
  const result = buildHabilitationResult(
    seed,
    baseErm({
      meta: { valorEstimado: 2830000 },
      economicoFinanceira: {
        exigePL: true,
        percentualPL: 0.1,
      },
    }),
  );

  // PL 919.170,54 / 0,10 = teto solo 9.191.705,40 -> cobre os 2,83M (D-26.1 resolvido).
  assert.equal(result.porBloco.economico_financeira.status, "ATENDE");
  assert.equal(result.solo.patrimonioLiquido, 919170.54);
  assert.ok(result.solo.tetoSolo >= 2830000);
});

test("PL ausente (ccp sem balanco) deixa econ-fin INDETERMINADO e PENDENTE_DADO", () => {
  const rawSeed = JSON.parse(readFileSync(ccpPath, "utf8"));
  const seedSemPL = withComputedCapabilities({
    ...rawSeed,
    financials: rawSeed.financials.map((snapshot) => ({
      ...snapshot,
      patrimonioLiquido: null,
      ativoCirc: null,
      passivoCirc: null,
      ativoTotal: null,
    })),
  });
  const result = buildHabilitationResult(
    seedSemPL,
    baseErm({
      meta: { valorEstimado: 2830000 },
      economicoFinanceira: {
        exigePL: true,
        percentualPL: 0.1,
      },
    }),
  );

  assert.equal(result.porBloco.economico_financeira.status, "INDETERMINADO");
  assert.equal(result.verdict, "PENDENTE_DADO");
  assert.equal(result.solo.patrimonioLiquido, null);
});

test("consorcio ENIAC ME + parceira ME dispensa acrescimo de 30% e sinaliza vantagem", () => {
  const result = buildHabilitationResult(
    seed,
    baseErm({
      tecnica: {
        aceitaAcervoConsorcio: true,
      },
    }),
    {
      partnerLabel: "Parceira ME",
      partnerPorte: "ME",
      eniacParticipacaoPct: 50,
      partnerParticipacaoPct: 50,
    },
  );

  assert.equal(result.consorcio?.enabled, true);
  assert.equal(result.consorcio?.aceitaPeloEdital, true);
  assert.equal(result.consorcio?.acrescimo30Dispensado, true);
  assert.equal(result.consorcio?.vantagemMeEpp, true);
});
