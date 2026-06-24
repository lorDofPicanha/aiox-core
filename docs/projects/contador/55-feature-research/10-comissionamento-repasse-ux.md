# Feature Research 10 — COMISSIONAMENTO, REPASSE E UX DO SPLIT (recuperação)

> Como o mercado de **recuperação tributária** e de **revenue-share/affiliate SaaS** estrutura e EXIBE repasses multi-parte — e o modelo + UX recomendados para o Projeto Contador.
>
> **Autor:** Atlas (@analyst) · **Data:** 2026-06-24 · **Método:** web real, fontes primárias (Solução de Consulta RFB, programas de parceiro reais, plataformas de split, CDC). Sem channeling de clones (regra `feedback_no_hydra_style`). Confiança calibrada por seção; onde o dado de mercado é opaco (success-fee é comercial fechado), está marcado **[INFERÊNCIA]**.
> **Base:** `00-context/CONTEXT.md` (D5/D6/D7, §5.4 "nunca prometer garantido", §5.6 "nunca descontar") · `55-feature-research/05-recuperacao.md` (split 70/15/15, STF Tema 736, faixa 1-20%).
> **Gatilho:** reunião Renan 22/Jun/2026 sobre o modelo de comissionamento/repasse.

---

## TL;DR

1. **A faixa de mercado dá razão ao Breno e ao Renan ao mesmo tempo** — eles não estão em conflito, estão descrevendo camadas diferentes do mesmo bolo. Renan fala da divisão da **mão-de-obra** (quem trabalha o caso); Breno fala da **fatia da plataforma** (o software). São linhas distintas, e ambas cabem dentro do success-fee total praticado no mercado (1-20% sobre o recuperado).
2. **Decisão de exibir VALORES ABSOLUTOS está correta e tem precedente de mercado.** A GestãoClick, no programa de parceiro contador, mostra a comissão como **"R$428,40"**, não como "30%". Valor absoluto reduz fricção cognitiva, evita a aritmética de desconfiança e protege contra a leitura de "vão me cortar uma porcentagem".
3. **Fonte primária jurídica de ouro: Solução de Consulta COSIT nº 107/2024.** A receita bruta do prestador de recuperação é **apenas a remuneração (o honorário)** — o valor recuperado que transita até o cliente NÃO é receita do prestador. Isso instrui exatamente como modelar o split e o que cada NF deve refletir.
4. **Risco jurídico real não é o split — é a COPY.** Prometer "economia garantida/redução de imposto sem risco" é propaganda enganosa (CDC art. 37, responsabilidade objetiva) e cai na mesma vala dos "títulos podres" que a RFB persegue. O split em si é lícito; a moldura de boa-fé (D6/§5.4) é o que protege.
5. **Recomendação:** split de **3-4 linhas explícitas e somáveis** (empresa cliente / plataforma 5-7% / escritório-contador / indicador opcional), com a **plataforma como linha separada e configurável** e o resto distribuído por regras do escritório — exibido em **reais absolutos**, com o **percentual como legenda secundária** (não como número principal).

---

## 1. Modelos de success-fee em recuperação tributária BR

### 1.1 Faixa praticada (com fonte)

| Camada | Faixa | Fonte | Confiança |
|--------|-------|-------|-----------|
| **Success-fee total** sobre valor recuperado | **1% a 20%** | esimplesauditoria.com, clickfiscal.com.br (já no doc 05) | ALTA |
| Em recuperação administrativa rápida (restituição) | tende ao **piso** (só êxito, sem fee fixo) | doc 05 §4 | ALTA |
| Em tese judicial/complexa | tende ao **teto** (15-25%, às vezes +) | jusbrasil (honorários de êxito) | MÉDIA |
| **Success-fee "puro"** (zero entrada, 100% no êxito) | é a oferta de aquisição dominante | mercado (Instagram/LPs do setor) | MÉDIA |

> Importante: **ninguém publica o % exato** — todos pedem demo/contato. O número é comercial fechado. A faixa 1-20% é o intervalo declarado, não o praticado por player. **[INFERÊNCIA]** o caso "monofásico Simples via restituição" (nosso ICP) é simples e líquido → mercado provavelmente cobra na metade inferior (5-15%).

### 1.2 O modelo "2 andares" (software → escritório → cliente)

