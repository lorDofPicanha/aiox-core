# Feature Research #06 — Gestão de Escritório Contábil / Obrigações Acessórias

> **Objetivo:** definir o conjunto MÍNIMO de funções que o módulo de Gestão (app `radar-fiscal`, herdado "Gestorize") precisa ter pra competir em **gestão de escritório contábil / obrigações acessórias** (agenda de vencimentos, guias, entrega de documentos com log, certidões por tipo de empresa, portal do cliente).
> **Atlas (AIOS Analyst) · 2026-06-22 · fontes PRIMÁRIAS reais (URLs no fim).**
> **Escopo:** módulo #7 do doc 05 (Gestão/Obrigações). NÃO é o core fiscal (captura/auditoria/e-CAC/emissor — vide docs 12 e 13). Aqui o jogo é **paridade operacional**, não diferenciação. ESTENDE o doc `06-comparativo-gestor-concorrentes.md` (matriz herdada Gestorize × 8) com pricing/URL real e granularidade de função.
> **Confiança:** ALTA nas funções e pricing transparente (GClick/Confi/MakroSystem/Nibo); MÉDIA onde o vendor é opaco (Acessórias/Questor/Fortes/Domínio/Onvio/SCI) — marcado "n/v" (não verificado em fonte primária) quando o site não publica.

---

## 0. TL;DR — table-stakes vs gap (leia isto)

**TABLE STAKES (sem isto não entra na conversa — TODO concorrente sério tem):**
1. **Agenda de obrigações com motor de regra de data** que antecipa/posterga conforme feriado e fim de semana, **por tributo** (a regra NÃO é uniforme — ver §3.1).
2. **Cadastro de cliente com regime** (MEI/Simples/Presumido/Real) que **deriva automaticamente o calendário de obrigações** daquele regime.
3. **Envio de guias e documentos ao cliente** + **portal do cliente** (web) onde ele baixa.
4. **Log/comprovante de leitura** (data/hora/responsável/status) — registro auditável.
5. **Kanban/tarefas por colaborador/departamento + dashboard de pendências e SLA**.
6. **WhatsApp** como canal de entrega/cobrança (deixou de ser diferencial; virou paridade em 2025-26).
7. **Controle de certidões/alvarás com data de validade e alerta de vencimento**.
8. **Cobrança automática de documento faltante** (lembrete recorrente).

**DIFERENCIAL (poucos têm; onde dá pra ganhar a paridade-plus):**
- **Health score "cliente em risco"** que cruza pendência operacional com **situação fiscal real do e-CAC** (só nós, porque temos o core fiscal ao lado — vide §6).
- **Preço transparente** (a maioria dos incumbentes é opaca — fosso de GTM aberto, doc 12).
- **Antecipação/postergação por tributo com base feriado MUNICIPAL** (não só nacional) — quase ninguém faz direito.
- **App mobile nativo do cliente** (Nibo/Onvio têm; muitos só têm web).

**O GAP do `radar-fiscal` hoje (§5):** ele só faz 2 das 8 table-stakes (agenda básica sem regra de feriado + kanban/SLA). Falta TUDO de documento/guia/portal/log/certidão/WhatsApp/honorários + regimes (só tem MEI/Simples; falta Presumido/Real) + persistência (é seed em memória, sem DB/auth). É um **protótipo de visualização**, não um sistema de gestão.

---

## 1. Concorrentes reais (nome + URL)

