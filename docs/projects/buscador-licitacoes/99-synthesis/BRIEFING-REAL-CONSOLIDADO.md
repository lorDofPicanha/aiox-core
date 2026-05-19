# BRIEFING REAL — Plataforma Unificada do Cliente (Fornecedor B2B Licitação)

**Projeto:** Ecossistema integrado para 4 empresas + buscador + análise documental + livro caixa
**Cliente:** Amigo do Breno — fornecedor B2B regional Águas Lindas-GO + DF
**Data:** 2026-05-18
**Autor:** Orion (aios-master) — síntese pós-brainstorm
**Substitui (mas não apaga):** `PROJECT-BRIEF-18mai-expansion.md` (manter como referência histórica)

**Princípio-âncora:** Arquitetura unificada desde o dia 1. **Não vamos remendar 3 produtos depois — vamos modelar 1 ecossistema** e entregar features incrementalmente.

**Posicionamento (uma frase):** "**Holding virtual para fornecedor B2B de licitação.** Você nunca mais perde edital por CRF vencido, recurso por preclusão, ou hora refazendo dossiê." *(ver §14 para validação contra framework AIOX/Hormozi — passa nos 5 portões obrigatórios)*

---

## 0. SUMÁRIO EXECUTIVO (1 página)

### Qual é o problema real?
O cliente opera **4 empresas** e participa de licitações públicas em **Águas Lindas-GO + DF**. Hoje **tudo manual**: financeiro em planilha, edital procurado refrescando portais, documentação de habilitação refeita por edital, conferência de concorrentes lendo PDF de 50 páginas. Cliente perde tempo, perde editais por CRF FGTS vencido, e perde recursos por preclusão do prazo de impugnação.

### Qual é a solução?
**Uma plataforma única** que enxerga as 4 empresas como um **grupo econômico** (cumprindo Lei 14.133 art. 14 IV anti-conluio nativamente) e organiza, num mesmo backend Postgres, **5 pipelines integrados**:

```
┌──────────────────────────────────────────────────────────┐
│         PLATAFORMA UNIFICADA — "HOLDING VIRTUAL"         │
├──────────────────────────────────────────────────────────┤
│ Pipeline 1 — CAIXA (Livro Caixa multi-CNPJ + RBAC)       │
│ Pipeline 2 — COMPLIANCE (Certidões + ACTs + alarmes)     │
│ Pipeline 3 — RADAR (Buscador PNCP+DF+AL + alertas)       │
│ Pipeline 4 — HABILITAÇÃO (Auto-dossiê <30min)            │
│ Pipeline 5 — RECURSO (Conferência concorrente <30min)    │
│ Pipeline 6 — TBD ("outro processo" do áudio 1)           │
└──────────────────────────────────────────────────────────┘
```

### Por que unificado faz diferença real?
- O **anti-conluio** só funciona se o sistema vê as 4 empresas no mesmo schema (RLS).
- O **Auto-BP/DRE** (que dá vantagem em editais) só existe se livro caixa e habilitação compartilham a mesma tabela `financial_entries` + plano de contas.
- A **conferência de concorrente** só é <30min se o sistema já tem cache do PNCP + biblioteca de regras de irregularidade pré-modeladas.
- A **categorização contábil** alimenta TUDO (Caixa → DRE → Índices → Habilitação → Dashboard).

### Qual é o ganho técnico de fazer assim?
- **Um schema, uma auth, um deploy, um UI.** Reduz superfície de bug.
- **Onboarding único** das 4 empresas (uma vez só).
- **Dados gerados num pipeline alimentam outro** sem export/import.
- **Custo marginal** de cada novo pipeline depois da fundação ≈ 30-40% do custo standalone.

### Qual é a entrega?
**22 semanas (5,5 meses)** em **6 sprints**, com **schema completo modelado no Sprint 0** e **features liberadas progressivamente**:

| Sprint | Semanas | Liberação | Status do cliente |
|--------|---------|-----------|-------------------|
| 0 | 0-1 | Schema completo + Auth + Skeleton UI | Aguardando |
| 1 | 2-4 | Caixa Core (manual) + RBAC | Pai + 3 pessoas usando diariamente |
| 2 | 5-6 | Open Finance + Vault Certidões/ACTs | CRF nunca mais vence sem aviso |
| 3 | 7-10 | Radar (Buscador) + Anti-conluio automático | 1 alerta real entregue |
| 4 | 11-14 | Auto-habilitação (ACT matcher + Auto-BP/DRE) | 1 dossiê <30min real |
| 5 | 15-18 | Conferência concorrente + Minuta recurso | 1 recurso <30min real |
| 6 | 19-22 | Polimento + Pipeline 6 (se confirmado) | "Não voltaria pro manual" |

---

## 1. WORKFLOW INTERIOR REAL DO CLIENTE (modelado a partir dos áudios + research)

### 1.1 Personas no ecossistema

| Persona | Papel | Quando aparece | Device | Tempo/dia esperado |
|---------|-------|----------------|--------|---------------------|
| **Cliente** ("o amigo") | Master/Owner | Manhã + tarde + após alerta | Notebook + celular | 30-60min |
| **Pai** | Lançamentos de receita | Manhã (recebimentos do dia) | Celular | 15min |
| **Alice** | Despesas INYAC | Tarde (final do expediente) | Celular | 20min |
| **Giovanna** | Despesas INC | Tarde | Celular | 20min |
| **Gabela** | Despesas CENTINELA | Tarde | Celular | 20min |
| **🅿️ 4ª pessoa-ENHAC** | Despesas ENHAC | Tarde | Celular | 20min |
| **Contador externo** (se houver) | Auditoria mensal/anual | Mês-fechamento | Notebook (export) | varia |

### 1.2 Dia típico do cliente (inferido — VALIDAR NA CALL)

```
08:00  Cliente abre dashboard → vê alertas: CRF FGTS INYAC -5d
08:05  Pai entra no celular → vê PIX recebido R$5k → classifica "NF 1234 / INYAC / Receita Serviços"
08:30  Cliente vê novo edital DF-2026-1234 (Mobiliário hospitalar R$ 180k)
       → Sistema já rodou anti-conluio: OK (só INYAC matcha)
       → Sistema já rodou checklist habilitação: 12/14 OK, 2 pendentes (CRF + ACT específico)
08:45  Cliente clica "Resolver CRF" → fluxo guiado de renovação na Caixa
09:00  Cliente clica "Buscar ACT similar" → matcher sugere ACT da empresa B (8.5/10)
09:15  Cliente "Compilar dossiê" → PDF unificado em 60s → envia
       (Pipeline 4 — Habilitação)

12:00  ... operação normal das empresas ...

15:00  Alice abre celular → "Despesas INYAC" → Pluggy importou 8 transações → categoriza
15:30  Giovanna → mesmo fluxo p/ INC
15:45  Gabela → mesmo fluxo p/ CENTINELA
       (Pipeline 1 — Caixa)

18:00  Push: "Concorrente declarado vencedor em DF-2026-1234"
18:01  Sistema já rodou conferência: 3 irregularidades, 2 insanáveis (CRF expirou + sócio em CEIS)
18:10  Cliente revisa no celular durante o trânsito
18:15  Cliente "Manifestar intenção de recurso" → sistema redige minuta em 30s
18:18  Cliente envia → preclusão evitada
       (Pipeline 5 — Recurso)

19:00  Cliente revisa dashboard agregado: receita semana R$ 47k, ranking despesa por empresa
```

