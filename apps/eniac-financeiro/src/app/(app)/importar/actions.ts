"use server";

/**
 * Importação em lote de lançamentos a partir de extrato (OFX/CSV).
 * Dedup por (company_id, external_ref): re-importar o mesmo arquivo não duplica.
 */

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getSupabaseServer } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth/session";

const ItemSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  type: z.enum(["in", "out"]),
  amount: z.number().positive(),
  category: z.string().max(60).nullable().optional(),
  description: z.string().max(280).nullable().optional(),
  externalRef: z.string().max(200).nullable().optional(),
});

const ImportSchema = z.object({
  companyId: z.string().uuid(),
  items: z.array(ItemSchema).min(1).max(2000),
});

export async function importEntries(input: {
  companyId: string;
  items: z.infer<typeof ItemSchema>[];
}): Promise<{ status: "ok" | "error"; imported?: number; skipped?: number; message?: string }> {
  const parsed = ImportSchema.safeParse(input);
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const user = await requireUser();
  const supabase = await getSupabaseServer();
  const { companyId, items } = parsed.data;

  // Dedup: descobre quais refs já existem nessa empresa.
  const refs = items.map((i) => i.externalRef).filter((r): r is string => Boolean(r));
  const existing = new Set<string>();
  if (refs.length > 0) {
    const { data, error } = await supabase
      .from("entries")
      .select("external_ref")
      .eq("company_id", companyId)
      .in("external_ref", refs);
    if (error) return { status: "error", message: "Não foi possível verificar duplicidades" };
    for (const row of data ?? []) if (row.external_ref) existing.add(row.external_ref);
  }

  // Também remove duplicados dentro do próprio lote.
  const seen = new Set<string>();
  const toInsert = items
    .filter((i) => {
      if (!i.externalRef) return true;
      if (existing.has(i.externalRef) || seen.has(i.externalRef)) return false;
      seen.add(i.externalRef);
      return true;
    })
    .map((i) => ({
      company_id: companyId,
      entry_date: i.date,
      type: i.type,
      amount: i.amount,
      category: i.category ?? null,
      description: i.description ?? null,
      external_ref: i.externalRef ?? null,
      source: "import",
      created_by: user.id,
    }));

  const skipped = items.length - toInsert.length;
  if (toInsert.length === 0) {
    return { status: "ok", imported: 0, skipped };
  }

  const { error } = await supabase.from("entries").insert(toInsert);
  if (error) return { status: "error", message: "Não foi possível importar os lançamentos" };

  revalidatePath("/");
  revalidatePath("/relatorios");
  return { status: "ok", imported: toInsert.length, skipped };
}
