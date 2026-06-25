// Claude implementation of LlmClient (default provider). The @anthropic-ai/sdk import is LAZY
// so this module loads even before the SDK is installed and tests (which inject a fake client)
// don't need it. Structured output via output_config.format = json_schema, per the Claude API.
//
// Install to use in production:  npm i @anthropic-ai/sdk   (and set ANTHROPIC_API_KEY)
// Default model is claude-opus-4-8; agents override per AgentDefinition (e.g. Faro → haiku).

import type { LlmClient, LlmRequest, LlmResponse } from "../agent-types.ts";

// A1 — `output_config.effort` e `thinking` NÃO são universais na API Claude:
//   • effort: suportado em Opus 4.5+/Sonnet 4.6; ERRA (400) em Sonnet 4.5 e
//     Haiku 4.5. Faro roda em claude-haiku-4-5 → enviar effort quebraria TODA a
//     triagem real.
//   • thinking adaptive: não documentado p/ a família Haiku 4.5.
// Por isso ambos são CONDICIONAIS ao modelo: família Haiku → omitir os dois;
// Opus/Sonnet → manter. structured output (output_config.format) é sempre seguro.
function supportsEffortAndThinking(model: string): boolean {
  const m = model.toLowerCase();
  // Família Haiku: sem effort/thinking. (Conservador: na dúvida, só liga p/ Opus/Sonnet.)
  if (m.includes("haiku")) return false;
  return m.includes("opus") || m.includes("sonnet");
}

// M3 — número de retries delegado ao SDK (backoff p/ 429/5xx) + timeout explícito.
const SDK_MAX_RETRIES = 2;
const REQUEST_TIMEOUT_MS = 60_000;

// Monta o corpo da request à messages.create, aplicando A1 (effort/thinking
// condicionais ao modelo). Exportado para teste unitário sem chamar a API real.
export function buildClaudeRequest(req: LlmRequest): Record<string, unknown> {
  const allowExtras = supportsEffortAndThinking(req.model);
  const effort = req.effort ?? "low";

  // output_config: format (json_schema) sempre que houver schema; effort só p/
  // modelos que o suportam.
  const outputConfig: Record<string, unknown> = {};
  if (req.schema) outputConfig.format = { type: "json_schema", schema: req.schema };
  if (allowExtras) outputConfig.effort = effort;

  const body: Record<string, unknown> = {
    model: req.model,
    max_tokens: req.maxTokens ?? 2000,
    system: req.system,
    messages: [{ role: "user", content: req.user }],
  };
  // thinking só p/ Opus/Sonnet (omitido na família Haiku — A1).
  if (allowExtras) body.thinking = { type: "adaptive" };
  // output_config só se tiver algo (format e/ou effort).
  if (Object.keys(outputConfig).length > 0) body.output_config = outputConfig;

  return body;
}

export function createClaudeClient(): LlmClient {
  return {
    id: "claude",
    async complete(req: LlmRequest): Promise<LlmResponse> {
      // Lazy import via a non-literal specifier so the type-checker/build don't require the SDK
      // to be installed (it's optional until you wire a key in production).
      const sdkName = "@anthropic-ai/sdk";
      const mod = await import(sdkName).catch(() => {
        throw new Error("claude-client: instale @anthropic-ai/sdk (npm i @anthropic-ai/sdk) e defina ANTHROPIC_API_KEY.");
      });
      const Anthropic = (mod as { default: new (opts?: Record<string, unknown>) => unknown }).default;
      // M3 — retries (backoff p/ rate-limit/5xx) + timeout no nível do SDK.
      const client = new Anthropic({ maxRetries: SDK_MAX_RETRIES, timeout: REQUEST_TIMEOUT_MS }) as {
        messages: { create: (args: Record<string, unknown>) => Promise<Record<string, unknown>> };
      };

      let res: Record<string, unknown>;
      try {
        res = await client.messages.create(buildClaudeRequest(req));
      } catch (err) {
        // M3/M6 — erros tipados do SDK (RateLimitError, APIError, timeout) propagados
        // com mensagem útil; o caller (runAgent/runTriage) trata via fallback determinístico.
        const e = err as { name?: string; status?: number; message?: string };
        throw new Error(
          `claude-client: chamada à API falhou (${e.name ?? "erro"}${e.status ? ` ${e.status}` : ""}): ${e.message ?? String(err)}`,
        );
      }

      // Refusal: classifier declined — surface it, don't read content as an answer.
      if (res.stop_reason === "refusal") {
        return { text: "", json: null, model: String(res.model ?? req.model), refusal: true };
      }

      // M6 — os casts/parse ficam DENTRO do try: saída malformada da API não vira
      // TypeError não tratado; vira erro propagado p/ o fallback do caller.
      try {
        const blocks = Array.isArray(res.content) ? (res.content as Array<Record<string, unknown>>) : [];
        const text = blocks.filter((b) => b.type === "text").map((b) => String(b.text ?? "")).join("");
        let json: unknown = null;
        if (req.schema && text) {
          try { json = JSON.parse(text); } catch { json = null; }
        }
        const usage = (res.usage ?? {}) as Record<string, number>;
        return {
          text,
          json,
          model: String(res.model ?? req.model),
          usage: { inputTokens: usage.input_tokens, outputTokens: usage.output_tokens },
        };
      } catch (err) {
        throw new Error(`claude-client: resposta da API em formato inesperado: ${(err as Error).message}`);
      }
    },
  };
}
