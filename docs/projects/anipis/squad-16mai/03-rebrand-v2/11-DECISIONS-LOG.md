# Decisions Log — Rebrand v2

**Data:** 2026-05-16
**Autor:** Uma (@ux-design-expert)
**Status:** 18 decisões fechadas + 5 pendentes user
**Próximo gate user:** D-UX-01 (Logo direction) — bloqueia produção visual

---

## A. Decisões FECHADAS (não precisam de user input)

Estas são decisões já tomadas no conclave + research + análise técnica. Documentadas para transparência e accountability.

| # | Decisão | Razão | Doc canon | Trade-off aceito |
|---|---------|-------|-----------|------------------|
| **F-01** | **3-font system** (General Sans + Inter + Fraunces Italic) | Nunito cliché wellness, demandava upgrade adulto. Inter standard mantido para UI density. Fraunces para momentos editoriais (Spiekermann) | `03-TYPOGRAPHY.md` | Bundle size +95KB (vs v1) — aceitável para retenção emocional+brand |
| **F-02** | **Phosphor Icons** como base biblioteca | MIT license, 9000 ícones, mais variants (regular/fill/duotone), menos cliché SaaS vs Lucide | `04-ICONOGRAPHY.md` | Refactor ~50 imports — feito em PR único |
| **F-03** | **4 custom icons** Anipis (flame, breath, companion, bridge) | Signature visual ownable em momentos brand-critical | `04-ICONOGRAPHY.md` | +4 SVG manter — minimal |
| **F-04** | **Motion = brand element** (não decoração) | Val Head conclave + Anadol direction. Motion co-regula sistema nervoso usuário ansioso | `05-MOTION-PRINCIPLES.md` | Mais complexidade dev — justificado |
| **F-05** | **6 motion tokens** (vs 4 v1) — adiciona `--motion-arrive`, `--motion-depart` semantic | Granularidade semântica > simplicidade arbitrária | `09-TOKENS-DRAFT.md` | +50% tokens motion mas redução geral mantém |
| **F-06** | **Prefers-reduced-motion COMPLETO** (não parcial) | Calvo charter + WCAG. Pessoa em crise vestibular não pode ter parallax | `05-MOTION-PRINCIPLES.md` | Build de fallbacks estáticos para cada ambient |
| **F-07** | **Tier 1 illustration default; Tier 3 photo restrita** | Stock photos genéricos quebram brand. Ilustração custom = ownable | `06-ILLUSTRATION-PHOTO.md` | Custo produção: ~$10 nano-banana + curadoria designer |
| **F-08** | **Voice: "você" sempre** (lint rule enforce) | Consistência brand voice nacional, não regional | `07-VOICE-REFINED.md` | Perda de "calor regional" — aceitável trade-off |
| **F-09** | **Anti-positividade tóxica** com output filter LLM | Evidência clínica: invalidação emocional piora estado depressivo/ansioso | `07-VOICE-REFINED.md` | LLM safety pipeline extra complexity |
| **F-10** | **Ethical UX Charter (10 commandments)** como gate de produto | Calvo conclave. App de SM precisa publicar postura ética. Trust signal. | `07-VOICE-REFINED.md` + `10-BRANDBOOK-V2.md` | Algumas features de "engagement clássico" banidas (streaks) — aceito custo de "retention worse" |
| **F-11** | **Mood colors SEPARADAS de crisis colors** (zero overlap hex) | Bug v1: mood-3 e crisis-yellow eram ambos `#D4960C`. Confusão entre "neutro" e "atenção" perigosa | `02-COLOR-SYSTEM.md` | Adiciona 2 hex novos no token set |
| **F-12** | **Mood colors dessaturadas** (sem vermelho/laranja alerta) | Don Norman conclave: violência emocional para user já sofrendo. Dignidade visual igual | `02-COLOR-SYSTEM.md` | "Conversão" visual diferente do que outros apps (Headspace usa cores saturadas) |
| **F-13** | **Multi-theme estrutural** (3 themes, theme switcher) | Júlia persona uso noturno conflita com warm coral. Solução híbrida vs warm-only | `02-COLOR-SYSTEM.md` | +complexidade implementação, +bem-estar usuário |
| **F-14** | **AAA target em crisis screens** (não só AA) | Vida em jogo + capacidade cognitiva reduzida em crise = margem extra | `10-BRANDBOOK-V2.md` §12 |  |
| **F-15** | **Token reduction 130 → 70** (Rams consolidation) | Catálogo é diferente de minimalismo. v2 reduz radius/shadows/shades para excelência por token | `09-TOKENS-DRAFT.md` | Refactor extensivo de componentes existentes |
| **F-16** | **Logo: 3 direções para test** (não pular para 1) | Risco alto fechar logo sem testar — brand fundamental. User decide | `01-LOGO-DIRECTIONS.md` | +1 semana ciclo decisão vs decisão direta |
| **F-17** | **Adolescent track P5 (André) EXCLUÍDO do MVP** | CFM 2.454/2026 + parental consent + safeguards extras = 6-8 semanas adicionais. CFM ago/2026 window pressiona | `02-deliverables/08-ux-design-expert.md` §3 P5 |  |
| **F-18** | **Container chat max-width 480px** (intimidade conversa) | Pesquisa: interfaces conversa estreitas são percebidas mais íntimas | `08-COMPONENT-PREVIEWS.md` Mockup 1 |  |

