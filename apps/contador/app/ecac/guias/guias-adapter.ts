/**
 * S7 — Adapter de GERAÇÃO DE GUIAS (Integra Contador) [adapter, fixture-mode].
 *
 * Orquestra a geração de guias-Receita sobre os serviços do Integra Contador (PGDASD/SICALC/
 * DCTFWEB/PARCSN). Em MODO FIXTURE (default sem credencial) monta uma guia com linha digitável
 * SINTÉTICA (via helpers puros de guias-model); em MODO REAL (gate do founder) monta o envelope
 * SERPRO e chama o transporte compartilhado `postIntegra` (operação `Emitir`).
 *
 * ┌─ FF-1 (bounded context) ───────────────────────────────────────────────────────────────┐
 * │ O DIALETO/transporte SERPRO é REUSADO de ../adapters/integra-contador-adapter (envelope, │
 * │ TokenProvider, postIntegra, isSerproFixtureMode) — NÃO se redefine o envelope aqui. Assim │
 * │ o dialeto SERPRO segue centralizado na camada de adapters; guias-model.ts (contrato+regra)│
 * │ permanece livre de dialeto.                                                              │
 * └────────────────────────────────────────────────────────────────────────────────────────┘
 *
 * ┌─ 🔴 HUMAN-IN-LOOP (CONTEXT §5 #1; handoff 58 §5, §6) ───────────────────────────────────┐
 * │ `gerarGuia(...)` é chamada por DECISÃO HUMANA do contador. Este módulo NÃO expõe scheduler│
 * │ nem qualquer emissão automática. Gerar ≠ pagar ≠ transmitir. Entrega (S10/S11) é gated.   │
 * └────────────────────────────────────────────────────────────────────────────────────────┘
 *
 * ENV do MODO REAL: os mesmos do Integra Contador (SERPRO_CONSUMER_KEY/SECRET/BASE_URL) — ver
 * ../adapters/integra-contador-adapter. Testes rodam SEM env → modo fixture → ZERO rede.
 */
import type { GuiaGerada, PedidoGuia, TipoGuia } from "./guias-model";
import {
  TIPO_GUIA,
  codigoBarrasSintetico,
  linhaDigitavelSintetica,
  validarPedidoGuia,
} from "./guias-model.ts";
import {
  FixtureTokenProvider,
  SerproOAuthTokenProvider,
  isSerproFixtureMode,
  postIntegra,
  type SerproEnvelope,
  type SerproIdentificacao,
  type SerproToken,
  type TokenProvider,
} from "../adapters/integra-contador-adapter.ts";

/** Mapa tipo de guia → {idSistema, idServico} do catálogo Integra Contador (SERPRO). */
export const GUIA_SERVICO: Record<TipoGuia, { idSistema: string; idServico: string }> = {
  "DAS-PGDASD": { idSistema: "PGDASD", idServico: "GERARDAS12" },
  "DARF-SICALC": { idSistema: "SICALC", idServico: "CONSOLIDARGERARDARF01" },
  "DARF-DCTFWEB": { idSistema: "DCTFWEB", idServico: "GERARGUIA31" },
  "DAS-parcela": { idSistema: "PARCSN", idServico: "GERARDAS166" },
};

export interface GuiasAdapterConfig {
  baseUrl?: string;
  consumerKey?: string;
  consumerSecret?: string;
  contratanteCnpj?: string;
  autorCnpj?: string;
  tokenProvider?: TokenProvider;
}

/**
 * Monta a guia SINTÉTICA (modo fixture) a partir do pedido — puro em relação à rede. A
 * competência/vencimento/valor vêm do pedido; a linha digitável/código de barras são sintéticos.
 */
function montarGuiaSintetica(pedido: PedidoGuia, refIso: string): GuiaGerada {
  const servico = TIPO_GUIA[pedido.tipo].servico;
  return {
    id: `guia-${pedido.tipo}-${pedido.documento}-${pedido.competencia.replace("/", "")}`,
    tipo: pedido.tipo,
    clienteId: pedido.clienteId,
    clienteNome: pedido.clienteNome,
    documento: pedido.documento,
    competencia: pedido.competencia,
    vencimentoIso: pedido.vencimentoIso,
    valor: pedido.valor,
    linhaDigitavel: linhaDigitavelSintetica(pedido),
    codigoBarras: codigoBarrasSintetico(pedido),
    origem: servico,
    geradaEmIso: refIso,
    sintetica: true,
    observacao:
      "Guia PREPARADA a partir de dados sintéticos (linha digitável não é boleto real). Emitir, " +
      "pagar e transmitir são atos do contador/cliente — a plataforma não paga nem transmite.",
  };
}

