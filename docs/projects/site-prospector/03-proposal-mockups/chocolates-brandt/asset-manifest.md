# Chocolates Brandt — Asset Manifest (Golden Prototype)

**Prospect #1** do pipeline ADR-0004 (award-reference faithful recomposition).
**Objetivo:** golden prototype privado que pareça um site pago de verdade — NÃO slop de IA.
**Regra dura ADR-0004:** 0 fato inventado · 0 imagem placeholder · 100% mídia com proveniência first-party.

---

## 1. Identidade verificada (fontes reais)

| Campo | Valor | Fonte |
|---|---|---|
| Nome | Chocolates Brandt (Empório e Fábrica de Chocolates) | site próprio |
| Nicho | Chocolate artesanal / doces gourmet (fabricante + empório) | pesquisa |
| Cidade | Joinville/SC | site próprio |
| Endereço | R. Padre Kolb, 1419 — Anita Garibaldi, Joinville/SC | WebFetch chocolatesbrandt.com.br (2026-07-23) |
| WhatsApp | (47) 99765-6867 | WebFetch chocolatesbrandt.com.br (2026-07-23) |
| Instagram | [@chocolatesbrandt](https://www.instagram.com/chocolatesbrandt/) | site próprio |
| CNPJ (sinal) | 79.829.081/0001-97 (Chocolates Brandt Comércio e Represent.) | cnpj.biz — **revalidar em certidão oficial antes de outreach** |
| Idade da marca | ~25 anos *(alegado — não re-verificado)* | pesquisa (pendente confirmação) |
| Canais atuais | Instagram · WhatsApp · iFood *(alegado)* · loja física | pesquisa |
| Tagline IG | "Chocolates e Doces Artesanais em Joinville" | título @chocolatesbrandt (2026-07-23) |
| Reputação | **4,7★ · 115 avaliações** | Google Maps (2026-07-23) |
| Categoria | Loja de chocolates / **loja de fábrica** (factory store) | Google Maps |
| Serviços | **Take away (retirada) + Entrega** · wa.me | Google Maps |
| Horário | Fecha às 18:00 | Google Maps |
| Coordenadas | -26.3149145, -48.8461871 · Plus Code M5P3+2G | Google Maps |
| CEP | 89202-145 | Google Maps |
| Produto-assinatura | **Pão de mel** + chocolates artesanais (degustação no local) | críticas Google Maps ("em especial o pão de mel"; tags: pão de mel, degustação, artesanais, fábrica) |
| Vitalidade | Fotos atualizadas **"há um dia"** = negócio ativo; set **"Pelo proprietário"** disponível | Google Maps |
| Prova social (voz real) | "Loja de fábrica bonita e muitas coisas gostosas em especial o pão de mel" · "Ótimo atendimento, produtos ótimos, nota 1000" · "renomada chocolateria... ampla variedade de chocolates artesanais de alta qualidade" | críticas Google Maps |
| Concorrentes locais | Chocolate Santa Catarina (4,9) · Gute Schokolade (5,0) · Planet Chocolate · Chocopp | Google Maps "as pessoas também pesquisam" |

## 2. Lacuna de site (a dor)

`chocolatesbrandt.com.br` **está no ar mostrando só uma página "Em Breve…"** — zero produtos, zero preços, zero carrinho, zero navegação. Só uma imagem + links Instagram/WhatsApp + o endereço. **Confirmado 2×** (subagente de verificação + WebFetch meu em 2026-07-23). Não é migração temporária nem site pronto em manutenção — é placeholder de origem.

→ **Tese de venda:** eles têm domínio próprio, marca de 25 anos e produto premium fotogênico, mas o site não vende nada. Todo tráfego que chega no domínio evapora.

## 3b. Catálogo real de produtos + identidade (Apify @chocolatesbrandt, 2026-07-23)

**Assets baixados:** 21 imagens + foto de perfil em `assets/instagram/` com `provenance.json` (URL do post + caption + likes por imagem). **14.558 seguidores.**

- **Logo/identidade:** roundel vermelho + "B" script branco (`_profile-pic.jpg`). Tagline real: **"Amor em forma de Chocolate"** (neon da loja).
- **Horário real (bio deles):** Seg-Sex **9h-19h**, Sáb **9h-15h** *(mais preciso que o Maps "fecha 18h" — usar a bio)*.
- **Marca-irmã:** @brigaderia_brandt (linha de brigadeiro).
- **Produtos reais (com foto + proveniência):**
  - Ovo de Páscoa de **Bolo** — 5 sabores (`post03`, 58❤)
  - Ovo de Páscoa de **Pistache** — foto studio near-pro, hero-worthy (`post03-img1`)
  - Ovo de Páscoa de **Maracujá** c/ brigadeiro (`post10`)
  - **Cookies** — vários sabores, venda loja/WhatsApp/iFood (`post08`, 48❤)
  - **Cestas de presente** (ex. cesta R$500, laço dourado "Feliz Páscoa") (`post05`, 922❤)
  - **Pão de mel** (assinatura citada nas críticas)
  - Brigadeiros (via @brigaderia_brandt)
- **Prova social real:** parceria **Jovem Pan** (sorteio Páscoa), negócio de família (@juliabrandtn), 4,7★/115.
- **Qualidade foto:** mista — product shots limpos (pistache) = hero; UGC de loja c/ overlay = ambiente/história (cropar overlays p/ hero).

## 3. Fotos first-party — STATUS: ✅ IG CAPTURADO · 🟡 iFood (preços) pendente

Fonte autorizada pelo founder: **as fotos que o próprio Brandt publica**.
Confirmado que existe mídia first-party abundante:
- ✅ **Fachada real capturada** (Google Maps): loja de fábrica com **fachada vermelha**, nome em branco sobre vermelho — cor de marca = vermelho quente + marrom chocolate.
- ✅ **Set "Pelo proprietário" no Google Maps** (fotos postadas pelo dono) + fotos "há um dia" = fluxo ativo.
- ✅ **Feed @chocolatesbrandt** ativo (bio: "Chocolates e Doces Artesanais em Joinville").
- 🔴 **Instagram bloqueia automação deslogada** — "Não foi possível carregar a página" ao acessar sem login.

**Ainda a baixar (build-ready, com proveniência):**
- [ ] Produtos do feed IG / iFood (bombons, barras, pão de mel, ovos, caixas/presentes)
- [ ] Ambiente da loja de fábrica + degustação
- [ ] Preços reais (iFood) para os cards de produto

**✅ DECISÃO (founder 2026-07-24): Apify IG + iFood juntos.** IG (✅ já capturado — 21 imgs + perfil + `provenance.json`) p/ visual/ambiente; **iFood pendente** p/ **preços reais** dos cards de produto. Trio de referências aprovado: buckssauce (A) + To'ak (B) + Simply Chocolate (C). Gate obrigatório antes de entregar: **fidelidade estrutural vs referência** (ADR-0004).

**Métodos (referência):**
1. **Apify IG scraper** (@chocolatesbrandt) — baixa imagens reais dos posts + URL de origem (proveniência automática). Proven no projeto (memória Apify). ← recomendado p/ assets build-ready.
2. **Founder loga no Instagram** neste Chrome → eu capturo o feed direto.
3. **iFood** (loja Brandt) — fotos de produto + **preços reais** (melhor p/ cards de produto).

> Proveniência obrigatória: cada imagem usada registra URL do post original + data. Zero imagem de banco/IA como se fosse produto deles (gate ADR-0004).

## 4. Target DESIGN.md — STATUS: PENDENTE (cor de marca já sinalizada)

Sinal de cor real já capturado: **vermelho de fachada + marrom chocolate**. Refinar tokens (cor/tipografia/raio/sombra) a partir de logo + embalagens + feed IG. Expressão da marca Brandt, não do site-referência.

## 5. Master reference (award) — STATUS: A SELECIONAR

Blueprint estrutural único (ADR-0004). Candidatos do nicho (benchmark-index confeitaria): Dominique Ansel (autoridade de maker/artesão + produto-assinatura), Poilâne (herança/craft), Cédric Grolet (produto como espetáculo), Magnolia (arquitetura comercial pickup/gifting). Requisito ADR-0004: página **efetivamente premiada** (Awwwards/FWA) — selecionar 1 mestra + 1 fallback, capturar full-page 1440/375 + inventário de motion.

## 6. Gaps que bloqueiam o build

1. 🔴 Fotos first-party (captura IG/iFood) — **próximo passo**
2. 🔴 Preços reais dos produtos (iFood)
3. 🟡 Confirmar idade da marca + história (para o bloco "herança/maker")
4. 🟡 Cores reais da marca → target DESIGN.md
5. 🟡 Selecionar + capturar a referência-mestra premiada
