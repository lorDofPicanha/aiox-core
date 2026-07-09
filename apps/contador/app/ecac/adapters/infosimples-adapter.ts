/**
 * S4 — Adapter Infosimples (CNDs) [adapter, fixture-mode].
 *
 * Conector das CERTIDÕES que a Integra Contador NÃO expõe (handoff 58 §3): CND federal-conjunta
 * (RFB/PGFN), estadual (SEFAZ/ICMS), municipal (ISS), trabalhista (CNDT/TST) e CRF/FGTS (Caixa).
 * Traduz o dialeto Infosimples → `CertidaoBruta` (= CndBruta do model S5).
 *
 * ┌─ BOUNDED CONTEXT FF-1 (handoff 58 §5) ─────────────────────────────────────────────────┐
 * │ TODO o DIALETO Infosimples (request `{ token, cnpj }`, resposta `{ code, data[] }` com a │
 * │ situação como TEXTO — "Negativa" / "Positiva com efeito de negativa" / "Positiva") vive   │
 * │ NESTE arquivo. O app consome SÓ `CertidaoBruta`. `infosimplesParaCertidaoBruta` é a       │
 * │ única fronteira: mapeia o texto da certidão → SituacaoCertidao e a validade → ISO.        │
 * └────────────────────────────────────────────────────────────────────────────────────────┘
 *
 * ┌─ MODO FIXTURE × MODO REAL (gate do founder — handoff 58 §2) ────────────────────────────┐
 * │ ENV que liga o MODO REAL (sem ele → modo fixture, ZERO rede):                            │
 * │   • INFOSIMPLES_TOKEN     — token da conta Infosimples pré-paga.                          │
 * │   • INFOSIMPLES_BASE_URL  — (opcional) base da API (default: https://api.infosimples.com).│
 * │ 🔴 GATE DO FOUNDER: conta Infosimples pré-paga (franquia mín. ~R$100/mês) + procurações.  │
 * │ Testes rodam SEM token → modo fixture → NUNCA batem na rede.                              │
 * └────────────────────────────────────────────────────────────────────────────────────────┘
 *
 * G6: a certidão traduzida descreve a situação EXTRAÍDA do portal (indício); não emite certidão
 * real nem afirma "regularizado". A validação/emissão real é ato do contador (human-in-loop).
 */
import type { CertidaoBruta } from "../saude-fiscal-provider";
import type { EsferaCnd } from "../saude-fiscal-model";
import type { SituacaoCertidao } from "../ecac-model";
import {
  CARTEIRA_INFOSIMPLES,
  getFixtureCndsRaw,
} from "./infosimples-fixtures.ts";

// ===========================================================================
// Dialeto Infosimples — wire types (bounded context FF-1)
// ===========================================================================

/** Corpo de requisição Infosimples (POST /api/v2/consultas/{provider}/{consulta}). */
export interface InfosimplesRequest {
  token: string;
  cnpj?: string;
  /** Parâmetros adicionais por consulta (ex.: uf, codigo_municipio). */
  [param: string]: unknown;
}

/** Um item de `data[]` de uma consulta de certidão Infosimples. */
export interface InfosimplesCertidaoData {
  /** Texto da situação: "Negativa" | "Positiva com efeito de negativa" | "Positiva" | "Vencida". */
  situacao: string;
  tipo_certidao?: string;
  /** Validade em "dd/mm/aaaa" (formato comum do portal). */
  validade?: string;
  /** Validade já normalizada em ISO, quando o endpoint a traz. */
  normalizado_validade_data?: string;
  codigo_controle?: string;
  data_emissao?: string;
}

/** Envelope de resposta Infosimples (code 200 = sucesso). */
export interface InfosimplesResposta {
  code: number;
  code_message: string;
  data: InfosimplesCertidaoData[];
  errors?: string[];
  site_receipts?: string[];
}

/** Consultas Infosimples por esfera (slug do provider/consulta — docs Infosimples). */
export const INFOSIMPLES_CONSULTA: Record<EsferaCnd, string> = {
  federal: "receita-federal-pgfn",
  estadual: "sefaz-certidao-debitos",
  municipal: "prefeitura-certidao-debitos",
  trabalhista: "tst-cndt",
  fgts: "caixa-regularidade",
};

// ===========================================================================
// Tradutor dialeto Infosimples → CertidaoBruta (a fronteira FF-1)
// ===========================================================================

/**
 * Mapeia o TEXTO da situação da certidão → SituacaoCertidao (vocabulário do e-CAC).
 *  - "positiva com efeito de negativa" (CPEN) → "pendente" (checado ANTES de "negativa").
 *  - "negativa" (CND limpa)                    → "regular".
 *  - "positiva" / "vencida" / demais           → "vencida".
 */
export function mapearSituacaoInfosimples(texto: string): SituacaoCertidao {
  const t = texto.trim().toLowerCase();
  if (t.includes("efeito de negativa")) return "pendente";
  if (t.startsWith("negativa") || t === "regular" || t.includes("nada consta")) return "regular";
  return "vencida";
}

