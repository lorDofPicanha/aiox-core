# 05 — Gaps & Riscos

**Autor:** Atlas
**Data:** 2026-05-15
**Objetivo:** Catálogo honesto de (1) o que a estrutura Bretda NÃO testou, (2) riscos de generalização, (3) pergunta crítica de atribuição.

---

## A. O Que A Estrutura NÃO Testou (estudo controlado ausente)

A vitória Bretda 90d é **observational**, não experimental. Não há grupo controle. Isso significa cada elemento causal proposto em `02-decomposition.md` é defensável, mas não comprovado vs alternativas.

### 1. Reels-only vs Feed-only vs Mix
Audience luxe consome **Feed Instagram preferencialmente** (memory `feedback_high_ticket_quality_over_quantity` ponto 6 cita Stories/Reels como scroll passivo). Bretda atual roda Automatic Placements (Meta decide). Não sabemos:
- Qual placement entrega 70% dos leads
- Se forçar Feed-only sobe qualif rate
- Se Reels traz volume mas qualif <0,2%

**Pergunta pendente:** Breakdown leads por placement nos últimos 90d. [DATA GAP] — recomendar query Meta API.

### 2. Advantage+ Audience (audience expansion)
Memory `feedback_high_ticket_quality_over_quantity` ponto 8 diz "Advantage+ Audience expansion OFF como default". Bretda CP2 atual: status `advantage_audience` unknown.

**Risco:** Se está ON, parte do volume vem de audience expandida fora do interest stack — significa qualif rate teorizada está inflada. Se está OFF, queremos confirmar (boa decisão).

**Pergunta pendente:** Verificar config `targeting.advantage_audience` em CP2 e CP1. [DATA GAP]

### 3. Video creative vs static
Bretda atual: 8 ads — não validei tipo. Hipótese: estáticos (renders). Video em luxe tem reputation maior (storytelling, craft, processo de fabricação) mas custa 3-5x produzir.

**Pergunta pendente:** Mix atual estático/video em CP2. Test isolado video CTR vs estático 14d.

### 4. Carousel vs single image
Carousel pode aumentar dwell time (audience luxe gosta de "fazer scroll lateral em catálogo") mas Meta otimiza pra clique, não dwell. Não validado em Bretda.

### 5. RTG (retargeting) ladder
Bretda não tem campanha RTG ativa. 503 leads em 90d sem RTG = audience cold pura. Adicionar RTG warm (visitantes site + form-fillers anteriores) deveria:
- Subir qualif rate (audience já demonstrou interesse)
- Reduzir CAC qualif (recovery de lead morno)
- MAS exige LP funcional + Pixel + CAPI (todos parcialmente faltantes)

**Pergunta pendente:** Quando deploy CAPI Bretda permitir, lançar adset RTG com R\$10-15/d.

### 6. Lookalike audiences
Bretda 503 leads em 90d = base suficiente pra criar LAL 1-3% baseado em form-fillers. Não criado. Hipótese: LAL 1% deve performar 10-20% melhor que interest stack frio.

**Pergunta pendente:** Criar custom audience `bretda_form_fillers_90d` e Lookalike 1% BR. Test em adset paralelo R\$15/d.

### 7. Sazonalidade
90d window = Fev-Maio 2026. Não validamos:
- Black Friday (Nov)
- Pré-festas (Dez)
- Casacor (Mai-Jun) — overlap parcial
- Verão/férias (Jan-Fev)

CPL e qualif rate provavelmente variam ±30% sazonal. **Sem dados YoY, todo o número é snapshot.**

### 8. Multi-channel attribution
Bretda roda Meta + Google paralelo. Quanto do CPL R\$15 Meta é Meta-only vs Meta-touched-after-Google-search?
- Sem UTM rigoroso + dedup CRM, ambiguidade
- Google R\$60/d adiciona signal de "audience que pesquisou Bretda direto"
- Possível overestimação valor Meta

**Pergunta pendente:** Audit UTM consistency últimos 90d. [DATA GAP]

---

## B. Riscos de Generalização

