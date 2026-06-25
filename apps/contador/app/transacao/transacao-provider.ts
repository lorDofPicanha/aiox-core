/**
 * PAR-7 — Contrato de dados do Radar de Transação + provider abstrato.
 *
 * Formaliza o CONTRATO ESTÁVEL que separa o engine puro (transacao-model.ts) da ORIGEM do
 * dado. Hoje a origem é o seed sintético (MockTransacaoProvider); amanhã será um adapter S6
 * real (Infosimples / PGFN-Regularize) — sem mexer no engine nem na UI.
 *
 * ┌─ ONDE O DIALETO INFOSIMPLES/PGFN VAI MORAR (bounded context FF-1 / handoff 57 §5) ──────┐
 * │ O adapter real (ex.: InfosimplesDividaAtivaProvider) traduz o payload bruto da consulta  │
 * │ de dívida ativa (PGFN/Regularize via Infosimples — doc 55 §C) para este contrato         │
 * │ `PerfilFiscalBruto`. Esse dialeto fica ISOLADO no adapter; o engine/UI consomem SÓ este  │
 * │ contrato, nunca o JSON cru.                                                               │
 * │                                                                                            │
 * │ Limite factual (doc 55 §C; handoff 57 §3): NÃO há API de adesão à transação. O adapter    │
 * │ só CONSULTA (dívida ativa / situação). Por isso o contrato modela LEITURA, nunca          │
 * │ "aderir/negociar/quitar". A adesão é ato manual do tributarista no Regularize.            │
 * └────────────────────────────────────────────────────────────────────────────────────────┘
 */
import type { PerfilFiscalSeed } from "./transacao-model";
import { getPerfisFiscaisSinteticos } from "./transacao-data";

/**
 * Forma BRUTA de um perfil fiscal, do ponto de vista do provider — o que um adapter S6 real
 * precisa devolver para alimentar a classificação de elegibilidade do engine.
 *
 * É um ALIAS estável de `PerfilFiscalSeed`: o seed JÁ é exatamente o contrato que o engine
 * consome. Nome próprio aqui para deixar o CONTRATO explícito e desacoplado da palavra "seed".
 */
export type PerfilFiscalBruto = PerfilFiscalSeed;

/** Uma LEITURA datada da carteira de perfis fiscais (snapshot). */
export interface LeituraPerfisFiscais {
  /** Data de referência ISO desta leitura (ancora a idade relativa das inscrições). */
  refIso: string;
  /** Perfis fiscais brutos da carteira nessa data. */
  perfis: PerfilFiscalBruto[];
}

/**
 * Contrato do provedor de perfis fiscais para o radar de transação. Um adapter S6 real
 * (Infosimples/PGFN) implementaria esta mesma interface, traduzindo o dialeto da consulta de
 * dívida ativa → `PerfilFiscalBruto` no seu interior.
 */
export interface TransacaoProvider {
  /** Leitura corrente da carteira de perfis fiscais do escritório. */
  listarPerfisFiscais(escritorioId: string, refIso: string): Promise<LeituraPerfisFiscais>;
}

/**
 * Provider MOCK — devolve a base SINTÉTICA atual (transacao-data.ts). Roda no caminho mínimo
 * funcional SEM credencial Infosimples/PGFN e SEM Supabase. Async por contrato (espelha a
 * chamada de rede do adapter real), mas resolve de imediato — tudo em memória.
 *
 * `escritorioId` é ignorado (base única sintética); existe na assinatura porque o adapter
 * real consulta POR escritório (procurações/autorizações da carteira).
 */
export class MockTransacaoProvider implements TransacaoProvider {
  async listarPerfisFiscais(
    _escritorioId: string,
    refIso: string,
  ): Promise<LeituraPerfisFiscais> {
    return { refIso, perfis: getPerfisFiscaisSinteticos(refIso) };
  }
}

/** Escritório de demonstração (base sintética única). */
export const ESCRITORIO_DEMO = "escritorio-demo";

/** Instância padrão usada pela page enquanto não houver adapter S6 real (gate do founder). */
export const transacaoProvider: TransacaoProvider = new MockTransacaoProvider();
