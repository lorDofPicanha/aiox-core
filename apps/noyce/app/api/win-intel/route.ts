import { NextResponse } from "next/server";
import { createLlmClient } from "@/lib/agents/clients/client-factory";
import { getMarketForOrgao } from "@/lib/noyce-market";
import { getCuratedErmForEdital } from "@/lib/noyce-erm";
import type { EditalRequirementsModel } from "@/lib/noyce-model";
import {
  buildWinIntelRequest,
  deriveDeterministicSignals,
  mergeWinIntel,
  parseWinIntel,
  WIN_TABS,
  type WinIntelInput,
} from "@/lib/noyce-win-intel";

// Win-Intel sob demanda (30/Jun): ao selecionar uma licitação, busca o histórico real do órgão e
// devolve, POR ABA, sugestões do que adicionar p/ vencer. A camada determinística (grounded) responde
// SEMPRE; a IA enriquece quando há provider. Nada é submetido — é insumo p/ o humano decidir.
export const runtime = "nodejs";
export const maxDuration = 300;

interface WinIntelBody {
  cnpjOrgao?: string | null;
  editalId?: string | null;
  /** ERM já extraído (cliente pode mandar) — senão tenta resolver pelo editalId no registro curado. */
  erm?: EditalRequirementsModel | null;
  certame?: WinIntelInput["certame"];
}

// POST /api/win-intel
//   body: { cnpjOrgao?, editalId?, erm?, certame? }
//   → { byTab, deterministic, llm: boolean, llmError?, generatedAt }
export async function POST(req: Request) {
  let body: WinIntelBody;
  try {
    body = (await req.json()) as WinIntelBody;
  } catch {
    return NextResponse.json({ error: "corpo JSON inválido" }, { status: 400 });
  }

  const market = getMarketForOrgao(body.cnpjOrgao);
  const erm = body.erm ?? (body.editalId ? getCuratedErmForEdital({ editalId: body.editalId }) : null);

  if (!market && !erm) {
    return NextResponse.json(
      { error: "sem histórico do órgão e sem ERM — nada a analisar (informe cnpjOrgao e/ou editalId/erm)." },
      { status: 422 },
    );
  }

  const input: WinIntelInput = { market, erm, certame: body.certame };
  const deterministic = deriveDeterministicSignals(input);

  // Camada IA — best-effort. Se cair, devolvemos só o grounded (degradação graciosa).
  let iaSuggestions: ReturnType<typeof parseWinIntel> = [];
  let llmOk = false;
  let llmError: string | undefined;
  try {
    const client = createLlmClient();
    const resp = await client.complete(buildWinIntelRequest(input));
    if (resp.refusal) {
      llmError = "modelo recusou — devolvendo apenas sinais grounded.";
    } else {
      iaSuggestions = parseWinIntel(resp.json);
      llmOk = true;
    }
  } catch (err) {
    llmError = `IA indisponível (${(err as Error)?.message ?? "sem provider"}) — sinais grounded mantidos.`;
  }

  const byTab = mergeWinIntel(deterministic, iaSuggestions);
  const total = WIN_TABS.reduce((n, t) => n + byTab[t].length, 0);

  return NextResponse.json({
    byTab,
    deterministic,
    counts: { total, byTab: Object.fromEntries(WIN_TABS.map((t) => [t, byTab[t].length])) },
    coverage: market ? { orgao: market.orgaoName, windowMonths: market.windowMonths, coveragePct: market.coveragePct } : null,
    llm: llmOk,
    llmError,
    generatedAt: new Date().toISOString(),
  });
}
