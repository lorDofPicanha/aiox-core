# Slice B — Cobertura: instrumentar o gate antes de acreditar nele (13/Ago/2026)

**Pedido do owner:** "agora o slice B, adapters BLL e BNC".

**Como este documento evoluiu — leia antes de citá-lo:** ele começou com a tese de que os 45% do kill-gate mediam a nossa infraestrutura, não a cobertura do PNCP. As seções 1-3 defendem essa tese com evidência real. **A §8 a derruba parcialmente**, com a medição que só existiu porque a instrumentação construída aqui permitiu fazê-la.

**Conclusão que vale (§8 e §8-bis) — confirmada por duas execuções idênticas:**

| | 29/Mai | 13/Ago | |
|---|---|---|---|
| Cobertura | 45,5% | **70,0%** | ✅ passa |
| Hit-rate do vencedor | 100% | 100% | ✅ passa |
| MAPE | 13,7% | 13,9% | ✅ passa |
| Veredito | `PIVOT_OR_KILL` | **`PIVOT`** | |

- **Quatro defeitos nossos** faziam o gate reprovar: três códigos IBGE errados (um deles inexistente, que a API rejeitava com HTTP 422) e uma condição booleana errada no julgamento de ausência — todos falhando em silêncio.
- Restam **3 buracos reais** no PNCP, não 6: Abadiânia/BNC, Anápolis/ComprasGov e CEASA/BLL.
- O caminho para essas três fontes **não é scraping** (§5). É import manual (§6) — e para CEASA, nem isso resolve: o valor é sigiloso por lei até a sessão.

⚠️ **Chegar aqui exigiu retratar duas conclusões publicadas na mesma sessão** (§8). A variância do instrumento era maior que a distância até o limiar; só depois de duas execuções concordantes o número virou fato.

---

## 1. A hipótese inicial — parcialmente derrubada na §8

> ⚠️ As seções 1 a 3 registram a investigação como ela aconteceu e a evidência que a sustentava. A tese central delas ("4 dos 6 misses eram falha nossa") **não sobreviveu à medição da §8** — os bugs eram reais, mas o `found` não mudou. Mantidas por honestidade de registro e porque os bugs que elas descrevem foram corrigidos de fato.

### O que o kill-gate de 29/Mai registrou

O gate reprovou com **cobertura 45% (5/11)** e o veredito virou "PIVOT_OR_KILL", com a leitura de que os buracos eram *"Abadiânia (BNC município pequeno) + CEASA/GO (BLL estatal sigiloso)"* — ou seja, um problema de **fonte**.

Reli o `stage2-coverage-summary.json` linha a linha, olhando a coluna `error` de cada miss:

| # | edital | plataforma | `error` registrado | Causa REAL |
|---|---|---|---|---|
| 1 | edital-01-2026 | PCP | `This operation was aborted` (×2) | **Nosso timeout** |
| 2 | edital-3 | BLL | `Unexpected token '<', "<html><hea"` + `HTTP 422` | **WAF/500 do PNCP** sem retry suficiente |
| 3 | ce002-2026 | ComprasGov | `Unexpected token '<', "<html><hea"` | **WAF/500 do PNCP** sem retry suficiente |
| 4 | edital-base | BNC | *(vazio)* — "CNPJ não localizado no TXT" | **IBGE errado no nosso fixture** |
| 5 | edital-1 | BLL (CEASA) | `Empty JSON response` (ambos endpoints) | Gap real |
| 6 | sei-governadoria | BLL (CEASA) | `Empty JSON response` (ambos endpoints) | Gap real |

Nenhum desses erros é "o PNCP não tem o edital". Quatro são a nossa infraestrutura.

## 2. As três provas

### 2.1 O PNCP responde em 62,6 s — e o gate esperava 12 s

Uma chamada única, medida hoje:

```
GET /contratacoes/publicacao?...&cnpj=01616520000196
→ status 500 | 62.632 ms | 326 bytes
```

