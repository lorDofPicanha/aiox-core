# Buscador de Licitações — Águas Lindas-GO + DF

**Status:** 🟢 NOVO PROJETO — research phase
**Início:** 2026-05-14
**Owner:** Breno (uso pessoal + amigo na área)
**Workspace:** `docs/projects/buscador-licitacoes/`

---

## 1. Intent (por que existe)

- **Persona primária:** Amigo do user que trabalha caçando licitações nessa região
- **Persona secundária (futura):** Uso pessoal do Breno + potencial produto SaaS B2B regional
- **Pain point:** Hoje fornecedores dependem de plataformas pagas nacionais (Effecti, LicitaNet, Conlicitação) ou ficam refrescando manualmente PNCP / e-Compras DF / portal da Prefeitura de Águas Lindas
- **Hipótese:** Mercado regional super-nichado (Águas Lindas + DF) tem cauda longa de pequenas oportunidades que players nacionais ignoram. Ferramenta hiper-regional pode ser mais útil que paga genérica

## 2. Escopo Geográfico (NON-NEGOTIABLE)

- ✅ **Águas Lindas de Goiás** (Prefeitura + autarquias municipais)
- ✅ **Distrito Federal** (GDF + Câmara Legislativa + TCDF + autarquias DF inteiras)
- ✅ **Federal com filtro DF** (PNCP/ComprasGov: licitações federais que executam em Brasília/DF)
- ⚠️ **Goiás estadual** (ComprasNet GO) — apenas se houver overlap funcional
- ❌ **Brasil nacional** — fora de escopo (pode entrar em v2 se virar produto)
- ❌ **Internacional/LATAM** — fora de escopo

**Implicação arquitetural:** ~5-12 portais alvo (não 5000). Pipeline de scraping muito mais enxuto. Search engine local viável (não precisa Elasticsearch cluster).

## 3. Persona & Posicionamento

### Persona Primária — "Fornecedor B2B caça-licitações regional"
- Empresa pequena/média que vende para governo DF/região
- Hoje paga R$150-500/mês plataforma nacional ou faz manual
- Quer alertas precisos por palavra-chave + CNAE + valor
- Quer ver edital completo PDF + extrair requisitos rapidamente
- Decide rapidamente "vai ou não vai" em 4-24h da publicação

### Posicionamento (hipótese inicial — validar)
- "O melhor buscador de licitações da Grande Brasília"
- Vertical regional > horizontal nacional comoditizado
- Free tier robusto (uso pessoal viable) + pago se quiser features pro

## 4. Constraints

### Técnicos
- **Stack preference:** Next.js (Breno conhece) + Postgres + algo de search
- **Infra preferida:** Vercel (frontend) + Railway/Supabase (backend) — barato/free tier
- **Compliance:** LGPD desde dia 1 (dados de empresas/CNPJs)
- **Build effort:** Solo dev (Breno) + amigo como product owner/validador

### De Negócio
- Sem deadline rígido
- Sem budget alocado para infra paga ainda
- Free first → monetização se virar produto
- NÃO compete com Tocks/Bretda em prioridade — projeto de back-burner

## 5. Glossário (termos do domínio)

| Termo | Significado |
|-------|-------------|
| **PNCP** | Portal Nacional de Contratações Públicas — obrigatório por Lei 14.133/2021 |
| **ComprasGov** (ex-ComprasNet) | Portal federal de compras |
| **Pregão Eletrônico** | Modalidade mais comum de licitação (Lei 10.520 + 14.133) |
| **Edital** | Documento que descreve a licitação (PDF denso, 50-200 páginas) |
| **Dispensa** | Compra direta sem licitação (até R$50k bens/R$100k obras Lei 14.133) |
| **SICAF** | Sistema de Cadastro Unificado de Fornecedores |
| **CNAE** | Classificação Nacional de Atividades Econômicas |
| **e-Compras DF** | Portal de compras do GDF |
| **TCDF** | Tribunal de Contas do DF |
| **CGE-DF** | Controladoria-Geral do DF |
| **Ata de Registro de Preços (ARP)** | Compromisso de fornecimento sem obrigação de compra |
| **ME/EPP** | Microempresa / Empresa de Pequeno Porte (têm preferências legais) |

## 6. Known Dead-Ends (preencher conforme aprende)

- (vazio — primeiro contato com o domínio)

