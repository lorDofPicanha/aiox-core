# Briefing Técnico Interno — Buscador de Licitações

**Para:** Breno (defesa técnica em call + decisões de arquitetura)
**Data:** 2026-05-19
**Status:** v1 · síntese executável das 6 mega-research files + CONTEXT.md v3
**Não compartilhar com cliente** — é o "show your work" do produto

---

## 0. TL;DR em 60 segundos

Você está construindo um **workflow-as-a-service** (não SaaS) que cobre 6 estágios da jornada de licitação pública para uma empresa-licitante + a base financeira de 3 empresas do mesmo cliente. O cliente paga **R$ 2.800/mês** (Pro tier) e economiza ~R$ 415k/ano de custo manual escondido — ROI 12×.

Tecnicamente é **1 Next.js 16 no Vercel** + **1 Supabase Postgres** + **1 fila Inngest** + **3 integrações externas** (PNCP, Pluggy Open Finance, WhatsApp Cloud API) + **2 modelos OSS embarcados** (Docling para PDF, Legal-BERTimbau para embeddings) + **2 LLMs externos** (LLM forte só pra síntese final, LLM barato pra classificação).

A diferença entre o seu produto e o que o mercado oferece (Effecti, LicitaNet, ConLicitação) está em 3 lugares: **síntese prescritiva 5-frases** (Estágio 3), **backstage integration livro-caixa↔habilitação** (Base + Estágio 4), e **verticalização regional DF** (escopo geográfico estreito). O resto cada concorrente faz mais ou menos bem.

---

## 1. Arquitetura Macro (em 1 quadro)

```
                                  ┌─────────────────┐
                                  │  CLIENTE 3 EMPS │
                                  │  WhatsApp + App │
                                  └────────┬────────┘
                                           │ push / pull
                                           ▼
┌──────────────────────────────────────────────────────────────────────────┐
│  NEXT.JS 16 (Vercel)  —  UI + API Routes + Server Actions                 │
│  ─────────────────────────────────────────────────────────────────────── │
│  /app (RSC) · /api/workflow/* · /api/webhooks/{pncp,pluggy,whatsapp}      │
└──────────────────────┬──────────────────────────────────┬─────────────────┘
                       │                                  │
                       ▼                                  ▼
        ┌──────────────────────────┐      ┌───────────────────────────────┐
        │  SUPABASE                │      │  INNGEST (event-driven jobs)  │
        │  ──────────────────────  │      │  ────────────────────────────│
        │  · Postgres 15 + RLS     │      │  · monitorar.tick (15min)     │
        │  · pgvector HNSW         │◀────▶│  · analisar.run (per edital)  │
        │  · Auth (Magic Link)     │      │  · habilitar.compile          │
        │  · Storage (PDFs)        │      │  · acompanhar.session         │
        │  · Realtime (dashboard)  │      │  · recorrer.draft             │
        │  · Edge Functions        │      │  · pluggy.sync (per acct)     │
        └──────────────────────────┘      └───────────────────────────────┘
                                                    │
                       ┌────────────────────────────┼────────────────────────────┐
                       ▼                            ▼                            ▼
        ┌────────────────────┐      ┌──────────────────────┐      ┌──────────────────┐
        │  APIs públicas BR  │      │  Open Finance        │      │  WhatsApp Cloud  │
        │  · PNCP REST       │      │  · Pluggy R$48/mês   │      │  · API Meta      │
        │  · e-Compras DF    │      │  · 3 CNPJs           │      │  · Templates HSM │
        │  · Portal Águas L. │      │  · Sync diário       │      │  · Inbound flow  │
        │  · CEIS · Caixa    │      └──────────────────────┘      └──────────────────┘
        │  · RFB · DODF      │
        └────────────────────┘
                       │
                       ▼
        ┌─────────────────────────────────────────────────────────────────┐
        │  WORKERS PYTHON (Inngest Python runtime ou Modal/Railway)        │
        │  ──────────────────────────────────────────────────────────────  │
        │  · Docling parser (PDFs editais)                                 │
        │  · Legal-BERTimbau embedder (PT-BR jurídico, 1024d)              │
        │  · LLM judge (GPT-5.1-mini ou Claude Haiku) — ACT scoring        │
        │  · LLM strong (GPT-5 ou Claude Sonnet) — síntese prescritiva     │
        └─────────────────────────────────────────────────────────────────┘
```

**3 propriedades chave da arquitetura:**

1. **Event-driven (não batch)** — Inngest dispara cada estágio quando o anterior termina. Nada de cron de 5min varrendo banco.
2. **Tudo no Supabase** — Postgres + pgvector + RLS + Auth + Storage = 1 SDK, 1 backup, 1 lugar pra debugar.
3. **Workers em runtime separado** — PDF parsing e embeddings rodam fora do hot path da request. Cliente nunca espera Docling no browser.

---

## 2. Stack Completa — cada escolha justificada

