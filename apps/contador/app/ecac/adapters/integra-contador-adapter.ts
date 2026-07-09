/**
 * S1 — Adapter Integra Contador (SERPRO) [adapter, fixture-mode].
 *
 * Conector do backend real de SAÚDE FISCAL federal-Receita (handoff 58 §4, S1). Cobre três
 * serviços do catálogo Integra Contador:
 *   - CAIXAPOSTAL       (mensagens da carteira)            → traduz para `MensagemBruta`
 *   - SITFIS            (relatório de situação fiscal)     → traduz para `SituacaoFiscalBruta`
 *   - EVENTOSATUALIZACAO(detecção de mudança incremental)  → traduz para `EventoAtualizacaoBruto`
 *
 * ┌─ BOUNDED CONTEXT FF-1 (handoff 58 §5) ─────────────────────────────────────────────────┐
 * │ TODO o DIALETO SERPRO (envelope `pedidoDados` com idSistema/idServico, contratante/       │
 * │ autorPedidoDados/contribuinte, resposta com `dados` string-JSON) vive NESTE arquivo. O    │
 * │ resto do app consome SÓ os contratos brutos (MensagemBruta/SituacaoFiscalBruta/…) — nunca │
 * │ o JSON cru do SERPRO. Os tradutores `serproPara*` são a única fronteira.                  │
 * └────────────────────────────────────────────────────────────────────────────────────────┘
 *
 * ┌─ MODO FIXTURE × MODO REAL (gate do founder — handoff 58 §2) ────────────────────────────┐
 * │ Auth e-CNPJ→JWT é modelada pela interface `TokenProvider`. Sem credencial, `FixtureToken` │
 * │ devolve um token SINTÉTICO e o adapter roda em MODO FIXTURE (traduz as fixtures locais,   │
 * │ ZERO rede). Com credencial, `SerproOAuthTokenProvider` faz OAuth2 client_credentials +    │
 * │ jwt_token do procurador (AUTENTICAPROCURADOR) e o transporte `fetch` é acionado.          │
 * │                                                                                          │
 * │ ENV que ligam o MODO REAL (sem QUALQUER um → modo fixture):                              │
 * │   • SERPRO_CONSUMER_KEY     — consumer key da app SERPRO (OAuth2).                        │
 * │   • SERPRO_CONSUMER_SECRET  — consumer secret da app SERPRO (OAuth2).                     │
 * │   • SERPRO_BASE_URL         — base da API (ex.: https://gateway.apiserpro.serpro.gov.br). │
 * │   • SERPRO_CONTRATANTE      — (opcional) CNPJ do contratante SERPRO.                      │
 * │   • SERPRO_AUTOR            — (opcional) CNPJ do escritório/procurador (autorPedidoDados). │
 * │                                                                                          │
 * │ 🔴 GATE DO FOUNDER: contrato SERPRO + e-CNPJ + procurações homologadas (handoff 58 §2).  │
 * │ Enquanto não houver, SÓ o modo fixture roda — nada de consulta real ao Fisco. Os testes  │
 * │ rodam SEM env → modo fixture → NUNCA batem na rede.                                       │
 * └────────────────────────────────────────────────────────────────────────────────────────┘
 *
 * G6 (handoff 58 §5): os textos traduzidos (assunto/pendência) descrevem INDÍCIOS extraídos do
 * portal; o adapter não afirma "regularizado". A ação (responder, renovar, parcelar) é do contador.
 */
import type {
  EventoAtualizacaoBruto,
  MensagemBruta,
  SituacaoFiscalBruta,
} from "../saude-fiscal-provider";
import {
  CARTEIRA_FIXTURE,
  getFixtureCaixaPostalRaw,
  getFixtureEventosRaw,
  getFixtureSitfisRaw,
} from "./integra-contador-fixtures.ts";

// ===========================================================================
// Dialeto SERPRO — wire types (bounded context FF-1: NADA disto vaza pro app)
// ===========================================================================

/** Tipo de inscrição no envelope SERPRO: 1 = CPF (PF), 2 = CNPJ (PJ). */
export type SerproTipoInscricao = 1 | 2;

