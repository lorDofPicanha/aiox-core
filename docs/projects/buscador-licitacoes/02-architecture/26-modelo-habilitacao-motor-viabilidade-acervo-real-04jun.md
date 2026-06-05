# 26 — Modelo de Habilitação & Motor de Viabilidade (aterrado no acervo REAL da ENIAC) — 04/Jun/2026

**Origem:** owner entregou o **dossiê real da ENIAC** (5 CATs/atestados + Balanços Patrimoniais 2024 e 2025 + Termos de Abertura/Encerramento) + 12 editais reais. Isso fecha as dependências **C** do doc `25` (CATs/CAOs + balancetes que a Stéfane prometeu) e destrava o desenho de dados das abas **Analisar (PR3)** e **Habilitar (PR5)** com requisitos **R1 (CAT/CAO no score), R2 (consórcio), R3 (detector de suspeita), R6 (econômico-financeira)**.

**Escopo deste doc:** SÓ ARQUITETURA (modelo de dados + motor de matching + lógica de viabilidade). Nada de código. Supera os "desconhecidos técnicos" do spike `06` (Stage 4) com base no dado real, e fecha **D-S4.2** (formato do vault de docs da cliente).

---

## 0. Identidade canônica da empresa (do balanço, verificado)

| Campo | Valor real |
|---|---|
| Razão social | **ENIAC EMPREENDIMENTOS LTDA** |
| CNPJ | **36.819.268/0001-05** |
| NIRE | 52600939599 (Junta GO) |
| Registro CREA-GO | **39711** |
| Porte / Regime | **ME · Simples Nacional** |
| Sede | Águas Lindas de Goiás-GO (CEP 72916-051) |
| Administrador | Lucas Cardoso Fernandes (CPF 028.045.341-89) |
| Contador | Arisneto Ribeiro Gonçalves (CRC-GO 024935) |

> ⚠️ Esta é a **única empresa-licitante** (CONTEXT §12, single-company). O modelo abaixo é multi-tenant-ready, mas o onboarding inicial materializa 1 organização + 1 empresa.

---

## 1. O que o dado real PROVA (e que muda a arquitetura)

### 1.1 — Acervo técnico: 2 RTs distintos, vocabulário CONFEA estruturado, quantitativos

Os 5 documentos não são "um PDF de atestado" — são **2 acervos profissionais diferentes** + quantitativos por serviço:

| Doc | RT (profissional) | CREA | Contratante | Tipo | Valor | Quantitativos-chave |
|---|---|---|---|---|---|---|
| **REFORMA CEO** (CAT 1020250004388) | Alice Ramos Silva | GO 1022381563 | Fundo Mun. Saúde Águas Lindas (**público**) | Reforma | R$ 103.000 | Reforma edifício alvenaria **208,90 m²**; pintura interna 480 m²; impermeab. manta 242,54 m² |
| **MESTRE ZEZITO** (CAT 1020260001207) | Alice Ramos Silva | GO 1022381563 | **SCB Engenharia S.A (privado)** | Execução | R$ 587.860 | Edifício alvenaria **1.613,12 m²** + estrutura metálica + rede hidro-sanitária + serviços gerais |
| **ESCOLA EDNALDA GUEDES** | **Rodrigo Piloto Amaro** | **DF 23733** | Pref. Águas Lindas (**público**) | Execução | R$ 886.828,39 | Edifício alvenaria **1.622,59 m²** + estrutura/laje pré-moldada + concreto armado + alvenaria estrutural + reservatório aço 30 m³ |
| **PRAÇA** (CAT 1020250002836) | Rodrigo Piloto Amaro | DF 23733 | Pref. Águas Lindas (**público**) | Execução | R$ 473.300 | Terraplenagem 3.000 m²; drenagem 500 m²; pavimentação concreto 3.000 m; inst. elétrica BT 75 kVA; concreto usinado 75 m³; paisagismo 150 un |
| **TOPOGRAFIA RODRIGO** (ART 1020240151967) | Rodrigo Piloto Amaro | DF 23733 | Pref. Águas Lindas (**público**) | Serviço | — | Terraplenagem/parcelamento solo/urbanismo **21.829 m²** |

**Achados arquiteturais:**

