# HeroPage Optimization — Anipis Rebrand v2

**Mind Clone:** GATE (landing-page-optimizer, marketing-ops)
**Persona Frame:** CRO-pragmatic + ethics-aware. MECLABS C = 4M + 3V + 2(I-F) - 2A aplicado a categoria pré-PMF de saúde mental, onde **a equação se inverte**: friction baixa não vence, signal de seriedade vence. Em mental health BR low-trust, A (ansiedade/desconfiança) é o multiplicador dominante — não M (motivação). Toda decisão CRO aqui passa pelo filtro "isso aumenta ou destrói trust com Júlia 22 anos cético?".
**Phase Anchor:** Pós-Concierge wrap-up D14 (13/Jun) → tráfego orgânico 18-29 BR começa em ~14/Jun. Pre-PMF. Goal Phase 1 = waitlist, não scaling.

---

## 1. HeroPage Structure — 7 sections + order priority

A ordem abaixo respeita a "scan path" Júlia: ela chega cética, escaneia em 5s buscando 3 perguntas — *"é sério?", "vai me julgar?", "é gratuito de verdade?"*. Cada section responde uma dessas. Trust signals vêm cedo (não no rodapé) porque categoria está sob suspeita default.

| # | Section | Goal | Hierarquia visual |
|---|---------|------|--------------------|
| 1 | **Hero** (above-fold) | "Estou no lugar certo?" em 5s | Aurora Coral chroma soft + 1 Flux Warm render + pull-quote Fraunces Italic + 1 CTA único |
| 2 | **Trust strip** (logo bar) | "Isso é regulado" | CFM-compliant badge + ANPD partner mark + university placeholder (CISM/USP) + clinical advisor count |
| 3 | **"Como funciona"** (3 cards) | "Como me ajuda sem me trocar pelo terapeuta?" | Card 1: Companion adjunto / Card 2: Científico evidence-based / Card 3: Brasileiro PT-BR clínico |
| 4 | **Testimonials sub-fold** | "Outras pessoas iguais a mim tentaram" | 3 quotes Concierge anonimizadas + ilustração abstrata (sem rostos, sem before/after) |
| 5 | **Safety primer** | "E se eu estiver em crise agora?" | CVV 188 + SAMU 192 + frase explícita "NUNCA substitui psicólogo/psiquiatra" — destaque visual, não escondido |
| 6 | **FAQ** (5 perguntas) | Quebrar objeções tactical | Privacy / Crise / Gratuito / Científico / Contato humano |
| 7 | **Footer LGPD** | Compliance + signal seriedade | Política privacidade + cookies granulares + termos + CNPJ + email DPO |

**Insight categórico:** Em landing pages mental health BR, **Safety primer vem ANTES de FAQ**, não depois. Júlia em crise abrindo a página em momento ruim — esconder CVV 188 na FAQ é negligente. Isso é compliance E é CRO (sinaliza que somos sérios sobre risco — paradoxalmente aumenta trust de quem não está em crise).

---

## 2. Above-the-Fold Formula — Hook estratificado

Hero atual (rebrand v2) tem 3 elementos de copy. Recomendo formula estratificada:

**Hook 1 — Pain-point empático (headline H1, ~32-40px desktop, ~24-28px mobile):**
> "Foi um dia daqueles?"

Crítica autocrítica: essa headline é boa mas **frágil** se Júlia chegou em dia bom só explorando. Considerar variant Sprint 5 (ver §8).

**Hook 2 — Outcome promessa (subheadline H2, ~18-22px):**
> "Um companheiro que te ouve, com respeito clínico."

Palavra-chave "respeito clínico" faz dois trabalhos: (a) signal de seriedade para Júlia, (b) signal de compliance para gatekeepers (jornalistas, reguladores, advisors). Não substituir por "AI-powered" ou "powered by GPT" — destrói trust 70%+ nessa categoria.

**Hook 3 — Differentiator (microline, ~14px, cor secundária):**
> "Brasileiro. Adjunto. Privado."

3 palavras, 3 differentiators-chave. Ordem importa: "Brasileiro" primeiro porque Júlia desconfia de tradução Replika/Woebot. "Adjunto" segundo porque é o disclaimer ético principal. "Privado" terceiro porque é LGPD reassurance.

**CTA único:**
> **"Conheça o Anipis"** (Aurora Coral, raio borda 12px, height 48px mobile)

