// Candidate dedupe (squad decision 2026-06-08). Three-tier match:
//   1. exact_duplicate     — identical dedupeKey (cnpj|edital|processo|data|valor)
//                            OR identical normalizedHash (same normalized content).
//   2. semantic_duplicate  — identical fallback key (orgao|objeto_fingerprint|muni|uf|data).
//   3. possible_duplicate  — same órgão+data with high objeto-fingerprint overlap.
// First occurrence stays `unique`; later collisions are tagged. Nothing is deleted —
// duplicates are surfaced for human review, not silently dropped.

import type { CanonicalOpportunity, DuplicateStatus } from "./noyce-source-adapter";

export interface DedupeReport {
  total: number;
  unique: number;
  exact: number;
  semantic: number;
  possible: number;
  groups: Array<{ key: string; status: DuplicateStatus; candidateIds: string[] }>;
}

export interface DedupeResult {
  candidates: CanonicalOpportunity[]; // same array, duplicateStatus mutated
  unique: CanonicalOpportunity[];
  duplicates: CanonicalOpportunity[];
  report: DedupeReport;
}

function fingerprintParts(fallbackKey: string): { orgaoDate: string; objeto: string } {
  // fallback = buyer|objeto|city|uf|date  → group by buyer+uf+date, compare objeto
  const [buyer, objeto, , uf, date] = fallbackKey.split("|");
  return { orgaoDate: `${buyer}|${uf}|${date}`, objeto };
}

function tokenOverlap(a: string, b: string): number {
  const sa = new Set(a.split(" ").filter(Boolean));
  const sb = new Set(b.split(" ").filter(Boolean));
  if (sa.size === 0 || sb.size === 0) return 0;
  let inter = 0;
  for (const t of sa) if (sb.has(t)) inter += 1;
  return inter / Math.max(sa.size, sb.size);
}

export function dedupeCandidates(candidates: CanonicalOpportunity[]): DedupeResult {
  const seenExact = new Map<string, string>(); // dedupeKey|hash → first candidateId
  const seenSemantic = new Map<string, string>(); // fallbackKey → first candidateId
  const groups = new Map<string, { status: DuplicateStatus; candidateIds: string[] }>();

  const possibleAnchors: Array<{ id: string; orgaoDate: string; objeto: string }> = [];

  const pushGroup = (key: string, status: DuplicateStatus, firstId: string, dupId: string) => {
    const existing = groups.get(key);
    if (existing) {
      if (!existing.candidateIds.includes(dupId)) existing.candidateIds.push(dupId);
    } else {
      groups.set(key, { status, candidateIds: [firstId, dupId] });
    }
  };

  for (const c of candidates) {
    c.duplicateStatus = "unique";

    const exactKeyByKey = `K:${c.dedupeKey}`;
    const exactKeyByHash = `H:${c.normalizedHash}`;
    // Treat empty dedupeKey (all-null) as non-colliding to avoid false exacts.
    const hasRealKey = c.dedupeKey.replace(/\|/g, "").length > 0;

    if (hasRealKey && seenExact.has(exactKeyByKey)) {
      c.duplicateStatus = "exact_duplicate";
      pushGroup(c.dedupeKey, "exact_duplicate", seenExact.get(exactKeyByKey)!, c.candidateId);
      continue;
    }
    if (seenExact.has(exactKeyByHash)) {
      c.duplicateStatus = "exact_duplicate";
      pushGroup(c.normalizedHash, "exact_duplicate", seenExact.get(exactKeyByHash)!, c.candidateId);
      continue;
    }

    const hasFallback = c.fallbackDedupeKey.replace(/\|/g, "").length > 0;
    if (hasFallback && seenSemantic.has(c.fallbackDedupeKey)) {
      c.duplicateStatus = "semantic_duplicate";
      pushGroup(c.fallbackDedupeKey, "semantic_duplicate", seenSemantic.get(c.fallbackDedupeKey)!, c.candidateId);
      continue;
    }

    const { orgaoDate, objeto } = fingerprintParts(c.fallbackDedupeKey);
    const anchor = possibleAnchors.find(
      (a) => a.orgaoDate === orgaoDate && a.orgaoDate.replace(/\|/g, "").length > 0 && tokenOverlap(a.objeto, objeto) >= 0.6,
    );
    if (anchor) {
      c.duplicateStatus = "possible_duplicate";
      pushGroup(`P:${orgaoDate}`, "possible_duplicate", anchor.id, c.candidateId);
      continue;
    }

    // unique → register as anchor
    if (hasRealKey) seenExact.set(exactKeyByKey, c.candidateId);
    seenExact.set(exactKeyByHash, c.candidateId);
    if (hasFallback) seenSemantic.set(c.fallbackDedupeKey, c.candidateId);
    possibleAnchors.push({ id: c.candidateId, orgaoDate, objeto });
  }

  const unique = candidates.filter((c) => c.duplicateStatus === "unique");
  const duplicates = candidates.filter((c) => c.duplicateStatus !== "unique");
  const report: DedupeReport = {
    total: candidates.length,
    unique: unique.length,
    exact: candidates.filter((c) => c.duplicateStatus === "exact_duplicate").length,
    semantic: candidates.filter((c) => c.duplicateStatus === "semantic_duplicate").length,
    possible: candidates.filter((c) => c.duplicateStatus === "possible_duplicate").length,
    groups: [...groups.entries()].map(([key, g]) => ({ key, status: g.status, candidateIds: g.candidateIds })),
  };

  return { candidates, unique, duplicates, report };
}
