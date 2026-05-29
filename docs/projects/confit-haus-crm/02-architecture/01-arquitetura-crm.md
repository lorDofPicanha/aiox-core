# Arquitetura — CRM + WhatsApp + Bot · Confit Haus

**Versão:** 1.0 · **Data:** 29/Mai/2026 · **Autor:** Orion (AIOS Master)
**Decisões travadas:** ver `../00-context/CONTEXT.md` (D1–D6)
**Base de evidência:** tech-research 4 eixos (fontes 2025-26 trianguladas) + conclave HYDRA
(werner-vogels · lead-qualifier · erik-nymanczuk/LGPD)

---

## 1. Sumário executivo

Construir um CRM single-tenant para a Confit Haus que resolva relacionamento, atendimento,
tracking e análise, num **dashboard único conectado ao WhatsApp**, com um **bot copilot**.

**Recomendação:** arquitetura **híbrida** — usar **Chatwoot** (self-host, MIT) como motor de
inbox WhatsApp + bot (a parte cara e comoditizada), e um **dashboard custom Next.js + Supabase**
como o "cérebro CRM" (pipeline de vendas, segmentação por nicho, qualificação de lead, análise).
WhatsApp via **Cloud API oficial**. Estado no **Postgres** (fonte da verdade). Bot **regras-primeiro
+ LLM copilot** (rascunha; humano aprova). LGPD by design.

**3 justificativas:** (1) o WhatsApp oficial é o único caminho seguro p/ projeto de cliente
(libs não-oficiais sofreram ondas de ban em 2025, derrubando bots estáveis há 3 anos); (2) Chatwoot
entrega inbox+bot quase de graça, sobrando esforço pra diferenciação (pipeline/análise que ele NÃO tem);
(3) o novo pricing per-message torna um inbox reativo **quase gratuito**.

**3 riscos:** (1) sincronização Chatwoot↔CRM (mitigado: Postgres = fonte única da verdade, webhook
unidirecional); (2) onboarding WhatsApp (verificação Meta + aprovação de template é o gargalo — começar
cedo); (3) LGPD (mitigado: consent/audit/retention desde o dia 1).

---

## 2. Decisão de fundação (matriz)

| Critério | A) Híbrido ✅ | B) Build 100% | C) Frappe (fork) |
|---|---|---|---|
| Inbox WhatsApp pronto | ✅ grátis (MIT) | ❌ constrói | 🟡 nativo, UX fraca |
| Pipeline de vendas | 🟡 custom (lado CRM) | ✅ desenha | ✅ tem |
| Bot copilot | ✅ Captain incluso | 🟡 pluga | 🟡 |
| Tempo até valor | 🟢 rápido | 🟡 médio | 🔴 curva Frappe |
| Dívida técnica | 🟡 2 sistemas (sync) | 🟢 1 codebase | 🟡 AGPL + framework opinativo |

**Escolhido: A (Híbrido).** Análise de sensibilidade: se o cliente quisesse revender (multi-tenant) ou
ERP/financeiro, C subiria; como é single-tenant focado em relacionamento+vendas, A vence (werner-vogels:
"não construa o que dá pra alugar; mova a complexidade pra onde dói menos").

---

## 3. Diagrama de arquitetura

