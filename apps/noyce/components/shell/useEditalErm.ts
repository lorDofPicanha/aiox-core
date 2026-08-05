"use client";

// Hook compartilhado que resolve as EXIGÊNCIAS do edital (ERM) para QUALQUER edital, não só os
// 2 curados. Ordem de prioridade:
//   1. ERM CURADO (verificado à mão) — getCuratedErmForEdital.
//   2. ERM EXTRAÍDO do PNCP (cache local "noyce.erm.extracted.v1.") — extração determinística.
//   3. pull(): baixa o edital + extrai via /api/edital-erm e cacheia.
// Antes este fluxo vivia inline só no ReviewDossier (aba Analisar); agora a HabilitarTab também
// consome, então o motor de habilitação (buildHabilitationResult) roda contra o acervo real da
// ENIAC em qualquer edital — o "destrave" que ligou os 5 CATs + 2 balanços de verdade.
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { EditalRequirementsModel, HabilitationResult, Opportunity } from "@/lib/noyce-model";
import { getCuratedErmForEdital } from "@/lib/noyce-erm";
import { buildHabilitationResult } from "@/lib/noyce-habilitation";
import { eniacCcp, SCORE_AS_OF } from "@/lib/noyce-data";
import { vaultToRegularity } from "@/lib/noyce-vault";
import { useVaultMeta } from "@/components/shell/useLiveChecklist";

export const ERM_CACHE_PREFIX = "noyce.erm.extracted.v1.";

export type ErmStatus = "idle" | "loading" | "done" | "error";
export interface ErmConfidence {
  declaracoes: string;
  cnds: string;
}

export interface UseEditalErm {
  /** ERM efetivo: curado tem prioridade; senão o extraído (se houver). */
  erm: EditalRequirementsModel | undefined;
  /** true quando a origem é um ERM verificado à mão. */
  curated: boolean;
  status: ErmStatus;
  confidence: ErmConfidence | null;
  /** Mensagem de erro real (motivo da falha de extração), pronta p/ exibir. null quando sem erro. */
  errorMsg: string | null;
  /** Baixa o edital do PNCP e extrai as exigências (declarações/CNDs). Cacheia o resultado. */
  pull: () => Promise<void>;
}

interface ErmCachePayload {
  erm: EditalRequirementsModel;
  confidence?: ErmConfidence | null;
}