## 7. Triggers de Memória

| Trigger | Ação |
|---------|------|
| `continua buscador licitações` | Carrega este CONTEXT.md + última sessão |
| `mega research licitações` | Spawn squad 6 agentes paralelo |
| `arquitetura licitações` | Lê 02-architecture/ |
| `squad licitações` | Lê 03-squad/ |
| `gate buscador licitações` | Avalia próxima decisão de fase |

## 8. Pendências de Decisão

- [x] ~~CNAE/setor de atuação do amigo (refina filtros default)~~ — ainda em aberto, mas escopo expandido
- [ ] Nome do amigo + razão social da empresa dele (para CONTEXT pessoal)
- [x] **Validação Águas Lindas:** confirmado — usa Portal de Compras Públicas (privado) + publica no PNCP (não tem portal próprio denso)
- [x] **SICAF v1:** confirmado — SICAF substitui ~70% dos docs rotineiros mas **NÃO substitui ACT**

---

## 9. EXPANSÃO DE ESCOPO — 18/Mai/2026 (v2, depois v3 noite)

**Trigger:** 5 áudios do cliente pedindo **Livro Caixa** + **automação de análise documental** ("desclassificar / reanálise" = recurso administrativo manual hoje).

### v3 (18/Mai noite — CORREÇÕES MATERIAIS do v2)

🟢 **Workflow REAL (6 estágios + 1 base):**

```
BASE: Livro caixa 3 empresas (Pluggy + categorização IA + auto-BP/DRE)
   ↓ alimenta
1. MONITORAR — PNCP+DF+AL 24/7, push WhatsApp <15min
2. ANALISAR 6M — histórico do mesmo órgão (MOAT)
3. INDICAR DIFERENCIAL — 5 frases acionáveis (MOAT)
4. HABILITAR — dossiê <30min (ACT matcher + Auto-BP/DRE + CRF/CND)
5. ACOMPANHAR — vencedor declarado → docs baixados <3min
6. RECORRER — minuta jurídica <8min (template + RAG Lei 14.133/TCU)
```

🚨 **CORREÇÕES vs v2:**

1. **SÃO 3 EMPRESAS, NÃO 4.** Briefing v2 listou INYAC/INC/CENTINELA/ENHAC — incorreto. Realidade: **3 empresas, 1 delas faz licitação pública**. As outras 2 são gestão financeira.

2. **MOAT v2 estava parcialmente fechado.** Effecti/ConLicitação já fazem análise histórica 6m do mesmo órgão desde 2024. **Moat real** está em 3 camadas: (a) síntese prescritiva 5-frases, (b) backstage integration (livro caixa + vault + RLS), (c) verticalização regional DF.

3. **Anti-conluio Lei 14.133 art. 14 IV** cai de severidade. Era pilar central no v2 (Pipeline 7), agora é alerta soft (só 1 empresa licita; outras 2 acionam alerta se tentarem entrar em mesmo edital).

4. **WhatsApp Bot precisa estar no Sprint 1**, não Sprint 6 — Pai (60+) é maior risco UX; PWA + push + Pluggy OAuth + LGPD = 5 conceitos novos em 72h.

5. **OCDS já normalizado no BR** (data.open-contracting.org) — Stage 2 pode rodar em paralelo com Stage 1, não sequencial. Sprint sequencing simplifica.

6. **Pricing model definido: NÃO é SaaS, é workflow-as-a-service.** Cliente paga R$ 2.800/mês (R$ 33.6k/ano) — economiza R$ 381k/ano de custo manual escondido (ROI 12×). Modelo Hormozi (5-15% do valor entregue).

### Empresas (CORRIGIDO v3):
- **3 empresas reais** — nomes a confirmar na call discovery
- **1 das 3 faz licitação pública** — a empresa-licitante
- **As outras 2** são operação financeira (livro caixa + RBAC)
- **Roles RBAC:** Master (cliente) | Receita (pai) | Despesa por empresa (N pessoas, 1 por empresa) — total a confirmar

