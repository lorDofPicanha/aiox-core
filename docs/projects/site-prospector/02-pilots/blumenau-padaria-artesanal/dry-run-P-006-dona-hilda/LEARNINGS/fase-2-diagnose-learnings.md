# LEARNINGS — Fase 2 DIAGNOSE (Dry Run P-006 Dona Hilda)

**Data:** 2026-05-12
**Executor:** @qa + @ux-design-expert (assistido por @analyst output Fase 1)
**Prospect:** P-006 Dona Hilda Confeitaria
**Output gerado:** `diagnose/dossier.md`

> **NATUREZA:** este é um DRY RUN sobre prospect real. Output **não foi e não será entregue ao prospect**. Objetivo único: estressar pipeline Fase 2 do Site-Prospector v1 antes de rodar com sample N=3 do piloto Blumenau.

---

## 1. Tempo gasto (estimado)

| Etapa | Tempo |
|---|---|
| Leitura de contexto (`CONTEXT.md` + `01-prospect-list.md` + `02-offer-pack-template.md` §01) | ~6 min |
| WebSearch passes (4 rodadas, ~10 queries totais) | ~5 min |
| Tentativas frustradas de WebFetch (denegado 2×) + reroute via WebSearch | ~3 min |
| Análise, cross-referencing, reconciliação de dados conflitantes | ~4 min |
| Redação do `dossier.md` | ~5 min |
| Redação deste `learnings.md` | ~3 min |
| **TOTAL** | **~26 min** |

Cabeu na janela de 25min com slip de 1min. Sem polish visual (Figma/Canva render do PDF).

---

## 2. AIOS-easy vs hand-edit-heavy (split honesto)

### AIOS-easy (~70%): WebSearch + análise + redação template-driven

