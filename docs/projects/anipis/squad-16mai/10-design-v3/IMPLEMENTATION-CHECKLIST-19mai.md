# Anipis v3 — Implementation Checklist vs DESIGN.md (Pergaminho Clínico)

**Auditoria:** 19/Mai/2026 (D-11 ao Closed Beta 30/Mai)
**Spec source:** `docs/projects/anipis/squad-16mai/10-design-v3/DESIGN.md` (Pergaminho Clínico, 455 linhas, criado 16/Mai)
**Mockup HTML:** `docs/projects/anipis/squad-16mai/10-design-v3/mockups/anipis-v3-mockups.html` (5 flows)
**Tokens CSS:** `docs/projects/anipis/squad-16mai/10-design-v3/mockups/anipis-v3-tokens.css`
**Production tokens:** `apps/serenity-ai/apps/web/src/styles/design-tokens.css` (Caderno v3 — DIFERENTE do Pergaminho Clínico)

---

## 🚨 GAP CRÍTICO — Conflito de specs ATIVO

Existem **2 specs v3 em conflito** na codebase:

| Spec | Localização | Brand color | Canvas | Font | Status |
|---|---|---|---|---|---|
| **Caderno v3** | `apps/web/src/styles/design-tokens.css` | `#7A4A2B` Sepia Hazel | `#F4EFE6` aged cream | Newsreader serif | ✅ **PRODUÇÃO** (06/Mai locked) |
| **Pergaminho Clínico** | `squad-16mai/10-design-v3/DESIGN.md` | `#2F5235` Verde-Musgo | `#F7F4ED` pergaminho | Tobias serif | 📄 **MOCKUP** (16/Mai, não implementado) |

**Decisão founder necessária (BLOQUEIO P0):**

- **Opção A — Manter Caderno (status quo):** Pergaminho Clínico vira referência alternativa; mockup arquivado; checklist focado em alinhar componentes novos (DEV-2) ao Caderno.
- **Opção B — Migrar para Pergaminho Clínico:** rebrand visual full; impacta ~30 componentes + tokens + fontes. Custo: 1-2 sprints. Decisão arquitetural significativa.
- **Opção C — Híbrido:** elementos do Pergaminho (Verde-Musgo brand, mood pastels 6-tom, alarm âmbar) incorporados ao Caderno via override de tokens. Custo: ~1 dia trabalho design + 1 dia migração componente.

**Squad recomenda Opção A** para Closed Beta (D-11 não comporta rebrand). Pergaminho Clínico pode ser executado pós-Beta como v3.1.

---

## 1. Tokens — Alinhamento vs Pergaminho Clínico DESIGN.md

### Colors

| Token Pergaminho | Valor spec | Presente em produção? | Gap |
|---|---|---|---|
| `canvas` Pergaminho Clínico | `#F7F4ED` | ❌ Produção usa `#F4EFE6` (Caderno) | Diferença sutil (~3%), funcional |
| `surface` | `#FFFFFF` | ✅ via `--surface-raised: #FBF7EF` proxy | Quase, não exato |
| `surface-sunken` | `#EFEAE0` | ✅ via `--surface-recess: #ECE5D8` | Quase, não exato |
| `ink` warm-tinted | `#1A1814` | ✅ via `--text-primary: #1F1A17` | Quase, não exato |
| `brand` Verde-Musgo | `#2F5235` | ❌ Produção usa `#7A4A2B` Sepia Hazel | **MISMATCH MATERIAL** |
| `brand-soft` | `#D4E0CE` | ❌ Não existe — produção é monocromática sepia | **MISMATCH** |
| `mood-calm` azul | `#CFE0E8` | ❌ Não existe | **MISSING** |
| `mood-joy` apricot | `#F4D9C2` | ❌ Não existe | **MISSING** |
| `mood-tender` rosado | `#F0D5DC` | ❌ Não existe | **MISSING** |
| `mood-clear` lavanda | `#E0DDE8` | ❌ Não existe | **MISSING** |
| `mood-bright` limão | `#E5E5C0` | ❌ Não existe | **MISSING** |
| `mood-heavy` pedra | `#C8C5BD` | ❌ Não existe | **MISSING** |
| `alarm-bg` âmbar urgente | `#FFE17A` | ⚠️ Produção tem `--brand-lamp: #E8C77A` similar mas não exato | Parcial |
| `crisis` terracota grave | `#A1311F` | ✅ via `--intent-crisis: #7A2F1E` | Quase, mais escuro |

### Typography

| Família spec | Spec uso | Produção | Gap |
|---|---|---|---|
| Tobias (serif transitional) | display + H1-H3 | ❌ Produção usa Newsreader | **MISMATCH** (Tobias é licenciado, Newsreader é Google Fonts free) |
| Inter / Suisse Int'l | body + UI | ✅ Inter via next/font/google | OK |
| JetBrains Mono | technical | ❌ Produção não tem mono token | **MISSING** |