1. **Há 2 eixos de acervo na lei e no dado** (Lei 14.133, art. 67):
   - **Técnico-PROFISSIONAL** = o atestado/CAT está no nome do **engenheiro** (Alice OU Rodrigo). Só vale para a ENIAC se o profissional estiver **no quadro técnico** dela no momento da habilitação (a própria CAT diz isso: *"constituirá prova... somente se o responsável técnico indicado estiver ou venha a ser integrado ao seu quadro técnico por meio de declaração"*). → modelar **vínculo RT↔empresa com data e tipo (CLT/contrato/sócio)**.
   - **Técnico-OPERACIONAL (CAO)** = capacidade da **pessoa jurídica** (a empresa executou). Hoje só temos CATs profissionais; o **CAO da ENIAC** é dependência pendente (R1 do doc 25). O modelo já reserva o slot.

2. **Modo Consórcio/subcontratação é REAL no dado, não hipótese:** MESTRE ZEZITO tem contratante **SCB Engenharia S.A (privado)** e *"Participação técnica: Corresponsável"* — ENIAC executou como parte de um arranjo com outra construtora. O campo CONFEA **`participacaoTecnica ∈ {Individual, Corresponsável}`** existe literalmente nas CATs e é o gancho de dados do **R2 (Modo Consórcio)**.

3. **Vocabulário controlado CONFEA:** as atividades vêm num dicionário fixo ("ATUACAO EXECUCAO EDIFICIO DE ALVENARIA PARA FINS COMERCIAIS", "EXECUCAO ESTRUTURA METALICA", "EXECUCAO DRENAGEM"...). O edital descreve o mesmo serviço com OUTRAS palavras. **A ponte entre os dois vocabulários é o coração do motor** (§4).

4. **Quantitativo + unidade são a moeda do matching:** todo item tem `quantidade + unidade` (m², m³, kVA, m, un). Exigência de edital = *"atestado de no mínimo X [un] de [serviço]"*. O match é numérico, não textual.

### 1.2 — Econômico-financeira: capacidade é TEMPORAL e cresceu (correção do owner)

| Exercício | Receita Bruta | Resultado líquido | Leitura |
|---|---|---|---|
| **2024** | ~R$ 0 (pré-operacional) | Lucro bruto R$ 0,00 / despesas R$ 15.397 | empresa recém-aberta |
| **2025** | **R$ 314.963,26** | **+R$ 29.170,54** | **operacional e lucrativa** |

> ⚠️ Os valores exatos do **Patrimônio Líquido** de cada exercício precisam de parse limpo (a extração `pdftotext` embaralhou o balanço patrimonial; a DRE saiu legível). Mas a **direção é inequívoca e confirmada pelo owner: a ENIAC cresceu**.

**Princípio arquitetural que isso impõe — `FinancialSnapshot` versionado por exercício:**
- A capacidade econômico-financeira **NÃO é um atributo fixo da empresa**; é um **snapshot datado** (`exercicio: 2024 | 2025 | ...`).
- O edital quase sempre exige **"balanço do último exercício social exigível"** → o sistema deve selecionar **o snapshot mais recente válido** e nunca um obsoleto.
- O **teto de habilitação solo sobe a cada exercício**. Tratar "ENIAC = micro de R$77k" como verdade permanente é um bug de modelagem. O teto é **calculado, dinâmico e datado**.

### 1.3 — Cláusulas reais do lado-REQUISITO (edital Abadiânia, confirmadas no texto)

O edital expõe exatamente os 2 vetores de exigência que o motor precisa resolver:

- **Econômico-financeira (art. 69):** *"12.6.5. Poderá ser exigido capital social mínimo ou patrimônio líquido mínimo... limitado a até **10%** (dez por cento) do valor estimado."*
- **Técnica (art. 67 + Súmula TCU 263):** *"12.7.4. Será admitida a exigência de quantitativos mínimos nos atestados, limitada a até **50%** das **parcelas de maior relevância** técnica ou de valor significativo, vedadas restrições indevidas de tempo e local."* + *"capacidade operacional"* (CAO) e *"profissional registrado no conselho detentor de atestado"* (técnico-profissional).

→ Estas duas constantes legais (**10%** PL e **50%** parcelas de maior relevância + **somatório de atestados**) são **regras de negócio de primeira classe** do motor, não detalhes de prompt.

---

## 2. Os 3 modelos de dados

### 2.A — Company Capability Profile (CCP) — o "vault" estruturado da ENIAC

Fecha **D-S4.2**. É o estado persistido que todas as abas consultam. Camadas:

**(a) `CompanyIdentity`** — §0 (CNPJ, CREA, porte, regime, sede, sócios). Imutável-ish.

