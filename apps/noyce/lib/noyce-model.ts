export type SourceCode =
  | "pncp"
  | "pcp"
  | "bll"
  | "bnc"
  | "comprasgov"
  | "sislog"
  | `candidate:${string}`;

export type WorkflowStage =
  | "monitorar"
  | "analisar"
  | "indicar"
  | "habilitar"
  | "acompanhar"
  | "recorrer";

export type ConfidenceLevel =
  | "confirmed"
  | "strong"
  | "inferred"
  | "weak"
  | "conflicting"
  | "missing";

export type ActionLabel =
  | "priorizar agora"
  | "promissora, mas incompleta"
  | "avaliar rapido"
  | "revisao obrigatoria"
  | "ignorar ou revisar manualmente";

export interface EvidenceItem {
  kind: "fato" | "inferencia" | "lacuna";
  label: string;
  value: string;
  source: SourceCode;
  confidence: ConfidenceLevel;
}

export interface PortalAccess {
  source: SourceCode;
  name: string;
  portalUrl?: string;
  status: "publico" | "aguarda_vault" | "dry_run";
  requiresLogin: boolean;
  requires2fa: "unknown" | "yes" | "no";
  tosStatus: "ok" | "pending" | "unknown";
}

export interface Opportunity {
  id: string;
  source: SourceCode;
  /** Diff do discovery --watch: quando o edital apareceu pela 1ª vez numa varredura. */
  firstSeenAt?: string | null;
  title: string;
  buyer: string;
  city: string;
  uf: string;
  distanceKm: number;
  estimatedValue: number | null;
  proposalDeadline: string | null;
  stage: WorkflowStage;
  opportunityScore: number;
  confidenceScore: number;
  analysisRun: AnalysisRun;
  action: ActionLabel;
  risks: string[];
  evidence: EvidenceItem[];
  missingData: string[];
  habilitationChecklist: Array<{
    label: string;
    status: "ok" | "warning" | "missing";
    note: string;
  }>;
  timeline: Array<{
    label: string;
    date: string;
    status: "done" | "open" | "missing" | "risk";
  }>;
  legalProcess: LegalProcess;
  market: MarketStructure | null; // deep competitor intelligence; null → UI "dados insuficientes"
  stage3?: Stage3Synthesis | null; // prescriptive 5-frases (gated by kill-gate)
  triage: DiscoveryTriage; // Monitorar verdict (Vai/Olha/Pula)
  habilitationResult?: HabilitationResult | null;
  // Story 30.1: o edital permite participação em consórcio?
  //   true  = permite · false = proíbe · null = edital silente (NÃO assumir false).
  // Origem: source-normalizer extrai do payload PNCP (indicadorSubcontratacao + texto);
  // ausência de sinal ⇒ null. Renderizado como chip Sim/Não/N/I na Mesa/Monitorar.
  permiteConsorcio?: boolean | null;
}

export type HabilitationRequirementCategory =
  | "juridica"
  | "fiscal"
  | "trabalhista"
  | "economico_financeira"
  | "tecnica"
  | "proposta"
  | "outro";

export type LegalCriticality = "blocker" | "high" | "medium" | "low";

export interface HabilitationRequirement {
  id: string;
  category: HabilitationRequirementCategory;
  label: string;
  requirementText: string;
  criticality: LegalCriticality;
  status: "not_started" | "needs_document" | "ready_for_review" | "approved_by_human" | "gap" | "not_applicable";
  confidence: ConfidenceLevel;
  humanOwner: string;
  evidenceLabel: string;
  note: string;
}

export interface HabilitationDocument {
  id: string;
  requirementId: string;
  label: string;
  documentType: string;
  status: "missing" | "available" | "expired" | "needs_review" | "accepted_by_human";
  validUntil: string | null;
  source: "manual_fixture" | "vault_pending" | "user_uploaded_future";
  sensitive: boolean;
  redactionRequired: boolean;
}

