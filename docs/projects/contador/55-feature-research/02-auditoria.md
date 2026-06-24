# Feature Research — AUDITORIA / Apuração Tributária (o conjunto mínimo pra competir)

> Pesquisa de fontes PRIMÁRIAS reais (sites/docs/manuais oficiais dos concorrentes + Receita/SVRS + Tecnospeed). Objetivo: definir as **table-stakes** que nossa Auditoria precisa ter e o **gap** versus o que temos hoje em `packages/contador-motor-fiscal/` + `apps/contador/app/fila/`.
> **Data:** 2026-06-22 · **Autor:** Atlas (analyst) · **Base estratégica:** `00-context/CONTEXT.md`, `12-tech-research-mercado.md`, `13-conclave-validacao-features.md`
> **Regra metodológica:** fontes reais, sem invenção. "não encontrado" quando o dado não está público (a maioria dos concorrentes é opaca em acurácia e preço).

---

## TL;DR (leia isto)

1. **A categoria de auditoria fiscal automatizada está madura e lotada** — e-Auditoria, Jettax, Qive, Sieg/Radar360, Auditto, Roit já validam NCM/CST/CFOP, detectam ICMS-ST e monofásico e geram laudo/proposta. Validação NCM×CST×divergência **é table-stake, não diferencial.**
2. **O whitespace estreitou desde o doc 12.** A "auditoria contra a referência da Reforma (cClassTrib/IBS/CBS)" que pensávamos ser vácuo **já tem um ocupante direto e perigoso: o FiscAI da Roit** — classifica catálogo no cClassTrib/NCM com IA, **score de confiança 0–100%**, **revisão humana obrigatória abaixo de 85%**, **trilha imutável por CNPJ** e dupla apuração 2026–2032 no roadmap. É quase exatamente a nossa tese, com mais capital e dados (1,8 PB).
3. **A boa notícia: o moat "apuração defensável / trilha de boa-fé" ainda NÃO é uma categoria comercial nomeada.** O FiscAI tem a *mecânica* (trilha imutável + confidence + human-in-loop), mas ninguém **posiciona e vende a defensabilidade jurídica** como o produto — provar boa-fé pra afastar a multa de IBS/CBS. A própria imprensa especializada já manda o contador **exigir "score de confiança, trilha de auditoria e fluxo de exceção humano, sem aceitar resposta sem rastreabilidade"** — ou seja, o mercado está criando a demanda pela nossa categoria antes de o produto existir.
4. **Janela regulatória mudou e isso afeta o produto:** a obrigatoriedade de CST/cClassTrib para **Simples/MEI foi adiada para jan/2027** (não 2026), e a **multa por ausência de IBS/CBS está suspensa nos primeiros meses de 2026**. Isso esfria o "relógio de agosto/2026" como gatilho de venda para o nicho Simples e empurra o valor imediato de volta para **recuperação monofásico** (isca) + **Lucro Real/Presumido** (que informam cClassTrib já em 2026). Reavaliar o timing do CONTEXT §9.

---

## 1. Concorrentes reais (nome + URL)

| # | Concorrente | URL | Categoria primária |
|---|-------------|-----|--------------------|
| 1 | **e-Auditoria** | https://www.e-auditoria.com.br/ | Auditoria fiscal + recuperação (benchmark de escala) |
| 2 | **Roit / FiscAI** | https://www.roit.com.br/ · https://www.fiscai.ia.br/ | IA enterprise; **FiscAI = classificação cClassTrib/NCM** (ameaça direta) |
| 3 | **Jettax** | https://www.jettax.com.br/ | Captura + auditoria (ST/PIS-COFINS) p/ escritórios |
| 4 | **é-Simples (esimplesauditoria)** | https://www.esimplesauditoria.com/ | Recuperação monofásico Simples + IA-NCM |
| 5 | **Recupera Simples** | https://recuperasimples.com.br/ | Recuperação monofásico Simples + gera PER/DCOMP |
| 6 | **Systax** | (site institucional) | Base de regras tributárias (CaaS) + dupla apuração CBS/IBS |
| 7 | **Taxcel** | https://taxcel.com.br/cclass-cst-ibs-cbs | Tabela cClassTrib pública + Excel/TaxSheets + Simulador |
| 8 | **Qive (ex-Arquivei)** | https://qive.com.br/ | Gestão DF-e + contas a pagar; auditoria/divergência rasa |
| 9 | **Radar360** | https://www.radar360.app/ | Auditor PIS/COFINS/ICMS pelo XML, foco Simples |
| 10 | **Auditto** | https://auditto.com.br/software-contador/ | Software de auditoria fiscal p/ contador |
| 11 | **Tax Radar** | https://taxradar.app/ | Classificação NCM→cClassTrib (conteúdo/guia + app) |
| 12 | **Fiscal.io** | https://conteudo.fiscal.io/ | Captura + tabela cClassTrib (encanamento) |
| 13 | **Tecnospeed** | https://blog.tecnospeed.com.br/tabela-cclasstrib/ | Publica tabela cClassTrib (infra/fornecedor de base) |

