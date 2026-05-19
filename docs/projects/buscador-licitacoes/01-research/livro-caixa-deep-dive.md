# Livro Caixa — Deep Dive (Construir vs Integrar)

**Projeto:** Buscador de Licitações DF + Águas Lindas-GO
**Módulo:** Livro Caixa Multi-CNPJ (4 empresas coligadas do amigo do user)
**Data:** 2026-05-18
**Autor:** Atlas (Analyst)
**Status:** Research v1 — pronto pra revisar com user

---

## Executive Summary

1. **Livro Caixa é OBRIGATÓRIO** para Simples Nacional (Resolução CGSN 140/2018 Art. 63 inciso I) e Lucro Presumido (RIR/2018). A falta dele leva a **exclusão de ofício do Simples** (LC 123/2006 art. 29 VIII), multa mínima de **10% dos tributos do mês anterior, mínimo R$200**, e em caso de omissão de receita detectada, **75% sobre o tributo apurado, até 150% se fraude** (RIR/2018). Não é decorativo — é hard requirement legal.

2. **Mercado SaaS BR já tem 6-8 players maduros** (Conta Azul, Omie, Nibo, Bling, Tiny, Granatum, Treasy, Sage). Todos suportam multi-CNPJ, mas **a maioria cobra por CNPJ separado** — 4 empresas custariam R$640-R$1.920/mês (com Conta Azul Essencial R$159,90 × 4 = R$639,60 sendo o piso). Exceção: **Granatum R$396/mês plano único usuários ilimitados** sem clareza sobre multi-CNPJ no site.

3. **>>> DECISION POINT (1):** O Cenário-Recomendado é **NÃO CONSTRUIR Livro Caixa do zero**. Construir do zero significa replicar funcionalidade comoditizada (4-8 sêmanas dev + manutenção legal contínua) sem moat. O valor real está na **camada de SINERGIA com licitação** — gerar automaticamente o balanço/DRE/índices que o edital pede, a partir dos lançamentos contábeis.

4. **A grande sinergia com o projeto-pai existe e é defensável:** Editais de licitação (Lei 14.133/2021 art. 69) exigem **Balanço Patrimonial + DRE dos 2 últimos exercícios + cálculo de índices LG/SG/LC > 1**. Se o sistema já tem os dados contábeis das 4 empresas estruturados, gerar esses anexos por edital pode ser **um diferencial vertical único** que players nacionais (Effecti, Conlicitação) não têm e ERPs financeiros (Conta Azul, Omie) não têm pq não falam com PNCP.

5. **Risco legal coligadas (Lei 14.133/2021 + LC 123/2006):** Empresas controladas/controladoras/coligadas **não podem competir juntas na mesma licitação** (regra Lei 6.404). O sistema precisa de um **flag de "grupo econômico" e bloqueio automático de proposta dupla** — risco operacional ALTO, não pode ser ignorado em UX.

6. **Open Finance BR resolveu conciliação bancária.** Pluggy e Belvo já entregam conexão direta com bancos via API regulada pelo BCB, eliminando OFX/CSV manual. Custo: Pluggy a partir de R$0,50-R$2 por conexão/mês escala SMB. Para 4 CNPJs × 1-2 contas cada = 4-8 conexões, ~R$8-R$32/mês infra.

7. **Volume real estimado (4 empresas pequenas-médias B2B governo regional):** 50-300 lançamentos/mês/empresa = 200-1200 lançamentos/mês total. **Volume baixo demais para justificar dev custom.** Excel + contador resolveria — mas perde sinergia licitação. Sistema híbrido (importar OFX/Open Finance + classificar + exportar SPED ou modelo CGSN 140 Anexo IX) é viável em escopo enxuto.

8. **>>> DECISION POINT (2):** Recomendação final é **HYBRID FINO**: NÃO construir Livro Caixa completo, MAS construir uma "camada de dados financeiros mínima" (Postgres com tabela `financial_entries` + importador OFX/Pluggy + classificador simples) que sirva **apenas** para gerar anexos de licitação. Para escrituração fiscal real, integrar via API com **Nibo** ou **Conta Azul** (ambos têm API pública decente) OU usar contador externo Tradicional. Esse hybrid mantém moat (sinergia) sem replicar comoditização.

9. **ECD/ECF é não-tópico para Simples Nacional.** ME/EPP do Simples são dispensados de ECD/ECF — mantêm apenas Livro Caixa simplificado (Anexo IX CGSN 140). Só importa se alguma das 4 empresas saiu do Simples para Lucro Presumido.

10. **Próximo passo P0:** Descobrir regime tributário das 4 empresas + se compartilham contador + faturamento anual atual. Sem isso, escolha build/buy/hybrid é especulativa. Sugestão: **1 ligação 15min** com o amigo cobrindo 7 perguntas (lista em §F.4).

---

## A. Conceito e Obrigatoriedade

### A.1 O que é Livro Caixa exatamente

Livro Caixa é um livro fiscal-financeiro onde **toda a movimentação de caixa e bancária da empresa** é escriturada cronologicamente, lançamento a lançamento, com data, histórico, valor e contra-partida. É o registro mínimo exigido pela Receita Federal para empresas que **não fazem escrituração contábil completa** (Diário + Razão).

**Comparativo com outros livros:**