export type LegalEventType =
  | "publication"
  | "clarification"
  | "proposal_deadline"
  | "session_open"
  | "bid_round"
  | "habilitation_review"
  | "diligence"
  | "adjudication"
  | "homologation"
  | "appeal_intent_window"
  | "appeal_reasons_deadline"
  | "counterarguments_deadline"
  | "other";

export interface LegalProcessEvent {
  id: string;
  stage: WorkflowStage;
  eventType: LegalEventType;
  label: string;
  eventTime: string | null;
  status: "observed" | "inferred" | "expected" | "missed" | "cancelled";
  requiresHumanAction: boolean;
  riskLevel: "none" | "watch" | "urgent" | "critical";
  consequenceIfMissed: string;
  evidenceLabel: string;
}

export type DecisionType =
  | "prepare_documents"
  | "ask_clarification"
  | "continue_bid"
  | "stop_bid"
  | "request_diligence_review"
  | "manifest_appeal_intent"
  | "draft_appeal_reasons"
  | "submit_counterarguments"
  | "ignore";

export interface DecisionPoint {
  id: string;
  decisionType: DecisionType;
  recommendedAction: string;
  basis: "fact" | "inference" | "missing_data" | "legal_review_needed";
  confidenceScore: number;
  blockingLacunas: string[];
  humanApprovalRequired: boolean;
  externalActBlocked: boolean;
}

export interface AppealIntent {
  id: string;
  windowStatus: "not_open" | "open_manual_entry" | "closing_soon" | "closed" | "unknown";
  groundsSummary: string;
  humanDecision: "undecided" | "intend_to_appeal" | "do_not_appeal" | "needs_lawyer_review";
  submissionStatus: "blocked_not_automated" | "manually_submitted_by_user" | "not_submitted" | "unknown";
}

export interface AppealReasons {
  id: string;
  intentId: string;
  draftStatus: "not_started" | "outline" | "draft_for_review" | "approved_by_lawyer" | "discarded";
  argumentTopics: string[];
  reviewOwner: string;
  externalSubmissionStatus: "blocked_not_automated" | "manually_submitted_by_user" | "not_submitted" | "unknown";
}

export interface LegalProcess {
  requirements: HabilitationRequirement[];
  documents: HabilitationDocument[];
  events: LegalProcessEvent[];
  decisionPoints: DecisionPoint[];
  appealIntent: AppealIntent;
  appealReasons: AppealReasons;
}

// ── Deep competitor-intelligence module (Stage 2/3 MOAT) ──────────────────
// Replaces the fake competitors[]/priceReferences[] (which derived "level" from
// the opportunity score). Every grounded field traces to a real PNCP contract
// (numeroControlePncpCompra in sourceContractIds); everything else is labelled
// inferred|gap and must render with a visible provenance chip in the UI.
// ANTI-REGRESSION: no field here may be derived from opportunityScore/confidenceScore.

export type Grounding = "grounded" | "inferred" | "gap";
export type MarketConcentration = "pulverizado" | "moderado" | "concentrado";

/** One real rival reconstructed from PNCP /contratos for this órgão × objeto-class. */
export interface Competitor {
  cnpj: string; // niFornecedor (GROUNDED)
  name: string; // nomeRazaoSocialFornecedor (GROUNDED)
  winCount: number; // GROUNDED
  totalWonBRL: number; // Σ valorGlobal (GROUNDED)
  sharePct: number; // 0..100 of órgão spend — number GROUNDED, read with coveragePct
  avgTicketBRL: number; // GROUNDED
  avgDiscountPct: number | null; // INFERENCE: needs valorTotalEstimado join; null when sigiloso
  isIncumbent: boolean; // holds latest/active contract (GROUNDED)
  lastWinDate: string | null; // dataAssinatura ISO (GROUNDED)
  objectAffinity: "alta" | "media" | "baixa"; // INFERENCE: text/CNAE match
  vsEniac: {
    encounters: number;
    eniacWins: number;
    lostByPct: number | null;
    grounding: Grounding; // ~always "gap": PNCP /contratos shows only the winner
  };
  howToBeat: string; // INFERENCE: rule-based prescriptive line
  grounding: Grounding; // row-level provenance
  sourceContractIds: string[]; // numeroControlePncpCompra[] — citable
}

