# PM Roadmap & Business — Buscador Licitações V3

**Agente:** Morgan (aios-pm) — síntese de clones Lemkin / Ries / Cagan / Dunford / Nicolas / Bush
**Data:** 2026-05-18
**Substitui escopo de:** `99-synthesis/BRIEFING-REAL-CONSOLIDADO.md` v2 (4 empresas → 3 empresas)
**Output:** PRD V3 + Roadmap + AIOX + Commercial Model + Risk + Recomendação Go/No-Go

---

## 0. CORREÇÃO DE ESCOPO — IMPACTO

| Dimensão | V2 (errado) | V3 (correto) | Impacto |
|----------|-------------|--------------|---------|
| **# empresas** | 4 (INYAC, INC, CENTINELA, ENHAC) | **3** | Schema mais simples |
| **Empresas que licitam** | 4 (todas) | **1 só** | Anti-conluio cai de CRÍTICO p/ BAIXO |
| **Empresas só gestão financeira** | 0 | **2** | Pipeline 4-5 só serve 1 empresa |
| **Personas lançamento despesa** | 4 (Alice/Giovanna/Gabela/4ªpessoa) | **N (≤3, a confirmar)** | RBAC menos granular |
| **Auto-BP/DRE** | precisava p/ 4 empresas | **1 empresa apenas** (licitante) | Esforço Sprint 4 cai 60% |
| **Persona "Pai" (receita)** | recebimentos de 4 empresas | recebimentos das 3 (genérico) | Mantém |
| **Lei 14.133 art. 14 IV (anti-conluio)** | 🔴 Crítico | 🟢 Soft alert se outra do grupo entrar | Reduz escopo regulatório |

**Síntese:** o produto vira **"livro caixa multi-empresa (3) + suite de licitação verticalizada para 1 delas"**. Mais foco, menos complexidade. Bom sinal — Cagan ("Inspired") recomenda *radicalmente* ir descobrindo o produto antes de entregar.

---

## 1. PRD V3 (revisado)

### 1.1 Posicionamento (April Dunford — already in use, complemento)

**Categoria:** "Sistema operacional financeiro + licitatório para microempresário regional B2G."

**Frase única (substitui v2):**
> **"Holding virtual para microempresário regional: 3 caixas num só lugar + você nunca mais perde edital por CRF vencido nem recurso por preclusão."**

Diferença vs V2: tira "fornecedor B2B licitação" (escopo só de 1 das 3 empresas) e adiciona "microempresário regional" (escopo do amigo todo).

### 1.2 Domain Model V3

```
grupo_economico(id, nome)
empresa(id, grupo_id, cnpj, razao_social, **licita_bool**, regime_tributario, cnae_principal)
  -- licita_bool: TRUE só p/ 1 das 3 empresas (a licitante)
usuario(id, email, nome, role_global)
permissao(id, usuario_id, empresa_id, escopo, can_read, can_write)
  -- escopo: 'receita' | 'despesa' | 'master'
financial_entry(id, empresa_id, data, tipo, valor, conta_contabil_id, ...)
  -- 3 empresas gerando aqui; mas BP/DRE auto-gerado SÓ p/ empresa_licitante
documento, atestado_capacidade, licitacao, oportunidade_match, proposta, recurso, ...
  -- todos com empresa_id = empresa_licitante na v3 (constraint)
```

**Anti-conluio (Lei 14.133 art. 14 IV) — DOWNGRADE:**
- v2: bloqueio hard de proposta dupla via RLS + DB constraint
- **v3: soft alert + log.** Se uma das outras 2 (não-licitantes) for cadastrada no SICAF futuramente e tentar entrar no mesmo edital, sistema avisa antes de submeter. **Não é mais arquitetural** — é warning de UX.

**Pipeline 6 ("outro processo" do áudio 1):** mantém parking lot. Não decidir agora. Discovery call esclarece.

### 1.3 RBAC simplificado

