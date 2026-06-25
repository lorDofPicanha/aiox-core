/**
 * Resolve a empresa selecionada (cookie → fallback primeira). Reutilizado por
 * todas as páginas autenticadas para manter o contexto consistente.
 */

import { cookies } from "next/headers";
import { SELECTED_COMPANY_COOKIE } from "@/lib/constants";
import { listCompanies, type Company } from "@/lib/data";

export interface Selection {
  companies: Company[];
  selected: Company;
}

export async function resolveSelection(): Promise<Selection | null> {
  // Sem chaves do Supabase não há o que resolver (o layout já mostra o aviso).
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return null;
  }

  const companies = await listCompanies();
  if (companies.length === 0) return null;

  const cookieStore = await cookies();
  const cookieId = cookieStore.get(SELECTED_COMPANY_COOKIE)?.value;
  const selected = companies.find((c) => c.id === cookieId) ?? companies[0];

  return { companies, selected };
}