| Livro | O que registra | Quem usa | Substitui Livro Caixa? |
|-------|----------------|----------|------------------------|
| **Livro Caixa** | Entradas/saídas de caixa e banco, cronológico | Simples Nacional, Lucro Presumido sem ECD | — |
| **Livro Diário** | Todos os fatos contábeis em ordem cronológica (partidas dobradas) | Lucro Real, Lucro Presumido com ECD, S.A. | SIM (CGSN 140 art. 63 §3º) |
| **Livro Razão** | Mesmos fatos do Diário, agrupados por conta contábil | Mesmas empresas acima, complementa Diário | SIM (junto com Diário) |
| **LALUR** (Livro de Apuração do Lucro Real) | Ajustes do lucro contábil → lucro fiscal | Apenas Lucro Real | Não substitui (é para outro fim) |
| **ECD** (Escrituração Contábil Digital) | Versão digital SPED do Diário+Razão+Balancetes | Lucro Real (obrigatório), Lucro Presumido (condicional), S/A | SIM (substitui Diário em papel) |
| **ECF** (Escrituração Contábil Fiscal) | Ajustes fiscais e apuração IRPJ/CSLL | Lucro Real e Presumido (não-Simples) | Não (é declaração) |

> **Tese:** Livro Caixa é o "mínimo viável legal" pra empresas pequenas. Quem cresce migra para escrituração contábil completa (Diário+Razão+ECD), o que automaticamente dispensa Livro Caixa.

### A.2 Obrigatoriedade por regime tributário

#### Simples Nacional
- **OBRIGATÓRIO** pela Resolução CGSN nº 140/2018 art. 63 inciso I, modelo do Anexo IX
- **MEI** está dispensado de Livro Caixa formal — apenas Relatório Mensal de Receitas Brutas (DAS-MEI)
- **Dispensa parcial:** se a empresa optar por fazer escrituração contábil completa (Diário+Razão), o Livro Caixa é dispensado (§3º art. 63)
- **Penalidade por falta:** exclusão de ofício do Simples Nacional (LC 123/2006 art. 29 VIII) + retroatividade dos efeitos da exclusão até 3 anos (art. 33)

#### Lucro Presumido
- **OBRIGATÓRIO** pelo RIR/2018 (Decreto 9.580/2018) — empresa deve manter "Livro Caixa, no qual deverá estar escriturada toda a movimentação financeira, inclusive bancária" OU escrituração contábil completa (Lei 8.981/1995 art. 45)
- Se opta pelo regime de competência (não-caixa), é obrigada a ter ECD
- Se opta pelo regime de caixa para receitas com vendas a prazo, deve indicar no Livro Caixa a NF correspondente a cada recebimento (regime caixa específico)

#### Lucro Real
- **Livro Caixa NÃO é o instrumento principal** — exige Diário + Razão + LALUR + ECD obrigatória
- Falta de Diário/Razão pode levar a **arbitramento do lucro** pela Receita Federal (RIR/2018), com base de cálculo presumida + multa

#### Imune / Isenta (entidades sem fins lucrativos, igrejas, etc.)
- Geralmente exigida escrituração contábil completa (ITG 2002 do CFC)
- Livro Caixa não substitui — esse regime já assume contador

### A.3 Marcos legais (PARA CITAR EM CONTRATO/MARKETING)

| Norma | O que diz |
|-------|-----------|
| **Lei Complementar 123/2006** art. 26 §2º e art. 29 inciso VIII | Define escrituração do Livro Caixa como obrigação acessória do Simples Nacional + prevê exclusão por falta |
| **Resolução CGSN nº 140/2018** art. 63 e Anexo IX | Detalha conteúdo mínimo e modelo do Livro Caixa para Simples |
| **Decreto 9.580/2018 (RIR/2018)** Livro II Título IX | Lucro Presumido — obrigações acessórias incluindo Livro Caixa |
| **Lei 8.981/1995** art. 45 | Origem legal do Livro Caixa para Presumido (sem ECD) |
| **Lei 14.133/2021** art. 69 | Habilitação econômico-financeira em licitações — BP + DRE dos últimos 2 exercícios |
| **Norma Brasileira de Contabilidade ITG 1000** (CFC) | Modelo contábil simplificado para ME/EPP |

### A.4 Penalidades reais

| Cenário | Penalidade |
|---------|-----------|
| Simples Nacional sem Livro Caixa, fiscalizado | Exclusão de ofício do Simples + multa 10% dos tributos do mês (mín R$200) |
| Lucro Presumido sem Livro Caixa nem ECD | Arbitramento do lucro pela RFB + multa 75% sobre IRPJ/CSLL apurado |
| Omissão de receita identificada | Multa de ofício 75% sobre o tributo, podendo escalar para 150% em caso de reincidência/fraude (RIR/2018 + STF) |
| Livro Caixa mal escriturado/incompleto | Multa por descumprimento de obrigação acessória (geralmente R$500-R$1.500 por ano) |

### A.5 Frequência de exigência em fiscalização real

- **Auditoria fiscal periódica:** rara em empresas pequenas (<R$1M faturamento). Quando ocorre, Livro Caixa é o primeiro documento solicitado.
- **Cruzamento DCTFweb / DEFIS / DASN-SIMEI:** Receita compara declarações com presunções; se há divergência, pede Livro Caixa para conferir base.
- **Restituição/compensação tributária:** exige Livro Caixa para comprovar a origem do crédito.
- **Distribuição de lucros isenta:** novo gatilho a partir de 2026 — se distribui acima da presunção, Receita exige Livro Caixa ou escrituração contábil para validar (Lei 15.270/2025).
- **Habilitação em licitação:** órgão público às vezes pede Livro Caixa como anexo complementar ao BP.

> **Insight crítico:** A obrigatoriedade é alta mas a fiscalização é baixa-média. Muitas empresas pequenas operam sem Livro Caixa formal por anos sem problemas — até serem fiscalizadas, momento em que é desastre. Para empresas que **participam de licitações públicas**, o risco é ampliado, porque o próprio órgão público pode pedir o Livro Caixa como parte da habilitação.

---

## B. Conteúdo Mínimo

### B.1 Campos obrigatórios por lançamento (Anexo IX CGSN 140/2018)

