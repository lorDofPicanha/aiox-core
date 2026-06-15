# 31 — Arquitetura da camada de agentes LLM (Noyce) — 15/Jun/2026

> **Decisão do founder (15/Jun):** "A ideia principal era ter a LLM para fazer a triagem,
> análise e tudo que precisar. Os agentes não são apenas para buscar — eles farão as buscas,
> toda a parte de documentação, capacitação e tudo que o edital pedir, **incluindo planilhas**."
>
> O Noyce atual é determinístico (regras/fórmulas; zero LLM raciocinando). Este doc especifica
> a virada para **LLM-driven**: a LLM é o cérebro (lê o edital e raciocina), o RAG (docs 26/29 +
> `lib/data/knowledge-base/`) aterra o conhecimento, e a camada determinística atual vira
> **guardrail/validador**. Modelos da Claude API ancorados no reference oficial (15/Jun).

---

## 1. Princípio central

```
edital (PDF/PNCP) ─┐
RAG (Lei 14.133,    │
 habilitação,       ├─► CONTEXTO ─► LLM (Claude) ─► JSON validado ─► GUARDRAIL ─► tipos noyce-model ─► UI
 perfil ENIAC,      │   aterrado     (raciocina:      (output_config   determinístico:    (mesma UI,
 acervo/CATs,       │                triagem/análise/  .format =        prazo vencido,      motor trocado)
 vencedores)  ──────┘                docs/planilha)    schema)          ato humano, fonte)
```

- **A LLM raciocina; o código constrange e verifica.** A saída da LLM preenche os **mesmos
  tipos** de `noyce-model.ts` que a UI já consome → a UI **não muda**, só o motor por trás dos
  campos passa de *calculado* para *raciocinado*.
- **Três invariantes não-negociáveis** (herdados do ethos do projeto):
  1. **Proveniência** — toda afirmação cita fonte (chunk do RAG, cláusula do edital, campo do
     PNCP). Guardrail rejeita afirmação sem fonte.
  2. **Atos vinculantes = humano** — `HUMAN_REQUIRED_ACTS` (lance, declaração, proposta, recurso)
     são **preparados** pela LLM mas **clicados** pelo humano. Legal (Lei 14.133 art. 155; BLL
     art. 13§3) e o que o founder disse à cliente ("vocês só revisam e aprovam").
  3. **Sem alucinação numérica** — números (valores, prazos, quantitativos) saem de dado
     estruturado/edital, nunca inventados pela LLM. Ver §6.

## 2. Superfície da Claude API: **Claude API + tool use** (não Managed Agents)

| Critério | Decisão |
|---|---|
| Hospedagem da compute | **Nós** (Next.js/Node). Precisamos dos guardrails determinísticos no loop → loop self-hosted. |
| SDK | **`@anthropic-ai/sdk`** (TypeScript — o app é TS). |
| Saída | **Structured Outputs** (`output_config.format` / `messages.parse()`) — valida contra schema, igual aos tipos atuais. Suportado em Fable 5/Opus 4.8/Sonnet 4.6/Haiku 4.5. |
| Loop | **Tool runner** (beta) para agentes com ferramentas; loop manual onde precisamos de gate humano (atos vinculantes). |
| Managed Agents? | **Não.** MA é pra Anthropic rodar o loop + hospedar o container. Aqui queremos guardrail/validação no nosso código e dado local — Claude API + tool use é o encaixe. |

## 3. Camada `apps/noyce/lib/agents/`

```
lib/agents/
  agent-runtime.ts     # wrapper do client Claude: structured output, retry, seleção de modelo,
                       #   prompt caching do contexto legal, captura de uso/custo
  agent-context.ts     # monta o contexto aterrado: retrieveContext(RAG) + CCP/acervo ENIAC +
                       #   texto do edital + constantes legais. Prefixo estável p/ cache.
  guardrails.ts        # validadores determinísticos: HUMAN_REQUIRED_ACTS, isDeadlinePassed,
                       #   proveniência obrigatória, schema, faixa de valor vs teto solo
  schemas/             # JSON Schemas (espelham noyce-model.ts) p/ cada saída de agente
  triage-agent.ts
  analysis-agent.ts
  habilitation-agent.ts
  document-agent.ts    # proposta (.docx) + PLANILHA (.xlsx) + declarações
  monitor-agent.ts
  recourse-agent.ts
  orchestrator.ts      # pipeline por edital, com gates humanos
```

