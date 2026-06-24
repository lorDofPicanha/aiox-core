/**
 * A1 + A3 harness — deteccao de monofasico (NCM monofasico tributado como
 * normal -> credito_potencial) e confianca calibrada (fatores + abstencao que
 * bloqueia auto-aprovacao). NAO e metrica de acuracia fiscal real (DRAFT).
 */
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { detectarMonofasico, calcularConfiancaCalibrada } = require("../dist/index.js");

const scriptDir = dirname(fileURLToPath(import.meta.url));
const fixturePath = resolve(scriptDir, "../tests/monofasico.synthetic.json");
const fixture = JSON.parse(readFileSync(fixturePath, "utf8"));

if (!fixture.notice.includes("Synthetic")) {
  throw new Error("monofasico fixture must declare synthetic status");
}

let failures = 0;

for (const testCase of fixture.cases) {
  const result = detectarMonofasico(testCase.item, fixture.refMonofasico, fixture.contexto);

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

// --- A3 — propriedades da confianca calibrada (fatores explicitos) ---

// 1) Match exato deve ter base maior que prefixo (especificidade importa).
const exato = calcularConfiancaCalibrada({
  especificidade: "ncm_exato",
  cstCoerenteComRegra: undefined,
  statusRegra: "validada",
  valor: 1000,
  materialidadeReferencia: 1000
});
const prefixo = calcularConfiancaCalibrada({
  especificidade: "ncm_prefixo",
  cstCoerenteComRegra: undefined,
  statusRegra: "validada",
  valor: 1000,
  materialidadeReferencia: 1000
});
if (!(exato.contribuicoes.base > prefixo.contribuicoes.base)) {
  failures += 1;
  console.error("FAIL A3: match exato deveria ter base > prefixo");
} else {
  console.log("PASS A3 especificidade: ncm_exato base > ncm_prefixo base");
}

// 2) Regra DRAFT/disputada penaliza a confianca (sustenta o "onde NAO sei").
const validada = calcularConfiancaCalibrada({
  especificidade: "ncm_prefixo",
  cstCoerenteComRegra: undefined,
  statusRegra: "validada",
  valor: 1000,
  materialidadeReferencia: 1000
});
const disputada = calcularConfiancaCalibrada({
  especificidade: "ncm_prefixo",
  cstCoerenteComRegra: undefined,
  statusRegra: "disputado",
  valor: 1000,
  materialidadeReferencia: 1000
});
if (!(disputada.score < validada.score) || disputada.contribuicoes.statusRegra >= 0) {
  failures += 1;
  console.error("FAIL A3: regra disputada deveria penalizar o score");
} else {
  console.log("PASS A3 status: regra disputada penaliza (statusRegra negativo, score menor)");
}

// 3) Fatores devem ser explicitos (explicabilidade — nao so um numero).
const explic = calcularConfiancaCalibrada({
  especificidade: "ncm_exato",
  cstCoerenteComRegra: false,
  statusRegra: "draft",
  valor: 2000,
  materialidadeReferencia: 1000
});
const temFatores =
  explic.contribuicoes &&
  typeof explic.contribuicoes.base === "number" &&
  typeof explic.contribuicoes.cstCoerente === "number" &&
  typeof explic.contribuicoes.statusRegra === "number" &&
  typeof explic.contribuicoes.materialidade === "number" &&
  explic.especificidadeMatch === "ncm_exato";
if (!temFatores) {
  failures += 1;
  console.error("FAIL A3: confianca deve expor fatores explicitos");
} else {
  console.log("PASS A3 explicabilidade: fatores expostos (base/cst/status/materialidade)");
}

if (failures > 0) {
  console.error(`${failures} monofasico/confianca case(s) failed.`);
  process.exit(1);
}

console.log("PASS A1 monofasico + A3 confianca calibrada (synthetic, not a real fiscal accuracy metric)");
