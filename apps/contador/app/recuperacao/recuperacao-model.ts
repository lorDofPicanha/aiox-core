/**
 * Read model do overlay RECUPERAÇÃO / RESTITUIÇÃO (módulo #4 — CONTEXT §3, doc 05 §4).
 *
 * Auto-contido em app/recuperacao/ DE PROPÓSITO: não toca lib/api.ts, lib/ compartilhado,
 * packages/* nem componentes — apenas lê os componentes globais (Card/Table/StatusBadge/
 * TopBar) e os tokens do globals.css. Os dados são SINTÉTICOS (recuperacao-data.ts).
 *
 * O overlay nasce LIGADO À AUDITORIA: onde a auditoria aponta imposto monofásico
 * PIS/COFINS pago a mais HOJE, os últimos 5 anos provavelmente também → janela de
 * recuperação retroativa, que FECHA com o sunset do PIS/COFINS (1º/jan/2027 — CONTEXT §9).
 *
 * G6 (CONTEXT §5 constraint #4; doc 45 §5) — CRÍTICO neste módulo:
 *   NUNCA "crédito garantido", "recuperação garantida", "apuração correta", "elimina
 *   multa", "dinheiro certo", "prova jurídica plena". SEMPRE "indícios de crédito
 *   POTENCIALMENTE recuperável", "estimativa", "sujeito a análise/revisão do tributarista".
 *   A execução real (PER/DCOMP) é da Fase 7 e quem assina é o tributarista habilitado (D6).
 */
import type { StatusView } from "@/lib/status";

/** Estágio do caso de recuperação (ordem: triagem → dossiê → tributarista). */
export type EstagioRecuperacao = "analise_previa" | "em_dossie" | "com_tributarista";

export interface EstagioView extends StatusView {
  estagio: EstagioRecuperacao;
  /** Frase curta e G6-safe (o "onde estamos" do caso). */
  hint: string;
}

/**
 * Apresentação de cada estágio. SEMPRE redundante (cor + glyph + label — DESIGN §3).
 * Nenhuma label promete resultado: descrevem ONDE o caso está no fluxo de revisão,
 * não que haja crédito assegurado.
 */
export const ESTAGIO_RECUPERACAO: Record<EstagioRecuperacao, EstagioView> = {
  analise_previa: {
    estagio: "analise_previa",
    variant: "neutral",
    glyph: "◷",
    label: "Análise prévia",
    hint: "Indícios levantados a partir da auditoria. Triagem inicial, ainda sem dossiê montado.",
  },
  em_dossie: {
    estagio: "em_dossie",
    variant: "info",
    glyph: "▤",
    label: "Em dossiê",
    hint: "Evidências técnicas sendo organizadas (notas, NCM, base normativa) para revisão profissional.",
  },
  com_tributarista: {
    estagio: "com_tributarista",
    variant: "warning",
    glyph: "⚖",
    label: "Com tributarista",
    hint: "Dossiê encaminhado ao tributarista habilitado — quem analisa e assina a PER/DCOMP (Fase 7).",
  },
};

/** Banda de confiança calibrada do indício (nunca selo binário "correto" — G6). */
export type BandaRecuperacao = "alta" | "media" | "baixa";

export const BANDA_RECUPERACAO: Record<BandaRecuperacao, StatusView> = {
  alta: { variant: "success", glyph: "▲", label: "Confiança alta" },
  media: { variant: "warning", glyph: "◆", label: "Confiança média" },
  baixa: { variant: "danger", glyph: "▼", label: "Confiança baixa" },
};

/** Via de recebimento do crédito (D5: RT default; PERComp com ressalva de risco). */
export type ViaRecebimento = "rt" | "percomp";

export interface ViaView {
  via: ViaRecebimento;
  rotulo: string;
  /** Descrição honesta da via, incluindo a ressalva quando há risco. */
  descricao: string;
  /** true = caminho padrão recomendado (mais seguro). */
  default: boolean;
  badge: StatusView;
}

export const VIA_RECEBIMENTO: Record<ViaRecebimento, ViaView> = {
  rt: {
    via: "rt",
    rotulo: "RT — Restituição em dinheiro",
    descricao:
      "Recebimento do valor em dinheiro (PIX do governo). Caminho padrão por ser o mais seguro para o cliente: não usa o crédito para abater imposto antes da homologação.",
    default: true,
    badge: { variant: "success", glyph: "✓", label: "Padrão (mais seguro)" },
  },
  percomp: {
    via: "percomp",
    rotulo: "PER/DCOMP (PERComp) — compensação",
    descricao:
      "Compensação administrativa: o crédito abate imposto antes da homologação. Ressalva: se o crédito for glosado depois, há exposição a multa de até 150% — por isso não é o caminho padrão. Decisão é do tributarista habilitado.",
    default: false,
    badge: { variant: "warning", glyph: "!", label: "Risco de multa se glosado" },
  },
};

