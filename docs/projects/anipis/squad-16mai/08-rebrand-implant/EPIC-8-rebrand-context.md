# EPIC-8 — Rebrand v2 Implant Context

**Para:** @design-systems-engineer + @ui-designer + @dev + @design-lead + @qa
**De:** Pax (PO)
**Data:** 2026-05-16
**Story canonica:** `D:/AIOS/docs/stories/serenity-ai/active/SAI-RB-001-rebrand-v2-implant.md`
**Status:** Ready (waiting on Sprint 4 start — semanas 9-10 do roadmap revisto)

---

## 1. TL;DR — O que precisa saber em 60 segundos

1. **Bulk Uma fechado hoje (16/Mai/2026).** User Breno aceitou TODAS as 5 decisoes pendentes do rebrand v2 sem alteracoes.
2. **Backend Anipis ~70% pronto** esta divergente do brandbook v2 — usa Teal #4A9BA8 + DM Sans em vez de Aurora Coral #DC6B3A + General Sans/Inter/Fraunces.
3. **Sprint 4 (semanas 9-10) implanta v2** em paralelo com Sprint 1-3 core safety/crisis features. Nao bloqueia launch CFM ago/2026.
4. **Escopo:** 5 componentes principais migrados (ChatWindow + MoodCheckin + BreathingExercise + OnboardingFlow + HeroPage) + multi-theme + assets novos. Resto fica para SAI-RB-002 futura.
5. **Strategy:** Feature flag `brand-v2-enabled` por componente, rollout 10% -> 50% -> 100% com auto-rollback Sentry.

---

## 2. Bulk Uma — 5 decisoes fechadas

| Decisao | Resposta bulk aceita | Implicacao |
|---------|---------------------|------------|
| **D-UX-01** Logo direction | **D3 Breathing Form** | Forma organica que respira (motion-as-brand + ownable + reduced-motion graceful) |
| **D-UX-02** Theme MVP | **B) Multi-theme Warm default + Calm + Soft opt-in** | Theme switcher em /settings/appearance + persist localStorage + Supabase sync |
| **D-UX-03** Fraunces Italic | **A) 3 fonts (General Sans + Inter + Fraunces Italic)** | Fraunces uso 5-10% pull-quotes only (welcome message, "momento Anipis") |
| **D-UX-04** Caixinha de Cartas | **B) Roadmap fase 2** | NAO faz parte deste MVP — story separada futura |
| **D-UX-05** Flux renders | **3 renders Warm only $0.90 total** | Flux 1.1 Pro Replicate API — hero ambient + onboarding horizonte + theme thumbs |

**Trigger original user (16/Mai):** "aceito bulk Uma rebrand v2 anipis"

---

## 3. Pointers — Pacote brand v2 (13 docs + tokens)

### Brand v2 docs (`docs/projects/anipis/squad-16mai/03-rebrand-v2/`)

| Doc | O que tem | Quando consultar |
|-----|-----------|------------------|
| `00-BRAINSTORM-CONCLAVE.md` | Origem das decisoes via clones (Spiekermann, Calvo, Anadol, Don Norman, Rams, Val Head) | Background contextual |
| `01-LOGO-DIRECTIONS.md` | 3 direcoes logo (D1 Mythological / D2 Aurora Arc / **D3 Breathing Form aprovado**) | Task 4 logo production |
| `02-COLOR-SYSTEM.md` | Multi-theme (Warm + Calm + Soft) + mood colors dessaturadas + crisis colors separados | Task 1 tokens + Task 7 MoodCheckin |
| `03-TYPOGRAPHY.md` | 3-font system (General Sans heading + Inter body + Fraunces Italic pull-quotes 5-10%) | Task 1 fonts setup |
| `04-ICONOGRAPHY.md` | Phosphor Icons base + 4 custom (flame/breath/companion/bridge) | Task 2 icons production |
| `05-MOTION-PRINCIPLES.md` | 5 motion principles (co-regulacao / reduzido default / reduced-motion COMPLETO / easing brand / zero parallax crisis) | Task 6/7/8 component migrations |
| `06-ILLUSTRATION-PHOTO.md` | Tier 1 hand-drawn warm minimal + asset list I-01 a I-05 | Task 3 illustrations production |
| `07-VOICE-REFINED.md` | Voice "voce sempre" + anti-positividade toxica + Ethical UX Charter | Task 6/7/8 copy + lint rule |
| `08-COMPONENT-PREVIEWS.md` | Mockups dos 5 componentes principais | Task 6/7/8 reference |
| `09-TOKENS-DRAFT.md` | 70 tokens (reduction 130->70 Rams consolidation) | Task 1 tokens implementation |
| `10-BRANDBOOK-V2.md` | Master brandbook consolidado | Reference geral |
| `11-DECISIONS-LOG.md` | 18 decisoes fechadas + 5 pendentes (agora todas fechadas via bulk) | Auditoria/transparencia |
| `12-EXEC-SUMMARY.md` | TL;DR 4 min para user/stakeholders | Onboarding novos contributors |

### Tokens canonicos (`docs/projects/anipis/squad-16mai/05-design/`)

