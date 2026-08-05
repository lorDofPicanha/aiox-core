import { NextResponse } from "next/server";
import { createLlmClient } from "@/lib/agents/clients/client-factory";
import {
  HttpInputError,
  assertJsonLimits,
  expectObject,
  optionalString,
  readJsonBody,
} from "@/lib/http/request-validation";
import { buildDocChatRequest, parseDocChatResponse, type DocChatInput } from "@/lib/noyce-doc-chat";

export const runtime = "nodejs";
export const maxDuration = 300;
const MAX_BODY_BYTES = 256 * 1024;

function parseBody(value: unknown): DocChatInput {
  const body = expectObject(value, ["docLabel", "secao", "currentText", "proveniencia", "instruction", "certame", "history"]);
  assertJsonLimits(body, { maxDepth: 4, maxArrayLength: 20, maxObjectKeys: 12, maxStringLength: 180_000 });
  const docLabel = optionalString(body, "docLabel", { minLength: 1, maxLength: 300 });
  const currentText = optionalString(body, "currentText", { minLength: 1, maxLength: 180_000, trim: false });
  const instruction = optionalString(body, "instruction", { minLength: 1, maxLength: 8_000 });
  if (!docLabel || !currentText || !instruction) throw new HttpInputError(400);

  const certameRecord = body.certame == null ? undefined : expectObject(body.certame, ["titulo", "orgao", "empresa"]);
  const certame = certameRecord ? {
    titulo: optionalString(certameRecord, "titulo", { maxLength: 500 }),
    orgao: optionalString(certameRecord, "orgao", { maxLength: 300 }),
    empresa: optionalString(certameRecord, "empresa", { maxLength: 300 }),
  } : undefined;

  if (body.history !== undefined && !Array.isArray(body.history)) throw new HttpInputError(400);
  const history = (body.history as unknown[] | undefined)?.map((item) => {
    const turn = expectObject(item, ["role", "content"]);
    const role = optionalString(turn, "role", { minLength: 1, maxLength: 9, pattern: /^(user|assistant)$/ });
    const content = optionalString(turn, "content", { minLength: 1, maxLength: 8_000, trim: false });
    if (!role || !content) throw new HttpInputError(400);
    return { role: role as "user" | "assistant", content };
  });

  return {
    docLabel,
    secao: optionalString(body, "secao", { maxLength: 300 }) ?? "",
    currentText,
    proveniencia: optionalString(body, "proveniencia", { maxLength: 2_000 }) ?? "",
    instruction,
    certame,
    history,
  };
}

export async function POST(req: Request) {
  let body: DocChatInput;
  try {
    body = parseBody(await readJsonBody(req, MAX_BODY_BYTES));
  } catch (error) {
    const status = error instanceof HttpInputError ? error.status : 400;
    return NextResponse.json({ error: "requisição inválida" }, { status });
  }

  const request = buildDocChatRequest(body);
  let client;
  try {
    client = createLlmClient();
  } catch {
    return NextResponse.json({ error: "serviço temporariamente indisponível" }, { status: 503 });
  }

  try {
    const response = await client.complete(request);
    if (response.refusal) {
      return NextResponse.json({ error: "solicitação não processável" }, { status: 422 });
    }
    const result = parseDocChatResponse(response.json);
    if (!result) return NextResponse.json({ error: "resposta inválida do serviço" }, { status: 502 });
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "não foi possível processar a solicitação" }, { status: 502 });
  }
}
