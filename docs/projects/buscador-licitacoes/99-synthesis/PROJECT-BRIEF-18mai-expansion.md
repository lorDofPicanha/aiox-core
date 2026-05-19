# PROJECT BRIEF — Expansão de Escopo 18/Mai/2026

**Projeto:** Buscador de Licitações DF + Águas Lindas-GO
**Cliente:** Amigo do Breno — fornecedor B2B regional, 4 empresas
**Status:** Research-phase → **escopo expandido** com novos sinais do cliente
**Autor:** Orion (aios-master) — síntese autônoma
**Inputs consumidos:**
1. 5 áudios WhatsApp PTT (10:57–11:01 BRT 18/Mai) → `00-context/audios-18mai/`
2. Licitação Process Deep Dive (Atlas) → `01-research/licitacao-process-deep-dive.md`
3. Livro Caixa Deep Dive (Atlas) → `01-research/livro-caixa-deep-dive.md`
4. CONTEXT.md existente (14/Mai)

---

## 1. O QUE O CLIENTE PEDIU (DECODIFICADO DOS ÁUDIOS + ESCLARECIMENTOS 18/MAI)

### 1.1 Áudio 1 — FORA DESTE ESCOPO ✅ (esclarecido pelo Breno 18/Mai)
> *"Hoje, quando a gente quer desclassificar [...] a gente quer pedir uma reanálise — só que é um processo manual."*

**Esclarecimento do user:** *"Ela estava falando de outra coisa, de um processo que a empresa faz."*

**Implicação:** o áudio 1 NÃO é sobre licitação / recurso / conferência de concorrentes. É **outro processo operacional interno da empresa do amigo** ainda não descoberto. Fica em **parking lot** até cliente detalhar.

O componente "Doc Automation" da Fase 3 (ACT matcher + conferência de concorrentes + auto-BP/DRE) **continua válido** — ele vem da **research** sobre o nicho de licitação (gargalos reais identificados), **não** do áudio 1.

### 1.2 Módulo Livro Caixa (áudios 2-5) ✅ confirmado
- **4 empresas DIFERENTES** (confirmado Breno 18/Mai) → **INYAC, INC, CENTINELA, ENHAC** (CNPJs distintos)
- **RBAC granular pedido explicitamente:**

| Role | Permissões | Escopo |
|------|-----------|--------|
| **MASTER** (cliente) | READ-ALL, no-write | 4 empresas |
| **Pai do cliente** | WRITE receita | 4 empresas (vê o que entra em cada conta) |
| **Alice** | WRITE despesa | INYAC apenas |
| **Giovanna** | WRITE despesa | INC apenas |
| **Gabela** | WRITE despesa | CENTINELA apenas |
| **(4ª pessoa — TBD)** | WRITE despesa | ENHAC apenas — *parking lot, organiza depois (Breno 18/Mai)* |

- **Features pedidas:** entrada/saída + despesas fixas/variáveis + investidores + centros de custo + dashboard agregado (receita ano/mês/semana + ranking de consumo por empresa)

### 1.3 Parking lot (descobrir depois)
- 🅿️ **"Outro processo da empresa"** (áudio 1) — pedir cliente detalhar em call
- 🅿️ **Despesa-ENHAC: quem insere?** — organiza junto com os roles depois

---

## 2. INSIGHTS-CHAVE DA RESEARCH

### 2.1 Licitação (do deep-dive de 38KB)

| # | Insight | Impacto produto |
|---|---------|------------------|
| L1 | **PNCP é o eixo único legalmente garantido de transparência** (Lei 14.133 art. 174) — edital + anexos + docs do vencedor são públicos | Toda data-fonte é pública, sem TOS risk |
| L2 | **Conferência de concorrentes só vira possível após declarar vencedor** | Monitorar status do certame, disparar análise apenas no momento "docs publicados" — não scraping cego |
| L3 | **Manifestação de intenção de recurso é IMEDIATA** (preclusão por segundos), razões em 3 dias úteis | Produto precisa **modo "análise rápida <30min"** ao detectar publicação |
| L4 | **SICAF substitui ~70% dos docs mas NÃO substitui ACT** (atestado de capacidade técnica) | **Moat real:** biblioteca curada de ACTs do cliente + matcher de similaridade |
| L5 | **CRF FGTS = 30 dias de validade** (gargalo único — todos outros ficam 90-180d) | KPI claro: "0 inabilitações por CRF vencido/ano" justifica o WTP |
| L6 | **Decreto 12.807/2025: dispensa subiu para R$ 65.492 (bens) / R$ 130.984 (obras) em 2026** | Janela "kit habilitação leve" para volume alto + ticket baixo |
| L7 | **Concorrentes brasileiros (Effecti, Conlicitação, LicitaNet, BNC) não fazem conferência avançada de concorrentes** | Vertical aberto — exatamente o que o cliente pediu |
| L8 | **TCU consolidou formalismo moderado** (Acórdão 1.211/2021): falhas sanáveis não inabilitam | Produto precisa classificar **sanável vs insanável** + dar evidência argumentativa, não só listar erros |
| L9 | **Águas Lindas usa Portal de Compras Públicas (privado) + publica no PNCP** | Scraping simplificado — PNCP é suficiente para AL |
| L10 | **WTP estimado R$ 200-1.500/mês** (5-30 certames = 15-210h/mês economizadas) | Validação econômica do build |

