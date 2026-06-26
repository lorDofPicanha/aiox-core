// Maestro runtime — read-only Sentinela deadline derivation (Fase B.1).
//
// PURE / DETERMINISTIC: no I/O, no LLM, no Date.now() — `now` is injected. This
// layer ADAPTS the durable model (`Opportunity` + `LegalProcess`) into the
// canonical `MaestroState` (maestro-types.ts) and reads the armed preclusive
// clocks into a Sentinela watchlist. It is the bridge the orchestrator header
// calls "the future Maestro runtime": it ARMS clocks from real data; the pure
// `transition()` engine drives state changes. Nothing here mutates the data
// fixture or the deterministic pipeline.
//
// IMPORTS GOTCHA: value imports inside lib/ MUST be relative WITH `.ts` so the
// raw-`.ts` test runner (`node --experimental-strip-types`) resolves them. The
// `@/` alias does NOT resolve at runtime — only `import type` may use it. We
// keep model imports as `import type` (erased at build) and relative; the value
// imports (deadline engine, FATAL_CLOCK_KINDS, holiday calendar) are relative+`.ts`.

import type {
  Opportunity,
  LegalProcessEvent,
  LegalEventType,
  WorkflowStage,
} from "../noyce-model.ts";
import type { MaestroState, MaestroStage, PreclusiveClock, ClockKind, SessionResult, EniacOutcome } from "./maestro-types.ts";
import { FATAL_CLOCK_KINDS } from "./maestro-types.ts";
import { businessDaysDeadline, deadlineAlertLevel, timeUntil } from "../noyce-deadline.ts";
import type { DeadlineAlertLevel } from "../noyce-deadline.ts";
import type { HolidayCalendar } from "../noyce-dates.ts";
import { ensureBrOffset } from "../noyce-dates.ts";
import feriadosNacionais from "../data/feriados-nacionais.json" with { type: "json" };

const HOLIDAYS = feriadosNacionais as HolidayCalendar;

// ───────────────────────────────────────────────────────────────────────────
// WorkflowStage → MaestroStage. This is the conceptual INVERSE of
// maestroToWorkflowStage (maestro-types.ts), which is many-to-one. We pick ONE
// canonical fine-grained stage per coarse UI phase — the most representative
// "resting" stage of that phase — so deriveMaestroState yields a deterministic,
// stable MaestroState from the only durable enum the data carries today.
//
//   monitorar  → descoberto   (the entry resting state of the pré-proposta phase)
//   analisar   → analisado    (Prisma done; analysis is the substance of the phase)
//   habilitar  → habilitado   (Forja-ready resting state)
//   indicar    → entregando   (Escriba assembling the dossiê)
//   acompanhar → protocolada  (protocol confirmed; Sentinela watching the session)
//   recorrer   → avaliar-recurso-julgamento (the appeal-evaluation resting state)
// ───────────────────────────────────────────────────────────────────────────
const WORKFLOW_TO_MAESTRO: Record<WorkflowStage, MaestroStage> = {
  monitorar: "descoberto",
  analisar: "analisado",
  habilitar: "habilitado",
  indicar: "entregando",
  acompanhar: "protocolada",
  recorrer: "avaliar-recurso-julgamento",
};

export function workflowToMaestroStage(stage: WorkflowStage): MaestroStage {
  return WORKFLOW_TO_MAESTRO[stage];
}

// ───────────────────────────────────────────────────────────────────────────
// LegalEventType → ClockKind. Only PRECLUSIVE event types map to a clock; every
// other event type (publication, session_open, adjudication, …) is non-preclusive
// and produces NO clock (returns null → ignored by the arming loop).
//
//   impugnação ao edital     → impugnacao_edital
//   janela de intenção rec.  → intencao_recurso
//   prazo de razões de rec.  → razoes_recurso
//   contrarrazões            → contrarrazoes
//   diligência               → diligencia
//   prazo de proposta        → proposta
// ───────────────────────────────────────────────────────────────────────────
const PRECLUSIVE_EVENT_TO_CLOCK: Partial<Record<LegalEventType, ClockKind>> = {
  proposal_deadline: "proposta",
  appeal_intent_window: "intencao_recurso",
  appeal_reasons_deadline: "razoes_recurso",
  counterarguments_deadline: "contrarrazoes",
  diligence: "diligencia",
};

// Some editais carry an impugnação event under "clarification" (pedido de
// esclarecimento/impugnação ao edital). Kept separate so the mapping above stays
// a clean 1:1 with the unambiguous preclusive types; clarification is treated as
// impugnação ONLY when its label/eventType is explicitly the edital-impugnation.
function clockKindForEvent(event: LegalProcessEvent): ClockKind | null {
  const mapped = PRECLUSIVE_EVENT_TO_CLOCK[event.eventType];
  return mapped ?? null;
}

