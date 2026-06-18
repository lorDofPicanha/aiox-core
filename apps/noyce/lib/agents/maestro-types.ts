// Maestro — canonical orchestration types (Fase A / F0).
//
// Single source of truth for the per-edital state machine described in doc 32
// (§11 máquina de estados v2 + §13 patch C1–C4 + C-NOVO). These types resolve
// the foundation finding F0 (pedro-valerio §10.0): before this file, the only
// state enum was `WorkflowStage` (6 coarse UI phases) which is INCOMPATIBLE with
// the fine-grained legal lifecycle the Maestro must drive.
//
// IMPORTS GOTCHA: value imports inside lib/ MUST be relative WITH `.ts` so the
// raw-`.ts` test runner (`node --experimental-strip-types`) resolves them. The
// `@/` alias does NOT resolve at runtime. Only `import type` may use `@/`. Here
// we only `import type` from the model, so it stays relative + `.ts` too (the
// project convention — see triage-agent.ts).

import type { WorkflowStage } from "../noyce-model.ts";

// ───────────────────────────────────────────────────────────────────────────
// MaestroStage — the canonical, fine-grained per-edital state (§11.0 + §13).
// String-literal union taken EXACTLY from the contract; do not reorder/rename.
// ───────────────────────────────────────────────────────────────────────────
export type MaestroStage =
  // pré-proposta
  | "descoberto"
  | "triado"
  | "analisado"
  | "impugnacao-edital"
  // habilitação / espera de dado
  | "aguardando-dado"
  | "habilitado"
  | "entregando"
  | "pronto-protocolo"
  // sessão
  | "protocolada"
  | "em-sessao"
  | "em-diligencia"
  | "aguardando-resultado"
  // ganhou (NÃO-terminal — I10)
  | "vencedora-provisoria"
  | "defendendo-vitoria"
  // perdeu (B2 — dois relógios distintos)
  | "avaliar-recurso-inabilitacao"
  | "avaliar-recurso-julgamento"
  | "recurso-protocolado"
  // terminais
  | "vencido"
  | "arquivado"
  | "arquivado-motivo"
  | "prazo-perdido"
  | "encerrado-sem-recurso"
  // pseudo-terminal: exige re-triagem humana (B5/C1)
  | "congelado-edital-mudou";

// Set of TERMINAL stages (no outgoing transition except, for the pseudo-terminal,
// the explicit human re-triage). Used by the engine to reject any event that
// would move a settled edital.
export const TERMINAL_STAGES: ReadonlySet<MaestroStage> = new Set<MaestroStage>([
  "vencido",
  "arquivado",
  "arquivado-motivo",
  "prazo-perdido",
  "encerrado-sem-recurso",
]);

// ───────────────────────────────────────────────────────────────────────────
// PreclusiveClock — a legal deadline being watched (§11.3 + C1 + C-NOVO-5).
// `fatalOnMiss` (C1) discriminates a true preclusive miss (→ prazo-perdido /
// ramp terminal) from a non-fatal miss (→ step_failed alert, state stays).
// `dateConfidence` (C-NOVO-5) lets a gate refuse to be "hard" over an inferred
// date (M2): inferred → "CONFIRMAR DATA", never a binding gate.
// ───────────────────────────────────────────────────────────────────────────
export type ClockKind =
  | "impugnacao_edital"
  | "intencao_recurso"
  | "razoes_recurso"
  | "contrarrazoes"
  | "diligencia"
  | "empate_ficto"
  | "proposta";

export type ClockBasis = "corridos" | "uteis_horacheia";

export interface PreclusiveClock {
  kind: ClockKind;
  basis: ClockBasis; // recurso = dias úteis + hora-cheia (I4)
  dueAt: string; // ISO datetime
  armedBy: "dataSessao" | "ata" | "evento_portal"; // I9 — proativo, não só reativo
  status: "armado" | "alertado" | "vencido" | "cumprido";
  fatalOnMiss: boolean; // C1 — true ⇒ miss leva a estado terminal; false ⇒ alerta + estado permanece
  dateConfidence: "observed" | "inferred"; // C-NOVO-5/M2 — gate duro só sobre observed
}