export function useEditalErm(opportunity: Pick<Opportunity, "id" | "source">): UseEditalErm {
  const curatedErm = useMemo(
    () => getCuratedErmForEdital({ id: opportunity.id, pncpId: opportunity.id }) ?? undefined,
    [opportunity.id],
  );
  const [extractedErm, setExtractedErm] = useState<EditalRequirementsModel | undefined>(undefined);
  const [status, setStatus] = useState<ErmStatus>("idle");
  const [confidence, setConfidence] = useState<ErmConfidence | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const activeRequest = useRef<AbortController | null>(null);
  const requestGeneration = useRef(0);

  // Restaura ERM extraído do cache ao trocar de oportunidade (evita re-baixar do PNCP).
  useEffect(() => {
    activeRequest.current?.abort();
    activeRequest.current = null;
    requestGeneration.current += 1;
    setExtractedErm(undefined);
    setConfidence(null);
    setStatus("idle");
    setErrorMsg(null);
    if (!curatedErm) {
      const cached = globalThis.localStorage?.getItem(ERM_CACHE_PREFIX + opportunity.id);
      if (cached) {
        try {
          const parsed = JSON.parse(cached) as ErmCachePayload;
          setExtractedErm(parsed.erm);
          setConfidence(parsed.confidence ?? null);
          setStatus("done");
        } catch {
          /* cache corrompido — ignora */
        }
      }
    }
    return () => {
      activeRequest.current?.abort();
      requestGeneration.current += 1;
    };
  }, [opportunity.id, curatedErm]);

  const pull = useCallback(async () => {
    activeRequest.current?.abort();
    const controller = new AbortController();
    activeRequest.current = controller;
    const generation = ++requestGeneration.current;
    const isCurrent = () => requestGeneration.current === generation && !controller.signal.aborted;
    setStatus("loading");
    setErrorMsg(null);
    try {
      const res = await fetch("/api/edital-erm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pncpId: opportunity.id }),
        signal: controller.signal,
      });
      const data = (await res.json().catch(() => ({}))) as {
        erm?: EditalRequirementsModel;
        confidence?: ErmConfidence | null;
        error?: string;
      };
      if (!isCurrent()) return;
      if (!res.ok || !data.erm) {
        // Mensagem real do servidor + dica por fonte (ComprasGov não está no path do PNCP).
        const serverMsg = data.error ?? `erro ${res.status}`;
        const semTexto = /nenhum documento de texto/i.test(serverMsg);
        const naoPncp = opportunity.source && opportunity.source !== "pncp" && opportunity.source !== "pcp";
        setErrorMsg(
          naoPncp
            ? `Edital de fonte "${opportunity.source}" — os documentos não estão publicados no PNCP, então a extração automática não os alcança. Suba o edital (PDF) manualmente no vault ou use um edital do PNCP/PCP.`
            : semTexto
              ? "O edital não traz PDF com texto pesquisável (provavelmente escaneado/imagem). Não dá para extrair automaticamente — conferir manualmente ou subir uma versão textual."
              : `Não consegui extrair as exigências: ${serverMsg}`,
        );
        setStatus("error");
        return;
      }
      setExtractedErm(data.erm);
      setConfidence(data.confidence ?? null);
      setStatus("done");
      globalThis.localStorage?.setItem(
        ERM_CACHE_PREFIX + opportunity.id,
        JSON.stringify({ erm: data.erm, confidence: data.confidence ?? null } satisfies ErmCachePayload),
      );
    } catch (e) {
      if (!isCurrent() || (e as Error)?.name === "AbortError") return;
      setErrorMsg(`Falha de rede ao puxar do PNCP: ${(e as Error)?.message ?? String(e)}`);
      setStatus("error");
    } finally {
      if (activeRequest.current === controller) activeRequest.current = null;
    }
  }, [opportunity.id, opportunity.source]);

  return {
    erm: curatedErm ?? extractedErm,
    curated: Boolean(curatedErm),
    status,
    confidence,
    errorMsg,
    pull,
  };
}

/**
 * Auto-pull do edital (30/Jun): puxa as exigências do PNCP SOZINHO quando a licitação é seguida,
 * uma vez por edital, sem clique. Compartilhado por Analisar e Habilitar — a mesma verdade do ERM
 * flui pras duas abas (cache do hook evita re-baixar). `enabled` gateia (ex.: só quando há interesse).
 */
export function useAutoPullErm(erm: UseEditalErm, opportunityId: string, enabled: boolean): void {
  const ranFor = useRef<string | null>(null);
  useEffect(() => {
    if (!enabled) return;
    if (erm.curated || erm.status !== "idle") return; // já curado, carregando, pronto ou em erro
    if (ranFor.current === opportunityId) return;
    ranFor.current = opportunityId;
    void erm.pull();
  }, [enabled, opportunityId, erm.curated, erm.status, erm.pull]);
}

/**
 * Resultado de habilitação computado AO VIVO: cruza o ERM efetivo (curado/extraído) com o acervo
 * real da ENIAC + as certidões que o usuário subiu no vault. Devolve `null` enquanto não há ERM
 * (edital sem exigências curadas e ainda não extraído) — a UI oferece o botão de puxar.
 */
export function useLiveHabilitationResult(opportunity: Pick<Opportunity, "id" | "source">): {
  result: HabilitationResult | null;
  erm: UseEditalErm;
} {
  const erm = useEditalErm(opportunity);
  const meta = useVaultMeta();
  const result = useMemo(() => {
    if (!erm.erm) return null;
    const userRegularity = vaultToRegularity(meta, SCORE_AS_OF);
    const ccpLive =
      userRegularity.length === 0
        ? eniacCcp
        : { ...eniacCcp, regularity: [...eniacCcp.regularity, ...userRegularity] };
    return buildHabilitationResult(ccpLive, erm.erm);
  }, [erm.erm, meta]);
  return { result, erm };
}
