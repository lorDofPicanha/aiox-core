// Gate de aceite — lógica PURA de critérios (lib/eval/gate-criteria.ts). Sem API/I/O:
// valida limiares, classificação de divergência dura×suave e o veredito consolidado.
import assert from "node:assert/strict";
import { test } from "node:test";

const {
  evaluateGate,
  evaluateTriage,
  evaluateTriageGolden,
  evaluateAnalysis,
  evaluateWorkflow,
  isHardDivergence,
  GATE_CRITERIA,
} = await import("../lib/eval/gate-criteria.ts");

// ── isHardDivergence: oposto = duro; adjacente = suave ───────────────────────
test("divergência dura só quando vereditos são opostos (vai↔pula)", () => {
  assert.equal(isHardDivergence("vai", "pula"), true);
  assert.equal(isHardDivergence("pula", "vai"), true);
  assert.equal(isHardDivergence("vai", "olha"), false);
  assert.equal(isHardDivergence("olha", "pula"), false);
  assert.equal(isHardDivergence("vai", "vai"), false);
});

// ── triagem ──────────────────────────────────────────────────────────────────
test("triagem PASS: alta concordância, zero fallback/erro/dura", () => {
  const r = evaluateTriage({ total: 12, agree: 11, llmCount: 12, errors: 0, hardDivergences: 0 });
  assert.equal(r.pass, true);
  assert.ok(r.checks.every((c) => c.pass));
});

test("triagem FAIL: concordância abaixo do limiar", () => {
  const r = evaluateTriage({ total: 12, agree: 8, llmCount: 12, errors: 0, hardDivergences: 0 });
  assert.equal(r.pass, false); // 66% < 80%
  assert.equal(r.checks.find((c) => c.name.includes("concordância")).pass, false);
});

test("triagem FAIL: fallback acima do limiar", () => {
  const r = evaluateTriage({ total: 10, agree: 10, llmCount: 8, errors: 0, hardDivergences: 0 });
  assert.equal(r.pass, false); // 20% fallback > 10%
});

test("triagem FAIL: qualquer erro de execução reprova", () => {
  const r = evaluateTriage({ total: 12, agree: 12, llmCount: 11, errors: 1, hardDivergences: 0 });
  assert.equal(r.pass, false);
});

test("triagem: divergência dura > limite reprova; 1 dura ainda passa", () => {
  assert.equal(evaluateTriage({ total: 12, agree: 11, llmCount: 12, errors: 0, hardDivergences: 1 }).pass, true);
  assert.equal(evaluateTriage({ total: 12, agree: 10, llmCount: 12, errors: 0, hardDivergences: 2 }).pass, false);
});

// ── triagem vs golden (juiz humano) ──────────────────────────────────────────
test("golden PASS: acurácia alta, 0 duro, rótulos confirmados suficientes", () => {
  const r = evaluateTriageGolden({ total: 20, correct: 18, hardWrong: 0, fallback: 0, reviewedAvailable: 20 });
  assert.equal(r.pass, true);
});

test("golden FAIL: poucos rótulos confirmados não certifica", () => {
  const r = evaluateTriageGolden({ total: 10, correct: 10, hardWrong: 0, fallback: 0, reviewedAvailable: 10 });
  assert.equal(r.pass, false); // 10 < minReviewed (15)
  assert.equal(r.checks.find((c) => c.name.includes("confirmados")).pass, false);
});

test("golden FAIL: acurácia abaixo do limiar humano", () => {
  const r = evaluateTriageGolden({ total: 20, correct: 15, hardWrong: 0, fallback: 0, reviewedAvailable: 20 });
  assert.equal(r.pass, false); // 75% < 85%
});

test("golden FAIL: erro duro vs humano (LLM oposto) reprova", () => {
  const r = evaluateTriageGolden({ total: 20, correct: 18, hardWrong: 2, fallback: 0, reviewedAvailable: 20 });
  assert.equal(r.pass, false);
});

test("gate usa golden no lugar do baseline quando presente", () => {
  const r = evaluateGate({
    triage: { total: 12, agree: 4, llmCount: 12, errors: 0, hardDivergences: 0 }, // baseline reprovaria
    goldenTriage: { total: 20, correct: 19, hardWrong: 0, fallback: 0, reviewedAvailable: 20 }, // golden passa
    analysis: { n: 2, prismaPass: 2, forjaPass: 2, prismaLlm: 2, forjaLlm: 2, inventedNumbers: 0 },
    workflow: { stagesLlm: { faro: true, prisma: true, forja: true, escriba: true }, packageComplete: true },
  });
  assert.equal(r.pass, true); // golden tem prioridade; baseline ignorado
  assert.ok(r.dimensions.some((d) => d.dimension.includes("golden")));
  assert.ok(!r.dimensions.some((d) => d.dimension === "triagem (Faro)"));
});