// Which clock kinds are preclusive-fatal by nature (C1). The engine sets
// `fatalOnMiss` from this when arming clocks, but the field is authoritative
// per-clock (a portal-confirmed extension could flip a specific clock).
export const FATAL_CLOCK_KINDS: ReadonlySet<ClockKind> = new Set<ClockKind>([
  "proposta",
  "impugnacao_edital",
  "intencao_recurso",
  "razoes_recurso",
  "contrarrazoes",
  "empate_ficto",
]);
// `diligencia` is NOT fatal by default: an internal diligence still answerable
// → step_failed + alerta, never edital death (C1).

// ───────────────────────────────────────────────────────────────────────────
// SessionResult — what happened in the session (§11.3). The outcome drives the
// branch out of `em-sessao`. `confidence` (M2) gates whether downstream clocks
// arm hard gates. `inabilitada` vs `derrotada_julgamento` are distinct (B2).
// ───────────────────────────────────────────────────────────────────────────
export type EniacOutcome =
  | "vencedora"
  | "inabilitada"
  | "derrotada_julgamento"
  | "empate_ficto_meepp"
  | "desclassificada"
  | "indefinido";

export interface SessionResult {
  editalId: string;
  editalVersionHash: string;
  sessionAt: string; // ISO datetime hora-cheia (I4)
  eniacOutcome: EniacOutcome;
  motivo?: string; // por que (com fonte — I3)
  winner?: { cnpj: string; nome: string; preco: number } | null;
  thirdPartyAppealWindow?: PreclusiveClock; // B3 — janela de terceiros
  source: "ata_upload" | "portal" | "manual";
  confidence: "observed" | "inferred"; // M2
}

// ───────────────────────────────────────────────────────────────────────────
// HumanDecision — the append-only, pipeline-immutable human layer (I6/§11.4).
// Any non-empty humanLayer puts the edital in scheduler-read-only mode.
// ───────────────────────────────────────────────────────────────────────────
export type HumanDecisionKind =
  | "aprovou_dossie"
  | "confirmou_protocolo"
  | "intend_to_appeal"
  | "do_not_appeal"
  | "aprovou_minuta"
  | "rejeitou"
  | "corrigir"
  | "cadastrou_parceiro"
  | "forneceu_dado"
  | "respondeu_diligencia"
  | "retriou_edital"
  | "cobriu_lance"; // empate ficto ME/EPP (A3)

export interface HumanDecision {
  kind: HumanDecisionKind;
  at: string; // ISO datetime
  by: string; // role/owner (e.g. "operador-eniac", "advogado")
  // For confirmou_protocolo (B1): the data/hora + nº processo that ARMS Sentinela.
  payload?: {
    numeroProcesso?: string;
    protocolAt?: string;
    editalVersionHash?: string; // for retriou_edital (C1)
    note?: string;
  };
}

// ───────────────────────────────────────────────────────────────────────────
// StageTransition — audit trail (Lastro). history[] is append-only.
// `returnTo` MUST NOT be inferred from history (C2) — it lives on MaestroState.
// ───────────────────────────────────────────────────────────────────────────
export interface StageTransition {
  from: MaestroStage;
  to: MaestroStage;
  event: MaestroEvent["type"];
  at: string; // ISO datetime
  // Provenance: deterministic pipeline vs human-driven.
  actor: "pipeline" | "scheduler" | "human";
  note?: string;
}

// What `aguardando-dado` is actually waiting for (C3). Closed enum, extensible;
// selects deterministically the exit event + which agent re-runs.
export type WaitingFor =
  | "analise"
  | "parceiro_consorcio"
  | "certidao"
  | "balanco"
  | "atestado";

// ───────────────────────────────────────────────────────────────────────────
// MaestroState — the durable per-edital state (§11.0 + C2 + C3).
// ───────────────────────────────────────────────────────────────────────────
export interface MaestroState {
  stage: MaestroStage;
  editalVersionHash: string; // I11/A7 — idempotência por VERSÃO do edital
  humanLayer: HumanDecision[]; // I6 — APPEND-ONLY, imutável pelo pipeline
  returnTo: MaestroStage | null; // C2 — destino determinístico ao sair de em-diligencia
  history: StageTransition[]; // auditoria (Lastro)
  clocks: PreclusiveClock[]; // I4/I9 — relógios preclusivos ativos
  // Discriminator for aguardando-dado (C3); null when not in that state.
  waitingFor?: WaitingFor | null;
  // Set when a non-fatal clock missed (M1/I5): estado permanece, alerta CRÍTICO.
  stepFailed?: { reason: string; at: string } | null;
}

