// Escriba — the documentation agent (doc 31 / agents/escriba.md). Turns an edital + ENIAC CCP
// into the deliverables: proposta, PLANILHA de preços and declarações. Hard rule: the LLM emits
// the CONTENT (line items, texts) only; the NUMBERS (subtotais/BDI/total) are recomputed in code
// via computePlanilha — the LLM never decides a total. Binding acts are prepared, never executed.

import type { AgentDefinition, LlmClient, ResultSource } from "./agent-types.ts";
import type { PlanilhaComputada, PlanilhaItem } from "../noyce-planilha.ts";
import { computePlanilha, renderPlanilhaCsv } from "../noyce-planilha.ts";
import { assembleContext } from "./agent-context.ts";
import { runAgent } from "./agent-runtime.ts";
import { validateDocumentPackage } from "./guardrails.ts";

export interface DocumentDraftInput {
  objeto: string;
  editalExcerpt: string; // trecho real do edital (exigências documentais, modelo de planilha)
  comConsorcio?: boolean;
}

export interface Declaracao {
  tipo: string;
  texto: string;
  fonte: string;
}

export interface DocumentPackage {
  proposta: { validadeDias: number | null; prazoExecucao: string | null; fonte: string };
  planilha: PlanilhaComputada | null;
  planilhaCsv: string | null;
  declaracoes: Declaracao[];
  source: ResultSource;
  pendencias: string[]; // PENDENTE_DADO — nunca inventamos para preencher
}

// LLM emits CONTENT only — note explicitly that it must NOT compute totals.
export const DOCUMENT_SCHEMA: Record<string, unknown> = {
  type: "object",
  additionalProperties: false,
  properties: {
    proposta: {
      type: "object",
      additionalProperties: false,
      properties: {
        validadeDias: { type: ["integer", "null"] },
        prazoExecucao: { type: ["string", "null"] },
        fonte: { type: "string" },
      },
      required: ["fonte"],
    },
    planilhaItens: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          descricao: { type: "string" },
          unidade: { type: "string" },
          quantidade: { type: "number" },
          precoUnitario: { type: "number" },
          fonte: { type: "string" },
        },
        required: ["descricao", "unidade", "quantidade", "precoUnitario", "fonte"],
      },
    },
    bdiPct: { type: "number" },
    declaracoes: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: { tipo: { type: "string" }, texto: { type: "string" }, fonte: { type: "string" } },
        required: ["tipo", "texto", "fonte"],
      },
    },
  },
  required: ["proposta", "planilhaItens", "bdiPct", "declaracoes"],
};

export const ESCRIBA_DEFINITION: AgentDefinition = {
  id: "noyce-escriba",
  name: "Escriba",
  model: "claude-opus-4-8", // documentação de alto risco (ver doc 31 §7)
  effort: "high",
  maxTokens: 4000,
  schema: DOCUMENT_SCHEMA,
  systemPrompt: `Você é o Escriba, que monta os documentos de licitação do Noyce (proposta, planilha de preços e declarações).
REGRA INEGOCIÁVEL: você emite o CONTEÚDO (itens da planilha com descrição/unidade/quantidade/preço unitário, textos das declarações, campos da proposta). NÃO calcule totais, subtotais nem BDI — isso é feito em código. Cada item da planilha e cada declaração DEVE citar a fonte (cláusula do edital / CCP da ENIAC). Adapte ao modelo do edital, no papel timbrado da ENIAC. Em consórcio, inclua os dados/declarações da empresa parceira. Se faltar dado, NÃO invente — deixe claro o que falta. Você PREPARA; o humano assina e submete.`,
};

function pendingPackage(source: ResultSource, pendencias: string[]): DocumentPackage {
  return {
    proposta: { validadeDias: null, prazoExecucao: null, fonte: "PENDENTE_DADO" },
    planilha: null,
    planilhaCsv: null,
    declaracoes: [],
    source,
    pendencias,
  };
}

// Draft the document package. On LLM failure/refusal/guardrail violation, returns a PENDENTE
// package (never a fabricated number). On success, the NUMBERS are recomputed here from the items.
export async function runDocumentDraft(input: DocumentDraftInput, client: LlmClient): Promise<DocumentPackage> {
  const context = assembleContext(`documentação proposta planilha declarações: ${input.objeto}`, { topK: 4 });
  const task = `Monte o pacote documental para a ENIAC neste edital${input.comConsorcio ? " (EM CONSÓRCIO — inclua declarações da parceira)" : ""}.
Objeto: ${input.objeto}
Trecho do edital:
${input.editalExcerpt}
Produza no schema: proposta (validade/prazo/fonte), planilhaItens (cada um com fonte), bdiPct, declaracoes (cada uma com fonte). NÃO calcule totais — só os itens.`;

  let resp;
  try {
    resp = await runAgent(ESCRIBA_DEFINITION, { context, task }, client);
  } catch {
    return pendingPackage("guardrail_fallback", ["Geração indisponível (erro do modelo) — montar manualmente."]);
  }
  if (resp.refusal || resp.json === null || typeof resp.json !== "object") {
    return pendingPackage("guardrail_fallback", ["Geração indisponível (recusa/saída inválida) — montar manualmente."]);
  }

  const guard = validateDocumentPackage(resp.json);
  if (!guard.ok) {
    return pendingPackage("guardrail_fallback", guard.violations.map((v) => `${v.field ?? v.rule}: ${v.detail}`));
  }

  const j = resp.json as Record<string, unknown>;
  const itens = (j.planilhaItens as PlanilhaItem[]).map((it) => ({
    descricao: String(it.descricao),
    unidade: String(it.unidade),
    quantidade: Number(it.quantidade),
    precoUnitario: Number(it.precoUnitario),
    fonte: String(it.fonte),
  }));
  // NÚMERO FORA DA LLM: ignora qualquer total que a LLM tenha sugerido; recalcula aqui.
  const planilha = computePlanilha(itens, Number(j.bdiPct));
  const prop = (j.proposta ?? {}) as Record<string, unknown>;

  return {
    proposta: {
      validadeDias: (prop.validadeDias ?? null) as number | null,
      prazoExecucao: (prop.prazoExecucao ?? null) as string | null,
      fonte: String(prop.fonte ?? "PENDENTE_DADO"),
    },
    planilha,
    planilhaCsv: renderPlanilhaCsv(planilha),
    declaracoes: (j.declaracoes as Declaracao[]).map((d) => ({ tipo: String(d.tipo), texto: String(d.texto), fonte: String(d.fonte) })),
    source: "llm",
    pendencias: [],
  };
}
