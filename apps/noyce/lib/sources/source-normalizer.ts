// Transforms raw/parsed rows into canonical opportunities with per-field evidence
// (squad decision 2026-06-08). PNCP raw → jsonPointer evidence; manual CSV → column
// evidence. Critical fields without evidence become PENDENTE_DADO. Never fabricates
// a value: a field absent from the source stays null with no synthetic evidence.

import type { ConfidenceLevel } from "../noyce-model";
import type {
  CanonicalOpportunity,
  FieldEvidence,
  RawSnapshot,
} from "./noyce-source-adapter";
import {
  computeDedupeKey,
  computeFallbackDedupeKey,
  deriveDecision,
  normalizedContentHash,
} from "./noyce-source-adapter.ts";

interface CanonicalCore {
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
  permiteConsorcio: boolean | null;
}

function emptyCore(): CanonicalCore {
  return {
    title: null,
    buyer: null,
    buyerCnpj: null,
    city: null,
    uf: null,
    ibge: null,
    modalityCode: null,
    numeroEdital: null,
    numeroProcesso: null,
    estimatedValue: null,
    publicationDate: null,
    sourceUrl: null,
    proposalDeadline: null,
    permiteConsorcio: null,
  };
}

// Story 30.1 — extrai a flag de consórcio do payload PNCP. Regra de prioridade (Dev Notes):
//   1. campo booleano dedicado de consórcio (permiteConsorcio/admiteConsorcio), se existir → usa direto;
//   2. indicadorSubcontratacao === true E texto livre menciona "consórcio" → true;
//   3. texto livre veda consórcio ("não admite/vedada/proibida ... consórcio") → false;
//   4. nenhum sinal → null (NUNCA false por ausência — AC5).
// Casa em texto SEM acentos (ver foldDiacritics) para não depender de á/ã/ç/etc.
const CONSORCIO_VEDADO = /(?:nao\s+(?:admit\w*|sera\s+admit\w*|aceit\w*|sera\s+permit\w*)|vedad[ao]|proibid[ao]|veda-se)[^.]{0,40}consorcio/i;
const CONSORCIO_VEDADO_INV = /consorcio[^.]{0,40}(?:nao\s+(?:sera\s+)?(?:admit\w*|permit\w*)|vedad[ao]|proibid[ao]|inadmiss\w*|e\s+vedad[ao])/i;
const CONSORCIO_MENCAO = /consorcio/i;

function foldDiacritics(text: string): string {
  return text.normalize("NFKD").replace(/[̀-ͯ]/g, "");
}

function asBoolFlag(value: unknown): boolean | null {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const v = value.trim().toLowerCase();
    if (["true", "sim", "s", "1"].includes(v)) return true;
    if (["false", "nao", "não", "n", "0"].includes(v)) return false;
  }
  return null;
}

export function normalizeConsorcio(raw: Record<string, unknown>): boolean | null {
  // 1) campo booleano dedicado (alguns payloads/feeds expõem permiteConsorcio/admiteConsorcio).
  const dedicated = asBoolFlag(raw.permiteConsorcio ?? raw.admiteConsorcio ?? raw.consorcioPermitido);
  if (dedicated !== null) return dedicated;

  const texto = foldDiacritics(
    [
      raw.informacaoComplementar,
      raw.informacoesComplementares,
      raw.objetoCompra,
      raw.objeto,
    ]
      .map((t) => (typeof t === "string" ? t : ""))
      .join(" "),
  );

  // 3) texto veda consórcio → false (checado antes de 2 para não cair em "menção" positiva).
  if (CONSORCIO_VEDADO.test(texto) || CONSORCIO_VEDADO_INV.test(texto)) return false;

  // 2) subcontratação permitida + menção a consórcio → true.
  const subcontratacao = asBoolFlag(raw.indicadorSubcontratacao);
  if (subcontratacao === true && CONSORCIO_MENCAO.test(texto)) return true;

  // 4) sem sinal.
  return null;
}