| Persona | Empresa licitante | Empresa 2 (gestão) | Empresa 3 (gestão) |
|---------|-------------------|---------------------|---------------------|
| Cliente (amigo) | master R/W | master R/W | master R/W |
| Pai | receita W | receita W | receita W |
| Pessoa A (despesa #1) | despesa W | – | – |
| Pessoa B (despesa #2) | – | despesa W | – |
| Pessoa C (despesa #3) | – | – | despesa W |
| Contador externo | export only | export only | export only |

(número exato de "pessoas de despesa" depende do que o cliente confirmar na call; 3 é o teto)

### 1.4 Anti-features mantidas (sem alteração)

Lista §7 do v2 continua válida 100%. Reforço: **AF14 ("brand customizado por tenant") fica especialmente firme em v3** — escopo é ainda mais cliente-único.

---

## 2. ROADMAP V3 — 22 semanas, 6 sprints

Mantém a estrutura v2 com ajustes de esforço:

| Sprint | Semanas | Marco | Esforço V3 vs V2 |
|--------|---------|-------|-------------------|
| **0 — Foundation** | 0-1 | M0: Schema 3 empresas + RLS + skeleton | -15% (RLS anti-conluio é soft, não hard) |
| **1 — Caixa Manual** | 2-4 | M1: Pai + ≤3 pessoas usando 7d direto | igual |
| **2 — Open Finance + Vault** | 5-6 | M2: 0 CRF vencido + 70%+ categorizado | -20% (3 CNPJs Pluggy, não 4) |
| **3 — Radar + Análise histórica** | 7-10 | M3: 1 alerta real + 1 relatório histórico (MOAT) | **+10%** (Estágio 2 ANALISAR 6M = MOAT, prioridade subida) |
| **4 — Indicar Diferencial + Habilitação** | 11-14 | M4: 1 dossiê <30min real (MOAT estágio 3+4) | -10% (Auto-BP/DRE só 1 empresa) |
| **5 — Acompanhar + Recurso** | 15-18 | M5: 1 recurso dentro da preclusão | igual |
| **6 — Polish + Pipeline 6** | 19-22 | M6: NPS≥9 + "não voltaria pro manual" | igual |

**Modificação crítica vs v2:** Sprint 3 agora inclui **Estágio 2 "ANALISAR 6M" (MOAT)** explícito — relatório histórico das licitações dos últimos 6 meses do nicho do amigo (CNAE + região). É a fundação dos Estágios 3-5 (indicar diferencial, habilitar, acompanhar). Sem isso, o moat de "AI que conhece o cliente" não existe.

### 2.1 Sprint detalhe (deltas vs v2)

**Sprint 0 (s.0-1) — Foundation**
- Schema 3 empresas + `licita_bool`
- RLS por permissão (RBAC); anti-conluio SOFT (warning)
- Call discovery com cliente (resolve 8+ decisões pendentes)
- Setup Supabase + Vercel + Inngest + Pluggy + Sentry

**Sprint 3 (s.7-10) — MOAT subido**
- Radar PNCP + e-Compras DF + AL (Estágio 1)
- **Análise histórica 6M** (Estágio 2 MOAT): cron mensal extrai TODOS editais do CNAE do cliente nos últimos 6m, calcula taxa-vitória/perfil-vencedor/faixa-de-preço. Sem isso, não tem como "indicar diferencial" (Estágio 3) com fundamento. **Esta é a fundação do moat AIOX-defensável.**

**Sprint 4 (s.11-14) — Indicar Diferencial + Habilitação**
- Estágio 3: gera relatório "**vs concorrentes deste nicho, sua vantagem é X**" — baseado em ACT library + dados do Estágio 2
- Estágio 4: dossiê <30min

### 2.2 Kill gates V3 (mais rigorosos)

| Gate | Hard Kill | Pivot |
|------|-----------|-------|
| Pós-M1 (s.4) | Pai/pessoas não usam diário | Manter caixa, derrubar resto |
| Pós-M2 (s.6) | 1 CRF vence apesar do alarme | Refazer UX alarme |
| Pós-M3 (s.10) | <40% alertas úteis OU análise 6M sem insight | Restringir CNAE/região |
| Pós-M4 (s.14) | Cliente refuse usar dossiê | Tornar só "checklist guiado" |
| Pós-M5 (s.18) | Recurso ignorado | Reduz Pipeline 5 a alert-only |
| Pós-M6 (s.22) | NPS <7 | Reescopar pra Tocks/Bretda |

---

## 3. AIOX FRAMEWORK (Alan Nicolas) — revisitado

### 3.1 D.S.P.C. atualizado

| Letra | V2 | V3 |
|-------|-----|-----|
| **D — Dor** | 4 empresas × R$5-50k/edital × 5-30 editais/mês | **1 empresa × R$5-50k × 5-30 editais/mês = R$25k-1.5M/ano exposição**. Plus tempo refazendo dossiê (15-210h/mês). Para o cliente do amigo, ainda forte. |
| **S — Serviço** | 5 pipelines + 1 TBD | **7 workflows verticais** alinhados ao workflow real: Monitorar (1) + Analisar 6M (2 MOAT) + Indicar Diferencial (3 MOAT) + Habilitar (4) + Acompanhar (5) + Recorrer (6) + Caixa Multi-Empresa (base) |
| **P — Piloto** | Fase 1 Caixa+RBAC 6 semanas | **Igual**: Sprint 0-2 = M0-M2 (Caixa 3 empresas + Vault Compliance ativo). Vitória rápida: 0 CRF vencido em 30d. |
| **C — Continuidade** | uso diário/semanal/mensal | **Igual**: caixa diário + radar semanal + compliance mensal. Diferencial de SaaS one-shot. |

### 3.2 5 portões obrigatórios — status

| Portão | V3 status | Justificativa |
|--------|-----------|---------------|
| 01 Continuidade | ✅ | Uso diário (caixa 3 empresas). Mais forte que SaaS-mensalidade. |
| 02 Dor cara | ✅ | R$5-50k × 5-30 editais/mês na empresa licitante; horas perdidas em 3 empresas no caixa. |
| 03 Retorno 10x | ✅ | 1 CRF preservada = R$5-50k. Auto-BP/DRE = -1 dia/edital. ACT matcher recorrente. |
| 04 Mapa na mão | ✅ | Discovery call entrega diagnóstico. Análise 6M (Estágio 2) entrega mapa permanente. |
| 05 Vitória mês 1 | ✅ | M1 (s.4): 3 dashboards funcionando + pessoas lançando. M2 (s.6): 1 CRF nunca vencido. |

→ **Passa 5/5 mesmo com 3 empresas (não 4).** Escopo menor mas vitórias intactas.

### 3.3 5 atributos Hormozi (filtro)

| Atributo | V3 | Score |
|----------|-----|------|
| **Sticky** | Caixa diário 3 empresas + Radar semanal + Compliance mensal | ✅ Alto |
| **Expensive** | Risco regulatório + tempo + oportunidade preservada | ✅ Médio-Alto |
| **Expansion** | Adicionar empresa nova (já parametrizado), novos CNAEs, novas regiões | ✅ Alto |
| **Air** (fácil de explicar) | "Sistema de 3 caixas + não perde edital nem recurso" | ✅ Alto |
| **Unique** | Análise 6M nichada + ACT matcher + conferência concorrente combinados — concorrentes nacionais não têm | ✅ Alto |

→ **5/5 passa.** Hormozi filter OK.

---

## 4. COMMERCIAL MODEL — DECISÃO B3

### 4.1 Opções

| # | Modelo | Pro | Contra | Score |
|---|--------|-----|--------|-------|
| **A** | 100% grátis Fase 1; decide depois | Zero atrito; AIOX-compliant (case-âncora = ATIVO, não caixa); Lemkin SaaStr "primeiro foque em product-market fit antes de pricing" | Sem signal de willingness-to-pay; risco "amigo não respeita" | ⭐⭐⭐⭐ |
| **B** | Piloto pago R$200-500/mês desde já | Recupera Pluggy (~R$50/mês 3 CNPJs); pricing signal; Lemkin "cobre algo mesmo barato p/ qualificar" | Atrito; pode quebrar relação; Ries "pivot caro se for não" | ⭐⭐⭐ |
| **C** | Revenue share (% editais ganhos) | Alinha incentivo; sem atrito inicial | Difícil mensurar atribuição; conflito ético (sistema empurra apostas?); contabilmente complexo | ⭐⭐ |
| **D** | Case-âncora grátis + 3 indicados pagantes R$300-500/mês | Hibridiza A+B; case grátis vira marketing; indicados validam pricing | Indicados só vêm DEPOIS de M4-M5 demonstrados (mês 4+); risco de não materializar | ⭐⭐⭐⭐⭐ |

### 4.2 Recomendação — **Opção D (case-âncora grátis + indicados pagantes mês 4+)**

**Por quê (sintetizando clones):**

- **Lemkin (SaaStr):** "Primeiro cliente B2B sub-$1k MRR não pagante é OK se ele entrega 2 coisas: feedback brutal + 3 referências warm em <6 meses." → amigo grátis com obrigação social de indicar.
- **Ries (Lean):** Build-measure-learn precisa de measure REAL. Case grátis Fase 1 (M0-M2) é build/measure. Cobrar de indicados Fase 2 (M4+) é learn (willingness-to-pay validado externamente). Se nenhum indicado paga, **kill signal forte**.
- **Hormozi (via AIOX):** "Premium é o loop de revisão, não primeira entrega." → case-âncora grátis NÃO é commodity grátis — é parceria com revisão+treinamento incluídos.
- **Cagan (Inspired):** "Product risk: viable" — pricing é parte da viabilidade. Validar willingness-to-pay com indicados é o teste real de viable.
- **Bush (PLG):** PLG não se aplica aqui (não é self-service v1). Mas o princípio "produto se vende via uso" se aplica: M3-M5 entregando valor mensurável **vira o pitch** pros indicados.
- **Nicolas (AIOX):** "Primeiro case = ATIVO" + "primeiro entrega resultado, depois pede testemunho/pagamento" — case-âncora grátis é alinhado com AIOX literalmente.

**Pricing dos indicados (modelo, validar):** R$397/mês — abaixo do R$500 (threshold de "decisão facil microempresário" pelo livro Hormozi) + acima de R$300 (recupera Pluggy + LLM + tempo Breno).

### 4.3 Trigger de cobrança

- **Sprint 4 fim (s.14, M4):** dossiê <30min funcionando = **gatilho pra pedir 3 indicações ao amigo**.
- **Sprint 6 fim (s.22, M6):** se 3 indicados convertidos em R$397/mês → **product-market fit indicado, escala para V2**. Se 0 indicados → **kill ou pivot pra SaaS Breno-pessoal**.

---

## 5. POSICIONAMENTO LONGO PRAZO

| Versão | Quando | Estado | Métrica chave |
|--------|--------|--------|----------------|
| **V1** | Mês 6 (s.22) | 1 cliente-âncora (amigo) operando estável | NPS ≥9; "não voltaria pro manual" |
| **V2** | Mês 12 | 3-5 indicados DF/Centro-Oeste pagando R$397/mês | MRR ≥ R$1.2k; CAC < R$0 (referral); churn 0 |
| **V3** | Mês 18 | SaaS B2B microempresário regional formalizado | 10-15 clientes; MRR ≥ R$4k-6k |
| **V4** | Mês 36+ | Expansão vertical (cartórios? consultórios? outros B2G regional?) | A decidir conforme dados v3 |

**Kill condition firme:** se V2 não chegar a **3 clientes pagantes** até mês 12 → kill. Tempo Breno volta pra Tocks/Bretda/Anipis.

**Por que kill agressivo?** Lemkin: "Em B2B sub-$500 ARR, se você não tem 3 referências pagantes em 12m após product, o produto não tem fit ou o pricing tá errado — não persiste sem dados."

---

## 6. KPIs POR SPRINT

| Sprint | Marco | KPI Primário | Target | Falsificação |
|--------|-------|---------------|--------|--------------|
| 1 | M1 | % dias com ≥5 lançamentos em ≥2 empresas | 80% | <50% → kill |
| 2 | M2 | Dias sem CRF vencido | 100% | 1 CRF venceu apesar do alarme → quebra confiança, refazer UX |
| 3 | M3 | Alertas entregues × % "úteis" (cliente confirma) | ≥1 alerta/sem; ≥60% úteis | <40% → filtros errados, pivot |
| 4 | M4 | Dossiês compilados em <30min reais | ≥1 enviado em licitação real | 0 → cliente não confia, kill ou simplifica pra checklist |
| 5 | M5 | Recursos manifestados dentro do prazo | 100% dos casos onde score>5 | 1 perdido → SLA P5 quebrou |
| 6 | M6 | NPS + "voltaria pro manual?" | NPS ≥9; "não voltaria" | NPS <7 → escopar p/ Tocks/Bretda |

**KPIs secundários por sprint** (não exaustivo):
- Sprint 1: tempo médio classificação (<10s); % entries com categoria contábil (≥90%)
- Sprint 2: cobertura Pluggy (% transações importadas vs total real)
- Sprint 3: precisão match anti-conluio (0 falsos positivos travando o cliente)
- Sprint 4: % ACTs no library que matcham edital real do amigo
- Sprint 5: tempo Pipeline 5 (<3min após vencedor declarado, SLA hard)

---

## 7. RISK REGISTER REVISTO (§8 v2 atualizado)

| # | Risco | V2 Severidade | V3 Severidade | Mudança |
|---|-------|---------------|---------------|---------|
| R1 | Anti-conluio Lei 14.133 art. 14 IV | 🔴 CRÍTICO | 🟢 BAIXO | **Cai**. Só 1 empresa licita. Vira soft warning se outra entrar no SICAF futuramente. |
| R2 | Preclusão imediata recurso | 🔴 CRÍTICO | 🔴 CRÍTICO | igual. Pipeline 5 SLA <3min mantém. |
| R3 | PDF parsing variável | 🟠 ALTO | 🟠 ALTO | igual. |
| R4 | Categoria contábil mal feita quebra Auto-BP/DRE | 🟠 ALTO | 🟡 MÉDIO | **Cai**. Só p/ empresa licitante. |
| R5 | Solo dev + 3 projetos paralelos | 🟠 ALTO | 🔴 **ALTO+** | **Sobe.** Tocks/Bretda/Anipis ativos (Anipis P0 hotfix sprint até 30/Mai, CRM-Novo Week 0). Capacidade 10-20h/sem = 6 sprints provavelmente vira 8-10 sprints reais. |
| R6 | Pipeline 6 muda arquitetura tardia | 🟡 MÉDIO | 🟡 MÉDIO | igual. |
| R7 | Cliente abandona uso após M1 | 🟡 MÉDIO | 🟡 MÉDIO | igual. |
| R8 | Concorrente nacional reage | 🟢 BAIXO | 🟢 BAIXO | igual. |
| R9 | Pluggy mudança política | 🟢 BAIXO | 🟢 BAIXO | igual. |
| R10 | Receita/PGFN APIs caem | 🟡 MÉDIO | 🟡 MÉDIO | igual. |
| **R-NOVO 11** | Dependência continuidade PNCP API — schema muda → MOAT Estágio 2 trava | – | 🟠 **ALTO** | **Novo**. Estágio 2 (Analisar 6M) é fundação do moat. Se PNCP API depreciada ou schema muda, todo Estágio 3-5 vira lixo. **Mitigação:** cache local + parser tolerante + monitor de schema. |
| **R-NOVO 12** | Jurisprudência TCU muda regras de habilitação | – | 🟡 MÉDIO | **Novo**. Sistema gera Auto-BP/DRE com índices LG/LC/SG calculados. Se TCU mudar fórmula ou exigência, sistema desatualizado vira risco jurídico ao cliente. **Mitigação:** disclaimer no UI + cron mensal monitora acórdãos relevantes + revisão humana mantida obrigatória pré-envio. |
| **R-NOVO 13** | Willingness-to-pay dos indicados não materializa | – | 🟠 **ALTO** | **Novo**. Modelo comercial D depende de 3 indicados pagantes em mês 4-6 pra validar V2. Se amigo não indica OU indicados rejeitam pricing → fica em V1 isolado, sem upside. **Mitigação:** mês 4 = pedir indicações formalmente; mês 6 = se 0 indicados → kill ou pivot SaaS pessoal Breno. |

---

## 8. DECISÕES PENDENTES PRÉ-CALL DISCOVERY (lista final)

V2 listava 8 decisões. V3 atualiza:

### Resolvidas pelo V3 (saem da lista)
- ~~B2 Cliente único vs SaaS futuro~~ → V3 define: V1 cliente-único, V2 indicados, V3 SaaS regional, V4 multi-vertical
- ~~B3 Cobrar amigo~~ → V3 define: Opção D (grátis Fase 1, indicados R$397/mês mês 4+)
- ~~B4 Anti-conluio P0~~ → V3 downgrade pra soft warning
- ~~B5 Stack confirmada~~ → mantém Next.js+Supabase+Inngest+Pluggy

### Permanecem pendentes (perguntar na call)
1. **C1 — Regime tributário das 3 empresas** (Simples/Presumido/Real)?
2. **C2 — Faturamento anual** de cada uma?
3. **C3 — ERP/contador atual** das 3 (impacta integração export OFX/CSV)
4. **C4 — Histórico licitação 12m da empresa licitante** (volume + taxa vitória → benchmark M3-M5)
5. **C5 — Coligação real** (mesmo controlador entre as 3)? Impacta anti-conluio soft warning
6. **C7 — O que é o "outro processo" do áudio 1?** (Pipeline 6 scope)

**6 perguntas finais para call (aprovar com analyst):**
- Q1: Quais as 3 razões sociais + CNPJs (confirmar quem licita)?
- Q2: Quem da família/equipe lança o que em cada empresa? (RBAC final)
- Q3: Volume mensal de editais que você participa hoje? Taxa de vitória?
- Q4: Última vez que perdeu edital por CRF/CND vencida? Quanto valia?
- Q5: O "outro processo" do áudio 1 é interno operacional ou comercial?
- Q6: Topa ser case-âncora grátis em troca de indicar 3 conhecidos quando o sistema "matar a saudade do manual"?

---

## 9. STAKEHOLDERS — concordância antes Sprint 0

| Stakeholder | Papel | Approval needed | Forma |
|-------------|-------|------------------|------|
| **Breno** | Dev + dono | Vai/Não vai | Decisão pessoal pós-leitura deste doc |
| **Amigo cliente** | Case-âncora | Aceitar Opção D (grátis + indicar 3) | Call discovery |
| **Pai** (lançador receita) | Usuário | Topar usar PWA mobile diariamente | Cliente apresenta |
| **N pessoas (despesa, ≤3)** | Usuárias | Topar usar PWA mobile diariamente | Cliente apresenta |
| **Contador externo das 3** | Auditor mensal | Aceitar export OFX/CSV mensal (sem precisar mudar fluxo) | Email cliente após M2 |
| **Advogado** | Compliance | Só se V2 cobrar de indicados → contrato SaaS B2B sub-$500 ARR + DPA LGPD | Mês 4 pré-cobrança |

---

## 10. RECOMENDAÇÃO FINAL (se eu fosse o Breno)

### Vai?

**SIM — sob 5 condições.** Caso contrário, NO-GO.

#### Condições para Go

1. **Call discovery executada em ≤7 dias** (idealmente ≤3). Sem isso, Sprint 0 é especulação.
2. **Amigo aceita Opção D explicitamente** (grátis fase 1 + obrigação social de indicar 3 quando M4-M5 entregar).
3. **Capacidade real Breno ≥12h/sem confirmada** durante Tocks 30d operação + Anipis P0 hotfix sprint até 30/Mai + CRM-Novo Week 0. Se <8h/sem real, ADIA 4-6 semanas até janela.
4. **Sprint 0 entrega Schema validado em ≤1 semana** (data-engineer + architect). Se M0 escorrega → red flag.
5. **Kill gate firme pós-M3 (s.10):** se análise 6M (MOAT Estágio 2) não gerar 1 insight acionável real, kill ou pivot.

#### Por que vale a pena (justificativa)

- **AIOX 5/5 portões + Hormozi 5/5 atributos** confirmam o produto teoricamente. Não é fantasia.
- **Caso-âncora real + dor quantificada** (5-30 editais/mês × R$5-50k) — não é cold market.
- **Stack reutilizada** (CRM-Novo = Next.js+Supabase+Inngest+Pluggy) — custo de aprendizado ≈ 0.
- **Custo operacional baixo** (R$0-200/mês fase 1) — não competes com Tocks/Bretda por budget.
- **Opcionalidade V3 (SaaS regional)** — se M6 + V2 entregarem, abre vertical microempresário regional defensável. Se não entregar, kill barato (sunk cost ≈ 22 sem × 12h = 264h Breno).

#### Próxima ação SE Go

1. **Hoje (18/Mai):** Breno lê este doc + briefing v3 (este + analyst + architect + data-engineer + ux-design-expert).
2. **D+1 (19/Mai):** Breno agenda call discovery com amigo (45min, presencial preferível). Envia as 6 perguntas antecipadamente.
3. **D+3-7:** Call executada. 6 perguntas respondidas + Opção D confirmada com amigo.
4. **D+7-10:** Breno dispara `vai com sprint 0 buscador` no Orion. Squad Sprint 0: @data-engineer + @architect + @po (1 semana).
5. **D+14:** M0 (schema + RLS + skeleton) validado. Sprint 1 começa.

#### Próxima ação SE No-Go

1. **Hoje:** Breno arquiva pasta `docs/projects/buscador-licitacoes/` como `99-archived/`.
2. **D+1:** Breno responde ao amigo: "decidi não tocar agora — capacidade Tocks/Bretda/Anipis tomando 100%. Reavalio em Ago/2026 se ainda fizer sentido pra você."
3. **D+1:** Tempo Breno volta a Tocks 30d operação + Anipis Sprint 2 + Bretda full-day workflow.

---

## 11. SÍNTESE FINAL DE CLONES

| Clone | Verdict |
|-------|---------|
| **Ries (Lean)** | Vai. MVP = M1 (caixa) → M2 (compliance) é build-measure-learn perfeito. Pivot/persevere claro pós-M3. |
| **Lemkin (SaaStr)** | Vai sob Opção D. Sub-$500 ARR B2B precisa de 3 referências pagantes em 12m ou kill. |
| **Cagan (Inspired)** | Vai com cautela. Product risk OK (5/5 AIOX); viability risk depende de Opção D materializar. |
| **Dunford** | Vai. Categoria clara ("Sistema operacional para microempresário regional B2G") + diferenciação defensável (análise 6M nichada). |
| **Nicolas (AIOX)** | Vai. 5/5 portões; case-âncora = ATIVO; vitória mês 1 mensurável; premium = loop de revisão respeitado. |
| **Bush (PLG)** | Não-aplicável v1 (cliente único). Aplica em V3 (SaaS regional). |

**Verdict agregado:** **GO condicional — confirmar 5 condições; senão NO-GO sem dó.**

---

*Morgan (aios-pm) — 2026-05-18 — `05-pm-roadmap-business.md`*
*Síntese de Ries / Lemkin / Cagan / Dunford / Nicolas / Bush*
*Substitui §0-12 do v2 quanto a escopo (3 empresas vs 4); preserva §14 AIOX e §3-4 arquitetura técnica*
