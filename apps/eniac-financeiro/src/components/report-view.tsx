"use client";

import { Download, Printer } from "lucide-react";
import { formatBRL } from "@/lib/money";
import type { Entry, MonthSummary } from "@/lib/data";
import { cn } from "@/lib/utils";

interface CategoryRow {
  category: string;
  total: number;
  pct: number;
}

function breakdown(entries: Entry[], type: "in" | "out"): CategoryRow[] {
  const map = new Map<string, number>();
  let sum = 0;
  for (const e of entries) {
    if (e.type !== type) continue;
    const key = e.category?.trim() || "Sem categoria";
    map.set(key, (map.get(key) ?? 0) + e.amount);
    sum += e.amount;
  }
  return [...map.entries()]
    .map(([category, total]) => ({ category, total, pct: sum > 0 ? (total / sum) * 100 : 0 }))
    .sort((a, b) => b.total - a.total);
}

function toCSV(entries: Entry[]): string {
  const header = ["Data", "Tipo", "Categoria", "Descrição", "Valor"].join(";");
  const lines = entries.map((e) =>
    [
      e.entry_date,
      e.type === "in" ? "Entrada" : "Saída",
      (e.category ?? "").replace(/;/g, ","),
      (e.description ?? "").replace(/;/g, ","),
      e.amount.toFixed(2).replace(".", ","),
    ].join(";"),
  );
  return [header, ...lines].join("\r\n");
}

export function ReportView({
  entries,
  summary,
  monthName,
  companyName,
}: {
  entries: Entry[];
  summary: MonthSummary;
  monthName: string;
  companyName: string;
}) {
  const net = summary.totalIn - summary.totalOut;
  const incomeRows = breakdown(entries, "in");
  const expenseRows = breakdown(entries, "out");

  function downloadCSV() {
    const csv = "﻿" + toCSV(entries); // BOM p/ Excel abrir UTF-8 certo
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `livro-caixa-${companyName}-${monthName}.csv`.replace(/\s+/g, "-").toLowerCase();
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-5">
      {/* Resultado do mês */}
      <section className="rounded-2xl border border-border bg-surface p-5">
        <p className="text-sm font-medium text-muted-foreground">Resultado do mês</p>
        <p
          className={cn(
            "tnum mt-1 text-3xl font-bold tracking-tight",
            net >= 0 ? "text-income" : "text-expense",
          )}
        >
          {net >= 0 ? "+" : "−"} {formatBRL(Math.abs(net))}
        </p>
        <div className="mt-3 flex gap-4 text-sm">
          <span className="text-muted-foreground">
            Entradas <span className="tnum font-semibold text-income">{formatBRL(summary.totalIn)}</span>
          </span>
          <span className="text-muted-foreground">
            Saídas <span className="tnum font-semibold text-expense">{formatBRL(summary.totalOut)}</span>
          </span>
        </div>
      </section>

      <CategorySection title="Entradas por categoria" rows={incomeRows} tone="income" />
      <CategorySection title="Saídas por categoria" rows={expenseRows} tone="expense" />

      {/* Export */}
      <div className="grid grid-cols-2 gap-3 print:hidden">
        <button
          onClick={downloadCSV}
          className="flex h-12 items-center justify-center gap-2 rounded-xl border border-border bg-surface text-sm font-semibold hover:bg-muted"
        >
          <Download className="h-4 w-4" /> Exportar CSV
        </button>
        <button
          onClick={() => window.print()}
          className="flex h-12 items-center justify-center gap-2 rounded-xl border border-border bg-surface text-sm font-semibold hover:bg-muted"
        >
          <Printer className="h-4 w-4" /> Imprimir / PDF
        </button>
      </div>
    </div>
  );
}

function CategorySection({
  title,
  rows,
  tone,
}: {
  title: string;
  rows: CategoryRow[];
  tone: "income" | "expense";
}) {
  return (
    <section>
      <h2 className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </h2>
      {rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-surface p-5 text-center text-sm text-muted-foreground">
          Nada neste mês.
        </div>
      ) : (
        <div className="space-y-2.5 rounded-2xl border border-border bg-surface p-4">
          {rows.map((r) => (
            <div key={r.category}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="font-medium">{r.category}</span>
                <span className="tnum font-semibold">{formatBRL(r.total)}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className={cn("h-full rounded-full", tone === "income" ? "bg-income" : "bg-expense")}
                  style={{ width: `${Math.max(4, r.pct)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