Confirmado pelo doc 05 e pela natureza do nosso canal (D6): a linha software↔serviço é borrada. O fluxo de valor tem dois andares:

```
ANDAR 1 (comercial, com o cliente final):
  Empresa cliente  →  paga success-fee total (ex.: 10% do recuperado)  →  ao ESCRITÓRIO/tributarista

ANDAR 2 (B2B2B, dentro do success-fee, invisível ao cliente final):
  Do success-fee, sai a fatia da PLATAFORMA (5-7%) + a fatia do INDICADOR (se houver)
  O resto fica com o escritório (a "mão-de-obra")
```

O cliente final **só vê o success-fee total** (e o valor que volta pra ele). O split interno (plataforma/indicador) é B2B2B e não deve aparecer pro cliente final — é a economia do canal. Isso é coerente com a Solução de Consulta nº 107/2024 (cada parte fatura só a sua remuneração; ver §4).

### 1.3 Reconciliando Renan × Breno (não é conflito)

A reunião pareceu ter duas propostas concorrentes. Não são — são **dois eixos ortogonais**:

- **Renan descreve o eixo "MÃO-DE-OBRA"**: do montante cobrado, ~30% é trabalho; desse trabalho, parte vai ao indicador (ex. 30% dos 30% = 9% do montante); estruturas 70/30 ou 60/40 conforme quem aporta esforço. **Isso governa como o ESCRITÓRIO + INDICADOR dividem a parte de serviço.**
- **Breno descreve o eixo "PLATAFORMA"**: a fatia do **software** = 5-7% fixo do montante, o resto fica com a empresa-canal. **Isso governa quanto a plataforma extrai do total.**

Os dois cabem no mesmo modelo: a plataforma tira sua fatia fina e estável (5-7%); o que sobra do success-fee é dividido pela lógica de mão-de-obra do Renan (70/30, indicador, etc.). **Recomendação: adotar ambos como camadas distintas e configuráveis, não escolher um.**

---

## 2. Estrutura de split multi-parte recomendada

### 2.1 As 4 partes (papéis canônicos)

| # | Parte | O que recebe | Linha de NF | Sempre presente? |
|---|-------|-------------|-------------|------------------|
| 1 | **Empresa cliente** | o valor recuperado **líquido** (o crédito menos o success-fee total) | — (recebe restituição da RFB) | Sim |
| 2 | **Plataforma** (nós) | **5-7% do recuperado** (fee de software, fixo, configurável) | NF nossa → escritório (B2B) | Sim |
| 3 | **Escritório/contador** | o resto do success-fee após plataforma e indicador | NF escritório → empresa cliente (success-fee) | Sim |
| 4 | **Indicador** | fatia da mão-de-obra (ex. 30% da parte do escritório) | NF indicador → escritório, OU repasse contratual | **Opcional** (só quando houve indicação) |

### 2.2 Princípios de modelagem (juridicamente seguros)

1. **Plataforma = linha separada, percentual baixo e estável** (5-7%). Nunca embutida no recorrente (D6). O fee de software do êxito é **distinto** da mensalidade do core — bolsos separados.
2. **Success-fee SEMPRE em linha própria**, nunca somado/dissolvido na mensalidade (D6 reforçado pela Solução de Consulta nº 107: cada NF reflete só a sua remuneração).
3. **Indicador é opcional e configurável por caso** — pode não existir; quando existe, sai da parte do escritório (mão-de-obra do Renan), não da parte da plataforma.
4. **Distinção contratual explícita** entre "montante recuperado" e "remuneração de cada parte" (exigência direta da Solução de Consulta nº 107/2024).
5. **Nunca descontar a fatia da plataforma** (§5.6) — o valor empacotado é o fee, não um número negociável caso a caso pra fechar venda.

### 2.3 Exemplo numérico (com os números da reunião)

Cenário: crédito monofásico recuperado de uma farmácia = **R$ 100.000** (valor já corrigido SELIC, restituição RT).

Premissas da reunião:
- Success-fee total = **10%** do recuperado = **R$ 10.000** (dentro da faixa 1-20%; **[INFERÊNCIA]** 10% como exemplo didático).
- Plataforma (Breno) = **6%** do recuperado = **R$ 6.000**? → **NÃO.** Cuidado: 5-7% é a fatia da plataforma **sobre o recuperado**, mas precisa caber DENTRO do success-fee total, senão o escritório fica sem nada. Ver a leitura correta abaixo.

