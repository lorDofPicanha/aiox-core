// ─────────────────────────────────────────────────────────────────────────────
// noyce-deadline.ts — MOTOR DE PRAZO PRECLUSIVO (doc 32 §11.3, invariante I4).
//
// CÓDIGO DE SEGURANÇA. Errar aqui = a ENIAC perde a janela de recurso
// (preclusão, dano irreversível). Por isso:
//   • puro / determinístico: SEM I/O, SEM Date.now(), SEM new Date() sem arg.
//     Todo instante de referência (from / now / dueAt) entra como ISO string.
//   • SEM LLM: nenhum número/prazo vem de modelo (I2/I4).
//   • SEM biblioteca de fuso: BR = UTC−03:00 fixo (sem DST desde 2019); GO=SP.
//
// SEMÂNTICA JURÍDICA codificada (NÃO improvisada):
//
//   art. 183 CPC + art. 110 Lei 14.133 — contagem em DIAS ÚTEIS:
//     • exclui-se o dia do começo, inclui-se o do vencimento;
//     • se o vencimento cair em dia NÃO-útil → prorroga p/ o próximo dia útil;
//     • se o EVENTO DE INÍCIO cair em dia não-útil → a contagem começa no
//       próximo dia útil (o "dia do começo" excluído é o 1º dia útil seguinte).
//
//   I4 / hora-cheia: o vencimento recai num INSTANTE, não na meia-noite
//     implícita. O prazo vence ao FIM do expediente do dia do vencimento.
//     `cutoffHour` modela isso (default 23:59:59 −03:00 = "fim do dia legal";
//     pode ser sobrescrito p/ o expediente do órgão, ex. 18h). Alertas
//     (T-3/T-1/T-0) e timeUntil são SEMPRE relativos a esse instante real,
//     nunca à meia-noite (o `from` carrega hora real: sessão às 9h ≠ 00:00).
// ─────────────────────────────────────────────────────────────────────────────

import { BR_UTC_OFFSET, BR_UTC_OFFSET_HOURS, isBusinessDay, holidaySet, toDateOnly } from "./noyce-dates.ts";
import type { HolidayCalendar } from "./noyce-dates.ts";

const MS_PER_HOUR = 3_600_000;
const MS_PER_DAY = 86_400_000;
// Default "fim do dia legal" em −03:00: 23:59:59 (segundo final do dia civil).
const DEFAULT_CUTOFF_HOUR = 23;
const DEFAULT_CUTOFF_MINUTE = 59;
const DEFAULT_CUTOFF_SECOND = 59;

export interface DeadlineOptions {
  holidays: HolidayCalendar;
  // Hora de corte (0..23) no fuso −03:00. Default = fim do dia legal (23:59:59).
  // Override p/ expediente do órgão (ex. 18 = 18:00:00 −03:00).
  cutoffHour?: number;
}

export interface CalendarDeadlineOptions {
  // Dias corridos NÃO dependem de feriado, mas o vencimento ainda recai num
  // instante (hora-cheia) — daí o cutoffHour. holidays é ignorado de propósito.
  cutoffHour?: number;
}

export interface TimeUntil {
  ms: number; // > 0 = falta tempo; ≤ 0 = vencido (ms negativos = quanto passou)
  passed: boolean; // now já atingiu/ultrapassou o instante de vencimento
  businessDaysLeft?: number; // dias úteis inteiros entre now e dueAt (só se holidays dado)
}

export type DeadlineAlertLevel = "ok" | "t-3" | "t-1" | "t-0" | "vencido";

export interface AlertOptions {
  holidays?: HolidayCalendar;
}

// ─────────────────────────────────────────────────────────────────────────────
// Conversão de fuso (UTC ↔ −03:00). Em −03:00, o relógio local está 3h ATRÁS
// do UTC: 00:00 −03:00 = 03:00 UTC. Logo, p/ obter o UTC de um horário local
// −03:00, SOMA-SE 3h (subtrai-se o offset, que é negativo).
// ─────────────────────────────────────────────────────────────────────────────

