/**
 * S3/S5 — Contrato de dados da SAÚDE FISCAL da carteira + provider abstrato (e-CAC, D9).
 *
 * Formaliza o CONTRATO ESTÁVEL que separa as regras puras (saude-fiscal-model.ts) da ORIGEM
 * do dado. Hoje a origem é o seed sintético (MockSaudeFiscalProvider); amanhã serão os
 * adapters reais — SEM mexer no model nem na UI.
 *
 * ┌─ ONDE O DIALETO DOS ADAPTERS VAI MORAR (bounded context FF-1 / handoff 58 §3, §5) ──────┐
 * │ Caixa postal / situação fiscal / intimações: Integra Contador (SERPRO) — idServiço      │
 * │   CAIXAPOSTAL / SITFIS / EVENTOSATUALIZACAO. Auth e-CNPJ → JWT (story S1, [adapter]).    │
 * │ CNDs (federal-conjunta / estadual / municipal / CNDT / CRF-FGTS): Infosimples — a        │
 * │   Integra NÃO expõe CND (handoff 58 §3). (story S4, [adapter]).                          │
 * │ Esse dialeto fica ISOLADO no adapter; o app consome SÓ este contrato (MensagemCaixaBruta │
 * │ / CndBruta), nunca o JSON cru do SERPRO/Infosimples.                                     │
 * │                                                                                          │
 * │ 🔴 GATE DO FOUNDER (handoff 58 §2 — pré-requisitos bloqueantes): contrato SERPRO /       │
 * │ Integra Contador + e-CNPJ; conta Infosimples pré-paga; PROCURAÇÕES / Autorização de      │
 * │ Acesso homologadas por cliente. Enquanto não houver, SÓ o mock roda — nada de consulta   │
 * │ real ao Fisco. As stories de adapter (S1/S2/S4) estão FORA desta fatia [build].          │
 * └────────────────────────────────────────────────────────────────────────────────────────┘
 *
 * Este arquivo NÃO contém regra (triagem/renovação são puras, em saude-fiscal-model.ts). Só
 * define: as formas de entrada dos adapters (re-export de MensagemCaixaBruta / CndBruta), a
 * interface SaudeFiscalProvider e o MockSaudeFiscalProvider (devolve o seed sintético).
 */
import type { CndBruta, MensagemCaixaBruta } from "./saude-fiscal-model";
import {
  getCndsSinteticas,
  getMensagensCaixaSinteticas,
} from "./saude-fiscal-data";

/**
 * Forma BRUTA de uma mensagem da caixa postal, do ponto de vista do provider — o que o
 * adapter do Integra Contador (CAIXAPOSTAL) precisa devolver para alimentar a triagem (S3).
 * Alias estável do tipo do model (o seed já é exatamente o contrato consumido pela regra).
 */
export type MensagemBruta = MensagemCaixaBruta;

/**
 * Forma BRUTA de uma CND, do ponto de vista do provider — o que o adapter Infosimples
 * precisa devolver para alimentar a renovação proativa (S5). Alias estável do tipo do model.
 */
export type CertidaoBruta = CndBruta;

/**
 * Uma pendência extraída do relatório de SITUAÇÃO FISCAL (SITFIS · Integra Contador). Modela
 * SÓ o que o relatório realmente traz por seção — sem inventar semântica fiscal (handoff 58 §5).
 *
 * G6: descreve um INDÍCIO de pendência conforme consta no relatório; nunca afirma "regularizado".
 */
export interface PendenciaFiscalBruta {
  /** Código/seção da pendência no relatório SITFIS (ex.: "SIEF", "DCTF", "GFIP"). */
  codigo: string;
  /** Rubrica/tipo da pendência (ex.: "Débito (SIEF)", "Omissão de declaração"). */
  tipo: string;
  /** Descrição textual (G6-safe) da pendência, como consta no relatório. */
  descricao: string;
}

/**
 * Forma BRUTA da SITUAÇÃO FISCAL de um cliente (SITFIS), do ponto de vista do provider — o que
 * o adapter do Integra Contador (SITFIS, idServiço `SOLICITARPROTOCOLO91` → `RELATORIOSITUACAOFISCAL92`,
 * assíncrono — handoff 58 §3) precisa devolver. Novo contrato mínimo criado para S1: o model
 * S3/S5 não tinha forma para a situação fiscal (só caixa postal e CND).
 */
