# Site-Prospector — Rodada Nacional (serviço online)

**Data:** 2026-07-26 · **Escopo:** Brasil inteiro, entrega 100% remota

Esta pasta tem duas coisas separadas de propósito: **o blueprint bom** (referências) e
**o material real do cliente** (fotos + dados). Elas nunca se misturam.

---

## Por que estão separadas

O design atual do cliente **é o problema, não a matéria-prima**. Ele é prospect justamente
porque o visual dele é ruim — Wix genérico, site morto, ou nada. Extrair `DESIGN.md` do site
dele só documentaria o que queremos substituir.

Então:

| Pasta | O que é | Serve para |
|---|---|---|
| `_referencias/` | `DESIGN.md` de 60 marcas premiadas (5 por nicho) | **Blueprint estrutural** — a composição que vamos usar |
| `_clientes/` | Fotos reais + dados + lacuna documentada | **Conteúdo e identidade** — o que entra dentro do blueprint |

Padrão ADR-0004: a composição aprovada da referência é preservada; troca-se a identidade,
o conteúdo real e a mídia first-party do cliente.

---

## `_referencias/` — 60 blueprints

```
_referencias/
├── 01-moda/              Adanola · VISIONNAIRE · Numbered · HNST Studio · Everlane
├── 02-food-gourmet/      Alison Roman · Hartzler Dairy · GRAZA · Busy Bee Honey · Assembly Coffee
├── 03-cosmetico/         2.AG · Ashleyandco · UY Studio · Pa'lais · Seed
├── 04-bebida/            Fallen Grape · Altitude Beverages · Touchy Coffee · Little Amps · Escape Coffee
├── 05-casa-deco/         Forner · Concrete Club · Palette Supply · Anuc Home · INO
├── 06-couro-bolsa/       MAKR · Abetterlou · Shelby · Everlane · Bang & Olufsen
├── 07-movel/             Relieve Furniture · Nornorm · Oakâme · Bang & Olufsen · Programa
├── 08-musica/            teenage engineering · Elektron · Superlative · Bang & Olufsen · New Genre
├── 09-cutelaria-edc/     teenage engineering · Superlative · New Genre · Elektron · Three
├── 10-joia/              Franco Maria Ricci · Numbered · Ada · Adanola · MAKR
├── 11-papelaria/         Agronomy Workshop · Concrete Club · Palette Supply · Helloivy · Paper
└── 12-pet/               Busy Bee Honey · Hartzler Dairy · GRAZA · Adanola · MAKR
```

Cada pasta de referência tem:
- `DESIGN.md` — north star, paleta com hex e papel de cada cor, tipografia, como usar
- `style.json` — dados crus

**São 5 por nicho porque o gate anti-clone exige isso:** similaridade máxima com uma
referência é cor ≤85% · tipografia ≤75% · layout ≤60%. Com uma fonte só, vira cópia.

### ⚠️ Limitação honesta das referências

A fonte é o catálogo do Refero (1.290 sites), que é **majoritariamente SaaS/tech**.
Tentei filtrar automaticamente e o resultado veio contaminado — Webflow entrou em "móveis",
Twingate e Brex em "instrumentos". Joguei fora e refiz por **curadoria manual**.

Consequência: **4 nichos não têm referência nativa e reusam de outro** —
`10-joia`, `11-papelaria`, `12-pet` e parte de `09-cutelaria-edc`. Não existe marca
premiada de pet ou de cutelaria nesse catálogo. Para esses, a referência é análoga
(objeto/catálogo industrial), não do setor. **Vale trocar por referência real do nicho
antes de construir.**

---

## `_clientes/` — estado REAL da coleta

| Lote | Clientes com foto | Fotos | Situação |
|---|---:|---:|---|
| lote-01 | **20/20** | 769 | ✅ completo (via Apify, ~40 fotos/marca) |
| lote-02 | 10/20 | 219 | ⚠️ parcial — crédito Apify acabou no meio |
| lote-03 | 0/20 | 0 | ❌ bloqueado (HTTP 401) |
| lote-04 | 0/20 | 0 | ❌ bloqueado (HTTP 401) |
| lote-05 | 0/20 | 0 | ❌ bloqueado (HTTP 401) |
| **Total** | **30/100** | **988** | |