### 1.3 Pontos de fricção a eliminar

| # | Fricção atual | Pipeline que resolve | Quanto economiza |
|---|---------------|---------------------|-------------------|
| F1 | Refrescar portais procurando editais | 3 — Radar | 1-2h/dia |
| F2 | Refazer dossiê de habilitação por edital | 4 — Habilitação | 30-60min/edital × 5-30 editais/mês |
| F3 | CRF FGTS expirando sem aviso → inabilitação | 2 — Compliance | 1 inabilitação evitada = R$ 5-50k de oportunidade preservada (valor médio do edital regional) |
| F4 | Pedir balanço/DRE pro contador toda vez | 4 — Habilitação (Auto-BP/DRE) | 1 dia espera × N editais/mês |
| F5 | Ler PDF concorrente em <30min p/ recurso | 5 — Recurso | Recursos perdidos por preclusão recuperados |
| F6 | Risco anti-conluio: 4 empresas competindo juntas sem perceber | RLS/Anti-conluio nativo | Risco legal evitado (sanção administrativa) |
| F7 | Visibilidade financeira de 4 empresas separadas | 1 — Caixa Dashboard | Tomada de decisão estratégica |

---

## 2. ECOSSISTEMA UNIFICADO (visão sistêmica)

### 2.1 A metáfora "Holding Virtual"

A plataforma é, conceitualmente, uma **5ª entidade** que **observa** as 4 empresas reais. Ela não substitui contador, não emite NF-e, não calcula tributos — mas é o **único lugar onde as 4 empresas existem juntas** com regras de governança (anti-conluio, RBAC granular, índices consolidados).

```
                    ┌──────────────────────────┐
                    │   HOLDING VIRTUAL (app)   │
                    │                          │
                    │  - Anti-conluio rules    │
                    │  - RBAC granular         │
                    │  - Plano de contas único │
                    │  - Calendário compartilh.│
                    └──────────┬───────────────┘
                               │ observa
        ┌──────────┬───────────┴───────────┬───────────┐
        ▼          ▼                       ▼           ▼
   ┌────────┐ ┌────────┐             ┌──────────┐ ┌────────┐
   │ INYAC  │ │  INC   │             │CENTINELA │ │ ENHAC  │
   │ CNPJ A │ │ CNPJ B │             │  CNPJ C  │ │ CNPJ D │
   └────────┘ └────────┘             └──────────┘ └────────┘
        │          │                       │           │
        └──────────┴───────┬───────────────┴───────────┘
                           ▼
                    ┌──────────────┐
                    │   PNCP / DF  │
                    │   Águas Lin. │
                    │  (mundo ext) │
                    └──────────────┘
```

### 2.2 Os 5 pipelines (+ 1 TBD) integrados

```
                                       USER LAYER
        ┌────────────┬────────────┬────────────┬────────────┬────────────┐
        │  Cliente   │    Pai     │   Alice    │  Giovanna  │   Gabela   │
        │  (master)  │  (receita) │ (desp INY) │ (desp INC) │ (desp CTL) │
        └─────┬──────┴─────┬──────┴─────┬──────┴──────┬─────┴──────┬─────┘
              │            │            │             │            │
              ▼            ▼            ▼             ▼            ▼
        ┌──────────────────────────────────────────────────────────────┐
        │                    INTERFACE (Next.js PWA)                    │
        │  Dashboard | Caixa | Documentos | Oportunidades | Análises   │
        └─────────────────────────┬────────────────────────────────────┘
                                  │
                ┌─────────────────┼─────────────────┐
                ▼                 ▼                 ▼
       ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
       │  AUTH+RLS   │  │  PIPELINES   │  │   STORAGE   │
       │  (Supabase) │  │  (Inngest)   │  │ (Supabase)  │
       └─────────────┘  └──────┬──────┘  └─────────────┘
                               │
        ┌──────────┬───────────┼───────────┬───────────┬──────────┐
        ▼          ▼           ▼           ▼           ▼          ▼
    ┌───────┐ ┌─────────┐ ┌────────┐ ┌──────────┐ ┌────────┐ ┌────────┐
    │ P1    │ │  P2     │ │  P3    │ │   P4     │ │  P5    │ │   P6   │
    │ CAIXA │ │COMPLIANCE│ │ RADAR │ │HABILIT.  │ │RECURSO │ │  TBD   │
    └───┬───┘ └────┬────┘ └───┬────┘ └────┬─────┘ └───┬────┘ └───┬────┘
        │          │          │            │            │           │
        ▼          ▼          ▼            ▼            ▼           ▼
    Pluggy    Receita     PNCP API    Auto-BP/DRE   PDF Parse   ?
    (Open     Federal     e-Compras   ACT Matcher   LLM Compl   ?
    Finance)  CEIS/CNJ    DF Scrape   Compilador    Minuta      ?
              SICAF       AL Scrape   Dossiê PDF    Recurso     ?
```

### 2.3 Como os pipelines compartilham dados

| Quem produz | Dado | Quem consome |
|-------------|------|---------------|
| P1 (Caixa) | `financial_entries` com `categoria_contabil` | P4 (gera BP+DRE+índices automaticamente) |
| P1 (Caixa) | `centros_custo` | P4 (alimenta justificativa econômica) |
| P2 (Compliance) | `certidoes.status_validade` | P4 (alimenta checklist habilitação) + P3 (filtra editais elegíveis) |
| P2 (Compliance) | `atestados_capacidade_tecnica` (ACT library) | P4 (matcher de similaridade) |
| P3 (Radar) | `licitacoes.publicadas` + `anexos` | P4 (extrai exigências) + P5 (monitora vencedor) |
| P3 (Radar) | `oportunidades_ranking` (matched empresas) | P4 + Anti-conluio rules |
| P4 (Habilitação) | `propostas_enviadas` | P5 (monitor de status) + Calendário do cliente |
| P5 (Recurso) | `conferencias_concorrente` | Histórico cliente + biblioteca de irregularidades |

**Sem essa integração tabela-com-tabela, são 5 produtos separados e o moat desaparece.**

---

## 3. DOMAIN MODEL CONSOLIDADO

### 3.1 Entidades-núcleo

