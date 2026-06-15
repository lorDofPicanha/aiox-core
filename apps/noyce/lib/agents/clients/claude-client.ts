// Claude implementation of LlmClient (default provider). The @anthropic-ai/sdk import is LAZY
// so this module loads even before the SDK is installed and tests (which inject a fake client)
// don't need it. Structured output via output_config.format = json_schema, per the Claude API.
//
// Install to use in production:  npm i @anthropic-ai/sdk   (and set ANTHROPIC_API_KEY)
// Default model is claude-opus-4-8; agents override per AgentDefinition (e.g. Faro → haiku).

import type { LlmClient, LlmRequest, LlmResponse } from "../agent-types.ts";

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
      const Anthropic = (mod as { default: new () => unknown }).default;
      const client = new Anthropic() as {
        messages: { create: (args: Record<string, unknown>) => Promise<Record<string, unknown>> };
      };

      const res = await client.messages.create({
        model: req.model,
        max_tokens: req.maxTokens ?? 2000,
        thinking: { type: "adaptive" }, // adaptive (Opus 4.8 / Haiku family); omit budget_tokens
        output_config: req.schema
          ? { effort: req.effort ?? "low", format: { type: "json_schema", schema: req.schema } }
          : { effort: req.effort ?? "low" },
        system: req.system,
        messages: [{ role: "user", content: req.user }],
      });

      // Refusal: classifier declined — surface it, don't read content as an answer.
      if (res.stop_reason === "refusal") {
        return { text: "", json: null, model: String(res.model ?? req.model), refusal: true };
      }

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
    },
  };
}
