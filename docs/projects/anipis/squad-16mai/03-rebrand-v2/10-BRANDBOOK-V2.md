# ANIPIS — Brandbook v2.0

**Versão:** 2.0.0 (draft)
**Data:** 2026-05-16
**Status:** Draft pending user approval (D-UX-01 + D-UX-02)
**Sucede:** v1.0.0 (03/Abr/2026)
**Autor consolidação:** Uma (@ux-design-expert)
**Squad:** 16/Mai (Anipis re-launch project)

---

## Sumário

1. [O que mudou de v1 → v2](#1-o-que-mudou-de-v1--v2)
2. [Brand Identity](#2-brand-identity)
3. [Logo Guidelines](#3-logo-guidelines)
4. [Color System Multi-theme](#4-color-system-multi-theme)
5. [Typography 3-font system](#5-typography-3-font-system)
6. [Spacing & Layout](#6-spacing--layout)
7. [Component Patterns](#7-component-patterns)
8. [Voice & Tone refined](#8-voice--tone-refined)
9. [Motion Principles](#9-motion-principles)
10. [Iconography](#10-iconography)
11. [Illustration & Photography Tier system](#11-illustration--photography-tier-system)
12. [Accessibility](#12-accessibility)
13. [Ethical UX Charter](#13-ethical-ux-charter)
14. [Design Tokens reference](#14-design-tokens-reference)
15. [Apêndices](#15-apêndices)

---

## 1. O que mudou de v1 → v2

Este brandbook **referencia** os 12 docs específicos do rebrand v2 — não os duplica. Cada seção tem link para o doc canon.

### Mudanças estruturais (Tier S)

| Área | v1 | v2 | Doc canon |
|------|----|----|-----------|
| **Cor** | Mono-theme Aurora Warm Coral | **Multi-theme**: Warm (default) / Calm / Soft | `02-COLOR-SYSTEM.md` |
| **Tipografia** | Nunito + Inter | **General Sans + Inter + Fraunces Italic** | `03-TYPOGRAPHY.md` |
| **Logo** | Conceito "chama suave" não-executado | **3 direções para escolha** (Mythological / Aurora Arc / Breathing Form) | `01-LOGO-DIRECTIONS.md` |
| **Motion** | 4 tokens decorativos | **Brand element** com 5 motion principles éticos | `05-MOTION-PRINCIPLES.md` |
| **Voice** | Charter implícita | **Ethical UX Charter (10 commandments)** como gate | `07-VOICE-REFINED.md` |
| **Iconography** | Lucide-only | **Phosphor + 4 custom Anipis** | `04-ICONOGRAPHY.md` |
| **Photography** | Unsplash stock OK | **Tier 1 illustration default; Tier 3 photo restrito** | `06-ILLUSTRATION-PHOTO.md` |

### Mudanças quantitativas

- Tokens semânticos: 130 → 70 (-46%)
- Border radius variants: 8 → 4 (-50%)
- Shadow variants: 5 → 2 (-60%)
- Theme combinations: 1 light + 1 dark → 3 themes × 2 modes = **6 combinações**
- Motion tokens: 4 → 6 (+50%, mais granular)
- Custom icons: 0 → 4 (signature)

### O que NÃO mudou

- Brand identity core (nome, pronúncia, missão, valores, arquétipo Cuidador)
- Crisis safety patterns (3 níveis amarelo/laranja/vermelho)
- Disclaimers obrigatórios
- WCAG AA compliance baseline (mas v2 adiciona AAA target em crisis)
- LGPD posture, R$29,90/mês accessibility target
- Mood scale 5 levels (hex mudaram, conceito mantido)

---

## 2. Brand Identity

### Nome
**ANIPIS** — fusão de *anima* (latim: sopro vital) + *elpis* (grego: esperança).
Significado: *"Alma de esperança."*
Pronúncia: /a.NI.pis/ — segunda sílaba tônica. Rima com "raiz".

| Forma | Quando usar |
|-------|-------------|
| **Anipis** | Texto corrido ("O Anipis está aqui") |
| **ANIPIS** | Logos, headers, materiais marca |
| **anipis** | Variáveis código, tokens CSS |

**Tratamento como entidade**: "o Anipis", como você diz "o Google" — não "o app Anipis".

### Missão
> Democratizar o acesso ao bem-estar emocional no Brasil, oferecendo um companheiro de IA acolhedor, acessível e disponível 24 horas, que respeita a autonomia de cada pessoa.

### Visão
> Ser o primeiro nome que vem à mente de qualquer brasileiro quando precisa de apoio emocional acessível — antes do terapeuta, entre as sessões, ou quando não existe outra opção.

### Valores

| Valor | Significado na prática |
|-------|----------------------|
| **Acolhimento** | Nunca julgar. Cada emoção é válida. Tom de quem segura a mão, não de quem dá sermão. |
| **Segurança** | LGPD compliant. Conteúdo validado. Encaminhamento CVV/SAMU. Transparência total sobre limites IA. |
| **Acessibilidade** | R$29,90/mês. Linguagem simples. WCAG AA mínimo. Funciona em celular básico. |
| **Autonomia** | User decide o ritmo. IA sugere, nunca impõe. Consentimento granular. Opt-out fácil. |
| **Presença** | 24/7. Sem fila. Sem agendamento. Apoio quando o user precisa. |

### Arquétipo
**O Cuidador (com traços do Sábio).** Amigo atencioso que também leu sobre psicologia. Não é terapeuta, não é chatbot genérico, não é guru. Alguém que ouve com genuíno interesse, faz perguntas que ajudam, lembra do que você compartilhou.

### Personalidade em 5 palavras
1. **Acolhedor** — calor humano, nunca robótico
2. **Presente** — escuta ativa, não respostas genéricas
3. **Honesto** — transparente sobre limitações
4. **Gentil** — delicado em temas difíceis
5. **Esperançoso** — sem positividade tóxica

### O que ANIPIS NÃO é
- Terapeuta, psicólogo, psiquiatra
- Guru de autoajuda
- Chatbot genérico
- Substituto de tratamento profissional
- Rede social

### Tagline

| Contexto | Tagline |
|----------|---------|
| LP hero v2 (D-UX) | **"Pra você que precisa de alguém às 4h da manhã."** |
| LP hero v1 (mantida como fallback) | "Um companheiro que te ouve, a qualquer hora." |
| App Store | "Apoio emocional acessível. 24h. Sem julgamento." |
| Onboarding | "Aqui, tudo que você sente importa." |
| Crisis | "Você não está sozinho. Podemos conversar ou ligar para alguém." |
| Social media bio | "Bem-estar emocional ao alcance de todos." |
| Anti-tagline (positioning clarifier) | "Não é terapeuta. É companheiro." |

### Posicionamento

```
            CLÍNICO
              |
     Woebot   |
              |
  FRIO -------+------- ACOLHEDOR
              |              ANIPIS
     Replika  |
              |
         INFORMAL
```

---

## 3. Logo Guidelines

→ **Doc canon: `01-LOGO-DIRECTIONS.md`**

**Resumo:** 3 direções para escolha user (D-UX-01):
- **D1 Mythological** — Espiral logarítmica precisa (anima clássica)
- **D2 Aurora Arc** — Arco horizonte (elpis amanhecer)
- **D3 Breathing Form** — Forma orgânica que respira (motion-as-brand) — **Recomendação Uma**

Princípios canônicos:
1. Orgânico (não geometricamente rígido)
2. Minimalista (funciona 16px a outdoor)
3. Acolhedor
4. Memorável (reconhecível em 1s)
5. **NOVO v2** — Anti-cliché (não chama-genérica-wellness)
6. **NOVO v2** — Ownable em movimento (animação signature)

---

## 4. Color System Multi-theme

→ **Doc canon: `02-COLOR-SYSTEM.md`**

### 3 themes
| Theme | Default? | Vibe | Quando user escolheria |
|-------|----------|------|------------------------|
| **Warm** (Aurora Coral) | ✅ DEFAULT | Acolhedor, terreno, brasileiro | Diurno, primeira sessão |
| **Calm** (Sage Forest) | Opt-in | Sereno, natural | Noturno, ansiedade aguda |
| **Soft** (Lavender Mist) | Opt-in | Etéreo, gentil | Insônia, fragilidade |

Theme switcher em `/settings/appearance`. Light/Dark mode é ortogonal (6 combinações totais).

### Mudanças críticas
- Primary `#DC6B3A` (warm v2) vs `#E8764B` (warm v1) — passa AA com texto branco no nível 500 direto
- Crisis e Mood **SEPARADAS** de hex (correção de bug v1 onde mood-3 e crisis-yellow eram idênticos)
- Mood colors **dessaturadas** (não vermelho/laranja alerta — dignidade visual igual em todos níveis)

---

## 5. Typography 3-font system

→ **Doc canon: `03-TYPOGRAPHY.md`**

| Função | Fonte | Razão | Uso % |
|--------|-------|-------|-------|
| Heading + display | **General Sans** | Geométrica humanista, calor sem rounded-baby | 60% |
| Body + UI | **Inter** | Standard UI, suporte PT-BR | 35% |
| Pull-quote, voz Anipis editorial | **Fraunces Italic** | Wonky serif quente, momento ritualístico | 5% |

Type scale: Major Third (1.25) com clamp fluid. Line-height body: 1.7 (vs 1.6 v1 — Spiekermann conforto emocional).

---

## 6. Spacing & Layout

### Base unit: 4px (0.25rem)

| Token | Valor |
|-------|-------|
| `--space-1` | 4px |
| `--space-2` | 8px |
| `--space-3` | 12px |
| `--space-4` | 16px (padrão) |
| `--space-5` | 20px |
| `--space-6` | 24px |
| `--space-8` | 32px |
| `--space-12` | 48px |
| `--space-16` | 64px |

### Border radius (4 valores — Rams reduction)

| Token | Valor | Uso |
|-------|-------|-----|
| `--radius-sm` | 8px | Buttons, inputs |
| `--radius-md` | 16px | Cards |
| `--radius-bubble` | 20px | **Chat bubbles (signature)** |
| `--radius-full` | 9999px | Pills, avatares |

### Shadows (2 + focus)

| Token | Valor |
|-------|-------|
| `--shadow-soft` | `0 2px 12px rgba(42, 40, 35, 0.06)` |
| `--shadow-elevated` | `0 8px 32px rgba(42, 40, 35, 0.12)` |
| `--focus-ring` | `0 0 0 3px color-mix(primary 35%, transparent)` |

### Touch targets
- `--touch-target-min: 44px` (WCAG)
- `--touch-target-crisis: 48px` (extra margin em CTA crisis)

### Layout responsivo

| Breakpoint | Layout |
|-----------|--------|
| Mobile < 640px | Single column, padding 16px |
| Tablet 640-1024px | 2 columns onde aplicável, padding 24px |
| Desktop > 1024px | Max 1200px, padding 32px |

**Mobile-first absoluto.** Chat container max-width **480px** (intimidade conversa).

---

## 7. Component Patterns

→ **Doc canon: `08-COMPONENT-PREVIEWS.md`** (specs HTML/CSS dos 5 mockups críticos)

### Lista canônica de componentes v2 (14)

| # | Componente | Onde usar |
|---|------------|-----------|
| C01 | **Orbe (CompanionPresence)** | Empty states, splash, breathing, login |
| C02 | ChatWindow | Tela principal |
| C03 | MessageBubble (user/ai/system variants) | ChatWindow |
| C04 | TypingIndicator (+ reduced-motion fallback) | ChatWindow |
| C05 | MoodSlider (slider contínuo — NÃO 5 botões) | MoodCheckIn |
| C06 | BreathingCircle | Breathing exercise |
| C07 | CrisisBanner (3 variants yellow/orange/red) | Detecção crise |
| C08 | DisclaimerStrip | Persistent footer chat |
| C09 | OnboardingScreen | Onboarding flow 3 telas |
| C10 | ResourceCard (CVV/SAMU/CAPS) | Handoff humano |
| C11 | ConsentToggle (pill, não checkbox) | Onboarding + Settings |
| C12 | MemoryItem (inspect + delete individual) | Settings → Memory |
| C13 | VoiceInputButton | Chat input |
| C14 | EmptyState (orbe + Fraunces italic title + CTA suave) | Chat empty, etc. |

---

## 8. Voice & Tone refined

→ **Doc canon: `07-VOICE-REFINED.md`**

### Refinement essencial v2 sobre v1

1. **"você" sempre** — nunca tu/vc/ceh. Lint rule enforce.
2. **Anti-positividade tóxica** com checklist de banned phrases (output filter LLM).
3. **Primeira pessoa Anipis sempre** ("Estou aqui" não "Anipis está aqui") — exceto materiais institucionais.
4. **Disclaimer compacto refinement** — 35 chars: `"Companheiro de IA · Não substitui profissional · Em crise: 188 CVV"`.
5. **Ethical UX Charter** (10 commandments) integrada como gate de PR.

### Tom por contexto (mantido v1)

| Contexto | Tom | Exemplo |
|----------|-----|---------|
| Acolhimento | Caloroso, curioso | "Oi! Como você está se sentindo agora?" |
| Escuta ativa | Presente, reflexivo | "Entendo. Parece que isso te deixou frustrado." |
| Exercício | Guia calmo, ritmado | "Inspire devagar... segure por 4 segundos... e solte." |
| Crise | Direto, acolhedor | "Você não está sozinho. Posso te ajudar a ligar para alguém." |
| Conquista | Celebrativo genuíno (sem confetti) | "3 dias seguidos. Isso mostra compromisso consigo mesmo." |
| Retorno | Acolhedor SEM CULPA | "Que bom te ver de volta. Não importa quanto tempo passou." |

---

## 9. Motion Principles

→ **Doc canon: `05-MOTION-PRINCIPLES.md`**

5 motion principles ético-calmos:
1. **Breathing** — 8s ciclos sincronizados respiração humana relaxada (signature)
2. **Gentle** — ease-arrive/ease-depart, nada bouncy
3. **Never-Anxious** — sem flash, sem parallax, sem type-writer effect
4. **Attentive** — typing indicator com latency artificial (Anipis "pensa")
5. **Deliberate** — toda animação comunica algo concreto, zero decoração

Tokens: 6 (breath / arrive / depart / settle / heartbeat / pulse).
**Prefers-reduced-motion: total compliance** — features ambient ficam estáticas, typing vira texto.

---

## 10. Iconography

→ **Doc canon: `04-ICONOGRAPHY.md`**

**Phosphor Icons (regular)** como base biblioteca (~40 ícones curated) + **4 ícones proprietários Anipis** signature:

| Custom | Conceito | Uso |
|--------|----------|-----|
| `anipis-flame` | Chama-pétala-gota (anima vital) | Logo símbolo small, splash |
| `anipis-breath` | Círculo central + arcs concêntricos | Breathing exercise CTA |
| `anipis-companion` | Forma orgânica blob assimétrica | Chat header, memory inspector |
| `anipis-bridge` | Arco-ponte 2-pontos | "Falar com pessoa real" button, ResourceCard |

Sizes: 16/20/24 (padrão) /32/48. Stroke 1.5px em 24px base.

---

## 11. Illustration & Photography Tier system

→ **Doc canon: `06-ILLUSTRATION-PHOTO.md`**

| Tier | Tipo | Quando usar |
|------|------|-------------|
| **Tier 1** | Ilustração custom warm minimal hand-drawn (SVG, tema-aware via `currentColor`) | Empty states, onboarding, brand moments, errors |
| **Tier 2** | Generative composições (Canvas Perlin noise + mood-aware) | Chat ambient bg, mood landscape |
| **Tier 3** | Fotografia (raro, restrito) | Testimonials com consentimento, blog real |
| **BANIDO** | Stock photos genéricos Unsplash | — |

Sprint 1: 7 ilustrações Tier 1 (I-01 a I-07). Estilo: line work 1.5-2.5px, figuras humanas sem rosto, paleta limitada theme-aware, tom adulto sereno (NÃO infantil).

---

## 12. Accessibility

### Compromisso v2
- **WCAG 2.1 AA** absoluta — baseline para 100% das telas
- **WCAG 2.1 AAA** target — telas de crise (vida em jogo, capacidade cognitiva reduzida em crise)

### Checklist específica

| Critério | Implementação |
|----------|---------------|
| Contraste texto normal | AA (4.5:1) baseline / AAA (7:1) em crisis |
| Touch target | 44px min / **48px em crisis CTA** |
| Focus visível | `--focus-ring` 3px em todos interativos, inclusive links inline |
| Screen reader | Testado NVDA + VoiceOver PT-BR |
| Navegação teclado | Tab order lógico + "Pular para o chat" skip link |
| Reduced motion | **Total compliance** — ambient/typing/breathing têm fallbacks |
| Lang attribute | `<html lang="pt-BR">` + componentes |
| Cor nunca único indicador | Mood = emoji+label+cor. Crisis = icon+text+action |
| Zoom 200% | Layout não quebra (rem-based) |
| Voice input | Mic prominente no chat |
| Font-size user override | Settings → "Comfort spacing" / "Large text" |

### CVD compatibilidade
- Cada theme primary testado em Coblis (protanopia/deuteranopia/tritanopia)
- Mood scale luminosity sobe linear 50% → 83% (mood 1→5) — CVD user ordena por claridade

---

## 13. Ethical UX Charter

→ **Doc canon: `07-VOICE-REFINED.md` §Refinamento 5**

10 commandments (Calvo) integrados como **gate de produto**:

1. Zero streaks visíveis MVP
2. Zero push proactive primeiros 14 dias
3. Default frequency notifications: never (opt-in)
4. Memory toggle OFF default primeiros 7 dias
5. Export/delete em ≤2 cliques
6. Pause feature visível
7. "Falar com pessoa real" 1 clique no header
8. Disclaimer compacto SEMPRE visível no chat
9. Crisis fast-path sem confirmação dupla
10. Telemetria opt-in granular (não bundled consent)

**Public charter** em `anipis.com.br/etica` (trust signal).

---

## 14. Design Tokens reference

→ **Doc canon: `09-TOKENS-DRAFT.md`**

**Implementação:** `apps/serenity-ai/src/styles/design-tokens-v2.css` (substitui `anipis-tokens.css` v1)
**Figma:** `apps/serenity-ai/docs/brand/figma-tokens-v2.json` (W3C DTCG format)
**Tailwind:** `apps/serenity-ai/tailwind.config.ts` (CSS vars-based para multi-theme automático)

**Token count v2:** ~70 semânticos (vs ~130 v1, -46%).

Schema: `--{category}-{semantic}-{shade}` (ex: `--color-primary-500`, `--chat-bubble-user-bg`).

Theme switch via `data-theme` attribute no `<html>`. Color scheme via `prefers-color-scheme` + `data-color-scheme` override.

---

## 15. Apêndices

### A. Checklist de implementação v2

| Item | Status | Owner |
|------|--------|-------|
| Logo final produzido (após D-UX-01) | Pendente | Design (Uma + Flux) |
| `design-tokens-v2.css` produção | Pendente | @dev |
| `globals.css` import token v2 | Pendente | @dev |
| Tailwind config update | Pendente | @dev |
| Figma tokens-v2 sync | Pendente | Uma |
| 7 ilustrações Tier 1 (sprint 1) | Pendente | Uma + Flux |
| 4 ícones custom Anipis | Pendente | Design |
| 5 mockups Storybook | Pendente | @dev |
| Ethical UX Charter public page | Pendente | @dev + Legal |
| Auditoria WCAG AA + AAA (crisis) | Pendente | @qa |
| Theme switcher component | Pendente | @dev |
| Lint rules custom (eslint-plugin-anipis) | Pendente | @dev |
| Voice output filter LLM | Pendente | @dev backend |

### B. Histórico decisões

| Data | Decisão | Onde |
|------|---------|------|
| 2026-04-01 | Rebrand Serenity AI → ANIPIS | docs/brand/rebrand-audit-anipis.md |
| 2026-04-02 | Paleta Aurora Warm Coral v1 | BRANDBOOK v1.0 |
| 2026-04-02 | Nunito + Inter v1 | BRANDBOOK v1.0 |
| 2026-04-27 | (Sessão de rebrand v2 — docs perdidos) | — |
| 2026-05-16 | Brandbook v2 draft (multi-theme, General Sans, motion brand, ethical charter) | Este doc |
| 2026-05-16 | 5 decisões pendentes user (Logo D1/D2/D3, Multi-theme MVP, Fraunces, Caixinha-de-Cartas, Re-render Flux) | `11-DECISIONS-LOG.md` |

### C. Documentos referência

| Doc | Path | Status |
|-----|------|--------|
| Brainstorm Conclave v2 | `00-BRAINSTORM-CONCLAVE.md` | Done |
| Logo Directions | `01-LOGO-DIRECTIONS.md` | Done |
| Color System Multi-theme | `02-COLOR-SYSTEM.md` | Done |
| Typography 3-font | `03-TYPOGRAPHY.md` | Done |
| Iconography Phosphor + custom | `04-ICONOGRAPHY.md` | Done |
| Motion Principles | `05-MOTION-PRINCIPLES.md` | Done |
| Illustration & Photo Tier | `06-ILLUSTRATION-PHOTO.md` | Done |
| Voice Refined + Charter | `07-VOICE-REFINED.md` | Done |
| Component Previews specs | `08-COMPONENT-PREVIEWS.md` | Done |
| Tokens Draft (CSS/Figma/Tailwind) | `09-TOKENS-DRAFT.md` | Done |
| **Brandbook v2 (este doc)** | `10-BRANDBOOK-V2.md` | Draft pending approval |
| Decisions Log | `11-DECISIONS-LOG.md` | Done |
| Exec Summary | `12-EXEC-SUMMARY.md` | Done |
| Deliverable UX squad | `../02-deliverables/08-ux-design-expert.md` | Done |

### D. Brand v1 mantido (referência cruzada)

| Doc v1 | Status v2 |
|--------|-----------|
| `apps/serenity-ai/docs/brand/BRANDBOOK-ANIPIS.md` | Mantém core (identidade, valores, posicionamento) — secções de cor/typo/motion **superseded by** v2 docs |
| `apps/serenity-ai/docs/brand/BRAND-VOICE-ANIPIS.md` | Mantido + delta v2 em `07-VOICE-REFINED.md` |
| `apps/serenity-ai/docs/brand/BRAND-STORYTELLING-ANIPIS.md` | Mantido (não modificado v2) |
| `apps/serenity-ai/docs/brand/figma-tokens.json` | **Deprecado** — usar `figma-tokens-v2.json` |
| `apps/serenity-ai/src/styles/anipis-tokens.css` | **Deprecado** — usar `design-tokens-v2.css` |

---

*ANIPIS Brandbook v2.0.0 (draft) — "A alma de esperança que sabe quando ficar quieta."*
*Consolidado em 2026-05-16 por Uma (@ux-design-expert) — squad 16/Mai*
*Próxima revisão: após produção do logo final (D-UX-01 + render Flux)*