| Camada | Escolha | Por quê | Custo Fase 1 |
|--------|---------|---------|--------------|
| **Frontend** | Next.js 16 (App Router) | Você conhece. RSC + Server Actions reduzem JS no client. Vercel deploy 1-click. | $0 (Vercel Hobby ok pra MVP) |
| **DB** | Supabase Postgres 15 | RLS multi-tenant resolve isolamento 3 empresas. pgvector embutido. Storage + Auth no mesmo SDK. | $0 (free tier 500MB) → $25/mês Pro quando passar |
| **Vector store** | **pgvector** (não Qdrant/Pinecone) | <20k vetores no MVP. HNSW index escala até 10M. Não introduzir mais 1 DB. | $0 (já incluído) |
| **Queue/Jobs** | Inngest | Event-driven, retry automático, dashboard de observability nativo. Free tier 50k step/mês. | $0 → $20/mês quando passar |
| **PDF parsing** | **Docling (MIT)** + pdfplumber fallback | Docling TableFormer é melhor OSS para tabelas hierárquicas. **Não Marker (GPL-3)** nem PyMuPDF (AGPL-3) — questões de licença comercial. | $0 (compute) |
| **OCR (PDFs escaneados)** | Mistral OCR 3 (cloud) como fallback | $1-2/1000pg, top em escaneado. Só chamado se Docling falhar (<10% extraído). | <R$10/mês |
| **Embeddings** | **rufimelo/Legal-BERTimbau-large-v2** (MIT, 1024d) | State-of-art PT-BR jurídico. Fine-tuned em 30k docs. Self-host roda em 512MB RAM. | $0 |
| **Embedding fallback** | OpenAI `text-embedding-3-small` | Latência baixa pra queries do usuário; $0.02/1M tokens. **CUIDADO LGPD** — não mandar atestados com PII. | <$1/mês |
| **LLM judge (ACT match)** | GPT-5.1-mini ou Claude Haiku | ~R$0.05/judgment, latência <3s. Eval contínuo. | <R$30/mês |
| **LLM forte (síntese)** | GPT-5 ou Claude Sonnet | Estágio 3 (5 frases prescritivas) precisa de bom raciocínio. Caro mas chamado 1×/edital. | <R$50/mês |
| **Open Finance** | **Pluggy** (BR-native) | 90%+ cobertura bancos BR + PJ + PIX. Não usa BACEN direto (requer ICP-Brasil + DCR). | R$48/mês (3 CNPJs) |
| **WhatsApp** | **WhatsApp Cloud API oficial** (Meta) | Único path defensável. Baileys/Wppconnect violam TOS = risco de ban. | $0 (1000 conv/mês free), depois ~$0.005/msg |
| **Email transacional** | Resend | Magic link auth + relatórios mensais PDF. | $0 (3k/mês free) |
| **Error tracking** | Sentry | Catch silent failures. Especialmente parsing PDF. | $0 (5k events/mês) |
| **Scraping (fallback)** | Playwright + stealth plugin | Águas Lindas usa Portal de Compras Públicas (privado). PNCP é API, mas DF/AL têm portais HTML. | $0 (compute) |
| **CI/CD** | GitHub Actions + Vercel auto-deploy | Status-quo. | $0 |

**Custo total mensal estimado:**

| Fase | Clientes | Infra | Margem (R$ 2.800/mês × clientes) |
|------|----------|-------|----------------------------------|
| 1 — Piloto | 1 (grátis case-âncora) | R$ 80-220/mês | -R$ 220 (investimento) |
| 2 — Beta | 5 pagantes | R$ 700-900/mês | R$ 13.100-13.300/mês líquido |
| 3 — Escala | 50 regional DF | R$ 4.500-6.000/mês | ~R$ 134k/mês líquido |

---

## 3. Os 6 Estágios — Como Cada Um Funciona Por Dentro

### 3.1 Estágio 1 — MONITORAR

**O que faz (1 frase):** Vigia 3-5 portais públicos a cada 15min, filtra editais que casam com o perfil da empresa, manda push WhatsApp em <15min da publicação.

**Trigger:** Inngest cron `monitorar.tick` rodando a cada 15min.

**Fluxo técnico passo-a-passo:**

```
1. Inngest dispara monitorar.tick a cada 900s
   │
2. Worker consulta 4 fontes em paralelo:
   ├── PNCP API REST (api.pncp.gov.br) — search query por UF=GO,DF + data>last_tick
   ├── e-Compras DF (compras.dados.gov.br) — REST oficial
   ├── Portal Águas Lindas (Portal de Compras Públicas privado) — Playwright login + scrape
   └── DODF (Diário Oficial DF) — RSS feed parse
   │
3. Cada edital novo é normalizado pro schema `licitacao` (Postgres):
   {id, fonte, numero, orgao_id, objeto, valor_estimado, prazo_proposta,
    modalidade, anexos_urls[], status='novo', hash_dedup}
   │
4. Dedup via hash(orgao_id + numero + ano)
   │
5. Para cada empresa cliente, computa match_score:
   ── CNAE empresa × CNAE edital (override exato: 1.0; secundário: 0.7)
   ── Faixa valor empresa × valor edital
   ── Embedding cosine(objeto, perfil_empresa) via Legal-BERTimbau
   │
6. Se match_score ≥ threshold (0.65 default, ajustável por cliente):
   ── Insere em `notificacao_pendente`
   ── Inngest dispara whatsapp.send com template HSM aprovado
   │
7. Empresa recebe WhatsApp: "Novo edital · match 87% · prazo 25/Mai"
```

**Componentes envolvidos:**
- Inngest scheduled function `monitorar.tick`
- Worker Node.js puro (não precisa Python aqui)
- Cliente PNCP custom em TypeScript (~300 LOC, sem dep externa) com Zod schema validation
- Playwright headless apenas pra Águas Lindas
- WhatsApp Cloud API com template HSM "edital_novo_v1"

**APIs externas:**
- `api.pncp.gov.br/v1/consultas/contratos` (REST, sem auth, ~60 req/min informal)
- `compras.dados.gov.br/licitacoes/v1/...` (REST oficial)
- Portal de Compras Públicas (cookie-based auth, scrape com cuidado)
- `graph.facebook.com/v21.0/{phone_id}/messages` (WhatsApp Cloud)

**Dados persistidos:**
- Tabela `licitacao` (1 row por edital novo)
- Tabela `anexo_licitacao` (URLs dos PDFs, baixados sob demanda)
- Tabela `notificacao` (auditoria do que foi mandado)

**Latência alvo:** <15min do publish à chegada no WhatsApp.

**Falhas possíveis & mitigação:**

