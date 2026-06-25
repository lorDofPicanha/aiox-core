// Tests do maestro-runtime (Fase B.1) — antes ZERO cobertura.
// Cobre: C1 (normalização de fuso na fronteira), A2 (não armar clock em evento
// cancelled/missed) e C2 (re-avaliação do relógio em transição que custa tempo).
//
// 🔴 C1 — força TZ=UTC ANTES de qualquer `new Date` para PROVAR que um datetime
// naive ("2026-06-25T10:00:00") só produz o instante correto se for normalizado
// para −03:00 na fronteira. Sem o carimbo, o servidor UTC parsearia naive como
// UTC e o instante deslizaria 3h (preclusão silenciosa Fortaleza×SP).
process.env.TZ = "UTC";

import assert from "node:assert/strict";
import { test } from "node:test";

const { deriveMaestroState, sentinelaWatch } = await import("../lib/agents/maestro-runtime.ts");
const { ensureBrOffset } = await import("../lib/noyce-dates.ts");
const { transition } = await import("../lib/agents/orchestrator.ts");
const { initialMaestroState } = await import("../lib/agents/maestro-types.ts");

// ── fixture mínimo de Opportunity (deriveMaestroState só lê id/stage/proposalDeadline/legalProcess.events) ──
function opp(overrides = {}) {
  return {
    id: "edital-1",
    stage: "habilitar",
    proposalDeadline: null,
    legalProcess: { events: [] },
    ...overrides,
  };
}

function event(overrides = {}) {
  return {
    id: "ev-1",
    stage: "habilitar",
    eventType: "proposal_deadline",
    label: "Prazo de proposta",
    eventTime: null,
    status: "observed",
    requiresHumanAction: true,
    riskLevel: "watch",
    ...overrides,
  };
}

// ════════════════════════════════════════════════════════════════════════════
// C1 — normalização de fuso na fronteira (ensureBrOffset)
// ════════════════════════════════════════════════════════════════════════════

test("C1/ensureBrOffset: naive sem Z/offset recebe carimbo −03:00", () => {
  assert.equal(ensureBrOffset("2026-06-25T10:00:00"), "2026-06-25T10:00:00-03:00");
  assert.equal(ensureBrOffset("2026-06-25T10:00"), "2026-06-25T10:00-03:00"); // sem segundos
});

test("C1/ensureBrOffset: já com Z ou offset → inalterado", () => {
  assert.equal(ensureBrOffset("2026-06-25T10:00:00Z"), "2026-06-25T10:00:00Z");
  assert.equal(ensureBrOffset("2026-06-25T10:00:00-03:00"), "2026-06-25T10:00:00-03:00");
  assert.equal(ensureBrOffset("2026-06-25T10:00:00+00:00"), "2026-06-25T10:00:00+00:00");
});

test("C1/ensureBrOffset: null/vazio/inválido → null (conservador, nunca chuta)", () => {
  assert.equal(ensureBrOffset(null), null);
  assert.equal(ensureBrOffset(undefined), null);
  assert.equal(ensureBrOffset(""), null);
  assert.equal(ensureBrOffset("2026-06-25"), null); // só data, sem hora
  assert.equal(ensureBrOffset("não é data"), null);
});

test("C1: sob TZ=UTC, deadline naive vira o MESMO instante absoluto que em SP (−03:00)", () => {
  // "2026-06-25T10:00:00" é 10h em São Paulo = 13:00:00Z. Sem normalização, o
  // servidor UTC leria 10:00:00Z (3h adiantado). Provamos que o clock derivado
  // carrega o instante correto independente do TZ do processo.
  const state = deriveMaestroState(opp({ proposalDeadline: "2026-06-25T10:00:00" }));
  const proposta = state.clocks.find((c) => c.kind === "proposta");
  assert.ok(proposta, "clock de proposta armado");
  assert.equal(new Date(proposta.dueAt).toISOString(), "2026-06-25T13:00:00.000Z");
});

test("C1: borda pós-meia-noite — naive 01:00 −03:00 = 04:00Z do MESMO dia civil (sem deslocar o dia)", () => {
  // 01:00 em SP = 04:00Z do dia 25. Sob TZ=UTC sem normalização, 01:00 seria
  // lido como 01:00Z dia 25 — mesma data por sorte aqui, mas o instante erraria
  // 3h; o ponto é o INSTANTE correto. Caso simétrico do dia que desliza:
  const state = deriveMaestroState(opp({ proposalDeadline: "2026-06-25T01:00:00" }));
  const proposta = state.clocks.find((c) => c.kind === "proposta");
  assert.equal(new Date(proposta.dueAt).toISOString(), "2026-06-25T04:00:00.000Z");
});

test("C1: a normalização dá o mesmo resultado que se computado em SP", () => {
  // Referência: o instante que o Brasil entende por "25/06 10:00" é exatamente
  // o que ensureBrOffset produz; comparamos com a construção explícita −03:00.
  const naive = "2026-06-25T10:00:00";
  const viaHelper = new Date(ensureBrOffset(naive)).getTime();
  const viaSP = new Date("2026-06-25T10:00:00-03:00").getTime();
  assert.equal(viaHelper, viaSP);
});

