/** Queries de contas a pagar/receber (vencimentos), sob RLS. */

import { getSupabaseServer } from "@/lib/supabase/server";

export type Direction = "receivable" | "payable";

export interface Scheduled {
  id: string;
  company_id: string;
  direction: Direction;
  description: string | null;
  category: string | null;
  amount: number;
  due_date: string; // YYYY-MM-DD
  status: "open" | "paid";
  paid_at: string | null;
}

export interface ScheduledTotals {
  toReceive: number;
  toPay: number;
}

/** Vencimentos em aberto de uma empresa, do mais próximo ao mais distante. */
export async function listOpenScheduled(companyId: string): Promise<Scheduled[]> {
  const supabase = await getSupabaseServer();
  const { data, error } = await supabase
    .from("scheduled")
    .select("id, company_id, direction, description, category, amount, due_date, status, paid_at")
    .eq("company_id", companyId)
    .eq("status", "open")
    .order("due_date", { ascending: true });

  if (error) throw new Error(`[scheduled] listOpenScheduled: ${error.message}`);
  return (data ?? []).map((r) => ({ ...r, amount: Number(r.amount) })) as Scheduled[];
}

/** Totais em aberto (a receber / a pagar). */
export async function getScheduledTotals(companyId: string): Promise<ScheduledTotals> {
  const supabase = await getSupabaseServer();
  const { data, error } = await supabase.rpc("scheduled_open_totals", { p_company: companyId });
  if (error) throw new Error(`[scheduled] scheduled_open_totals: ${error.message}`);
  const row = Array.isArray(data) ? data[0] : data;
  return {
    toReceive: Number(row?.to_receive ?? 0),
    toPay: Number(row?.to_pay ?? 0),
  };
}