// M2 / C-NOVO-5: observed stays observed; everything inferred/expected/missed/
// cancelled is treated as a NON-binding "inferred" date for gate purposes — the
// UI must show "CONFIRMAR DATA", never a hard confirmed deadline.
function mapDateConfidence(status: LegalProcessEvent["status"]): PreclusiveClock["dateConfidence"] {
  return status === "observed" ? "observed" : "inferred";
}

// Resolve the dueAt instant for a clock from an event. Priority:
//   1. event.eventTime present → that IS the due instant (observed/inferred).
//   2. no eventTime, but a calculable base date + a dias-úteis rule → compute
//      with businessDaysDeadline. Today's fixture carries no such base on the
//      preclusive events without eventTime, so we conservatively return null
//      (no clock armed) rather than invent a date (I2/I5 — never chute).
// `armedBy` follows the source of the date: proposta deadline comes from the
// edital portal/publication; recurso/diligência windows are armed off the ata
// (session record). Defaults are deliberate and documented.
function resolveDueAt(event: LegalProcessEvent): string | null {
  if (event.eventTime) return ensureBrOffset(event.eventTime); // C1 — normaliza fuso na fronteira
  return null;
}

function armedByForKind(kind: ClockKind): PreclusiveClock["armedBy"] {
  if (kind === "proposta" || kind === "impugnacao_edital") return "evento_portal";
  // recurso/contrarrazões/diligência windows are armed off the session ata.
  return "ata";
}

// ───────────────────────────────────────────────────────────────────────────
// deriveMaestroState — ADAPT an Opportunity into a canonical MaestroState with
// its preclusive clocks ARMED from real data. Read-only: never mutates `opp`.
//   • stage:        workflowToMaestroStage(opp.stage)
//   • editalVersionHash: opp.id (stable, deterministic per-edital identity — I11)
//   • humanLayer / history: [] (this derivation is the pipeline's read of state,
//     not a record of human decisions or an audit replay)
//   • clocks:       proposta (from opp.proposalDeadline) + every PRECLUSIVE
//                   legalProcess event that resolves to a dueAt.
// ───────────────────────────────────────────────────────────────────────────
export function deriveMaestroState(opp: Opportunity): MaestroState {
  const clocks: PreclusiveClock[] = [];

  // Proposta clock from the durable proposalDeadline (observed when present).
  // C1 — normaliza o fuso na fronteira: proposalDeadline chega NAIVE do portal
  // ("2026-06-25T10:00:00"); sem o carimbo −03:00 o instante deslizaria com o TZ
  // do servidor (preclusão silenciosa). ensureBrOffset=null ⇒ formato inválido ⇒
  // sem clock (nunca inventa fuso — I2/I5).
  const propostaDueAt = opp.proposalDeadline ? ensureBrOffset(opp.proposalDeadline) : null;
  if (propostaDueAt) {
    clocks.push({
      kind: "proposta",
      basis: "uteis_horacheia",
      dueAt: propostaDueAt,
      armedBy: "evento_portal",
      status: "armado",
      fatalOnMiss: FATAL_CLOCK_KINDS.has("proposta"),
      dateConfidence: "observed",
    });
  }

  // Preclusive legalProcess events → clocks. Non-preclusive events are ignored.
  for (const event of opp.legalProcess.events) {
    // A2 — não armar clock fatal sobre evento que não vai mais ocorrer:
    //   "cancelled" → sessão/edital remarcado/revogado → sem clock.
    //   "missed"    → evento já passou (informativo) → sem clock fatal novo;
    //                 o miss real é tratado pelo engine via prazo_venceu, não
    //                 re-armando um alarme de algo já vencido.
    // Postura conservadora consistente com resolveDueAt/eventTime=null.
    if (event.status === "cancelled" || event.status === "missed") continue;

    const kind = clockKindForEvent(event);
    if (kind === null) continue; // non-preclusive → no clock

    // Skip the proposta event if we already armed the proposta clock from the
    // durable field (avoid a duplicate); the durable field is authoritative.
    if (kind === "proposta" && propostaDueAt) continue;

    const dueAt = resolveDueAt(event);
    if (dueAt === null) continue; // no calculable instant → never invent (I2/I5)

    clocks.push({
      kind,
      basis: "uteis_horacheia",
      dueAt,
      armedBy: armedByForKind(kind),
      status: "armado",
      fatalOnMiss: FATAL_CLOCK_KINDS.has(kind),
      dateConfidence: mapDateConfidence(event.status),
    });
  }

  return {
    stage: workflowToMaestroStage(opp.stage),
    editalVersionHash: opp.id,
    humanLayer: [],
    returnTo: null,
    history: [],
    clocks,
    waitingFor: null,
    stepFailed: null,
    openBlockingGap: false,
  };
}