/** Operações do Integra Contador (caminho da URL: /integra-contador/v1/{operacao}). */
export type SerproOperacao = "Consultar" | "Emitir" | "Apoiar" | "Monitorar";

/** Identificação (contratante / autorPedidoDados / contribuinte) no envelope. */
export interface SerproIdentificacao {
  numero: string;
  tipo: SerproTipoInscricao;
}

/** Bloco `pedidoDados` do envelope Integra Contador. */
export interface SerproPedidoDados {
  idSistema: string;
  idServico: string;
  versaoSistema: string;
  /** Parâmetros do serviço, serializados como string JSON (dialeto SERPRO). */
  dados: string;
}

/** Envelope de REQUISIÇÃO Integra Contador. */
export interface SerproEnvelope {
  contratante: SerproIdentificacao;
  autorPedidoDados: SerproIdentificacao;
  contribuinte: SerproIdentificacao;
  pedidoDados: SerproPedidoDados;
}

/** Envelope de RESPOSTA Integra Contador (`dados` é string JSON a ser parseada). */
export interface SerproResposta {
  status: string;
  responseId?: string;
  dados: string;
  mensagens?: Array<{ codigo: string; texto: string }>;
}

/** Uma mensagem crua da caixa postal (CAIXAPOSTAL · `MSGCONTRIBUINTE81`). */
export interface SerproMensagemCaixa {
  /** ISN — identificador da mensagem no e-CAC. */
  isn: string;
  assunto: string;
  /** Órgão de origem (ex.: "Receita Federal do Brasil"). */
  origem: string;
  /** Data de envio (ISO). */
  dataEnvio: string;
  /** Indicador de leitura ("S"/"N"). */
  indicadorLida: "S" | "N";
  /** Marca "!" da Receita — comunicado oficial relevante ("S"/"N"). */
  indicadorRelevancia: "S" | "N";
  /** Categoria, quando o metadado a traz (ex.: "INTIMACAO", "EXIGENCIA", "COMUNICADO", "RECIBO"). */
  categoria?: string;
  /** Data-limite de resposta, quando a intimação a traz. Ausente = sem prazo cravado (não inferir). */
  dataLimiteResposta?: string;
}

/** Uma pendência crua do relatório SITFIS. */
export interface SerproSitfisPendencia {
  codigo: string;
  tipo: string;
  descricao: string;
}

/** Payload cru de SITFIS (`RELATORIOSITUACAOFISCAL92`). */
export interface SerproSitfis {
  /** Número de inscrição (CNPJ do contribuinte). */
  ni: string;
  protocolo: string;
  /** Data/hora da consulta (ISO). */
  dataHora: string;
  pendencias: SerproSitfisPendencia[];
}

/** Evento cru de EVENTOSATUALIZACAO (`OBTEREVENTOSPJ134`). */
export interface SerproEvento {
  ni: string;
  /** Tipo do evento (ex.: "CAIXAPOSTAL", "SITFIS"). */
  evento: string;
  dataHora: string;
}

/** idSistema do catálogo Integra Contador (SERPRO) usados aqui. */
export const SERPRO_ID_SISTEMA = {
  caixaPostal: "CAIXAPOSTAL",
  sitfis: "SITFIS",
  eventos: "EVENTOSATUALIZACAO",
} as const;

/**
 * idServico do catálogo Integra Contador (SERPRO) usados aqui. Conforme o catálogo público;
 * o pacote exato de serviços fica sujeito ao contrato SERPRO (gate do founder — handoff 58 §2).
 */
export const SERPRO_ID_SERVICO = {
  listarMensagens: "MSGCONTRIBUINTE81",
  solicitarSitfis: "SOLICITARPROTOCOLO91",
  relatorioSitfis: "RELATORIOSITUACAOFISCAL92",
  obterEventosPJ: "OBTEREVENTOSPJ134",
} as const;

// ===========================================================================
// Auth e-CNPJ → JWT (TokenProvider) — gate do founder
// ===========================================================================

/** Par de tokens do Integra Contador: OAuth2 (access) + jwt do procurador (e-CNPJ). */
export interface SerproToken {
  accessToken: string;
  jwtToken: string;
}