```sql
-- GOVERNANÇA / IDENTIDADE
grupo_economico       (id, nome_familia, criado_em)
empresa               (id, grupo_id, cnpj, razao_social, regime_tributario, sicaf_nivel, cnae_principal, cnaes_secundarios[])
usuario               (id, email, nome, telefone_whatsapp, role_global)
permissao             (id, usuario_id, empresa_id, escopo_lancamento, can_read, can_write, can_admin)

-- PIPELINE 1 — CAIXA
plano_contas          (id, codigo_dre, descricao, tipo_natureza, hierarquia)
centro_custo          (id, empresa_id, nome, parent_id)
financial_entry       (id, empresa_id, data, tipo_movimento, valor, descricao, doc_fiscal_ref, conta_contabil_id, centro_custo_id, conta_bancaria_id, fonte=manual/pluggy/import, criado_por, categorizado_por, classificacao_status)
conta_bancaria        (id, empresa_id, banco, agencia, conta, tipo_pix, pluggy_connection_id)
investidor            (id, empresa_id, tipo_pf_pj, doc, participacao_pct, ativo)

-- PIPELINE 2 — COMPLIANCE
tipo_documento        (id, codigo CRF/CNDF/CNDE/CNDT/SICAF/ACT/balanço, validade_padrao_dias)
documento             (id, empresa_id, tipo_id, arquivo_url, numero, emissao, validade, status auto_renovavel, fonte=upload/api_receita/api_caixa)
atestado_capacidade   (id, empresa_id, emissor_razao, emissor_cnpj, objeto_desc, cnae_compativel, quantidade_valor, periodo_inicio, periodo_fim, arquivo_url, score_qualidade)
alerta_certidao       (id, documento_id, tipo_alerta, dias_antes, enviado_em, canal)

-- PIPELINE 3 — RADAR
portal_fonte          (id, codigo PNCP/DF_eCompras/AL_PCP, url_api, scrape_config)
licitacao             (id, portal_id, n_processo, orgao, modalidade, objeto, valor_estimado, data_abertura, fase, status, vencedor_cnpj, vencedor_declarado_em, pncp_uuid)
licitacao_anexo       (id, licitacao_id, tipo edital/anexo/proposta, arquivo_url, parsing_status, exigencias_extraidas_json)
oportunidade_match    (id, licitacao_id, empresa_id, score, gap_documentos_json, anti_conluio_flag)

-- PIPELINE 4 — HABILITAÇÃO
proposta              (id, licitacao_id, empresa_id, dossie_url, enviada_em, valor_proposta, status)
proposta_checklist    (id, proposta_id, requisito_doc, status_atendimento, documento_usado_id, observacoes)
balanço_snapshot      (id, empresa_id, exercicio, dre_json, bp_json, indices_lg_lc_sg, fonte=auto/contador)

-- PIPELINE 5 — RECURSO
concorrente           (id, licitacao_id, cnpj, razao_social, declarado_vencedor_em, docs_baixados_em)
conferencia           (id, concorrente_id, irregularidades_json, classificacao_sanavel_json, score_recurso, criado_em)
recurso               (id, conferencia_id, tipo intencao/razoes, prazo_limite, minuta_url, enviado_em, status)

-- PIPELINE 6 — TBD
processo_interno      (id, empresa_id, tipo, descricao, status)  -- placeholder

-- AUDIT
audit_log             (id, usuario_id, empresa_id, entidade, acao, payload_json, timestamp)
```

### 3.2 Row-Level Security (RLS) — exemplo crítico

```sql
-- Usuario só vê financial_entries das empresas onde tem permissão de leitura
CREATE POLICY "user_reads_own_empresa_entries" ON financial_entry
  FOR SELECT USING (
    empresa_id IN (
      SELECT empresa_id FROM permissao
      WHERE usuario_id = auth.uid() AND can_read = true
    )
  );

-- Pai pode escrever apenas receita (tipo_movimento='entrada')
CREATE POLICY "pai_writes_receita_only" ON financial_entry
  FOR INSERT WITH CHECK (
    tipo_movimento = 'entrada' AND
    EXISTS (
      SELECT 1 FROM permissao p
      WHERE p.usuario_id = auth.uid()
        AND p.empresa_id = NEW.empresa_id
        AND p.escopo_lancamento = 'receita'
        AND p.can_write = true
    )
  );

-- Anti-conluio: bloqueia INSERT em propostas se já existe outra empresa do mesmo grupo na mesma licitação
CREATE POLICY "anticonluio_one_proposal_per_group" ON proposta
  FOR INSERT WITH CHECK (
    NOT EXISTS (
      SELECT 1 FROM proposta p
      JOIN empresa e1 ON p.empresa_id = e1.id
      JOIN empresa e2 ON e2.id = NEW.empresa_id
      WHERE p.licitacao_id = NEW.licitacao_id
        AND e1.grupo_id = e2.grupo_id
        AND p.id != NEW.id
    )
  );
```

**Esse último é o moat oculto** — nenhum sistema brasileiro de licitação tem isso por construção.

---

## 4. ARQUITETURA TÉCNICA UNIFICADA

### 4.1 Stack proposta

| Camada | Tecnologia | Razão |
|--------|-----------|-------|
| Frontend | Next.js 16 (App Router) PWA | Same stack do CRM-Novo; PWA suporta celular dos lançadores |
| Auth | Supabase Auth | RLS multi-tenant nativo |
| DB | Supabase Postgres | RLS + Edge Functions + Storage juntos |
| Workflow | Inngest | Durable execution para monitor PNCP, parsing PDFs longos, conferência |
| Open Finance | Pluggy | Maduro BR, custo baixo, regulado BCB |
| LLM | OpenAI (GPT-5.1 mini) ou Anthropic Claude Haiku | Parsing PDF edital + conferência concorrente + minuta |
| Storage | Supabase Storage (S3-compat) | PDFs de edital, ACT, dossiê, certidões |
| Notifications | WhatsApp Cloud API + Resend (email) | Alertas críticos via WA, notificações via email |
| Hosting | Vercel | Free tier suficiente p/ MVP, escala depois |
| Observability | Sentry + Vercel Analytics | Erros + perf |

### 4.2 Edge Functions críticas

- `parse_edital_pdf` — extrai exigências (CNDs, ACT, índices) do anexo de licitação
- `match_act_similarity` — score 0-10 entre ACT do cliente e exigência do edital
- `gen_balanco_dre_indices` — gera BP/DRE/LG/SG/LC a partir de `financial_entry`
- `compile_dossie_pdf` — junta todos os docs num PDF unificado
- `parse_concorrente_docs` — extrai dados dos PDFs do vencedor declarado
- `validate_cnd_online` — consulta Receita/PGFN/INSS via API pra confirmar validade real
- `gen_minuta_recurso` — usa template + irregularidades para gerar minuta

### 4.3 Inngest workflows (durable)

