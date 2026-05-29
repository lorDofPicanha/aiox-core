# Projeto Contador — Arquitetura de Squads, Mega Squads e Mind Clones

Data: 2026-05-29
Orquestrador: @aios-master / Orion
Base: `01-conclave-agentes-mvp.md`, `03-status-e-proximos-passos.md`
Produto: **Radar Fiscal + Operação do Escritório Contábil**

> Documento de arquitetura organizacional. Define quem participa, quem decide o quê,
> em que ordem ativar, e como manter governança leve. Não é o PRD nem a arquitetura técnica.

---

## 0. Princípios de governança (lê antes de tudo)

1. **Squad existe para reduzir incerteza, não para preencher organograma.** Só ativa squad quando há uma decisão real e recorrente que justifica painel dedicado.
2. **1 dono humano de verdade = o founder.** Tudo abaixo é apoio. Mind clones aconselham, agentes AIOS executam, Orion orquestra; o founder mantém os gates duros.
3. **Mind clone aconselha, não decide.** Consulta via `self-consultation.js` (conclave ou single). Nenhum clone tem autoridade de commit/deploy/contrato.
4. **Council só para decisões cross-squad ou irreversíveis.** Conclave convocado pelo Orion. Resto é autonomia de squad.
5. **Trust é veto, não opinião.** O Mega Squad C (Segurança/Privacidade/Risco) pode bloquear qualquer entrega que toque certificado, procuração, dado pessoal ou responsabilidade tributária. Veto não se "negocia em reunião", se resolve removendo o risco.
6. **Concierge primeiro.** Enquanto for MVP manual, a maior parte do peso é Produto+CS+Trust. Engenharia entra pesado só na fase SaaS.

---

## 1. Visão geral: 4 Mega Squads + Conselho

```
                          ┌─────────────────────────────┐
                          │  👑 ORION (@aios-master)      │
                          │  Orquestração + Council/Gates │
                          └───────────────┬──────────────┘
        ┌──────────────────────┬──────────┴───────────┬──────────────────────┐
        ▼                      ▼                      ▼                      ▼
 ┌──────────────┐      ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
 │ MEGA A        │      │ MEGA B        │      │ MEGA C        │      │ MEGA D        │
 │ Produto &     │      │ Plataforma &  │      │ TRUST         │      │ Experiência   │
 │ Mercado       │      │ Engenharia    │      │ (veto power)  │      │               │
 │ dono:@pm      │      │ dono:@architect│     │ dono:@cyber + │      │ dono:@ux-     │
 │               │      │               │      │  @legal (co)  │      │ design-expert │
 └──────────────┘      └──────────────┘      └──────────────┘      └──────────────┘
```

O founder é o nó acima do Orion. Orion não aprova gate duro sozinho; convoca e sintetiza.

---

## 2. Mega Squads detalhados

### 🟦 MEGA SQUAD A — Produto & Mercado
**Dono executivo:** `@pm`
**Objetivo:** descobrir a dor real, fixar ICP/JTBD, desenhar MVP + oferta piloto, definir pricing e operação de sucesso do cliente.

| Sub-squad | Dono (agente AIOS) | Mind clones | Foco |
|-----------|--------------------|-------------|------|
| **A1 · Discovery** | `@pm` + `@analyst` | `marty-cagan`, `teresa-torres`, `steve-blank` | Entrevistas com contadores, JTBD, hipóteses de valor/viabilidade/usabilidade/factibilidade, kill-criteria |
| **A2 · Posicionamento & Oferta** | `@traffic-masters-chief` + `@copy-chief` | `april-dunford`, `alex-hormozi`, `joanna-wiebe`, `matt-dixon` | Categoria, posicionamento, oferta piloto, script de venda consultiva B2B conservador |
| **A3 · CS & Concierge** | CS Lead (persona `customer-success-manager` + `@pm`) | `anderson-hernandes` (voz do ICP / dono de escritório, clonado 29/Mai), `lincoln-murphy`, `nick-mehta` | Onboarding piloto, operação manual concierge, retenção, voice-of-customer |
| **A4 · Finanças & Pricing** | `@analyst` (apoio persona `cfo`) | `aswath-damodaran`, `patrick-campbell`, `anderson-hernandes` (precificação de honorários de escritório) | Unit economics (por escritório / CNPJ ativo / usuário), custo do concierge, ROI do cliente, modelo de preço |

**Decisões autônomas do squad:** roteiro de entrevista, priorização de backlog de discovery, formato do piloto concierge, hipóteses de copy/oferta para teste.
**Exige Council:** definição de categoria de mercado (Dunford vs. Cagan já divergem), métrica-norte do produto.
**Exige aprovação humana:** Go/Kill do produto, pivot de ICP, **pricing final**, fechar contrato de piloto.

---

