// Forja — the habilitation/capacitação agent (doc 31 / agents/forja.md). Its LLM value-add is the
// reasoning the deterministic engine can't do well: SEMANTIC matching of atestados (same service
// across different nomenclatures), sanável×insanável classification, and the consórcio
// recommendation with a partner profile. The numeric/structural blocks remain the territory of
// buildHabilitationResult (noyce-habilitation.ts), which is the deterministic engine to integrate
// as the fallback once the Acervo/requirements inputs are wired through the pipeline.

import type { AgentDefinition, LlmClient, ResultSource } from "./agent-types.ts";
import { assembleContext } from "./agent-context.ts";
import { runAgent } from "./agent-runtime.ts";
import { validateHabilitation } from "./guardrails.ts";

export type ForjaDecisao = "GO" | "NO_GO" | "CONSORCIO" | "INDETERMINADO";

export interface AtestadoMatch {
  requisito: string;
  catCasado: string | null; // qual CAT da ENIAC casa (ou null se não casa)
  confianca: "alta" | "media" | "baixa";
  alerta: string | null; // ex.: nomenclatura diferente, quantitativo no limite
  fonte: string;
}

export interface ForjaLacuna {
  label: string;
  bloco: "tecnico_profissional" | "tecnico_operacional" | "economico_financeira" | "juridica_fiscal_trabalhista";
  sanavel: boolean;
  comoSanar: string;
  fonte: string;
}

export interface ForjaResult {
  decisao: ForjaDecisao;
  resumo: string;
  matchingAtestados: AtestadoMatch[];
  lacunas: ForjaLacuna[];
  consorcio: { necessario: boolean; motivo: string; perfilParceiro: string | null; fonte: string };
  fonte: string[];
  source: ResultSource;
  pendencias: string[];
}

export interface HabilitationInput {
  objeto: string;
  editalExcerpt: string; // requisitos de habilitação (técnica/econômica/fiscal) + atestados exigidos
  comConsorcio?: boolean;
}

export const HABILITATION_SCHEMA: Record<string, unknown> = {
  type: "object",
  additionalProperties: false,
  properties: {
    decisao: { type: "string", enum: ["GO", "NO_GO", "CONSORCIO", "INDETERMINADO"] },
    resumo: { type: "string" },
    matchingAtestados: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          requisito: { type: "string" },
          catCasado: { type: ["string", "null"] },
          confianca: { type: "string", enum: ["alta", "media", "baixa"] },
          alerta: { type: ["string", "null"] },
          fonte: { type: "string" },
        },
        required: ["requisito", "confianca", "fonte"],
      },
    },
    lacunas: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          label: { type: "string" },
          bloco: { type: "string", enum: ["tecnico_profissional", "tecnico_operacional", "economico_financeira", "juridica_fiscal_trabalhista"] },
          sanavel: { type: "boolean" },
          comoSanar: { type: "string" },
          fonte: { type: "string" },
        },
        required: ["label", "bloco", "sanavel", "comoSanar", "fonte"],
      },
    },
    consorcio: {
      type: "object",
      additionalProperties: false,
      properties: {
        necessario: { type: "boolean" },
        motivo: { type: "string" },
        perfilParceiro: { type: ["string", "null"] },
        fonte: { type: "string" },
      },
      required: ["necessario", "motivo", "fonte"],
    },
    fonte: { type: "array", items: { type: "string" } },
  },
  required: ["decisao", "resumo", "matchingAtestados", "lacunas", "consorcio", "fonte"],
};