```
        WhatsApp Cloud API (OFICIAL, direto)
                 │  (inbound webhook / outbound send)
                 ▼
         ┌──────────────────┐
         │     CHATWOOT      │  ← motor de INBOX + bot (Captain copilot)
         │  (self-host, MIT) │     multi-canal, templates, agente humano
         └────────┬─────────┘
                  │  webhook (nova msg, mudança de status, label)
                  ▼
   ┌──────────────────────────────────────────────────────────┐
   │   SYNC LAYER (Next.js route handler / worker Node)        │
   │   normaliza evento Chatwoot → grava no Postgres           │
   └───────────────────────────┬──────────────────────────────┘
                               ▼
   ┌────────────  SUPABASE / POSTGRES (FONTE DA VERDADE)  ─────────────┐
   │  contacts · niches · conversations · messages · deals(pipeline)   │
   │  lead_scores · consent_log · audit_log · retention_policy         │
   │  RLS ligada (tenant_id) desde o dia 1                             │
   └───────────────┬───────────────────────────────┬─────────────────┘
                   ▼                                 ▼
        ORQUESTRADOR (state machine)          DASHBOARD (Next.js App Router)
        • triagem: spam? nicho? conhecido?    • inbox WhatsApp (realtime/Broadcast)
        • gate de qualificação (regras)       • kanban pipeline por status de compra
        • contexto curto (Redis ~10 turnos)   • segmentação/filtro por nicho
                   ▼                          • lead scoring (quente/morno/frio)
        LLM (BYOK, tiered barato→caro)        • análise/relatórios de relacionamento
        • entende intenção + RAG no FAQ
        • RASCUNHA resposta no tom da marca
                   ▼
        Sugestão volta ao inbox  →  vendedor aprova/edita/envia  (COPILOT)
        ⚠️ nunca auto-envia preço/compromisso
```

---

## 4. Modelo de dados (Postgres)

> Toda tabela com dado pessoal: `tenant_id` + RLS + índices nas colunas de policy.

| Entidade | Campos-chave |
|---|---|
| **contacts** | id, tenant_id, nome, telefone_wa, email, `niche_id`, `lead_quality` (quente/morno/frio), `lead_score` (0-100), `lifecycle_stage`, owner_id, optin_marketing (bool), optin_at, source, created_at |
| **niches** | id, nome (Restaurantes, Cafés, Empórios, Corporativo, Consumidor Final, Revendedores…), cor, icone, playbook/roteamento |
| **deals** (pipeline) | id, contact_id, `status` (ver §5), valor_estimado, motivo_perda, proxima_acao, proxima_acao_em, created_at, closed_at |
| **lead_scores** | contact_id, firmografico (nicho/porte), comportamental (respondeu?, velocidade, engajamento), score, atualizado_em |
| **conversations** | id, contact_id, chatwoot_conversation_id, canal, status, last_msg_at |
| **messages** | id, conversation_id, direcao (in/out), tipo (servico/template), corpo, chatwoot_msg_id, created_at |
| **consent_log** | id, contact_id, canal, finalidade (transacional/marketing), origem, ip, timestamp |
| **audit_log** | id, actor_id, acao (read/edit/export/delete), entidade, entidade_id, timestamp |
| **retention_policy** | entidade, retention_until, regra |
| **tasks** (lembretes) | id, descricao, contact_id (opcional), owner_id, due_at, status (aberto/feito), origem (manual/assistente), created_at |
| **report_schedules** | id, tipo (semanal), destinatario (fundador), canal (whatsapp), proximo_envio, template_id |

> **Modo admin do assistente** (modo B, §7): além das tabelas acima, depende de um **scheduler/cron**
> (lembretes diários + relatório semanal) e de **funções de consulta read-only pré-definidas** que o
> LLM chama (function-calling) — nunca SQL arbitrário.

**Nichos (lista editável, inclui `Consumidor Final`):** Restaurantes/Gastronomia · Cafés & Padarias ·
Empórios & Lojas de Presente · Corporativo (brindes/kits) · **Consumidor Final** · Revendedores.
O vendedor pode marcar qualquer contato como `Consumidor Final` na ficha e no inbox.

**Qualificação do lead (lead-qualifier / ICP Scoring Matrix):** o vendedor marca bom/ruim+nicho+status
manualmente; o `lead_score` automatiza parte (firmográfico: nicho de alto valor p/ geleia artesanal =
ex. corporativo/empório > consumidor avulso; comportamental: respondeu rápido? voltou a comprar?).
Regra dos 5 min: bot notifica o vendedor assim que um lead novo chega.

---

## 5. Pipeline de status de compra (kanban)

