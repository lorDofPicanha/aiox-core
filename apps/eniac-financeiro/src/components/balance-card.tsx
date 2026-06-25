import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { formatBRL } from "@/lib/money";
import type { MonthSummary } from "@/lib/data";

/**
 * Cartão herói: saldo acumulado em destaque + entradas/saídas do mês.
 * Tudo acima da dobra no celular — é o "olhar rápido" que a usuária pediu.
 */
export function BalanceCard({
  summary,
  monthName,
}: {
  summary: MonthSummary;
  monthName: string;
}) {
  return (
    <section className="rounded-2xl bg-primary p-5 text-primary-foreground shadow-sm">
      <p className="text-sm font-medium text-white/60">Saldo atual</p>
      <p className="tnum mt-1 text-4xl font-bold tracking-tight">
        {formatBRL(summary.balance)}
      </p>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-white/10 p-3">
          <div className="flex items-center gap-1.5 text-xs font-medium text-white/70">
            <ArrowUpRight className="h-3.5 w-3.5 text-income" />
            Entradas
          </div>
          <p className="tnum mt-1 text-lg font-semibold">{formatBRL(summary.totalIn)}</p>
        </div>
        <div className="rounded-xl bg-white/10 p-3">
          <div className="flex items-center gap-1.5 text-xs font-medium text-white/70">
            <ArrowDownLeft className="h-3.5 w-3.5 text-expense" />
            Saídas
          </div>
          <p className="tnum mt-1 text-lg font-semibold">{formatBRL(summary.totalOut)}</p>
        </div>
      </div>

      <p className="mt-3 text-xs capitalize text-white/50">{monthName}</p>
    </section>
  );
}