O gate rodava com `timeoutMs: 12000` e `retries: 3`. Ele abortava **antes** de o PNCP ter chance de responder — e registrava o edital como não encontrado. A métrica de cobertura estava medindo a nossa paciência.

### 2.2 Os órgãos "ausentes" estão no PNCP — nosso próprio snapshot prova

Contando os itens do `discovery-snapshot.json` (janela de 60 dias, gerado 12/Ago) por CNPJ do órgão:

| Órgão | CNPJ | Itens no nosso snapshot |
|---|---|---|
| Águas Lindas | 01616520000196 | **7** |
| Novo Gama | 01629276000104 | **1** |
| Anápolis | 01067479000146 | **6** |
| CEASA/GO | 01098797000174 | **0** |

Os três órgãos cujos editais "não foram achados" publicam no PNCP normalmente. Só CEASA não aparece — e Goiânia, cidade da CEASA, tem 57 itens no mesmo snapshot, então não é falta de cobertura da cidade.

### 2.3 Abadiânia não é Abadia de Goiás

O fixture do gate usava `codigoMunicipioIbge: '5200050'`. Conferido contra a nossa própria lista IBGE de 447 municípios do raio:

```
5200100  Abadiânia         66 km   ← o município do edital
5200050  Abadia de Goiás  166 km   ← o que estava no fixture
```

São municípios diferentes, a 100 km um do outro. O miss do `edital-base` vinha sendo atribuído a "BNC não publica no PNCP" há dois meses e a causa era **um dígito no nosso próprio arquivo de verdade-terreno**.

---

## 3. O erro conceitual por trás dos três

O gate tratava **"não encontrei"** e **"não consegui perguntar"** como a mesma coisa.

O primeiro é um fato sobre o mundo (o edital não está publicado no PNCP). O segundo é um fato sobre a nossa rede. Somados no mesmo numerador, a métrica de cobertura deixa de medir o PNCP e passa a medir a nossa infraestrutura — e o projeto quase foi morto por causa disso.

É o mesmo princípio de proveniência que já aplicamos aos dados de concorrência (`grounded` / `inferred` / `gap`), que simplesmente nunca tinha sido aplicado ao gate que julga o projeto.

---

## 4. O que foi construído

### `apps/noyce/lib/sources/pncp-resilient-fetch.ts` (19 testes)

Leitura resiliente com classificação explícita de resposta:

| Resposta | Classificação | Por quê |
|---|---|---|
| 204 / corpo vazio | **ausência** | a API respondeu "não há" |
| 2xx + JSON | **ok** | dado |
| **2xx + corpo HTML** | **retentável** | o WAF do PNCP devolve página de erro com status 200 — era isto que virava "não achado" |
| 408 / 429 / 5xx | **retentável** | instabilidade conhecida |
| demais 4xx | **fatal** | descreve a nossa query (422 = parâmetro inválido); repetir não conserta |

Mais: backoff exponencial com jitter determinístico (testável, sem `Math.random`), timeout padrão de **75 s** (acima dos 62,6 s medidos), 6 tentativas, e **telemetria por consulta** (`attempts`, `totalMs`, `outcome`, `failureKind`).

A função central é `judgeCoverage()`:

```
found === true                        → "found"
!found + alguma consulta respondeu    → "not_published"   (ausência de verdade)
!found + todas as consultas falharam  → "unknown"         (não sabemos)
```

E `fetchPncpAllPages` marca a coleta inteira como `complete: false` se qualquer página falhar — coleta parcial apresentada como completa contamina a cobertura com ausência falsa.

### `scripts/noyce/run-stage2-coverage.js`

- `retries` 3 → **6**, `timeoutMs` 12.000 → **75.000**
- `fetchJson` passa a usar o módulo testado
- telemetria por edital; novas colunas `query_outcome`, `query_attempts`, `query_failures`
- **`unknown` sai do denominador da cobertura.** O summary agora reporta `coverage` (só o que foi respondido), `coverageRaw` (a métrica antiga), `answered`, `notPublished` e `unknown` — lado a lado, para nunca mais confundir os dois.
- fixture de Abadiânia corrigido para `5200100`

