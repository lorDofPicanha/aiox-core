import { NextResponse } from "next/server";
import { buildAnalysisRunsResponse } from "@/lib/noyce-analysis-response";

export function GET() {
  return NextResponse.json(buildAnalysisRunsResponse());
}