export const FORJA_DEFINITION: AgentDefinition = {
  id: "noyce-forja",
  name: "Forja",
  model: "claude-opus-4-8", // casamento técnico complexo (ver doc 31 §7)
  effort: "high",
  maxTokens: 3000,
  schema: HABILITATION_SCHEMA,
  systemPrompt: `Você é a Forja, especialista em habilitação técnica e capacitação do Noyce.
Cruza os requisitos de habilitação do edital com o acervo/CCP da ENIAC e emite GO / NO_GO / CONSORCIO / INDETERMINADO.
- Matching de atestados é SEMÂNTICO (mesmo serviço × nomenclatura diferente). Se não casar com confiança, emita ALERTA — nunca um falso positivo.
- Classifique cada lacuna como sanável (art. 64 — diligência) ou insanável (elimina) e diga COMO sanar.
- Se a ENIAC não habilita sozinha mas o edital permite consórcio → decisao=CONSORCIO (art. 15: soma integral técnica, proporcional econ-fin, +acréscimo dispensado se 100% ME/EPP) e indique o PERFIL de parceiro.
- Teto solo dinâmico = PL/0,10 (ver perfil ENIAC); acima disso só com consórcio.
Quantitativos e validades vêm do edital/CCP — nunca invente número. Cite a fonte em cada item, lacuna e na consórcio. Você analisa; não gera a declaração (isso é o Escriba) nem submete nada.`,
};

function pendingResult(source: ResultSource, pendencias: string[]): ForjaResult {
  return {
    decisao: "INDETERMINADO",
    resumo: "Habilitação automática indisponível — usar motor determinístico (buildHabilitationResult) ou revisão humana.",
    matchingAtestados: [],
    lacunas: [],
    consorcio: { necessario: false, motivo: "não avaliado", perfilParceiro: null, fonte: "PENDENTE_DADO" },
    fonte: ["PENDENTE_DADO"],
    source,
    pendencias,
  };
}

// Run Forja. On LLM failure/refusal/guardrail violation → INDETERMINADO (sem afirmação sem fonte).
export async function runHabilitation(input: HabilitationInput, client: LlmClient): Promise<ForjaResult> {
  const context = assembleContext(`habilitação técnica atestados consórcio: ${input.objeto}`, { topK: 4 });
  const task = `Avalie a habilitação da ENIAC neste edital${input.comConsorcio ? " (considere consórcio)" : ""}.
Objeto: ${input.objeto}
Requisitos de habilitação (trecho do edital):
${input.editalExcerpt}
Produza no schema: decisao, resumo, matchingAtestados (cada um com fonte), lacunas (sanável/insanável + comoSanar + fonte), consorcio (necessario/motivo/perfilParceiro/fonte), fonte[].`;

  let resp;
  try {
    resp = await runAgent(FORJA_DEFINITION, { context, task }, client);
  } catch {
    return pendingResult("guardrail_fallback", ["Habilitação indisponível (erro do modelo) — revisão humana."]);
  }
  if (resp.refusal || resp.json === null || typeof resp.json !== "object") {
    return pendingResult("guardrail_fallback", ["Habilitação indisponível (recusa/saída inválida) — revisão humana."]);
  }

  const guard = validateHabilitation(resp.json);
  if (!guard.ok) {
    return pendingResult("guardrail_fallback", guard.violations.map((v) => `${v.field ?? v.rule}: ${v.detail}`));
  }

  const j = resp.json as Record<string, unknown>;
  const cons = (j.consorcio ?? {}) as Record<string, unknown>;
  return {
    decisao: j.decisao as ForjaDecisao,
    resumo: String(j.resumo),
    matchingAtestados: (j.matchingAtestados as AtestadoMatch[]).map((m) => ({
      requisito: String(m.requisito),
      catCasado: (m.catCasado ?? null) as string | null,
      confianca: m.confianca as AtestadoMatch["confianca"],
      alerta: (m.alerta ?? null) as string | null,
      fonte: String(m.fonte),
    })),
    lacunas: (j.lacunas as ForjaLacuna[]).map((l) => ({
      label: String(l.label),
      bloco: l.bloco as ForjaLacuna["bloco"],
      sanavel: Boolean(l.sanavel),
      comoSanar: String(l.comoSanar),
      fonte: String(l.fonte),
    })),
    consorcio: {
      necessario: Boolean(cons.necessario),
      motivo: String(cons.motivo ?? ""),
      perfilParceiro: (cons.perfilParceiro ?? null) as string | null,
      fonte: String(cons.fonte ?? "PENDENTE_DADO"),
    },
    fonte: (j.fonte as string[]).map(String),
    source: "llm",
    pendencias: [],
  };
}
