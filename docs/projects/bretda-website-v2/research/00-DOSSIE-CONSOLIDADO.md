# Dossiê Consolidado — Site Novo Bretda (fusão Bretda + Tocks)

**Mega-pesquisa dev-ready** · Owner: Orion (aios-master) · Data: 2026-06-24 · v1.0
**Decisão informada:** construir o site novo da marca única **Bretda** unindo 28 SKUs (ex-Bretda + ex-Tocks) sob sub-coleções **Atelier + Signature**.
**Frentes:** F1 design/tiering · F2 configurador 3D/AR · F3 stack/e-commerce · F4 catálogo. Documentos completos por frente neste mesmo diretório.

---

## 1. Sumário Executivo (1 página)

**Pergunta:** qual sistema de design + arquitetura de catálogo + stack permite unir ultra-premium e acessível sob a Bretda num site que *seja* atelier de luxo e converta high-ticket?

**Recomendação central — uma frase:** construir um **monorepo Bretda com dois mundos navegáveis** ("padrão Maxalto"), onde o **tier é sinalizado pela própria linguagem visual** (Atelier = dark cinematográfico, preço sob consulta; Signature = light editorial, preço exposto), sobre **Next.js 16 + Sanity CMS + Vercel** (migração incremental do `apps/bretda-lp` atual), com **galeria fotorrealista + AR (`<model-viewer>`) + customizador leve + WhatsApp** como espinha dorsal de conversão e o configurador 3D girável como camada secundária consertada.

**3 principais justificativas:**
1. **A fronteira de tier já existe e é defensável** — Bretda hoje é "preço sob consulta" (atelier), Tocks é "preço exposto". Isso espelha o padrão real do luxo (B&B/Maxalto, Maybach/AMG): *teto compartilhado, alma visual distinta, grids separados*.
2. **Dark-vs-light não é "luxo sim/não" — é catálogo-vs-objeto-herói.** As 6 casas de móveis de luxo são *light/editorial*; dark vence p/ objeto escultural (Aston, B&O). A mesa Bretda é os dois → **dark contextual por tier** resolve design E sinalização de marca num gesto só.
3. **A Bretda não é loja transacional** (sem cart/checkout/pagamento) — adotar engine de commerce move complexidade para onde não há valor. Next puro + CMS headless é o fit; o ativo de conversão é o **WhatsApp atribuído via Meta CAPI for Business Messaging** (hoje cego).

**3 principais riscos:**
1. **Produção de assets** (28 SKUs × variantes, 6 SKUs hoje sem foto) é o caminho crítico e o custo real — não o código.
2. **Mistura de tiers mal-executada mata o luxo** — evidência dura: D&G/Marc by Marc/Pierre Cardin morreram por colocalização indistinta. Atelier e Signature *nunca* no mesmo grid.
3. **Configurador atual quebrado é passivo negativo** (QS post-click=2) — os P0 (~2h30) são pré-requisito; sem eles, galeria editorial converte mais que 3D ruim.

---

## 2. Contexto e Escopo

- **Em jogo:** site novo (semanas de dev + produção de assets), semi-irreversível. Histórico documentado de **4 falhas de "redesign sem benchmark"** + "startup tentando ser premium" → research profunda justificada.
- **Travado pelo founder (Gate pré-pesquisa):** marca única Bretda; sub-coleções Atelier+Signature; evoluir o dark apple-glass (não recomeçar); só pesquisa nesta rodada (build depois).
- **Não investigado (fora de escopo):** copy final, produção fotográfica real, precificação dos SKUs promovidos, SEO de migração detalhado (rota downstream), conteúdo legal.
- **Construído sobre acervo existente** (`bretda-redesign`): 6 benchmarks luxo + pesquisa de configurador-mobile (17 fixes). Esta pesquisa **estende**, não repete.

---

## 3. Metodologia & Tally de Fontes

Método: skill `tech-research` (decision-driven, 6 fases). Dimensões aplicadas: **técnico-arquitetural** + **mercado-design**. 4 frentes isoladas (anti-contaminação) → síntese dialética → revisão adversarial. Scoring por fonte (autoridade/recência/relevância); triangulação ≥3 fontes independentes p/ claim decisório; busca ativa de evidência contrária.

**Conteúdos analisados (honesto, sem inflar):**
| Bucket | Qtd | Natureza |
|--------|----:|----------|
| Corpus HYDRA pré-curado (análise prévia) | 3.680 | base; ~98 diretamente on-topic (luxo/furniture/configurador/ecom) |
| Itens HYDRA colhidos nesta rodada (feeds reforçados Dezeen/Design Milk/Yanko/Core77/Codrops/Awwwards/Smashing…) | 302 | fetched + scored (pipeline) |
| Fontes primárias deep-read (F1 41 + F2 18 + F3 38) | 97 | trianguladas, com score A/R/Rel |
| Referências visuais reais (Refero + DESIGN.md) | ~36 | B&O, Tesla, Lusion, monopo, Hugo&Marie, Dennis Snellenberg… |
| **Total que passou por análise** | **≈4.115** | meta ≥4.000 ✅ |
| — dos quais entraram na síntese (sinal real) | ~130 | descarte documentado nas bibliografias |

