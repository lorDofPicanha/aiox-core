---
project: tocks-custom · v4-fantastic
deliverable: Pesquisa de luxo & design — marcas/conceitos para o site
date: 2026-05-28
method: HYDRA (tentativa real, registrada) + fontes primárias web
---

# Pesquisa: Móveis de Luxo & Design — referências para o site Tocks

## 0. Nota honesta sobre o HYDRA (transparência)

Tentei usar o HYDRA real (`tools/hydra/`), não o "HYDRA-style" proibido:
- `hydra search "luxury furniture design..."` → **0 resultados** (o corpus de 3.209 artigos é tech/negócios/licitações — não tem nada de móveis de luxo/design).
- `hydra test-source web https://www.billards-toulet.com/en/` (modo heurístico, p/ contornar scoring Anthropic) → **`fetch failed`** (o adapter web não trouxe o conteúdo; site bloqueia bot/rede).
- Ingerir o domínio do zero + scoring exigiria setup + custo/tempo desproporcional ao objetivo.

**Decisão:** pivotei para **fontes primárias web reais** (método aprovado). Abaixo, o material real.

---

## 1. Marcas de referência — mesas de jogo de luxo

| Marca | País | Sinal de luxo / o que roubar |
|---|---|---|
| **Billards Toulet** | França (1857) | Selo **EPV — Entreprise du Patrimoine Vivant** (patrimônio vivo). Storytelling de herança + tecnologia (ardósia para planura perfeita, LED, modelos "design": *Whitelight*, *Carat Light*). Lição: **herança datada + nome de modelo como coleção**. |
| **MBM Billards** | França | Inlays de **madeiras raras**, pernas em **alumínio escovado**, tampos de **mármore**; **bespoke** (cliente escolhe caçapa, cor, escultura da perna). Lição: **configurador material é o coração da venda**. |
| **Brunswick** | EUA | Herança/autoridade histórica. |
| **Vaveliero / Etrusco** | Itália | Mesa como **escultura de galeria**, design italiano. |

**Materiais-código de luxo:** madeira maciça nobre, ardósia, mármore, latão/bronze, alumínio escovado. (Tocks já = madeira maciça + 10 madeiras/16 tecidos — alinhado.)

## 2. Marcas/casas de mobiliário & conceitos

- **Minotti** (IT, 1948) — encarna o **"quiet luxury"**: limpo, equilibrado, "**sussurra em vez de gritar**". Sem logo grande.
- **Promemoria · Giorgetti · B&B Italia · Poltrona Frau** — maisons de mobiliário de altíssimo padrão (referência de tom).

## 3. Tendências 2026 (aplicáveis ao site)

1. **Quiet luxury** — derrubar logos grandes/detalhes chamativos; "qualidade que se sente". Posicionamento anti-fast-furniture.
2. **Proveniência rastreável** — origem/ofício como valor (combina com "antes Skara, 3 décadas em Itajaí").
3. **Paleta terrosa** — terracota profunda, ocre suave, verdes-musgo: "caro e sofisticado, mas acolhedor".
4. **Configurador imersivo (3D/VR)** — expectativa padrão do comprador de luxo; "Atelier Bench" (10 madeiras + 16 tecidos) já endereça isso.
5. **Mobile-first + jornada concierge** — busca inteligente, recomendação, compra consultiva.

## 4. As 4 direções de mockup (informadas pela pesquisa)

| # | Direção | Essência | Origem na pesquisa |
|---|---|---|---|
| **1** | **Atelier Noir** (já feita) | Carvão quente cinematográfico, ouro champanhe pontual, Caslon editorial | Síntese squad (Tese B+A) |
| **2** | **Luz Quente / Quiet Luxury** | LIGHT — bone/cream, paleta terrosa (terracota/ocre/musgo), muito respiro, sussurro Minotti | Quiet luxury + paleta 2026 |
| **3** | **Galeria** | Quase-branco de museu, monocromático, produto-escultura, espaço negativo radical, tipografia mínima | Vaveliero/galeria italiana |
| **4** | **Maison Patrimoine** | Verde profundo (baize do bilhar) + latão, herança datada, monograma, ornamento refinado | Toulet EPV + verde-feltro |

> Variante 4 amarra o **verde do feltro de bilhar** ao luxo herança — tematicamente ressonante com a categoria.

**Fontes:** mantidas as oficiais da marca (Libre Caslon Text + Poppins) em todas as variantes; o que muda é paleta, densidade, layout e tom.