### Mercado A — Gestão de obrigações / produtividade do escritório (alvo deste doc)
| Concorrente | URL | Pricing | Posicionamento |
|---|---|---|---|
| **Acessórias** | https://acessorias.com/site/ | n/v (opaco; demo) | Líder em **comunicação/entrega** (Komunic WhatsApp + log de leitura + GED + cobrança recorrente) |
| **Questor Tareffa** (Ottimizza) | https://www.questor.com.br/tareffa/ · https://ottimizza.com.br/ | n/v (opaco) | Agenda + baixa automática + comunicação ao cliente; ecossistema Questor (CND/+2.000 certidões — doc 12) |
| **Domínio / Onvio** (Thomson Reuters) | https://www.dominiosistemas.com.br/solucoes/dominio-one/ · https://apps.apple.com/br/app/onvio-client-center/id1050812390 | n/v (opaco) | Incumbente (~35k escritórios). Calendário contábil + CND automática + app cliente (Onvio Client Center) |
| **Nibo** (Contador) | https://www.nibo.com.br/contador · https://www.nibo.com.br/contador/funcionalidades/obrigacoes | **R$99–299/mês por empresa** (faixa por volume) | Obrigações + recálculo DAS/DARF + portal + app cliente (Nibo Empresa) + WhatsApp + Open Finance |
| **Fortes** (Fortes Atende/Pessoal) | https://www.fortestecnologia.com.br/gestao-contabil/ | n/v (opaco) | **Melhor agenda de obrigações** com antecipação sábado/feriado configurável + Analisador Fiscal (doc 12) |
| **Confi** | https://confi.net.br/ · https://confi.net.br/precos/ | **R$250/mês** (tarefas) · **R$500/mês** (tarefas + WhatsApp/IA) | +400 tarefas com atualização legal automática; WhatsApp com IA nativa |
| **G-Click** (Omie.G-Click) | https://www.omie.com.br/gclick/ · https://store.omie.com.br/apps/omie-g-click | Transparente (faixa por usuário — doc 12: ~R$100 + R$50/usuário); confirmar valor atual em fonte | Agenda inteligente + portal "Minhas Solicitações" + validação automática de arquivo + log de leitura |
| **MakroSystem** | https://makrosystem.com.br/nossos-planos/ | **Gratuito** (1 lic/3 empresas/1.000 notas) · **Light R$195/mês** | Sistema contábil completo (Fiscal/Pessoal/Contábil) + 130 rotinas + Reinf/eSocial/SPED |
| **SCI** | (site institucional; n/v de planos) | n/v (opaco) | Suíte contábil tradicional regional |
| **Arquivei / Qive** | https://qive.com.br/escritorios-contabeis/ | n/v (faixa por documento; doc 1: desde ~R$39,90) | Pivotou pra **Contas a Pagar/captura+ERP**. NÃO é mais gestão de obrigações pura — é captura/financeiro |
| **TaskDo** | (LP de produto; n/v de planos) | n/v (opaco) | **Kanban nativo + Painel Societário** (raro) — doc 12 |
| **Neo Controle** | (vide doc 12) | Transparente **R$76–881** por faixa CNPJ | e-CAC via API SERPRO + **alerta de procuração vencida** (mais pra mercado e-CAC) |
| **GestãoClick** | https://gestaoclick.com.br/gestao-de-escritorio-contabil/ | n/v | ERP de gestão genérico adaptado a escritório (cuidado: nome parecido, produto diferente do G-Click/Omie) |

> ⚠️ **Não confundir:** "G-Click" (Omie, gestão de tarefas contábeis) ≠ "GestãoClick" (ERP genérico) — são empresas/produtos diferentes.
> **Arquivei/Qive saiu da categoria** "gestão de obrigações" → hoje é captura fiscal + Contas a Pagar conectado a ERP. Relevante pro **core (captura)**, não pro módulo Gestão. (URL confirma reposicionamento: "a plataforma que redefine o Contas a Pagar".)

---

## 2. Matriz funções × concorrente

Legenda: ✅ tem (confirmado em fonte primária) · 🟡 parcial / indireto · ⬜ não encontrado / n/v · ➖ fora do escopo do produto

