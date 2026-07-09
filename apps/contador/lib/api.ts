/**
 * Ponto único de acesso ao core via @synkra/contador-api-client.
 *
 * Fase 1 / F1.2: instância MOCK in-memory POPULADA PELO MOTOR REAL.
 * A régua (autorada pelos clones) é carregada como base de referência; o motor
 * (`classificar`) roda sobre itens sintéticos e cada divergência vira um indício
 * via registrarAnalise → fila + trilha (hash-chain real). Os apontamentos que as
 * telas mostram são PRODUZIDOS PELO MOTOR, não escritos à mão.
 *
 * Quando a Fase 2 ligar o Supabase, só esta factory muda (createApiClient({mode:
 * "supabase"}) + a mesma régua/itens) — as telas continuam consumindo a mesma interface.
 *
 * Escopo do tenant na demo: ESCRITORIO_ID sintético do seed.
 */
import {
  createApiClient,
  createApiClientFromMotor,
  createFetchTransport,
  type ContadorApiClient,
  type RulesetDocumento,
} from "@synkra/contador-api-client";
// Régua DRAFT autorada pelos clones (pendente validação tributarista — gate Fase 3).
import rulesetDoc from "@synkra/contador-motor-fiscal/data/ruleset-cclasstrib-v0-draft.json";

export const ESCRITORIO_ID = "00000000-0000-4000-8000-000000000001";

let singleton: Promise<ContadorApiClient> | null = null;

/**
 * Lê as chaves do Supabase do env. Aceita tanto os nomes do handoff F2
 * (SUPABASE_URL / SUPABASE_ANON_KEY) quanto os NEXT_PUBLIC_* já usados no monorepo.
 * Sem as duas presentes, retorna null → fallback mock (Fase 1).
 */
function resolveSupabaseEnv(): { url: string; anonKey: string } | null {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return url && anonKey ? { url, anonKey } : null;
}

export function getApi(): Promise<ContadorApiClient> {
  if (!singleton) {
    const supa = resolveSupabaseEnv();
    if (supa) {
      // Fase 2: backend Supabase real por trás do MESMO contrato (ContadorApiClient) —
      // as telas não mudam. O JWT por usuário/sessão (RLS runtime) entra na F2.2;
      // aqui a anon key é a base do transport PostgREST.
      const transport = createFetchTransport({ url: supa.url, apiKey: supa.anonKey });
      singleton = Promise.resolve(createApiClient({ mode: "supabase", transport }));
    } else {
      // Sem env: MOCK in-memory populado pelo motor real (comportamento atual da Fase 1).
      singleton = createApiClientFromMotor(rulesetDoc as RulesetDocumento).then(({ api }) => api);
    }
  }
  return singleton;
}
