import { resolveSelection } from "@/lib/selection";
import { listOpenScheduled, getScheduledTotals } from "@/lib/scheduled";
import { CompanySwitcher } from "@/components/company-switcher";
import { ScheduledManager } from "@/components/scheduled-manager";

export const dynamic = "force-dynamic";

export default async function VencimentosPage() {
  const selection = await resolveSelection();
  if (!selection) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <p className="text-sm text-muted-foreground">Nenhuma empresa vinculada à sua conta ainda.</p>
      </div>
    );
  }

  const { companies, selected } = selection;
  const [items, totals] = await Promise.all([
    listOpenScheduled(selected.id),
    getScheduledTotals(selected.id),
  ]);

  return (
    <main className="pb-nav px-4 pt-4">
      <header className="mb-4">
        <h1 className="text-lg font-bold">Vencimentos</h1>
      </header>

      <div className="mb-4">
        <CompanySwitcher companies={companies} selectedId={selected.id} />
      </div>

      <ScheduledManager companyId={selected.id} items={items} totals={totals} />
    </main>
  );
}
