import assert from "node:assert/strict";
import { test } from "node:test";

const { assertPublishableDiscoverySnapshot } = await import("../scripts/noyce/discovery-snapshot-contract.mjs");

function validSnapshot(overrides = {}) {
  return {
    raioKm: 500,
    municipiosNoRaio: 447,
    ufs: ["BA", "DF", "GO", "MG", "MT", "TO", "MS"],
    items: [{ id: "pncp-1" }],
    queryStats: { okQueries: 21, failQueries: 0 },
    ...overrides,
  };
}

test("contrato permite publicar snapshot completo de 500 km", () => {
  assert.doesNotThrow(() => assertPublishableDiscoverySnapshot(validSnapshot()));
});

test("contrato bloqueia publicação parcial e preserva o snapshot saudável", () => {
  assert.throws(
    () => assertPublishableDiscoverySnapshot(validSnapshot({ queryStats: { okQueries: 20, failQueries: 1 } })),
    /coleta parcial/,
  );
});

test("contrato bloqueia o cluster legado de 170 km", () => {
  assert.throws(
    () => assertPublishableDiscoverySnapshot(validSnapshot({ raioKm: 170, municipiosNoRaio: 9, ufs: ["DF", "GO"] })),
    /raioKm deve ser 500/,
  );
});
