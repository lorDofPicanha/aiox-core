"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { getSupabaseServer } from "@/lib/supabase/server";

const EmailSchema = z.string().email({ message: "Email inválido" });

export interface AuthActionResult {
  status: "ok" | "error";
  message?: string;
}

function getCallbackUrl(next = "/"): string {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3010";
  const params = new URLSearchParams({ next });
  return `${base}/auth/callback?${params.toString()}`;
}

export async function sendMagicLink(
  _prev: AuthActionResult | null,
  formData: FormData,
): Promise<AuthActionResult> {
  const parsed = EmailSchema.safeParse(formData.get("email"));
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Email inválido" };
  }

  const supabase = await getSupabaseServer();
  const { error } = await supabase.auth.signInWithOtp({
    email: parsed.data,
    options: {
      emailRedirectTo: getCallbackUrl(),
      shouldCreateUser: true,
    },
  });

  if (error) {
    return { status: "error", message: error.message };
  }

  redirect(`/login/check-email?email=${encodeURIComponent(parsed.data)}`);
}