function digitsOnly(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  const digits = String(value).replace(/\D/g, "");
  return digits.length ? digits : null;
}

function asNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const cleaned = value.replace(/\./g, "").replace(",", ".").replace(/[^0-9.-]/g, "");
    const n = Number.parseFloat(cleaned);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function asText(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  const s = String(value).trim();
  return s.length ? s : null;
}

function finalize(
  core: CanonicalCore,
  evidence: FieldEvidence[],
  snapshot: RawSnapshot,
  candidateId: string,
): CanonicalOpportunity {
  const normalizedHash = normalizedContentHash(core);
  const dedupeKey = computeDedupeKey(core);
  const fallbackDedupeKey = computeFallbackDedupeKey(core);
  const { missingData, decision } = deriveDecision({
    title: core.title,
    buyer: core.buyer,
    proposalDeadline: core.proposalDeadline,
    evidence,
  });
  return {
    candidateId,
    source: snapshot.source,
    accessMode: snapshot.accessMode,
    snapshotId: snapshot.snapshotId,
    ...core,
    contentHash: snapshot.sha256,
    normalizedHash,
    dedupeKey,
    fallbackDedupeKey,
    duplicateStatus: "unique",
    evidence,
    missingData,
    decision,
  };
}

function ev(
  field: string,
  value: string | number | null,
  locatorKind: FieldEvidence["locatorKind"],
  locator: string,
  confidence: ConfidenceLevel = "confirmed",
): FieldEvidence {
  return { field, value: value === null ? null : String(value), locatorKind, locator, confidence };
}

// ── PNCP public /contratacoes/publicacao raw item → canonical ──────────────────
export function normalizePncpRaw(raw: Record<string, unknown>, snapshot: RawSnapshot): CanonicalOpportunity {
  const core = emptyCore();
  const evidence: FieldEvidence[] = [];

  core.title = asText(raw.objetoCompra ?? raw.objeto);
  if (core.title !== null) evidence.push(ev("title", core.title, "jsonPointer", "/objetoCompra"));

  const orgao = (raw.orgaoEntidade ?? {}) as Record<string, unknown>;
  const unidade = (raw.unidadeOrgao ?? {}) as Record<string, unknown>;
  core.buyer = asText(orgao.razaoSocial);
  if (core.buyer !== null) evidence.push(ev("buyer", core.buyer, "jsonPointer", "/orgaoEntidade/razaoSocial"));

  core.buyerCnpj = digitsOnly(orgao.cnpj);
  if (core.buyerCnpj !== null) evidence.push(ev("buyerCnpj", core.buyerCnpj, "jsonPointer", "/orgaoEntidade/cnpj"));

  core.city = asText(unidade.municipioNome);
  if (core.city !== null) evidence.push(ev("city", core.city, "jsonPointer", "/unidadeOrgao/municipioNome"));

  core.uf = asText(unidade.ufSigla);
  if (core.uf !== null) evidence.push(ev("uf", core.uf, "jsonPointer", "/unidadeOrgao/ufSigla"));

  core.ibge = asText(unidade.codigoIbge ?? unidade.municipioIbge);
  if (core.ibge !== null) evidence.push(ev("ibge", core.ibge, "jsonPointer", "/unidadeOrgao/codigoIbge"));

  core.modalityCode = typeof raw.modalidadeId === "number" ? raw.modalidadeId : asNumber(raw.modalidadeId);
  if (core.modalityCode !== null) evidence.push(ev("modalityCode", core.modalityCode, "jsonPointer", "/modalidadeId"));

  core.numeroEdital = asText(raw.numeroCompra ?? raw.numeroEdital);
  if (core.numeroEdital !== null) evidence.push(ev("numeroEdital", core.numeroEdital, "jsonPointer", "/numeroCompra"));

  core.numeroProcesso = asText(raw.processo ?? raw.numeroProcesso);
  if (core.numeroProcesso !== null) evidence.push(ev("numeroProcesso", core.numeroProcesso, "jsonPointer", "/processo"));

  core.estimatedValue = typeof raw.valorTotalEstimado === "number" ? raw.valorTotalEstimado : asNumber(raw.valorTotalEstimado);
  if (core.estimatedValue !== null) evidence.push(ev("estimatedValue", core.estimatedValue, "jsonPointer", "/valorTotalEstimado"));

  core.publicationDate = asText(raw.dataPublicacaoPncp ?? raw.dataInclusao);
  if (core.publicationDate !== null) evidence.push(ev("publicationDate", core.publicationDate, "jsonPointer", "/dataPublicacaoPncp"));

  core.proposalDeadline = asText(raw.dataEncerramentoProposta ?? raw.dataAberturaProposta);
  if (core.proposalDeadline !== null) {
    evidence.push(ev("proposalDeadline", core.proposalDeadline, "jsonPointer", "/dataEncerramentoProposta"));
  }

  core.sourceUrl = asText(raw.linkSistemaOrigem ?? raw.linkProcessoEletronico);
  if (core.sourceUrl !== null) evidence.push(ev("sourceUrl", core.sourceUrl, "jsonPointer", "/linkSistemaOrigem"));

  // Story 30.1 — flag de consórcio (true|false|null). Só registra evidência quando há sinal.
  core.permiteConsorcio = normalizeConsorcio(raw);
  if (core.permiteConsorcio !== null) {
    evidence.push(ev("permiteConsorcio", String(core.permiteConsorcio), "derived", "consorcio:indicadorSubcontratacao+informacaoComplementar"));
  }

  const candidateId = asText(raw.numeroControlePNCP ?? raw.numeroControlePncp) ?? `${snapshot.source}:${snapshot.snapshotId}`;
  return finalize(core, evidence, snapshot, candidateId);
}