**Não encontrados na web (provável nome interno/regional — confirmar com Renan):** Dootax, Master, Sieg "Auditor" (Sieg tem produtos, mas a página específica de auditor com claims não retornou), G-TAX, IRIS/CIEG.

---

## 2. Matriz funções × concorrente

Legenda: ✅ tem · ⚠️ parcial/raso · ❌ não tem (ou não evidência) · ❔ não encontrado (opacidade do fornecedor)

| Função | e-Audit. | **FiscAI/Roit** | Jettax | é-Simples | Recupera S. | Systax | Taxcel | Qive | Radar360 | **NÓS hoje** |
|---|---|---|---|---|---|---|---|---|---|---|
| **Validação NCM/CST/CFOP** | ✅ | ✅ | ✅ | ⚠️ (NCM) | ⚠️ (NCM) | ✅ | ⚠️ tabela | ⚠️ | ✅ | ⚠️ só NCM→cClassTrib |
| **Classificação cClassTrib (IA)** | ❔ | ✅ **IA + score** | ⚠️ campos IBS/CBS | ❌ | ❌ | ✅ (regras) | ⚠️ tabela pública | ❌ | ⚠️ "integração RT" | ⚠️ **regra determinística, sem IA** |
| **Detecção monofásico** | ✅ | ❔ | ✅ (PIS/COFINS) | ✅ **especialista** | ✅ | ✅ | ❌ | ⚠️ | ✅ | ❌ (tipo previsto no enum, sem lógica) |
| **Substituição Tributária (ST)** | ✅ | ❔ | ✅ **forte** (MVA/CEST) | ✅ | ✅ | ✅ | ❌ | ⚠️ | ✅ | ❌ |
| **Regime: Simples** | ✅ | ✅ | ✅ | ✅ **único** | ✅ **único** | ✅ | n/a | ✅ | ✅ | ❔ (não modelado) |
| **Regime: Presumido/Real** | ✅ | ✅ | ✅ | ❌ (só Simples) | ❌ | ✅ | n/a | ✅ | ❌ | ❔ |
| **Motor: regras × IA** | regras (143M) | **IA + revisão** | regras | IA (NCM) | regras+barcode | regras (31M) | tabela | — | regras | **regras determinísticas** |
| **Base de regras (qtde divulgada)** | **143M regras / 190bi combinações / 16k análises** | 1,8 PB de dados | "tabelas atualizadas" | desde 2011 | ❔ | **31M regras** | tabela LC 214 | n/a | ❔ | **ruleset v0 sintético (draft)** |
| **Golden-set / acurácia divulgada** | ❌ não publica | ⚠️ score 0–100%, threshold 85% | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ⚠️ **golden-set sintético v0 (não rotulado por humano)** |
| **Dupla apuração (transição 2026–33)** | ⚠️ guia | ⚠️ DualSync (roadmap) | ⚠️ campos IBS/CBS | ❌ | ❌ | ✅ **CBS/IBS simultânea** | ⚠️ simulador | ❌ | ⚠️ | ❌ |
| **Relatório de divergência** | ✅ **+ proposta comercial** | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ | ⚠️ | ✅ | ✅ **fila + materialidade** |
| **Integração ERP** | ✅ | ✅ TOTVS/SAP B1/Omie/Bling | ✅ | ❌ | ❔ | ✅ Vertex/Protheus | ⚠️ Excel | ✅ SAP/TOTVS | ⚠️ | ❌ (insumo XML/OCR) |
| **Trilha de auditoria / boa-fé** | ❌ | ✅ **trilha imutável por CNPJ** | ❌ | ❌ | ❌ (zero disclaimer) | ❌ | ❌ | ❌ | ❌ | ✅ **hash-chain verificável + closeout manifest (Merkle)** |
| **Risco jurídico do PER/DCOMP** | ⚠️ multi-tese | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ (previsto, não construído) |
| **Gera PER/DCOMP** | ✅ (e-Recuperador) | ❌ | ❌ | ⚠️ | ✅ | ❌ | ❌ | ❌ | ⚠️ | ❌ |
| **Preço transparente** | ❌ | ❌ | ❌ | ❌ | ❌ (success-fee) | ❌ | ⚠️ tabela grátis | ⚠️ | ❔ | n/a |