| Função | Acessórias | Questor/Tareffa | Domínio/Onvio | Nibo | Fortes | Confi | G-Click | Makro | **radar-fiscal (hoje)** |
|---|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| **Agenda de obrigações (calendário por cliente)** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 🟡 (4 obrig. fixas) |
| **Regra de data: antecipa/posterga feriado/fim-de-semana** | ✅ | ✅ | 🟡 | 🟡 | ✅ (config. sáb/feriado) | ✅ (atualização legal) | 🟡 | 🟡 | ⬜ |
| **Calendário derivado do REGIME (MEI/Simples/Presumido/Real)** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 🟡 (só MEI+Simples) |
| **Envio de guias (DAS/DARF) ao cliente** | ✅ | ✅ | ✅ (publicação de guias) | ✅ (+recálculo DAS/DARF) | ✅ | ✅ | ✅ | ✅ | ⬜ |
| **Entrega de documento + portal do cliente (web)** | ✅ (GED) | ✅ | ✅ (Onvio Client Center) | ✅ | ✅ | ✅ | ✅ ("Minhas Solicitações") | ✅ | ⬜ |
| **Log/comprovante de leitura (data/hora/IP/responsável)** | ✅ (Komunic: confirmação leitura + histórico auditável) | ✅ (doc 12) | 🟡 (registro histórico) | 🟡 (status em tempo real) | ⬜ | 🟡 | ✅ (comprovante de abertura + reenvio) | ⬜ | ⬜ |
| **Controle de certidões/alvará + validade + alerta** | 🟡 (via CND no fluxo) | ✅ (+2.000 certidões — doc 12) | ✅ (CND automática Onvio) | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| **Certidão/regra por TIPO de empresa (MEI/Simples/Presumido/Real)** | 🟡 | 🟡 | 🟡 | ⬜ | 🟡 | ⬜ | ⬜ | ⬜ | ⬜ |
| **Portal/app mobile do cliente** | 🟡 (WhatsApp como "app") | 🟡 (app — doc 12) | ✅ (Onvio Client Center iOS/Android) | ✅ (Nibo Empresa app) | ⬜ | ⬜ | 🟡 | ⬜ | ⬜ |
| **WhatsApp oficial (entrega/cobrança)** | ✅ (Komunic) | ✅ (doc 12) | ⬜ | ✅ (+IA) | ⬜ | ✅ (+IA nativa) | 🟡 | ⬜ | ⬜ |
| **Cobrança automática de documento faltante** | ✅ (lembretes recorrentes) | ✅ | 🟡 | ✅ (formulários + notificação) | ⬜ | ✅ | ✅ (reenvio automático) | ⬜ | 🟡 (flag docRecebido) |
| **Gestão de honorários / financeiro do escritório** | ⬜ | 🟡 | ✅ (Domínio Cobranças) | ✅ (BPO financeiro/Open Finance) | 🟡 | ⬜ | ⬜ | 🟡 | ⬜ |
| **Tarefas/Kanban por colaborador/departamento + SLA** | ✅ | ✅ | ✅ (pendências por depto/cliente) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Dashboard gerencial / indicadores** | ✅ | ✅ | ✅ (dashboards/calendário impostos) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ (KPIs + SLA) |
| **Integração ERP/sistema contábil** | ✅ (integrações) | ✅ (ecossistema Questor) | ✅ (suíte própria) | ✅ (Open Finance + apps) | ✅ (integra G-Click) | 🟡 | ✅ (Omie + Fortes) | ✅ (suíte própria) | ⬜ |
| **Baixa automática de tarefa por leitura de recibo/arquivo** | ✅ | ✅ (baixa automática) | 🟡 | ✅ (robô leitura) | 🟡 | ✅ | ✅ (validação de arquivo) | 🟡 | ⬜ |
| **Preço transparente publicado** | ⬜ | ⬜ | ⬜ | ✅ (R$99–299) | ⬜ | ✅ (R$250/R$500) | ✅ | ✅ (grátis/R$195) | n/a |

> Onde marquei ⬜ "Acessórias honorários" / "Nibo certidões" etc. = a fonte primária consultada NÃO listou explicitamente; pode existir e não estar na página vista. Tratar como "não verificado", não como "não existe".

---

## 3. Detalhamento das funções críticas (com nuance que mata implementação ingênua)