/** Converte "dd/mm/aaaa" → ISO (meia-noite UTC do dia). Retorna null se ilegível. */
function validadeParaIso(validade: string): string | null {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(validade.trim());
  if (!m) return null;
  const dd = Number(m[1]);
  const mm = Number(m[2]);
  const yyyy = Number(m[3]);
  const t = Date.UTC(yyyy, mm - 1, dd);
  if (Number.isNaN(t)) return null;
  return new Date(t).toISOString();
}

/** Contexto de tradução: cliente + esfera + id estável da CND. */
export interface TraducaoCndCtx {
  id: string;
  clienteId: string;
  clienteNome: string;
  documento: string;
  esfera: EsferaCnd;
}

/** Traduz um item de certidão Infosimples → `CertidaoBruta` (contrato do model S5). */
export function infosimplesParaCertidaoBruta(
  data: InfosimplesCertidaoData,
  ctx: TraducaoCndCtx,
): CertidaoBruta {
  const situacao = mapearSituacaoInfosimples(data.situacao);
  let validadeIso: string | null = null;
  if (data.normalizado_validade_data) {
    const t = new Date(data.normalizado_validade_data).getTime();
    validadeIso = Number.isNaN(t) ? null : data.normalizado_validade_data;
  } else if (data.validade) {
    validadeIso = validadeParaIso(data.validade);
  }
  return {
    id: ctx.id,
    clienteId: ctx.clienteId,
    clienteNome: ctx.clienteNome,
    documento: ctx.documento,
    esfera: ctx.esfera,
    situacao,
    validadeIso,
  };
}

// ===========================================================================
// Adapter
// ===========================================================================

/** True quando falta o token Infosimples → modo fixture (sem rede). */
export function isInfosimplesFixtureMode(env: Record<string, string | undefined> = process.env): boolean {
  return !env.INFOSIMPLES_TOKEN;
}

export interface InfosimplesConfig {
  token?: string;
  baseUrl?: string;
  /** Registro documento→cliente da carteira (modo real). Em fixture usa a carteira demo. */
  carteira?: Record<string, { clienteId: string; clienteNome: string }>;
  /** CNPJs a consultar em modo real (das procurações — gate do founder). */
  contribuintes?: string[];
  /** Esferas a consultar por cliente (modo real). Default: todas. */
  esferas?: EsferaCnd[];
}

const TODAS_ESFERAS: EsferaCnd[] = ["federal", "estadual", "municipal", "trabalhista", "fgts"];

/**
 * Adapter Infosimples. Em MODO FIXTURE (default sem token) traduz as fixtures locais (4 casos:
 * válida, a vencer, vencida, com pendência); em MODO REAL (gate do founder) faz POST por
 * cliente × esfera e traduz cada resposta.
 */
export class InfosimplesAdapter {
  token: string | undefined;
  baseUrl: string;
  carteira: Record<string, { clienteId: string; clienteNome: string }>;
  contribuintes: string[];
  esferas: EsferaCnd[];

  constructor(config: InfosimplesConfig = {}) {
    this.token = config.token ?? process.env.INFOSIMPLES_TOKEN;
    this.baseUrl = config.baseUrl ?? process.env.INFOSIMPLES_BASE_URL ?? "https://api.infosimples.com";
    this.carteira = config.carteira ?? CARTEIRA_INFOSIMPLES;
    this.contribuintes = config.contribuintes ?? [];
    this.esferas = config.esferas ?? TODAS_ESFERAS;
  }

  isFixtureMode(): boolean {
    return !this.token;
  }

  /** Consulta as CNDs da carteira (todas as esferas), traduzidas para `CertidaoBruta`. */
  async listarCnds(_escritorioId: string, refIso: string): Promise<CertidaoBruta[]> {
    if (this.isFixtureMode()) {
      return getFixtureCndsRaw(refIso).map(({ data, ctx }) => infosimplesParaCertidaoBruta(data, ctx));
    }
    // MODO REAL (gate do founder) — nunca executa nos testes.
    const out: CertidaoBruta[] = [];
    for (const ni of this.contribuintes) {
      const ref = this.carteira[ni] ?? { clienteId: ni, clienteNome: ni };
      for (const esfera of this.esferas) {
        const resp = await this.consultar(esfera, ni);
        const data = resp.data[0];
        if (!data) continue;
        out.push(
          infosimplesParaCertidaoBruta(data, {
            id: `cnd-${ref.clienteId}-${esfera}`,
            clienteId: ref.clienteId,
            clienteNome: ref.clienteNome,
            documento: ni,
            esfera,
          }),
        );
      }
    }
    return out;
  }

  /** POST em uma consulta Infosimples (só em modo real). */
  private async consultar(esfera: EsferaCnd, cnpj: string): Promise<InfosimplesResposta> {
    const consulta = INFOSIMPLES_CONSULTA[esfera];
    const body: InfosimplesRequest = { token: this.token as string, cnpj };
    const res = await fetch(`${this.baseUrl}/api/v2/consultas/${consulta}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      throw new Error(`Infosimples ${consulta} HTTP ${res.status}`);
    }
    return (await res.json()) as InfosimplesResposta;
  }
}