**(b) `TechnicalProfessional[]`** (os RTs) — uma linha por engenheiro:
| Campo | Ex. (Alice) | Notas |
|---|---|---|
| `nome` | Alice Ramos Silva | |
| `titulo` | Engenheira Civil | |
| `crea` / `rnp` | 1022381563D-GO / 1022381563 | conselho competente |
| `vinculo` | `{tipo: CLT/contrato/sócio, desde: 2025-09-17}` | **gate da técnico-profissional**: sem vínculo vigente, a CAT não conta |
| `vinculoComprovante` | ref. ao doc (CTPS/contrato/declaração) | exigido na habilitação |

**(c) `Acervo[]`** (CATs/CAOs/atestados) — uma linha por documento, com itens:
| Campo | Ex. | Notas |
|---|---|---|
| `tipo` | `CAT_PROFISSIONAL` / `CAO_OPERACIONAL` / `ATESTADO_SIMPLES` | TOPOGRAFIA é atestado simples (sem CAT-CREA formal) |
| `numero` | 1020250004388 | nº CAT / ART |
| `rtId` | →Alice / →Rodrigo | a qual profissional pertence |
| `participacaoTecnica` | `Individual` / `Corresponsavel` | **gancho do consórcio (R2)** |
| `contratante` / `tipoContratante` | Fundo Mun. Saúde / `PJ_Direito_Publico` | público pesa mais que privado em alguns editais |
| `valor` | 103.000,00 | |
| `periodo` | 2025-08-25 → 2025-10-17 | |
| `status` | Concluída / Em andamento | só concluída comprova execução plena |
| `itens[]` | `{servicoCanonico, qtd, unidade, descricaoOriginal, clausulaOrigem}` | **o coração** (§4) |

**(d) `FinancialSnapshot[]`** (§1.2) — uma linha por exercício:
| Campo | 2025 | Uso |
|---|---|---|
| `exercicio` | 2025 | seleção do "último exercício" |
| `patrimonioLiquido` | (parse limpo pendente) | **regra dos 10%** |
| `capitalSocial` | ~R$ 110k | alternativa ao PL no art. 69 |
| `ativoCirculante` / `passivoCirculante` | | **índices LC/LG/SG** (art. 69 §1º) |
| `receitaBruta` | 314.963,26 | porte/tendência |
| `resultado` | +29.170,54 | saúde |
| `fonte` | Balanço 2025 assinado (protocolo 260654779) | rastreio/citação |

**(e) `RegularityDoc[]`** (fiscal/trabalhista/jurídica) — CNDs, CRF/FGTS, contrato social, SICAF: `{tipo, orgao, validade, status, arquivoRef}`. Alimenta o auto-"nada consta" do **R4**. Credenciais e arquivos sensíveis → **vault (X3)**, nunca em doc/git (CONTEXT §12).

**Invariante:** todo campo do CCP carrega **proveniência** (`fonte` + `arquivoRef`). Nada no profile é "inferido" sem chip.

### 2.B — Edital Requirements Model (ERM) — o lado-requisito extraído do edital

Saída estruturada do parsing (Docling + extração LLM com citação obrigatória, spike `06`). Schema fixo de 4 blocos:

| Bloco | Campos | Origem real |
|---|---|---|
| `economicoFinanceira` | `{exigePL: bool, percentualPL: 0.10, indices: {LC≥x, LG≥x, SG≥x}, garantiaProposta: %, clausula}` | cláusula 12.6.5 |
| `tecnica` | `{profissional: [{servico, qtdMin?, un}], operacional: [{servico, qtdMin, un}], parcelasMaiorRelevancia: [...], tetoQuantitativo: 0.50, somatorio: {permitido: bool\|null, maxAtestados?: int}, aceitaAcervoConsorcio: bool, clausula}` | cláusula 12.7.x; `somatorio.maxAtestados=2` visto em Novo Gama (§11) |
| `juridica` | `{contratoSocial, procuracao?, declaracoes: [...], clausula}` | — |
| `fiscalTrabalhista` | `{CNDs: [federal, estadual, municipal, FGTS, trabalhista], SICAF?, clausula}` | — |
| `meta` | `{orgao, cnpjOrgao, municipioIbge, modalidade(4/6), valorEstimado, dataSessao, janelaImpugnacao}` | header PNCP/edital |

