/**
 * Queries de leitura do livro-caixa (server-side, sob RLS).
 * Números (saldo/totais) vêm de funções SQL — nunca calculados no LLM nem
 * "inventados". Volume baixo (centenas/mês), então listas são simples selects.
 */

import { getSupabaseServer } from "@/lib/supabase/server";
import type { EntryType } from "@/lib/categories";

export interface Company {
  id: string;
  name: string;
}

export interface Entry {
  id: string;
  company_id: string;
  entry_date: string; // YYYY-MM-DD
  type: EntryType;
  amount: number;
  category: string | null;
  description: string | null;
  created_at: string;
}

export interface MonthSummary {
  balance: number; // saldo acumulado (todo o histórico) da empresa
  totalIn: number; // entradas do mês
  totalOut: number; // saídas do mês
}

/** Empresas que o usuário pode ver (RLS já filtra por company_members). */
export async function listCompanies(): Promise<Company[]> {
  const supabase = await getSupabaseServer();
  const { data, error } = await supabase
    .from("companies")
    .select("id, name")
    .order("created_at", { ascending: true });

  if (error) throw new Error(`[data] listCompanies: ${error.message}`);
  return (data ?? []) as Company[];
}

/** Saldo acumulado + totais do mês para uma empresa. */
export async function getMonthSummary(
  companyId: string,
  year: number,
  month: number, // 1-12
): Promise<MonthSummary> {
  const supabase = await getSupabaseServer();

  const [balanceRes, totalsRes] = await Promise.all([
    supabase.rpc("company_balance", { p_company: companyId }),
    supabase.rpc("company_month_totals", {
      p_company: companyId,
      p_year: year,
      p_month: month,
    }),
  ]);

  if (balanceRes.error) throw new Error(`[data] company_balance: ${balanceRes.error.message}`);
  if (totalsRes.error) throw new Error(`[data] company_month_totals: ${totalsRes.error.message}`);

  const totalsRow = Array.isArray(totalsRes.data) ? totalsRes.data[0] : totalsRes.data;

  return {
    balance: Number(balanceRes.data ?? 0),
    totalIn: Number(totalsRow?.total_in ?? 0),
    totalOut: Number(totalsRow?.total_out ?? 0),
  };
}

/** Lançamentos de uma empresa num mês, do mais recente ao mais antigo. */
export async function listEntries(
  companyId: string,
  year: number,
  month: number, // 1-12
): Promise<Entry[]> {
  const supabase = await getSupabaseServer();

  const start = `${year}-${String(month).padStart(2, "0")}-01`;
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;
  const end = `${nextYear}-${String(nextMonth).padStart(2, "0")}-01`;

  const { data, error } = await supabase
    .from("entries")
    .select("id, company_id, entry_date, type, amount, category, description, created_at")
    .eq("company_id", companyId)
    .is("voided_at", null)
    .gte("entry_date", start)
    .lt("entry_date", end)
    .order("entry_date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) throw new Error(`[data] listEntries: ${error.message}`);

  return (data ?? []).map((row) => ({
    ...row,
    amount: Number(row.amount),
  })) as Entry[];
}