/** Real price band from won contracts of the same objeto-class (replaces ×0.86/×1.14). */
export interface PriceBand {
  p25BRL: number | null;
  medianBRL: number | null;
  p75BRL: number | null;
  sampleSize: number;
  grounding: Grounding; // "grounded" if sampleSize >= N_MIN, else "inferred"
}

/** Market structure of this órgão × objeto-class, reconstructed from a batch snapshot. */
export interface MarketStructure {
  orgaoCnpj: string; // orgaoEntidade.cnpj (GROUNDED)
  orgaoName: string; // orgaoEntidade.razaoSocial (GROUNDED)
  municipio?: string;
  uf?: string;
  objetoClass: string; // INFERENCE: category/CNAE bucket
  windowMonths: number;
  distinctWinners: number; // GROUNDED
  contractCount: number; // obras-filtered set (GROUNDED)
  allContractCount?: number; // every category at the órgão (context)
  obrasShareOfOrgao?: number; // % of órgão contracts that are obras (INFERENCE: keyword filter)
  totalContractedBRL: number; // GROUNDED
  hhi: number; // 0..10000 — number GROUNDED
  concentration: MarketConcentration; // INFERENCE: labelled convention, biased by coverage
  modalityMix: Record<string, number>; // {"4":n,"6":n,"8":n} from /contratacoes (GROUNDED)
  recurrenceMonths: number | null; // INFERENCE: null until >=2 cycles / backfill
  outsiderWinRatePct: number | null; // INFERENCE
  coveragePct: number | null; // /contratos ÷ /contratacoes — TRUST GATE (measured-with-confidence)
  coverageProvisional?: boolean; // true if fetch had failures / no denominator
  priceBand: PriceBand;
  competitors: Competitor[]; // ranked desc by totalWonBRL
  grounding: Grounding;
  error?: string;
}

// Stage-3 prescriptive synthesis (schema-locked; every phrase cites a source or downgrades).
export type PrescriptiveKind =
  | "preco_alvo"
  | "diferencial"
  | "concorrente_provavel"
  | "risco"
  | "timing";

export interface PrescriptivePhrase {
  kind: PrescriptiveKind;
  text: string;
  source: { type: "contrato" | "edital" | "calculo"; ref: string };
  grounding: Grounding;
  confidence: ConfidenceLevel;
}

export interface Stage3Synthesis {
  phrases: PrescriptivePhrase[];
  disclaimer: string;
}

// Tier 1 habilitation nucleus (P1): static capability profile + edital requirements.
// Unknown accounting/profile fields stay null until a grounded source is parsed.
export interface ClauseReference {
  numero: string;
  texto: string;
  pagina?: number;
  trecho?: string;
}

export interface CompanyIdentity {
  razaoSocial: string;
  cnpj: string;
  creaEmpresa: string | null;
  porte: "ME" | "EPP" | "DEMAIS" | null;
  regime: "Simples" | "Lucro Presumido" | "Lucro Real" | null;
  sedeMunicipioIbge: string;
  /** Município/UF da sede por extenso, p/ o LOCAL do fecho ("Águas Lindas de Goiás-GO"). Opcional. */
  sedeMunicipio?: string;
  nire?: string;
  /** Representante legal que assina pela empresa — bloco de assinatura sem lacuna (padrão vencedor). */
  representanteLegal?: { nome: string; cpf: string; cargo: string; rg?: string | null };
  /** Contador responsável (CRC) — usado na declaração econômico-financeira/balanço. */
  contador?: { nome: string; crc: string };
}

export interface TechnicalProfessional {
  id: string;
  nome: string;
  titulo: string;
  crea: string | null;
  rnp: string | null;
  vinculo: {
    tipo: string;
    desde: string | null;
  } | null;
}

export interface AcervoItem {
  servicoCanonico: string;
  qtd: number;
  unidade: string;
  descricaoOriginal: string;
  clausulaOrigem: ClauseReference | null;
}