export interface SituacaoFiscalBruta {
  clienteId: string;
  clienteNome: string;
  documento: string;
  /** Quando o relatório de situação fiscal foi lido (ISO). */
  consultadoEmIso: string;
  /** Protocolo do relatório assíncrono SITFIS (opaco — o adapter guarda para auditoria). */
  protocolo: string;
  /** Pendências extraídas do relatório (lista vazia = sem indício de pendência no relatório). */
  pendencias: PendenciaFiscalBruta[];
}

/**
 * Forma BRUTA de um EVENTO DE ATUALIZAÇÃO (EVENTOSATUALIZACAO, idServiço `OBTEREVENTOSPJ134`) —
 * o sinal de que a situação de um contribuinte MUDOU desde a última varredura (nova mensagem na
 * caixa postal, alteração de situação fiscal, etc.). Dispara reconsulta incremental sem varrer tudo.
 */
export interface EventoAtualizacaoBruto {
  clienteId: string;
  documento: string;
  /** Tipo do evento conforme o catálogo (ex.: "CAIXAPOSTAL", "SITFIS", "PARCELAMENTO"). */
  tipo: string;
  /** Momento do evento (ISO). */
  ocorridoEmIso: string;
}

/**
 * Uma LEITURA datada da saúde fiscal da carteira (um "snapshot"). Carrega a sua própria data
 * de referência (`refIso`) — as regras puras consomem essa data, mantendo tudo determinístico
 * e sem Date.now() embutido (espelha LeituraParcelamentos do módulo de parcelamentos).
 */
export interface LeituraSaudeFiscal {
  /** Data de referência ISO em que esta leitura foi tirada (ancora prazos e validades). */
  refIso: string;
  /** Mensagens brutas da caixa postal da carteira nessa data. */
  mensagens: MensagemBruta[];
  /** CNDs brutas (por cliente/esfera) da carteira nessa data. */
  cnds: CertidaoBruta[];
  /**
   * Situações fiscais (SITFIS) da carteira nessa data — OPCIONAL. O mock não preenche (só os
   * adapters reais do Integra Contador o fazem — S1). Campo aditivo: não muda S3/S5 nem a page.
   */
  situacoesFiscais?: SituacaoFiscalBruta[];
  /**
   * Eventos de atualização (EVENTOSATUALIZACAO) desde a última varredura — OPCIONAL. Idem: só
   * os adapters reais preenchem. Aditivo e retrocompatível.
   */
  eventos?: EventoAtualizacaoBruto[];
}

/**
 * Contrato do provedor de saúde fiscal. Os adapters reais implementariam esta mesma
 * interface, traduzindo o dialeto SERPRO (caixa postal) e Infosimples (CND) → estas formas
 * brutas no seu interior.
 *
 * `escritorioId` existe na assinatura porque o adapter real consulta POR escritório (e-CNPJ
 * + procurações da carteira — handoff 58 §2); no mock é ignorado (base única sintética).
 */
export interface SaudeFiscalProvider {
  /** Leitura corrente da saúde fiscal da carteira do escritório (caixa postal + CNDs). */
  listarSaudeFiscal(escritorioId: string, refIso: string): Promise<LeituraSaudeFiscal>;
}

/**
 * Provider MOCK — devolve a base SINTÉTICA atual (saude-fiscal-data.ts). É o que roda no
 * "caminho mínimo funcional" desta fatia [build]: triagem (S3) + renovação proativa (S5)
 * demonstram o diferencial SEM credencial SERPRO/Infosimples e SEM procurações. Async por
 * contrato (espelha a chamada de rede do adapter real), mas resolve de imediato — tudo em
 * memória.
 *
 * 🔴 O adapter real é GATE DO FOUNDER (handoff 58 §2): contrato SERPRO + conta Infosimples +
 * procurações eletrônicas homologadas por cliente. Até lá, nada aqui é consulta real ao Fisco.
 */
export class MockSaudeFiscalProvider implements SaudeFiscalProvider {
  async listarSaudeFiscal(
    _escritorioId: string,
    refIso: string,
  ): Promise<LeituraSaudeFiscal> {
    return {
      refIso,
      mensagens: getMensagensCaixaSinteticas(refIso),
      cnds: getCndsSinteticas(refIso),
    };
  }
}

/** Escritório de demonstração (base sintética única). */
export const ESCRITORIO_SAUDE_DEMO = "escritorio-demo";

/** Instância padrão usada pela page enquanto não houver adapters reais (gate do founder). */
export const saudeFiscalProvider: SaudeFiscalProvider = new MockSaudeFiscalProvider();
