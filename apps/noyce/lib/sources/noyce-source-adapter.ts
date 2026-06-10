// Source-integration contract for Noyce (squad decision 2026-06-08).
// Constitutional guardrails: PNCP public GET-only + manual import of human-fetched
// files. NO automated login, NO secrets, NO authenticated scraping. Authenticated
// portals stay `blocked_until_vault` until vault + ToS + human authorization.
//
// This module is the offline/server pipeline contract — it uses node:crypto and is
// NOT imported by the browser data path (noyce-data.ts). It powers build scripts and
// the source test suite.

import { createHash } from "node:crypto";
import type { SourceCode, ConfidenceLevel } from "../noyce-model";

export type AccessMode = "public_api" | "manual_import" | "authenticated_pending_vault";

// Immutable layers of the data pipeline (doc §Pipeline de Dados).
export type PipelineLayer = "raw" | "parsed" | "canonical" | "scored" | "decision";

export type CanonicalDecision = "GO" | "GO_COM_TAREFAS" | "PENDENTE_DADO" | "NO_GO";

// Mandatory snapshot fields (doc §Campos Obrigatorios de Snapshot).
export interface RawSnapshot {
  snapshotId: string;
  source: SourceCode;
  accessMode: AccessMode;
  capturedAt: string;
  capturedBy: string;
  originalFileName: string;
  originalUrl?: string;
  contentType: string;
  sha256: string;
  byteLength: number;
  parserVersion: string;
  status: "captured" | "parse_error" | "blocked";
}

export type EvidenceLocatorKind =
  | "jsonPointer"
  | "csvColumn"
  | "htmlSelector"
  | "pdfPage"
  | "derived";

export interface FieldEvidence {
  field: string;
  value: string | null;
  locatorKind: EvidenceLocatorKind;
  locator: string;
  confidence: ConfidenceLevel;
}

export type DuplicateStatus =
  | "unique"
  | "exact_duplicate"
  | "semantic_duplicate"
  | "possible_duplicate";

// Canonical candidate (doc §Pipeline: layer `canonical`). Every grounded field must
// carry a FieldEvidence; critical fields without evidence force PENDENTE_DADO.
export interface CanonicalOpportunity {
  candidateId: string;
  source: SourceCode;
  accessMode: AccessMode;
  snapshotId: string;
  title: string | null;
  buyer: string | null;
  buyerCnpj: string | null;
  city: string | null;
  uf: string | null;
  ibge: string | null;
  modalityCode: number | null;
  numeroEdital: string | null;
  numeroProcesso: string | null;
  estimatedValue: number | null;
  publicationDate: string | null;
  proposalDeadline: string | null;
  sourceUrl: string | null;
  contentHash: string;
  normalizedHash: string;
  dedupeKey: string;
  fallbackDedupeKey: string;
  duplicateStatus: DuplicateStatus;
  evidence: FieldEvidence[];
  missingData: string[];
  decision: CanonicalDecision;
}

export interface SourceCaptureInput {
  capturedBy: string;
  // manual import:
  originalFileName?: string;
  contentType?: string;
  content?: string;
  // public api:
  fetchImpl?: FetchLike;
  dryRun?: boolean;
  query?: Record<string, string | number>;
  asOf?: string;
}

export interface SourceRunResult {
  source: SourceCode;
  accessMode: AccessMode;
  ok: boolean;
  snapshot: RawSnapshot | null;
  candidates: CanonicalOpportunity[];
  errors: string[];
}

export interface SourceAdapter {
  source: SourceCode;
  accessMode: AccessMode;
  canRunNow(): boolean;
  run(input: SourceCaptureInput): Promise<SourceRunResult>;
}

export type FetchLike = (
  url: string,
  init?: { method?: string; headers?: Record<string, string> },
) => Promise<{ ok: boolean; status: number; json: () => Promise<unknown> }>;