> Fontes dos números: e-Auditoria homepage (210 mil empresas/mês, R$5,2bi crédito, 143M regras, 190bi combinações, 16k análises); FiscAI (score 0–100%, threshold 85%, trilha imutável, ERPs nativos); Systax (31M regras, dupla apuração); é-Simples/Recupera Simples (NCM por IA/barcode, 60 meses, PER/DCOMP). URLs na seção 6.

---

## 3. TABLE STAKES vs DIFERENCIAIS

### TABLE STAKES (sem isto não entramos na conversa — todos têm)
1. **Validação NCM × CST × CFOP por item** lendo XML/SPED dos últimos 5 anos.
2. **Detecção de monofásico e de ST** (CEST/MVA) com alerta de alíquota/CST divergente.
3. **Classificação no cClassTrib** (a tabela é pública e commodity — Taxcel/Tecnospeed/SVRS publicam grátis; ter a tabela não é valor).
4. **Relatório de divergência por item** com materialidade em R$ (já temos a fila).
5. **Cobertura de regime** Simples + Presumido + Real (hoje a maioria cobre os três; é-Simples/Recupera só Simples — esse é o nicho mais barato e mais atacado).
6. **Confidence score + fila de revisão humana** — deixou de ser diferencial: o FiscAI já tem e a própria imprensa fiscal manda o comprador **exigir** isso ("não aceite resposta sem rastreabilidade"). É table-stake emergente.

### DIFERENCIAIS (onde ainda dá pra vencer — em ordem de força do moat)
1. **⭐ Apuração DEFENSÁVEL posicionada e vendida** — a categoria. Ninguém **vende a defensabilidade jurídica** como produto. FiscAI tem trilha imutável (mecânica), mas o pitch dele é "classificar sem erro", não "provar boa-fé pra você não tomar multa". Nós já temos a peça técnica mais difícil construída (hash-chain verificável + closeout Merkle no `contador-trilha-verifier`). **O moat é embrulhar isso como a promessa central, não como log de fundo.**
2. **⭐ Trilha de boa-fé por documento E por PER/DCOMP** — log imutável: norma + NT + data + confiança + quem aprovou (CRC). FiscAI audita "ações em modelos sensíveis"; nós encadeamos o **artefato fiscal** (apontamento→laudo→aprovação) — é a evidência que entra no auto de infração, não o log de ML.
3. **⭐ Classificação de risco jurídico do crédito** (administrativo seguro × judicial × borderline 75/150%) — **ninguém faz**. Recupera Simples e é-Simples têm **zero disclaimer**, o que é passivo deles e brecha nossa.
4. **Confidence calibrada com "onde NÃO sei"** + golden-set **rotulado por tributarista** (não pela IA) — FiscAI usa threshold fixo 85%; calibração real + golden-set humano é defensável e é exatamente o que o conclave (Chip) exigiu como pré-requisito.
5. **Monitor de Nota Técnica → impacto no cliente X + drift monitor** — transforma a enxurrada de NTs em razão de compra recorrente; ninguém vende isso explicitamente.
6. **Preço transparente** — fosso aberto em 100% do mercado de auditoria (todos opacos). É GTM, não feature, mas é diferencial real.

---

