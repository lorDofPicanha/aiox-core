"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { selectCompany } from "@/app/actions";
import type { Company } from "@/lib/data";
import { cn } from "@/lib/utils";

/**
 * Seletor de empresa (segmented control). 1 toque troca o livro-caixa.
 * Para >4 empresas vale migrar para dropdown — por ora 3 cabem como pills.
 */
export function CompanySwitcher({
  companies,
  selectedId,
}: {
  companies: Company[];
  selectedId: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function pick(id: string) {
    if (id === selectedId) return;
    startTransition(async () => {
      await selectCompany(id);
      router.refresh();
    });
  }

  return (
    <div
      className={cn(
        "no-scrollbar flex gap-1 overflow-x-auto rounded-xl bg-muted p-1",
        pending && "opacity-60",
      )}
      role="tablist"
      aria-label="Selecionar empresa"
    >
      {companies.map((c) => {
        const active = c.id === selectedId;
        return (
          <button
            key={c.id}
            role="tab"
            aria-selected={active}
            onClick={() => pick(c.id)}
            disabled={pending}
            className={cn(
              "flex-1 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold transition-colors",
              active
                ? "bg-surface text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {c.name}
          </button>
        );
      })}
    </div>
  );
}
