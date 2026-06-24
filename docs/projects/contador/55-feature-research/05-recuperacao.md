# Feature Research 05 — RECUPERAÇÃO DE CRÉDITO TRIBUTÁRIO (monofásico PIS/COFINS + PER/DCOMP)

> Pesquisa de mercado REAL (fontes primárias) sobre o módulo de **Recuperação** do projeto Contador.
> Objetivo: o **conjunto MÍNIMO de funções** que nossa Recuperação precisa ter pra competir, separando **TABLE STAKES** de **DIFERENCIAIS**, ancorado no nosso ângulo (dossiê de evidências ligado à auditoria + trilha de boa-fé + tributarista assina).
>
> **Autor:** Atlas (@analyst) · **Data:** 2026-06-22 · **Método:** web real, fontes primárias (sites dos concorrentes, manuais, Receita Federal, STF, matérias). Sem channeling de clones (regra `feedback_no_hydra_style`). Confiança calibrada por seção; "não encontrado" onde a fonte não confirma.
> **Base:** `00-context/CONTEXT.md` (D5/D6, sunset 2027, RT default), `12-tech-research-mercado.md` (cluster Auditoria/Recuperação), `13-conclave-validacao-features.md` (moat = trilha de boa-fé).

---

## TL;DR (table-stakes + nosso gap)

**A categoria já tem dono técnico** (e-Auditoria, é-Simples/é-Recupera, Recupera Simples). O fluxo "lê 5 anos → identifica monofásico por NCM → estima crédito → encaminha restituição" é **commodity resolvida**. Onde TODOS são fracos:
1. **Disclaimer / responsabilidade jurídica** — Recupera Simples e é-Simples têm **zero trilha de boa-fé**; vendem "crédito" como se fosse certo. Isso é exatamente o passivo que mata o contador no auto de infração.
2. **Risco classificado por pedido** — ninguém separa "administrativo seguro (restituição)" de "borderline (compensação, multa 150% se glosado)".
3. **Proveniência rastreável** — ninguém liga cada centavo estimado à nota/NCM/norma/data com log imutável.

**Nosso gap hoje:** temos a **camada de apresentação do diferencial inteira** (indício, confiança calibrada, RT-vs-PERComp com ressalva de multa, split success-fee separado, preview de dossiê, linguagem G6) — mas **100% sintética**. Falta a **fundação real**: ingestão de XML/SPED/PGDAS, motor de identificação monofásico item-a-item, **cálculo do crédito por período**, e a **trilha de boa-fé persistida** (hoje é texto de UI, não log imutável). Os table-stakes do mercado (ler dado real → calcular → gerar o documento de restituição) **nós ainda não temos**.

---

## 1. Concorrentes reais (nome + URL + o que é)

| # | Concorrente | URL | O que é (real) | Confiança |
|---|-------------|-----|----------------|-----------|
| 1 | **e-Auditoria / e-Recuperador** | e-auditoria.com.br · manuais.e-auditoria.com.br/e-Recuperador | Suíte de auditoria + recuperação multi-tese; módulo dedicado `e-Recuperador` com receita "PIS/COFINS Monofásicos – Simples Nacional". Benchmark de auditoria do mercado. | ALTA |
| 2 | **é-Simples Auditoria / é-Recupera** | esimplesauditoria.com · esimples.crisp.help (categoria é-Recupera) | Especialista **Simples Nacional**. Módulo `é-Recupera` recupera PIS/COFINS e ICMS "de forma automática e integrada"; cruza fiscal × legislação por NCM+CST; **integração PGDAS nativa**; módulo "Correção de NCM com IA". | ALTA |
| 3 | **Recupera Simples** | recuperasimples.com.br | Software de recuperação/revisão/auditoria. **Classificador fiscal por código de barras + descrição + NCM**. Calculadoras: "RCT de PIS/COFINS monofásico" (Simples) e "monofásico presumido" (Lucro Presumido/Real). | ALTA |
| 4 | **Roit** | roit.com.br | IA enterprise. Auditoria **linha-a-linha do SPED** comparando com base de **1,8 PB** de dados tributários; "identifica, materializa e converte em caixa". Mercado enterprise (fora do nosso ICP). | ALTA |
| 5 | **Taxcel (TaxSheets)** | taxcel.com.br/taxsheets | Plataforma de **retificação/correção de SPED no Excel**; suporta principais arquivos fiscais; "ideal para revisões de PIS/COFINS". Ferramenta sobre Excel, não fluxo fechado de restituição. | ALTA |
| 6 | **Econet — Recuperador de Crédito PIS/COFINS** | grupo.econeteditora.com.br/lp/recuperador · legisweb.com.br/produtos/sistemas/recuperador_pis_cofins | Sistema dedicado de recuperador PIS/COFINS (editora jurídica). Achado novo (não estava na lista). | MÉDIA |
| 7 | **Sittax** | sittax.com.br | Apuração fiscal automatizada para Simples Nacional (inclui detecção de monofásico/ST). Achado novo. | MÉDIA |
| 8 | **Dootax** | dootax.com.br/perdcomp | **Não é recuperador** — é gestão/automação de obrigações e conteúdo sobre PER/DCOMP. Citado como referência de PER/DCOMP, não concorrente direto de recuperação monofásico. | MÉDIA |
| — | **C-TAX / CITAX, Loara** | — | **Não encontrado** como produto de recuperação monofásico nas buscas (Sittax aparece, não CITAX). Pode ser nome interno/regional ou enterprise — **confirmar com Renan**. Não inventei features. | — |

