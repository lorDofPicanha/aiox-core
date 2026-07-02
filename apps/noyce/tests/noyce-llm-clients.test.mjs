// Testes unitários dos clientes LLM (openai-client, claude-client, client-factory).
// Cobrem a lacuna apontada na auditoria estrutural de 02/Jul: a montagem de request é o
// ponto mais frágil (família gpt-5.x = raciocínio: max_completion_tokens, sem temperature;
// família Haiku = sem effort/thinking — A1 do doc 33). Nenhum teste chama rede.
import test from "node:test";
import assert from "node:assert/strict";

const { resolveOpenAiModel, buildOpenAiRequest } = await import(
  "../lib/agents/clients/openai-client.ts"
);
const { buildClaudeRequest } = await import("../lib/agents/clients/claude-client.ts");
const { createLlmClient } = await import("../lib/agents/clients/client-factory.ts");

const ENV_KEYS = [
  "OPENAI_MODEL",
  "OPENAI_MODEL_TRIAGE",
  "OPENAI_MODEL_ANALYSIS",
  "OPENAI_API_KEY",
  "LLM_PROVIDER",
];

/** Roda fn com o env dos clientes zerado + overrides, restaurando tudo no fim. */
function withEnv(overrides, fn) {
  const saved = {};
  for (const key of ENV_KEYS) {
    saved[key] = process.env[key];
    delete process.env[key];
  }
  Object.assign(process.env, overrides);
  try {
    return fn();
  } finally {
    for (const key of ENV_KEYS) {
      if (saved[key] === undefined) delete process.env[key];
      else process.env[key] = saved[key];
    }
  }
}

const baseReq = {
  model: "claude-haiku-4-5",
  system: "Você é o Faro.",
  user: "Triague este edital.",
  maxTokens: 1500,
};

// ---------------------------------------------------------------------------
// resolveOpenAiModel — mapeamento por tier + overrides de env
// ---------------------------------------------------------------------------

test("resolveOpenAiModel: haiku → gpt-5-mini, opus/sonnet → gpt-5.5 (defaults)", () => {
  withEnv({}, () => {
    assert.equal(resolveOpenAiModel("claude-haiku-4-5"), "gpt-5-mini");
    assert.equal(resolveOpenAiModel("claude-opus-4-8"), "gpt-5.5");
    assert.equal(resolveOpenAiModel("claude-sonnet-5"), "gpt-5.5");
    // Modelo desconhecido cai no tier de análise (conservador: mais forte).
    assert.equal(resolveOpenAiModel("qualquer-coisa"), "gpt-5.5");
  });
});

test("resolveOpenAiModel: OPENAI_MODEL força TUDO; overrides por tier respeitados", () => {
  withEnv({ OPENAI_MODEL: "gpt-4o-mini" }, () => {
    assert.equal(resolveOpenAiModel("claude-opus-4-8"), "gpt-4o-mini");
    assert.equal(resolveOpenAiModel("claude-haiku-4-5"), "gpt-4o-mini");
  });
  withEnv({ OPENAI_MODEL_TRIAGE: "gpt-5-nano", OPENAI_MODEL_ANALYSIS: "gpt-5.5-pro" }, () => {
    assert.equal(resolveOpenAiModel("claude-haiku-4-5"), "gpt-5-nano");
    assert.equal(resolveOpenAiModel("claude-opus-4-8"), "gpt-5.5-pro");
  });
});

// ---------------------------------------------------------------------------
// buildOpenAiRequest — família de raciocínio vs rápida
// ---------------------------------------------------------------------------

test("buildOpenAiRequest: gpt-5.x (raciocínio) usa max_completion_tokens + folga e reasoning_effort — nunca max_tokens/temperature", () => {
  withEnv({}, () => {
    const body = buildOpenAiRequest({ ...baseReq, model: "claude-opus-4-8", effort: "high" });
    assert.equal(body.model, "gpt-5.5");
    assert.equal(body.max_completion_tokens, 1500 + 12000);
    assert.equal(body.reasoning_effort, "high");
    assert.equal(body.max_tokens, undefined);
    assert.equal(body.temperature, undefined, "gpt-5.x não aceita temperature (400)");
  });
});