/** Contrato de obtenção de token (real = OAuth+procurador; fixture = sintético). */
export interface TokenProvider {
  getToken(): Promise<SerproToken>;
}

/** Impl de FIXTURE — devolve token sintético. Nada de rede; nada de credencial. */
export class FixtureTokenProvider implements TokenProvider {
  async getToken(): Promise<SerproToken> {
    return { accessToken: "fixture-access-token", jwtToken: "fixture-jwt-token" };
  }
}

/**
 * Impl REAL (gate do founder) — OAuth2 client_credentials para o access_token + jwt_token do
 * procurador (AUTENTICAPROCURADOR, derivado do certificado e-CNPJ). NUNCA roda nos testes
 * (só é instanciada em modo real, quando há credencial). Mantida como esqueleto tipado.
 */
export class SerproOAuthTokenProvider implements TokenProvider {
  consumerKey: string;
  consumerSecret: string;
  baseUrl: string;

  constructor(consumerKey: string, consumerSecret: string, baseUrl: string) {
    this.consumerKey = consumerKey;
    this.consumerSecret = consumerSecret;
    this.baseUrl = baseUrl;
  }

  async getToken(): Promise<SerproToken> {
    const basic = Buffer.from(`${this.consumerKey}:${this.consumerSecret}`).toString("base64");
    const res = await fetch(`${this.baseUrl}/token`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${basic}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });
    if (!res.ok) {
      throw new Error(`SERPRO OAuth HTTP ${res.status}`);
    }
    const json = (await res.json()) as { access_token?: string; jwt_token?: string };
    // O jwt_token do procurador vem do fluxo AUTENTICAPROCURADOR (cert e-CNPJ) — gate do founder.
    return { accessToken: json.access_token ?? "", jwtToken: json.jwt_token ?? "" };
  }
}

// ===========================================================================
// Transporte (fetch-based) — só é acionado em MODO REAL
// ===========================================================================

/** True quando falta QUALQUER credencial SERPRO → modo fixture (sem rede). */
export function isSerproFixtureMode(env: Record<string, string | undefined> = process.env): boolean {
  return !env.SERPRO_CONSUMER_KEY || !env.SERPRO_CONSUMER_SECRET || !env.SERPRO_BASE_URL;
}

/**
 * POST no Integra Contador (só em modo real). Testes rodam em modo fixture e NUNCA chegam aqui.
 * Exportado para reuso pelo adapter de guias (S7) — mesmo transporte/envelope SERPRO.
 */
export async function postIntegra(
  operacao: SerproOperacao,
  envelope: SerproEnvelope,
  ctx: { baseUrl: string; token: SerproToken },
): Promise<SerproResposta> {
  const res = await fetch(`${ctx.baseUrl}/integra-contador/v1/${operacao}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${ctx.token.accessToken}`,
      jwt_token: ctx.token.jwtToken,
    },
    body: JSON.stringify(envelope),
  });
  if (!res.ok) {
    throw new Error(`Integra Contador ${operacao} HTTP ${res.status}`);
  }
  return (await res.json()) as SerproResposta;
}

// ===========================================================================
// Tradutores dialeto SERPRO → contrato bruto (a fronteira FF-1)
// ===========================================================================

/** Registro documento(CNPJ) → identidade de cliente da carteira (resolve o `ni` cru do SERPRO). */
export type CarteiraRef = Record<string, { clienteId: string; clienteNome: string }>;

function resolverCliente(ni: string, registro: CarteiraRef): { clienteId: string; clienteNome: string } {
  return registro[ni] ?? { clienteId: ni, clienteNome: ni };
}

/** Traduz uma mensagem crua da caixa postal (SERPRO) → `MensagemBruta` (contrato do app). */
export function serproParaMensagemBruta(
  m: SerproMensagemCaixa,
  ni: string,
  registro: CarteiraRef,
): MensagemBruta {
  const { clienteId, clienteNome } = resolverCliente(ni, registro);
  const categoria = (m.categoria ?? "").toUpperCase();
  const intimacao = categoria === "INTIMACAO" || categoria === "EXIGENCIA";
  return {
    id: `msg-${m.isn}`,
    clienteId,
    clienteNome,
    assunto: m.assunto,
    remetente: m.origem,
    recebidaEmIso: m.dataEnvio,
    lida: m.indicadorLida === "S",
    marcaReceita: m.indicadorRelevancia === "S",
    intimacao,
    // A API só entrega prazo quando o metadado da intimação o traz; senão null (não inventar).
    prazoLimiteIso: m.dataLimiteResposta ?? null,
  };
}

