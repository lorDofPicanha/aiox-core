"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, Check, Ban, AlertCircle } from "lucide-react";
import {
  createScheduled,
  markScheduledPaid,
  voidScheduled,
} from "@/app/(app)/vencimentos/actions";
import type { Scheduled, Direction, ScheduledTotals } from "@/lib/scheduled";
import { categoriesFor } from "@/lib/categories";
import { formatBRL, centsStringToReais, formatCentsInput } from "@/lib/money";
import { dueLabel, daysUntil, todayISO } from "@/lib/dates";
import { cn } from "@/lib/utils";

export function ScheduledManager({
  companyId,
  items,
  totals,
}: {
  companyId: string;
  items: Scheduled[];
  totals: ScheduledTotals;
}) {
  const [tab, setTab] = useState<Direction>("payable");
  const [adding, setAdding] = useState(false);

  const filtered = items.filter((i) => i.direction === tab);
  const overdue = filtered.filter((i) => daysUntil(i.due_date) < 0);
  const soon = filtered.filter((i) => {
    const n = daysUntil(i.due_date);
    return n >= 0 && n <= 7;
  });
  const later = filtered.filter((i) => daysUntil(i.due_date) > 7);

  return (
    <div className="space-y-5">
      {/* Totais */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-border bg-surface p-4">
          <p className="text-xs font-medium text-muted-foreground">A receber</p>
          <p className="tnum mt-1 text-xl font-bold text-income">{formatBRL(totals.toReceive)}</p>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-4">
          <p className="text-xs font-medium text-muted-foreground">A pagar</p>
          <p className="tnum mt-1 text-xl font-bold text-expense">{formatBRL(totals.toPay)}</p>
        </div>
      </div>

      {/* Abas */}
      <div className="grid grid-cols-2 gap-1 rounded-xl bg-muted p-1">
        <button
          onClick={() => setTab("payable")}
          className={cn(
            "rounded-lg py-2.5 text-sm font-semibold transition-colors",
            tab === "payable" ? "bg-surface text-foreground shadow-sm" : "text-muted-foreground",
          )}
        >
          A pagar
        </button>
        <button
          onClick={() => setTab("receivable")}
          className={cn(
            "rounded-lg py-2.5 text-sm font-semibold transition-colors",
            tab === "receivable" ? "bg-surface text-foreground shadow-sm" : "text-muted-foreground",
          )}
        >
          A receber
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-surface p-8 text-center">
          <p className="text-sm font-medium">Nada em aberto</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Toque em <span className="font-semibold text-foreground">+ Adicionar</span> para registrar
            um vencimento.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <Group label="Vencidas" items={overdue} highlight />
          <Group label="Próximos 7 dias" items={soon} />
          <Group label="Mais tarde" items={later} />
        </div>
      )}

      <button
        onClick={() => setAdding(true)}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-border bg-surface text-sm font-semibold hover:bg-muted"
      >
        <Plus className="h-4 w-4" /> Adicionar {tab === "payable" ? "conta a pagar" : "conta a receber"}
      </button>

      {adding && (
        <AddSheet companyId={companyId} direction={tab} onClose={() => setAdding(false)} />
      )}
    </div>
  );
}

function Group({ label, items, highlight }: { label: string; items: Scheduled[]; highlight?: boolean }) {
  if (items.length === 0) return null;
  return (
    <div>
      <p
        className={cn(
          "mb-1.5 flex items-center gap-1 px-1 text-xs font-semibold uppercase tracking-wide",
          highlight ? "text-expense" : "text-muted-foreground",
        )}
      >
        {highlight && <AlertCircle className="h-3.5 w-3.5" />}
        {label}
      </p>
      <div className="overflow-hidden rounded-2xl border border-border bg-surface">
        {items.map((it, i) => (
          <Row key={it.id} item={it} isLast={i === items.length - 1} />
        ))}
      </div>
    </div>
  );
}

