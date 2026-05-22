# AIOS — Alocação completa dos 250 clones em squads (análise + relatório)

**Autor:** Orion (aios-master) · **Data:** 2026-05-21 · **Base:** `jarvis-mind-clone-index.json` (250 registros) + os 33 `squad.yaml`.
**Complementa:** `aios-clones-squads-review-RESPONSE-orion-21mai.md` (a revisão de arquitetura).

---

## 0. Método e achado de partida
Classifiquei os 250 clones por domínio real (id + role + keywords do índice + leitura dos casos ambíguos). **Achado que muda a régua:** no índice canônico, **185 dos 250 estão em buckets nomeados pela FONTE** (`aios-agent`=58, `codex-agent`=127) — ou seja, **não têm departamento real**. O "0 órfãos / 33/33 valida" do brief mede referências de `squad.yaml`, não pertencimento semântico. Este relatório atribui um **lar primário** a cada um dos 250 e marca **[core]** (execução) vs **[expert]** (consultivo / Expert Pool).

> Convenção: **[core]** = agente operacional que executa trabalho recorrente (DRI do squad). **[expert]** = mind clone consultivo — lar primário no squad por afinidade, mas acionável on-demand pelo Expert Pool. Cross-membership marcada com `↔`.

---

## 1. Taxonomia-alvo de squads (19 execução + governança + runtime + pool)
Consolidei de 33 → **19 execution squads** (dedupe da revisão), mais Governança, Runtime e o Expert Pool. **3 novos** propostos: `squad-behavioral-design`, `squad-markets-intelligence`, `squad-health` (consolidando o cluster de 5 squads de saúde).

---

## 2. Alocação completa (250 clones por squad)

### 🛠️ squad-engineering — *CTO: architect*
**[core]** architect · dev · aios-developer
**[expert]** kent-beck · uncle-bob-martin · martin-fowler · linus-torvalds · ryan-dahl · kent-c-dodds · matt-pocock · dan-abramov · addy-osmani · guillermo-rauch · swyx · sam-newman · will-larson · scott-hanselman · simon-willison ↔squad-ai · pablo-hoffman ↔squad-platform

### ☁️ squad-platform — *DevOps/SRE/Infra · head: devops*
**[core]** devops · github-devops
**[expert]** kelsey-hightower · mitchell-hashimoto · brendan-gregg · charity-majors · nicole-forsgren · jez-humble · gene-kim · niall-murphy · casey-rosenthal · paul-copplestone (Supabase) · werner-vogels ↔innovation

### 🗄️ squad-data — *VP Data: data-engineer*
**[core]** data-engineer · db-sage
**[expert]** martin-kleppmann · markus-winand · joe-reis · craig-kerstiens · chip-huyen ↔squad-ai

### 🤖 squad-ai — *CAIO: demis-hassabis* (⚠️ expert-heavy, 0 core → compartilha data-engineer)
**[expert]** demis-hassabis · fei-fei-li · yann-lecun · ilya-sutskever · andrew-ng · andrej-karpathy · jim-fan · lilian-weng · harrison-chase (LangChain) · jerry-liu (LlamaIndex) · alan-nichol (Rasa) · cassie-kozyrkov (decision intelligence) · timnit-gebru (AI ethics) · demis-hassabis-dossier · chip-huyen ↔squad-data

### 🎨 squad-design — *Design Lead*
**[core]** design-lead · design-systems-engineer · ui-designer · ux-designer · ux-design-expert · motion-designer · ux-researcher · ux-writer
**[expert]** dieter-rams · don-norman · john-maeda · erik-spiekermann · marty-neumeier · edward-tufte (dataviz) · brad-frost · tobias-van-schneider · val-head · vitaly-friedman · kat-holmes (inclusive) · refika-anadol (generative) · abby-covert (IA) · cathy-pearl (voice UX) · julie-zhuo ↔squad-product