/** Traduz o relatório SITFIS cru (SERPRO) → `SituacaoFiscalBruta` (contrato do app). */
export function serproParaSituacaoFiscalBruta(s: SerproSitfis, registro: CarteiraRef): SituacaoFiscalBruta {
  const { clienteId, clienteNome } = resolverCliente(s.ni, registro);
  return {
    clienteId,
    clienteNome,
    documento: s.ni,
    consultadoEmIso: s.dataHora,
    protocolo: s.protocolo,
    pendencias: s.pendencias.map((p) => ({ codigo: p.codigo, tipo: p.tipo, descricao: p.descricao })),
  };
}

/** Traduz um evento cru de atualização (SERPRO) → `EventoAtualizacaoBruto` (contrato do app). */
export function serproParaEventoBruto(e: SerproEvento, registro: CarteiraRef): EventoAtualizacaoBruto {
  const { clienteId } = resolverCliente(e.ni, registro);
  return {
    clienteId,
    documento: e.ni,
    tipo: e.evento,
    ocorridoEmIso: e.dataHora,
  };
}

// ===========================================================================
// Adapter
// ===========================================================================

export interface IntegraContadorConfig {
  baseUrl?: string;
  consumerKey?: string;
  consumerSecret?: string;
  /** CNPJ do contratante SERPRO (envelope). */
  contratanteCnpj?: string;
  /** CNPJ do escritório/procurador (autorPedidoDados). */
  autorCnpj?: string;
  /** Registro documento→cliente da carteira (modo real). Em fixture usa a carteira demo. */
  carteira?: CarteiraRef;
  /** CNPJs a consultar em modo real (vêm das procurações homologadas — gate do founder). */
  contribuintes?: string[];
  /** Injeção de TokenProvider (testes/DI). Default: fixture ou OAuth conforme env. */
  tokenProvider?: TokenProvider;
}

/**
 * Adapter do Integra Contador. Em MODO FIXTURE (default sem credencial) traduz as fixtures
 * locais; em MODO REAL (gate do founder) monta o envelope e chama o transporte `fetch`.
 */
export class IntegraContadorAdapter {
  baseUrl: string | undefined;
  consumerKey: string | undefined;
  consumerSecret: string | undefined;
  contratanteCnpj: string;
  autorCnpj: string;
  carteira: CarteiraRef;
  contribuintes: string[];
  tokenProvider: TokenProvider;

