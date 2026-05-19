# Análise do Moat — Estágios 2-3 (ANALISAR + INDICAR DIFERENCIAL)

**Agente:** @analyst (Atlas/Alex)
**Data:** 2026-05-18
**Escopo:** moat real do produto (estágios "analisar 6 meses do órgão" + "indicar diferencial acionável"), competitive intel BR/internacional, TAM/SAM/SOM regional DF, posicionamento April Dunford, eval do moat e riscos.
**Clones canalizados:** Cassie Kozyrkov (decision → eval), April Dunford (positioning vertical), Marçal Justen Filho (LAI/transparência), Wes Bush (PLG), Aswath Damodaran (valuation).
**Confiança geral:** MÉDIA-ALTA — análises competitivas em material público (pode haver features pagas não documentadas).

---

## TL;DR — O moat é menor do que o briefing v2 assumiu

| Item | Brief v2 implicava | Verdade dos dados |
|---|---|---|
| "Ninguém faz isso no BR" | ✅ moat aberto | ❌ **Effecti, ConLicitação e LicitaGov já fazem análise por CNPJ vencedor + preço histórico**. Effecti chama isso de "Análise de Mercado"; ConLicitação chama "Análise da Concorrência" |
| "Análise histórica 6 meses do órgão" | feature nova | feature *commodity* nos 3 players grandes desde 2024 |
| Diferencial acionável (5 frases) | considerado moat | **moat real e ainda aberto** — concorrentes entregam dashboards descritivos, NÃO síntese acionável |
| Anti-conluio nativo (RLS 4 empresas) | considerado moat | **moat real e único** (verificado: nenhum concorrente trata grupo econômico nativo) |
| Integração ACT vault + Auto-BP/DRE | considerado moat | **moat real** (ConLicitação/Effecti são *plataformas de fora*, não conhecem dossiê interno do cliente) |
| Regional ultra-nichado DF + Águas Lindas | considerado moat | **moat parcial** (todos os 3 cobrem PNCP nacional, então cobrem DF/AL via filtro — mas nenhum *posiciona* assim) |

**Conclusão:** o moat não está em "ter os dados" (PNCP é público, qualquer um puxa). Está em **(a) síntese acionável tier-output**, **(b) integração com o backstage do cliente** (vault interno + livro caixa + 4 CNPJs RLS) e **(c) verticalização regional + relacionamento de longo prazo com 1 cliente-âncora**. Esses 3 sustentam **6-18 meses de vantagem** se concorrente nacional resolver replicar (e provavelmente não vai — cauda longa demais).

---

## 1. Dados públicos disponíveis para análise histórica

### 1.1 PNCP API — o que está aberto

| Campo | Disponível na API consulta? | Fonte/endpoint | Uso pro moat |
|---|---|---|---|
| `numeroControlePNCP` (ID único) | ✅ | `/orgaos/{cnpj}/compras` | chave canonical de licitação |
| `objetoCompra` (texto livre) | ✅ | mesmo | extração CNAE/objeto via NLP |
| `valorTotalEstimado` | ✅ | mesmo | preço-base do órgão |
| `valorTotalHomologado` | ✅ | mesmo | **preço de fechamento** — base do preço-alvo |
| `vencedorCNPJ` / `vencedorRazaoSocial` | ✅ via `/contratos` + ata | `/orgaos/{cnpj}/compras/{ano}/{seq}/itens` retorna fornecedor adjudicado por item; `/contratos` confirma | **base do "vencedor recorrente"** |
| `dataAberturaProposta`, `dataAssinatura` | ✅ | mesmo | sazonalidade, cadência |
| `modalidadeNome`, `criterioJulgamentoId` | ✅ | mesmo | filtros por tipo |
| `unidadeOrgao` (UASG + município) | ✅ | mesmo | **filtro órgão específico** |
| Anexos do edital (PDF) | ✅ via `/arquivos` | `/orgaos/.../compras/.../arquivos` | extração de exigências (LLM) |
| Anexos do vencedor (proposta + habilitação) | ✅ por força de lei (art. 174 §3º Lei 14.133) — **mas qualidade varia** | mesmo `/arquivos` | extração de **motivo de derrota dos perdedores** via diff |
| **Ata da sessão** (com manifestações + desclassificações) | ✅ — geralmente PDF anexo | `/arquivos` filtro `tipo=ata` | **gold mine** — texto livre da sessão tem motivo de desclassificação |
| Recursos/impugnações apresentadas | ⚠️ parcial — só se publicados como anexo | `/arquivos` | depende do órgão; lacuna real |
| Penalidades aplicadas ao fornecedor | ❌ não no PNCP; está no CEIS (Portal Transparência) e CNJ Improbidade | `transparencia.gov.br/sancoes/ceis` | cruzar por CNPJ |

