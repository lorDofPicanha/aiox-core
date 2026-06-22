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
  createApiClientFromMotor,
  type ContadorApiClient,
  type RulesetDocumento,
} from "@synkra/contador-api-client";
// Régua DRAFT autorada pelos clones (pendente validação tributarista — gate Fase 3).
import rulesetDoc from "@synkra/contador-motor-fiscal/data/ruleset-cclasstrib-v0-draft.json";

export const ESCRITORIO_ID = "00000000-0000-4000-8000-000000000001";

let singleton: Promise<ContadorApiClient> | null = null;

export function getApi(): Promise<ContadorApiClient> {
  if (!singleton) {
    singleton = createApiClientFromMotor(rulesetDoc as RulesetDocumento).then(({ api }) => api);
  }
  return singleton;
}