| Arquivo | Formato | Uso |
|---------|---------|-----|
| `tokens.json` | W3C DTCG-compatible JSON | Source of truth — converter para CSS vars + Tailwind theme em Task 1 |
| `DESIGN.md` | Google spec frontmatter + markdown | Reference humanly readable |
| `anipis-pdf-styles.css` | CSS para PDF rendering | APENAS referencia — production CSS sera novo (gerado de tokens.json) |

### UX deliverable (`docs/projects/anipis/squad-16mai/02-deliverables/`)

`08-ux-design-expert.md` — deliverable completo Uma com personas (Julia + Marcos), 5 user flows, accessibility WCAG AA/AAA targets, adolescent track P5 EXCLUIDO MVP.

### Master Dossier

`Anipis-Master-Dossier-v1.pdf` (raiz `squad-16mai/`) — PDF reference para servir em `/docs/brand-reference.pdf` (Task 10.4).

---

## 4. Diff alto-nivel v1 -> v2

### Cores

| Token | v1 (atual codigo) | v2 (target) |
|-------|-------------------|-------------|
| Primary | `#4A9BA8` Teal | `#DC6B3A` Aurora Coral (warm theme) |
| Heading font | DM Sans | General Sans |
| Body font | DM Sans | Inter |
| Pull-quote font | (nao existia) | Fraunces Italic (uso 5-10% raro) |
| Mood colors | Saturadas (mood-3 = `#D4960C` igual crisis-yellow — BUG) | Dessaturadas, hex separados crisis |
| Crisis colors | Vermelho agressivo | Yellow/Orange/Red AAA contrast |
| Theme | Single light | Multi-theme (Warm + Calm + Soft) opt-in |

### Tipografia

| Layer | v1 | v2 |
|-------|----|----|
| Display 56px | DM Sans Bold | General Sans Bold (clamp 40-56px fluid) |
| H1 32px | DM Sans Semibold | General Sans Semibold |
| Body 16px | DM Sans Regular | Inter Regular (line-height 1.625) |
| Pull-quote 20px | (n/a) | Fraunces Italic Medium |

### Componentes principais (impacto migracao)

| Componente | Mudanca v1 -> v2 |
|------------|------------------|
| ChatWindow | container max-width 480px (intimidade F-18) + bubbles tokens warm.chat-bubble |
| MoodCheckin | Mood colors dessaturadas + hex separados crisis (F-11/F-12) |
| BreathingExercise | anipis-breath custom icon + I-05 illustration + motion co-regulacao |
| OnboardingFlow | 3 ilustracoes I-02/I-03/I-04 + welcome usa Fraunces Italic |
| HeroPage | Logo D3 + Flux hero render + 3 CTAs primary.500 |

---

## 5. Migration Strategy

### Feature flag rollout

Cada componente recebe flag dedicada para rollback granular:
- `brand-v2-chat-enabled`
- `brand-v2-mood-enabled`
- `brand-v2-breathing-enabled`
- `brand-v2-onboarding-enabled`
- `brand-v2-hero-enabled`

Fases:
1. **Internal testing** (devs + Uma) — flags 100% true em dev/staging
2. **Canary 10%** — 3 dias producao, monitorar Sentry error rate
3. **50% rollout** — 3 dias, validar Lighthouse Performance nao regrediu >5 pts
4. **100% production** — toggle all-on, manter flags ainda 30 dias para rollback emergencial
5. **Cleanup** — apos 30 dias estaveis, remover flags + legacy code

### Branching strategy

- Branch principal: `feat/anipis-rebrand-v2-sprint4`
- Sub-branches por task:
  - `feat/anipis-rb-tokens-fonts` (Task 0-1)
  - `feat/anipis-rb-icons` (Task 2)
  - `feat/anipis-rb-illustrations` (Task 3)
  - `feat/anipis-rb-logo` (Task 4)
  - `feat/anipis-rb-flux-renders` (Task 5)
  - `feat/anipis-rb-chat-migrate` (Task 6)
  - `feat/anipis-rb-mood-breathing-migrate` (Task 7)
  - `feat/anipis-rb-onboarding-hero-migrate` (Task 8)
  - `feat/anipis-rb-theme-switcher-qa` (Task 9)
  - `feat/anipis-rb-rollout` (Task 10)
- PRs sequenciais merged em `feat/anipis-rebrand-v2-sprint4`. Squash merge para `main` apenas apos QA full pass.

### Backup obrigatorio

Antes de delete legacy v1/v3 (Caderno), mover para:
```
apps/web/src/styles/_legacy-pre-v2/
├── design-tokens-v1-teal.css      (snapshot)
├── design-tokens-v3-caderno.css   (snapshot atual)
└── README.md (notas migracao)
```

---

## 6. Risk Register

