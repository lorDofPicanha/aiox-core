# Research Prompts — 36 Squads

**Uso:** Cola cada prompt em uma sessão Claude separada. Ele retorna JSONL com 500+ items Tier S/A. Você manda o JSONL de volta e eu rodo `node tools/hydra/bin/ingest-curated.mjs --file <arquivo>`.

**Format esperado de output (JSONL — 1 JSON por linha):**

```jsonl
{"url":"https://...","title":"...","author":"...","domains":["ai-ml"],"tier":"S","score":4.7,"insights":["insight1","insight2","insight3"],"quotes":["quote literal"],"tags":["tag1","tag2"]}
{"url":"https://...","title":"...","author":"...","domains":["ai-ml"],"tier":"A","score":4.2,"insights":["..."],"quotes":["..."],"tags":["..."]}
```

**Tier S vs A criteria (válido pra todos os squads):**
- **Tier S (score 4.5-5.0):** seminal works, must-read papers, canonical references. Autores top-tier do domínio. Conteúdo que muda a forma como o squad pensa.
- **Tier A (score 3.5-4.49):** high-signal practical articles, applied case studies, expert deep-dives. Útil para decisões táticas.

---

## INSTRUÇÕES GERAIS (cabeçalho de TODOS os prompts)

```
Você é um pesquisador especialista. Sua tarefa é coletar 500+ itens de conteúdo Tier S/A
sobre o tema definido, retornando estritamente em formato JSONL (um JSON por linha, sem
markdown, sem código de bloco).

Cada item DEVE ter:
- url: URL canônico do conteúdo
- title: título original
- author: autor/organização
- domains: array com 1-2 domains (use os listados no prompt)
- tier: "S" ou "A" (use critérios abaixo)
- score: número 3.5-5.0
- insights: array de 3-5 strings (key insights factuais, NÃO opinião)
- quotes: array de 1-3 strings (citações literais do conteúdo)
- tags: array de 3-8 keywords técnicas

Critério Tier:
- S (4.5+): seminal/canonical, autores top-tier, paradigm-shifting
- A (3.5-4.49): practical/applied, expert-authored, decision-grade

Fontes válidas: blogs técnicos, papers (ArXiv, journals), books online,
talks/podcasts transcritos, threads X/Twitter de experts, GitHub READMEs canonicos,
newsletters Substack/etc. EXCLUIR: tweets isolados sem contexto, posts genéricos,
listicles, conteúdo SEO-only, AI-generated slop.

Output: JSONL puro, sem cabeçalho, sem marcação. UMA linha por item.
```

---

# Squad-* Novos (21)

## 1. squad-ai

**Tema:** Arquitetura e orquestração de sistemas AI multi-agent, AI engineering moderno, LLM application patterns.

**Keywords prioritárias:** agent architecture, multi-agent orchestration, LLM agents, AI engineering, agent frameworks (LangGraph, AutoGen, CrewAI), tool use, function calling, RAG architectures, AI safety, alignment, agentic workflows, agent evaluation, agent memory systems, MCP protocol, agent observability

**Thought leaders foco:** Andrej Karpathy, Andrew Ng, Harrison Chase (LangChain), Jerry Liu (LlamaIndex), Lilian Weng (OpenAI Safety), Jim Fan (NVIDIA), Chip Huyen, Eugene Yan, Sebastian Raschka, Simon Willison, swyx, Matt Pocock.

**Fontes alvo:** ArXiv cs.AI/cs.LG, OpenAI Cookbook, Anthropic Engineering Blog, LangChain Blog, LlamaIndex docs, HuggingFace blog, lilianweng.github.io, eugeneyan.com, magazine.sebastianraschka.com, latent.space, Lenny Rachitsky AI episodes, Andrej Karpathy lectures.

**domains:** `["ai-ml"]`

**Prompt completo a colar:**
```
Você é um pesquisador especialista. Sua tarefa é coletar 500+ itens de conteúdo Tier S/A
sobre o tema definido, retornando estritamente em formato JSONL (um JSON por linha, sem
markdown, sem código de bloco).

Cada item DEVE ter:
- url: URL canônico do conteúdo
- title: título original
- author: autor/organização
- domains: array com 1-2 domains (use os listados no prompt)
- tier: "S" ou "A" (use critérios abaixo)
- score: número 3.5-5.0
- insights: array de 3-5 strings (key insights factuais, NÃO opinião)
- quotes: array de 1-3 strings (citações literais do conteúdo)
- tags: array de 3-8 keywords técnicas

Critério Tier:
- S (4.5+): seminal/canonical, autores top-tier, paradigm-shifting
- A (3.5-4.49): practical/applied, expert-authored, decision-grade

Fontes válidas: blogs técnicos, papers (ArXiv, journals), books online,
talks/podcasts transcritos, threads X/Twitter de experts, GitHub READMEs canonicos,
newsletters Substack/etc. EXCLUIR: tweets isolados sem contexto, posts genéricos,
listicles, conteúdo SEO-only, AI-generated slop.

Output: JSONL puro, sem cabeçalho, sem marcação. UMA linha por item.

Tema: Arquitetura e orquestração de sistemas AI multi-agent + AI engineering moderno.

Keywords: agent architecture, multi-agent orchestration, LLM agents, AI engineering,
LangGraph, AutoGen, CrewAI, tool use, function calling, RAG, AI safety, alignment,
agentic workflows, agent evaluation, agent memory, MCP, agent observability.

Autores top-tier: Karpathy, Andrew Ng, Harrison Chase, Jerry Liu, Lilian Weng, Jim Fan,
Chip Huyen, Eugene Yan, Sebastian Raschka, Simon Willison, swyx, Matt Pocock.

Fontes: ArXiv cs.AI/cs.LG, OpenAI Cookbook, Anthropic Engineering, LangChain Blog,
HuggingFace, lilianweng.github.io, eugeneyan.com, magazine.sebastianraschka.com,
latent.space.

Tier S: papers seminais (Attention is All You Need-class), threads canonical de Karpathy,
talks de Sutskever/Hinton sobre AGI, livros técnicos (Building LLMs for Production,
AI Engineering by Chip Huyen).

domains: ["ai-ml"]

Retorne 500+ items em JSONL. Comece agora.
```

