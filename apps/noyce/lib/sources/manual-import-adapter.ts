// Manual-import adapter (squad decision 2026-06-08). Imports a file a human already
// downloaded from BLL/BNC/PCP/ComprasGov/SISLOG — CSV or JSON — with ZERO login.
// Computes SHA-256 of the raw bytes, builds an immutable snapshot, normalizes each
// row with column evidence. Refuses credential-shaped content and absolute paths.

import type { SourceCode } from "../noyce-model";
import type {
  CanonicalOpportunity,
  RawSnapshot,
  SourceAdapter,
  SourceCaptureInput,
  SourceRunResult,
} from "./noyce-source-adapter";
import { PARSER_VERSION, byteLengthOf, sha256 } from "./noyce-source-adapter.ts";
import { normalizeManualRow, type ColumnMapping } from "./source-normalizer.ts";
import { assertNoSecrets, sanitizeImportPath } from "./authenticated-source-guard.ts";

export type ManualContentType = "text/csv" | "application/json" | "text/plain";

export interface ManualImportConfig {
  source: SourceCode;
  mapping: ColumnMapping;
  csvDelimiter?: string;
}

// Minimal RFC-4180-ish CSV parser (handles quoted fields and the chosen delimiter).
export function parseCsv(text: string, delimiter = ","): Array<Record<string, string>> {
  const rows: string[][] = [];
  let field = "";
  let row: string[] = [];
  let inQuotes = false;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === delimiter) {
      row.push(field);
      field = "";
    } else if (ch === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (ch === "\r") {
      // ignore
    } else {
      field += ch;
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  const nonEmpty = rows.filter((r) => r.some((c) => c.trim().length > 0));
  if (nonEmpty.length === 0) return [];
  const header = nonEmpty[0].map((h) => h.trim());
  return nonEmpty.slice(1).map((r) => {
    const record: Record<string, string> = {};
    header.forEach((key, idx) => {
      record[key] = (r[idx] ?? "").trim();
    });
    return record;
  });
}

function parseRows(content: string, contentType: ManualContentType, delimiter: string): Array<Record<string, string>> {
  if (contentType === "application/json") {
    const json = JSON.parse(content) as unknown;
    const arr = Array.isArray(json)
      ? json
      : Array.isArray((json as { items?: unknown }).items)
        ? (json as { items: unknown[] }).items
        : Array.isArray((json as { data?: unknown }).data)
          ? (json as { data: unknown[] }).data
          : [];
    return (arr as Array<Record<string, unknown>>).map((r) => {
      const record: Record<string, string> = {};
      for (const [k, v] of Object.entries(r)) record[k] = v === null || v === undefined ? "" : String(v);
      return record;
    });
  }
  // csv / plain
  return parseCsv(content, delimiter);
}

export function createManualImportAdapter(config: ManualImportConfig): SourceAdapter {
  return {
    source: config.source,
    accessMode: "manual_import",
    canRunNow: () => true, // manual import needs a file, not a login
    async run(input: SourceCaptureInput): Promise<SourceRunResult> {
      const errors: string[] = [];
      const content = input.content ?? "";
      const contentType = (input.contentType ?? "text/csv") as ManualContentType;
      const originalFileName = sanitizeImportPath(input.originalFileName ?? `${config.source}-import.csv`);

      if (!content.trim()) {
        return {
          source: config.source,
          accessMode: "manual_import",
          ok: false,
          snapshot: null,
          candidates: [],
          errors: ["arquivo vazio — nada para importar"],
        };
      }

      const snapshot: RawSnapshot = {
        snapshotId: `${config.source}-${sha256(content).slice(0, 12)}`,
        source: config.source,
        accessMode: "manual_import",
        capturedAt: input.asOf ?? new Date().toISOString(),
        capturedBy: input.capturedBy,
        originalFileName,
        contentType,
        sha256: sha256(content),
        byteLength: byteLengthOf(content),
        parserVersion: PARSER_VERSION,
        status: "captured",
      };

      let rows: Array<Record<string, string>> = [];
      try {
        rows = parseRows(content, contentType, config.csvDelimiter ?? ",");
      } catch (err) {
        snapshot.status = "parse_error";
        errors.push(`parse falhou: ${err instanceof Error ? err.message : String(err)}`);
        return { source: config.source, accessMode: "manual_import", ok: false, snapshot, candidates: [], errors };
      }

      // Refuse any row that carries a credential-shaped column.
      for (const row of rows) assertNoSecrets(row, `${config.source} import row`);

      const candidates: CanonicalOpportunity[] = [];
      rows.forEach((row, index) => {
        try {
          candidates.push(normalizeManualRow(row, config.mapping, snapshot, index));
        } catch (err) {
          errors.push(`normalize linha ${index} falhou: ${err instanceof Error ? err.message : String(err)}`);
        }
      });

      return { source: config.source, accessMode: "manual_import", ok: true, snapshot, candidates, errors };
    },
  };
}
