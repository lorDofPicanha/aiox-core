// The generic agent runtime: given an AgentDefinition, a grounded context, a user task, and an
// LlmClient, it builds the call, requests structured output, and returns the response. Agents
// (triage-agent, analysis-agent, ...) layer their schema + guardrail + fallback on top of this.

import type { AgentDefinition, LlmClient, LlmResponse } from "./agent-types.ts";
import { buildSystemPrompt } from "./agent-context.ts";

export interface RunAgentInput {
  context: string; // grounded context block (assembleContext)
  task: string; // the specific instruction + the item/edital payload
}

export async function runAgent(
  def: AgentDefinition,
  input: RunAgentInput,
  client: LlmClient,
): Promise<LlmResponse> {
  return client.complete({
    system: buildSystemPrompt(def.systemPrompt),
    user: `${input.context}\n\n${input.task}`,
    schema: def.schema,
    model: def.model,
    maxTokens: def.maxTokens ?? 2000,
    effort: def.effort ?? "low",
  });
}