test("buildOpenAiRequest: modelo rápido (não-raciocínio) usa max_tokens simples, sem reasoning_effort", () => {
  withEnv({ OPENAI_MODEL: "gpt-4o-mini" }, () => {
    const body = buildOpenAiRequest({ ...baseReq });
    assert.equal(body.max_tokens, 1500);
    assert.equal(body.max_completion_tokens, undefined);
    assert.equal(body.reasoning_effort, undefined);
  });
});

test("buildOpenAiRequest: effort 'max' rebaixa p/ 'high' (reasoning_effort não tem max); default = medium", () => {
  withEnv({}, () => {
    const max = buildOpenAiRequest({ ...baseReq, model: "claude-opus-4-8", effort: "max" });
    assert.equal(max.reasoning_effort, "high");
    const none = buildOpenAiRequest({ ...baseReq, model: "claude-opus-4-8" });
    assert.equal(none.reasoning_effort, "medium");
  });
});

test("buildOpenAiRequest: schema → response_format json_object + schema injetado no system (enums minúsculos)", () => {
  withEnv({}, () => {
    const schema = { type: "object", properties: { verdict: { enum: ["vai", "olha", "pula"] } } };
    const body = buildOpenAiRequest({ ...baseReq, schema });
    assert.deepEqual(body.response_format, { type: "json_object" });
    const system = body.messages[0].content;
    assert.match(system, /JSON Schema/);
    assert.ok(system.includes('"vai"'), "schema (com enums) deve estar no system prompt");
    // Sem schema: system intacto, sem response_format.
    const plain = buildOpenAiRequest({ ...baseReq });
    assert.equal(plain.messages[0].content, baseReq.system);
    assert.equal(plain.response_format, undefined);
  });
});

// ---------------------------------------------------------------------------
// buildClaudeRequest — A1: effort/thinking condicionais ao modelo
// ---------------------------------------------------------------------------

test("buildClaudeRequest: família Haiku omite effort e thinking (A1), mas mantém json_schema", () => {
  const schema = { type: "object" };
  const body = buildClaudeRequest({ ...baseReq, model: "claude-haiku-4-5", schema, effort: "high" });
  assert.equal(body.thinking, undefined, "thinking quebraria o Faro em Haiku 4.5");
  assert.deepEqual(body.output_config, { format: { type: "json_schema", schema } });
  assert.equal(body.max_tokens, 1500);
});

test("buildClaudeRequest: Opus/Sonnet ganham thinking adaptive + effort", () => {
  const body = buildClaudeRequest({ ...baseReq, model: "claude-opus-4-8", effort: "high" });
  assert.deepEqual(body.thinking, { type: "adaptive" });
  assert.equal(body.output_config.effort, "high");
  // Sem schema e sem effort explícito: effort default = low, sem format.
  const sonnet = buildClaudeRequest({ ...baseReq, model: "claude-sonnet-5" });
  assert.equal(sonnet.output_config.effort, "low");
  assert.equal(sonnet.output_config.format, undefined);
});

// ---------------------------------------------------------------------------
// client-factory — seleção de provider por ambiente
// ---------------------------------------------------------------------------

test("createLlmClient: LLM_PROVIDER força; senão OPENAI_API_KEY decide; default claude", () => {
  withEnv({ LLM_PROVIDER: "claude", OPENAI_API_KEY: "sk-teste" }, () => {
    assert.equal(createLlmClient().id, "claude", "LLM_PROVIDER vence a presença da key");
  });
  withEnv({ LLM_PROVIDER: "openai" }, () => {
    assert.equal(createLlmClient().id, "openai");
  });
  withEnv({ OPENAI_API_KEY: "sk-teste" }, () => {
    assert.equal(createLlmClient().id, "openai");
  });
  withEnv({}, () => {
    assert.equal(createLlmClient().id, "claude");
  });
});
