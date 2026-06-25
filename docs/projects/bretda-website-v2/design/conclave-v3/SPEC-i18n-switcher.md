# SPEC — Seletor de Idioma/Moeda + Consertos de Compra Internacional

**Origem:** Conclave v3 (Norman/Laja/Tobias/Kahneman, DNA real, leram Stitch v1) + decisão do founder.
**Decisão travada:** idiomas **EN / ES / DE / FR** no launch · moeda **$ / €** por geo · todos os preços expostos.
**⚠️ Gate de qualidade:** cada idioma exige **cópia de luxo traduzida por humano** (não máquina). Switcher pode ser construído já; ES/DE/FR só vão ao ar com revisão humana — senão "grita operação pequena" (consenso dos 4 clones).

---

## 1. Seletor Idioma + Moeda — comportamento (consenso unânime)

| Regra | Decisão |
|-------|---------|
| **Default** | Geo-detect (IP + `Accept-Language`) seta idioma **e** moeda no 1º paint. **Sem modal/splash.** |
| **Mapa default** | US/CA → EN/$ · Eurozona → idioma local se disponível, senão EN / € · UK → EN/$ (ou GBP fast-follow) · desconhecido → EN/$ |
| **Nunca** | Mostrar R$ ou PT a visitante estrangeiro. Em lugar nenhum. |
| **Override** | Sempre visível, top-right header. 1 clique, **instantâneo** (sem reload, sem perder lugar no PDP). |
| **Persistência** | Cookie/localStorage. Escolha explícita de retorno **vence** o geo. |
| **Acoplamento** | **Idioma e moeda DESACOPLADOS** — 2 controles (alemão pode querer EN + €; expat US em Paris quer EN + $). |
| **Visual** | **TEXTO, nunca bandeira** (bandeira = país, não idioma/moeda). Endônimo na própria língua: `English · Español · Deutsch · Français`. Moeda: `$ USD` / `€ EUR`. |
| **Tratamento (Tobias)** | "Maker's mark": `EN · $ ▾` hairline champanhe ~55% sobre charcoal, sublinhado champanhe 1px no hover, sem caixa/borda. Raleway uppercase, ~10–11px, tracking 0.15em. |
| **Painel** | Abre coluna de 2 seções (Language / Currency), seleção atual marcada com ponto champanhe `·`, não check. |
| **Motion da troca** | Cross-dissolve 280–360ms (opacity + 4px drift); dígitos de moeda **rolam** ($8,200 → €7,600); sublinhado champanhe desenha L→R. |

### Teste de estresse tipográfico (DE = pior caso)
- Alemão ~+30% de comprimento (`Configurator`→`Konfigurator`). Nav/botões **flex, nunca largura fixa nem truncar**.
- Escala de tipo **por-locale** (headline DE pode precisar 1 passo menor p/ não quebrar o hero em 2 linhas).
- Bodoni Moda: confirmar acentos `ç ã õ á é í ñ ü ö` no corte **display**, não cair em serif do sistema.
- Champanhe/charcoal idêntico em todos os locales = a constante que faz 4 idiomas parecerem uma casa só.

---

## 2. Matriz de locale × moeda

| Locale | URL | Moeda default | Formato preço | Observação |
|--------|-----|---------------|---------------|------------|
| EN | `/en` (ou raiz) | USD `$` | `From $14,900` | base; 70–80% do endereçável |
| DE | `/de` | EUR `€` | `Ab 13.900 €` | separador `.`/`,` alemão; vírgula decimal |
| FR | `/fr` | EUR `€` | `À partir de 13 900 €` | espaço como separador de milhar |
| ES | `/es` | EUR `€` | `Desde 13.900 €` | — |

- **DDP obrigatório no número:** "From $14,900 — **delivered, duties included**" (ou "+ customs at order" se for a verdade — mas **declarar**). Sem isso o preço não significa nada pro estrangeiro (Norman/Laja).
- Preço é **indicativo** (feito sob encomenda) → nota fina: "final quote confirmed at order" (remove objeção de FX-lock, é honesto).

---

## 3. Consertos por tela (mapeados das telas Stitch v1)

### 01 — Home / Hero
- Trocar `USD` solto + `INQUIRE` por **`EN · $ ▾`** (rail hairline) + CTA primário de aquisição.
- Sub-linha de **message-match + logística**: *"Hand-crafted luxury billiards tables — made to order in Brazil, shipped white-glove to the US & Europe."* (mantém H1 poético "Brazil's gemstones, made to play").
- Linha de origem gravada: **`Atelier · Brazil · shipped worldwide`** (origem = flex, não legenda).

### 02 — Collection
- Quebrar o grid uniforme 8-up (lê como planilha = "startup tentando ser premium"). 1 herói full-bleed (Paraíba azul) + layout editorial assimétrico; nomes-gema em display; matar "VIEW MORE" repetido.
- Expor **"from $X"** em cada card (qualifica + sinaliza confiança).

### 03 — PDP (maior alavanca) 🔴
- **Matar `From R$24,500` → `From $24,500` / `Ab 22.900 €`** conforme sessão. Header = corpo. **Conserto #1 de toda a deck.**
- **Faixa de confiança cross-border** acima do bloco de preço: 4 ícones+microcopy — *Worldwide insured white-glove freight · ~8–10 wk made to order · Customs & duties handled · Arrival-condition guarantee*.
- Justificar valor **antes** do número (mover "Why this object/house/now" / 1 linha de valor+escassez acima do preço).
- CTA primário **"Reserve / Begin your commission"**; "Talk to a specialist" (concierge) como secundário, não a porta da frente.
- Linha de fechamento internacional: **`Crated, insured, delivered worldwide`**.

### Todas as telas
- **Camada de legitimidade** ("isso é real?"): nome da empresa, "crafting since {ano}", instalação/depoimento real ("as installed in {city}"), imprensa, humano de contato. Trava a inquiry antes de começar.

---

## 4. Arquitetura i18n no build (Next.js 16 + Sanity — do dossiê F3)
- **next-intl** com routing por locale (`/en /es /de /fr`); middleware faz geo-default no 1º paint (Vercel `request.geo`), redireciona só na entrada, respeita cookie de override.
- **Currency context** separado do locale (provider React + cookie próprio); preço formatado por `Intl.NumberFormat(locale, {currency})`.
- **Conteúdo traduzível no Sanity** (campos `localeString`/`localeText` por SKU + copy) — tradução vira workflow de conteúdo, não hardcode. Catálogo já sai do `constants.ts` → CMS.
- **SEO:** `hreflang` por locale + `og:locale`; sitemap por idioma; canonical correto.
- **Gate:** ES/DE/FR não publicam sem cópia humana aprovada (flag por-locale no CMS).

---

## 5. Brief pronto p/ Stitch (quando reconectar)
Projeto `15559409943526920722`, design system dark `8121797503222820201` (Bodoni Moda + Raleway, champanhe #C9A961, charcoal #2A2B26). Gerar variações de: (a) header com `EN · $ ▾` + painel aberto Language/Currency; (b) PDP com moeda $/€ + faixa de confiança + CTA Reserve; (c) home com linha de origem + sub-linha logística; (d) collection editorial assimétrica. Foto real (regra-mestra: zero IA de mesa).