## 4. Como tratam ACURÁCIA / confiança (o ponto mais fraco do mercado)

- **Quase ninguém publica acurácia, falso-positivo ou metodologia de eval.** e-Auditoria divulga **volume** (143M regras, R$5,2bi, 210 mil empresas/mês) como prova social — escala, não qualidade do classificador. Isso é deliberado: regras determinísticas não têm "acurácia" no sentido de ML, têm cobertura.
- **FiscAI é a exceção e o estado da arte:** expõe **score de confiança 0–100% por SKU**, **revisão humana obrigatória abaixo de 85%**, e justifica cada classificação com a **Nota Técnica** correspondente (coleta diária RFB/CONFAZ/SEFAZ via "FiscAlert"). Mas usa threshold fixo, não calibração — e não publica precision/recall por cClassTrib.
- **Recupera Simples e é-Simples = zero disclaimer / zero rastreabilidade** (modelo success-fee agressivo). É-Simples ainda flerta com "simular acesso humano" (a zona cinza que o CONTEXT §7 manda evitar).
- **A imprensa fiscal já educou o comprador:** a recomendação pública é **"exigir demonstração de score de confiança, trilha de auditoria e fluxo de exceção humano — não aceitar resposta sem rastreabilidade"** e manter **"trilha de decisão (porque foi classificado assim) como elemento de boa-fé em fiscalização"**. Isto é literalmente o nosso pitch escrito por terceiros. **Implicação:** quem chegar com confidence calibrada + golden-set humano + trilha verificável **e souber nomear a categoria** ganha — e o vácuo de eval honesto do mercado é nossa vantagem.

---

## 5. O que NOSSA Auditoria tem hoje vs o GAP

### O que existe (lido do código, 22/Jun)

**`packages/contador-motor-fiscal/src/index.ts`** — classificador determinístico puro:
- Input `ItemFiscal` (ncm, cfop, cst, cclasstribInformado, valor) → output `ApontamentoCandidato[]`.
- Seleção de regra por **NCM exato > prefixo mais longo**; gera divergência quando `cclasstribInformado ≠ esperado`.
- `confianca` é **fixa por tipo de match** (0.95 exato / 0.82 prefixo / 0.6 fallback) — **não é calibração**, é heurística.
- `tipoDivergencia` enum prevê `monofasico_tributado`, `aliquota_divergente`, `cst_divergente`, `credito_potencial`, `st`(implícito) — mas **a lógica só implementa cClassTrib divergente**. Os demais tipos são placeholders.
- Sem DB, sem rede, sem FS em `src/` (puro, testável). Golden-set e ruleset são **`*-v0-draft.json` sintéticos**, não rotulados por humano.

**`packages/contador-trilha-verifier/src/index.ts`** — o moat técnico, já real:
- Hash-chain por tenant (`seq_tenant`, `hash_anterior`, `hash_evento`), verificação de integridade (SEQ_GAP / PREVIOUS_HASH_MISMATCH / EVENT_HASH_MISMATCH).
- **Closeout manifest com Merkle root** (diário/mensal/corretivo). Verificador standalone, não re-roda LLM, não toca Supabase. **Isto é mais avançado que a "trilha imutável" do FiscAI** — é criptograficamente verificável por terceiro.

**`apps/contador/app/fila/page.tsx`** — UI human-in-loop, já madura no discurso:
- Fila por materialidade desc; banda de confiança; flag "revisar antes de aprovar" (bloqueia auto-aprovação); linguagem G6 ("indício", "base sintética", "sujeito a revisão humana", "não promete crédito garantido").
- Aprovação como **ato privativo do contador (CRC)** — human-in-loop é design, não fallback.

### O GAP (ordenado por urgência competitiva)

