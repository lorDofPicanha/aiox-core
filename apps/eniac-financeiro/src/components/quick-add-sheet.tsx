"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";
import { createEntry } from "@/app/actions";
import { categoriesFor, type EntryType } from "@/lib/categories";
import { centsStringToReais, formatCentsInput } from "@/lib/money";
import { todayISO } from "@/lib/dates";
import { cn } from "@/lib/utils";

/**
 * Botão flutuante + folha inferior para lançar. Caminho mínimo:
 * toca no +, digita o valor, toca em Salvar (2-3 toques). Categoria opcional.
 */
export function QuickAddSheet({ companyId }: { companyId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<EntryType>("in");
  const [digits, setDigits] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(todayISO());
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const amountRef = useRef<HTMLInputElement>(null);

  const amount = centsStringToReais(digits);
  const canSave = amount > 0 && !pending;

  // Foca o valor ao abrir (abre o teclado numérico no celular).
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => amountRef.current?.focus(), 60);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Trava o scroll do fundo enquanto a folha está aberta.
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  function reset() {
    setType("in");
    setDigits("");
    setCategory(null);
    setDescription("");
    setDate(todayISO());
    setError(null);
  }

  function close() {
    setOpen(false);
    reset();
  }

  function switchType(next: EntryType) {
    setType(next);
    // categoria some se não existir no novo tipo
    if (category && !categoriesFor(next).includes(category)) setCategory(null);
  }

  function save() {
    if (!canSave) return;
    startTransition(async () => {
      const res = await createEntry({
        companyId,
        type,
        amount,
        category,
        description: description.trim() || null,
        entryDate: date,
      });
      if (res.status === "ok") {
        close();
        router.refresh();
      } else {
        setError(res.message ?? "Não foi possível salvar");
      }
    });
  }

  return (
    <>
      {/* FAB */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Novo lançamento"
        className="fab-offset fixed right-5 z-30 flex items-center justify-center rounded-[20px] bg-accent text-white shadow-lg shadow-accent/40 transition-transform active:scale-95"
        style={{ height: 58, width: 58 }}
      >
        <Plus className="h-7 w-7" strokeWidth={2.25} />
      </button>

      {!open ? null : (
        <div className="fixed inset-0 z-40 flex flex-col justify-end">
          {/* Backdrop */}
          <button
            aria-label="Fechar"
            onClick={close}
            className="absolute inset-0 bg-black/40"
          />

          {/* Sheet */}
          <div className="pb-sheet relative w-full rounded-t-3xl bg-surface p-5 shadow-2xl">
            <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-border" />

            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">Novo lançamento</h2>
              <button
                onClick={close}
                aria-label="Fechar"
                className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Toggle entrada/saída */}
            <div className="mb-4 grid grid-cols-2 gap-1 rounded-xl bg-muted p-1">
              <button
                onClick={() => switchType("in")}
                className={cn(
                  "rounded-lg py-2.5 text-sm font-semibold transition-colors",
                  type === "in" ? "bg-income text-white shadow-sm" : "text-muted-foreground",
                )}
              >
                Entrada
              </button>
              <button
                onClick={() => switchType("out")}
                className={cn(
                  "rounded-lg py-2.5 text-sm font-semibold transition-colors",
                  type === "out" ? "bg-expense text-white shadow-sm" : "text-muted-foreground",
                )}
              >
                Saída
              </button>
            </div>

            {/* Valor */}
            <div className="mb-4">
              <div className="flex items-baseline justify-center gap-1.5 rounded-2xl bg-muted py-5">
                <span className="text-2xl font-semibold text-muted-foreground">R$</span>
                <input
                  ref={amountRef}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={formatCentsInput(digits)}
                  onChange={(e) => setDigits(e.target.value.replace(/\D/g, "").slice(0, 12))}
                  className={cn(
                    "tnum w-auto max-w-[70%] bg-transparent text-center text-4xl font-bold outline-none",
                    type === "in" ? "text-income" : "text-expense",
                  )}
                  aria-label="Valor"
                />
              </div>
            </div>

            {/* Categorias */}
            <div className="no-scrollbar mb-4 flex gap-2 overflow-x-auto">
              {categoriesFor(type).map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory((cur) => (cur === c ? null : c))}
                  className={cn(
                    "whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-semibold ring-1 transition-colors",
                    category === c
                      ? type === "in"
                        ? "bg-income-soft text-income ring-income"
                        : "bg-expense-soft text-expense ring-expense"
                      : "bg-muted text-muted-foreground ring-transparent",
                  )}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* Descrição + data */}
            <div className="mb-4 space-y-2.5">
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descrição (opcional)"
                maxLength={280}
                className="h-12 w-full rounded-xl border border-border bg-surface px-4 text-base placeholder:text-muted-foreground focus:border-accent focus:outline-none"
              />
              <label className="flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-2.5">
                <span className="text-sm text-muted-foreground">Data</span>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="bg-transparent text-sm font-medium text-foreground outline-none"
                />
              </label>
            </div>

            {error && (
              <p className="mb-3 text-sm text-expense" role="alert">
                {error}
              </p>
            )}

            <button
              onClick={save}
              disabled={!canSave}
              className={cn(
                "h-14 w-full rounded-2xl text-base font-bold text-white transition-colors disabled:opacity-40",
                type === "in" ? "bg-income" : "bg-expense",
              )}
            >
              {pending ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
