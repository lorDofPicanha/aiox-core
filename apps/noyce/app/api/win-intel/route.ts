import { NextResponse } from "next/server";
import { createLlmClient } from "@/lib/agents/clients/client-factory";
import {
  HttpInputError,
  assertJsonLimits,
  expectObject,
  optionalNumber,
  optionalString,
  readJsonBody,
} from "@/lib/http/request-validation";
import { getCuratedErmForEdital } from "@/lib/noyce-erm";
import { getMarketForOrgao } from "@/lib/noyce-market";
import type { EditalRequirementsModel } from "@/lib/noyce-model";
import {
  buildWinIntelRequest,
  deriveDeterministicSignals,
  mergeWinIntel,
  parseWinIntel,
  WIN_TABS,
  type WinIntelInput,
} from "@/lib/noyce-win-intel";

export const runtime = "nodejs";
export const maxDuration = 300;
const MAX_BODY_BYTES = 256 * 1024;

interface WinIntelBody {
  cnpjOrgao?: string;
  editalId?: string;
  erm?: EditalRequirementsModel;
  certame?: WinIntelInput["certame"];
}

function parseErm(value: unknown): EditalRequirementsModel | undefined {
  if (value === undefined || value === null) return undefined;
  assertJsonLimits(value, { maxDepth: 10, maxArrayLength: 200, maxObjectKeys: 80, maxStringLength: 20_000 });
  const erm = expectObject(value, ["meta", "economicoFinanceira", "tecnica", "juridica", "fiscalTrabalhista"]);
  for (const section of ["meta", "economicoFinanceira", "tecnica", "juridica", "fiscalTrabalhista"] as const) {
    expectObject(erm[section]);
  }
  const tecnica = expectObject(erm.tecnica);
  if (!Array.isArray(tecnica.profissional) || !Array.isArray(tecnica.operacional)) throw new HttpInputError(400);
  const juridica = expectObject(erm.juridica);
  const fiscal = expectObject(erm.fiscalTrabalhista);
  if (!Array.isArray(juridica.declaracoes) || !juridica.declaracoes.every((item) => typeof item === "string")) {
    throw new HttpInputError(400);
  }
  if (!Array.isArray(fiscal.CNDs) || !fiscal.CNDs.every((item) => typeof item === "string")) {
    throw new HttpInputError(400);
  }
  return erm as unknown as EditalRequirementsModel;
}

function parseBody(value: unknown): WinIntelBody {
  const body = expectObject(value, ["cnpjOrgao", "editalId", "erm", "certame"]);
  const certameRecord = body.certame == null
    ? undefined
    : expectObject(body.certame, ["titulo", "orgao", "valorEstimado"]);
  return {
    cnpjOrgao: optionalString(body, "cnpjOrgao", { minLength: 14, maxLength: 18, pattern: /^[\d./-]+$/ }),
    editalId: optionalString(body, "editalId", { minLength: 1, maxLength: 200 }),
    erm: parseErm(body.erm),
    certame: certameRecord ? {
      titulo: optionalString(certameRecord, "titulo", { maxLength: 500 }),
      orgao: optionalString(certameRecord, "orgao", { maxLength: 300 }),
      valorEstimado: certameRecord.valorEstimado === null
        ? null
        : optionalNumber(certameRecord, "valorEstimado", { min: 0, max: 1_000_000_000_000 }),
    } : undefined,
  };
}

export async function POST(req: Request) {
  let body: WinIntelBody;
  try {
    body = parseBody(await readJsonBody(req, MAX_BODY_BYTES));
  } catch (error) {
    const status = error instanceof HttpInputError ? error.status : 400;
    return NextResponse.json({ error: "requisição inválida" }, { status });
  }

  const market = getMarketForOrgao(body.cnpjOrgao);
  const erm = body.erm ?? (body.editalId ? getCuratedErmForEdital({ editalId: body.editalId }) : null);
  if (!market && !erm) {
    return NextResponse.json({ error: "dados insuficientes para análise" }, { status: 422 });
  }

  const input: WinIntelInput = { market, erm, certame: body.certame };
  const deterministic = deriveDeterministicSignals(input);
  let iaSuggestions: ReturnType<typeof parseWinIntel> = [];
  let llmOk = false;
  let llmError: string | undefined;
  try {
    const client = createLlmClient();
    const response = await client.complete(buildWinIntelRequest(input));
    if (response.refusal) {
      llmError = "modelo indisponível; apenas sinais verificados foram retornados";
    } else {
      iaSuggestions = parseWinIntel(response.json);
      llmOk = true;
    }
  } catch {
    llmError = "modelo indisponível; apenas sinais verificados foram retornados";
  }

  const byTab = mergeWinIntel(deterministic, iaSuggestions);
  const total = WIN_TABS.reduce((count, tab) => count + byTab[tab].length, 0);
  return NextResponse.json({
    byTab,
    deterministic,
    counts: { total, byTab: Object.fromEntries(WIN_TABS.map((tab) => [tab, byTab[tab].length])) },
    coverage: market ? { orgao: market.orgaoName, windowMonths: market.windowMonths, coveragePct: market.coveragePct } : null,
    llm: llmOk,
    llmError,
    generatedAt: new Date().toISOString(),
  });
}