| Gap | Estado hoje | Quem já tem | Prioridade |
|---|---|---|---|
| **G1 — Monofásico e ST de verdade** | enum existe, lógica não | é-Simples, Jettax, e-Auditoria, Radar360 (table-stake) | 🔴 P0 — sem isto não há recuperação (a isca) nem paridade |
| **G2 — Golden-set rotulado por tributarista** | só sintético v0 | ninguém publica, mas é pré-requisito do conclave (Chip) | 🔴 P0 — sem ele a "auditoria da Reforma" é vibe check |
| **G3 — Confidence calibrada (não heurística fixa)** | 0.95/0.82/0.6 hardcoded | FiscAI (threshold 85%, mas não calibra) | 🔴 P0 — é o que diferencia de "regrinha" e sustenta o "onde não sei" |
| **G4 — Ingestão real XML/SPED 5 anos** | insumo manual, sem parser | todos (table-stake absoluto) | 🟠 P1 — concierge roda manual; build precisa disto |
| **G5 — Risco jurídico do PER/DCOMP** | previsto, não construído | NINGUÉM (whitespace) | 🟠 P1 — diferencial #3, casa com a trilha |
| **G6 — Posicionar/empacotar a defensabilidade** | trilha existe como log, não como produto | FiscAI tem mecânica, ninguém vende a categoria | 🔴 P0 de GTM — é o moat, está "escondido" no backend |
| **G7 — Cobertura Presumido/Real** | não modelado | e-Auditoria, Jettax, Systax, Roit | 🟡 P2 — mas é onde cClassTrib já vale em 2026 (Simples só 2027) |
| **G8 — Dupla apuração transição** | inexistente | Systax (forte), FiscAI roadmap | 🟡 P2 — vento de cauda 2026–33, não urgente p/ MVP |
| **G9 — Monitor de NT + drift** | inexistente | FiscAlert (Roit) | 🟡 P2 — razão de compra recorrente; constrói pós-validação |
| **G10 — Base de regras com volume** | ruleset draft | e-Audit 143M / Systax 31M | 🟠 P1 — **licenciar (Systax/CaaS), não construir** (conclave) |

---

## 6. Conclusão estratégica + Fontes

### Table-stakes (o mínimo pra competir, recapitulando)
Validação NCM×CST×CFOP por item · monofásico + ST · classificação cClassTrib · relatório de divergência com materialidade · cobertura dos 3 regimes · **confidence score + fila de revisão humana** (agora table-stake, não diferencial). Hoje temos a UI e a fila prontas, mas **nos falta a substância: monofásico/ST reais (G1), ingestão XML/SPED (G4) e golden-set humano (G2)**.

### Gap da nossa ferramenta (a frase honesta)
Temos **o moat técnico mais difícil já construído** (trilha hash-chain + Merkle verificável — supera a "trilha imutável" do FiscAI) e a **disciplina de human-in-loop/linguagem segura** que os rivais de recuperação não têm. Mas o **motor de auditoria em si ainda é um esqueleto**: classifica cClassTrib por regra determinística, **não detecta monofásico nem ST de verdade**, a confiança é heurística fixa (não calibrada), o golden-set é sintético, e **não há ingestão de XML/SPED**. Em paralelo, o **FiscAI (Roit) ocupou o whitespace que o doc 12 dava como vazio** — ele já faz classificação cClassTrib com IA + confidence + trilha + ERP. Nossa vantagem **não é mais "ser o único na auditoria da Reforma"**; é **(a)** ser o único que **vende a defensabilidade jurídica como categoria** (boa-fé contra a multa, risco do PER/DCOMP — whitespace puro), **(b)** ter a trilha **criptograficamente verificável por terceiro**, e **(c)** o canal do Renan. Recomendação: no Concierge MVP, **liderar pelo laudo defensável + recuperação monofásico** (valor imediato), construir G1/G2/G3 antes de tudo, e **licenciar a base de regras** (não competir com 31M/143M).

### Ajuste de timing (achado novo que contradiz o CONTEXT §9)
O CONTEXT trata "agosto/2026 / multa IBS/CBS" como o relógio de venda. Mas as fontes primárias mostram: **(1)** a obrigatoriedade de CST/cClassTrib para **Simples/MEI foi adiada para jan/2027**; **(2)** a **multa por ausência de IBS/CBS está suspensa nos primeiros meses de 2026** (RFB + CGIBS). Para o nicho Simples (o ICP barato), o gatilho de urgência de 2026 é mais fraco do que assumimos — o valor imediato em 2026 vem da **recuperação monofásico** (a isca) e do **Lucro Real/Presumido** (que já informam cClassTrib em 2026). **Confiança: ALTA** nas datas; recomendo o @pm revisar o CONTEXT §9 e o pitch.