### Shapes (radius)

| Pergaminho | Produção | Gap |
|---|---|---|
| `xs 4px` | `--rounded-sm: 4px` | ✅ OK |
| `sm 8px` (cards) | Não existe — produção pula de 4 → 12 | **MISSING** |
| `md 12px` (inputs) | `--rounded-md: 12px` | ✅ OK |
| `lg 16px` (modais) | `--rounded-lg: 20px` | ⚠️ Off-spec |
| `pill 9999px` | `--rounded-full: 999px` | ✅ OK |

### Elevation

| Pergaminho | Produção | Gap |
|---|---|---|
| `none` | ✅ OK |
| `hairline` 0 0 0 1px | ⚠️ via border solid, não shadow | Conceitual ok |
| `card` bottom hairline only | ❌ produção tem `--elevation-raised` heavy shadow | **MISMATCH FILOSÓFICO** (Pergaminho rejeita shadows) |
| `popover` 0 4px 12px subtle | ✅ similar | OK |

---

## 2. Componentes — Coverage vs Pergaminho DESIGN.md

| Componente Pergaminho | Spec resumido | Existe em produção? | Path | Gap |
|---|---|---|---|---|
| `button-primary` Verde-Musgo pill | brand bg + radius pill + label uppercase NOT | ✅ Buttons existem | múltiplos | ⚠️ Cores wrong (sepia vs verde-musgo) |
| `button-secondary` brand-soft pill | brand-soft + radius pill | ✅ via secondary variants | múltiplos | ⚠️ Cores wrong |
| `button-ghost` outline | border-strong + radius pill | ✅ existe | múltiplos | OK |
| `input-text` 12px radius | border-strong + 12px | ✅ existe | múltiplos | OK |
| `card-content` surface + border-hair + radius-sm 8px | bottom hairline only | ✅ Cards existem | múltiplos | ⚠️ Shadows heavy vs hairline-only |
| `card-mood` chip categorization | mood-pastel bg + pill | ✅ `MoodSelector.tsx` | shared/ | ⚠️ Não usa 6 mood pastels do spec |
| `chat-bubble-companion` tail bottom-left | surface + tail 2px asymmetric | ✅ `ChatBubble.tsx` | shared/ | ❓ Verificar tail asymmetric |
| `chat-bubble-user` tail bottom-right | brand-soft + tail 2px | ✅ `ChatBubble.tsx` | shared/ | ❓ Verificar |
| `crisis-banner` alarm-bg + border-left 3px | âmbar exclusivo | ✅ `CrisisBanner.tsx` | shared/ | ⚠️ Verificar cor âmbar vs sepia |
| `crisis-cta` terracota pill | "Ligue 188 agora" | ✅ `CrisisButton.tsx`, `CrisisPhoneButton.tsx` | shared/ | ✅ provavelmente OK |
| `divider-section` Equals 1px ink + 64px margin | section dividers | ❌ Não encontrado | — | **MISSING** |
| `pull-quote` Tobias italic + brand border-left 2px | welcome/consent/wrap-up | ❌ Não encontrado | — | **MISSING** (pode usar em consent UI DEV-2) |

---

## 3. Flows — Coverage vs Mockup (5 flows)

| Flow Mockup | Spec localização | Implementação produção | Gap |
|---|---|---|---|
| **FLOW 1 Onboarding D0** "Welcome silencioso" | mockup linha ~50-90 | ✅ `WelcomeStep.tsx` + OnboardingFlow step 0 | ⚠️ Visual provavelmente difere |
| **FLOW 2 Mood Check-in** "6 estados, zero ranking" | mockup linha ~90-130 | ✅ `MoodCheckin.tsx` + `MoodSelector.tsx` | ⚠️ 6 mood pastels não existem em produção |
| **FLOW 3 Conversa** chat companion | mockup linha ~130-160 | ✅ `ChatWindow.tsx` + `ChatBubble.tsx` + `ChatInput.tsx` | ⚠️ Validar asymmetric tail + cores brand |
| **FLOW 4 Respiração** breathing exercise | mockup linha ~160-180 | ✅ `BreathingExercise.tsx` | ❓ Verificar motion-breath 4000ms |
| **FLOW 5 Crisis RED** escalation | mockup linha ~180-200 | ✅ `CrisisFullScreen.tsx` + `CrisisFullScreenConfirm.tsx` | ✅ Provavelmente OK (crisis lockdown bem testada) |

---

## 4. DEV-2 Consent UI — Compliance gap

Componente DEV-2 entregue em 19/Mai usa **tokens inventados** que não estão em nenhum dos 2 specs:

```tsx
// InternationalTransferConsent.tsx — VAR INVENTADAS
bg-[color:var(--pergaminho-base,#f6efde)]    // ❌ não existe em token system
bg-[color:var(--pergaminho-accent,#a07d3c)]  // ❌ não existe
border-[color:var(--ink-faded,#cdbfa5)]      // ❌ não existe
text-[color:var(--ink-deep,#3b2e1a)]         // ❌ não existe
```

