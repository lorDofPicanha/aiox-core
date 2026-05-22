# Spike — Stage 6: Recorrer (minuta + análise do vencedor) — 21/Mai/2026

**Prioridade:** P2 · **Advisors:** niebuhr, justen-filho · **Depende de:** Stage 4 (extração) + Stage 5 (gatilho: vencedor declarado)

## Job
Quando a cliente **não vence**: analisar a documentação do **licitante vencedor**, classificar se há defeito que justifique recurso, e gerar uma **minuta de recurso** (template + RAG Lei 14.133/TCU) em <8min.

## Desconhecido técnico
1. **Classificar defeito substantivo vs sanável** — a nuance central (conclave): defeito **substantivo** = recurso forte; defeito **sanável** = provável diligência (art. 64), recurso fraco. Errar isso gera recurso inócuo.
2. **Enquadramento processual** — recurso vai à **autoridade superior** (não é mero pedido de reconsideração); prazos da Lei 14.133 (art. 165).

## Abordagem proposta
- **Gatilho:** evento `sessao.vencedor_declarado` (Stage 5) → baixa docs do vencedor (<3min).
- **Classificador LLM** com RAG sobre **Lei 14.133 + jurisprudência TCU**: rotula cada defeito encontrado em substantivo / sanável / irrelevante, com citação.
- **Template de minuta** parametrizado (fundamentação + pedido) — preenchido só para defeitos substantivos.
- **Revisão humana OBRIGATÓRIA** antes de protocolar — nunca auto-submit (risco jurídico).

## Experimento (antes de build)
- Se houver **1 caso real** de recurso da cliente: rodar o classificador e comparar com o desfecho real (recurso procedeu?).
- Revisão jurídica do output por advisor (Niebuhr).

## Gate
- ✅ **PASSA** se a classificação substantivo/sanável bater com o juízo do especialista em ≥70% dos casos de teste.
- ⚠️ **Restrição dura:** minuta é **rascunho assistido**, sempre com disclaimer + revisão humana. Não é peça jurídica autônoma.

## Decisões pendentes
- [ ] D-S6.1 — MVP gera minuta ou só sinaliza "vale recorrer"? (recuo de escopo possível)
- [ ] D-S6.2 — Base de jurisprudência TCU: quais fontes indexar (acórdãos, súmulas)?
- [ ] D-S6.3 — Stage 6 entra no MVP ou fica para v2 (depende de 4+5 maduros)?

---
*Spike por Orion (aios-master). P2 — depende de 4 e 5. Sempre human-in-the-loop por risco jurídico.*
