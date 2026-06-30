// Fase 3 (29/Jun): CORRIGIR vira um chat com a IA. Em vez de editar o texto à mão num textarea,
// o usuário descreve o problema em linguagem natural ("esse atestado é só corresponsável, ajusta")
// e a IA reescreve o documento — citando fonte, sem inventar número, mantendo o tom de licitação.
// Este módulo é PURO (sem rede): monta o LlmRequest + schema. A chamada vive em /api/doc-chat.

import type { LlmRequest } from "./agents/agent-types.ts";

export interface DocChatTurn {
  role: "user" | "assistant";
  content: string;
}

export interface DocChatInput {
  /** Rótulo do documento sendo corrigido (ex.: "Declaração de não emprega menor"). */
  docLabel: string;
  /** Seção/bloco do dossiê (ex.: "Qualificação Técnica (documento)"). */
  secao: string;
  /** Texto atual do documento (valor do motor ou a última versão corrigida). */
  currentText: string;
  /** Proveniência do texto atual (fonte legal / cláusula / motor). */
  proveniencia: string;
  /** Instrução nova do usuário em linguagem natural. */
  instruction: string;
  /** Identificação do certame, p/ a IA manter dados corretos. */
  certame?: { titulo?: string; orgao?: string; empresa?: string };
  /** Histórico da conversa de correção deste documento (turnos anteriores). */
  history?: DocChatTurn[];
}

export interface DocChatResult {
  /** Documento reescrito por completo (substitui o texto atual quando o usuário aprova). */
  correctedText: string;
  /** Explicação curta do que mudou e por quê (mostrada no chat, não vai pro documento). */
  explanation: string;
}

export const DOC_CHAT_SCHEMA: Record<string, unknown> = {
  type: "object",
  additionalProperties: false,
  properties: {
    correctedText: { type: "string" },
    explanation: { type: "string" },
  },
  required: ["correctedText", "explanation"],
};

const SYSTEM_PROMPT = `Você é o revisor de documentos de licitação do Noyce. O usuário (a empresa licitante) descreve, em linguagem natural, o que está errado num documento; você REESCREVE o documento aplicando a correção.

REGRAS INEGOCIÁVEIS:
- Devolva o documento COMPLETO e final em "correctedText" — não um diff, não um trecho. É o texto que vai pro arquivo.
- NÚMERO, VALOR, PRAZO, QUANTITATIVO e CNPJ vêm do dado fornecido (texto atual + dados do certame) — NUNCA invente nem estime. Se o usuário pedir um número que você não tem, deixe explícito o que falta em "explanation" e NÃO preencha com palpite.
- Mantenha o tom formal/jurídico de peça de licitação (Lei 14.133/2021). Não insira reticências, colchetes "a preencher", "XXX" ou "TBD" — texto assinável não pode ter lacuna.
- Preserve a base legal/citações corretas; só altere o que a instrução pedir (e o que for consequência direta dela).
- "explanation" = 1-3 frases dizendo o que mudou e por quê. Não repita o documento inteiro ali.
- Você PREPARA o documento; quem assina e submete é o humano. Não afirme que protocolou nada.`;

/** Monta o LlmRequest para um turno de correção por chat. Puro e testável. */
export function buildDocChatRequest(input: DocChatInput): LlmRequest {
  const certameLinhas = input.certame
    ? [
        input.certame.empresa ? `Empresa licitante: ${input.certame.empresa}` : null,
        input.certame.titulo ? `Certame: ${input.certame.titulo}` : null,
        input.certame.orgao ? `Órgão: ${input.certame.orgao}` : null,
      ].filter(Boolean)
    : [];

  const historico = (input.history ?? [])
    .map((t) => `${t.role === "user" ? "USUÁRIO" : "REVISOR"}: ${t.content}`)
    .join("\n");

  const user = [
    `DOCUMENTO: ${input.docLabel}  (seção: ${input.secao})`,
    `PROVENIÊNCIA/FONTE: ${input.proveniencia}`,
    certameLinhas.length ? `DADOS DO CERTAME:\n${certameLinhas.join("\n")}` : null,
    `TEXTO ATUAL DO DOCUMENTO:\n"""\n${input.currentText}\n"""`,
    historico ? `CONVERSA ANTERIOR:\n${historico}` : null,
    `INSTRUÇÃO DO USUÁRIO:\n${input.instruction}`,
    `Reescreva o documento aplicando a instrução e devolva no schema (correctedText, explanation).`,
  ]
    .filter(Boolean)
    .join("\n\n");

  return {
    system: SYSTEM_PROMPT,
    user,
    schema: DOC_CHAT_SCHEMA,
    model: process.env.DOC_CHAT_MODEL ?? "claude-opus-4-8",
    maxTokens: 2000,
    effort: "medium",
  };
}

/** Normaliza a saída do LLM no DocChatResult, com validação mínima anti-lacuna. */
export function parseDocChatResponse(json: unknown): DocChatResult | null {
  if (!json || typeof json !== "object") return null;
  const j = json as Record<string, unknown>;
  const correctedText = typeof j.correctedText === "string" ? j.correctedText.trim() : "";
  const explanation = typeof j.explanation === "string" ? j.explanation.trim() : "";
  if (!correctedText) return null;
  return { correctedText, explanation };
}