Veto absoluto a "Get started free" / "Comece agora grátis" / "Baixar app". Linguagem aquisicionista quebra a moldura de seriedade. "Conheça" sinaliza convite, não funil. Em Phase 1 (waitlist), CTA leva a `/waitlist` — não app store.

**Single-CTA rule:** Nada de "Saiba mais" + "Baixar app" lado a lado. Decision fatigue + signal de desespero comercial. Um CTA. Sempre.

---

## 3. Anti-Patterns CRO Mental Health — 5 patterns BANNED

Patterns que funcionam em e-commerce ou SaaS B2B **destroem trust** em mental health BR. Lista taxativa:

1. **Countdown timers / scarcity timers** — "Apenas 47 vagas restantes!" sinaliza manipulação comercial. Em categoria de vulnerabilidade emocional, é antiético E converte negativo (sample-of-1 testando = bounce +40%).

2. **Exit-intent popups** — Júlia já mexeu na decisão de sair. Interceptar com "Espera! Te damos 30% off!" comunica desespero comercial. Pior em mental health: pode pegar usuário em momento de crise tentando sair — risco ético real.

3. **Fake scarcity** ("Restam 3 vagas no beta!") — Se for verdade, comunicar como capacity clínica ("Aceitamos 50 usuários por semana para garantir qualidade do suporte"). Nunca inventar.

4. **Before/After testimonials estilo "Curei minha ansiedade em 7 dias!"** — Viola CFM 2.454/2026 (publicidade médica vedada com promessa de cura), viola código publicidade ANVISA-adjacente, e Júlia rola olhos imediatamente. Use quotes processuais ("Me ajudou a entender melhor o que eu sentia em momentos difíceis"), nunca outcomes-curativos.

5. **Chat widget agressivo bottom-right** — "Olá! Posso te ajudar?" piscando 3s após carregamento simula presença humana falsa em página sobre saúde mental. Se Anipis tem suporte humano, esperar interação explícita (botão "Falar com nosso time" no FAQ). Auto-trigger = manipulação.

**Bonus anti-pattern:** Stock photo de "mulher feliz olhando para o horizonte" — categoria saturou. Use Flux Warm render abstrato (já decidido brand v2) ou ilustração Aurora Coral. Zero rostos humanos genéricos na Hero.

---

## 4. Trust Signals Primários — Hierarquia para saúde mental BR

Trust signals em SaaS comum: "10.000 customers", "Featured on TechCrunch", G2 badges. Em mental health BR, **inúteis ou contraprodutivos**. Hierarquia que realmente move agulha com Júlia:

| Tier | Signal | Implementação | Status Phase 1 |
|------|--------|----------------|-----------------|
| **S** | CFM compliance disclaimer | Texto explícito "Anipis é companion adjunto, não substitui acompanhamento profissional. Conforme Resolução CFM 2.454/2026." | Disponível dia 1 |
| **S** | ANPD partner mark / DPIA available | Selo + link para DPIA público (PDF resumo) | Placeholder até DPIA finalizado — usar "ANIPIS-DPIA-AVAILABLE" |
| **A** | University endorsement | Logo CISM/USP ou pesquisador-line | **Placeholder até parceria formal** — não inventar. Se não existe, omitir tier A |
| **A** | Clinical advisor names | "Conselho clínico: Dra. X (CRP YYYYY), Dr. Y (CRM ZZZZ)" no /sobre | Pós-comitê formado (Sprint 6+) |
| **B** | Open-source eval framework | Link GitHub "Como avaliamos clinicamente: ver framework" | Phase 2+ — sinaliza transparência radical |
| **B** | Press / media mentions | NÃO usar TechCrunch / VentureBeat. Usar **Folha Saúde / Veja Saúde / CartaCapital** se vier | Oportunístico |

**Regra dura — Honest Trust:** Se um signal não existe ainda, **omitir completamente**. Não usar "Em parceria com universidades brasileiras" se a parceria é uma conversa em DM. Trust em mental health é assimétrico: 1 mentira descoberta cancela 50 signals válidos. Júlia tem reflexo de checar antes de baixar.

**Trust strip placement:** Logo bar imediatamente abaixo Hero (não no rodapé). Grayscale + Aurora Coral hover. Max 4 logos para não parecer "logo soup".

