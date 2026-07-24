export interface DiscoveryInboxItem {
  publicationDate?: string | null;
  proposalDeadline: string | null;
  triage: { verdict: "vai" | "olha" | "pula"; score: number };
}

const TRIAGE_RANK: Record<DiscoveryInboxItem["triage"]["verdict"], number> = { vai: 0, olha: 1, pula: 2 };

export function selectDiscoveryInbox<T extends DiscoveryInboxItem>(items: readonly T[], asOf: string): T[] {
  const asOfMs = Date.parse(asOf);
  return items
    .filter((item) => item.proposalDeadline === null || Date.parse(item.proposalDeadline) >= asOfMs)
    .sort((a, b) => {
      const rankDelta = TRIAGE_RANK[a.triage.verdict] - TRIAGE_RANK[b.triage.verdict];
      if (rankDelta !== 0) return rankDelta;
      const publicationDelta = Date.parse(b.publicationDate ?? "") - Date.parse(a.publicationDate ?? "");
      if (Number.isFinite(publicationDelta) && publicationDelta !== 0) return publicationDelta;
      return b.triage.score - a.triage.score;
    });
}