```
| Data       | Histórico         | Documento     | Conta             | Entrada (R$) | Saída (R$) | Saldo (R$) |
|------------|-------------------|---------------|-------------------|--------------|------------|------------|
| 2026-05-15 | Venda NF 1234     | NF-e 1234     | Caixa             | 5.000,00     |            | 12.500,00  |
| 2026-05-15 | Pagto fornecedor  | Boleto X      | Banco BB CC       |              | 800,00     | 11.700,00  |
```

**Campos obrigatórios:**
1. **Data** do evento (dia/mês/ano)
2. **Histórico** descritivo curto (o que aconteceu)
3. **Número do documento** (NF, recibo, boleto, contrato) — obrigatório para Lucro Presumido em regime caixa
4. **Conta** (Caixa, Banco X CC, Aplicação Y)
5. **Valor de entrada** OU **valor de saída** (mutuamente exclusivos no lançamento)
6. **Saldo após o lançamento**

### B.2 Saldo: diário vs mensal

- **Diário é a regra** para Livro Caixa formal. Saldo deve "fechar" todo dia (entradas - saídas + saldo anterior = saldo atual).
- Mensal é aceitável apenas para sumário gerencial, **não substitui** o lançamento diário.
- ERPs modernos (Conta Azul, Omie) calculam saldo automaticamente — campo não precisa ser digitado.

### B.3 Vinculação com extrato bancário

- **Não é obrigação legal**, mas é prática consolidada e exigência de fiscalização: cada entrada/saída do banco deve ter lançamento correspondente no Livro Caixa.
- **Conciliação bancária** é o processo de garantir essa correspondência. Open Finance BR automatiza isso desde 2022.
- Se a Receita identifica movimentação bancária não-escriturada, presume-se omissão de receita (RIR/2018).

### B.4 Documentos comprobatórios (anexar?)

- Lei **não exige** anexação de NF/recibo ao próprio Livro Caixa — exige que estejam guardados separadamente.
- Prazo de guarda: **5 anos** (prescrição tributária ordinária) — extendível a 10 anos em casos específicos.
- **Tendência prática:** ERPs modernos anexam PDF/imagem ao lançamento (Conta Azul, Omie permitem isso). É boa prática e simplifica fiscalização.
- **Para licitação:** órgão pode exigir comprovantes específicos (contratos, NFs grandes). Sistema bem-organizado tem essa lookup pronto.

### B.5 Vs ECD/ECF (quando substitui, quando complementa)

| Situação | Livro Caixa | ECD | ECF | Notas |
|----------|-------------|-----|-----|-------|
| Simples Nacional faturamento <R$4,8M | **Obrigatório** | Dispensado | Dispensado | Anexo IX CGSN 140 |
| Lucro Presumido + regime caixa | **Obrigatório** | Dispensado | Obrigatória | RIR/2018 |
| Lucro Presumido + regime competência | Dispensado | **Obrigatória** | Obrigatória | Substitui Caixa |
| Lucro Real | Dispensado | **Obrigatória** | Obrigatória | Mínimo legal absoluto |
| Distribuição lucros acima presunção | Recomendado | Comprova distribuição isenta | — | Lei 15.270/2025 |

### B.6 Formato aceito

- **Papel:** legalmente válido mas raro em 2026. Precisa registrar na Junta Comercial (custo R$30-R$80/empresa/ano).
- **Digital simples (PDF, Excel):** válido se escriturado corretamente, com assinatura do contador e do empresário. Não precisa registrar em Junta para Simples Nacional (CFC dispensa). Lucro Presumido idealmente registra em Junta Comercial digital (DigitalSign).
- **SPED:** Livro Caixa **não é entregue via SPED** (SPED é para ECD/ECF/Fiscal). Mas pode ser exportado em PDF assinado digitalmente, gerado pelos ERPs.

---

## C. Workflow Real para 4 Empresas Coligadas

### C.1 Como fornecedores B2B pequenos fazem hoje

**Três modelos predominantes (não-mutuamente-exclusivos):**

#### Modelo 1 — Excel + Contador (R$0-R$300/mês)
- Empresa lança em planilha (Excel/Google Sheets)
- Manda extrato bancário pdf/ofx para o contador toda 1ª semana do mês
- Contador concilia, gera DAS/DCTFweb/EFD-Reinf/etc + Livro Caixa formatado
- **Custo:** contador R$300-R$1.500/mês (varia por região e complexidade) + R$0 software (planilha)
- **Vantagens:** barato, contador cuida do legalês
- **Desvantagens:** dependência do contador, erros manuais frequentes, sem visão fluxo de caixa real-time, retrabalho na conciliação

#### Modelo 2 — ERP cloud + Contador (R$200-R$1.500/mês)
- Empresa lança no ERP (Conta Azul, Omie, Nibo) ou ERP importa via Open Finance/OFX
- ERP exporta dados para o sistema do contador (via API ou exportação manual)
- Contador valida e fecha mês
- **Custo:** ERP R$100-R$700/CNPJ/mês + contador R$200-R$1.000/mês (mais barato porque tem menos retrabalho)
- **Vantagens:** real-time, automação de conciliação, NF-e emissão integrada
- **Desvantagens:** custo, curva de aprendizado, integração com contador depende do sistema dele

#### Modelo 3 — ERP cloud + BPO financeiro (R$2.000-R$10.000/mês)
- BPO faz tudo (lançamento, conciliação, contas a pagar, faturamento)
- Empresário só revisa
- **Custo:** alto, faz sentido apenas para empresas com R$50K+ faturamento/mês
- **Improvável** para perfil "fornecedor regional pequeno" do amigo

### C.2 Multi-tenant accounting: 4 CNPJs, 1 contador comum, 1 dono

**Cenários práticos para 4 empresas coligadas:**

