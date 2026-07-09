/**
 * S6 — Monitor de DÍVIDA ATIVA (PGFN/Regularize) — engine PURO (e-CAC · add-on premium, D9).
 *
 * A Integra Contador NÃO cobre dívida ativa; o monitor real lê o PGFN/Regularize (handoff 58 §3).
 * Esta fatia [build] modela a REGRA PURA sobre a forma bruta `DividaAtivaBruta` (o que um adapter
 * Regularize entregaria): agrega a dívida por cliente e sinaliza o risco de EXCLUSÃO AUTOMÁTICA
 * de parcelamento por inadimplência, com dois cortes de prazo (handoff 58 §4, S6):
 *   - ≤ 7 dias  → CRÍTICO (exclusão automática iminente);
 *   - ≤ 75 dias → AVISO   (janela de regularização ainda aberta).
 *
 * ┌─ FGTS migrou para a PGFN em 01/06/2026 (handoff 58 §3, doc 08) ─────────────────────────┐
 * │ A dívida ativa do FGTS deixou a Caixa/Conectividade Social e passou a ser cobrada pela   │
 * │ PGFN/Regularize. Por isso `natureza: "fgts"` é uma natureza POSSÍVEL da dívida ativa aqui │
 * │ — o mesmo monitor cobre União e FGTS. (O CRF/FGTS "regularidade" segue via Infosimples — │
 * │ S4; aqui é a DÍVIDA ATIVA do FGTS, coisa distinta.)                                       │
 * └────────────────────────────────────────────────────────────────────────────────────────┘
 *
 * Pureza (CONTEXT §5): nenhuma função consulta rede/filesystem nem chama Date.now(). O "hoje"
 * entra SEMPRE por `refIso` — determinístico e testável, igual a saude-fiscal-model.ts.
 *
 * G6 (handoff 58 §5): nada aqui afirma "regularizado"/"quitado"/"sem pendências". A plataforma
 * SINALIZA o indício de risco; negociar/pagar/regularizar é ação do contador (human-in-loop).
 * Linguagem: "indício de risco de exclusão", "consta inscrição", "a confirmar no Regularize".
 */
import type { StatusView } from "@/lib/status";

// ===========================================================================
// Forma bruta (o que um adapter PGFN/Regularize entregaria)
// ===========================================================================

/** Natureza da dívida ativa. `fgts` incluído pela migração Caixa→PGFN de 01/06/2026. */
export type NaturezaDivida = "uniao" | "fgts" | "previdenciaria" | "nao_tributaria";

/** Situação da inscrição em dívida ativa (vocabulário Regularize). */
export type SituacaoDivida = "ativa" | "suspensa" | "parcelada" | "garantida" | "extinta";

/**
 * Parcelamento/negociação VINCULADO a uma inscrição (SISPAR/Regularize). Quando o contribuinte
 * está INADIMPLENTE, corre um prazo para EXCLUSÃO AUTOMÁTICA — é o gatilho do alerta.
 */
export interface ParcelamentoVinculado {
  numero: string;
  /** Programa/negociação (ex.: "Negociação PGFN (SISPAR)", "Parcelamento convencional"). */
  programa: string;
  /** true quando há parcela(s) em atraso — só então corre o prazo de exclusão. */
  inadimplente: boolean;
  /**
   * Data-limite ISO da EXCLUSÃO AUTOMÁTICA por inadimplência, quando o countdown está correndo.
   * null = sem countdown (parcelamento em dia). Vem do adapter Regularize; aqui é dado.
   */
  prazoExclusaoIso: string | null;
}

/** Uma inscrição em dívida ativa (forma bruta) — o que o adapter Regularize entregaria. */
export interface DividaAtivaBruta {
  id: string;
  clienteId: string;
  clienteNome: string;
  documento: string;
  /** Número da inscrição em dívida ativa. */
  inscricao: string;
  natureza: NaturezaDivida;
  situacao: SituacaoDivida;
  /** Valor consolidado da inscrição (R$). */
  valorConsolidado: number;
  /** Data de inscrição em dívida ativa (ISO). */
  dataInscricaoIso: string;
  /** Parcelamento/negociação vinculado, quando houver (null = inscrição sem parcelamento). */
  parcelamentoVinculado: ParcelamentoVinculado | null;
}

// ===========================================================================
// Apresentação (redundante: cor + glyph + label — DESIGN §3)
// ===========================================================================