### 2.2 Livro Caixa (do deep-dive de 21KB)

| # | Insight | Impacto produto |
|---|---------|------------------|
| C1 | **Livro Caixa é OBRIGATÓRIO** (Simples + Presumido) — falta = exclusão de ofício + multa 10-150% | Não é decorativo |
| C2 | **Mercado SaaS BR já tem 6-8 players maduros** (Conta Azul, Omie, Nibo, Bling, Tiny, Granatum) | **Construir LC completo do zero = comoditização** |
| C3 | **Sinergia única com licitação:** dados do Livro Caixa → BP + DRE + índices LG/SG/LC (art. 69 Lei 14.133) | Nenhum competidor de licitação nem ERP financeiro tem isso |
| C4 | **🚨 RISCO P0 NÃO-ÓBVIO:** Lei 14.133 art. 14 IV veda empresas do mesmo grupo competirem juntas (Lei 6.404) | Sistema precisa flag `parent_group_id` + bloqueio anti-conluio. Esforço ~1 dia, diferenciação única |
| C5 | **Open Finance BR está maduro** (Pluggy, Belvo) — R$0,50-R$2/conexão | 4 CNPJs × 2 contas = R$8-32/mês para conciliação automática |
| C6 | **Recomendação Atlas: HYBRID FINO** — não construir LC completo, sim tabela `financial_entries` + importador + auto-gerador de anexos editais | 4-7 semanas vs 16+ semanas se construir do zero |
| C7 | **Volume real (4 empresas pequenas-médias):** 50-300 lançamentos/mês/empresa = 200-1.200 total | Volume baixo demais para justificar dev completo |

---

## 3. ESCOPO PROPOSTO — 3 OPÇÕES

### Opção A — Plataforma Unificada Monolítica
**Modules:** Buscador + Livro Caixa hybrid fino + Análise Documental (ACT + Conferência) — tudo em 1 sistema
- **Pros:** sinergia máxima desde dia 1, 1 onboarding pro cliente, 1 base de auth/RBAC
- **Cons:** 16-24 semanas dev solo, escopo creep alto, atrasa entrega de valor

### Opção B — 2 Produtos Paralelos
**Produto 1:** Livro Caixa Multi-empresa (4-6 semanas) | **Produto 2:** Buscador + Doc Automation (10-14 semanas) — integração via API
- **Pros:** entregas paralelas se ≥2 devs, separação clara de responsabilidades
- **Cons:** solo dev → vira serial mesmo assim; integração nunca fica tão tight quanto monolito

### **Opção C — Sequencial Faseado (RECOMENDADO) 🎯**

**Fase 1 — Livro Caixa Multi-Empresa (semanas 1-6)** ← ÚNICO MÓDULO CONFIRMADO PELOS ÁUDIOS
- Entrega rápida de VALOR pro cliente (ele tem o sistema rodando em 6 semanas)
- Escopo fechado e mensurável
- RBAC granular conforme áudios (5+ roles — 4ª pessoa-ENHAC parking lot)
- 4 empresas distintas: INYAC, INC, CENTINELA, ENHAC
- Dashboard agregado: receita ano/mês/semana + ranking despesa por empresa
- Pluggy Open Finance opcional (Sprint 2)
- **🚨 Anti-conluio P0**: tabela com `parent_group_id` + bloqueio futuro de proposta dupla (vide §5 R1)

**Fase 2 — Buscador Regional (semanas 7-12)** ← Escopo original do projeto-pai
- PNCP API + scraping ComprasGov + e-Compras DF + Portal de Compras Públicas (AL)
- Filtros: CNAE + palavra-chave + valor + região (4 CNAEs do cliente)
- Alertas WhatsApp/Email
- **NÃO inclui ainda** análise documental aprofundada

