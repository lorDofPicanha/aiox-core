/**
 * A2 + A3 harness — deteccao de ICMS-ST com aliquota/CST divergente (item de
 * segmento ST sinalizado por CEST mas tributado com CST/CSOSN de regime normal
 * -> aliquota_divergente) + confianca calibrada (fatores + abstencao que
 * bloqueia auto-aprovacao). Inclui o guard anti-falso-positivo do substituto na
 * origem. NAO e metrica de acuracia fiscal real (DRAFT).
 */
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { detectarSubstituicaoTributaria, detectarSubstituicaoTributariaLote } = require("../dist/index.js");

const scriptDir = dirname(fileURLToPath(import.meta.url));
const fixturePath = resolve(scriptDir, "../tests/st.synthetic.json");
const fixture = JSON.parse(readFileSync(fixturePath, "utf8"));

if (!fixture.notice.includes("Synthetic")) {
  throw new Error("ST fixture must declare synthetic status");
}

let failures = 0;

for (const testCase of fixture.cases) {
  const result = detectarSubstituicaoTributaria(testCase.item, fixture.refST, fixture.contexto);

  if (result.length !== testCase.expectedCount) {
    failures += 1;
    console.error(`FAIL ${testCase.name}: expected ${testCase.expectedCount}, got ${result.length}`);
    continue;
  }

  if (testCase.expectedFirst && result[0]) {
    const ap = result[0];
    const exp = testCase.expectedFirst;
    const ok =
      ap.tipoDivergencia === exp.tipoDivergencia &&
      ap.cclasstribReferencia === exp.cclasstribReferencia &&
      ap.tipoInferencia === "regra_deterministica" &&
      typeof ap.confianca === "number" &&
      ap.fatoresConfianca &&
      typeof ap.fatoresConfianca.score === "number" &&
      ["alta", "media", "baixa"].includes(ap.bandaConfianca) &&
      typeof ap.bloqueiaAutoAprovacao === "boolean";

    if (!ok) {
      failures += 1;
      console.error(`FAIL ${testCase.name}: first apontamento mismatch`);
      console.error(JSON.stringify(ap, null, 2));
      continue;
    }

    if (ap.confianca !== ap.fatoresConfianca.score) {
      failures += 1;
      console.error(`FAIL ${testCase.name}: confianca deve derivar de fatoresConfianca.score`);
      continue;
    }

    if (
      testCase.expectBloqueiaAutoAprovacao !== undefined &&
      ap.bloqueiaAutoAprovacao !== testCase.expectBloqueiaAutoAprovacao
    ) {
      failures += 1;
      console.error(
        `FAIL ${testCase.name}: bloqueiaAutoAprovacao esperado ${testCase.expectBloqueiaAutoAprovacao}, got ${ap.bloqueiaAutoAprovacao}`
      );
      continue;
    }

    if (
      testCase.expectBandaConfianca !== undefined &&
      ap.bandaConfianca !== testCase.expectBandaConfianca
    ) {
      failures += 1;
      console.error(
        `FAIL ${testCase.name}: bandaConfianca esperada ${testCase.expectBandaConfianca}, got ${ap.bandaConfianca}`
      );
      continue;
    }
  }

  console.log(`PASS ${testCase.name}`);
}

// --- A2 — propriedades estruturais (guard + sinal forte vs fraco) ---

// 1) CEST (sinal forte) deve render confianca >= match so por NCM (sinal fraco)
//    no mesmo segmento/contexto.
const comCest = detectarSubstituicaoTributaria(
  {
    id: "prop-cest",
    descricao: "Refrigerante com CEST",
    ncm: "22021000",
    cest: "0300100",
    cfop: "5405",
    cst: "00",
    valor: 5000
  },
  fixture.refST,
  fixture.contexto
);
const semCest = detectarSubstituicaoTributaria(
  {
    id: "prop-ncm",
    descricao: "Cerveja sem CEST",
    ncm: "22030000",
    cfop: "5405",
    cst: "00",
    valor: 5000
  },
  fixture.refST,
  fixture.contexto
);
if (
  comCest.length !== 1 ||
  semCest.length !== 1 ||
  !(comCest[0].confianca >= semCest[0].confianca)
) {
  failures += 1;
  console.error("FAIL A2 sinal: CEST (forte) deveria ter confianca >= match por NCM (fraco)");
} else {
  console.log("PASS A2 sinal: CEST (forte) confianca >= match por NCM (fraco)");
}

// 2) Lote: itens variados produzem apenas os apontamentos esperados.
const lote = detectarSubstituicaoTributariaLote(
  fixture.cases.map((c) => c.item),
  fixture.refST,
  fixture.contexto
);
const esperadosNoLote = fixture.cases.reduce((acc, c) => acc + (c.expectedCount ?? 0), 0);
if (lote.length !== esperadosNoLote) {
  failures += 1;
  console.error(`FAIL A2 lote: esperado ${esperadosNoLote} apontamentos, got ${lote.length}`);
} else {
  console.log(`PASS A2 lote: ${lote.length} apontamentos (coerente com os casos)`);
}

// 3) Guard anti-falso-positivo: substituto na origem (CFOP 5401) nao aponta
//    mesmo que o CST caia num codigo de regime normal por erro.
const substitutoErro = detectarSubstituicaoTributaria(
  {
    id: "prop-substituto",
    descricao: "Producao da fabrica com CST normal por erro",
    ncm: "22021000",
    cest: "0300100",
    cfop: "5401",
    cst: "00",
    valor: 500000
  },
  fixture.refST,
  fixture.contexto
);
if (substitutoErro.length !== 0) {
  failures += 1;
  console.error("FAIL A2 guard: substituto na origem (CFOP 5401) NAO deveria gerar apontamento");
} else {
  console.log("PASS A2 guard: substituto na origem (CFOP de ST/producao) excluido");
}

if (failures > 0) {
  console.error(`${failures} ST/confianca case(s) failed.`);
  process.exit(1);
}

console.log("PASS A2 ICMS-ST aliquota/CST divergente + A3 confianca calibrada (synthetic, not a real fiscal accuracy metric)");
