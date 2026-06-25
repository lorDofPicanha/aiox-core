# F3 — Stack de E-commerce, Template, Performance & Tracking

**Frente 3 da mega-pesquisa Bretda Website v2**
**Autor:** Aria (Architect) · **Data:** 2026-06-24 · **Status:** dev-ready
**Escopo:** stack lead-gen (não-checkout), schema multi-tier, templates, Core Web Vitals, tracking, i18n.

> Contexto absorvido de `bretda-redesign/00-context/{CONTEXT.md,BRIEF.md}` e `apps/bretda-lp/package.json`.
> Stack atual confirmada: **Next.js 16 + React 19 + Tailwind v4 + Three.js 0.162 + Sentry + Upstash Redis**, deploy Vercel.
> Restrições duras herdadas: **(1) preservar configurador 3D Three.js + 13 GLB; (2) ZERO `value` em events Meta** (dead-end documentado, perderam receita); (3) WhatsApp/form = conversão primária; (4) LGPD + footer CNPJ Blumenau.

---

## 0. TL;DR para o lead

1. **Stack: Next.js 16 App Router puro + Sanity (headless CMS) + Vercel.** NÃO adotar engine de commerce (Hydrogen/Medusa/Vendure/Crystallize/Saleor) — todos são **overkill** para 28 SKUs sob encomenda sem carrinho. Pagaríamos por infraestrutura transacional (checkout, GMV fees, cart, inventory, payments) que nunca usaremos. O site é editorial + catálogo + configurador + formulário.
2. **Schema multi-tier no CMS:** documentos `collection` (Atelier/Signature) → `category` (sinuca/pebolim/tênis/shuffleboard) → `product` (SKU) com `variantAxes` (madeira × tecido) e um campo `modelRef`/`glbSlug` que faz o **link 1:1 com o configurador 3D**. Tudo code-first, versionado no repo.
3. **Templates: nenhum vale como ponto de partida.** 100% do marketplace assume cart/checkout/Stripe — o oposto da Bretda. Servem como **referência visual**, não como base. Construir do zero sobre a stack atual (que já tem o configurador) é mais barato que arrancar checkout de um template.
4. **Performance:** metas LCP ≤ 2.5s / INP ≤ 200ms / CLS ≤ 0.1; hero por **poster AVIF + `priority`/`fetchpriority=high`**, vídeo defer; configurador 3D em `dynamic({ ssr:false })` carregado **depois** do LCP. Imagens via next/image AVIF + CDN Vercel.
5. **Tracking:** manter Meta CAPI server-side (Upstash já existe) **sem `value`**; adicionar **CAPI for Business Messaging** (`action_source: business_messaging`, `ctwa_clid`) para atribuir o WhatsApp como conversão primária; Google Enhanced Conversions for Leads (hash de email/phone do form); GA4 com eventos de configurador (`configurator_open`, `configurator_finish`, `whatsapp_handoff`).
6. **i18n: nascer i18n-ready com `next-intl`**, mas publicar só pt-BR. O custo de adicionar depois é alto (refactor de todas as rotas/strings); o custo de nascer pronto é baixo (estrutura de rotas + namespace de mensagens). Não traduzir conteúdo agora.

**Conteúdos analisados nesta frente: 38** (ver §10).

---

## 1. Stack de e-commerce lead-gen (não-checkout)

### 1.1 O diagnóstico arquitetural

A Bretda **não é uma loja transacional**. Não há carrinho, checkout, pagamento, gestão de estoque ou pedido online. A conversão é **lead/orçamento** (WhatsApp + formulário). O conteúdo é, por ordem de peso:

1. **Editorial** (hero, manifesto de marca, lifestyle, storytelling Atelier/Signature)
2. **Catálogo** (28 SKUs com renders, materiais, dimensões, acabamentos)
3. **Configurador 3D** (Three.js, 13 GLB — feature âncora)
4. **Formulário de orçamento** + handoff WhatsApp

Isso é **um site de conteúdo com um configurador**, não um e-commerce. A pergunta certa não é "qual engine de commerce", e sim "qual CMS de conteúdo + como expor catálogo estruturado".

