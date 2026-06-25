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
