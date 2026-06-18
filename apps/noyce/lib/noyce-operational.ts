import type { DecisionPoint, DiscoveryTriage, Opportunity, TriageVerdict } from "@/lib/noyce-model";
import { MAX_DISCOVERY_RADIUS_KM, NEAR_RADIUS_KM } from "./noyce-source-registry.ts";

// Operational logic moved out of the page (god-component) so it is pure + testable,
// and the actionability layer (buildNextStep / describeLacuna / legalDecisionAction) that
// turns passive labels into concrete actions: verb + object + owner + deadline + why.

// Legacy fixture anchor — kept only for tests that pin a deterministic "as of".
// Production deadline math uses the REAL current date (see daysUntil/nowIso), so the
// Mesa/Monitorar "faltam X dias" reflects today, not a frozen snapshot era.
export const REFERENCE_DATE = "2026-05-23T00:00:00Z";
export type OperationalTone = "ready" | "review" | "blocked";

// The "as of" clock for deadline math. Defaults to the real current date so the app
// never labels an already-closed edital as open; injectable for deterministic tests.
export function nowIso(): string {
  return new Date().toISOString();
}

export interface OperationalState {
  label: string;
  tone: OperationalTone;
}

export interface NextAction {
  headline: string; // imperative — what to do
  owner: string; // who does it
  deadline: string | null; // ISO of the proposal deadline, when known
  why: string; // the reason / consequence
  tone: OperationalTone;
}

export interface LacunaTask {
  key: string;
  label: string;
  action: string;
  owner: string;
  blocking: boolean;
  impact: string;
}

export interface DecisionAction {
  action: string;
  owner: string;
  externalBlocked: boolean;
  note: string;
}

export function deadlineTime(value: string | null): number {
  return value ? new Date(value).getTime() : Number.MAX_SAFE_INTEGER;
}

export function daysUntil(value: string | null, asOf: string = nowIso()): number {
  if (!value) return Number.MAX_SAFE_INTEGER;
  return Math.ceil((new Date(value).getTime() - new Date(asOf).getTime()) / 86_400_000);
}

// True when the proposal deadline has already passed relative to `asOf` (real now by
// default). Use to keep closed editais out of "open opportunity" surfaces.
export function isDeadlinePassed(value: string | null, asOf: string = nowIso()): boolean {
  if (!value) return false;
  return new Date(value).getTime() < new Date(asOf).getTime();
}

export function formatShortDate(iso: string | null): string {
  if (!iso) return "sem prazo";
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit" }).format(new Date(iso));
}

export function sourceLabel(source: string): string {
  if (source.startsWith("candidate:")) return "CAND";
  return source.toUpperCase();
}

export function sourceClass(source: string): string {
  if (source.startsWith("candidate:")) return "candidate";
  return source;
}

export function operationalState(opportunity: Opportunity): OperationalState {
  if (opportunity.analysisRun.blockers.length > 0 || opportunity.confidenceScore < 70) {
    return { label: "Bloqueada por evidência", tone: "blocked" };
  }
  if (opportunity.opportunityScore >= 70 && opportunity.confidenceScore >= 70) {
    return { label: "Pronta para proposta", tone: "ready" };
  }
  return { label: "Revisão rápida", tone: "review" };
}

export function operationalBlockers(opportunity: Opportunity): string[] {
  const blockers = [
    ...opportunity.analysisRun.blockers,
    ...(opportunity.confidenceScore < 70 ? ["confianca abaixo do minimo"] : []),
    ...(daysUntil(opportunity.proposalDeadline) <= 14 ? ["prazo operacional proximo"] : []),
  ];
  return blockers.length ? blockers : ["sem bloqueio critico"];
}