// ── Manual CSV/JSON row → canonical, mapped by a column dictionary ─────────────
export interface ColumnMapping {
  title?: string;
  buyer?: string;
  buyerCnpj?: string;
  city?: string;
  uf?: string;
  ibge?: string;
  modalityCode?: string;
  numeroEdital?: string;
  numeroProcesso?: string;
  estimatedValue?: string;
  publicationDate?: string;
  proposalDeadline?: string;
  sourceUrl?: string;
}

export function normalizeManualRow(
  row: Record<string, string>,
  mapping: ColumnMapping,
  snapshot: RawSnapshot,
  index: number,
): CanonicalOpportunity {
  const core = emptyCore();
  const evidence: FieldEvidence[] = [];

  const map = (
    field: keyof CanonicalCore,
    column: string | undefined,
    parse: (v: unknown) => string | number | null,
    confidence: ConfidenceLevel = "strong",
  ) => {
    if (!column) return;
    const raw = row[column];
    const value = parse(raw);
    (core as unknown as Record<string, unknown>)[field] = value;
    if (value !== null && value !== "") {
      evidence.push(ev(field, value, "csvColumn", column, confidence));
    }
  };

  map("title", mapping.title, asText);
  map("buyer", mapping.buyer, asText);
  map("buyerCnpj", mapping.buyerCnpj, digitsOnly);
  map("city", mapping.city, asText);
  map("uf", mapping.uf, asText);
  map("ibge", mapping.ibge, asText);
  map("modalityCode", mapping.modalityCode, asNumber);
  map("numeroEdital", mapping.numeroEdital, asText);
  map("numeroProcesso", mapping.numeroProcesso, asText);
  map("estimatedValue", mapping.estimatedValue, asNumber);
  map("publicationDate", mapping.publicationDate, asText);
  map("proposalDeadline", mapping.proposalDeadline, asText);
  map("sourceUrl", mapping.sourceUrl, asText);

  const candidateId =
    core.numeroEdital ?? core.numeroProcesso ?? `${snapshot.source}:${snapshot.snapshotId}:${index}`;
  return finalize(core, evidence, snapshot, candidateId);
}

export type { CanonicalCore };
