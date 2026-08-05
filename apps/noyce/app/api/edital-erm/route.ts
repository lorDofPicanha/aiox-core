import { NextResponse } from "next/server";
import { extractErm } from "@/lib/edital/extract-erm";
import { fetchAndExtractEdital } from "@/lib/edital/pncp-source";
import {
  HttpInputError,
  expectObject,
  optionalString,
  readJsonBody,
} from "@/lib/http/request-validation";

export const runtime = "nodejs";
export const maxDuration = 300;
const MAX_BODY_BYTES = 8 * 1024;
const PNCP_ID = /^\d{14}-\d+-\d{1,12}\/\d{4}$/;

export async function POST(req: Request) {
  let pncpId: string;
  try {
    const body = expectObject(await readJsonBody(req, MAX_BODY_BYTES), ["pncpId"]);
    const parsed = optionalString(body, "pncpId", { minLength: 1, maxLength: 64, pattern: PNCP_ID });
    if (!parsed) throw new HttpInputError(400);
    pncpId = parsed;
  } catch (error) {
    const status = error instanceof HttpInputError ? error.status : 400;
    return NextResponse.json({ error: "requisição inválida" }, { status });
  }

  try {
    const extract = await fetchAndExtractEdital(pncpId);
    const { erm, confidence } = extractErm(extract.sections, extract.fullText);
    return NextResponse.json({ erm, confidence, docs: extract.docs, encontradas: extract.encontradas });
  } catch {
    return NextResponse.json({ error: "não foi possível obter o edital" }, { status: 502 });
  }
}