### 🟩 MEGA SQUAD B — Plataforma & Engenharia
**Dono executivo:** `@architect`
**Objetivo:** arquitetura multi-tenant segura e evolutiva, modelo de dados, matriz fiscal, automação de IA e confiabilidade de entrega.

| Sub-squad | Dono (agente AIOS) | Mind clones | Foco |
|-----------|--------------------|-------------|------|
| **B1 · Arquitetura & Integrações** | `@architect` + `@dev` | `martin-fowler`, `sam-newman`, `werner-vogels`, `kelsey-hightower` | Multi-tenant, fronteiras de dados, arquitetura evolutiva, integrações (Integra Contador na fase 2), custo de infra |
| **B2 · Dados & Domínio Fiscal** | `@data-engineer` + `@db-sage` | `roberto-dias-duarte` (lead domínio fiscal/SPED, clonado 29/Mai), `joe-reis`, `chip-huyen`, `edward-tufte`, `cassie-kozyrkov` | Matriz de obrigações por regime (MEI+Simples), normalização de eventos fiscais, risco de CNPJ inapto, dashboards, BI, design de decisão |
| **B3 · IA & Automação** | `@architect` (AI Lead) | `andrew-ng`, `simon-willison`, `lilian-weng` | Classificação/extração de documentos, alertas inteligentes, automação de checklist, guarda contra falso-negativo |
| **B4 · Qualidade & Delivery (DevEx)** | `@qa` + `@devops` | `gene-kim`, `nicole-forsgren`, `jez-humble` | DORA, CI/CD, confiabilidade operacional, critérios de aceite e cenários de risco fiscal |

**Decisões autônomas do squad:** padrões de código, escolha de libs internas, design de módulos, estratégia de testes, pipeline CI/CD.
**Exige Council:** escolha de stack core, modelo de dados multi-tenant (impacta Trust), introduzir IA em decisão fiscal.
**Exige aprovação humana:** integração com **Integra Contador / APIs gov**, qualquer **automação que envie dado a órgão público**, gasto de infra/ferramenta acima do limite combinado.

---

### 🟥 MEGA SQUAD C — TRUST (Segurança · Privacidade · Risco) — *poder de veto*
**Dono executivo:** `@cyber-chief` + `@legal-chief` (co-liderança → Trust Council)
**Objetivo:** garantir que dado fiscal, certificado, procuração e linguagem de responsabilidade nunca exponham o escritório, o cliente ou o produto. Bloqueia entregas que criem risco.

| Sub-squad | Dono (agente AIOS) | Mind clones | Foco |
|-----------|--------------------|-------------|------|
| **C1 · Segurança** | `@cyber-chief` | `bruce-schneier`, `troy-hunt`, `kevin-mitnick` | Threat model, controle de acesso por cliente, trilha de auditoria, manuseio de metadados de certificado/procuração |
| **C2 · Privacidade & LGPD** | `@legal-chief` | `patricia-peck`, `ann-cavoukian` | Base legal, data map, DPA, termos, privacy-by-design, minimização |
| **C3 · Risco Tributário/Fiscal BR** | `@legal-chief` | `heleno-taveira-torres` (lead, clonado 29/Mai de fontes reais) | Limites de responsabilidade fiscal, linguagem que não vire "consultoria tributária", disclaimers da Reforma (IBS/CBS), zonas cinzentas |

> ⚠️ Correção (auditoria pedro-valerio, 29/Mai): `niebuhr`/`justen-filho` foram removidos de C3 — são doutrina de **licitação/direito administrativo** (reuso do projeto Noyce), não tributário. O lead tributário/Reforma é **`heleno-taveira-torres`**. Domínio fiscal-operacional (SPED/Fisco digital) é **`roberto-dias-duarte`** (vive em B2, consultivo em C). Veja §2 Mega B.

**Decisões autônomas do squad:** classificação de sensibilidade de dado, exigência de auditoria/log, requisitos mínimos de permissão, vocabulário proibido (ex.: "garantimos apuração correta").
**Veto direto (sem reunião) — 6 linhas vermelhas:**
1. Armazenar certificado A1.
2. Scraping e-CAC em massa.
3. Envio fiscal automático a órgão público sem humano.
4. Coletar/processar dado pessoal sem base legal.
5. **Linguagem que configure consultoria/apuração tributária** (risco jurídico nº 1 do conclave) — qualquer texto que prometa cálculo, crédito ou enquadramento correto. Validação obrigatória de `@heleno-taveira-torres`.
6. **Alerta fiscal com risco de falso-negativo não monitorado** — a promessa-núcleo do produto ("nenhuma obrigação fica invisível") quebra em silêncio se um alerta deixar de disparar. Toda regra de alerta entra com critério de detecção de falha (cobertura, não só acerto). Validação `@roberto-dias-duarte`.

