# AIOS — Routing & Governance Gates Policy (Fase 3)

**Versão:** 1.0.0 · **Data:** 2026-05-22 · **Autor:** Orion (aios-master)
**Status:** policy de instrução (enforcement via constituição + hooks + autoridade de agente). Complementa `.aios-core/constitution.md`.

> Modelo: **roteamento híbrido policy-based** — determinístico por padrão, consulta dinâmica do Expert Pool na incerteza, council só em escalação. Hierarquia `chief → specialist → clone` (`.codex/config.toml` `max_depth=2`).

---

## 1. Modelo de roteamento (4 passos)
1. **Intent → domínio → squad (determinístico).** Casar a intenção a um domínio (tabela §2). Entrada padrão = o **chief** do squad (Tier 0).
2. **Chief roteia dentro do squad.** Para DRIs `core` (execução). Consulta o **Expert Pool** (membership `pool`, por tag de `domain`) **só quando** a tarefa é nova / incerta / alto-risco (regra §3). Evita over-calling.
3. **Gates disparam por política** (§4), independentemente da rota.
4. **Escalação ao Executive Council** (membership `governance`) só em: tradeoff cross-squad, exceção de política, decisão estratégica.

Membership (do índice `jarvis-mind-clone-index.json`): `core` (51, executam) · `pool` (186, consultivos) · `governance` (6, C-levels) · `runtime` (7, orquestração).

## 2. Tabela de roteamento — domínio → squad → chief (Tier 0)
| Domínio | Squad | Chief (@) |
|---|---|---|
| Software / arquitetura / runtime | squad-engineering | @architect (CTO) |
| Plataforma / DevOps / infra | squad-platform | @kelsey-hightower |
| Dados / DB / pipelines / RLS | squad-data | @data-engineer |
| IA / ML / decision science | squad-ai | @demis-hassabis (CAIO) |
| Design / UX / visual | squad-design | @design-lead |
| Design comportamental / engajamento | squad-behavioral-design | @bj-fogg |
| Segurança / pentest / AppSec | squad-security | @bruce-schneier (CISO) |
| Jurídico / compliance / privacidade | squad-legal | @heather-meeker (GC) |
| Tráfego pago / growth / SEO / CRO | marketing-traffic | @traffic-masters-chief |
| Conteúdo / copy / narrativa | squad-content | @ann-handley |
| Vendas | squad-sales | @alex-hormozi (CSO) |
| Customer success / suporte | squad-customer-success | @lincoln-murphy |
| Produto / discovery / PM | squad-product | @pm (CPO) |
| Pesquisa / mercado / foresight | squad-research | @analyst |
| Operações / agile / QA / processo | squad-operations | @sm |
| Finanças corporativas / valuation | squad-finance | @aswath-damodaran (CFO) |
| Mercados / trading / prediction | squad-markets-intelligence | @luana-lopes-lara |
| Saúde (Anipis) — digital/mental/clínica | squad-health | @alison-darcy |
| Pessoas / cultura / educação | squad-people, squad-education | @patty-mccord, @sal-khan |
| Comunidade / DevRel | squad-community | @sarah-drasner |
| Inovação / lean / disrupção | innovation | @clayton-christensen |
| Orquestração / meta-framework | squad-executive | @aios-master (COO) |
| Governança / consulta multi-expert | executive-team, expert-council | @ceo, @conclave-coordinator |

## 3. Regra de consulta ao Expert Pool (estende AGENTS.md §4)
**Consultar** (1+ experts `pool` do domínio, via brain-bridge/Conclave) antes de finalizar quando há: criação de story/PRD, arquitetura, pricing, segurança, fluxos UX, schema de DB, decisão jurídica/regulatória, decisão de mercado, ou qualquer escolha estratégica/irreversível.
**Pular** (não consultar): typos, padrões já estabelecidos, bug fixes óbvios, hotfixes, ou quando o usuário diz "skip consultation".
**Como:** `node .aios-core/core/jarvis/self-consultation.js conclave --question "{q}" --agent {chief} --experts 3` OU MCP `request_expert_consultation`. Cachear consultas (mcp-memory) p/ evitar repetição.

## 4. Gates de governança obrigatórios
Disparam por **gatilho material** (não em toda tarefa — anti-burocracia). Owner assina; alguns BLOQUEIAM.

| Gate | Gatilho | Owner | Ação | Enforcement |
|---|---|---|---|---|
| **Story-driven** | início de trabalho | @sm/@pm | story válida existe | Constituição Art. III — **BLOCK** (`dev-develop-story.md`) ✅ existe |
| **No-invention** | citar fato/spec/dado | qualquer agente | verificar antes de citar | Const. Art. IV — **BLOCK** |
| **Quality (QA)** | merge/deploy/release | @qa / squad-operations | lint + typecheck + test | Const. Art. V — **BLOCK** (`pre-push.md`) ✅ existe |
| **Mind-clone DNA** | criar NOVO agente pessoa em `squads/*/agents/` | @squad-creator | exige DNA extraído (ou sufixo funcional) | hook `mind-clone-governance.py` — **BLOCK (exit 2)** ✅ **ATIVO** (wired 22/Mai) |
| **Data-quality** | SQL DDL/DELETE em Bash fora de migration | @data-engineer (CDAO) | propor + aprovar antes | hook `sql-governance.py` — **BLOCK (exit 2)** ✅ **ATIVO** (wired 22/Mai) |
| **Security** | secret, dependência nova, superfície de ataque | @bruce-schneier (CISO) | threat review / `cyber-chief threat-model` | **policy** (squad-security) — WARN→review |
| **Legal** | contrato, termos, conformidade regulatória | @heather-meeker (GC) | revisão jurídica | **policy** (squad-legal) — review |
| **Privacy / LGPD** | dado pessoal / CNPJ | @ann-cavoukian (DPO) | DPIA + minimização + base legal | **policy** (squad-legal) — review |
| **Finance** | custo/receita acima de limiar | @aswath-damodaran (CFO) | revisão financeira / pricing | **policy** (squad-finance) — review |
| **Brand** | comunicação externa / identidade | @ann-handley (CMO) | revisão de marca | **policy** (squad-content) — review |
| **Human approval** | ação **irreversível ou externa** (deploy prod, push, envio a terceiro, gasto) | Founder | OK explícito | **policy** + push só via @devops (Art. II) ✅ existe |

## 5. Princípios anti-burocracia (do brief original)
- Gate só dispara em **gatilho material**, nunca em toda tarefa.
- Pool consultado só sob incerteza/risco — não para tarefas simples.
- Roteamento determinístico por padrão (tabela §2); dinâmico só quando necessário.
- Execução rápida: chief decide e age; council só em escalação.

---
*Policy por Orion (aios-master). Fase 3 da reorganização. Referenciada pela AGENTS.md §4-bis.*
