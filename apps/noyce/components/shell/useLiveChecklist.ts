"use client";

// Hook que recomputa o checklist de habilitação AO VIVO com os documentos que o usuário
// subiu no vault (D1, 12/Jun): certidão sobe na Governança → frente fiscal confere na hora.
import { useEffect, useMemo, useState } from "react";
import type { Opportunity } from "@/lib/noyce-model";
import { eniacCcp, SCORE_AS_OF } from "@/lib/noyce-data";
import { buildHabilitationChecklist } from "@/lib/noyce-checklist";
import { loadVaultMeta, vaultToRegularity, type VaultDocMeta } from "@/lib/noyce-vault";

export const VAULT_CHANGED_EVENT = "noyce-vault-changed";

export function useVaultMeta(): VaultDocMeta[] {
  const [meta, setMeta] = useState<VaultDocMeta[]>([]);
  useEffect(() => {
    const refresh = () => setMeta(loadVaultMeta());
    refresh();
    globalThis.addEventListener?.(VAULT_CHANGED_EVENT, refresh);
    globalThis.addEventListener?.("storage", refresh);
    return () => {
      globalThis.removeEventListener?.(VAULT_CHANGED_EVENT, refresh);
      globalThis.removeEventListener?.("storage", refresh);
    };
  }, []);
  return meta;
}

/** Checklist da oportunidade, recalculado com as certidões reais do vault quando existirem. */
export function useLiveChecklist(opportunity: Opportunity) {
  const meta = useVaultMeta();
  return useMemo(() => {
    const userRegularity = vaultToRegularity(meta, SCORE_AS_OF);
    if (userRegularity.length === 0) return opportunity.habilitationChecklist;
    const ccpLive = { ...eniacCcp, regularity: [...eniacCcp.regularity, ...userRegularity] };
    return buildHabilitationChecklist(ccpLive, {
      estimatedValue: opportunity.estimatedValue,
      proposalDeadline: opportunity.proposalDeadline,
      habilitationResult: opportunity.habilitationResult ?? null,
      asOf: SCORE_AS_OF,
    });
  }, [meta, opportunity]);
}
