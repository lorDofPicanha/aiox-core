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
  status: "publico" | "aguarda_vault" | "dry_run";
  requiresLogin: boolean;
  requires2fa: "unknown" | "yes" | "no";
  tosStatus: "ok" | "pending" | "unknown";
}

export interface Opportunity {
  id: string;
  source: SourceCode;
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
  priceReferences: Array<{
    label: string;
    value: number | null;
    note: string;
    confidence: ConfidenceLevel;
  }>;
  habilitationChecklist: Array<{
    label: string;
    status: "ok" | "warning" | "missing";
    note: string;
  }>;
  competitors: Array<{
    name: string;
    level: "confirmed" | "probable" | "possible" | "no_evidence";
    note: string;
  }>;
  timeline: Array<{
    label: string;
    date: string;
    status: "done" | "open" | "missing" | "risk";
  }>;
  legalProcess: LegalProcess;
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