### Stack OSS confirmada (pós mega-research):
- PDF parsing: **Docling (MIT)** + pdf-lib (MIT) — NÃO usar Marker (GPL-3) nem PyMuPDF (AGPL-3)
- Embeddings PT-BR: **`rufimelo/Legal-BERTimbau-large-v2`** (MIT) state-of-art jurídico
- Vector: **pgvector** dentro do Supabase
- Validação CNPJ alfanumérico (RFB jul/2026): `carvalhoviniciusluiz/cpf-cnpj-validator` (MIT)
- OCDS BR: OCDS Kit (BSD-3)
- Stack base: Next.js 16 + Supabase + Inngest + Pluggy + WhatsApp Cloud API + Resend + Sentry

### Áudio 1 ("outro processo")
Confirmado FORA do escopo licitação — Pipeline 6 TBD, parking lot até detalhar na call discovery.

### Custo / Pricing (v3):

| Fase | Clientes | Infra/mês | Preço cobrado/mês | Margem/ano |
|---|---|---|---|---|
| 1 — Piloto | 1 case-âncora | R$ 80-220 | R$ 0 (grátis) | — |
| 2 — Beta | 5 pagantes | R$ 700-900 | R$ 2.800 (Pro) | R$ 115-165k |
| 3 — Escala | 50 regional DF | R$ 4.500-6.000 | R$ 2.800 médio | R$ 14k/mês |

### Brief unificado (substituído):
- ~~`99-synthesis/PROJECT-BRIEF-18mai-expansion.md`~~ — v1 (4 áudios)
- ~~`99-synthesis/BRIEFING-REAL-CONSOLIDADO.md`~~ — v2 (assumiu 4 empresas, anti-conluio central)
- **🟢 v3 PENDENTE** — gerar `99-synthesis/BRIEFING-REAL-v3.md` corrigido

### Decisões pendentes pré-Sprint 0:
- [ ] **C1-NEW** Nome real das 3 empresas + qual delas licita (Bloco C reduzido)
- [ ] **C2** Regime tributário de cada
- [ ] **C3** ERP/contador atual
- [ ] **C4** Histórico licitação 12m da empresa-licitante
- [ ] **C5** Quem lança despesa (pai + N pessoas)
- [ ] **C6** Sua dor #1 (Caixa / Buscador / Habilitação / Recurso)
- [ ] **C7** O "outro processo" do áudio 1 (Pipeline 6 scope)

### Artefatos gerados 18/Mai noite:
- `04-deck-diagnostico-amigo/deck.html` — Deck AIOX 13 slides 16:9 (lime accent dark theme)
- `04-deck-diagnostico-amigo/` — 17 yaml/md (briefing-normalized, audience-belief-shift, story-arc, slide-function-map, deck-spec, speaker-notes, source-ledger, qa-report, etc)
- `05-mega-research/` — 6 research files (183KB):
  - `01-data-portais-base.md` (Dara/data-engineer)
  - `02-architect-pdf-act-recurso.md` (Aria/architect)
  - `03-analyst-moat-mercado.md` (Alex/analyst)
  - `04-ux-mobile-bot.md` (Uma/ux)
  - `05-pm-roadmap-business.md` (Morgan/pm)
  - `06-oss-landscape.md` (general-purpose)

### Triggers de memória v3:
| Trigger | Ação |
|---------|------|
| `continua buscador workflow` | Carrega este CONTEXT v3 + workflow real |
| `revisa briefing v3` | Gera novo BRIEFING-REAL-v3.md com correções |
| `atualiza deck` | Regenera deck.html com pricing model workflow-as-a-service |
| `agendar call amigo` | Prepara material de discovery (Bloco C reduzido 6 perguntas) |
| `vai com sprint 0 buscador` | Dispara discovery + schema design |

---

## 10. DIVERGÊNCIA 20/Mai/2026 (v4 — call real com a cliente + 3 áudios)

**Trigger:** Conversa real com a cliente. 3 áudios WhatsApp (transcritos via faster-whisper) + correção das fontes + nº de usuários + decoupling do livro caixa.

### 10.1 — Áudios CONFIRMAM o workflow 6 estágios (não contradizem)

A cliente descreveu, com as próprias palavras, exatamente o workflow v3:

- **Áudio 2** (busca + habilitação + dia do certame): *"Hoje a gente faz toda a busca nesses portais, olha um por um, vê qual se adequa... analisa toda a documentação — habilitação jurídica, fiscal, técnica, tudo manual... olha os atestados que se enquadram... participa, faz as declarações do edital, separa documentos manuais, posta no portal e no dia do certame faz o acompanhamento, faz os lances, fase de lance, fica acompanhando os primeiros lugares."* → valida **Stages 1 (Monitorar), 4 (Habilitar), 5 (Acompanhar/Lances)**.
- **Áudio 1** (proposta + DOR #1): *"Se chamados, fazemos proposta comercial adequada + planilhas... Seria legal se o aplicativo acompanhasse as licitações e notificasse (email ou WhatsApp) sempre que tivesse movimentação numa licitação que participamos — porque aconteceu de a gente não acompanhar e acabar perdendo a licitação."* → **DOR PRINCIPAL = notificação de movimentação (Stage 5).**
- **Áudio 3** (recurso): *"Se não somos vencedores, a gente olha a documentação da licitante vencedora pra ver se tem como entrar com recurso e inabilitar o ganhador."* → valida **Stage 6 (Recorrer)**.

**Transcrições salvas em:** `00-context/audios-20mai/` (.txt).

### 10.2 — FONTES REAIS (corrige seção 2 e 7 do glossário)

A cliente NÃO usa "e-Compras DF / portal da Prefeitura". As fontes reais são **5 plataformas**:

| Fonte | O que é | API / Integração | Estratégia |
|---|---|---|---|
| **PNCP** | Agregador FEDERAL obrigatório (Lei 14.133) | API REST pública grátis (`pncp.gov.br/pncp-api/v1`), **polling, sem webhook** | **Base de descoberta (Stage 1)** — quase tudo publica aqui |
| **Portal de Compras Públicas (PCP)** | GovTech privada (2016) | **API pública documentada** (`apipcp.portaldecompraspublicas.com.br`) via chave (formulário, ~7 dias úteis) | Melhor caminho de API entre as privadas — solicitar chave |
| **BNC** (Bolsa Nacional de Compras) | Bolsa privada | API p/ integração de sistemas de gestão + **notificação de editais por e-mail** | Feed de e-mail viável já; API ao bidder a confirmar |
| **BLL Compras** | Maior bolsa privada (2008, 3000+ órgãos) | Integra 150+ sistemas + PNCP completo; **sem API aberta de consulta**; automação de lance via robôs-parceiros (ex: Lance Fácil) | Editais via PNCP; sessão/lance = scraping ou robô |
| **SISLOG** | **Sistema de compras do ESTADO DE GOIÁS** (sislog.go.gov.br), substitui COMPRASNET.GO | Integrado a PNCP + AFT/SIOFI/SGC/SEI; sem API dev pública | Editais fluem pro PNCP; sessão = scraping |

🚨 **IMPLICAÇÃO 1 — Escopo geográfico mudou:** SISLOG = Goiás estadual. A cliente opera em **GO estadual + bolsas nacionais (BLL/BNC/PCP)**, não só "Águas Lindas + DF". A seção 2 (NON-NEGOTIABLE Águas Lindas+DF) precisa ser **reavaliada** — o escopo é definido por *onde a empresa está cadastrada e disputa*, não por região.

🚨 **IMPLICAÇÃO 2 — Discovery vs. Disputa:** Para **Stage 1 (Monitorar)**, PNCP cobre quase tudo (todas as 5 fontes publicam/integram ao PNCP por lei) + PCP tem API própria. Viável. Para **Stage 5 (Acompanhar/Lances — a DOR #1)**, é **por-plataforma e em tempo real** — nenhuma oferece webhook de "movimentação" ao licitante. Requer monitoramento de sessão autenticada (scraping) ou integração com robô existente.

🚨 **IMPLICAÇÃO 3 — Competidor direto identificado:** **Lance Fácil** já faz lances automáticos + monitoramento de chat em BLL e BNC. Decisão build-vs-integrate para o Stage 5 precisa entrar no radar.

### 10.2.1 — Formas de acesso ao PNCP (verificado AO VIVO 20/Mai)

Há **duas APIs públicas (sem auth para leitura)** + bulk, cada uma para um job:

| Acesso | Endpoint | Job | Tempo real? |
|---|---|---|---|
| **API Consulta** | `/api/consulta/v1/contratacoes/publicacao` (filtra data+modalidade+UF; `tamanhoPagina≥10`) | Descoberta (firehose). **Filtro geo mais fino = UF** | Polling, lag D+1/D+2 |
| **API Integração** | `/api/pncp/v1/orgaos` (dump ~45MB do **registro inteiro de órgãos** BR) | **Lista-mestra de órgãos** p/ construir filtro de raio (CNPJ→município→distância). Cachear | Lento (cache) |
| | `/api/pncp/v1/orgaos/{cnpj}` | Registro de 1 órgão (poderId E, esferaId M/E/F) | sob demanda |
| | `/pncp-api/v1/orgaos/{cnpj}/compras/{ano}/{seq}/arquivos/{n}` | **PDF do edital direto** → alimenta Stage 4 | sob demanda |
| **Dados Abertos / OCDS** | `gov.br/pncp/.../dados-abertos` · `data.open-contracting.org/.../157` | Histórico/backfill (Stage 2 + eval) | Lote diário |

**Achados-chave:**
- ❌ **Nenhuma tem webhook** — tudo é *pull* (polling ou download). Polling adaptativo é inevitável.
- ❌ **Não existe endpoint "compras deste CNPJ desde data"** → monitorar órgão = pollar Consulta por UF + **filtrar por raio do nosso lado** (a distância é nossa lógica, não da API).
- ⚠️ **OCDS é só federal** (Compras.gov.br) + fases licitação/adjudicação → NÃO cobre municipal/estadual em BLL/BNC/PCP/SISLOG. Pro raio completo, Consulta/Integração PNCP é mais amplo.
- ✅ O **dump de órgãos (~45MB)** resolve a feature D6 (raio): bater CNPJ→município IBGE→haversine sobre a lista-mestra.

Detalhe técnico no spike `02-architecture/03-spike-stage1-monitorar-20mai.md`.

### 10.3 — 4 USUÁRIOS (firma seção 9)

**4 pessoas vão usar o buscador** (módulo licitação). Confirma RBAC multi-usuário no módulo licitação — não é single-user "pai 60+". Ajustar persona UX: equipe de licitação de 4 pessoas, não usuário solo idoso. (O perfil "pai 60+" pode pertencer ao módulo financeiro, agora separado.)

### 10.4 — LIVRO CAIXA AGORA É SEPARADO (corrige a "BASE" do workflow v3)

A cliente esclareceu: **o livro caixa é separado do buscador.** Some a "BASE alimenta Stage 4". Decisão de pesquisa: **usar ferramenta existente, não construir.** (v3 planejava BUILD: Pluggy + categorização IA + auto-BP/DRE — isso era over-engineering; é commodity resolvida.)

**Pesquisa de mercado/OSS (20/Mai) → recomendação:**
- **OSS GitHub pequenos** (fx-financas, web-budget, LivroCaixa) = projetos pessoais/toy, **não** production-grade fiscal BR. Descartados.
- **OSS production** = Akaunting (free, multi-empresa, invoicing+despesa+relatórios), ERPNext (ERP completo, complexo), InvoiceNinja. **Sem localização fiscal BR nativa (DRE/livro caixa).**
- **SaaS BR (melhor fit, já localizados)** = **Granatum** (plano único: fluxo de caixa + DRE + conciliação + import OFX + integração bancária), Conta Azul, Bling, Nibo, Omie. Custo ~R$50-150/mês.
- **Recomendação:** para 3 empresas com necessidade fiscal BR, **adotar SaaS BR (ex: Granatum)** > construir. Detalhes em `01-research/03-fontes-e-livro-caixa-20mai.md`.

### 10.7 — 🚨 ESCOPO GEOGRÁFICO REDEFINIDO: raio de ~500km da sede (não mais "Águas Lindas + DF")

**Fato novo (cliente):** Sede em **Águas Lindas de Goiás** (~lat -15,75 / lon -48,28, colada ao DF), mas **atendem contratos em raio de ~500km**. Logo, disputam editais de órgãos dentro desse raio, em **vários estados**.

**Isto INVALIDA a Seção 2 (NON-NEGOTIABLE Águas Lindas+DF) e a premissa "5-12 portais / search local sem Elasticsearch".**

**Cobertura aproximada do raio de 500km (a refinar com geocode IBGE):**
| UF | Cobertura | Exemplos (distância aprox.) |
|---|---|---|
| **DF** | Integral | Brasília (~50km) |
| **GO** | Praticamente todo o estado | Anápolis (~120km), Goiânia (~170km) |
| **MG** | Oeste/Noroeste/Triângulo | Unaí (~150), Paracatu (~200), Patos de Minas (~350), Uberlândia (~400), Uberaba (~480) |
| **TO** | Sul | Gurupi (~430), Porto Nacional (~480); Palmas fora (~620) |
| **BA / MT** | Só bordas (limite do raio) | Barreiras-BA, Barra do Garças-MT (~500-600, no limite) |

🚨 **Implicações arquiteturais:**
1. **Filtro é por DISTÂNCIA a partir de um ponto**, não por UF fechada. Requer dataset de municípios IBGE com lat/long + cálculo haversine (raio configurável, default 500km de Águas Lindas).
2. **PNCP nacional vira ainda mais central** — não dá pra fazer "hiper-regional 5-12 portais"; precisa cobertura nacional filtrada por geografia. (Reforça a estratégia da §10.2: PNCP como base de descoberta.)
3. **Volume de editais/dia sobe muito** vs. premissa antiga. Reavaliar custo de LLM/parsing (Stage 4) e o eval offline (kill gate pré-Sprint 4).
4. **Nova decisão D6:** o raio de 500km é fixo ou configurável por usuário/tipo de contrato? (Alguns contratos têm logística que muda o raio viável.)

### 10.5 — Known Dead-Ends (atualiza seção 6)

- ❌ **Construir livro caixa do zero** (Pluggy+IA+auto-DRE) — commodity resolvida por Granatum/Conta Azul/Bling a ~R$50-150/mês. Reavaliar só se integração backstage virar moat real.
- ❌ **Escopo "Águas Lindas + DF" / "5-12 portais hiper-regional"** — MORTO. Realidade: **raio de ~500km da sede (multi-estado: DF+GO+oeste MG+sul TO+bordas BA/MT)**, filtro por distância. Cobertura nacional via PNCP filtrada por geografia (§10.7).
- ⚠️ **Esperar webhook de movimentação das bolsas** — não existe; Stage 5 exige polling/scraping de sessão autenticada ou robô-parceiro.

### 10.6 — Decisões pendentes NOVAS (pré-Sprint 0)

- [ ] **D1** Confirmar regiões/UFs onde a empresa-licitante está cadastrada (define escopo de fontes real).
- [ ] **D2** Quais das 5 plataformas são prioridade P0 vs P1 (frequência de uso real da cliente).
- [ ] **D3** Stage 5 build-vs-integrate: construir monitor de sessão OU integrar/parcerizar com Lance Fácil-like?
- [ ] **D4** Livro caixa: adotar Granatum/SaaS BR (recomendado) OU manter no escopo de build?
- [ ] **D5** Os 4 usuários do buscador — papéis (quem busca, quem habilita, quem dá lance, quem recorre)?
- [ ] **D6** Raio de 500km — fixo ou configurável? Centro = sede Águas Lindas; refinar lista de municípios com geocode IBGE + haversine.

### Triggers v4:
| Trigger | Ação |
|---------|------|
| `fontes reais buscador` | Carrega matriz de integração das 5 fontes (seção 10.2) |
| `livro caixa decisão` | Carrega comparativo OSS×SaaS (`03-fontes-e-livro-caixa-20mai.md`) |
| `stage 5 build vs integrate` | Avalia Lance Fácil vs scraping próprio |
| `escopo geografico buscador` | Reavalia seção 2 com fontes reais (GO + nacional) |

---

*Última atualização: 2026-05-20 — v4 DIVERGÊNCIA: fontes reais (BLL/BNC/PCP/SISLOG/PNCP), 4 usuários, livro caixa separado (usar SaaS BR), escopo geográfico = raio ~500km da sede Águas Lindas (multi-estado, filtro por distância)*
*Histórico:*
- *2026-05-14 — research inaugural (buscador only)*
- *2026-05-18 manhã — escopo expandido para 3 módulos (v2 com 4 empresas, anti-conluio central)*
- *2026-05-18 noite — v3 CORREÇÕES: 3 empresas (não 4), workflow 6 estágios + base, moat redefinido pós-mega-research, pricing workflow-as-a-service R$2.8k/mês*
- *2026-05-20 — v4 DIVERGÊNCIA: áudios confirmam workflow; fontes reais corrigidas; 4 usuários; livro caixa decoupled (SaaS BR); escopo geográfico reaberto (GO estadual + bolsas nacionais)*
