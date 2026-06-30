/**
 * Browser-safe Supabase client (anon key + RLS). Use só em Client Components.
 * Isolamento por empresa é garantido server-side via RLS — nunca confie em
 * filtro client-side para isolamento.
 */

import { createBrowserClient } from "@supabase/ssr";

let cached: ReturnType<typeof createBrowserClient> | null = null;

export function getSupabaseBrowser() {
  if (cached) return cached;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "[supabase/client] NEXT_PUBLIC_SUPABASE_URL ou NEXT_PUBLIC_SUPABASE_ANON_KEY ausente",
    );
  }

  cached = createBrowserClient(url, anonKey);
  return cached;
}
