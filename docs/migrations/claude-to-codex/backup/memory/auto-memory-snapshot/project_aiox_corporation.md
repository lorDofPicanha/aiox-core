---
name: AIOX Corporation
description: Empresa autonoma de agentes AI com 130+ agentes em 21 departamentos, hierarquia L0-L5, ferramentas externas via MCP, knowledge bases departamentais
type: project
---

## AIOX Corporation — Empresa Autonoma de Agentes

Projeto iniciado em 2026-03-14. Expansao massiva em 2026-03-24.

### Estado atual (2026-03-25)

- **~132 agentes total**: 12 core + 27+ novos mind clones + ~93 existentes
- **Novos clones (2026-03-25):** Patricia Peck (LGPD/Direito Digital BR) + Christian Dunker (Psicologo CRP/USP)
  - Criados por decisao unanime do Conclave Serenity AI
  - Patricia Peck: dept Legal, reports_to heather-meeker
  - Christian Dunker: dept Health, reports_to alison-darcy
- **21 departamentos** (7 novos em 24/mar):
  - Originais: Engineering, Product, Design, Data, Operations, Research, Security, AI Strategy, Growth, Sales, People, Finance, Legal, Education
  - Novos: **Health**, **Customer Success**, **Content & Media**, **Behavioral Science**, **Community & DevRel**, **Platform & Infrastructure**
- **C-Suite**: CTO=architect, CPO=pm, COO=aiox-master, CFO=Damodaran, CMO=Godin, CHRO=McCord, CSO=Hormozi, CISO=Schneier
- **Hierarquia**: L5 (CEO/humano) → L4 (C-Suite) → L3 (VPs/Chiefs) → L2 (Senior) → L1 (Operator) → L0 (Tools)

### Novos agentes adicionados (2026-03-24)

**Engineering:** Kent Beck, Uncle Bob Martin, Linus Torvalds
**Product:** Teresa Torres, Marty Cagan
**Sales:** Grant Cardone, Russell Brunson
**Growth:** Neil Patel, Ryan Holiday, Oli Gardner
**Finance:** Ray Dalio, Warren Buffett
**Security:** Kevin Mitnick, Troy Hunt
**AI Strategy:** Ilya Sutskever, Yann LeCun
**People:** Simon Sinek, Brene Brown
**Legal:** Lawrence Lessig
**Education:** Sugata Mitra
**Customer Success:** Jason Lemkin
**Behavioral Science:** Daniel Kahneman, Richard Thaler
**Community:** Scott Hanselman
**Platform:** Charity Majors
**Design:** Dieter Rams, Erik Spiekermann, Tobias van Schneider, Val Head, Vitaly Friedman, Refika Anadol (registrados, ja tinham .md)

### Reorganizacoes (2026-03-24)

- Health agents movidos de Research para novo dept Health (VP: Alison Darcy)
- Content agents movidos de Growth para novo dept Content (VP: Ann Handley)
- Customer Success separado de Sales (VP: Lincoln Murphy)
- Platform separado de Engineering (VP: Kelsey Hightower)
- Behavioral Science separado de Research (VP: BJ Fogg)
- Community criado (VP: Sarah Drasner)

### Ferramentas externas integradas

40+ ferramentas mapeadas em tool-integrations.yaml e tool-permissions.yaml:
- Engineering: GitHub API, Semgrep, SonarQube, CodeRabbit
- Growth: Google Analytics, Search Console, PostHog, Ahrefs, Buffer
- Sales/CS: HubSpot CRM, Stripe, Apollo
- Finance: Alpha Vantage, Financial Modeling Prep
- Security: Snyk, Trivy, VirusTotal, CrowdSec
- AI: HuggingFace, Ollama, LangSmith
- Content: LanguageTool, Strapi, Ghost
- Health: Infermedica, FHIR
- Platform: Docker, Grafana, Prometheus
- Community: GitHub, Discord
- Legal: Docassemble
- PM: Linear

### Knowledge bases criadas

8 knowledge bases departamentais em .aios-core/data/knowledge/:
engineering-kb.md, sales-kb.md, marketing-kb.md, ai-strategy-kb.md, finance-kb.md, security-kb.md, behavioral-science-kb.md, leadership-kb.md

### Schedules automaticos

20+ tarefas automaticas (cron + event-driven) cobrindo todos os departamentos:
daily churn monitor, SEO checks, pipeline reviews, infra health, community pulse, etc.

### Artefatos

- Org config: `.aios-core/core/corporation/org-config.yaml` (1354 linhas)
- Permissions: `.aios-core/core/corporation/permissions.yaml`
- Schedules: `.aios-core/core/corporation/schedules.yaml`
- Tool integrations: `.aios-core/core/corporation/tool-integrations.yaml`
- Tool permissions: `.aios-core/core/corporation/tool-permissions.yaml`
- PRD: `docs/stories/prd-aiox-corporation.md`

**Why:** O usuario quer uma empresa autonoma completa que opera 24/7 com conexao a ferramentas externas reais.
**How to apply:** Todo desenvolvimento futuro deve considerar esta estrutura. Tasks devem ser roteadas pelo departamento correto. Novos agentes devem ter knowledge base e ferramentas associadas.