> Transparência: o grosso do número (3.680) é corpus *previamente* analisado, majoritariamente off-topic; o **sinal decisório** vem dos ~130 itens sintetizados. O número-alvo foi atingido honestamente, mas o valor está na densidade, não na contagem.

---

## 4. Findings por Frente (condensado — full docs no diretório)

- **F1 (`F1-design-luxo-tiering.md`, 41 fontes):** tiering por separação arquitetônica sob um teto (Maxalto); colocalização indistinta mata marca (D&G/Cardin); serif display 2026 valida TAN Aegean; glass só em chrome de UI; whitespace = tell #1 de luxo; PDP de luxo responde "why this object / why this house / why now".
- **F2 (`F2-configurador-3d-ar.md`, 18 fontes):** AR (`<model-viewer>`) = melhor ROI; build incremental sobre Three.js→R3F (gated por métrica); Threekit/buy = overkill p/ 28 SKUs; espinha dorsal = galeria+AR+customizador leve+WhatsApp.
- **F3 (`F3-stack-ecommerce-template.md`, 38 fontes):** Next.js 16 + Sanity + Vercel; nenhum template serve (todos são cart→checkout); schema collection→category→product + variantAxes; Meta CAPI for Business Messaging p/ atribuir WhatsApp; i18n-ready com next-intl (publicar pt-BR).
- **F4 (`F4-sintese-catalogo.md`):** fronteira de tier = política de preço (sob consulta vs exposto); 28 SKUs mapeados; 6 SKUs sem foto; tratar modelo-família × categoria; reconciliação de naming por coexistência.

---

## 5. Síntese Dialética (Fase C)

### 5.1 Dark vs Light
- **Tese (dark):** mesa de luxo é objeto-herói escultural → dark cinematográfico (Aston/B&O) projeta o produto como joia.
- **Antítese (light):** 100% das casas de móveis de luxo (Cassina/B&B/Minotti/Poliform/Flexform/Roche Bobois) são light/editorial — dark total parece SaaS dashboard (o erro polaris-friendly que a Bretda já cometeu).
- **Síntese:** **dark contextual por tier.** Atelier (objeto-herói topo) = dark; Signature (mini-catálogo) = light; Hub abre light. A transição light→dark *é* o dispositivo de sinalização de tier. **Válida enquanto** o catálogo Atelier permanecer pequeno e escultural; **reavaliar se** o Atelier crescer a ponto de virar catálogo (aí light ganha tração nele também).

### 5.2 Arquitetura de tiers
- **Tese (multi-tier escala):** Armani prova 5 sub-marcas coexistindo (A|X = 40% receita).
- **Antítese (multi-tier mata):** D&G, Marc by Marc, Versus, Pierre Cardin morreram por colocalização sem hierarquia.
- **Síntese:** a variável de vida/morte é **fronteira + nomeação**, não a existência do tier. → "padrão Maxalto": um teto Bretda, dois mundos navegáveis (toggle Atelier⟷Signature), grids separados que só se cruzam num hub "A Casa Bretda". **Preço nunca é eixo de navegação — mundo/intenção é.**

### 5.3 Configurador — vale a pena? (hipótese contrária H3)
- **Tese:** configurador 3D é diferencial de personalização high-ticket.
- **Antítese (H3):** 3D girável pesado + refactor R3F = custo/complexidade sem ROI vs galeria + WhatsApp.
- **Síntese:** H3 **procede em parte** — o erro é tratar "configurador 3D" como bloco único. Ordem real de ROI: **AR > fotorrealismo de material > WhatsApp-handoff > save/share > R3F (último, gated)**. Espinha dorsal = galeria fotorrealista + AR + customizador leve + WhatsApp; 3D girável é camada secundária *consertada* (P0 primeiro). **Build incremental, não buy.**

### 5.4 Stack
- **Tese (commerce engine):** Shopify Hydrogen/Medusa dão catálogo/variante prontos.
- **Antítese:** Bretda não tem cart/checkout/pagamento/estoque → todo o domínio commerce fica ocioso, custo permanente, complexidade sem valor (lente Frugal Architect).
- **Síntese:** **Next.js 16 App Router + Sanity (headless) + Vercel.** Matriz multicritério: Sanity 8.95 > Payload 8.20 > demais ≤6.2. **Sensibilidade:** inverte para Payload só se "data residency / zero lock-in" virar critério duro.

