"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Landmark, RefreshCw, Trash2, Plus, Info } from "lucide-react";
import {
  getConnectToken,
  saveConnection,
  syncConnection,
  removeConnection,
} from "@/app/(app)/conexoes/actions";
import type { BankConnection } from "@/lib/openfinance/connections";
import { cn } from "@/lib/utils";

const PLUGGY_CDN = "https://cdn.pluggy.ai/pluggy-connect/v2.7.0/pluggy-connect.js";

interface PluggyConnectInstance {
  init: () => void;
}
interface PluggyConnectCtor {
  new (opts: {
    connectToken: string;
    onSuccess: (data: { item: { id: string } }) => void;
    onError?: (err: unknown) => void;
  }): PluggyConnectInstance;
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const s = document.createElement("script");
    s.src = src;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("script load failed"));
    document.head.appendChild(s);
  });
}

export function ConnectionsClient({
  companyId,
  connections,
}: {
  companyId: string;
  connections: BankConnection[];
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  async function connectBank() {
    setNotice(null);
    setBusy(true);
    try {
      const res = await getConnectToken();
      if (res.status !== "ok" || !res.token) {
        setNotice(
          res.message === "not_configured"
            ? "Open Finance ainda não configurado. Defina PLUGGY_CLIENT_ID e PLUGGY_CLIENT_SECRET no servidor."
            : res.message ?? "Não foi possível iniciar a conexão.",
        );
        return;
      }

      await loadScript(PLUGGY_CDN);
      const Ctor = (window as unknown as { PluggyConnect?: PluggyConnectCtor }).PluggyConnect;
      if (!Ctor) {
        setNotice("Widget de conexão indisponível no momento. Tente novamente mais tarde.");
        return;
      }

      const widget = new Ctor({
        connectToken: res.token,
        onSuccess: ({ item }) => {
          void saveConnection({ companyId, itemId: item.id }).then(() => router.refresh());
        },
        onError: () => setNotice("A conexão foi cancelada ou falhou."),
      });
      widget.init();
    } catch {
      setNotice("Não foi possível abrir o conector do banco.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Conecte as contas bancárias da empresa para puxar os lançamentos automaticamente — sem digitar
        nem subir arquivo.
      </p>

      {connections.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-surface p-8 text-center">
          <Landmark className="mx-auto h-6 w-6 text-muted-foreground" />
          <p className="mt-2 text-sm font-medium">Nenhum banco conectado</p>
        </div>
      ) : (
        <div className="space-y-2">
          {connections.map((c) => (
            <ConnectionRow key={c.id} conn={c} onNotice={setNotice} />
          ))}
        </div>
      )}

      <button
        onClick={connectBank}
        disabled={busy}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-foreground disabled:opacity-50"
      >
        <Plus className="h-4 w-4" /> {busy ? "Abrindo..." : "Conectar banco"}
      </button>

      {notice && (
        <p className="flex items-start gap-2 rounded-xl bg-muted px-4 py-3 text-sm text-muted-foreground">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          {notice}
        </p>
      )}
    </div>
  );
}

function ConnectionRow({
  conn,
  onNotice,
}: {
  conn: BankConnection;
  onNotice: (msg: string | null) => void;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function sync() {
    onNotice(null);
    startTransition(async () => {
      const res = await syncConnection(conn.id);
      if (res.status === "ok") {
        onNotice(`Sincronizado: ${res.imported ?? 0} novo(s)${res.skipped ? `, ${res.skipped} já existia(m)` : ""}.`);
        router.refresh();
      } else {
        onNotice(res.message ?? "Falha ao sincronizar.");
      }
    });
  }
  function remove() {
    startTransition(async () => {
      const res = await removeConnection(conn.id);
      if (res.status === "ok") router.refresh();
    });
  }

  return (
    <div className={cn("rounded-2xl border border-border bg-surface p-4", pending && "opacity-50")}>
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
          <Landmark className="h-5 w-5 text-foreground" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{conn.institution || "Banco conectado"}</p>
          <p className="text-xs text-muted-foreground">
            {conn.last_synced_at
              ? `Última sincronização: ${new Date(conn.last_synced_at).toLocaleString("pt-BR")}`
              : "Nunca sincronizado"}
          </p>
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        <button
          onClick={sync}
          disabled={pending}
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-muted px-3 py-2 text-xs font-semibold disabled:opacity-50"
        >
          <RefreshCw className={cn("h-3.5 w-3.5", pending && "animate-spin")} /> Sincronizar
        </button>
        <button
          onClick={remove}
          disabled={pending}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-muted disabled:opacity-50"
        >
          <Trash2 className="h-3.5 w-3.5" /> Remover
        </button>
      </div>
    </div>
  );
}
