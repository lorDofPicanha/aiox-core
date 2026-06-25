/**
 * Alertas proativos — DETERMINÍSTICOS (regras simples sobre dados reais).
 * Sem IA: cada alerta é uma condição verificável. Os "insights" em linguagem
 * natural (se um dia entrarem) ficam no copiloto, nunca aqui.
 */

import type { Scheduled } from "@/lib/scheduled";
import { computeForecast } from "@/lib/forecast";
import { daysUntil } from "@/lib/dates";

export type AlertLevel = "danger" | "warning" | "info";

export interface Alert {
  level: AlertLevel;
  title: string;
  amount?: number;
}

export function computeAlerts(balance: number, scheduled: Scheduled[]): Alert[] {
  const alerts: Alert[] = [];

  // Saldo atual negativo
  if (balance < 0) {
    alerts.push({ level: "danger", title: "Saldo atual negativo", amount: balance });
  }

  // Contas vencidas (a pagar em aberto com vencimento no passado)
  const overdue = scheduled.filter((s) => s.direction === "payable" && daysUntil(s.due_date) < 0);
  if (overdue.length > 0) {
    const total = overdue.reduce((sum, s) => sum + s.amount, 0);
    alerts.push({
      level: "danger",
      title: `${overdue.length} conta(s) vencida(s)`,
      amount: total,
    });
  }

  // A pagar nos próximos 3 dias
  const dueSoon = scheduled.filter((s) => {
    const d = daysUntil(s.due_date);
    return s.direction === "payable" && d >= 0 && d <= 3;
  });
  if (dueSoon.length > 0) {
    const total = dueSoon.reduce((sum, s) => sum + s.amount, 0);
    alerts.push({
      level: "warning",
      title: `${dueSoon.length} conta(s) vencem em até 3 dias`,
      amount: total,
    });
  }

  // Projeção: saldo pode ficar negativo dentro do horizonte
  const forecast = computeForecast(balance, scheduled);
  if (balance >= 0 && forecast.goesNegativeOn) {
    alerts.push({
      level: "warning",
      title: `Saldo pode ficar negativo até ${forecast.goesNegativeOn.split("-").reverse().slice(0, 2).join("/")}`,
    });
  }

  return alerts;
}