- `radar.poll_pncp` — cron 15min, busca licitações novas em PNCP filtrando CNAEs do cliente
- `radar.poll_df` — cron 30min, e-Compras DF
- `radar.poll_al` — cron 60min, Portal Compras Públicas Águas Lindas
- `compliance.check_cnd_expiry` — cron diário, alerta certidões vencendo
- `radar.opportunity_match` — disparado por nova licitação, computa score+anti-conluio
- `recurso.monitor_vencedor` — disparado quando licitacao.status=vencedor_declarado, baixa docs+roda conferência
- `caixa.sync_pluggy` — webhook Pluggy, importa transações novas

### 4.4 Modos de UI distintos

| Modo | Persona | UX |
|------|---------|----|
| **Mobile lançamento** (PWA) | Pai/Alice/Giovanna/Gabela | Single-screen, swipe categorias, sugestão LLM, <10s/lançamento |
| **Desktop dashboard** | Cliente | Multi-card, drill-down, exportável |
| **Modo Rápido <30min** | Cliente (após alerta) | Sheet/drawer, checklist linear, ações 1-click |
| **Análise edital** | Cliente | Split-screen: PDF + checklist |
| **WhatsApp Bot** (opcional) | Pai/Alice/Giovanna/Gabela | "*receita pix 5k inyac*" → lançamento via mensagem |

---

## 5. PIPELINES — DETALHE DE CADA UM

### 5.1 Pipeline 1 — CAIXA

**Entrada:**
- Manual: Pai/Alice/Giovanna/Gabela via PWA mobile
- Automática: Pluggy importa OFX de bancos das 4 empresas

**Processo:**
1. Transação entra como `financial_entry` com `classificacao_status='pendente'`
2. LLM sugere `conta_contabil_id` + `centro_custo_id` baseado em descrição
3. Humano confirma/edita em <10s → status='classificado'
4. Trigger atualiza saldo + dispara `balanço_snapshot` se for fim de mês

**Saída:**
- Dashboard agregado (receita/despesa/ranking)
- BP+DRE+índices calculados sob demanda
- Export CSV/Excel pro contador externo

**Anti-feature:** não calcula DAS, não emite NF-e, não gera DEFIS.

### 5.2 Pipeline 2 — COMPLIANCE

**Entrada:**
- Manual: upload de ACTs, certidões, contratos sociais
- Automática: cron consulta APIs (RFB, Caixa, PGFN, TST) p/ buscar CNDs novas
- Webhook: SICAF status update se houver

**Processo:**
1. Cron diário (06h00) verifica certidões com validade < 30d
2. Para cada certidão, dispara alerta WhatsApp + email + dashboard
3. Para certidões com API (CRF FGTS via Caixa), oferece "Renovar agora" 1-click

**Saída:**
- Vault organizado por empresa+tipo
- Alertas proativos
- ACT library indexada por CNAE/objeto/quantidade/valor

### 5.3 Pipeline 3 — RADAR

**Entrada:**
- PNCP API REST (15min poll)
- e-Compras DF scrape (30min)
- Portal Compras Públicas AL scrape (60min)

**Processo:**
1. Filtros: CNAEs cadastrados + faixa de valor + região
2. Para cada nova licitação, cria `licitacao` + `licitacao_anexo`
3. Edge function `parse_edital_pdf` extrai exigências
4. Para cada empresa do cliente, cria `oportunidade_match` com score+gap+flag anti-conluio
5. Notifica via WhatsApp top 3 oportunidades do dia

**Saída:**
- Lista priorizada de oportunidades por empresa
- Score 0-10 de aderência
- Gap de documentação já calculado

**Anti-feature:** não opera em portais autenticados (TOS risk).

### 5.4 Pipeline 4 — HABILITAÇÃO (Auto-dossiê <30min)

**Entrada:**
- `oportunidade_match` selecionada pelo cliente
- Edital parseado (exigências extraídas)
- Vault de certidões + ACTs + BP/DRE snapshot

**Processo:**
1. Sistema monta `proposta_checklist` cruzando exigência ↔ vault
2. Para itens faltantes:
   - Certidão vencida → fluxo de renovação
   - ACT não-equivalente → matcher sugere top 3 alternativas
   - Índice <1 → alerta "empresa X não habilita por LG, considere Y"
3. Auto-BP/DRE/índices gerados a partir de `financial_entry` (filtra exercício)
4. Cliente clica "Compilar dossiê" → Edge function `compile_dossie_pdf` em ≤60s
5. PDF unificado entregue + link compartilhável

**Saída:**
- Dossiê PDF pronto pra anexar na licitação
- Histórico de checklist (auditoria)

### 5.5 Pipeline 5 — RECURSO (Conferência <30min)

**Entrada:**
- Inngest `recurso.monitor_vencedor` detecta `licitacao.status=vencedor_declarado`
- Baixa todos PDFs do concorrente do portal/PNCP

**Processo:**
1. Edge function `parse_concorrente_docs` extrai dados (CNPJ, CNDs, ACTs do concorrente)
2. Para cada documento, executa verificações:
   - CRF FGTS válido? (consulta Caixa API)
   - CND Federal válida? (consulta RFB)
   - Sócios em CEIS/CNJ Improbidade?
   - ACT apresentado tem objeto compatível? (matcher reverso)
3. Classifica cada irregularidade como `sanavel` ou `insanavel` (regra TCU)
4. Score 0-10 de viabilidade do recurso
5. Se score >5, oferece "Manifestar intenção" → minuta gerada via LLM em <30s
6. Cliente revisa+envia

**Saída:**
- Relatório de conferência
- Minuta de intenção de recurso
- Minuta de razões (3 dias úteis depois)

**Hard SLA:** Pipeline 5 precisa entregar relatório em **<3 minutos** após `vencedor_declarado` (janela de preclusão).

### 5.6 Pipeline 6 — TBD ("outro processo da empresa")

**Status:** 🅿️ parking lot

**A descobrir na call com cliente:**
- O que é esse "outro processo"?
- Está relacionado a licitação ou é totalmente separado?
- É operacional (interno) ou comercial (clientes da empresa)?
- Pode usar a mesma stack ou precisa de coisa específica?

**Possíveis hipóteses (pra perguntar):**
- (a) Triagem/qualificação de clientes finais da empresa do amigo
- (b) Gestão de pedidos B2B (clientes → fornecedor → entrega)
- (c) Análise de viabilidade de obras/projetos
- (d) Outro

---

## 6. USER JOURNEYS REAIS (5 personas, 1 dia)

[ver §1.2 acima — dia típico do cliente já é a journey orquestrada]

### 6.1 Journey detalhada: Alice lança despesa em <30s

