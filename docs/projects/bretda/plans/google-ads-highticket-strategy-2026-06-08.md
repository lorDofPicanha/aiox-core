# Bretda — Estratégia Google Ads para Alto-Ticket (R$30k+)

> **Data:** 08/Jun/2026 · **Escopo:** EXCLUSIVO Google Ads · **Conta:** `8167636084`
> **Método:** pesquisa massiva (3 agentes de pesquisa primária + pipeline HYDRA `squad-highticket`, +163 itens curados, 5 fontes novas) + conclave HYDRA de 6 clones (`self-consultation.js batch`: larry-kim, campaign-manager/BLITZ-Kasim-Aslam, cassie-kozyrkov, funnel-architect/MAZE, seth-godin, pedro-sobral).
> **Status:** PLANO. Nenhuma alteração foi feita na conta ao gerar este doc.

---

## 1. Resumo executivo

A Bretda vende mesas de jogos de luxo sob encomenda, ticket **a partir de R$30.000**. O Google Ads hoje está **parado** (só a campanha de marca roda, R$0,94/7d) e **cego há 6 meses** (a venda fecha no WhatsApp e o Google nunca soube qual clique virou venda). O funil de captura atual atrai público que teta em R$20k — orçamento errado.

**O diagnóstico central, validado pelo conclave: a doença não é o canal — é o SINAL de conversão.** O Smart Bidding é um sistema de Machine Learning que aprende com **exemplos**. Por 6 meses os exemplos foram lixo ("WhatsApp-click = conversão boa"), então o algoritmo aprendeu a encontrar o público de R$20k. Qualquer budget novo, em qualquer canal (Search, Demand Gen ou PMax), só vai re-treinar o Google a achar o público errado **mais rápido** — até que o sinal seja consertado.

**A sequência é lei:** consertar o sinal → trocar o funil (configurador, sem showroom) → religar Search (rede) → Demand Gen (motor de demanda) → PMax (por último, se algum dia).

---

## 2. Estado atual da conta (auditoria 08/Jun)

| Item | Estado | Implicação |
|---|---|---|
| Conta `8167636084` | ENABLED (não suspensa) | OK |
| OAuth | Renovado 08/Jun (token novo no `.env`, validado) | Expira a cada ~7d enquanto consent screen em "Testing" → publicar p/ Production |
| Campanhas de aquisição (Bilhar, Jantar, RMKT) | **PAUSADAS** desde ~27/Mai | Motor desligado |
| Defesa de Marca | ENABLED, R$10/d | Só luz-piloto; ninguém busca "bretda" (demanda de marca ≈0) |
| Conversão | **CEGA 6 meses** | Só WhatsApp-click (soft) dispara; 5 PRIMARY = ZERO |
| `Sale-Closed-OC` | Existe, **nunca recebeu upload** | O passo que faltou (ver Fase 0) |
| Zumbi `[AGD] Lead` (id `7138711130`) | ENABLED, PRIMARY, R$100 fantasma | Deletar (só UI) |
| Quality Score | QS 0-3 crônico **resolvido** (campanhas lixo REMOVED) | Não é mais o problema |
| Timezone | **America/Fortaleza** (deveria ser São Paulo) | Distorce relatórios; corrigir (UI) |
| Bidding | Manual CPC | Correto p/ baixo volume (ver Fase 2) |

---

## 3. Os 7 achados-chave da pesquisa

1. **O gargalo é o sinal, não o canal.** ML rotula por exemplos; exemplos lixo → rótulos lixo. Conserta a conversão real e o algoritmo reaprende. *(Cassie Kozyrkov — Decision Intelligence)*
2. **Rival nº1 real = BlackBall** (`blackball.com.br`) — fábrica própria de mesas de jogos de alto padrão, prova social de celebridades (Neymar, Caio Castro, Rodrigo Faro...), captura por WhatsApp, zero preço. NÃO é Breton/Artefacto (esses são móveis de luxo amplos).
3. **Conquesting no Search = ILEGAL no BR.** STJ REsp 2.096.417/SP (3ª Turma, Nancy Andrighi, fev/2024): comprar a marca registrada de concorrente do mesmo ramo como keyword = **concorrência desleal indenizável**. Linha vermelha penal: nome do concorrente no TEXTO do anúncio (art. 195 LPI). → Usar **custom-segments por URL em Demand Gen/YouTube** (legal), nunca keyword de marca no Search.
4. **O configurador online é o melhor ativo de funil — e NÃO precisa de showroom.** Benchmark: Billard Toulet (monta a mesa → realidade aumentada → orçamento por e-mail). Espelha o configurador estilo Porsche já planejado pra Bretda.
5. **Bidding por volume:** com **<15-30 conversões/mês** NÃO ligar Smart Bidding (ele "não entra no leilão" ou infla CPC pra gastar budget). Caminho: **Manual CPC → micro-conversões de alta intenção com valores graduados → portfolio bidding** (poolar dados de várias campanhas). **STAG, não SKAG.**
6. **Search capta pouca demanda; Demand Gen a GERA.** "Mesa de sinuca de luxo" tem busca rasa (Low search volume desativa keywords). Search = rede barata de fundo; Demand Gen/YouTube = motor de crescimento. Cuidado com incrementalidade (John Moran/Solutions8: Demand Gen pode roubar atribuição de demanda preexistente — medir vendas reais novas, não o número do painel).
7. **Medição:** capturar **GCLID** no fluxo (landing → botão WhatsApp carrega o GCLID via GTM webhook); **Enhanced Conversions for Leads > OCI puro**; usar **Data Manager + Google Sheets**, NÃO a API legada (`UploadClickConversions` é bloqueada p/ novos em **15/Jun/2026**); janela GCLID = **90 dias** → reportar marcos de meio-funil dentro da janela; **só 1 estágio PRIMARY** alimenta o lance. Renda-familiar no BR é sinal fraco ("Desconhecido" gigante) → usar **geo de alto padrão** como proxy.