> **Lente Werner Vogels / Frugal Architect (consultado):** custo é um requisito não-funcional de primeira classe e a complexidade deve ser colocada onde traz valor (Tesler's Law — a complexidade não some, só muda de lugar). Adotar um commerce engine **move complexidade para um lugar que não gera valor** aqui (todo o domínio de cart/order/payment fica ocioso) e adiciona custo de operação/manutenção permanente. Veredito alinhado: **não pague por transação que não existe.**

### 1.2 Matriz de decisão multicritério

Pesos (Σ=100) derivados do contexto: o que mais importa é **fit ao modelo lead-gen** e **custo/operação baixos** num catálogo pequeno; commerce features valem ~zero.

| Critério | Peso | Next.js + Sanity | Next.js + Payload | Shopify Hydrogen | Medusa | Vendure | Crystallize | Saleor |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Fit lead-gen (sem checkout) | 25 | **9** | 9 | 3 | 5 | 5 | 6 | 5 |
| Editorial + catálogo DX | 20 | **9** | 8 | 5 | 5 | 5 | 8 | 6 |
| Custo/hosting (28 SKUs) | 18 | **9** | 8 | 4 | 6 | 6 | 4 | 5 |
| Integração c/ stack atual (Next16/Three.js/Vercel) | 15 | **9** | 9 | 6 | 6 | 6 | 6 | 6 |
| Simplicidade operacional | 12 | **9** | 7 | 7 | 4 | 4 | 6 | 4 |
| Headroom export/i18n | 6 | 8 | 7 | 7 | 7 | 7 | 8 | 8 |
| Risco de overkill (↑melhor) | 4 | **9** | 8 | 2 | 4 | 4 | 4 | 3 |
| **Score ponderado** | 100 | **8.95** | **8.20** | 4.62 | 5.30 | 5.30 | 6.18 | 5.18 |

**Vencedor: Next.js App Router + Sanity (8.95).** Payload é vice forte (8.20) e a melhor alternativa se o founder quiser **self-host + data residency total** (open-source MIT, roda dentro do próprio Next.js). Todos os commerce engines ficam ≤ 6.2.

### 1.3 Sanity vs Payload (o desempate real)

| Eixo | Sanity | Payload |
|---|---|---|
| Modelo | SaaS managed (content lake na nuvem) | Open-source MIT, **roda dentro do Next.js** como plugin |
| Schema DX | Code-first (TS), GROQ query | Code-first (TS), tipos auto-gerados |
| App Router / Draft | First-class (`next-sanity`, `draftMode()`, `revalidateTag()`, Presentation) | Limpo arquiteturalmente (é Next.js; usa as APIs nativas) |
| Pricing | Free tier generoso (2 users, 500k req/mês) — cabe folgado em 28 SKUs | Só custo de hosting próprio |
| Editor não-técnico | Studio polido | Admin funcional, menos polido; mais onboarding |
| Data residency / lock-in | Content lake é cloud-only (lock-in moderado) | Você é dono do Postgres — zero lock-in |

**Recomendação: Sanity** como default (menos operação, free tier cobre, editor melhor para o founder mexer no catálogo sozinho). **Payload** se "data residency / zero lock-in / um único deploy" for prioridade declarada — neste caso ele compartilha o Postgres que o resto do ecossistema Bretda já usa (Supabase noutros projetos).

### 1.4 Por que NÃO cada commerce engine (alternativas descartadas, documentadas)

- **Shopify Hydrogen** — custo escala com GMV+apps (temos GMV zero); customização de checkout exige Shopify Plus (enterprise). É infraestrutura de transação para um site que não transaciona. **Descartado.**
- **Medusa / Vendure** — backends TS extensíveis para builds composable com lógica de checkout complexa; exigem time dedicado e infra ($50–500/mês) para um domínio (cart/order/payment) 100% ocioso. **Descartado** (reconsiderar só se a Bretda algum dia fizer venda transacional online — improvável dado o ticket sob encomenda).
- **Crystallize / Saleor** — fortes em product modeling avançado e multi-região; ainda são commerce engines quando precisamos de CMS. Crystallize tem CMS embutido decente, mas overhead + custo SaaS ($500+) não se justificam. **Descartado.**
- **commercetools** — enterprise/MACH, custo de 5–6 dígitos/ano. **Fora de cogitação.**

---

## 2. Arquitetura de catálogo MULTI-TIER (schema recomendado)

### 2.1 Modelo conceitual

```
collection (Atelier | Signature)        ← sub-coleção / tier de marca
   └─ category (sinuca | pebolim | tênis-de-mesa | shuffleboard)
        └─ product (SKU: Opal, Aurora, Âmbar, Citrino, Espinela, …)  ← 28 docs
             ├─ variantAxes: [ madeira[], tecido[] ]   ← eixos de variação
             ├─ renders: [ image ]  (PNG isolado + lifestyle JPG)
             ├─ specs: { dimensões, peso, prazo, garantia }
             └─ model3d: { glbSlug, available: bool }  ← link 1:1 c/ configurador
```

Decisões de modelagem (alinhadas ao padrão Sanity de catálogo editorializado):
- **Tier como documento `collection`, não como enum no produto.** Permite página de coleção própria (Atelier tem narrativa diferente de Signature) e que um produto migre de tier sem refactor.
- **Variantes como eixos (`variantAxes`), não como N documentos de variante.** Para sob-encomenda, madeira × tecido são **opções combinatórias** (não SKUs com estoque). Guardar os eixos (arrays de `{label, swatchImage, glbMaterialId}`) evita explosão de documentos e alimenta direto o configurador. (O padrão "array de variantes como documentos" só compensa quando há preço/estoque por variante — não é o caso.)
- **`category` como `reference`** (não string) → filtros GROQ limpos e página de categoria.
- **Link 1:1 com o configurador via `glbSlug`** que resolve para `public/models/{slug}.glb`, e `glbMaterialId` em cada swatch para mapear o material 3D. O CMS vira a **fonte de verdade** do que o configurador oferece (hoje isso está hardcoded em `constants.ts` no bretda-lp — migrar para o CMS reduz drift, que já causou bug de message-match documentado).

### 2.2 Schema Sanity (esqueleto code-first)

```ts
// schemas/collection.ts  (Atelier / Signature)
defineType({ name:'collection', type:'document', fields:[
  defineField({ name:'title', type:'string' }),        // "Atelier" | "Signature"
  defineField({ name:'slug', type:'slug' }),
  defineField({ name:'tier', type:'string',
    options:{ list:['atelier','signature'] } }),
  defineField({ name:'narrative', type:'array', of:[{type:'block'}] }), // editorial
  defineField({ name:'heroVideo', type:'file' }),
  defineField({ name:'heroPoster', type:'image' }),
]})

// schemas/category.ts
defineType({ name:'category', type:'document', fields:[
  defineField({ name:'title', type:'string' }),        // "Sinuca" …
  defineField({ name:'slug', type:'slug' }),
  defineField({ name:'vertical', type:'string',
    options:{ list:['sinuca','pebolim','tenis-de-mesa','shuffleboard'] } }),
]})

// schemas/product.ts
defineType({ name:'product', type:'document', fields:[
  defineField({ name:'name', type:'string' }),         // "Opal"
  defineField({ name:'slug', type:'slug' }),
  defineField({ name:'collection', type:'reference', to:[{type:'collection'}] }),
  defineField({ name:'category',   type:'reference', to:[{type:'category'}] }),
  defineField({ name:'renders', type:'array', of:[{type:'image',
    options:{ hotspot:true }}] }),
  defineField({ name:'lifestyle', type:'array', of:[{type:'image'}] }),
  defineField({ name:'specs', type:'object', fields:[
    /* dimensoes, peso, prazoEntrega, garantia */ ]}),
  // eixos de variação (combinatórios, sob encomenda — NÃO documentos-variante)
  defineField({ name:'variantAxes', type:'object', fields:[
    defineField({ name:'madeiras', type:'array', of:[{type:'object', fields:[
      {name:'label',type:'string'},{name:'swatch',type:'image'},
      {name:'glbMaterialId',type:'string'} ]}]}),
    defineField({ name:'tecidos', type:'array', of:[{type:'object', fields:[
      {name:'label',type:'string'},{name:'swatch',type:'image'},
      {name:'glbMaterialId',type:'string'} ]}]}),
  ]}),
  // link 1:1 com o configurador 3D
  defineField({ name:'model3d', type:'object', fields:[
    defineField({ name:'glbSlug', type:'string' }),     // → public/models/{slug}.glb
    defineField({ name:'configurable', type:'boolean' }),
  ]}),
]})
```

### 2.3 Como o front consome (GROQ + revalidação)

```groq
// página de produto
*[_type=="product" && slug.current==$slug][0]{
  name, renders, lifestyle, specs, model3d,
  "tier": collection->tier,
  "category": category->vertical,
  "madeiras": variantAxes.madeiras[]{label, glbMaterialId, "swatch": swatch.asset->url},
  "tecidos":  variantAxes.tecidos[]{label, glbMaterialId, "swatch": swatch.asset->url}
}
```
- Páginas estáticas (ISR) com `generateStaticParams` sobre os 28 slugs; `revalidateTag('product')` no webhook do Sanity.
- O configurador recebe `glbSlug` + os `glbMaterialId` dos swatches → mapeia 1:1 GLB ↔ materiais sem hardcode.

---

## 3. Templates / starters — avaliação crítica

**Veredito honesto: nenhum template serve como base; servem no máximo como referência visual.** Todo o marketplace de e-commerce Next.js é construído em torno de **cart → checkout → Stripe**, exatamente o que a Bretda não tem. Adaptar qualquer um deles significa **arrancar** metade do código (cart, checkout, payments, inventory) — mais caro e mais arriscado que construir sobre a stack atual, que **já tem o configurador 3D e o CAPI** funcionando.

| Template | URL | Avaliação para Bretda |
|---|---|---|
| Furnisy (furniture) | themeforest.net/item/furnisy-... | Visualmente é furniture, mas Redux/cart/checkout. **Referência de layout só.** ❌ base |
| NextMerce | nextmerce.com | Next16 + Sanity + Stripe. Sanity é bom sinal, mas é loja com checkout. ❌ |
| CozyCommerce | cozycommerce.dev | Next16 + Tailwind v4 + CMS embutido. Genérico/transacional. ❌ |
| Your Next Store | demo.yournextstore.com | TS limpo, mas é store. ❌ base |
| Shofy Jewelry | webbytemplate.com/.../starry-heavens | Estética luxo-joalheria. **Boa referência visual** de restraint. ❌ base |
| Medusa Next Starter | next.medusajs.com | Acoplado ao engine Medusa (descartado em §1). ❌ |
| Vercel Commerce / templates | vercel.com/templates | Demos de checkout. ❌ base |

**Recomendação:** construir do zero sobre `apps/bretda-lp` (ou app novo `apps/bretda-v2`), reaproveitando configurador + CAPI + tracking já existentes, e usar Furnisy/Shofy/11ravens apenas como **moodboard de layout**. O design já tem benchmark próprio (11ravens) na frente de UX — não importar genérico.

---

## 4. Performance — Core Web Vitals com mídia pesada

### 4.1 Metas concretas (p75, mobile)

| Métrica | Meta | Limite "ruim" |
|---|---|---|
| **LCP** | ≤ 2.5s | > 4.0s |
| **INP** | ≤ 200ms | > 500ms |
| **CLS** | ≤ 0.1 | > 0.25 |
| Hero (poster AVIF) peso | ≤ 200KB | — |
| JS inicial (sem configurador) | ≤ 180KB gz | — |

> Benchmark de referência: um hero JPEG 400KB não-otimizado empurra LCP > 4s; o **mesmo** como AVIF responsivo + preload entrega LCP < 1.2s.

### 4.2 Estratégia por elemento

**Hero (vídeo + imagem):**
- LCP = **poster AVIF**, não o vídeo. `next/image` com `priority` + `fetchpriority="high"` + `sizes` corretos; o poster vive no HTML inicial (preload scanner acha cedo).
- Vídeo autoplay **defer**: `preload="none"`, inicia só após o LCP renderizar. Nunca `loading="lazy"` no elemento LCP (17% dos sites pioram o LCP fazendo isso).
- 11ravens usa hero de vídeo 63s 1080p — para a Bretda, servir poster + vídeo via CDN com `playsInline muted loop`, e considerar versão mobile mais curta/leve.

**Imagens de produto (renders pesados):**
- `next/image` → AVIF/WebP automático, srcset responsivo, blur placeholder (`thumbhash` já está no projeto).
- CDN Vercel (cache até 31d). Para custo: limitar `formats` a `['image/avif']` ou `['image/webp']`, `quality` calibrado, `minimumCacheTTL` longo → menos transforms = menos custo de Image Optimization.
- Galerias de produto: lazy abaixo da dobra; **só o primeiro render** é eager.

**Configurador 3D (Three.js):**
- `dynamic(() => import('./Configurator'), { ssr:false })` dentro de um Client Component wrapper (App Router não permite `ssr:false` em Server Component direto).
- Carregar **após** o LCP (intersection observer ou interação) — nunca no bundle inicial; ele não pode bloquear a main thread no first paint.
- GLB já otimizados (~30K tris, base-color only — confirmado no BRIEF). Aplicar **delayed materials** (baixar textura por seleção, não tudo de uma vez) e Brotli no transfer.
- Code-split agressivo: o chunk do configurador é separado e só entra quando o usuário abre.

**Infra:**
- Páginas estáticas (ISR) → TTFB baixo via edge.
- Brotli/gzip, tree-shaking, sem JS síncrono no `<head>`.

---

## 5. Tracking & conversão (respeitando as restrições duras)

### 5.1 Restrição #1 — ZERO `value` em events Meta

**Inviolável.** Nenhum event Meta (browser OU server) carrega `value`/`currency`. Documentado como dead-end (perderam receita). Otimizar por **volume de lead qualificado**, não por valor. Isso também simplifica o CAPI: payload sem `custom_data.value`.

### 5.2 Camadas de tracking recomendadas

**A. Meta CAPI server-side (web) — já existe, manter**
- Edge function + Upstash Redis (dedup de `event_id`) já no projeto. Events: `Lead` (form submit), `Contact`, `ViewContent` (produto), `CustomizeProduct` (configurador). **Sem value.**

**B. Meta CAPI for Business Messaging (WhatsApp = conversão primária) — ADICIONAR**
Esta é a peça nova e a mais importante para a Bretda. O WhatsApp é a conversão primária e hoje é um buraco de atribuição (o usuário sai do browser).
1. Webhook do WhatsApp Cloud API recebe o `ctwa_clid` no objeto `referral` quando o lead vem de um anúncio Click-to-WhatsApp.
2. Persistir `ctwa_clid` por telefone no **Upstash** (TTL 28–90 dias) — reusa a infra que já temos.
3. Ao qualificar o lead (resposta no WhatsApp / sync CRM), disparar CAPI com:
   ```json
   { "event_name":"Lead", "action_source":"business_messaging",
     "messaging_channel":"whatsapp",
     "user_data":{ "whatsapp_business_account_id":"<WABA>", "ctwa_clid":"<clid>" } }
   ```
   **Sem value.** Meta casa o `ctwa_clid` de volta ao anúncio. As updates 2025/2026 dão **mais peso** a sinal server-side de messaging que ao browser-side.

**C. Google Ads — Enhanced Conversions for Leads — ADICIONAR**
- Hash local (SHA-256) de email/telefone do formulário → match do lead com clique no Google. Ativável direto no GA4 Admin (User-Provided Data) ou via server-side GTM. Casa com o que já fizemos no Bretda Google Ads (upload de compradores via API).

**D. GA4 — eventos de configurador + handoff**
- Key events: `configurator_open`, `configurator_select_wood`, `configurator_select_fabric`, `configurator_finish`, `whatsapp_handoff`, `quote_form_submit`.
- `whatsapp_handoff` é o evento-âncora (clique no botão WhatsApp) → também alimenta B e C.

### 5.3 Consent / LGPD
- Consent Mode v2 (Google) + gating de CAPI por consentimento. CNPJ/política no footer (já requisito). Hashing local antes de qualquer envio (UPD).

---

## 6. i18n / preparação para export (S. América primeiro)

**Recomendação: nascer i18n-ready, publicar só pt-BR.**

- **Lib: `next-intl`** — mais leve (~390KB vs stack i18next ~1.6MB), App Router/RSC first-class, ICU, curva de crescimento mais forte. (i18next só se quisermos pipeline gerenciado Locize/AI-translate — overkill agora.)
- **Custo de fazer agora (baixo):** estrutura de rotas `[locale]`, mensagens em namespace, `next-intl` provider. ~1–2 dias de setup, sem traduzir conteúdo.
- **Custo de fazer depois (alto):** refactor de TODAS as rotas para `[locale]`, extração de todas as strings hardcoded, re-test de SEO/hreflang. Multiplica com o tamanho do site.
- **Conteúdo do CMS:** Sanity/Payload suportam campos localizados (document-level ou field-level i18n) — modelar `title`/`narrative` como localizáveis desde já, popular só pt-BR. Espanhol entra sem mudança de schema.
- **SEO export:** `hreflang` + sitemap por locale prontos no `next-intl`.

**Veredito:** estrutura i18n **sim**; tradução **não** (até decisão de mercado). Marcar campos do CMS como localizáveis no design do schema é o movimento de menor custo/maior opção.

---

## 7. Arquitetura-alvo (resumo dev-ready)

```
┌─────────────────────────────────────────────────────────────┐
│  Next.js 16 App Router (Vercel)  ── [locale] routes (i18n)  │
│  ├─ / (editorial: hero poster AVIF + vídeo defer)           │
│  ├─ /colecao/[atelier|signature]  (collection narrative)    │
│  ├─ /categoria/[vertical]                                   │
│  ├─ /produto/[slug]  (ISR, GROQ)                            │
│  │     └─ <Configurator/> dynamic ssr:false (Three.js, GLB) │
│  └─ /orcamento  (form → Lead)                               │
│                                                             │
│  Tracking edge:                                             │
│   ├─ Meta CAPI (web, sem value) ── Upstash dedup            │
│   ├─ Meta CAPI Business Messaging (ctwa_clid) ── Upstash    │
│   ├─ Google Enhanced Conversions for Leads (hash)          │
│   └─ GA4 (configurator + whatsapp_handoff)                  │
└─────────────────────────────────────────────────────────────┘
            │ GROQ / webhook revalidateTag
            ▼
   Sanity (headless CMS) — collection/category/product/variantAxes/model3d
            │ glbSlug + glbMaterialId
            ▼
   public/models/*.glb (13 GLB preservados)
```

**Backward-compat:** reaproveita configurador, CAPI, Upstash, Sentry da stack atual. **Migração incremental** (não big-bang): catálogo sai de `constants.ts` para o CMS gradualmente; configurador permanece intocado.

**Segurança (flag):** CAPI tokens via env (System User Token Meta), hash local de PII (LGPD), webhook WhatsApp com verificação de assinatura, rate-limit (Upstash ratelimit já no projeto) no endpoint de form.

---

## 8. Trade-offs principais (sumário)

| Decisão | Ganho | Custo / risco |
|---|---|---|
| Next + Sanity vs commerce engine | Custo mínimo, fit perfeito, simplicidade | Se um dia precisar de checkout real, migrar (improvável) |
| Sanity (SaaS) vs Payload (self-host) | Menos operação, editor melhor | Lock-in moderado no content lake (mitigável: export) |
| Construir do zero vs template | Sem dívida de cart/checkout | Mais trabalho de UI inicial (mas design já tem benchmark) |
| i18n agora | Opção de export barata | ~1–2 dias setup sem retorno imediato |
| CAPI Business Messaging | Atribui WhatsApp (hoje cego) | Exige WABA + webhook + persistência clid |

---

## 9. Análise de sensibilidade da matriz (§1.2)

- Se o peso de **"headroom export/i18n"** subir de 6→20 (founder priorizar export agressivamente): Sanity continua 1º (8.7), Crystallize sobe mas não passa (6.6). **Decisão robusta.**
- Se **"data residency / lock-in"** virar critério duro (peso 20): **Payload ultrapassa Sanity** (self-host, dono do DB). Esse é o único cenário em que a recomendação vira Payload.
- Nenhum cenário plausível faz um commerce engine vencer sem a Bretda virar transacional — o que contradiz o modelo sob-encomenda.

---

## 10. Bibliografia anotada (com scores) — 38 conteúdos analisados

**Score:** 5=doc oficial/primário · 4=análise técnica forte · 3=comparativo secundário · 2=marketing com dado útil.

**Stack / CMS / commerce (12)**
1. [web.dev — Optimize LCP](https://web.dev/articles/optimize-lcp) — **5** — fonte primária LCP (poster vs vídeo, fetchpriority, defer 3D).
2. [web.dev — LCP](https://web.dev/articles/lcp) — **5** — thresholds 2.5/4.0s, 76% LCP é imagem.
3. [focusreactive — best Next.js headless ecommerce](https://focusreactive.com/best-nextjs-headless-ecommerce-platforms/) — **4** — matriz overkill vs right-sized; tabela de preços; veredito Next+CMS.
4. [dev.to — Best headless CMS Next.js 2026](https://dev.to/nayankyada/best-headless-cms-for-nextjs-in-2026-sanity-vs-contentful-vs-payload-vs-storyblok-557k) — **4** — Sanity/Payload/Contentful/Storyblok DX, pricing cliffs.
5. [Payload CMS](https://payloadcms.com/) — **5** — doc oficial (roda dentro do Next, MIT).
6. [next-sanity / Sanity App Router](https://www.sanity.io/learn/course/editorialized-ecommerce-experiences/next-block-curated-products) — **5** — padrão catálogo editorializado + referências.
7. [Sanity — Introduction to schemas](https://www.sanity.io/docs/apis-and-sdks/introduction-to-schemas) — **5** — schema code-first.
8. [Sanity — reference type](https://www.sanity.io/docs/studio/reference-type) — **5** — category/collection como reference.
9. [Sanity answers — variants array vs documents](https://www.sanity.io/answers/discussing-optimal-schema-for-product-variants-in-sanity-with-stripe-paypal) — **4** — quando array vs documento-variante.
10. [Halo Lab — flexible Sanity schemas](https://www.halo-lab.com/blog/creating-schema-in-sanity) — **3** — boas práticas de schema escalável.
11. [buildwithmatija — headless ecommerce comparison](https://www.buildwithmatija.com/blog/headless-ecommerce-platforms-comparison) — **3** — (429 no fetch; usado via snippet de busca).
12. [Vendure — best headless commerce 2026](https://vendure.io/blog/best-headless-commerce-platforms) — **3** — posicionamento Vendure/Medusa/Saleor.

**Templates (6)**
13. [nextjstemplates — best Next.js ecommerce templates](https://nextjstemplates.com/blog/best-nextjs-ecommerce-templates) — **3** — lista + assessment (todos transacionais).
14. [Furnisy (ThemeForest)](https://themeforest.net/item/furnisy-furniture-ecommerce-react-nextjs-tailwind-template/56751744) — **2** — furniture, mas cart/checkout.
15. [Shofy Jewelry template](https://www.webbytemplate.com/product/starry-heavens-jewelry-tailwind-with-next-js-template/) — **2** — referência visual luxo.
16. [Vercel templates](https://vercel.com/templates/next.js) — **3** — todos demos de checkout.
17. [MarcosCamara01/ecommerce-template (GitHub)](https://github.com/MarcosCamara01/ecommerce-template) — **3** — Next16/TS, mas transacional.
18. [designrevision — best Next.js ecommerce templates](https://designrevision.com/blog/best-nextjs-ecommerce-templates) — **2** — ranking genérico.

**Performance / 3D (8)**
19. [threejsresources — Three.js + Next.js 2026](https://threejsresources.com/frameworks/three-js-nextjs) — **4** — `dynamic ssr:false`, wrapper client.
20. [Medium — ssr:false trap App Router](https://medium.com/@joshisagarm3/the-ssr-false-trap-in-next-js-app-router-and-how-i-escaped-it-74816bc7a778) — **3** — limitação RSC + workaround.
21. [Next.js — Lazy Loading guide](https://nextjs.org/docs/pages/guides/lazy-loading) — **5** — `next/dynamic` oficial.
22. [Vercel — Image Optimization](https://vercel.com/docs/image-optimization) — **5** — AVIF/WebP, CDN, cache 31d.
23. [Vercel — Managing image optimization costs](https://vercel.com/docs/image-optimization/managing-image-optimization-costs) — **5** — limitar formats/quality/TTL para custo.
24. [Zakeke — 3D configurator performance](https://zakeke.zendesk.com/hc/en-us/articles/14682779731356) — **3** — delayed materials, texture atlas.
25. [corewebvitals.io — fix slow hero images](https://www.corewebvitals.io/pagespeed/fix-slow-hero-images-core-web-vitals) — **3** — hero AVIF + preload.
26. [dev.to — Fix LCP/INP/CLS 2026 benchmarks](https://dev.to/dharanidharan_d_tech/fix-lcp-inp-cls-in-2026-the-complete-core-web-vitals-guide-with-real-benchmarks-54cl) — **3** — benchmarks reais.

**Tracking (8)**
27. [seresa.io — CTWA attribution black hole](https://seresa.io/blog/attribution-measurement/click-to-whatsapp-ads-are-your-biggest-attribution-black-hole) — **4** — ctwa_clid, business_messaging, sem value.
28. [insiderone — Meta CAPI for CTWA](https://academy.insiderone.com/docs/meta-conversions-api-for-click-to-whatsapp-ads) — **4** — campos action_source/messaging_channel.
29. [digitalmicroenterprise — WhatsApp conversion tracking](https://digitalmicroenterprise.com/whatsapp-conversion-tracking) — **3** — por que atribuição quebra.
30. [Meta CAPI complete guide 2025 (budindia)](https://www.budindia.com/blog/meta-conversion-api-complete-guide-for-2025.php) — **3** — CAPI server-side geral.
31. [dataally — Meta CAPI 2026 guide](https://www.dataally.ai/blog/how-to-set-up-meta-conversions-api) — **3** — setup CAPI.
32. [groas.ai — Google Ads tracking 2026 (GA4+EC+Consent)](https://groas.ai/post/google-ads-conversion-tracking-setup-2026-the-complete-guide-ga4-enhanced-conversions-consent-mode) — **4** — Enhanced Conversions for Leads + Consent Mode.
33. [Stape — GA4 + Google Ads Enhanced Conversions](https://stape.io/blog/ga4-and-google-ads-enhanced-conversions-tracking-setup-guide) — **4** — UPD, hash local.
34. [Simo Ahava — Google Ads server-side GTM](https://www.simoahava.com/analytics/google-ads-server-side-tagging-google-tag-manager/) — **5** — autoridade em server-side tagging.

**i18n (4)**
35. [Locize — next-intl vs next-i18next](https://www.locize.com/blog/next-intl-vs-next-i18next/) — **3** — bundle, App Router, trade-offs.
36. [next-intl — App Router docs](https://next-intl.dev/docs/getting-started/app-router) — **5** — doc oficial.
37. [Next.js — i18n guide](https://nextjs.org/docs/pages/guides/internationalization) — **5** — roteamento de locale.
38. [intlayer — next-i18next vs next-intl vs intlayer 2026](https://intlayer.org/blog/next-i18next-vs-next-intl-vs-intlayer) — **3** — comparativo de custo precoce vs tardio.

---

*— Aria, arquitetando o futuro 🏗️*