// Maps a raw missingData key (machine token) into a concrete task with owner + impact.
export function describeLacuna(key: string): LacunaTask {
  const map: Record<string, Omit<LacunaTask, "key">> = {
    anexos_tecnicos: {
      label: "Anexos técnicos",
      action: "Baixar os anexos técnicos no portal e anexar ao dossiê",
      owner: "Engenharia ENIAC",
      blocking: true,
      impact: "Sem eles a qualificação técnica é reprovada.",
    },
    visita_tecnica: {
      label: "Visita técnica",
      action: "Agendar a visita técnica no órgão e emitir o atestado de visita",
      owner: "Engenharia ENIAC",
      blocking: true,
      impact: "Exigência do edital; a ausência pode inabilitar a proposta.",
    },
    ata: {
      label: "Ata da sessão anterior",
      action: "Baixar a ata da sessão anterior no portal",
      owner: "Operação ENIAC",
      blocking: false,
      impact: "Valida histórico de preço; sua ausência segura a confiança.",
    },
    contrato_anterior: {
      label: "Contrato anterior de referência",
      action: "Anexar o contrato anterior de referência",
      owner: "Operação ENIAC",
      blocking: false,
      impact: "Referência de preço/escopo; reduz a confiança se faltar.",
    },
  };
  const entry = map[key];
  if (entry) return { key, ...entry };
  return {
    key,
    label: key.replace(/_/g, " "),
    action: "Resolver a pendência no portal e registrar no dossiê",
    owner: "Operação ENIAC",
    blocking: false,
    impact: "Pendência registrada; revisar antes da decisão.",
  };
}

export function lacunaTasks(opportunity: Opportunity): LacunaTask[] {
  return opportunity.missingData.map(describeLacuna);
}

// The decision-summary / card "next step" — parametrized from real fields, not a fixed label.
export function buildNextStep(opportunity: Opportunity): NextAction {
  const deadline = opportunity.proposalDeadline;
  const days = daysUntil(deadline);
  const isBlocked = opportunity.analysisRun.blockers.length > 0 || opportunity.confidenceScore < 70;

  if (isBlocked) {
    const tasks = lacunaTasks(opportunity);
    const blocking = tasks.filter((task) => task.blocking);
    const list = tasks.length ? tasks.map((task) => task.label).join(" e ") : "as pendências de evidência";
    const lead = blocking[0] ?? tasks[0];
    const blockerNote = opportunity.analysisRun.blockers.length
      ? ` ${opportunity.analysisRun.blockers.length} bloqueio(s) no run.`
      : "";
    return {
      headline: `Feche ${tasks.length || "as"} lacuna(s) antes de decidir: ${list}.`,
      owner: lead?.owner ?? "Operação ENIAC",
      deadline,
      why: `Confiança em ${opportunity.confidenceScore}% (mínimo 70).${blockerNote}`.trim(),
      tone: "blocked",
    };
  }

  if (opportunity.opportunityScore >= 70 && opportunity.confidenceScore >= 70) {
    return {
      headline: deadline
        ? `Monte a proposta agora — prazo ${formatShortDate(deadline)} (${days} dias).`
        : "Monte a proposta agora.",
      owner: "Comercial ENIAC",
      deadline,
      why: "Fontes convergem e score/confiança ≥ 70 sustentam ação imediata.",
      tone: "ready",
    };
  }

  return {
    headline: `Valide o critério crítico antes de avançar${deadline ? ` — prazo ${formatShortDate(deadline)}` : ""}.`,
    owner: "Operação ENIAC",
    deadline,
    why: "Há sinal positivo, mas falta uma checagem curta para uma decisão forte.",
    tone: "review",
  };
}

const DECISION_OWNER: Record<string, string> = {
  prepare_documents: "Engenharia ENIAC",
  ask_clarification: "Operação ENIAC",
  continue_bid: "Comercial ENIAC",
  stop_bid: "Operação ENIAC",
  request_diligence_review: "Revisão jurídica humana",
  manifest_appeal_intent: "Operação ENIAC",
  draft_appeal_reasons: "Revisão jurídica humana",
  submit_counterarguments: "Revisão jurídica humana",
  ignore: "Operação ENIAC",
};

// ── Discovery triage (Monitorar) ──────────────────────────────────────────
const TRIAGE_TODAY = "2026-05-29T00:00:00Z";
// ENIAC disputes obras/engenharia (CNAE 41/42/43) — relevance gate for the inbox.
const OBRAS_RE =
  /\b(obra|engenharia|constru|reforma|pavimenta|drenagem|edifica|recupera|amplia|infraestrutura|calcada|calçada|ponte|terraplan|saneamento|esgoto|asfalt|recapeament|revitaliz|urbaniza|cobertura|quadra|praca|praça|reservatóri|reservatori|galeria|meio[- ]fio|escola|creche|ubs)/i;

export interface TriageInput {
  title: string;
  distanceKm: number;
  estimatedValue: number | null;
  proposalDeadline: string | null;
}