**Fase 3 — Doc Automation Stack (semanas 13-22)** ← Inferida pela RESEARCH (não pelo áudio 1)
- Esta fase resolve gargalos reais identificados na licitacao-process-deep-dive (CRF 30d, ACT matcher, conferência concorrentes, índices contábeis) — *não confunde com o "outro processo" do áudio 1*
- **3a:** Vault de certidões + alarme CRF 30d (quick win — semana 13-14)
- **3b:** Biblioteca de ACTs + matcher de similaridade edital ↔ portfolio (semanas 15-18)
- **3c:** Conferência de docs do concorrente (vertical único) — modo "<30min análise rápida" (semanas 19-21)
- **3d:** Auto-geração de BP/DRE/índices a partir de `financial_entries` da Fase 1 (semana 22) — sinergia fechando o loop

**Fase 4 — "Outro processo da empresa" (TBD)** 🅿️
- Áudio 1 referenciava um processo manual que cliente quer automatizar — não-licitação
- Descobrir escopo em call com cliente após Fase 1 estabilizada
- Pode virar projeto separado dependendo da natureza

**Por que Opção C ganha:**
1. **Valor entregue em 6 semanas** (Livro Caixa funcional)
2. **Mensurabilidade**: o cliente já consegue avaliar a qualidade do produto antes de comprometer com licitação stack
3. **Descoberta natural**: durante Fase 1 a gente aprende os 4 CNPJs reais, regime tributário, contador, faturamento — tudo input crítico pra Fase 3
4. **Sinergia preservada**: Fase 3d fecha o loop usando dados já existentes da Fase 1
5. **Reduz risco solo-dev**: cada fase é independente e cancelável se algo der errado

**Total estimado:** 22 semanas (~5,5 meses) — mas com **3 marcos de valor entregue** (6w / 12w / 22w).

---

## 4. ANTI-OBJETO (O QUE NÃO VAMOS FAZER)

- ❌ **Não construir Livro Caixa fiscal completo** — sem NF-e, sem folha pagamento, sem DAS, sem ECD/ECF (use Nibo/Conta Azul/contador externo pra isso)
- ❌ **Não construir scraper cego de editais nacional** — escopo regional AL+DF (não nacional)
- ❌ **Não construir IA generativa de proposta** (pricing, técnica) — só análise documental
- ❌ **Não fazer scraping autenticado** dos portais (TOS risk) — somente APIs públicas (PNCP) e portais sem login
- ❌ **Não substituir contador** — somos camada de dados + sinergia, não escrituração legal final

---

## 5. RISCOS CRÍTICOS

### R1 — 🚨 Anti-Conluio Coligadas (Lei 14.133 art. 14 IV)
- Empresas controladas/controladoras/coligadas (Lei 6.404) **não podem competir juntas na mesma licitação**
- Se INYAC, INC, CENTINELA, ENHAC compartilham sócio → **risco operacional alto** que o sistema *pode estar viabilizando* a violação se permitir as 4 darem propostas simultâneas
- **Mitigação P0:** flag `parent_group_id` + alerta visível quando 2 empresas do mesmo grupo aparecem na mesma licitação
- **Custo:** ~1 dia dev, valor: defensável legalmente + ético

### R2 — Onboarding contábil das 4 empresas
- 4 contadores diferentes? 1 só? Vão querer importar histórico? OFX, planilha, ou começar do zero?
- **Mitigação:** call 15min com cliente respondendo as 7 perguntas críticas (§F.4 do livro-caixa-deep-dive) ANTES de qualquer dev

### R3 — Janela de recurso apertada (preclusão)
- Se prometemos análise documental rápida e ela demora >30min, cliente perde recurso
- **Mitigação:** SLA explícito + fallback humano (consultoria reativa) nos primeiros meses

### R4 — Escopo creep solo-dev
- Breno é solo dev e tem Tocks/Bretda em prioridade alta
- **Mitigação:** Fase 1 só (6 semanas) é commitment mínimo; Fases 2+ ficam re-priorizáveis

### R5 — Concorrência reagindo
- Effecti, Conlicitação têm bolsos para replicar análise de concorrentes se virar feature popular
- **Mitigação:** moat regional (relacionamento com cliente-âncora, ACTs curados, contadores parceiros)

---

## 6. DECISÕES CONSOLIDADAS (15 pontos para Breno)

### Bloco A — Áudios (resolvidos 18/Mai pelo Breno)
1. ~~**A1.** Confirmar grafia oficial das 4 empresas~~ → ✅ **4 empresas DIFERENTES** (INYAC, INC, CENTINELA, ENHAC distintas)
2. ~~**A2.** Quem insere despesas da 4ª empresa?~~ → 🅿️ **Parking lot** — "organizaremos depois"
3. ~~**A3.** O áudio 1 ("desclassificar / reanálise")~~ → ✅ **Fora deste escopo** — outro processo da empresa, não licitação
4. **A4.** Cliente quer ver o Livro Caixa também ou só o dashboard agregado? — *ainda pendente, descobre na call*

