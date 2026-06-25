import test from "node:test";
import assert from "node:assert/strict";

const { validateTriage, enforceHumanActs } = await import("../lib/agents/guardrails.ts");
const { assembleContext, buildSystemPrompt } = await import("../lib/agents/agent-context.ts");
const { runTriage, FARO_DEFINITION, computeDaysToDeadline } = await import("../lib/agents/triage-agent.ts");
const { buildClaudeRequest } = await import("../lib/agents/clients/claude-client.ts");

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

// ── C3 — enforceHumanActs robusto a SINÔNIMOS (atos que HOJE passavam) ──
test("C3: atos vinculantes executados por sinônimo são BLOQUEADOS (≥8 frases)", () => {
  const bloqueados = [
    "Protocolizei a proposta no sistema.",
    "Dei entrada no recurso administrativo.",
    "Apresentei as contrarrazões ao pregoeiro.",
    "Protocolei a impugnação ao edital.",
    "Peticionei o recurso dentro do prazo.",
    "Interpus recurso contra a decisão.",
    "Interpus o recurso e juntei os documentos.",
    "Submeti a proposta pela plataforma.",
    "Enviei o recurso ao órgão.",
    "Transmiti a proposta eletronicamente.",
    "Assinei e enviei a proposta final.",
    "Dei o lance final na sessão.",
    "Respondi a diligência aberta pelo pregoeiro.",
  ];
  for (const frase of bloqueados) {
    assert.equal(enforceHumanActs(frase).ok, false, `deveria BLOQUEAR: "${frase}"`);
  }
});

test("C3: descrever/preparar para revisão humana CONTINUA passando (não é ato consumado)", () => {
  const legitimos = [
    "Preparei a minuta de recurso para revisão do advogado.",
    "Minuta de contrarrazões pronta para o advogado revisar.",
    "Recomendo apresentar as contrarrazões no prazo (rascunho anexo).",
    "Sugiro protocolar a impugnação após aprovação humana.",
  ];
  for (const frase of legitimos) {
    assert.equal(enforceHumanActs(frase).ok, true, `deveria PASSAR: "${frase}"`);
  }
});

// ── A1 — effort/thinking condicionais ao modelo ──
test("A1: request p/ claude-haiku-4-5 OMITE effort e thinking; mantém output_config.format", () => {
  const body = buildClaudeRequest({
    model: "claude-haiku-4-5",
    system: "s",
    user: "u",
    schema: { type: "object" },
    effort: "low",
  });
  assert.equal(body.thinking, undefined, "haiku não envia thinking");
  assert.ok(body.output_config, "output_config presente p/ o schema");
  assert.equal(body.output_config.effort, undefined, "haiku não envia effort");
  assert.deepEqual(body.output_config.format, { type: "json_schema", schema: { type: "object" } });
});

test("A1: request p/ claude-opus-4-8 MANTÉM effort e thinking", () => {
  const body = buildClaudeRequest({
    model: "claude-opus-4-8",
    system: "s",
    user: "u",
    schema: { type: "object" },
    effort: "medium",
  });
  assert.deepEqual(body.thinking, { type: "adaptive" });
  assert.equal(body.output_config.effort, "medium");
  assert.ok(body.output_config.format);
});

test("A1: sem schema → sem format, mas effort segue a regra do modelo", () => {
  const haiku = buildClaudeRequest({ model: "claude-haiku-4-5", system: "s", user: "u" });
  assert.equal(haiku.output_config, undefined, "haiku sem schema e sem effort → sem output_config");
  const opus = buildClaudeRequest({ model: "claude-opus-4-8", system: "s", user: "u" });
  assert.equal(opus.output_config.effort, "low"); // default
  assert.equal(opus.output_config.format, undefined);
});

// ── M5 — daysToDeadline determinístico, NÃO do JSON da LLM ──
test("M5: computeDaysToDeadline calcula do prazo real, não confia na LLM", () => {
  // 10 dias à frente do asOf.
  const asOf = "2026-06-20T12:00:00Z";
  const due = "2026-06-30T12:00:00Z";
  assert.equal(computeDaysToDeadline(due, asOf), 10);
  assert.equal(computeDaysToDeadline(null, asOf), null); // sem prazo → null, não inventa
});

test("M5: runTriage ignora daysToDeadline da LLM e usa o cálculo determinístico", async () => {
  const asOf = "2026-06-20T12:00:00Z";
  // LLM mente: diz 999 dias; prazo real é 30/06 (10 dias).
  const itemDeadline = { ...itemFuture, proposalDeadline: "2026-06-30T12:00:00Z" };
  const lyingLlm = fakeClient({ ...VALID_LLM_OUTPUT, daysToDeadline: 999 });
  const res = await runTriage(itemDeadline, lyingLlm, asOf);
  assert.equal(res.source, "llm");
  assert.equal(res.daysToDeadline, 10, "veio do cálculo, não do 999 da LLM");
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
