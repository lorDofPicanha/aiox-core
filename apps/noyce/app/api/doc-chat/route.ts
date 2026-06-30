import { NextResponse } from "next/server";
import { createLlmClient } from "@/lib/agents/clients/client-factory";
import {
  buildDocChatRequest,
  parseDocChatResponse,
  type DocChatInput,
} from "@/lib/noyce-doc-chat";

// CORRIGIR por chat (Fase 3): recebe o documento + a instrução em linguagem natural, a IA reescreve.
// Roda no runtime Node (LLM pode levar dezenas de segundos). Nada é submetido a portal — devolve o
// texto reescrito p/ o humano aprovar.
export const runtime = "nodejs";
export const maxDuration = 300;

// POST /api/doc-chat
//   body: DocChatInput (docLabel, secao, currentText, proveniencia, instruction, certame?, history?)
//   → { correctedText, explanation }
export async function POST(req: Request) {
  let body: Partial<DocChatInput>;
  try {
    body = (await req.json()) as Partial<DocChatInput>;
  } catch {
    return NextResponse.json({ error: "corpo JSON inválido" }, { status: 400 });
  }

  const { docLabel, secao, currentText, proveniencia, instruction, certame, history } = body ?? {};
  if (!docLabel || !currentText || !instruction) {
    return NextResponse.json(
      { error: "campos obrigatórios: docLabel, currentText, instruction" },
      { status: 400 },
    );
  }

  const request = buildDocChatRequest({
    docLabel,
    secao: secao ?? "",
    currentText,
    proveniencia: proveniencia ?? "",
    instruction,
    certame,
    history,
  });

  let client;
  try {
    client = createLlmClient();
  } catch (err) {
    return NextResponse.json(
      { error: `LLM indisponível: ${(err as Error)?.message ?? "sem provider configurado"}` },
      { status: 503 },
    );
  }

  try {
    const resp = await client.complete(request);
    if (resp.refusal) {
      return NextResponse.json({ error: "modelo recusou a solicitação — reformule a instrução." }, { status: 422 });
    }
    const result = parseDocChatResponse(resp.json);
    if (!result) {
      return NextResponse.json({ error: "saída do modelo inválida — tente novamente." }, { status: 502 });
    }
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: `falha ao reescrever o documento: ${(err as Error)?.message ?? String(err)}` },
      { status: 502 },
    );
  }
}
