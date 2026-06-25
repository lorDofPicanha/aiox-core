import Link from "next/link";
import { ChevronLeft, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { getMonthSummary } from "@/lib/data";
import { resolveSelection } from "@/lib/selection";
import { monthLabel } from "@/lib/dates";
import { formatBRL } from "@/lib/money";
import { MonthNav } from "@/components/month-nav";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ y?: string; m?: string }>;

function resolveMonth(sp: { y?: string; m?: string }): { year: number; month: number } {
  const now = new Date();
  const year = Number(sp.y) || now.getFullYear();
  const month = Number(sp.m) || now.getMonth() + 1;
  if (month < 1 || month > 12) return { year: now.getFullYear(), month: now.getMonth() + 1 };
  return { year, month };
}

export default async function ConsolidadoPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const { year, month } = resolveMonth(sp);

  const selection = await resolveSelection();
  if (!selection) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <p className="text-sm text-muted-foreground">Nenhuma empresa vinculada à sua conta ainda.</p>
      </div>
    );
  }

  const { companies } = selection;
  const summaries = await Promise.all(
    companies.map(async (c) => ({
      company: c,
      summary: await getMonthSummary(c.id, year, month),
    })),
  );

  const total = summaries.reduce(
    (acc, s) => ({
      balance: acc.balance + s.summary.balance,
      totalIn: acc.totalIn + s.summary.totalIn,
      totalOut: acc.totalOut + s.summary.totalOut,
    }),
    { balance: 0, totalIn: 0, totalOut: 0 },
  );

  return (
    <main className="px-4 pb-28 pt-4">
      <header className="mb-4 flex items-center gap-2">
        <Link
          href="/mais"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted"
          aria-label="Voltar"
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-lg font-bold">Consolidado do grupo</h1>
      </header>

      <div className="mb-4">
        <MonthNav year={year} month={month} />
      </div>

      {/* Total do grupo */}
      <section className="mb-5 rounded-2xl bg-primary p-5 text-primary-foreground">
        <p className="text-sm font-medium text-white/60">Saldo somado ({companies.length} empresas)</p>
        <p className="tnum mt-1 text-3xl font-bold tracking-tight">{formatBRL(total.balance)}</p>
        <div className="mt-4 flex gap-4 text-sm">
          <span className="flex items-center gap-1 text-white/70">
            <ArrowUpRight className="h-3.5 w-3.5 text-income" /> {formatBRL(total.totalIn)}
          </span>
          <span className="flex items-center gap-1 text-white/70">
            <ArrowDownLeft className="h-3.5 w-3.5 text-expense" /> {formatBRL(total.totalOut)}
          </span>
        </div>
        <p className="mt-2 text-xs capitalize text-white/50">{monthLabel(year, month)}</p>
      </section>

      {/* Por empresa */}
      <h2 className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Por empresa
      </h2>
      <div className="space-y-2">
        {summaries.map(({ company, summary }) => (
          <div key={company.id} className="rounded-2xl border border-border bg-surface p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">{company.name}</span>
              <span className="tnum text-sm font-bold">{formatBRL(summary.balance)}</span>
            </div>
            <div className="mt-1 flex gap-3 text-xs text-muted-foreground">
              <span className="text-income">+{formatBRL(summary.totalIn)}</span>
              <span className="text-expense">−{formatBRL(summary.totalOut)}</span>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-4 px-1 text-xs text-muted-foreground">
        Visão gerencial (somatório derivado, não persistida). Não constitui demonstração contábil
        consolidada nem caracteriza, por si só, grupo econômico.
      </p>
    </main>
  );
}
