// Prisma — the opportunity and competition analysis agent (agents/prisma.md). It reads the
// full edital excerpt plus market context and returns a sourced decision brief: win chance,
// feasible price band, competition, risks and impugnation points. Binding acts are never executed.

import type { AgentDefinition, LlmClient, ResultSource } from "./agent-types.ts";
import { assembleContext } from "./agent-context.ts";
import { runAgent } from "./agent-runtime.ts";
import { validateAnalysis } from "./guardrails.ts";

export type AnalysisSeverity = "baixa" | "media" | "alta";

export interface AnalysisInput {
  objeto: string;
  editalExcerpt: string;
  marketResumo?: string;
}

export interface PriceBand {
  p25: number | null;
  mediana: number | null;
  p75: number | null;
  fonte: string;
}

export interface CompetitorWinner {
  cnpj: string;
  nome: string;
  valor: number | null;
}

export interface CompetitionAnalysis {
  incumbente: string | null;
  hhi: number | null;
  vencedores: CompetitorWinner[];
  fonte: string;
}

export interface AnalysisRisk {
  descricao: string;
  severidade: AnalysisSeverity;
  fonte: string;
}

export interface ImpugnationPoint {
  ponto: string;
  baseLegal: string;
  fonte: string;
}

export interface AnalysisResult {
  opportunityScore: number;
  confidenceScore: number;
  resumo: string;
  faixaPreco: PriceBand;
  concorrencia: CompetitionAnalysis;
  riscos: AnalysisRisk[];
  pontosImpugnacao: ImpugnationPoint[];
  fonte: string[];
  source: ResultSource;
  pendencias: string[];
}

export const ANALYSIS_SCHEMA: Record<string, unknown> = {
  type: "object",
  additionalProperties: false,
  properties: {
    opportunityScore: { type: "integer", minimum: 0, maximum: 100 },
    confidenceScore: { type: "integer", minimum: 0, maximum: 100 },
    resumo: { type: "string" },
    faixaPreco: {
      type: "object",
      additionalProperties: false,
      properties: {
        p25: { type: ["number", "null"] },
        mediana: { type: ["number", "null"] },
        p75: { type: ["number", "null"] },
        fonte: { type: "string" },
      },
      required: ["p25", "mediana", "p75", "fonte"],
    },
    concorrencia: {
      type: "object",
      additionalProperties: false,
      properties: {
        incumbente: { type: ["string", "null"] },
        hhi: { type: ["number", "null"] },
        vencedores: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            properties: {
              cnpj: { type: "string" },
              nome: { type: "string" },
              valor: { type: ["number", "null"] },
            },
            required: ["cnpj", "nome", "valor"],
          },
        },
        fonte: { type: "string" },
      },
      required: ["incumbente", "hhi", "vencedores", "fonte"],
    },
    riscos: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          descricao: { type: "string" },
          severidade: { type: "string", enum: ["baixa", "media", "alta"] },
          fonte: { type: "string" },
        },
        required: ["descricao", "severidade", "fonte"],
      },
    },
    pontosImpugnacao: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          ponto: { type: "string" },
          baseLegal: { type: "string" },
          fonte: { type: "string" },
        },
        required: ["ponto", "baseLegal", "fonte"],
      },
    },
    fonte: { type: "array", items: { type: "string" } },
  },
  required: ["opportunityScore", "confidenceScore", "resumo", "faixaPreco", "concorrencia", "riscos", "fonte"],
};

export const PRISMA_DEFINITION: AgentDefinition = {
  id: "noyce-prisma",
  name: "Prisma",
  model: "claude-opus-4-8",
  effort: "high",
  maxTokens: 3500,
  schema: ANALYSIS_SCHEMA,
  systemPrompt: `Você é o Prisma, analista de oportunidade e concorrência do Noyce.
Lê o edital completo e o cruza com dados reais de mercado/PNCP para julgar se dá para ganhar, a que preço, contra quem e com quais riscos.
- Todo número (valor estimado, faixa P25/mediana/P75, prazo, HHI) vem do edital, PNCP ou snapshot de mercado; nunca da LLM.
- Cite fonte em todo bloco factual: faixa de preço, concorrência, vencedores, riscos e pontos de impugnação.
- Use vencedores reais, CNPJs reais, incumbente e HHI quando existirem no dado de mercado.
- Mercado concentrado ou incumbente dominante rebaixa a chance e exige explicar como bater: preço, diferencial técnico ou risco de não disputar.
- Sinalize riscos de habilitação para a Forja e pontos de impugnação para o Tribuno.
- Detecte cláusulas restritivas suspeitas, mas não protocole nem recomende executar ato vinculante.
Você analisa e prepara a estratégia; o humano decide, assina, protocola e dá lance.`,
};