test("C1: eventTime naive de evento preclusivo também é normalizado", () => {
  const state = deriveMaestroState(
    opp({
      proposalDeadline: null,
      legalProcess: {
        events: [event({ eventType: "appeal_reasons_deadline", eventTime: "2026-06-30T18:00:00", status: "observed" })],
      },
    }),
  );
  const recurso = state.clocks.find((c) => c.kind === "razoes_recurso");
  assert.ok(recurso, "clock de razões de recurso armado");
  assert.equal(new Date(recurso.dueAt).toISOString(), "2026-06-30T21:00:00.000Z"); // 18h −03:00
});

// ════════════════════════════════════════════════════════════════════════════
// A2 — não armar clock fatal sobre evento cancelled/missed
// ════════════════════════════════════════════════════════════════════════════

test("A2: evento proposal_deadline status 'cancelled' com eventTime NÃO arma clock", () => {
  const state = deriveMaestroState(
    opp({
      proposalDeadline: null, // sem clock durável; só o evento
      legalProcess: {
        events: [event({ eventType: "appeal_intent_window", eventTime: "2026-06-30T10:00:00", status: "cancelled" })],
      },
    }),
  );
  assert.equal(state.clocks.length, 0, "evento cancelado não arma clock fatal");
});

test("A2: evento 'missed' com eventTime NÃO arma clock fatal novo", () => {
  const state = deriveMaestroState(
    opp({
      proposalDeadline: null,
      legalProcess: {
        events: [event({ eventType: "appeal_reasons_deadline", eventTime: "2020-01-01T10:00:00", status: "missed" })],
      },
    }),
  );
  assert.equal(state.clocks.length, 0, "evento missed não re-arma alarme de algo já vencido");
});

test("A2: evento 'observed' com eventTime CONTINUA armando (sanidade — não over-filtra)", () => {
  const state = deriveMaestroState(
    opp({
      proposalDeadline: null,
      legalProcess: {
        events: [event({ eventType: "appeal_intent_window", eventTime: "2026-06-30T10:00:00", status: "observed" })],
      },
    }),
  );
  assert.equal(state.clocks.length, 1);
  assert.equal(state.clocks[0].kind, "intencao_recurso");
});

// ════════════════════════════════════════════════════════════════════════════
// C2 — re-avaliação do relógio em transição que custa tempo (A4/I12)
// ════════════════════════════════════════════════════════════════════════════

// Clock fatal de proposta JÁ vencido (2020) vs now 2026.
function expiredPropostaClock() {
  return {
    kind: "proposta",
    basis: "uteis_horacheia",
    dueAt: "2020-01-01T10:00:00-03:00",
    armedBy: "evento_portal",
    status: "armado",
    fatalOnMiss: true,
    dateConfidence: "observed",
  };
}

const NOW = "2026-06-20T12:00:00.000Z";
const human = { actor: "human", now: NOW };

test("C2: entregando→pronto-protocolo BLOQUEADO quando proposta venceu vs now (vai a prazo-perdido, não avança em silêncio)", () => {
  const state = { ...initialMaestroState("hash-v1"), stage: "entregando", clocks: [expiredPropostaClock()] };
  const res = transition(state, { type: "humano_aprovou_dossie" }, human);
  assert.equal(res.ok, true); // não lança; registra
  assert.equal(res.next.stage, "prazo-perdido", "avanço bloqueado e prazo-perdido REGISTRADO");
  const venc = res.next.clocks.find((c) => c.kind === "proposta");
  assert.equal(venc.status, "vencido");
});

test("C2: pronto-protocolo→protocolada BLOQUEADO quando proposta venceu (a própria classe do probe)", () => {
  const state = { ...initialMaestroState("hash-v1"), stage: "pronto-protocolo", clocks: [expiredPropostaClock()] };
  const res = transition(
    state,
    { type: "humano_confirmou_protocolo", numeroProcesso: "P-1", protocolAt: NOW },
    human,
  );
  assert.equal(res.next.stage, "prazo-perdido", "não protocola fora do prazo");
});

test("C2: clock de proposta AINDA no prazo → avanço normal (não bloqueia à toa)", () => {
  const futureClock = { ...expiredPropostaClock(), dueAt: "2099-01-01T10:00:00-03:00" };
  const state = { ...initialMaestroState("hash-v1"), stage: "entregando", clocks: [futureClock] };
  const res = transition(state, { type: "humano_aprovou_dossie" }, human);
  assert.equal(res.ok, true);
  assert.equal(res.next.stage, "pronto-protocolo");
});

test("C2: clock vencido mas dateConfidence='inferred' NÃO dispara veto duro (M2/I3 — CONFIRMAR DATA)", () => {
  const inferred = { ...expiredPropostaClock(), dateConfidence: "inferred" };
  const state = { ...initialMaestroState("hash-v1"), stage: "entregando", clocks: [inferred] };
  const res = transition(state, { type: "humano_aprovou_dossie" }, human);
  assert.equal(res.next.stage, "pronto-protocolo", "data inferida não vira gate fatal automático");
});