### 3.1 Motor de regra de data da agenda — a parte que parece trivial e não é
**A regra NÃO é uniforme entre tributos.** Implementar "se cai no fim de semana, joga pro próximo dia útil" pra tudo está ERRADO e gera multa.
- **DAS-MEI / DAS-Simples (PGDAS-D):** vence dia 20; se cair em fim de semana/feriado → **PRORROGA para o 1º dia útil SEGUINTE**. (fonte: agenda Receita/PGDAS-D)
- **Tributos federais com retenção / certos vencimentos:** se o dia não é útil → **ANTECIPA para o 1º dia útil ANTERIOR** (legislação federal de retenção). 
- ⇒ o motor precisa de um campo por obrigação: `ajusteDiaNaoUtil = "antecipa" | "posterga" | "nenhum"` + **tabela de feriados** (nacional + estadual + **municipal**, porque ISS/obrigações municipais seguem feriado local).
- **Fortes** é o benchmark citado (doc 12): antecipação sábado/feriado **configurável** por obrigação. **Confi** entrega via "atualização legal automática" das +400 tarefas (o vendor mantém a regra atualizada — isso é o que o escritório quer: não pensar nisso).
- **Implicação pro `radar-fiscal`:** hoje ele tem `diaVencimento`/`offsetMeses` mas **zero tratamento de dia não-útil** e **zero tabela de feriado**. É o gap #1 (table-stake violada — gera vencimento errado).

### 3.2 Entrega de documento + log de leitura — o que "auditável" significa de fato
**Acessórias/Komunic** define o padrão a copiar (fonte primária confirmou textualmente):
- documento entregue no WhatsApp do cliente **com confirmação de leitura**;
- **registro automático de data, hora, responsável e status**;
- **histórico completo e acessível** de todas as interações (data/hora/responsável/status, salvo automaticamente).
- **G-Click** acrescenta: **comprovante de abertura** + **reenvio automático** se não abriu.
- ⇒ table-stake = entrega + recibo de leitura com timestamp/responsável + histórico imutável. (O "IP" que pedi não é explicitamente publicado por todos; data/hora/responsável/status é o padrão de fato.)

### 3.3 Controle de certidões/alvará por tipo de empresa
- **Questor** (ecossistema): **+2.000 certidões** + CND (doc 12). **Onvio**: emissão automática de CND, download e compartilhamento. 
- A CND-PJ tem **validade de 180 dias** (fonte primária) → o sistema precisa: armazenar a certidão, **data de emissão + data de validade**, **alertar antes de vencer**, e **reemitir** quando possível.
- "Por tipo de empresa" = quais certidões cada regime/atividade precisa (MEI tem menos; Lucro Real + atividade regulada precisa de alvará sanitário, CND trabalhista, FGTS, estadual, municipal…). Hoje ninguém publica uma **matriz certidão × regime** clara — pequeno whitespace de UX.

### 3.4 Portal/app do cliente
- **Onvio Client Center** (iOS/Android) e **Nibo Empresa** (Google Play) são os apps nativos de referência. Cliente: recebe/envia documento, é notificado de pagamento, solicita serviço.
- Padrão mínimo do portal web: cliente loga, vê suas guias/documentos, baixa, é notificado, sobe documento solicitado. App mobile é **diferencial** (não table-stake — web responsivo basta pra entrar).

### 3.5 WhatsApp
- Virou paridade: Acessórias (Komunic), Nibo (+IA), Confi (+IA nativa) já entregam. Em 2026 **não ter WhatsApp = desvantagem**. **Confi precifica explicitamente** o módulo WhatsApp/IA como upsell (R$250 → R$500). ⇒ modelar como add-on faz sentido comercialmente.

---

## 4. TABLE STAKES vs DIFERENCIAIS (consolidado)