**Anti-alucinação (exigência do cliente, doc 25):** todo requisito **deve citar a cláusula de origem** (`clausula`). Requisito sem cláusula → marcado `nao_confirmado`, nunca tratado como exigência dura. Falso-negativo em requisito crítico = bloqueador (gate do spike `06`: recall ≥90%).

### 2.C — Service Taxonomy (o dicionário-ponte) — a IP central

O problema: CAT diz `"EXECUCAO EDIFICIO DE ALVENARIA PARA FINS COMERCIAIS"`; edital diz `"construção de UBS em alvenaria estrutural"`. São o mesmo serviço-classe. Sem ponte, o matcher não casa nada.

**Desenho:** uma **taxonomia canônica de serviços de engenharia civil** (~30-50 classes para o nicho de obras da ENIAC), com:
- `servicoCanonico` (ex.: `EDIFICACAO_ALVENARIA`, `ESTRUTURA_METALICA`, `ESTRUTURA_CONCRETO_ARMADO`, `PAVIMENTACAO`, `DRENAGEM`, `TERRAPLENAGEM`, `INSTALACAO_ELETRICA_BT`, `REDE_HIDROSSANITARIA`, `TOPOGRAFIA`, `REFORMA_PREDIAL`, `PAISAGISMO_URBANO`...);
- `unidadeCanonica` (m², m³, m, kVA, un) — com regras de conversão/compatibilidade;
- `sinonimos[]` (frases CONFEA + frases de edital) → seed inicial a partir dos 5 CATs + 12 editais reais;
- `parcelaRelevanteTipica` (quais classes costumam ser "parcela de maior relevância" em obra) — alimenta a leitura do 50%.

**Estratégia de mapeamento (sem alucinar):** camada 1 = dicionário/regra (determinística, auditável); camada 2 = embedding **BGE-m3** (CONTEXT §11.6) só para **sugerir** candidatos quando o dicionário falha — sugestão sempre passa por revisão humana (Alice). Embedding nunca decide habilitação sozinho.

---

## 3. Motor de Matching (Qualification Engine) — requisito × acervo

Quatro avaliadores independentes, cada um devolvendo `{status, evidencia, lacuna?, sanabilidade}`.

**Status (5 níveis, validado no conclave Justen+Niebuhr 04/Jun):**
`ATENDE` · `ATENDE_COM_RESSALVA` (zona cinzenta — a lei permite mas a comissão pode divergir; ex.: somatório com edital silente) · `PARCIAL` · `NAO_ATENDE` · `INDETERMINADO`.

**Régua sanável × insanável (art. 64 — exigência de Niebuhr):** toda lacuna carrega `sanabilidade ∈ {SANAVEL, INSANAVEL}`:
- **SANÁVEL** = documento existente/formal (CND vencida, declaração faltante, vínculo de RT por declaração) → **vira lacuna-tarefa, NÃO bloqueia o GO**.
- **INSANÁVEL** = ausência de capacidade substantiva (quantitativo real abaixo, RT inexistente, débito fiscal real) → **bloqueio-duro, NO-GO real**.

**GO/NO-GO:** NO-GO **só** se houver `NAO_ATENDE` **insanável** em requisito eliminatório. Lacuna sanável → `GO-com-tarefas`. `ATENDE_COM_RESSALVA` → GO sinalizado ("confirmar via esclarecimento/impugnação preventiva").

> **Bias de design (Niebuhr):** o falso-NEGATIVO (dizer NO-GO por algo sanável) é o pior dano ao negócio — faz a ENIAC largar edital que ganharia. Ser conservador **só** em deficiência insanável; **nunca inflar NO-GO por formalidade**.

### 3.1 — Técnico-PROFISSIONAL
Para cada serviço exigido no nome do profissional: existe `Acervo(tipo=CAT_PROFISSIONAL)` de um RT cujo `itens` cobre o `servicoCanonico` (qtd ≥ qtdMin quando exigida)? → liga RT (Alice/Rodrigo) ao requisito.
- **Vínculo do RT é SANÁVEL (validado Justen+Niebuhr):** admite-se contrato de prestação de serviço, vínculo societário **OU declaração de contratação futura** — **exigir CLT é ilegal** (TCU pacífico). Logo, RT sem vínculo formalizado **NÃO bloqueia o GO**: vira **lacuna-tarefa "gerar declaração de vínculo/contratação futura do RT"** (entregue no momento da habilitação, como a própria CAT da ENIAC determina).
- Só é `NAO_ATENDE` **insanável** se **não existir** RT habilitável para a `servicoCanonico` exigida.

