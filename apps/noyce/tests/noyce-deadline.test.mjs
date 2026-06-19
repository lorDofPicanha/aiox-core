import assert from "node:assert/strict";
import { test } from "node:test";

const { businessDaysDeadline, calendarDaysDeadline, timeUntil, deadlineAlertLevel } = await import(
  "../lib/noyce-deadline.ts"
);

// Calendário mínimo de teste: feriado nacional na segunda 2026-02-02 (sintético,
// p/ provar o pulo de feriado sem depender da tabela real). Os outros casos usam
// calendário vazio p/ isolar a regra de dia útil de fim de semana.
// HolidayCalendar (objeto com .holidays). opts do motor = { holidays: <calendar> }.
const EMPTY_CAL = { holidays: [] };
const MON_CAL = { holidays: [{ date: "2026-02-02", name: "Feriado de teste", kind: "fixed" }] };
// opts prontos p/ businessDaysDeadline (que recebe { holidays: HolidayCalendar }).
const EMPTY = { holidays: EMPTY_CAL };
const MON_HOLIDAY = { holidays: MON_CAL };

// ─────────────────────────────────────────────────────────────────────────────
// FRONTEIRA 1 — Sexta + 3 dias úteis com SEGUNDA = feriado → vencimento na QUINTA.
// 2026-01-30 = sexta. Sex(excl) · Sáb · Dom · Seg(feriado) · Ter=1 · Qua=2 · Qui=3.
// ─────────────────────────────────────────────────────────────────────────────
test("sexta + 3 d.u. com segunda feriado → vence na quinta 2026-02-05 no cutoff", () => {
  const due = businessDaysDeadline("2026-01-30T09:00:00-03:00", 3, MON_HOLIDAY);
  assert.equal(due, "2026-02-05T23:59:59-03:00");
});

test("mesma sexta SEM o feriado → vence na quarta 2026-02-04 (1 d.u. a menos de pulo)", () => {
  // Sex(excl) · Sáb · Dom · Seg=1 · Ter=2 · Qua=3.
  const due = businessDaysDeadline("2026-01-30T09:00:00-03:00", 3, EMPTY);
  assert.equal(due, "2026-02-04T23:59:59-03:00");
});

// ─────────────────────────────────────────────────────────────────────────────
// FRONTEIRA 2 — Evento de início num SÁBADO → contagem começa no próximo dia útil.
// Sáb 2026-01-31, +1 d.u.: início vira seg 2026-02-02; +1 d.u. = ter 2026-02-03.
// (calendário vazio: nenhum feriado interfere)
// ─────────────────────────────────────────────────────────────────────────────
test("início no sábado → contagem começa na segunda; +1 d.u. = terça", () => {
  const due = businessDaysDeadline("2026-01-31T14:00:00-03:00", 1, EMPTY);
  assert.equal(due, "2026-02-03T23:59:59-03:00");
});

test("início num FERIADO → pula p/ próximo dia útil antes de contar", () => {
  // Seg 2026-02-02 é feriado de teste. +1 d.u.: início vira ter 03; +1 = qua 04.
  const due = businessDaysDeadline("2026-02-02T10:00:00-03:00", 1, MON_HOLIDAY);
  assert.equal(due, "2026-02-04T23:59:59-03:00");
});

// ─────────────────────────────────────────────────────────────────────────────
// FRONTEIRA 3 — Vencimento que cairia em SÁBADO → prorroga p/ próximo dia útil.
// Qua 2026-01-28 + 3 d.u.: Qui=1 · Sex=2 · (Sáb/Dom pulados) · Seg=3 → seg 2026-02-02.
// Com calendário vazio cai em segunda; o "cairia em sábado" é coberto pela
// própria contagem que só conta dias úteis.
// ─────────────────────────────────────────────────────────────────────────────
test("vencimento que cairia no fim de semana prorroga p/ segunda 2026-02-02", () => {
  const due = businessDaysDeadline("2026-01-28T09:00:00-03:00", 3, EMPTY);
  assert.equal(due, "2026-02-02T23:59:59-03:00");
});

// ─────────────────────────────────────────────────────────────────────────────
// FRONTEIRA 4 — Hora-cheia: sessão às 09:00 −03:00. O vencimento NÃO é meia-noite;
// T-0 dispara no instante real, não às 00:00.
// ─────────────────────────────────────────────────────────────────────────────
test("cutoffHour override (expediente 18h) reflete no instante de vencimento", () => {
  const due = businessDaysDeadline("2026-01-30T09:00:00-03:00", 3, { ...MON_HOLIDAY, cutoffHour: 18 });
  assert.equal(due, "2026-02-05T18:00:00-03:00");
});

test("sessão às 09:00 −03:00: vencimento NÃO é meia-noite; T-0 já às 09h, vencido só após o cutoff", () => {
  // Vencimento hoje (2026-02-05) às 18:00 −03:00.
  const due = "2026-02-05T18:00:00-03:00";
  // 09:00 do dia do vencimento: ainda é T-0 (mesmo dia), NÃO vencido (instante < 18h).
  assert.equal(deadlineAlertLevel(due, "2026-02-05T09:00:00-03:00"), "t-0");
  // 17:59: ainda T-0, não vencido.
  assert.equal(deadlineAlertLevel(due, "2026-02-05T17:59:00-03:00"), "t-0");
  // 18:00 em ponto: vencido (now ≥ dueAt).
  assert.equal(deadlineAlertLevel(due, "2026-02-05T18:00:00-03:00"), "vencido");
  // 23:00 do mesmo dia: vencido (não "ok" só porque ainda é o mesmo dia civil).
  assert.equal(deadlineAlertLevel(due, "2026-02-05T23:00:00-03:00"), "vencido");
});