// Turns a raw contratação into a Vai/Olha/Pula verdict with a human reason — the Monitorar product.
// maxRadiusKm defaults to the operational radius (MAX_DISCOVERY_RADIUS_KM); overridable so the
// raio is reescopável sem nova story e testável (Story 30.5 AC4).
export function buildTriage(
  input: TriageInput,
  opts: { maxRadiusKm?: number } = {},
): DiscoveryTriage {
  const maxRadiusKm = opts.maxRadiusKm ?? MAX_DISCOVERY_RADIUS_KM;
  const obrasRelevant = OBRAS_RE.test(input.title || "");
  const days =
    input.proposalDeadline !== null
      ? Math.ceil((new Date(input.proposalDeadline).getTime() - new Date(TRIAGE_TODAY).getTime()) / 86_400_000)
      : null;
  const closed = days !== null && days < 0;
  const valueOk = input.estimatedValue === null || (input.estimatedValue >= 80_000 && input.estimatedValue <= 8_000_000);
  const near = input.distanceKm <= NEAR_RADIUS_KM;
  const within = input.distanceKm <= maxRadiusKm;

  let score = 0;
  if (obrasRelevant) score += 45;
  score += near ? 25 : within ? 12 : 0;
  score += valueOk ? 15 : 5;
  if (days === null) score += 7;
  else if (days >= 5) score += 15;
  else if (days >= 1) score += 9;
  score = Math.max(0, Math.min(100, score));

  let verdict: TriageVerdict;
  let reason: string;
  if (closed) {
    verdict = "pula";
    reason = `Prazo encerrado há ${Math.abs(days as number)} dia(s).`;
    score = Math.min(score, 20);
  } else if (!obrasRelevant) {
    verdict = "pula";
    reason = "Objeto fora de obras/engenharia (perfil ENIAC).";
    score = Math.min(score, 25);
  } else if (!within) {
    verdict = "pula";
    reason = `Fora do raio operacional (${input.distanceKm} km — acima de ${maxRadiusKm} km).`;
  } else if (near && valueOk && (days === null || days >= 3)) {
    verdict = "vai";
    reason = `Obra a ${input.distanceKm} km${days !== null ? `, ${days} dia(s) p/ proposta` : ", prazo a confirmar"}${input.estimatedValue ? ", valor na faixa" : ""}.`;
  } else {
    verdict = "olha";
    const why: string[] = [];
    // 171..maxRadiusKm: longe mas dentro do raio → revisão humana (Story 30.5 AC2).
    if (!near) why.push(`distância ${input.distanceKm} km — verificar viabilidade operacional antes de prosseguir`);
    if (!valueOk) why.push("valor fora da faixa típica");
    if (days !== null && days < 3) why.push(`prazo curto (${days}d)`);
    reason = `Obra, mas checar: ${why.join("; ") || "detalhes do edital"}.`;
  }
  return { verdict, score, reason, daysToDeadline: days, obrasRelevant };
}

// Story 30.1 (AC4) — sugestão de parceiro de consórcio. Retorna true quando o edital PERMITE
// consórcio (permiteConsorcio === true) E a habilitação SOLO tem um bloco TÉCNICO com status
// NAO_ATENDE (lacuna técnica que a empresa não fecha sozinha). Não-bloqueante: apenas sinaliza
// que cadastrar uma empresa parceira no Vault destravaria a análise. null/false ⇒ false.
export function needsConsorcioPartner(opportunity: Opportunity): boolean {
  if (opportunity.permiteConsorcio !== true) return false;
  const porBloco = opportunity.habilitationResult?.porBloco;
  if (!porBloco) return false;
  const tecnico = [porBloco.tecnico_profissional, porBloco.tecnico_operacional];
  return tecnico.some((bloco) => bloco?.status === "NAO_ATENDE");
}

// Renders the real recommended action (not the legalReviewLabel tag) with owner + consequence.
export function legalDecisionAction(decision: DecisionPoint): DecisionAction {
  return {
    action: decision.recommendedAction,
    owner: DECISION_OWNER[decision.decisionType] ?? "Operação ENIAC",
    externalBlocked: decision.externalActBlocked,
    note: decision.externalActBlocked
      ? "Ato externo bloqueado por design — você decide e protocola no portal; Noyce só organiza o critério."
      : decision.blockingLacunas.length
        ? `Pendente antes de avançar: ${decision.blockingLacunas.join(", ")}.`
        : "Preparo interno; sem ato externo.",
  };
}