---

## 2. squad-behavioral
**Tema:** Ciência comportamental aplicada a produtos digitais, design de hábitos, persuasão ética, vieses cognitivos.

**Keywords:** behavioral science, cognitive bias, habit formation, nudge theory, dual-process theory, dark patterns, persuasive technology, behavioral economics, social proof, choice architecture, intrinsic motivation, behavior change interventions.

**Thought leaders:** Daniel Kahneman, Richard Thaler, BJ Fogg, Brené Brown, Dan Ariely, Robert Cialdini, Nir Eyal, Tristan Harris, Yu-kai Chou.

**Fontes:** Behavioral Scientist, The Decision Lab, Stanford Behavior Design Lab, Center for Humane Tech, HBR Psychology, Nudge.org, Habit Weekly.

**domains:** `["ai-ml", "negocios"]`

**Prompt:**
```
[INSTRUÇÕES GERAIS]

Tema: Behavioral science aplicada a produtos digitais e design de agents.

Keywords: behavioral science, cognitive bias, habit formation, nudge, dual-process,
dark patterns, persuasive technology, behavioral economics, social proof, choice
architecture, intrinsic motivation, behavior change.

Autores: Kahneman, Thaler, BJ Fogg, Cialdini, Nir Eyal, Tristan Harris, Yu-kai Chou.

Fontes: Behavioral Scientist, Decision Lab, Stanford Behavior Design, Center for
Humane Tech, HBR Psych, Nudge.org.

Tier S: papers seminais (Kahneman fast/slow, Cialdini influence laws), TED talks Brené Brown.

domains: ["ai-ml", "negocios"]. Retorne 500+ JSONL.

```

---

## 3. squad-community

**Tema:** Community building digital, creator economy, engagement strategies, forum dynamics, DAO governance.

**Keywords:** community building, engagement loops, creator economy, online communities, forum dynamics, member onboarding, social capital, micro-communities, Discord/Slack ops, community-led growth.

**Thought leaders:** David Spinks (CMX), Sarah Drasner, Rosie Sherry, Lloyd Davis, Stowe Boyd, Carrie Melissa Jones.

**Fontes:** CMX Hub, Community Roundtable, FeverBee, Lloyd Davis Substack, Plural Sight Community Ops.

**domains:** `["marketing"]`

**Prompt:**
```
[INSTRUÇÕES GERAIS]

Tema: Community building digital + creator economy + engagement strategies.

Keywords: community building, engagement loops, creator economy, online communities,
forum dynamics, member onboarding, social capital, Discord ops, community-led growth.

Autores: David Spinks (CMX), Rosie Sherry, Carrie Melissa Jones, Stowe Boyd.

Fontes: CMX Hub, Community Roundtable, FeverBee, Plural Sight Community.

Tier S: "The Business of Belonging" (Spinks), seminal essays Stowe Boyd sobre social ops.

domains: ["marketing"]. Retorne 500+ JSONL.
```

---

## 4. squad-content

**Tema:** Content marketing estratégico, editorial production, brand voice, long-form content, content distribution.

**Keywords:** content marketing, editorial calendar, brand voice, long-form, storytelling, content distribution, SEO content, jobs-to-be-done content, programmatic SEO, content ops.

**Thought leaders:** Joe Pulizzi, Ann Handley, Seth Godin, Joanna Wiebe, Ryan Holiday, Donald Miller, Robert McKee.

**Fontes:** Content Marketing Institute, Animalz Blog, Joe Pulizzi Substack, Copyhackers, HubSpot Marketing, Reforge Content Strategy.

**domains:** `["marketing"]`

**Prompt:**
```
[INSTRUÇÕES GERAIS]

Tema: Content marketing estratégico + editorial production + brand voice.

Keywords: content marketing, editorial calendar, brand voice, long-form, storytelling,
distribution, jobs-to-be-done content, programmatic SEO, content ops.

Autores: Joe Pulizzi, Ann Handley, Seth Godin, Joanna Wiebe, Ryan Holiday, Donald Miller.

Fontes: Content Marketing Institute, Animalz, Copyhackers, HubSpot Marketing, Reforge.

Tier S: Seth Godin essays canonical, "Building a StoryBrand" (Miller), "Everybody Writes" (Handley).

domains: ["marketing"]. Retorne 500+ JSONL.
```

---

## 5. squad-customer-success

**Tema:** Customer Success frameworks, churn prediction, health scoring, expansion revenue, NRR optimization.

**Keywords:** customer success, churn prevention, health score, NPS, NRR, expansion revenue, onboarding, QBR, account management, CS Ops.

**Thought leaders:** Lincoln Murphy, Nick Mehta (Gainsight), Dave Jackson, Kristen Hayer.

**Fontes:** ChurnZero Blog, Gainsight, Customer Success Magazine, Lincoln Murphy Substack, Catalyst Software Blog.

**domains:** `["negocios"]`

**Prompt:**
```
[INSTRUÇÕES GERAIS]

Tema: Customer Success frameworks + churn prediction + expansion revenue.

Keywords: customer success, churn prevention, health score, NPS, NRR, expansion,
onboarding, QBR, account management, CS Ops.

Autores: Lincoln Murphy, Nick Mehta, Dave Jackson, Kristen Hayer.

Fontes: ChurnZero, Gainsight, Customer Success Magazine, Lincoln Murphy posts.

Tier S: Lincoln Murphy frameworks (CSM playbook), Mehta book "The Customer Success Economy".

domains: ["negocios"]. Retorne 500+ JSONL.
```

---

## 6. squad-data

**Tema:** Modern data stack, data engineering, lakehouse architecture, dbt, streaming pipelines, data contracts.

**Keywords:** data engineering, ETL/ELT, dbt, lakehouse, data warehouse, Apache Spark, Kafka, Airflow, data contracts, data mesh, analytics engineering, dimensional modeling.