**Há duas interpretações possíveis do "5-7%". A reunião precisa cravar qual.** Apresento as duas:

#### Interpretação A — plataforma é fatia do RECUPERADO (5-7% do total)
```
Recuperado .............................. R$ 100.000   (100%)
├─ Plataforma (6% do recuperado) ........ R$   6.000   ← nossa fatia
├─ Mão-de-obra / serviço (Renan ~30%
│   do success-fee, mas aqui sobra após
│   plataforma) ......................... R$   4.000   (escritório + indicador)
│   ├─ Escritório (70%) ................. R$   2.800
│   └─ Indicador (30% da m.o.) .......... R$   1.200
└─ Empresa cliente (líquido) ............ R$  90.000
                            success-fee total = R$ 10.000 (10%)
```
> Nesta leitura, com success-fee de 10% e plataforma de 6%, **a plataforma fica com a maior parte** e o escritório com pouco. Só funciona se o success-fee total for alto (15-20%) OU se a plataforma aceitar fatia menor. **Risco: desalinha o canal** (escritório é o moat de distribuição, não pode ficar com sobra).

#### Interpretação B — plataforma é fatia da MÃO-DE-OBRA / do success-fee (RECOMENDADA)
A fala do Renan ("~30% é mão-de-obra; desse, 30% ao indicador") sugere que o success-fee tem uma estrutura interna. Lendo o "5-7%" do Breno como **fatia da plataforma sobre o recuperado, mas a plataforma sendo um dos beneficiários do success-fee**:
```
Recuperado .............................. R$ 100.000   (100%)
├─ SUCCESS-FEE TOTAL (10%) .............. R$  10.000
│   ├─ Plataforma (nós) ................. R$     900   ← exemplo da reunião: ~0,9% do recuperado / 9% do fee
│   ├─ Escritório/contador .............. R$   7.000   ← exemplo da reunião: R$7.000
│   └─ Indicador ........................ R$   2.000   ← exemplo da reunião: R$2.000
└─ Empresa cliente (líquido) ............ R$  90.000
```
> **Esta é a leitura que bate com os 3 valores absolutos citados na reunião (R$7.000 / R$2.000 / R$900).** Aqui o "5-7%" do Breno seria melhor relido como **5-7% do success-fee** (não do recuperado), ou como um fee fino sobre o recuperado (~0,5-1%). **A plataforma fica deliberadamente magra** porque o ativo recorrente é o core (D5), não a recuperação (que é isca, D6). O canal (escritório) fica com a maior fatia → preserva o moat de distribuição (Renan).

**RECOMENDAÇÃO: Interpretação B.** É a única coerente com (a) os números absolutos da reunião, (b) D6 (recuperação é isca, não LTV — plataforma não precisa extrair muito dela), (c) preservar o canal. **Mas a reunião precisa cravar a base do "5-7%"** — sobre recuperado ou sobre success-fee. Minha leitura: o "5-7%" do Breno foi pensado **sobre o recuperado** e os "R$900" foram pensados **sobre o fee** — são incompatíveis no mesmo exemplo. Levar isso explícito ao Renan/Breno é a pendência P0 desta análise.

### 2.4 70/30 vs 60/40 (o eixo mão-de-obra do Renan)

A divisão escritório/indicador (70/30 ou 60/40) deve ser **configurável por caso**, governada por quem aportou o trabalho:
- **70/30** quando o escritório fez a maior parte da operação (indicador só apresentou).
- **60/40** quando o indicador também trabalhou o caso (qualificou, organizou documentos).
- Isso é **regra de negócio do escritório**, não da plataforma. A plataforma só **executa e registra** a regra que o escritório configurou. Nunca arbitramos a divisão de mão-de-obra alheia.

---

## 3. UX de exibição de repasse

### 3.1 Por que VALORES ABSOLUTOS (a decisão da reunião está certa)

**Precedente de mercado:** GestãoClick (programa parceiro contador) exibe a comissão como **"R$ 428,40"** ao lado do plano, não como "30% de R$1.428". O número que o parceiro lê é o que ele **recebe**, não a fração que precisa calcular.

