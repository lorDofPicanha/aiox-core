/**
 * Versão da RÉGUA contra a qual o laudo foi verificado (cabeçalho "trust center").
 *
 * Lê o `rulesetVersao` da MESMA régua que o motor usa (lib/api.ts importa o mesmo
 * arquivo para popular o mock). Co-localizado em app/laudos/ para não tocar lib/api.ts.
 * Mantém o laudo honesto: carimba EXATAMENTE qual versão da régua gerou os indícios.
 */
import rulesetDoc from "@synkra/contador-motor-fiscal/data/ruleset-cclasstrib-v0-draft.json";

interface RulesetMeta {
  rulesetVersao: string;
  status: string;
}

const meta = rulesetDoc as unknown as RulesetMeta;

/** Ex.: "ruleset-cclasstrib-v0-draft-2026-06-20". */
export const REGUA_VERSAO: string = meta.rulesetVersao ?? "(versão indisponível)";

/** Status da régua (ex.: "draft" — pendente validação tributarista). */
export const REGUA_STATUS: string = meta.status ?? "draft";