> Nota: muitos players que aparecem em "recuperação tributária" são **escritórios/serviços** (advocacia tributária) usando esses softwares por trás, não software. A linha software↔serviço é borrada — relevante pro nosso modelo (D6: software entrega dossiê, tributarista assina).

---

## 2. Matriz funções × concorrente

Legenda: ✅ confirmado em fonte · 🟡 indicado mas não detalhado · ❓ não encontrado · — não se aplica.

| Função | e-Auditoria | é-Simples / é-Recupera | Recupera Simples | Roit | Taxcel | **NÓS hoje** |
|--------|:-----------:|:----------------------:|:----------------:|:----:|:------:|:------------:|
| **Identifica crédito monofásico** (NCM↔regime) | ✅ | ✅ (cruza NCM+CST × legislação) | ✅ (classificador código-barra+desc+NCM) | ✅ (linha-a-linha SPED) | 🟡 (revisão PIS/COFINS) | 🟡 **só sintético** (indícios pré-fabricados) |
| **Varredura retroativa 5 anos** | ✅ (prazo prescricional 5 anos) | ✅ ("até cinco anos retroativos") | 🟡 (não explícito na home) | ✅ | ✅ (períodos anteriores de SPED) | 🟡 **só sintético** (quebra ano-a-ano fake) |
| **Ingestão de dado real** (XML / SPED / PGDAS) | ✅ multicanal (SPED/EFD/XML + OCR PDF→XML) | ✅ (PGDAS nativo + fiscal) | ✅ (audita arquivos eletrônicos) | ✅ (SPED) | ✅ (arquivos SPED) | ❌ **não temos** (dados em `recuperacao-data.ts` hardcoded) |
| **Classificação NCM por IA/descrição** | 🟡 | ✅ ("Correção de NCM com IA") | ✅ (barcode+descrição+NCM) | ✅ | ❓ | ❌ |
| **Cálculo do crédito por período** | ✅ | ✅ | ✅ (calculadoras RCT) | ✅ | ✅ | ❌ (estimativa é número fixo no JSON) |
| **Dossiê / relatório de evidências** | ✅ ("relatórios detalhados e auditáveis") | 🟡 (reúne documentos; passo a passo) | 🟡 (laudo/parecer) | ✅ | 🟡 | 🟡 **preview estruturado sintético** (cabeçalho + itens + base normativa + ressalva) |
| **Geração de PER/DCOMP / doc de restituição** | 🟡 ("em alguns casos automatiza geração do arquivo PER/DCOMP") | ❓ (não confirma geração de arquivo) | ❓ (gera laudo, geração de arquivo não confirmada) | 🟡 | ❌ | ❌ **não temos** (texto diz "Fase 7, tributarista assina") |
| **Acompanhamento do pedido** (status no fisco) | ❓ | ❓ | ❓ | ❓ | ❌ | ❌ (temos só `estagio` interno: análise→dossiê→tributarista) |
| **Modelo success-fee** | ✅ (honorários no êxito; contratos com/sem multa rescisória) | ✅ (modelo êxito comum) | ✅ (foco recuperação por êxito) | 🟡 ("converte em caixa") | — (licença SaaS) | 🟡 **calculadora de split** 70/15/15 (ilustrativa) |
| **Análise prévia grátis** | 🟡 (demo) | ✅ ("Teste Grátis") | 🟡 ("Agendar demonstração") | 🟡 | ❓ | — (é demo, tudo "grátis") |
| **Setores cobertos** | combustível, medicamento, cosmético, pneu, autopeça, bebidas | combustível, farma, cosmético, bebidas, autopeça, pneu, máquinas, veículos | múltiplos portes/regimes/segmentos | enterprise | genérico | **farmácia, posto, mercado** (3 demos) |
| ⭐ **Trilha de boa-fé / proveniência por documento** | ❓ ("disclaimer fraco") | ❌ (zero disclaimer) | ❌ (zero disclaimer) | ❓ | ❌ | 🟡 **na UI** (linguagem G6, confiança "onde não sei") — **não persistida como log imutável** |
| ⭐ **Risco jurídico classificado por pedido** (RT seguro vs compensação 150%) | ❌ | ❌ | ❌ | ❌ | ❌ | 🟡 **na UI** (RT default vs PERComp com ressalva de multa 150%) |

