// Core types for the Noyce LLM agent layer (doc 31). Provider-agnostic by design:
// the runtime depends on the LlmClient interface, not on any one SDK — so an agent can run
// on Claude, GPT-5 (codex), or a fake client in tests, decided per AgentDefinition.

export interface LlmUsage {
  inputTokens?: number;
  outputTokens?: number;
}

export interface LlmRequest {
  system: string;
  user: string;
  // JSON Schema for structured output. When set, the client must return parsed `json`.
  schema?: Record<string, unknown>;
  model: string;
  maxTokens?: number;
  effort?: "low" | "medium" | "high" | "max";
}

export interface LlmResponse {
  text: string;
  json: unknown | null; // parsed structured output when a schema was requested
  model: string;
  refusal?: boolean; // safety/classifier refusal (handle, don't treat as content)
  usage?: LlmUsage;
}

// A model provider the runtime can call. Implementations: claude-client, (codex-client),
// and a fake client in tests. `id` is for provenance/telemetry.
export interface LlmClient {
  readonly id: string; // "claude" | "codex" | "fake"
  complete(req: LlmRequest): Promise<LlmResponse>;
}

// An agent's static definition — the source of its system prompt + model + output schema.
// Mirrors the squad specs in apps/noyce/agents/*.md.
export interface AgentDefinition {
  id: string; // "noyce-faro"
  name: string; // "Faro"
  model: string; // e.g. "claude-haiku-4-5"
  systemPrompt: string;
  schema: Record<string, unknown>; // JSON Schema for structured output
  maxTokens?: number;
  effort?: "low" | "medium" | "high" | "max";
}

export interface GuardrailViolation {
  rule: "schema" | "provenance" | "deadline" | "human_act" | "number";
  field?: string;
  detail: string;
}

export interface GuardrailResult {
  ok: boolean;
  violations: GuardrailViolation[];
}

// Provenance of a produced result: did the LLM agent produce it, or the deterministic fallback?
export type ResultSource = "llm" | "deterministic" | "guardrail_fallback";
