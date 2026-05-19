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

*Última atualização: 2026-05-18 noite — workflow real v3 + mega research + pricing workflow-as-a-service*
*Histórico:*
- *2026-05-14 — research inaugural (buscador only)*
- *2026-05-18 manhã — escopo expandido para 3 módulos (v2 com 4 empresas, anti-conluio central)*
- *2026-05-18 noite — v3 CORREÇÕES: 3 empresas (não 4), workflow 6 estágios + base, moat redefinido pós-mega-research, pricing workflow-as-a-service R$2.8k/mês*