**Thought leaders:** Joe Reis, Chip Huyen, Tristan Handy (dbt), Maxime Beauchemin (Airflow), Martin Kleppmann, Jesse Anderson.

**Fontes:** Practical Data Engineering (Reis), dbt Labs Blog, DataEngWeekly, Tristan Handy Roundup, Martin Kleppmann blog, Mode Analytics, Locally Optimistic.

**domains:** `["engenharia"]`

**Prompt:**
```
[INSTRUÇÕES GERAIS]

Tema: Modern data stack + data engineering moderno + lakehouse architecture.

Keywords: data engineering, ETL/ELT, dbt, lakehouse, warehouse, Spark, Kafka, Airflow,
data contracts, data mesh, analytics engineering, dimensional modeling.

Autores: Joe Reis, Chip Huyen, Tristan Handy, Max Beauchemin, Martin Kleppmann.

Fontes: practicaldataeng.substack.com, getdbt.com, dataengineeringweekly.com,
Kleppmann blog, Mode Analytics, Locally Optimistic.

Tier S: "Fundamentals of Data Engineering" (Reis), "Designing Data-Intensive Apps"
(Kleppmann), seminal data-mesh papers Zhamak Dehghani.

domains: ["engenharia"]. Retorne 500+ JSONL.
```

---

## 7. squad-design

**Tema:** Design systems, design tokens, atomic design, accessibility (WCAG), design ops, component-driven UI.

**Keywords:** design system, design tokens, atomic design, component library, design ops, WCAG accessibility, Figma tokens, design-to-code, design API, typography systems, color systems.

**Thought leaders:** Brad Frost, Dieter Rams, Don Norman, Sara Soueidan, Erik Spiekermann, Brad Adamczyk, Nathan Curtis, Adam Wathan.

**Fontes:** UX Collective, A List Apart, Brad Frost Blog, Sara Soueidan blog, Refactoring UI, Smashing Magazine, EightShapes (Nathan Curtis), Figma Blog.

**domains:** `["design-systems"]`

**Prompt:**
```
[INSTRUÇÕES GERAIS]

Tema: Design systems + design tokens + atomic design + accessibility.

Keywords: design system, design tokens, atomic design, component library, design ops,
WCAG, Figma tokens, design-to-code, typography systems, color systems.

Autores: Brad Frost, Dieter Rams, Don Norman, Sara Soueidan, Erik Spiekermann,
Nathan Curtis, Adam Wathan.

Fontes: UX Collective, A List Apart, bradfrost.com, sarasoueidan.com, Refactoring UI,
Smashing Magazine, EightShapes, Figma Blog.

Tier S: "Atomic Design" (Frost), "Design of Everyday Things" (Norman), Dieter Rams
10 Principles, Refactoring UI canonical chapters.

domains: ["design-systems"]. Retorne 500+ JSONL.
```

---

## 8. squad-education

**Tema:** EdTech, instructional design, spaced repetition, deliberate practice, learning science.

**Keywords:** instructional design, spaced repetition, mastery learning, deliberate practice, cognitive load, Bloom's taxonomy, microlearning, learning analytics, adaptive learning.

**Thought leaders:** Sal Khan, Sugata Mitra, Anders Ericsson, Barbara Oakley, Robert Bjork, Henry Roediger.

**Fontes:** EdSurge, Class Central, Khan Academy Blog, Ericsson research papers, Learning Scientists blog.

**domains:** `["negocios"]`

**Prompt:**
```
[INSTRUÇÕES GERAIS]

Tema: EdTech + instructional design + learning science.

Keywords: instructional design, spaced repetition, mastery learning, deliberate practice,
cognitive load, Bloom, microlearning, learning analytics.

Autores: Sal Khan, Sugata Mitra, Anders Ericsson, Barbara Oakley, Robert Bjork.

Fontes: EdSurge, Class Central, Khan Academy, Learning Scientists.

Tier S: "Peak" (Ericsson), "Make It Stick" (Roediger), TED Mitra, Khan founding essays.

domains: ["negocios"]. Retorne 500+ JSONL.
```

---

## 9. squad-engineering

**Tema:** Software architecture, distributed systems, clean code, TDD, refactoring, systems thinking.

**Keywords:** software architecture, distributed systems, microservices, TDD, BDD, refactoring, clean code, XP, system design, DDD, CQRS, event sourcing.

**Thought leaders:** Martin Fowler, Kent Beck, Uncle Bob Martin, Linus Torvalds, Scott Hanselman, Sam Newman, Martin Kleppmann.

**Fontes:** Martin Fowler blog, InfoQ, Hacker News Best, High Scalability, Sam Newman blog, Kent Beck Substack.

**domains:** `["engenharia"]`

**Prompt:**
```
[INSTRUÇÕES GERAIS]

Tema: Software architecture + distributed systems + clean code + TDD.

Keywords: architecture, distributed, microservices, TDD, BDD, refactoring, clean code, XP,
DDD, CQRS, event sourcing.

Autores: Fowler, Beck, Uncle Bob, Sam Newman, Kleppmann.

Fontes: martinfowler.com, InfoQ, HN Best, High Scalability, samnewman.io, kent-beck.com.

Tier S: "Refactoring" (Fowler), "TDD By Example" (Beck), "Clean Code" (Martin),
"Designing Data-Intensive Apps" (Kleppmann), Fowler bliki canonical entries.

domains: ["engenharia"]. Retorne 500+ JSONL.
```

---

## 10. squad-executive

**Tema:** Executive leadership, strategy, capital allocation, org design, M&A.

**Keywords:** leadership, strategy, capital allocation, M&A, board governance, OKRs at scale, transformation, succession, exec coaching.

**Thought leaders:** Warren Buffett, Ray Dalio, Morgan Housel, Ben Horowitz, Andy Grove, Jeff Bezos shareholder letters.

**Fontes:** Stratechery, Lenny's Newsletter, a16z Future, McKinsey Quarterly, HBR Leadership, Bezos letters archive.

**domains:** `["negocios"]`