// Critical canonical fields — null OR missing evidence ⇒ PENDENTE_DADO.
export const CRITICAL_CANONICAL_FIELDS = ["title", "buyer", "proposalDeadline"] as const;

export const PARSER_VERSION = "noyce-sources/0.1.0";

export function sha256(input: string): string {
  return createHash("sha256").update(input, "utf8").digest("hex");
}

export function byteLengthOf(input: string): number {
  return new globalThis.TextEncoder().encode(input).length;
}

function normalizeText(value: string | null): string {
  return (value ?? "")
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function isoDate(value: string | null): string {
  if (!value) return "";
  const t = new Date(value).getTime();
  if (Number.isNaN(t)) return "";
  return new Date(t).toISOString().slice(0, 10);
}

export function objectFingerprint(title: string | null, words = 6): string {
  return normalizeText(title).split(" ").filter(Boolean).slice(0, words).join(" ");
}

export function computeDedupeKey(c: {
  buyerCnpj: string | null;
  numeroEdital: string | null;
  numeroProcesso: string | null;
  proposalDeadline: string | null;
  estimatedValue: number | null;
}): string {
  return [
    c.buyerCnpj ?? "",
    c.numeroEdital ?? "",
    c.numeroProcesso ?? "",
    isoDate(c.proposalDeadline),
    c.estimatedValue ?? "",
  ].join("|");
}

export function computeFallbackDedupeKey(c: {
  buyer: string | null;
  title: string | null;
  city: string | null;
  uf: string | null;
  proposalDeadline: string | null;
}): string {
  return [
    normalizeText(c.buyer),
    objectFingerprint(c.title),
    normalizeText(c.city),
    (c.uf ?? "").toLowerCase(),
    isoDate(c.proposalDeadline),
  ].join("|");
}

export function normalizedContentHash(c: {
  buyer: string | null;
  title: string | null;
  city: string | null;
  uf: string | null;
  estimatedValue: number | null;
  proposalDeadline: string | null;
}): string {
  return sha256(
    JSON.stringify({
      buyer: normalizeText(c.buyer),
      title: normalizeText(c.title),
      city: normalizeText(c.city),
      uf: (c.uf ?? "").toLowerCase(),
      value: c.estimatedValue ?? null,
      deadline: isoDate(c.proposalDeadline),
    }),
  );
}

// Derive missingData + decision from critical-field evidence coverage.
export function deriveDecision(
  candidate: Pick<CanonicalOpportunity, (typeof CRITICAL_CANONICAL_FIELDS)[number]> & {
    evidence: FieldEvidence[];
  },
): { missingData: string[]; decision: CanonicalDecision } {
  const evidenceFields = new Set(
    candidate.evidence.filter((e) => e.value !== null && e.value !== "").map((e) => e.field),
  );
  const missingData: string[] = [];
  for (const field of CRITICAL_CANONICAL_FIELDS) {
    const value = (candidate as Record<string, unknown>)[field];
    const hasValue = value !== null && value !== undefined && value !== "";
    if (!hasValue || !evidenceFields.has(field)) {
      missingData.push(field);
    }
  }
  const decision: CanonicalDecision = missingData.length > 0 ? "PENDENTE_DADO" : "GO_COM_TAREFAS";
  return { missingData, decision };
}

// Failure-resilient orchestrator: one source crashing must NOT drop the pipeline
// (doc gate: "Falha de uma fonte nao derruba pipeline").
export async function runAdapters(
  jobs: Array<{ adapter: SourceAdapter; input: SourceCaptureInput }>,
): Promise<SourceRunResult[]> {
  const results = await Promise.allSettled(jobs.map((job) => job.adapter.run(job.input)));
  return results.map((settled, index) => {
    const { adapter } = jobs[index];
    if (settled.status === "fulfilled") return settled.value;
    return {
      source: adapter.source,
      accessMode: adapter.accessMode,
      ok: false,
      snapshot: null,
      candidates: [],
      errors: [String(settled.reason instanceof Error ? settled.reason.message : settled.reason)],
    };
  });
}