**Fix necessário pré-Beta:** trocar para tokens reais. Se Opção A (Caderno):

```tsx
bg-[color:var(--surface-canvas)]    // #F4EFE6 aged cream
bg-[color:var(--brand-spot)]        // #7A4A2B sepia
border-[color:var(--border-subtle)] // #E2D9C9
text-[color:var(--text-primary)]    // #1F1A17
```

Effort: **15min** edit + re-test.

---

## 5. PRIORIZAÇÃO PRÉ-BETA (D-11)

### 🔴 P0 (bloqueia Beta) — 1 item

1. **DECISÃO Opção A/B/C** sobre Pergaminho Clínico vs Caderno → **founder, ~10min reflexão**
2. **DEV-2 token fix** se Opção A (alinhar componente aos tokens Caderno existentes) → **15min**

### 🟡 P1 (deveria fechar pré-Beta, mas slip OK)

3. **Verificar asymmetric tail** em ChatBubble.tsx vs spec → 5min audit
4. **Verificar cor crisis** em CrisisBanner vs CrisisFullScreen → 10min audit
5. **Validar motion-breath** em BreathingExercise vs spec 4000ms → 5min audit

### 🟢 P2 (pós-Beta v3.1) — se Opção B/C foi escolhida

6. **Migração brand** Sepia Hazel → Verde-Musgo (Opção B) → 1-2 sprints
7. **6 mood pastels** addition (Opção C parcial) → 1 dia
8. **Tobias font swap** (Opção B) → requer licença font + ~4h migração
9. **Divider-section** Equals 1px ink → 2h
10. **Pull-quote** componente Tobias italic → 3h
11. **Adicionar `card sm 8px` radius token** → 30min

---

## 6. Arquivos importantes (resumo)

### Mockup que você fez (16/Mai)
- 📄 **`docs/projects/anipis/squad-16mai/10-design-v3/mockups/anipis-v3-mockups.html`** (203 linhas) — 5 flows visuais
- 📄 **`docs/projects/anipis/squad-16mai/10-design-v3/mockups/anipis-v3-tokens.css`** (200 linhas) — CSS variables Pergaminho
- 📄 **`docs/projects/anipis/squad-16mai/10-design-v3/DESIGN.md`** (455 linhas) — spec completa Pergaminho Clínico

### Production tokens (Caderno, locked 06/Mai)
- 📄 `apps/serenity-ai/apps/web/src/styles/design-tokens.css` — Layer 1 brand + Layer 2 semantic + Layer 3 component
- 📄 (origem) `docs/projects/anipis/v3-redesign/02-DESIGN.md` — referenciado em comment, **arquivo não encontrado no filesystem atual** (pode ter sido movido)

### Componentes em produção (já existem)
- Welcome: `apps/web/src/components/shared/WelcomeStep.tsx`
- Mood: `MoodCheckin.tsx` + `MoodSelector.tsx` + `MoodHistory.tsx`
- Chat: `ChatWindow.tsx` + `ChatBubble.tsx` + `ChatInput.tsx` + `ChatHeader.tsx`
- Breathing: `BreathingExercise.tsx`
- Crisis: `CrisisAlert.tsx` + `CrisisBanner.tsx` + `CrisisButton.tsx` + `CrisisFullScreen.tsx` + `CrisisFullScreenConfirm.tsx` + `CrisisPhoneButton.tsx` + `CrisisSliver.tsx`
- Consent (DEV-2): `apps/web/src/components/onboarding/InternationalTransferConsent.tsx` + `SubprocessorList.tsx`
- Settings: `ConsentSettings.tsx`

---

## 7. Recomendação executiva

Pra Beta de 30/Mai com 20 usuárias pré-selecionadas:

**Recomendado: Opção A** (manter Caderno) +
- **Fix DEV-2 token alignment** (P0, 15min)
- **3 audits rápidos P1** (20min total)
- **Mockup Pergaminho Clínico arquivado** como `v3.1-future-direction/` (escopo pós-Beta)

Justificativa: rebrand visual a 11 dias do launch é alto-risco; teste de 20 pessoas não vai discriminar Sepia Hazel vs Verde-Musgo materialmente; produção Caderno tem coverage Sentry + a11y testado (WCAG 2.1 AA validado em sprints anteriores).

Se Opção B/C escolhida: aceitar slip pra 7/Jun (D+8 do launch original), com Sprint dedicado pós-Patricia.

---

**Próximo passo:** founder decide A/B/C. Após decisão, Orion pode:
- Opção A: executar 5 fixes P0+P1 em ~45min total
- Opção B: planning sprint 8d pós-Patricia
- Opção C: planning sprint 3d pós-Patricia