---

## B. Decisões PENDENTES user (5 — bloqueiam fases seguintes)

### D-UX-01 — Logo direction final

**Pergunta:** Qual das 3 direções do logo aprovar para produção?

**Opções:**
- **D1 Mythological** — Espiral logarítmica precisa, etymology grega honesta
- **D2 Aurora Arc** — Arco horizonte com gradient amanhecer
- **D3 Breathing Form** — Forma orgânica que respira (motion-as-brand) — **Recomendação Uma**
- **Frankenstein** — User pode pedir mix de elementos (ex: D3 forma + D1 espiral interna)

**Bloqueia:**
- Produção de logo (PNG/SVG) via Flux ou designer
- Favicon, app icon (PWA + iOS + Android), splash screen
- Token `--logo-svg-path` no design system
- Materiais marketing (LP hero, social media)

**Deadline informal:** 2026-05-25 (consolidação para CFM window aug/2026)

**Default Uma se zero resposta:** D3 Breathing Form (alinha motion principle + ownable + reduced-motion graceful)

**Trigger para destravar:** "aceito direção D1/D2/D3 logo anipis" (ou "frankenstein: ...")

---

### D-UX-02 — Theme primário do launch

**Pergunta:** Como configurar themes no MVP?

**Opções:**
- **A) Warm only** — sem theme switcher MVP. Calm + Soft viram fase 2 roadmap
- **B) Multi-theme com Warm default + Calm + Soft opt-in via Settings** — **Recomendação Uma**
- **C) Multi-theme sem default** — primeira sessão pergunta ao user qual escolher
- **D) Custom mix** — outra configuração

**Bloqueia:**
- Implementação `design-tokens-v2.css` (com todos os 3 themes ou só Warm)
- Theme switcher component (ou ausência)
- Migration v1 → v2 strategy

**Default Uma se zero resposta:** B (Multi-theme com Warm default) — fase 2 já incluída em MVP marginal extra complexity

**Trigger:** "aceito multi-theme anipis A/B/C" ou "warm only"

---

### D-UX-03 — Fraunces Italic sim/não

**Pergunta:** Confirmar Fraunces Italic como 3ª fonte (uso 5-10% em pull-quotes / momentos voz Anipis)? Ou só General Sans + Inter (2 fonts)?

**Opções:**
- **A) 3 fonts (General Sans + Inter + Fraunces Italic)** — recomendação Uma + Spiekermann
- **B) 2 fonts (General Sans + Inter) only** — simplifica build, perde "momento editorial"
- **C) 3 fonts mas com fonte serif alternativa** (Lora? Source Serif 4?)

**Bloqueia:**
- Download/setup das fontes em `apps/serenity-ai/public/fonts/`
- Componente `<PullQuote>`
- Componente `<EmptyState>` (usa italic em title)
- Welcome message no chat (italic)

**Default Uma se zero resposta:** A (3 fonts) — uso muito raro mas momento ritualístico significativo

**Trigger:** "aceito 3 fonts anipis" ou "só 2 fonts"

---

### D-UX-04 — "Caixinha de Cartas" feature

**Pergunta:** Feature proposta por Don Norman no conclave — ao final de cada sessão, Anipis "escreve uma carta curta" (1 frase em Fraunces Italic) que fica guardada. User pode revisitar suas cartas em momentos difíceis. Continuidade emocional sem gamification.

**Opções:**
- **A) MVP** — implementar já no launch
- **B) Roadmap fase 2** — validar antes com user research (5 entrevistas Júlia) — **Recomendação Uma**
- **C) Descartar** — não é necessário, mood log já é continuity tracking

**Bloqueia:**
- Schema Supabase: tabela `letters` (id, user_id, content, created_at)
- Componente `<LettersList />` em settings
- Trigger logic backend (quando "fechar sessão"?)
- Voice/copy templates para 100+ cartas iniciais

**Default Uma se zero resposta:** B (Roadmap) — adicionar antes de validar é over-engineering

**Trigger:** "aceito caixinha cartas MVP/roadmap/descarta"

---

### D-UX-05 — Re-render Flux visual após escolha logo

