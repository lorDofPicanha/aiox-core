// OpenAI implementation of LlmClient (alternative provider). Via REST (fetch) — no SDK
// dependency, mirroring claude-client's "no install required for tests" property.
//
// Use in production: set OPENAI_API_KEY (and optionally OPENAI_MODEL to force one model).
// AgentDefinition.model strings are Claude-tier names (e.g. "claude-haiku-4-5"); since OpenAI
// can't use them, we MAP the tier → an OpenAI model (haiku→gpt-4o-mini, opus/sonnet→gpt-4o),
// preserving the cheap-vs-strong intent. OPENAI_MODEL overrides the mapping entirely.

import type { LlmClient, LlmRequest, LlmResponse } from "../agent-types.ts";

const API_URL = "https://api.openai.com/v1/chat/completions";
// Timeout por classe de modelo: os de RACIOCÍNIO (gpt-5.x em effort alto) levam 2-3 min;
// 60s abortava a chamada no meio → AbortError → fallback determinístico (era a causa-raiz
// dos fallbacks intermitentes de Prisma/Forja). Modelos rápidos mantêm timeout curto.
const REQUEST_TIMEOUT_MS = 60_000;
const REASONING_TIMEOUT_MS = 300_000;
const MAX_RETRIES = 2;

// Mapeia o "tier" do modelo Claude da AgentDefinition para um modelo OpenAI.
//   • triagem (Faro, "haiku" — alto volume) → barato/rápido
//   • análise (Prisma/Forja, "opus"/"sonnet" — raciocínio pesado) → gpt-5.5
// Overrides por env: OPENAI_MODEL força TUDO; OPENAI_MODEL_TRIAGE / OPENAI_MODEL_ANALYSIS
// ajustam por tier sem mexer no código.
export function resolveOpenAiModel(requestedModel: string): string {
  if (process.env.OPENAI_MODEL) return process.env.OPENAI_MODEL;
  const m = requestedModel.toLowerCase();
  if (m.includes("haiku")) return process.env.OPENAI_MODEL_TRIAGE || "gpt-5-mini";
  if (m.includes("opus") || m.includes("sonnet")) {
    return process.env.OPENAI_MODEL_ANALYSIS || "gpt-5.5";
  }
  return process.env.OPENAI_MODEL_ANALYSIS || "gpt-5.5";
}

// Família de raciocínio (gpt-5.x, o-series): API diferente — usa
// max_completion_tokens (não max_tokens), aceita reasoning_effort, e NÃO aceita
// temperature. Os tokens de raciocínio consomem o orçamento → damos folga.
function isReasoningModel(model: string): boolean {
  const m = model.toLowerCase();
  return /^o[1-9]/.test(m) || m.startsWith("gpt-5");
}

// Folga p/ os tokens de raciocínio (separados da resposta) não estourarem o teto e
// truncarem o JSON. gpt-5.x em effort alto pode gastar vários milhares só pensando.
const REASONING_HEADROOM = 12000;

function reasoningEffort(effort: LlmRequest["effort"]): string {
  if (effort === "max") return "high"; // reasoning_effort não tem "max"
  return effort ?? "medium";
}

