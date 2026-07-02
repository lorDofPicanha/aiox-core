/**
 * Helpers de sessão. Modelo simples (ferramenta interna): o usuário é membro
 * de uma ou mais empresas via `company_members` — sem claim de tenant no JWT.
 * O isolamento real vem do RLS; aqui só resolvemos o usuário autenticado.
 */

import type { User } from "@supabase/supabase-js";
import { getSupabaseServer } from "@/lib/supabase/server";

export async function getAuthenticatedUser(): Promise<User | null> {
  const supabase = await getSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user ?? null;
}

export async function requireUser(): Promise<User> {
  const user = await getAuthenticatedUser();
  if (!user) {
    throw new Error("[auth] usuário não autenticado — drift de middleware?");
  }
  return user;
}
