// Faro — the triage agent (doc 31 / agents/faro.md). Reads a discovered edital's headline data,
// grounds on the RAG, and returns Vai/Olha/Pula with reason + provenance. The deterministic
// buildTriage stays as the fallback (and as the guardrail's reference) so a model failure,
// refusal, or guardrail violation never drops triage quality below today's baseline.

import type { AgentDefinition, LlmClient, ResultSource } from "./agent-types.ts";
import type { DiscoveryTriage } from "../noyce-model.ts";
import { buildTriage } from "../noyce-operational.ts";
import { assembleContext } from "./agent-context.ts";
import { runAgent } from "./agent-runtime.ts";
import { validateTriage } from "./guardrails.ts";

// The edital headline data Faro triages (subset of the discovery snapshot item).
export interface TriageItem {
  id: string;
  title: string;
  city: string;
  uf: string;
  distanceKm: number;
  estimatedValue: number | null;
  proposalDeadline: string | null;
  modality?: string;
  buyer?: string;
}

// Faro's output = the app's DiscoveryTriage + LLM-only enrichment (fonte, pontos, consórcio flag)
// + provenance of how it was produced.
export interface TriageResult extends DiscoveryTriage {
  fonte: string;
  pontosAtencao: string[];
  permiteConsorcio: boolean | null;
  source: ResultSource;
}

export const TRIAGE_SCHEMA: Record<string, unknown> = {
  type: "object",
  additionalProperties: false,
  properties: {
    verdict: { type: "string", enum: ["vai", "olha", "pula"] },
    score: { type: "integer" },
    reason: { type: "string" },
    daysToDeadline: { type: ["integer", "null"] },
    obrasRelevant: { type: "boolean" },
    fonte: { type: "string" },
    pontosAtencao: { type: "array", items: { type: "string" } },
    permiteConsorcio: { type: ["boolean", "null"] },
  },
  required: ["verdict", "score", "reason", "obrasRelevant", "fonte"],
};

export const FARO_DEFINITION: AgentDefinition = {
  id: "noyce-faro",
  name: "Faro",
  model: "claude-haiku-4-5", // alto volume → modelo barato (ver doc 31 §7)
  effort: "low",
  maxTokens: 1200,
  schema: TRIAGE_SCHEMA,
  systemPrompt: `Você é o Faro, o triador de editais do Noyce.
Lê o objeto, valor, prazo, distância e modalidade de um edital e o classifica frente ao perfil da ENIAC.
- Vai = forte aderência (nicho de edificações/reformas/praças, no raio, valor na faixa, prazo ok).
- Olha = aderente mas com ponto de atenção (prazo curto, valor no limite do teto solo, possível consórcio).
- Pula = fora do nicho (ex.: rodovia/infra pesada), fora do raio, prazo vencido, ou mercado muito concentrado.
Dê SEMPRE uma razão de 1 frase citando a fonte (campo do edital / perfil ENIAC). Sinalize permiteConsorcio e pontos de atenção quando detectar. Não invente número — use o que está no item.`,
};

// Map the headline item into the deterministic buildTriage input (fallback).
function toTriageInput(item: TriageItem) {
  return {
    title: item.title,
    distanceKm: item.distanceKm,
    estimatedValue: item.estimatedValue,
    proposalDeadline: item.proposalDeadline,
  };
}

function deterministicResult(item: TriageItem, source: ResultSource): TriageResult {
  const base = buildTriage(toTriageInput(item));
  return {
    ...base,
    fonte: "buildTriage determinístico (regra valor/raio/prazo/objeto)",
    pontosAtencao: [],
    permiteConsorcio: null,
    source,
  };
}

// Run Faro on a single item. Falls back to the deterministic triage on LLM failure, refusal,
// non-object output, or guardrail violation — so the result is never worse than today's baseline.
export async function runTriage(item: TriageItem, client: LlmClient): Promise<TriageResult> {
  const context = assembleContext(`triagem edital: ${item.title}`, { topK: 3 });
  const task = `Triar este edital para a ENIAC:
- objeto: ${item.title}
- comprador: ${item.buyer ?? "?"} · cidade: ${item.city}/${item.uf} · distância: ${item.distanceKm} km
- modalidade: ${item.modality ?? "?"}
- valor estimado: ${item.estimatedValue ?? "não informado"}
- prazo de proposta: ${item.proposalDeadline ?? "não informado"}
Responda no schema (verdict, score 0..100, reason, daysToDeadline, obrasRelevant, fonte, pontosAtencao, permiteConsorcio).`;

  let resp;
  try {
    resp = await runAgent(FARO_DEFINITION, { context, task }, client);
  } catch {
    return deterministicResult(item, "guardrail_fallback");
  }
  if (resp.refusal || resp.json === null || typeof resp.json !== "object") {
    return deterministicResult(item, "guardrail_fallback");
  }

  const guard = validateTriage(resp.json, item);
  if (!guard.ok) {
    return deterministicResult(item, "guardrail_fallback");
  }

  const j = resp.json as Record<string, unknown>;
  return {
    verdict: j.verdict as TriageResult["verdict"],
    score: j.score as number,
    reason: j.reason as string,
    daysToDeadline: (j.daysToDeadline ?? null) as number | null,
    obrasRelevant: Boolean(j.obrasRelevant),
    fonte: j.fonte as string,
    pontosAtencao: Array.isArray(j.pontosAtencao) ? (j.pontosAtencao as string[]) : [],
    permiteConsorcio: (j.permiteConsorcio ?? null) as boolean | null,
    source: "llm",
  };
}

// Triage a batch (sequential — caller can parallelize with a concurrency cap if desired).
export async function runTriageBatch(items: TriageItem[], client: LlmClient): Promise<TriageResult[]> {
  const out: TriageResult[] = [];
  for (const item of items) out.push(await runTriage(item, client));
  return out;
}
