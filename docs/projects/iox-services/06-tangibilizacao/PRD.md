# #06 — Tangibilização Engine

**Tier:** A
**Status:** ⚪ pending (meta-tool — orquestra #00 #04 #05 #09)
**Case validador:** Rodrigo Feldman → veio cobrar R$20k, fechou R$180k porque tangibilizou TUDO antes da call

---

## DSPC

**D — Dor cara:**
Consultor / agência / vendedor B2B premium chega na call de proposta com PDF de 20 páginas. Cliente fica imaginando "será que funciona?". Sabotadores internos atacam ("já tentamos isso, não funciona"). Ciclo de venda 30-90 dias com 3-5 reuniões. Taxa fechamento <30%. Cada lead que esfria = R$30-100k perdidos.

**Custo semanal visível:** consultor sênior 10h/sem em proposals × R$300/h = R$3k/sem + 70% leads perdidos por sabotagem mental do cliente = R$50-150k/mês em receita não-realizada.

**S — Squad (meta-orchestrador):**
- `agent-brief-receiver` — recebe brief 1 página + dados do cliente (nome, setor, dor, decisor)
- `agent-research-mini` (usa #04) — research específico do cliente em 30min (vs 8h)
- `agent-lp-generator` — site mockup com nome do cliente + setor + dor nas palavras dele
- `agent-dashboard-mockup` — dashboard sintético com dados realistas do cliente
- `agent-slide-generator` (usa #00) — deck com aspas do cliente + transformação
- `agent-video-narrator` — vídeo 60s "como será trabalhar com a gente"
- `agent-executive-pdf` — PDF executivo pra sponsor levar pra board
- `agent-quality-gate` — Pedro Valerio + design-chief revisam coerência

**P — Pitch:**
> "Eu ajudo consultorias premium e agências high-ticket a tangibilizar propostas em 2 horas em vez de 2 semanas, usando squad orquestrador de research + LP + dashboard + slides + vídeo para alcançar 3-9x maior taxa de fechamento sem aumentar custo de aquisição"

**C — Contrato:**
- Por tangibilização: R$3-5k por proposta (consultor solo)
- Pacote: R$30-50k pra "10 tangibilizações + treinamento + brand assets"
- Recorrência enterprise: R$15-30k/mês pra agências que fecham 10+ propostas/mês

---

## Vertical inicial sugerido

**Recomendado: Consultorias estratégicas + agências de tecnologia premium**

**Alternativas:**
- Bretda / Tocks USO INTERNO primeiro (validar com nossos próprios pipelines)
- Vendedores B2B enterprise individuais (não escala bem)
- Construtoras / arquitetos high-ticket

---

## Reuse de assets AIOS

| Asset | Função |
|---|---|
| #00 Slide Creator | Geração de deck personalizado |
| #04 Research Dashboard | Pesquisa do cliente em 30min |
| #09 Vitrine Builder | Hero LP do cliente |
| `copy-chief` (24 clones) | Copy com voz do cliente nas aspas |
| `design-chief` (9 specialists) | Coerência visual cross-asset |
| `ux-design-expert` (Uma) | UX do dashboard mockup |
| `traffic-masters-chief` | Validação que LP converte |
| Pedro Valerio | Gate de qualidade (zero wrong paths na narrativa) |
| `oalanicolas` | Voice DNA do cliente (se tiver áudio/vídeo dele falando) |

---

## Stack técnico proposto

- **Backend:** Next.js + Supabase (cada cliente = projeto efêmero)
- **AI:** Codex 5.5 (volume); Cloud Opus pra slides finais; Gemini Vision pra LP mockups
- **Vídeo:** ElevenLabs (voz) + Remotion (template visual) + ffmpeg
- **Output:** ZIP com (a) LP `.html`, (b) dashboard `.html`, (c) deck `.pptx + .html`, (d) `.mp4` vídeo, (e) `.pdf` executivo
- **Hospedagem:** Vercel preview por cliente (URL personalizada com nome do cliente)

---

## Roadmap de execução

| Fase | Duração | Entregável |
|---|---|---|
| **Brainstorm DSPC** | 2h | DSPC + Bretda/Tocks como cliente interno piloto |
| **PRD detalhado** | 1 dia | Spec dos 8 agents + fluxo orquestração |
| **MVP — só slides + LP** | 1 semana | Cliente recebe brief, sai com deck + LP em 4h |
| **MVP — dashboard mockup** | 1 semana | Adiciona dashboard sintético |
| **MVP — vídeo** | 1 semana | Adiciona vídeo 60s (Remotion + ElevenLabs) |
| **Smoke test interno** | 1 semana | Usa pra propostas Bretda/Tocks reais |
| **Lançamento externo** | 2 semanas | LP + cases internos + pricing |

**Tempo total:** ~6-8 semanas. Mas pode ser USADO INTERNAMENTE desde semana 2.

---

## Hipóteses críticas

1. ✅ Caso Rodrigo Feldman valida demanda forte
2. ✅ Temos os componentes (#00, design-chief, copy-chief)
3. ❓ Coerência cross-asset (LP + slide + vídeo com mesma voz) — exige design system bem amarrado
4. ❓ Tempo total 2h é viável? Talvez seja 6-8h na prática inicial
5. ❓ Qualidade do dashboard mockup com dados sintéticos — fica óbvio que é fake?

---

## Riscos

- **Risk-1:** Tangibilização ruim ESTRAGA proposta (efeito uncanny valley) → mitigar: Pedro Valerio gate veta entrega inferior
- **Risk-2:** Cliente acha "fake" e perde confiança → mitigar: disclaim claro "essa é uma simulação baseada em dados públicos do mercado"
- **Risk-3:** Custo de produção alto (multimodal, vídeo) → mitigar: cobrar premium R$3-5k/proposta cobre folgado

---

## Uso interno antes de vender externamente

**Validação obrigatória:** usar em 3-5 propostas REAIS Bretda/Tocks/Vorza antes de lançar externamente. Medir:
- Tempo de produção real
- Taxa de fechamento da proposta tangibilizada vs proposta tradicional
- Feedback qualitativo do cliente sobre percepção

Se Bretda fechar 1 cliente premium graças a tangibilização → ROI provado, lança externo.

---

## Próximas ações

- [ ] Brainstorm DSPC formal
- [ ] Identificar 3 propostas pendentes Bretda/Tocks pra testar
- [ ] Spike: Remotion + ElevenLabs combo (1 dia)
- [ ] PRD detalhado

Trigger: `kickoff tangibilizacao`