#### Opção A — 4 contratos de ERP separados (cada empresa um login)
- Custo: 4 × preço do plano (R$160 × 4 = R$640/mês Conta Azul; R$208 × 4 = R$832/mês Nibo)
- Vantagem: dados completamente isolados
- Desvantagem: empresário precisa alternar logins, contador precisa baixar dados 4 vezes

#### Opção B — Plano "Mais"/"Contador" da fornecedora (ERP-side multi-tenant)
- **Conta Azul Mais:** grátis para o contador, paga apenas as licenças dos clientes. Tem visão consolidada portfolio.
- **Nibo Programa de Parcerias:** licença Premium grátis para contador, 30-50% desconto nas licenças dos clientes.
- **Omie:** integração contador via API, plano contador descontado.
- Vantagem: contador trabalha em uma tela só
- Desvantagem: empresário ainda alterna 4 logins; preço por CNPJ continua

#### Opção C — Granatum (plano único)
- R$396/mês cobre "usuários ilimitados, contas bancárias ilimitadas, plano de contas ilimitados"
- **Não é claro no site se múltiplos CNPJs estão inclusos no plano único** — precisa validar com vendas
- Se incluso, **é a opção mais barata para 4 CNPJs** (R$396 vs R$640+)

#### Opção D — Tiny ERP (Olist) plano "Crescer"
- R$99/mês com Multiempresa nativo (gestão de múltiplos CNPJs em 1 conta) — anúncio público recente baixou para R$29/mês plano de entrada
- Originalmente foco e-commerce, mas tem livro caixa básico
- **Caveat:** Tiny é mais e-commerce/varejo, menos "B2B governo"; pode faltar nuance fiscal de Presumido

### C.3 Conciliação bancária — Open Banking BR já viabiliza?

**SIM, totalmente.** Open Finance está em fase 4 (compartilhamento de pagamentos/transações) desde 2022 e os principais bancos brasileiros estão integrados.

**Players de API:**
- **Pluggy** — fundada 2020, foco SMB, ISO 27001, R$0,50-R$2 por conexão/mês para volume baixo, suporta 30+ bancos via Open Finance + scraping legado (Bradesco, Itaú, Santander, BB, Caixa, NuBank, Inter, etc.)
- **Belvo** — pan-LATAM, mais focado fintechs maiores, pricing customizado, mais robusto institucionalmente
- **Bankly / Stark Bank / BTG Pactual Open Finance** — bancos com APIs próprias diretas

**Para 4 CNPJs × 1-2 contas bancárias = 4-8 conexões:** custo Pluggy estimado R$8-R$32/mês. Trivial.

### C.4 Integrações com formas de pagamento

| Forma | Integração ERP | Notas |
|-------|----------------|-------|
| **PIX** | Nativa em todos ERPs cloud + bancos via Open Finance | Já é padrão; ERP recebe webhook e lança automaticamente |
| **Boleto** | Emissão + conciliação via Open Finance | Conta Azul/Omie/Nibo emitem boleto direto integrados |
| **TED/DOC** | Open Finance lê via extrato; emissão precisa contar com banco | Saídas legíveis, entradas legíveis |
| **Cartão de crédito** | Adquirente envia conciliação (Cielo, Stone, Pagseguro) | Adicional R$30-R$100/mês por máquina |
| **Cheque** | Quase morto; lançamento manual | Raro em B2B governo |

### C.5 Tempo médio mensal para manter Livro Caixa atualizado

**Benchmarks (empresa pequena, 50-300 lançamentos/mês):**

| Modelo | Tempo empresário | Tempo contador | Total |
|--------|------------------|----------------|-------|
| Excel manual | 4-8h | 2-4h | 6-12h |
| ERP com importação OFX manual | 2-3h | 1-2h | 3-5h |
| ERP com Open Finance auto | 0,5-1h (apenas categorizar) | 1h | 1,5-2h |
| ERP + BPO completo | 0,2h (review) | 0h (terceirizado) | 0,2h + custo BPO |

**Para 4 empresas:** multiplique por 4 (com paralelismo possível mas limitado).

### C.6 Risco específico das coligadas em licitação

**Lei 6.404/1976** define coligadas/controladas/controladoras. **Lei 14.133/2021 + jurisprudência TCU** veda que **empresas do mesmo grupo econômico** participem **juntas da mesma licitação** — caracteriza conluio (Art. 14, IV).

**Implicação para o sistema:**
- Cada empresa pode competir **em editais diferentes** — OK
- Cada empresa NÃO pode submeter proposta no **mesmo edital** — bloqueio crítico
- O sistema deve ter:
  - Tabela `company_group` ou flag `parent_group_id` em cada CNPJ
  - Regra de alerta antes de mandar proposta dupla
  - Log de auditoria das licitações onde apenas 1 do grupo participou

> **>>> DECISION POINT (3):** Esse "anti-conluio guard" é um diferencial defensável que **nenhum buscador nacional tem** (eles não sabem que as empresas são do mesmo grupo). Para o user e o amigo dele com 4 empresas, **é feature P0**.

---

## D. Ferramentas Existentes (Mercado Brasileiro)

### D.1 Tabela comparativa

