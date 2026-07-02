"use server";

/**
 * Server actions de Open Finance (Pluggy). Sem chaves configuradas,
 * getConnectToken retorna "not_configured" e a UI mostra o aviso de setup.
 */

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getSupabaseServer } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth/session";
import {
  pluggyConfigured,
  createConnectToken,
  getItemInstitution,
  fetchItemTransactions,
} from "@/lib/openfinance/pluggy";

export async function getConnectToken(): Promise<{
  status: "ok" | "error";
  token?: string;
  message?: string;
}> {
  await requireUser();
  if (!pluggyConfigured()) {
    return { status: "error", message: "not_configured" };
  }
  try {
    const token = await createConnectToken();
    return { status: "ok", token };
  } catch {
    return { status: "error", message: "Falha ao obter token" };
  }
}

export async function saveConnection(input: {
  companyId: string;
  itemId: string;
}): Promise<{ status: "ok" | "error"; message?: string }> {
  const parsed = z
    .object({ companyId: z.string().uuid(), itemId: z.string().min(1).max(120) })
    .safeParse(input);
  if (!parsed.success) return { status: "error", message: "Dados inválidos" };

  const user = await requireUser();
  const supabase = await getSupabaseServer();

  let institution: string | null = null;
  try {
    institution = await getItemInstitution(parsed.data.itemId);
  } catch {
    // segue sem o nome da instituição
  }

  const { error } = await supabase.from("bank_connections").upsert(
    {
      company_id: parsed.data.companyId,
      provider: "pluggy",
      item_id: parsed.data.itemId,
      institution,
      status: "active",
      created_by: user.id,
    },
    { onConflict: "company_id,item_id" },
  );

  if (error) return { status: "error", message: "Não foi possível salvar a conexão" };
  revalidatePath("/conexoes");
  return { status: "ok" };
}

export async function syncConnection(connectionId: string): Promise<{
  status: "ok" | "error";
  imported?: number;
  skipped?: number;
  message?: string;
}> {
  const parsed = z.string().uuid().safeParse(connectionId);
  if (!parsed.success) return { status: "error", message: "ID inválido" };

  const user = await requireUser();
  const supabase = await getSupabaseServer();

  const { data: conn, error: readErr } = await supabase
    .from("bank_connections")
    .select("id, company_id, item_id, last_synced_at")
    .eq("id", parsed.data)
    .single();
  if (readErr || !conn) return { status: "error", message: "Conexão não encontrada" };

  // Desde a última sync, ou últimos 90 dias.
  const since = conn.last_synced_at ? new Date(conn.last_synced_at) : new Date(Date.now() - 90 * 86_400_000);
  const fromISO = since.toISOString().slice(0, 10);

  let txns;
  try {
    txns = await fetchItemTransactions(conn.item_id, fromISO);
  } catch {
    return { status: "error", message: "Falha ao buscar transações" };
  }

  const refs = txns.map((t) => t.externalRef).filter((r): r is string => Boolean(r));
  const existing = new Set<string>();
  if (refs.length > 0) {
    const { data } = await supabase
      .from("entries")
      .select("external_ref")
      .eq("company_id", conn.company_id)
      .in("external_ref", refs);
    for (const row of data ?? []) if (row.external_ref) existing.add(row.external_ref);
  }

  const toInsert = txns
    .filter((t) => !t.externalRef || !existing.has(t.externalRef))
    .map((t) => ({
      company_id: conn.company_id,
      entry_date: t.date,
      type: t.type,
      amount: t.amount,
      category: null,
      description: t.description,
      external_ref: t.externalRef,
      source: "open_finance",
      created_by: user.id,
    }));

  if (toInsert.length > 0) {
    const { error } = await supabase.from("entries").insert(toInsert);
    if (error) return { status: "error", message: "Não foi possível importar as transações" };
  }

  await supabase
    .from("bank_connections")
    .update({ last_synced_at: new Date().toISOString() })
    .eq("id", conn.id);

  revalidatePath("/conexoes");
  revalidatePath("/");
  return { status: "ok", imported: toInsert.length, skipped: txns.length - toInsert.length };
}

export async function removeConnection(connectionId: string): Promise<{
  status: "ok" | "error";
  message?: string;
}> {
  const parsed = z.string().uuid().safeParse(connectionId);
  if (!parsed.success) return { status: "error", message: "ID inválido" };

  await requireUser();
  const supabase = await getSupabaseServer();
  const { error } = await supabase.from("bank_connections").delete().eq("id", parsed.data);
  if (error) return { status: "error", message: "Não foi possível remover a conexão" };
  revalidatePath("/conexoes");
  return { status: "ok" };
}
