# Lifestyle Assets Gap — Bretda Collection Gallery

**Context:** Design audit P0 (N10 violation) exige migrar cutout PNGs → lifestyle JPGs em `eleven-collection-gallery.tsx`. Este doc inventaria o que **JÁ existe** vs o que **falta fotografar**.

**Source:** filesystem scan de `D:\AIOS\apps\bretda-lp\public\img\colecao\` + cross-check com `src/lib/models.ts` (12 SKUs canon).

---

## 1. Inventário atual (2026-05-15)

| SKU slug | Categoria | modeloSlug | Ambiente JPGs | Branco JPGs | Orbit PNGs (legacy) | Status lifestyle |
|----------|-----------|------------|:-:|:-:|:-:|:----|
| `ambar-sinuca` | sinuca | ambar | **3** | 3 | 3 | ✅ Completo |
| `opal-sinuca` | sinuca | opal | **3** | 2 | 2 | ✅ Completo |
| `espinela-sinuca` | sinuca | espinela | **3** | 1 | 1 | ✅ Completo |
| `aurora-sinuca` | sinuca | aurora | **3** | 1 | 1 | ✅ Completo |
| `citrino-sinuca` | sinuca | citrino | **3** | 2 | 2 | ✅ Completo |
| `zurita-sinuca` | sinuca | zurita | **3** | 1 | 1 | ✅ Completo |
| `citrino-tenis-de-mesa` | tênis | citrino | reusa sinuca | reusa | reusa | 🟡 Borrow OK |
| `ambar-shuffleboard` | shuffleboard | ambar | reusa sinuca | reusa | reusa | 🟡 Borrow OK |
| `ambar-pebolim` | pebolim | ambar | reusa sinuca | reusa | reusa | 🟡 Borrow OK |
| `opal-pebolim` | pebolim | opal | reusa sinuca | reusa | reusa | 🟡 Borrow OK |
| `cobal-tenis-de-mesa` | tênis | cobal | **0** | 1 | 1 | 🔴 **FALTA** |
| `berilo-pebolim` | pebolim | berilo | **0** | 1 | 1 | 🔴 **FALTA** |

**Resumo:**
- ✅ 6 SKUs com lifestyle nativo (todas sinuca)
- 🟡 4 SKUs com lifestyle herdado da família (Citrino tênis usa Citrino sinuca, etc — pattern "one continuous family" do models.ts)
- 🔴 2 SKUs **sem nenhuma foto lifestyle** (Berilo pebolim + Cobal tênis de mesa — adicionados em 2026-05-05 sem session de fotografia)

---

## 2. O que o S0.5 deve fazer

**Sprint 0 (curto prazo):**
1. Em `eleven-collection-gallery.tsx`, trocar referência `orbit-{N}.png` → `ambiente-{N}.jpg` (caminho via `lifestyleImage` do models.ts).
2. Para os 10 SKUs com cobertura (6 nativos + 4 borrow), funciona imediatamente.
3. Para Berilo + Cobal (sem ambiente): fallback temporário pra `branco-1.jpg` (white-bg render) **NÃO `orbit-1.png` cutout**. Branco-bg render é **menos pior** que cutout flutuante em charcoal — pelo menos parece foto, não silhueta.
4. Adicionar comentário no código: `// TODO: Berilo + Cobal lifestyle photography pending (see lifestyle-assets-gap.md)`

**Sprint 2 commissioned shoot (médio prazo):**
1. Comissionar sessão de fotografia/render Enscape para Berilo + Cobal.
2. 3 ambiente JPGs por SKU, 1600×1200, ~150KB cada (mesmo padrão dos 6 sinuca canon).
3. Substituir branco-1 fallback após shoot.

---

## 3. Especificação da fotografia lifestyle (para Berilo + Cobal)

**Quando comissionar (Sprint 2 ou phase 3 pré-redesign final):**

### Berilo (pebolim)
- Single SKU pebolim de tier premium (não é mesa de bar comum)
- **Contexto recomendado:** ambiente residencial de mansão Alphaville-style ou apartamento de cobertura, **NÃO** game room óbvio. Posicionar mesa em sala de estar/lounge com elementos editoriais (poltrona Eames, luminária Tom Dixon, livros de design).
- **Mood:** "Cassina pebolim" — restraint, não fluff. Câmera baixa, depth of field, golden hour ou cinematic interior lighting.
- 3 ângulos canon: (1) overall environmental wide, (2) detail material/craft, (3) human scale com pessoa segurando handle (sem rosto idealmente).

### Cobal (tênis de mesa)
- Single SKU tênis de mesa premium
- **Contexto recomendado:** ambiente arquitetura moderna BR (Studio MK27, Triptyque, Felipe Hess vibe). Sala neutra com pé-direito alto.
- **Mood:** "objeto escultórico" — mesa de tênis lê como peça de arte residencial, não esporte.
- 3 ângulos canon: igual Berilo.

**Não aceitar:**
- ❌ Fotos genéricas de showroom (igual ML/MadeiraMadeira)
- ❌ Render IA/Stable Diffusion (regra `feedback_ai_image_anti_tells.md`)
- ❌ Backgrounds clichê de tênis (mesa em ginásio, quadra)
- ❌ Backgrounds clichê de pebolim (boteco, garagem)

**Aceitar:**
- ✅ Render Enscape em alta qualidade (Bretda já tem 5 Enscape renders integrados — `docs/projects/bretda-redesign/15-enscape-integration/`)
- ✅ Fotografia profissional in-situ em projeto real entregue (Bretda tem clientes em Alphaville/SC/SP)
- ✅ Composite manual em Photoshop (mesa real + background real, sem IA)

---

## 4. Próximo passo

**Decisão do Breno** (não-bloqueante pra Sprint 0):
1. **Quem fotografa Berilo + Cobal?**
   - (a) Paulinho (3D renderer que já fez os 6 sinuca canon — orçamento ~R$300-500/SKU × 2 = R$600-1000)
   - (b) Fotógrafo profissional em projeto real entregue (mais caro, mais autêntico — R$2-5k/sessão)
   - (c) Render Enscape próprio (custo zero se time interno faz)
2. **Quando?** Sprint 2 (próximas 2 semanas) ou Phase 3 (mês 2+)?

**Sprint 0 não bloqueia nessa decisão** — fallback `branco-1.jpg` permite shipping imediato pós-S0.5.

---

*Asset gap analysis · 2026-05-15 · pre-Sprint 0 S0.5 reference*