export const NATUREZA_DIVIDA: Record<NaturezaDivida, { natureza: NaturezaDivida; rotulo: string; orgao: string }> = {
  uniao: { natureza: "uniao", rotulo: "Dívida ativa da União", orgao: "PGFN / Regularize" },
  fgts: { natureza: "fgts", rotulo: "Dívida ativa do FGTS", orgao: "PGFN / Regularize (desde 01/06/2026)" },
  previdenciaria: { natureza: "previdenciaria", rotulo: "Dívida previdenciária", orgao: "PGFN / Regularize" },
  nao_tributaria: { natureza: "nao_tributaria", rotulo: "Dívida não tributária", orgao: "PGFN / Regularize" },
};

export const SITUACAO_DIVIDA_VIEW: Record<SituacaoDivida, StatusView> = {
  ativa: { variant: "danger", glyph: "▼", label: "Inscrição ativa" },
  suspensa: { variant: "warning", glyph: "●", label: "Exigibilidade suspensa" },
  parcelada: { variant: "info", glyph: "↻", label: "Parcelada" },
  garantida: { variant: "info", glyph: "◆", label: "Garantida" },
  extinta: { variant: "neutral", glyph: "✓", label: "Extinta" },
};

/** Nível do alerta de exclusão automática de parcelamento por inadimplência. */
export type NivelAlertaExclusao = "critico" | "aviso" | "monitorado" | "excluido" | "sem_parcelamento";

export interface AlertaExclusaoView extends StatusView {
  nivel: NivelAlertaExclusao;
  /** Frase curta e G6-safe (o "por que importa"). */
  hint: string;
}

export const ALERTA_EXCLUSAO: Record<NivelAlertaExclusao, AlertaExclusaoView> = {
  critico: {
    nivel: "critico",
    variant: "danger",
    glyph: "▼",
    label: "Exclusão iminente",
    hint: "Indício de risco de exclusão automática do parcelamento por inadimplência (≤7 dias). A confirmar no Regularize; regularizar é ação do contador.",
  },
  aviso: {
    nivel: "aviso",
    variant: "warning",
    glyph: "⧗",
    label: "Prazo de exclusão aberto",
    hint: "Indício de inadimplência com janela de regularização (≤75 dias) antes da exclusão automática. Sugerimos revisar no Regularize.",
  },
  monitorado: {
    nivel: "monitorado",
    variant: "neutral",
    glyph: "◷",
    label: "Em monitoramento",
    hint: "Parcelamento vinculado sem indício de exclusão iminente na consulta. Segue em monitoramento.",
  },
  excluido: {
    nivel: "excluido",
    variant: "danger",
    glyph: "✕",
    label: "Prazo de exclusão vencido",
    hint: "O prazo indicado de exclusão automática já passou na consulta — a confirmar a situação do parcelamento no Regularize.",
  },
  sem_parcelamento: {
    nivel: "sem_parcelamento",
    variant: "neutral",
    glyph: "—",
    label: "Sem parcelamento vinculado",
    hint: "Inscrição sem parcelamento vinculado — não há prazo de exclusão automática a monitorar.",
  },
};

// ===========================================================================
// Cortes de prazo + cálculo de dia-calendário BRT (mesmo critério do S3/S5)
// ===========================================================================

/** ≤ este nº de dias até a exclusão → CRÍTICO (exclusão iminente). */
export const JANELA_EXCLUSAO_CRITICA_DIAS = 7;
/** ≤ este nº de dias até a exclusão → AVISO (janela de regularização aberta). */
export const JANELA_EXCLUSAO_AVISO_DIAS = 75;

/** Brasília = UTC-3 (sem horário de verão desde 2019). Mesmo critério de saude-fiscal-model.ts. */
const OFFSET_BRT_MS = -3 * 60 * 60 * 1000;
const DIA_MS = 1000 * 60 * 60 * 24;

/** Nº do dia-calendário em BRT de um instante ISO (`NaN` se ilegível). */
function diaCalendarioBRT(iso: string): number {
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return NaN;
  return Math.floor((t + OFFSET_BRT_MS) / DIA_MS);
}

/** Diferença em DIAS-CALENDÁRIO BRT (b - a). `NaN` se alguma data for ilegível. */
function diffDias(aIso: string, bIso: string): number {
  return diaCalendarioBRT(bIso) - diaCalendarioBRT(aIso);
}