**Prompt:**
```
[INSTRUÇÕES GERAIS]

Tema: Executive leadership + strategy + capital allocation.

Keywords: leadership, strategy, capital allocation, M&A, board, OKRs at scale,
transformation, succession.

Autores: Buffett, Dalio, Housel, Ben Horowitz, Andy Grove, Bezos.

Fontes: stratechery.com, lennysnewsletter.com, future.com (a16z), McKinsey Quarterly,
HBR, Bezos shareholder letters archive.

Tier S: "Principles" (Dalio), "High Output Management" (Grove), Buffett letters,
Bezos shareholder letters 1997-2020.

domains: ["negocios"]. Retorne 500+ JSONL.
```

---

## 11. squad-finance

**Tema:** Unit economics, valuation, SaaS metrics, pricing, capital efficiency.

**Keywords:** unit economics, LTV/CAC, valuation, DCF, SaaS metrics, pricing strategy, ARR, burn multiple, capital efficiency, Rule of 40.

**Thought leaders:** Aswath Damodaran, Warren Buffett, Morgan Housel, Patrick Campbell (ProfitWell), David Sacks, Tomasz Tunguz.

**Fontes:** Damodaran Online, A Wealth of Common Sense, Of Dollars and Data, SaaStr, Tomasz Tunguz blog, ProfitWell.

**domains:** `["negocios"]`

**Prompt:**
```
[INSTRUÇÕES GERAIS]

Tema: Unit economics + valuation + SaaS metrics + pricing.

Keywords: unit economics, LTV/CAC, valuation, DCF, SaaS metrics, pricing, ARR,
burn multiple, capital efficiency, Rule of 40.

Autores: Damodaran, Buffett, Housel, Patrick Campbell, David Sacks, Tomasz Tunguz.

Fontes: pages.stern.nyu.edu/~adamodar, awealthofcommonsense.com, ofdollarsanddata.com,
saastr.com, tomtunguz.com, profitwell.com.

Tier S: Damodaran valuation textbook chapters, "Psychology of Money" (Housel),
Buffett-Munger letters Berkshire.

domains: ["negocios"]. Retorne 500+ JSONL.
```

---

## 12. squad-growth

**Tema:** Growth loops, PLG (Product-Led Growth), virality, activation, retention experiments.

**Keywords:** growth loops, PLG, virality, AARRR, activation, retention, North Star Metric, experimentation, funnel optimization, growth hacking, viral coefficient.

**Thought leaders:** Sean Ellis, Andrew Chen, Reforge team, Brian Balfour, Casey Winters, Elena Verna, Wes Bush.

**Fontes:** Reforge Blog, Growth.Design, GrowthHackers, Andrew Chen blog, Brian Balfour blog, Lenny's Newsletter, Elena's Growth Scoop.

**domains:** `["marketing"]`

**Prompt:**
```
[INSTRUÇÕES GERAIS]

Tema: Growth loops + PLG + virality + retention experiments.

Keywords: growth loops, PLG, virality, AARRR, activation, retention, NSM, experimentation,
funnel, viral coefficient, growth hacking.

Autores: Sean Ellis, Andrew Chen, Brian Balfour, Casey Winters, Elena Verna, Wes Bush.

Fontes: reforge.com/blog, growth.design, growthhackers.com, andrewchen.com,
brianbalfour.com, lennysnewsletter.com.

Tier S: "Hacking Growth" (Ellis), "Product-Led Growth" (Wes Bush), Reforge growth loops
canonical essays.

domains: ["marketing"]. Retorne 500+ JSONL.
```

---

## 13. squad-health

**Tema:** Digital health, mental health tech, SaMD, telehealth, patient outcomes.

**Keywords:** digital health, SaMD, mental health tech, telehealth, remote patient monitoring, healthtech, FDA digital health, patient outcomes, biomarker.

**Thought leaders:** Halle Tecco, Sean Duffy (Omada), Atul Butte, Alison Darcy (Woebot), Kate Ryder (Maven), Eric Topol.

**Fontes:** STAT News, MobiHealthNews, Rock Health Blog, Eric Topol's Ground Truths, Halle Tecco Substack.

**domains:** `["saude-mental", "health-tech"]`

**Prompt:**
```
[INSTRUÇÕES GERAIS]

Tema: Digital health + mental health tech + SaMD + telehealth.

Keywords: digital health, SaMD, mental health tech, telehealth, RPM, healthtech, FDA
digital health, patient outcomes, biomarker, digital therapeutics.

Autores: Halle Tecco, Sean Duffy, Atul Butte, Alison Darcy, Kate Ryder, Eric Topol.

Fontes: statnews.com, mobihealthnews.com, rockhealth.com, erictopol.substack.com.

Tier S: Topol "Deep Medicine", Alison Darcy Woebot RCT papers, FDA SaMD guidance docs.

domains: ["saude-mental", "health-tech"]. Retorne 500+ JSONL.
```

---

## 14. squad-legal

**Tema:** Privacy law (LGPD, GDPR), AI law, IP, compliance automation, contratos digitais.

**Keywords:** LGPD, GDPR, AI Act, privacy law, IP law, contracts, compliance, data protection, ANPD, FTC AI guidance.

**Thought leaders:** Lawrence Lessig, Patricia Peck, Bakul Patel (FDA), Lucia Savage, Richard Susskind, Heather Meeker.

**Fontes:** IAPP News, EFF Deeplinks, Lawfare, JOTA, Migalhas, Patricia Peck blog, Above the Law, Artificial Lawyer.

**domains:** `["legal"]`

**Prompt:**
```
[INSTRUÇÕES GERAIS]

Tema: Privacy law + AI law + IP + compliance (foco LGPD/GDPR/AI Act).

Keywords: LGPD, GDPR, AI Act, privacy, IP, contracts, compliance, ANPD, FTC AI.

Autores: Lessig, Patricia Peck, Bakul Patel, Lucia Savage, Susskind, Heather Meeker.

Fontes: iapp.org, eff.org, lawfaremedia.org, jota.info, migalhas.com.br, Patricia Peck,
abovethelaw.com, artificiallawyer.com.

Tier S: Lessig "Code is Law", Susskind "Tomorrow's Lawyers", LGPD comentários Patricia
Peck canonical.

domains: ["legal"]. Retorne 500+ JSONL.
```

