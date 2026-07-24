import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { buildOpportunities, type DiscoverySnapshot } from "@/lib/noyce-data";

export const dynamic = "force-dynamic";

const SNAPSHOT_PATH = path.join(process.cwd(), "lib", "data", "discovery-snapshot.json");

/** Serves the latest durable discovery snapshot without requiring a frontend rebuild. */
export async function GET() {
  try {
    const snapshot = JSON.parse(await readFile(SNAPSHOT_PATH, "utf8")) as DiscoverySnapshot;
    return NextResponse.json(
      { generatedAt: snapshot.generatedAt ?? null, opportunities: buildOpportunities(snapshot) },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json({ error: "Snapshot de discovery indisponível." }, { status: 503 });
  }
}
