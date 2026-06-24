# Feature Research — Parcelamentos + Transação Tributária

> Pesquisa de **fontes primárias** (docs oficiais SERPRO/Integra Contador, Receita Federal, PGFN/Regularize, manuais do Simples Nacional, páginas de produto de concorrentes) sobre como o mercado trata **parcelamentos** e **transação tributária** — a frente que o **Renan** levantou como "a dor crítica da contabilidade" na reunião de 22/Jun/2026. Objetivo: o conjunto MÍNIMO de funções que nosso produto precisa ter para igualar/superar os melhores, e o que dá para diferenciar.
>
> **Autor:** Atlas (Analyst) · **Data:** 2026-06-22 · **Base:** `00-context/CONTEXT.md` (D9, §9), `00-sintese-paridade.md`, `03-ecac.md` (módulo Integra-Parcelamentos já mapeado lá) · **Método:** web real + docs oficiais lidas diretamente. SEM channeling de clones (regra `feedback_no_hydra_style`).
>
> **Confiança:** ALTA no que a API expõe e no que NÃO expõe (catálogo SERPRO + páginas de serviço lidas direto), ALTA nas regras de rescisão (Manual do Parcelamento SN + página oficial de rescisão), ALTA nas datas/editais PGFN (gov.br/pgfn). MÉDIA na granularidade de features de concorrentes (páginas de produto, algumas sem detalhe de alerta). BAIXA em preços de transação/success-fee (mercado opaco).

---

## TL;DR (a resposta direta ao Renan)

1. **Parcelamento é table-stakes maduro — mas fragmentado em duas gerações.** Os ERPs legados (Questor, Domínio/Thomson Reuters, Alterdata) têm **controle interno de parcelas** (cadastro, vencimento, baixa, lançamento contábil) há anos. A geração moderna (Jettax, e-Auditoria, SIEG, Acessórias) faz **consulta + emissão automática da guia de parcela via API oficial SERPRO**. Quem não fizer **os dois** (consultar no Fisco + controlar/alertar) fica atrás.

2. **A API Integra Contador (SERPRO) cobre parcelamento FEDERAL do Simples/MEI — mas SÓ consulta e emissão de DAS de parcela. NÃO há adesão/pedido via API.** Confirmado lendo o serviço PARCSN direto: 5 operações, nenhuma de adesão. → **a adesão continua sendo ato humano** no e-CAC/portal SN. Isso é uma fronteira de produto, não um bug nosso.

3. **PGFN (dívida ativa) e Transação Tributária NÃO têm API pública de adesão.** Regularize é manual (Negociar Dívida → Adesão). Infosimples tem consulta de parcelamento PGFN/SEFAZ-estadual, mas a **emissão de parcela PGFN está "em desenvolvimento"**. → estadual/municipal = fragmentação real, coberta por Infosimples (consulta) + manual.

4. **O ouro da dor do Renan é o RISCO DE RESCISÃO, não a guia.** Parcelamento do Simples é **cancelado com 3 parcelas em atraso** (consecutivas ou não) — e o cliente perde os descontos, o débito é recalculado com todos os encargos e volta a impedir a CND. **Quase ninguém alerta proativamente "este parcelamento vai cair".** É aqui que cabe nosso diferencial (health score + trilha + alerta de parcela em risco).

5. **NOSSO produto hoje tem ZERO de parcelamento.** O `app/ecac/` é cockpit sintético de CND/caixa postal; não há módulo de parcelamento. Gap ≈ 100%. Mas o caminho é claro e a maior parte é **comprar** (Integra-Parcelamento + Infosimples) + **construir** a camada de controle/alerta/trilha por cima.

---

## A) Os tipos de parcelamento (o universo a cobrir)

> Fontes: Receita Federal (notícia mai/2026), Manual do Parcelamento do Simples Nacional (RFB), gov.br/pgfn, catálogo Integra Contador.

