"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowDownLeft, ArrowUpRight, Ban } from "lucide-react";
import { voidEntry } from "@/app/actions";
import { formatBRL } from "@/lib/money";
import { dayLabel } from "@/lib/dates";
import type { Entry } from "@/lib/data";
import { cn } from "@/lib/utils";

/** Lista de lançamentos agrupada por dia. Toque no item revela excluir. */
export function EntryList({ entries }: { entries: Entry[] }) {
  if (entries.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-surface p-8 text-center">
        <p className="text-sm font-medium text-foreground">Nenhum lançamento neste mês</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Toque no botão <span className="font-semibold text-foreground">+</span> para registrar a
          primeira entrada ou saída.
        </p>
      </div>
    );
  }

  // Agrupa por dia preservando a ordem (já vem do mais recente).
  const groups: { date: string; items: Entry[] }[] = [];
  for (const e of entries) {
    const last = groups[groups.length - 1];
    if (last && last.date === e.entry_date) last.items.push(e);
    else groups.push({ date: e.entry_date, items: [e] });
  }

  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <div key={group.date}>
          <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {dayLabel(group.date)}
          </p>
          <div className="space-y-2">
            {group.items.map((e) => (
              <EntryRow key={e.id} entry={e} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function EntryRow({ entry }: { entry: Entry }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const isIn = entry.type === "in";

  function remove() {
    const reason = window.prompt("Informe o motivo da anulação:");
    if (!reason?.trim()) return;
    startTransition(async () => {
      const res = await voidEntry(entry.id, reason);
      if (res.status === "ok") {
        setOpen(false);
        router.refresh();
      }
    });
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 px-3 py-3 text-left active:bg-muted"
      >
        <span
          className={cn(
            "flex h-9.5 w-9.5 shrink-0 items-center justify-center rounded-xl",
            isIn ? "bg-income-soft text-income" : "bg-expense-soft text-expense",
          )}
        >
          {isIn ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownLeft className="h-5 w-5" />}
        </span>

        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold text-foreground">
            {entry.description?.trim() || entry.category || (isIn ? "Entrada" : "Saída")}
          </span>
          {entry.category && (
            <span className="block truncate text-xs text-muted-foreground">{entry.category}</span>
          )}
        </span>

        <span
          className={cn(
            "tnum shrink-0 text-sm font-bold",
            isIn ? "text-income" : "text-expense",
          )}
        >
          {isIn ? "+" : "−"} {formatBRL(entry.amount)}
        </span>
      </button>

      {open && (
        <div className="flex items-center justify-end gap-2 border-t border-border bg-muted/60 px-3 py-2">
          <button
            onClick={remove}
            disabled={pending}
            className="inline-flex items-center gap-1.5 rounded-lg bg-expense-soft px-3 py-1.5 text-xs font-semibold text-expense disabled:opacity-50"
          >
            <Ban className="h-3.5 w-3.5" />
            {pending ? "Anulando..." : "Anular"}
          </button>
        </div>
      )}
    </div>
  );
}