**Leitura da matriz:** colunas 1-3 (concorrentes diretos) dominam as **6 primeiras linhas** (table-stakes). As **2 últimas linhas** (trilha de boa-fé + risco classificado) são **brancas no mercado inteiro** — e são justamente as 2 únicas onde nós já temos algo, ainda que só na camada de apresentação.

---

## 3. TABLE STAKES vs DIFERENCIAIS

### TABLE STAKES (sem isto não competimos — e hoje NÃO temos de verdade)
1. **Ingestão de dado real** — ler XML de entrada/saída, SPED (EFD-Contribuições/ICMS), PGDAS-D. Sem isto não há "crédito", só demo. *(o mais crítico do gap)*
2. **Identificação monofásico item-a-item** — NCM → lista monofásica → confronto com o que foi tributado. Por descrição/barcode quando o NCM falha.
3. **Varredura retroativa real de 5 anos** — período não-prescrito, vencendo mês a mês (créditos de 2021 morrem ao longo de 2026).
4. **Cálculo do crédito por período** — quanto de DAS/PIS/COFINS foi pago a maior, por mês, com correção SELIC (a Receita já aplica SELIC automática no PER/DCOMP Web).
5. **Relatório/laudo de evidências exportável** — o documento que o contador/tributarista usa.
6. **Modelo success-fee** — cobrança no êxito (mercado: 1%–20%), linha separada.

### DIFERENCIAIS (nosso ângulo — branco no mercado)
1. ⭐ **Trilha de boa-fé persistida (log imutável) por indício e por pedido** — cada R$ estimado amarrado a {nota, NCM, CST, norma citada, Nota Técnica, data, versão do classificador, confiança}. É o **escudo no auto de infração** — o que protege o contador. Hoje temos a *linguagem*; falta o *log*.
2. ⭐ **Risco jurídico classificado por pedido** — RT (restituição, mais seguro) vs compensação (PER/DCOMP, exposição a multa). Ligado ao precedente real do STF (ver §4): a multa isolada de 50% caiu, mas **a de 150% por declaração comprovadamente falsa persiste** — então a defesa É a proveniência de boa-fé.
3. ⭐ **Confiança calibrada "onde NÃO sei"** — banda alta/média/baixa por item e por ano, em vez de selo binário "tem crédito". Nenhum concorrente entrega humildade calibrada; todos vendem certeza.
4. ⭐ **Ligação nativa à Auditoria** — o indício NASCE da auditoria cClassTrib/NCM (mesma divergência que aponta erro hoje aponta o retroativo). Recuperação como **saída** do motor de apuração defensável, não produto isolado. É o nosso moat de produto (D6: isca que vende o recorrente).
5. **Tributarista no loop por design** — o software entrega o dossiê, o tributarista habilitado assina a PER/DCOMP. Vira credencial de confiança, não fraqueza (mata o "zero disclaimer" dos rivais).