// ===========================================================================
// Regra pura: alerta de exclusão automática
// ===========================================================================

/**
 * Deriva o alerta de exclusão automática de UMA inscrição (PURO).
 *
 * Regra (handoff 58 §4, S6):
 *  - sem parcelamento vinculado                    → "sem_parcelamento" (nada a monitorar);
 *  - com parcelamento, mas sem prazo de exclusão   → "monitorado" (em dia / countdown não iniciado);
 *  - prazo de exclusão ILEGÍVEL                     → "excluido" (fail-safe: banda visível, nunca some);
 *  - dias até exclusão < 0                          → "excluido" (prazo já passou);
 *  - dias ≤ 7                                       → "critico";
 *  - dias ≤ 75                                      → "aviso";
 *  - dias > 75                                      → "monitorado".
 *
 * @param refIso "hoje" (passado pela page) — ancora o cálculo do prazo.
 */
export function alertaExclusao(
  divida: DividaAtivaBruta,
  refIso: string,
): { nivel: NivelAlertaExclusao; diasAteExclusao: number | null } {
  const parc = divida.parcelamentoVinculado;
  if (!parc) return { nivel: "sem_parcelamento", diasAteExclusao: null };
  if (!parc.prazoExclusaoIso) return { nivel: "monitorado", diasAteExclusao: null };

  const dias = diffDias(refIso, parc.prazoExclusaoIso);
  // Prazo presente mas ilegível: fail-safe → banda visível "excluido", nunca degrada p/ monitorado.
  if (Number.isNaN(dias)) return { nivel: "excluido", diasAteExclusao: null };
  if (dias < 0) return { nivel: "excluido", diasAteExclusao: dias };
  if (dias <= JANELA_EXCLUSAO_CRITICA_DIAS) return { nivel: "critico", diasAteExclusao: dias };
  if (dias <= JANELA_EXCLUSAO_AVISO_DIAS) return { nivel: "aviso", diasAteExclusao: dias };
  return { nivel: "monitorado", diasAteExclusao: dias };
}

/** Uma inscrição já analisada — o que o feed/cockpit consome. */
export interface ItemDividaAtiva {
  divida: DividaAtivaBruta;
  naturezaRotulo: string;
  naturezaOrgao: string;
  situacaoView: StatusView;
  alerta: AlertaExclusaoView;
  /** Dias até a exclusão automática (negativo = já passou; null = sem prazo). */
  diasAteExclusao: number | null;
}

/** Severidade do alerta (pior primeiro) — ordenação e "pior nível" do cliente. */
const PESO_ALERTA: Record<NivelAlertaExclusao, number> = {
  excluido: 0,
  critico: 1,
  aviso: 2,
  monitorado: 3,
  sem_parcelamento: 4,
};

/** Analisa UMA inscrição (PURO): agrega apresentação + alerta. */
export function analisarDivida(divida: DividaAtivaBruta, refIso: string): ItemDividaAtiva {
  const { nivel, diasAteExclusao } = alertaExclusao(divida, refIso);
  const nat = NATUREZA_DIVIDA[divida.natureza];
  return {
    divida,
    naturezaRotulo: nat.rotulo,
    naturezaOrgao: nat.orgao,
    situacaoView: SITUACAO_DIVIDA_VIEW[divida.situacao],
    alerta: ALERTA_EXCLUSAO[nivel],
    diasAteExclusao,
  };
}

/**
 * Analisa e ORDENA as inscrições (PURO). Pior alerta primeiro; dentro do mesmo nível, prazo
 * mais apertado primeiro; empate por cliente/inscrição (estável). Determinístico a partir de refIso.
 */
export function analisarDividasAtivas(dividas: DividaAtivaBruta[], refIso: string): ItemDividaAtiva[] {
  return dividas
    .map((d) => analisarDivida(d, refIso))
    .sort((a, b) => {
      const d = PESO_ALERTA[a.alerta.nivel] - PESO_ALERTA[b.alerta.nivel];
      if (d !== 0) return d;
      const da = a.diasAteExclusao ?? Number.POSITIVE_INFINITY;
      const db = b.diasAteExclusao ?? Number.POSITIVE_INFINITY;
      if (da !== db) return da - db;
      const c = a.divida.clienteNome.localeCompare(b.divida.clienteNome, "pt-BR");
      if (c !== 0) return c;
      return a.divida.inscricao.localeCompare(b.divida.inscricao);
    });
}