```
Novo lead → Contato feito → Qualificado → Amostra/Proposta enviada → Negociação
   → GANHO (cliente)  →  Recompra/Recorrente
   → PERDIDO (com motivo)
```

Adaptado pra alimento artesanal: o estágio **Recompra/Recorrente** é chave (geleia/molho = consumo
recorrente; a "dor de relacionamento" mora em não acompanhar a recompra). Análise: taxa de conversão
por nicho, tempo em cada estágio, leads parados, recompra por cliente.

---

## 6. WhatsApp (Cloud API oficial)

- **Acesso direto** (sem BSP) — você já constrói o inbox via Chatwoot; evita markup.
- **Onboarding (gargalo — começar JÁ):** Meta Business verificado → WABA → registrar número →
  **aprovar templates** (cada template marketing/utility/auth é revisado pela Meta) → opt-in →
  quality rating governa os limites de mensagens.
- **Pricing 2025 (per-message):** mensagens de **serviço** (respostas na janela de 24h) = **grátis**;
  templates **utility dentro da janela** = grátis. Paga-se basicamente pra *iniciar* com template
  marketing. Brasil: marketing ≈ US$0,0625/msg; utility/auth ≈ US$0,0068/msg. (Verificar na página
  oficial da Meta no dia — revisam ~2×/ano.)
- **Camada de mensageria provider-agnóstica:** abstrair `sendMessage`/`onInbound`/`templates` para que
  o transporte seja trocável (resiliência — werner: "tudo falha").

---

## 7. Assistente (DOIS modos)

O assistente tem **dois papéis** distintos sobre a mesma base de dados (CRM = fonte da verdade):

### Modo A — Copilot de atendimento (cliente)
- State machine determinística faz roteamento + gates de qualificação + qualquer compromisso
  (preço/disponibilidade); LLM só **entende a mensagem e rascunha** resposta (RAG no FAQ), no tom da marca.
- **Copilot, não autônomo:** LLM rascunha → vendedor aprova/edita/envia. Autonomia só depois, só em FAQ
  claramente seguro, com gate de regras. Nunca autônomo em preço/proposta.
- Implementação mais leve: Chatwoot **Captain Copilot** (BYOK).

### Modo B — Assistente pessoal do fundador (no WhatsApp dele) ⭐ NOVO
O fundador conversa com o assistente **no próprio WhatsApp** (mesmo número oficial; o bot reconhece o
número do fundador e entra em **modo admin**). Capacidades:
- **Consulta em linguagem natural** sobre o CRM: "como foram as vendas essa semana?", "quem não fechou e
  por quê?", "quais clientes são bons/ruins?", "quem está parado?". → LLM com **function-calling sobre
  funções de consulta pré-definidas e seguras** (NÃO SQL arbitrário) que leem `deals`, `lead_scores`, `contacts`.
- **Relatório de vendas semanal proativo**: job agendado (cron) gera o relatório (fechados, em negociação,
  não-fecharam + motivo, melhor nicho, recompra prevista) e **envia via template aprovado** (categoria utility)
  no WhatsApp do fundador.
- **Lembretes / tarefas do dia a dia**: "me lembra de ligar pro Bistrô às 15h" → cria registro em `tasks` e
  dispara lembrete no horário. De manhã, envia a lista de lembretes do dia.
- **Ações sugeridas**: "prepara uma mensagem de reativação pro Café Central" → rascunha (humano aprova).
- **Segurança/LGPD**: só o número do fundador acessa o modo admin; outbound proativo é pra ele mesmo
  (consentido); funções de consulta read-only e parametrizadas (sem exposição de SQL).

### Comum aos dois modos
- **Estado** durável no Postgres; Redis = janela curta (~10 turnos) como cache.
- LLM BYOK, tiered (modelo barato→caro). Tom da marca (calor humano, essencial, memória).

---

## 8. Dashboard (Next.js + Supabase)

