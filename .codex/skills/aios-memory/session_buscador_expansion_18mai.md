---
name: session-buscador-expansion-18mai
description: "Buscador-licitações expandiu para 3 módulos (Livro Caixa + Buscador + Doc Automation) — 4 empresas cliente, RBAC granular, Opção C sequencial 22w recomendada"
metadata: 
  node_type: memory
  type: project
  originSessionId: bb48a62d-1c1f-42bb-acfe-9160e5375f4c
---

# Buscador-Licitações Expansion 18/Mai/2026

**Trigger:** Cliente (amigo do user, fornecedor B2B licitações Águas Lindas + DF, projeto pai `docs/projects/buscador-licitacoes/`) mandou 5 áudios WhatsApp PTT pedindo **Livro Caixa para 4 empresas** + automação de análise documental ("desclassificar / pedir reanálise = manual hoje").

## Áudios decodificados (transcrição faster-whisper local, confiança 1.00)
- Áudio 1: **FORA DO ESCOPO LICITAÇÃO** (confirmado Breno 18/Mai) — "outro processo da empresa", parking lot pra detalhar
- Áudios 2-5: livro caixa completo + RBAC granular + dashboard agregado
- 4 empresas DIFERENTES (confirmado Breno 18/Mai): **INYAC, INC, CENTINELA, ENHAC**
- Roles: **Master (cliente, read-all)** | **Pai (write receita 4 empresas)** | **Alice (write despesa INYAC)** | **Giovanna (write despesa INC)** | **Gabela (write despesa CENTINELA)** | **🅿️ 4ª pessoa→ENHAC (parking lot, "organizaremos depois")**

## Research entregue (2 deep-dives em paralelo via aios-analyst)

### Licitação (38KB, 32 fontes) — `01-research/licitacao-process-deep-dive.md`
- **Moat real = biblioteca de ACTs do cliente + matcher de similaridade edital** (SICAF não substitui ACT)
- **CRF FGTS = 30 dias** (gargalo único) → KPI "0 inabilitações por CRF vencido"
- **Conferência de concorrentes = vertical aberto** (Effecti/Conlicitação/LicitaNet não fazem bem) → exatamente o que cliente pediu
- **Modo "<30min análise rápida"** obrigatório por preclusão imediata da intenção de recurso
- TCU formalismo moderado → produto precisa classificar **sanável vs insanável**, não só listar erros
- **Águas Lindas usa Portal de Compras Públicas (privado) + PNCP** — não tem portal próprio
- **Decreto 12.807/2025** subiu dispensa para R$ 65.492 (bens) / R$ 130.984 (obras)
- WTP estimado: **R$ 200-1.500/mês** (5-30 certames = 15-210h/mês)

### Livro Caixa (21KB, 24 fontes) — `01-research/livro-caixa-deep-dive.md`
- **NÃO construir LC completo do zero** — comoditização (Conta Azul, Omie, Nibo)
- **Recomendação: HYBRID FINO** — só tabela `financial_entries` + importador OFX + Pluggy + auto-gerador BP/DRE/índices p/ editais
- **🚨 RISCO P0 NÃO-ÓBVIO:** Lei 14.133 art. 14 IV — empresas coligadas (Lei 6.404) não competem juntas. Flag `parent_group_id` + bloqueio anti-conluio
- **Sinergia única:** dados LC → BP/DRE/índices LG/SG/LC auto-gerados (Lei 14.133 art. 69) — nenhum concorrente faz
- **Open Finance BR maduro:** Pluggy R$0,50-2/conexão = R$8-32/mês para 4 CNPJs × 2 contas
- Penalidade real: Simples sem LC = exclusão de ofício + multa 10-150%

## Brief unificado entregue
`99-synthesis/PROJECT-BRIEF-18mai-expansion.md` — versão PRELIMINAR (3 opções de escopo + 15 decisões consolidadas)
`99-synthesis/BRIEFING-REAL-CONSOLIDADO.md` — **VERSÃO FINAL pós-brainstorm 18/Mai** — arquitetura unificada (não-remendo), domain model completo, 5 pipelines integrados ("Holding Virtual"), §14 com framework AIOX (D.S.P.C. + 5 portões Hormozi — todos atendidos) + posicionamento "Holding virtual para fornecedor B2B de licitação"

## Recomendação: OPÇÃO C — Sequencial Faseado (22 semanas)

| Fase | Semanas | Entrega | Marco |
|------|---------|---------|-------|
| **1** | 1-6 | Livro Caixa Multi-Empresa + RBAC + Dashboard | M1: 4 empresas, 5 users, 1 mês dados reais |
| **2** | 7-12 | Buscador Regional (PNCP + DF + AL) + Alertas | M2: 1 alerta real entregue |
| **3** | 13-22 | Doc Automation (CRF alarme + ACT matcher + Conferência + Auto-BP/DRE) | M3+M4: 1 conferência <30min + 1 anexo edital auto-gerado |

## 15 decisões pendentes pro Breno
- **A1-A4 (áudios):** confirmar grafia 4 empresas, 4ª pessoa despesa, escopo "reanálise", dashboard vs LC visível
- **B1-B5 (escopo):** Opção C confirmada? cliente real (interno/SaaS futuro)? cobrar/grátis? anti-conluio P0? stack Next.js+Supabase+Pluggy+Inngest?
- **C1-C6 (call 30min cliente+amigo+contador):** regime tributário, faturamento, ERP atual, histórico licitação, coligação real, dor #1

## Triggers
- `vai com opção C buscador` — confirma escopo Opção C e parte para Sprint 0
- `pivot buscador {A|B}` — muda pra plataforma unificada ou 2 produtos paralelos
- `audit buscador fase {1|2|3}` — avalia entrega de cada marco
- `kill buscador` — descontinua projeto
- `call cliente buscador` — agenda call 30min com cliente+amigo+contador
- `continua buscador expansion` — carrega este memory + brief

## Artefatos
- `docs/projects/buscador-licitacoes/00-context/audios-18mai/audio-*.txt` (5)
- `docs/projects/buscador-licitacoes/00-context/audios-18mai/TRANSCRIPTS-SUMMARY.md`
- `docs/projects/buscador-licitacoes/01-research/licitacao-process-deep-dive.md` (38KB)
- `docs/projects/buscador-licitacoes/01-research/livro-caixa-deep-dive.md` (21KB)
- `docs/projects/buscador-licitacoes/99-synthesis/PROJECT-BRIEF-18mai-expansion.md` (brief unificado)
- `docs/projects/buscador-licitacoes/00-context/CONTEXT.md` (atualizado com §9 expansão)
- `scripts/transcribe-audios.py` (whisper local, reutilizável)

## Status
- 🟢 Research + brief entregues autonomamente
- 🟡 Aguardando 15 decisões do Breno (Bloco A+B sozinho, Bloco C precisa call com amigo)
- ⏳ Sem dev iniciado — kickoff só após decisões fechadas

[[project-crm-novo-15mai]] — stack referência (Next.js+Supabase+Inngest) [[bridge-meta-capi-bretda]] — moat infrastructure pattern