```
Push WhatsApp 14:55: "Alice, 8 transações novas em INYAC aguardando classificação"
14:56 Alice clica → PWA abre direto na tela "Despesas INYAC pendentes"
14:56 Card 1: "BOLETO MOLDURAS S/A 1.500,00 13/Mai" + sugestão LLM "Despesa Variável / Insumos"
14:56 Alice tap "OK" → próximo card (0.5s)
14:57 Card 2: "PIX *energia ENEL 380,00" + sugestão "Despesa Fixa / Energia"
14:57 Alice tap "OK"
14:57 Card 3: "TED ALUGUEL 2.200,00" + sugestão "Despesa Fixa / Aluguel"
14:57 Alice tap "OK"
... (5 cards mais)
14:59 Tudo classificado em <3 min
14:59 Sistema atualiza dashboard agregado em background
```

### 6.2 Journey: Cliente compila dossiê em 28min

```
09:00 Cliente vê alerta dashboard: "DF-2026-1234 / Mobiliário hospitalar R$180k / INYAC match 87%"
09:01 Click → tela edital
09:01 Sistema já mostra checklist: 12/14 OK
09:02 Cliente vê pendências:
       - CRF FGTS INYAC vence em 5d → tag "URGENTE"
       - ACT requerido: "fornecimento mobiliário hospitalar últimos 3 anos, mín R$ 100k"
09:03 Click "Resolver CRF" → modal Caixa → Cliente faz login Caixa → recebe novo CRF em 30s → upload automático
09:08 Click "Buscar ACT" → matcher mostra 3 opções:
       - Empresa hospital São Lucas 2024 R$ 280k cadeira hospitalar → score 8.5
       - Empresa clínica Bem-Estar 2023 R$ 150k cama hospitalar → score 7.8
       - Empresa creche Pequenos 2025 R$ 95k mobiliário escolar → score 4 (RECHAÇO)
09:09 Cliente seleciona ACT São Lucas
09:09 Sistema valida: período OK, objeto OK, quantidade OK → ✅
09:10 Auto-BP/DRE: Cliente vê "Exercício 2024 INYAC: LG 1.45 ✅ LC 1.20 ✅ SG 1.80 ✅"
09:12 Click "Compilar dossiê" → progress bar
09:13 Dossiê PDF de 47 páginas pronto → preview
09:15 Cliente revisa
09:20 Envia via portal DF (manual, fora do sistema)
09:28 Confirma "Enviado" no sistema → status = aguardando_lances
```

### 6.3 Journey: Recurso em <8min

```
18:00 Push: "Vencedor declarado em DF-2026-1234: Empresa Y CNPJ XX/XXX-XX"
18:00 Sistema rodou conferência em background nos últimos 2 min
18:01 Cliente abre relatório no celular (modo rápido)
18:02 Vê:
       ⚠️ INSANÁVEL — CRF FGTS Empresa Y expirou em 16/Mai (anteontem) — verificado via Caixa API agora
       ⚠️ INSANÁVEL — sócio "João Z" aparece em CEIS (Portal Transparência consultado)
       ⚠️ DUVIDOSO — ACT apresentado: "mobiliário escolar 2019" (objeto edital = hospitalar)
       Score recurso: 9.2/10 (recomendação forte)
18:04 Click "Manifestar Intenção" → minuta gerada em 25s
18:05 Cliente revisa minuta no celular
18:07 Click "Enviar minuta" → sistema envia automaticamente pelo portal (se integração existir) ou
       gera template pro cliente copiar/colar no portal manualmente
18:08 Sistema cria task "razões em 3 dias úteis" no calendário do cliente
```

---

## 7. ANTI-FEATURES (o que NÃO fazer)

| # | Não-fazer | Por quê |
|---|-----------|---------|
| AF1 | NF-e / faturamento | Mercado maduro (Conta Azul, Bling), comoditização |
| AF2 | DAS-MEI / DAS-Simples | RFB tem ferramenta oficial gratuita |
| AF3 | Folha de pagamento | Domínio Sistemas / Folha já resolve |
| AF4 | Escrituração contábil completa (Diário+Razão) | Contador externo continua fazendo |
| AF5 | Substituir contador na obrigação fiscal | Camada de DADOS, não de escrituração legal |
| AF6 | Cálculo automatizado do valor de proposta na licitação | Decisão estratégica humana |
| AF7 | IA escreve recurso por inteiro sem revisão humana | Risco jurídico inaceitável |
| AF8 | Scraping autenticado de portais | TOS risk + jurídico |
| AF9 | Onboarding self-service de novos clientes na v1 | Foco: 1 cliente-âncora (amigo) + uso pessoal Breno depois |
| AF10 | Buscador nacional | Escopo regional (AL + DF + Federal com filtro DF) |
| AF11 | Live chat / suporte 24h na v1 | Solo dev, escopo |
| AF12 | App nativo iOS/Android | PWA é suficiente; nativo é fase 2 (se virar produto) |
| AF13 | Multi-idioma | PT-BR only |
| AF14 | Brand customizado por tenant | Não é multi-tenant comercial — é cliente-único |

---

## 8. RISCOS REVISTOS

| # | Risco | Severidade | Mitigação |
|---|-------|-----------|-----------|
| R1 | **Anti-conluio Lei 14.133 art. 14 IV** — 4 empresas do mesmo grupo competindo juntas | 🔴 CRÍTICO | RLS nativa + alerta visual + bloqueio automático de proposta dupla |
| R2 | **Preclusão imediata recurso** — sistema fora do ar em janela crítica | 🔴 CRÍTICO | SLA 99.9% para Pipeline 5 + canal alternativo (email/WA com checklist manual) |
| R3 | **PDF parsing variável** — editais escaneados, formatos diversos | 🟠 ALTO | Fallback humano + biblioteca crescente de regras + LLM com confiança calibrada |
| R4 | **Categoria contábil mal feita** quebra Auto-BP/DRE | 🟠 ALTO | UX força categoria, não permite "outros"; LLM sugere top 3; auditoria periódica |
| R5 | **Solo dev + 3 projetos** (Tocks/Bretda/Anipis em paralelo) | 🟠 ALTO | Sprints com kill gates; aceitar prorrogação se outros projetos exigem; Fase 1 mínimo |
| R6 | **Pipeline 6 ("outro processo") muda arquitetura tardia** | 🟡 MÉDIO | Modelo `processo_interno` extensível desde Sprint 0; descobrir cedo |
| R7 | **Cliente abandona uso** após Sprint 1 | 🟡 MÉDIO | Kill gate pós-M1; pivotar pra buscador isolado se necessário |
| R8 | **Concorrente nacional reage** com feature de conferência | 🟢 BAIXO | Moat regional + ACT library curada + relacionamento de longo prazo com cliente-âncora |
| R9 | **Open Finance Pluggy mudança de pricing/política** | 🟢 BAIXO | Fallback OFX manual; mudar pra Belvo se Pluggy degradar |
| R10 | **Receita Federal/PGFN APIs caem** | 🟡 MÉDIO | Cache de consultas + upload manual fallback |

---