export interface Acervo {
  id: string;
  tipo: "CAT_PROFISSIONAL" | "CAO_OPERACIONAL" | "ATESTADO_SIMPLES";
  numero: string | null;
  rtId: string;
  participacaoTecnica: "Individual" | "Corresponsavel";
  contratante: string;
  tipoContratante: "publico" | "privado" | null;
  valor: number | null;
  periodo: string | null;
  status: string | null;
  itens: AcervoItem[];
}

export interface FinancialSnapshot {
  exercicio: number;
  patrimonioLiquido: number | null;
  capitalSocial: number | null;
  ativoCirc: number | null;
  passivoCirc: number | null;
  ativoTotal: number | null;
  realizavelLongoPrazo: number | null;
  exigivelLongoPrazo: number | null;
  receitaBruta: number | null;
  resultado: number | null;
  fonte: string;
}

export interface RegularityDoc {
  id: string;
  tipo: string;
  status: "vigente" | "vencido" | "pendente" | "desconhecido";
  validade: string | null;
  fonte: string | null;
}

export interface CapabilityByService {
  maxSingle: number;
  somaTop2: number;
  unidade: string;
  fontes: string[];
}

export interface CompanyCapabilityProfile {
  identity: CompanyIdentity;
  rts: TechnicalProfessional[];
  acervo: Acervo[];
  financials: FinancialSnapshot[];
  regularity: RegularityDoc[];
  derived: {
    capabilityByService: Record<string, CapabilityByService>;
  };
}

export interface ServiceTaxonomyEntry {
  servicoCanonico: string;
  unidade: string;
  sinonimos: string[];
  provisorio: boolean;
}

export interface EditalRequirementsModel {
  meta: {
    orgao: string;
    cnpjOrgao: string | null;
    municipioIbge: string | null;
    modalidade: string | number | null;
    valorEstimado: number | null;
    dataPublicacao: string | null;
    dataSessao: string | null;
    criterioJulgamento: string | null;
    regimeExecucao: string | null;
    /** Art. 55, II, a/b: obra/serviço COMUM (10 d.u.) × ESPECIAL (25 d.u.). null = não extraído → sem sinal de prazo (não chuta). */
    objetoComum?: boolean | null;
  };
  economicoFinanceira: {
    exigePL: boolean | null;
    percentualPL: number | null;
    indices: {
      LC?: number | null;
      LG?: number | null;
      SG?: number | null;
    };
    justificativaPresente: boolean | null;
    garantiaPropostaPct: number | null;
    clausula: ClauseReference | null;
  };
  tecnica: {
    /** Títulos/profissionais exigidos no QUADRO da empresa (Eng. Civil, Arquiteto, Téc. Segurança…).
     *  Casa contra ccp.rts (responsáveis técnicos), não contra o acervo. Opcional p/ retrocompat. */
    quadroTecnico?: string[];
    profissional: Array<{
      servico: string;
      qtdMin?: number | null;
      un: string | null;
    }>;
    operacional: Array<{
      servico: string;
      qtdMin: number | null;
      qtdObjeto: number | null;
      un: string | null;
    }>;
    parcelasMaiorRelevancia: string[] | null;
    /** Gate dos 4% (art. 67 §1º): percentual mínimo que o EDITAL declara para "parcela de
     *  maior relevância". A lei fixa o piso em 4% do valor estimado — edital abaixo disso
     *  exige atestado de parcela irrelevante (impugnável). Opcional p/ retrocompat. */
    relevanciaPctMin?: number | null;
    tetoQuantitativo: number | null;
    somatorio: {
      permitido: boolean | null;
      maxAtestados?: number;
    };
    /** Art. 67 §9º: qualificação técnica via atestado de POTENCIAL SUBCONTRATADO, limitada a
     *  25% do objeto — caminho alternativo quando o acervo próprio não cobre. Opcional p/ retrocompat. */
    subcontratacao?: {
      permitida: boolean | null;
      limitePct: number | null;
    };
    aceitaAcervoConsorcio: boolean | null;
    restricaoTempoLocal: boolean | null;
    marcaSemSimilar: boolean | null;
    /** Edital exige PROPRIEDADE de equipamento/instalação (art. 67 III só admite disponibilidade). */
    exigePropriedade?: boolean | null;
    clausula: ClauseReference | null;
  };
  juridica: {
    declaracoes: string[];
    clausula: ClauseReference | null;
  };
  fiscalTrabalhista: {
    CNDs: string[];
    SICAF: boolean | null;
    clausula: ClauseReference | null;
  };
}

