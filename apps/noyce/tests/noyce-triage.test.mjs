import assert from "node:assert/strict";
import { test } from "node:test";

const { buildTriage } = await import("../lib/noyce-operational.ts");
const { validateTriage } = await import("../lib/agents/guardrails.ts");

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

// Story 30.5 — raio expandido 170 → 500 km.
test("faixa 171–500 km com tudo OK = Olha com nota de viabilidade operacional (AC2)", () => {
  const t = buildTriage({ title: "Reforma de edifício público", distanceKm: 450, estimatedValue: 700000, proposalDeadline: future(10) });
  assert.equal(t.verdict, "olha");
  assert.match(t.reason, /verificar viabilidade operacional/);
  assert.match(t.reason, /450 km/);
});

test("fronteira: 500 km = dentro do raio (Olha); 501 km = fora (Pula) (AC1/AC3)", () => {
  const dentro = buildTriage({ title: "Pavimentação urbana", distanceKm: 500, estimatedValue: 700000, proposalDeadline: future(10) });
  assert.equal(dentro.verdict, "olha");
  const fora = buildTriage({ title: "Pavimentação urbana", distanceKm: 501, estimatedValue: 700000, proposalDeadline: future(10) });
  assert.equal(fora.verdict, "pula");
  assert.match(fora.reason, /acima de 500 km/);
});

test("raio configurável via maxRadiusKm: 450 km vira Pula quando raio=400 (AC4)", () => {
  const padrao = buildTriage({ title: "Construção de creche", distanceKm: 450, estimatedValue: 700000, proposalDeadline: future(10) });
  assert.equal(padrao.verdict, "olha"); // dentro do raio padrão (500)
  const reescopado = buildTriage(
    { title: "Construção de creche", distanceKm: 450, estimatedValue: 700000, proposalDeadline: future(10) },
    { maxRadiusKm: 400 },
  );
  assert.equal(reescopado.verdict, "pula");
  assert.match(reescopado.reason, /acima de 400 km/);
});

test("≤170 km segue elegível a Vai (sem regressão de comportamento near) (AC2)", () => {
  const t = buildTriage({ title: "Reforma de quadra poliesportiva", distanceKm: 170, estimatedValue: 700000, proposalDeadline: future(10) });
  assert.equal(t.verdict, "vai");
});

// eval-gate 26/Jun: "engenharia clínica" (equipamento hospitalar) NÃO é obra do perfil ENIAC,
// embora contenha a palavra "engenharia". O LLM acertava (PULA) e o baseline errava (VAI).
test("engenharia CLÍNICA não é obra-alvo = Pula (fix do gate de aceite)", () => {
  const t = buildTriage({
    title: "Contratação de empresa especializada na prestação de serviços de engenharia clínica, locação de equipamentos",
    distanceKm: 0,
    estimatedValue: 2900000,
    proposalDeadline: future(12),
  });
  assert.equal(t.obrasRelevant, false);
  assert.equal(t.verdict, "pula");
});

test("engenharia CIVIL/de obras segue obra-alvo (sem regressão)", () => {
  const t = buildTriage({ title: "Serviços de engenharia para reforma de escola", distanceKm: 30, estimatedValue: 800000, proposalDeadline: future(10) });
  assert.equal(t.obrasRelevant, true);
  assert.equal(t.verdict, "vai");
});

// eval-gate 26/Jun: o invariante de prazo do guardrail DEVE usar a mesma data de
// referência da triagem (asOf), senão back-test/eval com data histórica gera fallback
// falso (modelo julga "aberto" relativo à ref, guardrail "vencido" relativo ao relógio real).
test("validateTriage respeita asOf: prazo futuro p/ a ref NÃO viola, mesmo já vencido hoje", () => {
  const deadline = "2026-06-17T09:00:00"; // venceu relativo a hoje real, mas futuro em 29/Mai
  const out = { verdict: "vai", score: 85, reason: "obra aderente, prazo aberto", obrasRelevant: true, fonte: "edital" };
  // sem asOf (relógio real, depois de 17/jun) → exige pula → viola
  const semRef = validateTriage(out, { proposalDeadline: deadline }, "2026-06-26T00:00:00Z");
  assert.equal(semRef.ok, false);
  assert.equal(semRef.violations[0].rule, "deadline");
  // com a ref da triagem (29/Mai) → prazo futuro → não viola
  const comRef = validateTriage(out, { proposalDeadline: deadline }, "2026-05-29T00:00:00Z");
  assert.equal(comRef.ok, true);
});

test("validateTriage: prazo vencido relativo à própria ref ainda força pula", () => {
  const out = { verdict: "vai", score: 80, reason: "obra aderente", obrasRelevant: true, fonte: "edital" };
  const r = validateTriage(out, { proposalDeadline: "2026-05-20T09:00:00" }, "2026-05-29T00:00:00Z");
  assert.equal(r.ok, false);
  assert.equal(r.violations[0].rule, "deadline");
});

test("score é 0..100 e não vem de opportunityScore (só dados do edital)", () => {
  const t = buildTriage({ title: "Obra de engenharia", distanceKm: 0, estimatedValue: null, proposalDeadline: null });
  assert.ok(t.score >= 0 && t.score <= 100);
  // proposalDeadline null → daysToDeadline null, ainda acionável (não inventa prazo)
  assert.equal(t.daysToDeadline, null);
});