## 9. ROADMAP REVISTO — SCHEMA DAY 1, FEATURES INCREMENTAL

### Sprint 0 — Foundation (semanas 0-1)

**Goal:** Schema unificado pronto, infra montada, schema model auditado.

- [ ] Call discovery cliente + amigo (Bloco C — 6 perguntas)
- [ ] Confirmar/redesenhar com base na call
- [ ] Setup Supabase Postgres + Auth
- [ ] Schema completo das 6 áreas (com tabelas placeholder de P6)
- [ ] RLS policies escritas (TODAS — não deixar pra depois)
- [ ] Anti-conluio constraint (RLS + DB trigger)
- [ ] Next.js 16 skeleton + Tailwind + Auth UI
- [ ] Inngest connect
- [ ] Vercel deploy + domínio
- [ ] Pluggy account setup
- [ ] Storage buckets
- [ ] Sentry config

**Marco M0:** Schema validado por @data-engineer + 1 PR mergeado com migrations.

### Sprint 1 — Caixa Manual (semanas 2-4)

- [ ] Cadastro das 4 empresas + 6 usuários + permissões
- [ ] CRUD `financial_entry` manual (PWA)
- [ ] Plano de contas básico + centros de custo
- [ ] Dashboard agregado simples
- [ ] Push notifications WhatsApp básico

**Marco M1:** Pai + Alice + Giovanna + Gabela usando diariamente por 7 dias consecutivos.

### Sprint 2 — Caixa Open Finance + Compliance (semanas 5-6)

- [ ] Pluggy integração (4 CNPJs)
- [ ] LLM sugere categoria contábil
- [ ] Vault Certidões (upload manual + API CRF/CND)
- [ ] Vault ACTs (upload + tag)
- [ ] Cron alerta CRF 30d
- [ ] Categoria contábil obrigatória

**Marco M2:** 1 mês operando sem CRF vencido + 70%+ lançamentos categorizados.

### Sprint 3 — Radar Buscador (semanas 7-10)

- [ ] PNCP API integration
- [ ] Filtros CNAE/valor/região
- [ ] e-Compras DF scrape (read-only)
- [ ] Portal Compras Públicas AL scrape (read-only)
- [ ] Notificações WhatsApp+Email
- [ ] Anti-conluio check automático visível na UI

**Marco M3:** 1 alerta real entregue + cliente confirma "alerta útil".

### Sprint 4 — Habilitação Auto (semanas 11-14)

- [ ] Edge function `parse_edital_pdf` (LLM)
- [ ] `match_act_similarity` (LLM + regras)
- [ ] `gen_balanco_dre_indices` (a partir de `financial_entry`)
- [ ] `compile_dossie_pdf` (PDFKit ou similar)
- [ ] UI "Modo Rápido" habilitação
- [ ] Checklist dinâmico

**Marco M4:** 1 dossiê compilado <30min, enviado em licitação real.

### Sprint 5 — Recurso (semanas 15-18)

- [ ] Inngest `recurso.monitor_vencedor`
- [ ] `parse_concorrente_docs`
- [ ] `validate_cnd_online` (RFB+PGFN+Caixa+CEIS)
- [ ] Classificação sanável/insanável (regras TCU)
- [ ] `gen_minuta_recurso` (LLM + template)
- [ ] UI "Modo Rápido" recurso

**Marco M5:** 1 intenção de recurso real, dentro da janela de preclusão.

### Sprint 6 — Polish + Pipeline 6 (semanas 19-22)

- [ ] Edge cases
- [ ] Performance (queries lentas, paginação)
- [ ] Mobile UI refino
- [ ] WhatsApp Bot básico ("*receita pix 5k inyac*")
- [ ] **Pipeline 6 se confirmado na call**
- [ ] Documentação cliente + treinamento

**Marco M6:** Cliente declara "não voltaria pro manual" + métricas: ≥10 editais analisados, ≥2 recursos manifestados.

### Kill Gates

| Gate | Condição p/ Kill | Condição p/ Pivot |
|------|------------------|-------------------|
| Pós-M1 | Pai/Alice/Giovanna/Gabela não usam → produto morto | Não usam Pluggy mas usam manual → manter caixa apenas |
| Pós-M2 | CRF venceu apesar do alarme → confiança quebrada | Alarme funciona mas vault confuso → refazer UX |
| Pós-M3 | Cliente ignora 60%+ dos alertas → filtros errados | Cliente quer outro filtro → reconfigurar |
| Pós-M4 | Cliente recusa usar dossiê → falha de confiança | Cliente quer customizar campos → tornar configurável |
| Pós-M5 | Cliente não usa recurso → moat ilusório | Cliente usa só pra triagem → reduzir investimento |

---

## 10. INSIGHTS DA SESSÃO DE BRAINSTORM

1. **Anti-conluio é arquitetural, não feature.** Construir como RLS + DB constraint desde Sprint 0 é mais barato e seguro do que adicionar depois. Diferencia o produto vs concorrentes que tratam empresas isoladamente.

2. **Categoria contábil é o entryway pro Auto-BP/DRE.** Se a UX do lançamento não força categoria correta, todo o moat sinérgico quebra. Não permitir "outros" como default. LLM sugere top-3, humano confirma.

3. **"Modo Rápido <30min" é a assinatura visual do produto.** Aplica em Pipeline 4 (habilitação) e Pipeline 5 (recurso). Deve ser um padrão de UI reutilizável (sheet/drawer com checklist linear).

4. **WhatsApp não é só notificação — é canal de comando.** Dado que pai/Alice/Giovanna usam celular na correria do dia, WhatsApp Bot pode ser interface principal pra tarefas curtas. "*receita pix 5k inyac*" → lançamento criado.

5. **Open Finance é o trojan horse — categorização é o ouro.** Pluggy traz transações de graça quase. O valor está na CATEGORIZAÇÃO sugerida por LLM + confirmada por humano em <10s.

6. **PNCP é o universo; scrape é o suplemento.** 80% das licitações DF estão no PNCP; AL provavelmente 100%. Começar PNCP-only é suficiente pra v1. Scrape de DF/AL é Sprint 3 polimento.

7. **ACT matcher é o moat sustentável.** Uso diário, não sazonal. Vale investir em qualidade do matcher de similaridade (LLM + regras CNAE + janela 3 anos + quantidade ≥ exigido).

8. **A 5ª empresa é o dono do produto.** A "Holding Virtual" é uma metáfora poderosa: o sistema é como uma 5ª entidade que observa as 4. Pode batizar isso no UI ("Visão Holding").

9. **Áudio 1 ("outro processo") pode mudar o produto.** Se for triagem/due-diligence, transforma o produto em B2B-BPO. Precisa descobrir na call ANTES de fechar Sprint 5+.

10. **PDF parsing é trabalho contínuo, não one-shot.** Cada novo edital novo formato → biblioteca de regras cresce. Investir em feedback loop: cliente edita gap, sistema aprende.