// Dado um instante UTC, retorna a MEIA-NOITE UTC do dia civil −03:00 a que ele
// pertence. Ex.: 2026-01-20T01:00Z é 2026-01-19T22:00 −03:00 → dia civil 19.
function brCivilMidnightUtc(utc: Date): Date {
  const local = new Date(utc.getTime() + BR_UTC_OFFSET_HOURS * MS_PER_HOUR); // desloca p/ "relógio local"
  return new Date(Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate()));
}

// Monta o instante UTC correspondente a {ano-mês-dia do `civilMidnightUtc`} às
// h:m:s no fuso −03:00. Ex.: dia 22, cutoff 18h → 2026-01-22T21:00:00Z.
function brInstantUtc(civilMidnightUtc: Date, hour: number, minute: number, second: number): Date {
  const localMs = Date.UTC(
    civilMidnightUtc.getUTCFullYear(),
    civilMidnightUtc.getUTCMonth(),
    civilMidnightUtc.getUTCDate(),
    hour,
    minute,
    second,
  );
  return new Date(localMs - BR_UTC_OFFSET_HOURS * MS_PER_HOUR); // local→UTC: subtrai offset negativo (= +3h)
}

// Formata um instante UTC como ISO datetime no fuso −03:00 (hora-cheia visível).
function toBrIso(utc: Date): string {
  const local = new Date(utc.getTime() + BR_UTC_OFFSET_HOURS * MS_PER_HOUR);
  const yyyy = String(local.getUTCFullYear()).padStart(4, "0");
  const mm = String(local.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(local.getUTCDate()).padStart(2, "0");
  const hh = String(local.getUTCHours()).padStart(2, "0");
  const mi = String(local.getUTCMinutes()).padStart(2, "0");
  const ss = String(local.getUTCSeconds()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}:${ss}${BR_UTC_OFFSET}`;
}

function parseInstant(iso: string): Date {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    throw new RangeError(`noyce-deadline: ISO datetime inválido: ${JSON.stringify(iso)}`);
  }
  return date;
}

// M1 — o calendário de feriados (feriados-nacionais.json) cobre um intervalo
// FINITO de anos. Contar um prazo que ultrapassa o último ano coberto trataria
// dias úteis APÓS a tabela como se não houvesse feriado naquele ano → contagem
// errada SILENCIOSA (um feriado não-listado vira dia útil). FALHAR ALTO: se o
// vencimento cair além do último ano coberto, lança erro claro em vez de chutar.
function maxCoveredYear(holidays: ReadonlySet<string>): number {
  let max = -Infinity;
  for (const d of holidays) {
    const y = Number(d.slice(0, 4));
    if (Number.isFinite(y) && y > max) max = y;
  }
  return max;
}

function assertWithinCoverage(dueDay: Date, holidays: ReadonlySet<string>): void {
  if (holidays.size === 0) return; // sem tabela → nada a garantir aqui
  const max = maxCoveredYear(holidays);
  if (dueDay.getUTCFullYear() > max) {
    throw new RangeError(
      `noyce-deadline: contagem ultrapassa o último ano coberto pela tabela de feriados (${max}); ` +
        `vencimento cairia em ${toDateOnly(dueDay)}. Atualize feriados-nacionais.json antes de contar prazos além de ${max} ` +
        `(contar feriado como dia útil seria preclusão por erro silencioso).`,
    );
  }
}

function resolveCutoff(cutoffHour: number | undefined): { hour: number; minute: number; second: number } {
  if (cutoffHour === undefined) {
    return { hour: DEFAULT_CUTOFF_HOUR, minute: DEFAULT_CUTOFF_MINUTE, second: DEFAULT_CUTOFF_SECOND };
  }
  if (!Number.isInteger(cutoffHour) || cutoffHour < 0 || cutoffHour > 23) {
    throw new RangeError(`noyce-deadline: cutoffHour deve ser inteiro 0..23, recebido ${cutoffHour}`);
  }
  // Override de expediente: hora cheia, minuto/segundo zerados (ex. 18 = 18:00:00).
  return { hour: cutoffHour, minute: 0, second: 0 };
}

// ─────────────────────────────────────────────────────────────────────────────
// businessDaysDeadline — prazo em DIAS ÚTEIS (recurso, impugnação, contrarrazões).
//
// art. 183 CPC + art. 110 Lei 14.133. Retorna ISO datetime −03:00 do vencimento
// no instante de corte (cutoffHour). `from` carrega hora real (não meia-noite).
//
// Algoritmo:
//   1. Ancora no dia civil −03:00 do `from` (descarta a hora p/ contagem de dia).
//   2. Se esse dia de início NÃO for útil, anda p/ o próximo dia útil (o "dia do
//      começo" excluído passa a ser o 1º dia útil). (regra: início em dia não-útil)
//   3. Conta N dias úteis ANDANDO PARA FRENTE a partir do dia seguinte (exclui o
//      dia do começo, inclui o do vencimento).
//   4. Se o vencimento cair em dia não-útil, prorroga p/ o próximo dia útil
//      (já garantido pelo passo 3, que só conta dias úteis).
//   5. O instante de vencimento = dia do vencimento às cutoffHour −03:00.
// ─────────────────────────────────────────────────────────────────────────────
export function businessDaysDeadline(fromIso: string, businessDays: number, opts: DeadlineOptions): string {
  if (!Number.isInteger(businessDays) || businessDays < 1) {
    throw new RangeError(`noyce-deadline: businessDays deve ser inteiro ≥ 1, recebido ${businessDays}`);
  }
  const holidays = holidaySet(opts.holidays);
  const cutoff = resolveCutoff(opts.cutoffHour);

  // Dia civil −03:00 do evento de início (hora descartada na contagem de dia).
  const cursor = brCivilMidnightUtc(parseInstant(fromIso));

  // Início em dia não-útil → contagem começa no próximo dia útil.
  while (!isBusinessDay(cursor, holidays)) {
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  // Conta N dias úteis para frente. Exclui o dia do começo: cada passo avança
  // 1 dia e só decrementa quando cai em dia útil; o último dia útil é o vencimento.
  let remaining = businessDays;
  while (remaining > 0) {
    cursor.setUTCDate(cursor.getUTCDate() + 1);
    // M1 — se a contagem caminhou para um ano além da cobertura da tabela, os
    // feriados desse ano são desconhecidos → falhar alto, nunca contar às cegas.
    assertWithinCoverage(cursor, holidays);
    if (isBusinessDay(cursor, holidays)) remaining -= 1;
  }

  return toBrIso(brInstantUtc(cursor, cutoff.hour, cutoff.minute, cutoff.second));
}

// ─────────────────────────────────────────────────────────────────────────────
// calendarDaysDeadline — prazo em DIAS CORRIDOS (clocks basis="corridos").
//
// Não pula fim de semana/feriado. Soma N dias civis ao dia de início e ancora
// no instante de corte. Mantém a mesma hora-cheia (cutoffHour) que os úteis,
// para que timeUntil/alertas tratem ambos os tipos de relógio uniformemente.
// FOUNDER-DECISION (M2 — prorrogação de prazo corrido): assume-se que dias
//  corridos NÃO prorrogam o vencimento que cai em dia não-útil (regra geral de
//  prazo material/corrido; quem precisa de prorrogação usa dias úteis). Esta é
//  uma DECISÃO JURÍDICA pendente do founder — NÃO alterar sem validação dele.
//  Se a regra for "prorroga p/ o próximo dia útil também no corrido", a mudança
//  é aqui (mover o cursor enquanto !isBusinessDay antes de ancorar o cutoff).
// ─────────────────────────────────────────────────────────────────────────────
export function calendarDaysDeadline(fromIso: string, days: number, opts?: CalendarDeadlineOptions): string {
  if (!Number.isInteger(days) || days < 1) {
    throw new RangeError(`noyce-deadline: days deve ser inteiro ≥ 1, recebido ${days}`);
  }
  const cutoff = resolveCutoff(opts?.cutoffHour);
  const cursor = brCivilMidnightUtc(parseInstant(fromIso));
  cursor.setUTCDate(cursor.getUTCDate() + days);
  return toBrIso(brInstantUtc(cursor, cutoff.hour, cutoff.minute, cutoff.second));
}

// ─────────────────────────────────────────────────────────────────────────────
// timeUntil — quanto falta (ms) até o instante de vencimento, relativo ao `now`
// REAL injetado. `passed` = now já alcançou/ultrapassou o vencimento.
// `businessDaysLeft` (opcional, se holidays dado) = dias úteis inteiros restantes.
// ─────────────────────────────────────────────────────────────────────────────
export function timeUntil(dueAtIso: string, nowIso: string, opts?: AlertOptions): TimeUntil {
  const due = parseInstant(dueAtIso);
  const now = parseInstant(nowIso);
  const ms = due.getTime() - now.getTime();
  const result: TimeUntil = { ms, passed: ms <= 0 };

  if (opts?.holidays) {
    result.businessDaysLeft = businessDaysLeftBetween(now, due, holidaySet(opts.holidays));
  }
  return result;
}

// Conta dias ÚTEIS inteiros entre dois instantes (now → due), pelo dia civil
// −03:00 de cada. 0 se due já passou ou é hoje. Usado por timeUntil/alerta.
function businessDaysLeftBetween(now: Date, due: Date, holidays: ReadonlySet<string>): number {
  if (due.getTime() <= now.getTime()) return 0;
  const cursor = brCivilMidnightUtc(now);
  const dueDay = brCivilMidnightUtc(due);
  let days = 0;
  while (cursor.getTime() < dueDay.getTime()) {
    cursor.setUTCDate(cursor.getUTCDate() + 1);
    if (isBusinessDay(cursor, holidays)) days += 1;
  }
  return days;
}

// ─────────────────────────────────────────────────────────────────────────────
// deadlineAlertLevel — nível de alerta p/ o Sentinela, relativo ao INSTANTE real
// do vencimento (nunca à meia-noite). Margens em dias civis até o vencimento:
//   vencido : now ≥ dueAt
//   t-0     : vence hoje (mesmo dia civil −03:00 do dueAt) e ainda não passou
//   t-1     : falta 1 dia civil
//   t-3     : faltam 2..3 dias civis
//   ok      : falta mais que 3 dias
//
// Margens medidas pelo dia civil −03:00 de cada instante — assim "sessão às 9h,
// vencimento hoje 23:59" dispara T-0 às 9h, e não meia-noite. Se holidays for
// dado, as margens t-3/t-1 podem ser refinadas p/ dias úteis (mantemos dias
// civis por padrão: o alerta deve ser CONSERVADOR — avisar cedo, nunca tarde).
// ─────────────────────────────────────────────────────────────────────────────
export function deadlineAlertLevel(dueAtIso: string, nowIso: string, _opts?: AlertOptions): DeadlineAlertLevel {
  const due = parseInstant(dueAtIso);
  const now = parseInstant(nowIso);

  if (now.getTime() >= due.getTime()) return "vencido";

  // Diferença em dias CIVIS −03:00 (não em ms brutos), p/ que a hora real do
  // `now` decida o nível pelo dia, mas o "vencido" acima respeite o instante.
  const nowDay = brCivilMidnightUtc(now).getTime();
  const dueDay = brCivilMidnightUtc(due).getTime();
  const daysApart = Math.round((dueDay - nowDay) / MS_PER_DAY);

  if (daysApart <= 0) return "t-0"; // vence hoje, instante ainda não atingido
  if (daysApart === 1) return "t-1";
  if (daysApart <= 3) return "t-3";
  return "ok";
}