export type SuspicionType =
  | "PRAZO_EXIGUO"
  | "GARANTIA_PROPOSTA_ACIMA_LIMITE"
  | "QUANTITATIVO_ATESTADO_SEM_PARCELA"
  | "QUANTITATIVO_ACIMA_TETO"
  | "RESTRICAO_TEMPO_LOCAL"
  | "MARCA_SEM_SIMILAR"
  | "INDICE_ECON_FIN_SEM_JUSTIFICATIVA"
  | "VEDACAO_SOMATORIO_SEM_MOTIVO"
  | "EXIGE_PROPRIEDADE_EQUIP"
  | "PARCELA_RELEVANCIA_ABAIXO_4PCT";

export type SuspicionSeverity = "alta" | "media" | "revisao";

export interface LegalHook {
  artigo: string;
  descricao: string;
}

export interface SuspicionSignal {
  tier: 1;
  tipo: SuspicionType;
  evidenciaEdital: ClauseReference;
  hookLegal: LegalHook;
  severidade: SuspicionSeverity;
  acao: string;
  proveniencia: Grounding;
}

export const HabilitationVerdict = {
  GO: "GO",
  GO_COM_TAREFAS: "GO_COM_TAREFAS",
  PENDENTE_DADO: "PENDENTE_DADO",
  NO_GO: "NO_GO",
} as const;

export type HabilitationVerdictValue = (typeof HabilitationVerdict)[keyof typeof HabilitationVerdict];

export type HabilitationStatus =
  | "ATENDE"
  | "ATENDE_COM_RESSALVA"
  | "PARCIAL"
  | "NAO_ATENDE"
  | "INDETERMINADO";

export type Sanability = "SANAVEL" | "INSANAVEL";

export type HabilitationBlockId =
  | "tecnico_profissional"
  | "tecnico_operacional"
  | "economico_financeira"
  | "juridica_fiscal_trabalhista";

export interface HabilitationGap {
  classe: string;
  faltante: number | null;
  unidade: string | null;
  sanabilidade: Sanability;
  descricao: string;
  bloco: HabilitationBlockId;
}

export interface RequirementEvaluation {
  id: string;
  requisito: string;
  status: HabilitationStatus;
  evidencia: string[];
  proveniencia: Grounding;
  qtdMin?: number | null;
  disponivel?: number | null;
  /** Cenário conservador (apenas acervo em NOME DA EMPRESA — CAO operacional). Conclave 12/Jun:
   *  veredito único com delta condicional; tarefas derivam deste número, não da tese. */
  disponivelConservador?: number | null;
  unidade?: string | null;
  gaps: HabilitationGap[];
  tarefas: string[];
}

export interface HabilitationBlockResult {
  id: HabilitationBlockId;
  label: string;
  status: HabilitationStatus;
  eliminatorio: boolean;
  evaluations: RequirementEvaluation[];
  gaps: HabilitationGap[];
  tarefas: string[];
}

export interface ConsortiumEvaluation {
  enabled: boolean;
  aceitaPeloEdital: boolean | null;
  members: Array<{
    label: string;
    porte: CompanyIdentity["porte"];
    participacaoPct: number;
  }>;
  acrescimo30Dispensado: boolean;
  vantagemMeEpp: boolean;
  note: string;
}

export interface HabilitationResult {
  verdict: HabilitationVerdictValue;
  porBloco: Record<HabilitationBlockId, HabilitationBlockResult>;
  lacunas: HabilitationGap[];
  tarefas: string[];
  solo: {
    verdict: HabilitationVerdictValue;
    tetoSolo: number | null;
    patrimonioLiquido: number | null;
    exercicio: number | null;
  };
  consorcio: ConsortiumEvaluation | null;
  disclaimer: string;
}

