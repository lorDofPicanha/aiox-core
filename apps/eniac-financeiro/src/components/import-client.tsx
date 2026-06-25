"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Upload, FileText, CheckCircle2 } from "lucide-react";
import { importEntries } from "@/app/(app)/importar/actions";
import { parseStatement, type ParsedTxn } from "@/lib/import/parse";
import { guessCategory } from "@/lib/categorize";
import { formatBRL } from "@/lib/money";
import { dayLabel } from "@/lib/dates";
import { cn } from "@/lib/utils";

interface Draft extends ParsedTxn {
  category: string | null;
  include: boolean;
}

export function ImportClient({ companyId }: { companyId: string }) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [filename, setFilename] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<{ imported: number; skipped: number } | null>(null);
  const [pending, startTransition] = useTransition();

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    setError(null);
    setDone(null);
    const file = e.target.files?.[0];
    if (!file) return;
    setFilename(file.name);
    try {
      const text = await file.text();
      const txns = parseStatement(file.name, text);
      if (txns.length === 0) {
        setError("Nenhum lançamento reconhecido no arquivo. Confira se é um OFX ou CSV válido.");
        setDrafts([]);
        return;
      }
      setDrafts(
        txns.map((t) => ({ ...t, category: guessCategory(t.description, t.type), include: true })),
      );
    } catch {
      setError("Não consegui ler o arquivo.");
    }
  }

  function toggle(i: number) {
    setDrafts((d) => d.map((x, idx) => (idx === i ? { ...x, include: !x.include } : x)));
  }

  function doImport() {
    const items = drafts
      .filter((d) => d.include)
      .map((d) => ({
        date: d.date,
        type: d.type,
        amount: d.amount,
        category: d.category,
        description: d.description,
        externalRef: d.externalRef,
      }));
    if (items.length === 0) return;

    startTransition(async () => {
      const res = await importEntries({ companyId, items });
      if (res.status === "ok") {
        setDone({ imported: res.imported ?? 0, skipped: res.skipped ?? 0 });
        setDrafts([]);
        setFilename(null);
        if (fileRef.current) fileRef.current.value = "";
        router.refresh();
      } else {
        setError(res.message ?? "Falha ao importar");
      }
    });
  }

  const selectedCount = drafts.filter((d) => d.include).length;

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Suba o extrato do banco em <strong className="text-foreground">OFX</strong> ou{" "}
        <strong className="text-foreground">CSV</strong>. Revise os lançamentos e importe — itens já
        importados antes são ignorados automaticamente.
      </p>

      <label className="flex h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border bg-surface text-muted-foreground hover:bg-muted">
        <Upload className="h-6 w-6" />
        <span className="text-sm font-medium">
          {filename ? filename : "Toque para escolher um arquivo"}
        </span>
        <input
          ref={fileRef}
          type="file"
          accept=".ofx,.csv,text/csv,application/x-ofx"
          onChange={onFile}
          className="hidden"
        />
      </label>

      {error && (
        <p className="rounded-xl bg-expense-soft px-4 py-3 text-sm text-expense" role="alert">
          {error}
        </p>
      )}

      {done && (
        <div className="flex items-center gap-2 rounded-xl bg-income-soft px-4 py-3 text-sm text-income">
          <CheckCircle2 className="h-4 w-4" />
          {done.imported} importado(s){done.skipped > 0 ? `, ${done.skipped} já existia(m)` : ""}.
        </div>
      )}

      {drafts.length > 0 && (
        <>
          <div className="flex items-center justify-between px-1">
            <p className="text-sm font-semibold">
              {drafts.length} lançamento(s) · {selectedCount} selecionado(s)
            </p>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </div>

          <div className="overflow-hidden rounded-2xl border border-border bg-surface">
            {drafts.map((d, i) => {
              const isIn = d.type === "in";
              return (
                <button
                  key={i}
                  onClick={() => toggle(i)}
                  className={cn(
                    "flex w-full items-center gap-3 px-3.5 py-2.5 text-left",
                    i !== drafts.length - 1 && "border-b border-border",
                    !d.include && "opacity-40",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border",
                      d.include ? "border-accent bg-accent text-white" : "border-border",
                    )}
                  >
                    {d.include && <CheckCircle2 className="h-3.5 w-3.5" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{d.description}</span>
                    <span className="block text-xs text-muted-foreground">
                      {dayLabel(d.date)}
                      {d.category ? ` · ${d.category}` : ""}
                    </span>
                  </span>
                  <span className={cn("tnum shrink-0 text-sm font-semibold", isIn ? "text-income" : "text-expense")}>
                    {isIn ? "+" : "−"} {formatBRL(d.amount)}
                  </span>
                </button>
              );
            })}
          </div>

          <button
            onClick={doImport}
            disabled={selectedCount === 0 || pending}
            className="h-14 w-full rounded-2xl bg-primary text-base font-bold text-primary-foreground transition-colors disabled:opacity-40"
          >
            {pending ? "Importando..." : `Importar ${selectedCount} lançamento(s)`}
          </button>
        </>
      )}
    </div>
  );
}
