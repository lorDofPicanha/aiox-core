// Faro — the triage agent (doc 31 / agents/faro.md). Reads a discovered edital's headline data,
// grounds on the RAG, and returns Vai/Olha/Pula with reason + provenance. The deterministic
// buildTriage stays as the fallback (and as the guardrail's reference) so a model failure,
// refusal, or guardrail violation never drops triage quality below today's baseline.

import type { AgentDefinition, LlmClient, ResultSource } from "./agent-types.ts";
import type { DiscoveryTriage } from "../noyce-model.ts";
import { buildTriage, nowIso } from "../noyce-operational.ts";
import { ensureBrOffset } from "../noyce-dates.ts";
import { assembleContext } from "./agent-context.ts";
import { runAgent } from "./agent-runtime.ts";
import { validateTriage } from "./guardrails.ts";

// M5 — daysToDeadline DETERMINÍSTICO. Não confiar no número que a LLM devolve
// (pode alucinar / desatualizar). Recalcula a partir do proposalDeadline real,
// já normalizado por ensureBrOffset (C1) p/ não deslizar com o fuso do servidor.
// `asOf` injetável p/ teste; default = agora real. null se não há prazo (nunca
// inventa — I2/I5).
export function computeDaysToDeadline(proposalDeadline: string | null, asOf: string = nowIso()): number | null {
  const due = ensureBrOffset(proposalDeadline);
  if (due === null) return null;
  const dueMs = new Date(due).getTime();
  const asOfMs = new Date(asOf).getTime();
  if (Number.isNaN(dueMs) || Number.isNaN(asOfMs)) return null;
  return Math.ceil((dueMs - asOfMs) / 86_400_000);
}

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
export async function runTriage(item: TriageItem, client: LlmClient, asOf: string = nowIso()): Promise<TriageResult> {
  const context = assembleContext(`triagem edital: ${item.title}`, { topK: 3 });
  // Data de referência ("hoje") informada ao modelo: sem ela, o LLM não tem como
  // julgar se o prazo está aberto. O daysToDeadline final ainda é recalculado de
  // forma determinística (M5), mas o VEREDITO depende de o modelo conhecer a data.
  const refDate = asOf.slice(0, 10);
  const task = `Triar este edital para a ENIAC:
- DATA DE REFERÊNCIA (hoje): ${refDate} — avalie o prazo em relação a esta data; se já passou, é "pula" (prazo encerrado).
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
    // M5 — daysToDeadline SEMPRE do cálculo determinístico, nunca do JSON da LLM.
    daysToDeadline: computeDaysToDeadline(item.proposalDeadline, asOf),
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
