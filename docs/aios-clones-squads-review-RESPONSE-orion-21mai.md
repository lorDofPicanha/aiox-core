# AIOS Mind Clones + Squads — Revisão Crítica de Arquitetura

**Autor:** Orion (aios-master) · **Data:** 2026-05-21 · **Tipo:** revisão crítica (não encorajamento)
**Base:** leitura dos 33 `squad.yaml` reais em `squads/`, não só do brief.

---

## 0. TL;DR
A métrica que está guiando a reorganização — **"250/250 clones alocados, 0 órfãos, 33/33 valida"** — é a métrica errada. Ela otimiza **completude de org-chart**, não **qualidade de orquestração**. O sintoma é claro nos dados: 33 squads, naming inconsistente, ≥6 pares duplicados, 5 squads vazios de agentes de execução, e a maioria dos squads composta quase só por *mind_clones* (experts), não por agentes *core* (execução).

**Diagnóstico central:** o sistema colapsou **três abstrações distintas** num único conceito de "squad":
1. **Times de execução** (poucos `type: core`),
2. **Painéis de expertise** (centenas de `type: mind_clone`),
3. **Placeholders de org-chart** (squads vazios).

A regra "todo clone deve estar alocado" forçou os 3 a conviverem como "membros permanentes", inflando para 33 squads com duplicação pesada. **Recomendação:** separar as abstrações em 4 tipos de entidade (execução / pool de experts / governança-gates / task-forces) e trocar a métrica de sucesso.

---

## 1. Diagnóstico da arquitetura atual

### 1.1 Evidências (dos arquivos reais)
| Problema | Evidência |
|---|---|
| **Naming inconsistente** → ambiguidade de roteamento | `legal` vs `squad-legal`; `ai-science` vs `squad-ai`; `sales-ops` vs `squad-sales`; `customer-ops` vs `squad-customer-success`; `health-*` vs `squad-health`. Um roteador automático **não** consegue escolher deterministicamente entre `legal` e `squad-legal`. |
| **Três entidades "executivas" sobrepostas** | `executive-team` (head=ceo, C-suite, 0 agentes tipados) · `squad-executive` (head=aios-master/COO, core=5) · `expert-council` (head=conclave-coordinator, ponte JARVIS/Conclave). **São 3 coisas diferentes** disfarçadas de squad. |
| **Duplicatas com o MESMO head** | `ai-science` e `squad-ai` → ambos `demis-hassabis`. `squad-behavioral` e `design-terapeutico` → ambos `bj-fogg`. |
| **Squads vazios (placeholders)** | `customer-ops`, `sales-ops`, `product-research`, `executive-team`, `expert-council` têm **0 agentes `core` e 0 `mind_clone` tipados** — rotas mortas. |
| **Squads = painéis de expert, não times** | Quase todos são `core=0`. Só `squad-design`(8), `squad-executive`(5), `squad-operations`(3), `squad-data`(2), `squad-engineering`(2), `squad-content`(1) têm massa de execução real. O resto é expertise consultiva fantasiada de time. |
| **Cluster de saúde superdimensionado** | `health-data`, `health-tech`, `squad-health`, `therapy`, `design-terapeutico` = 5 squads de saúde/terapia. Provável over-build aspiracional para uma operação cujo trabalho real é dev/marketing/licitações. |
| **Validação dá falsa segurança** | `validate-all-squads 33/33` só checa **integridade de referência**, não saúde operacional (squad vazio passa, rota ambígua passa, gate ausente passa). |

### 1.2 O que está BEM (preservar)
- **`squad-security`** é o modelo a imitar: charter claro, 6 divisões funcionais, níveis L1-L4, head=CISO, escopo nítido. **Use-o como template.**
- O campo **`type: core` vs `type: mind_clone` já existe** — a distinção entre execução e expertise está no schema, só não está sendo usada arquiteturalmente.
- **Multi-membership já existe** (ex.: chip-huyen "shared with squad-ai") — base para o pool consultivo.
- Níveis (L1-L4), `tasks`, `workflows`, `skills`, `mcps` por squad — boa fundação.

