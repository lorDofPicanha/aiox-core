// Noyce Sprint 0 source adapter contract
// Reference contract for PNCP, PCP, BLL, BNC, ComprasGov, SISLOG and source_candidates.
// This file is documentation-ready TypeScript and can be moved into the app when scaffold exists.

export type SourceCode =
  | "pncp"
  | "pcp"
  | "bll"
  | "bnc"
  | "comprasgov"
  | "sislog"
  | `candidate:${string}`;

export type AccessMode =
  | "public_api"
  | "public_web"
  | "authenticated"
  | "manual_export"
  | "email_feed"
  | "unknown";

export type ConfidenceLevel =
  | "confirmed"
  | "strong"
  | "inferred"
  | "weak"
  | "conflicting"
  | "missing";

export interface DiscoverParams {
  orgId: string;
  dateFrom: string;
  dateTo: string;
  cityIbgeCodes: string[];
  buyerCnpjs?: string[];
  keywords?: string[];
  modalities?: string[];
  radiusKm: number;
  pageCursor?: string;
  dryRun?: boolean;
}

export interface SourceRecord {
  orgId: string;
  sourceCode: SourceCode;
  externalId?: string;
  externalUrl?: string;
  rawPayload: unknown;
  rawHash: string;
  fetchedAt: string;
  publishedAt?: string;
  adapterVersion: string;
  normalizationWarnings: QualityIssue[];
}

export interface NoticeDocumentInput {
  documentType: string;
  url?: string;
  storagePath?: string;
  sha256?: string;
  mimeType?: string;
  sourceRecordHash?: string;
}

export interface OpportunityRef {
  orgId: string;
  opportunityId?: string;
  canonicalKey?: string;
  sourceCode?: SourceCode;
  externalId?: string;
}

export interface CanonicalCandidate {
  orgId: string;
  sourceCode: SourceCode;
  sourceRecordHash: string;
  opportunity: OpportunityCandidate;
  buyer?: BuyerCandidate;
  items: OpportunityItemCandidate[];
  documents: NoticeDocumentInput[];
  events: ProcessEventInput[];
  deadlines: DeadlineInput[];
  fieldEvidence: FieldEvidenceInput[];
  qualityIssues: QualityIssue[];
  sourceLinks: SourceLinkInput[];
  adapterMeta: AdapterMeta;
}

export interface OpportunityCandidate {
  canonicalKey?: string;
  title?: string;
  object: string;
  modality?: string;
  disputeMode?: string;
  status?: string;
  cityIbgeCode?: string;
  cityName?: string;
  uf?: string;
  estimatedValue?: number;
  currency?: "BRL";
  publicationDate?: string;
  proposalDeadline?: string;
  disputeDate?: string;
}

export interface BuyerCandidate {
  cnpj?: string;
  name: string;
  cityIbgeCode?: string;
  cityName?: string;
  uf?: string;
}

export interface OpportunityItemCandidate {
  itemNumber?: string;
  description: string;
  quantity?: number;
  unit?: string;
  estimatedUnitValue?: number;
  estimatedTotalValue?: number;
  cnaeGuess?: string;
  keywords?: string[];
}

export interface ProcessEventInput {
  eventType: string;
  eventStatus:
    | "future"
    | "in_progress"
    | "done"
    | "changed"
    | "missed"
    | "cancelled"
    | "unknown";
  occurredAt?: string;
  detectedAt: string;
  title?: string;
  description?: string;
  externalUrl?: string;
}

export interface DeadlineInput {
  deadlineType: string;
  startsAt?: string;
  endsAt: string;
  source?: string;
  confidence: ConfidenceLevel;
}

export interface FieldEvidenceInput {
  entityType: string;
  entityLocalKey: string;
  fieldName: string;
  documentSha256?: string;
  page?: number;
  textSpan?: string;
  rawValue?: string;
  normalizedValue?: string;
  extractionMethod: "api" | "html" | "pdf_parse" | "manual_export" | "email_feed" | "inference";
}

export interface SourceLinkInput {
  linkType: "primary" | "same_opportunity" | "related_event" | "related_contract" | "outcome_signal";
  sourceCode: SourceCode;
  externalId?: string;
  externalUrl?: string;
  confidence: ConfidenceLevel;
  reason?: string;
}

export interface QualityIssue {
  code: string;
  severity: "info" | "warning" | "error";
  message: string;
  fieldName?: string;
}

export interface AdapterMeta {
  adapterVersion: string;
  sourceLatencyMs?: number;
  rateLimitObserved?: string;
  authContext: "none" | "fixture" | "manual_export" | "user_credential" | "service_account";
  rawHash: string;
}

export interface OutcomeSignalInput {
  supplierCnpj?: string;
  supplierName?: string;
  finalValue?: number;
  occurredAt?: string;
  sourceCode: SourceCode;
  externalUrl?: string;
  confidence: ConfidenceLevel;
  reason: string;
}

export interface AdapterHealth {
  sourceCode: SourceCode;
  ok: boolean;
  checkedAt: string;
  latencyMs?: number;
  statusCode?: number;
  message?: string;
}

export interface SourceAdapter {
  sourceCode: SourceCode;
  accessMode: AccessMode;
  requiresAuth: boolean;

  discover(params: DiscoverParams): Promise<SourceRecord[]>;
  fetchDetail(record: SourceRecord): Promise<SourceRecord>;
  fetchDocuments(record: SourceRecord): Promise<NoticeDocumentInput[]>;
  normalize(record: SourceRecord): Promise<CanonicalCandidate>;
  fetchEvents?(opportunity: OpportunityRef): Promise<ProcessEventInput[]>;
  fetchOutcomes?(opportunity: OpportunityRef): Promise<OutcomeSignalInput[]>;
  healthcheck(): Promise<AdapterHealth>;
}