// Monta o corpo da chamada ao Chat Completions. Exportado para teste unitário.
export function buildOpenAiRequest(req: LlmRequest): Record<string, unknown> {
  const wantsJson = Boolean(req.schema);
  // OpenAI json_object exige a palavra "json" no prompt. Como NÃO usamos json_schema
  // strict (os schemas têm campos opcionais, incompatíveis com o strict do OpenAI),
  // injetamos o schema no system para o modelo respeitar tipos e ENUMS (ex.: "vai",
  // não "Vai"). A validação real continua nos guardrails do runtime.
  const system = wantsJson
    ? `${req.system}\n\nResponda SOMENTE com um objeto JSON válido que obedeça EXATAMENTE a este JSON Schema — use os valores de enum exatamente como definidos (minúsculas), sem texto fora do JSON:\n${JSON.stringify(req.schema)}`
    : req.system;

  const model = resolveOpenAiModel(req.model);
  const budget = req.maxTokens ?? 2000;

  const body: Record<string, unknown> = {
    model,
    messages: [
      { role: "system", content: system },
      { role: "user", content: req.user },
    ],
  };

  if (isReasoningModel(model)) {
    // Folga p/ os tokens de raciocínio não engolirem a resposta.
    body.max_completion_tokens = budget + REASONING_HEADROOM;
    body.reasoning_effort = reasoningEffort(req.effort);
  } else {
    body.max_tokens = budget;
  }

  if (wantsJson) body.response_format = { type: "json_object" };
  return body;
}

interface OpenAiChoice {
  finish_reason: string;
  message: { content: string | null; refusal?: string | null };
}
interface OpenAiResponse {
  model?: string;
  choices?: OpenAiChoice[];
  usage?: { prompt_tokens?: number; completion_tokens?: number };
}

async function postWithRetry(
  body: Record<string, unknown>,
  apiKey: string,
  timeoutMs: number,
): Promise<OpenAiResponse> {
  let lastErr: unknown;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      clearTimeout(timer);
      if (res.status === 429 || res.status >= 500) {
        lastErr = new Error(`HTTP ${res.status}`);
        if (attempt < MAX_RETRIES) {
          await new Promise((r) => setTimeout(r, 500 * (attempt + 1)));
          continue;
        }
        throw lastErr;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
      return (await res.json()) as OpenAiResponse;
    } catch (err) {
      clearTimeout(timer);
      lastErr = err;
      // aborta/erro de rede: tenta de novo dentro do orçamento
      if (attempt < MAX_RETRIES) {
        await new Promise((r) => setTimeout(r, 500 * (attempt + 1)));
        continue;
      }
      throw lastErr;
    }
  }
  throw lastErr ?? new Error("openai-client: falha desconhecida");
}

export function createOpenAiClient(): LlmClient {
  return {
    id: "openai",
    async complete(req: LlmRequest): Promise<LlmResponse> {
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error("openai-client: defina OPENAI_API_KEY para usar o provider OpenAI.");
      }

      let data: OpenAiResponse;
      try {
        const model = resolveOpenAiModel(req.model);
        const timeoutMs = isReasoningModel(model) ? REASONING_TIMEOUT_MS : REQUEST_TIMEOUT_MS;
        data = await postWithRetry(buildOpenAiRequest(req), apiKey, timeoutMs);
      } catch (err) {
        const e = err as { name?: string; message?: string };
        throw new Error(`openai-client: chamada à API falhou (${e.name ?? "erro"}): ${e.message ?? String(err)}`);
      }

      const model = String(data.model ?? resolveOpenAiModel(req.model));
      const choice = data.choices?.[0];

      // Recusa (content_filter ou campo refusal das structured outputs).
      if (choice?.finish_reason === "content_filter" || choice?.message?.refusal) {
        return { text: "", json: null, model, refusal: true };
      }
      // Truncamento: não tratar JSON cortado como resposta — falha clara → o caller
      // cai no fallback determinístico com motivo legível (em vez de parse silencioso).
      if (choice?.finish_reason === "length") {
        throw new Error("resposta truncada (finish_reason=length) — aumente max_completion_tokens");
      }

      try {
        const text = String(choice?.message?.content ?? "");
        let json: unknown = null;
        if (req.schema && text) {
          try { json = JSON.parse(text); } catch { json = null; }
        }
        const usage = data.usage ?? {};
        return {
          text,
          json,
          model,
          usage: { inputTokens: usage.prompt_tokens, outputTokens: usage.completion_tokens },
        };
      } catch (err) {
        throw new Error(`openai-client: resposta da API em formato inesperado: ${(err as Error).message}`);
      }
    },
  };
}