/** Adapter de geração de guias. */
export class GuiasAdapter {
  baseUrl: string | undefined;
  consumerKey: string | undefined;
  consumerSecret: string | undefined;
  contratanteCnpj: string;
  autorCnpj: string;
  tokenProvider: TokenProvider;

  constructor(config: GuiasAdapterConfig = {}) {
    this.baseUrl = config.baseUrl ?? process.env.SERPRO_BASE_URL;
    this.consumerKey = config.consumerKey ?? process.env.SERPRO_CONSUMER_KEY;
    this.consumerSecret = config.consumerSecret ?? process.env.SERPRO_CONSUMER_SECRET;
    this.contratanteCnpj = config.contratanteCnpj ?? process.env.SERPRO_CONTRATANTE ?? "00000000000000";
    this.autorCnpj = config.autorCnpj ?? process.env.SERPRO_AUTOR ?? "00000000000000";
    this.tokenProvider =
      config.tokenProvider ??
      (this.isFixtureMode()
        ? new FixtureTokenProvider()
        : new SerproOAuthTokenProvider(
            this.consumerKey as string,
            this.consumerSecret as string,
            this.baseUrl as string,
          ));
  }

  /** Modo fixture quando falta credencial SERPRO. Testes sempre caem aqui. */
  isFixtureMode(): boolean {
    return isSerproFixtureMode({
      SERPRO_CONSUMER_KEY: this.consumerKey,
      SERPRO_CONSUMER_SECRET: this.consumerSecret,
      SERPRO_BASE_URL: this.baseUrl,
    });
  }

  /**
   * 🔴 HUMAN-IN-LOOP — gera UMA guia por DECISÃO EXPLÍCITA do contador (nunca por scheduler).
   * Valida o pedido; em modo fixture devolve guia sintética; em modo real Emite via Integra.
   *
   * @throws Error se o pedido for inválido (a UI deve tratar e mostrar os problemas).
   */
  async gerarGuia(pedido: PedidoGuia, refIso: string): Promise<GuiaGerada> {
    const problemas = validarPedidoGuia(pedido);
    if (problemas.length > 0) {
      throw new Error(`Pedido de guia inválido: ${problemas.join("; ")}`);
    }

    if (this.isFixtureMode()) {
      return montarGuiaSintetica(pedido, refIso);
    }

    // MODO REAL (gate do founder) — Emitir via Integra Contador. Nunca executa nos testes.
    const token: SerproToken = await this.tokenProvider.getToken();
    const servico = GUIA_SERVICO[pedido.tipo];
    const envelope: SerproEnvelope = {
      contratante: this.identificacao(this.contratanteCnpj),
      autorPedidoDados: this.identificacao(this.autorCnpj),
      contribuinte: this.identificacao(pedido.documento),
      pedidoDados: {
        idSistema: servico.idSistema,
        idServico: servico.idServico,
        versaoSistema: "1.0",
        dados: JSON.stringify({ competencia: pedido.competencia }),
      },
    };
    const resp = await postIntegra("Emitir", envelope, { baseUrl: this.baseUrl as string, token });
    const cru = JSON.parse(resp.dados) as {
      linhaDigitavel?: string;
      codigoBarras?: string;
      valor?: number;
      vencimento?: string;
    };
    return {
      id: `guia-${pedido.tipo}-${pedido.documento}-${pedido.competencia.replace("/", "")}`,
      tipo: pedido.tipo,
      clienteId: pedido.clienteId,
      clienteNome: pedido.clienteNome,
      documento: pedido.documento,
      competencia: pedido.competencia,
      vencimentoIso: cru.vencimento ?? pedido.vencimentoIso,
      valor: cru.valor ?? pedido.valor,
      linhaDigitavel: cru.linhaDigitavel ?? "",
      codigoBarras: cru.codigoBarras ?? "",
      origem: TIPO_GUIA[pedido.tipo].servico,
      geradaEmIso: refIso,
      sintetica: false,
      observacao:
        "Guia gerada via Integra Contador. Emitir, pagar e transmitir são atos do contador/cliente " +
        "— a plataforma não paga nem transmite.",
    };
  }

  private identificacao(numero: string): SerproIdentificacao {
    return { numero, tipo: 2 };
  }
}