// ───────────────────────────────────────────────────────────────────────────
// SentinelaAlert — the read-only output of the Sentinela for ONE armed clock.
// ───────────────────────────────────────────────────────────────────────────
export interface SentinelaAlert {
  kind: ClockKind;
  dueAt: string;
  level: DeadlineAlertLevel;
  msUntil: number; // > 0 falta tempo; <= 0 vencido (ms negativos = quanto passou)
  fatalOnMiss: boolean;
  dateConfidence: PreclusiveClock["dateConfidence"];
}

// Urgency rank: vencido (most urgent) → t-0 → t-1 → t-3 → ok (least urgent).
const LEVEL_RANK: Record<DeadlineAlertLevel, number> = {
  vencido: 0,
  "t-0": 1,
  "t-1": 2,
  "t-3": 3,
  ok: 4,
};

// ───────────────────────────────────────────────────────────────────────────
// sentinelaWatch — READ-ONLY: for every armed clock, compute its alert level and
// time remaining relative to the injected `now`. Sorted by urgency (vencido
// first); within the same level, the nearer dueAt comes first. Never mutates.
//
// Invariante M2/I3: a clock with dateConfidence:"inferred" travels through this
// output UNCHANGED — the UI is responsible for rendering "CONFIRMAR DATA" and
// must never treat it as a hard confirmed deadline.
// ───────────────────────────────────────────────────────────────────────────
export function sentinelaWatch(opp: Opportunity, nowIso: string, sessionResult?: SessionResult | null): SentinelaAlert[] {
  const state = deriveMaestroState(opp);

  const alerts: SentinelaAlert[] = state.clocks.map((clock) => ({
    kind: clock.kind,
    dueAt: clock.dueAt,
    level: deadlineAlertLevel(clock.dueAt, nowIso, { holidays: HOLIDAYS }),
    msUntil: timeUntil(clock.dueAt, nowIso).ms,
    fatalOnMiss: clock.fatalOnMiss,
    dateConfidence: clock.dateConfidence,
  }));

  // Cross-feed: o relógio PRECLUSIVO de recurso (razões/contrarrazões) derivado do resultado
  // da sessão também entra na vigilância única do Sentinela (não só na aba Recorrer).
  if (sessionResult) {
    const fc = buildRecursoPlan(sessionResult).fatalClock;
    if (fc) {
      alerts.push({
        kind: fc.kind,
        dueAt: fc.dueAt,
        level: deadlineAlertLevel(fc.dueAt, nowIso, { holidays: HOLIDAYS }),
        msUntil: timeUntil(fc.dueAt, nowIso).ms,
        fatalOnMiss: true,
        dateConfidence: sessionResult.confidence,
      });
    }
  }

  return alerts.sort((a, b) => {
    const rankDelta = LEVEL_RANK[a.level] - LEVEL_RANK[b.level];
    if (rankDelta !== 0) return rankDelta;
    // Same level → earlier dueAt first.
    return new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime();
  });
}

// Human-readable PT-BR label per clock kind, for the UI panel.
export function clockKindLabel(kind: ClockKind): string {
  switch (kind) {
    case "proposta":
      return "Prazo de proposta";
    case "impugnacao_edital":
      return "Impugnação ao edital";
    case "intencao_recurso":
      return "Intenção de recurso";
    case "razoes_recurso":
      return "Razões de recurso";
    case "contrarrazoes":
      return "Contrarrazões";
    case "diligencia":
      return "Diligência";
    case "empate_ficto":
      return "Empate ficto ME/EPP";
    default: {
      const _never: never = kind;
      return String(_never);
    }
  }
}

// ───────────────────────────────────────────────────────────────────────────
// RECORRER (estágio 6) — a dor #1 do cliente: perder, e o sistema NÃO deixar
// recorrer a tempo. A partir do RESULTADO da sessão (SessionResult), deriva o
// CAMINHO + arma o relógio PRECLUSIVO de razões/contrarrazões (3 dias úteis,
// art. 165 Lei 14.133 — conferir modalidade/edital). PURO/determinístico.
// Invariante: todo ato vinculante (intenção, protocolo, assinatura) é HUMANO.
// ───────────────────────────────────────────────────────────────────────────
export interface RecursoStep {
  label: string;
  dueAt: string | null; // ISO quando há prazo preclusivo; null = sem data calculável
  basis: string;
  humanAct: boolean; // ato vinculante → sempre humano (nunca automatizado)
  note: string;
}
export interface RecursoPlan {
  outcome: EniacOutcome;
  path:
    | "recorrer_inabilitacao"
    | "recorrer_julgamento"
    | "recorrer_desclassificacao"
    | "defender_vitoria"
    | "cobrir_lance_meepp"
    | "indefinido";
  title: string;
  resumo: string;
  steps: RecursoStep[];
  fatalClock: { kind: "razoes_recurso" | "contrarrazoes"; dueAt: string; label: string } | null;
}

