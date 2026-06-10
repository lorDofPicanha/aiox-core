import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const { withComputedCapabilities } = await import("../lib/noyce-capability.ts");
const { getCuratedErmById } = await import("../lib/noyce-erm.ts");
const { buildHabilitationResult } = await import("../lib/noyce-habilitation.ts");
const { buildSuspicionSignals } = await import("../lib/noyce-suspicion.ts");

const rootDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = path.join(rootDir, "lib", "data");
const ccp = withComputedCapabilities(readJson(path.join(dataDir, "eniac-ccp.json")));
const legalConstants = readJson(path.join(dataDir, "legal-constants.json"));
const feriadosNacionais = readJson(path.join(dataDir, "feriados-nacionais.json"));

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, "utf8"));
}

test("offline pilot uses a real curated Novo Gama edital and does not force GO", () => {
  const erm = getCuratedErmById("novo-gama-edital-7");
  assert.ok(erm, "expected curated Novo Gama edital 7 ERM");
  assert.equal(erm.meta.valorEstimado, 2908504.07);
  assert.equal(erm.tecnica.operacional.length, 4);

  const result = buildHabilitationResult(ccp, erm);

  assert.equal(result.verdict, "NO_GO");
  assert.equal(result.porBloco.tecnico_operacional.status, "NAO_ATENDE");
  // Econ-fin agora RESOLVE: LC/LG/SG = 105,77 (>= 1,0 exigido) com os totais reais do balanco.
  assert.equal(result.porBloco.economico_financeira.status, "ATENDE");
  assert.ok(!result.tarefas.includes("obter totais contabeis para calcular LC"));
  // O NO_GO vem do gap tecnico-operacional, nao mais de dado financeiro ausente.
  assert.ok(result.disclaimer.includes("revisao humana"));
});

test("offline pilot detector stays silent when requirements are grounded and within Tier 1 limits", () => {
  const erm = getCuratedErmById("novo-gama-edital-7");
  assert.ok(erm);

  const signals = buildSuspicionSignals(erm, legalConstants, feriadosNacionais);

  assert.deepEqual(signals, []);
});