### TABLE STAKES (obrigatório pra competir — construir/herdar do Gestorize)
1. Agenda de obrigações **por cliente, derivada do regime**, com **motor de ajuste de dia não-útil por tributo** (antecipa/posterga + feriado nac/est/mun). ← **maior gap de engenharia**
2. Cadastro cliente com regime **MEI/Simples/Presumido/Real** (hoje só 2 dos 4).
3. Envio de guias + documentos ao cliente.
4. Portal do cliente (web) + **log de leitura auditável** (data/hora/responsável/status + histórico).
5. Kanban/tarefas por colaborador/departamento + dashboard de pendências/SLA. ← **único que radar-fiscal já tem**
6. WhatsApp como canal de entrega/cobrança.
7. Controle de certidões/alvará com validade + alerta de vencimento.
8. Cobrança automática de documento faltante (lembrete + reenvio).
9. Persistência real (DB multi-tenant + auth + RLS por escritório) — pré-requisito de tudo.

### DIFERENCIAIS (onde ganhar acima da paridade)
- **D1 — Health score "cliente em risco" cruzando pendência operacional × situação fiscal real do e-CAC** (caixa postal/CND/situação). **Só nós** podemos, porque o core fiscal está ao lado. Os players de gestão (Nibo/Confi/G-Click) **não têm** e-CAC forte; os de e-CAC (Neo) não têm a gestão. ← **o diferencial #1 do módulo Gestão**.
- **D2 — Preço transparente** publicado na landing (fosso de GTM: Acessórias/Questor/Fortes/Domínio são opacos; só Nibo/Confi/G-Click/Makro publicam).
- **D3 — Antecipação por feriado MUNICIPAL** (ISS), não só nacional — quase ninguém trata bem.
- **D4 — Matriz certidão × regime/atividade** como UX guiada (qual certidão cada cliente precisa).
- **D5 — App mobile nativo do cliente** (paridade com Onvio/Nibo; fase 2, não bloqueia entrada).

> **Alinhamento estratégico (CONTEXT §5/§6):** este módulo é **paridade**, não o moat. O moat é a auditoria defensável da Reforma (core). Gestão = a "fundação operacional" pronta (Gestorize, 23 features) que segura o cliente no dia a dia enquanto o core diferencia. **NÃO sobre-investir em gestão** — só fechar as 9 table-stakes + plugar D1 (que reusa o e-CAC já planejado).

---

## 5. radar-fiscal HOJE vs GAP

**O que tem hoje** (`apps/radar-fiscal`, Next 15, sem DB — seed em memória, :3007):
- 3 páginas: dashboard, clientes, obrigações.
- Domínio: `Escritorio/Usuario/Cliente/Obrigacao/Tarefa` com multi-tenant **modelado** (`escritorioId`) mas **não persistido** (arrays em `lib/data.ts`).
- Regimes: **só MEI e SIMPLES** (`type Regime = "MEI" | "SIMPLES"`).
- 4 obrigações: DAS-MEI, DASN-SIMEI, DAS-SN, DEFIS (`lib/obligations.ts`).
- Agenda: `diaVencimento`/`mesVencimento`/`offsetMeses` — **sem ajuste de dia não-útil, sem feriados**.
- Kanban: 6 status (`a_fazer / pendente_cliente / pendente_contador / em_revisao / entregue / risco`).
- Dashboard KPIs: total clientes, pendências vencidas, clientes em risco, documentos faltantes, entregues/ciclo.
- SLA por responsável + lista "clientes em risco" ordenada por dias de atraso.
- Linha vermelha declarada no código (comentário Trust C3): **"rastreia EXISTÊNCIA e PRAZO. NUNCA calcula imposto/apuração/crédito"** — coerente com a separação Gestão vs Core.