### 3.2 — Técnico-OPERACIONAL (a regra mais delicada — Lei 14.133 art. 67 + Súmula TCU 263) — validada no conclave
1. **Parcela de maior relevância vem do EDITAL, nunca inferida** (Justen): extrair de `ERM.tecnica.parcelasMaiorRelevancia` (o edital deve designá-las e motivá-las, art. 67 §1º). Se o edital exige quantitativo **sem** designar a parcela → flag de **possível restrição ilegal** (gancho com o detector R3, §6) e status `ATENDE_COM_RESSALVA`.
2. Para cada parcela, `qtdMinExigivel = min(qtdEditalReq, ~50% × quantitativo da parcela)` — teto legal (Súmula TCU 263).
3. **Somatório de atestados = admitido como REGRA** (Justen): somar quantitativos da MESMA `servicoCanonico` em **múltiplos acervos da empresa**. Ex.: alvenaria 1.613,12 (Zezito) + 1.622,59 (Ednalda) = 3.235,71 m². **Vedação à soma só vale se EXPRESSA e justificada no edital.** Resultado da varredura do corpus (D-26.5, §11): **0/12 vedam**.
   - 🔢 **Teto de quantidade de atestados (achado D-26.5):** alguns editais admitem a soma **mas limitam o nº de atestados** (Novo Gama: `maxAtestados = 2`). O matcher, ao somar, deve respeitar `ERM.tecnica.somatorio.maxAtestados` → selecionar os **N maiores acervos** que cubram `qtdMinExigivel`; se nem os N maiores cobrirem → lacuna insanável.
   - ⚠️ **Edital SILENTE sobre soma (Niebuhr; 10/12 do corpus):** a lei admite, mas comissões conservadoras inabilitam → **não dar GO cego**: status `ATENDE_COM_RESSALVA` + tarefa "confirmar via pedido de esclarecimento OU impugnação preventiva".
   - 🔴 **Edital que VEDA soma expressamente** (0/12 no corpus, mas possível) → soma proibida; avaliar maior acervo individual.
4. `ATENDE` se `Σ acervo ≥ qtdMinExigivel`; senão `lacuna INSANÁVEL` (capacidade real ausente) = quanto falta, em qual classe → **NO-GO duro** (não é formalidade).
5. Acervo via `Corresponsavel`/consórcio → ver §4 (aproveitamento integral na técnica, art. 15 §2º).

### 3.3 — Econômico-financeira (art. 69) — usa o `FinancialSnapshot` mais recente
- **Regra dos 10%:** `ATENDE` se `PL(últimoExercício) ≥ percentualPL × valorEstimado` (ou capitalSocial conforme o edital). Com o crescimento 2025, recalcular sempre.
- **Índices** (quando exigidos): LC = AC/PC, LG, SG ≥ limiar do edital (tipicamente ≥1,0).
- **Teto solo dinâmico:** `valorMaxSolo = PL(últimoExercício) / 0,10`. Acima disso → **gatilho automático de Modo Consórcio (R2)** ou sinalização "abaixo da capacidade solo".
- Saída inclui o **headroom**: "habilita solo até R$ X; este edital é R$ Y" — número acionável, não cru.

### 3.4 — Jurídica / Fiscal / Trabalhista
Casa `ERM.juridica/fiscalTrabalhista` × `CCP.RegularityDoc` por tipo + **validade na data da sessão**. CND vencida/ausente → lacuna com prazo. Declarações exigidas → fila de auto-preenchimento (**R4**, revisão humana).

---

## 4. Modo Consórcio (R2) — modelagem

Empresa opera em 2 modos; o motor precisa avaliar **ambos** e mostrar o melhor caminho. **Base legal = Lei 14.133/2021 Art. 15** (validado no conclave Justen+Niebuhr 04/Jun — corrige citação anterior a "art. 65/66"):

| Dimensão | Regra de agregação em consórcio | Dispositivo |
|---|---|---|
| **Técnica (CAT/CAO)** | **SOMATÓRIO INTEGRAL** dos quantitativos de cada consorciado — **sem proporcionalidade** | art. 15, §2º |
| **Econômico-financeira** | **SOMATÓRIO na PROPORÇÃO** da participação de cada um | art. 15, §3º |
| **Acréscimo** | edital **pode exigir +até 30%** sobre o exigido do licitante individual… | art. 15, §4º |
| **…exceção ME/EPP** | **…dispensado se o consórcio for composto INTEGRALMENTE por ME/EPP** | art. 15, §4º |
| **Formalização** | compromisso de constituição **assinado por todos** + **líder com poderes** + responsabilidade solidária; docs de cada consorciado | art. 15, §1º |

