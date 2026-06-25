"use server";

/**
 * Server actions de contas a pagar/receber. Tudo passa por RLS (membership).
 * A "baixa" (marcar como pago) gera um lançamento real no livro-caixa.
 */

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getSupabaseServer } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth/session";
import { todayISO } from "@/lib/dates";
import type { ActionResult } from "@/lib/constants";

const CreateSchema = z.object({
  companyId: z.string().uuid(),
  direction: z.enum(["receivable", "payable"]),
  amount: z.number().positive({ message: "Valor deve ser maior que zero" }),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Data inválida" }),
  category: z.string().min(1).max(60).optional().nullable(),
  description: z.string().max(280).optional().nullable(),
});

export async function createScheduled(input: {
  companyId: string;
  direction: "receivable" | "payable";
  amount: number;
  dueDate: string;
  category?: string | null;
  description?: string | null;
}): Promise<ActionResult> {
  const parsed = CreateSchema.safeParse(input);
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const user = await requireUser();
  const supabase = await getSupabaseServer();

  const { error } = await supabase.from("scheduled").insert({
    company_id: parsed.data.companyId,
    direction: parsed.data.direction,
    amount: parsed.data.amount,
    due_date: parsed.data.dueDate,
    category: parsed.data.category ?? null,
    description: parsed.data.description ?? null,
    created_by: user.id,
  });

  if (error) return { status: "error", message: error.message };
  revalidatePath("/vencimentos");
  return { status: "ok" };
}

/** Baixa: cria o lançamento correspondente e marca o vencimento como pago. */
export async function markScheduledPaid(scheduledId: string): Promise<ActionResult> {
  const parsed = z.string().uuid().safeParse(scheduledId);
  if (!parsed.success) return { status: "error", message: "ID inválido" };

  const user = await requireUser();
  const supabase = await getSupabaseServer();

  const { data: sched, error: readErr } = await supabase
    .from("scheduled")
    .select("id, company_id, direction, amount, category, description, status")
    .eq("id", parsed.data)
    .single();

  if (readErr || !sched) return { status: "error", message: readErr?.message ?? "Não encontrado" };
  if (sched.status === "paid") return { status: "ok" };

  const today = todayISO();

  const { data: entry, error: entryErr } = await supabase
    .from("entries")
    .insert({
      company_id: sched.company_id,
      type: sched.direction === "receivable" ? "in" : "out",
      amount: Number(sched.amount),
      category: sched.category,
      description: sched.description,
      entry_date: today,
      source: "scheduled",
      created_by: user.id,
    })
    .select("id")
    .single();

  if (entryErr || !entry) return { status: "error", message: entryErr?.message ?? "Falha ao lançar" };

  const { error: updErr } = await supabase
    .from("scheduled")
    .update({ status: "paid", paid_at: today, entry_id: entry.id })
    .eq("id", sched.id);

  if (updErr) return { status: "error", message: updErr.message };

  revalidatePath("/vencimentos");
  revalidatePath("/");
  return { status: "ok" };
}

export async function deleteScheduled(scheduledId: string): Promise<ActionResult> {
  const parsed = z.string().uuid().safeParse(scheduledId);
  if (!parsed.success) return { status: "error", message: "ID inválido" };

  const supabase = await getSupabaseServer();
  const { error } = await supabase.from("scheduled").delete().eq("id", parsed.data);

  if (error) return { status: "error", message: error.message };
  revalidatePath("/vencimentos");
  return { status: "ok" };
}