**Pergunta:** Após D-UX-01 decidido, fazer renders visuais (Flux/Stitch) das 3 telas críticas (ChatWindow, HeroPage, MoodCheckIn) em **dois themes** (Warm + Calm) — total 6 renders?

**Opções:**
- **A) Sim, 6 renders** — para alinhar visual com Breno antes de codar
- **B) Sim, mas só 3 renders (theme Warm only)** — economiza custos, theme switcher é decisão visual mas não estrutural
- **C) Pular renders, ir direto para code** — economiza tempo e $$, mas risco de "não é o que eu imaginava"

**Custos:**
- Flux: 6 renders × $0.30 = ~$1.80
- Stitch: ~$0 (free tier) mas qualidade menor
- nano-banana-2: 6 renders × $0.30 = ~$1.80

**Default Uma se zero resposta:** B (3 renders Warm only)

**Trigger:** "aceito 6/3/0 renders flux anipis"

---

## C. Decisões REJEITADAS (documentadas para histórico)

Decisões consideradas mas explicitamente NÃO adotadas:

| # | Decisão considerada | Razão da rejeição |
|---|---------------------|-------------------|
| R-01 | Manter Nunito (v1) | Cliché wellness + infantilização adulta detectada |
| R-02 | Adicionar Helvetica Neue ou SF Pro | Standard demais, zero diferenciação |
| R-03 | Lucide Icons mantido | Phosphor traz variants + menos cliché SaaS |
| R-04 | Logo "chama suave" (v1 §2.1 proposta) | Anti-cliché test failed — uma das primeiras 5 ideias óbvias |
| R-05 | Streaks/badges visíveis | Ethical UX Charter blocker — shame loops |
| R-06 | Push notifications "como você está hoje?" | Calvo: interruption-driven engagement amplifica ansiedade em momento errado |
| R-07 | Marketplace de terapeutas no MVP | Out of scope — pivot CFM ago/2026 |
| R-08 | Mood scale com 5 botões discretos | Don Norman: emoções são contínuas. Slider contínuo melhor |
| R-09 | Vermelho/laranja saturado em mood-1/mood-2 | Don Norman: violência emocional para user já sofrendo |
| R-10 | Background gradient genérico v1 | Refika Anadol: usar generative mood-aware ou cor sólida — não gradient fraco |
| R-11 | Onboarding com cadastro de 5 telas antes da 1ª conversa | Júlia persona pain point — friction massiva |
| R-12 | Voice "tu" para usuários sulistas | Brand voice nacional única |
| R-13 | "Anipis está aqui" (3ª pessoa) | Quebra entidade — 1ª pessoa "Estou aqui" |
| R-14 | Disclaimer escondido em submenu | Charter commandment 8: SEMPRE visível |

---

## D. Decisões PARA REVIEW periódico (quarterly)

Decisões que devem ser revisitadas a cada 90 dias após launch:

| # | Decisão | Quando revisitar | Por quê |
|---|---------|------------------|---------|
| P-01 | Ethical UX Charter completa | Q+1 após launch | Validar se commandments seguram em prática real |
| P-02 | Default theme (Warm) | Q+1 | Analytics: qual theme user mais usa? Maybe Calm vira default |
| P-03 | Fraunces Italic uso % | Q+1 | Se uso ficar abaixo de 1% das telas, considerar deprecar 3ª fonte |
| P-04 | Output filter LLM banned phrases | Q+1 | Update lista conforme aprendizado |
| P-05 | Custom icons set (4) | Q+2 | Verificar se algum precisa adicionar (ex: anipis-letter para caixinha cartas) |
| P-06 | Token reduction (~70 tokens) | Q+2 | Pode reduzir mais? Ou faltou algum essencial? |
| P-07 | Adolescent track P5 | Q+3 | Status CFM 2.454/2026 + parental consent flow research |

---

## E. Process de approval

Para decisões pendentes ficarem **fechadas**, user precisa responder explicit:

1. **Single trigger:** `"aceito {decisão}"` ou `"opção X"`
2. **Bulk approval:** `"aceito tudo padrão Uma"` → aprova A em D-UX-01 (D3) + B em D-UX-02 (multi-theme) + A em D-UX-03 (Fraunces sim) + B em D-UX-04 (Caixinha roadmap) + B em D-UX-05 (3 renders Warm)
3. **Per-decision override:** user pode dar trigger separado para cada uma
4. **Pause:** `"pausa decisões anipis"` — congela todas até reabertura explícita

Após approval, owner (Uma + @dev + @data-engineer conforme caso) destrava produção. **NÃO MERGE/COMMIT** antes de approval.

---

*Uma — UX Design Expert · 2026-05-16*
*"Toda decisão registrada salva uma sessão futura de re-debate."*