### 🔴 Estado do bloqueio em 26/Jul (ler antes de retomar)

O erro do Instagram **evoluiu de 400 para 401** ao longo da sessão:

- `400 SecFetch Policy violation` — requisição malformada. **Tem conserto** e foi consertado
  (headers `Sec-Fetch-Site/Mode/Dest` + `Referer` apontando para o próprio perfil).
  Depois da correção, destravou 1 perfil em 5.
- `401 Unauthorized` — **o IP passou a exigir login.** Apareceu em 60 de 60 perfis dos
  lotes 3–5. Não há header, delay ou backoff que resolva: só autenticação ou outro IP.

Bloqueio por reputação de IP costuma expirar em algumas horas ou um dia.
**Tentar de novo antes disso é desperdício.**

Cada cliente coletado tem `brand-kit.md`, `fotos/` e `perfil.json`.
As pastas dos não-coletados existem com `brand-kit.md` e `fotos/` vazia.

### Por que parou nos 29

**1. Crédito Apify esgotado** — restam US$ 0,000688.
Erro: `not-enough-usage-to-run-paid-actor`.

**2. A alternativa gratuita não escalou.** O endpoint público `web_profile_info` funciona,
mas de forma imprevisível: `@facashunter` responde 200 e `@mahta.bio` responde 400 na
mesma janela, com headers idênticos. Testado sem sucesso:

- headers `Sec-Fetch-Site/Mode/Dest` + `Referer` — corrigiu o erro
  `SecFetch Policy violation`, mas destravou só parte dos perfis
- cookie de sessão anônima + `x-csrftoken`
- backoff de 60s / 180s / 420s por perfil
- extração pelo HTML da página — o Instagram não embute mais URL de imagem (zero encontradas)

Os perfis que falham **existem** — a página HTML retorna 200. O bloqueio é do endpoint,
acontece por perfil, e não foi explicado.

### Como retomar

```bash
# COM crédito Apify recarregado (rápido, ~30 posts por marca):
bash docs/projects/site-prospector/tools/nacional-2026-07/run-lote.sh 3

# SEM Apify (lento e instável, ~12 posts por marca):
node docs/projects/site-prospector/tools/nacional-2026-07/ig-direct.cjs 3 5
```

Ambos são **idempotentes** — quem já tem ≥10 fotos é pulado, nada é rebaixado.

⚠️ **Assimetria entre lotes:** o lote 1 tem ~40 fotos por marca (Apify entrega 30 posts).
A via gratuita entrega ~12 posts, então lotes futuros terão menos material por cliente.

---

## Pipeline de imagem (decisão do founder, 25/Jul)

Sem sessão de fotos presencial, a imagem é resolvida com IA — **sob o guardrail da regra Bretda:**

> **A IA gera o ambiente. Nunca o produto.**

O produto sai das fotos reais do cliente, recortado (`photo-gate.cjs` + keyer, mesmo pipeline
da Chokolaten). Produto 100% sintético é proibido — precedente: Cataia Moda Praia foi
reprovada por marca d'água do Gemini no canto.

---

## O que ainda NÃO foi feito

Vale ler antes de usar qualquer coisa daqui:

- **Nenhum CNPJ foi verificado.** Zero dos 100.
- **Nenhuma foto foi inspecionada.** Foram baixadas, não olhadas. O `photo-gate.cjs`
  ainda não rodou — e ele tem falso-positivo com moldura chapada (polaroid, slide de carrossel).
- **Decisor e capacidade de investimento são desconhecidos.**
- **Validade de 30 dias.** Site quebrado hoje pode ser migração em curso.

## Bloqueio antes de qualquer proposta

O `CONTEXT.md` do projeto ainda descreve **"sessão de fotos presencial 2h"** e
**"suporte presencial em Blumenau"** como 2 dos 5 itens do pacote, e a garantia CDC
(ADR-0002, redigida pela Patricia Peck) é literalmente **"Performance Local Blumenau"**
com atribuição via Google Business Profile local.

Nada disso sobrevive ao modelo remoto. A garantia tem implicação jurídica — precisa de
revisão antes de qualquer proposta sair.

---

**Guardrail do projeto, mantido:** nenhuma mensagem, proposta, mockup ou deploy sem
aprovação humana explícita. Nada aqui foi enviado a ninguém.