**GAP (o que falta vs as 9 table-stakes):**
| # | Table-stake | radar-fiscal | Esforço |
|---|---|:--:|---|
| 1 | Motor ajuste dia não-útil + feriados (nac/est/mun) por tributo | ❌ | **ALTO** (regra por obrigação + base de feriados + por município) |
| 2 | Regimes Presumido + Real | ❌ (só MEI/Simples) | MÉDIO (estende type + matriz de obrigações; mais obrigações por regime) |
| 3 | Envio de guias/documentos | ❌ | MÉDIO (upload + storage + envio) |
| 4 | Portal cliente + log de leitura auditável | ❌ | **ALTO** (auth cliente + storage + trilha leitura) |
| 5 | Kanban/SLA/dashboard | ✅ (existe) | — (polir) |
| 6 | WhatsApp entrega/cobrança | ❌ | MÉDIO (provider WhatsApp Cloud API oficial — NÃO não-oficial) |
| 7 | Certidões/alvará + validade + alerta | ❌ | MÉDIO (entidade + cron de alerta; emissão automática = ALTO, fase 2) |
| 8 | Cobrança automática de doc faltante | 🟡 (só flag `documentoRecebido`) | MÉDIO (lembrete recorrente + reenvio) |
| 9 | Persistência (Postgres/Supabase + auth + RLS) | ❌ (seed em memória) | **ALTO** — pré-requisito de 3/4/6/7/8 |

> **Decisão de CONTEXT (D1):** o módulo Gestão **estende o Gestorize React Web** (23 features maduras, incl. regra de antecipação, log de leitura, certidões por tipo) — NÃO reconstruir do zero a partir do radar-fiscal. O radar-fiscal vira **a UI/protótipo de visualização** (kanban/dashboard/SLA já prontos e bons); a substância (1,3,4,6,7,8 + persistência) **vem do Gestorize**, condicionado a confirmar acesso ao código-fonte deployável (CONTEXT §8.5 — pendência aberta).

---

## 6. Recomendação (table-stakes + gap, conforme pedido)

**Table-stakes do módulo de Gestão pra competir (mínimo viável):** as 9 da §4. Sem as 9, perde de Nibo/Confi/Acessórias no comparativo de feature do Renan. As 5 que envolvem documento/portal/WhatsApp/certidão/cobrança são **paridade obrigatória** porque o argumento de venda do Renan (carteira de 900) bate de frente com quem já entrega isso.