---

## 4. O plano — 5 fases (ordem é lei)

### FASE 0 — Consertar o sinal + limpeza (ANTES de qualquer budget novo)
**Objetivo:** parar de dar exemplos lixo ao algoritmo.

- [ ] **Pré-definir** (Cassie: pre-commitment) o que conta como cada estágio ANTES de criar a conversão. Definição escrita de "lead qualificado", "agendou", "orçamento", "venda".
- [ ] **Auto-tagging ON** (confirmar) — sem isso não há GCLID.
- [ ] **Captura de GCLID no fluxo WhatsApp** — landing própria → botão WhatsApp carrega GCLID via GTM webhook (detalhe na spec da Fase 1). NÃO usar o asset Click-to-WhatsApp nativo do Google (perde GCLID).
- [ ] **Pipeline de import** via **Data Manager + Google Sheets** (NÃO API legada). Planilha: `GCLID | dados hasheados | estágio | valor | data`.
- [ ] **Criar 4 conversões por estágio** com valores graduados; marcar **só 1 como PRIMARY** (provável: "orçamento enviado" — frequente o bastante e dentro da janela de 90d; venda fica secundária até ter volume):
  | Estágio | Valor ilustrativo | Primary? |
  |---|---|---|
  | Lookbook/coleção 60s+ | R$10 | secundária |
  | Configurou mesa | R$40 | secundária (ou primária inicial) |
  | WhatsApp **qualificado** | R$100 | secundária |
  | Agendou consultoria | R$250 | secundária |
  | **Orçamento enviado** | R$8.000 | **PRIMARY** (candidato) |
  | Venda fechada (offline) | valor real R$30k+ | secundária→primária com volume |
- [ ] **Limpeza:** deletar zumbi `[AGD] Lead` (id `7138711130`), demover soft PRIMARYs → SECONDARY, corrigir **timezone → São Paulo**. *(ações de UI / via API conforme permitido)*

**Gate:** só avançar quando o GCLID comprovadamente chega no CRM/planilha (CTM smoke test — Pedro Sobral).

### FASE 1 — Funil = configurador (sem showroom)
**Objetivo:** trocar "deixe seu contato" por uma oferta de COMPROMISSO que auto-seleciona orçamento.

- Configurador "monte sua mesa" (modelo → madeira → acabamento → medida) → **orçamento por e-mail/WhatsApp** + opção de **consultoria de projeto por videochamada**.
- Qualificação por **FIT** (ambiente / nível de personalização / prazo / decisor) — nunca "quanto quer gastar".
- Landing comunica **sob-encomenda + exclusividade** (filtro natural de orçamento) + **prova social "people like us"** (clientes notáveis, projetos reais em residências de alto padrão — a montar; é o que a BlackBall tem com celebridades).
- → spec detalhada em `configurador-fase1-spec-2026-06-08.md`.

### FASE 2 — Search (rede barata, sempre ligada)
- **STAG** (single-theme ad group) por tema de intenção: "mesa de sinuca de luxo", "mesa de jogos sob medida", "mesa de pebolim premium", "mesa sinuca e jantar".
- Match: **Exact + Phrase**. Broad só depois de Smart Bidding treinado.
- **Manual CPC** (volume baixo demais p/ automático).
- **Branded isolada** (Target Impression Share ~95%).
- **Muralha de negativos:** barato, barata, promoção, desconto, usada, OLX, Mercado Livre, MDF, infantil, dobrável, DIY, como fazer, conserto, aluguel, segunda mão, seminovo. Auditar Search Terms semanalmente.
- **ZERO conquesting** (keyword de marca de concorrente — ilegal).