// ───────────────────────────────────────────────────────────────────────────
// MaestroEvent — the discriminated union of events that drive transitions.
// Derived from the §11.1 diagram. Each event carries the minimum data the
// guards need. Scheduler-origin (deterministic) events are flagged via `actor`
// in the transition ctx, not on the event itself.
// ───────────────────────────────────────────────────────────────────────────

// Faro triage outcome.
export type TriageOutcome = "vai" | "olha" | "pula";

// The 4 REAL habilitation verdicts (C4) — NO "CONSORCIO" verdict exists.
export type HabilitationVerdictLike = "GO" | "GO_COM_TAREFAS" | "PENDENTE_DADO" | "NO_GO";

export type MaestroEvent =
  // descoberto → triado
  | { type: "faro_triou"; verdict: TriageOutcome }
  // analisado branches (Prisma)
  | { type: "prisma_analisou"; ok: boolean; confiancaBelowPiso?: boolean }
  | { type: "suspeicao_alta"; clock: PreclusiveClock } // → impugnacao-edital (B6)
  // habilitado branches (Forja) — ramifica pelos 4 verdicts REAIS (C4)
  | {
      type: "forja_veredito";
      verdict: HabilitationVerdictLike;
      // C4(i): consórcio derivado, NÃO um verdict
      consorcioRota?: boolean; // NO_GO/PENDENTE_DADO + aceitaPeloEdital + needsConsorcioPartner
      // C4(ii): gaps sanáveis bloqueantes ainda abertos (alimenta o veto de pronto-protocolo)
      gapsSanaveisBloqueantesAbertos?: boolean;
    }
  // aguardando-dado exits (C3) — discriminated by waitingFor
  | { type: "parceiro_cadastrado" } // sai de aguardando-dado(parceiro_consorcio) → habilitado (A5)
  | { type: "dado_recebido"; waitingFor: WaitingFor } // sai de aguardando-dado(analise/certidao/...)
  // Escriba gate (humano duro)
  | { type: "humano_aprovou_dossie" } // entregando → pronto-protocolo
  // B1 — humano confirma protocolo (arma Sentinela)
  | { type: "humano_confirmou_protocolo"; numeroProcesso: string; protocolAt: string }
  // protocolada → em-sessao (Sentinela arma relógio pela dataSessao)
  | { type: "sentinela_armou_sessao"; clock: PreclusiveClock }
  // em-sessao → ingestão de resultado
  | { type: "sessao_resultado"; result: SessionResult }
  // diligência (B4) — abre de em-sessao OU de habilitado; retorno por returnTo (C2)
  | { type: "pregoeiro_abriu_diligencia"; clock: PreclusiveClock }
  | { type: "respondeu_diligencia" }
  // vencedora-provisoria → vigia janela de terceiros (B3/I10)
  | { type: "homologacao_sem_recurso" } // → vencido (terminal)
  | { type: "terceiro_recorreu"; clock: PreclusiveClock } // → defendendo-vitoria
  // defendendo-vitoria saída (C-NOVO-3)
  | { type: "recurso_terceiro_negado" } // + homologação → vencido
  | { type: "recurso_terceiro_provido" } // ENIAC perde a posição → avaliar-recurso-julgamento
  // avaliar-recurso-* (Tribuno)
  | { type: "tribuno_sem_fundamento" } // → encerrado-sem-recurso (honesto)
  | { type: "tribuno_com_fundamento" } // → minuta (gate advogado) → recurso-protocolado
  | { type: "humano_aprovou_minuta" } // gate advogado fecha → recurso-protocolado
  // impugnacao-edital — gate advogado
  | { type: "humano_aprovou_impugnacao" } // protocolada impugnação → segue (volta a analisado/triado conforme desenho)
  // edital mudou (B5/I11) — de QUALQUER estado
  | { type: "evento_edital_mudou"; tipo: "republicacao" | "suspensao" | "revogacao" | "remarcacao" }
  // congelado → re-triagem humana (C1) — único caminho de volta
  | { type: "humano_retriou_edital"; novoEditalVersionHash: string }
  // relógio venceu (A4/I12) — fatal ⇒ prazo-perdido; não-fatal ⇒ step_failed
  | { type: "prazo_venceu"; clockKind: ClockKind }
  // descarte explícito (triagem Pula / NO_GO sem rota)
  | { type: "arquivar"; motivo?: string };