**Exige aprovação humana:** aceitar qualquer risco residual que o squad sinalizar como aberto; base legal de novo tratamento de dado; texto contratual de responsabilidade.

---

### 🟪 MEGA SQUAD D — Experiência
**Dono executivo:** `@ux-design-expert`
**Objetivo:** usabilidade operacional densa para o escritório (muitos CNPJs, muitas tarefas) e simplicidade radical no portal do cliente final.

| Sub-squad | Dono (agente AIOS) | Mind clones | Foco |
|-----------|--------------------|-------------|------|
| **D1 · UX Operacional** | `@ux-design-expert` + `@design-chief` | `don-norman`, `kat-holmes`, `julie-zhuo` | Fluxo do escritório, kanban/dashboard denso, portal do cliente, design inclusivo, hábito de uso mensal |

**Decisões autônomas do squad:** padrões de interação, design system, fluxos de tela.
**Exige Council:** mudança estrutural no modelo mental do produto (ex.: trocar kanban por outra metáfora).
**Exige aprovação humana:** nada exclusivo (UX herda gates de Produto/Trust).

> Conteúdo/copy é compartilhado: `joanna-wiebe` e `@copy-chief` vivem em A2 mas atendem D quando há microcopy crítico.

---

## 3. Matriz de direitos de decisão (resumo)

| Tipo de decisão | Quem decide |
|-----------------|-------------|
| Padrões internos de código/design/teste | Squad (autônomo) |
| Backlog de discovery, hipóteses de copy/oferta | Squad A (autônomo) |
| Threat model, exigência de auditoria, vocabulário proibido | Squad C (autônomo + veto) |
| Categoria de mercado, métrica-norte, stack core | **Council** (Orion convoca conclave) |
| Modelo de dados multi-tenant, IA em decisão fiscal | **Council** + parecer C |
| Go/Kill, pivot de ICP, pricing final, contrato piloto | **Humano (founder)** |
| Certificado A1 / procuração / e-CAC / envio fiscal automático | **Humano + veto C obrigatório** |
| Integra Contador / API gov, gasto de infra acima do limite | **Humano** |
| Base legal de novo dado pessoal, texto de responsabilidade | **Humano + Squad C** |