### Federais — Receita Federal (débitos NÃO inscritos em dívida ativa)
| Tipo | Base | Prazo / regra | Canal de adesão |
|---|---|---|---|
| **Ordinário** (convencional) | Lei 10.522/2002 | até **60 parcelas**, sem desconto, parcela mín. PJ R$500 | e-CAC |
| **Simplificado** | Lei 10.522/2002 | até **60 parcelas**, sem garantia, processo automatizado | e-CAC |
| **Simples Nacional (PARCSN)** | LC 123 / Res. CGSN | até **60 parcelas**, parcela mín. R$300 | Portal SN / e-CAC |
| **MEI (PARCMEI)** | Res. CGSN | até 60 parcelas | Portal SN / PGMEI |
| **Especiais / Refis** | leis específicas | PERT-SN, RELP-SN, PERT-MEI, RELP-MEI (com descontos, condições especiais) | conforme programa |
| **Parcela em Dia** (novidade 2026) | RFB | programa de manutenção da adimplência | e-CAC |

### Federais — PGFN (débitos INSCRITOS em dívida ativa da União)
- Parcelamento de dívida ativa + **Transação Tributária** (Lei 13.988/2020) → ver §C. Canal: **Regularize** (regularize.pgfn.gov.br), manual.

### Estaduais / Municipais
- Cada **SEFAZ** (ICMS) e cada **prefeitura** (ISS/IPTU) tem seu próprio parcelamento, portal e regra. **Fragmentação total** (~27 SEFAZ + milhares de prefeituras). Não há API unificada gov. → coberto por Infosimples (consulta SEFAZ-MG, etc.) ou robô/manual.

### A regra que vira o nosso diferencial: RESCISÃO
> Fontes: Manual do Parcelamento SN (RFB) + página oficial de Rescisão (servicos.receita.fazenda.gov.br).

O parcelamento do Simples Nacional é **rescindido (cancelado)** quando:
- **3 parcelas em atraso** (consecutivas OU não), OU
- **2 parcelas em atraso** se todas as demais já foram quitadas e a última venceu, OU
- a **1ª parcela** não é paga (pedido nem se valida), OU
- há **saldo devedor** após o vencimento da última parcela.

Detalhes que importam pro alerta:
- **Pagamento parcial** de uma parcela = inadimplência.
- Parcela paga com **até 30 dias de atraso** NÃO conta como descumprimento → existe uma **janela de salvamento** que um alerta proativo pode aproveitar.
- Rescindido = RFB recalcula o débito original com TODOS os encargos até a rescisão, deduz só o pago → cliente perde desconto e volta a ficar irregular (sem CND).

**Tradução comercial (para o Renan):** "monitorar parcela vencida com janela de 30 dias para salvar o parcelamento antes da rescisão" é uma feature que protege o cliente do escritório de um prejuízo concreto. É vendável.

---

## B) O que a Integra Contador (SERPRO) expõe de PARCELAMENTO — com evidência

> Fonte primária: catálogo + páginas de serviço lidas direto em apicenter.estaleiro.serpro.gov.br.

**Módulo Integra-Parcelamento — 8 sistemas, todos do Simples/MEI:**

| Sistema | Programa | Esfera |
|---|---|---|
| **PARCSN** | Parcelamento ordinário Simples Nacional | Federal SN |
| **PARCSN-ESP** | Parcelamento especial SN | Federal SN |
| **PERTSN** | PERT — Simples Nacional | Federal SN |
| **RELPSN** | RELP — Simples Nacional | Federal SN |
| **PARCMEI** | Parcelamento ordinário MEI | Federal MEI |
| **PARCMEI-ESP** | Parcelamento especial MEI | Federal MEI |
| **PERTMEI** | PERT — MEI | Federal MEI |
| **RELPMEI** | RELP — MEI | Federal MEI |

**Operações por sistema (lido no PARCSN — todos os 8 expõem o mesmo conjunto):**
1. Consultar **Pedidos** de parcelamento
2. Consultar **Parcelamento** (idServico `OBTERPARC164` no PARCSN; `OBTERPARC184` no PERTSN)
3. Consultar **Detalhes de pagamento** de parcela
4. Consultar **Parcelas disponíveis para impressão**
5. **Emitir Documento de Arrecadação (DAS)** da parcela

