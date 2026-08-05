const DAY_MS = 86_400_000;

function publicationTime(item) {
  const value = Date.parse(String(item?.publicationDate ?? ""));
  return Number.isFinite(value) ? value : null;
}

/**
 * Combines a short, complete PNCP query with the still-valid portion of the
 * previous snapshot. Fresh records win so corrigenda from the PNCP are kept.
 */
export function mergeDiscoveryItems({ freshItems, previousItems, retentionStart }) {
  const cutoff = retentionStart instanceof Date ? retentionStart.getTime() : Date.parse(String(retentionStart));
  if (!Number.isFinite(cutoff)) throw new TypeError("retentionStart inválido");

  const merged = new Map();
  for (const item of previousItems ?? []) {
    const publishedAt = publicationTime(item);
    if (publishedAt === null || publishedAt >= cutoff) merged.set(item.id, item);
  }
  for (const item of freshItems ?? []) merged.set(item.id, item);

  return [...merged.values()].sort((a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity));
}

export function retentionStartFor(now, retentionDays) {
  return new Date(now.getTime() - retentionDays * DAY_MS);
}

/** Once one page exhausts its retries, the snapshot is contractually partial. */
export function shouldAbortCollection(queryStats) {
  return (queryStats?.failQueries ?? 0) > 0;
}

