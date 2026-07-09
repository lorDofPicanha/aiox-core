import { getMonthSummary, listEntries } from "@/lib/data";
import { listOpenScheduled } from "@/lib/scheduled";
import { computeAlerts } from "@/lib/alerts";
import { resolveSelection } from "@/lib/selection";
import { monthLabel } from "@/lib/dates";
import { BalanceCard } from "@/components/balance-card";
import { AlertsStrip } from "@/components/alerts-strip";
import { CompanySwitcher } from "@/components/company-switcher";
import { MonthNav } from "@/components/month-nav";
import { EntryList } from "@/components/entry-list";
import { QuickAddSheet } from "@/components/quick-add-sheet";
import { LogoutButton } from "@/components/logout-button";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ y?: string; m?: string }>;

function resolveMonth(sp: { y?: string; m?: string }): { year: number; month: number } {
  const now = new Date();
  const year = Number(sp.y) || now.getFullYear();
  const month = Number(sp.m) || now.getMonth() + 1;
  if (month < 1 || month > 12) return { year: now.getFullYear(), month: now.getMonth() + 1 };
  return { year, month };
}

export default async function HomePage({ searchParams }: { searchParams: SearchParams }) {
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

  const { companies, selected } = selection;
  const [summary, entries, scheduled] = await Promise.all([
    getMonthSummary(selected.id, year, month),
    listEntries(selected.id, year, month),
    listOpenScheduled(selected.id),
  ]);

  const alerts = computeAlerts(summary.balance, scheduled);

  return (
    <main className="pb-nav px-4 pt-4">
      <header className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Livro Caixa
          </p>
          <h1 className="text-lg font-bold">ENIAC</h1>
        </div>
        <LogoutButton />
      </header>

      <div className="mb-4">
        <CompanySwitcher companies={companies} selectedId={selected.id} />
      </div>

      <div className="mb-5">
        <BalanceCard summary={summary} monthName={monthLabel(year, month)} />
      </div>

      <AlertsStrip alerts={alerts} />

      <div className="mb-3">
        <MonthNav year={year} month={month} />
      </div>

      <EntryList entries={entries} />

      <QuickAddSheet companyId={selected.id} />
    </main>
  );
}