### ⚠️ O LIMITE DURO (confirmado em fonte oficial)
- **NÃO existe operação de ADESÃO / PEDIDO de parcelamento via API.** O Integra-Parcelamento é **consulta + emissão de guia**, só. A adesão (escolher débitos, definir nº de parcelas, validar) continua sendo **ato manual** no e-CAC / Portal do Simples Nacional. Nenhum concorrente "adere via API" porque o canal não existe — todos aderem manualmente e depois automatizam o acompanhamento.
- **NÃO cobre parcelamento de Lucro Real/Presumido (DARF) como módulo dedicado** — só Simples/MEI (DAS). Parcelamento ordinário/simplificado de PJ no e-CAC fica fora do Integra-Parcelamento; emissão de DARF de débito vai por `SICALC`/e-CAC.
- **NÃO cobre PGFN (dívida ativa) nem transação** — ver §C.

**Custo (Faixa 1, ver `03-ecac.md`):** consulta isolada ~R$0,24; emissão completa de DAS ~R$0,96 (3 chamadas). Parcela mensal de N CNPJs = N emissões/mês → unit economics a validar no volume real (pendência §8.4 do CONTEXT).

---

## C) Transação Tributária (Lei 13.988/2020) — o que é e como entra no produto

> Fontes: Planalto (L13988), gov.br/pgfn (acordo-de-transação, editais 6/2026 e 8/2026, transação no contencioso).

**O que é:** instrumento que permite **negociar** débitos (não só parcelar) — inscritos em dívida ativa (PGFN) ou em contencioso administrativo/judicial — com **descontos** sobre juros, multas e encargos e parcelamento estendido. Vai além do parcelamento comum (que não dá desconto).

**Modalidades atuais (2026):**
- **Por adesão a edital** (Edital nº 6/2026 — capacidade de pagamento e pequeno valor; Edital nº 8/2026 — Desenrola Rural). Adesão até **30/09/2026**.
- **Transação por proposta individual** (grandes devedores).
- **Transação no contencioso de relevante e disseminada controvérsia jurídica** (créditos em discussão administrativa/judicial sobre teses específicas dos editais; multas qualificadas podem entrar).

**Números (gov.br/pgfn + materiais):** descontos de até **65%** (capacidade de pagamento) e até **100% sobre juros/multas/encargos** no pagamento à vista de teses do contencioso; parcelamento em até **120 meses** em algumas modalidades. (Percentuais variam por edital — sempre conferir o edital vigente; não prometer número fixo.)

**Como entra num produto (e a oportunidade de receita pro escritório):**
- A adesão é **100% manual no Regularize** (Negociar Dívida → Acesso ao Sistema de Negociações → Adesão → Transação). **Não há API.** Então o software **não adere** — ele faz a camada que **antecede e acompanha**:
  1. **Detecção de elegibilidade**: cruzar dívida ativa / situação fiscal (SITFIS) da carteira com os editais vigentes → "estes N clientes têm débito em DA elegível à transação Edital 6/2026".
  2. **Simulação/estimativa** do benefício (desconto potencial) como gancho de consultoria.
  3. **Acompanhamento** das parcelas da transação já firmada (alerta de inadimplência — transação também rescinde por atraso).
  4. **Dossiê de capacidade de pagamento (CAPAG)**: a modalidade "capacidade de pagamento" exige demonstrações financeiras consistentes; integração contábil é pré-requisito → ponto de venda de serviço.
- **Receita do escritório:** transação é serviço de **consultoria/honorário de êxito** (como a recuperação monofásico — D6). O software entrega a **identificação + o dossiê**; o contador/tributarista negocia e assina. Modelo idêntico ao da Recuperação (success-fee em linha separada).

> **Posicionamento honesto:** transação NÃO é automação (não há API de adesão). É **inteligência + acompanhamento** — radar de oportunidade + monitor de parcela. Vender como "automatiza transação" seria falso (G4 do CONTEXT: nunca prometer o que não se entrega).

---

## D) Como os MELHORES tratam parcelamento hoje (benchmark nominal com URL)

> Legenda: ✅ tem · 🟡 parcial/indireto · ❌ não/não-encontrado · `?` não-confirmado na fonte pública.