**Desenho:** `ConsortiumProfile` = CCP **virtual/derivado** = união de itens de acervo (soma integral) + PL somado **na proporção** dos membros, com `liderId`, `percentualParticipacao[]` e `acrescimo30: bool`. O motor roda o §3 sobre o profile virtual. **Como a ENIAC é ME, um consórcio ENIAC+outra ME dispensa o acréscimo de 30%** — vantagem a sinalizar. Saída comparativa: *"Solo: NO-GO (PL insuficiente p/ R$2,83M). Consórcio c/ parceira de PL ≥ R$ Z (proporção X%): GO."* — transforma o gargalo do §1.2 em **recomendação acionável**.

**Onde consórcios mais são inabilitados (Niebuhr):** compromisso de constituição mal formalizado (falta assinatura de algum) e líder sem poderes → o dossiê (§7) **deve montar e validar esses documentos**, não só somar números.

**Anti-conluio (CONTEXT §10.2 / art. 14):** como é single-company, o alerta de conluio é soft — só dispara se duas empresas do mesmo tenant entrarem no mesmo edital. Mantido como guardrail, não pilar.

---

## 5. CAT/CAO → Probabilidade de vitória (R1) — entrega na aba Analisar

O cliente foi explícito: *"a probabilidade REAL de ganhar depende de CAT/CAO, não dos critérios gerais"*. Logo, o **veredito Vai/Não-Vai (PR3)** decompõe-se em **dois fatores independentes e nunca fundidos num número opaco** (invariante anti-regressão do doc 23):

1. **Elegibilidade (gate, do §3):** `GO / NO-GO / GO-com-lacunas`. Binário/ternário, 100% grounded em requisito×acervo. **Sem isso, probabilidade é irrelevante** (não adianta 80% de chance num edital que te inabilita).
2. **Competitividade (probabilístico, do Stage 2/3):** dado que elegível, qual a chance — HHI/share/incumbente/preço do órgão (já existe no market-snapshot) + **força relativa do acervo** (folga de quantitativo = barreira que derruba concorrentes menores).

→ A aba Analisar entrega: **"ELEGÍVEL (solo) · folga técnica alta · órgão com incumbente forte (share 40%) · preço-alvo R$ X"** — cada pedaço com sua fonte. CAT/CAO entra como **modificador da elegibilidade e da folga**, não como peso mágico num score.

**Regra de ouro (anti-alucinação, exigência do cliente):** probabilidade nunca deriva de `opportunityScore`; deriva de dados citáveis (acervo + histórico do órgão). Frase sem fonte = "dado insuficiente".

---

## 6. Detector de licitação SUSPEITA / direcionamento (R3) — buildável JÁ

Interesse da liderança e **não depende de doc do cliente** (usa o histórico PNCP que já temos). Desenho:

- **Baseline por órgão/objeto:** das contratações históricas do mesmo órgão (Stage 2), extrair a distribuição típica de exigências (qtd mínima de atestado, índices, garantia, prazos).
- **Comparar o edital atual** contra a baseline → sinalizar **discrepância** (ex.: exige atestado de 50% quando o histórico do órgão pedia 10%; exige serviço exótico que não consta do objeto; prazo de proposta anormalmente curto).
- **Cruzar com vencedores recorrentes:** se um mesmo CNPJ vence repetidamente E o edital tem exigência sob medida para o perfil dele → flag *"indício de direcionamento — investigar"* (linguagem de **suspeita técnica, não acusação**; disclaimer obrigatório, igual Stage 3).
- Entrega: chip na aba Monitorar/Analisar + frase no insight ("exigência X está 5× acima da norma histórica deste órgão").

---

## 7. Entrega (o que o operador leva ao sair de cada aba)

