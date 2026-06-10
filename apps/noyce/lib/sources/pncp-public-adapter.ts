// PNCP public adapter (squad decision 2026-06-08). ONLY GET against the public
// /contratacoes/publicacao endpoint — the same proven endpoint as the offline
// discovery build script. No auth headers, no credentials, read-only. fetch is
// injectable so tests assert GET-only + public-host without touching the network.

import type { SourceCode } from "../noyce-model";
import type {
  CanonicalOpportunity,
  FetchLike,
  RawSnapshot,
  SourceAdapter,
  SourceCaptureInput,
  SourceRunResult,
} from "./noyce-source-adapter";
import { PARSER_VERSION, byteLengthOf, sha256 } from "./noyce-source-adapter.ts";
import { normalizePncpRaw } from "./source-normalizer.ts";
import { assertNoSecrets } from "./authenticated-source-guard.ts";

const PNCP_SOURCE: SourceCode = "pncp";
export const PNCP_PUBLIC_BASE = "https://pncp.gov.br/api/consulta/v1/contratacoes/publicacao";
const ALLOWED_HOST = "pncp.gov.br";

function assertPublicReadOnly(url: string, method: string): void {
  if (method.toUpperCase() !== "GET") {
    throw new Error(`pncp-public-adapter: somente GET e permitido (recebido "${method}").`);
  }
  let parsed: InstanceType<typeof globalThis.URL>;
  try {
    parsed = new globalThis.URL(url);
  } catch {
    throw new Error(`pncp-public-adapter: URL invalida "${url}".`);
  }
  if (parsed.protocol !== "https:") {
    throw new Error(`pncp-public-adapter: somente HTTPS (recebido "${parsed.protocol}").`);
  }
  if (parsed.hostname !== ALLOWED_HOST) {
    throw new Error(`pncp-public-adapter: host nao publico "${parsed.hostname}" (esperado ${ALLOWED_HOST}).`);
  }
  if (!parsed.pathname.startsWith("/api/consulta/v1/")) {
    throw new Error(`pncp-public-adapter: caminho fora da API publica de consulta ("${parsed.pathname}").`);
  }
}

export function buildPncpUrl(query: Record<string, string | number> = {}): string {
  const url = new globalThis.URL(PNCP_PUBLIC_BASE);
  for (const [key, value] of Object.entries(query)) {
    url.searchParams.set(key, String(value));
  }
  return url.toString();
}

function snapshotId(asOf: string): string {
  return `pncp-${asOf.replace(/[^0-9]/g, "").slice(0, 14)}`;
}

export function createPncpPublicAdapter(): SourceAdapter {
  return {
    source: PNCP_SOURCE,
    accessMode: "public_api",
    canRunNow: () => true,
    async run(input: SourceCaptureInput): Promise<SourceRunResult> {
      const errors: string[] = [];
      const asOf = input.asOf ?? new Date().toISOString();
      const query = input.query ?? {};
      // Constitutional tripwire: a query must never carry a credential.
      assertNoSecrets(query, "pncp query");

      const url = buildPncpUrl(query);
      assertPublicReadOnly(url, "GET");

      // Dry-run (or no fetch injected): produce the snapshot intent without network.
      if (input.dryRun || !input.fetchImpl) {
        const snapshot: RawSnapshot = {
          snapshotId: snapshotId(asOf),
          source: PNCP_SOURCE,
          accessMode: "public_api",
          capturedAt: asOf,
          capturedBy: input.capturedBy,
          originalFileName: `${snapshotId(asOf)}.json`,
          originalUrl: url,
          contentType: "application/json",
          sha256: sha256(""),
          byteLength: 0,
          parserVersion: PARSER_VERSION,
          status: "captured",
        };
        return { source: PNCP_SOURCE, accessMode: "public_api", ok: true, snapshot, candidates: [], errors };
      }

      const fetchImpl: FetchLike = input.fetchImpl;
      let payloadText = "";
      let items: Array<Record<string, unknown>> = [];
      try {
        const res = await fetchImpl(url, {
          method: "GET",
          headers: { accept: "application/json", "user-agent": "noyce-sources/0.1" },
        });
        if (!res.ok) throw new Error(`PNCP respondeu HTTP ${res.status}`);
        const json = (await res.json()) as { data?: unknown };
        const data = Array.isArray(json.data) ? json.data : Array.isArray(json) ? json : [];
        items = data as Array<Record<string, unknown>>;
        payloadText = JSON.stringify(json);
      } catch (err) {
        errors.push(`pncp fetch falhou: ${err instanceof Error ? err.message : String(err)}`);
        return { source: PNCP_SOURCE, accessMode: "public_api", ok: false, snapshot: null, candidates: [], errors };
      }

      const snapshot: RawSnapshot = {
        snapshotId: snapshotId(asOf),
        source: PNCP_SOURCE,
        accessMode: "public_api",
        capturedAt: asOf,
        capturedBy: input.capturedBy,
        originalFileName: `${snapshotId(asOf)}.json`,
        originalUrl: url,
        contentType: "application/json",
        sha256: sha256(payloadText),
        byteLength: byteLengthOf(payloadText),
        parserVersion: PARSER_VERSION,
        status: "captured",
      };

      const candidates: CanonicalOpportunity[] = [];
      for (const raw of items) {
        try {
          candidates.push(normalizePncpRaw(raw, snapshot));
        } catch (err) {
          errors.push(`pncp normalize falhou: ${err instanceof Error ? err.message : String(err)}`);
        }
      }

      return { source: PNCP_SOURCE, accessMode: "public_api", ok: true, snapshot, candidates, errors };
    },
  };
}

export { assertPublicReadOnly };