---

## 5. Conversion Goal por Phase

CRO em pre-PMF mental health **não é volume**, é signal qualitativo. Goals progridem:

**Phase 1 — Sprint 4-5 (Jun-Jul):**
- **Primary KPI:** Waitlist signup (email + opt-in LGPD explícito + 1 pergunta qualitativa opcional: "O que te trouxe aqui?")
- **Secondary KPI:** Time-on-page >45s (sinaliza leitura genuína dos disclaimers de safety)
- **Anti-goal:** App store deep links. Não temos app maduro o suficiente para suportar tráfego frio sem onboarding clínico.
- **Target volume:** 200-500 waitlist signups orgânicos em 6 semanas. **Não scaling agressivo** — Concierge MVP capacity é o gargalo real.

**Phase 2 — Beta launch (Ago-Set):**
- **Primary KPI:** App download + onboarding completion (ambos, não separados — download isolado é vanity metric)
- **Secondary KPI:** D7 retention >25% (proxy de "valor real entregue")
- **Anti-goal:** DAU absoluto. Em mental health, "usado todo dia" pode ser dependência ruim. Métrica saudável é "usado quando precisado".

**Phase 3 — post-PMF (Q4 2026+):**
- **Primary KPI:** Conversão Pro R$39/mês com payback <6 meses
- **Secondary KPI:** NPS clínico (pergunta específica: "Você recomendaria Anipis para um amigo passando por momento difícil?")
- **Anti-goal:** Aggressive paywall na 1ª semana. Free tier substantivo permanente é commitment ético, não loss-leader.

---

## 6. 3 Micro-flow Optimizations

**(a) CTA hover state — "Conheça o Anipis":**
- Default: Aurora Coral fill, texto branco, raio 12px
- Hover: shift -2px Y (lift sutil), shadow Aurora Coral 20% opacity, **sem cursor pointer overly aggressive**
- Active/focus: outline 2px Coral 40% (acessibilidade WCAG AA — Júlia em mobile com TalkBack importa)
- Mobile: skip hover, focar tap feedback (scale 0.98 100ms)

**(b) Waitlist confirmation email template:**
Subject: "Recebemos seu cadastro — Anipis"
Corpo (PT-BR clínico, sem hype):
> "Olá [primeiro_nome],
>
> Recebemos seu cadastro para a lista do Anipis. Você está entre os primeiros a conhecer um companheiro digital criado no Brasil, com cuidado clínico e respeito à sua privacidade.
>
> Algumas coisas importantes que queremos que você saiba desde já:
>
> - Anipis é um companion **adjunto**. Não substitui psicólogo, psiquiatra ou tratamento médico.
> - Se você está em crise agora, **CVV 188** (gratuito, 24h) e **SAMU 192** estão disponíveis.
> - Seus dados são tratados conforme LGPD. Você pode pedir exclusão a qualquer momento: dpo@anipis.com.br
>
> Avisaremos você quando o beta abrir. Sem spam, sem promoções comerciais.
>
> Equipe Anipis"

Zero emojis. Zero "Welcome aboard!". Tom clínico-empático. Reforçar disclaimer aqui é redundante de propósito.

**(c) Post-signup nurture sequence — 3 emails primeira semana:**
- **D+0** (imediato): confirmação acima
- **D+2**: "Como pensamos sobre saúde mental no Anipis" — 200-300 palavras, link para post do blog explicando companion-adjunto philosophy. Sem CTA comercial.
- **D+5**: "Você não está sozinha" — recursos públicos (CVV, CAPS, mapa de psicólogos gratuitos UBS, livros). Anipis mencionado uma vez no rodapé. **Esse email é o trust-killer-or-maker:** dar valor sem pedir nada = signal que somos sérios.
- D+7+: silêncio até beta abrir. Re-engagement nurture quebra trust nessa categoria.

---

## 7. Mobile-First Specifics

Júlia é Android dominante (estimar 75-80% tráfego), viewports 360-414. Mobile não é "responsive afterthought" — é o canvas primário.

