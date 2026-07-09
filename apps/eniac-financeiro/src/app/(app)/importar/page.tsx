import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { resolveSelection } from "@/lib/selection";
import { CompanySwitcher } from "@/components/company-switcher";
import { ImportClient } from "@/components/import-client";

export const dynamic = "force-dynamic";

export default async function ImportarPage() {
  const selection = await resolveSelection();
  if (!selection) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <p className="text-sm text-muted-foreground">Nenhuma empresa vinculada à sua conta ainda.</p>
      </div>
    );
  }

  const { companies, selected } = selection;

  return (
    <main className="pb-nav px-4 pt-4">
      <header className="mb-4 flex items-center gap-2">
        <Link
          href="/mais"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted"
          aria-label="Voltar"
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-lg font-bold">Importar extrato</h1>
      </header>

      <div className="mb-4">
        <CompanySwitcher companies={companies} selectedId={selected.id} />
      </div>

      <ImportClient companyId={selected.id} />
    </main>
  );
}