| Falha | Probabilidade | Mitigação |
|-------|---------------|-----------|
| PNCP fora do ar | Média (~1×/mês) | Retry exponencial 3×. Se persistir, alerta interno e pula tick |
| Portal Águas Lindas muda HTML | Alta (~1×/trimestre) | Snapshot do DOM. Test E2E nightly. Alerta se schema breaking |
| WhatsApp template rejeitado | Baixa (~1×/ano) | Fallback template "alerta_genérico_v1" pré-aprovado em backup |
| Rate limit PNCP (60/min) | Baixa (volume baixo) | Token bucket no cliente. Backoff |
| Duplicação por dedup falho | Média | Hash de 3 campos + UNIQUE constraint no DB |

---

### 3.2 Estágio 2 — ANALISAR 6 MESES (MOAT #1)

**O que faz:** Quando você marca interesse num edital, o sistema lê 6 meses de contratos do MESMO órgão licitante no PNCP e extrai 4 padrões objetivos.

**Trigger:** API route `POST /api/workflow/interesse/{licitacao_id}` (você toca botão "Tenho interesse" no app).

**Fluxo técnico:**

```
1. UI dispara action → Inngest event "analisar.run" {licitacao_id}
   │
2. Worker query Postgres:
   ── Pega orgao_id da licitação
   ── Query `contrato_publicado` WHERE orgao_id = X AND data >= 6 meses atrás
   │
3. Se cache vazio (primeira vez nesse órgão), enrich:
   ── PNCP /atas/{orgao} — lista atas de registro de preços
   ── PNCP /contratos/{orgao} — lista contratos efetivados
   ── Salva em `contrato_publicado` (cache 30 dias)
   │
4. Filtra por similaridade de objeto via Legal-BERTimbau:
   ── Gera embedding do objeto do edital novo (1024d)
   ── Cosine similarity contra embeddings de todos contratos do órgão
   ── Top-N (default 20) candidatos
   │
5. Extrai 4 padrões com LLM judge:
   ┌─ Vencedores recorrentes ─┐
   │ GROUP BY cnpj_vencedor   │ → top 3 CNPJs por contagem
   │ contagem últimos 6m       │
   └───────────────────────────┘
   ┌─ Preço médio aceito ─┐
   │ AVG + faixa P25-P75    │ → R$ 168k · faixa R$ 145-195k
   └────────────────────────┘
   ┌─ Requisitos não-óbvios ─┐
   │ LLM extrai ACTs/certs   │ → "83% apresentaram ISO 9001"
   │ comuns no histórico     │
   └─────────────────────────┘
   ┌─ Motivos de desclassificação ─┐
   │ LLM lê atas de pregão           │ → "5 de 12 por CRF expirado"
   └─────────────────────────────────┘
   │
6. Resultado vira `analise_orgao` row, com source_pages citadas
   │
7. Push WhatsApp: "Análise pronta — 4 padrões extraídos. Abrir →"
```

**Componentes envolvidos:**
- Worker Python (Inngest Python runtime ou Modal) — precisa Legal-BERTimbau loaded em RAM
- LLM judge (Claude Haiku ou GPT-5.1-mini) — 1 call de extração de padrões
- pgvector HNSW index na coluna `embedding` da tabela `contrato_publicado`

**APIs externas:**
- PNCP `/atas/{orgao_id}` e `/contratos/{orgao_id}`
- LLM provider (Anthropic ou OpenAI)

**Dados persistidos:**
- `contrato_publicado` (cache de 30 dias por órgão, 1024d embedding indexed)
- `analise_orgao` (1 row por (licitacao_id, orgao_id) — os 4 padrões)
- Source pages: cada padrão tem `{contrato_id, ata_id, pagina}` pra rastreabilidade

**Latência alvo:** <90 segundos no path quente (cache hit órgão); 5-10min no cold (primeira vez no órgão).

**Por que isso é MOAT (não trivial copiar):**
- Effecti/ConLicitação fazem **análise histórica** desde 2024, sim — MAS:
  - Eles entregam lista bruta de contratos vencidos
  - Você entrega **4 padrões prescritivos com fonte citada**
  - Diferença é o LLM judge + a curadoria do que mostrar
  - Concorrente teria que retreinar pipeline e mexer em UX — 6-12 meses de esforço

**Falhas:**

| Falha | Mitigação |
|-------|-----------|
| Órgão tem <5 contratos em 6m | Estende janela pra 12m. Se ainda <5, exibe aviso "histórico insuficiente" e pula MOAT |
| LLM alucina padrão | Cada padrão exige source citation (contrato_id + página). Se LLM não retorna source válida, descarta |
| Embedding model fora do ar (HF Hub down) | Fallback OpenAI `text-embedding-3-small` (qualidade um pouco pior, latência igual) |

---

### 3.3 Estágio 3 — INDICAR DIFERENCIAL (MOAT #2)

**O que faz:** Pega os 4 padrões do Estágio 2 + seu vault de ACTs + sua margem-padrão → gera **5 frases acionáveis** sobre como você ganha esse edital específico.

**Trigger:** Auto-disparado quando `analise_orgao.status = 'pronto'`. Não exige clique do usuário.

**Fluxo técnico:**