### Fontes (URLs primárias)
- e-Auditoria — https://www.e-auditoria.com.br/ · blog recuperação https://www.e-auditoria.com.br/blog/recuperacao-tributaria-o-que-e-como-recuperar-creditos-tributarios/ · SPED https://www.e-auditoria.com.br/blog/manual-sped-fiscal-um-guia-sobre-efd-icms-ipi/
- Roit / FiscAI — https://www.roit.com.br/ · https://www.fiscai.ia.br/ · rating https://mundo.roit.ai/rating
- Jettax — https://www.jettax.com.br/ · auditoria ST https://www.jettax.com.br/blog/software-de-auditoria-de-substituicao-tributaria-como-validar-o-icms-st-automaticamente-nas-notas/ · auditoria PIS/COFINS-ST https://www.jettax.com.br/blog/auditoria-automatizada-de-pis-cofins-st-como-evitar-pagamentos-indevidos/
- é-Simples — https://www.esimplesauditoria.com/ · monofásico https://www.esimplesauditoria.com/pis-e-cofins-monofasicos
- Recupera Simples — https://recuperasimples.com.br/ · https://recuperasimples.com.br/como-recuperar-pis-e-cofins-monofasico-simples-nacional/
- Taxcel cClassTrib — https://taxcel.com.br/cclass-cst-ibs-cbs
- Systax (dupla apuração / regras) — via reformatributaria.com https://www.reformatributaria.com/economia-reforma-tributaria-impactos/ccif-defende-sistema-unico-para-cbs-e-ibs-e-afirma-que-plataformas-paralelas-contrariam-modelo-da-reforma-tributaria/
- Qive (ex-Arquivei) — https://qive.com.br/ · auditoria fiscal https://qive.com.br/blog/sistema-de-auditoria-fiscal · recuperação NF-e https://ajuda.qive.com.br/pt-BR/articles/7203915-recuperacao-de-notas-fiscais
- Radar360 — https://www.radar360.app/
- Auditto — https://auditto.com.br/software-contador/
- Tax Radar (NCM→cClassTrib) — https://taxradar.app/blog/ncm/cclasstrib-como-mapear-ncm-regime-ibs-cbs
- Tabela cClassTrib (commodity pública) — Tecnospeed https://blog.tecnospeed.com.br/tabela-cclasstrib/ · SVRS https://dfe-portal.svrs.rs.gov.br/Cff/ClassificacaoTributaria
- NT 2025.002 (NF-e IBS/CBS) — https://blog.tecnospeed.com.br/nota-tecnica-reforma-tributaria-nfe-nfce/ · portal nfe https://www.nfe.fazenda.gov.br/portal/exibirArquivo.aspx?conteudo=YmYqYBW8gGQ%3D
- "Exigir score/trilha/exceção humana" + boa-fé + adiamento Simples 2027 — https://www.oagentefinanceiro.com.br/reforma-tributaria-ia-compliance-fiscal-ibs-cbs/ · https://www.contabeis.com.br/noticias/74001/como-definir-cst-e-cclasstrib-passo-a-passo-pratico-para-a-reforma-tributaria/
- Multa IBS/CBS suspensa início 2026 — https://fenacon.org.br/reforma-tributaria/multa-por-falta-de-cbs-e-ibs-em-notas-e-suspensa-no-inicio-de-2026/
- Apuração assistida / cClassTrib oficial — RFB https://www.gov.br/receitafederal/pt-br/centrais-de-conteudo/publicacoes/manuais/reforma-tributaria-do-consumo/comunicado-sobre-o-ambiente-de-producao-beta-versao-1-dezembro25 · Cartilha IBS CGIBS https://www.cgibs.gov.br/upload/arquivos/202511/13142212-item-2-3-cartilha-do-ibs-vol-1-formatada-20251110-1506.pdf

---
*Confiança geral: ALTA para funcionalidades públicas e datas regulatórias; MÉDIA para acurácia/preço (mercado opaco — marcado ❔/não encontrado). FiscAI é a comparação mais crítica e merece teardown profundo dedicado.*
