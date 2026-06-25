"use server";

/**
 * Copiloto financeiro (provider: OpenAI). Princípios (CONTEXT + conclave):
 * - Número SEMPRE computado por tool tipada (SQL), NUNCA gerado/“inventado” pelo LLM.
 * - Tools fixas e tipadas (text-to-SQL banido) escopadas à empresa selecionada (RLS).
 * - Guard G8: informa, não APLICA imposto nem ATESTA conformidade (ato privativo do contador).
 * - Sem OPENAI_API_KEY → degrada graciosamente (code "not_configured").
 *
 * Chamada via REST (sem SDK) para manter o app sem dependência extra.
 */

import { z } from "zod";
import { requireUser } from "@/lib/auth/session";
import { getMonthSummary, listEntries } from "@/lib/data";
import { getScheduledTotals } from "@/lib/scheduled";

const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";
const API_URL = "https://api.openai.com/v1/chat/completions";

const SYSTEM_PROMPT = `Você é o assistente financeiro do app "Livro Caixa ENIAC". Responda em português do Brasil, de forma curta, clara e sem jargão contábil.

REGRAS INVIOLÁVEIS:
- NUNCA invente números. Todo valor (saldo, totais, vencimentos) vem das ferramentas. Se não houver ferramenta para o dado pedido, diga que ainda não consegue ver isso.
- Você INFORMA, não decide nem executa. NÃO dê conselho tributário, NÃO diga qual imposto pagar ou quanto recolher, NÃO afirme que algo está "em conformidade" nem faça apuração fiscal — isso é atividade privativa do contador. Nesses casos, oriente a pessoa a falar com o contador.
- Os dados são apenas da empresa atualmente selecionada.
- Formate valores em reais (ex.: R$ 1.234,56).`;

// ---- Ferramentas tipadas (function calling OpenAI; o servidor executa sob RLS) ----
const TOOLS = [
  {
    type: "function",
    function: {
      name: "get_balance",
      description: "Saldo atual (acumulado) da empresa selecionada.",
      parameters: { type: "object", properties: {}, additionalProperties: false },
    },
  },
  {
    type: "function",
    function: {
      name: "get_month_totals",
      description: "Total de entradas e saídas de um mês específico.",
      parameters: {
        type: "object",
        properties: {
          year: { type: "integer", description: "Ano, ex.: 2026" },
          month: { type: "integer", description: "Mês 1-12" },
        },
        required: ["year", "month"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_category_breakdown",
      description: "Quebra por categoria das entradas OU saídas de um mês.",
      parameters: {
        type: "object",
        properties: {
          year: { type: "integer" },
          month: { type: "integer" },
          type: { type: "string", enum: ["in", "out"], description: "in=entradas, out=saídas" },
        },
        required: ["year", "month", "type"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_scheduled_totals",
      description: "Totais em aberto de contas a receber e a pagar (vencimentos).",
      parameters: { type: "object", properties: {}, additionalProperties: false },
    },
  },
] as const;

interface ToolCall {
  id: string;
  type: "function";
  function: { name: string; arguments: string };
}
interface ChatMessage {
  role: "system" | "user" | "assistant" | "tool";
  content: string | null;
  tool_calls?: ToolCall[];
  tool_call_id?: string;
}

const MonthArgs = z.object({ year: z.number().int(), month: z.number().int().min(1).max(12) });

/** Executa uma tool tipada contra o banco (RLS), escopada à empresa. */
async function runTool(name: string, input: Record<string, unknown>, companyId: string): Promise<unknown> {
  switch (name) {
    case "get_balance": {
      const now = new Date();
      const s = await getMonthSummary(companyId, now.getFullYear(), now.getMonth() + 1);
      return { balance: s.balance };
    }
    case "get_month_totals": {
      const a = MonthArgs.parse(input);
      const s = await getMonthSummary(companyId, a.year, a.month);
      return { total_in: s.totalIn, total_out: s.totalOut };
    }
    case "get_category_breakdown": {
      const a = MonthArgs.parse(input);
      const type = input.type === "out" ? "out" : "in";
      const entries = await listEntries(companyId, a.year, a.month);
      const map = new Map<string, number>();
      for (const e of entries) {
        if (e.type !== type) continue;
        const k = e.category?.trim() || "Sem categoria";
        map.set(k, (map.get(k) ?? 0) + e.amount);
      }
      return { breakdown: [...map.entries()].map(([category, total]) => ({ category, total })) };
    }
    case "get_scheduled_totals": {
      const t = await getScheduledTotals(companyId);
      return { to_receive: t.toReceive, to_pay: t.toPay };
    }
    default:
      return { error: `Ferramenta desconhecida: ${name}` };
  }
}

export interface AssistantResult {
  status: "ok" | "error";
  reply?: string;
  code?: "not_configured";
  message?: string;
}

const InputSchema = z.object({
  companyId: z.string().uuid(),
  messages: z
    .array(z.object({ role: z.enum(["user", "assistant"]), text: z.string().max(2000) }))
    .min(1)
    .max(20),
});

export async function askAssistant(input: {
  companyId: string;
  messages: { role: "user" | "assistant"; text: string }[];
}): Promise<AssistantResult> {
  const parsed = InputSchema.safeParse(input);
  if (!parsed.success) return { status: "error", message: "Entrada inválida" };

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return { status: "error", code: "not_configured" };

  await requireUser(); // garante sessão; RLS faz o isolamento por empresa
  const { companyId, messages: history } = parsed.data;

  const messages: ChatMessage[] = [
    { role: "system", content: SYSTEM_PROMPT },
    ...history.map((m): ChatMessage => ({ role: m.role, content: m.text })),
  ];

  // Loop de tool-calls (no máximo algumas rodadas).
  for (let round = 0; round < 5; round++) {
    let choice: { message: ChatMessage; finish_reason: string };
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: 1024,
          tools: TOOLS,
          tool_choice: "auto",
          messages,
        }),
        cache: "no-store",
      });
      if (!res.ok) {
        return { status: "error", message: `Falha na IA (${res.status})` };
      }
      const data = (await res.json()) as { choices: { message: ChatMessage; finish_reason: string }[] };
      choice = data.choices[0];
    } catch (e) {
      return { status: "error", message: e instanceof Error ? e.message : "Falha de rede" };
    }

    const msg = choice.message;
    const toolCalls = msg.tool_calls ?? [];

    if (toolCalls.length > 0) {
      // Echo do turno do assistente (com os tool_calls) + resultados de cada tool.
      messages.push({ role: "assistant", content: msg.content ?? null, tool_calls: toolCalls });

      const results = await Promise.all(
        toolCalls.map(async (tc): Promise<ChatMessage> => {
          let args: Record<string, unknown> = {};
          try {
            args = tc.function.arguments ? JSON.parse(tc.function.arguments) : {};
          } catch {
            args = {};
          }
          const out = await runTool(tc.function.name, args, companyId);
          return { role: "tool", tool_call_id: tc.id, content: JSON.stringify(out) };
        }),
      );
      messages.push(...results);
      continue;
    }

    // Resposta final
    const text = (msg.content ?? "").trim();
    return { status: "ok", reply: text || "Não consegui responder agora." };
  }

  return { status: "error", message: "A conversa ficou longa demais. Tente reformular." };
}