// ───────────────────────────────────────────────────────────────────────────
// TransitionResult — engine output. Deterministic, never throws on a bad path:
// a forbidden transition returns { ok: false, reason }.
// ───────────────────────────────────────────────────────────────────────────
export type TransitionResult =
  | { ok: true; next: MaestroState }
  | { ok: false; reason: string };

// Context passed to transition(). `actor` decides scheduler-read-only behaviour
// (I6/§11.4): a scheduler (deterministic) event over a human-locked edital may
// only add an alert, never change stage. `now` keeps the function pure/testable.
export interface TransitionCtx {
  actor: "pipeline" | "scheduler" | "human";
  now: string; // ISO datetime
}

// ───────────────────────────────────────────────────────────────────────────
// HUMAN_REQUIRED_ACTS ampliado (I1 / C-NOVO-6). The runtime constant lives in
// noyce-source-registry.ts (today: lance/declaracao/proposta/recurso). The
// orchestrator-level binding acts add the three acts the v2 design introduced.
// Exposed here so the gate logic + tests reference a single list. Ampliar a
// constante real do registry é tarefa separada da Fase A (documentado no TODO).
// ───────────────────────────────────────────────────────────────────────────
export const MAESTRO_BINDING_ACTS = [
  "lance",
  "declaracao",
  "proposta",
  "recurso",
  "contrarrazoes",
  "impugnacao_edital",
  "resposta_diligencia",
] as const;
export type MaestroBindingAct = (typeof MAESTRO_BINDING_ACTS)[number];

// ───────────────────────────────────────────────────────────────────────────
// maestroToWorkflowStage — explicit mapping to the coarse 6-phase UI enum
// (§11.0). The UI keeps WorkflowStage; the Maestro operates on the fine grain.
// This mapping is the ONLY bridge — do not derive UI state any other way.
// ───────────────────────────────────────────────────────────────────────────
export function maestroToWorkflowStage(stage: MaestroStage): WorkflowStage {
  switch (stage) {
    case "descoberto":
    case "triado":
      return "monitorar";
    case "analisado":
    case "impugnacao-edital":
      return "analisar";
    case "aguardando-dado":
    case "habilitado":
      return "habilitar";
    case "entregando":
    case "pronto-protocolo":
      return "indicar";
    case "protocolada":
    case "em-sessao":
    case "em-diligencia":
    case "aguardando-resultado":
    case "vencedora-provisoria":
    case "defendendo-vitoria":
      return "acompanhar";
    case "avaliar-recurso-inabilitacao":
    case "avaliar-recurso-julgamento":
    case "recurso-protocolado":
      return "recorrer";
    // terminais + pseudo-terminal: mapeiam para a fase semântica mais próxima
    case "vencido":
    case "congelado-edital-mudou":
      return "acompanhar";
    case "arquivado":
    case "arquivado-motivo":
    case "prazo-perdido":
      return "monitorar";
    case "encerrado-sem-recurso":
      return "recorrer";
    default: {
      // Exhaustiveness guard: if a MaestroStage is added without mapping,
      // TypeScript flags this line.
      const _never: never = stage;
      return _never;
    }
  }
}

// Helper: create a fresh MaestroState at the discovery stage.
export function initialMaestroState(editalVersionHash: string): MaestroState {
  return {
    stage: "descoberto",
    editalVersionHash,
    humanLayer: [],
    returnTo: null,
    history: [],
    clocks: [],
    waitingFor: null,
    stepFailed: null,
  };
}
