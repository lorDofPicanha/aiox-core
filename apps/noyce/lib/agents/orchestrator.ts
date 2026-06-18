// Maestro — the deterministic orchestrator (Fase A).
//
// `transition(state, event, ctx)` is a PURE function: deterministic, NO LLM,
// NO I/O, no Date.now() (time comes from ctx.now). It encodes the entire state
// machine of doc 32 §11.1 + the §13 patch (C1–C4 + C-NOVO). A forbidden path
// NEVER throws — it returns { ok: false, reason }. This is the seam the §10.7 /
// §13.1 negative tests assert against.
//
// IMPORTS GOTCHA: value imports relative + `.ts` (raw-`.ts` test runner; `@/`
// does not resolve at runtime). See maestro-types.ts header.

import type {
  MaestroState,
  MaestroEvent,
  TransitionResult,
  TransitionCtx,
  MaestroStage,
  HumanDecision,
  StageTransition,
  PreclusiveClock,
  WaitingFor,
} from "./maestro-types.ts";
import { TERMINAL_STAGES } from "./maestro-types.ts";

// ───────────────────────────────────────────────────────────────────────────
// Internal helpers (all pure).
// ───────────────────────────────────────────────────────────────────────────

function fail(reason: string): TransitionResult {
  return { ok: false, reason };
}

// Build the next state by moving to `to`, recording the transition in history.
// Carries clocks/humanLayer forward (caller mutates a clone before/after).
function advance(
  state: MaestroState,
  to: MaestroStage,
  event: MaestroEvent,
  ctx: TransitionCtx,
  patch?: Partial<Omit<MaestroState, "stage" | "history">>,
  note?: string,
): TransitionResult {
  const transition: StageTransition = {
    from: state.stage,
    to,
    event: event.type,
    at: ctx.now,
    actor: ctx.actor,
    note,
  };
  const next: MaestroState = {
    ...state,
    ...patch,
    stage: to,
    history: [...state.history, transition],
  };
  return { ok: true, next };
}

// Append a human decision to the (append-only) human layer. Only `human` actor.
function appendHuman(state: MaestroState, decision: HumanDecision): MaestroState {
  return { ...state, humanLayer: [...state.humanLayer, decision] };
}

// I6/§11.4: an edital with any human decision is scheduler-read-only.
function isHumanLocked(state: MaestroState): boolean {
  return state.humanLayer.length > 0;
}

// A scheduler event over a human-locked edital may ONLY add an alert (mark a
// clock alerted / record a step_failed) — never change stage. We model "add
// alert" as the no-stage-change branch; any stage-changing scheduler event on a
// locked edital is REJECTED (§11.4 / I6 testable rule).
function schedulerWouldChangeStage(event: MaestroEvent): boolean {
  switch (event.type) {
    // The only scheduler-origin events that do NOT change stage:
    case "prazo_venceu": {
      // prazo_venceu MAY change stage (fatal → prazo-perdido). On a human-locked
      // edital it must be downgraded to an alert. Handled in the guard below.
      return true;
    }
    default:
      return true;
  }
}

// Find the most relevant clock by kind (last armed wins). Pure read.
function findClock(state: MaestroState, kind: PreclusiveClock["kind"]): PreclusiveClock | undefined {
  return [...state.clocks].reverse().find((c) => c.kind === kind);
}

// Mark a clock's status (returns a new clocks array).
function markClock(
  clocks: PreclusiveClock[],
  kind: PreclusiveClock["kind"],
  status: PreclusiveClock["status"],
): PreclusiveClock[] {
  let done = false;
  return clocks.map((c) => {
    if (!done && c.kind === kind) {
      done = true;
      return { ...c, status };
    }
    return c;
  });
}