---

## 4. Como o mercado precifica + estrutura jurídica (com fonte)

### Pricing (success-fee)
- **Faixa praticada: 1% a 20% sobre o valor recuperado** (honorários no êxito). Fonte: clickfiscal.com.br (precificação de honorários tributários) e esimplesauditoria.com — *"a porcentagem de honorários no êxito pode variar entre 1% e 20%"*. Em recuperação administrativa (rápida), **o mais comum é cobrar só no êxito** (sem fee fixo).
- **e-Auditoria** oferece modelos de contrato **com e sem multa rescisória** — sinal de que travam o cliente, ângulo de fricção que podemos evitar.
- **Nosso split atual (70 empresa / 15 plataforma / 15 contador)** está dentro da banda de mercado e respeita D6 (contador participa, linha separada do recorrente; o cliente final do contador não vê o split). Coerente — não muda.

### Mecanismo jurídico (CRÍTICO — corrige nuance do CONTEXT)
- **Monofásico Simples Nacional = restituição de DAS pago a maior** (receita de produto monofásico que não deveria compor a base do DAS). Fonte: recuperasimples.com — *"O processo de restituição inicia-se com o preenchimento do PER/DCOMP eletrônico disponível no e-CAC"* → **filed via PER/DCOMP eletrônico no e-CAC**, mas na modalidade **restituição** (RT), não compensação. Isto **confirma o D5** (RT default).
- **PIS/COFINS não-cumulativo (Lucro Real/Presumido)** = ressarcimento exige o **PGD PER/DCOMP instalado (versão 7.1)**, não o PER/DCOMP Web. Fonte: gov.br/receitafederal + diretolegaliza.com. → **dois caminhos técnicos diferentes** dependendo do regime do cliente. Nosso foco (farmácia/posto/mercado) é majoritariamente Simples → caminho restituição/e-CAC.
- **SELIC automática** já aplicada pelo PER/DCOMP Web na correção monetária dos créditos (2025+). Fonte: e-auditoria.com.br guia PER/DCOMP Web. → nosso cálculo de estimativa deve corrigir por SELIC pra bater com o que a Receita mostra.
- **Risco de multa (o pilar do nosso diferencial):**
  - STF, **Tema 736 / RE 796.939 + ADI 4905 (julgado 17/mar)**: **inconstitucional a multa isolada de 50%** pela mera não-homologação de compensação de boa-fé. Fontes: noticias.stf.jus.br, portal.stf.jus.br, machadomeyer.com.br.
  - **PERSISTE a multa de 150%** nos casos de **declaração de compensação comprovadamente falsa**. Fonte: STF (mesmo precedente). → **a defesa é a proveniência de boa-fé** = exatamente nossa trilha. Confirma o D5 (RT > compensação) e o diferencial.
  - Contexto 2025: MP 1303/25 (insegurança em compensação) **caducou em 08/out/2025** sem virar lei. Fonte: zeberadvogados.com.br. → cenário voltou ao status quo; não muda o plano.

### Estrutura jurídica do nosso modelo (pendência aberta do CONTEXT §8.2)
- O **software não protocola** — entrega o dossiê de evidências. **Quem assina a PER/DCOMP é o tributarista habilitado** (D6). Mantém-se.
- Pendente (não-resolvível por pesquisa de mercado, é decisão de estrutura): contrato de associação contador+tributarista + quem é o responsável técnico do pedido. Recomendo levar ao Heleno (clone tributário) antes de qualquer protocolo real.

---

## 5. O que NOSSA Recuperação tem hoje vs o GAP

**Caminho:** `apps/contador/app/recuperacao/` (page.tsx · RecuperacaoExplorer.tsx · recuperacao-model.ts · recuperacao-data.ts · .module.css)