function Row({ item, isLast }: { item: Scheduled; isLast: boolean }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const isReceivable = item.direction === "receivable";

  function pay() {
    startTransition(async () => {
      const res = await markScheduledPaid(item.id);
      if (res.status === "ok") router.refresh();
    });
  }
  function remove() {
    const reason = window.prompt("Informe o motivo da anulação:");
    if (!reason?.trim()) return;
    startTransition(async () => {
      const res = await voidScheduled(item.id, reason);
      if (res.status === "ok") router.refresh();
    });
  }

  return (
    <div className={cn("px-3.5 py-3", !isLast && "border-b border-border", pending && "opacity-50")}>
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">
            {item.description?.trim() || item.category || (isReceivable ? "A receber" : "A pagar")}
          </p>
          <p className={cn("text-xs", daysUntil(item.due_date) < 0 ? "text-expense" : "text-muted-foreground")}>
            {dueLabel(item.due_date)}
            {item.category ? ` · ${item.category}` : ""}
          </p>
        </div>
        <span className={cn("tnum shrink-0 text-sm font-semibold", isReceivable ? "text-income" : "text-expense")}>
          {formatBRL(item.amount)}
        </span>
      </div>

      <div className="mt-2.5 flex gap-2">
        <button
          onClick={pay}
          disabled={pending}
          className="inline-flex items-center gap-1.5 rounded-lg bg-income-soft px-3 py-1.5 text-xs font-semibold text-income disabled:opacity-50"
        >
          <Check className="h-3.5 w-3.5" /> Marcar como pago
        </button>
        <button
          onClick={remove}
          disabled={pending}
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted disabled:opacity-50"
        >
          <Ban className="h-3.5 w-3.5" /> Anular
        </button>
      </div>
    </div>
  );
}

function AddSheet({
  companyId,
  direction,
  onClose,
}: {
  companyId: string;
  direction: Direction;
  onClose: () => void;
}) {
  const router = useRouter();
  const [digits, setDigits] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState(todayISO());
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const amount = centsStringToReais(digits);
  const cats = categoriesFor(direction === "receivable" ? "in" : "out");
  const isReceivable = direction === "receivable";

  function save() {
    if (amount <= 0 || pending) return;
    startTransition(async () => {
      const res = await createScheduled({
        companyId,
        direction,
        amount,
        dueDate,
        category,
        description: description.trim() || null,
      });
      if (res.status === "ok") {
        onClose();
        router.refresh();
      } else {
        setError(res.message ?? "Não foi possível salvar");
      }
    });
  }

  return (
    <div className="fixed inset-0 z-40 flex flex-col justify-end">
      <button aria-label="Fechar" onClick={onClose} className="absolute inset-0 bg-black/40" />
      <div className="relative w-full rounded-t-3xl bg-surface p-5 pb-7 shadow-2xl">
        <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-border" />
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">{isReceivable ? "Conta a receber" : "Conta a pagar"}</h2>
          <button onClick={onClose} aria-label="Fechar" className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-4 flex items-baseline justify-center gap-1.5 rounded-2xl bg-muted py-5">
          <span className="text-2xl font-semibold text-muted-foreground">R$</span>
          <input
            autoFocus
            inputMode="numeric"
            pattern="[0-9]*"
            value={formatCentsInput(digits)}
            onChange={(e) => setDigits(e.target.value.replace(/\D/g, "").slice(0, 12))}
            className={cn("tnum w-auto max-w-[70%] bg-transparent text-center text-4xl font-bold outline-none", isReceivable ? "text-income" : "text-expense")}
            aria-label="Valor"
          />
        </div>

        <div className="no-scrollbar mb-4 flex gap-2 overflow-x-auto">
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => setCategory((cur) => (cur === c ? null : c))}
              className={cn(
                "whitespace-nowrap rounded-full border px-3.5 py-2 text-sm font-medium transition-colors",
                category === c ? "border-primary bg-primary text-primary-foreground" : "border-border bg-surface text-muted-foreground",
              )}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mb-4 space-y-2.5">
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descrição (opcional)"
            maxLength={280}
            className="h-12 w-full rounded-xl border border-border bg-surface px-4 text-base placeholder:text-muted-foreground focus:border-accent focus:outline-none"
          />
          <label className="flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-2.5">
            <span className="text-sm text-muted-foreground">Vencimento</span>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="bg-transparent text-sm font-medium text-foreground outline-none"
            />
          </label>
        </div>

        {error && <p className="mb-3 text-sm text-expense" role="alert">{error}</p>}

        <button
          onClick={save}
          disabled={amount <= 0 || pending}
          className={cn("h-14 w-full rounded-2xl text-base font-bold text-white transition-colors disabled:opacity-40", isReceivable ? "bg-income" : "bg-expense")}
        >
          {pending ? "Salvando..." : "Salvar"}
        </button>
      </div>
    </div>
  );
}
