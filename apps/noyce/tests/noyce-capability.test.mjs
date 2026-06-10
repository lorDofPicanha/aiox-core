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
const taxonomyPath = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "lib",
  "data",
  "service-taxonomy.json",
);
const seed = JSON.parse(readFileSync(ccpPath, "utf8"));
const taxonomy = JSON.parse(readFileSync(taxonomyPath, "utf8"));

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

test("all acervo service keys exist in taxonomy with matching units", () => {
  const taxonomyByService = new Map(taxonomy.map((entry) => [entry.servicoCanonico, entry]));

  for (const acervo of seed.acervo) {
    for (const item of acervo.itens) {
      const taxonomyEntry = taxonomyByService.get(item.servicoCanonico);

      assert.ok(taxonomyEntry, `missing taxonomy entry for ${item.servicoCanonico}`);
      assert.equal(
        taxonomyEntry.unidade,
        item.unidade,
        `${item.servicoCanonico} unit mismatch between CCP and taxonomy`,
      );
    }
  }
});

test("curated CAT identifiers are present for numbered ENIAC acervos", () => {
  const byId = new Map(seed.acervo.map((item) => [item.id, item]));

  assert.equal(byId.get("reforma-ceo")?.numero, "1020250004388");
  assert.equal(byId.get("mestre-zezito")?.numero, "1020260001207");
  assert.equal(byId.get("praca")?.numero, "1020250002836");
});

test("carries grounded 2025 patrimonioLiquido extracted from the real balance (D-26.1 resolved)", () => {
  const financial2025 = seed.financials.find((snapshot) => snapshot.exercicio === 2025);

  assert.ok(financial2025, "expected 2025 financial snapshot");
  // D-26.1 resolvido: PL = Ativo 927.943,53 - Passivo exigivel 8.772,99 (BALANÇO 2025.pdf via PyMuPDF).
  assert.equal(financial2025.patrimonioLiquido, 919170.54);
  assert.equal(financial2025.ativoTotal, 927943.53);
  assert.equal(financial2025.passivoCirc, 8772.99);
  // Proveniencia obrigatoria: o valor cita o documento-fonte, nunca e um chute.
  assert.match(String(financial2025.fonte).toLowerCase(), /balan|pymupdf/);
});

test("seed does not carry CPF, admin, or credential fields", () => {
  const serialized = JSON.stringify(seed).toLowerCase();

  assert.doesNotMatch(serialized, /cpf/);
  assert.doesNotMatch(serialized, /admin/);
  assert.doesNotMatch(serialized, /credencial|credential/);
});