| Produto | URL | Consulta SERPRO de parcelamento | Emite guia/DAS de parcela auto | Controle interno (cadastro/baixa/contábil) | Alerta de parcela vencida | Alerta de RISCO de rescisão |
|---|---|---|---|---|---|---|
| **Jettax** (Mód. Prevenção) | jettax.com.br/modulos/prevencao | ✅ SN, PERT-SN, RELP-SN, Simplificado RFB, Prev./Não-Prev. | ✅ "gera pagamentos mensais" auto | 🟡 | 🟡 (impostos vencidos) | ❌ não citado |
| **e-Auditoria** | e-auditoria.com.br | ✅ via API SERPRO (e-Monitor) | 🟡 | ? | 🟡 | ❌ não citado |
| **SIEG IriS** | portalsieg.kinsta.cloud/iris | ✅ parcelamentos + PGDAS | 🟡 | ? | 🟡 | ❌ |
| **Acessórias** | acessorias.com | 🟡 (monitor + CND lote) | 🟡 | 🟡 | ✅ (alertas + WhatsApp) | ❌ |
| **Questor** (Controle de Tributos) | docs.questor.com.br/.../area-parcelamentos-e-tributos | 🟡 (Quiu robô) | 🟡 | ✅ **completo** (cadastro, vencimento configurável, dias não úteis, "Quitar Parcela", lançamento contábil + baixa) | ✅ | ❌ |
| **Domínio / Thomson Reuters** | dominiosistemas.com.br | 🟡 (consulta e-CAC) | 🟡 | ✅ "controle de impostos parcelados" + baixas auto | ✅ "notificações de vencimento de prazos" | ❌ |
| **Alterdata** | alterdata.com.br | 🟡 | ? | ✅ (suíte contábil) | 🟡 | ❌ |
| **Infosimples** | infosimples.com (SEFAZ-MG parcelamento; PGFN parcela em dev) | ✅ consulta estadual + PGFN (consulta) | 🟡 (emissão PGFN "em desenvolvimento") | ❌ (é API de consulta, não ERP) | n/a | ❌ |
| **Contmatic / Conta Azul / Nibo** | — | 🟡/❌ | 🟡/❌ | 🟡 (financeiro) | 🟡 | ❌ |
| **NÓS hoje** | apps/contador | ❌ | ❌ | ❌ | ❌ | ❌ |

### Leitura do benchmark (3 conclusões)
1. **Duas gerações coexistem.** ERP legado (Questor/Domínio/Alterdata) = forte no **controle interno** (cadastrar parcelamento manualmente, baixar parcela, lançar contábil, notificar vencimento). Geração API (Jettax/e-Auditoria/SIEG) = forte na **consulta automática no Fisco + emissão da guia**. **O estado-da-arte completo é a soma dos dois** — e quase ninguém entrega os dois bem-integrados.
2. **Ninguém cravou publicamente o alerta de RISCO DE RESCISÃO** (a coluna toda ❌). Todos alertam "parcela vencida"; ninguém modela "faltam X dias / Y parcelas para o parcelamento ser cancelado e o cliente perder o desconto". **Esse é o whitespace acionável** — alinhado ao moat de defensabilidade do projeto.
3. **Estadual/municipal é manual ou Infosimples para todos.** Ninguém resolveu a fragmentação; o melhor disponível é consulta via Infosimples + cadastro manual.

---

## E) Table-stakes × o que cobrimos × gap × buy-vs-build

