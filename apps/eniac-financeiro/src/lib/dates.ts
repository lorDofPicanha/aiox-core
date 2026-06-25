/** Helpers de data, sempre em pt-BR e fuso local do dispositivo. */

const MONTHS = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];

/** "junho de 2026" */
export function monthLabel(year: number, month: number): string {
  return `${MONTHS[month - 1]} de ${year}`;
}

/** Mês anterior/seguinte como {year, month} (month 1-12). */
export function shiftMonth(year: number, month: number, delta: number): { year: number; month: number } {
  const zero = month - 1 + delta;
  const y = year + Math.floor(zero / 12);
  const m = ((zero % 12) + 12) % 12;
  return { year: y, month: m + 1 };
}

/** Rótulo de um dia: "Hoje", "Ontem" ou "15 de junho". */
export function dayLabel(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  const today = new Date();
  const todayMid = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const diffDays = Math.round((todayMid.getTime() - date.getTime()) / 86_400_000);

  if (diffDays === 0) return "Hoje";
  if (diffDays === 1) return "Ontem";
  return `${d} de ${MONTHS[m - 1]}`;
}

/** Dias entre hoje e uma data (positivo = futuro, negativo = passado). */
export function daysUntil(dateStr: string): number {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  const now = new Date();
  const todayMid = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((date.getTime() - todayMid.getTime()) / 86_400_000);
}

/** Rótulo de vencimento: "Vence hoje", "Vence amanhã", "Venceu há 3 dias"... */
export function dueLabel(dateStr: string): string {
  const n = daysUntil(dateStr);
  if (n === 0) return "Vence hoje";
  if (n === 1) return "Vence amanhã";
  if (n === -1) return "Venceu ontem";
  if (n > 1) return `Vence em ${n} dias`;
  return `Venceu há ${Math.abs(n)} dias`;
}

/** YYYY-MM-DD no fuso local (para default de "hoje" em inputs). */
export function todayISO(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