| Aba | Entrega aterrada no CCP/ERM |
|---|---|
| **Habilitar** | **Dossiê montado** (checklist tenho/não-tenho por bloco) + **GO/NO-GO solo e consórcio** + **lacunas como tarefas** ("falta CND municipal", "anexar vínculo do RT Rodrigo", "acervo de drenagem 200 m² abaixo do exigido") |
| **Analisar** | **Veredito Vai/Não-Vai** = elegibilidade (§5.1) + competitividade (§5.2) + 5 frases (Stage 3), cada uma com fonte |
| **Monitorar** | triagem já existente + **chip de suspeita (R3)** |
| **Acompanhar/Recorrer** | inalterado neste doc (sessão+RAG, atrás de vault/ToS) |

**Teste de aceite (doc 23):** ao sair da Habilitar, o operador leva um **dossiê + decisão + lista de pendências**, não "uns números".

---

## 8. Decisões que ESTE dado fecha / abre

**Fecha:**
- ✅ **D-S4.2** (formato do vault de docs): é o **CCP** do §2.A (RTs + Acervo com itens + FinancialSnapshot versionado + RegularityDoc), proveniência obrigatória.
- ✅ **R2 modo consórcio** tem âncora de dados real (`participacaoTecnica: Corresponsavel` em Mestre Zezito).
- ✅ **Princípio temporal econômico-financeiro** (snapshot por exercício; teto dinâmico) — disparado pela correção do owner (2025 > 2024).

**Fecha (conclave Justen+Niebuhr, 04/Jun — §10):**
- ✅ **D-26.4 RESOLVIDA.** Consórcio = **Lei 14.133 art. 15**: técnica = **soma integral** (§2º); econ-fin = **soma proporcional** (§3º); **acréscimo até 30%** (§4º) **salvo consórcio 100% ME/EPP (dispensado)**. Somatório de atestados (mesma empresa) = **admitido como regra**, vedação só se expressa+justificada. RT por **declaração de contratação futura** (não CLT). Régua **sanável×insanável** (art. 64) incorporada ao motor (§3).

**Abre / pendências:**
- [ ] **D-26.1** Parse limpo do **Patrimônio Líquido 2024 e 2025** (pdftotext embaralhou o BP). Docling ou OCR estruturado → preencher `FinancialSnapshot` com números exatos antes de calcular teto solo real.
- [ ] **D-26.2** **CAO operacional da ENIAC** ainda não veio (só CATs profissionais). Cobrar no "arquivo Mega" (R7) ou emitir via CREA. Slot reservado.
- [ ] **D-26.3** Granularidade da **Service Taxonomy** (30 vs 50 classes) — definir com Alice quais classes são as que aparecem nos editais do nicho.
- ✅ **D-26.5 RESOLVIDA (varredura 04/Jun, §11):** **0/12 vedam** o somatório; **2/12 admitem explicitamente com teto de 2 atestados** (Novo Gama/BLL); **10/12 silentes**. Achado: existe **limite de QUANTIDADE de atestados** → novo campo `somatorio.maxAtestados` no ERM + regra "N maiores acervos" no matcher (§3.2.3). Editais silentes → `ATENDE_COM_RESSALVA` é o caminho padrão.

## 9. Invariantes (não-negociáveis)
1. **Proveniência sempre:** todo dado do CCP e todo requisito do ERM cita fonte/cláusula. `inferred`/`gap` renderiza com chip visível.
2. **Elegibilidade ≠ probabilidade:** nunca fundir o gate de habilitação com o score de competitividade num número só.
3. **Revisão humana obrigatória** em tudo que a IA gera (dossiê, proposta, recurso) — exigência do cliente ("IA não é 100% verídica").
4. **Credenciais/arquivos sensíveis só no vault**, nunca em doc/JSON/git/print (CONTEXT §12).
5. **Recall ≥90% em requisito crítico** (gate spike `06`): falso-negativo que inabilita é bloqueador.

## 10. Validação jurídica (conclave Justen-Filho + Niebuhr, 04/Jun) — registro

Consulta via HYDRA real (`self-consultation.js`, Voice DNA congelado, não role-play) sobre D-26.4/D-26.5.

| # | Decisão validada | Justen (doutrina) | Niebuhr (operacional) |
|---|---|---|---|
| Somatório de atestados (mesma empresa) | **admitido como regra**; vedação só expressa+justificada (habilitação é teto) | edital silente → praxe aceita, mas comissão conservadora inabilita → `ATENDE_COM_RESSALVA`, não GO cego |
| Parcela de maior relevância | vem do **edital**, motivada (art. 67 §1º); sem designação = restrição | — |
| Consórcio | **art. 15** (não 65/66): técnica soma integral §2º; econ-fin proporcional §3º; +30% §4º, **ME/EPP isento** | inabilitam por compromisso mal formalizado + líder sem poderes → dossiê monta os docs |
| RT técnico-profissional | declaração/contrato/futura contratação; **CLT é ilegal**; momento = habilitação | comissão aceita declaração de contratação futura → **sanável** |
| GO/NO-GO design | habilitação é teto → não inflar exigência | **falso-negativo (NO-GO por sanável) é o pior dano**; conservador só no insanável |

