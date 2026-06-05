import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const { withComputedCapabilities } = await import("../lib/noyce-capability.ts");

const ccpPath = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "lib",
  "data",
  "eniac-ccp.json",
);
const seed = JSON.parse(readFileSync(ccpPath, "utf8"));

test("computes EDIFICACAO_ALVENARIA capability from the two largest acervos", () => {
  const ccp = withComputedCapabilities(seed);
  const alvenaria = ccp.derived.capabilityByService.EDIFICACAO_ALVENARIA;

  assert.equal(alvenaria.maxSingle, 1622.59);
  assert.equal(alvenaria.somaTop2, 3235.71);
  assert.equal(alvenaria.unidade, "m2");
  assert.deepEqual(alvenaria.fontes, ["escola-ednalda", "mestre-zezito"]);
});

test("keeps TERRAPLENAGEM available in the derived service map", () => {
  const ccp = withComputedCapabilities(seed);
  const terraplenagem = ccp.derived.capabilityByService.TERRAPLENAGEM;

  assert.ok(terraplenagem, "expected TERRAPLENAGEM in capabilityByService");
  assert.equal(terraplenagem.maxSingle, 21829);
  assert.equal(terraplenagem.somaTop2, 24829);
});

test("does not invent 2025 patrimonioLiquido while D-26.1 is pending", () => {
  const financial2025 = seed.financials.find((snapshot) => snapshot.exercicio === 2025);

  assert.ok(financial2025, "expected 2025 financial snapshot");
  assert.equal(financial2025.patrimonioLiquido, null);
});

test("seed does not carry CPF, admin, or credential fields", () => {
  const serialized = JSON.stringify(seed).toLowerCase();

  assert.doesNotMatch(serialized, /cpf/);
  assert.doesNotMatch(serialized, /admin/);
  assert.doesNotMatch(serialized, /credencial|credential/);
});