| # | Feature (table-stake do mercado) | Quem faz | NÓS hoje | Gap | Estratégia |
|---|---|---|---|---|---|
| 1 | **Consultar parcelamentos federais SN/MEI da carteira** (situação, parcelas, débitos) | Jettax, e-Auditoria, SIEG | ❌ | total | **COMPRAR** Integra-Parcelamento (PARCSN/PARCMEI + ESP/PERT/RELP) |
| 2 | **Emitir DAS de parcela automaticamente** (mensal, em lote) | Jettax "gera pagamentos mensais" | ❌ | total | **COMPRAR** (Integra-Parcelamento — operação 5) |
| 3 | **Controle interno de parcelas** (cadastro, vencimento, baixa, status) | Questor, Domínio (completo) | ❌ | total | **CONSTRUIR** (camada própria; herdar do Gestorize se houver) |
| 4 | **Alerta de parcela vencida / a vencer** | Domínio, Acessórias, Questor | ❌ | total | **CONSTRUIR** (scheduler + notificação) |
| 5 | **Consulta de parcelamento estadual (SEFAZ) / PGFN** | Infosimples; parcial nos demais | ❌ | total | **COMPRAR** Infosimples (consulta) + manual p/ o resto |
| 6 | **Lançamento contábil automático da baixa de parcela** | Questor, Domínio | ❌ | total | **CONSTRUIR/herdar** (integra ao financeiro do Gestorize) |
| 7 | **Radar de transação tributária elegível** (cruza DA × editais) | ❌ ninguém empacotou | ❌ | total | **CONSTRUIR** (diferencial — usa SITFIS + editais) |
| **D1** | **Alerta de RISCO DE RESCISÃO** (3 parcelas / janela 30d) | ❌ ninguém | ❌ | total | **CONSTRUIR — diferencial nº1** |
| **D2** | **Health score "parcelamento em risco"** (cruza com situação fiscal/auditoria) | ❌ ninguém | ❌ | total | **CONSTRUIR — diferencial** |
| **D3** | **Trilha de boa-fé** (cada emissão/alerta vira evidência datada) | ❌ ninguém | 🟡 (existe no core) | integrar | **CONSTRUIR** (reaproveita trilha do projeto) |

> Cobrimos hoje: **~0**. Mas o esforço se divide bem: **comprar** as integrações de dado (linhas 1, 2, 5) + **construir** a camada de controle/alerta/trilha (3, 4, 6, 7, D1-D3), que é onde o moat vive.

---

## F) Nosso diferencial possível (alinhado ao moat do projeto)

Os concorrentes param em "consultou e gerou a guia". Nosso diferencial nasce de **cruzar parcelamento com a situação fiscal e a trilha** — exatamente o moat já definido (`00-sintese-paridade.md` §2.A):

1. **Monitor proativo de parcela em risco (D1) — o whitespace.** Não só "parcela vencida", mas o **estado de saúde do parcelamento**: "Cliente X tem 2 parcelas em atraso → 1 a mais e o parcelamento é rescindido, perde R$Y de desconto e a CND. Janela de salvamento: paga até [data] (30 dias)." Modela a regra de rescisão (§A) como um relógio preclusivo — aproveitando a engenharia de prazos que o projeto já entende (parente do Sentinela do Noyce).

2. **Health score de carteira (D2).** Combina status de parcelamento + situação fiscal (SITFIS) + divergência cClassTrib do core → "clientes em risco" num painel. Só nós teríamos os dois lados (o e-CAC isolado é commodity; cruzado com a Auditoria vira defensabilidade — D9).

3. **Radar de Transação Tributária (oportunidade de receita).** Cruza dívida ativa/SITFIS da carteira com os editais vigentes → lista de clientes elegíveis a transação + estimativa de benefício. Vira gancho de honorário de êxito pro escritório (modelo da Recuperação, D6). Honesto: software identifica e monta dossiê; contador adere/assina no Regularize.

4. **Trilha de boa-fé (D3).** Cada consulta de situação, cada emissão de DAS, cada alerta de risco vira **evidência datada e verificável** na trilha. Se o cliente reclamar "ninguém me avisou que o parcelamento ia cair", há prova do contrário. É o mesmo ativo que protege o escritório na multa de IBS/CBS — reaproveitado aqui.

5. **Preço transparente** (categoria opaca; D7 do projeto).

> ⚠️ **Não vender como diferencial primário/categoria.** Parcelamento é função do add-on e-CAC/Gestão (D9), não o core. É **infraestrutura de retenção + gancho de consultoria**, não o wedge. O wedge de 2026 segue Emissor (set/2026) + Recuperação (isca).

---

## G) Recomendação de build (stories granulares) + gates externos

### Stories (P0 = paridade mínima; P1 = paridade plena; P2 = diferencial)