| ID | Risco | Severidade | Probabilidade | Mitigacao |
|----|-------|------------|---------------|-----------|
| R1 | WCAG regression durante migracao causa fail launch | HIGH | MED | axe-core CI gate bloqueia PR (score <90 = fail), manual review AAA crisis screens |
| R2 | Theme switcher complexidade quebra UX (3 themes + dark Warm) | MED | MED | Implementacao via data-attributes (CSS only, sem JS heavy), persistencia simples, fallback graceful |
| R3 | Fraunces Italic weights nao disponiveis subset PT-BR | LOW | LOW | Validar Google Fonts Fraunces italic 100-900 em T1.4 antes de bundle; fallback Newsreader Italic se gap |
| R4 | Flux renders nao aprovados pelo Design Lead na primeira tentativa | MED | MED | Budget $0.90 = 3 tentativas Flux 1.1 Pro. Iterar prompt + seed antes commit. Fallback: gradient CSS render se 3 falham |
| R5 | Dark mode opcional Warm adiciona complexidade nao prevista | MED | LOW | Limitar dark mode apenas a Warm theme MVP. Calm/Soft dark fica fase 2 sem regressao funcional |
| R6 | Bundle size impact >+95KB regride Lighthouse | MED | LOW | Subset PT-BR fonttools obrigatorio (latin + latin-ext only), font-display swap, preload apenas variants usados |
| R7 | Designer freelancer T3 nao disponivel para 5 ilustracoes | MED | MED | Plan B: @ui-designer faz com mais tempo + @design-lead approval ajuda priorizacao |
| R8 | Voice v2 lint rule muito strict bloqueia copy legitima | LOW | MED | Plugin permite override manual via comment annotation `/* voice-v2-allow */` para casos excepcionais |
| R9 | Replicate API key nao provisionada antes Task 5 | LOW | LOW | @devops provisiona em T0.4 setup |
| R10 | Sprint 1-3 safety pipeline nao aprovado antes Task 6 voice lint | MED | LOW | @analyst review obrigatoria antes Task 6 start — gate sequencial |

---

## 7. Comunicacao + Handoffs

### Daily standup focus durante Sprint 4

- Tracking migration progress por componente (5 principais)
- Asset production status (logo + 4 icons + 5 illustrations + 3 renders)
- Feature flag rollout health (Sentry error rate baseline vs canary)
- WCAG audit CI status

### Sync points obrigatorios

- **Pre-Sprint 4 kickoff (final Sprint 3):** @analyst safety pipeline approval + @devops Replicate API key provisionado + @design-lead asset production timeline confirmado
- **Mid-Sprint 4 (semana 9 fim):** Asset production review + Tasks 1-5 done + iniciar component migration
- **End-Sprint 4 (semana 10 fim):** All 5 components migrated + multi-theme switcher + canary 10% ready
- **Sprint 5 inicio:** Canary 10% live + monitoring

### Quality gates sequenciais

1. **Asset gates (Tasks 2/3/4/5):** Design Lead approval ANTES commit
2. **Component migration gates (Tasks 6/7/8):** axe-core PASS + visual regression no diff != approved + voice lint PASS antes merge sub-branch
3. **Multi-theme gate (Task 9):** WCAG AAA crisis screens manual review + cross-browser screenshots commitados antes merge
4. **Rollout gate (Task 10):** Sentry alerts ativos + feature flags configurados + backup legacy commitado antes canary

---

## 8. Out of scope (importante)

Estas coisas NAO fazem parte da SAI-RB-001 — sao stories separadas futuras OU explicitamente fora do escopo brand v2:

- **SAI-RB-002 (futura):** Migracao componentes nao-principais — settings/professional/internal/landing-v3 secondary screens
- **Caixinha de Cartas:** roadmap fase 2 (D-UX-04 B)
- **Adolescent track P5 (16 anos):** EXCLUIDO MVP por CFM 2.454/2026 + parental consent (F-17)
- **Tier 2 generative composition (Canvas + Perlin noise):** Mood landscape — fase 2
- **Tier 3 photography (testimonials reais):** Excepcional, fora MVP — exige Legal + Design Lead approval caso a caso
- **LP marketing materials externos (social media, email templates):** Story separada @ux-design-expert futura
- **Native mobile app (iOS/Android):** Web-only MVP. Native viria com fonts hospedadas no respectivo app

---

## 9. Quick links

- Story canon: `D:/AIOS/docs/stories/serenity-ai/active/SAI-RB-001-rebrand-v2-implant.md`
- Migration checklist (30 itens): `D:/AIOS/docs/projects/anipis/squad-16mai/08-rebrand-implant/migration-checklist.md`
- Brand v2 docs: `D:/AIOS/docs/projects/anipis/squad-16mai/03-rebrand-v2/` (13 files)
- Tokens canon: `D:/AIOS/docs/projects/anipis/squad-16mai/05-design/tokens.json`
- DESIGN.md: `D:/AIOS/docs/projects/anipis/squad-16mai/05-design/DESIGN.md`
- UX deliverable: `D:/AIOS/docs/projects/anipis/squad-16mai/02-deliverables/08-ux-design-expert.md`
- Master Dossier PDF: `D:/AIOS/docs/projects/anipis/squad-16mai/Anipis-Master-Dossier-v1.pdf`
- Frontend atual: `D:/AIOS/apps/serenity-ai/apps/web/`

---

*Pax (PO) — 2026-05-16*