---

## 15. squad-operations

**Tema:** Operational excellence, Lean, Theory of Constraints, DORA metrics, incident response.

**Keywords:** lean, theory of constraints, DORA, flow, incident response, ops excellence, blameless postmortems, SLO/SLA, error budgets.

**Thought leaders:** Eliyahu Goldratt, Gene Kim, Jez Humble, Nicole Forsgren, Will Larson, John Allspaw.

**Fontes:** IT Revolution, StaffEng (Lethain), Will Larson blog, Allspaw posts, Google SRE Book.

**domains:** `["negocios"]`

**Prompt:**
```
[INSTRUÇÕES GERAIS]

Tema: Operational excellence + Lean + Theory of Constraints + DORA metrics.

Keywords: lean, theory of constraints, DORA, flow, incident response, ops excellence,
blameless postmortems, SLO/SLA, error budgets.

Autores: Goldratt, Gene Kim, Jez Humble, Nicole Forsgren, Will Larson, John Allspaw.

Fontes: itrevolution.com, staffeng.com, lethain.com, allspaw.org, Google SRE Book.

Tier S: "The Goal" (Goldratt), "Accelerate" (Forsgren/Humble/Kim), Google SRE Book.

domains: ["negocios"]. Retorne 500+ JSONL.
```

---

## 16. squad-people

**Tema:** High-performance teams, psychological safety, talent management, culture, compensation design.

**Keywords:** high-performance teams, psychological safety, talent management, culture, compensation, performance management, hiring, retention, DEI, remote ops.

**Thought leaders:** Patty McCord (Netflix), Laszlo Bock (Google), Josh Bersin, Amy Edmondson, Adam Grant, Reed Hastings.

**Fontes:** First Round Review, Josh Bersin blog, HBR Leadership, Patty McCord posts, Adam Grant Granted newsletter.

**domains:** `["negocios"]`

**Prompt:**
```
[INSTRUÇÕES GERAIS]

Tema: High-performance teams + psychological safety + talent management.

Keywords: high-performance teams, psychological safety, talent, culture, compensation,
performance management, hiring, retention, DEI, remote.

Autores: Patty McCord, Laszlo Bock, Josh Bersin, Amy Edmondson, Adam Grant, Reed Hastings.

Fontes: review.firstround.com, joshbersin.com, HBR, Patty McCord posts, adamgrant.net.

Tier S: "Powerful" (McCord), "Work Rules" (Bock), Edmondson "The Fearless Organization",
"No Rules Rules" (Hastings).

domains: ["negocios"]. Retorne 500+ JSONL.
```

---

## 17. squad-platform

**Tema:** Platform engineering, IaC, Kubernetes, observability, SRE, edge/serverless.

**Keywords:** platform engineering, IaC, Kubernetes, Terraform, observability, SRE, edge computing, serverless, internal developer platforms, golden paths.

**Thought leaders:** Werner Vogels, Charity Majors, Kelsey Hightower, Mitchell Hashimoto, Guillermo Rauch, Brendan Gregg.

**Fontes:** CNCF Blog, charity.wtf, All Things Distributed (Werner), HashiCorp Blog, Vercel Blog, Brendan Gregg blog.

**domains:** `["engenharia"]`

**Prompt:**
```
[INSTRUÇÕES GERAIS]

Tema: Platform engineering + IaC + Kubernetes + observability + SRE.

Keywords: platform engineering, IaC, Kubernetes, Terraform, observability, SRE, edge,
serverless, internal developer platforms, golden paths.

Autores: Werner Vogels, Charity Majors, Kelsey Hightower, Mitchell Hashimoto,
Guillermo Rauch, Brendan Gregg.

Fontes: cncf.io, charity.wtf, allthingsdistributed.com, hashicorp.com/blog,
vercel.com/blog, brendangregg.com.

Tier S: "Observability Engineering" (Majors), CNCF graduation docs, AWS reInvent
Werner keynotes.

domains: ["engenharia"]. Retorne 500+ JSONL.
```

---

## 18. squad-product

**Tema:** Product management, continuous discovery, PRD, roadmap, OKR, JTBD.

**Keywords:** product management, continuous discovery, PRD, roadmap, OKR, JTBD, product-market fit, opportunity solution tree, north star metric.

**Thought leaders:** Marty Cagan, Teresa Torres, Julie Zhuo, Eric Ries, Lenny Rachitsky, Shreyas Doshi, Melissa Perri.

**Fontes:** Lenny's Newsletter, Product Talk (Torres), SVPG (Cagan), Shreyas Doshi, Melissa Perri blog.

**domains:** `["product"]`

**Prompt:**
```
[INSTRUÇÕES GERAIS]

Tema: Product management + continuous discovery + PRD + JTBD.

Keywords: product management, continuous discovery, PRD, roadmap, OKR, JTBD,
product-market fit, opportunity solution tree, NSM.

Autores: Marty Cagan, Teresa Torres, Julie Zhuo, Eric Ries, Lenny Rachitsky,
Shreyas Doshi, Melissa Perri.

Fontes: lennysnewsletter.com, producttalk.org, svpg.com, shreyasdoshi.com, melissaperri.com.

Tier S: "Inspired" (Cagan), "Continuous Discovery Habits" (Torres), "The Lean Startup"
(Ries), Lenny's top-100 most-read essays.

domains: ["product"]. Retorne 500+ JSONL.
```

---

## 19. squad-research

**Tema:** UX research, market research, qualitative analysis, survey design, discovery sprints.

**Keywords:** UX research, user interviews, usability testing, survey design, qualitative analysis, ResearchOps, jobs-to-be-done research, discovery sprints.

**Thought leaders:** Teresa Torres, Cassie Kozyrkov, Erika Hall, Tomer Sharon, Kate Towsey, Steve Portigal.

