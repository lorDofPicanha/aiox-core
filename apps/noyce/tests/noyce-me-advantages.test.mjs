// Trunfos de ME/EPP (Tier 1) — empate ficto + exclusividade + regularização tardia.
import assert from "node:assert/strict";
import { test } from "node:test";

const { buildMeAdvantages, empateFictoPct, isMeEpp } = await import("../lib/noyce-me-advantages.ts");

const CCP_ME = { identity: { porte: "ME" } };
const CCP_GRANDE = { identity: { porte: "DEMAIS" } };
const MARKET = { priceBand: { medianBRL: 1000000, sampleSize: 5 } };

test("empateFictoPct: 5% no pregão, 10% nas demais (concorrência/obras)", () => {
  assert.equal(empateFictoPct("Pregão Eletrônico"), 5);
  assert.equal(empateFictoPct(6), 5);
  assert.equal(empateFictoPct("Concorrência"), 10);
  assert.equal(empateFictoPct(null), 10);
});

test("isMeEpp: só ME/EPP têm os trunfos", () => {
  assert.equal(isMeEpp(CCP_ME), true);
  assert.equal(isMeEpp({ identity: { porte: "EPP" } }), true);
  assert.equal(isMeEpp(CCP_GRANDE), false);
});

test("empresa não-ME → nenhum trunfo", () => {
  const adv = buildMeAdvantages({ ccp: CCP_GRANDE, estimatedValue: 50000, modalidade: "Concorrência", market: MARKET });
  assert.equal(adv.length, 0);
});

test("ME em concorrência: empate ficto 10% + janela calculada sobre a mediana", () => {
  const adv = buildMeAdvantages({ ccp: CCP_ME, estimatedValue: 1000000, modalidade: "Concorrência", market: MARKET });
  const ef = adv.find((a) => a.kind === "empate_ficto");
  assert.ok(ef, "deve haver empate ficto");
  assert.match(ef.titulo, /10%/);
  // janela = 1.000.000 × 1,10 = 1.100.000
  assert.match(ef.detalhe, /1\.100\.000/);
  assert.match(ef.acao, /PRECLUI|preclui|prazo/);
});

test("ME ≤ R$80k: flag de exclusividade de alto impacto", () => {
  const adv = buildMeAdvantages({ ccp: CCP_ME, estimatedValue: 60000, modalidade: "Pregão", market: null });
  const ex = adv.find((a) => a.kind === "exclusividade");
  assert.ok(ex, "≤80k deve disparar exclusividade");
  assert.equal(ex.impacto, "alto");
});

test("ME > R$80k: sem exclusividade, mas mantém empate ficto + regularização tardia", () => {
  const adv = buildMeAdvantages({ ccp: CCP_ME, estimatedValue: 500000, modalidade: "Concorrência", market: null });
  assert.ok(!adv.some((a) => a.kind === "exclusividade"));
  assert.ok(adv.some((a) => a.kind === "empate_ficto"));
  assert.ok(adv.some((a) => a.kind === "regularizacao_tardia"));
});

test("regularização tardia cita o prazo de 5 dias úteis e o art. 43 §1º", () => {
  const adv = buildMeAdvantages({ ccp: CCP_ME, estimatedValue: 500000, modalidade: "Concorrência", market: null });
  const r = adv.find((a) => a.kind === "regularizacao_tardia");
  assert.match(r.detalhe, /5 dias úteis/);
  assert.match(r.fonte, /43/);
});