// ───────────────────────────────────────────────────────────────────────────
// transition — the single entry point.
// ───────────────────────────────────────────────────────────────────────────
export function transition(
  state: MaestroState,
  event: MaestroEvent,
  ctx: TransitionCtx,
): TransitionResult {
  // ── Global guard 0: terminal stages are immutable (except the pseudo-terminal
  // congelado-edital-mudou, whose ONLY exit is human re-triage — C1). ──────────
  if (TERMINAL_STAGES.has(state.stage)) {
    return fail(`estado terminal "${state.stage}" é imutável — nenhuma transição permitida`);
  }

  // ── Global guard 1: edital-mudou congela de QUALQUER estado (B5/I11). ────────
  if (event.type === "evento_edital_mudou") {
    if (state.stage === "congelado-edital-mudou") {
      return fail("edital já congelado; aguardando re-triagem humana");
    }
    return advance(state, "congelado-edital-mudou", event, ctx, { returnTo: null, clocks: [] },
      `edital ${event.tipo}: ERM/HabilitationResult marcados stale, esteira congelada`);
  }

  // ── Global guard 2: congelado-edital-mudou só sai por re-triagem humana (C1). ─
  if (state.stage === "congelado-edital-mudou") {
    if (event.type !== "humano_retriou_edital") {
      return fail(
        `congelado-edital-mudou só sai por humano_retriou_edital; recebeu "${event.type}" → REJEITADO`,
      );
    }
    if (ctx.actor !== "human") {
      return fail("re-triagem do edital congelado exige actor=human");
    }
    // Re-entra no início com NOVO hash; humanLayer antigo preservado (marcado).
    const withDecision = appendHuman(state, {
      kind: "retriou_edital",
      at: ctx.now,
      by: "operador-eniac",
      payload: { editalVersionHash: state.editalVersionHash, note: "re-triagem da nova versão" },
    });
    return advance(withDecision, "triado", event, ctx, {
      editalVersionHash: event.novoEditalVersionHash,
      returnTo: null,
      clocks: [],
      waitingFor: null,
      stepFailed: null,
    });
  }

  // ── Global guard 3: scheduler read-only over human-locked edital (I6/§11.4). ─
  // The scheduler (deterministic) may only ADD an alert. Any stage-changing
  // event from the scheduler on a human-locked edital is REJECTED — EXCEPT
  // prazo_venceu, which is downgraded to an alert (never silent — I5).
  if (ctx.actor === "scheduler" && isHumanLocked(state)) {
    if (event.type === "prazo_venceu") {
      // Downgrade to alert: mark the clock alertado, record step_failed, stay.
      const clocks = markClock(state.clocks, event.clockKind, "alertado");
      return {
        ok: true,
        next: {
          ...state,
          clocks,
          stepFailed: {
            reason: `prazo "${event.clockKind}" venceu em edital human-locked — alerta (scheduler read-only)`,
            at: ctx.now,
          },
        },
      };
    }
    if (schedulerWouldChangeStage(event)) {
      return fail(
        `scheduler é read-only sobre edital com decisão humana (humanLayer não-vazio); "${event.type}" mudaria o estado → REJEITADO`,
      );
    }
  }

  // ── Global guard 4: prazo_venceu (A4/I12). Fatal ⇒ terminal; não-fatal ⇒
  // step_failed + alerta, estado permanece (C1/M1/I5). ─────────────────────────
  if (event.type === "prazo_venceu") {
    const clock = findClock(state, event.clockKind);
    if (!clock) {
      return fail(`prazo_venceu para clock "${event.clockKind}" inexistente no estado`);
    }
    if (!clock.fatalOnMiss) {
      // Não-fatal: NUNCA matar edital salvável (C1/§13.1 teste 7).
      const clocks = markClock(state.clocks, event.clockKind, "alertado");
      return {
        ok: true,
        next: {
          ...state,
          clocks,
          stepFailed: {
            reason: `prazo não-fatal "${event.clockKind}" venceu — alerta CRÍTICO, estado mantido`,
            at: ctx.now,
          },
        },
      };
    }
    // Fatal: vai para o terminal do ramo.
    const clocks = markClock(state.clocks, event.clockKind, "vencido");
    // Recurso (intencao/razoes/contrarrazoes) perdido na fase de recurso →
    // encerrado-sem-recurso; demais preclusivos → prazo-perdido.
    const recursoStages: MaestroStage[] = [
      "avaliar-recurso-inabilitacao",
      "avaliar-recurso-julgamento",
      "defendendo-vitoria",
      "recurso-protocolado",
    ];
    const dest: MaestroStage = recursoStages.includes(state.stage)
      ? "encerrado-sem-recurso"
      : "prazo-perdido";
    return advance({ ...state, clocks }, dest, event, ctx, undefined,
      `clock fatal "${event.clockKind}" venceu`);
  }

  // ── Per-stage transition table (§11.1 + §13). ────────────────────────────────
  switch (state.stage) {
    // descoberto --Faro--> triado
    case "descoberto": {
      if (event.type === "faro_triou") {
        return advance(state, "triado", event, ctx);
      }
      return fail(`de "descoberto" só "faro_triou" é válido; recebeu "${event.type}"`);
    }

    // triado --Pula--> arquivado · --Vai/Olha--> analisado
    case "triado": {
      if (event.type === "faro_triou") {
        if (event.verdict === "pula") {
          return advance(state, "arquivado", event, ctx, undefined, "triagem Pula");
        }
        return advance(state, "analisado", event, ctx, undefined, `triagem ${event.verdict}`);
      }
      if (event.type === "arquivar") {
        return advance(state, "arquivado", event, ctx, undefined, event.motivo);
      }
      return fail(`de "triado" só "faro_triou"/"arquivar" é válido; recebeu "${event.type}"`);
    }

    // analisado --Prisma--> { impugnacao-edital | aguardando-dado(analise) | habilitado }
    case "analisado": {
      if (event.type === "suspeicao_alta") {
        // B6 — janela art.164, GATE ADVOGADO; reusa Tribuno.
        return advance(state, "impugnacao-edital", event, ctx, {
          clocks: [...state.clocks, event.clock],
        });
      }
      if (event.type === "prisma_analisou") {
        if (event.confiancaBelowPiso) {
          // A2 — NÃO é descarte; Sentinela vigia prazo.
          return advance(state, "aguardando-dado", event, ctx, { waitingFor: "analise" });
        }
        if (event.ok) {
          return advance(state, "habilitado", event, ctx);
        }
        return fail("prisma_analisou ok=false sem confiancaBelowPiso — sinal ambíguo, no-op");
      }
      return fail(`de "analisado" só "prisma_analisou"/"suspeicao_alta" é válido; recebeu "${event.type}"`);
    }

    // impugnacao-edital --(gate advogado)--> de volta à esteira (analisado)
    case "impugnacao-edital": {
      if (event.type === "humano_aprovou_impugnacao") {
        if (ctx.actor !== "human") {
          return fail("aprovação de impugnação exige actor=human (GATE ADVOGADO)");
        }
        const withDecision = appendHuman(state, {
          kind: "aprovou_minuta",
          at: ctx.now,
          by: "advogado",
          payload: { note: "impugnação ao edital aprovada/protocolada" },
        });
        const clocks = markClock(state.clocks, "impugnacao_edital", "cumprido");
        // Após impugnar, segue avaliando o edital (analisado).
        return advance(withDecision, "analisado", event, ctx, { clocks });
      }
      return fail(`de "impugnacao-edital" só "humano_aprovou_impugnacao" é válido; recebeu "${event.type}"`);
    }

    // habilitado --Forja--> ramifica pelos 4 verdicts REAIS (C4)
    case "habilitado": {
      if (event.type === "forja_veredito") {
        switch (event.verdict) {
          case "GO":
          case "GO_COM_TAREFAS":
            // GO_COM_TAREFAS avança; veto preclusivo real fica no gate pronto-protocolo (C4-ii).
            return advance(state, "entregando", event, ctx, undefined, `verdict ${event.verdict}`);
          case "PENDENTE_DADO":
            return advance(state, "aguardando-dado", event, ctx, { waitingFor: "analise" });
          case "NO_GO": {
            // C4(i): consórcio NÃO é verdict; derivado de NO_GO + rota de consórcio.
            if (event.consorcioRota) {
              return advance(state, "aguardando-dado", event, ctx, {
                waitingFor: "parceiro_consorcio",
              });
            }
            return advance(state, "arquivado-motivo", event, ctx, undefined, "NO_GO insanável, sem rota de consórcio");
          }
        }
      }
      return fail(`de "habilitado" só "forja_veredito" é válido; recebeu "${event.type}"`);
    }

    // aguardando-dado — DESAMBIGUADO por waitingFor (C3)
    case "aguardando-dado": {
      const waiting: WaitingFor | null | undefined = state.waitingFor;
      if (waiting == null) {
        // C3 / §13.1 teste 2 — aguardando-dado sem waitingFor é inválido.
        return fail("aguardando-dado sem waitingFor → REJEITADO (C3)");
      }
      if (event.type === "parceiro_cadastrado") {
        if (waiting !== "parceiro_consorcio") {
          return fail(
            `parceiro_cadastrado só vale em aguardando-dado(parceiro_consorcio); estado espera "${waiting}" → no-op`,
          );
        }
        // A5 — re-roda Forja com consórcio.
        const withDecision = appendHuman(state, {
          kind: "cadastrou_parceiro",
          at: ctx.now,
          by: "operador-eniac",
        });
        return advance(withDecision, "habilitado", event, ctx, { waitingFor: null });
      }
      if (event.type === "dado_recebido") {
        if (waiting === "parceiro_consorcio") {
          // §13.1 teste 2 — parceiro_consorcio recebendo dado_recebido → no-op.
          return fail(
            "aguardando-dado(parceiro_consorcio) recebeu dado_recebido (não-parceiro) → no-op, não avança (C3)",
          );
        }
        if (event.waitingFor !== waiting) {
          return fail(
            `dado_recebido(waitingFor="${event.waitingFor}") não casa com o estado(waitingFor="${waiting}") → no-op`,
          );
        }
        // Dado de análise/certidão/balanço/atestado recebido → re-entra na análise.
        // (analise → re-roda Prisma; demais → re-roda Forja na habilitação.)
        const withDecision = appendHuman(state, {
          kind: "forneceu_dado",
          at: ctx.now,
          by: "operador-eniac",
          payload: { note: `dado recebido: ${event.waitingFor}` },
        });
        const dest: MaestroStage = waiting === "analise" ? "analisado" : "habilitado";
        return advance(withDecision, dest, event, ctx, { waitingFor: null });
      }
      return fail(`de "aguardando-dado(${waiting})" eventos válidos: dado_recebido/parceiro_cadastrado; recebeu "${event.type}"`);
    }

    // entregando --Escriba--> ⛔GATE HUMANO⛔ --aprova--> pronto-protocolo
    case "entregando": {
      if (event.type === "humano_aprovou_dossie") {
        if (ctx.actor !== "human") {
          return fail("aprovação do dossiê exige actor=human (GATE HUMANO duro)");
        }
        const withDecision = appendHuman(state, {
          kind: "aprovou_dossie",
          at: ctx.now,
          by: "operador-eniac",
        });
        return advance(withDecision, "pronto-protocolo", event, ctx);
      }
      return fail(`de "entregando" só "humano_aprovou_dossie" é válido; recebeu "${event.type}"`);
    }

    // pronto-protocolo --(humano confirma protocolo)--> protocolada (B1)
    // VETO C4(ii): gap SANÁVEL bloqueante aberto BLOQUEIA o protocolo.
    case "pronto-protocolo": {
      if (event.type === "humano_confirmou_protocolo") {
        if (ctx.actor !== "human") {
          return fail("confirmação de protocolo exige actor=human");
        }
        // C4(ii) / §13.1 teste 4 — veto de gap sanável bloqueante aberto.
        // O flag é setado por flagOpenSanavelBlockingGap (chamado pelo futuro runtime
        // ao entrar em `entregando` via GO_COM_TAREFAS com gap aberto) e limpo por
        // clearSanavelBlockingGap quando o humano resolve a tarefa.
        // TODO Fase B: trocar este match-de-prefixo em stepFailed por um campo tipado
        // dedicado (ex.: state.openBlockingGap: boolean) — um veto de SEGURANÇA não
        // deve depender de convenção de string. Isolado e coberto por teste por ora.
        if (state.stepFailed?.reason.startsWith("GAP_SANAVEL_BLOQUEANTE")) {
          return fail(
            "confirmar protocolo REJEITADO: HabilitationGap sanável bloqueante não-resolvida (C4-ii/A1)",
          );
        }
        const withDecision = appendHuman(state, {
          kind: "confirmou_protocolo",
          at: ctx.now,
          by: "operador-eniac",
          payload: { numeroProcesso: event.numeroProcesso, protocolAt: event.protocolAt },
        });
        return advance(withDecision, "protocolada", event, ctx, undefined,
          `protocolo confirmado proc=${event.numeroProcesso}`);
      }
      return fail(`de "pronto-protocolo" só "humano_confirmou_protocolo" é válido; recebeu "${event.type}"`);
    }

    // protocolada --Sentinela arma relógio pela dataSessao--> em-sessao (B1/B7/I9)
    case "protocolada": {
      if (event.type === "sentinela_armou_sessao") {
        return advance(state, "em-sessao", event, ctx, {
          clocks: [...state.clocks, event.clock],
        }, "Sentinela armou relógio pela dataSessao (alerta proativo pré-sessão)");
      }
      return fail(`de "protocolada" só "sentinela_armou_sessao" é válido; recebeu "${event.type}"`);
    }

    // em-sessao --eventos da sessão--> branches por eniacOutcome (B2/B3/A3)
    // OU pregoeiro abre diligência (B4) → em-diligencia com returnTo (C2)
    case "em-sessao": {
      if (event.type === "pregoeiro_abriu_diligencia") {
        return advance(state, "em-diligencia", event, ctx, {
          returnTo: "em-sessao", // C2 — retorno determinístico
          clocks: [...state.clocks, event.clock],
        });
      }
      if (event.type === "sessao_resultado") {
        const r = event.result;
        switch (r.eniacOutcome) {
          case "vencedora":
            // B3/I10 — NÃO é terminal.
            return advance(state, "vencedora-provisoria", event, ctx,
              r.thirdPartyAppealWindow
                ? { clocks: [...state.clocks, r.thirdPartyAppealWindow] }
                : undefined,
              "vencedora provisória — vigia janela de terceiros");
          case "inabilitada":
            // B2 — relógio próprio art.165 I-a.
            return advance(state, "avaliar-recurso-inabilitacao", event, ctx);
          case "derrotada_julgamento":
            return advance(state, "avaliar-recurso-julgamento", event, ctx);
          case "empate_ficto_meepp":
            // C-NOVO-4 — empate ficto é sub-evento DENTRO de em-sessao; permanece.
            return {
              ok: true,
              next: {
                ...state,
                stepFailed: {
                  reason: "empate_ficto ME/EPP aberto — janela imediata: humano cobre lance; permanece em-sessao",
                  at: ctx.now,
                },
              },
            };
          case "desclassificada":
            return advance(state, "avaliar-recurso-julgamento", event, ctx, undefined, "desclassificada");
          case "indefinido":
            // Sem resultado definido → aguarda (não avança às cegas — I5).
            return advance(state, "aguardando-resultado", event, ctx, undefined,
              "resultado indefinido — aguardando ata/portal");
          default: {
            const _never: never = r.eniacOutcome;
            return fail(`eniacOutcome desconhecido "${String(_never)}"`);
          }
        }
      }
      return fail(`de "em-sessao" eventos válidos: sessao_resultado/pregoeiro_abriu_diligencia; recebeu "${event.type}"`);
    }

    // aguardando-resultado — só ingestão posterior do SessionResult
    case "aguardando-resultado": {
      if (event.type === "sessao_resultado") {
        // Re-encaminha pela mesma lógica de em-sessao tratando o resultado.
        return transition({ ...state, stage: "em-sessao" }, event, ctx);
      }
      if (event.type === "pregoeiro_abriu_diligencia") {
        return advance(state, "em-diligencia", event, ctx, {
          returnTo: "aguardando-resultado",
          clocks: [...state.clocks, event.clock],
        });
      }
      return fail(`de "aguardando-resultado" só "sessao_resultado"/"pregoeiro_abriu_diligencia"; recebeu "${event.type}"`);
    }

    // em-diligencia --responde--> {returnTo} determinístico (C2)
    case "em-diligencia": {
      if (event.type === "respondeu_diligencia") {
        if (state.returnTo == null) {
          // §13.1 teste 1 — em-diligencia sem returnTo → REJEITADO.
          return fail("em-diligencia sem returnTo → REJEITADO (C2)");
        }
        if (ctx.actor !== "human") {
          return fail("resposta a diligência é ato vinculante humano (resposta_diligencia)");
        }
        const withDecision = appendHuman(state, {
          kind: "respondeu_diligencia",
          at: ctx.now,
          by: "operador-eniac",
        });
        const clocks = markClock(state.clocks, "diligencia", "cumprido");
        return advance(withDecision, state.returnTo, event, ctx, { returnTo: null, clocks });
      }
      return fail(`de "em-diligencia" só "respondeu_diligencia" é válido; recebeu "${event.type}"`);
    }

    // vencedora-provisoria --vigia janela de terceiros--> { vencido | defendendo-vitoria }
    case "vencedora-provisoria": {
      if (event.type === "homologacao_sem_recurso") {
        // I10 — só agora vira terminal.
        return advance(state, "vencido", event, ctx, undefined, "homologação sem recurso de terceiros");
      }
      if (event.type === "terceiro_recorreu") {
        // B3 — contrarrazões art.165§3, GATE ADVOGADO, relógio próprio.
        return advance(state, "defendendo-vitoria", event, ctx, {
          clocks: [...state.clocks, event.clock],
        });
      }
      return fail(`de "vencedora-provisoria" eventos válidos: homologacao_sem_recurso/terceiro_recorreu; recebeu "${event.type}"`);
    }

    // defendendo-vitoria --(C-NOVO-3)--> { vencido | avaliar-recurso-julgamento }
    case "defendendo-vitoria": {
      if (event.type === "recurso_terceiro_negado") {
        return advance(state, "vencido", event, ctx, undefined, "recurso de 3º negado + homologação");
      }
      if (event.type === "recurso_terceiro_provido") {
        // C-NOVO-3 — ENIAC perde a posição → reusa avaliação de fundamento.
        return advance(state, "avaliar-recurso-julgamento", event, ctx, undefined,
          "recurso de 3º provido: ENIAC perde posição, novo ato a avaliar");
      }
      return fail(`de "defendendo-vitoria" eventos válidos: recurso_terceiro_negado/recurso_terceiro_provido; recebeu "${event.type}"`);
    }

    // avaliar-recurso-* --Tribuno--> { encerrado-sem-recurso | recurso-protocolado }
    case "avaliar-recurso-inabilitacao":
    case "avaliar-recurso-julgamento": {
      if (event.type === "tribuno_sem_fundamento") {
        return advance(state, "encerrado-sem-recurso", event, ctx, undefined,
          "Tribuno: sem fundamento (honesto, registrado)");
      }
      if (event.type === "tribuno_com_fundamento") {
        // Permanece no estado de avaliação até o gate advogado fechar (minuta).
        return {
          ok: true,
          next: {
            ...state,
            stepFailed: {
              reason: "Tribuno: com fundamento — minuta produzida, aguardando GATE ADVOGADO",
              at: ctx.now,
            },
          },
        };
      }
      if (event.type === "humano_aprovou_minuta") {
        if (ctx.actor !== "human") {
          return fail("aprovação da minuta exige actor=human (GATE ADVOGADO)");
        }
        const withDecision = appendHuman(state, {
          kind: "aprovou_minuta",
          at: ctx.now,
          by: "advogado",
        });
        return advance(withDecision, "recurso-protocolado", event, ctx, undefined,
          "minuta aprovada pelo advogado; humano protocola");
      }
      return fail(`de "${state.stage}" eventos válidos: tribuno_sem_fundamento/tribuno_com_fundamento/humano_aprovou_minuta; recebeu "${event.type}"`);
    }

    // recurso-protocolado — aguarda resultado do recurso (fora do escopo Fase A;
    // tratado como pseudo-estável: só prazo_venceu/edital_mudou já tratados acima).
    case "recurso-protocolado": {
      return fail(`de "recurso-protocolado" nenhuma transição da Fase A é aplicável; recebeu "${event.type}"`);
    }

    // Terminal stages (vencido/arquivado/arquivado-motivo/prazo-perdido/
    // encerrado-sem-recurso) and congelado-edital-mudou are handled by the
    // global guards above (early-return) and never reach this switch with a
    // valid event. Any fall-through is a no-op rejection.
    default:
      return fail(`estágio "${String(state.stage)}" sem transição aplicável para "${event.type}"`);
  }
}

// ───────────────────────────────────────────────────────────────────────────
// Helper (pure): mark that an edital entered `entregando` via GO_COM_TAREFAS
// with an open SANÁVEL blocking gap, so the pronto-protocolo gate can veto it
// (C4-ii/A1). Kept separate so the caller (future Maestro runtime) sets this
// flag deterministically from the HabilitationResult.
// ───────────────────────────────────────────────────────────────────────────
export function flagOpenSanavelBlockingGap(state: MaestroState, at: string): MaestroState {
  return {
    ...state,
    stepFailed: {
      reason: "GAP_SANAVEL_BLOQUEANTE: tarefa de habilitação sanável bloqueante aberta (A1/C4-ii)",
      at,
    },
  };
}

// Helper (pure): clear the gap flag once the human resolves the blocking task.
export function clearSanavelBlockingGap(state: MaestroState): MaestroState {
  if (state.stepFailed?.reason.startsWith("GAP_SANAVEL_BLOQUEANTE")) {
    return { ...state, stepFailed: null };
  }
  return state;
}
