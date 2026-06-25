/**
 * Previsão de fluxo de caixa — DETERMINÍSTICA. Projeta o saldo aplicando os
 * vencimentos em aberto (a receber +, a pagar −) sobre o saldo atual, em ordem
 * de data. Nenhum número é estimado por IA — é aritmética sobre dados reais.
 */

import type { Scheduled } from "@/lib/scheduled";
import { daysUntil } from "@/lib/dates";

export interface ForecastPoint {
  date: string; // YYYY-MM-DD
  balance: number; // saldo projetado após os lançamentos do dia
  inflow: number;
  outflow: number;
}

export interface Forecast {
  startBalance: number;
  points: ForecastPoint[];
  min: { date: string; balance: number } | null;
  goesNegativeOn: string | null;
  snapshot30: number;
  snapshot60: number;
  snapshot90: number;
}

export function computeForecast(startBalance: number, scheduled: Scheduled[]): Forecast {
  // Considera apenas vencimentos em aberto dos próximos 90 dias.
  const horizon = scheduled
    .filter((s) => {
      const d = daysUntil(s.due_date);
      return d >= 0 && d <= 90;
    })
    .slice()
    .sort((a, b) => a.due_date.localeCompare(b.due_date));

  // Agrupa por data.
  const byDate = new Map<string, { inflow: number; outflow: number }>();
  for (const s of horizon) {
    const cur = byDate.get(s.due_date) ?? { inflow: 0, outflow: 0 };
    if (s.direction === "receivable") cur.inflow += s.amount;
    else cur.outflow += s.amount;
    byDate.set(s.due_date, cur);
  }

  const dates = [...byDate.keys()].sort();
  let running = startBalance;
  const points: ForecastPoint[] = [];
  let min: { date: string; balance: number } | null = null;
  let goesNegativeOn: string | null = null;

  for (const date of dates) {
    const { inflow, outflow } = byDate.get(date)!;
    running += inflow - outflow;
    points.push({ date, balance: running, inflow, outflow });
    if (min === null || running < min.balance) min = { date, balance: running };
    if (goesNegativeOn === null && running < 0) goesNegativeOn = date;
  }

  const balanceAt = (days: number): number => {
    let bal = startBalance;
    for (const p of points) {
      if (daysUntil(p.date) <= days) bal = p.balance;
      else break;
    }
    return bal;
  };

  return {
    startBalance,
    points,
    min,
    goesNegativeOn,
    snapshot30: balanceAt(30),
    snapshot60: balanceAt(60),
    snapshot90: balanceAt(90),
  };
}
