import { NextResponse } from "next/server";
import {
  HttpInputError,
  assertJsonLimits,
  expectObject,
  optionalBoolean,
  optionalNumber,
  optionalString,
  readJsonBody,
} from "@/lib/http/request-validation";
import { runParticipationWorkflow, type WorkflowSource } from "@/lib/workflow/run-participation";

export const runtime = "nodejs";
export const maxDuration = 800;
const MAX_BODY_BYTES = 512 * 1024;
const PNCP_ID = /^\d{14}-\d+-\d{1,12}\/\d{4}$/;

function parseTriageMeta(value: unknown): NonNullable<WorkflowSource["triageMeta"]> | undefined {
  if (value === undefined || value === null) return undefined;
  const meta = expectObject(value, [
    "id", "title", "city", "uf", "distanceKm", "estimatedValue", "proposalDeadline", "modality", "buyer",
  ]);
  return {
    id: optionalString(meta, "id", { maxLength: 200 }),
    title: optionalString(meta, "title", { maxLength: 500 }),
    city: optionalString(meta, "city", { maxLength: 120 }),
    uf: optionalString(meta, "uf", { maxLength: 2, pattern: /^[A-Za-z]{2}$/ })?.toUpperCase(),
    distanceKm: optionalNumber(meta, "distanceKm", { min: 0, max: 100_000 }),
    estimatedValue: meta.estimatedValue === null
      ? null
      : optionalNumber(meta, "estimatedValue", { min: 0, max: 1_000_000_000_000 }),
    proposalDeadline: meta.proposalDeadline === null
      ? null
      : optionalString(meta, "proposalDeadline", { maxLength: 64 }),
    modality: optionalString(meta, "modality", { maxLength: 120 }),
    buyer: optionalString(meta, "buyer", { maxLength: 300 }),
  };
}

export async function POST(req: Request) {
  let pncpId: string | undefined;
  let objeto: string | undefined;
  let editalExcerpt: string | undefined;
  let triageMeta: WorkflowSource["triageMeta"];
  let comConsorcio: boolean | undefined;
  try {
    const body = expectObject(await readJsonBody(req, MAX_BODY_BYTES), [
      "pncpId", "objeto", "editalExcerpt", "triageMeta", "comConsorcio",
    ]);
    assertJsonLimits(body, { maxDepth: 3, maxArrayLength: 20, maxObjectKeys: 12, maxStringLength: 450_000 });
    pncpId = optionalString(body, "pncpId", { minLength: 1, maxLength: 64, pattern: PNCP_ID });
    objeto = optionalString(body, "objeto", { minLength: 1, maxLength: 2_000 });
    editalExcerpt = optionalString(body, "editalExcerpt", { minLength: 1, maxLength: 450_000, trim: false });
    triageMeta = parseTriageMeta(body.triageMeta);
    comConsorcio = optionalBoolean(body, "comConsorcio");
    if (pncpId ? objeto !== undefined || editalExcerpt !== undefined : !objeto || !editalExcerpt) {
      throw new HttpInputError(400);
    }
  } catch (error) {
    const status = error instanceof HttpInputError ? error.status : 400;
    return NextResponse.json({ error: "requisição inválida" }, { status });
  }

  if (!process.env.OPENAI_API_KEY && !process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "serviço temporariamente indisponível" }, { status: 503 });
  }

  const source: WorkflowSource = pncpId
    ? { pncpId, triageMeta }
    : { objeto: objeto!, editalExcerpt: editalExcerpt!, triageMeta };

  try {
    const result = await runParticipationWorkflow(source, { comConsorcio });
    return NextResponse.json(result);
  } catch (error) {
    console.error("workflow request failed", error instanceof Error ? error.name : "unknown error");
    return NextResponse.json({ error: "não foi possível processar a solicitação" }, { status: 500 });
  }
}