/** Só as inscrições com alerta ativo (crítico/aviso/excluído) — o subconjunto "revisar". */
export function filtrarComAlertaExclusao(itens: ItemDividaAtiva[]): ItemDividaAtiva[] {
  return itens.filter(
    (i) => i.alerta.nivel === "critico" || i.alerta.nivel === "aviso" || i.alerta.nivel === "excluido",
  );
}

// ===========================================================================
// Agregação por cliente (para o cockpit)
// ===========================================================================

export interface DividaClienteAgregada {
  clienteId: string;
  clienteNome: string;
  documento: string;
  /** Nº de inscrições em dívida ativa do cliente. */
  inscricoes: number;
  /** Soma dos valores consolidados (R$). */
  valorConsolidadoTotal: number;
  /** Contagem de inscrições com exclusão iminente (crítico) e já vencida (excluído). */
  criticas: number;
  /** Contagem de inscrições com janela de exclusão aberta (aviso). */
  avisos: number;
  /** Naturezas distintas presentes (União, FGTS, …). */
  naturezas: NaturezaDivida[];
  /** Pior alerta entre as inscrições do cliente. */
  piorAlerta: AlertaExclusaoView;
}

/** Agrega a dívida ativa POR CLIENTE (PURO) — a linha do cockpit. Ordenado por pior alerta. */
export function agregarDividasPorCliente(
  dividas: DividaAtivaBruta[],
  refIso: string,
): DividaClienteAgregada[] {
  const porCliente = new Map<string, ItemDividaAtiva[]>();
  for (const item of analisarDividasAtivas(dividas, refIso)) {
    const arr = porCliente.get(item.divida.clienteId) ?? [];
    arr.push(item);
    porCliente.set(item.divida.clienteId, arr);
  }

  const out: DividaClienteAgregada[] = [];
  for (const itens of porCliente.values()) {
    const primeiro = itens[0].divida;
    let valor = 0;
    let criticas = 0;
    let avisos = 0;
    const naturezas = new Set<NaturezaDivida>();
    let pior: NivelAlertaExclusao = "sem_parcelamento";
    for (const it of itens) {
      valor += it.divida.valorConsolidado;
      naturezas.add(it.divida.natureza);
      if (it.alerta.nivel === "critico" || it.alerta.nivel === "excluido") criticas += 1;
      else if (it.alerta.nivel === "aviso") avisos += 1;
      if (PESO_ALERTA[it.alerta.nivel] < PESO_ALERTA[pior]) pior = it.alerta.nivel;
    }
    out.push({
      clienteId: primeiro.clienteId,
      clienteNome: primeiro.clienteNome,
      documento: primeiro.documento,
      inscricoes: itens.length,
      valorConsolidadoTotal: valor,
      criticas,
      avisos,
      naturezas: [...naturezas],
      piorAlerta: ALERTA_EXCLUSAO[pior],
    });
  }

  return out.sort((a, b) => {
    const d = PESO_ALERTA[a.piorAlerta.nivel] - PESO_ALERTA[b.piorAlerta.nivel];
    if (d !== 0) return d;
    return a.clienteNome.localeCompare(b.clienteNome, "pt-BR");
  });
}

/** KPIs do topo do cockpit de dívida ativa. */
export interface ResumoDividaAtiva {
  inscricoes: number;
  valorConsolidadoTotal: number;
  criticas: number;
  avisos: number;
  /** Nº de clientes distintos com ao menos uma inscrição. */
  clientesAfetados: number;
}

/** Agrega o resumo geral da dívida ativa da carteira (PURO). */
export function resumirDividaAtiva(dividas: DividaAtivaBruta[], refIso: string): ResumoDividaAtiva {
  const itens = analisarDividasAtivas(dividas, refIso);
  let valor = 0;
  let criticas = 0;
  let avisos = 0;
  const clientes = new Set<string>();
  for (const it of itens) {
    valor += it.divida.valorConsolidado;
    clientes.add(it.divida.clienteId);
    if (it.alerta.nivel === "critico" || it.alerta.nivel === "excluido") criticas += 1;
    else if (it.alerta.nivel === "aviso") avisos += 1;
  }
  return {
    inscricoes: itens.length,
    valorConsolidadoTotal: valor,
    criticas,
    avisos,
    clientesAfetados: clientes.size,
  };
}