**Fontes:** Nielsen Norman Group, ReOps Community, Erika Hall blog, Tomer Sharon Medium, dscout Blog.

**domains:** `["product"]`

**Prompt:**
```
[INSTRUÇÕES GERAIS]

Tema: UX research + qualitative analysis + survey design + ResearchOps.

Keywords: UX research, user interviews, usability testing, survey design, qualitative,
ResearchOps, JTBD research, discovery sprints.

Autores: Teresa Torres, Cassie Kozyrkov, Erika Hall, Tomer Sharon, Kate Towsey,
Steve Portigal.

Fontes: nngroup.com, researchops.community, mulebrain.com (Erika Hall), Tomer Sharon
Medium, dscout.com/blog.

Tier S: "Just Enough Research" (Hall), NN Group canonical articles 1995-2025,
Cassie Kozyrkov decision intelligence series.

domains: ["product"]. Retorne 500+ JSONL.
```

---

## 20. squad-sales

**Tema:** Enterprise sales, discovery calls, negotiation, sales enablement, MEDDIC.

**Keywords:** enterprise sales, discovery calls, negotiation, sales enablement, MEDDIC, BANT, sales methodology, value selling.

**Thought leaders:** Chris Voss, Grant Cardone, Jeb Blount, Matt Dixon, Mark Roberge, Aaron Ross.

**Fontes:** Sales Hacker, Gong Sales Blog, Predictable Revenue, Matt Dixon HBR, Chris Voss tactical empathy posts.

**domains:** `["marketing"]`

**Prompt:**
```
[INSTRUÇÕES GERAIS]

Tema: Enterprise sales + discovery + negotiation + MEDDIC.

Keywords: enterprise sales, discovery calls, negotiation, sales enablement, MEDDIC,
BANT, value selling.

Autores: Chris Voss, Grant Cardone, Jeb Blount, Matt Dixon, Mark Roberge, Aaron Ross.

Fontes: saleshacker.com, gong.io/blog, predictablerevenue.com, HBR sales.

Tier S: "Never Split the Difference" (Voss), "The Challenger Sale" (Dixon),
"Predictable Revenue" (Ross), "The Sales Acceleration Formula" (Roberge).

domains: ["marketing"]. Retorne 500+ JSONL.
```

---

## 21. squad-security

**Tema:** Cybersecurity, threat modeling, OWASP, zero-day response, supply chain attacks.

**Keywords:** threat modeling, CVE, OWASP, zero-day, incident response, red team, supply chain attack, prompt injection AI security, PQC.

**Thought leaders:** Bruce Schneier, Kevin Mitnick, Troy Hunt, Mikko Hyppönen, Daniel Miessler, Liran Tal, John Kindervag (Zero Trust).

**Fontes:** KrebsOnSecurity, Schneier on Security, The Hacker News, Dark Reading, Troy Hunt blog.

**domains:** `["cybersecurity"]`

**Prompt:**
```
[INSTRUÇÕES GERAIS]

Tema: Cybersecurity + threat modeling + OWASP + supply chain + AI security.

Keywords: threat modeling, CVE, OWASP, zero-day, incident response, red team,
supply chain attack, prompt injection, PQC, zero trust.

Autores: Schneier, Mitnick, Troy Hunt, Mikko Hyppönen, Daniel Miessler, John Kindervag.

Fontes: krebsonsecurity.com, schneier.com, thehackernews.com, darkreading.com,
troyhunt.com.

Tier S: Schneier essays canonical, OWASP Top 10 docs, "Click Here to Kill Everybody"
(Schneier).

domains: ["cybersecurity"]. Retorne 500+ JSONL.
```

---

# Legacy Squads (15)

## 22. ai-science

**Tema:** Foundation models, multimodal, reasoning, RL, embodied AI, scaling laws.

**domains:** `["ai-ml"]`

**Prompt:**
```
[INSTRUÇÕES GERAIS]

Tema: AI foundation research — foundation models, multimodal, reasoning, RL, scaling.

Keywords: foundation model, multimodal, reasoning, reinforcement learning, embodied AI,
scaling laws, mechanistic interpretability, RLHF, DPO, chain-of-thought.

Autores: Demis Hassabis, Fei-Fei Li, Yann LeCun, Ilya Sutskever, Andrej Karpathy,
Andrew Ng, Jim Fan, Geoffrey Hinton.

Fontes: deepmind.google/blog, ai.googleblog.com, openai.com/research, anthropic.com/research,
thegradient.pub, distill.pub.

Tier S: ArXiv papers >500 citations, DeepMind Nature publications, OpenAI/Anthropic
research blog seminal posts.

domains: ["ai-ml"]. Retorne 500+ JSONL.
```

---

## 23. customer-ops

**Tema:** Customer experience operations, support workflows, SLA, ticketing, CSAT.

**domains:** `["negocios"]`

**Prompt:**
```
[INSTRUÇÕES GERAIS]

Tema: Customer experience operations + support workflows + SLA + CSAT.

Keywords: customer experience, support operations, SLA, ticketing, CSAT, helpdesk,
voice of customer, customer journey, support automation.

Autores: Shep Hyken, Matt Watkinson, Annette Franz, Mathew Patterson (Help Scout).

Fontes: intercom.com/blog, zendesk.com/blog, helpscout.com/blog, cxnetwork.com.

Tier S: "Outside In" (Manning/Bodine), Intercom canonical customer-success essays,
Help Scout founding philosophy posts.

domains: ["negocios"]. Retorne 500+ JSONL.
```

---

## 24. design-terapeutico

**Tema:** Therapeutic UX, conversational AI mental health, voice interfaces, accessibility para saúde mental.

**domains:** `["saude-mental", "design-systems"]`