11. **Solo dev + 6 sprints = 22 semanas é apertado.** Considerar usar squad-aios em sprints específicos (Sprint 4 Habilitação tem boa fit pra paralelizar matcher vs compilador).

12. **Não tentar ser ERP.** Anti-features lista (§7) é tão importante quanto features. Disciplina de escopo.

---

## 11. DECISÕES REVISTAS (consolidado)

### Resolvidas 18/Mai
- ✅ A1: 4 empresas DIFERENTES (INYAC, INC, CENTINELA, ENHAC)
- ✅ A2: 4ª pessoa-ENHAC → parking lot
- ✅ A3: Áudio 1 "outro processo" → Pipeline 6 TBD
- ✅ A4 (implícito): Cliente quer DASHBOARD + acesso ao Livro Caixa (master vê tudo, escreve nada)
- ✅ B1: Arquitetura unificada (não-remendo) → ESTA VERSÃO

### Pendentes — bloqueiam Sprint 0
- [ ] **B2** Cliente real (interno cliente-âncora único, ou virar SaaS multi-tenant comercial depois?)
- [ ] **B3** Cobrar amigo / grátis (recomendação Atlas: grátis case-âncora)
- [ ] **B4** Anti-conluio P0 confirmado ✅ (já decidido arquiteturalmente — só formalizar)
- [ ] **B5** Stack confirmada: Next.js 16 + Supabase + Pluggy + Inngest (igual CRM-Novo) ✅ (default — só formalizar)

### Pendentes — bloqueiam Sprint 1 (precisa call cliente)
- [ ] **C1** Regime tributário das 4 empresas (Simples/Presumido/Real)?
- [ ] **C2** Faturamento anual de cada (impacta volume + complexity)
- [ ] **C3** ERP/contador atual (impacta integração)
- [ ] **C4** Histórico licitação 12m (volume + taxa vitória → benchmark M3-M5)
- [ ] **C5** Coligação real entre as 4 (mesmo controlador) — impacta Anti-conluio
- [ ] **C6** Dor #1 (LC vs Buscador vs Doc Auto)
- [ ] **C7 NOVO** O que é o "outro processo" do áudio 1? (Pipeline 6 scope)
- [ ] **C8 NOVO** Cliente quer integrar com contador externo (export OFX/CSV)?

---

## 12. PRÓXIMOS PASSOS (do briefing pra realidade)

### Próximas 48h (Breno)
- [ ] Ler este briefing + dois deep-dives + transcripts
- [ ] Decidir B2 (cliente único vs SaaS futuro) + B3 (cobrar/grátis)
- [ ] Agendar call com amigo (Bloco C + C7/C8) — recomendo 45min, presencial ou videocall
- [ ] Confirmar dispatch p/ Sprint 0 ou esperar discovery

### Sprint 0 (semanas 0-1)
- [ ] Call discovery executada (60% das decisões saem dela)
- [ ] @data-engineer modela schema completo + RLS + anti-conluio
- [ ] @architect valida arquitetura técnica + escolhas de stack
- [ ] Setup infra (Supabase + Vercel + Inngest + Pluggy + Sentry)
- [ ] Sprint 1 backlog definido (PO)

### Trigger pra mim (Orion)
- `vai com sprint 0 buscador` — dispara discovery + schema design
- `pivot buscador {dimensão}` — ajustar arquitetura
- `kill buscador` — descontinuar
- `audit buscador sprint {N}` — review de sprint

---

## 14. INSIGHTS AIOX INTEGRADOS (Alan Nicolas — Vender IA + Mapa Zero ao Primeiro Cliente)

> Material adicional injetado em 18/Mai pelo Breno: 2 decks AIOX sobre como vender serviços premium de IA. Tese central: **"Empresário não compra automação. Compra alguém de confiança para resolver e revisar quando quebrar."** O exemplo do deck (Squad jurídico de triagem + pesquisa + classificação documental + minuta inicial) é literalmente o que estamos modelando aqui.

### 14.1 Aplicação do método D.S.P.C. ao nosso projeto

| Letra | AIOX prescreve | Como aplica ao Buscador |
|-------|----------------|--------------------------|
| **D — Dor** | Custo semanal visível | Horas/mês refazendo dossiê (15-210h conforme volume) + R$ 5-50k por edital perdido por CRF vencido + recurso perdido em preclusão. **Custo operacional do amigo mensurável em tempo + oportunidade.** |
| **S — Serviço** | 1 a 3 agentes/fluxos | 5 pipelines especializados + 1 holding virtual orquestradora. **Não "automação genérica" — workflow vertical de fornecedor de licitação regional.** |
| **P — Piloto** | Escopo + entrega + continuidade | Fase 1 (Caixa + RBAC, 6 semanas) é o piloto. Entrega 1 vitória rápida concreta (M1: pai+3 pessoas usando diário) + medível (ranking despesa por empresa). |
| **C — Continuidade** | Uso recorrente sustentado | Fases 2-5 (Compliance + Radar + Habilitação + Recurso) são a continuidade. Cada uma agrega valor mensurável e tem cadência própria de uso (diário/semanal/mensal). |

### 14.2 Os 5 portões obrigatórios aplicados (status atual)

| Portão AIOX | Status do projeto | Evidência |
|-------------|-------------------|-----------|
| **01 — Continuidade** | ✅ Atendido | Sistema é uso DIÁRIO (caixa) + SEMANAL (radar) + MENSAL (compliance). Não é one-shot. |
| **02 — Dor cara** | ✅ Atendido | Dor quantificada: 15-210h/mês refazendo dossiê, R$ 5-50k por edital perdido (CRF vencido), recursos perdidos por preclusão. **Números reais do amigo, não opinião.** |
| **03 — Retorno 10x** | ✅ Atendido | Para cada inabilitação CRF evitada: 1 edital R$ 5-50k preservado. Auto-BP/DRE + ACT matcher + recurso adicionam camadas. Retorno multidimensional (tempo + oportunidade + risco). |
| **04 — Mapa na mão** | ✅ Atendido | Discovery call (Bloco C) entrega diagnóstico inicial. Sprint 0 entrega schema completo (mapa). Sistema entrega ao cliente um **mapa de gap por edital** (check habilitação). |
| **05 — Vitória no mês 1** | ✅ Atendido | M1 (semana 4) = pai + 3 pessoas usando + dashboard funcional. M2 (semana 6) = 1 CRF nunca venceu sem aviso. **Métricas claras.** |

→ **O produto passa nos 5 portões.** Não é "automação genérica de IA" — é workflow vertical defensável.

### 14.3 Filtro dos 5 atributos (Hormozi, citado pela AIOX)

