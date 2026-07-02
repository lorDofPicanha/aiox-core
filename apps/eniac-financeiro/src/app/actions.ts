"use server";

/**
 * Server actions do livro-caixa: selecionar empresa (cookie), criar e anular
 * lançamento. Toda escrita passa por RLS (o usuário precisa ser membro da
 * empresa). Validação de entrada com zod.
 */

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { z } from "zod";
import { getSupabaseServer } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth/session";
import { SELECTED_COMPANY_COOKIE, type ActionResult } from "@/lib/constants";

export async function selectCompany(companyId: string): Promise<void> {
  const parsed = z.string().uuid().safeParse(companyId);
  if (!parsed.success) return;
  const store = await cookies();
  store.set(SELECTED_COMPANY_COOKIE, parsed.data, {
    httpOnly: false,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  revalidatePath("/");
}

const CreateEntrySchema = z.object({
  companyId: z.string().uuid(),
  type: z.enum(["in", "out"]),
  amount: z.number().positive({ message: "Valor deve ser maior que zero" }),
  category: z.string().min(1).max(60).optional().nullable(),
  description: z.string().max(280).optional().nullable(),
  entryDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Data inválida" })
    .optional(),
});

export async function createEntry(input: {
  companyId: string;
  type: "in" | "out";
  amount: number;
  category?: string | null;
  description?: string | null;
  entryDate?: string;
}): Promise<ActionResult> {
  const parsed = CreateEntrySchema.safeParse(input);
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const user = await requireUser();
  const supabase = await getSupabaseServer();

  const { error } = await supabase.from("entries").insert({
    company_id: parsed.data.companyId,
    type: parsed.data.type,
    amount: parsed.data.amount,
    category: parsed.data.category ?? null,
    description: parsed.data.description ?? null,
    entry_date: parsed.data.entryDate ?? undefined,
    created_by: user.id,
  });

  if (error) {
    return { status: "error", message: "Não foi possível salvar o lançamento" };
  }

  revalidatePath("/");
  return { status: "ok" };
}

const VoidEntrySchema = z.object({
  entryId: z.string().uuid(),
  reason: z.string().trim().min(3, "Informe o motivo da anulação").max(500),
});

export async function voidEntry(entryId: string, reason: string): Promise<ActionResult> {
  const parsed = VoidEntrySchema.safeParse({ entryId, reason });
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  await requireUser();
  const supabase = await getSupabaseServer();
  const { data, error } = await supabase.rpc("void_entry", {
    p_entry_id: parsed.data.entryId,
    p_reason: parsed.data.reason,
  });

  if (error || data !== true) {
    return { status: "error", message: "Não foi possível anular o lançamento" };
  }

  revalidatePath("/");
  return { status: "ok" };
}