**Prompt:**
```
[INSTRUÇÕES GERAIS]

Tema: Therapeutic UX + conversational AI mental health + voice interfaces.

Keywords: therapeutic UX, conversational AI mental health, voice interface, accessibility
saúde mental, persuasive design ethics, patient experience design, trauma-informed design.

Autores: Alison Darcy (Woebot), Rafael Calvo, Cathy Pearl, BJ Fogg, Indi Young.

Fontes: woebothealth.com/research, Cathy Pearl Medium, IDEO health, Mad in Brazil,
mentalhealth.design.

Tier S: "Wellbeing by Design" (Calvo/Peters), Woebot RCT papers Darcy, Cathy Pearl
"Designing Voice User Interfaces".

domains: ["saude-mental", "design-systems"]. Retorne 500+ JSONL.
```

---

## 25. executive-team

**Tema:** Executive operations, board governance, investor relations, strategy execution.

**domains:** `["negocios"]`

**Prompt:**
```
[INSTRUÇÕES GERAIS]

Tema: Executive ops + board governance + IR + strategy execution (camada C-suite operacional).

Keywords: executive leadership, board governance, IR, strategy execution, transformation,
M&A integration, scorecard, OKR cascading.

Autores: Andy Grove, Ben Horowitz, Marc Andreessen, Bezos shareholder letters,
Hamilton Helmer (7 Powers).

Fontes: a16z.com, McKinsey, BCG Henderson Institute, HBR.

Tier S: "7 Powers" (Helmer), "High Output Management" (Grove), "Hard Thing About Hard
Things" (Horowitz), Bezos letters.

domains: ["negocios"]. Retorne 500+ JSONL.
```

---

## 26. expert-council

**Tema:** Advisory frameworks, cross-functional consultation, mentor patterns, conclave methodologies.

**domains:** `["ai-ml", "negocios"]`

**Prompt:**
```
[INSTRUÇÕES GERAIS]

Tema: Advisory frameworks + cross-functional consultation + mentor patterns +
expert systems (Mind Clone-style).

Keywords: advisory boards, expert consultation, cross-functional, strategic advisory,
mentor patterns, conclave methods, multi-agent consultation, expert systems AI.

Autores: Simon Willison, Eugene Yan, Will Larson, Charity Majors, mind-clone research.

Fontes: simonwillison.net, eugeneyan.com, lethain.com, charity.wtf, expert systems
research ArXiv.

Tier S: Simon Willison LLM-as-judge canonical posts, Will Larson Staff Engineer
canonical, mind-clone research papers (ArXiv).

domains: ["ai-ml", "negocios"]. Retorne 500+ JSONL.
```

---

## 27. growth (legacy)

**Tema:** Paid acquisition, CAC, creative testing, ad fatigue, media buying.

**domains:** `["marketing"]`

**Prompt:**
```
[INSTRUÇÕES GERAIS]

Tema: Paid acquisition + CAC + creative testing + media buying.

Keywords: paid acquisition, CAC, creative testing, ad fatigue, media buying, attribution,
incrementality, MMM, holdout testing.

Autores: Andrew Chen, Sean Ellis, Molly Pittman, Depesh Mandalia, Pedro Sobral,
Eric Seufert.

Fontes: AdExchanger, Marketing Brew, Mobile Dev Memo (Seufert), DigitalMarketer.

Tier S: "Mobile Dev Memo" canonical attribution essays Seufert, Andrew Chen growth
loops series.

domains: ["marketing"]. Retorne 500+ JSONL.
```

---

## 28. health-data

**Tema:** Clinical data, FHIR, EHR interoperability, medical AI, genomics.

**domains:** `["health-tech"]`

**Prompt:**
```
[INSTRUÇÕES GERAIS]

Tema: Clinical data + FHIR + EHR interoperability + medical AI + genomics.

Keywords: EHR, FHIR, HL7, clinical data, health informatics, medical AI, genomics,
real-world evidence, claims data, OMOP CDM.

Autores: Atul Butte, Eric Topol, Micky Tripathi, Aneesh Chopra, John Halamka.

Fontes: healthitanalytics.com, NEJM AI, JAMIA, healthcareitnews.com.

Tier S: NEJM AI seminal papers, FHIR R5 spec, OMOP CDM whitepaper, Topol "Deep Medicine".

domains: ["health-tech"]. Retorne 500+ JSONL.
```

---

## 29. health-tech

**Tema:** Digital therapeutics, telehealth, wearables, RPM, healthtech investment.

**domains:** `["health-tech"]`

**Prompt:**
```
[INSTRUÇÕES GERAIS]

Tema: Digital therapeutics + telehealth + wearables + RPM + healthtech VC.

Keywords: digital therapeutics, DTx, telehealth, wearables, RPM, healthtech investment,
clinical validation, reimbursement, FDA DiGA.

Autores: Halle Tecco, Sean Duffy, Kate Ryder, Atul Butte, Eric Topol, Stephen Hahn.

Fontes: rockhealth.com, mobihealthnews.com, statnews.com, techcrunch.com/category/health.

Tier S: Rock Health annual reports, DTx Alliance whitepapers, Topol "The Patient Will
See You Now".

domains: ["health-tech"]. Retorne 500+ JSONL.
```

---

## 30. innovation

**Tema:** Disruption theory, JTBD, exponential tech, frontier R&D, innovation accounting.

**domains:** `["ai-ml", "negocios"]`

**Prompt:**
```
[INSTRUÇÕES GERAIS]

Tema: Disruption theory + JTBD + exponential tech + frontier R&D.

Keywords: disruption theory, JTBD, exponential tech, innovation accounting, S-curves,
deep tech, breakthrough innovation, technology readiness levels.

Autores: Clayton Christensen, Eric Ries, Peter Diamandis, Werner Vogels, Ray Dalio,
Geoffrey Moore.

Fontes: singularityhub.com, futuretools.io, MIT Tech Review, a16z Future.

Tier S: "The Innovator's Dilemma" (Christensen), "Lean Startup" (Ries), "Crossing the
Chasm" (Moore), JTBD canonical essays Bob Moesta.

domains: ["ai-ml", "negocios"]. Retorne 500+ JSONL.
```

---

## 31. legal (legacy)

**Tema:** Legal tech, compliance automation, AI law, access to justice.

**domains:** `["legal"]`

