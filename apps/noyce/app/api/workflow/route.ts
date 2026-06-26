import { NextResponse } from "next/server";
import { runParticipationWorkflow, type WorkflowSource } from "@/lib/workflow/run-participation";

// O workflow chama o LLM (gpt-5.5 ~2-3 min/etapa) → roda no runtime Node, não Edge, e precisa
// de janela longa. ⚠️ A cadeia inteira leva ~8-10 min: além do limite síncrono de plataformas
// serverless (Vercel pro = 300s). Para produção, evoluir p/ job assíncrono (start→poll). Aqui é
// a FIAÇÃO síncrona app→workflow (MVP): conecta o que já está provado na CLI.
export const runtime = "nodejs";
export const maxDuration = 800;

// POST /api/workflow
//   body: { pncpId } | { objeto, editalExcerpt }  (+ triageMeta?, comConsorcio?)
// Retorna o pacote de participação completo (triagem + análise + habilitação + documentos).
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "corpo JSON inválido" }, { status: 400 });
  }

  const { pncpId, objeto, editalExcerpt, triageMeta, comConsorcio } = (body ?? {}) as {
    pncpId?: string;
    objeto?: string;
    editalExcerpt?: string;
    triageMeta?: WorkflowSource["triageMeta"];
    comConsorcio?: boolean;
  };

  if (!pncpId && !(objeto && editalExcerpt)) {
    return NextResponse.json(
      { error: "forneça 'pncpId' OU ('objeto' + 'editalExcerpt')" },
      { status: 400 },
    );
  }
  if (!process.env.OPENAI_API_KEY && !process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "LLM não configurado no servidor (defina OPENAI_API_KEY ou ANTHROPIC_API_KEY)" },
      { status: 503 },
    );
  }

  const source: WorkflowSource = pncpId
    ? { pncpId, triageMeta }
    : { objeto: objeto as string, editalExcerpt: editalExcerpt as string, triageMeta };

  try {
    const result = await runParticipationWorkflow(source, { comConsorcio });
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : String(e) },
      { status: 500 },
    );
  }
}
