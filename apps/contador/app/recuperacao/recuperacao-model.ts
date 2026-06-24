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

/**
 * Proveniência do indício — de ONDE veio o número exibido (trilha de boa-fé).
 * No motor real (Fase atual) o indício é COMPUTADO sobre uma nota-amostra parseada;
 * na ingestão real (Fase C) vem do documento capturado do cliente.
 */
export interface ProvenienciaIndicio {
  /**
   * "motor" = o indício (valor envolvido + confiança + banda) foi COMPUTADO pelo
   * motor real (detectarMonofasicoLote) sobre uma nota-amostra XML parseada.
   * "ilustrativo" = derivação sintética rotulada (nunca o crédito em si).
   */
  fonte: "motor" | "ilustrativo";
  /** Classe do insumo de origem (xml estruturado/assinado = mais forte que OCR). */
  classeInsumo: "xml" | "documento_extraido";
  /** Rótulo da nota-amostra que originou o indício (ex.: nome do arquivo seed). */
  amostra: string;
  /** O XML traz bloco de assinatura (presença, NÃO validação ICP-Brasil). */
  assinado: boolean;
  /**
   * Confiança calibrada COMPUTADA pelo motor (0..1). Número não-mágico: deriva dos
   * fatores explícitos do apontamento. Sujeito a revisão do tributarista habilitado.
   */
  confianca: number;
  /**
   * true quando a confiança ficou abaixo do threshold do motor: BLOQUEIA
   * auto-aprovação e empurra para revisão humana (CRC). Honestidade da banda.
   */
  bloqueiaAutoAprovacao: boolean;
  /**
   * Valor envolvido na nota-amostra (R$) que serviu de BASE ao indício — o número
   * que o motor de fato leu do XML (não a projeção retroativa). Quando o item NÃO
   * gera indício monofásico (motor abstém), fica como a base lida sem crédito.
   */
  valorEnvolvidoBase: number;
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
  /**
   * Proveniência do indício (fonte/confiança/banda do MOTOR REAL). Opcional para
   * retrocompatibilidade: indícios sem proveniência são tratados como ilustrativos.
   */
  proveniencia?: ProvenienciaIndicio;
  /**
   * true quando o MOTOR REAL gerou apontamento monofásico para este item. false =
   * o motor abstém (item fora de família monofásica) → exibido como "motor não
   * identificou indício" (honestidade: não há crédito a projetar).
   */
  temIndicioMotor?: boolean;
  /**
   * Projeção retroativa REGIME-AWARE (alíquota por regime; Simples = requer apuração).
   * Auditável: carrega regime + alíquota + estimativa/ano + 5 anos. Opcional para
   * retrocompatibilidade. `estimativaRetroativo` espelha `projecao.estimativa5Anos`.
   */
  projecao?: ProjecaoRetroativa;
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
  /** Regime tributário do cliente — define a alíquota da projeção (ou Simples = apuração). */
  regime: RegimeTributario;
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
 * Regime tributário do cliente — determina COMO (e se) projetamos a estimativa.
 *  - "real"      = Lucro Real / PIS-COFINS NÃO-cumulativo (1,65% + 7,6% = 9,25%).
 *  - "presumido" = Lucro Presumido / PIS-COFINS CUMULATIVO (0,65% + 3,0% = 3,65%).
 *  - "simples"   = Simples Nacional → o crédito monofásico NÃO é por alíquota federal,
 *                  e sim por SEGREGAÇÃO DE RECEITA (conceito distinto). Não projetamos
 *                  número: marcamos "requer apuração" e o item contribui R$0 ao total.
 */
export type RegimeTributario = "real" | "presumido" | "simples";

/**
 * Alíquota nominal combinada de PIS/COFINS por regime (apenas para a projeção
 * ILUSTRATIVA de ordem-de-grandeza). NÃO é a apuração do cliente concreto.
 *  - não-cumulativo (real): 1,65% + 7,60% = 9,25%
 *  - cumulativo (presumido): 0,65% + 3,00% = 3,65%
 */
export const ALIQUOTA_PIS_COFINS_NAO_CUMULATIVO = 0.0925;
export const ALIQUOTA_PIS_COFINS_CUMULATIVO = 0.0365;

/** Alíquota federal aplicável por regime (Simples = null: não se projeta por alíquota). */
export function aliquotaPorRegime(regime: RegimeTributario): number | null {
  if (regime === "real") return ALIQUOTA_PIS_COFINS_NAO_CUMULATIVO;
  if (regime === "presumido") return ALIQUOTA_PIS_COFINS_CUMULATIVO;
  return null; // simples: segregação de receita, não alíquota → não projeta número
}

/** Rótulo legível do regime (para a UI / proveniência). */
export function rotuloRegime(regime: RegimeTributario): string {
  if (regime === "real") return "Lucro Real (não-cumulativo · 9,25%)";
  if (regime === "presumido") return "Lucro Presumido (cumulativo · 3,65%)";
  return "Simples Nacional (segregação de receita)";
}

/**
 * Projeção ILUSTRATIVA do crédito retroativo, REGIME-AWARE. Resultado estruturado e
 * AUDITÁVEL: expõe o regime e a alíquota usados, a estimativa por ano e em 5 anos, e
 * se o caso REQUER APURAÇÃO (Simples) em vez de número projetado.
 */
export interface ProjecaoRetroativa {
  regime: RegimeTributario;
  /** Alíquota federal usada na projeção (null no Simples — não se projeta por alíquota). */
  aliquota: number | null;
  /** Estimativa ILUSTRATIVA por ano-tipo (R$). 0 quando requer apuração ou sem base. */
  estimativaAno: number;
  /** Estimativa ILUSTRATIVA em 5 anos (R$). 0 quando requer apuração ou sem base. */
  estimativa5Anos: number;
  /**
   * true no Simples: NÃO há número projetado (crédito é por segregação de receita).
   * A UI deve exibir "requer apuração" e o item contribui R$0 ao KPI (como abstenção).
   */
  requerApuracao: boolean;
}

/**
 * Projeta a ESTIMATIVA ILUSTRATIVA do crédito retroativo a partir do VALOR ENVOLVIDO
 * que o MOTOR REAL leu da nota-amostra (R$ da linha do XML), de acordo com o REGIME.
 *
 * Ordem-de-grandeza didática, NÃO a apuração real: aplica a alíquota do regime sobre o
 * valor da nota-amostra como o "pago a mais" de um período-tipo e extrapola pelos 5 anos
 * retroativos (`ANOS_RETROATIVOS`) *se o volume se mantiver*. No Simples não há projeção
 * por alíquota (segregação de receita) → `requerApuracao = true`, número zerado.
 *
 * Função PURA e determinística (sem Date/rede/fs).
 *
 * @param valorEnvolvidoMotor  R$ da linha que o motor leu (apontamento.valorEnvolvido).
 * @param regime               regime tributário do cliente (seed).
 */
export function projetarRetroativoIlustrativo(
  valorEnvolvidoMotor: number,
  regime: RegimeTributario,
): ProjecaoRetroativa {
  const aliquota = aliquotaPorRegime(regime);
  const base = Math.max(0, valorEnvolvidoMotor);

  // Simples: não se projeta por alíquota federal (segregação de receita).
  if (aliquota === null) {
    return { regime, aliquota: null, estimativaAno: 0, estimativa5Anos: 0, requerApuracao: true };
  }

  const estimativaAno = Math.round(base * aliquota);
  const estimativa5Anos = Math.round(estimativaAno * ANOS_RETROATIVOS);
  return { regime, aliquota, estimativaAno, estimativa5Anos, requerApuracao: false };
}

/** Mapeia a banda calibrada do motor (alta/media/baixa) para a banda do overlay. */
export function bandaDoMotor(banda: BandaRecuperacao): BandaRecuperacao {
  // Mesma escala (alta/media/baixa) — o motor e o overlay compartilham o vocabulário.
  return banda;
}

/** Abrevia R$ em ordem-de-grandeza ("~R$11k", "~R$1,2k", "~R$55k") para FAIXA, não número-herói. */
function abreviarBrl(valor: number): string {
  const v = Math.max(0, Math.round(valor));
  if (v >= 1000) {
    const milhares = v / 1000;
    // 1 casa quando < 10k (ex.: ~R$1,2k); inteiro acima (ex.: ~R$55k).
    const casas = milhares < 10 ? 1 : 0;
    const txt = milhares.toLocaleString("pt-BR", {
      minimumFractionDigits: casas,
      maximumFractionDigits: casas,
    });
    return `~R$${txt}k`;
  }
  return `~R$${v.toLocaleString("pt-BR")}`;
}

/**
 * Formata a projeção como FAIXA com a PREMISSA EXPLÍCITA (🟡-1): o número grande não
 * deve ancorar como valor recuperável cravado. Ex.:
 *   "~R$11k/ano · ~R$55k em 5 anos *se o volume se mantiver*" (ilustrativa)
 *   Simples → "— requer apuração (Simples: segregação de receita)".
 */
export function formatarFaixaProjecao(projecao: ProjecaoRetroativa): string {
  if (projecao.requerApuracao) {
    return "— requer apuração (Simples: segregação de receita)";
  }
  if (projecao.estimativa5Anos <= 0) {
    return "— sem indício";
  }
  return (
    `${abreviarBrl(projecao.estimativaAno)}/ano · ${abreviarBrl(projecao.estimativa5Anos)} em 5 anos ` +
    `(ilustrativa, se o volume se mantiver)`
  );
}

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
