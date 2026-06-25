// ─────────────────────────────────────────────────────────────────────────────
// noyce-dates.ts — primitivos compartilhados de data / dia útil / feriado.
//
// Extraído de noyce-suspicion.ts (Fase A do motor de prazo, doc 32 §11.3 / I4)
// para NÃO acoplar o motor de prazo preclusivo ao módulo de suspeição. Toda a
// lógica de "o que é dia útil" mora aqui, em UM lugar só (zero duplicação).
//
// CONVENÇÃO DE FUSO (I4, doc 32 §11.3): o Brasil não adota horário de verão
// desde 2019 → America/Sao_Paulo = UTC−03:00 FIXO o ano inteiro; Goiás (onde a
// ENIAC opera) está no mesmo fuso de Brasília = UTC−03:00. Portanto NÃO usamos
// nenhuma biblioteca de timezone: o offset é a constante BR_UTC_OFFSET_HOURS.
//
// Os helpers date-only (parseDateOnly / isBusinessDay / toDateOnly / holidaySet)
// trabalham em UTC puro e ignoram hora — preservam EXATAMENTE o comportamento
// que estava em noyce-suspicion.ts (suspicion tests devem permanecer verdes).
// A camada hora-cheia vive em noyce-deadline.ts e usa BR_UTC_OFFSET_HOURS.
// ─────────────────────────────────────────────────────────────────────────────

// America/Sao_Paulo = America/Goiania = UTC−03:00 fixo (sem DST desde 2019).
export const BR_UTC_OFFSET_HOURS = -3;
export const BR_UTC_OFFSET = "-03:00";

export interface HolidayCalendar {
  holidays: Array<{
    date: string;
    name: string;
    kind: string;
  }>;
}

// Parseia "YYYY-MM-DD" (ou ISO com hora) para a MEIA-NOITE UTC daquele dia
// civil. Date-only: descarta hora/fuso. Retorna null se inválido.
export function parseDateOnly(value: string | null): Date | null {
  if (!value) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null;
  return date;
}

// Dia útil = não-fim-de-semana E não-feriado. Avaliado no calendário UTC, que
// para datas date-only à meia-noite UTC coincide com o dia civil −03:00 (a
// meia-noite UTC de um dia é 21h −03:00 do MESMO dia civil; o dia da semana
// não muda). É por isso que o motor hora-cheia converte para o dia civil −03:00
// ANTES de chamar este helper.
export function isBusinessDay(date: Date, holidays: ReadonlySet<string>): boolean {
  const day = date.getUTCDay();
  return day !== 0 && day !== 6 && !holidays.has(toDateOnly(date));
}

export function holidaySet(calendar: HolidayCalendar): ReadonlySet<string> {
  return new Set(calendar.holidays.map((holiday) => holiday.date));
}

export function toDateOnly(date: Date): string {
  return date.toISOString().slice(0, 10);
}

// ─────────────────────────────────────────────────────────────────────────────
// ensureBrOffset (C1) — NORMALIZAÇÃO DE FUSO NA FRONTEIRA.
//
// Datas de portal/fixture chegam NAIVE: "2026-06-25T10:00:00" — sem Z, sem
// offset. `new Date()` parseia naive como hora LOCAL do servidor; em produção
// (Vercel/Railway = UTC) isso adianta o prazo em 3h e, após a meia-noite, desloca
// o DIA CIVIL inteiro → preclusão silenciosa (a classe de bug Fortaleza×SP).
//
// Este helper carimba o offset BR (−03:00) numa string naive ANTES de virar
// instante, garantindo que o engine puro (noyce-deadline.ts) sempre receba um
// instante absoluto inequívoco — independente do TZ do servidor. NÃO altera a
// lógica pura: roda na fronteira (maestro-runtime arming, triage), não no motor.
//
//   • string naive (data+hora, sem Z/offset) → anexa "-03:00".
//   • já tem Z ou ±offset                     → retorna inalterada.
//   • null / vazia / formato não reconhecido  → retorna null (conservador: nunca
//     inventa fuso sobre algo que não é um datetime naive bem-formado; o caller
//     decide se isso vira "sem clock" — I2/I5, nunca chuta).
// ─────────────────────────────────────────────────────────────────────────────
const NAIVE_DATETIME_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/;
const HAS_TZ_RE = /(Z|[+-]\d{2}:?\d{2})$/;

export function ensureBrOffset(iso: string | null | undefined): string | null {
  if (typeof iso !== "string" || iso.length === 0) return null;
  if (HAS_TZ_RE.test(iso)) return iso; // já tem Z ou offset → absoluto, não toca
  if (NAIVE_DATETIME_RE.test(iso)) return `${iso}${BR_UTC_OFFSET}`; // naive → carimba −03:00
  return null; // formato não reconhecido → conservador (sem clock)
}