```
1. Inngest event "diferencial.synthesize" {licitacao_id, empresa_id}
   │
2. Worker carrega contexto:
   ── analise_orgao (4 padrões + fontes)
   ── empresa.vault_acts (ACTs próprios, embeddings indexados)
   ── empresa.margem_minima_pct (config do cliente)
   ── empresa.certificacoes_ativas (ISO, ABNT, etc)
   │
3. Constrói prompt para LLM forte (GPT-5 ou Claude Sonnet):
   "Você é consultor de licitação. Dados:
   - Edital X (objeto, valor, prazo)
   - Histórico órgão (4 padrões)
   - Vault do cliente
   Entregue 5 frases acionáveis. Cite fonte de cada uma."
   │
4. LLM retorna JSON estruturado:
   {
     preco: "Vencedores cobraram R$160-195k. Sua margem comporta R$172k confortável."
            sources: [contrato_id_1, contrato_id_2, ...]
     diferencial: "83% vencedores ofereceram garantia 24m. Você não oferece."
            sources: [contrato_id_3, contrato_id_4]
     concorrencia: "3 CNPJs dominam 80%. Empresa Y tem CRF vencido 2x — vulnerável."
            sources: [contrato_id_5, ceis_check]
     risco: "41% derrotas por ACT objeto incompatível. Confirme antes."
            sources: [ata_id_1, ata_id_2]
     tempo_submeter: "manhã" | "final" | "neutro" (baseado em padrão observado)
   }
   │
5. Validação:
   ── Cada frase tem source citado? sim/não
   ── Source IDs existem no DB? sim/não
   ── Se qualquer "não" → retry 1x com prompt mais estrito, depois fallback
   │
6. Salva em `diferencial` row + push WhatsApp:
   "Diferencial pronto pra DF-2026-1234 · 5 pontos · 60s leitura"
```

**Por que isso é MOAT:**
- Síntese prescritiva (não descritiva) é o que falta no mercado
- LLM forte + grounding com source citation = não é "ChatGPT genérico", é especialista verificável
- 5 frases é DESIGN — não 50 bullets, não relatório de 5 páginas. Cliente lê no celular em 60s

**Custo:** ~R$ 0.30-1.50/edital (1 call LLM forte). Pode cachear por (orgao, objeto_cluster) 30 dias.

**Falha crítica:** LLM cita source que não existe → bloquear e fallback pra texto descritivo do Estágio 2.

---

### 3.4 Estágio 4 — HABILITAR (PRODUCTION GRADE)

**O que faz:** De 4h refazendo dossiê → 28min revisando. Sistema cruza exigência do edital com vault, alerta o que falta, compila PDF unificado.

**Trigger:** API `POST /api/workflow/habilitar/{licitacao_id}` (você decide participar).

**Fluxo técnico:**

```
1. Inngest event "habilitar.compile" {licitacao_id, empresa_id}
   │
2. Worker baixa anexos do edital (PDFs do PNCP):
   ── Salva em Supabase Storage (path: editais/{id}/anexo-{N}.pdf)
   ── Hash SHA-256 pra dedup
   │
3. Docling parser extrai exigências:
   ── Subprocess Python: docling.convert(pdf) → markdown + tables
   ── LLM judge lê markdown e estrutura:
      {habilitacao_juridica: [...], regularidade_fiscal: [...],
       qualificacao_economica: {documentos, indices_minimos: {LG, LC, SG}},
       qualificacao_tecnica: {acts, registros}}
   ── parsing_confidence calculado (0-1)
   ── Se confidence < 0.7 → mostra aviso "revisar manualmente"
   │
4. Cruzamento exigência × vault (paralelo):
   │
   ├─ Certidões (CRF FGTS, CND Fed/Est/Mun, CNDT, CNDP):
   │   ── Query vault_certidao da empresa
   │   ── Se vencida ou vencendo <7d → flag warning
   │   ── 1-click renew (chama API Caixa pra CRF — funciona)
   │
   ├─ BP/DRE: gerado automaticamente do livro caixa (ver §4 Base)
   │   ── Função SQL `gen_bp(empresa_id, exercicio)` retorna BP estruturado
   │   ── Calcula índices LG/LC/SG (fórmulas Lei 14.133 art. 69)
   │   ── Se LG < 1 e edital exige LG ≥ 1 → flag + sugere fallback (art. 69 §3º, capital integralizado 10%)
   │
   └─ ACTs (Atestados Capacidade Técnica):
       ── Para cada exigência do edital, busca top-N ACTs do vault via cosine similarity
       ── LLM judge pontua cada par (ACT, exigencia) com rubric:
           score = 0.4*objeto + 0.3*valor + 0.2*temporal + 0.1*emissor
           - Auto-atestado (mesmo grupo) → score 0 + flag insanável
           - >5 anos serviço contínuo → score ≤ 3
       ── Threshold ≥ 6 = APTO; 4-6 = DUVIDOSO; <4 = INSUFICIENTE
   │
5. Compile final PDF:
   ── pdf-lib (MIT, JS puro) costura todos os documentos na ordem do edital
   ── Capa + índice + bookmarks
   ── Cada documento com marca d'água "anexo N — exigência X"
   │
6. Upload no Storage + push WhatsApp:
   "Dossiê DF-2026-1234 pronto · 28min · 1 alerta CRF FGTS vencendo em 5d"
```

**APIs externas:**
- PNCP (baixar anexos)
- API Caixa (renovar CRF FGTS — endpoint público com CNPJ)
- API RFB (consulta CND, via Receita.ws ou direto)

**Componentes pesados:**
- Docling roda em worker async (não bloqueia UI)
- Pode demorar 8-30s/edital — paga uma vez por edital, cacheia parse

**Dados persistidos:**
- `dossie` row {licitacao_id, empresa_id, pdf_url, exigencias_status, flags}
- `audit_dossie` (cada modificação registrada — LGPD + LAI)

**Latência alvo:** 28 minutos do clique ao PDF pronto (95% do tempo é seu revisar, não o sistema).

**Falhas:**

| Falha | Mitigação |
|-------|-----------|
| Docling não extrai tabela | Fallback pdfplumber + LLM extraction. Se ainda falhar, Mistral OCR ($1-2/1000pg) |
| ACT matcher F1 < 0.75 | Bloquear feature, ir manual. Eval offline antes Sprint 4 (gate KILL se MAPE>15% ou hit<50%) |
| API Caixa fora do ar | Mostra aviso "renovar manual no portal Caixa" + link |
| Edital tem exigência sem match no vault | Cliente é avisado claramente: "Você não tem ACT pra exigência X — busque ou desista" |