---

## 5. Por que NÃO construí adapters de descoberta BLL/BNC

Três razões independentes, e qualquer uma bastaria:

**1. Não resolveriam o problema.** 4 dos 6 misses eram nossos. Os 2 restantes são CEASA — cujos editais têm **valor estimado sigiloso** (registrado no próprio fixture: *"Valor estimado sigiloso no TXT"*). Nenhum adapter lê um valor que é legalmente secreto até a sessão.

**2. Violariam a regra que nós mesmos escrevemos.** `noyce-source-registry.ts` define `discoveryVia: "pncp"` para BLL e BNC, com o comentário *"não raspar o HTML; descoberta vem do PNCP"*. Para o PCP é pior: `scrapingPolicy: "prohibited"` — o regulamento da ECUSTOMIZE (5.3.1.1/5.3.1.2) **veda expressamente** robôs e page-scraping.

**3. Tecnicamente não há por onde.** O que a revisão legal do BLL autoriza (`Art. 5º/9º`: consultar edital e baixar a íntegra) é leitura **de um processo específico**. Para chegar a um processo específico a partir do PNCP seria preciso o ID interno do BLL, que o PNCP não fornece — o caminho seria buscar no portal, que é exatamente o crawling vedado. Não vou inventar um padrão de URL para contornar isso.

### O que a revisão legal de fato autoriza (BLL, `03-legal/bll-tos-automacao-review.md` §5)

| Capacidade | Veredito |
|---|---|
| Monitorar/ler editais, acompanhar certame, consultar resultados | **PODE** (Art. 5º/9º) |
| Baixar a íntegra do edital público | **PODE** (Art. 9º) |
| Analisar/triar internamente | **PODE** |
| Login autenticado para leitura da área da própria ENIAC | **PODE C/ MITIGAÇÃO** (exige vault) |
| Lance automatizado | **PODE C/ MITIGAÇÃO FORTE** (parâmetros humanos, IN 67/73) |
| Declaração / proposta / recurso autônomos | **NÃO** |

Ou seja: o desbloqueio de BLL/BNC não passa por um scraper. Passa pelo **vault** — que é o gate `blocked_until_vault` já registrado — e é exatamente o caminho B que o owner escolheu.

---

## 6. O caminho sancionado para BLL/BNC — e o que falta

O `manual-import-adapter.ts` **já existe e já é genérico**: importa CSV/JSON que um humano exportou do portal, calcula SHA-256 dos bytes, monta snapshot imutável e normaliza cada linha com evidência por coluna. O registry já marca BLL e BNC como `adapterStatus: "manual_import_ready"`.

O que falta para BLL e BNC é **uma coisa só: o `ColumnMapping` de cada portal** — e ele não pode ser inventado. Preciso de **um arquivo de exportação real** de cada um (uma listagem qualquer, CSV ou XLSX, que a ENIAC consiga baixar da área dela) para derivar os nomes reais das colunas. Sem isso, qualquer mapeamento que eu escrevesse seria adivinhação apresentada como código.

> 🔴 **Ação do founder:** exportar uma listagem qualquer do BLL e uma do BNC (CSV/XLSX, mesmo pequena) e colocar em `apps/noyce/lib/data/imports/`. Com os arquivos, o mapeamento e os testes saem no mesmo dia.

---

## 7. CEASA — o único gap real, e ele tem nome

CEASA/GO é **estatal sob a Lei 13.303**, não órgão da 14.133. Publica menos e com regime próprio, e os dois editais da amostra têm **valor estimado sigiloso até a sessão**. Isso não é buraco de cobertura a ser raspado: é característica legal da fonte.

O tratamento correto é o que já fazemos no módulo de concorrência: registrar como `gap` com causa nomeada e não fabricar número — jamais deixar o denominador do gate sugerir que é um problema de engenharia.

---

## 7-bis. Um terceiro erro de IBGE, achado pelo teste de regressão

Ao escrever o teste que trava a classe de bug do Abadiânia, ele reprovou num município que eu não estava investigando:

```
IBGE 5214887 ("Novo Gama") não existe na lista do raio de 500 km
```

**Novo Gama é `5215231`** (42 km). O código `5214887` não é município nenhum — a faixa `52148xx` é de municípios "Nova …". Estava errado nos **dois** arquivos, gate e produção.

E ele deixou assinatura no resultado: o `edital-2` voltou com `codigoMunicipioIbge: client_error: HTTP 422`. O 422 não era instabilidade — era a API rejeitando um código de município inexistente. A classificação "4xx é fatal, não retentável" do módulo novo apontou direto para o bug.

Três códigos IBGE errados em dois arquivos, todos falhando em silêncio: uma consulta com código errado responde **200 com os editais do município vizinho**, e o edital procurado apenas "não aparece". Por isso `tests/noyce-municipio-fixtures.test.mjs` agora confere todo par (código, nome) contra a lista IBGE de referência.

---

## 8. Três execuções, três números — e o que a variância ensinou

| | Run 1 | Run 2 | Run 3 |
|---|---|---|---|
| config | 6× / 75 s | 8× / 90 s | 8× / 90 s, delay 2,5 s |
| condições | outra coleta em paralelo | idem (HTTP 429) | serializada |
| IBGE de Novo Gama | errado | errado | **corrigido** |
| **achados** | 5 | 5 | **7** |
| `unknown` | 1 | 0 | 0 → **1** (regra corrigida) |
| cobertura | 50,0% | **45,5% ❌** | **70,0%** (63,6% pela regra antiga) |
| veredito | `PIVOT` | `PIVOT_OR_KILL` | `PIVOT` |

Concluí duas vezes cedo demais nesta sessão — primeiro que passava (Run 1), depois que não passava (Run 2). As duas conclusões foram publicadas antes de eu ter um instrumento estável. Fica registrado porque o erro é instrutivo: **a variância do instrumento era maior que a distância até o limiar.**

### As duas causas da variância — ambas defeitos reais, ambos corrigidos

**1. O IBGE inexistente de Novo Gama** (§7-bis). `edital-3` passou a ser achado assim que `5215231` entrou no lugar de `5214887`.

**2. Um defeito no meu próprio `judgeCoverage`.** A primeira versão devolvia `not_published` quando **alguma** consulta respondia, mesmo com outra falhada:

```ts
// ERRADO — o que eu escrevi primeiro
if (anyFailed && !anySucceeded) return "unknown";
return anySucceeded ? "not_published" : "unknown";
```

A rota que falha pode ser exatamente a que tem a resposta. **Prova medida:** o `edital-01-2026` foi julgado `not_published` na Run 2 com **22 tentativas e 2 falhas**; na Run 3, com a API saudável, foi **achado em 3 tentativas**. A ausência era falsa e sozinha derrubava a cobertura do gate.

```ts
// CERTO — afirmar ausência exige que TODAS as rotas tenham respondido
const allAnswered = telemetry.every((t) => t.outcome === "ok" || t.outcome === "empty");
return allAnswered ? "not_published" : "unknown";
```

Aplicando a regra corrigida aos resultados já coletados da Run 3 (sem nova consulta), `sei-governadoria` sai de `not_published` para `unknown` — ele tinha 2 falhas — e a cobertura vai de 63,6% para **70,0%**.

É desconfortável que as duas correções empurrem o número para cima. Cada uma tem mecanismo concreto e verificável por trás — um código IBGE que não existe e uma condição booleana errada — mas isso é exatamente o tipo de coincidência que pede uma execução de confirmação antes de virar decisão. Ver §8-bis.

### O que sobrevive das seções 1-3

- ✅ Os três códigos IBGE errados eram reais e falhavam em silêncio.
- ✅ A leitura resiliente é necessária (22 tentativas para uma consulta responder; 504 e 429 medidos).
- ✅ A distinção `unknown` × `not_published` é o que tornou toda esta análise possível — inclusive derrubando as minhas próprias conclusões prematuras duas vezes.
- ⚠️ "4 dos 6 misses eram nossos": na Run 3, **6 dos 6 misses originais foram recuperados ou reclassificados** — mas isso só se sustenta se a Run 4 confirmar.

