/** Queries de conexões bancárias (Open Finance), sob RLS. */

import { getSupabaseServer } from "@/lib/supabase/server";

export interface BankConnection {
  id: string;
  company_id: string;
  provider: string;
  item_id: string;
  institution: string | null;
  status: string;
  last_synced_at: string | null;
}

export async function listBankConnections(companyId: string): Promise<BankConnection[]> {
  const supabase = await getSupabaseServer();
  const { data, error } = await supabase
    .from("bank_connections")
    .select("id, company_id, provider, item_id, institution, status, last_synced_at")
    .eq("company_id", companyId)
    .order("created_at", { ascending: true });

  if (error) throw new Error(`[openfinance] listBankConnections: ${error.message}`);
  return (data ?? []) as BankConnection[];
}
