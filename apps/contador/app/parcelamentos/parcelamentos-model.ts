/**
 * Read model do módulo PARCELAMENTOS — alerta de rescisão iminente (whitespace #1).
 *
 * Auto-contido em app/parcelamentos/ DE PROPÓSITO: não toca lib/api.ts, lib/ compartilhado,
 * packages/* nem componentes — apenas lê os componentes globais (Card/Table/StatusBadge/
 * TopBar) e os tokens do globals.css. Os dados são SINTÉTICOS (parcelamentos-data.ts).
 *
 * O diferencial (doc 55 §F.1, §D conclusão 2): nenhum concorrente alerta proativamente
 * "este parcelamento vai cair". Modelamos a regra de rescisão como um relógio preclusivo:
 *   - Simples Nacional (PARCSN/PARCMEI): rescindido com 3 parcelas em atraso (consecutivas
 *     OU não) — doc 55 §A. Com 1-2 em atraso = atenção; com ≥3 = rescisão indicada.
 *   - Janela de salvamento: parcela paga com até ~30 dias de atraso NÃO conta como
 *     descumprimento (doc 55 §A) → existe uma janela que um alerta proativo pode aproveitar.
 *   - PGFN/estadual: regra de rescisão fragmentada e sem API → marcamos como
 *     "monitoramento manual" (doc 55 §A, §E linha 5). NÃO inferimos rescisão automática.
 *
 * Lógica PURA e testável: sem efeitos colaterais, sem Date.now() embutido (a data de
 * referência entra por parâmetro para manter o Server Component reproduzível).
 *
 * G6 (CONTEXT §5 #4; doc 45 §5): a plataforma SINALIZA indício de risco; a ação
 * (regularizar) é DECISÃO DO CONTADOR. NUNCA "evita cancelamento", "garante o desconto",
 * "salva o parcelamento". SEMPRE "indício de risco de rescisão", "sugerimos revisar".
 */
import type { StatusView } from "@/lib/status";

/** Limite de parcelas em atraso que indica rescisão no Simples Nacional (doc 55 §A). */
export const LIMITE_RESCISAO_SN = 3;

/** Janela de salvamento (dias): parcela paga com até ~30d de atraso não descumpre (doc 55 §A). */
export const JANELA_SALVAMENTO_DIAS = 30;

/**
 * Esfera/origem do parcelamento. Só o Simples Nacional (federal SN/MEI) tem regra de
 * rescisão modelável aqui (3 parcelas) e API SERPRO de consulta. PGFN e estadual ficam
 * em "monitoramento manual" — sem inferência automática de rescisão (doc 55 §A, §E).
 */
export type EsferaParcelamento = "federal_sn" | "federal_mei" | "pgfn" | "estadual";

export interface EsferaView {
  esfera: EsferaParcelamento;
  rotulo: string;
  /** true = tem regra de rescisão modelável (Simples Nacional federal SN/MEI). */
  regraModelavel: boolean;
  /** Nota honesta sobre cobertura (ex.: "monitoramento manual — sem API"). */
  nota: string;
}

export const ESFERA: Record<EsferaParcelamento, EsferaView> = {
  federal_sn: {
    esfera: "federal_sn",
    rotulo: "Federal · Simples Nacional",
    regraModelavel: true,
    nota: "Regra de rescisão por 3 parcelas em atraso (consecutivas ou não).",
  },
  federal_mei: {
    esfera: "federal_mei",
    rotulo: "Federal · MEI",
    regraModelavel: true,
    nota: "Mesma regra de rescisão do Simples Nacional (3 parcelas em atraso).",
  },
  pgfn: {
    esfera: "pgfn",
    rotulo: "PGFN · dívida ativa",
    regraModelavel: false,
    nota: "Monitoramento manual — sem API pública de acompanhamento; regra própria.",
  },
  estadual: {
    esfera: "estadual",
    rotulo: "Estadual · SEFAZ",
    regraModelavel: false,
    nota: "Monitoramento manual — fragmentado por SEFAZ; regra e portal próprios.",
  },
};