**Mudanças aplicadas ao motor:** (a) status `ATENDE_COM_RESSALVA` p/ zona cinzenta; (b) régua **sanável×insanável** (art. 64) em toda lacuna; (c) citação corrigida p/ **art. 15**; (d) parcela de maior relevância sempre grounded no edital; (e) RT por declaração não bloqueia GO.

> ⚖️ **Disclaimer (exigência dos próprios clones):** marcal-justen-filho e niebuhr são clones doutrinários/operacionais de **apoio à decisão de produto** — **não substituem parecer de advogado habilitado** para caso concreto. Toda saída do motor para o cliente carrega disclaimer equivalente + **revisão humana obrigatória** (Alice).

## 11. Corpus map — somatório de atestados nos 12 editais reais (D-26.5, 04/Jun)

Varredura `pdftotext -layout` + grep nas cláusulas de qualificação técnica.

| Edital (arquivo) | Órgão / Município | Plataforma | Somatório |
|---|---|---|---|
| EDITAL (7) | Pref. Novo Gama/GO — creche | BLL | **ADMITE · máx. 2 atestados** (cl. 8.4.1.13.16) + acervo de consórcio aceito (art. 67 §§10-11) |
| EDITAL (8) | Pref. Novo Gama/GO — praça c/ quadra | BLL | **ADMITE · máx. 2 atestados** |
| EDITAL (5) | Câmara Mun. Abadiânia/GO — reforma/ampliação | BNC | silente |
| EDITAL (6) | CEASA/GO (Goiânia) — galpão ~5 mil m² | BLL | silente |
| EDITAL (9) | Sec. Saúde Pirenópolis/GO — remanescente de obra | BNC | silente |
| CE 002-2026 | Sec. Adm. Anápolis/GO — reforma/adequação | ComprasGov | silente |
| SEI 59297613 | CEASA/GO — reforma prédio administrativo | SEI/GDF | silente |
| EDITAL 01-2026 | Sec. Gestão (mun. a confirmar) — UBS Tipo | PCP | silente · contempla consórcio |
| edital_0405 | Sec. Assistência — reforma predial | — | silente |
| EDITAL 5-2026 (republic.) | Sec. Cultura — obra | — | silente · **reproduz art. 15** (somatório de quantitativos + econ-fin proporcional) |
| UBS II | Sec. Saúde — UBS Tipo | — | silente · contempla consórcio |
| Concorrência 03-2026 | Sec. Saúde — obra | — | silente · contempla consórcio |

**Síntese:** **VEDA 0** · **ADMITE explícito 2** (teto de 2 atestados) · **SILENTE 10**. Os "concomitantemente/simultaneamente" achados nos silentes referem-se ao envio de habilitação junto com a proposta (inversão de fases), **não** restringem somatório (descartados como falso-positivo). Vários editais silentes **reproduzem o art. 15** para consórcio — confirmação cruzada do §4. *Município de 5 templates (UBS/reforma predial) a confirmar — provável Águas Lindas/entorno.*

---
*Doc por Orion (aios-master). Aterrado em: 5 CATs/atestados reais + Balanços 2024/2025 + 12 editais (cláusulas 12.6.5 e 12.7.4 confirmadas) + Lei 14.133 arts. 14/15/67/69 + Súmula TCU 263. Supera os "desconhecidos" do spike 06 com dado real; fecha D-S4.2; introduz o FinancialSnapshot temporal (correção do owner: ENIAC cresceu 2024→2025). **D-26.4 validada juridicamente (conclave Justen+Niebuhr, §10): consórcio = art. 15, somatório admitido, RT por declaração, régua sanável×insanável.** **D-26.5 resolvida (§11): 0/12 vedam somatório; 2 admitem c/ teto de 2 atestados; 10 silentes → novo campo `somatorio.maxAtestados`.** Próximo concreto sugerido: D-26.1 (parse limpo do PL via Docling) + D-26.3 (taxonomia c/ Alice).*