**Esqueleto do runtime (TS, SDK oficial):**
```ts
import Anthropic from "@anthropic-ai/sdk";
const client = new Anthropic();

export async function runAgent({ system, context, edital, schema, model }) {
  const res = await client.messages.parse({
    model,                                    // ver §7
    max_tokens: 16000,
    thinking: { type: "adaptive" },           // Opus 4.8/Sonnet 4.6: adaptive
    output_config: { format: schema },        // saída validada contra schema
    system: [
      { type: "text", text: system },
      { type: "text", text: context, cache_control: { type: "ephemeral" } }, // RAG/legal = prefixo cacheável
    ],
    messages: [{ role: "user", content: `Edital:\n${edital}\n\nProduza o veredito.` }],
  });
  return validate(res.parsed_output);         // guardrail determinístico
}
```

## 4. Os agentes (a esteira BUSCA → ANALISA → ENTREGA)

| Agente | Aba | Faz | Entrada → Saída (schema) | Humano |
|---|---|---|---|---|
| **Discovery/Triagem** | Monitorar/Mesa | Lê o objeto de cada edital + perfil ENIAC → **Vai/Olha/Pula** com razão + lacunas | edital + RAG → `DiscoveryTriage` | — (informativo) |
| **Análise** | Analisar | Lê o **edital inteiro** + dado de mercado/vencedores → oportunidade, estratégia de preço, riscos, concorrência | edital completo + RAG + market-snapshot → `AnalysisRun` | revisa |
| **Habilitação/Capacitação** | Habilitar | Casa requisitos do edital × **acervo/CCP da ENIAC** → gaps (sanável/insanável), recomendação de **consórcio** | edital + acervo (CATs) + RAG → `HabilitationResult` | revisa |
| **Documentação** | Habilitar/Entregar | Gera **proposta (.docx) + PLANILHA (.xlsx)** + declarações que o edital pedir | edital + CCP + análise → conteúdo estruturado → render | **aprova/assina** |
| **Acompanhamento** | Acompanhar | Vigia prazo/sessão; alerta | snapshot + datas → `OperationalState` | age na plataforma |
| **Recurso** | Recorrer | Avalia fundamento + **minuta** o recurso | resultado + edital → minuta | **aprova/protocola** |
| **Governança** | Governança | Auditoria de proveniência (não é agente LLM — é o guardrail) | — | — |

## 5. Agente de Documentação — proposta **+ planilha** (o pedido novo)

O ponto mais sensível: o edital pede **proposta, planilha de preços, declarações**, e às vezes um
**modelo específico de planilha** (transcrição da reunião). Padrão para **não alucinar número/formato**:

1. **LLM decide o CONTEÚDO** (structured output): itens da planilha, quantitativos, preços unitários,
   BDI, totais, textos das declarações, campos da proposta — tudo como **JSON validado**, cada
   número com origem (edital/CCP/análise).
2. **Código RENDERIZA o arquivo** (determinístico, auditável):
   - **`.docx`** (proposta, declarações) → já temos `noyce-docgen.ts` + `noyce-package.ts` (lib `docx`).
   - **`.xlsx`** (planilha de preços) → renderer com **`exceljs`** (Node) a partir do JSON — fórmulas
     de total/BDI calculadas em código, não pela LLM. Alternativa: **code execution** server-side da
     Claude (sandbox tem `openpyxl`/`xlsxwriter`) quando o layout for muito variável.
3. **Dois modos de export** (doc 29): dossiê consolidado (PDF/HTML + .docx + .xlsx) **e** documento
   individual por categoria (re-envio pontual).
4. **Adaptação ao modelo do edital**: se o edital traz um modelo de planilha próprio, a LLM mapeia os
   campos da ENIAC para esse layout; o renderer preenche. Sempre no **papel timbrado** da ENIAC.

> Regra: a LLM **nunca** emite o `.xlsx` final como texto — ela emite o **modelo de dados**; o número
> que vai pra planilha é calculado/validado em código. Mantém auditabilidade e zero erro de fórmula.

## 6. Anti-alucinação e proveniência

- **Saída estruturada obrigatória** (`output_config.format`) → a LLM não "fala livre", preenche schema.
- **Cada campo factual carrega `source`** (chunk RAG / cláusula edital / campo PNCP). `guardrails.ts`
  rejeita output com campo factual sem fonte → re-pergunta ou marca `PENDENTE_DADO`.
- **Números fora da LLM**: valores/prazos vêm do dado estruturado; a LLM referencia, não inventa.
- **`stop_reason: "refusal"`** tratado (classificadores podem recusar); fallback p/ Opus 4.8 quando usar Fable 5.
- **Verificação adversarial** (opcional, alto valor): um 2º agente "cético" valida o veredito do 1º antes de exibir (padrão de review). Liga ao detector de direcionamento (doc 27).

## 7. Seleção de modelo e custo (preços oficiais Claude API, 15/Jun)

Default da Claude API = **Opus 4.8** (`claude-opus-4-8`, $5/$25 por 1M tok). **Não rebaixar por
custo é decisão sua, não minha** — abaixo a recomendação por agente + a opção de tiering (você escolhe):

