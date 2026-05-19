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

## 9. EXPANSÃO DE ESCOPO — 18/Mai/2026

**Trigger:** 5 áudios do cliente pedindo **Livro Caixa para 4 empresas** + **automação de análise documental** ("desclassificar / reanálise" = recurso administrativo manual hoje).

**Novo escopo proposto:** 3 módulos integrados em **roadmap sequencial faseado (Opção C)**:
- **Fase 1 (sem 1-6):** Livro Caixa Multi-Empresa + RBAC granular (5 roles) + Dashboard agregado
- **Fase 2 (sem 7-12):** Buscador Regional (PNCP + DF + AL) com alertas
- **Fase 3 (sem 13-22):** Doc Automation = Vault de certidões + Biblioteca de ACTs + Conferência de Concorrentes + Auto-geração BP/DRE/índices

**Empresas do cliente (confirmado Breno 18/Mai):** **4 empresas DIFERENTES** — INYAC, INC, CENTINELA, ENHAC
**Roles RBAC:** Master (cliente) | Receita (pai) | Despesa por empresa (Alice→INYAC, Giovanna→INC, Gabela→CENTINELA, 🅿️4ª pessoa→ENHAC parking lot)
**Áudio 1 ("desclassificar/reanálise") confirmado FORA do escopo licitação** — é outro processo interno da empresa, parking lot até detalhar

**Risco P0 NÃO-ÓBVIO:** Lei 14.133 art. 14 IV — empresas coligadas não competem juntas. Sistema precisa flag `parent_group_id` + bloqueio anti-conluio.

**Brief unificado:** `99-synthesis/PROJECT-BRIEF-18mai-expansion.md`

**15 decisões consolidadas:** ver §6 do brief (4 áudios + 5 escopo + 6 operacionais pré-dev)

---

*Última atualização: 2026-05-18 — expansão de escopo livro caixa + doc automation*
*Histórico:*
- *2026-05-14 — research inaugural (buscador only)*
- *2026-05-18 — escopo expandido para 3 módulos*
