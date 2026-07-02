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
    <section className="hero-ink rounded-[22px] p-5 text-primary-foreground shadow-lg shadow-primary/25">
      <p className="text-sm font-medium text-white/60">Saldo atual</p>
      <p className="tnum mt-1 text-4xl font-bold tracking-tight">
        {formatBRL(summary.balance)}
      </p>

      <div className="mt-5 grid grid-cols-2 gap-2.5">
        <div className="rounded-2xl bg-white/[0.08] p-3">
          <div className="flex items-center gap-1.5 text-xs font-medium text-white/72">
            <span className="flex h-4 w-4 items-center justify-center rounded-md bg-income/20 text-income">
              <ArrowUpRight className="h-3 w-3" strokeWidth={2.5} />
            </span>
            Entradas
          </div>
          <p className="tnum mt-1 text-lg font-semibold">{formatBRL(summary.totalIn)}</p>
        </div>
        <div className="rounded-2xl bg-white/[0.08] p-3">
          <div className="flex items-center gap-1.5 text-xs font-medium text-white/72">
            <span className="flex h-4 w-4 items-center justify-center rounded-md bg-expense/25 text-expense">
              <ArrowDownLeft className="h-3 w-3" strokeWidth={2.5} />
            </span>
            Saídas
          </div>
          <p className="tnum mt-1 text-lg font-semibold">{formatBRL(summary.totalOut)}</p>
        </div>
      </div>

      <p className="mt-3 text-xs capitalize text-white/50">{monthName}</p>
    </section>
  );
}
