import path from "node:path";
import { NextResponse } from "next/server";
import { buildAnalysisRunsResponse } from "@/lib/noyce-analysis-response";

export function GET() {
  const projectRoot = path.resolve(".");
  return NextResponse.json(buildAnalysisRunsResponse(projectRoot));
}