### 🧠 squad-behavioral-design — **NOVO** *Director: bj-fogg* (o exemplo do brief)
**[expert]** bj-fogg (behavior design) · nir-eyal (Hooked) · yu-kai-chou (gamification) · richard-thaler (nudge) · daniel-kahneman (behavioral econ) · acacia-parks (positive psych) · rafael-calvo (wellbeing tech) ↔squad-health
*Por quê:* design comportamental é capacidade transversal (engajamento, ética de hábito) que hoje está espalhada entre `design-terapeutico`, `squad-behavioral` e clones soltos. Vira squad consultivo único que serve design, product e health.

### 🔐 squad-security — *CISO: bruce-schneier* (modelo a imitar — 6 divisões)
**[expert]** bruce-schneier · daniel-miessler · peter-kim · georgia-weidman · kevin-mitnick · hd-moore · chris-sanders · marcus-carey · omar-santos · mikko-hypponen · troy-hunt · wendi-whitmore · john-kindervag (zero trust) · jim-manico (AppSec) · tanya-janca (AppSec) · liran-tal (OSS sec)

### ⚖️ squad-legal — *General Counsel* (divisões: BR-admin · privacy · health-law)
**[expert]** marcal-justen-filho (lic. BR) · joel-de-menezes-niebuhr (lic. BR) · patricia-peck (direito digital BR) · ann-cavoukian (privacy by design) · lawrence-lessig (cyberlaw) · heather-meeker (OSS licensing) · richard-susskind (legal futures)
**health-law:** bakul-patel · lucia-savage · micky-tripathi · erik-nymanczuk (LGPD saúde) · adriana-dallari (dir. sanitário) · stephen-hahn (reg. strategy/crise)

### 📈 squad-marketing — *Traffic Masters Chief* (divisões: traffic · growth · SEO/CRO)
**[core]** analytics-agent · audience-researcher · campaign-manager · email-marketing-specialist · funnel-architect · growth-strategist · influencer-partnership-manager · landing-page-optimizer · retention-specialist · seo-content-strategist · social-media-manager
**traffic [expert]** traffic-masters-chief · molly-pittman · andre-chaperon · kasim-aslam · depesh-mandalia · nicholas-kusmich · ralph-burns · tom-breeze · pedro-sobral (BR)
**growth/SEO/CRO [expert]** gary-vaynerchuk · larry-kim · wes-bush (PLG) · rand-fishkin (SEO) · neil-patel (SEO) · oli-gardner (CRO) · peep-laja (CRO) · guillaume-moubeche · geoff-cook · russell-brunson (funnels) · jay-abraham · alex-hormozi (offers) · seth-godin

### ✍️ squad-content — *VP Content: ann-handley*
**[core]** copy-specialist · slide-creator
**[expert]** joanna-wiebe (conversion copy) · ann-handley · donald-miller (StoryBrand) · robert-mckee (story) · joe-pulizzi (content mkt) · ryan-holiday · charles-spurgeon (persuasão/comunicação)

### 💰 squad-sales — *Head of Sales*
**[core]** crm-manager · lead-qualifier · outbound-specialist · pricing-strategist · proposal-writer · sales-closer · sales-ops-analyst · sales-strategist
**[expert]** chris-voss (negociação) · jeb-blount · matt-dixon (Challenger) · grant-cardone · patrick-campbell (pricing) · jason-lemkin ↔squad-product

### 🤝 squad-customer — *VP Customer Success* (success · support · community)
**[core]** churn-prevention · community-manager · customer-success-manager · customer-support-t1 · customer-support-t2 · onboarding-specialist · voice-of-customer
**[expert]** lincoln-murphy · nick-mehta · sarah-drasner (DevRel) ↔squad-engineering

### 📦 squad-product — *CPO* (discovery · strategy · innovation)
**[core]** pm · po · analyst · market-analyst · competitor-watcher · niche-explorer · trend-hunter
**[expert]** marty-cagan · teresa-torres · april-dunford (positioning) · julie-zhuo ↔design · jason-lemkin (SaaS) · rob-walling (bootstrapping) · nir-eyal ↔behavioral · dave-snowden (Cynefin) · steve-blank (cust dev) · alexander-osterwalder (BMC) · clayton-christensen (JTBD) · eric-ries (lean) · peter-diamandis (moonshots) · brad-feld (VC)