### O que JÁ temos (e é bom — a camada do diferencial)
- ✅ **Indícios ligados à auditoria** com NCM, natureza, base normativa citada (Lei 10.147/2000, 9.718/1998, 10.833/2003).
- ✅ **Estimativa retroativa 5 anos com quebra ano-a-ano** + confiança rebaixada nos anos antigos (menos evidência).
- ✅ **Confiança calibrada** (alta/média/baixa) por item e por ano — humildade que o mercado não tem.
- ✅ **RT default vs PER/DCOMP com ressalva explícita de multa 150% se glosado** (D5) — diferencial #2, já na UI.
- ✅ **Calculadora de success-fee** com split 70/15/15 em linha separada (D6).
- ✅ **Preview estruturado de dossiê** (cabeçalho, itens, base normativa, ressalva de que o tributarista assina).
- ✅ **Linguagem G6 blindada** (indício/estimativa/sujeito a revisão; nunca "crédito garantido") — diferencial #5.
- ✅ **Contador de sunset 2027** (urgência real, sem exagero).
- ✅ Foco correto nos 3 setores de alto SKU monofásico (farmácia, posto, mercado).

### O GAP (o que falta pra deixar de ser demo e competir)

| Prioridade | Gap | Por que importa |
|:---:|-----|-----------------|
| **P0 (table-stake)** | **Ingestão de dado real**: XML (entrada/saída), SPED (EFD-Contribuições / EFD-ICMS), PGDAS-D | Sem dado real não há crédito — só vitrine. É a fundação de TUDO. |
| **P0 (table-stake)** | **Motor de identificação monofásico item-a-item** (NCM→lista monofásica + descrição/barcode fallback) | É o cálculo do crédito. Reusa o classificador NCM/cClassTrib da Auditoria (mesmo motor). |
| **P0 (table-stake)** | **Cálculo do crédito por período com correção SELIC** | Precisa bater com o que a Receita mostra no PER/DCOMP Web. |
| **P1 (diferencial)** | **Trilha de boa-fé PERSISTIDA** (log imutável por indício e por pedido: nota+NCM+norma+NT+data+versão classificador+confiança) | Hoje é texto de UI. É o nosso moat real (§3 dif #1). Sem persistência, é só copy. |
| **P1** | **Dossiê exportável de verdade** (PDF/arquivo) com a trilha embutida — não só preview na tela | É o entregável que o tributarista revisa e assina. |
| **P2** | **Geração assistida do PER/DCOMP / arquivo de restituição** (rascunho pro tributarista revisar — nunca auto-protocolo) | e-Auditoria já indica isto ("automatiza geração do arquivo"). Table-stake emergente, mas com humano no loop (D6/D8). |
| **P2** | **Acompanhamento de status do pedido** | NINGUÉM faz bem — seria diferencial, mas depende de e-CAC/Integra Contador (Fase 2). Não é mínimo viável. |
| **Não fazer agora** | Multi-tese além do monofásico (Tema 69 ICMS, DIFAL), Lucro Real PGD 7.1, enterprise | Fora do ICP/escopo mínimo. Sunset 2027 prioriza monofásico Simples. |

### Recomendação de sequência (alinhada ao D4 — Concierge MVP antes de build)
1. **Concierge (agora):** o motor P0 roda **manual nos bastidores** (Breno+AIOS lendo XML/SPED dos 5 escritórios do Renan); a UI atual já é o **laudo white-label**. Valida pagamento ANTES de construir ingestão.
2. **Build P0** só após pagamento real: ingestão + identificação + cálculo SELIC.
3. **Build P1** (trilha persistida + dossiê exportável) — é o que justifica preço acima dos rivais "zero disclaimer".
4. **P2** (geração assistida PER/DCOMP + status) entra com a Fase 2/7, junto com e-CAC.

---

## 6. Fontes (URLs primárias)

**Concorrentes (produto):**
- Recupera Simples — https://recuperasimples.com.br/ · https://recuperasimples.com.br/como-recuperar-pis-e-cofins-monofasico-simples-nacional/
- é-Simples Auditoria — https://www.esimplesauditoria.com/ · https://www.esimplesauditoria.com/pis-e-cofins-monofasicos · https://esimples.crisp.help/pt/category/e-recupera-11vc1uw/
- e-Auditoria — https://www.e-auditoria.com.br/blog/recuperacao-de-creditos-de-pis-e-cofins-no-simples-nacional/ · https://manuais.e-auditoria.com.br/e-Recuperador/pis_cofins_monofasicos___simples_nacional.htm · https://www.e-auditoria.com.br/blog/per-dcomp-web-guia-compensacao-tributaria/
- Roit — https://www.roit.com.br/
- Taxcel TaxSheets — https://taxcel.com.br/taxsheets
- Econet Recuperador — https://grupo.econeteditora.com.br/lp/recuperador/ · https://www.legisweb.com.br/produtos/sistemas/recuperador_pis_cofins/
- Sittax — https://sittax.com.br/
- Dootax (PER/DCOMP, não-concorrente) — https://dootax.com.br/perdcomp/

**Mecanismo jurídico / PER/DCOMP / Receita:**
- Receita Federal — PER/DCOMP Web ressarcimento PIS/COFINS não-cumulativos (PDF) — https://www.gov.br/receitafederal/pt-br/assuntos/orientacao-tributaria/restituicao-ressarcimento-reembolso-e-compensacao/per_dcomp-web_-ressarcimento-de-pis_pasep-e-cofins-nao-cumulativos.pdf
- PER/DCOMP 2026 (PGD 7.1 vs Web) — https://diretolegaliza.com/perdcomp-restituicao-compensacao-2026/ · https://www.barbieriadvogados.com/per-dcomp/
- Trivium (PER/DCOMP PIS/COFINS) — https://triviumcontabil.com.br/recuperacao-tributos-pis-cofins-per-dcomp/

**Risco de multa / STF:**
- STF — multa de compensação não homologada inconstitucional — https://noticias.stf.jus.br/postsnoticias/multa-imposta-pela-receita-federal-em-pedido-de-compensacao-nao-homologado-e-inconstitucional/
- STF Tema 736 (andamento) — https://portal.stf.jus.br/jurisprudenciaRepercussao/verAndamentoProcesso.asp?incidente=4531713&numeroProcesso=796939&classeProcesso=RE&numeroTema=736
- Machado Meyer (análise) — https://www.machadomeyer.com.br/pt/inteligencia-juridica/publicacoes-ij/tributario-ij/multa-de-50-sobre-compensacao-tributaria-nao-homologada-e-inconstitucional
- MP 1303/25 caducou — https://zeberadvogados.com.br/mp-1303-25-compensacao-tributaria/

**Pricing (honorários no êxito 1%–20%):**
- ClickFiscal (precificação honorários tributários) — https://clickfiscal.com.br/como-precificar-honorarios-tributarios/
- é-Simples (recuperação tributária) — https://www.esimplesauditoria.com/recuperacao-tributaria

**Setores monofásico / farmácia:**
- Santos Câmara (guia farmácia 2026) — https://santoscamara.com.br/blog/pis-cofins-monofasico-guia-completo.html
- Mastronardi (farmácia) — https://mastronardi.adv.br/noticias/index.php/2025/09/30/sua-farmacia-pode-estar-pagando-impostos-a-mais-entenda-a-tributacao-monofasica-e-como-recuperar-creditos/

---

## 7. Notas de confiança e pendências
- **ALTA confiança:** existência/posicionamento dos concorrentes 1-5; mecanismo restituição via PER/DCOMP e-CAC; STF Tema 736 (50% inconstitucional, 150% persiste); faixa de honorários 1-20%; SELIC automática.
- **MÉDIA:** geração de arquivo PER/DCOMP por concorrente (e-Auditoria "em alguns casos" — não verifiquei a tela do produto, fonte é blog/manual redirecionado); Econet/Sittax (achados de busca, não fetch do produto).
- **NÃO ENCONTRADO:** % de success-fee específico de cada concorrente (todos opacos — pedem demo/contato); reputação ReclameAqui (não indexada nas buscas); **C-TAX/CITAX e Loara** como produto de recuperação monofásico (confirmar com Renan se são nomes reais/regionais).
- **Pendência jurídica** (não-resolvível por mercado): estrutura do contrato contador+tributarista e responsável técnico do pedido → levar ao clone Heleno antes de protocolo real.