> **Mecânica do "Council" (correção pedro-valerio #3):** "Council" não é votação de clones. Fluxo fixo: (1) Orion convoca conclave; (2) mind clones **aconselham** (CONSENSO/DISSENSO/BLIND SPOTS — nunca decidem, coerente com §0.3); (3) o agente-dono do squad sintetiza uma recomendação única; (4) **o founder ratifica**. Empate ou dissenso forte → decisão sobe direto ao founder. Nenhuma decisão de Council é "fechada" sem ratificação humana registrada.

> **IA nunca decide matéria fiscal (correção pedro-valerio #6):** o sub-squad B3 (IA & Automação) pode **classificar, extrair, sugerir e alertar** — nunca **decidir** enquadramento, apuração ou envio. Toda saída de IA sobre matéria fiscal é apoio com humano na alça (human-in-the-loop). Mudar esse limite = decisão de Council + veto C.

---

## 4. Ordem de ativação por fase

| Fase | Squads ATIVOS | Squads em standby | Saída esperada |
|------|---------------|-------------------|----------------|
| **1. Discovery** | A1 (Discovery), A3 (CS — co-desenha piloto), C2/C3 (escopo mínimo LGPD/risco) | B, D | 10 entrevistas, JTBD, ICP confirmado, kill-criteria, matriz de dores |
| **2. PRD** | A1+A2+A4 (escopo, oferta, pricing v0), C (requisitos de trust no PRD) | B (consultivo), D (consultivo) | PRD v0.1, métricas de sucesso, escopo MVP/fora de escopo, oferta piloto |
| **3. Arquitetura** | B1+B2 (arquitetura + matriz fiscal), C1+C2 (threat model + data map **v0 antes de código**) | A (valida viabilidade), D (esboço de fluxo) | Arquitetura multi-tenant, modelo de dados, threat model v0, data map v0 |
| **4. MVP Concierge** | A3 (CS opera), A1 (discovery contínuo), D1 (fluxos manuais), C (auditoria do manual) | B (mínimo: ferramentas de apoio, planilhas, automação leve) | 3-5 escritórios operando manual, voice-of-customer, validação de demanda |
| **5. MVP SaaS** | B1-B4 (constrói), D1 (UI), C (revisa cada entrega), A4 (unit economics reais) | A1/A2 (alimentam backlog) | Produto multi-tenant, checklist/kanban/portal, dashboards, IA de apoio |
| **6. Go-to-Market** | A2 (posicionamento+oferta), A3 (onboarding em escala), A4 (pricing público) | B (sustenta), C (compliance contínuo), D (otimiza conversão) | Lançamento, motor de aquisição, onboarding repetível, pricing validado |

**Regra de ouro de sequência:** C2/C3 (LGPD + risco) e C1 (threat model) entram **antes** de qualquer código que toque dado de cliente — não depois. Isso já está no plano do conclave (itens 5 e 6 do plano imediato).

> **Gate bloqueante de entrada da Fase 5 (correção pedro-valerio #4):** a Fase 5 (MVP SaaS) **NÃO inicia** enquanto não houver, aprovados e fora de rascunho: (a) threat model assinado por `@cyber-chief`; (b) data map com base legal definida por `@legal-chief`. Não é intenção — é critério de entrada verificável. Dono do gate: co-líderes do Mega C. Um `@dev` que iniciar a Fase 5 sem esses dois artefatos aprovados está fora de conformidade, mesmo com "v0" no nome.

---

## 5. Riscos de ter squads demais + mitigação

| Risco | Sintoma | Mitigação |
|-------|---------|-----------|
| **Overhead de coordenação** | Mais tempo em conclave do que em entrega | Squad só "acorda" na fase em que é dono (ver tabela §4). Em standby = consulta pontual, não reunião. |
| **Diluição de responsabilidade** | "Achei que o outro squad ia fazer" | 1 dono-agente por sub-squad, nomeado. Mind clone nunca é dono. |
| **Conclave-fadiga / paralisia** | Tudo vira "vamos consultar o painel" | Council só para as 3 linhas de decisão cross-squad/irreversível (§3). Resto é autonomia. |
| **Mind clone como muleta** | Decisão simples consome 4 consultas | Triggers de skip já no `mind-clone-auto-consult.md`: edição trivial, git, build, exploração → não consulta. |
| **Custo de tokens** | Mega conclaves caros | Conclave default 3 experts, single-expert para dúvida pontual. HYDRA scoring está bloqueado (Anthropic $0) — usar `self-consultation.js` direto. |
| **Trust virar gargalo** | Engenharia trava esperando parecer | Trust publica requisitos *antes* (na fase Arquitetura), não revisa item a item. Veto é sobre as 4 linhas vermelhas, não sobre tudo. |

**Gatilho duro de ativação de squad (correção pedro-valerio #7):** um squad só "acorda" se **(a)** está na fase em que é dono (tabela §4), **OU (b)** existe uma decisão concreta e documentada que exige o painel dele. Fora desses dois casos = consulta pontual a 1 clone, nunca ativação de squad. Criar squad/sub-squad novo exige aprovação humana explícita. Sem gatilho atendido, não há squad.

**Princípio de governança leve:** *menos squads ativos por vez, donos claros, council raro, veto restrito a linhas vermelhas.*

---

## 6. Duas versões para escolher

### 6.1 🏛️ FULL MEGA SQUAD (aspiracional — fases 3 a 6)
4 Mega Squads, 10 sub-squads, 21 mind clones + 2 tributaristas BR.
Use quando o produto provar demanda e entrar em construção SaaS séria. É o organograma completo acima.

### 6.2 ⚡ LEAN EXECUTION SQUAD (começa AGORA — fases 1 e 2)
3 frentes, 5 agentes-dono, **7 mind clones núcleo** (espelha o conclave já realizado):

| Frente | Dono | Mind clones núcleo | Entrega imediata |
|--------|------|--------------------|------------------|
| **Produto + Mercado** | `@pm` (+`@analyst`) | `marty-cagan`, `teresa-torres`, `april-dunford` | Story 0.1: ICP, oferta piloto, roteiro de 10 entrevistas, matriz de dores, 3 escritórios-alvo |
| **Trust mínimo** | `@legal-chief` (+`@cyber-chief`) | `patricia-peck`, `bruce-schneier` | Data map v0 + threat model v0 (escopo mínimo, antes de código) |
| **Economia + CS** | `@analyst` | `aswath-damodaran`, `lincoln-murphy` | Unit economics v0 + desenho do piloto concierge |

Orquestração: `@aios-master`. Sem `@dev`/`@architect` pesados ainda (concierge é manual). Engenharia, IA, UX, Dados e os demais clones entram conforme a tabela §4 — não antes.

**Por que lean agora:** o veredito do conclave foi *concierge antes de automação*. Time grande na fase 1 é desperdício — a incerteza é de mercado, não de engenharia.

---

## 7. Próximo passo recomendado

Ativar o **Lean Execution Squad** e disparar a **Story 0.1** (já especificada no conclave). Quando 3 escritórios estiverem no piloto concierge e o unit economics fechar, escalar para o Full Mega Squad nas fases 3→5.

Comando sugerido: `@pm *create-doc prd` (PRD v0.1) após fechar Story 0.1 via `@sm`.

— Orion, orquestrando o sistema 🎯
