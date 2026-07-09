import { getMonthSummary, listEntries } from "@/lib/data";
import { resolveSelection } from "@/lib/selection";
import { monthLabel } from "@/lib/dates";
import { CompanySwitcher } from "@/components/company-switcher";
import { MonthNav } from "@/components/month-nav";
import { ReportView } from "@/components/report-view";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ y?: string; m?: string }>;

function resolveMonth(sp: { y?: string; m?: string }): { year: number; month: number } {
  const now = new Date();
  const year = Number(sp.y) || now.getFullYear();
  const month = Number(sp.m) || now.getMonth() + 1;
  if (month < 1 || month > 12) return { year: now.getFullYear(), month: now.getMonth() + 1 };
  return { year, month };
}

export default async function RelatoriosPage({ searchParams }: { searchParams: SearchParams }) {
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
  const [summary, entries] = await Promise.all([
    getMonthSummary(selected.id, year, month),
    listEntries(selected.id, year, month),
  ]);

  return (
    <main className="pb-nav px-4 pt-4">
      <header className="mb-4">
        <h1 className="text-lg font-bold">Relatórios</h1>
      </header>

      <div className="mb-4">
        <CompanySwitcher companies={companies} selectedId={selected.id} />
      </div>

      <div className="mb-4">
        <MonthNav year={year} month={month} />
      </div>

      <ReportView
        entries={entries}
        summary={summary}
        monthName={monthLabel(year, month)}
        companyName={selected.name}
      />
    </main>
  );
}