/**
 * Nível de risco de rescisão (semáforo). SEMPRE redundante (cor + glyph + label —
 * DESIGN §3). Nenhuma label promete resultado: descrevem o INDÍCIO de risco, não que
 * a rescisão vá ou não acontecer.
 */
export type NivelRisco = "ok" | "atencao" | "iminente" | "rescindido" | "manual";

export interface NivelRiscoView extends StatusView {
  nivel: NivelRisco;
  /** Frase curta e G6-safe (o "onde estamos" do parcelamento). */
  hint: string;
}

export const NIVEL_RISCO: Record<NivelRisco, NivelRiscoView> = {
  ok: {
    nivel: "ok",
    variant: "success",
    glyph: "✓",
    label: "Em dia",
    hint: "Sem parcelas em atraso. Sem indício de risco de rescisão no momento.",
  },
  atencao: {
    nivel: "atencao",
    variant: "warning",
    glyph: "●",
    label: "Atenção",
    hint: "Há parcela(s) em atraso. Ainda não atinge o limite de rescisão — sugerimos revisar.",
  },
  iminente: {
    nivel: "iminente",
    variant: "danger",
    glyph: "▼",
    label: "Risco de rescisão iminente",
    hint: "Falta pouco para atingir o limite de rescisão. Sugerimos revisar com o cliente.",
  },
  rescindido: {
    nivel: "rescindido",
    variant: "danger",
    glyph: "✕",
    label: "Indício de rescisão (limite atingido)",
    hint: "O nº de parcelas em atraso atingiu o limite indicado para rescisão. Conferir situação no Fisco.",
  },
  manual: {
    nivel: "manual",
    variant: "neutral",
    glyph: "◇",
    label: "Monitoramento manual",
    hint: "Esfera sem regra de rescisão modelável aqui (PGFN/estadual). Acompanhar manualmente.",
  },
};

/** Situação operacional de uma parcela individual (drill-down). */
export type SituacaoParcela = "paga" | "a_vencer" | "atrasada" | "em_janela";

export interface SituacaoParcelaView extends StatusView {
  situacao: SituacaoParcela;
}

export const SITUACAO_PARCELA: Record<SituacaoParcela, SituacaoParcelaView> = {
  paga: { situacao: "paga", variant: "success", glyph: "✓", label: "Paga" },
  a_vencer: { situacao: "a_vencer", variant: "neutral", glyph: "◷", label: "A vencer" },
  em_janela: {
    situacao: "em_janela",
    variant: "warning",
    glyph: "⧗",
    label: "Atrasada (dentro da janela)",
  },
  atrasada: { situacao: "atrasada", variant: "danger", glyph: "●", label: "Em atraso" },
};

/** Uma parcela do parcelamento (histórico do drill-down). Dados SINTÉTICOS. */
export interface Parcela {
  /** Nº sequencial da parcela (1..total). */
  numero: number;
  /** Vencimento ISO (data sintética). */
  vencimentoIso: string;
  /** Valor da parcela (R$). */
  valor: number;
  /** Situação base do seed: paga | a_vencer | atrasada. "em_janela" é DERIVADO. */
  situacao: Exclude<SituacaoParcela, "em_janela">;
  /** ISO do pagamento, quando paga (sintético). null se não paga. */
  pagaEmIso?: string | null;
}

/** Parcelamento de um cliente (entrada do seed — antes de classificar o risco). */
export interface ParcelamentoSeed {
  /** ID estável do parcelamento (sintético). */
  id: string;
  clienteId: string;
  clienteNome: string;
  segmento: string;
  esfera: EsferaParcelamento;
  /** Programa (ex.: "PARCSN", "PERT-SN", "Dívida ativa"). */
  programa: string;
  /** Total de parcelas contratadas. */
  totalParcelas: number;
  /** Valor de cada parcela (R$). */
  valorParcela: number;
  /** Próximo vencimento ISO (sintético). */
  proximoVencimentoIso: string;
  /**
   * Desconto EM RISCO se o parcelamento for rescindido (R$). Ilustrativo: descontos do
   * programa especial (PERT/RELP) que se perdem na rescisão (doc 55 §A). Para o ordinário,
   * sem desconto, costuma ser 0.
   */
  descontoEmRisco: number;
  /** Histórico de parcelas (drill-down). */
  parcelas: Parcela[];
}

