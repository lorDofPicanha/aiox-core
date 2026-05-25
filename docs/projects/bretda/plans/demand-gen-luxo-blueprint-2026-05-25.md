# Bretda — Blueprint Nível-Parâmetro: Google Demand Gen / YouTube "Intenção de Luxo"

**Data:** 2026-05-25
**Autor:** Traffic Masters Chief (squad marketing-traffic)
**Status:** 🟡 PLANEJAMENTO — ZERO escrita executada. Aguarda consentimento por texto do founder.
**Especialista de execução:** @kasim-aslam (Tier 1 Google, autoridade write Google Ads)
**Conta:** Google Ads `8167636084` (MCC `7943699417`) — greenfield criado 05/Mai, 100% PAUSED

---

## ⛔ ATENÇÃO — LEIA ANTES DE QUALQUER COISA

**ESTE PLANO NÃO PODE GASTAR 1 CENTAVO ENQUANTO A "FUNDAÇÃO" NÃO ESTIVER VERDE.**

A conta Google da Bretda **hoje está CEGA pra vendas**. Subir tráfego pago numa conta que não
enxerga conversão real é exatamente a "doença" já diagnosticada nas 3 contas (Bretda/Tocks/KR):
otimizar por volume/vaidade em vez de por comprador. Demand Gen é uma campanha de IA — ela
**precisa** de sinal de conversão pra aprender. Sem `close-sale` ligado, o algoritmo otimiza por
clique barato e entrega lixo. **Foundation First é inegociável (Quality Gate #1).**

> ⚠️ **Limitação desta sessão de escrita do blueprint:** o `mcp-ads-bridge` NÃO está disponível
> NESTE ambiente (`node` fora do PATH), então este documento não fez leitura ao vivo.
>
> 🟢 **PORÉM** existe um snapshot LIVE de hoje (25/Mai) feito em outra sessão com OAuth já
> restaurado (`session_bretda_crossplatform_audit_25mai`). A Fundação §1 abaixo foi **reconciliada
> com esse audit live**. Mesmo assim, números de saldo/conv decaem — re-verificar no momento de
> executar. Estimativas estão marcadas com 📊.

---

## 1. PRÉ-REQUISITOS BLOQUEANTES (Foundation First) — checklist verde-antes-de-gastar

Nada do §2 em diante pode rodar enquanto estes itens não estiverem confirmados VERDES.

| # | Item | Status (audit live 25/Mai) | Quem resolve | Bloqueia? |
|---|------|----------------------------|--------------|-----------|
| F-1 | **OAuth Google válido** — `ads_connection_test` PASS | 🟢 VERDE (live 25/Mai, OAuth restaurado) | — | resolvido |
| F-2 | **Close-sale / conversão de venda EM USO** — a conta enxerga VENDA real. ⚠️ A ação offline `Bretda Sale Closed (Offline OC)` (UPLOAD_CLICKS) **EXISTE mas NUNCA recebeu upload** — a conta está tecnicamente configurada mas operacionalmente cega. **Para Demand Gen funcionar, precisa de sinal de conversão fluindo.** Mínimo viável: garantir que `Bretda Lead Form Submit (Web)` / `Lead - Pagina Obrigado` disparem de fato na LP de destino (lead biddable). Ideal: começar a rotina de upload de OC (close-sale) do CRM/Sales AI. | 🔴 OC nunca usada | Founder + @kasim-aslam | HARD BLOCK |
| F-3 | **Conversões PRIMARY enxugadas (máx 2)** — hoje há **5 PRIMARY** (live): `Bretda Sale Closed (Offline OC)` R$1500 + `Bretda Lead Form Submit (Web)` R$1500 + `Lead - Pagina Obrigado` R$1500 + `[AGD] Lead codeless` R$100 (fantasma) + `Contato` R$0. Demand Gen otimizando contra 5 PRIMARY com valores fixos infla e confunde o algoritmo. Demotar para SECONDARY tudo menos 2 (recomendado manter PRIMARY: a venda offline OC + 1 lead biddable; zerar `default_value` dos leads pra não inflar). | 🔴 5 PRIMARY (live) | @kasim-aslam (write, sob aprovação) | HARD BLOCK |
| F-4 | **Saldo / billing OK** — runway > 5 dias no orçamento de teste (`display_string`, NÃO campo `balance`). Saldo Meta era R$324,89; **billing do Google é conta/cartão separado — confirmar live antes de ligar.** | ⚠️ verificar Google billing | Founder | HARD BLOCK |
| F-5 | **Timezone da conta = São Paulo** — confirmado live **ainda America/Fortaleza** (ação UI de 05/Mai nunca foi feita). Op de UI permanente. | 🔴 ainda Fortaleza (live) | Founder (UI) | SOFT — distorce janela de relatório/horário |
| F-6 | **LP de destino pronta e rastreada** — coleção (Aurora/Citrino/Opal/Zurita/Âmbar) com tag de conversão disparando + sem preço na dobra. ⚠️ Audit live: **post-click quality score = 2** (LP abaixo da média) nos termos genéricos → afeta entrega/custo. Vale uma passada de LP. | ⚠️ QS2 LP fraca (live) | Founder + @aios-dev (tag/LP) | HARD BLOCK (tag) / SOFT (QS) |
| F-7 | **Domínios dos concorrentes confirmados** (ver §3 — Usal pendente) | 🟡 4/5 confirmados | Founder | SOFT — sobe sem Usal |

**Regra de ouro:** se F-2, F-3, F-4 ou tag de F-6 estiver vermelho → **HALT**. Não subir budget.
A causa-raiz do "0 conversões" do Google hoje **NÃO é tag quebrada** — é **inanição estrutural**
(740 impressões/30d, ~90% budget-lost-IS) somada à conta nunca ter recebido upload de venda. O
Demand Gen ataca a inanição (traz volume novo de público modelado), mas só vale a pena **depois**
que a conta começa a registrar conversão real — senão repete a cegueira.

### Re-confirmação de estado live (rodar no momento de executar — valores decaem)
```
ads_connection_test                              # OAuth ainda fresh? (F-1)
google_ads_conversion_actions <customer_id>      # PRIMARY ainda 5? OC já recebeu upload? (F-2/F-3)
google_ads_overview <customer_id>                # saldo/runway Google via display_string (F-4)
```

---

## 2. ESTRUTURA DA CAMPANHA

| Parâmetro | Valor | Por quê |
|-----------|-------|---------|
| **Tipo** | Demand Gen (NÃO PMax, NÃO Display, NÃO Search) | Demand Gen é o único formato que entrega no YouTube + Shorts + Discover + Gmail com **audiência MODELADA** a partir de Custom Segment. É o substituto honesto do LAL de comprador que a Bretda ainda não pode montar (<100 clientes). |
| **Nome** | `[DG] Intenção de Luxo — YouTube/Discover — 2026-05-25` | Naming consistente com convenção da conta |
| **Objetivo** | Leads / "Visualizações de página de destino + Lead" | Bretda vende ticket alto sob consulta → o evento de valor é **lead qualificado por FIT**, não venda direta no site |
| **Meta de conversão** | A conversão de Lead qualificado (F-2/F-3). NUNCA "cliques" ou "views" como meta | Evita a doença de vaidade |
| **Status inicial** | **PAUSED** | Sobe pausada, founder aprova, só então ENABLE |
| **Nº de ad groups** | **2** (ver abaixo) | Separar os DOIS sinais de Custom Segment pra medir qual traz lead melhor — não misturar |

### Lógica de separação dos 2 ad groups

> A separação NÃO é por geo nem por criativo — é pelo **tipo de sinal de audiência**, porque os
> dois sinais têm qualidade e custo diferentes e precisam ser medidos separados. Mesmo geo, mesmo
> criativo nos dois, só muda o Custom Segment anexado.

- **AG-1 — "Concorrente (sites de luxo)"** → Custom Segment por **URL de concorrente** (audiência modelada "parecida com quem navega esses sites"). Sinal mais largo, topo de funil, tende a CPL mais alto e lead mais frio. Hipótese a testar.
- **AG-2 — "Intenção de Categoria (termos)"** → Custom Segment por **termos de busca de categoria de luxo**. Sinal mais quente (a pessoa pesquisou ativamente "mesa de sinuca de luxo" etc.). Tende a CPL menor e lead melhor. **Aposta principal.**

Medir AG-1 vs AG-2 no kill-gate (§7) e realocar budget pro vencedor.

---

## 3. O CUSTOM SEGMENT (exato)

### 3.1 A diferença que importa (explicação pro founder)

O Google oferece DOIS botões ao montar um Custom Segment, e eles fazem coisas diferentes:

1. **"Pessoas que pesquisaram qualquer um destes termos no Google"** (search terms)
   → mira **comportamento ATIVO recente**: gente que digitou aquilo na Busca/YouTube nos últimos dias.
   É o sinal **mais quente e mais honesto** — a pessoa demonstrou interesse de fato. → vai no **AG-2**.

2. **"Pessoas com qualquer um destes interesses ou intenções de compra"** + **URLs**
   → mira gente cujo **comportamento de navegação se parece** com quem visita aqueles sites.
   ⚠️ **Não são os visitantes reais dos concorrentes** (isso é impossível — só o dono do pixel do
   Breton remarketeia quem entrou no breton.com.br). É uma audiência **MODELADA/lookalike** que o
   Google monta inferindo padrão. Além disso, o Google usa o **domínio inteiro**, ignora a página
   específica. É legítimo e legal, mas é sinal mais frio e mais largo. → vai no **AG-1**.

**Resumo honesto:** não estamos "roubando a audiência do Breton". Estamos dizendo ao Google
"ache gente que se comporta como quem se interessa por móvel de luxo desse tipo" — e o algoritmo
modela. Por isso o AG-2 (termos) é a aposta principal e o AG-1 (URLs) é o experimento de topo.

### 3.2 Lista de URLs de concorrentes — AG-1

Formato real aceito pelo Google (domínio sem `https://`, sem `www`, sem caminho):

```
breton.com.br
artefacto.com.br
mulapreta.com
boobam.com.br
```

> 🟡 **Usal — PENDENTE confirmação do founder.** A busca pública só achou `usalproject.com`,
> que é uma marca de OUTDOOR de Los Angeles (não a marca de móveis BR citada). NÃO vou inventar
> domínio. Founder precisa confirmar a URL exata da "Usal" móveis BR; até lá AG-1 sobe com 4
> domínios. (TODO — `usal {dominio} aqui`.)

**Sugestão de expansão (opcional, founder decide):** adicionar mais sinais de domínio de luxo
adjacente pra dar volume ao modelo — ex.: `westwing.com.br`, `dpot.com.br`, `micasa.com.br`.
NÃO adicionar sem aprovação; cada domínio extra dilui o foco.

### 3.3 Lista de termos de categoria de luxo — AG-2

Termos de busca (a pessoa pesquisou isto no Google/YouTube). Sem marca de concorrente (evita risco
STJ). Foco no objeto + qualificador de luxo/sob-medida:

```
mesa de sinuca de luxo
mesa de bilhar sob medida
mesa de sinuca madeira maciça
mesa de jantar de luxo sob medida
mesa de jantar madeira maciça grande
móveis de luxo sob medida
mobiliário de alto padrão
mesa de bilhar premium
mesa de sinuca personalizada
marcenaria de luxo
móveis assinados design brasileiro
mesa de jantar 12 lugares madeira
```

> Refinar com base no portfólio real da Bretda (Aurora/Citrino/Opal/Zurita/Âmbar = sinuca; linha
> jantar). NÃO incluir nome de concorrente como termo (seria conquesting de marca → risco).

---

## 4. SEGMENTAÇÃO COMPLEMENTAR

| Camada | Configuração | Justificativa |
|--------|--------------|---------------|
| **Geo** | Brasil (2076) com **PRESENCE = "Pessoas que estão / frequentam regularmente"** (NÃO "interesse no local"). Foco capitais + regiões de alta renda, **não isolar só Sudeste** (gotcha G-011): SP capital + interior rico (Campinas/Ribeirão), RJ (zona sul/Barra), DF (Brasília), além de BH, Curitiba, Floripa, Balneário Camboriú, Goiânia, capitais NE (Recife/Fortaleza/Salvador). | Público de luxo BR é nacional, concentrado em bolsões de renda. PRESENCE evita gente que só "pesquisou viagem pro Brasil". |
| **Idade** | 30–65 | Decisor de compra de móvel de luxo sob encomenda |
| **Renda (income targeting)** | Se disponível na conta BR: **Top 10% + 11–20%** (faixas altas de renda domiciliar). ⚠️ A segmentação por renda do Google **nem sempre está disponível no Brasil** — TODO confirmar na conta. Se indisponível, o filtro de renda vem do geo (bairros) + Custom Segment de termos de luxo. | Reforça poder de compra sem mostrar preço |
| **Devices** | Todos, com leve preferência mobile (YouTube/Shorts é mobile-first). Não excluir desktop (decisão de móvel caro acontece no desktop também). | Demand Gen entrega cross-device |
| **Idioma** | Português (1014) | Mercado BR |
| **Exclusões** | (a) Excluir **público de retargeting do próprio site** (esta é prospecção, não RTG — RTG é campanha separada quando a audiência >1k). (b) Excluir cargo/segmento de **arquiteto/designer de interior** se disponível como exclusão de afinidade — coerente com a decisão Meta de mirar o COMPRADOR-FINAL, não o profissional revendedor. (c) Excluir placements infantis/games no YouTube (brand safety luxo). | Evita canibalizar RTG, evita gastar com intermediário, protege marca |

---

## 5. CRIATIVO (regra inegociável: SEM PREÇO)

🔴 **Nenhum criativo, headline, descrição ou thumbnail pode mostrar preço, "a partir de", "parcelas",
"R$" ou desconto.** Posicionamento luxo — decisão dos donos. O filtro de orçamento do lead vem da
qualificação por FIT, não do preço no anúncio.

> 🟢 **DECISÃO DO FOUNDER (25/Mai): LANÇAR IMAGE-ONLY.** Demand Gen NÃO exige vídeo —
> imagem única/carrossel é formato completo de lançamento. Com imagem o anúncio entrega em
> **Discover + Gmail + feed do YouTube** (a maior fatia). O que fica de fora sem vídeo é o
> **in-stream do YouTube e o grosso do Shorts** (esses pedem vídeo). A Bretda já tem fotografia
> profissional de produto/ambiente (as mesmas lifestyle do site) → insumo na mão, zero produção nova.
> **Vídeo vira Fase 2 opcional** (amplificador), só se o teste de 14d validar o ângulo — e pode ser
> gerado das próprias fotos (pan/zoom ou IA imagem→vídeo, sem preço).

### Specs Demand Gen (confirmados via Google Ads Help 2025)

**Imagem (FORMATO DE LANÇAMENTO):**
- Aspect ratios: **1.91:1 (landscape)**, **1:1 (square)**, **4:5 (portrait)**.
- Subir as 3 proporções de cada conceito pra cobrir todos os placements de imagem.
- Foco em **ambiente/lifestyle** (a mesa montada num salão sofisticado), não foto técnica fundo-branco.
- Onde serve: Discover, Gmail, YouTube in-feed. (Não serve em in-stream/Shorts — esses exigem vídeo.)

**Vídeo (FASE 2 — opcional, não bloqueia o lançamento):**
- Só entra se o ângulo validar no kill-gate de 14d. Desbloqueia in-stream + Shorts.
- Gerável das fotos existentes: pan/zoom cinematográfico ou IA imagem→vídeo, 8–20s, hook nos 3s, sem preço.
- Hospedado no canal YouTube da Bretda. Formatos 16:9 / 1:1 / 4:5 / 9:16. MP4 / H.264.

**Texto:**
- Até **5 headlines × 40 caracteres**.
- Até **5 descrições × 90 caracteres**.
- Business name 25 caracteres ("Bretda").

### Conceitos de criativo (5) — comprador-final de luxo, sem preço

**Conceito 1 — Herança / "passa de geração"**
- Headline: `A mesa que vira herança de família`
- Headline: `Feita à mão para durar décadas`
- Descrição: `Madeira maciça selecionada, marcenaria autoral. Uma peça única para o seu salão.`
- Formato: imagem 1.91:1 + 4:5 da peça em ambiente residencial sofisticado.

**Conceito 2 — Artesanato / mestre marceneiro**
- Headline: `O trabalho de um mestre marceneiro`
- Headline: `Cada detalhe pensado à mão`
- Descrição: `Da seleção da madeira ao acabamento final. Mobiliário de alto padrão sob encomenda.`
- Formato: imagem 1:1 + 4:5 close artesanal (detalhe do acabamento / textura da madeira).

**Conceito 3 — Exclusividade / sob medida**
- Headline: `Sua mesa, do seu jeito, só sua`
- Headline: `Sob medida para o seu ambiente`
- Descrição: `Tamanho, madeira e acabamento personalizados. Exclusividade que combina com sua casa.`
- Formato: imagem 4:5 + 1:1 da peça em coleção (Aurora/Opal) num ambiente amplo.

**Conceito 4 — Ambiente aspiracional / "o salão dos sonhos"**
- Headline: `O salão de jogos que você sempre quis`
- Headline: `Design assinado para a sua casa`
- Descrição: `Mesas de sinuca e jantar que transformam o ambiente. Peças de design brasileiro autoral.`
- Formato: imagem 1.91:1 lifestyle (ambiente elegante em volta da mesa).

**Conceito 5 — Convite consultivo (CTA de lead)**
- Headline: `Converse com nosso atelier`
- Headline: `Projete a sua peça exclusiva`
- Descrição: `Atendimento personalizado para criar o móvel de luxo da sua casa. Fale com um especialista.`
- CTA: "Saiba mais" / "Fale conosco" → LP de coleção com formulário de lead.

> Os 5 conceitos devem rodar nos 2 ad groups iguais (mesmo criativo nos dois) pra que a única
> variável seja o sinal de audiência. Ativar 3 conceitos no D+0 (1, 3, 5), guardar 2 e 4 como
> variação de rotação após o primeiro aprendizado — evita fragmentar o orçamento de teste.

---

## 6. LANCE E ORÇAMENTO

### Estratégia de bid

| Fase | Estratégia | Por quê |
|------|------------|---------|
| **D+0 → primeira ~15-20 conv** | **Maximize Conversions** (sem tCPA) | Conta nova + conversão imaculada precisa de volume de aprendizado ANTES de travar num alvo de CPA. Travar tCPA cedo demais sufoca a entrega e o algoritmo nunca aprende (gotcha clássico). Demand Gen é IA — deixa ela explorar primeiro. |
| **Após ~15-20 conv / ~D+14** | **Migrar para tCPA** com alvo = mediana do CPL real observado | Só DEPOIS de ter baseline real de CPL é honesto travar tCPA. Define o alvo pelo dado, não pelo chute. |

> Espelha a regra "Smart Bidding só com baseline" já usada em Search. Aqui o baseline se forma
> nos primeiros 14 dias em Maximize Conversions.

### Orçamento de teste

- **Sugestão: R$ 50/dia** na campanha (CBO entre os 2 ad groups, Google distribui).
  - Faixa aceitável: R$ 30–50/dia. Abaixo de R$30 o Demand Gen mal sai do learning.
- **Por quê R$50:** ticket alto + funil longo → o lead de luxo é raro e mais caro. Com CPL
  estimado de ~R$30–80 (📊 **ESTIMATIVA**, sem dado live), R$50/dia gera ~1–2 leads/dia, o
  suficiente pra alimentar o aprendizado da IA sem queimar caixa antes do kill-gate de 14d.
- **Teto de gasto da fase de teste:** R$ 50/dia × 14d = **~R$ 700** de risco máximo no experimento.
- **Regra de escala (Quality Gate #7):** quando escalar, máx **+20%/dia** (cap +30%), nunca 2x.

---

## 7. MEDIÇÃO E KILL-GATE (anti-doença de vaidade)

### O que observar (e o que IGNORAR)

| ✅ Observar (sinal de comprador) | 🚫 Ignorar (vaidade) |
|----------------------------------|----------------------|
| **Leads qualificados por FIT** (a pessoa cabe no perfil: ambiente, orçamento real, prazo) | Volume bruto de cliques |
| **CPL de lead qualificado** (custo por lead que presta) | CTR alto isolado |
| **Taxa lead→conversa→proposta** (o lead vira atendimento?) | Impressões / views |
| **Qual AG (URL vs termos) traz lead melhor** | "Engajamento" do YouTube |
| **CPA real de venda** (quando close-sale amadurecer) | CPL "barato" de lead lixo |

> A doença diagnosticada nas 3 contas foi otimizar por volume/clique barato. Aqui o veredito é
> sempre **qualidade do lead por FIT**, validada com o time de vendas — não o número que o painel
> exibe maior.

### Kill-gate objetivo — janela de 14 dias

| Cenário em D+14 | Decisão |
|------------------|---------|
| ≥ 1 lead **qualificado por FIT** com CPL ≤ ~R$ 80 (📊 estimativa-alvo, ajustar pós-baseline) E AG vencedor identificado | **ESCALAR** o AG vencedor +20%/dia; migrar pra tCPA |
| Leads chegam mas **nenhum** passa no FIT (todos lixo/curiosos) | **MATAR o ângulo de concorrente.** Sinal de que a audiência modelada não traz comprador. Volta o foco 100% pro motor Meta (blueprint 23/Mai) |
| CPL de lead qualificado > ~R$ 150 sustentado | **PAUSAR**, revisar criativo/segmento antes de gastar mais |
| Zero conversão / entrega travada em learning | **HALT + diagnosticar** (provável conversão/tag quebrada — volta pra Foundation §1) |

**Checkpoints intermediários:** D+3 (entrega saiu do learning? gasto está dentro?), D+7 (primeiros
leads — sinal de qualidade preliminar). Sem decisão de escala antes de D+14 (não thrashing de dados).

---

## 8. SEQUÊNCIA DE EXECUÇÃO (descrita, NÃO executada)

Quando o founder aprovar **e** a Fundação (§1) estiver verde:

1. **Pre-flight** — `ads_connection_test` (OAuth fresh — estava VERDE 25/Mai). Se 401 → HALT, pede reauth.
2. **Foundation gate** — `google_ads_conversion_actions` confirma: (a) ≤2 PRIMARY (hoje 5 → demotar `[AGD] Lead`, `Contato` e um dos R$1500 pra SECONDARY; zerar `default_value` dos leads), (b) sinal de conversão fluindo (lead biddable disparando na LP **ou** rotina de OC iniciada). `google_ads_overview` confirma saldo/runway Google via `display_string`. Se vermelho → HALT. **A demoção de conv PRIMARY é um WRITE → entra no triple-gate do passo 8 e exige aprovação.**
3. **Jarvis self-consultation** (Quality Gate — nova campanha): conclave 3 experts sobre o setup Demand Gen Bretda antes de criar.
4. **Criar 2 Custom Segments** (PAUSED não se aplica a segment — só criar): `CS-Concorrente-URLs` (4 domínios §3.2) e `CS-Categoria-Luxo-Termos` (§3.3).
5. **Criar campanha** `[DG] Intenção de Luxo` PAUSED — objetivo Leads, conversão = lead qualificado, Maximize Conversions, CBO R$50/d, geo BR 2076 PRESENCE não-isolado-Sudeste, idade 30-65, idioma pt, exclusões §4.
6. **Criar AG-1 (URLs)** + anexar `CS-Concorrente-URLs`. **Criar AG-2 (termos)** + anexar `CS-Categoria-Luxo-Termos`.
7. **Subir assets de criativo** (imagens 1.91:1/1:1/4:5 das fotos existentes — vídeo é Fase 2 opcional) e montar 3 ads (conceitos 1, 3, 5) em CADA ad group.
8. **Triple-gate de write** em cada mutação: `ads_guardrails` OK → `ads_action_log` com `client_request_id` (UUID v4) → budget circuit-breaker.
9. **Deixar tudo PAUSED.** Reportar ao founder pra revisão visual no painel.
10. **ENABLE só após "ok pode ligar"** do founder. Pós-launch: `ads_action_log` verificado, memória atualizada, insights publicados, monitor D+3/D+7/D+14.

**Rollback:** qualquer anomalia (CPL absurdo, gasto disparado, conversão quebrada) → PAUSE a
campanha (reversível) e diagnosticar. Saga: se a criação falhar no meio, reverter os recursos já criados.

---

## Decisões já fechadas (não relitigar)
- Canal = Google Demand Gen/YouTube via Custom Segment. Meta descartado pra este ângulo (mantém blueprint 23/Mai). Search conquesting de marca = PROIBIDO (risco STJ 09/07/2024).
- Concorrentes-alvo: Breton, Mula Preta, Artefacto, Usal (domínio a confirmar), Boobam.
- Nunca mostrar preço.

## TODOs explícitos (não inventados)
- [ ] **F-2 (HARD):** começar a fazer o sinal de conversão fluir — garantir lead biddable disparando na LP e/ou iniciar rotina de upload de OC (close-sale). A `Bretda Sale Closed (Offline OC)` existe mas nunca recebeu upload (confirmado live).
- [ ] **F-3 (HARD):** demotar conv PRIMARY de 5 → 2 e zerar `default_value` dos leads (write sob aprovação).
- [ ] **F-4 (HARD):** confirmar billing/saldo do Google (conta separada do Meta) live.
- [ ] **F-5 (soft):** corrigir timezone Fortaleza → São Paulo (UI do founder).
- [ ] **F-6:** revisar LP (post-click QS=2 live) + confirmar tag de conversão dispara.
- [ ] Domínio correto da "Usal" móveis BR (founder).
- [ ] Confirmar se income targeting está disponível na conta BR.
- [ ] Refinar lista de termos §3.3 com SKUs reais do portfólio.
- [ ] Conclave Jarvis antes de criar (passo 3).

---

**Comando-gatilho pro founder:** `executa demand gen luxo bretda`
(só roda após Foundation §1 verde + este consentimento por texto)

**Gatilhos auxiliares:** `usal dominio aqui {url}` · `confirma conta bretda` (libera leitura quando bridge voltar) · `revisa blueprint demand gen`