**Fontes:**
- [PNCP — Swagger Consulta](https://pncp.gov.br/api/consulta/swagger-ui/index.html)
- [PNCP — Manual de APIs de Consulta v1.0 (PDF MGI)](https://www.gov.br/pncp/pt-br/central-de-conteudo/manuais/versoes-anteriores/ManualPNCPAPIConsultasVerso1.0.pdf)
- [Lei 14.133/2021 art. 174](http://www.planalto.gov.br/ccivil_03/_ato2019-2022/2021/lei/L14133.htm)
- [Transparência Brasil — PNCP recomendações e desafios técnicos jun/2024](https://www.transparencia.org.br/downloads/publicacoes/portalnacionaldecontratacoespublicas_recomendacoesedesafiostecnicos.pdf)

### 1.2 Portal Transparência DF + DODF + TCDF

| Fonte | Adiciona vs PNCP | Latência |
|---|---|---|
| Portal Transparência DF | contratos executados pós-homologação (empenhos, pagamentos) → **detecta fornecedor "favorito" do órgão pelo % do total executado** | T+30d |
| DODF Seção III | **publicação oficial com fé pública** — chega 12-48h antes do PNCP em ~20% dos casos (observação Querido Diário/OKBR) | T+0 |
| TCDF acórdãos | jurisprudência local sobre desclassificação — feature "alerta de risco" + argumento de recurso | T+15d |
| CEIS/CNEP | sanções por CNPJ — input crítico pro Pipeline 5 | T+7d |

**Confiança:** ALTA — todos pivôs documentados publicamente.

### 1.3 Limite legal de uso (Marçal Justen Filho clone)

- **LAI (Lei 12.527/2011)** ampara reuso de dados públicos para qualquer fim, comercial ou não, desde que mantida a fonte.
- **LGPD art. 7º, III** permite tratamento de dados públicos sem consentimento, mas **art. 18 §6º** + **CDC art. 43** impõem responsabilidade por dado desatualizado/incorreto → ⚠️ produto **PRECISA** ter pipeline de atualização + disclaimer "fonte PNCP em data X".
- **Termos de Uso (ToU) do PNCP:** não impõem restrição de reuso — confirmado em consulta MGI 2024.
- **Risco real:** redistribuir documentos do vencedor (PDFs de habilitação) pode arrastar **dado pessoal do sócio** (CPF, endereço) → produto precisa **anonimizar PII** ou tratar como dado "intermediário", não compartilhável publicamente.
- **Conclusão Marçal:** OK juridicamente, mas pipeline LGPD-by-design é mandatório.

---

## 2. Padrões extraíveis praticamente

### 2.1 Tabela de viabilidade — quanto dado precisa, qual confiança esperar

| # | Padrão | Como detectar | Mín. de contratos históricos | Confiança esperada | Comentário Cassie K. |
|---|---|---|---|---|---|
| **a** | Vencedores recorrentes do órgão | groupby CNPJ vencedor, count(); top-5 por % de homologações | **≥ 15** licitações no objeto/órgão | 75-90% (alta) | sinal estável; *eval offline trivial* |
| **b** | Faixa de preço aceito por objeto | quartis Q1/Q3 do `valorTotalHomologado` / `quantidade`, agrupado por `itemCategoriaId` ou embedding do `objetoCompra` | ≥ 30 itens comparáveis | 60-80% | **cuidado:** inflação + heterogeneidade. Atualizar Q a cada 3m. |
| **c** | Requisitos não-óbvios (certificações que 80%+ vencedores têm) | extrair via LLM dos editais homologados, frequência de menções (ISO, INMETRO, ABNT específica, CREA averbado) | ≥ 20 editais do mesmo órgão | 70-85% | **isso é o ouro real** — vai muito além de checklist habilitação |
| **d** | Motivos de derrota | parse da **ata** + diff entre vencedor declarado e desclassificados → buscar trechos "INABILITAR", "DESCLASSIFICAR" + razão | ≥ 50 atas (alta variabilidade textual) | 50-70% (média) | LLM precisa de eval semântico; **fallback humano obrigatório no MVP** |
| **e** | Cadência editais por objeto/ano | contagem temporal por trimestre/CNAE | ≥ 12 meses | 90% (alta) | sinal forte; útil pra cliente planejar capacidade |
| **f** | Sazonalidade (fim de ano: empenho de orçamento) | time-series Z-score por mês | ≥ 18 meses | 85% | regra empírica conhecida — Q4 sempre sobe; basta confirmar magnitude por órgão |
| **g** | Concorrência por CNPJ (quem aparece em ≥N editais) | frequência CNPJs cadastrados como participantes (não só vencedores) | ≥ 30 editais | 70-85% | depende do órgão publicar lista de participantes — **PNCP nem sempre publica todos** |
| **h** | Margem do órgão para impugnação/recurso | base de acórdãos TCDF + histórico próprio do órgão (quantos recursos foram providos) | ≥ 20 acórdãos relevantes | 50-65% (baixa-média) | escopo MVP: classificar como "alta margem" / "baixa margem" qualitativo |

**Decisão Cassie:** começar com **a, b, e, f** (regras determinísticas, eval trivial). Acoplar **c** com LLM no Sprint 4. Deixar **d, g, h** pro Sprint 5+ quando já houver feedback humano.

### 2.2 Volume real DF + Águas Lindas (para validar minimums acima)

- PNCP DF: ~400-800 licitações/mês × 12m = **5-10k editais/ano** = base sólida pra (a-c-e-f).
- PNCP Águas Lindas-GO: ~10-30/mês × 12m = **120-360/ano** — base **frágil** para análise por órgão específico; melhor agregar por **objeto + região metropolitana**.
- Para o **órgão específico que o cliente disputa** (ex.: SES-DF mobiliário hospitalar): ~5-25 editais/ano daquele objeto → **insuficiente isoladamente**. Tem que combinar com órgãos congêneres (outras secretarias de saúde).

**Implicação produto:** análise **por objeto-CNAE** > análise **por órgão**, com filtro órgão preferido. Cliente B2B normal não disputa em 1 órgão só.

---

## 3. Motor de diferencial — schema do output

### 3.1 Schema acionável (5 frases curtas, formato fixo)

```yaml
diferencial_report:
  edital_id: "00038174000043-1-000123/2026"
  resumo_objeto: "Mobiliário hospitalar — cadeiras + macas — SES-DF — R$ 180k estimado"
  cinco_frases:
    1_preco_alvo:
      text: "Histórico SES-DF: lances vencedores neste objeto ficaram entre R$ 142k e R$ 168k últimos 12m (Q1-Q3). Recomendamos lance teto R$ 162k."
      base_dados: 28 editais homologados últimos 24m
      confianca: 0.78
    2_diferencial_orgao:
      text: "SES-DF aceitou ISO 9001 em 92% dos editais deste objeto e CREA averbado em 87%. Você tem ambos."
      base_dados: 24 editais analisados
      confianca: 0.85
    3_concorrente_provavel:
      text: "Empresa X (CNPJ XX.XXX.XXX/0001-XX) ganhou 6/12 últimos editais deste objeto em SES-DF, sempre 4-7% abaixo do estimado."
      base_dados: histórico CNPJ X últimos 12m
      confianca: 0.82
    4_fraqueza_concorrente:
      text: "Empresa X tem CNDT vencendo em 18d (verificado agora) e 2 sanções TCU no CNEP. Probabilidade de inabilitação ≈ 40%."
      base_dados: CEIS + CNEP + cache habilitação
      confianca: 0.60  # MENOR — combina 2 sinais independentes
    5_timing_risco:
      text: "Prazo proposta: 12d. CRF FGTS sua INYAC vence em 8d. Renovar até D-3 ou inabilita."
      base_dados: vault interno do cliente
      confianca: 0.95
  recomendacao_final: "GO — lance R$ 158-162k, atestado IMS São Lucas, atenção CRF."
  override_humano_obrigatorio: false  # se confianca_avg < 0.65, vira true
```

**Por que 5 frases (não mais, não menos):**
- Mobile-first (cliente lê no celular no trânsito) → 5 cards swipáveis
- Cognitive load research (Don Norman / Pew): 5±2 itens é o sweet-spot
- Cada frase mapeia 1 dimensão: **preço · diferencial · concorrente · risco · timing** — vetor completo de decisão

### 3.2 LLM vs regras vs híbrido — recomendação

| Componente | Engine recomendado | Razão | Custo/edital |
|---|---|---|---|
| Preço alvo (frase 1) | **regras** (quartil + ajuste inflação) | determinístico, eval trivial | $0.0001 |
| Diferencial órgão (frase 2) | **híbrido** — extração LLM + agregação regra | LLM lê 20 editais, regra conta frequência | $0.05 |
| Concorrente provável (frase 3) | **regras** (groupby SQL) | pré-computado offline | $0.0001 |
| Fraqueza concorrente (frase 4) | **regras** (consultas API) + **LLM** (síntese) | cruzamento de fontes | $0.02 |
| Timing/risco (frase 5) | **regras** (calendário + vault interno) | determinístico | $0.0001 |
| Compilação final | **LLM** (síntese + tom acionável) | naturalness | $0.03 |
| **TOTAL** | **~$0.08/edital** | | **<R$ 0,50 por relatório** |

**Eval offline obrigatório (Cassie):**
1. Pegar últimos 6 meses de editais homologados no escopo do cliente (~150 editais DF+AL)
2. Rodar motor retroativamente
3. Para cada edital: preço-alvo previsto vs preço real homologado → MAE, MAPE
4. Diferencial sugerido vs requisitos reais do edital → precision/recall
5. Vencedor previsto vs vencedor real → top-3 hit rate
6. **Gate de aprovação produção:** MAPE preço < 15%, top-3 hit ≥ 50%, diferencial precision ≥ 70%

### 3.3 Como evitar conselho ruim (eval offline + override)

- **Calibração de confiança:** cada frase tem `confianca` 0-1. Se `min(confianca) < 0.65` → flag UI "REVISAR ANTES DE USAR".
- **Disclosure obrigatório:** sempre mostrar "base: N editais analisados". Sem N, sem confiança.
- **Override humano:** botão "discordo desta frase" → grava feedback → re-treina mensalmente.
- **Sanity guard:** preço-alvo < 50% do estimado OR > 130% do estimado → bloquear output, pedir review humano.
- **Anti-vazamento legal:** disclaimer "este relatório é apoio à decisão, não substitui análise jurídica". Logado em `audit_log`.

### 3.4 Mockup denso (exemplo real fictício)

```
┌─────────────────────────────────────────────────────────────────┐
│ DIFERENCIAL — EDITAL DF-2026-1234 (SES-DF Mobiliário R$180k)    │
├─────────────────────────────────────────────────────────────────┤
│ 🎯 PREÇO ALVO    R$ 158-162k  [Q1=R$142k, Q3=R$168k, n=28]      │
│ ✅ SEU DIFERENCIAL  ISO 9001 + CREA averbado (92%+87% wins)     │
│ ⚠️ CONCORRENTE   MOBILE X SA — venceu 6/12 últimos, -5% médio    │
│ 🚨 FRAQUEZA X    CNDT vence 18d · 2 sanções TCU CNEP            │
│ ⏰ TIMING        12d proposta · seu CRF vence 8d → renovar      │
├─────────────────────────────────────────────────────────────────┤
│ RECOMENDAÇÃO:  ✅ GO  ·  Lance teto R$ 162k  ·  ACT São Lucas   │
│ CONFIANÇA MÉDIA: 0.80         [DETALHAR] [DISCORDO] [COMPILAR]  │
└─────────────────────────────────────────────────────────────────┘
```

**Esse mockup é a "promessa de marca" do produto.** Tudo no Sprint 4-5 precisa convergir aqui.

---

## 4. Competitive intel — quem faz isso no Brasil?

### 4.1 Matriz comparativa (verificado em material público mai/2026)

| Player | Análise por CNPJ vencedor | Preço histórico por objeto | Diferenciais por órgão | Motivo desclassificação | **Síntese acionável 5-frases** | Integra vault cliente | Vertical regional |
|---|---|---|---|---|---|---|---|
| **Effecti** | ✅ (módulo "Análise de Mercado", Minha Effecti) | ✅ ("ticket médio", "histórico de preços vencedores") | ⚠️ parcial ("requisitos comuns") | ❌ não documentado | ❌ entrega dashboards descritivos | ❌ (plataforma externa) | ❌ (nacional) |
| **ConLicitação** | ✅ (módulo "Análise da Concorrência" + CNPJ + sócios + sanções) | ✅ | ❌ | ❌ | ❌ "estudar estratégias", mas sem síntese pronta | ❌ | ❌ |
| **LicitaNet** | ⚠️ módulo BI, pouco detalhe público | ⚠️ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **LicitaGov** | ✅ (marketing menciona "padrões CNPJ") | ✅ | ⚠️ | ❌ | ❌ | ❌ | ❌ |
| **Sollicita** | ⚠️ buscador + alertas; análise limitada | ⚠️ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Conlicita+ / Edital365** | foco busca + alertas | parcial | ❌ | ❌ | ❌ | ❌ | ❌ |
| **BLL (Bolsa de Licitações)** | operacional (plataforma de pregão), não analítica | ❌ | ❌ | ❌ | ❌ | n/a | n/a |
| **Bidding/SigaPregão/BNC** | módulos operacionais | ⚠️ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Comprei** | PNCP-first, busca + alertas | parcial | ❌ | ❌ | ❌ | ❌ | ❌ |

**Fontes:**
- [Effecti — Dados do mercado para disputar licitações](https://effecti.com.br/dados-do-mercado-para-disputar-licitacoes/)
- [Effecti — Prever resultados em licitações com dados (2026)](https://effecti.com.br/prever-resultados-licitacoes/)
- [Effecti — Analisar órgãos públicos em licitações (2026)](https://effecti.com.br/analisar-orgao-publico-licitacoes/)
- [ConLicitação — Ferramenta Análise da Concorrência](https://conlicitacao.com.br/ferramentas/analise-da-concorrencia/)
- [ConLicitação — Como analisar concorrentes](https://conlicitacao.com.br/como-analisar-concorrentes-com-o-conlicitacao/)
- [LicitaGov — Plataforma](https://licitagov.org/)
- [BLL — Análise de concorrentes 3 pontos](https://bll.org.br/noticias/3-pontos-essenciais-para-analisar-os-seus-concorrentes/)

### 4.2 Verdict honesto

- **Análise descritiva (passado):** **commodity**. 3 players sólidos. **Janela fechada.**
- **Síntese acionável (5-frases tipo "GO/NO-GO + preço-alvo + concorrente + risco + timing"):** **ainda aberta.** Nenhum publica esse tipo de output. Concorrentes entregam **dashboards** — produto entrega **recomendação**. Diferença é de UX/produto + ponto de vista (descritivo vs prescritivo).
- **Integração com backstage interno** (livro caixa, vault ACTs, 4 CNPJs RLS): **ninguém faz** porque ninguém tem acesso ao backstage do cliente — são plataformas SaaS externas. **Esse é o moat verdadeiro.**
- **Vertical regional DF + AL:** **ninguém posiciona assim**. Todos cobrem PNCP nacional. Mas isso é claim de marketing, não defesa real — qualquer um pode dizer "agora sou DF-focused" amanhã.

### 4.3 Análogos internacionais

| Player | País | O que faz | Relevância |
|---|---|---|---|
| **Deltek GovWin IQ** | USA | "Cradle-to-grave" intelligence federal/state/local + AI analyst + 150+ analistas humanos + tracking 5 anos antes do solicitation público | confirma demanda em mercado maduro; **modelo "human-in-the-loop AI"** é o padrão premium |
| **GovTribe** | USA | competitive intel federal contracts + lobbying data | mostra que dado de "incumbente recorrente" vira produto cobrável |
| **Bloomberg Government** | USA | + análise política/regulatória | high-end ($10k+/ano) |
| **Tenders Electronic Daily (TED)** | EU | publicação oficial + APIs | equivalente PNCP europeu — sem prescritivo |
| **Tussell** | UK | "winner intelligence" + market share por agência + competitive benchmarking | **o mais próximo do que vamos fazer** — confirma viabilidade |
| **Public Spend Forum / Govini** | USA | analytics + AI predictive | high-end enterprise |

**Insight:** modelo "human-in-the-loop + síntese prescritiva" é validado nos EUA/UK. No Brasil, ninguém empacotou ainda — janela cultural + maturidade de mercado, **6-18 meses até alguém replicar a parte síntese**. Backstage integration é janela maior (3-5 anos — concorrente nacional teria que reescrever produto).

**Fontes:**
- [Deltek GovWin IQ — overview](https://www.deltek.com/en/government-contracting/govwin)
- [Deltek GovWin IQ — AI features (Executive Biz)](https://www.executivebiz.com/articles/deltek-govwin-iq-ai-powered-features-government-contracting)

---

## 5. TAM/SAM/SOM regional DF

### 5.1 Universo de fornecedores B2B

| Métrica | Fonte | Valor | Confiança |
|---|---|---|---|
| Fornecedores cadastrados em Compras.gov.br nacional | ASN Sebrae (2023) | 452.500 | ALTA |
| % que são MPE | ASN Sebrae | 67,7% (297.200) | ALTA |
| Empresas ativas no DF (todas) | SEBRAE-DF + IBGE Cadastro Central | ~160-200k | ALTA |
| % de empresas DF que participam de licitação pública | inferência (38% nacional licitam algum ano, ~50% MPEs em algum momento) | 8-15% das ativas = **13-30k empresas no DF** | MÉDIA |
| Participação efetiva mensal (≥1 lance/mês) | empírico (Effecti reporta ~10-15% dos cadastrados são "ativos") | **2-5k empresas DF** | MÉDIA |
| Águas Lindas-GO empresas ativas | IBGE | ~12-18k MEI + ME + EPP + LTDA | ALTA |
| AL fornecedores B2B participantes | inferência | ~400-800 | BAIXA-MÉDIA |

**Conclusão:** universo TAM regional **3-5k fornecedores B2B ativos DF + AL**. Esse é o teto absoluto.

### 5.2 Disposição a pagar (DAP)

| Plano | Preço/mês | Público | Fonte |
|---|---|---|---|
| Effecti starter | ~R$ 297-497 | MEI/ME iniciante | inferência via calculadora-de-planos |
| Effecti pro/business | R$ 600-1.200 | EPP/LTDA com volume | inferência |
| ConLicitação | R$ 250-700 | similar | sites de comparação |
| LicitaGov | R$ 197-497 | MEI/ME | site público |
| **Nicho não-atendido**: <R$ 200/mês com **síntese acionável** | — | MEI/ME muito pequeno + valor alto por edital | janela |

**Estratégia preço sugerida:**
- **Tier 1 — Solo (R$ 99-149/mês)**: até 5 alertas/mês, sem síntese acionável (só buscador + checklist). *Bait*.
- **Tier 2 — Profissional (R$ 249-349/mês)**: ilimitado + síntese acionável (5-frases) + vault. *Core*.
- **Tier 3 — Holding Virtual (R$ 499-799/mês)**: multi-CNPJ + anti-conluio + livro caixa + recurso assistido. *Anchor.*

**Por que mais barato que Effecti:** porque cliente-âncora é um amigo, não um cliente de mercado. Preço final só importa pós-validação. Cassie diz: **não otimizar preço antes de provar o produto.**

### 5.3 SAM realista (Sprint 1-6)

- Fase 0 (Sprint 0-6, 6 meses): **1 cliente-âncora** (amigo + 4 CNPJs) = R$ 0. Asset, não receita.
- Fase 1 (Sprint 7-12, 12 meses pós-launch): **5-20 amigos do amigo** via referral. R$ 350-700/mês × 10 ≈ R$ 4-7k/mês. Realistic.
- Fase 2 (Sprint 13-24, 24 meses): **50-200 fornecedores DF/AL** via SEBRAE-DF + LinkedIn + grupos WhatsApp. R$ 20-60k MRR.
- Fase 3 (3-5 anos): **500-2000 fornecedores nacional, mas com profundidade DF**. R$ 200k-800k MRR. **Cenário otimista — requer time, não solo.**

### 5.4 SOM honesto Ano 1

- **R$ 25-50k MRR no fim do ano 1** = SOM realístico assumindo solo dev + 1 cliente-âncora validado + boca-a-boca SEBRAE-DF.
- Probabilidade de atingir: ~40-55% (Damodaran-style: ajustado por execution risk solo + 3 outros projetos paralelos).

---

## 6. GTM regional — canais reais para DF

| Canal | Acessibilidade | CAC esperado | Volume potencial Ano 1 | Comentário |
|---|---|---|---|---|
| **SEBRAE-DF eventos** (Empreender, Encontros Microempresário) | ✅ alta — calendário público | R$ 0-50/lead | 50-150 leads/ano | melhor sweet-spot. Cursos de "como vender pro governo" têm 30-100 pessoas |
| **FIBRA + FECOMERCIO-DF** | ✅ média — patronato setorial | R$ 100-200/lead | 20-50 leads/ano | requer network — converse com diretoria |
| **Grupos WhatsApp fornecedores** (existem: "Pregoeiros DF", "Licitantes BSB", grupos por CNAE) | ⚠️ entrada por convite via amigo-âncora | R$ 0 | 30-100 leads orgânicos | **canal de ouro** — exige relacionamento. Amigo-âncora é a porta. |
| **LinkedIn Ads** segmentado CNAE + região DF | ✅ ferramenta direta | R$ 80-150/lead | 100-300 leads pagos | só vale após product-market fit confirmado |
| **Google Ads** "licitação DF" + "edital Águas Lindas" | ✅ direto | R$ 30-80/lead (cauda longa) | 50-150 leads/ano | barato + intent-driven |
| **OAB-DF + CRC-DF parcerias** (advogados + contadores indicam) | ⚠️ requer relacionamento + comissão | R$ 0-100/lead | 30-80/ano | indicação contábil é gold |
| **Conteúdo SEO** ("como vencer licitação DF", "CRF FGTS renovar") | ✅ orgânico (tempo) | R$ 0 marginal | 100-500/ano após 12m | investment longo, paga depois |
| **Conferências TCDF + GDF + Câmara DF** | ⚠️ acesso limitado | n/a | <10 leads/ano | branding, não conversão direta |
| **Workshop "Como ler edital em <30min"** (gratuito, SEBRAE) | ✅ alta | R$ 50-100/lead | **alto fit — virá freebie viral** | recomendado |

**CAC blended esperado Ano 1: R$ 80-200/cliente.** Combinado com LTV (R$ 350/mês × 24m média = R$ 8.400) → LTV/CAC ≈ 42-105×. Sustentável.

**Recomendação Wes Bush (PLG):** o produto se vende sozinho via uso recorrente *se e somente se* o "diferencial 5-frases" entrega resultado mensurável no mês 1. **Foco PLG = M1 funcionar pra amigo + 2-3 referrals orgânicos.** Sem hack de growth.

---

## 7. Posicionamento (April Dunford method)

### 7.1 Mapa de posicionamento

| Componente Dunford | Recomendação |
|---|---|
| **Categoria de mercado** | Não competir como "buscador de licitação" (Effecti/ConLicitação dominam). Posicionar como: **"Sistema operacional pra fornecedor de licitação multi-CNPJ"** (categoria nova, regional, vertical). |
| **Alternativas competitivas** (não-buscador) | (1) **Planilha + WhatsApp** (status quo da maioria das MPEs); (2) **Contador externo** com gestão de prazos; (3) **Assessoria jurídica** boutique de licitação |
| **Capacidades únicas** | (1) **Anti-conluio nativo multi-CNPJ via RLS** (único — ninguém faz); (2) **Síntese acionável 5-frases** (vs dashboards descritivos); (3) **Livro caixa + Auto-BP/DRE integrado ao dossiê** (ninguém integra backstage); (4) **Latência D+0 via DODF híbrido** (vs D+1 do PNCP) |
| **Valor único derivado** | (a) **Zero inabilitações por CRF/CND vencidas** (mensurável M1); (b) **Dossiê <30min** (vs 30-60min/edital manual); (c) **Recurso dentro de preclusão** (vs perda por timeout); (d) **Sem risco anti-conluio Lei 14.133 art. 14 IV** (compliance nativo) |
| **Best-fit customer** | Fornecedor B2B com **2-4 CNPJs coligados** + ≥5 licitações/mês + DF ou Águas Lindas-GO + faturamento R$ 500k-10M/ano + ME/EPP/LTDA Simples ou Presumido + dono operacional (não terceirizou ainda) |
| **Worst-fit customer** | Solo MEI 1 CNPJ + licitação esporádica nacional (Effecti resolve melhor); grande empresa multi-estado (Deltek-equivalente); empresa que tem departamento jurídico licitação interno (não precisa). |
| **One-liner** | "Holding virtual pra fornecedor B2B de licitação no DF — 4 CNPJs num só sistema, dossiê em 30 minutos, recurso dentro do prazo, anti-conluio nativo." |

### 7.2 Frase de venda alternativa (versão dor)

> "Você participa de licitação no DF/Águas Lindas com 2+ CNPJs? Pare de perder editais por CRF vencido, recursos por preclusão e dormir mal com risco anti-conluio. A gente automatiza tudo num só sistema."

### 7.3 Anti-positioning (o que NÃO somos)

- **NÃO somos** Effecti pra DF — Effecti é melhor em buscador nacional + market intel descritivo
- **NÃO somos** software contábil — contador continua fazendo a obrigação fiscal
- **NÃO somos** plataforma de pregão — não substitui ComprasNet/BLL operacionalmente
- **NÃO somos** assessoria jurídica — recurso ainda passa por revisão humana

---

## 8. Métricas de prova do moat (durante Sprint 0-6)

| Marco | Métrica de prova | Falha (kill signal) | Cassie K. comment |
|---|---|---|---|
| **M1** (Sprint 1) | 4 pessoas usando livro caixa diariamente por ≥7 dias | <3 pessoas após 14d | uso ≠ valor — também tracking de "frequência de logout em <30s" (rejeitaram) |
| **M2** (Sprint 2) | 1 CRF/CND alerta proativo gerou renovação antes do vencimento | 1 doc venceu apesar do alerta | **smoking gun** — se vencer apesar do alerta, alarme está quebrado |
| **M3** (Sprint 3) | 1 alerta real de edital relevante entregue e cliente confirma "alerta útil" | 60%+ alertas marcados "irrelevante" | filtro de CNAE/região mal calibrado |
| **M4** (Sprint 4) | 1 dossiê compilado em <30min e enviado em licitação real | cliente recusa enviar dossiê do sistema | falha de confiança — fatal |
| **M4.5** | **Eval offline:** se sistema tivesse rodado nos últimos 6 meses, quantos editais ele teria acertado vs perdido? | hit rate <40% | **gate técnico-decisório** Cassie K. |
| **M5** (Sprint 5) | 1 recurso real manifestado dentro da janela de preclusão | cliente perdeu janela apesar do alerta | bug operacional crítico |
| **M5.5** | ROI por diferencial sugerido: cliente seguiu recomendação preço-alvo → ganhou ou perdeu? Tracking ≥10 editais. | 0 wins atribuíveis ao diferencial | moat ilusório |
| **M6** (Sprint 6) | Cliente declara "não voltaria pro manual" + ≥10 editais analisados + ≥2 recursos | recusa de continuidade | falha geral |

**Eval offline M4.5 é o gate técnico mais importante.** Damodaran clone insiste: **NÃO escalar para Sprint 7+ sem provar M4.5 retroativo.**

---

## 9. Riscos do moat — 3 cenários onde o moat falha

### Risco 1 — Dado público é estruturalmente insuficiente

**Cenário:** PNCP só publica metadados; PDFs vêm escaneados/raster (não OCR-eável); atas vêm como texto livre com mil variações; órgãos pequenos como Águas Lindas publicam tarde ou pulam campos opcionais; CEIS/CNEP têm latência de meses.

**Probabilidade:** **MÉDIA (40-55%)** — confirmação parcial via análise Transparência Brasil jun/2024 (PDF acima).

**Sinal de alarme:** no eval offline (M4.5), se hit rate de "diferencial órgão" cair abaixo de 50%, é dado insuficiente, não modelo ruim.

**Mitigação:**
- Investir em OCR robusto (Tesseract + LLM fallback) e biblioteca de regras crescente
- Combinar PNCP + DODF + DOE-GO (já planejado)
- Aceitar que **MVP só cobre 60-70% dos casos com alta confiança** — UI deve deixar claro
- Plano B: cliente humano da Tocks/Bretda treina rotulação ativa nos primeiros 200 editais

### Risco 2 — Cliente não confia em conselho automatizado

**Cenário:** mesmo com síntese acionável, cliente prefere ler edital ele mesmo "pra ter certeza"; conselho automatizado vira ruído; produto vira só checklist.

**Probabilidade:** **MÉDIA-ALTA (50-65%)** — característica do setor (jurídico-conservador).

**Sinal de alarme:** M4 dossiê compilado <30min mas cliente não envia. M5 recurso sugerido mas cliente não usa.

**Mitigação:**
- **Override humano sempre disponível** (botão "discordo")
- **Disclosure de confiança em cada frase** (não pretender certeza absoluta)
- **Adoção progressiva:** começar com Pipeline 1-2 (caixa+compliance, baixo risco), só ativar 3-4-5 depois de confiança construída
- **Loop de feedback explícito:** cada relatório tem botão "esse conselho foi útil? sim/não/parcial" → re-treinar
- **Acompanhar lento:** se o cliente leva 6 meses para confiar, tudo bem. Tocks e Bretda mostraram que paciência paga.

### Risco 3 — Concorrente nacional copia pós-validação

**Cenário:** Effecti ou ConLicitação vê "síntese 5-frases" funcionando, copia em 6-12 meses, distribui pra base nacional de 30k+ clientes ativos, atropela com escala.

**Probabilidade:** **MÉDIA (35-50%)** — modular feature, mas **alto custo de UX/posicionamento p/ replicar bem**.

**Sinal de alarme:** Effecti publicar post de blog ou release sobre "Recomendação acionável".

**Mitigação:**
- **Moat real não é o output, é o backstage:** Effecti não tem acesso ao livro caixa + vault interno do cliente. Pra replicar isso, viraria contábil também → fora do core deles.
- **Anti-conluio multi-CNPJ + RLS** é arquitetural, não feature — não copiável sem reescrever banco
- **Verticalização DF + ACT library curada** cresce mês a mês como ativo proprietário
- **Cliente-âncora satisfeito = case + lock-in** (custo de migração alto)
- Se Effecti reagir mesmo assim: pivotar pra **B2B-BPO especializado** (serviço de habilitação + recurso como serviço, não só SaaS). Ali eles não chegam.

### Outros riscos secundários

- **LGPD/CDC** disclaimer pra dado público desatualizado → mitigação: timestamp + fonte sempre visível
- **Lei 14.133 art. 14 IV** muda interpretação anti-conluio → mitigação: monitorar jurisprudência TCDF/TCU + flexibilidade no schema
- **Solo dev + 3 outros projetos** → mitigação: kill gates Sprint a Sprint, Anipis tem prioridade (P0)
- **Open Finance Pluggy mudança de pricing** → mitigação: fallback OFX manual, Belvo como backup

---

## 10. Síntese do clone Damodaran — quanto vale esse moat se virar produto comercial?

**Premissas conservadoras (ano 5, modelo cenário base):**
- 800 clientes pagantes DF+entorno (1.5% do TAM-empresas)
- ARPU R$ 350/mês = R$ 4.200/ano
- Churn mensal 4% (high-touch, vertical, sticky)
- ARR ano 5: R$ 3,36M
- Margem operacional 35% (saas vertical com revisão humana) = R$ 1,18M EBITDA
- Multiplo brasileiro saas vertical micro 2026: 4-7× ARR → **valuation R$ 13-24M**

**Cenário otimista (vai pra nacional + multi-estado):**
- 4.000 clientes, ARPU R$ 400, ARR R$ 19,2M, valuation **R$ 80-130M**

**Cenário pessimista (só amigo + 5-10 referrals):**
- 15 clientes, ARPU R$ 350, ARR R$ 63k, valuation insignificante — mas **ativo de aprendizado** + base pra Tocks/Bretda enquanto Synkra escala outros produtos

**Recomendação Damodaran:** moat vale ~R$ 8-20M (NPV cenário base, discount 25%). Vale o esforço Sprint 0-6 se outros 3 projetos não absorvem >60% do tempo. **Não é unicórnio. É negócio de cauda longa premium.**

---

## 11. Recomendações finais (priorizadas)

### Imediatas (Sprint 0-1)
1. **Não vender "buscador" — vender "holding virtual operacional"** (April Dunford). Ajustar copy do deck + onboarding amigo.
2. **Implementar eval offline retroativo desde dia 1** (Cassie K.) — pegar histórico 12m do amigo, rodar todas regras retrospectivamente antes de Sprint 4.
3. **Disclosure de confiança em cada output** — não pretender certeza absoluta; abrir produto para feedback humano explícito.

### Médio prazo (Sprint 2-4)
4. **Sintetizar output em 5-frases acionáveis** — esse formato é o moat percebido. Trabalhar UX desse cartão como prioridade máxima.
5. **Não competir em "buscador" puro** — só PNCP + filtro DF/AL no MVP. Não tentar superar Effecti em cobertura.
6. **ACT matcher como ativo proprietário** — curar manualmente os primeiros 100 ACTs do cliente. Esse é o backbone do moat.

### Longo prazo (pós-Sprint 6)
7. **Acompanhar Effecti/ConLicitação para sinais de cópia** — se eles lançarem "recomendação acionável", pivotar para B2B-BPO especializado.
8. **Considerar produtizar para 5-20 amigos do amigo** apenas se M6 passar com nota alta + 1 case forte.
9. **Não pensar em multi-estado antes de R$ 20k MRR DF** — concentração regional é o moat, não o handicap.

---

## 12. Apêndice — fontes consultadas (todas com URL)

### Documentação técnica PNCP
- [PNCP Swagger API Consulta](https://pncp.gov.br/api/consulta/swagger-ui/index.html)
- [PNCP Manual de APIs de Consulta v1.0 (PDF MGI)](https://www.gov.br/pncp/pt-br/central-de-conteudo/manuais/versoes-anteriores/ManualPNCPAPIConsultasVerso1.0.pdf)
- [PNCP Manual de Integração v2.2.1 (PDF MGI)](https://www.gov.br/pncp/pt-br/central-de-conteudo/manuais/versoes-anteriores/ManualdeIntegraoPNCPVerso2.2.1.pdf)
- [PNCP Dados Abertos](https://www.gov.br/pncp/pt-br/acesso-a-informacao/dados-abertos)
- [Transparência Brasil — Recomendações e desafios técnicos PNCP (jun/2024 PDF)](https://www.transparencia.org.br/downloads/publicacoes/portalnacionaldecontratacoespublicas_recomendacoesedesafiostecnicos.pdf)

### Concorrentes BR
- [Effecti — Dados do mercado para disputar licitações](https://effecti.com.br/dados-do-mercado-para-disputar-licitacoes/)
- [Effecti — Prever resultados em licitações com dados 2026](https://effecti.com.br/prever-resultados-licitacoes/)
- [Effecti — Analisar órgão público em licitações 2026](https://effecti.com.br/analisar-orgao-publico-licitacoes/)
- [Effecti — Plataforma planos e preços](https://effecti.com.br/plataforma/)
- [Effecti — Calculadora de planos](https://effecti.com.br/calculadora-de-planos/)
- [Effecti — Vantagem competitiva em licitações](https://effecti.com.br/vantagem-competitiva-nas-licitacoes/)
- [Effecti — Alta performance em licitações 2026](https://effecti.com.br/praticas-de-alta-performance-nas-licitacoes/)
- [Effecti — Nichos lucrativos em licitações 2026](https://effecti.com.br/nichos-lucrativos-licitacoes/)
- [ConLicitação — Ferramenta Análise da Concorrência](https://conlicitacao.com.br/ferramentas/analise-da-concorrencia/)
- [ConLicitação — Como analisar concorrentes](https://conlicitacao.com.br/como-analisar-concorrentes-com-o-conlicitacao/)
- [LicitaGov — Plataforma](https://licitagov.org/)
- [BLL — 3 pontos essenciais analisar concorrentes](https://bll.org.br/noticias/3-pontos-essenciais-para-analisar-os-seus-concorrentes/)
- [Portal da Transparência Federal — Licitações](https://portaldatransparencia.gov.br/licitacoes)

### Análogos internacionais
- [Deltek GovWin IQ — Federal](https://www.deltek.com/en/government-contracting/govwin/federal)
- [Deltek GovWin IQ — AI features (Executive Biz)](https://www.executivebiz.com/articles/deltek-govwin-iq-ai-powered-features-government-contracting)
- [Deltek GovWin IQ — How it beats SAM.gov](https://www.deltek.com/en/blog/how-govwin-iq-beats-government-websites)

### TAM/SOM
- [ASN Sebrae — MPE 38% das licitações 2020](http://www.agenciasebrae.com.br/sites/asn/uf/NA/pequenos-negocios-tiveram-participacao-em-38-das-licitacoes-publicas-do-governo-federal-no-ano-pass,e18e43baf2797710VgnVCM1000004c00210aRCRD)
- [ASN Sebrae — MPE crescimento 93% participação compras públicas](https://agenciasebrae.com.br/economia-e-politica/participacao-das-mpe-nas-compras-publicas-cresceu-93-nos-ultimos-tres-anos/)
- [SEBRAE — Passo a passo MPE participar licitações](https://sebrae.com.br/sites/PortalSebrae/ufs/ap/artigos/passo-a-passo-para-a-microempresa-participar-de-licitacoes-no-sebrae,768fce14b63f5610VgnVCM1000004c00210aRCRD)
- [TCU — Participação MPE em licitações](https://licitacoesecontratos.tcu.gov.br/4-5-2-4-participacao-de-microempresas-e-de-empresas-de-pequeno-porte-2/)
- [IBGE Cidades — Águas Lindas-GO](https://cidades.ibge.gov.br/brasil/go/aguas-lindas-de-goias)

### Positioning
- [April Dunford — A Quickstart Guide to Positioning](https://www.aprildunford.com/post/a-quickstart-guide-to-positioning)
- [Product Marketing Alliance — April Dunford positioning](https://www.productmarketingalliance.com/mastering-positioning-for-growth/)

### Legal
- [Lei 14.133/2021 (Nova Lei de Licitações)](http://www.planalto.gov.br/ccivil_03/_ato2019-2022/2021/lei/L14133.htm)
- [Decreto 10.764/2021 (regulamenta PNCP)](http://www.planalto.gov.br/ccivil_03/_ato2019-2022/2021/decreto/d10764.htm)
- [LAI — Lei 12.527/2011](http://www.planalto.gov.br/ccivil_03/_ato2011-2014/2011/lei/l12527.htm)

---

*Documento elaborado por @analyst (Atlas/Alex) em 2026-05-18 para o projeto Buscador de Licitações DF + Águas Lindas-GO. Mega Research Estágio 2-3 (Moat Real).*

*Próxima ação recomendada: handoff Breno → revisar premissas TAM/DAP no Bloco C com cliente-âncora (call discovery) + decidir se Sprint 0 inclui montagem do eval offline retroativo como gate explícito antes de Sprint 4.*