---

## 2. Arquitetura-alvo recomendada

Separar **uma** abstração ("squad") em **quatro tipos de entidade**, cada um com regra de roteamento própria:

```text
Operador (Founder)
│
├── EXECUTIVE COUNCIL  (governança — NÃO executa)
│     C-levels = política, gates, escalação, tradeoffs cross-squad
│
├── ORCHESTRATION RUNTIME  (o roteador, não um "squad")
│     COO/aios-master + orchestrator + sop-extractor  → roteia intents
│
├── EXECUTION SQUADS  (~8-12 permanentes, staff = core + poucos especialistas embutidos)
│     cada um: 1 chief (router) + DRIs core + tasks + workflows + gates aplicáveis
│
├── EXPERT POOL  (a MAIORIA dos ~200 mind_clones — consultivo, retrieved on-demand)
│     via a ponte Conclave/JARVIS; tagueado por domínio; NÃO são "membros permanentes"
│
└── TASK FORCES  (efêmeras — montadas por missão a partir de squads + pool, dissolvidas depois)
```

**Princípio:** *membership* (relação de DRI/responsabilidade) ≠ *availability* (consultivo). Um clone disponível via retrieval **não precisa ser membro** de squad nenhum.

---

## 3. Realocações específicas

### 3.1 Fundir / reclassificar (dedupe)
| Ação | De → Para | Razão |
|---|---|---|
| **Fundir** | `executive-team` → **Executive Council** (governança) | C-suite é política/gate/escalação, não squad |
| **Reclassificar** | `squad-executive` → **Orchestration Runtime** | aios-master(COO)+orchestrator+sop-extractor são o roteador/runtime, não um time |
| **Reclassificar** | `expert-council` → **Expert Pool / ponte Conclave** | é o mecanismo de consulta, não um squad |
| **Fundir** | `ai-science` → `squad-ai` | mesmo head (demis-hassabis), mesmo domínio |
| **Fundir** | `legal` + `squad-legal` → **um** `squad-legal` | dois jurídicos com heads diferentes |
| **Fundir** | `design-terapeutico` → `squad-behavioral` (capacidade) | mesmo head (bj-fogg) |
| **Fundir** | `sales-ops` → `squad-sales`; `customer-ops` → `squad-customer-success` | placeholders vazios duplicando squads reais |
| **Fundir** | `product-research` + `squad-research` + `innovation` → `squad-research` (com `squad-product` separado só se houver execução de produto real) | 3-4 squads de descoberta |
| **Colapsar** | `health-data`+`health-tech`+`squad-health`+`therapy`+`design-terapeutico` → **um** `squad-health` **OU** rebaixar a domínio do Expert Pool | over-build; só manter como squad se saúde for linha de negócio ativa |

### 3.2 Expert Pool (a mudança que mais importa)
- Mover **a maioria dos mind_clones** dos squads para o **Expert Pool**, tagueados por domínio (`marketing`, `legal-br`, `security`, `forecasting`, `markets`, ...).
- Cada execution squad mantém só **especialistas embutidos** (2-4) que realmente participam do trabalho recorrente; o resto vira consulta on-demand.
- Ex.: o trio de previsão (`nate-silver`, `philip-tetlock`, `robin-hanson`) hoje em `squad-data` → **Expert Pool** (domínio `forecasting/decision-science`). Eles são consultoria de julgamento, não engenharia de dados.

### 3.3 Trading/crypto/polymarket (resposta à Q4)
Não pertencem a `squad-finance` (que é **corporate finance** — Damodaran/valuation/pricing) **nem** a `squad-data` (data eng).
- **Recomendação:** como existe projeto real (`polymarket-trader`), criar **`squad-markets-intelligence`** (ou task-force, se intermitente) com `domer-polymarket`, `theo-polymarket`, `gcr-crypto`, `danijel-overtime` + `robin-hanson` (prediction markets) como expert.
- Se markets-intelligence **não** for atividade recorrente → Expert Pool domínio `markets`, acionado por task-force.

---

