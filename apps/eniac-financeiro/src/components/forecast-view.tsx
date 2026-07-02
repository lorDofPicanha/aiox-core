import { TrendingUp, TrendingDown, AlertCircle } from "lucide-react";
import { formatBRL } from "@/lib/money";
import { dayLabel } from "@/lib/dates";
import type { Forecast } from "@/lib/forecast";
import { cn } from "@/lib/utils";

/** Apresenta a previsão determinística de saldo (próximos 90 dias). */
export function ForecastView({ forecast }: { forecast: Forecast }) {
  const { startBalance, points, goesNegativeOn, snapshot30, snapshot60, snapshot90 } = forecast;

  return (
    <div className="space-y-5">
      <section className="hero-ink rounded-[22px] p-5 text-primary-foreground shadow-lg shadow-primary/25">
        <p className="text-sm font-medium text-white/60">Saldo hoje</p>
        <p className="tnum mt-1 text-3xl font-bold tracking-tight">{formatBRL(startBalance)}</p>

        <div className="mt-5 grid grid-cols-3 gap-2">
          <Snapshot label="30 dias" value={snapshot30} />
          <Snapshot label="60 dias" value={snapshot60} />
          <Snapshot label="90 dias" value={snapshot90} />
        </div>
      </section>

      {goesNegativeOn && (
        <div className="flex items-center gap-2.5 rounded-xl bg-expense-soft px-3.5 py-3 text-sm font-medium text-expense">
          <AlertCircle className="h-4 w-4 shrink-0" />
          Pelo previsto, o saldo fica negativo em {dayLabel(goesNegativeOn)}.
        </div>
      )}

      <div>
        <h2 className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Movimentos previstos (vencimentos em aberto)
        </h2>
        {points.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-surface p-6 text-center text-sm text-muted-foreground">
            Nenhum vencimento em aberto nos próximos 90 dias.
          </div>
        ) : (
          <div className="space-y-2">
            {points.map((p) => (
              <div
                key={p.date}
                className="flex items-center gap-3 rounded-2xl border border-border bg-surface px-3.5 py-3"
              >
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium">{dayLabel(p.date)}</span>
                  <span className="block text-xs text-muted-foreground">
                    {p.inflow > 0 && <span className="text-income">+{formatBRL(p.inflow)} </span>}
                    {p.outflow > 0 && <span className="text-expense">−{formatBRL(p.outflow)}</span>}
                  </span>
                </span>
                <span
                  className={cn(
                    "tnum shrink-0 text-sm font-semibold",
                    p.balance < 0 ? "text-expense" : "text-foreground",
                  )}
                >
                  {formatBRL(p.balance)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="px-1 text-xs text-muted-foreground">
        Projeção determinística: saldo atual + vencimentos em aberto, por data. Não inclui receitas/
        despesas ainda não lançadas.
      </p>
    </div>
  );
}

function Snapshot({ label, value }: { label: string; value: number }) {
  const negative = value < 0;
  return (
    <div className="rounded-2xl bg-white/[0.08] p-2.5">
      <div className="flex items-center gap-1 text-[11px] text-white/60">
        {negative ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
        {label}
      </div>
      <p className={cn("tnum mt-0.5 text-sm font-semibold", negative && "text-expense")}>
        {formatBRL(value)}
      </p>
    </div>
  );
}
