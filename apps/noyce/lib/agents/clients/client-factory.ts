// Provider factory: escolhe o LlmClient por ambiente.
// - OPENAI_API_KEY definido  → OpenAI (gpt-4o-mini/gpt-4o por tier; OPENAI_MODEL força um modelo)
// - senão                    → Claude (default histórico do squad; precisa de ANTHROPIC_API_KEY)
// Forçar manualmente: LLM_PROVIDER=openai | claude.

import type { LlmClient } from "../agent-types.ts";
import { createClaudeClient } from "./claude-client.ts";
import { createOpenAiClient } from "./openai-client.ts";

export function createLlmClient(): LlmClient {
  const forced = process.env.LLM_PROVIDER?.toLowerCase();
  if (forced === "openai") return createOpenAiClient();
  if (forced === "claude") return createClaudeClient();

  if (process.env.OPENAI_API_KEY) return createOpenAiClient();
  return createClaudeClient();
}