## 4. Modelo de roteamento e governança

### 4.1 Roteamento — **Híbrido policy-based** (resposta à Q9)
Determinístico por padrão, dinâmico para complexidade:
1. **Intent → squad** por regra determinística (tags de skill/keyword no manifest). Naming único elimina ambiguidade.
2. **Chief do squad roteia** para os DRIs core; **consulta o Expert Pool** só quando a tarefa é nova/incerta/alto-risco (retrieval por tag de domínio).
3. **Gates disparam por política**, independentemente do roteamento.
4. **Executive Council** só entra em **escalação / tradeoff cross-squad / exceção de política**.

Isso satisfaz as duas constraints aparentemente opostas do brief: *"determinístico o bastante para automação"* (passos 1-3) **e** *"consulta dinâmica de experts para decisões complexas"* (passo 2).

### 4.2 Gates obrigatórios (resposta à Q10)
São **políticas/triggers**, NÃO squads. Cada gate = checagem leve com um owner:
| Gate | Dispara quando | Owner |
|---|---|---|
| **Finance** | impacto de custo/receita acima de limiar | CFO |
| **Legal** | contrato, termos, conformidade regulatória | CLO/squad-legal |
| **Security** | exposição de superfície, secret, dependência | CISO/squad-security |
| **Privacy (LGPD)** | dado pessoal/CNPJ | DPO (ann-cavoukian) |
| **Data quality** | persistência/migração/decisão sobre dado | CDAO/squad-data |
| **Brand** | comunicação externa/identidade | CMO/squad-content |
| **QA** | release/deploy | squad-operations |
| **Human approval** | ação **irreversível ou externa** (deploy prod, envio a terceiro, gasto) | Operador |

Princípio anti-burocracia: gate só dispara em **gatilho material**, não em toda tarefa.

### 4.3 C-levels: política, não execução (resposta à Q8)
C-levels devem ser **agentes de política/gate/escalação**, **não** de execução. Execução fica nos squads (chiefs + core). Isso evita o gargalo de "tudo sobe pro CEO" e mantém velocidade.

---

## 5. Riscos e modos de falha
1. **Over-calling de experts** (custo/latência) → mitigar: chief só consulta o pool com baixa confiança/novidade; cachear consultas (já há `aios-brain-bridge`/`mcp-memory`).
2. **Ambiguidade de rota** por nomes quase-iguais → **maior risco atual**; resolver com naming único antes de automatizar roteamento.
3. **Rotas mortas** (squads vazios) → roteador pode mandar trabalho a um squad sem executor.
4. **Diluição de expertise** ("todos alocados") → sem DRI claro, membership vira ruído.
5. **Sprawl de mind_clones** (≈200 personas) → custo de manutenção; muitos quase-duplicados (vários pensadores de growth/marketing).
6. **Lei de Conway** → imitar org-chart corporativo assa a burocracia corporativa na latência do sistema. O alvo é qualidade de orquestração, não realismo de org-chart.
7. **Falsa segurança da validação** → `33/33 OK` valida referências, não saúde operacional.

---

## 6. Plano de migração faseado
- **Fase 0 — Parar e medir certo.** Adicionar campo `entity_type: execution_squad | expert_pool | gate | task_force | runtime | council` ao schema. Padronizar naming (recomendo `squad-<domínio>` em tudo; aposentar nomes nus).
- **Fase 1 — Extrair o Expert Pool.** Mover mind_clones de membership permanente para o pool com tags de domínio. Cada execution squad fica com 2-4 especialistas embutidos + DRIs core.
- **Fase 2 — Dedupe.** Aplicar as fusões da §3 (executivo, ai, legal, behavioral, sales, customer, research, health, markets).
- **Fase 3 — Roteador + gates.** Implementar o roteamento híbrido (§4.1) e as policies de gate (§4.2).
- **Fase 4 — Nova validação.** Trocar/expandir `validate-all-squads` para checar **saúde operacional**:
  - todo execution squad tem ≥1 DRI `core`;
  - 0 squads de execução vazios;
  - cobertura de gates = 100% nos fluxos sensíveis;
  - 0 intents não-roteáveis (em vez de "0 clones órfãos");
  - 0 nomes ambíguos.

