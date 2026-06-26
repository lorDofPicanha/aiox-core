import { NextResponse } from "next/server";
import { fetchAndExtractEdital } from "@/lib/edital/pncp-source";
import { extractErm } from "@/lib/edital/extract-erm";

// Puxa o edital do PNCP (multi-doc: Edital + anexos), parseia e EXTRAI o ERM (declarações +
// CNDs exigidas) p/ dirigir a completude do dossiê. Server-side (Node: pdf-parse + rede). É o
// caminho que contorna o vault (30.6) — o documento vem direto do PNCP, não de upload.
// ⚠️ download + parse de PDFs grandes pode levar ~30s-2min; o client deve cachear o resultado.
export const runtime = "nodejs";
export const maxDuration = 300;

// POST /api/edital-erm  body: { pncpId }  → { erm, confidence, docs, encontradas }
export async function POST(req: Request) {
  let body: { pncpId?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "corpo JSON inválido" }, { status: 400 });
  }
  const pncpId = typeof body?.pncpId === "string" ? body.pncpId.trim() : "";
  if (!pncpId) {
    return NextResponse.json({ error: "forneça 'pncpId'" }, { status: 400 });
  }

  try {
    const extract = await fetchAndExtractEdital(pncpId);
    const { erm, confidence } = extractErm(extract.sections, extract.fullText);
    return NextResponse.json({
      erm,
      confidence,
      docs: extract.docs,
      encontradas: extract.encontradas,
    });
  } catch (e) {
    // PNCP pode falhar (id inválido, sem anexo textual, rate limit) — erro claro, não 500 mudo.
    return NextResponse.json(
      { error: e instanceof Error ? e.message : String(e) },
      { status: 502 },
    );
  }
}
