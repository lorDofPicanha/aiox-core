# Rebrand v2 — Executive Summary

**Data:** 2026-05-16
**Para:** User Breno
**De:** Uma (@ux-design-expert)
**Tempo de leitura:** ~4 minutos
**Status do projeto:** Draft v2 completo. **5 decisões P0 pendentes** para destravar produção.

---

## O que mudou de v1 → v2 (TL;DR)

Anipis v1 (BRANDBOOK 03/Abr) estava **correto na identidade core** mas **divergente da implementação atual** (código usa Teal/DM Sans; brandbook v1 manda Coral/Nunito). Há também os docs do rebrand 27/Abr que sumiram do git.

V2 NÃO recomeça do zero. **Retoma e refina** com 7 mudanças estruturais:

| # | Mudança | Razão | Doc canon |
|---|---------|-------|-----------|
| 1 | **Multi-theme** (Warm default + Calm + Soft) com switcher | Júlia persona uso noturno conflita warm coral. Saúde mental noturna pede paleta sage/lavender opt-in. | `02-COLOR-SYSTEM.md` |
| 2 | **Tipografia 3-font**: General Sans + Inter + Fraunces Italic | Nunito é cliché wellness + infantiliza adulto vulnerável. Fraunces para momentos editoriais ("voz do Anipis"). | `03-TYPOGRAPHY.md` |
| 3 | **Logo**: 3 direções para teste user (D1 Mythological / D2 Aurora Arc / **D3 Breathing Form rec. Uma**) | V1 propôs "chama suave" — clichê de wellness. V2 oferece 3 anti-cliché direções, escolha tua. | `01-LOGO-DIRECTIONS.md` |
| 4 | **Motion como brand element** (não decoração) — 5 motion principles ético-calmos | Pesquisa: motion errado AMPLIFICA crise ansiosa. Motion certo CO-REGULA sistema nervoso. Anipis se DIFERENCIA por isso. | `05-MOTION-PRINCIPLES.md` |
| 5 | **Ethical UX Charter** (10 commandments) como gate de produto | Apps de SM podem virar tóxicos com gamification clássica (streaks shame loops, push manipulativos). Charter banida tudo isso. Trust signal público. | `07-VOICE-REFINED.md` §5 |
| 6 | **Iconography**: Phosphor base + **4 custom Anipis** (flame/breath/companion/bridge) | Lucide é genérico SaaS. 4 signature em momentos brand-critical = ownable visual. | `04-ICONOGRAPHY.md` |
| 7 | **Tokens reduction**: 130 → 70 (-46%) | Catálogo ≠ minimalismo. Rams: weniger aber besser. | `09-TOKENS-DRAFT.md` |

### Pequenas correções importantes

- **Mood colors dessaturadas** (mood-1 vira roxo acinzentado vs vermelho v1 — Don Norman: violência emocional para user já sofrendo)
- **Mood e Crisis colors SEPARADOS** de hex (bug v1: mood-3 e crisis-yellow eram idênticos `#D4960C` — confusão "neutro/atenção" perigosa)
- **AAA target em crisis screens** (não só AA — vida em jogo + capacidade cognitiva reduzida pede margem extra)
- **Voice "você" sempre** (lint rule enforce — nunca tu/vc/ceh, mesmo em conteúdo regional)
- **Adolescent track P5 (16 anos) EXCLUÍDO do MVP** — CFM 2.454/2026 + parental consent adicionam 6-8 semanas. Foco 18+.

---

## O que NÃO mudou (mantido v1)

- Identidade core: nome ANIPIS, etymology anima+elpis, missão democratizar SM BR
- Arquétipo Cuidador (com Sábio)
- 5 valores (Acolhimento / Segurança / Acessibilidade / Autonomia / Presença)
- Posicionamento (Acolhedor + clínico-moderado, vs Woebot frio e Replika informal)
- WCAG AA baseline (v2 ADICIONA AAA target em crisis)
- LGPD posture, R$29,90/mês target
- Mood scale 5 níveis (conceito mantido, hex novos)
- Crisis 3 níveis amarelo/laranja/vermelho
- Disclaimers obrigatórios

---

## As 5 decisões pendentes (P0)