### Bloco B — Escopo (5 macro-decisões)
5. **B1.** **Confirmar Opção C (sequencial faseado)?** Alternativas: A monolítico ou B paralelo.
6. **B2.** **Quem é o cliente real?** Friend tem outra solução SaaS comercial em mente para escala? Vai virar produto? Ou é solo-dev para uso interno do amigo?
7. **B3.** **Cobrar do amigo ou grátis?** (Atlas livro-caixa recomendou grátis como case-âncora)
8. **B4.** **Anti-conluio coligadas** — Fase 1 P0 confirmado?
9. **B5.** **Stack confirmada:** Next.js 16 + Supabase + Pluggy + Inngest (mesmo padrão CRM-Novo) ou diferente?

### Bloco C — Operacionais Pré-Dev (6 perguntas pro cliente)
10. **C1.** Regime tributário das 4 empresas (Simples/Presumido/Real)?
11. **C2.** Faturamento anual de cada uma (band: <500k / 500k-3M / 3M-78M / >78M)?
12. **C3.** ERP/contador atual? Existe alguma ferramenta paga rolando? (Conta Azul? Omie? Planilha + contador externo?)
13. **C4.** Histórico de licitação: quantas/mês média últimos 12 meses? Qual taxa de vitória?
14. **C5.** As 4 empresas REALMENTE são coligadas (mesmo sócio controlador)? Ou só "amigo tem 4 negócios distintos"? (impacta R1)
15. **C6.** **Dor #1 prioridade:** se tivesse que escolher uma das 3 fases pra começar AMANHÃ, qual seria? (Livro Caixa, Buscador, ou Doc Automation)

---

## 7. PRÓXIMOS PASSOS RECOMENDADOS

### Próximas 48h
- [ ] Breno revisa este brief + os 2 deep-dives (licitação + livro caixa)
- [ ] Breno responde Bloco A + Bloco B sozinho (são decisões de produto)
- [ ] Breno agenda call 30min com amigo + Breno + (opcional) contador do amigo para Bloco C
- [ ] Confirmar grafia oficial das 4 empresas + 4ª pessoa de despesa

### Próximas 2 semanas (se Opção C confirmada)
- [ ] Sprint 0 — research adicional: validar Portal de Compras Públicas AL na prática (criar conta teste)
- [ ] Sprint 0 — validar Pluggy Open Finance com 1 CNPJ teste
- [ ] Sprint 0 — escolher provedor de auth multi-tenant (Supabase Auth nativo ou Clerk)
- [ ] Sprint 1 (semana 1) — Schema Postgres + RBAC + 1 empresa cadastrada manualmente

### Marcos
| Marco | Quando | Critério de sucesso |
|-------|--------|---------------------|
| **M1 — Livro Caixa MVP** | Semana 6 | 4 empresas cadastradas, 5 usuários com roles distintos, dashboard mostrando dados reais de 1 mês |
| **M2 — Buscador MVP** | Semana 12 | 1 alerta real disparado pro cliente sobre 1 edital relevante |
| **M3 — Doc Automation MVP** | Semana 22 | 1 conferência de docs de concorrente entregue em <30min com classificação sanável/insanável |
| **M4 — Sinergia Fechada** | Semana 22 | BP + DRE + índices auto-gerados para 1 edital real, anexados como PDF na proposta |

---

## 8. KILL GATES (quando matar / pivotar)

| Gate | Quando | Trigger pra Kill |
|------|--------|------------------|
| **Pós M1 (semana 6)** | Livro Caixa entregue | Cliente não usar por 2 semanas consecutivas → pivotar pra buscador isolado |
| **Pós M2 (semana 12)** | Buscador entregue | Cliente não abrir 60% dos alertas em 1 mês → escopo de filtros está errado |
| **Pós M3 (semana 22)** | Doc Automation entregue | Cliente recusar usar a ferramenta de conferência em recurso real → ou a UX falhou ou o moat era ilusório |

---

## 9. APÊNDICE — REFERÊNCIAS

**Documentos gerados nesta análise:**
- `00-context/audios-18mai/audio-*.txt` (5 transcrições)
- `00-context/audios-18mai/TRANSCRIPTS-SUMMARY.md`
- `01-research/licitacao-process-deep-dive.md` (38KB, 32 fontes)
- `01-research/livro-caixa-deep-dive.md` (21KB, 24 fontes)

**Fontes-âncora citadas nas 2 researches:**
- Lei 14.133/2021 (regime principal de licitações)
- Decreto 12.807/2025 (valores 2026)
- LC 123/2006 + Resolução CGSN 140/2018 (Simples + Livro Caixa)
- TCU Acórdão 1.211/2021 (formalismo moderado)
- PNCP API REST + Swagger
- Pluggy/Belvo (Open Finance BR)

---

*Síntese autônoma — Orion @ aios-master — 2026-05-18*
*Pronta pra revisão e decisões do Breno*