/**
 * Quebra ANO A ANO da estimativa retroativa de um indício (últimos 5 anos).
 * Cada ano carrega o número de notas/itens que sustentam a estimativa daquele
 * período e uma confiança própria — anos mais antigos tendem a ter menos
 * evidência disponível (e por isso confiança menor). Tudo ILUSTRATIVO.
 */
export interface AnoEstimativa {
  /** Ano-calendário do período retroativo. */
  ano: number;
  /** Estimativa ILUSTRATIVA do crédito potencialmente recuperável no ano (R$). */
  estimativa: number;
  /** Quantidade de notas/itens que sustentam a estimativa do ano (sintético). */
  notas: number;
  /** Confiança calibrada do período (anos antigos = menos evidência). */
  banda: BandaRecuperacao;
}

/** Item de evidência ligado a um indício (o que o dossiê reúne para revisão). */
export interface EvidenciaItem {
  /** Rótulo curto do tipo de evidência (ex.: "Notas de entrada (XML)"). */
  rotulo: string;
  /** Descrição honesta do que a evidência cobre e seu limite. */
  detalhe: string;
  /** Confiança calibrada da evidência (nunca "prova plena"). */
  banda: BandaRecuperacao;
}

/** Indício de crédito potencialmente recuperável, ligado a um item da auditoria. */
export interface IndicioRecuperacao {
  /** Produto/insumo de alto SKU monofásico (ligado à auditoria). */
  produto: string;
  ncm: string;
  /** Natureza do indício (ex.: monofásico tributado como tributado normal). */
  natureza: string;
  /** Confiança calibrada do indício (nunca "correto"). */
  banda: BandaRecuperacao;
  /** Estimativa ILUSTRATIVA do retroativo de 5 anos deste indício (R$). */
  estimativaRetroativo: number;
  /** Base normativa citada (fundamento — sujeito a revisão do tributarista). */
  fundamento: string;
  /** Quebra ano a ano (5 anos) da estimativa deste indício. ILUSTRATIVA. */
  porAno: AnoEstimativa[];
  /** Evidências técnicas que o dossiê reúne para sustentar o indício. */
  evidencias: EvidenciaItem[];
}

/** Split ILUSTRATIVO do success-fee (linha separada — NÃO empacotado no recorrente, D6). */
export interface SplitSuccessFee {
  /** Valor-base hipotético recuperado usado para ilustrar o split (R$). */
  baseHipotetica: number;
  empresaPct: number;
  plataformaPct: number;
  contadorPct: number;
  empresaValor: number;
  plataformaValor: number;
  contadorValor: number;
}

/** Caso de recuperação por cliente (foco: alto SKU / monofásico — doc 05 §4). */
export interface CasoRecuperacao {
  /** ID exato do cliente (CONTEXT — IDs canônicos). */
  clienteId: string;
  clienteNome: string;
  /** Segmento alto-SKU/monofásico (farmácia, posto, mercado — doc 05 §4). */
  segmento: string;
  estagio: EstagioView;
  /** Banda do caso = pior indício (mais conservadora). */
  bandaCaso: StatusView;
  indicios: IndicioRecuperacao[];
  /** Estimativa retroativa total (5 anos), soma dos indícios. ILUSTRATIVA. */
  estimativaTotal: number;
  /** Via de recebimento sugerida (RT default — D5). */
  viaSugerida: ViaView;
  /** Split ilustrativo do success-fee para este caso. */
  split: SplitSuccessFee;
}

/** Resumo agregado para os KPIs do topo. */
export interface ResumoRecuperacao {
  casos: number;
  indicios: number;
  /** Soma das estimativas retroativas (ILUSTRATIVA). */
  estimativaTotal: number;
  /** Dias restantes até o sunset do PIS/COFINS (1º/jan/2027). */
  diasAteSunset: number;
}

/** Data canônica do sunset do PIS/COFINS (Reforma — CONTEXT §9, doc 05 alerta ~63:00). */
export const SUNSET_PIS_COFINS = "2027-01-01T00:00:00-03:00";

/**
 * Dias corridos entre `agora` e o sunset. Determinístico a partir de uma data de
 * referência (passada pela page para manter o Server Component reproduzível).
 */
