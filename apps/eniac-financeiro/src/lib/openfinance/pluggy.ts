/**
 * Cliente Pluggy (Open Finance) — server-only. Sem chaves configuradas, todas
 * as funções degradam graciosamente (pluggyConfigured() = false) e a UI mostra
 * estado "não configurado" em vez de quebrar.
 *
 * Docs: https://docs.pluggy.ai — fluxo: auth → connect_token (widget) →
 * items/accounts/transactions.
 */

import type { ParsedTxn } from "@/lib/import/parse";

const BASE = "https://api.pluggy.ai";

export function pluggyConfigured(): boolean {
  return Boolean(process.env.PLUGGY_CLIENT_ID && process.env.PLUGGY_CLIENT_SECRET);
}

async function pluggyAuth(): Promise<string> {
  const res = await fetch(`${BASE}/auth`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      clientId: process.env.PLUGGY_CLIENT_ID,
      clientSecret: process.env.PLUGGY_CLIENT_SECRET,
    }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`[pluggy] auth falhou: ${res.status}`);
  const json = (await res.json()) as { apiKey: string };
  return json.apiKey;
}

/** Token efêmero consumido pelo widget Pluggy Connect no browser. */
export async function createConnectToken(): Promise<string> {
  const apiKey = await pluggyAuth();
  const res = await fetch(`${BASE}/connect_token`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-API-KEY": apiKey },
    body: JSON.stringify({}),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`[pluggy] connect_token falhou: ${res.status}`);
  const json = (await res.json()) as { accessToken: string };
  return json.accessToken;
}

export async function getItemInstitution(itemId: string): Promise<string | null> {
  const apiKey = await pluggyAuth();
  const res = await fetch(`${BASE}/items/${itemId}`, {
    headers: { "X-API-KEY": apiKey },
    cache: "no-store",
  });
  if (!res.ok) return null;
  const json = (await res.json()) as { connector?: { name?: string } };
  return json.connector?.name ?? null;
}

interface PluggyAccount {
  id: string;
}
interface PluggyTxn {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: "DEBIT" | "CREDIT";
}

/** Puxa transações de todas as contas do item desde `fromISO` (YYYY-MM-DD). */
export async function fetchItemTransactions(itemId: string, fromISO: string): Promise<ParsedTxn[]> {
  const apiKey = await pluggyAuth();

  const accRes = await fetch(`${BASE}/accounts?itemId=${encodeURIComponent(itemId)}`, {
    headers: { "X-API-KEY": apiKey },
    cache: "no-store",
  });
  if (!accRes.ok) throw new Error(`[pluggy] accounts falhou: ${accRes.status}`);
  const accounts = ((await accRes.json()) as { results: PluggyAccount[] }).results ?? [];

  const out: ParsedTxn[] = [];
  for (const acc of accounts) {
    const url = `${BASE}/transactions?accountId=${encodeURIComponent(acc.id)}&from=${fromISO}&pageSize=500`;
    const txRes = await fetch(url, { headers: { "X-API-KEY": apiKey }, cache: "no-store" });
    if (!txRes.ok) continue;
    const txns = ((await txRes.json()) as { results: PluggyTxn[] }).results ?? [];
    for (const t of txns) {
      if (!t.amount || !t.date) continue;
      out.push({
        date: t.date.slice(0, 10),
        type: t.type === "CREDIT" ? "in" : "out",
        amount: Math.abs(t.amount),
        description: t.description?.trim() || "Lançamento bancário",
        externalRef: `pluggy:${t.id}`,
      });
    }
  }
  return out;
}