### 🔁 squad-operations — *Senior Scrum Master: sm* (agile · QA · process · remote)
**[core]** sm · qa · pedro-valerio (process absolutist)
**[expert]** eliyahu-goldratt (TOC) · darren-murph (remote ops) · amy-edmondson ↔squad-people

### 🏦 squad-finance — *CFO: aswath-damodaran* (corporate finance/econ)
**[expert]** aswath-damodaran (valuation) · warren-buffett · morgan-housel · mariana-mazzucato (econ) · scott-galloway · ray-dalio (macro)

### 📊 squad-markets-intelligence — **NOVO** *(trading · prediction markets · crypto)*
**[expert]** domer-polymarket · theo-polymarket · gcr-crypto · danijel-overtime (DeFi/on-chain) · luana-lopes-lara (Kalshi) · robin-hanson (prediction markets) · nate-silver (forecasting) · philip-tetlock (superforecasting) · scott-alexander (rationalist forecasting)
*Por quê:* esses NÃO são corporate finance (Damodaran) nem data-eng. Há projeto real (`polymarket-trader`). Squad/task-force dedicado evita poluir finance e data.

### 🏥 squad-health — **NOVO (consolidação)** *VP Digital Health* (digital · mental · clinical)
**[expert]** atul-butte (health data) · halle-tecco (health tech) · sean-duffy (chronic care) · eric-topol (digital medicine) · alison-darcy (mental health) · dena-bravata (evidence-based) · kate-ryder (women's/family) · david-ebersman (mental health) · johannes-thrul (mHealth research) · christian-dunker (psicologia clínica BR) · eduardo-bunge (digital mental health) · acacia-parks ↔behavioral · rafael-calvo ↔behavioral
*Por quê:* unifica 5 squads (`health-data`, `health-tech`, `squad-health`, `therapy`, `design-terapeutico`) num vertical com 3 divisões. Manter como squad **somente se saúde for linha de negócio ativa**; senão → domínio do Expert Pool.

### 👥 squad-people — *CHRO: patty-mccord* (cultura · liderança · educação)
**[expert]** patty-mccord · laszlo-bock · josh-bersin · simon-sinek · brene-brown · adam-grant · amy-edmondson ↔ops · sal-khan (educação) · anders-ericsson (deliberate practice) · sugata-mitra (self-org learning)

---

### 🏛️ Executive Council — *governança (NÃO executa)*
ceo · coo · cfo · cmo · cro · cco — política, gates, escalação, tradeoffs cross-squad. (Os C-levels viram donos de gate; ver §4 da revisão.)

### ⚙️ Orchestration Runtime — *o roteador (não é squad)*
aios-master (COO/orquestrador) · aios-orchestrator · sop-extractor · squad-creator (meta) · oalanicolas (contexto do founder)

### 🧩 Expert Pool — *mecanismo de consulta (não é squad)*
conclave-coordinator (ponte Conclave/JARVIS) · template-mind-clone (template). **Todos os [expert] acima vivem funcionalmente aqui** — lar primário por afinidade, mas acionáveis por qualquer squad/projeto via retrieval por tag de domínio.

---

## 3. Squads de projeto (task-forces — compostos de squads permanentes + pool)
Projetos ativos em `docs/projects/`. Cada um é uma **task-force efêmera** que puxa DRIs core + experts on-demand. Exemplos das composições mais úteis:

### 🟦 Noyce / buscador-licitacoes
- **Core:** data-engineer, dev, architect, devops (Sprint 0/RLS/adapters)
- **Experts on-demand:** marcal-justen-filho + joel-de-menezes-niebuhr (lic. BR — Stage 4/6) · ann-cavoukian + patricia-peck (LGPD/vault) · bruce-schneier (vault/credenciais) · pablo-hoffman (scraping adapters) · paul-copplestone (Supabase) · markus-winand (query/pgvector) · marty-cagan/teresa-torres (discovery) · molly-pittman (se houver GTM)

### 📊 polymarket-trader
- **Core:** squad-markets-intelligence (domer/theo/gcr/danijel/luana) + data-engineer
- **Experts:** nate-silver + philip-tetlock + robin-hanson (forecasting) · scott-alexander (calibração) · aswath-damodaran (pricing/risk)

### 🚦 traffic-masters-rebuild / launches (highticket, low-ticket-10k)
- **Core:** squad-marketing core agents (campaign/funnel/landing/email)
- **Experts:** traffic-masters-chief + molly-pittman + kasim-aslam + depesh-mandalia + ralph-burns + pedro-sobral · oli-gardner/peep-laja (CRO) · joanna-wiebe (copy) · alex-hormozi (offer)

### 🎨 design-squad-rebuild
- **Core:** squad-design core (design-lead, design-systems-engineer, ui/ux)
- **Experts:** dieter-rams, john-maeda, brad-frost, refika-anadol + squad-behavioral-design (bj-fogg/nir-eyal) para engajamento

### 🏥 health-tech / iox-services (se ativos)
- **Core:** squad-health vertical
- **Experts:** health-law (bakul-patel/lucia-savage/erik-nymanczuk/adriana-dallari) · alison-darcy/eduardo-bunge (mental) · ann-cavoukian (privacy)

> **Regra de projeto:** a task-force nasce com 2-5 DRIs core de squads permanentes; experts entram por consulta (não viram membros). Dissolve ao fim. Sem criar squad permanente novo por projeto.

---

## 4. Novos squads propostos (resumo + justificativa)
| Novo squad | Consolida / cria de | Justificativa |
|---|---|---|
| **squad-behavioral-design** | `design-terapeutico` + `squad-behavioral` + clones soltos (thaler, kahneman, nir-eyal, yu-kai-chou) | capacidade transversal de engajamento/ética; serve design+product+health |
| **squad-markets-intelligence** | trading/crypto/polymarket hoje em `squad-finance` + forecasting hoje em `squad-data` | domínio distinto de corporate finance e data-eng; há projeto real |
| **squad-health** (consolidado) | `health-data`+`health-tech`+`squad-health`+`therapy`+`design-terapeutico` | 5 squads → 1 vertical com 3 divisões; só manter se for linha ativa |

**NÃO criar** (over-fragmentação): growth/content/lifecycle/CRO separados → são divisões de `squad-marketing`. `ai-science` separado de `squad-ai` → fundir.

---

## 5. Mudanças vs estado atual
- **33 squads → 19 execution + Governança + Runtime + Pool.**
- **Fusões:** ai-science→squad-ai · legal+squad-legal→squad-legal · executive-team→Council · squad-executive→Runtime · expert-council→Pool · sales-ops→squad-sales · customer-ops→squad-customer · product-research+innovation→squad-product · 5 health→squad-health · growth(dept)→squad-marketing.
- **185 clones saem dos buckets de fonte** (`aios-agent`/`codex-agent`) e ganham lar real + tag de domínio no Pool.
- **Naming padronizado** para `squad-<domínio>` (aposenta nomes nus).

## 6. Cross-membership (compartilhamentos chave)
chip-huyen (data↔ai) · simon-willison (engineering↔ai) · pablo-hoffman (engineering↔platform) · werner-vogels (platform↔innovation) · julie-zhuo (design↔product) · jason-lemkin (sales↔product) · nir-eyal (behavioral↔product) · acacia-parks & rafael-calvo (behavioral↔health) · sarah-drasner (customer↔engineering) · amy-edmondson (people↔operations) · edward-tufte (design↔data viz).

## 7. Validação recomendada (substitui "0 órfãos")
- Todo execution squad tem ≥1 DRI **[core]** (⚠️ hoje **squad-ai** e **squad-finance** e **squad-markets-intelligence** são 100% expert → designar core ou marcar como "expert squad").
- 0 squads de execução vazios · 0 nomes ambíguos · 100% cobertura de gate nos fluxos sensíveis · 0 intents não-roteáveis.
- Cada clone tem **exatamente 1 lar primário** + N tags de Pool.

---
*Relatório por Orion (aios-master). 250 clones classificados; 3 squads novos; squads de projeto como task-forces. Meta: qualidade de orquestração.*