function pendingResult(source: ResultSource, pendencias: string[]): AnalysisResult {
  return {
    opportunityScore: 0,
    confidenceScore: 0,
    resumo: "Análise indisponível — revisão humana.",
    faixaPreco: { p25: null, mediana: null, p75: null, fonte: "PENDENTE_DADO" },
    concorrencia: { incumbente: null, hhi: null, vencedores: [], fonte: "PENDENTE_DADO" },
    riscos: [],
    pontosImpugnacao: [],
    fonte: ["PENDENTE_DADO"],
    source,
    pendencias,
  };
}

// Run Prisma. On LLM failure/refusal/guardrail violation → pending human review with no
// fabricated scores, prices or competitors.
export async function runAnalysis(input: AnalysisInput, client: LlmClient): Promise<AnalysisResult> {
  const context = assembleContext(`análise oportunidade: ${input.objeto}`, { topK: 4 });
  const task = `Analise a oportunidade competitiva deste edital para a ENIAC.
Objeto: ${input.objeto}
Trecho do edital:
${input.editalExcerpt}
Resumo de mercado/PNCP:
${input.marketResumo ?? "não informado"}
Produza no schema: opportunityScore, confidenceScore, resumo, faixaPreco (p25/mediana/p75/fonte), concorrencia (incumbente/hhi/vencedores/fonte), riscos (cada um com fonte), pontosImpugnacao (cada um com fonte), fonte[]. Não recomende dar lance nem executar ato vinculante; prepare a análise para decisão humana.`;

  let resp;
  try {
    resp = await runAgent(PRISMA_DEFINITION, { context, task }, client);
  } catch {
    return pendingResult("guardrail_fallback", ["Análise indisponível (erro do modelo) — revisão humana."]);
  }
  if (resp.refusal || resp.json === null || typeof resp.json !== "object") {
    return pendingResult("guardrail_fallback", ["Análise indisponível (recusa/saída inválida) — revisão humana."]);
  }

  const guard = validateAnalysis(resp.json);
  if (!guard.ok) {
    return pendingResult("guardrail_fallback", guard.violations.map((v) => `${v.field ?? v.rule}: ${v.detail}`));
  }

  const j = resp.json as Record<string, unknown>;
  const faixaPreco = (j.faixaPreco ?? {}) as Record<string, unknown>;
  const concorrencia = (j.concorrencia ?? {}) as Record<string, unknown>;
  const vencedores = Array.isArray(concorrencia.vencedores) ? (concorrencia.vencedores as Array<Record<string, unknown>>) : [];
  const riscos = Array.isArray(j.riscos) ? (j.riscos as Array<Record<string, unknown>>) : [];
  const pontosImpugnacao = Array.isArray(j.pontosImpugnacao) ? (j.pontosImpugnacao as Array<Record<string, unknown>>) : [];

  return {
    opportunityScore: Number(j.opportunityScore),
    confidenceScore: Number(j.confidenceScore),
    resumo: String(j.resumo),
    faixaPreco: {
      p25: (faixaPreco.p25 ?? null) as number | null,
      mediana: (faixaPreco.mediana ?? null) as number | null,
      p75: (faixaPreco.p75 ?? null) as number | null,
      fonte: String(faixaPreco.fonte),
    },
    concorrencia: {
      incumbente: (concorrencia.incumbente ?? null) as string | null,
      hhi: (concorrencia.hhi ?? null) as number | null,
      vencedores: vencedores.map((vencedor) => ({
        cnpj: String(vencedor.cnpj),
        nome: String(vencedor.nome),
        valor: (vencedor.valor ?? null) as number | null,
      })),
      fonte: String(concorrencia.fonte),
    },
    riscos: riscos.map((risco) => ({
      descricao: String(risco.descricao),
      severidade: risco.severidade as AnalysisSeverity,
      fonte: String(risco.fonte),
    })),
    pontosImpugnacao: pontosImpugnacao.map((ponto) => ({
      ponto: String(ponto.ponto),
      baseLegal: String(ponto.baseLegal),
      fonte: String(ponto.fonte),
    })),
    fonte: (j.fonte as string[]).map(String),
    source: "llm",
    pendencias: [],
  };
}
