// Assembles the GROUNDED context every agent's prompt is built on: the canonical ENIAC
// profile + the relevant slices of the knowledge base (RAG). Keeping this in one place means
// every agent reasons from the same source-cited facts, and the context is a stable prefix
// (good for prompt caching).

import { retrieveContext } from "../knowledge/knowledge-base.ts";

// Canonical, short ENIAC profile. The full/sourced version lives in the RAG
// (knowledge-base/05-eniac-perfil.md); this is the always-on summary injected into every agent.
export const ENIAC_PROFILE = `## Perfil ENIAC (sempre considere)
- Construtora de PEQUENO/MÉDIO porte, Águas Lindas de Goiás-GO. Nicho: EDIFICAÇÕES, REFORMAS, PRAÇAS (não rodovia/infra pesada).
- PL ~R$ 919.170,54 → teto solo (PL/0,10) ~R$ 9,19 mi. Acima disso, só em consórcio.
- Acervo (CATs reais): reforma de CEO (saúde), construção de escola, praça, topografia. 2 RTs. Máx 2 atestados somáveis.
- Pode entrar em CONSÓRCIO (Lei 14.133 art. 15) quando faltar capacidade técnica.`;

// Invariants every agent must honor — appended to each system prompt by the runtime.
export const SQUAD_INVARIANTS = `## Invariantes (obrigatórias)
1. PROVENIÊNCIA: toda afirmação factual cita fonte (cláusula do edital / trecho da base / campo do dado). Sem fonte → marque PENDENTE_DADO.
2. ATO VINCULANTE = HUMANO: lance, declaração, proposta e recurso são preparados, nunca executados. Você não atua dentro de portais.
3. NÚMERO FORA DA LLM: valores, prazos e quantitativos vêm do dado/edital — nunca invente número.
4. SAÍDA ESTRUTURADA: responda apenas no schema pedido.
5. PRAZO: edital com prazo vencido NÃO é oportunidade aberta.`;

// Build the grounded context block for a query (RAG + ENIAC profile).
export function assembleContext(query: string, opts: { topK?: number; dir?: string } = {}): string {
  const kb = retrieveContext(query, { topK: opts.topK ?? 4, dir: opts.dir });
  return `${ENIAC_PROFILE}\n\n${kb}`;
}

// Compose an agent's full system prompt: its persona/principles + the shared invariants.
export function buildSystemPrompt(persona: string): string {
  return `${persona}\n\n${SQUAD_INVARIANTS}`;
}
