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

  if (error) return { status: "error", message: "Não foi possível salvar o vencimento" };
  revalidatePath("/vencimentos");
  return { status: "ok" };
}

/** Baixa atômica/idempotente no Postgres. */
export async function markScheduledPaid(scheduledId: string): Promise<ActionResult> {
  const parsed = z.string().uuid().safeParse(scheduledId);
  if (!parsed.success) return { status: "error", message: "ID inválido" };

  await requireUser();
  const supabase = await getSupabaseServer();
  const { error } = await supabase.rpc("post_scheduled_payment", {
    p_scheduled_id: parsed.data,
    p_paid_at: todayISO(),
  });

  if (error) return { status: "error", message: "Não foi possível concluir a baixa" };

  revalidatePath("/vencimentos");
  revalidatePath("/");
  return { status: "ok" };
}

const VoidScheduledSchema = z.object({
  scheduledId: z.string().uuid(),
  reason: z.string().trim().min(3, "Informe o motivo da anulação").max(500),
});

export async function voidScheduled(
  scheduledId: string,
  reason: string,
): Promise<ActionResult> {
  const parsed = VoidScheduledSchema.safeParse({ scheduledId, reason });
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  await requireUser();
  const supabase = await getSupabaseServer();
  const { data, error } = await supabase.rpc("void_scheduled", {
    p_scheduled_id: parsed.data.scheduledId,
    p_reason: parsed.data.reason,
  });

  if (error || data !== true) {
    return { status: "error", message: "Não foi possível anular o vencimento" };
  }
  revalidatePath("/vencimentos");
  return { status: "ok" };
}