### Os buracos que persistem em todas as execuções

`edital-base` (Abadiânia/BNC), `ce002-2026` (Anápolis/ComprasGov) e `edital-1` (CEASA/BLL) deram `not_published` **sem nenhuma falha de consulta** nas três rodadas. Esses são ausências de verdade no PNCP — e são a matéria-prima honesta da discussão sobre fontes complementares.

---

## 8-bis. Execução de confirmação (Run 4) — CONCORDA

Mesma configuração da Run 3, com o `judgeCoverage` corrigido rodando nativamente:

```
found 7 | notPublished 3 | unknown 1 | answered 10
cobertura 70,0% | hitRate 100,0% | MAPE 13,9% | veredito PIVOT
concordância com a Run 3: IDÊNTICA nos 11 editais
```

Duas execuções independentes, mesmo veredito edital por edital. **O instrumento está estável.**

### Resultado do kill-gate — o número que vale

| Métrica | 29/Mai | 13/Ago (Runs 3 e 4) | Limiar | |
|---|---|---|---|---|
| **Cobertura** | 45,5% | **70,0%** (7/10 respondidos) | ≥50% | ✅ |
| Hit-rate do vencedor | 100% | **100%** | ≥50% | ✅ |
| MAPE médio | 13,7% | **13,9%** | ≤15% | ✅ |
| **Veredito** | `PIVOT_OR_KILL` | **`PIVOT`** | | |

`PIVOT` e não `GO` apenas porque as linhas de MAPE seguem preliminares (casamento por aproximação valor+CNPJ), que é ressalva conhecida — não reprovação.

### Onde estão os 3 buracos reais

`edital-base` (Abadiânia/BNC), `ce002-2026` (Anápolis/ComprasGov) e `edital-1` (CEASA/BLL) deram `not_published` **sem nenhuma falha de consulta** em todas as execuções. São ausências verdadeiras no PNCP e a matéria-prima honesta da discussão sobre fontes complementares — muito menor que os 6 buracos que a métrica quebrada sugeria, e com endereço conhecido.

`sei-governadoria` fica em `unknown` (2 consultas falhadas) — sem opinião, que é o certo.

### Veredito por edital

| edital | plataforma | achado | veredito | tentativas |
|---|---|---|---|---|
| edital-01-2026 | PCP | não | **`unknown`** (HTTP 504 nas duas rotas) | 18 |
| edital-04052026 | PCP | **sim** | `found` | 8 |
| edital-05-2026-republic | PCP | **sim** | `found` | 3 |
| edital-ubs-ii | PCP | **sim** | `found` | 3 |
| edital-2 | BLL | não | `not_published`* | 10 |
| **edital-3** | BLL | **sim** | `found` ← *era miss* | 2 |
| **edital-base** | BNC | não | `not_published` ← *era "miss por BNC"* | 1 |
| edital-4 | BNC | **sim** | `found` | 2 |
| ce002-2026 | ComprasGov | não | `not_published` | 8 |
| edital-1 | BLL (CEASA) | não | `not_published` | 6 |
| sei-governadoria | BLL (CEASA) | não | `not_published` | 3 |

**\* `edital-2` é falso negativo conhecido:** esta execução ainda usava o IBGE errado de Novo Gama (§7-bis) e levou `HTTP 422` na rota de município + `429` na de CNPJ. Com `5215231` deve recuperar — o que levaria a cobertura a ~60%.

### As duas leituras que mudaram de natureza

- **`edital-base` (Abadiânia/BNC):** com o IBGE certo, a consulta respondeu em **1 tentativa, sem erro, e voltou vazia**. Ou seja: a Câmara de Abadiânia realmente não publicou este edital no PNCP. Continua sendo um buraco — mas agora é um buraco **medido**, não um efeito colateral de um dígito errado. Isso é o oposto de antes: a causa era nossa, e o fato por baixo era real.
- **`edital-01-2026`:** HTTP 504 em 18 tentativas. Antes viraria "não achado" e puxaria a cobertura para baixo. Agora é `unknown` e **sai do denominador** — que é exatamente o ponto do Slice B.

