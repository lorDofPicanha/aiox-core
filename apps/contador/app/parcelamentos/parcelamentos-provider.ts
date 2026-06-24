/**
 * PAR-1 — Contrato de dados do domínio de PARCELAMENTOS + provider abstrato.
 *
 * Formaliza o CONTRATO ESTÁVEL que separa a regra pura (parcelamentos-model.ts) da
 * ORIGEM do dado. Hoje a origem é o seed sintético (MockParcelamentoProvider); amanhã
 * será um adapter real do Integra Contador (SERPRO) — sem mexer no model nem na UI.
 *
 * ┌─ ONDE O DIALETO SERPRO VAI MORAR (bounded context FF-1 / handoff 57 §5, story PAR-9) ─┐
 * │ O adapter real (ex.: IntegraParcelamentoProvider) traduz o payload bruto dos sistemas │
 * │ PARCSN / PARCMEI / PERTSN / RELPSN (idServico OBTERPARC164/184 — doc 55 §B) para este │
 * │ contrato `ParcelamentoBruto`. Esse dialeto fica ISOLADO no adapter (P9 — `ingestao.*`);│
 * │ o app consome SÓ este contrato, nunca o JSON cru do SERPRO. Limites factuais da API    │
 * │ (handoff 57 §3): a Integra só CONSULTA parcelas + EMITE DAS — NÃO há adesão via API.   │
 * │ Por isso o contrato modela leitura (consulta), nunca "aderir/regularizar".             │
 * └────────────────────────────────────────────────────────────────────────────────────────┘
 *
 * Este arquivo NÃO contém a regra de rescisão (essa é pura, em parcelamentos-model.ts).
 * Só define: o formato de entrada do adapter (`ParcelamentoBruto` = o ParcelamentoSeed),
 * a interface `ParcelamentoProvider` e o `MockParcelamentoProvider` (devolve o seed atual).
 */
import type { ParcelamentoSeed } from "./parcelamentos-model";
import { getParcelamentosSinteticos, getSnapshotAnteriorSintetico } from "./parcelamentos-data";

/**
 * Forma BRUTA de um parcelamento, do ponto de vista do provider — o que um adapter real
 * (Integra Contador) precisa devolver para alimentar a classificação de risco do model.
 *
 * É um ALIAS estável de `ParcelamentoSeed`: o seed JÁ é exatamente o contrato que a regra
 * pura consome (cliente, esfera, programa, parcelas, desconto em risco). Mantemos um nome
 * próprio aqui para deixar o CONTRATO explícito e desacoplado da palavra "seed" — quando o
 * adapter real existir, ele preenche `ParcelamentoBruto`, não um "seed".
 */
export type ParcelamentoBruto = ParcelamentoSeed;

/**
 * Uma LEITURA datada da carteira (um "snapshot"). O monitor (PAR-3) compara duas leituras
 * para detectar transições de risco — por isso a leitura carrega a sua própria data de
 * referência (`refIso`), mantendo a comparação determinística e sem `Date.now()` embutido.
 */
export interface LeituraParcelamentos {
  /** Data de referência ISO em que esta leitura foi tirada (ancora os vencimentos relativos). */
  refIso: string;
  /** Parcelamentos brutos da carteira nessa data. */
  parcelamentos: ParcelamentoBruto[];
}

/**
 * Contrato do provedor de parcelamentos. Um adapter real do Integra Contador implementaria
 * esta mesma interface, traduzindo o dialeto SERPRO → `ParcelamentoBruto` no seu interior.
 *
 * - `listarParcelamentos`: a leitura de HOJE (a consulta corrente da carteira do escritório).
 * - `listarSnapshotAnterior`: a última leitura conhecida (ex.: a de ontem), usada pelo monitor
 *   PAR-3 para detectar quem MUDOU de banda de risco. No mundo real virá da persistência
 *   (Fase 2 / `core_api_v1`); no mock vem de um snapshot sintético "de ontem".
 */
export interface ParcelamentoProvider {
  /** Leitura corrente da carteira do escritório. */
  listarParcelamentos(escritorioId: string, refIso: string): Promise<LeituraParcelamentos>;
  /**
   * Última leitura conhecida ANTES da corrente (para o monitor de transições — PAR-3).
   * Retorna null quando não há histórico (ex.: primeira leitura — nada com que comparar).
   */
  listarSnapshotAnterior(escritorioId: string, refIso: string): Promise<LeituraParcelamentos | null>;
}

/**
 * Provider MOCK — devolve a base SINTÉTICA atual (parcelamentos-data.ts). É o que roda no
 * "caminho mínimo funcional" (handoff 57 §4, fim): PAR-1 + PAR-3 + PAR-4 demonstram o
 * diferencial (monitor + alerta) SEM credencial SERPRO e SEM Supabase. Async por contrato
 * (espelha a chamada de rede do adapter real), mas resolve de imediato — é tudo em memória.
 *
 * `escritorioId` é ignorado aqui (base única sintética); existe na assinatura porque o
 * adapter real consulta POR escritório (e-CNPJ + procurações da carteira — handoff 57 §2).
 */
export class MockParcelamentoProvider implements ParcelamentoProvider {
  async listarParcelamentos(_escritorioId: string, refIso: string): Promise<LeituraParcelamentos> {
    return { refIso, parcelamentos: getParcelamentosSinteticos(refIso) };
  }

  async listarSnapshotAnterior(
    _escritorioId: string,
    refIso: string,
  ): Promise<LeituraParcelamentos | null> {
    const anterior = getSnapshotAnteriorSintetico(refIso);
    return anterior ? { refIso: anterior.refIso, parcelamentos: anterior.parcelamentos } : null;
  }
}

/** Escritório de demonstração (base sintética única). */
export const ESCRITORIO_DEMO = "escritorio-demo";

/** Instância padrão usada pela page enquanto não houver adapter real (Fase B). */
export const parcelamentoProvider: ParcelamentoProvider = new MockParcelamentoProvider();