export function diasAteSunset(agoraIso: string): number {
  const agora = new Date(agoraIso).getTime();
  const sunset = new Date(SUNSET_PIS_COFINS).getTime();
  const ms = sunset - agora;
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

/** Pior banda entre os indícios (mais conservadora: baixa > media > alta). */
function piorBanda(indicios: IndicioRecuperacao[]): StatusView {
  const severidade: Record<BandaRecuperacao, number> = { baixa: 0, media: 1, alta: 2 };
  let pior: BandaRecuperacao = "alta";
  for (const i of indicios) {
    if (severidade[i.banda] < severidade[pior]) pior = i.banda;
  }
  return BANDA_RECUPERACAO[pior];
}

/**
 * Split ILUSTRATIVO do success-fee a partir de uma base hipotética. Percentuais fixos
 * (empresa 70 / plataforma 15 / contador 15 — doc 05 §4). O cliente final do contador
 * não vê que o contador participa do split (D6). É exemplo, não promessa de valor.
 */
export function calcularSplit(baseHipotetica: number): SplitSuccessFee {
  const empresaPct = 70;
  const plataformaPct = 15;
  const contadorPct = 15;
  // Clamp: a base não pode ser negativa (calculadora interativa do success-fee).
  const base = Math.max(0, Math.round(baseHipotetica));
  return {
    baseHipotetica: base,
    empresaPct,
    plataformaPct,
    contadorPct,
    empresaValor: Math.round((base * empresaPct) / 100),
    plataformaValor: Math.round((base * plataformaPct) / 100),
    contadorValor: Math.round((base * contadorPct) / 100),
  };
}

/** Janela de anos retroativos exibida no drill-down (últimos 5 anos). */
export const ANOS_RETROATIVOS = 5;

/**
 * Cabeçalho estruturado do dossiê de evidências (preview). NÃO é a PER/DCOMP —
 * é a organização das evidências técnicas que o tributarista habilitado revisa
 * e assina na Fase 7. Texto sempre G6-safe (indício/estimativa/sujeito a revisão).
 */
export interface DossieCabecalho {
  clienteNome: string;
  segmento: string;
  /** Período retroativo coberto (ex.: "2021–2025 · 5 anos"). */
  periodo: string;
  /** Via de recebimento sugerida (RT default — D5). */
  viaSugerida: string;
  /** Estágio atual do caso no fluxo de revisão. */
  estagioLabel: string;
}

/** Linha de item do dossiê (um indício resumido para o preview estruturado). */
export interface DossieItem {
  produto: string;
  ncm: string;
  natureza: string;
  bandaLabel: string;
  estimativa: number;
  fundamento: string;
  /** Nº de evidências técnicas reunidas para o item (sintético). */
  evidencias: number;
}

/** Preview ESTRUTURADO do dossiê de evidências (demo). */
export interface DossiePreview {
  cabecalho: DossieCabecalho;
  itens: DossieItem[];
  /** Estimativa retroativa total do caso (ILUSTRATIVA). */
  estimativaTotal: number;
  /** Bases normativas distintas citadas no caso (sujeitas a revisão). */
  basesNormativas: string[];
  /** Ressalva fixa: quem assina a PER/DCOMP é o tributarista habilitado (Fase 7). */
  ressalva: string;
}

/**
 * Monta o preview estruturado do dossiê a partir de um caso. Determinístico e puro
 * (sem efeitos colaterais): o componente client chama isto para renderizar o preview.
 * O período é derivado do `ano` corrente passado pela page (Server) para reproduzir.
 */
export function montarDossie(caso: CasoRecuperacao, anoBase: number): DossiePreview {
  const anoInicio = anoBase - ANOS_RETROATIVOS + 1;
  const itens: DossieItem[] = caso.indicios.map((i) => ({
    produto: i.produto,
    ncm: i.ncm,
    natureza: i.natureza,
    bandaLabel: BANDA_RECUPERACAO[i.banda].label,
    estimativa: i.estimativaRetroativo,
    fundamento: i.fundamento,
    evidencias: i.evidencias.length,
  }));
  const basesNormativas = Array.from(new Set(caso.indicios.map((i) => i.fundamento)));
  return {
    cabecalho: {
      clienteNome: caso.clienteNome,
      segmento: caso.segmento,
      periodo: `${anoInicio}–${anoBase} · ${ANOS_RETROATIVOS} anos`,
      viaSugerida: caso.viaSugerida.rotulo,
      estagioLabel: caso.estagio.label,
    },
    itens,
    estimativaTotal: caso.estimativaTotal,
    basesNormativas,
    ressalva:
      "Este dossiê reúne indícios e evidências técnicas para revisão profissional. " +
      "Os valores são estimativas ilustrativas, sujeitas a análise e revisão do " +
      "tributarista habilitado — que é quem analisa e assina a PER/DCOMP (Fase 7).",
  };
}