---

### 3.5 Estágio 5 — ACOMPANHAR SESSÃO

**O que faz:** No momento que alguém é declarado vencedor da sessão pública, sistema baixa todos os docs dele e roda 4 verificações automáticas em <3min.

**Trigger:** PNCP webhook (se disponível) OU polling de 30s no `licitacao.status` durante janela conhecida da sessão.

**Fluxo técnico:**

```
1. Inngest scheduled "acompanhar.poll" durante janela sessão (start ± 4h)
   ── A cada 30s, query PNCP /sessoes/{id}/status
   │
2. Quando status muda pra "vencedor_declarado":
   ── Captura cnpj_vencedor, valor_homologado, documentos[]
   ── Inngest event "acompanhar.verify" {licitacao_id, cnpj}
   │
3. Worker baixa anexos do vencedor (proposta, ACTs, certidões)
   │
4. Roda 4 verificações em paralelo:
   ┌─ CRF FGTS vencedor ────────────────────┐
   │ GET https://consulta-crf.caixa.gov.br  │ → vencido/válido + data
   └────────────────────────────────────────┘
   ┌─ CND Federal ───────────────────────┐
   │ GET RFB consulta (servicos.receita) │ → status
   └─────────────────────────────────────┘
   ┌─ CEIS + CNJ Improbidade ─────────────┐
   │ GET portaldatransparencia.gov.br/api │ → match nos sócios
   └──────────────────────────────────────┘
   ┌─ ACT compatibilidade ────────────────┐
   │ Docling parse ACT vencedor           │
   │ LLM judge: objeto_act vs exigencia   │
   │ score 0-10                           │
   └──────────────────────────────────────┘
   │
5. Classifica achados:
   ── INSANÁVEL = CRF vencido, sócio em CEIS (sem chance de saneamento)
   ── DUVIDOSO = ACT objeto similar mas não idêntico (juiz decide)
   ── SEM BRECHA = tudo conforme
   │
6. Calcula score_recurso (0-10):
   ── 1 insanável → score ≥ 8 (recurso forte recomendado)
   ── só duvidoso → score 4-6 (decisão tática)
   ── sem brecha → score 0 (não recorrer)
   │
7. Push WhatsApp com relatório anexo + score
```

**APIs externas:**
- PNCP `/sessoes/{id}/status`
- consulta-crf.caixa.gov.br (form-based, scrape com Playwright)
- RFB (Receita.ws ou direto)
- portaldatransparencia.gov.br/api-de-dados (CEIS, CNJ)

**Latência alvo:** <3 minutos do "vencedor declarado" ao push WhatsApp.

**Crítico:** essa janela é onde a **preclusão** acontece. Lei 14.133 art. 165 — manifestação de intenção tem que ser **imediata na sessão**. Se você descobre 1 dia depois, perdeu.

---

### 3.6 Estágio 6 — RECORRER

**O que faz:** Se Estágio 5 retornou score_recurso > 5, gera minuta de manifestação de intenção em 30s.

**Trigger:** Auto-disparado se `verificacao.score_recurso > 5` E cliente respondeu "sim, recorrer" no push do Estágio 5.

**Fluxo técnico:**

```
1. Inngest event "recorrer.draft" {licitacao_id, achados[]}
   │
2. RAG jurídico:
   ── Vector search em corpus indexado:
       · Lei 14.133/2021 (full text, chunked por artigo)
       · Lei 10.520/2002
       · Súmulas TCU consolidadas (~200 súmulas)
       · Acórdãos TCU referenciados (~50 chave)
   ── Pra cada achado do Estágio 5, recupera 2-3 fundamentos legais
   │
3. LLM forte gera minuta com template:
   "EXMO. PREGOEIRO ...
    A empresa [seu CNPJ] manifesta interesse em recorrer pelos seguintes motivos:
    1. [Achado A] — fundamento [Lei 14.133 art. X, Acórdão TCU Y]
    2. [Achado B] — fundamento [...]
    Aguardamos prazo de 3 dias úteis para razões finais."
   │
4. Validação obrigatória:
   ── Cada citação legal existe? (lookup contra corpus)
   ── Súmula citada é vinculante ou orientadora? (label correto)
   ── Se qualquer "não" → bloqueia e pede revisão humana
   │
5. PDF gerado (pdf-lib) + assinatura digital opcional (ICP-Brasil A1)
   │
6. Push WhatsApp: "Minuta pronta · 5min leitura · enviar até 18:00 hoje"
   │
7. Sistema agenda task em D+3 úteis: "razões finais"
```

**APIs externas:** Nenhuma em tempo de geração (corpus jurídico é indexado offline).

**Componentes:**
- Vector store de jurisprudência (pgvector outra namespace)
- LLM forte (mesma escolha do Estágio 3)
- pdf-lib pra assinar e gerar PDF

**Princípio crítico (Justen Filho):** **citação legal e jurisprudência devem ser referenciadas, não inventadas**. Validação obrigatória contra corpus indexado.

**Falha potencial:** LLM inventa súmula TCU. Mitigação: validador lookup contra corpus + flag se citação não verificada.

---

## 4. A BASE — Livro Caixa 3 Empresas

**O que faz:** App de celular onde a família lança receita/despesa das 3 empresas em <10s/lançamento. Open Finance importa transações bancárias automaticamente. IA classifica em conta contábil. **Auto-BP/DRE alimenta o Estágio 4 da empresa-licitante sem precisar contador no caminho.**

### 4.1 Modelo de dados (8 tabelas core)