Argumentos a favor de absoluto como número principal:

1. **Reduz fricção cognitiva.** "Você recebe R$ 7.000" é processado direto; "você recebe 70% de 10% de R$100.000" exige 3 contas e gera desconfiança ("será que a conta tá certa?").
2. **Confiança = ativo psicológico da transação** (princípio de transparência de pricing). O contador não quer auditar matemática; quer ver o número dele.
3. **Evita a leitura de perda.** Percentual ativa enquadramento de "estão me cortando uma porcentagem" (aversão à perda). Valor absoluto enquadra como ganho recebido.
4. **Robustez a mudança de base.** Se a base de cálculo mudar (recuperado vs success-fee — ver §2.3), o percentual confunde; o valor absoluto sempre diz a verdade do que pinga na conta.

### 3.2 Mas o percentual não some — vira legenda

**Recomendação: absoluto em destaque + percentual como subtítulo/tooltip.** Transparência total (não esconder a regra) sem fazer o contador fazer conta. Exemplo de card:

```
┌─────────────────────────────────────────────┐
│  Crédito identificado (estimativa)           │
│  R$ 100.000,00          [confiança: média]   │
│  · sujeito a revisão do tributarista ·       │
├─────────────────────────────────────────────┤
│  Quanto cada parte recebe (no êxito)         │
│                                              │
│  Empresa cliente .............  R$ 90.000,00 │
│     o valor que volta pra ela    (90%)       │
│                                              │
│  Você (escritório) ...........  R$  7.000,00 │
│     sua remuneração              (7%)        │
│                                              │
│  Indicador ...................  R$  2.000,00 │
│     repasse de indicação         (2%)        │
│                                              │
│  Plataforma ..................  R$    900,00 │
│     fee da ferramenta            (0,9%)      │
│                                              │
│  ⓘ valores estimados · success-fee só no     │
│    êxito · tributarista habilitado assina    │
│    a PER/DCOMP · veja a trilha de evidências │
└─────────────────────────────────────────────┘
```

Princípios de UI:
- **Absoluto grande, % pequeno** (legenda à direita ou tooltip).
- **A linha do contador em destaque visual** (é o usuário; é o ganho dele que vende).
- **Empresa cliente primeiro** (o valor que volta é o herói — reforça que ele é o maior beneficiário, não a plataforma).
- **Plataforma por último e magra** (sinaliza que não estamos extraindo do canal).
- **Disclaimer G6 sempre presente** (§5.4): "estimativa", "no êxito", "tributarista assina". Nunca "você vai receber" no futuro do indicativo.

### 3.3 Dashboard de comissão do escritório (visão acumulada)

Inspirado em dashboards de afiliados SaaS (real-time, "recebido vs pendente"):

- **Pendente** (casos em análise/protocolados, ainda não restituídos) vs **Recebido** (restituição confirmada pela RFB) — nunca contar como receita o que ainda não pingou (alinhado à Solução de Consulta: receita só no recebimento).
- Por caso: cliente, crédito estimado, estágio (análise→dossiê→tributarista→protocolado→restituído), fatia do escritório, fatia do indicador.
- **Configuração de regras**: o escritório define a tabela de divisão (70/30, 60/40, indicador sim/não) — a plataforma aplica, não decide.

### 3.4 Configurabilidade

- **Fee da plataforma**: configurável por contrato de escritório (5-7%, ou o que for cravado), **travado** após assinatura (não negociável por caso — §5.6 nunca descontar).
- **Divisão escritório/indicador**: configurável **por caso** pelo escritório.
- **Indicador**: campo opcional; quando vazio, a fatia dele = R$0 e o escritório fica com a parte cheia da mão-de-obra.

---

## 4. Riscos jurídicos/contábeis + mitigação

### 4.1 NF e base de cálculo — **Solução de Consulta COSIT nº 107/2024** (fonte primária)

A RFB já respondeu como tributar serviço de recuperação de crédito:
- A **receita bruta do prestador = apenas a remuneração** (o honorário/success-fee). **O valor recuperado que transita até o cliente NÃO integra a receita do prestador.**
- **Contrato e NF devem distinguir** o montante recuperado da remuneração de cada parte.
- A NF reflete **só a receita do prestador**, não o valor total recuperado.

