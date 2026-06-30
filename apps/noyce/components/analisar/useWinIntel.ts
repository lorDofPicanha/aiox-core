"use client";

// Hook do Win-Intel (30/Jun): ao abrir o dossiê de uma licitação, deriva NA HORA (client, grátis) os
// sinais grounded do histórico do órgão (opportunity.market já vem anexado) e dispara o enriquecimento
// por IA (/api/win-intel) que lê o padrão dos vencedores. Resultado agrupado por aba.
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { EditalRequirementsModel, Opportunity } from "@/lib/noyce-model";
import {
  deriveDeterministicSignals,
  mergeWinIntel,
  parseWinIntel,
  WIN_TABS,
  type WinSuggestion,
  type WinTab,
} from "@/lib/noyce-win-intel";

export type WinIntelStatus = "idle" | "loading" | "done" | "error";

export interface UseWinIntel {
  /** Sugestões por aba — determinísticas (grounded) já presentes; IA some quando enriquece. */
  byTab: Record<WinTab, WinSuggestion[]>;
  status: WinIntelStatus;
  /** true quando a camada IA respondeu (senão são só os sinais grounded). */
  llm: boolean;
  error: string | null;
  total: number;
  /** Re-dispara o enriquecimento por IA manualmente. */
  run: () => Promise<void>;
}

function emptyByTab(): Record<WinTab, WinSuggestion[]> {
  return Object.fromEntries(WIN_TABS.map((t) => [t, [] as WinSuggestion[]])) as Record<WinTab, WinSuggestion[]>;
}

export function useWinIntel(
  opportunity: Pick<Opportunity, "id" | "title" | "buyer" | "estimatedValue" | "market">,
  erm: EditalRequirementsModel | undefined,
  enabled: boolean,
): UseWinIntel {
  const market = opportunity.market ?? null;
  const certame = useMemo(
    () => ({ titulo: opportunity.title, orgao: opportunity.buyer, valorEstimado: opportunity.estimatedValue }),
    [opportunity.title, opportunity.buyer, opportunity.estimatedValue],
  );

  // Camada 1 — determinística, instantânea, grounded. Sempre disponível mesmo sem IA/rede.
  const deterministic = useMemo(
    () => deriveDeterministicSignals({ market, erm: erm ?? null, certame }),
    [market, erm, certame],
  );

  const [byTab, setByTab] = useState<Record<WinTab, WinSuggestion[]>>(() => mergeWinIntel(deterministic, []));
  const [status, setStatus] = useState<WinIntelStatus>("idle");
  const [llm, setLlm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const ranFor = useRef<string | null>(null);

  // Reseta ao trocar de oportunidade — mostra os grounded na hora.
  useEffect(() => {
    setByTab(mergeWinIntel(deterministic, []));
    setStatus("idle");
    setLlm(false);
    setError(null);
    ranFor.current = null;
    // Reset depende só da troca de oportunidade (deterministic recompute via mergeWinIntel).
  }, [opportunity.id]);

  const run = useCallback(async () => {
    setStatus("loading");
    setError(null);
    try {
      const res = await fetch("/api/win-intel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cnpjOrgao: market?.orgaoCnpj ?? null,
          editalId: opportunity.id,
          erm: erm ?? null,
          certame,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        byTab?: Record<string, WinSuggestion[]>;
        llm?: boolean;
        llmError?: string;
        error?: string;
      };
      if (!res.ok) {
        // 422 (sem histórico e sem ERM) não é erro fatal — mantém os grounded que já temos.
        setError(data.error ?? `erro ${res.status}`);
        setStatus(res.status === 422 ? "done" : "error");
        return;
      }
      // O servidor já mescla determinístico + IA; usa a saída dele (re-valida defensivamente).
      const merged = emptyByTab();
      for (const t of WIN_TABS) {
        const fromServer = Array.isArray(data.byTab?.[t]) ? (data.byTab![t] as WinSuggestion[]) : [];
        merged[t] = fromServer.length ? fromServer : byTab[t];
      }
      setByTab(merged);
      setLlm(Boolean(data.llm));
      if (data.llmError) setError(data.llmError);
      setStatus("done");
    } catch (e) {
      setError(`Falha de rede: ${(e as Error)?.message ?? String(e)}`);
      setStatus("error");
    }
  }, [market?.orgaoCnpj, opportunity.id, erm, certame, byTab]);

  // Auto-dispara o enriquecimento UMA vez quando habilitado e há lastro (mercado ou ERM).
  useEffect(() => {
    if (!enabled) return;
    if (ranFor.current === opportunity.id) return;
    if (!market && !erm) return; // nada a analisar
    ranFor.current = opportunity.id;
    void run();
  }, [enabled, opportunity.id, market, erm, run]);

  const total = WIN_TABS.reduce((n, t) => n + byTab[t].length, 0);
  return { byTab, status, llm, error, total, run };
}