### FASE 3 — Demand Gen / YouTube (o motor)
- **Custom segments por URL** (legal, ≠ keyword de marca): `blackball.com.br`, `breton.com.br`, `artefacto.com.br`, `mulapreta.com`, `boobam.com.br`, `casoca.com.br` + termos de alta intenção.
- **Lookalike narrow** semeado SÓ dos **compradores de maior valor** (precisa da lista first-party — mesmo unlock travado do LAL no Meta).
- Renda Top 10% como camada fraca; **geo de alto padrão** (bairros/CEPs, pins de condomínio como no Meta).
- Criativo de luxo de alta produção (ferramentas de design, não na mão).
- **Medir incrementalidade** (vendas reais novas), não o painel.

### FASE 4 — PMax (por último, se algum dia)
- Só com offline conversion import **maduro** + 30-50 conv/mês.
- Guardrails: brand exclusion ON, Final URL expansion OFF, location expansion OFF, reCAPTCHA/honeypot, audience signals de alto valor, asset groups por produto.

---

## 5. Veredito do conclave (resumo)

- **CONSENSO (6/6):** sinal primeiro; configurador = conversão; Demand Gen (legal) > conquesting Search (ilegal); sem Smart Bidding/PMax sem volume; geo > renda no BR.
- **DISSENSO:** Search-rede (Kim/BLITZ) vs Demand-Gen-motor (Godin/Sobral) → resolução: ambos, mas só depois do sinal; Search é a rede, Demand Gen é o motor.
- **MAIOR ERRO A EVITAR (unânime, afiado por Cassie):** despejar budget antes de consertar os exemplos que se dá ao algoritmo — e ligar micro-conversões sem **pré-definir** o que é "bom" (só muda a cegueira de estágio).

---

## 6. Pontos cegos / dependências

1. **Depende de PROCESSO de vendas, não de ad-tech:** capturar GCLID no WhatsApp + marcar estágios num CRM/planilha. **Sem CRM/planilha disciplinada, não há sinal.**
2. O volume pode **nunca** chegar ao Smart Bidding — viver em Manual CPC + Demand Gen é aceitável.
3. **Falta a lista de compradores** (first-party) p/ semear lookalike de Demand Gen.
4. **Falta prova social "people like us"** (clientes notáveis) — ativo a construir.
5. ⏰ **15/Jun/2026:** construir no Data Manager + Sheets, não na API legada.
6. OAuth Google quebra a cada ~7d até publicar consent screen Testing→Production.

---

## 7. Fontes (seleção)

**Medição (oficial Google):** [Set up OCI w/ GCLID](https://support.google.com/google-ads/answer/7012522) · [Enhanced Conversions for Leads](https://support.google.com/google-ads/answer/15713840) · [Upgrade OCI→ECL](https://support.google.com/google-ads/answer/14274408) · [OCI FAQs (90d)](https://support.google.com/google-ads/answer/10029210) · [Value-based bidding](https://support.google.com/google-ads/answer/15099424) · [Manage offline conversions / aviso 15-Jun-2026](https://developers.google.com/google-ads/api/docs/conversions/upload-offline) · [Dev Blog 15/Mai/2026](https://ads-developers.googleblog.com/2026/05/changes-to-offline-click-conversion.html)

**Bidding/baixo volume:** [Store Growers — Bid Strategy](https://www.storegrowers.com/google-ads-bid-strategy/) · [Adalysis — Target vs Max](https://adalysis.com/blog/when-to-use-target-vs-max-cpa-roas-bidding-strategies-for-google-ads/) · [Optmyzr — Portfolio bidding](https://www.optmyzr.com/blog/portfolio-bidding-and-campaign-groups-guide/) · [SEJ — Micro-conversions](https://www.searchenginejournal.com/ask-a-ppc-what-marketers-need-know-about-micro-conversions-google-ads/543045/)

**Demand Gen/PMax:** [Solutions8/John Moran — Demand Gen](https://sol8.com/google-ads-demand-gen-campaigns-first-results/) · [Lunio — lookalike seed](https://www.lunio.ai/blog/demand-gen-strategy) · [Search Engine Land/Menachem Ani — Why PMax lead-gen fails](https://searchengineland.com/why-performance-max-lead-generation-fails-make-it-work-393038)

**Concorrência/jurídico:** [STJ REsp 2.096.417/SP](https://www.stj.jus.br/sites/portalp/Paginas/Comunicacao/Noticias/2024/09072024-Terceira-Turma-mantem-condenacao-do-Google-em-caso-de-concorrencia-desleal-com-links-patrocinados.aspx) · BlackBall (blackball.com.br) · [Billard Toulet configurador](https://configurateur.billard-toulet.com/) · [Blatt Billiards](https://blattbilliards.com/)

**Renda BR:** [Google Ads Help — household income](https://support.google.com/google-ads/answer/2580383) · [Lucro Digital (BR)](https://www.lucrodigital.com.br/segmentacao-por-renda-funciona-google-ads/)

---

*Doc gerado por Orion (aios-master) — conclave HYDRA. Pesquisa completa nos dossiês de pesquisa primária (em contexto de sessão). Relacionado: `demand-gen-luxo-blueprint-2026-05-25.md`, `lead-flow-fix-plan-2026-05-27.md`.*