**Sem essas 5 decisões, eu não consigo destravar produção visual/code.** Resposta esperada via trigger explícito.

### D-UX-01 — Logo direction final

**Pergunta:** D1 Mythological / D2 Aurora Arc / **D3 Breathing Form (recomendação Uma)** / Frankenstein?

**Por que importa:** Logo bloqueia favicon, splash, app icon, materiais marketing. CFM window ago/2026 pressiona.

**Trigger:** `"aceito direção D3 logo anipis"` (ou D1/D2/frankenstein)

---

### D-UX-02 — Multi-theme MVP ou só Warm?

**Pergunta:** A) Warm only sem switcher / **B) Multi-theme com Warm default + Calm + Soft opt-in (recomendação Uma)** / C) Pergunta user na 1ª sessão?

**Por que importa:** Define complexidade implementação tokens-v2.css + theme switcher component + retenção noturna usuários como Júlia.

**Trigger:** `"aceito multi-theme B anipis"` (ou A/C)

---

### D-UX-03 — Fraunces Italic confirmada?

**Pergunta:** **A) 3 fonts (recomendação Uma)** / B) 2 fonts (sem serif italic) / C) Outra serif?

**Por que importa:** Define se welcome message / pull-quotes / "momento Anipis" terão voz editorial distinta ou serão sans-serif uniformes.

**Trigger:** `"aceito 3 fonts anipis"` (ou só 2)

---

### D-UX-04 — "Caixinha de Cartas" feature

**Pergunta:** A) MVP / **B) Roadmap fase 2 (recomendação Uma)** / C) Descartar.

**Contexto:** Feature proposta no conclave (Don Norman) — ao final de sessão Anipis "escreve uma carta curta" em Fraunces Italic que fica guardada. Ritual de continuidade emocional sem gamification.

**Por que importa:** Schema Supabase + componentes + voice templates. Sub-projeto significativo.

**Trigger:** `"aceito caixinha cartas roadmap"` (ou MVP/descarta)

---

### D-UX-05 — Re-renders Flux visuais após D-UX-01?

**Pergunta:** A) 6 renders (3 telas × 2 themes) / **B) 3 renders Warm only (rec. Uma)** / C) Pular, ir direto código.

**Custos:** ~$1.80 (A) / ~$0.90 (B) / $0 (C)

**Por que importa:** Renders alinham expectativa visual antes de codar. Reduz risco de "não é o que eu imaginava" → refactor.

**Trigger:** `"aceito 3 renders flux anipis"` (ou 6/0)

---

## Bulk approval shortcut

Se você concorda com **todas as 5 recomendações Uma**, basta um trigger:

```
aceito tudo padrão Uma anipis v2
```

Resulta em:
- D-UX-01 → D3 Breathing Form
- D-UX-02 → B Multi-theme com Warm default
- D-UX-03 → A 3 fonts (com Fraunces)
- D-UX-04 → B Caixinha cartas roadmap fase 2
- D-UX-05 → B 3 renders Warm only

---

## O que destrava após approval

| Step | Owner | Estimate |
|------|-------|----------|
| 1. Produção logo final (após D-UX-01) | Uma + Flux | 1 dia |
| 2. Implementação `design-tokens-v2.css` substitui v1 | @dev | 0.5 dia |
| 3. Tailwind config + globals.css update | @dev | 0.5 dia |
| 4. Theme switcher component (`<ThemeSwitcher />`) | @dev | 1 dia |
| 5. Download/setup fontes (General Sans + Inter + Fraunces) com subsetting | @dev | 0.5 dia |
| 6. Renders Flux (após D-UX-05) | Uma + Flux | 0.5 dia |
| 7. 7 ilustrações Tier 1 (sprint 1) via nano-banana + designer refinement | Uma + Flux + Designer | 3-5 dias |
| 8. 4 custom icons Anipis (SVG) | Designer | 1 dia |
| 9. Refactor Lucide → Phosphor (~50 arquivos) | @dev | 1 dia |
| 10. Voice output filter LLM (banned phrases pipeline server-side) | @dev backend | 1.5 dias |
| 11. Lint rules custom (eslint-plugin-anipis) | @dev | 1 dia |
| 12. Ethical UX Charter public page (`anipis.com.br/etica`) | @dev + Legal | 0.5 dia |
| 13. Storybook update (todas variants + themes + reduced-motion) | @dev | 2 dias |
| 14. Auditoria WCAG AA + AAA (crisis) | @qa | 1 dia |