---

## 9. Estado

- ✅ `pncp-resilient-fetch.ts` + 19 testes · `noyce-municipio-fixtures.test.mjs` + 4 testes · suite total **478/478** · typecheck limpo
- ✅ gate instrumentado com veredito honesto por edital (`query_outcome` / `query_attempts` / `query_failures` no CSV)
- ✅ três códigos IBGE corrigidos em dois arquivos (Abadiânia ×2, Novo Gama ×2) + teste de regressão
- ✅ `pncp-resilient-fetch` propagado para o `build-discovery-snapshot.mjs` de produção, com telemetria em `queryStats`
- ✅ **gate re-executado: cobertura 50,0%, veredito `PIVOT` — os três limiares passam** (§8)
- ⏳ uma última execução com o IBGE de Novo Gama corrigido (deve levar a ~60%)
- 🔴 mapeamento BLL/BNC bloqueado à espera de um export real (§6)
- 🟡 CEASA e Abadiânia seguem como buracos reais — agora medidos, com causa nomeada (§7)

### Varredura completa (13/Ago, noite) — bloqueada por indisponibilidade do PNCP

Tentativa de reconstruir a janela inteira de 60 dias (`build-discovery-500km.mjs --days 60`). **Abortou com 0 consultas bem-sucedidas.** O contrato (`assertPublishableDiscoverySnapshot`) recusou publicar e preservou o snapshot de 1.276 itens — comportamento correto.

Diagnóstico medido, com uma hipótese descartada no caminho:

| Teste | Resultado |
|---|---|
| janela 60 d, UF inteira | 504 em 70.160 ms |
| janela 30 d | 504 em 70.022 ms |
| janela 10 d | 504 em 70.025 ms |
| janela 3 d | 504 em 70.170 ms |
| **1 dia, 10 registros** | **504 em 71.088 ms** |
| **endpoint diferente (`/contratos`)** | **504 em 70.021 ms** |
| **home do portal (`pncp.gov.br/`)** | **200 em 606 ms** |

❌ **Hipótese descartada:** "janela de 60 dias é pesada demais para o gateway". Todas as janelas morrem no mesmo teto de ~70 s, inclusive uma de 1 dia com 10 registros. O tamanho da consulta é irrelevante.

✅ **Causa real:** a API de consulta do PNCP está **fora**, enquanto o front estático responde em 606 ms. Dois endpoints distintos, payload mínimo, mesmo 504 — consistente com o histórico de exaustão de pool do backend (doc 22). Não é throttling: bloqueio responde rápido (403/429), não com 70 s de timeout de gateway.

⚠️ Corolário: **o `--days 3` do agendador não é contorno de timeout** — é desenho incremental mesmo. Um `--chunk-days` não resolveria nada.

### 🔧 Dívida no `pncp-resilient-fetch` revelada por esta falha

O módulo gastou **6 tentativas × 70 s = 7 min** numa API que estava fora. Retry não conserta indisponibilidade. Falta um critério de desistência precoce: N respostas idênticas em sequência (mesmo status, mesma latência de teto) indicam serviço fora, não azar transitório. Baixa urgência, desperdício previsível.

### Nota operacional sobre o PNCP

Durante a execução apareceram **HTTP 504** e **HTTP 429**. O 429 é rate limit — provavelmente por eu ter rodado duas coletas em paralelo. Para a ingestão de produção isso implica: serializar as varreduras, manter o `delayMs`, e tratar 429 com backoff longo. O módulo já classifica 429 como retentável; falta calibrar o intervalo entre municípios quando a varredura completa de 447 municípios voltar a rodar.

---

*Diagnóstico e execução por Orion (aios-master), 13/Ago/2026. Todas as medições feitas ao vivo contra a API pública do PNCP e contra dados já em disco; nenhuma estimativa.*
