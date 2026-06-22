/**
 * @synkra/contador-api-client
 *
 * Cliente TIPADO sobre core_api_v1 (a published write API do core do Contador).
 * Fase 1: implementação MOCK in-memory (sintética, G6-safe).
 * Fase 2: createApiClient({ mode: "supabase" }) — ponto de extensão reservado.
 */

export * from "./types";
export type { ContadorApiClient, CreateApiClientOptions } from "./client";
export { MockApiClient } from "./mock-client";
export { buildDefaultSeed, type SeedDataset } from "./mock-data";
export {
  carregarRuleset,
  casarRegra,
  isRegraDisputada,
  DISPUTADO_LITERAL,
  type RulesetDocumento,
  type RegraRuleset,
  type RulesetCarregado,
  type ConfiancaRotulo,
} from "./ruleset";
export {
  seedFromMotor,
  type SeedEstatistica,
} from "./seed-from-motor";

import type { ContadorApiClient, CreateApiClientOptions } from "./client";
import { MockApiClient } from "./mock-client";
import { buildDefaultSeed } from "./mock-data";
import { seedFromMotor } from "./seed-from-motor";
import type { RulesetDocumento } from "./ruleset";

/**
 * Factory canônica do cliente.
 *
 *   const api = createApiClient({ mode: "mock" }); // Fase 1
 *
 * O modo "supabase" será implementado na Fase 2 (S-F2.4) por trás desta MESMA
 * interface — o app não muda quando trocar o backend.
 */
export function createApiClient(options: CreateApiClientOptions = {}): ContadorApiClient {
  const mode = options.mode ?? "mock";
  if (mode === "mock") {
    return new MockApiClient(options.seed ?? buildDefaultSeed());
  }
  // Ponto de extensão Fase 2 (Supabase). Mantido honesto: não finge existir.
  throw new Error(
    "[Fase 2] createApiClient({ mode: 'supabase' }) ainda não implementado. " +
      "Use mode: 'mock' na Fase 1.",
  );
}

/**
 * Factory F1.2 — client MOCK já POPULADO pelo MOTOR REAL a partir da RÉGUA.
 *
 *   import ruleset from "@synkra/contador-motor-fiscal/data/ruleset-cclasstrib-v0-draft.json";
 *   const { api } = await createApiClientFromMotor(ruleset);
 *
 * Diferente de createApiClient({mode:"mock"}) (que usa o seed escrito à mão), aqui os
 * apontamentos são PRODUZIDOS pelo motor via registrarAnalise — a fila e a trilha
 * (hash-chain real) refletem o motor. É async porque passa pelas RPCs do client.
 *
 * Fase 2: troque por createApiClient({mode:"supabase"}) + a mesma régua/itens — o
 * registrarAnalise vira a RPC core_api_v1.registrar_analise real.
 */
export async function createApiClientFromMotor(doc: RulesetDocumento) {
  return seedFromMotor(doc);
}
