# Spike — Stage 3: Indicar Diferencial (síntese prescritiva 5-frases) — 21/Mai/2026

**Prioridade:** P1 · **Advisors:** justen-filho (jurídico), niebuhr (licitação) · **Depende de:** Stage 2 (histórico do órgão), Stage 4 (campos do edital)

## Job
Dado um edital relevante, gerar **5 frases acionáveis** que orientam o "vai/não vai" da cliente em 4-24h:
1. **Preço-alvo** — faixa sugerida (com base no histórico de vencedores do órgão).
2. **Diferencial** — o que destacar na proposta dado o perfil da cliente.
3. **Concorrente provável** — quem costuma vencer nesse órgão/objeto.
4. **Risco** — armadilha do edital (exigência exótica, prazo curto, garantia alta).
5. **Timing** — janela de impugnação/esclarecimento e data da sessão.

## Desconhecido técnico
1. **Grounding sem alucinar** — cada frase precisa estar ancorada em um dado citável (histórico real do órgão + cláusula do edital), não em "achismo" do modelo.
2. **Risco de virar "consultoria"** — síntese prescritiva pode ser lida como aconselhamento jurídico/contábil. Justen: precisa de **disclaimer** e linguagem de sugestão, não de decisão.

## Abordagem proposta
- **RAG estruturado** (não free-form): recuperar (a) histórico do órgão do Stage 2 (vencedores/preços/recorrência dos últimos 6m) + (b) campos extraídos do edital no Stage 4.
- **Prompt com schema fixo** de 5 campos; cada campo exige uma **citação de fonte** (id do contrato histórico OU cláusula do edital). Frase sem fonte → "dado insuficiente" (não inventa).
- **Modelo:** Claude Sonnet 4.x com prompt caching (re-uso do contexto do órgão).
- **Disclaimer obrigatório:** "Sugestão baseada em dados públicos — não substitui análise jurídica/contábil."

## Experimento (antes de build)
- Gerar as 5-frases para **5 dos 11 editais reais** onde houver histórico recuperável do órgão (PCP/Águas Lindas + BNC).
- **Teste de utilidade com a cliente:** ela classifica cada frase como útil / inútil / errada.

## Gate (pós-M3)
- ✅ **PASSA** se a cliente classificar **≥60%** das frases como úteis e **0** como factualmente errada (alucinação).
- ❌ **REPROVA/AJUSTA** se <60% úteis → filtros/síntese errados; revisar grounding ou recuo de escopo (talvez só 2-3 frases confiáveis).

## Decisões pendentes
- [ ] D-S3.1 — Quantas frases entram no MVP (5 completas vs subset confiável)?
- [ ] D-S3.2 — Linguagem do disclaimer (revisão Justen/Niebuhr).
- [ ] D-S3.3 — Mostrar a fonte/citação ao usuário (transparência) ou só internamente?

---
*Spike por Orion (aios-master). Síntese prescritiva é a 1ª camada do moat — só vale se ancorada e útil.*
