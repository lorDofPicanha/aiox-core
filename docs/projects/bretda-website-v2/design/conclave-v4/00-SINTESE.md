# Conclave v4 — Site Bretda Atelier (export) · 26/Jun/2026

**Método (deep, conforme regra "conclave nunca meia-boca"):** DNA real carregado via
`self-consultation.js batch` (6 experts a dedo) + **dado ao vivo real** = 5 screenshots
do site rodando (`localhost:3015`, capturados via Playwright headless): Home,
Collection, PDP Aurora (Atelier/Bretda), PDP Aparato (Signature/Tocks), Configurador 3D.
Cada lente analisou independente → rodada adversarial → veredito priorizado.

Painel: Dieter Rams · Don Norman · Tobias van Schneider · Daniel Kahneman · Peep Laja · BJ Fogg.

---

## Pareceres independentes

### ⬜ Dieter Rams — honestidade funcional, "less but better"
- 🔴 **Desonestidade de produto:** no PDP da **Aparato (Tocks)** os 3 atos exibem a história
  da **Bretda** ("a single block of Brazilian hardwood, hand-finished over six hundred hours /
  one atelier in Brazil"). Tocks não é Bretda → o produto "aparece como algo que não é"
  (Princípio 6 violado).
- 🔴 **Affordance falsa:** swatches de madeira/tecido no PDP parecem selecionáveis mas só
  trocam um rótulo; não mudam o produto.
- 🟡 Configurador com piso de grade + ferramentas (Move/Grid/Photo) = andaime técnico
  intrusivo; esconder do comprador.

### ⬜ Don Norman — descoberta, signifiers, feedback
- 🔴 **Configurador (falha de descoberta):** trocar acabamento está escondido atrás de
  "Personalizar → clicar peça → classificar"; sem signifier. Usuário clica swatch e nada
  acontece (o bug que o founder sentiu).
- 🟡 Transição dark→light no meio da Collection faz duvidar da continuidade de marca.
- 🟡 "Reserve this table" e "Talk to a specialist" → mesmo WhatsApp = mapeamento confuso.

### ⬜ Tobias van Schneider — luxo, craft, encanto
- 🟢 Home + banda Atelier (dark) = luxo cinematográfico real.
- 🔴 Grade Signature (light) parece marketplace genérico — quebra o feitiço; bandas brigam.
- 🔴 Configurador parece CAD, não atelier; precisa de palco escuro/iluminado ("joia sobre veludo"), sem grade.

### ⬜ Daniel Kahneman — ancoragem, aversão à ambiguidade
- 🟢 Justificar antes do preço (atos) + flagship Aurora $23.800 como âncora alta primeiro = sequência correta.
- 🔴 Peso "On request" = lacuna que gera dúvida; fornecer ou omitir.
- 🟡 Dois CTAs grandes no momento da decisão = sobrecarga de escolha.

### ⬜ Peep Laja — CRO, fricção, prova
- 🔴 Conversão só por WhatsApp, sem fallback de e-mail/form — comprador EUA frequentemente
  não usa WhatsApp → vazamento no mercado-alvo.
- 🔴 Zero prova social/legitimidade ("isso é real?") além de "since 2009" no rodapé.
- 🟡 Mobile não avaliado.

### ⬜ BJ Fogg — B = MAP (motivação × habilidade × gatilho)
- 🔴 Habilidade baixa no configurador (classificar peças) → comportamento não acontece; reduzir a 1 toque.
- 🔴 Falta degrau pequeno antes do "Reserve" (amostras / salvar config / dossiê) — rampa
  intermediária (Eyal, v1) segue faltando.

---

## ⚔️ Rodada adversarial
- **Laja × Rams/Tobias:** prova social sim, mas com contenção (1 linha de imprensa + foto real
  de cliente, não sopa de selos que vira e-commerce).
- **Tobias × Laja:** manter a banda Signature (catálogo+preço convertem) mas **elevar o
  tratamento visual** (não virar grade de loja).
- **Kahneman × Fogg:** 1 CTA primário **+** 1 micro-compromisso (não dois botões grandes iguais).
- **WhatsApp-only:** manter WhatsApp como concierge primário **+** fallback de e-mail/form
  (não perder os EUA).

---

## 🎯 VEREDITO — fixes priorizados

### 🔴 P0 (quebrado / desonesto / mata conversão)
1. **Copy dos atos por linha** — Tocks não pode herdar a história da Bretda (bug real + Rams).
2. **Configurador: aplicar acabamento em 1 toque** (Personalizar vira modo avançado) — Norman/Fogg/Tobias.
3. **Fallback de e-mail/formulário** ao lado do WhatsApp — Laja/Norman.
4. **Swatches do PDP:** mudam o produto / abrem configurador, ou viram "available finishes" não-clicáveis — Norman/Rams.

### 🟡 P1
5. Degrau leve antes do "Reserve" (amostras / salvar config / dossiê) — Fogg/Eyal.
6. Elevar visual da Signature (sair do look marketplace) — Tobias.
7. Legitimidade com contenção (imprensa, sala real de cliente) — Laja+Rams.
8. Palco do configurador escuro/iluminado, sem grade CAD — Tobias/Rams.
9. 1 CTA primário (resolver duplo-WhatsApp) — Kahneman/Norman.
10. Peso: fornecer ou omitir — Kahneman.

### 🟢 P2
Auditoria mobile · reduzir cara de "e-commerce" dos badges · contraste do texto do hero.

---

## Achados que JÁ estão bons (não mexer)
- Home dark cinematográfico + hero vídeo + banda Atelier = luxo real (Tobias).
- Sequência justificativa-antes-do-preço + âncora alta Aurora $23.800 (Kahneman).
- Trust badges de logística (DDP/8-10wk/customs/arrival-guarantee) atacam a alavanca cross-border (v3).
- Specs reais com unidade por idioma (in/lb EN · cm/kg EU) — pedido anterior, entregue.

## Telas analisadas (evidência)
`scratchpad/shots/` → home.png · collection2.png · pdp-aurora.png · pdp-aparato.png · configurator.png
(capturados de localhost:3015, build commit `92b2132a`).

## ✅ P0 CORRIGIDOS (30/Jun/2026, branch feat/eniac-financeiro — build verde 190 págs, smoke-test HTTP)
1. **Copy dos atos por linha** ✅ — Pdp.tsx usa `product.line`; atelier mantém a história Bretda (single block / 600h), signature recebe copy honesto próprio (`objectVsig`/`houseSig`+`houseVsig`/`nowVsig`). Verificado no DOM renderizado: Aparato→"premium billiards table from our Signature line / One of eighteen Signature models / Made to order…" · Aurora mantém a Bretda. Traduzido EN/ES/DE/FR (ES conferido renderizando).
2. **Configurador 1-toque** ✅ (lógica) — engine ganhou `applyToClass`/`applyToSelected`/`ensureCustomizeOn`/`clearSelection`; clique no swatch nunca é silencioso: se a classe já tem superfície aplica na hora, senão **arma o acabamento + entra em pick-mode + "Tap the part of the table to apply X"** → ao tocar a peça aplica textura REAL + classifica (próximos cliques dessa classe = 1 toque). NÃO uso auto-classificação (o scene.ts:299 já avisava que embaralha). ⚠️ **3D visual NÃO verificável headless** — pede olho do founder; o dead-end de descoberta (Norman) está resolvido.
3. **Fallback e-mail** ✅ — `lib/inquiry.ts` ganhou `mailUrl()`+`EMAIL=atelier@bretda.com`; PDP CTA secundário virou "Enquire by email" (mailto, mata o duplo-WhatsApp do Kahneman tb); configurador ganhou link "Prefer email? Write to the atelier".
4. **Swatches PDP** ✅ — viraram display "Finishes available" não-clicável (`.swd`/`.finish-display`, `aria-hidden`, 0 `aria-pressed`) + nota + CTA 3D real só p/ produtos com `model`.
🔴 PENDENTE deste backlog: P1 (degrau pré-Reserve, elevar Signature, legitimidade, palco escuro config) + P2 (mobile). Founder ainda precisa: ver o 3D aplicando textura, preços reais, deploy Vercel.

## Liga
[[conclave-v1]] (mockups Stitch) · [[conclave-v3]] (i18n/cross-border) · `project_bretda_website_v2_24jun`.