| ID | Story | Tipo | Pri | Depende de |
|---|---|---|---|---|
| **PAR-1** | Consultar parcelamentos SN/MEI da carteira (situação + parcelas) via Integra-Parcelamento | comprar/integrar | P0 | contrato SERPRO + procuração |
| **PAR-2** | Emitir DAS de parcela em lote (mensal) via PARCSN/PARCMEI op.5 | comprar/integrar | P0 | PAR-1 |
| **PAR-3** | Modelo de controle de parcelas (cadastro/vencimento/baixa/status) persistido | construir | P0 | schema |
| **PAR-4** | Scheduler + alerta de parcela vencida/a vencer (notificação) | construir | P0 | PAR-3 |
| **PAR-5** | Consulta de parcelamento estadual/PGFN via Infosimples | comprar/integrar | P1 | contrato Infosimples |
| **PAR-6** | **Monitor de risco de rescisão** (regra 3 parcelas + janela 30d) | construir | P1 | PAR-1, PAR-3 — **diferencial D1** |
| **PAR-7** | Health score "parcelamento em risco" (cruza SITFIS + auditoria) | construir | P2 | PAR-6 + motor auditoria |
| **PAR-8** | Radar de Transação Tributária (DA × editais + estimativa benefício) | construir | P2 | SITFIS + base de editais |
| **PAR-9** | Lançamento contábil automático da baixa de parcela | construir/herdar | P2 | Gestorize financeiro |
| **PAR-10** | Trilha de boa-fé ligada a consultas/emissões/alertas de parcelamento | construir | P1 | trilha do core — **diferencial D3** |

### Gates externos (bloqueiam, não-construíveis sozinhos)
- **Contrato SERPRO Integra Contador** (e-CNPJ + faixa de consumo) — mesmo gate do e-CAC (`03-ecac.md`). Sem ele, PAR-1/2 não existem.
- **Procuração / Autorização de Acesso** por cliente (aceite ≤30d — mudança dez/2025). Sem aceite, sem dado.
- **Contrato Infosimples** (consulta estadual/PGFN) — para PAR-5.
- **Unit economics** no volume real: N CNPJs com parcelamento × emissão mensal × ~R$0,96 (pendência §8.4 CONTEXT). Validar antes de prometer "emissão automática em lote".
- **Base de editais PGFN** mantida atualizada (manual/curada) — para PAR-8.
- **Jurídico/tributarista** para a frente de transação (quem adere/assina no Regularize) — mesma estrutura da Recuperação (pendência §8.2 CONTEXT).

### Sequência sugerida (coerente com D4 — concierge antes de construir)
1. **Concierge manual** primeiro: nos 5 escritórios do Renan, listar à mão os parcelamentos da carteira e mostrar o **alerta de risco de rescisão** (planilha) — valida que a dor que o Renan descreve gera disposição a pagar, antes de integrar SERPRO.
2. Comprar PAR-1/PAR-2 (consulta + emissão) → paridade de dado.
3. Construir PAR-3/PAR-4/PAR-6 (controle + alerta + risco) → o diferencial barato.
4. P2 (health score, radar transação, contábil) quando o motor de auditoria existir.

---

## Fontes (URLs)

**Oficiais SERPRO / Integra Contador (primárias):**
- Catálogo de Serviços — https://apicenter.estaleiro.serpro.gov.br/documentacao/api-integra-contador/pt/catalogo_de_servicos/
- Integra-Parcelamento (contexto/8 sistemas) — https://apicenter.estaleiro.serpro.gov.br/documentacao/api-integra-contador/pt/solucoes/integra-parcelamento/
- PARCSN — Consultar Parcelamento (op. + idServico OBTERPARC164) — https://apicenter.estaleiro.serpro.gov.br/documentacao/api-integra-contador/pt/solucoes/integra-parcelamento/parcsn/servicos/consulta_parcelamento/
- PERTSN — Retorno Consultar Parcelamento (OBTERPARC184) — https://apicenter.estaleiro.serpro.gov.br/documentacao/api-integra-contador/pt/solucoes/integra-parcelamento/pertsn/servicos/exemplos/retorno_consulta_parcelamento/
- PARCMEI — Introdução — https://apicenter.estaleiro.serpro.gov.br/documentacao/api-integra-contador/pt/solucoes/integra-parcelamento/parcmei/
- Loja SERPRO Integra Contador — https://loja.serpro.gov.br/integracontador