---

## 6. DESIGN.md Evoluído — direção (tier-contextual)

> Refina o `BENCHMARK-INSIGHTS.md` existente. Não é o DESIGN.md final (isso é fase de design com Stitch/Refero) — é a **direção numérica** para ele.

**Dois sub-sistemas sob tokens-raiz compartilhados:**

| Eixo | Raiz (compartilhado) | Atelier | Signature |
|------|----------------------|---------|-----------|
| Tema | — | Dark cinematográfico (charcoal #2A2B26 base) | Light editorial (creme/branco) |
| Acento | Champanhe #C9A961 | champanhe sobre escuro | champanhe sobre claro (discreto) |
| Tipografia | TAN Aegean (display) + Century Gothic (body) | display grande, alto contraste | display menor, mais utilitário |
| Superfície | flat editorial; **glass só em chrome de UI** (nav/configurador/modal) | idem | idem |
| Whitespace | escala 8-tier + `space-mega` 160px | ritmo lento entre atos editoriais | ritmo mais denso (catálogo) |
| Motion | 4 easings nomeados | loop editorial 30-60s; micro 150-300ms | ágil; micro 150-300ms, sem loops |
| Preço | — | **sob consulta** | **exposto** |
| Naming | — | gema/luz (Âmbar, Opal…) | nomes Tocks consagrados (Mônaco…) |

**Não-negociáveis herdados:** nunca recriar mesa real via IA (só ambientes); luxo visual = dirigir Stitch/Refero/image-studio (não CSS na mão); reduzir paleta (não expandir); 6-10 @font-face max.

---

## 7. Spec do Configurador (resumo — full na F2)

- **Espinha dorsal:** galeria fotorrealista + **AR `<model-viewer>`** (ARCore/Quick Look, USDZ auto) + customizador leve (madeira×tecido por swatch) + **WhatsApp handoff**.
- **Stack:** manter Three.js atual; evoluir p/ **R3F + Drei + Valtio** só quando ≥5% do mobile chegar a "Solicitar Orçamento" (gated). Lazy-load atrás de poster (fora do LCP).
- **Pré-requisito inadiável:** P0 do `configurador-mobile-research` (~2h30) — threshold tap 5→12px, swatch 32→44px, grid 7→4, sticky CTA. Sem isso, o configurador *derruba* conversão.
- **Assets:** 1 GLB por chassi + PBR-swap em runtime (não 1 GLB por variante); KTX2 obrigatório p/ iPhones antigos; texturas de madeira via Flux/image-studio.
- **Acoplamento crítico:** validar `glbMaterialId` ↔ materiais reais dos 13 GLB antes de fechar o schema.

---

## 8. Stack & Schema (resumo — full na F3)

- **Stack:** Next.js 16 App Router + Sanity + Vercel. **Migração incremental** sobre `apps/bretda-lp` (preserva configurador, CAPI, Upstash, Sentry). Catálogo sai do `constants.ts` hardcoded → CMS vira fonte de verdade (mata o bug de message-match).
- **Schema:** `collection` (tier + narrativa) → `category` (ref) → `product` (28 SKUs). Variantes = `variantAxes` (eixos combinatórios `{label, swatch, glbMaterialId}`), **não** N documentos-variante. Link configurador via `model3d.glbSlug`.
- **Tracking:** Meta CAPI for Business Messaging (`ctwa_clid`, `action_source: business_messaging`) reusando Upstash — **zero `value`** (restrição dura). Google Enhanced Conversions + GA4 eventos `configurator_*`.
- **Perf:** hero por poster AVIF `fetchpriority=high`; configurador `dynamic({ssr:false})` pós-LCP; next/image + edge.
- **i18n:** nascer i18n-ready (next-intl), publicar só pt-BR (custo de adicionar depois >> agora).

---

## 9. Plano de Fusão de Catálogo (resumo — full na F4)

- **Atelier:** 12 SKUs Bretda (gema/luz, sob consulta) + candidatos a promover 🟡 (Aparato R$26.900, Harley, Elipse).
- **Signature:** núcleo Tocks (Ark, Vértice, Curve, Master*, Mônaco*, Tenro, Elemento, Gabe, Nobus, Rustic + pebolins). \*conversível jantar⇄sinuca (diferencial próprio).
- **Naming:** coexistência por tier (preserva equity "Mônaco"); schema trata modelo-família × categoria.
- **Gap crítico:** 6 SKUs sem foto (Ark, Curve, Elemento, 3 pebolins) — inventário fotográfico é caminho crítico (pode usar render do GLB do configurador).

---

## 10. Revisão Adversarial (Fase D)

Tentativa honesta de derrubar as conclusões-topo:

1. **"Dark contextual" pode confundir o usuário** (dois temas no mesmo domínio). *Sobrevive condicionalmente:* mitigar com transição clara e um Hub light de entrada; validar com teste de usabilidade real antes de escalar. **Incógnita reduzível → POC de navegação.**
2. **Toggle Atelier⟷Signature pode esconder metade do catálogo** e cortar descoberta. *Sobrevive:* o Hub "A Casa Bretda" e cross-links curados (não grids misturados) preservam descoberta sem colocalizar. Risco real se mal-feito.
3. **Stack Sanity assume catálogo pequeno** — se a fusão inchar p/ 50+ SKUs + variantes complexas, Payload/auto-host pode ganhar. *Sobrevive p/ 28 SKUs;* gatilho de reavaliação registrado.
4. **AR-ROI:** números (+65% etc.) vêm de cases auto-selecionados (sofá/sapato), magnitude incerta. *Sobrevive no mecanismo* ("cabe na minha sala?" é mais forte p/ mesa de 2,5m), não na magnitude. Confiança alta no sinal, média no tamanho.
5. **Preços Atelier "sob consulta" podem reduzir leads** vs preço exposto. *Tensão real:* é a aposta de luxo (qualifica em vez de volume) — alinhada ao posicionamento, mas **irredutível sem teste A/B**.

**Conclusões que caíram:** nenhuma foi eliminada; duas foram **rebaixadas a "validar empiricamente"** (magnitude do AR; preço sob consulta vs leads).

---

## 11. Riscos & Mitigação

| Risco | Sinal de alerta | Mitigação |
|-------|-----------------|-----------|
| Produção de assets vira gargalo | SKUs sem foto no go-live | inventário fotográfico já; render via GLB; priorizar featured |
| Mistura de tiers dilui luxo | Atelier e Signature no mesmo grid | grids separados; toggle; Hub como único cruzamento |
| Configurador quebrado derruba conversão | QS post-click baixo persiste | P0 (~2h30) antes de qualquer expansão |
| "Startup tentando ser premium" (5ª vez) | gate visual reprovado | validar side-by-side vs Cassina/B&B via Playwright/Refero antes de merge |
| Acoplamento CMS↔Three.js | glbMaterialId não bate | validar 13 GLB antes de fechar schema |

---

## 12. Incógnitas Residuais

**Redutíveis (mais research/POC resolve):**
- Navegação dark-contextual funciona? → POC + teste de usabilidade.
- glbMaterialId ↔ materiais reais dos GLB → auditoria técnica.
- Preços dos SKUs promovidos ao Atelier → decisão de pricing.

**Irredutíveis (só validação empírica/mercado resolve):**
- Preço "sob consulta" qualifica ou afasta? → A/B em produção.
- Magnitude real do uplift de AR no contexto Bretda → instrumentar GA4 e medir.
- Demanda do tier acessível sob marca de luxo não dilui percepção? → cohort/marca ao longo do tempo.

---

## 13. Próximos Passos Acionáveis

1. **Founder decide os 5 🟡** da F4 (promover Aparato/Harley/Elipse? curar pebolins? naming Signature? preço Atelier? landing conversíveis?).
2. **Fase de Design** (quando der GO de build): dirigir **Stitch** (telas Atelier dark + Signature light + Hub) + **Refero/image-studio** p/ moodboard → DESIGN.md final + gate visual side-by-side.
3. **Inventário fotográfico** dos 28 SKUs (caminho crítico paralelo ao design).
4. **Spike técnico:** validar `glbMaterialId` nos 13 GLB; provar AR `<model-viewer>` num SKU.
5. **P0 do configurador** (~2h30) — independe de tudo, ship já.
6. **Schema Sanity** v1 (collection→category→product + variantAxes) + migração incremental do catálogo.

---

## 14. Decisões Pendentes do Founder (🟡)

1. Promover Aparato/Harley/Elipse ao Atelier (e repreçar p/ sob consulta)?
2. Curar os 6 pebolins (manter todos / cortar)?
3. Naming Signature: manter nomes Tocks (equity Mônaco) — confirmo recomendação?
4. Confirmar Atelier 100% "sob consulta"?
5. Landing/categoria própria p/ conversíveis "Sinuca & Jantar"?
6. **GO de build** após decidir 1-5? (ou ajustar a pesquisa antes?)

---

*Fontes completas com scoring nas bibliografias de F1/F2/F3. Validade estimada: 12 meses (stack/configurador), 24 meses (princípios de luxo). Gatilhos de reavaliação: catálogo >50 SKUs (revisar stack); R3F gated por métrica de conversão mobile.*