| Ferramenta | Preço/mês (Brl) | Livro Caixa nativo | Multi-CNPJ | API Pública | Open Finance | Foco | Recomendação 4 coligadas |
|------------|-----------------|-------------------|-----------|-------------|--------------|------|--------------------------|
| **Conta Azul** | R$159,90 (Essencial) → R$719,90 (Performance), anual | SIM (exportável) | Por CNPJ separado; integração "Mais" agrega tudo na visão contador | SIM (REST, OAuth2) | SIM (nativo) | PME geral, contador-friendly | R$640/mês (4× Essencial) ou R$400+ via plano contador |
| **Omie** | R$49 (Fit MEI) → R$1.499 (top), sob consulta | SIM | Multi-empresa "na mesma tela" como diferencial | SIM (REST robusta, [developer.omie.com.br](https://developer.omie.com.br)) | SIM | PME serviços + comércio | Bom para 4 CNPJs (multi-empresa nativo), preço sob consulta |
| **Nibo** | R$208 (Light), R$312 (Plus), R$479 (Premium) | SIM (financeiro/contábil) | Plano Premium tem API; multiempresa via parceria contador | SIM (REST, API pública no Premium) | SIM (nativo) | BPO financeiro, gestão para serviços | R$832/mês 4× Light, ou Premium R$479 + parceria contador |
| **Bling** | R$30 → R$200 | LIMITADO (foco fiscal/vendas, livro caixa fraco) | Por CNPJ separado | SIM | LIMITADO | E-commerce, varejo, NF-e | Não recomendado p/ B2B governo |
| **Tiny ERP (Olist)** | R$29 (entry) → R$99 (Crescer com Multiempresa) | BÁSICO | Multiempresa NATIVO no plano R$99 | SIM | SIM | E-commerce, marketplaces | R$99/mês cobre 4 CNPJs, mas foco fraco em B2B/contador |
| **Granatum** | R$396 (plano único) | SIM (DRE, fluxo caixa, conciliação) | Não-explícito; "ilimitado contas+plano contas" sugere sim, validar | SIM (não-clara abertura) | SIM | Gestão financeira simplificada | Possivelmente melhor custo-benefício se confirmar multi-CNPJ; precisa contato comercial |
| **Treasy** | R$60+ (plano grátis disponível) | NÃO (foco BI/orçamento) | Multi-empresa NATIVO | Não pública | NÃO direto | Planejamento orçamentário, controladoria | Complementa, não substitui ERP |
| **Sage** | sob consulta (R$500+/mês) | SIM | SIM | SIM | Parcial | Médias empresas, contador profissional | Caro demais para 4 empresas pequenas |
| **LedContábil** | sob consulta (R$200+/mês) | NÃO (é sistema do contador) | SIM (multi-empresa nativa) | LIMITADO | NÃO | Escritórios contábeis | Para contador, não para empresário |
| **Domínio (Thomson Reuters)** | sob consulta (alto) | NÃO (é sistema do contador) | SIM | SIM | Parcial | Escritórios contábeis grandes | Para contador, não relevante aqui |

### D.2 Avaliação rápida por critério

**Melhor para 4 CNPJs com orçamento apertado:**
1. **Tiny ERP (Olist) Crescer R$99/mês** — multiempresa nativo, baratíssimo. **Risco:** foco e-commerce pode faltar nuance B2B governo.
2. **Granatum R$396/mês** — se confirmar multi-CNPJ, melhor preço por feature.
3. **Conta Azul via plano "Mais" do contador** — empresário paga R$100/CNPJ + contador grátis; total ~R$400-R$500/mês para 4.

**Melhor para integração com sistema custom (API):**
1. **Omie** — API mais robusta e bem-documentada do mercado; ecossistema ampla.
2. **Nibo Premium** — API pública mas só no plano Premium R$479/mês.
3. **Conta Azul** — API estável, OAuth2, boa documentação.

**Melhor para integração contador:**
1. **Conta Azul Mais** — grátis para contador, exportação para Domínio automática.
2. **Nibo** — interface explícita "área do contador", parceria 30-50% desconto.
3. **Omie** — boa integração contábil via API.

### D.3 Alertas e gotchas

- **Preço por CNPJ é a regra, não exceção.** Plano único "ilimitado" só Granatum (validar).
- **API gratuita vs paga:** Omie e Conta Azul incluem API nos planos pagos sem cobrar à parte. Nibo só Premium. Bling/Tiny costuma limitar volume de chamadas.
- **Multi-empresa "real" vs "alternar login":** Tiny ERP e Omie têm multi-empresa nativo (1 conta, vários CNPJs). Conta Azul e Nibo é mais "1 login do contador vê todos os clientes" — empresário ainda alterna.
- **LGPD:** todos esses ERPs são adequados, mas DPA (Data Processing Agreement) só estará formalizado nos planos Empresariais.
- **Tributação atualizada:** Conta Azul e Omie atualizam regras tributárias automaticamente; Bling fica atrás.

---

## E. Integração com Licitações (Sinergia com Projeto-Pai)

### E.1 Documentos contábeis exigidos em editais

**Lei 14.133/2021, art. 69, §1º** (Habilitação econômico-financeira) exige:

1. **Balanço Patrimonial** (BP) dos **2 últimos exercícios sociais** já exigíveis e apresentados (não pode ser balancete provisório)
2. **Demonstração do Resultado do Exercício** (DRE) dos mesmos 2 exercícios
3. **Demonstrações contábeis assinadas** por contador habilitado (CRC ativo) e pelo empresário
4. **Cálculo dos índices contábeis** (LG, LC, SG e GE — Endividamento)
5. **Certidão negativa de falência/concordata/recuperação judicial** (do cartório distribuidor)
6. **Capital social mínimo** ou **patrimônio líquido mínimo** (limitado a 10% do valor estimado da contratação, art. 69 §6º)

**Para ME/EPP no Simples Nacional:**
- Há jurisprudência (TCU + ConJur) discutindo se ME/EPP do Simples pode apresentar **declaração de equiparação** ou **DASN-SIMEI/DEFIS** no lugar do BP — depende do edital
- Boas práticas: ME/EPP que pretendem licitar **devem ter BP formal** mesmo sendo Simples (vale a pena pagar contador um pouco mais para isso)

### E.2 SINERGIA-CHAVE: gerar automaticamente os anexos

**Hipótese central:** Se o sistema tem dados financeiros estruturados de cada CNPJ (lançamentos + classificação contábil + saldos), pode **automaticamente**:

1. Compilar BP simplificado (ativo, passivo, PL) para cada empresa anualmente
2. Compilar DRE simplificada (receita, custos, despesas, resultado) anualmente
3. Calcular índices LG, LC, SG, GE para verificar **habilitação automática** em edital
4. Sinalizar "habilita / não habilita / margin" antes do usuário gastar tempo na proposta

**Esse é o moat real que o projeto-pai (buscador) ganha com Livro Caixa integrado.**

**Exemplo de flow:**
```
1. Sistema detecta edital novo no PNCP
2. Lê edital, extrai índices exigidos: LG ≥ 1,2 / SG ≥ 1,5 / GE ≤ 0,8
3. Cross-check com dados financeiros de Empresa A, B, C, D
4. Output: "Empresa A: ✓ habilita (LG=1,35, SG=1,8, GE=0,5) | Empresa B: ✗ LG=0,9 abaixo do exigido"
5. User economiza 30min por edital decidindo quem submete
```

### E.3 Índices financeiros típicos em editais

| Índice | Fórmula | Valor típico exigido |
|--------|---------|----------------------|
| **Liquidez Geral (LG)** | (AC + RLP) / (PC + PNC) | ≥ 1,0 (TCU: faixa 1,0-1,5) |
| **Liquidez Corrente (LC)** | AC / PC | ≥ 1,0 (TCU: faixa 1,0-1,5) |
| **Solvência Geral (SG)** | AT / (PC + PNC) | ≥ 1,0 |
| **Endividamento (GE)** | (PC + PNC) / AT | ≤ 1,0 (TCU: faixa 0,8-1,0) |

**Legenda:**
- AC = Ativo Circulante
- RLP = Realizável a Longo Prazo
- PC = Passivo Circulante
- PNC = Passivo Não Circulante
- AT = Ativo Total

**Limites do administrador (TCU):**
- Não pode exigir índices "extraordinários" (Lucratividade, Rentabilidade — vedados Art. 69 §1º)
- Não pode exigir valores acima do necessário para executar o contrato
- Faturamento mínimo é vedado como critério de habilitação

### E.4 Validade dos documentos

| Documento | Validade |
|-----------|----------|
| **Balanço Patrimonial** | Geralmente válido até 30 de abril do ano seguinte (data limite de assinatura na Junta Comercial) |
| **DRE** | Mesmo ciclo do BP |
| **Certidão negativa falência** | 30-90 dias (varia por edital) |
| **Certidões negativas tributárias** | 180 dias (federal/estadual/municipal) |
| **CNPJ ativo** | sempre via Receita |

**Implicação para sistema:**
- BP/DRE precisa ser atualizado anualmente — feature do sistema pode lembrar empresário em fevereiro/março de fechar BP do ano anterior
- Sistema pode armazenar PDF assinado do BP/DRE de cada empresa + emitir alertas de validade

### E.5 Outros documentos contábeis comuns em editais

- **Comprovante de capital social registrado** (geralmente do Contrato Social) — não-contábil mas relacionado
- **Garantia de proposta** (até 1% do valor estimado, Lei 14.133 art. 96) — apólice de seguro ou caução
- **Garantia contratual** (até 5%, podendo 10% em casos específicos)
- **Declaração de elaboração independente de proposta** (anti-conluio)
- **Declaração de inexistência de fato impeditivo** (incluindo coligação com outro licitante)

---

## F. Stack Técnico Recomendado

### F.1 Para construir do zero — minimal viable Livro Caixa

```
Stack:
- PostgreSQL (Supabase já incluso no projeto-pai) — guarda lançamentos
- Multi-tenancy via row_level_security + tenant_id
- Auth: Supabase Auth (já no projeto-pai)
- Importador OFX/CSV (parser open-source: ofxparse, ofx-parser)
- Integração Open Finance: Pluggy SDK (R$ por conexão)
- Classificador de lançamentos: heurístico inicial (regex + tabela de regras) + LLM cheap fallback
- Geração de PDF: react-pdf ou puppeteer renderizando HTML
- Exportação SPED (futuro): biblioteca rb-sped ou implementação manual seguindo layout
- Assinatura digital: integração com gov.br (gratuito) ou ICP-Brasil
```

**Tabela mínima:**
```sql
CREATE TABLE financial_entries (
  id uuid primary key,
  company_id uuid references companies(id),  -- multi-tenant
  entry_date date not null,
  description text not null,
  document_ref text,  -- NF, boleto, etc
  account_code text,  -- plano de contas
  category text,      -- receita_servico, despesa_pessoal, etc
  amount_in numeric(15,2) default 0,
  amount_out numeric(15,2) default 0,
  source text,        -- 'open_finance', 'ofx_import', 'manual'
  bank_ref text,      -- ID do banco se via Open Finance
  metadata jsonb,
  created_at timestamptz default now()
);

CREATE INDEX idx_fe_company_date ON financial_entries(company_id, entry_date);
```

**Esforço estimado para MVP "livro caixa enxuto + index calcs":**
- 2 semanas dev solo: tabela + importador OFX + classificador básico + geração PDF Livro Caixa simples + cálculo dos 4 índices
- 2 semanas adicionais: Open Finance integração + UI + geração BP/DRE simplificados
- **Total: 1 mês dev solo** (Breno)

### F.2 Para integrar com existente — quais têm API decente?

**Ranking de qualidade de API (research):**

1. **Omie** — REST completa, OAuth2, ~80 endpoints, sandbox, documentação rica em [developer.omie.com.br](https://developer.omie.com.br/service-list/), boa para POST/GET de lançamentos, NF-e, fluxo caixa
2. **Conta Azul** — REST, OAuth2, sandbox, documentação OK em developers.contaazul.com, foca em fluxo NF-e, contas a pagar/receber
3. **Nibo (Premium R$479/mês)** — REST, sob plano Premium, sem sandbox público
4. **Bling** — REST, mais leve, foco produtos/estoque/NF, livro caixa não primário
5. **Tiny ERP (Olist)** — REST, mas foco e-commerce/marketplace, livro caixa fraco

**Recomendação se integrar:** **Omie ou Conta Azul**. Os dois cobrem livro caixa + emissão NF-e + multi-empresa. Omie tem API mais robusta; Conta Azul tem ecossistema contador mais forte.

### F.3 Build vs Buy vs Hybrid — análise

#### Cenário "BUILD COMPLETO"
- Construir Livro Caixa do zero como parte do buscador
- Esforço: 8-12 semanas dev solo (Breno) para MVP decente
- Custo manutenção: alto (legislação tributária muda; ERPs comerciais investem time para isso)
- **VEREDITO: NÃO RECOMENDADO** — comoditização extrema, sem moat, drena recurso de feature core

#### Cenário "BUY"
- Empresa contrata Omie/Conta Azul/Nibo para 4 CNPJs
- Custo: R$400-R$832/mês
- Esforço Breno: zero dev
- **PROBLEMA:** zero sinergia com buscador. Toda vez que aparece edital, empresário ou contador tem que ir lá puxar BP/DRE/índices manualmente
- **VEREDITO: VIÁVEL MAS PERDE OPORTUNIDADE** — empresário do amigo já paga sem sinergia hoje provavelmente

#### Cenário "HYBRID FINO" (recomendado)
- **Não construir Livro Caixa completo**
- **Construir camada de dados financeiros mínima dentro do buscador**: tabela `financial_entries` + importador OFX/Open Finance + classificador heurístico
- **Integrar via API com Omie ou Conta Azul** opcionalmente, para puxar dados consolidados (BP/DRE) sem replicar a escrituração
- **Construir motor de geração de anexos de licitação**: BP simplificado, DRE, índices LG/LC/SG/GE, alertas de habilitação
- Esforço: 3-5 semanas dev solo
- **MOAT:** sinergia com buscador único no mercado
- **VEREDITO: RECOMENDADO**

### F.4 Perguntas P0 ao amigo (antes de fechar build/buy/hybrid)

> **>>> DECISION POINT (4):** Antes de qualquer linha de código, validar com 1 call de 15min:

1. **Regime tributário** de cada uma das 4 empresas? (Simples/Presumido/Real)
2. **Faturamento anual aproximado** de cada uma? (define complexidade fiscal)
3. **Já usam algum ERP/sistema atualmente?** Qual? Preço?
4. **Têm contador ativo?** Externo ou interno? Quanto cobra?
5. **As 4 já participaram de licitação?** Quem mais e quem menos?
6. **As 4 são realmente coligadas/grupo econômico?** Ou são sócios diferentes com empresas paralelas? (faz diferença legal pra licitação)
7. **Qual a dor #1 hoje na rotina financeira/contábil?** (responder em 1 frase espontânea — vai revelar prioridade real)

---

## G. Conclusão e Próximos Passos

### G.1 Recomendação final

**Hybrid Fino** com priorização:

**FASE 0 — Validação (1 call 15min)**
- Conversar com o amigo, responder 7 perguntas F.4
- Confirmar coligação real (afeta licitação) e regime tributário (afeta complexidade)

**FASE 1 — Mínimo Viável Sinergia (2-3 semanas dev)**
- Construir tabela `financial_entries` + `companies` + relação grupo econômico no Supabase existente
- Importador OFX manual (botão upload + parse)
- Cálculo automatizado dos 4 índices LG/LC/SG/GE a partir dos lançamentos categorizados (categorização simples por regex + LLM fallback)
- Quando aparecer edital novo, mostrar "habilita / não habilita / margin" para cada empresa antes do user gastar tempo na proposta
- Bloqueio automático "anti-conluio coligadas" antes de envio

**FASE 2 — Open Finance (1-2 semanas dev)**
- Integrar Pluggy SDK para 4-8 conexões bancárias
- Auto-import e classificação heurística
- Reduz tempo manual de 4h/mês para 30min/mês

**FASE 3 — Geração de anexos (1-2 semanas dev)**
- PDF do BP simplificado e DRE simplificada por empresa
- Pacote "anexos econômico-financeiros" gerável em 1 clique para cada edital alvo
- Assinatura via gov.br

**FASE 4 (opcional, futuro) — Integração ERP**
- Se o amigo já tem Omie/Conta Azul, integrar via API para puxar dados oficiais (mais confiáveis que os lançamentos do MVP)
- Senão, fica em Postgres mesmo

**TOTAL FASE 1-3:** ~4-7 semanas dev solo

### G.2 O que NÃO construir (escopo morto)

- ❌ Emissão de NF-e (Conta Azul/Omie fazem isso melhor; integrar se necessário)
- ❌ Contas a pagar/receber gerencial completo (idem)
- ❌ Folha de pagamento
- ❌ Apuração de DAS/DCTFweb (contador faz)
- ❌ ECD/ECF (não-tópico para Simples Nacional)
- ❌ Conciliação bancária visual avançada (Pluggy + UI mínima cobre)
- ❌ Plano de contas customizável complexo (5-10 categorias predefinidas resolvem)

### G.3 Riscos do plano

| Risco | Mitigação |
|-------|-----------|
| Receita Federal não aceitar Livro Caixa gerado pelo sistema custom | Construir para exportar para Omie/Conta Azul, deixar o ERP gerar o Livro Caixa oficial. Sistema custom serve para licitação, não para fiscalização tributária |
| Erro na classificação automática gera BP errado | UI sempre permite override manual; contador valida antes de assinar BP oficial |
| Open Finance Pluggy fica indisponível | Manter import OFX manual como fallback |
| Coligadas competirem juntas por bug | Test de bloqueio "anti-conluio" como AC obrigatório de qualquer feature de proposta |
| LGPD para dados financeiros sensíveis | Supabase RLS + criptografia em repouso + DPA com o amigo (cliente concorda com processamento) |

### G.4 Métricas de sucesso

- **Time-to-decision em edital:** de 30min → 3min (validar antes da proposta)
- **Habilitação econômico-financeira:** taxa de erro pré-envio < 5%
- **Tempo manual mensal:** ≤ 1h por empresa (4h total)
- **Custo total para o usuário (vs ERP comercial 4 CNPJs):** R$50/mês infraestrutura + zero licença

---

## H. Decision Points Consolidados (revisar com user)

>>> **DECISION POINT (1):** Construir Livro Caixa do zero ou aceitar Hybrid Fino?
- Recomendação Atlas: **Hybrid Fino**

>>> **DECISION POINT (2):** Se Hybrid, integrar API com Omie/Conta Azul ou só importar OFX/Open Finance?
- Recomendação Atlas: **Começar com OFX/Open Finance simples (Pluggy). Integrar Omie/Conta Azul só se amigo já paga e quiser sincronizar.**

>>> **DECISION POINT (3):** Implementar "anti-conluio coligadas" como feature P0 ou P1?
- Recomendação Atlas: **P0 obrigatório.** Risco legal real, diferenciação única, esforço pequeno (~1 dia dev).

>>> **DECISION POINT (4):** Validar com amigo (call 15min) antes de qualquer dev?
- Recomendação Atlas: **SIM, P0 absoluto.** Sem isso, build/buy/hybrid é especulativo.

>>> **DECISION POINT (5):** Cobrar do amigo pela camada Livro Caixa+Sinergia ou incluir grátis no buscador?
- Recomendação Atlas: **Free para amigo (validador-âncora), cobrar para próximos clientes B2B.** Tem força de "case real" pra venda futura.

---

## Fontes

- [Resolução CGSN nº 140/2018 — Anexo IX (Livro Caixa Simples)](https://www8.receita.fazenda.gov.br/simplesnacional/arquivos/manual/anexo_xi.pdf)
- [LC 123/2006 art. 26 §2º e art. 29 VIII](https://www8.receita.fazenda.gov.br/SimplesNacional/Arquivos/manual/MANUAL_EXCLUSAO.pdf)
- [Decreto 9.580/2018 (RIR/2018)](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/decreto/d9580.htm)
- [Manual de Exclusão do Simples Nacional](https://www8.receita.fazenda.gov.br/SimplesNacional/Arquivos/manual/MANUAL_EXCLUSAO.pdf)
- [Siga o Fisco — exclusão por falta de Livro Caixa](https://sigaofisco.com.br/simples-nacional-falta-de-escrituracao-do-livro-caixa-provoca-exclusao-do-regime/)
- [Conselho Federal de Contabilidade — Livro Diário](https://cfc.org.br/tecnica/perguntas-frequentes/livro-diario/)
- [Contador Agora — Escrituração Contábil vs Livro Caixa](https://www.contadoragora.com/escrituracao-contabil-e-livro-caixa-diferencas/)
- [Conta Azul — Planos e Preços](https://contaazul.com/planos/)
- [Omie — Portal Desenvolvedor](https://developer.omie.com.br/service-list/)
- [Nibo — Planos e Preços](https://www.nibo.com.br/empresa/planos-e-precos)
- [Granatum — Planos](https://www.granatum.com.br/financeiro/precos-planos)
- [Tiny ERP — Multi Empresas](https://tiny.com.br/ajuda/multi-empresas)
- [Treasy — Planos](https://www.treasy.com.br/planos/)
- [Pluggy — Conciliação Bancária Open Finance](https://www.pluggy.ai/blog/concilia%C3%A7%C3%A3o-banc%C3%A1ria-open-finance)
- [Belvo — API Docs](https://developers.belvo.com/pt-br/apis/belvoopenapispec)
- [Lei 14.133/2021 art. 69 — Habilitação econômico-financeira](https://licitacoesecontratos.tcu.gov.br/5-5-4-habilitacao-economico-financeira/)
- [LCT Assessoria — Índices LG/SG em licitações](https://lctassessoria.com.br/indices-de-liquidez-e-solvencia-para-participacao-em-licitacoes/)
- [Schiefler Advocacia — Balanço Patrimonial em licitações para ME](https://schiefler.adv.br/obrigatoriedade-de-apresentacao-do-balanco-patrimonial-por-meis/)
- [ConJur — Lei 14.133 e dois balanços contábeis](https://www.conjur.com.br/2022-nov-18/licitacoes-contratos-lei-14133-dois-balancos-contabeis-licitacao/)
- [TCU — Microempresas e pequeno porte em licitações](https://licitacoesecontratos.tcu.gov.br/4-5-2-4-participacao-de-microempresas-e-de-empresas-de-pequeno-porte-2/)
- [APET — Omissão de receita e IR 75%](https://apet.org.br/artigos/da-omissao-de-receitas-e-a-sua-repercussao-no-imposto-de-renda-da-pessoa-juridica/)
- [Receita Federal — Lucro Presumido FAQ 2021](https://www.gov.br/receitafederal/pt-br/assuntos/orientacao-tributaria/declaracoes-e-demonstrativos/ecf/perguntas-e-respostas-pessoa-juridica-2021-arquivos/capitulo-xiii-irpj-lucro-presumido-2021.pdf)
- [Contábeis — ECD dispensa Simples](https://www.contabeis.com.br/noticias/57172/ecd-veja-quem-esta-dispensado-da-entrega/)
- [Tactus — Distribuição de lucros Simples 2026 Lei 15.270/2025](https://tactus.com.br/distribuicao-de-lucros-no-simples-nacional/)
- [Pluggy — ERP integration](https://www.pluggy.ai/erp)

— Atlas, investigando a verdade
