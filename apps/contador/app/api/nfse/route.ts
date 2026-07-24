import { NextResponse } from "next/server";
import { NfseNationalClient } from "@synkra/contador-nfse-client";

/**
 * Server-side NFS-e boundary. Until a certificate transport is provisioned,
 * this endpoint intentionally runs only the adapter dry-run contract.
 * No private key or government call is ever handled by the browser.
 */
export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  if (!isPayload(payload)) {
    return NextResponse.json({ error: "xmlDps é obrigatório e deve ser XML." }, { status: 400 });
  }

  const client = new NfseNationalClient({
    baseUrl: process.env.NFSE_API_URL ?? "https://sefin.producaorestrita.nfse.gov.br/API/SefinNacional",
    environment: "production-restricted",
    mode: "dry-run",
    transport: {
      async request() {
        throw new Error("Transport de homologação ainda não configurado.");
      },
    },
  });

  const result = await client.emitir(payload.xmlDps);
  return NextResponse.json({
    ...result,
    environment: "production-restricted",
    transmitted: false,
    message: "DPS validada pelo contrato local; nenhuma chamada externa foi realizada.",
  });
}

function isPayload(value: unknown): value is { xmlDps: string } {
  if (!value || typeof value !== "object") return false;
  const candidate = value as { xmlDps?: unknown };
  return typeof candidate.xmlDps === "string" && candidate.xmlDps.trim().startsWith("<");
}