/** Resultado da classificação de risco de um parcelamento (puro). */
export interface RiscoRescisao {
  nivel: NivelRiscoView;
  /** Nº de parcelas em atraso (conta atraso + janela; doc 55: pagamento parcial = atraso). */
  parcelasEmAtraso: number;
  /**
   * Parcelas que ainda faltam até atingir o limite de rescisão. null quando a esfera não
   * é modelável (PGFN/estadual) ou quando o limite já foi atingido.
   */
  parcelasAteRescisao: number | null;
  /**
   * Parcelas em atraso que ainda estão DENTRO da janela de salvamento (≤30d de atraso) —
   * onde uma regularização ainda evitaria a contagem (doc 55 §A). NÃO é promessa.
   */
  parcelasNaJanela: number;
}

/** Diferença em dias corridos (b - a), truncada. Determinístico. */
function diffDias(aIso: string, bIso: string): number {
  const a = new Date(aIso).getTime();
  const b = new Date(bIso).getTime();
  return Math.floor((b - a) / (1000 * 60 * 60 * 24));
}

/**
 * Deriva a situação EFETIVA de uma parcela na data de referência: uma parcela marcada
 * como "atrasada" cujo vencimento está dentro da janela de salvamento (≤30d) é
 * reclassificada como "em_janela" (ainda há tempo de regularizar — doc 55 §A).
 * Pura: não muta a parcela.
 */
export function situacaoEfetiva(parcela: Parcela, refIso: string): SituacaoParcela {
  if (parcela.situacao !== "atrasada") return parcela.situacao;
  const diasAtraso = diffDias(parcela.vencimentoIso, refIso);
  return diasAtraso <= JANELA_SALVAMENTO_DIAS ? "em_janela" : "atrasada";
}

/**
 * Classifica o risco de rescisão de um parcelamento (PURO). Regra modelada só para o
 * Simples Nacional federal (SN/MEI — doc 55 §A): inadimplência (atraso, incluindo a
 * janela, pois pagamento parcial/atrasado conta) soma para o limite de 3 parcelas.
 *
 * - PGFN/estadual (não modelável) → "manual" (sem inferência automática — doc 55 §E).
 * - 0 em atraso → "ok".
 * - atinge o limite (≥3) → "rescindido" (indício; conferir no Fisco).
 * - falta exatamente 1 para o limite → "iminente".
 * - 1..(limite-2) em atraso → "atencao".
 *
 * @param refIso data de referência (passada pela page para reprodutibilidade).
 */
export function classificarRisco(p: ParcelamentoSeed, refIso: string): RiscoRescisao {
  const esfera = ESFERA[p.esfera];

  // Conta parcelas inadimplentes: tudo que está atrasado (inclusive dentro da janela,
  // pois a janela é apenas a oportunidade de salvar — a parcela segue inadimplente até
  // ser paga). doc 55 §A: pagamento parcial/atrasado = inadimplência.
  let parcelasEmAtraso = 0;
  let parcelasNaJanela = 0;
  for (const parcela of p.parcelas) {
    const sit = situacaoEfetiva(parcela, refIso);
    if (sit === "atrasada" || sit === "em_janela") parcelasEmAtraso += 1;
    if (sit === "em_janela") parcelasNaJanela += 1;
  }

  if (!esfera.regraModelavel) {
    return {
      nivel: NIVEL_RISCO.manual,
      parcelasEmAtraso,
      parcelasAteRescisao: null,
      parcelasNaJanela,
    };
  }

  if (parcelasEmAtraso === 0) {
    return {
      nivel: NIVEL_RISCO.ok,
      parcelasEmAtraso,
      parcelasAteRescisao: LIMITE_RESCISAO_SN,
      parcelasNaJanela,
    };
  }

  if (parcelasEmAtraso >= LIMITE_RESCISAO_SN) {
    return {
      nivel: NIVEL_RISCO.rescindido,
      parcelasEmAtraso,
      parcelasAteRescisao: null,
      parcelasNaJanela,
    };
  }

  const faltam = LIMITE_RESCISAO_SN - parcelasEmAtraso;
  return {
    nivel: faltam === 1 ? NIVEL_RISCO.iminente : NIVEL_RISCO.atencao,
    parcelasEmAtraso,
    parcelasAteRescisao: faltam,
    parcelasNaJanela,
  };
}