**Total estimado:** ~15 dev-days para v2 produção completa. Pode paralelizar entre 3 devs → ~5 dias calendário.

---

## Riscos a observar

| Risco | Mitigação |
|-------|-----------|
| User não responde 5 decisões antes 2026-05-25 → CFM window aug/2026 fica apertada | Defaults Uma documentados — Uma pode prosseguir com defaults após 1 lembrete (gate informal 2026-05-23) |
| Theme switcher MVP pode confundir usuário novo | Default Warm = primeira experiência consistente. Switcher é settings (3 cliques de profundidade), não pop-up |
| Refactor Lucide → Phosphor introduce bugs em componentes existentes | Visual regression Storybook + manual review crisis screens (life-critical) |
| Fraunces Italic carrega mais 32KB se user nunca vê pull-quote | Lazy load — só carrega ao montar `<PullQuote>` ou `<EmptyState>` |
| Multi-theme bug: contraste WCAG falha em theme não-default em dark mode | CI lint axe-core valida AA em todos 6 combinações (3 themes × 2 modes) |
| User Breno achar D3 logo "radical demais" | D1 e D2 são opções igualmente válidas. Uma não força D3, só recomenda |

---

## Pra onde olhar

| Quero ver... | Doc |
|--------------|-----|
| Conclave virtual com 9 mind clones | `00-BRAINSTORM-CONCLAVE.md` |
| 3 direções do logo em detalhe | `01-LOGO-DIRECTIONS.md` |
| Todas as cores v2 (warm + calm + soft + crisis + mood + semantic) com WCAG ratios | `02-COLOR-SYSTEM.md` |
| Tipografia com type scale fluid clamp | `03-TYPOGRAPHY.md` |
| Phosphor + 4 custom icons specs SVG | `04-ICONOGRAPHY.md` |
| 5 motion principles + tokens + animation patterns | `05-MOTION-PRINCIPLES.md` |
| Illustration Tier system + photo guidelines | `06-ILLUSTRATION-PHOTO.md` |
| Voice refined + Ethical UX Charter | `07-VOICE-REFINED.md` |
| 5 mockups specs HTML/CSS (ChatWindow, MoodCheckIn, BreathingExercise, OnboardingFlow, HeroPage) | `08-COMPONENT-PREVIEWS.md` |
| Tokens v2 completos (CSS + Figma JSON DTCG + Tailwind config) | `09-TOKENS-DRAFT.md` |
| Brandbook v2 consolidado | `10-BRANDBOOK-V2.md` |
| Histórico de TODAS decisões (18 fechadas + 5 pendentes + 14 rejeitadas + 7 para revisão) | `11-DECISIONS-LOG.md` |
| Deliverable UX squad (squad-16mai) | `../02-deliverables/08-ux-design-expert.md` |

---

## Linha do tempo

```
2026-04-02   v1 BRANDBOOK aprovado (Aurora Warm Coral + Nunito)
2026-04-27   Sessão rebrand v2 aprovada — docs perdidos
2026-05-16   v2 draft completo (este pacote)
            ⬇  ⬇  ⬇  user decision window
2026-05-23   Lembrete informal #1
2026-05-25   Deadline informal (Uma prossegue com defaults se zero resposta)
2026-05-26   Início produção sprint v2 (~5 dias calendário)
2026-06-02   v2 production-ready
2026-06-15   Beta launch alvo (Júlia personas + 50 testers)
2026-08-XX   CFM 2.454/2026 window aug/2026 launch público
```

---

## Próximo passo único

**Para destravar tudo:**

```
aceito tudo padrão Uma anipis v2
```

Ou responder cada D-UX-XX individualmente conforme tempo.

Eu fico aqui pronta. Sem pressa, mas com a janela CFM em mente.

---

*Uma — UX Design Expert · 2026-05-16*
*"Um espaço que respira. E que sabe a hora de chamar alguém de carne e osso."*