// ── análise ──────────────────────────────────────────────────────────────────
test("análise PASS: guardrail 100%, zero inventado, tudo do LLM", () => {
  const r = evaluateAnalysis({ n: 2, prismaPass: 2, forjaPass: 2, prismaLlm: 2, forjaLlm: 2, inventedNumbers: 0 });
  assert.equal(r.pass, true);
});

test("análise FAIL: número inventado reprova (anti-alucinação é dura)", () => {
  const r = evaluateAnalysis({ n: 2, prismaPass: 2, forjaPass: 2, prismaLlm: 2, forjaLlm: 2, inventedNumbers: 1 });
  assert.equal(r.pass, false);
  assert.equal(r.checks.find((c) => c.name.includes("inventados")).pass, false);
});

test("análise FAIL: guardrail abaixo de 100%", () => {
  const r = evaluateAnalysis({ n: 2, prismaPass: 1, forjaPass: 2, prismaLlm: 2, forjaLlm: 2, inventedNumbers: 0 });
  assert.equal(r.pass, false); // 3/4 = 75% < 100%
});

// ── workflow ─────────────────────────────────────────────────────────────────
test("workflow PASS: 4/4 etapas no LLM + pacote completo", () => {
  const r = evaluateWorkflow({
    stagesLlm: { faro: true, prisma: true, forja: true, escriba: true },
    packageComplete: true,
  });
  assert.equal(r.pass, true);
});

test("workflow FAIL: etapa em fallback OU pacote incompleto", () => {
  assert.equal(
    evaluateWorkflow({ stagesLlm: { faro: true, prisma: false, forja: true, escriba: true }, packageComplete: true }).pass,
    false,
  );
  assert.equal(
    evaluateWorkflow({ stagesLlm: { faro: true, prisma: true, forja: true, escriba: true }, packageComplete: false }).pass,
    false,
  );
});

// ── gate consolidado ─────────────────────────────────────────────────────────
test("gate PASS exige TODAS as dimensões presentes e passando", () => {
  const r = evaluateGate({
    triage: { total: 12, agree: 11, llmCount: 12, errors: 0, hardDivergences: 0 },
    analysis: { n: 2, prismaPass: 2, forjaPass: 2, prismaLlm: 2, forjaLlm: 2, inventedNumbers: 0 },
    workflow: { stagesLlm: { faro: true, prisma: true, forja: true, escriba: true }, packageComplete: true },
  });
  assert.equal(r.pass, true);
  assert.equal(r.partial, false);
  assert.equal(r.skipped.length, 0);
});

test("gate PARCIAL: dimensão pulada nunca conta como PASS total", () => {
  const r = evaluateGate({
    triage: { total: 12, agree: 11, llmCount: 12, errors: 0, hardDivergences: 0 },
  });
  assert.equal(r.pass, false); // não pode certificar com 2 dimensões faltando
  assert.equal(r.partial, true);
  assert.deepEqual(r.skipped.sort(), ["análise (Prisma/Forja)", "workflow E2E"].sort());
});

test("gate FAIL: uma dimensão presente reprovada derruba o todo", () => {
  const r = evaluateGate({
    triage: { total: 12, agree: 4, llmCount: 12, errors: 0, hardDivergences: 0 }, // 33%
    analysis: { n: 2, prismaPass: 2, forjaPass: 2, prismaLlm: 2, forjaLlm: 2, inventedNumbers: 0 },
    workflow: { stagesLlm: { faro: true, prisma: true, forja: true, escriba: true }, packageComplete: true },
  });
  assert.equal(r.pass, false);
});

// ── sanidade dos limiares documentados ───────────────────────────────────────
test("critérios batem com o doc (80% / 0 inventado / 4-4 LLM)", () => {
  assert.equal(GATE_CRITERIA.triage.minAgreementPct, 80);
  assert.equal(GATE_CRITERIA.analysis.maxInventedNumbers, 0);
  assert.equal(GATE_CRITERIA.workflow.requireAllStagesLlm, true);
});