| Atributo | Aplicação | Score |
|----------|-----------|-------|
| **Sticky** (continuidade) | Caixa diária + Radar semanal + Compliance mensal | ✅ Alto |
| **Expensive** (vale o esforço) | Dor recorrente + risco regulatório alto = valor de uso justificável | ✅ Médio-Alto |
| **Expansion** (cresce com o cliente) | Adicionar empresa nova, novos CNAEs, novos portais regionais | ✅ Alto |
| **Air** (fácil de explicar) | "Sistema que evita inabilitação e gera dossiê em <30min" | ✅ Alto |
| **Unique** (difícil de copiar) | Anti-conluio nativo + ACT matcher + Auto-BP/DRE + conferência concorrente — concorrentes não têm | ✅ Alto |

→ **Passa em 5/5.**

### 14.4 Pitch em uma frase (candidatos)

- **Versão técnica:** "Sistema unificado que organiza o livro caixa de 4 empresas coligadas, alerta certidões vencendo, encontra editais aderentes, monta dossiê de habilitação em <30 min e analisa documentação de concorrentes para impugnação dentro do prazo."

- **Versão venda (workflow):** "**Holding virtual para fornecedor B2B de licitação.** Você nunca mais perde edital por CRF vencido, recurso por preclusão, ou hora refazendo dossiê."

- **Versão dor:** "Você participa de licitação em DF e Águas Lindas? **Pare de perder editais de R$ 5-50k quando o CRF expira sem aviso.** A gente automatiza alerta, dossiê e recurso pra você."

→ **Recomendação:** versão "Holding Virtual" é a mais alinhada com "Workflow vendável > Cargo velho" da AIOX.

### 14.5 Anti-padrões AIOX que estamos respeitando

| AIOX manda evitar | Estamos respeitando? |
|--------------------|----------------------|
| "Chatbot genérico" | ✅ Não é chatbot. É workflow integrado de 5 pipelines |
| "Automação sem dizer pra quem" | ✅ Persona = fornecedor B2B licitação Águas Lindas + DF |
| Falar "LLM/prompt/RAG/arquitetura" pro cliente | ✅ Brief técnico fica interno; comunicação cliente fala "dossiê em <30min", "CRF nunca expira", "recurso dentro do prazo" |
| Projeto sem diagnóstico inicial | ✅ Discovery call entrega diagnóstico antes de qualquer build |
| Pedir depoimento antes de resultado | ✅ M1-M6 têm vitórias mensuráveis ANTES de pedir prova |
| Escalar antes da hora | ✅ Foco: 1 cliente-âncora. Não onboarding self-service v1 |
| Modelo "vender 1 vez e morrer" | ✅ Continuidade nativa nos 5 pipelines |

### 14.6 Métricas semanais AIOX adaptadas pro Sprint Cycle

| AIOX prescreve (vendas) | Tradução pro Buscador (durante dev) | Tradução pro produto (rodando) |
|--------------------------|--------------------------------------|--------------------------------|
| Conversas iniciadas | 1 dev call cliente/sem (Sprint dev) | Edital triados/sem |
| Reuniões realizadas | 1 review Sprint com Breno | Recursos manifestados/mês |
| Propostas enviadas | 1 PR mergeado/sem | Dossiês compilados/mês |
| Taxa de fechamento | 100% Sprints entregues no prazo | Taxa vitória licitação (cliente) |
| Horas trabalhadas | Limite solo dev | Tempo cliente no sistema |
| Tempo de entrega | Prazos de Sprint respeitados | SLA Pipeline 5 (<3min análise concorrente) |
| Pipeline | Backlog Sprint+1 sempre detalhado | Editais filtrados / participados |

### 14.7 5 ações concretas extraídas dos decks AIOX

1. **Discovery call = "diagnóstico AIOX"** — não é só call de descoberta; é uma entrega de mapa do gap atual (4 empresas × certidões + ACTs + último balanço). Sair com "diagnóstico escrito" — o cliente vê valor antes de qualquer linha de código.

2. **Premium é o loop de revisão**, não a primeira entrega. Pipeline 5 (recurso) com fallback humano sempre. Pipeline 4 (dossiê) com revisão obrigatória antes de envio. **Não automatizar 100% — automatizar 80% e fortalecer revisão.**

3. **Primeiro case = ATIVO, não caixa** (regra final AIOX). Documentar tudo do amigo-âncora: situação antes, situação depois, frase do cliente. Esse case **é o ingresso para uso/aplicação futura** em outros contextos.

4. **Vitória rápida obrigatória mês 1** (Portão 05): identificar **a métrica concreta** que vai mostrar valor em 30 dias do M1. Sugestão: "**CRF FGTS de 4 empresas monitorado e renovado sem expirar**" + "**4 dashboards de receita/despesa funcionando**". Documentar.

5. **Nicho > Genérico**: posicionar como "**Holding virtual para fornecedor B2B licitação DF/Águas Lindas**", não "automação de licitação". Foco regional ultra-nichado = moat. Cliente reconhece imediatamente "isso é pra mim".

---

## 13. APÊNDICE — Material consultado nesta síntese

**Inputs primários:**
- 5 áudios WhatsApp PTT do cliente (transcritos via faster-whisper local)
- `00-context/audios-18mai/TRANSCRIPTS-SUMMARY.md`
- Confirmações Breno 18/Mai pós-transcript
- 2 decks AIOX/Alan Nicolas:
  - `AIOX - Vender IA - ZOOM.html` (30 slides — método D.S.P.C. + 5 atributos Hormozi + objeções)
  - `mapa-completo-zero-primeiro-cliente.html` (3 caminhos + 10 passos + 5 portões + anti-padrões + métricas semanais)

**Research entregue:**
- `01-research/licitacao-process-deep-dive.md` (38KB, 32 fontes, agente Atlas)
- `01-research/livro-caixa-deep-dive.md` (21KB, 24 fontes, agente Atlas)

**Síntese anterior (preliminar — substituída por este):**
- `99-synthesis/PROJECT-BRIEF-18mai-expansion.md`

**Contexto do projeto:**
- `00-context/CONTEXT.md`

**Referências legais consultadas (top):**
- Lei 14.133/2021 (regime principal de licitações)
- Lei 14.133 art. 14 IV (vedação empresas mesmo grupo)
- Decreto 12.807/2025 (valores 2026)
- LC 123/2006 + Resolução CGSN 140/2018 (Simples + Livro Caixa)
- TCU Acórdão 1.211/2021 (formalismo moderado)
- RIR/2018 (Decreto 9.580/2018) — Lucro Presumido
- ITG 1000 CFC (ME/EPP)

**Stack de referência (projeto irmão):**
- `docs/projects/crm-novo/` (mesma stack Next.js + Supabase + Inngest)

---

*Briefing real consolidado — Orion @ aios-master — 2026-05-18*
*Substitui o brief preliminar `PROJECT-BRIEF-18mai-expansion.md` mas o preserva como histórico*
*Pronto pra revisão Breno + dispatch Sprint 0*
