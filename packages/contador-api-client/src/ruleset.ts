/**
 * Adaptador da RÉGUA de referência (autorada pelos clones) para o shape que o
 * MOTOR REAL (@synkra/contador-motor-fiscal) consome.
 *
 * Fonte de verdade: packages/contador-motor-fiscal/data/ruleset-cclasstrib-v0-draft.json
 * (régua DRAFT pendente de validação por tributarista — gate da Fase 3).
 *
 * Por que um adaptador e não passar o JSON cru ao motor?
 *  - A régua tem campos a mais (segmento, confianca, cclasstribObs, notaClone…) que o
 *    motor ignora — mas que a CAMADA DE SEED precisa (banda de confiança, abstenção).
 *  - Regras marcadas `cclasstribEsperado: "DISPUTADO"` NÃO podem virar regra ativa do
 *    motor: o motor v0 afirmaria a "referência DISPUTADO" como certeza — proibido (G6).
 *    Essas regras viram `disputadas` e são tratadas pela camada de seed/banda, conforme
 *    a limitação documentada em packages/contador-motor-fiscal/data/README.md §"Limitacao
 *    conhecida do motor v0".
 *
 * Nada aqui afirma crédito garantido / apuração correta / elimina multa. Indício +
 * trilha verificável, sujeito a revisão humana (contador com CRC ativo).
 */

import type { BaseReferencia, RegraClassificacao } from "@synkra/contador-motor-fiscal";
import type { TipoDivergencia } from "./types";

/** Rótulo de confiança qualitativo da régua (campo `confianca` do ruleset). */
export type ConfiancaRotulo = "alta" | "media" | "baixa-disputado";

/** Uma regra crua da régua (ruleset-cclasstrib-v0-draft.json → bloco `regras`). */
export interface RegraRuleset {
  id: string;
  segmento?: string;
  ncmPrefixo?: string;
  ncmExato?: string;
  descricaoTipo?: string;
  cclasstribEsperado: string;
  regime?: string;
  tipoDivergencia?: TipoDivergencia;
  materialidadeMinima?: number;
  confianca?: ConfiancaRotulo | string;
  fundamento?: string[];
}

/** O documento da régua (ruleset-cclasstrib-v0-draft.json). */
export interface RulesetDocumento {
  rulesetVersao: string;
  status: string;
  geradoEm?: string;
  regras: RegraRuleset[];
}

/** Marcador literal de regra disputada (sem cClassTrib fixo) na régua. */
export const DISPUTADO_LITERAL = "DISPUTADO";

/** True se a regra está marcada como disputada (sem referência fixa). */
export function isRegraDisputada(r: RegraRuleset): boolean {
  return (
    r.cclasstribEsperado === DISPUTADO_LITERAL ||
    r.regime === "disputado" ||
    r.confianca === "baixa-disputado"
  );
}

/**
 * Resultado do carregamento da régua: o que vira BASE do MOTOR vs. o que a camada
 * de seed trata como abstenção/disputa.
 */
export interface RulesetCarregado {
  baseVersaoRotulo: string;
  /** Base que o motor REAL recebe (`classificar(item, base)`) — só regras com cClassTrib fixo. */
  base: BaseReferencia;
  /** Mapa id→confiança qualitativa, para a camada de seed calibrar a banda. */
  confiancaPorRegra: Map<string, ConfiancaRotulo>;
  /** Regras disputadas (não viram regra do motor; tratadas pela banda de confiança). */
  disputadas: RegraRuleset[];
  /** Todas as regras cruas (para casamento NCM na camada de seed). */
  regras: RegraRuleset[];
}

function normalizarConfianca(c: string | undefined): ConfiancaRotulo {
  if (c === "alta" || c === "media" || c === "baixa-disputado") return c;
  return "media";
}

/**
 * Carrega a régua (já parseada de JSON) e a parte em (a) base do motor e (b) regras
 * disputadas. O `baseVersaoId` da base do motor é o `rulesetVersao` — assim a trilha
 * carimba EXATAMENTE qual versão da régua gerou cada indício (bitemporalidade P22).
 */
export function carregarRuleset(doc: RulesetDocumento): RulesetCarregado {
  const confiancaPorRegra = new Map<string, ConfiancaRotulo>();
  const disputadas: RegraRuleset[] = [];
  const regrasMotor: RegraClassificacao[] = [];

  for (const r of doc.regras) {
    confiancaPorRegra.set(r.id, normalizarConfianca(r.confianca as string));

    if (isRegraDisputada(r)) {
      disputadas.push(r);
      continue; // motor não recebe regra disputada (não pode afirmar "DISPUTADO")
    }

    regrasMotor.push({
      id: r.id,
      ncmPrefixo: r.ncmPrefixo,
      ncmExato: r.ncmExato,
      cclasstribEsperado: r.cclasstribEsperado,
      descricao: r.descricaoTipo ?? r.id,
      tipoDivergencia: r.tipoDivergencia,
      materialidadeMinima: r.materialidadeMinima,
      fundamento: r.fundamento,
    });
  }

  return {
    baseVersaoRotulo: doc.rulesetVersao,
    base: { baseVersaoId: doc.rulesetVersao, regras: regrasMotor },
    confiancaPorRegra,
    disputadas,
    regras: doc.regras,
  };
}

/**
 * Casa um item (por NCM) com uma regra da régua — usado pela camada de seed para
 * detectar itens disputados (que o motor v0 deixa silenciosos por design).
 * Espelha a lógica de desempate do motor (ncmExato > ncmPrefixo mais longo).
 */
export function casarRegra(ncm: string | undefined, regras: RegraRuleset[]): RegraRuleset | undefined {
  const n = (ncm ?? "").replace(/\D/g, "");
  if (!n) return undefined;

  const exata = regras.find((r) => r.ncmExato && r.ncmExato.replace(/\D/g, "") === n);
  if (exata) return exata;

  return regras
    .filter((r) => r.ncmPrefixo)
    .filter((r) => n.startsWith((r.ncmPrefixo as string).replace(/\D/g, "")))
    .sort(
      (a, b) =>
        (b.ncmPrefixo as string).replace(/\D/g, "").length -
        (a.ncmPrefixo as string).replace(/\D/g, "").length,
    )[0];
}