**O gap real:** o `radar-fiscal` cobre **2 de 9** (kanban/SLA + agenda básica sem regra de feriado). Os 7 restantes — e especialmente o **motor de data por tributo (#1)**, o **portal+log auditável (#4)** e a **persistência (#9)** — são o trabalho. **Mas a decisão de CONTEXT é herdar do Gestorize, não construir no radar-fiscal** — o que muda o esforço de "construir 7 features" para "**portar/integrar o Gestorize + plugar o diferencial D1**". Pendência crítica que destrava tudo: **confirmar acesso ao código-fonte deployável do Gestorize** (CONTEXT §8.5).

**Onde NÃO gastar:** gestão é paridade, não moat (CONTEXT §5). Fazer o suficiente pra empatar + injetar **D1 (health score cruzando e-CAC)**, que é o único diferencial barato (reusa o core que já vai existir) e que **nenhum** concorrente de gestão consegue copiar sem ter o e-CAC. Os demais diferenciais (D2 preço transparente já é decisão; D3 feriado municipal; D4 matriz certidão×regime; D5 app nativo) são incrementos oportunistas, não bloqueadores.

---

## 7. Fontes (URLs — primárias)

**Concorrentes (páginas oficiais de produto/preço):**
- Acessórias — software contábil: https://acessorias.com/site/software-contabil/
- Acessórias — Komunic (entrega + log de leitura): https://acessorias.com/site/funcionalidade/komunic/
- Acessórias — Acessórias Docs (GED): https://acessorias.com/site/funcionalidades/acessorias-docs/
- Questor Tareffa: https://www.questor.com.br/tareffa/
- Ottimizza (Tareffa — agenda): https://materiais.ottimizza.com.br/gestao-de-tarefas · https://ottimizza.com.br/agenda-tributaria-fevereiro-2026-escritorios-contabeis/
- Questor — obrigações acessórias 2026 (blog): https://blog.questor.com.br/obrigacoes-acessorias-2026/
- Domínio One (Thomson Reuters): https://www.dominiosistemas.com.br/solucoes/dominio-one/
- Domínio Cobranças (financeiro/honorários): https://www.dominiosistemas.com.br/servicos-financeiros/conta-digital/dominio-cobrancas/
- Onvio Client Center (app cliente, App Store): https://apps.apple.com/br/app/onvio-client-center/id1050812390
- Nibo — Contador: https://www.nibo.com.br/contador
- Nibo — funcionalidades/obrigações: https://www.nibo.com.br/contador/funcionalidades/obrigacoes
- Nibo — planos e preços: https://www.nibo.com.br/empresa/planos-e-precos
- Nibo Empresa (app cliente, Google Play): https://play.google.com/store/apps/details?id=br.com.nibo.customer
- Fortes Tecnologia — gestão contábil: https://www.fortestecnologia.com.br/gestao-contabil/
- Fortes — integração G-Click: https://ajuda.fortestecnologia.com.br/kb/article/127368/integracao-fortes-com-o-g-click
- Confi — site: https://confi.net.br/
- Confi — preços (R$250 / R$500): https://confi.net.br/precos/
- Confi — gestão de tarefas: https://confi.net.br/gestao-de-tarefas/
- Confi — WhatsApp/IA: https://confi.net.br/gestao-de-whatsapp/ · https://confi.net.br/assistente-de-atendimento-com-ia/
- Omie.G-Click: https://www.omie.com.br/gclick/ · https://store.omie.com.br/apps/omie-g-click
- G-Click — portal do cliente: https://cliente.gclick.com.br/
- MakroSystem — planos (grátis / Light R$195): https://makrosystem.com.br/nossos-planos/ · https://makrosystem.com.br/sistema-contabil-gratuito/
- Qive (ex-Arquivei) — escritórios contábeis: https://qive.com.br/escritorios-contabeis/ · módulos: https://ajuda.qive.com.br/pt-BR/articles/5145284-conheca-nossos-modulos

**Regra de data da agenda (legislação/prática):**
- PGDAS-D (prorroga p/ 1º dia útil seguinte): https://www.e-auditoria.com.br/blog/pgdas-d-o-que-e-guia-pratico/
- Agenda tributária 2026 (regra feriado/fim de semana): https://www.contabilizei.com.br/contabilidade-online/agenda-tributaria/ · https://agilize.com.br/blog/gestao-contabil-e-fiscal/agenda-tributaria-federal/
- Calendário fiscal 2026: https://www.taxgroup.com.br/intelligence/calendario-tributario-2026-confira-os-prazos-e-obrigacoes/

**Certidões:**
- CND-PJ — validade 180 dias / emissão: https://www.jusbrasil.com.br/artigos/cnd-federal-para-cnpj-o-que-e-como-emitir-e-por-que-sua-empresa-precisa/4282517472
- Certidão PGFN — emissão/consulta: https://cidesp.com.br/conteudo/certidao-pgfn-como-emitir-e-consultar-online

**Internos (base do projeto):**
- `docs/projects/contador/00-context/CONTEXT.md`
- `docs/projects/contador/06-comparativo-gestor-concorrentes.md` (matriz Gestorize × 8 herdada — este doc estende)
- `docs/projects/contador/12-tech-research-mercado.md` (cluster Gestão/Obrigações — pricing/posicionamento)
- `apps/radar-fiscal/lib/{domain,obligations,data}.ts` (estado atual do app)

> **Notas de honestidade:** vendors opacos (Acessórias/Questor/Fortes/Domínio/Onvio/SCI/TaskDo) não publicam preço — marquei "n/v". Para a matriz, funções marcadas ✅ foram confirmadas em fonte primária citada; 🟡/⬜ refletem o que a página vista mostrou (ausência na página ≠ ausência no produto). G-Click teve a URL de preço redirecionada para a página institucional Omie (301) — valor exato por usuário não reconfirmado em fonte primária nesta rodada; manter o ~R$100 + R$50/usuário do doc 12 como estimativa a validar.
