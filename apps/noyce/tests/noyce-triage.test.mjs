import assert from "node:assert/strict";
import { test } from "node:test";

const { buildTriage } = await import("../lib/noyce-operational.ts");

// Triage reference "today" inside buildTriage is 2026-05-29.
const future = (days) => new Date(Date.UTC(2026, 4, 29) + days * 86400000).toISOString();

test("obra perto com prazo aberto = Vai", () => {
  const t = buildTriage({ title: "Reforma e ampliação de escola municipal", distanceKm: 38, estimatedValue: 800000, proposalDeadline: future(10) });
  assert.equal(t.verdict, "vai");
  assert.equal(t.obrasRelevant, true);
  assert.equal(t.daysToDeadline, 10);
});

test("objeto fora de obras = Pula (perfil ENIAC é obras)", () => {
  const t = buildTriage({ title: "Aquisição de material de escritório e toner", distanceKm: 30, estimatedValue: 200000, proposalDeadline: future(15) });
  assert.equal(t.verdict, "pula");
  assert.equal(t.obrasRelevant, false);
});

test("obra fora do raio = Pula", () => {
  const t = buildTriage({ title: "Construção de ponte rodoviária", distanceKm: 900, estimatedValue: 5000000, proposalDeadline: future(20) });
  assert.equal(t.verdict, "pula");
  assert.match(t.reason, /raio/);
});

test("prazo encerrado = Pula", () => {
  const t = buildTriage({ title: "Pavimentação asfáltica de vias urbanas", distanceKm: 40, estimatedValue: 600000, proposalDeadline: future(-3) });
  assert.equal(t.verdict, "pula");
  assert.match(t.reason, /encerrado/);
});

test("obra mas longe (≤500) ou prazo curto = Olha", () => {
  const t = buildTriage({ title: "Drenagem urbana e meio-fio", distanceKm: 300, estimatedValue: 700000, proposalDeadline: future(8) });
  assert.equal(t.verdict, "olha");
});

test("score é 0..100 e não vem de opportunityScore (só dados do edital)", () => {
  const t = buildTriage({ title: "Obra de engenharia", distanceKm: 0, estimatedValue: null, proposalDeadline: null });
  assert.ok(t.score >= 0 && t.score <= 100);
  // proposalDeadline null → daysToDeadline null, ainda acionável (não inventa prazo)
  assert.equal(t.daysToDeadline, null);
});