A tentação é tomar Bretda 90d e tratar como **playbook universal de high-ticket BR**. Cinco riscos críticos.

### Risco 1 — Bretda é nicho ultra-específico

Mesa de bilhar custom R\$20-50k é categoria **única**:
- TAM total BR estimado: ~5.000-15.000 pessoas/ano com capacidade compra (HNW + projeto residencial com sala de jogos)
- Profissional-prescritor dominante (arquiteto/decorador)
- Produto físico custom (entrega+install)
- Heritage-defensável (madeira nobre, tradição)

Generalizar pra Tocks (móveis luxo) funciona porque AUDIENCE quase 100% overlap + profissional-prescritor mesmo. **Mas generalizar pra info-produto, B2B SaaS, ou serviço genérico = fail.**

**Mitigação:** Princípio 1 (Qualificação é camada) é universal. Os outros 11 princípios têm escopo definido.

### Risco 2 — Sample size estatística é pequena

503 leads em 90d com CPL R\$15,68 média e desvio implícito ±R\$2-3. Confidence interval 95% provavelmente R\$13-19.
- Pra detectar CPL diff +/- 10% em A/B test, precisaria ~250 conv por braço (>500 total) com mais tempo
- Generalizações tipo "iOS-only é causal HIGH" são defensáveis pelo mecanismo, não pelo sample

**Mitigação:** Confidence HIGH/MEDIUM/LOW em cada elemento `02-decomposition.md` reflete isso.

### Risco 3 — Audience saturation invisível

Pool elegível BR (arquitetos+decoradores+luxe iOS 30-60 Sudeste/Sul) ≈ 50-100k pessoas reais. Freq CP2 1,82 em 30d sugere ainda há espaço. **Mas em 18-24 meses sustained:**
- Mesmas pessoas verão mesmo ad 5-10 vezes
- CPL pode dobrar (R\$30+) sem refresh audience
- Bretda perde economics

**Mitigação:** Refresh creative ciclo 6 sem + adicionar audience LAL 1-3% custom de form-fillers + RTG ladder pra recovery (Gap 5+6 acima).

### Risco 4 — Mid-market scaling threat

Mobly + Tok&Stok = R\$1,6bi receita combinada (memory `session_highticket_squad_08mai` ponto 7). Esses players têm ad budget 50-100x Bretda. Se descobrirem que interest stack `Architects + Interior Designers + Luxury Goods` é a chave (não é proprietary — qualquer auditor Meta vê), podem:
- Copiar interest stack
- Inundar com video creative profissional
- Saturar audience pra Bretda

**Defesa:** Posicionamento categórico (Princípio 10) — Bretda como "The Heirloom Pool Table" defendível, Mobly não pode. Mas leva tempo categórico construir; ad copy generic Bretda ainda imita mid-market.

**Mitigação:** Acelerar posicionamento categórico (memory `session_highticket_squad_08mai` decisão D-04 pendente).

### Risco 5 — Atribuição offline pode REVELAR que estrutura não funciona

Esta é a **risk-reverse mais alta** do estudo todo. Cenário plausível:
- 503 leads / 90d
- Sales segue spreadsheet por 30d
- Descoberta: close-rate Meta = 0,2% (1 venda em 503 leads). CAC = R\$7.887. Ceiling R\$2.100.
- Verdict: Meta NÃO funciona pra Bretda. CPL "bonito" era atestado de form-fill, não business.

**Probabilidade:** Estimo 25-35% chance close <0,5%. Não tenho dados pra ser mais preciso.

**Mitigação:** Deploy sales feedback loop EM 7-14 DIAS, não 60-90. Cada dia sem dado de fechamento é R\$90 queimado em fé.

---

## C. A Pergunta Crítica Que Determina TUDO

**Quantos dos 503 leads dos últimos 90d fecharam venda?**

Cenários:

| Close rate | Vendas | CAC | Verdict |
|------------|--------|-----|---------|
| 0,2% | 1 | R\$7.887 | KILL — estrutura não viable |
| 0,5% | 2,5 | R\$3.155 | MARGINAL — só com ticket alto-end (R\$50k+) sustenta |
| 1,0% | 5 | R\$1.577 | OK — sustentável, refinar |
| 1,5% | 7,5 | R\$1.052 | LUCRATIVO — escalar |
| 2,5% | 12,5 | R\$631 | BREAKOUT — escalar agressivo |

**Spread CAC: 12x entre pior e melhor cenário.** Mesma estrutura, mesmo CPL, decisões opostas.

**O que precisa ser feito (P0 absoluto):**
1. **Spreadsheet ou CRM com source attribution** — cada lead identificado por origem (Meta CP1, Meta CP2, Google, organic, WhatsApp orgânico)
2. **Atualização semanal** do status: novo / qualificado / meeting / negotiation / closed-won / closed-lost
3. **Upload mensal pra Meta** das offline conversions (Meta CAPI + offline_event upload)
4. **Dashboard mínimo:** CAC por canal por mês, qualif rate por canal por mês

**Bloqueador atual:** Memory cita que CRM unificado Tocks/Bretda não existe. Time vendas usa WhatsApp + planilha solta. Sem isso, **todo o resto deste estudo é fé documentada**.

---

## D. Limitações Metodológicas Desta Análise

Sou Atlas, AIOS Analyst. Trabalhei com:
- Empirical data: 90d Meta numbers fornecidos pelo user (confiáveis)
- Memory rules: 60+ feedback + project memories (point-in-time, podem estar desatualizadas)
- Frameworks teóricos: Hormozi, Wiebe, Aslam, Pittman, Kusmich, Schwartz (working knowledge, sem citação direta de page numbers)
- **Brain-bridge consultation: FAILED.** Tentei consultar 4 mind clones (pricing-strategist, copy-specialist, campaign-manager, e via search molly-pittman/nicholas-kusmich). Os 3 primeiros retornaram apenas feed dumps poluídos com conteúdo Anipis healthcare quarantine; os 2 últimos não estão registrados no consultation engine apesar de aparecerem em search.

**Implicação:** A análise é robust o suficiente pra ser ground em frameworks reconhecidos, MAS perde a calibração que advisors-real teriam dado. Confidence levels reportados em `02-decomposition.md` e `03-principles.md` refletem essa limitação.

**Recomendação ao user:** Re-rodar brain-bridge consultation após ingest novo de high-ticket marketing content (não Anipis healthcare quarantine). Memory `session_highticket_squad_08may` cita pipeline HYDRA-style que poderia ser reaproveitado, mas precisa router profile tunado pra DOMÍNIO marketing (não saúde).

---

## E. Dados Que Precisam Ser Levantados (Lista de Queries Pendentes)

Pra fortalecer este estudo, queries que NÃO rodei nesta sessão (analyst-only restriction):

1. **Bretda CP1+CP2:** breakdown leads por placement (Feed/Stories/Reels/Audience Network)
2. **Bretda CP1+CP2:** config `advantage_audience` boolean
3. **Bretda CP1+CP2:** breakdown leads por estado (SP vs RJ vs MG vs Sul vs Centro-Oeste)
4. **Bretda CP1+CP2:** demographic breakdown (age buckets 30-39 vs 40-49 vs 50-59)
5. **Bretda creative-level:** CTR + CPL por ad individual nos últimos 30d
6. **Bretda sales pipeline:** quantos dos 503 leads chegaram WhatsApp / qualified / meeting / closed
7. **Bretda CAPI status:** PR Caminho B deploy status real (memory cita "CODE READY", não deployed)
8. **CRM unificado:** existe? source attribution working? UTM consistency?
9. **Bretda Google Ads 90d:** assist+last-touch attribution
10. **Tocks PIX status:** confirmado pra poder restart?

Recomendação: spawn um Bretda-audit agent (@traffic-masters-chief ou @analyst com Meta MCP) pra responder #1-#5 em ~1h. Sales pipeline #6 exige user dropar planilha ou screenshot CRM.

---

*— Atlas, investigando a verdade*