**Receita Federal / Simples Nacional (parcelamento + rescisão):**
- Parcelamento convencional / Parcela em Dia 2026 — https://www.gov.br/receitafederal/pt-br/assuntos/noticias/2026/maio/parcelamento-convencional-consolida-se-como-forte-politica-de-conformidade-fiscal-e-parcela-em-dia-reforca-a-manutencao-da-adimplencia-em-2026
- Manual do Parcelamento do Simples Nacional (RFB) — https://www8.receita.fazenda.gov.br/SimplesNacional/Arquivos/manual/MANUAL_PARCELAMENTO.pdf
- Rescisão do Parcelamento (regras oficiais) — https://servicos.receita.fazenda.gov.br/Servicos/snparcweb/Help_Rescisao_Parc.asp
- Serviços do Simples Nacional (parcelamento) — https://www8.receita.fazenda.gov.br/simplesnacional/servicos/grupo.aspx?grp=14

**PGFN / Transação Tributária:**
- Lei 13.988/2020 (Planalto) — https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2020/lei/l13988.htm
- Acordo de transação (orientações) — https://www.gov.br/pgfn/pt-br/servicos/orientacoes-contribuintes/acordo-de-transacao
- Edital nº 6/2026 — capacidade de pagamento — https://www.gov.br/pgfn/pt-br/servicos/orientacoes-contribuintes/acordo-de-transacao/edital-no-6-2026/transacao-conforme-a-capacidade-de-pagamento-edital-ndeg-06-2026
- Transação no contencioso de relevante e disseminada controvérsia — https://www.gov.br/pgfn/pt-br/servicos/orientacoes-contribuintes/acordo-de-transacao/transacao-no-contencioso-tributario-de-relevante-e-disseminada-controversia-juridica
- Novos editais de transação (2026) — https://www.gov.br/pgfn/pt-br/assuntos/noticias/2026/novos-editais-de-transacao-da-pgfn-estao-disponiveis
- Portal Regularize — https://www.regularize.pgfn.gov.br/

**Infosimples (estadual/PGFN — consulta):**
- SEFAZ/MG Consulta Parcelamento — https://infosimples.com/consultas/sefaz-mg-parcelamento/
- PGFN Parcelamento Dívida Ativa (issue #602, em dev) — https://github.com/infosimples/infosimples/issues/602
- SEFAZ/MG Parcelamento Dívida Ativa (issue #604) — https://github.com/infosimples/infosimples/issues/604
- Catálogo de consultas — https://infosimples.com/consultas/

**Concorrentes (páginas de produto):**
- Jettax — Módulo Prevenção (consulta SN/PERT-SN/RELP-SN + geração de pagamentos mensais) — https://www.jettax.com.br/modulos/prevencao/
- Jettax — Parcelamento do Simples Nacional (blog) — https://www.jettax.com.br/blog/parcelamento-de-debitos-do-simples-nacional/
- Questor — Cadastro de Parcelamento de Débitos — https://docs.questor.com.br/Produtos/Gest%C3%A3oCont%C3%A1bil/ControledeTributos/area-parcelamentos-e-tributos/cadastro-parcelamento-debitos
- Questor — Lançamentos contábeis e baixa de parcelas — https://docs.questor.com.br/Produtos/Gest%C3%A3oCont%C3%A1bil/ControledeTributos/area-parcelamentos-e-tributos/gerar-lancamentos-contabeis-e-baixa-de-parcelas
- Domínio / Thomson Reuters — https://www.dominiosistemas.com.br/
- e-Auditoria — https://www.e-auditoria.com.br/
- SIEG IriS — https://portalsieg.kinsta.cloud/iris/
- Acessórias — https://www.acessorias.com
- Alterdata Contábil — https://www.alterdata.com.br/contabil/

**Secundárias (regras de rescisão, didáticas):**
- Manual/rescisão (síntese) — https://www.jscontabilidadenh.com.br/noticias/geral/simples-nacional---quantas-parcelas-em-atraso-cancela-o-parcelamento
- Contabilizei — Parcelamento Simples Nacional — https://www.contabilizei.com.br/contabilidade-online/parcelamento-simples-nacional/