```sql
-- Companies (3 rows: licitante + 2 gestão)
CREATE TABLE empresa (
  id uuid PRIMARY KEY,
  cnpj text UNIQUE,
  razao_social text,
  regime_tributario text CHECK (regime IN ('SN', 'LP', 'LR')),
  atua_em_licitacao boolean DEFAULT false,
  parent_group_id uuid -- pra anti-conluio Lei 14.133 art. 14 IV
);

-- Users + roles (RBAC granular)
CREATE TABLE usuario (
  id uuid PRIMARY KEY,
  email text UNIQUE,
  nome text
);

CREATE TABLE role (
  usuario_id uuid REFERENCES usuario,
  empresa_id uuid REFERENCES empresa,
  papel text CHECK (papel IN ('master', 'receita', 'despesa', 'leitor')),
  PRIMARY KEY (usuario_id, empresa_id, papel)
);
-- master = cliente (vê tudo, edita tudo)
-- receita = pai (lança receita, vê só categorias dele)
-- despesa = N pessoas (uma por empresa, lança só despesa da empresa dela)
-- leitor = contador externo (read-only)

-- Plano de contas (seed ITG 1000 customizado, não editável Fase 1)
CREATE TABLE plano_contas (
  codigo text PRIMARY KEY, -- '1.1.01' Caixa, etc
  descricao text,
  grupo text, -- ativo/passivo/pl/receita/despesa
  natureza text -- circulante/longo prazo/etc
);

-- Transactions (livro caixa)
CREATE TABLE transacao (
  id uuid PRIMARY KEY,
  empresa_id uuid REFERENCES empresa,
  data date,
  valor numeric(15,2),
  conta_codigo text REFERENCES plano_contas,
  descricao text,
  origem text CHECK (origem IN ('manual', 'pluggy', 'ocr_nota')),
  pluggy_transaction_id text,
  usuario_id uuid,
  status text CHECK (status IN ('pendente', 'aprovada')),
  created_at timestamptz DEFAULT now()
);

-- Bank connections (Pluggy)
CREATE TABLE conexao_bancaria (
  id uuid PRIMARY KEY,
  empresa_id uuid REFERENCES empresa,
  pluggy_item_id text UNIQUE,
  banco text,
  status text,
  last_sync_at timestamptz
);

-- Storage para anexos (nota fiscal, comprovante PIX)
CREATE TABLE anexo (
  id uuid PRIMARY KEY,
  transacao_id uuid REFERENCES transacao,
  storage_path text, -- bucket Supabase
  tipo text -- 'nf' | 'comprovante' | 'contrato'
);

-- Audit log (LGPD)
CREATE TABLE audit (
  id uuid PRIMARY KEY,
  user_id uuid,
  acao text, -- 'view' | 'edit' | 'export' | 'delete'
  recurso text, -- 'transacao' | 'empresa' | etc
  recurso_id uuid,
  ip inet,
  created_at timestamptz DEFAULT now()
);
```

### 4.2 RLS multi-tenant (RBAC granular)

```sql
-- Exemplo: tabela transacao
CREATE POLICY transacao_visivel_pra_usuario ON transacao FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM role
    WHERE role.empresa_id = transacao.empresa_id
      AND role.usuario_id = auth.uid()
      AND role.papel IN ('master', 'receita', 'despesa', 'leitor')
  )
);

CREATE POLICY transacao_editavel_so_quem_pode ON transacao FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM role
    WHERE role.empresa_id = transacao.empresa_id
      AND role.usuario_id = auth.uid()
      AND role.papel IN ('master', 'receita', 'despesa')
  )
);
```

**Cuidado #1 performance:** SEMPRE index em `(empresa_id, usuario_id)` em `role` — MakerKit aponta isso como #1 causa de queries de 3min em RLS Supabase.

### 4.3 Fluxo de lançamento via Open Finance (típico)

```
14:00 — Pluggy sync agendado pra empresa A
   │
   ├── Pluggy retorna 8 transações novas
   │
14:55 — Worker classifica:
   ├── Boleto · "FORNEC X" · R$1500 → sugere conta "3.1.05 Fornecedores"
   ├── PIX · "Energia BR" · R$380 → sugere "3.1.08 Energia Elétrica"
   └── etc (regras + LLM cheap como fallback)
   │
   └── Status = 'pendente', empresa_id A
   │
14:55 — WhatsApp push pra usuária designada empresa A:
       "8 transações novas em [Empresa A], aguardando aprovação"
   │
14:56 — Usuária abre app PWA:
   ├── Vê 8 cards
   ├── Cada card: data + valor + categoria sugerida + descrição
   ├── Tap "OK" = aprova; tap edit = corrige categoria + treina modelo
   └── 3 min depois, tudo aprovado, dashboard atualiza
   │
14:59 — Auto-trigger:
       SELECT gen_bp(empresa_a_id, 2026) → atualiza snapshot BP/DRE
       → fica pronto pra Estágio 4 sempre que houver edital
```

### 4.4 Por que isso é MOAT (Backstage Integration)

Effecti não tem livro caixa. ConLicitação não tem Open Finance. Você tem **a base financeira da empresa rodando em background**, gerando BP/DRE atualizado em tempo real. Quando o Estágio 4 precisa de "BP último exercício + LG/LC/SG", **não precisa pedir nada pro contador** — está vivo no sistema.

Concorrente teria que construir um sistema contábil multi-tenant inteiro pra replicar isso. Tempo estimado: 12-18 meses + parceria com contadores BR. Não vão fazer.

---

## 5. Fluxo de Dados Entre Estágios (visão integrada)