/** Parcelamento já classificado (o que a UI consome). */
export interface ParcelamentoView extends ParcelamentoSeed {
  risco: RiscoRescisao;
  esferaView: EsferaView;
  /** Parcelas pagas (derivado do histórico). */
  parcelasPagas: number;
  /** Saldo de parcelas a pagar (total - pagas). */
  parcelasRestantes: number;
  /** Valor ainda a pagar (saldo × valor da parcela). Ilustrativo. */
  valorSaldo: number;
}

/** Severidade de ordenação: pior risco primeiro (rescindido > iminente > atenção > manual > ok). */
const PESO_RISCO: Record<NivelRisco, number> = {
  rescindido: 0,
  iminente: 1,
  atencao: 2,
  manual: 3,
  ok: 4,
};

/**
 * Classifica e ordena a carteira de parcelamentos (PURO). Pior risco primeiro — o
 * contador vê de cara quem precisa de atenção. Determinístico a partir de refIso.
 */
export function classificarCarteira(
  seeds: ParcelamentoSeed[],
  refIso: string,
): ParcelamentoView[] {
  return seeds
    .map((p) => {
      const risco = classificarRisco(p, refIso);
      const parcelasPagas = p.parcelas.filter((x) => x.situacao === "paga").length;
      const parcelasRestantes = Math.max(0, p.totalParcelas - parcelasPagas);
      return {
        ...p,
        risco,
        esferaView: ESFERA[p.esfera],
        parcelasPagas,
        parcelasRestantes,
        valorSaldo: parcelasRestantes * p.valorParcela,
      };
    })
    .sort((a, b) => {
      const d = PESO_RISCO[a.risco.nivel.nivel] - PESO_RISCO[b.risco.nivel.nivel];
      if (d !== 0) return d;
      // Empate: maior desconto em risco primeiro (mais a perder).
      return b.descontoEmRisco - a.descontoEmRisco;
    });
}

/** Resumo agregado para os KPIs do topo. */
export interface ResumoParcelamentos {
  /** Parcelamentos ativos (não rescindidos). */
  ativos: number;
  /** Em atenção (1..limite-2 parcelas em atraso, modeláveis). */
  emAtencao: number;
  /** Em risco de rescisão (iminente OU limite atingido). */
  emRisco: number;
  /** Soma do desconto em risco dos parcelamentos em risco de rescisão (R$). Ilustrativo. */
  descontoSobRisco: number;
}

/** Agrega os KPIs do topo (PURO). */
export function resumirCarteira(views: ParcelamentoView[]): ResumoParcelamentos {
  let emAtencao = 0;
  let emRisco = 0;
  let descontoSobRisco = 0;
  let ativos = 0;
  for (const v of views) {
    const nivel = v.risco.nivel.nivel;
    if (nivel !== "rescindido") ativos += 1;
    if (nivel === "atencao") emAtencao += 1;
    if (nivel === "iminente" || nivel === "rescindido") {
      emRisco += 1;
      descontoSobRisco += v.descontoEmRisco;
    }
  }
  return { ativos, emAtencao, emRisco, descontoSobRisco };
}

/** True se o nível indica risco de rescisão (destaque do whitespace na tela). */
export function ehRisco(nivel: NivelRisco): boolean {
  return nivel === "iminente" || nivel === "rescindido";
}