test("meia-noite NÃO é o instante: timeUntil mede contra a hora real do vencimento", () => {
  const due = "2026-02-05T18:00:00-03:00";
  const t = timeUntil(due, "2026-02-05T09:00:00-03:00");
  assert.equal(t.passed, false);
  assert.equal(t.ms, 9 * 3_600_000); // exatamente 9h em ms
});

// ─────────────────────────────────────────────────────────────────────────────
// FRONTEIRA 5 — deadlineAlertLevel: transições ok → t-3 → t-1 → t-0 → vencido.
// Vencimento: quinta 2026-02-05 às 23:59:59 −03:00.
// ─────────────────────────────────────────────────────────────────────────────
test("alertas ok → t-3 → t-1 → t-0 → vencido com now injetado", () => {
  const due = "2026-02-05T23:59:59-03:00";
  assert.equal(deadlineAlertLevel(due, "2026-01-30T09:00:00-03:00"), "ok"); // 6 dias
  assert.equal(deadlineAlertLevel(due, "2026-02-02T09:00:00-03:00"), "t-3"); // 3 dias
  assert.equal(deadlineAlertLevel(due, "2026-02-03T09:00:00-03:00"), "t-3"); // 2 dias
  assert.equal(deadlineAlertLevel(due, "2026-02-04T09:00:00-03:00"), "t-1"); // 1 dia
  assert.equal(deadlineAlertLevel(due, "2026-02-05T09:00:00-03:00"), "t-0"); // hoje, antes do cutoff
  assert.equal(deadlineAlertLevel(due, "2026-02-06T00:00:00-03:00"), "vencido"); // passou
});

// ─────────────────────────────────────────────────────────────────────────────
// FRONTEIRA 6 — Dias CORRIDOS vs dias ÚTEIS divergem com fim de semana no meio.
// ─────────────────────────────────────────────────────────────────────────────
test("dias corridos vs dias úteis divergem quando há fim de semana no meio", () => {
  const from = "2026-01-30T09:00:00-03:00"; // sexta
  const uteis = businessDaysDeadline(from, 3, EMPTY); // sex+3du = qua 04
  const corridos = calendarDaysDeadline(from, 3); // sex+3 corridos = seg 02
  assert.equal(uteis, "2026-02-04T23:59:59-03:00");
  assert.equal(corridos, "2026-02-02T23:59:59-03:00");
  assert.notEqual(uteis, corridos);
});

test("dias corridos NÃO pulam feriado/fim de semana (vencem mesmo em dia não-útil)", () => {
  // Sex 2026-01-30 + 1 corrido = sábado 2026-01-31 (não prorroga).
  const due = calendarDaysDeadline("2026-01-30T09:00:00-03:00", 1);
  assert.equal(due, "2026-01-31T23:59:59-03:00");
});

// ─────────────────────────────────────────────────────────────────────────────
// FRONTEIRA 7 — Feriado nacional municipal/merge: calendário com feriado custom
// (representa merge nacional+municipal) afeta a contagem.
// ─────────────────────────────────────────────────────────────────────────────
test("merge de calendário (nacional + municipal): feriado extra estende o prazo", () => {
  const semMunicipal = businessDaysDeadline("2026-01-30T09:00:00-03:00", 3, EMPTY);
  const comMunicipal = businessDaysDeadline("2026-01-30T09:00:00-03:00", 3, MON_HOLIDAY);
  // O feriado de segunda empurra o vencimento de qua (04) p/ qui (05).
  assert.equal(semMunicipal, "2026-02-04T23:59:59-03:00");
  assert.equal(comMunicipal, "2026-02-05T23:59:59-03:00");
});

// ─────────────────────────────────────────────────────────────────────────────
// timeUntil — businessDaysLeft (quando holidays fornecido) e passed.
// ─────────────────────────────────────────────────────────────────────────────
test("timeUntil informa businessDaysLeft quando holidays é dado", () => {
  const due = "2026-02-05T23:59:59-03:00"; // quinta
  const t = timeUntil(due, "2026-02-02T09:00:00-03:00", MON_HOLIDAY); // segunda feriado
  // Seg(feriado, hoje) → Ter=1 · Qua=2 · Qui=3 d.u. inteiros até o dia do venc.
  assert.equal(t.businessDaysLeft, 3);
  assert.equal(t.passed, false);
});

test("timeUntil passed=true quando now ultrapassa o vencimento", () => {
  const t = timeUntil("2026-02-05T18:00:00-03:00", "2026-02-05T18:00:01-03:00");
  assert.equal(t.passed, true);
  assert.ok(t.ms < 0);
});

// ─────────────────────────────────────────────────────────────────────────────
// Guardas de entrada (segurança: input inválido NÃO produz prazo silencioso).
// ─────────────────────────────────────────────────────────────────────────────
test("businessDaysDeadline rejeita dias < 1 e ISO inválido", () => {
  assert.throws(() => businessDaysDeadline("2026-01-30T09:00:00-03:00", 0, EMPTY), RangeError);
  assert.throws(() => businessDaysDeadline("não-é-data", 3, EMPTY), RangeError);
});

test("cutoffHour fora de 0..23 é rejeitado", () => {
  assert.throws(() => businessDaysDeadline("2026-01-30T09:00:00-03:00", 3, { ...EMPTY, cutoffHour: 24 }), RangeError);
});
