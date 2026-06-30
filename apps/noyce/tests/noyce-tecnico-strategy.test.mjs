// Estratégia técnica (Tier 2): somatório CAT + recomendação consórcio/subcontratação.
import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const { buildTecnicoStrategy } = await import("../lib/noyce-tecnico-strategy.ts");
const __dirname = dirname(fileURLToPath(import.meta.url));
const ccp = JSON.parse(readFileSync(join(__dirname, "../lib/data/eniac-ccp.json"), "utf8"));
// ENIAC tem EDIFICACAO_ALVENARIA 1613,12 + 1622,59 = 3.235,71 m² (somatório real).

function erm(operacional) {
  return { meta: {}, economicoFinanceira: { indices: {} }, tecnica: { operacional, profissional: [], quadroTecnico: [] }, juridica: { declaracoes: [] }, fiscalTrabalhista: { CNDs: [] } };
}

test("somatório cobre → habilita SOZINHA (alvenaria 1500 < 3235 disponível)", () => {
  const s = buildTecnicoStrategy({ erm: erm([{ servico: "EDIFICACAO_ALVENARIA", qtdMin: 1500, un: "m2" }]), ccp });
  assert.equal(s.habilitaSozinha, true);
  assert.equal(s.modo, "solo");
  assert.equal(s.gaps.length, 0);
});

test("somatório NÃO cobre → lacuna + recomenda consórcio/subcontratação com fontes", () => {
  const s = buildTecnicoStrategy({ erm: erm([{ servico: "EDIFICACAO_ALVENARIA", qtdMin: 5000, un: "m2" }]), ccp });
  assert.equal(s.habilitaSozinha, false);
  assert.equal(s.modo, "consorcio");
  assert.equal(s.gaps.length, 1);
  assert.ok(s.gaps[0].faltam > 1700 && s.gaps[0].faltam < 1800, `faltam ~1764, veio ${s.gaps[0].faltam}`);
  assert.match(s.recomendacao, /CONSÓRCIO/);
  assert.match(s.recomendacao, /25%|§9º/);
  assert.match(s.consorcioNota, /100% ME\/EPP.*ISENTO|isento/i);
});

test("serviço que a ENIAC não tem → lacuna total", () => {
  const s = buildTecnicoStrategy({ erm: erm([{ servico: "DRAGAGEM_PORTUARIA", qtdMin: 1000, un: "m3" }]), ccp });
  assert.equal(s.habilitaSozinha, false);
  assert.equal(s.gaps[0].disponivel, 0);
  assert.equal(s.gaps[0].faltam, 1000);
});

test("sem quantitativo (remetido ao TR) → indeterminado, não chuta", () => {
  const s = buildTecnicoStrategy({ erm: erm([{ servico: "Atestado técnico-operacional", qtdMin: null, un: null }]), ccp });
  assert.equal(s.habilitaSozinha, null);
  assert.equal(s.modo, "indeterminado");
  assert.match(s.recomendacao, /Termo de Referência/i);
});

test("sem exigência operacional → indeterminado (conferir TR)", () => {
  const s = buildTecnicoStrategy({ erm: erm([]), ccp });
  assert.equal(s.habilitaSozinha, null);
  assert.equal(s.modo, "indeterminado");
});

test("ERM nulo não quebra", () => {
  const s = buildTecnicoStrategy({ erm: null, ccp });
  assert.equal(s.modo, "indeterminado");
});