O que rodou no piloto automático:
- WebSearch BR retornou **dados estruturados ricos** sobre Dona Hilda em ~5 buscas: Instagram followers (13k confirmado), Insta posts count (138 — novo dado, não estava na prospect-list), Tripadvisor rating (4,4/162 reviews/#42 ranking), RestaurantGuru (4,6/2.118 reviews), Google Maps rating (4,7), Yelp atualização (mar/2026), iFood ativo, telefone, endereço CEP, horários (com divergência detectada entre canais).
- Concorrente direto local **encontrado em uma busca** (Benkendorf — Itoupava Seca, mesmo bairro, mesmo arquétipo confeitaria alemã, 14k Insta) com métricas comparáveis em outra busca (956 posts, Tripadvisor #6/42).
- **Descoberta crítica não prevista**: notícias de NSC Total + O Município (ago/2025) reportam que Dona Hilda **suspendeu atendimento nas mesas após 35 anos**. Operação atual = balcão + encomendas + iFood. **Esse dado muda completamente o pitch** — não dá pra vender "site que enche a casa nos finais de semana" pra alguém que **acabou de fechar o salão**. Pitch correto vira "site que captura encomendas e direciona delivery" (eixo iFood + WhatsApp + Insta link-in-bio).
- Template do offer-pack §01 é literal: tem 4 seções fixas (Presença Atual / Onde Está Perdendo / Concorrente Direto / Oportunidade Sazonal). Redação fluiu direto.

### Hand-edit-heavy (~30%): julgamento, reconciliação, limites técnicos

Onde precisou de cabeça:

- **Reconciliação de horários conflitantes** (Google diz 8:30-19:00, Insta diz 9:30-18:30). Decidi usar isso como ponto de dor no dossiê em vez de "decidir qual está certo" (porque eu não sei qual está certo, e inventar = violação Patricia Peck).
- **Decidir como flagar o evento ago/2025** (mesas suspensas) sem virar manchete que ofende o dono. Optei por linguagem neutra ("conforme noticiado em..." com fontes citadas) + reframing positivo do pitch ("captura de encomendas" vs "encher salão").
- **Quantificar concorrência Benkendorf** sem fontes diretas comparativas — usei números brutos (followers, posts, ranking Tripadvisor) e deixei o leitor fazer a inferência. Resisti à tentação de inventar "engagement rate" ou "alcance estimado".
- **Decidir o que NÃO afirmar.** Tive vontade de escrever "Lighthouse score abaixo de 30" — mas não rodei Lighthouse, então omiti. Sem ferramenta = sem afirmação.
- **Inferir arquitetura HTML antiga sem acesso ao DOM.** Evidência indireta (URLs `.html` estáticas, HTTP, presença em diretórios velhos) sustentou afirmações qualitativas ("arquitetura 2008-era") mas NÃO quantitativas ("LCP de X segundos", "JS de Y KB" — esses ficaram de fora).

---

## 3. Dados impossíveis de coletar sem ferramentas adicionais

| Dado | Necessário para | Ferramenta que resolve |
|---|---|---|
| Lighthouse score real (perf/a11y/SEO/best-practices) | Quantificar "site obsoleto" numericamente | **Lighthouse CLI local** (`npx lighthouse http://donahilda.com.br --output=json`) — não rodei nesta sessão, não estava disponível confirmado |
| HTML markup signals (presença `<table>`, jQuery version, viewport meta) | Sustentar "arquitetura 2008-era" tecnicamente | **WebFetch (denegado nesta sessão)** ou **curl + grep local** ou **Playwright MCP** (browser real) |
| GBP reviews count exato + reviews sem resposta count | Argumento "X reviews sem resposta há 6 meses" do template original | **Apify GBP scraper** ou **Google Places API** (custo) |
| Instagram posts last 30d exato + engagement rate | Comparar atividade vs Benkendorf de forma justa | **Apify Instagram scraper** ou **manual screenshot @analyst** |
| Foto count GBP + última foto data | "Última foto publicada há X meses" | **Apify GBP** ou **manual** |
| Site uptime, SSL cert validity, response time, headers | "Site cai N% das vezes" | **curl -I + openssl s_client** ou **WebPageTest** ou **UptimeRobot** |
| WhatsApp Business verification (wa.me ping) | Confirmar se número fixo aceita WhatsApp | **Manual** (mandar mensagem) ou **WhatsApp Business API** |

**Resumo:** dos 12 campos sugeridos no template Dossiê de Dor §01, **6 ficaram com asterisco/omissão** porque exigem instrumentação que esta sessão não tinha. Os outros 6 foram cobertos por WebSearch + raciocínio + fontes públicas (Tripadvisor, Yelp, RestaurantGuru — surpreendentemente úteis pra reviews count e rating).

---

## 4. Partes do template — facilidade vs risco de invenção

| Seção do template §01 | Facilidade | Risco invenção (CDC) |
|---|---|---|
| **Presença Atual — Instagram followers/handle** | ⭐⭐⭐⭐⭐ trivial via WebSearch | 🟢 baixo |
| **Presença Atual — GBP reviews count/avg** | ⭐⭐⭐⭐ via Tripadvisor/RestaurantGuru proxy | 🟡 médio (proxies divergem do GBP real) |
| **Presença Atual — site status** | ⭐⭐ inferência indireta sem WebFetch | 🟠 alto se afirmar específicos sem rodar Lighthouse |
| **Presença Atual — WhatsApp/Maps embed** | ⭐ não verifiquei | 🔴 alto se afirmar "não tem" sem checar |
| **Onde Está Perdendo — posts last 30d** | ⭐ não disponível sem scraper | 🔴 ALTO — TENTAÇÃO INVENÇÃO. Resisti escrevendo "138 posts totais" (factual) em vez de "X posts nos últimos 30 dias" (inventado). |
| **Onde Está Perdendo — reviews sem resposta** | ⭐ não disponível sem scraper | 🔴 ALTO — omiti completamente. |
| **Onde Está Perdendo — posição busca local** | ⭐⭐ qualitativo OK | 🟡 médio (não rodei busca em mobile real BR) |
| **Concorrente Direto — métricas comparadas** | ⭐⭐⭐ WebSearch resolve nomes + followers | 🟢 baixo se citar fontes |
| **Oportunidade Sazonal — datas próximas** | ⭐⭐⭐⭐⭐ calendário público | 🟢 baixo |

**Vermelho metafórico (risco CDC):** **3 dos 12 campos do template original são tentação direta de invenção** se o agente não estiver disciplinado. "Posts last 30d", "reviews sem resposta", "posição no Google Maps quando pesquiso X" — todos exigem ou um scraper rodando ou um humano fazendo pesquisa real no celular. **Sem isso, o template empurra o agente a chutar.**

Patricia Peck explícita em ADR-0002: "zero invenção, números reais ou omissão". Cumpri omitindo, mas o **template em si tem buraco estrutural** que precisa ser fechado antes de prospect real.

---

## 5. Skill `audit-site` — vale a pena codar?

### Problema específico que ela resolveria

Substituir o WebFetch denegado + inferência indireta por **um comando determinístico** que retorna em ~30s os 12 campos do template §01:

```bash
aios audit-site http://donahilda.com.br --prospect-id P-006 --output diagnose/site-audit.json
```

Output esperado (JSON estruturado):
- `https`: bool + cert validity
- `lighthouse`: { performance, accessibility, seo, best_practices, lcp_s, cls, inp_ms }
- `html_signals`: { has_table_layout, jquery_version, has_viewport_meta, has_og_image, has_schema_jsonld, has_wa_link, has_tel_link, has_maps_embed, has_cookie_banner }
- `meta`: { title, description, h1, h1_count, canonical, lang }
- `images`: { formats: [jpg, png, webp], total_count, total_kb }
- `js`: { external_count, external_kb, inline_lines }
- `last_indexed`: from sitemap or copyright year regex
- `mobile_friendly_signals`: from Lighthouse + manual heuristics

### Composição mínima viável

1. **Playwright** (já disponível via MCP) → carrega URL real, captura DOM, screenshot, network panel
2. **Lighthouse Node API** (instalável local — não precisa MCP, é CLI puro) → métricas Core Web Vitals + categorias
3. **cheerio** ou regex puro → grep HTML por `<table>`, `<font>`, `viewport`, `og:`, `application/ld+json`, `wa.me`, `tel:`, `goo.gl/maps`
4. **OpenSSL/Node TLS** → cert validity
5. Wrapper Node CLI (50-100 linhas) compõe os 4 e emite JSON

### Estimativa de esforço

- Squad-1 spike: **2-4h** para v0.1 wrapping Lighthouse + Playwright + cheerio
- v1.0 robusta (cache, retry, timeout, error handling, fallback se site offline): **6-10h**
- Custo: zero (tudo open-source local)

### Valor entregue

- **Elimina 3 campos vermelhos** do risco CDC (reviews sem resposta resolve por outra skill — `audit-gbp`)
- Reduz tempo Fase 2 de ~25min → **~8 min** (1min skill + 7min análise + redação)
- Permite afirmações **numéricas** ("Lighthouse 28/100 performance") em vez de qualitativas ("site obsoleto"), o que vira **Rational Drowning Dixon mais cirúrgico** no slide 2 do keynote
- **Reproduzibilidade** — dois prospects rodados com a mesma skill geram dossiês comparáveis, sem viés do prompt do dia

### Skill complementar sugerida (não bloqueante)

`audit-gbp` — usa Apify ou Places API → resolve `reviews_count`, `reviews_unanswered`, `last_photo_date`, `categories`, `attributes`. Custo: Apify ~$5/100 prospects, Places API tier gratuito serve N≤3 piloto.

---

## 6. Recomendação final — Fase 2 está pronta?

### Veredito: **CONDITIONALLY READY com mitigação manual**

Fase 2 **pode rodar com sample N=3 piloto Blumenau hoje**, MAS com 4 mitigações obrigatórias:

1. **Disciplina anti-invenção declarada explicitamente no agent prompt.** Cada campo do template §01 tem que ter fonte citada no `dossier.md` (anexo técnico) OU ser omitido. Patricia Peck disse: prefiro omitir a inventar. Implementado neste dry run, validado funciona.

2. **Lighthouse manual rodado pelo Breno (3min/prospect).** Antes do dossier final, Breno abre Chrome, F12, Lighthouse tab, runs mobile + desktop. Cola os 4 scores no dossier. Custo: 3min × 3 prospects = 9min do piloto. **Trade-off:** força Breno a tocar no produto antes de entregar — útil pra refining script.

3. **Apify Instagram scraper para `posts_last_30d`** OU manual screenshot @analyst do perfil. Sem isso, "Onde Está Perdendo Clientes — Instagram" fica fraco.

4. **Walk-by recon presencial** (já flagado no prospect-list §728) — pra checar fachada, horário pico, WhatsApp Business no balcão. **Não é Fase 2 puro, é Fase 2.5 híbrido**, mas essencial pro piloto N=3 não viajar em premissas erradas.

### Skill `audit-site` deve ser codada — mas DEPOIS do piloto N=3

Justificativa Goldratt/Eric Ries (squad Process):
- **N=3 piloto roda 4-6 semanas**. Codar skill primeiro = empurra outreach prospect #1 em 2-4 semanas, perdendo janela maio/2026 (já não-ótima, ver outreach calendar).
- **Aprender com 3 dossiês manuais** revela quais campos do template §01 são realmente carregados pelo skill vs cosméticos. Isso evita over-engineering skill v1.0.
- **Pós-piloto N=3**: se conversão for boa (≥1/3 fechado), Phase 2 codifica `audit-site` skill v1.0 com requisitos calibrados dos 3 dossiês reais. Se conversão for ruim, kill-switch dispara default action — e skill nunca foi escrita.

### Recomendação de gate prático

**Antes de rodar Fase 2 com prospect real:** atualizar template `02-offer-pack-template.md §01` para incluir **marcador explícito de "campo carrega evidence ou omitido"** em cada bullet. Tipo:

```
📉 Instagram: {posts_last_30d_OR_OMITIR} posts nos últimos 90 dias
  ↳ EVIDENCE: {apify_scraper_output OR manual_screenshot_url OR "OMITIDO — sem ferramenta"}
```

Custo: 15 min de edição no template. ROI: zero risco invenção no piloto.

---

## 7. Bonus — descobertas não previstas

1. **Mesa-suspensa ago/2025.** Mudou completamente o pitch. Reframe necessário: não vendo "site que enche salão", vendo "site que captura encomendas + integra iFood". **Squad Pricing deve revisitar stack pra esse arquétipo (negócio em reestruturação)** — pode merecer tier diferenciado.

2. **Reviews acumuladas >2.500** (somando RestaurantGuru 2118 + Tripadvisor 162 + Google + Yelp). Esse é um **anchor reputational extremamente forte** pro pitch Hormozi/Walling — argumento "você já tem o produto, só precisa do canal" se sustenta numérico, não retórico.

3. **Endereço errado no site** (Vila Nova vs Itoupava Seca real). Detalhe técnico mas vira **bullet emocional poderoso no presencial**: "Seu site diz que vocês estão em Vila Nova. Cliente novo confere antes de sair de casa. Quantos já não foram?" — esse é o tipo de descoberta que **só vem de leitura cruzada de fontes**, não de scraper isolado. Argumento pra manter humano no loop mesmo pós-skill `audit-site`.

4. **Concorrente Benkendorf empata em followers mas publica 7× mais.** Insight rico — não é "concorrente que tem MAIS audiência", é "concorrente que TRABALHA MAIS o canal". Posicionamento mais difícil de atacar (não é "você tem menos", é "você usa menos"). Pitch precisa ser cuidadoso aqui — argumento facilmente vira ofensivo se mal-formulado ("você é preguiçoso digitalmente" — péssimo).

---

## 8. Próximas iterações sugeridas

| # | Ação | Owner sugerido | Quando |
|---|---|---|---|
| 1 | Atualizar `02-offer-pack-template.md §01` com marcadores "evidence-or-omit" | @po (Pax) | Pré-piloto N=3 |
| 2 | Documentar 3 mitigações manuais (Lighthouse local + Apify Insta + walk-by) no `00-pre-registered-criteria.md` | @sm (River) | Pré-piloto N=3 |
| 3 | Refinar pitch arquétipo "negócio em reestruturação" (Dona Hilda case) | @pm (Morgan) + Squad Pricing | Pós dry-run review |
| 4 | Spike skill `audit-site` (timebox 4h, output JSON schema definido) | @dev (Dex) | Pós-piloto N=3 SE conversão ≥1/3 |
| 5 | Cruzar este learning com outros 2 dry-runs (P-003 Maria Mole + P-010 Vanessa Hayashi) antes de generalizar | @qa (Quinn) | Próxima sessão dry-run |

---

**Fim do learnings.** Dry run validou que Fase 2 manual roda em ~25min/prospect com qualidade aceitável SE disciplinado contra invenção. Skill `audit-site` é alto ROI mas **não bloqueante** pro piloto N=3. Recomendação operacional: rodar piloto com mitigações manuais primeiro, codar skill DEPOIS com requisitos calibrados.
