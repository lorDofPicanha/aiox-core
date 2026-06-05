import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const { withComputedCapabilities } = await import("../lib/noyce-capability.ts");
const { getCuratedErmById, curatedErmRegistry } = await import("../lib/noyce-erm.ts");
const { buildHabilitationResult } = await import("../lib/noyce-habilitation.ts");
const { buildSuspicionSignals } = await import("../lib/noyce-suspicion.ts");

const rootDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = path.join(rootDir, "lib", "data");
const legalConstants = readJson(path.join(dataDir, "legal-constants.json"));
const feriadosNacionais = readJson(path.join(dataDir, "feriados-nacionais.json"));
const groundTruth = readJson(path.join(dataDir, "tier1-ground-truth.json"));
const eniacSeed = withComputedCapabilities(readJson(path.join(dataDir, "eniac-ccp.json")));

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, "utf8"));
}

function groundTruthEntries() {
  return Object.entries(groundTruth).filter(([editalId]) => !editalId.startsWith("_"));
}

function signalTypes(erm) {
  return Array.from(new Set(buildSuspicionSignals(erm, legalConstants, feriadosNacionais).map((signal) => signal.tipo))).sort();
}

function valueAtPath(target, dottedPath) {
  return dottedPath.split(".").reduce((current, key) => (current == null ? undefined : current[key]), target);
}

test("gate Tier 1 compara ERMs curados contra ground truth zero falso-positivo", () => {
  const registryIds = curatedErmRegistry.map((entry) => entry.editalId).sort();
  const groundTruthIds = groundTruthEntries()
    .map(([editalId]) => editalId)
    .sort();

  assert.deepEqual(registryIds, groundTruthIds);

  for (const [editalId, expected] of groundTruthEntries()) {
    const erm = getCuratedErmById(editalId);
    assert.ok(erm, `ERM curado nao encontrado: ${editalId}`);

    assert.deepEqual(signalTypes(erm), [...expected.flagsEsperados].sort(), editalId);

    for (const campo of expected.camposNull) {
      assert.equal(valueAtPath(erm, campo), null, `${editalId} deveria manter ${campo} null`);
    }
  }
});

test("Novo Gama 7/8 preserva somatorio maxAtestados=2 e aceita acervo de consorcio", () => {
  for (const editalId of ["novo-gama-edital-7", "novo-gama-edital-8"]) {
    const erm = getCuratedErmById(editalId);
    assert.ok(erm, `ERM curado nao encontrado: ${editalId}`);
    assert.equal(erm.tecnica.somatorio.permitido, true);
    assert.equal(erm.tecnica.somatorio.maxAtestados, 2);
    assert.equal(erm.tecnica.aceitaAcervoConsorcio, true);
  }
});

test("matcher de habilitacao respeita teto de 2 atestados do ERM Novo Gama", () => {
  const erm = getCuratedErmById("novo-gama-edital-7");
  assert.ok(erm);

  const ccpComTerceiroAtestado = withComputedCapabilities({
    ...eniacSeed,
    acervo: [
      ...eniacSeed.acervo,
      {
        id: "teste-terceiro-atestado-alvenaria",
        tipo: "CAT_PROFISSIONAL",
        numero: null,
        rtId: "alice",
        participacaoTecnica: "Individual",
        contratante: "Fixture de teste",
        tipoContratante: "publico",
        valor: null,
        periodo: null,
        status: null,
        itens: [
          {
            servicoCanonico: "EDIFICACAO_ALVENARIA",
            qtd: 1000,
            unidade: "m2",
            descricaoOriginal: "Fixture de teste para provar teto maxAtestados=2",
            clausulaOrigem: null,
          },
        ],
      },
    ],
  });

  const result = buildHabilitationResult(ccpComTerceiroAtestado, {
    ...erm,
    tecnica: {
      ...erm.tecnica,
      operacional: [{ servico: "EDIFICACAO_ALVENARIA", qtdMin: 4000, qtdObjeto: null, un: "m2" }],
    },
  });
  const operational = result.porBloco.tecnico_operacional.evaluations[0];

  assert.equal(operational.status, "NAO_ATENDE");
  assert.equal(operational.disponivel, 3235.71);
  assert.equal(result.verdict, "NO_GO");
  assert.ok(operational.evidencia.some((line) => line.includes("limite de 2 atestado(s)")));
});