const RECURSO_DIAS_UTEIS = 3; // art. 165, Lei 14.133/2021 (conferir modalidade/edital)

export function buildRecursoPlan(r: SessionResult, opts: { recursoBusinessDays?: number } = {}): RecursoPlan {
  const dias = opts.recursoBusinessDays ?? RECURSO_DIAS_UTEIS;
  const razoesDueAt = businessDaysDeadline(r.sessionAt, dias, { holidays: HOLIDAYS });

  const recorrer = (path: RecursoPlan["path"], title: string): RecursoPlan => ({
    outcome: r.eniacOutcome,
    path,
    title,
    resumo: `${r.motivo ? r.motivo + ". " : ""}Razões de recurso: ${dias} dias úteis da sessão (art. 165, Lei 14.133/2021 — conferir modalidade/edital).`,
    steps: [
      { label: "Manifestar INTENÇÃO de recorrer", dueAt: r.sessionAt, basis: "na sessão / imediata", humanAct: true, note: "Ato preclusivo NA SESSÃO — sem intenção tempestiva, perde o direito de recorrer." },
      { label: "Protocolar RAZÕES de recurso", dueAt: razoesDueAt, basis: `${dias} dias úteis (hora-cheia)`, humanAct: true, note: "Noyce prepara a minuta (Tribuno); advogado/representante revisa, assina e protocola." },
    ],
    fatalClock: { kind: "razoes_recurso", dueAt: razoesDueAt, label: "Razões de recurso" },
  });

  switch (r.eniacOutcome) {
    case "vencedora": {
      const tpw = r.thirdPartyAppealWindow ?? null;
      return {
        outcome: r.eniacOutcome,
        path: "defender_vitoria",
        title: "Vencedora — defender a posição",
        resumo: "Acompanhar recurso de terceiros; havendo, apresentar CONTRARRAZÕES no prazo. Sem recurso → homologação.",
        steps: [
          { label: "Monitorar recurso de terceiros", dueAt: tpw?.dueAt ?? null, basis: tpw ? "janela de terceiros" : "aguardar intimação", humanAct: false, note: "Sentinela vigia a janela; se um terceiro recorrer, arma as contrarrazões." },
          { label: "Apresentar CONTRARRAZÕES (se houver recurso)", dueAt: tpw?.dueAt ?? null, basis: `${dias} dias úteis da intimação`, humanAct: true, note: "Noyce prepara; advogado revisa, assina e protocola." },
        ],
        fatalClock: tpw ? { kind: "contrarrazoes", dueAt: tpw.dueAt, label: "Contrarrazões" } : null,
      };
    }
    case "inabilitada":
      return recorrer("recorrer_inabilitacao", "Inabilitada — recorrer da habilitação");
    case "derrotada_julgamento":
      return recorrer("recorrer_julgamento", "Derrotada no julgamento — recorrer");
    case "desclassificada":
      return recorrer("recorrer_desclassificacao", "Desclassificada — recorrer");
    case "empate_ficto_meepp":
      return {
        outcome: r.eniacOutcome,
        path: "cobrir_lance_meepp",
        title: "Empate ficto ME/EPP — cobrir o lance",
        resumo: "Direito de preferência ME/EPP (LC 123/2006): cobrir a melhor proposta NA SESSÃO.",
        steps: [{ label: "Cobrir o lance (preferência ME/EPP)", dueAt: r.sessionAt, basis: "na sessão / imediata", humanAct: true, note: "Ato na sessão — preclusivo." }],
        fatalClock: null,
      };
    case "indefinido":
    default:
      return {
        outcome: r.eniacOutcome,
        path: "indefinido",
        title: "Resultado indefinido",
        resumo: "Aguardando ata/resultado da sessão. Sem desfecho, não há caminho de recurso definido.",
        steps: [{ label: "Obter ata/resultado da sessão", dueAt: null, basis: "—", humanAct: true, note: "Sem o resultado, o Noyce não arma o relógio de recurso." }],
        fatalClock: null,
      };
  }
}
