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
export {
  SupabaseApiClient,
  createFetchTransport,
  type SupabaseTransportLike,
  type SupabaseSchemaLike,
  type SupabaseQueryBuilderLike,
  type SupabaseReadBuilderLike,
  type SupabaseTransportResult,
  type SupabaseTransportError,
  type FetchTransportOptions,
} from "./supabase-client";
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
import { SupabaseApiClient, type SupabaseTransportLike } from "./supabase-client";

/**
 * Opções da factory. Estende {@link CreateApiClientOptions} (sem alterá-la) com o
 * `transport` do modo supabase — mantido aqui para não tocar em `client.ts`.
 */
export type CreateApiClientInput = CreateApiClientOptions & {
  /**
   * Transport para `mode: "supabase"`: um client do `@supabase/supabase-js`
   * (`createClient(url, anonKey)`) OU o retorno de `createFetchTransport({url, apiKey})`.
   */
  transport?: SupabaseTransportLike;
};

/**
 * Factory canônica do cliente.
 *
 *   const api = createApiClient({ mode: "mock" });                       // Fase 1
 *   const api = createApiClient({ mode: "supabase", transport });        // Fase 2
 *
 * O modo "supabase" fala com o Postgres real por trás desta MESMA interface —
 * o app não muda quando trocar o backend (só a factory `lib/api.ts:getApi()`).
 */
export function createApiClient(options: CreateApiClientInput = {}): ContadorApiClient {
  const mode = options.mode ?? "mock";
  if (mode === "mock") {
    return new MockApiClient(options.seed ?? buildDefaultSeed());
  }
  // Fase 2 (Supabase). Honesto: sem transport, diz exatamente o que falta.
  if (!options.transport) {
    throw new Error(
      "[Fase 2] createApiClient({ mode: 'supabase' }) requer um `transport`. " +
        "Passe um client @supabase/supabase-js (createClient(url, anonKey)) ou " +
        "createFetchTransport({ url, apiKey }). As chaves do Supabase " +
        "(SUPABASE_URL/SUPABASE_ANON_KEY) ainda não foram provisionadas (F2.1/F2.2).",
    );
  }
  return new SupabaseApiClient(options.transport);
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