**Implicação para o split:**
- Cada parte fatura **só a sua fatia**: escritório emite NF de success-fee à empresa cliente; plataforma emite NF do fee de software ao escritório; indicador (se PJ) emite NF do repasse ao escritório.
- O valor recuperado **não passa pela nossa NF** — restituição RFB vai direto à empresa cliente (RT, D5). Nós nunca "seguramos" o dinheiro do cliente (evita risco de ser tratado como instituição de pagamento / custódia).

### 4.2 Retenções na fonte

- Quando o tomador é Lucro Real/Presumido e a NF > R$ 215,05, retém **PIS 0,65% / COFINS 3% / CSLL 1% / IRRF 1-1,5%** (ContaAzul, F360). Simples Nacional é isento dessas retenções federais.
- **Implicação:** o engine deve permitir exibir valor **bruto e líquido de retenção** quando o pagador for não-Simples — senão o contador estranha o valor menor que pinga. **[P2, não-bloqueante para o MVP]**.

### 4.3 O risco REAL: a copy, não o split

- **CDC art. 37 — propaganda enganosa, responsabilidade objetiva** (independe de dolo/culpa; basta induzir a erro + dano). Pena: detenção 3 meses-1 ano + multa.
- Prometer "economia garantida / redução de imposto sem risco" coloca a plataforma e o escritório na **mesma vala dos "títulos podres"** que a RFB persegue (operações com aparência técnica e promessa de resolver passivo "sem risco" → viram autuação milionária + responsabilidade do sócio + crime).
- **Mitigação (já no §5.4 do CONTEXT, reforçar na UX do split):**
  - Nunca exibir o repasse com linguagem de certeza ("você VAI receber R$7.000"). Sempre "estimativa, no êxito, sujeito a revisão".
  - O split é **condicional ao êxito real** (restituição confirmada). Pendente ≠ recebido (§3.3).
  - **Tributarista habilitado assina** a PER/DCOMP (D6) — a plataforma entrega dossiê, não "vende redução garantida".
  - A **trilha de boa-fé** (doc 05, dif #1) é o que diferencia nosso split de uma "venda de imposto": cada R$ estimado tem proveniência (nota+NCM+norma+confiança), defensável no auto de infração.

### 4.4 Quem é responsável técnico

- **Pendência aberta do CONTEXT §8.2** (não resolvível por pesquisa de mercado). O contrato de associação contador+tributarista e o responsável técnico do pedido devem ir ao clone **Heleno** (tributário) antes de qualquer protocolo real. O split de comissão **não cria** responsabilidade técnica — quem assina a PER/DCOMP a assume.
- **OAB:** se houver advogado tributarista no loop, honorários de êxito têm regras do Estatuto da Advocacia (quota litis); se for só contador (administrativo/restituição), é serviço contábil. A natureza da parte (advogado vs contador) muda o enquadramento — confirmar caso a caso. **[MÉDIA confiança]**.

---

## 5. Engine de cálculo de repasse

### 5.1 Fórmula

Entrada: `credito_recuperado` (R$, já corrigido SELIC) + configuração do contrato/caso.

```
# Configuração (por contrato de escritório, travada na assinatura)
fee_plataforma_pct          # ex.: 0.009 (0,9% do recuperado) OU base sobre success-fee — CRAVAR §2.3
success_fee_total_pct       # ex.: 0.10 (10% do recuperado) — por caso, dentro de 1-20%

# Configuração por caso (definida pelo escritório)
divisao_escritorio_pct      # ex.: 0.70  (70/30) ou 0.60 (60/40)
tem_indicador               # bool
indicador_pct_da_mao_obra   # ex.: 0.30 (30% dos 30%)

# Cálculo (Interpretação B recomendada — ver §2.3)
success_fee_total   = credito_recuperado * success_fee_total_pct
fatia_plataforma    = credito_recuperado * fee_plataforma_pct        # fee fino, fixo
mao_de_obra         = success_fee_total - fatia_plataforma            # o que sobra pro canal
fatia_indicador     = tem_indicador ? (mao_de_obra * indicador_pct_da_mao_obra) : 0
fatia_escritorio    = mao_de_obra - fatia_indicador
liquido_cliente     = credito_recuperado - success_fee_total

# Invariante de segurança (NUNCA pode quebrar)
assert fatia_plataforma + fatia_escritorio + fatia_indicador == success_fee_total
assert liquido_cliente + success_fee_total == credito_recuperado
assert fatia_escritorio >= 0   # se < 0, config inválida (plataforma + indicador > fee) → bloquear
```

> **Guarda crítica:** se `fee_plataforma + fatia_indicador > success_fee_total`, o escritório ficaria negativo → o engine deve **bloquear e alertar** ("configuração deixa o escritório sem remuneração; revise o success-fee ou o fee da plataforma"). Isso evita o cenário tóxico da Interpretação A.

### 5.2 Onde persiste (ligado à trilha)

- O resultado do cálculo é **persistido junto à trilha de boa-fé** (doc 05, P1) — cada split fica amarrado ao caso e ao snapshot de evidências que o originou: `{caso_id, credito_recuperado, selic_aplicada, success_fee_pct, fatias[], config_versao, data, hash_trilha}`.
- **Imutável após protocolo**: uma vez que o tributarista protocola, o split daquele caso congela (mudar regra depois = novo registro versionado, não edição). Mesma lógica de log imutável da trilha.
- **Pendente vs Recebido**: o split nasce "estimado/pendente"; só vira "realizado" quando a restituição é confirmada (status do e-CAC, Fase 2). Antes disso, dashboard mostra como projeção, nunca como receita.

### 5.3 Configurabilidade (resumo)

| Parâmetro | Onde se define | Quando trava |
|-----------|----------------|--------------|
| `fee_plataforma_pct` | contrato de escritório | na assinatura (§5.6 não descontar) |
| `success_fee_total_pct` | por caso (dentro de 1-20%) | no aceite do cliente |
| `divisao_escritorio_pct` (70/30, 60/40) | por caso, pelo escritório | no aceite |
| `tem_indicador` + `indicador_pct` | por caso, pelo escritório | no aceite |

---

## 6. Stories de build

> Alinhadas ao D4 (Concierge MVP antes de build pesado): a UI do split já existe sintética em `apps/contador/app/recuperacao/`. Estas stories transformam a calculadora ilustrativa 70/15/15 no engine multi-parte real.

| ID | Story | Prioridade | Depende de |
|----|-------|:---:|---|
| **C10.1** | Modelo de dados do split (4 papéis, config por contrato + por caso, versionado) | P0 | — |
| **C10.2** | Engine de cálculo com invariantes e guarda de escritório-negativo (§5.1) | P0 | C10.1 |
| **C10.3** | UI do card de split em **valores absolutos** (% como legenda), ordem empresa→contador→indicador→plataforma, disclaimer G6 (§3.2) | P0 | C10.2 |
| **C10.4** | Tela de configuração: fee plataforma (travado), divisão 70/30·60/40, indicador on/off (§3.4) | P1 | C10.2 |
| **C10.5** | Persistência do split ligada à trilha de boa-fé (imutável pós-protocolo, snapshot+hash) (§5.2) | P1 | C10.2, trilha (doc 05 P1) |
| **C10.6** | Dashboard de comissão do escritório: Pendente vs Recebido, por caso (§3.3) | P1 | C10.5 |
| **C10.7** | Exibição bruto/líquido de retenção quando pagador não-Simples (§4.2) | P2 | C10.2 |
| **C10.8** | [DECISÃO, não build] Cravar com Renan/Breno a **base do "5-7%"** (recuperado vs success-fee) — §2.3 | P0-bloqueante | — |
| **C10.9** | [JURÍDICO] Revisão do contrato de associação + responsável técnico + enquadramento OAB com clone Heleno (§4.4) | P1 | — |

---

## 7. Fontes (URLs primárias)

**Jurídico / NF / base de cálculo (fonte primária de ouro):**
- Solução de Consulta COSIT nº 107, de 27/09/2024 (receita bruta do prestador de recuperação = só a remuneração; NF distingue recuperado de honorário) — http://normas.receita.fazenda.gov.br/sijut2consulta/anexoOutros.action?idArquivoBinario=75896
- Honorários de êxito em recuperação de créditos (Jusbrasil) — https://www.jusbrasil.com.br/artigos/recuperacoes-de-creditos-tributarios-e-os-honorarios-de-exito/394193256
- Success fee — definição, base de cálculo, setores regulados (NeilPatel BR) — https://neilpatel.com/br/blog/success-fee/
- Apuração de valores em contratos de success fee (Orleans Consultoria) — https://orleansconsultoria.com.br/2024/10/26/apuracao-de-valores-decorrente-de-contratos-de-success-fee/

**Retenções na fonte:**
- Retenção de impostos na NF (ContaAzul) — https://contaazul.com/blog/retencao-de-impostos/
- Retenção de impostos na NFS-e (F360) — https://f360.com.br/blog/contabilidade/retencao-de-impostos-na-nota-fiscal/

**Risco jurídico (copy / propaganda):**
- CDC art. 37 — propaganda enganosa, responsabilidade objetiva (TJDFT Direito Fácil) — https://www.tjdft.jus.br/institucional/imprensa/campanhas-e-produtos/direito-facil/edicao-semanal/propaganda-enganosa-ou-abusiva
- "Títulos podres" / economia tributária que vira autuação (Leouve) — https://leouve.com.br/opiniao/a-economia-tributaria-que-pode-terminar-em-autuacao-bloqueio-de-bens-e-crime/
- Responsabilidade civil em propaganda enganosa no CDC (Galícia) — https://www.galiciaeducacao.com.br/blog/responsabilidade-civil-em-propaganda-enganosa-no-cdc/

**Revenue-share / comissão / UX (precedente de valor absoluto):**
- GestãoClick — programa parceiro contador (comissão exibida em R$ absoluto: R$428,40 etc., 30% vitalícia) — https://parceiro.gestaoclick.com.br/contador/
- vhsys — programa de parceiros/revenda — https://www.vhsys.com.br/revenda/
- Como calcular comissão de afiliados/parceiros SaaS (benchmarks 10-30% 1ª venda / 5-20% recorrência) — https://canalizeprm.com.br/blog/como-calcular-comissao-de-afiliados/
- SaaS affiliate commission rates and structures (Post Affiliate Pro) — https://www.postaffiliatepro.com/blog/saas-affiliate-commission-rates/

**Split de pagamento (valor fixo vs %, dashboard, repasse):**
- Split de pagamento — valor fixo ou percentual, repasse em tempo real (MercadoPago) — https://www.mercadopago.com.br/blog/split-de-pagamento-dividir-comissoes-automaticamente
- Divisão automática de comissão (Transfeera) — https://transfeera.com/blog/divisao-automatica-de-comissao-de-vendas/
- API de split de pagamentos (Asaas) — https://blog.asaas.com/qual-api-oferece-split-de-pagamentos/

**Base do projeto:**
- `docs/projects/contador/55-feature-research/05-recuperacao.md` (split 70/15/15, faixa 1-20%, STF Tema 736, RT default)
- `docs/projects/contador/00-context/CONTEXT.md` (D5/D6/D7, §5.4, §5.6)

---

## 8. Notas de confiança e pendências

- **ALTA confiança:** Solução de Consulta nº 107/2024 (base de cálculo/NF); faixa success-fee 1-20%; CDC art. 37; precedente GestãoClick de exibição em valor absoluto; benchmarks de comissão SaaS; mecânica de split de pagamento (valor fixo ou %).
- **MÉDIA:** % exato praticado por concorrente (mercado opaco, ninguém publica); enquadramento OAB (depende de advogado vs contador no loop); honorários judiciais 15-25%.
- **[INFERÊNCIA] explícita:** os 10% de success-fee do exemplo §2.3 (didático); que monofásico-Simples cobra na metade inferior da faixa; a leitura de que o "5-7%" do Breno e os "R$900" da reunião usam bases diferentes (recuperado vs success-fee).
- **PENDÊNCIA P0-BLOQUEANTE (C10.8):** cravar com Renan/Breno se o **5-7% incide sobre o recuperado ou sobre o success-fee**. As duas leituras dão produtos econômicos muito diferentes (§2.3 A vs B). Recomendo Interpretação B (bate com R$7.000/R$2.000/R$900 e preserva o canal).
- **PENDÊNCIA jurídica (C10.9):** contrato de associação contador+tributarista + responsável técnico → clone Heleno antes de protocolo real (CONTEXT §8.2).