```
                          LIVRO CAIXA 3 EMPRESAS
                          (Pluggy + categorização IA)
                                    │
                                    │ alimenta sempre
                                    ▼
                          ┌──────────────────────┐
                          │  empresa_snapshot    │ ← BP/DRE/índices vivos
                          │  (refreshed daily)   │
                          └──────────┬───────────┘
                                     │
   ┌─────────────┐                   │
   │  PNCP       │                   │
   │  + portais  │── novos editais ──┤
   └─────────────┘                   │
                                     ▼
   Estágio 1 ──► licitacao row + match_score ──► WhatsApp push
                                     │
                                     │ você marca interesse
                                     ▼
   Estágio 2 ──► analise_orgao (4 padrões + fontes)
                                     │
                                     │ auto
                                     ▼
   Estágio 3 ──► diferencial (5 frases prescritivas)
                                     │
                                     │ você decide participar
                                     ▼
   Estágio 4 ──► dossie PDF (usa empresa_snapshot acima!)
                                     │
                                     │ submete
                                     ▼
   Estágio 5 ──► verificacao do vencedor + score_recurso
                                     │
                                     │ se score > 5
                                     ▼
   Estágio 6 ──► minuta recurso
```

**Chave:** o snapshot do livro caixa é referenciado pelo Estágio 4 sem necessidade de pedir nada pro cliente. **Isso é o que faz o sistema funcionar como workflow integrado, não como ferramenta isolada.**

---

## 6. Custos Operacionais Detalhados (Fase 2: 5 pagantes)

| Linha | Fornecedor | Custo/mês | Quando paga mais |
|-------|-----------|-----------|------------------|
| Vercel | Vercel | R$ 0 (Hobby) | R$ 100 quando passar bandwidth |
| Supabase | Supabase | R$ 130 (Pro) | R$ 130 fixo, +R$ 0.125/GB extra |
| Pluggy | Pluggy.ai | R$ 240 (5 empresas × R$48) | Linear com clientes |
| LLM (judge + síntese) | Anthropic ou OpenAI | R$ 150-300 | Cresce com volume de editais |
| WhatsApp Cloud | Meta | R$ 50-100 | Após 1000 conv/mês free |
| Mistral OCR fallback | Mistral | R$ 10-30 | Só PDFs escaneados |
| Resend | Resend | R$ 0 (até 3k email/mês) | R$ 50 plano Pro |
| Sentry | Sentry | R$ 0 (5k events/mês) | R$ 130 plano Team |
| Domínio + SSL | Cloudflare | R$ 10 | Fixo |
| **TOTAL** | | **R$ 590-810/mês** | (1 cliente: ~R$ 180; 50 clientes: ~R$ 5k) |

**Receita Fase 2:** 5 × R$ 2.800 = R$ 14.000/mês
**Margem Fase 2:** R$ 13.190-13.410/mês (~94%)

---

## 7. O Moat Técnico — 3 Camadas Defensáveis

| Camada | O que é | Por que concorrente não copia rápido |
|--------|---------|--------------------------------------|
| **1. Síntese prescritiva** | 5 frases acionáveis com source citation | Effecti entrega lista bruta. Mudar pra prescritivo exige retreinar pipeline + reescrever UX = 6-12 meses |
| **2. Backstage integration** | Livro caixa ↔ Estágio 4 sem contador | Concorrente precisaria construir sistema contábil multi-tenant + parceria Pluggy = 12-18 meses |
| **3. Vertical regional DF** | Águas Lindas + DF + Federal-DF, customizado | Concorrente nacional não desce nesse nível (não vale ROI). Concorrente local não tem capital pra construir |

**O que NÃO é moat (transparente):**
- Análise histórica 6m: Effecti já faz (mas bruta, não prescritiva)
- ACT matcher: técnica conhecida, mas vault privado é seu
- WhatsApp push: qualquer um pode fazer
- PDF parsing: tecnologia commodity (Docling MIT)

---

## 8. Riscos Técnicos & Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| PNCP API muda schema sem aviso | Baixa (governo é lento) | Alto | Schema validation com Zod. Test E2E nightly. Alerta se breaking |
| LLM allucina padrão / cita source falsa | Média | Alto | Source validation obrigatória. Bloqueia entrega se inválido |
| Docling não extrai bem PDF Águas Lindas (escaneado) | Alta | Médio | Mistral OCR fallback. Aviso "revisar manualmente" se confidence baixa |
| Pluggy fora do ar | Baixa | Médio | Upload manual OFX como Plano C |
| WhatsApp Cloud ban (improvável mas crítico) | Muito baixa | Crítico | Template HSM aprovado oficial. Não usa Baileys. Plan B: email + push web |
| ACT matcher F1 < 0.75 em produção | Média | Crítico (pode ser killbut) | Eval offline antes Sprint 4. Gate KILL se F1<0.75 em produção real |
| Cliente pai (60+) não consegue usar app | Alta | Crítico (UX) | WhatsApp Bot Sprint 1 (não 6). Onboarding presencial primeiro mês. UX teste com pai antes de scale |
| LGPD: PII em ACTs vai pra LLM externo | Média | Alto | Anonimização antes de chamar OpenAI. Self-host Legal-BERTimbau (não sai dado). DPA com fornecedores |
| Vault do cliente cresce e RLS fica lento | Média (quando passar 10k rows) | Médio | Index em (empresa_id, usuario_id). Particionar por empresa se virar gargalo |
| Bug arquitetural só visível em 50 clientes | Alta | Médio | Stress test sintético pré-Fase 3. Load test Inngest concurrent |

---

## 9. Gates Pré-Sprint (KILL conditions)

Antes de cada sprint, validar:

| Sprint | Gate | Se falhar |
|--------|------|-----------|
| **Sprint 0** | Discovery call com cliente (6 perguntas) responde claramente quais 3 empresas + qual licita | Pausa até obter info |
| **Sprint 1** | WhatsApp Bot funcional + Pluggy OAuth + Pai conseguiu lançar 5 despesas sem ajuda em <5min | Pivot UX antes de continuar |
| **Sprint 4** | ACT matcher F1 ≥ 0.75 em eval offline com 50 pares rotulados | Bloqueia feature, manual-only |
| **Sprint 4** | Docling parsing_confidence ≥ 0.7 em 80% dos editais do cliente | Adicionar Mistral fallback antes |
| **Sprint 6** | 1º edital ganho via Estágio 3 (diferencial) — proof of moat | Reconsiderar pricing model |
| **Sprint 8** | Pelo menos 1 recurso ganho via Estágio 6 dentro do prazo | Pivot Sprint 6 prioridade |

**Master kill criterion (Polymarket lesson):** Se ao final Sprint 4 nenhum estágio entregou valor mensurável (≥1 edital ganho via plataforma OU ≥10 horas/mês recuperadas verificadas), **considerar KILL** ou pivot pra serviço puramente consultivo.

---

## 10. Glossário Técnico Rápido

| Termo | O que significa no contexto do projeto |
|-------|----------------------------------------|
| **PNCP** | Portal Nacional Contratações Públicas — API REST oficial gov.br |
| **OCDS** | Open Contracting Data Standard — schema JSON normalizado BR (já existe) |
| **RLS** | Row-Level Security — feature Postgres usada pra multi-tenant |
| **HNSW** | Algoritmo de index pra vector search (pgvector usa) |
| **HSM** | Highly Structured Message — template WhatsApp pré-aprovado Meta |
| **AVD/DPA** | Acordo Vinculante de Dados / Data Processing Agreement — LGPD |
| **ICP-Brasil** | Infraestrutura de Chaves Públicas Brasil — certificado digital |
| **ITG 1000** | Resolução CFC 1.418/2012 — plano de contas simplificado BR |
| **ACT** | Atestado de Capacidade Técnica — doc que comprova experiência |
| **CRF** | Certificado de Regularidade do FGTS (Caixa) |
| **CND** | Certidão Negativa de Débitos (Federal/Estadual/Municipal/Trabalhista) |
| **SICAF** | Sistema de Cadastro Unificado de Fornecedores |
| **CEIS** | Cadastro Empresas Inidôneas e Suspensas (Portal Transparência) |
| **ARP** | Ata de Registro de Preços |
| **LG/LC/SG** | Liquidez Geral / Corrente / Solvência Geral (índices Lei 14.133 art. 69) |
| **Preclusão** | Perda do direito de recorrer por não manifestar intenção a tempo |
| **MAPE** | Mean Absolute Percentage Error — métrica eval do ACT matcher |

---

## 11. Como Defender Em Call

Se cliente perguntar...

> **"Mas isso é IA? Não vai alucinar?"**

"Toda saída tem source citation obrigatória. Se o sistema não consegue citar fonte (contrato N, página X), ele não entrega — pede revisão. Cito Justen Filho: 'citação legal deve ser referenciada, não inventada' — está hardcoded na validação."

> **"Como você sabe que isso vai funcionar antes de construir?"**

"3 gates de kill estão definidos: F1 do ACT matcher ≥ 0.75, parsing_confidence ≥ 0.7, e 1 edital ganho via diferencial no Sprint 6. Se qualquer gate falhar, pivot ou kill. Não vou queimar 22 semanas se Sprint 4 mostrar que não funciona."

> **"E LGPD? Vou processar dados sensíveis das 3 empresas."**

"Dados nunca saem do Brasil. Embeddings rodam self-host (Legal-BERTimbau MIT). LLM externo recebe só objeto do edital + estatísticas agregadas, nunca CNPJ ou ACT bruto. RLS Postgres isola cada empresa. Audit log de cada acesso. Posso te mandar o DPA template com cada fornecedor (Pluggy, Anthropic, Meta) antes da assinatura."

> **"Por que não pago Effecti? É mais barato."**

"Effecti te dá alerta de edital + lista bruta de contratos. Não te diz **como ganhar** o edital específico. Você gasta 4h refazendo dossiê manualmente. Effecti não integra com seu livro caixa. Se você somar tempo perdido + 1 inabilitação evitada/trim = você paga ~R$ 415k/ano de custo escondido. Meus R$ 2.800/mês = ROI 12×. Conta fechada."

> **"E se você desistir do projeto?"**

"Esse é o ponto do **workflow-as-a-service** — você não fica refém. Cada dado seu vive no Supabase, exportável a qualquer momento. Banco de ACTs, vault, plano de contas, livro caixa: tudo seu, em formatos abertos (CSV, JSON, OCDS). Migração pra outra solução é trivial. Não vendo lock-in, vendo workflow."

---

## 12. Arquivos Referenciados

- `00-context/CONTEXT.md` — escopo, decisões, glossário do domínio
- `05-mega-research/01-data-portais-base.md` — detalhes APIs PNCP/DF/AL
- `05-mega-research/02-architect-pdf-act-recurso.md` — Docling, ACT matcher, BP/DRE detalhado
- `05-mega-research/03-analyst-moat-mercado.md` — competitor analysis, pricing
- `05-mega-research/04-ux-mobile-bot.md` — fluxos WhatsApp + app PWA + pai 60+
- `05-mega-research/05-pm-roadmap-business.md` — sprints, GTM, métricas
- `05-mega-research/06-oss-landscape.md` — stack OSS validada, licenças
- `04-deck-diagnostico-amigo/deck.html` — deck 13 slides cliente (problema → workflow → valor → CTA)
- `06-deck-workflow-cliente/deck.html` — deck 10 slides cliente (workflow + cada estágio)

---

*Briefing técnico interno v1 · 2026-05-19 · Buscador de Licitações · Para defesa em call com cliente + decisões de arquitetura interna*