- **Stack:** Next.js (App Router) + Supabase (Postgres + Auth + RLS + Realtime).
- **Realtime do inbox:** usar **Broadcast** (NÃO Postgres Changes — gargalo conhecido).
- **RLS desde o dia 1** (mesmo single-tenant): `tenant_id` em tudo, policies por claim do JWT no
  `app_metadata` (não `user_metadata`), `service_role` nunca no browser.
- **Telas:** Inbox WhatsApp · Kanban de pipeline · Lista/segmentação por nicho · Ficha do contato
  (histórico + score + consentimento) · Análise (conversão por nicho, recompra, leads parados).
- **Design:** ver `../00-context/BRAND-SYSTEM.md` — azul institucional como UI base, verde como
  marca, amarelo acento, off-white background; Newsreader + Inter Tight.

---

## 9. LGPD (by design — erik-nymanczuk)

- **Base legal:** legítimo interesse (Art. 7º IX) / execução de contrato p/ clientes — guardar a
  **LIA (teste de balanceamento em 3 fases)** em arquivo (defensabilidade + desconto na dosimetria ANPD).
- **Marketing exige opt-in** explícito, específico, com registro (`consent_log`). Transacional não.
- **Direitos do titular (Art. 18) → features obrigatórias:** export por titular (acesso+portabilidade
  JSON/CSV), correção com histórico, exclusão/anonimização que cascateia (inclui conversas), flag
  opt-out que bloqueia envio de marketing no momento da query.
- **Retenção** com `retention_until` + job de purge agendado. **Encryption** at-rest+TLS (Supabase default).
- **Audit log** de quem leu/editou/exportou dado pessoal. **Notificação de incidente** ~72h.
- **RIPD** recomendado (base = legítimo interesse + escala de comunicações).

---

## 10. Roadmap faseado

| Fase | Entrega | Critério de pronto |
|---|---|---|
| **0 — Fundação** | Meta Business + WABA + número + templates submetidos; Chatwoot self-host no ar; Supabase + schema + RLS | WhatsApp recebe/envia via Chatwoot; DB com RLS testada via SDK |
| **1 — MVP CRM** | Sync Chatwoot→Postgres; dashboard com inbox (Broadcast) + ficha de contato + classificação (nicho, bom/ruim, status) | Vendedor classifica lead e vê histórico num lugar só |
| **2 — Pipeline & Análise** | Kanban de status; lead scoring; relatórios (conversão por nicho, recompra, leads parados) | Dono enxerga relacionamento e gargalos |
| **3 — Assistente (2 modos)** | Modo A: copilot rascunha resposta ao cliente. Modo B: assistente do fundador no WhatsApp (consulta NL + lembretes/tasks + relatório semanal proativo via template + scheduler) | Vendedor aprova rascunhos; fundador consulta vendas e recebe relatório semanal no WhatsApp |
| **4 — LGPD hardening** | Export/exclusão por titular, consent UI, retenção/purge, audit | Direitos do Art. 18 atendíveis tecnicamente |

---

## 11. Incógnitas residuais

**Redutíveis (mais research/spike resolve):** custo exato de LLM por volume real de mensagens;
viabilidade do Captain self-host (precisa Enterprise flag) vs serviço LLM próprio.
**Irredutíveis (só validação empírica):** taxa de aceitação dos rascunhos do copilot pelo vendedor;
qualidade do quality-rating do número WhatsApp em produção; ergonomia real do "2 sistemas" (Chatwoot+dashboard)
no dia-a-dia do vendedor → validar no MVP (Fase 1) antes de investir na Fase 2.

---

## 12. Fontes (âncora)

Tech-research completa com scoring por fonte em `../05-research/` (a consolidar). Destaques:
repos oficiais (Chatwoot, Twenty, Frappe), Meta WhatsApp pricing (jul/2025), GitHub Baileys issues
#1869/#2075 (ban waves 2025), Supabase docs (Broadcast vs Postgres Changes), ANPD gov.br
(Guia Legítimo Interesse 02/02/2024, Dosimetria Res. 4/2023, RIPD), Planalto LGPD Lei 13.709/18.
