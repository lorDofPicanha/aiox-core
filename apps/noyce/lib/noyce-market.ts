import type { Competitor, MarketStructure } from "@/lib/noyce-model";
import snapshot from "@/lib/data/market-snapshot.json";

// Batch snapshot of real PNCP competitor intelligence (scripts/noyce/build-competitor-snapshot.js).
// Loaded statically (no live API call in-request — the /contratos cnpjOrgao filter is flaky).
interface Snapshot {
  generatedAt: string;
  source: string;
  windowMonths: number;
  note?: string;
  orgaos: MarketStructure[];
}

const data = snapshot as unknown as Snapshot;

export const marketGeneratedAt = data.generatedAt;
export const marketWindowMonths = data.windowMonths;

const TOP_N = 12;

/**
 * Real market structure for an órgão (by CNPJ), or null when we have no usable data
 * (órgão not in the radius seed, or a coverage hole like CEASA/GO sigiloso on BLL).
 * Competitors are trimmed to the top N by R$ for the UI; the full set lives in the snapshot.
 */
export function getMarketForOrgao(cnpj: string | null | undefined): MarketStructure | null {
  if (!cnpj) return null;
  const digits = cnpj.replace(/\D/g, "");
  const entry = data.orgaos.find((o) => o.orgaoCnpj === digits);
  if (!entry || entry.error || !entry.competitors || entry.competitors.length === 0) return null;
  return {
    ...entry,
    competitors: entry.competitors.slice(0, TOP_N) as Competitor[],
  };
}

/** Whether an órgão is known-but-blocked (in snapshot but no usable outcome — e.g. sigiloso). */
export function isCoverageHole(cnpj: string | null | undefined): boolean {
  if (!cnpj) return false;
  const digits = cnpj.replace(/\D/g, "");
  const entry = data.orgaos.find((o) => o.orgaoCnpj === digits);
  return Boolean(entry && (entry.error || !entry.competitors || entry.competitors.length === 0));
}