// Discovery triage (Monitorar): turns a raw PNCP contratação into Vai/Olha/Pula with a reason.
export type TriageVerdict = "vai" | "olha" | "pula";

export interface DiscoveryTriage {
  verdict: TriageVerdict;
  score: number; // 0..100
  reason: string;
  daysToDeadline: number | null;
  obrasRelevant: boolean;
}

export interface ScoreInput {
  source: SourceCode;
  city: string;
  distanceKm: number;
  estimatedValue: number | null;
  proposalDeadline: string | null;
  stage: WorkflowStage;
  hasConflict: boolean;
  missingData: readonly string[];
  asOf: string;
}

export interface ScoreComponent {
  label: string;
  value: number;
  max: number;
  reason: string;
}

export interface ScoreBreakdown {
  score: number;
  components: ScoreComponent[];
}

export interface AnalysisRun {
  model: "deterministic-v0";
  opportunity: ScoreBreakdown;
  confidence: ScoreBreakdown;
  blockers: string[];
}

export function buildAnalysisRun(input: ScoreInput): AnalysisRun {
  return {
    model: "deterministic-v0",
    opportunity: calculateOpportunityScore(input),
    confidence: calculateConfidenceScore(input),
    blockers: [
      ...input.missingData.map((item) => `lacuna: ${item}`),
      ...(input.hasConflict ? ["conflito entre fontes"] : []),
    ],
  };
}

// INVARIANTE (owner 12/Jun): concorrência (market/HHI/incumbente) NÃO entra no score, na triagem
// nem em classifyAction — "concorrência tem em todo lugar, não é motivo para desclassificar".
// É contexto informativo de preço/estratégia na aba Analisar. ScoreInput não tem campo market
// de propósito; teste de contrato em noyce-checklist.test.mjs trava isso.
export function calculateOpportunityScore(input: ScoreInput): ScoreBreakdown {
  const components: ScoreComponent[] = [
    {
      label: "Raio operacional",
      value: distanceScore(input.distanceKm),
      max: 25,
      reason: `${input.city} esta a ${input.distanceKm} km da base operacional.`,
    },
    {
      label: "Valor estimado",
      value: valueScore(input.estimatedValue),
      max: 20,
      reason: input.estimatedValue === null ? "Valor ausente reduz prioridade." : "Valor permite priorizar margem e capacidade.",
    },
    {
      label: "Prazo",
      value: deadlineScore(input.proposalDeadline, input.asOf),
      max: 20,
      reason: input.proposalDeadline === null ? "Prazo ausente bloqueia decisao forte." : "Prazo conhecido permite acao operacional.",
    },
    {
      label: "Estagio",
      value: stageScore(input.stage),
      max: 15,
      reason: `Oportunidade esta no estagio ${input.stage}.`,
    },
    {
      label: "Completude",
      value: completenessScore(input.missingData),
      max: 20,
      reason: input.missingData.length ? `${input.missingData.length} lacuna(s) exigem revisao.` : "Sem lacunas criticas na fixture.",
    },
  ];

  const rawScore = sumComponents(components);
  const score = input.hasConflict ? Math.min(rawScore, 54) : rawScore;

  return {
    score,
    components,
  };
}

