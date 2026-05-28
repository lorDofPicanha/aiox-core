import { NextResponse } from "next/server";
import { buildReadinessReport } from "@/lib/noyce-readiness";

export function GET() {
  return NextResponse.json(buildReadinessReport());
}

