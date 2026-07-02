/**
 * GET /auth/callback?code=...&next=...
 * Callback de Magic Link / OAuth. Troca o code por sessão e redireciona.
 */

import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";
import { safeInternalPath } from "@/lib/auth/redirect";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = safeInternalPath(url.searchParams.get("next"));

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=missing_code", url.origin));
  }

  const supabase = await getSupabaseServer();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    const params = new URLSearchParams({ error: "exchange_failed" });
    return NextResponse.redirect(new URL(`/login?${params.toString()}`, url.origin));
  }

  return NextResponse.redirect(new URL(next, url.origin));
}
