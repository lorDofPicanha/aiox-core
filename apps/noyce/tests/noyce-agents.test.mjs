import test from "node:test";
import assert from "node:assert/strict";

const { validateTriage, enforceHumanActs } = await import("../lib/agents/guardrails.ts");
const { assembleContext, buildSystemPrompt } = await import("../lib/agents/agent-context.ts");
const { runTriage, FARO_DEFINITION } = await import("../lib/agents/triage-agent.ts");

// ── fake LLM clients (no API key needed) ──
function fakeClient(json, opts = {}) {
  return {
    id: "fake",
    async complete() {
      if (opts.throws) throw new Error("boom");
      if (opts.refusal) return { text: "", json: null, model: "fake", refusal: true };
      return { text: JSON.stringify(json), json, model: "fake" };
    },
  };
}

const FUTURE = "2099-01-01T10:00:00Z";
const PAST = "2020-01-01T10:00:00Z";

const VALID_LLM_OUTPUT = {
  verdict: "vai",
  score: 78,
  reason: "Reforma de escola a 30 km, valor na faixa, prazo ok (objeto = nicho ENIAC).",
  daysToDeadline: 20,
  obrasRelevant: true,
  fonte: "objeto do edital + perfil ENIAC",
  pontosAtencao: [],
  permiteConsorcio: false,
};

const itemFuture = { id: "e1", title: "Reforma de escola municipal", city: "Anápolis", uf: "GO", distanceKm: 30, estimatedValue: 1_200_000, proposalDeadline: FUTURE };
const itemPast = { ...itemFuture, id: "e2", proposalDeadline: PAST };

// ── guardrails ──
test("validateTriage: saída válida passa", () => {
  assert.equal(validateTriage(VALID_LLM_OUTPUT, itemFuture).ok, true);
});

test("validateTriage: razão ausente → viola proveniência", () => {
  const r = validateTriage({ ...VALID_LLM_OUTPUT, reason: "" }, itemFuture);
  assert.equal(r.ok, false);
  assert.ok(r.violations.some((v) => v.rule === "provenance"));
});

test("validateTriage: prazo vencido + verdict 'vai' → viola deadline", () => {
  const r = validateTriage(VALID_LLM_OUTPUT, itemPast);
  assert.equal(r.ok, false);
  assert.ok(r.violations.some((v) => v.rule === "deadline"));
});

test("enforceHumanActs: bloqueia ato vinculante executado", () => {
  assert.equal(enforceHumanActs("Protocolei o recurso no portal").ok, false);
  assert.equal(enforceHumanActs("Preparei a minuta para revisão humana").ok, true);
});

// ── context ──
test("assembleContext: traz perfil ENIAC + base de conhecimento", () => {
  const ctx = assembleContext("triagem reforma escola");
  assert.match(ctx, /ENIAC/);
  assert.match(ctx, /teto solo/);
  assert.ok(ctx.length > 200);
});

test("buildSystemPrompt: anexa as invariantes da squad", () => {
  const sp = buildSystemPrompt("Você é o Faro.");
  assert.match(sp, /Faro/);
  assert.match(sp, /ATO VINCULANTE = HUMANO/);
});

// ── Faro (triage-agent) ──
test("runTriage: happy path usa a saída da LLM (source=llm)", async () => {
  const res = await runTriage(itemFuture, fakeClient(VALID_LLM_OUTPUT));
  assert.equal(res.source, "llm");
  assert.equal(res.verdict, "vai");
  assert.equal(res.fonte.length > 0, true);
});

test("runTriage: recusa do modelo → fallback determinístico", async () => {
  const res = await runTriage(itemFuture, fakeClient(null, { refusal: true }));
  assert.equal(res.source, "guardrail_fallback");
  assert.ok(["vai", "olha", "pula"].includes(res.verdict));
});

test("runTriage: cliente lança erro → fallback determinístico", async () => {
  const res = await runTriage(itemFuture, fakeClient(null, { throws: true }));
  assert.equal(res.source, "guardrail_fallback");
});

test("runTriage: violação de guardrail (sem razão) → fallback", async () => {
  const res = await runTriage(itemFuture, fakeClient({ ...VALID_LLM_OUTPUT, reason: "" }));
  assert.equal(res.source, "guardrail_fallback");
});

test("runTriage: prazo vencido força fallback se LLM disser 'vai'", async () => {
  // LLM erra dizendo 'vai' num edital fechado → guardrail de deadline reprova → fallback.
  const res = await runTriage(itemPast, fakeClient(VALID_LLM_OUTPUT));
  assert.equal(res.source, "guardrail_fallback");
});

test("FARO_DEFINITION usa modelo barato (volume)", () => {
  assert.equal(FARO_DEFINITION.model, "claude-haiku-4-5");
});