---

## 7. Respostas diretas às 12 perguntas
1. **Alocar todos os 250 em squads é erro?** Sim. Confunde *membership* com *availability*. A maioria deve estar no Expert Pool (consultivo), não como membro permanente.
2. **Mover clones para um expert-pool consultivo?** Sim — é a mudança de maior impacto.
3. **Alocações erradas/ruidosas/duplicadas?** As da §1.1: duplicatas de head (ai-science/squad-ai; behavioral/design-terapeutico), pares legal, sales, customer, o cluster de saúde, e o trio de forecasting em squad-data.
4. **Trading/crypto/polymarket?** Nem finance nem data → `squad-markets-intelligence` dedicado (ou task-force/pool). Ver §3.3.
5. **Quebrar marketing em 5?** **Over-fragmentação.** Manter `marketing-traffic` como execution squad; growth/content/lifecycle/CRO são **capacidades/tags** dentro dele + experts do pool. Splitar só quando houver volume de execução recorrente que justifique DRIs próprios.
6. **Execução vs governança?** Execução: engineering, platform, data, design, content, marketing-traffic, operations, security, sales, customer-success, (markets, health se ativos). Governança: Executive Council + gates. Runtime: orchestration.
7. **squad-executive vs executive-team vs expert-council?** **São 3 coisas diferentes, não 3 squads:** `executive-team`→Executive Council (governança); `squad-executive`→Orchestration Runtime (roteador); `expert-council`→Expert Pool/ponte Conclave (consulta).
8. **C-levels executam?** Não — política/gate/escalação. Ver §4.3.
9. **Modelo de roteamento?** Híbrido policy-based (§4.1): determinístico por padrão, pool dinâmico na incerteza, council só em escalação.
10. **Gates obrigatórios?** Os 8 da §4.2 — como policies, não squads.
11. **Pesquisa/frameworks?** Ver §8.
12. **O que mudar antes de continuar?** (a) padronizar naming; (b) introduzir `entity_type`; (c) extrair o Expert Pool; (d) trocar a métrica de validação de "0 órfãos" para "0 rotas inválidas + cobertura de gate". **Só então** continuar reorganizando o resto.

---

## 8. Pesquisa / frameworks de apoio
- **Anthropic — "Building Effective Agents" (2024):** padrões *routing*, *orchestrator-workers*, *prompt chaining*; princípio de **só adicionar complexidade que se paga** e preferir o padrão mais simples. → sustenta runtime de orquestração + roteamento determinístico + minimizar camadas.
- **MetaGPT (Hong et al., 2023):** SOPs codificados + papéis especializados numa "software company". → sustenta squads com `tasks`/`workflows` e SOP-driven (sop-extractor).
- **AutoGen (Wu et al., 2023):** agentes conversáveis + group chat com orquestrador/roteador. → sustenta chief-as-router + consulta dinâmica.
- **CrewAI:** roles + crew + process (sequential/hierarchical). → sustenta execution squads com chief hierárquico.
- **LangGraph:** grafos de estado para roteamento **determinístico**. → sustenta "determinístico o bastante para automação".
- **CoALA — Cognitive Architectures for Language Agents (Sumers et al., 2024):** separar memória/ação/decisão. → sustenta separar pool (memória de expertise) de execução.
- **Lei de Conway:** estrutura do sistema espelha a estrutura organizacional → **cuidado** ao copiar org-chart humano: importa a burocracia junto.
- **Span-of-control / "two-pizza teams" (Hackman; prática Amazon):** times pequenos e focados roteiam e entregam melhor → contra a fragmentação em 33 squads.
- **Mixture-of-Experts (analogia):** um *gating/router* seleciona poucos experts por consulta — exatamente o modelo pool + roteador, não "todos sempre ativos".

---
*Revisão por Orion (aios-master). Crítica, aterrada nos 33 `squad.yaml` reais. A meta é qualidade de orquestração, não completude de org-chart.*