  constructor(config: IntegraContadorConfig = {}) {
    this.baseUrl = config.baseUrl ?? process.env.SERPRO_BASE_URL;
    this.consumerKey = config.consumerKey ?? process.env.SERPRO_CONSUMER_KEY;
    this.consumerSecret = config.consumerSecret ?? process.env.SERPRO_CONSUMER_SECRET;
    this.contratanteCnpj = config.contratanteCnpj ?? process.env.SERPRO_CONTRATANTE ?? "00000000000000";
    this.autorCnpj = config.autorCnpj ?? process.env.SERPRO_AUTOR ?? "00000000000000";
    this.carteira = config.carteira ?? CARTEIRA_FIXTURE;
    this.contribuintes = config.contribuintes ?? [];
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

  /** Modo fixture quando falta credencial. Testes sempre caem aqui (sem env). */
  isFixtureMode(): boolean {
    return !this.baseUrl || !this.consumerKey || !this.consumerSecret;
  }

  private identificacao(numero: string): SerproIdentificacao {
    return { numero, tipo: 2 };
  }

  private async ctxReal(): Promise<{ baseUrl: string; token: SerproToken }> {
    const token = await this.tokenProvider.getToken();
    return { baseUrl: this.baseUrl as string, token };
  }

  /** CAIXAPOSTAL → mensagens brutas da carteira (traduzidas). */
  async listarMensagens(_escritorioId: string, refIso: string): Promise<MensagemBruta[]> {
    if (this.isFixtureMode()) {
      return getFixtureCaixaPostalRaw(refIso).flatMap(({ ni, mensagens }) =>
        mensagens.map((m) => serproParaMensagemBruta(m, ni, this.carteira)),
      );
    }
    // MODO REAL (gate do founder) — nunca executa nos testes.
    const ctx = await this.ctxReal();
    const out: MensagemBruta[] = [];
    for (const ni of this.contribuintes) {
      const envelope: SerproEnvelope = {
        contratante: this.identificacao(this.contratanteCnpj),
        autorPedidoDados: this.identificacao(this.autorCnpj),
        contribuinte: this.identificacao(ni),
        pedidoDados: {
          idSistema: SERPRO_ID_SISTEMA.caixaPostal,
          idServico: SERPRO_ID_SERVICO.listarMensagens,
          versaoSistema: "1.0",
          dados: "{}",
        },
      };
      const resp = await postIntegra("Consultar", envelope, ctx);
      const cruas = JSON.parse(resp.dados) as { mensagens?: SerproMensagemCaixa[] };
      for (const m of cruas.mensagens ?? []) {
        out.push(serproParaMensagemBruta(m, ni, this.carteira));
      }
    }
    return out;
  }

  /** SITFIS → situações fiscais brutas da carteira (traduzidas). */
  async obterSituacaoFiscal(_escritorioId: string, refIso: string): Promise<SituacaoFiscalBruta[]> {
    if (this.isFixtureMode()) {
      return getFixtureSitfisRaw(refIso).map((s) => serproParaSituacaoFiscalBruta(s, this.carteira));
    }
    // MODO REAL (gate do founder) — SITFIS é assíncrono (solicita protocolo → baixa relatório).
    const ctx = await this.ctxReal();
    const out: SituacaoFiscalBruta[] = [];
    for (const ni of this.contribuintes) {
      const envelope: SerproEnvelope = {
        contratante: this.identificacao(this.contratanteCnpj),
        autorPedidoDados: this.identificacao(this.autorCnpj),
        contribuinte: this.identificacao(ni),
        pedidoDados: {
          idSistema: SERPRO_ID_SISTEMA.sitfis,
          idServico: SERPRO_ID_SERVICO.relatorioSitfis,
          versaoSistema: "1.0",
          dados: "{}",
        },
      };
      const resp = await postIntegra("Apoiar", envelope, ctx);
      const cru = JSON.parse(resp.dados) as SerproSitfis;
      out.push(serproParaSituacaoFiscalBruta(cru, this.carteira));
    }
    return out;
  }

  /** EVENTOSATUALIZACAO → eventos brutos (mudanças desde a última varredura). */
  async detectarEventos(_escritorioId: string, refIso: string): Promise<EventoAtualizacaoBruto[]> {
    if (this.isFixtureMode()) {
      return getFixtureEventosRaw(refIso).map((e) => serproParaEventoBruto(e, this.carteira));
    }
    // MODO REAL (gate do founder) — nunca executa nos testes.
    const ctx = await this.ctxReal();
    const out: EventoAtualizacaoBruto[] = [];
    for (const ni of this.contribuintes) {
      const envelope: SerproEnvelope = {
        contratante: this.identificacao(this.contratanteCnpj),
        autorPedidoDados: this.identificacao(this.autorCnpj),
        contribuinte: this.identificacao(ni),
        pedidoDados: {
          idSistema: SERPRO_ID_SISTEMA.eventos,
          idServico: SERPRO_ID_SERVICO.obterEventosPJ,
          versaoSistema: "1.0",
          dados: "{}",
        },
      };
      const resp = await postIntegra("Monitorar", envelope, ctx);
      const cruas = JSON.parse(resp.dados) as { eventos?: SerproEvento[] };
      for (const e of cruas.eventos ?? []) {
        out.push(serproParaEventoBruto(e, this.carteira));
      }
    }
    return out;
  }
}