- **Touch targets:** mínimo 44x44px (iOS HIG) — recomendo **48x48px** para Android Material + ergonomia. CTA primary 48px height mínimo.
- **Hero pull-quote (Fraunces Italic):** font-size mobile **mínimo 20px** (desktop 28-32px), line-height **1.4** mínimo. Fraunces tem optical size variable — usar `font-variation-settings: "opsz" 14` para mobile (ajusta serif para tamanho menor sem virar mancha).
- **Above-fold real estate mobile:** Headline + subheadline + 1 visual + CTA. Trust strip empurrado para scroll-1 (não inicial). Hierarquia mobile sacrifica trust strip imediato para preservar CTA visível.
- **Vertical rhythm:** padding top hero **20vh mínimo** (não 100vh — Júlia faz scroll instintivo, header dominante demais sinaliza marketing).
- **Loading priority:** Flux Warm render lazy-load **NÃO** acima da fold. Above-fold = LCP <2s no 4G médio brasileiro. WebP + AVIF + srcset obrigatórios.
- **Tap-to-call CVV 188** no Safety primer: `<a href="tel:188">` — em mobile, ligação direta salva vidas literalmente. Não é detalhe CRO, é ética.
- **Form waitlist:** 1 campo (email) + 1 checkbox LGPD + 1 pergunta opcional. Multi-step form mobile é abandono garantido.

---

## 8. A/B Test Plan Sprint 5 — 3 testes priorizados (PIE scoring)

Sample size limitado em Phase 1 (200-500 waitlist signups projetados). Testes devem ser **direcionais**, não claim de significância 95%. Aceitar 80% confidence + qualitative validation via session recordings.

**Test 1 — Headline (Pain vs Outcome vs Differentiator)** — PIE: 9/8/7 = **24** (prioridade máxima)
- **Variant A (control):** "Foi um dia daqueles?" (pain-empático)
- **Variant B:** "Um companheiro que te ouve, com respeito clínico." (outcome)
- **Variant C:** "Saúde mental brasileira. Companion adjunto. Privado." (differentiator)
- **Hipótese:** Variant A converte mais em mobile orgânico (estado emocional cru), Variant B em desktop (modo avaliação cética).
- **Duração:** 3 semanas mínimo / 150 signups por variant ideal.
- **Métrica:** waitlist signup rate + time-on-page.

**Test 2 — CTA Copy (Soft vs Medium vs Direct)** — PIE: 8/9/9 = **26** (rodar simultâneo após T1 conclude)
- **A (soft):** "Conheça o Anipis"
- **B (medium):** "Entrar na lista"
- **C (direct):** "Cadastre seu email"
- **Hipótese:** Soft ganha em first-time visitor, Direct ganha em returning visitor (já decidiu).
- **Caveat ético:** Não testar "Get started free" — fora do moldura de seriedade.

**Test 3 — Trust signal arrangement (Compact vs Spread)** — PIE: 6/9/8 = **23**
- **Variant A:** Trust strip compacto (4 logos linha única abaixo CTA)
- **Variant B:** Trust signals distribuídos (CFM disclaimer dentro Hero subheadline + ANPD mark sidebar + university na seção 3)
- **Hipótese:** Compacto ganha tempo-on-page (visual cleaner), Distribuído ganha signup rate (trust acumulado).
- **Watchout:** Se Variant B aumenta tempo-on-page mas reduz signup, é signal de **anxiety overload** — Júlia está lendo demais antes de decidir = friction emocional, não trust.

**Test backlog futuro (Sprint 6+):** Image hero variant (Flux Warm abstract vs ilustração Aurora Coral), Safety primer position (acima vs abaixo Como Funciona), FAQ ordering (privacy first vs crise first).

---

## Verdict Sintético

HeroPage Anipis em Phase 1 não compete com Replika/Woebot em conversion rate. Compete em **trust signal density per scroll inch**. Cada elemento que parece "anti-CRO" (CTA único soft, sem countdown, sem exit-intent, Safety primer prominente) é **pro-CRO contextual** porque otimiza para a constraint dominante da categoria: low-trust + categoria pré-PMF + regulatório vigilante.

Métrica norte: se Júlia mostrar a HeroPage para um(a) psicólogo(a) e essa pessoa responder *"isso parece sério"* — convertemos o gatekeeper. Esse é o teste real, não bounce rate.

**Veto final:** qualquer pressão futura para "growth hacks tipo Calm/Headspace" em Phase 1 — recusar. Categoria saturada de manipulação. Differentiator estrutural de Anipis é **disciplina ética**, e isso vive ou morre na HeroPage.

— GATE