**Prompt:**
```
[INSTRUÇÕES GERAIS]

Tema: Legal tech + compliance automation + AI law + access to justice.

Keywords: legal tech, compliance automation, AI law, access to justice, contract
automation, e-discovery, regtech, AI Act compliance.

Autores: Richard Susskind, Heather Meeker, Lawrence Lessig, Patricia Peck, Joshua Kubicki.

Fontes: artificiallawyer.com, abovethelaw.com, lawfaremedia.org, Susskind blog,
LexisNexis Legal Insights.

Tier S: "Tomorrow's Lawyers" (Susskind), "Code 2.0" (Lessig), Susskind canonical predictions
1990-2025.

domains: ["legal"]. Retorne 500+ JSONL.
```

---

## 32. marketing-ops

**Tema:** Martech stack, attribution, marketing automation, CDP, RevOps.

**domains:** `["marketing"]`

**Prompt:**
```
[INSTRUÇÕES GERAIS]

Tema: Martech stack + attribution + marketing automation + CDP + RevOps.

Keywords: martech stack, attribution, marketing automation, CDP, lead scoring, RevOps,
MQL/SQL, lead routing, multi-touch attribution, MMM.

Autores: Scott Brinker (chiefmartec), Patrick Campbell, Sangram Vajre, Jon Miller.

Fontes: chiefmartec.com, martech.org, ProfitWell, Marketo blog, Heap blog.

Tier S: Brinker annual martech landscape, "ABM is B2B" (Vajre), ProfitWell pricing
research canonical.

domains: ["marketing"]. Retorne 500+ JSONL.
```

---

## 33. product-research

**Tema:** Product discovery, opportunity solution tree, inclusive design, mixed methods.

**domains:** `["product"]`

**Prompt:**
```
[INSTRUÇÕES GERAIS]

Tema: Product discovery + opportunity solution tree + inclusive design + mixed methods.

Keywords: product discovery, opportunity solution tree, inclusive design, mixed methods,
JTBD, user research synthesis, opportunity sizing, hypothesis tracking.

Autores: Teresa Torres, Julie Zhuo, Cassie Kozyrkov, Kat Holmes, Indi Young, Bob Moesta.

Fontes: producttalk.org, designforinclusion.com (Holmes), IDEO Journal, Indi Young blog.

Tier S: "Continuous Discovery Habits" (Torres), "Mismatch" (Holmes), "Demand-Side Sales"
(Moesta) JTBD canonical.

domains: ["product"]. Retorne 500+ JSONL.
```

---

## 34. sales-ops

**Tema:** Sales operations, forecasting, territory planning, comp design.

**domains:** `["marketing"]`

**Prompt:**
```
[INSTRUÇÕES GERAIS]

Tema: Sales operations + forecasting + territory planning + comp design.

Keywords: sales operations, forecasting, territory planning, comp design, pipeline
analytics, quota setting, sales productivity, RevOps integration.

Autores: Matt Dixon, Patrick Campbell, Aaron Ross, Mark Roberge, Sales Hacker community.

Fontes: salesopsfoundation.org, gong.io/blog, saleshacker.com, RevenueCollective.

Tier S: "Cracking the Sales Management Code" (Jordan/Vazzana), "The Sales Acceleration
Formula" (Roberge), Gong reality reports.

domains: ["marketing"]. Retorne 500+ JSONL.
```

---

## 35. therapy

**Tema:** Psychotherapy methods, CBT, ACT, evidence-based therapy, digital therapy outcomes.

**domains:** `["saude-mental"]`

**Prompt:**
```
[INSTRUÇÕES GERAIS]

Tema: Psychotherapy methods + CBT + ACT + evidence-based therapy + digital therapy outcomes.

Keywords: psychotherapy, CBT, ACT, DBT, evidence-based therapy, therapeutic alliance,
digital therapy outcomes, RCT psychotherapy, common factors.

Autores: Alison Darcy, Acacia Parks, Johannes Thrul, Christian Dunker, Steven Hayes (ACT),
Aaron Beck (CBT).

Fontes: APA.org, psychotherapy.net, psychologytoday.com therapy section, Lancet Psychiatry,
clinical trial registries.

Tier S: Hayes "Acceptance and Commitment Therapy" canonical, Beck CBT seminal papers,
Lambert "common factors" meta-analyses.

domains: ["saude-mental"]. Retorne 500+ JSONL.
```

---

## 36. traffic-masters

**Tema:** Paid traffic Meta/Google, creative testing, CBO, ad fatigue, YouTube ads, Brasil paid.

**domains:** `["marketing"]`

**Prompt:**
```
[INSTRUÇÕES GERAIS]

Tema: Paid traffic + Meta/Google ads + creative testing + ad fatigue + Brasil paid traffic.

Keywords: paid traffic, Meta ads, Google ads, creative testing, CBO, ABO, ad fatigue,
YouTube ads, PMAX, lead gen ads, Instant Forms, CAPI.

Autores: Molly Pittman, Depesh Mandalia, Kasim Aslam, Tom Breeze, Nicholas Kusmich,
Ralph Burns, Pedro Sobral, Larry Kim.

Fontes: searchengineland.com, searchenginejournal.com, smartmarketer.com, DigitalMarketer,
Solutions 8 Blog, Mobile Dev Memo.

Tier S: Molly Pittman Traffic Engine canonical, Kasim Aslam Golden Ratio essays,
Nicholas Kusmich 4-Step Framework, Sobral Metodologia ABC.

domains: ["marketing"]. Retorne 500+ JSONL.
```

---

## ENTREGA DOS RESULTADOS

Quando voltar com os JSONL (1 por squad), salve cada um em:
```
docs/projects/aios-evolution/02-departments/curated/{squad-name}.jsonl
```

E me avisa qual squad. Eu rodo:
```bash
node tools/hydra/bin/ingest-curated.mjs --file docs/projects/aios-evolution/02-departments/curated/{squad}.jsonl
```

Cada arquivo deve ter **500+ linhas** (1 JSON por linha). Esperando 36 × 500 = **18.000+ items** total distribuídos.