| Agente | Volume | Recomendado | Por quê |
|---|---|---|---|
| Triagem | Alto (330+ editais/h) | **Haiku 4.5** ($1/$5) | barato/rápido em volume; tarefa leve (objeto → Vai/Olha/Pula) |
| Análise | Baixo (só os "Vai") | **Opus 4.8** ($5/$25) | raciocínio sobre edital longo + mercado |
| Habilitação | Baixo | **Opus 4.8** | casamento técnico complexo (atestados, consórcio) |
| Documentação | Sob demanda | **Opus 4.8** (ou **Fable 5** $10/$50 p/ os mais críticos) | escrita jurídica de alto risco |
| Recurso | Raro | **Fable 5** ou **Opus 4.8** | peça jurídica, custo de erro alto |

**Alavancas de custo** (todas oficiais): **prompt caching** do contexto legal/RAG (prefixo estável →
~0,1× no read); **Batches API** (−50%) p/ triagem não-urgente; **`effort`** (`low` na triagem, `high`
na análise); cachear a snapshot de mercado. Estimativa grosseira: triagem horária em Haiku sobre ~330
editais ≈ centavos/hora; análise só nos poucos "Vai"/dia em Opus = custo dominado pelo volume de
documentação sob demanda. **Medir com `count_tokens` antes de escalar.**

## 8. Fronteira humana (atos vinculantes)

A LLM **prepara**; o humano **clica**. Implementação: o `orchestrator.ts` roda a esteira até o ponto de
ato vinculante e **para** num gate (status "aguardando aprovação humana"), expondo o artefato (proposta/
planilha/declaração/recurso) pra revisão na UI. Nenhum agente atua dentro de BLL/BNC/PCP/ComprasGov
(bloqueio de plataforma + lei). Bate com `HUMAN_REQUIRED_ACTS` e o `noyce-source-registry.ts`.

## 9. Portais "em atividade"

- Já ativos via **PNCP** (espinha legal que agrega todos): última busca trouxe PNCP/ComprasGov/PCP/BNC.
- **Melhoria real de cobertura**: adicionar **ComprasGov como 2º feed direto** (API aberta
  `dadosabertos.compras.gov.br`) + ampliar PNCP (todas modalidades + raio 500km).
- **PCP**: scraping proibido — só via PNCP. **Login** nos portais (atuar no certame da ENIAC) =
  humano + vault. Nada disso muda com a camada LLM.

## 10. Migração incremental (sem big-bang)

1. **Feature flag por aba** (`agentMode: 'llm' | 'deterministic'`). O determinístico atual vira
   **fallback** (LLM indisponível/erro) **e validador** (compara/limita a saída LLM).
2. **Ordem**: Triagem (menor risco) → Análise → Habilitação → Documentação (proposta+planilha) →
   Recurso. Uma aba por vez, atrás da flag, com o determinístico como rede.
3. **Cada função determinística** (`buildTriage`, `buildHabilitationResult`, `buildNextStep`…) é mantida
   como guardrail/fallback — não se joga fora.
4. **Testes**: cada agente ganha testes com edital-fixture → schema esperado; guardrails testados
   isoladamente (já temos o padrão 135/135).

## 11. Riscos e mitigação

| Risco | Mitigação |
|---|---|
| Alucinação de número/cláusula | Saída estruturada + número fora da LLM + proveniência obrigatória (§6) |
| Custo descontrolado | Haiku na triagem + caching + Batches + `effort` + medir antes de escalar (§7) |
| PNCP instável | Já temos retry+guard; LLM opera sobre a snapshot, degradação graciosa |
| LLM agir além do pedido | Gate humano nos atos vinculantes (§8); prompts com fronteira explícita |
| Recusa do classificador (Fable 5) | Tratar `stop_reason: refusal` + fallback Opus 4.8 |
| Edital escaneado (sem texto) | OCR no pipeline de ingestão antes de mandar à LLM |

## 12. Próximos passos sugeridos

1. **Prova** (recomendado iniciar): `triage-agent.ts` + `agent-runtime`/`context`/`guardrails` mínimos,
   rodando nos 330 editais reais, Haiku 4.5, saída no tipo `DiscoveryTriage` atual, validada.
2. **`document-agent` com planilha**: schema do modelo de planilha + renderer `exceljs` (.xlsx) +
   reuso do `noyce-docgen` (.docx) — o entregável que a cliente mais quer.
3. **ComprasGov direto + raio 500km** na discovery (cobertura).
4. **Stories**: quebrar esta arquitetura em stories (estende doc 30) via @sm.

> Ground: reference oficial Claude API (modelos/preços/structured outputs/tool use/code-exec p/ xlsx),
> docs 23/26/27/29, `noyce-model.ts`, `noyce-source-registry.ts`, `noyce-docgen.ts`, `noyce-package.ts`.