export function calculateConfidenceScore(input: ScoreInput): ScoreBreakdown {
  const components: ScoreComponent[] = [
    {
      label: "Fonte",
      value: sourceConfidence(input.source),
      max: 35,
      reason: sourceReason(input.source),
    },
    {
      label: "Valor",
      value: input.estimatedValue === null ? 0 : 15,
      max: 15,
      reason: input.estimatedValue === null ? "Valor nao foi extraido." : "Valor estimado esta presente.",
    },
    {
      label: "Prazo",
      value: input.proposalDeadline === null ? 0 : 15,
      max: 15,
      reason: input.proposalDeadline === null ? "Prazo nao foi extraido." : "Prazo esta presente.",
    },
    {
      label: "Lacunas",
      value: missingDataConfidence(input.missingData),
      max: 25,
      reason: input.missingData.length ? "Lacunas reduzem confianca, mas nao anulam oportunidade." : "Sem lacunas registradas.",
    },
    {
      label: "Conflito",
      value: input.hasConflict ? 0 : 10,
      max: 10,
      reason: input.hasConflict ? "Conflito exige revisao humana." : "Sem conflito entre fontes na fixture.",
    },
  ];

  return {
    score: sumComponents(components),
    components,
  };
}

export function classifyAction(
  opportunityScore: number,
  confidenceScore: number,
  hasConflict: boolean,
  hasDeadline: boolean,
): ActionLabel {
  if (hasConflict) return "revisao obrigatoria";
  if (opportunityScore >= 70 && confidenceScore >= 70) return "priorizar agora";
  if (opportunityScore >= 70 && confidenceScore < 70) return "promissora, mas incompleta";
  if (opportunityScore >= 55 && hasDeadline) return "avaliar rapido";
  return "ignorar ou revisar manualmente";
}

export function scoreHealth(score: number): "high" | "medium" | "low" {
  if (score >= 70) return "high";
  if (score >= 45) return "medium";
  return "low";
}

export function isExternalActSafelyBlocked(decision: DecisionPoint): boolean {
  if (!decision.externalActBlocked) return true;
  return decision.humanApprovalRequired && decision.externalActBlocked;
}

export function legalReviewLabel(decision: DecisionPoint): ActionLabel {
  if (decision.externalActBlocked || decision.basis === "legal_review_needed") {
    return "revisao obrigatoria";
  }
  if (decision.blockingLacunas.length > 0) return "promissora, mas incompleta";
  return "avaliar rapido";
}

function distanceScore(distanceKm: number): number {
  if (distanceKm <= 100) return 25;
  if (distanceKm <= 250) return 20;
  if (distanceKm <= 500) return 14;
  return 4;
}

function valueScore(value: number | null): number {
  if (value === null) return 0;
  if (value >= 1_000_000) return 20;
  if (value >= 500_000) return 17;
  if (value >= 200_000) return 14;
  return 10;
}

function deadlineScore(value: string | null, asOf: string): number {
  if (value === null) return 0;
  const days = Math.ceil((new Date(value).getTime() - new Date(asOf).getTime()) / 86_400_000);
  if (days < 0) return 0;
  if (days <= 3) return 10;
  if (days <= 21) return 20;
  if (days <= 45) return 14;
  return 8;
}

function stageScore(stage: WorkflowStage): number {
  if (stage === "acompanhar" || stage === "analisar") return 15;
  if (stage === "habilitar" || stage === "indicar") return 13;
  if (stage === "monitorar") return 12;
  return 10;
}

function completenessScore(missingData: readonly string[]): number {
  return Math.max(4, 20 - missingData.length * 5);
}

function sourceConfidence(source: SourceCode): number {
  if (source === "pncp" || source === "comprasgov") return 35;
  if (source === "pcp" || source === "bll" || source === "bnc" || source === "sislog") return 30;
  return 22;
}

function sourceReason(source: SourceCode): string {
  if (source === "pncp" || source === "comprasgov") return "Fonte publica/oficial com melhor rastreabilidade.";
  if (source.startsWith("candidate:")) return "Fonte candidata precisa de validacao antes de virar adapter.";
  return "Fonte conhecida, mas segue em dry-run ate vault e ToS.";
}

function missingDataConfidence(missingData: readonly string[]): number {
  return Math.max(5, 25 - missingData.length * 5);
}

function sumComponents(components: readonly ScoreComponent[]): number {
  return Math.max(0, Math.min(100, components.reduce((sum, component) => sum + component.value, 0)));
}

export function formatCurrency(value: number | null): string {
  if (value === null) return "Valor ausente";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDateTime(value: string | null): string {
  if (!value) return "Prazo ausente";
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}
