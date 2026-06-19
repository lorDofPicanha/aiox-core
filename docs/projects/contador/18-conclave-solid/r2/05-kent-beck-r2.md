# Kent Beck — Rodada 2 Adversarial: a conta de carga reabriu, e dessa vez tem 4 padrinhos a mais

> **Conclave SOLID — Rodada 2 (adversarial)** · 2026-06-12
> **Revisor:** Beck (kent-beck) — XP, TDD, Tidy First, YAGNI, custo de opção
> **Mandato R2:** refutar/endereçar os outros 4; defender meus cortes; achar blind spots de R1; patch v1.1 reconciliado.
> **Lendo:** `01-uncle-bob-solid.md`, `02-fowler-evolucao.md`, `03-kleppmann-dados.md`, `04-newman-fronteiras-cupid.md` + meu `05` de R1.

---

## 0. A pergunta que ninguém da R1 fez (porque não era o mandato deles, mas é o meu)

Li as quatro análises. São boas. São, todas, **corretas no mérito técnico**. E somadas, são uma sentença de morte para o cronograma — porque cada um dos quatro chegou ao mesmo veredito ("**COM CORREÇÕES**") e despejou uma lista de patches, e **ninguém somou as quatro listas contra o calendário de 1 dev**. Uncle Bob tem 10 patches (P-UB1…P-UB10). Fowler tem 10 (F-1…F-10). Kleppmann tem 12 (K-1…K-12). Newman tem 13 (N-W1…N-W13). São **45 patches** de quatro revisores que não se falaram. Há sobreposição — vou mapeá-la — mas mesmo deduplicado sobra trabalho que ninguém orçou em semanas de teclado.

Eu sou a voz do calendário. Em R1 eu disse que a F1 especificada custa 32-45 semanas contra ~24-28 disponíveis. **A R1 dos meus colegas acabou de adicionar carga.** Minha tarefa em R2 não é discordar deles — é dizer *quais dos 45 patches entram no D0, quais são contrato-de-dados barato-agora-caro-depois (e portanto inegociáveis apesar de mim), e quais são medo disfarçado de arquitetura que a realidade do Concierge deve validar antes de virar código.*

---

## 1. Refutações nomeadas

### 1.1 Uncle Bob — o "pacote de domínio `@contador/dominio`" (P-UB6) é o patch mais caro do conclave, e o mais especulativo

Bob, seu diagnóstico do Screaming Architecture é elegante e seu achado do ciclo `core→gestao` (V3) é real e barato de consertar — sobre isso, concordo e reforço no §3. Mas P-UB6 — extrair **toda** a lógica de domínio (máquina de estados, materialidade, ato privativo, semântica da trilha, lookup de vigência) para um pacote TypeScript puro, com os triggers virando "backstop gerado/conferido contra o domínio por teste de equivalência" — é onde você, o arquiteto da limpeza, está pedindo ao dev solo para **manter duas implementações de cada invariante e um harness que prova que elas concordam**.

Pense no custo real disso para 1 dev: cada regra de transição existe em TS *e* em plpgsql, e existe um terceiro artefato (o teste de equivalência) que tem que ser mantido sincronizado com os dois. Isso é o oposto de *Once And Only Once* — é "twice, and prove it's once". Você justifica com defense-in-depth: "EU QUERO o banco recusando mutação mesmo que o app esteja comprometido". Concordo com o invariante no banco. Discordo de que a cópia no domínio precise existir **no D0, para todas as regras**.

A pergunta socrática: *qual regra de negócio o dev solo vai realmente testar mais rápido tendo uma cópia TS pura?* Resposta honesta: **uma só** — o motor de classificação `(item, base) → apontamentos[]`, que eu já disse em R1 que é função pura e candidato a TDD hoje (meu §5.1). Essa eu quero pura, e Newman concorda (N-W13, o contrato do motor). As outras — máquina de estados, hash-chain, ato privativo — são invariantes de **integridade**, não de **comportamento computacional rico**; a forma certa de testá-las é pgTAP contra um Postgres efêmero (o que Fowler já propõe em FF-3/FF-6, e eu em R1 §5.3), não uma segunda implementação em TS.

**Concessão parcial:** o **verificador independente da cadeia como CLI standalone (P-UB7)** sobrevive ao meu ataque inteiro e eu o promovo. É barato (lê eventos, recomputa hash, confere TST), é a spec executável do hash-chain, é o artefato pericial de 2031, e — crucial para mim — **é testável sem Supabase de pé**. Esse é o "pacote de domínio" que vale a pena: não o domínio inteiro, mas o pedaço que o perito vai rodar. P-UB6 reduzido a "motor puro (N-W13) + verificador CLI (P-UB7)" é YAGNI aplicado ao seu próprio patch.

### 1.2 Kleppmann — você está certo onde eu estava errado, e isso me custa um corte

Martin, você ganhou um argumento meu de R1. Eu cortei o billing (meu K-4) e o ciclo em lote (meu K-7) com a tese "campos nascem no schema, jobs esperam". Você mostrou (seu K-7, "os gêmeos de confiança divergente") que a **ausência de constraint de unicidade de negócio no apontamento** não é comportamento adiável — é **contrato de dados que fabrica o pesadelo jurídico do Heleno por construção**: retry + motor não-determinístico = dois apontamentos para o mesmo item, um aprovado e um pendente eterno. Isso não é um job que espera; é um `UNIQUE (item_id, tipo_divergencia, base_versao_id, motor_versao)` que tem que nascer com a tabela, senão a trilha grava gêmeos para sempre.

**Cedo aqui, explicitamente:** meu critério de R1 ("contrato de dados nasce no D0; comportamento espera") estava certo, mas eu **subaplicquei**. A unicidade do apontamento e o estado `superado` (seu K-7.3) são contrato de dados, não comportamento. Eles entram no meu D0. Custo: ~meio dia de DDL. Eu errei por omissão; você pegou.

Onde eu te **refuto**: seus K-3 (protocolo de restore), K-4 (hash versionado + golden hashes), K-10 (`trilha_cabeca` materializada + Merkle + particionar `nota_item`) são todos corretos, mas você os apresenta como se fossem todos "antes da migration 001". O protocolo de restore (K-3) com evento `restauracao_sistema`, salto de `seq_tenant`, replay da janela perdida e RPO contínuo é **um runbook + um tipo de evento + uma disciplina operacional** — e no C0/F1, com upload manual e 3-5 tenants, o volume de eventos perdíveis num restore é minúsculo e re-importável. O que precisa nascer no D0 é **barato**: (a) `hash_ver` na coluna (1 linha), (b) TSTs fora do banco em storage WORM (decisão de onde gravar, custa zero), (c) o tipo de evento `restauracao_sistema` no CHECK (1 linha). O **runbook operacional** e o **RPO contínuo** são F1+, gatilho = primeiro tenant com volume real ou primeiro restore. Você desenhou um protocolo de 5 passos para um sistema que ainda não tem o primeiro laudo. Concordo com o *contrato* (hash_ver, TST externo, tipo de evento); adio a *operação* (runbook, replay automatizado, RPO de minutos).

E `particionar nota_item` (seu K-10.2): **concordo sem reserva, entra no D0** — é o mesmo argumento da partição de `nota` que eu já defendi em R1 (§"o que não corto"). Migrar tabela viva para particionada é a migration mais cara que existe; a filha tem que acompanhar a mãe. Esse é contrato de dados puro.

### 1.3 Newman e Fowler — vocês dois inventaram a mesma tabela, e ela mata um dos meus cortes

Sam, seu N-W8 (`core.base_adocao` — estado de adoção de base por tenant) e Fowler, seu reparo ao monitor de NT, convergem num achado que eu **não vi em R1 e que derruba parcialmente meu corte K-9** (eu adiei o "monitor automatizado de NT" com gatilho "2+ atualizações/mês"). Vocês dois notaram que **o evento `base_referencia_atualizada` já pressupõe adoção por tenant ("por tenant: quando passou a valer") mas a tabela de estado não existe**. Newman: "evento sem estado é história sem presente."

Cedo: a **tabela** `base_adocao` é contrato de dados e entra no D0 (custa 1 tabela). O que eu mantenho cortado é o **job automatizado de monitor de NT + reanálise de impacto** — isso é comportamento, e meu gatilho de R1 (import manual com diff humano) continua de pé. A diferença entre nós é a mesma de sempre: a tabela (contrato) nasce, o job (comportamento) espera. Vocês estavam certos sobre a tabela; eu mantenho o corte do job.

Onde refuto **Fowler diretamente**: seu catálogo de **12 fitness functions (FF-1…FF-12)** é lindo e é, em espírito, exatamente o que eu prego (testabilidade como design). Mas você mesmo admite que FF-7 (reprodutibilidade do laudo via replay) e FF-8 (contract tests do provider) são "1-2 semanas somadas" — e FF-8 testa um **provider que só existe na F2**. Construir contract tests com sandbox Focus/PlugNotas **antes do Concierge validar que alguém paga** é construir o teste de uma feature que pode nunca nascer. FF-8 é YAGNI com gatilho óbvio: nasce quando o adapter de captura nasce (F2), não antes. Das suas 12, as que entram no meu D0 são FF-2 (fronteira de schema — barata, pega o ciclo do Bob), FF-6 (imutabilidade sobrevive a migration — barata, protege o moat) e FF-10 (banlist — já existe). FF-1/3 entram na F1 com o primeiro código. FF-7/8/11 esperam a peça que protegem existir. Catálogo aceito; **cronograma do catálogo, recusado**.

### 1.4 O furo de contrato de dados que eu achei em R1 — os outros endereçaram?

Sim, e melhor do que eu. Meu achado de R1 foi: "versão do motor" como string solta é insuficiente; precisa de modelo+prompt+embedding+params para reconstituir em 2031. **Os quatro convergiram nisso independentemente** — Bob (P-UB1, `ref.motor_versao` como entidade), Newman (N-W11, mesma tabela), Kleppmann (K-8, registro mínimo de proveniência computacional), Fowler (F-10, pin de modelo/prompt/embedding). Quádrupla convergência cega = isto não é opinião, é fato. **`ref.motor_versao` com anatomia entra no D0, ponto final** — é o exemplo mais puro de "contrato de dados irrecuperável": você não reconstitui em 2031 qual prompt rodou em 2027 se não gravou na hora.

E Kleppmann adicionou o enquadramento que eu só tinha tateado em R1: **re-verificação ≠ re-execução**. A camada de regras determinísticas é re-executável (e por isso é o moat); a camada RAG é gravada como artefato e *re-verificada*, nunca *re-executada* — porque o modelo de 2027 estará morto em 2031. Isso é exatamente o meu §3 de R1 ("a defensabilidade NUNCA pode depender de re-executar um modelo de terceiro"), dito com mais precisão. Convergência total. Inegociável.

---

## 2. Blind spots que NINGUÉM viu nas 5 análises de R1 (a minha inclusa)

### 2.1 🔴 O Concierge manual viola os invariantes que os 4 acabaram de exigir — e ninguém ligou os pontos

Aqui está o que me assusta, e que **nenhum dos cinco escreveu**. Nós cinco passamos R1 endurecendo a trilha: hash versionado (K-4), unicidade de evento por referente (K-6b), proveniência computacional (K-8), ato privativo só por contador-CRC (M-1/V5), escrita só por RPC (K-1). Tudo isso são **invariantes que o sistema F1 vai impor por código**.

Mas a arquitetura manda a trilha **nascer no C0, preenchida À MÃO** (doc 17 §2, "ponto crítico do C0"), no schema final. Pergunta que ninguém fez: **quando o Breno insere eventos manualmente no Concierge, qual código impõe esses invariantes?** Nenhum — porque no C0 "zero backend novo". Então:

- A análise manual grava `analise_executada` com `motor_versao = ?`. Kleppmann (K-8) e Bob (P-UB1) exigem proveniência computacional completa. Um humano com AIOS não tem `prompt_hash` nem `embedding_modelo`. Fowler (F-5/§5.1) foi o **único** que tocou nisso ("`motor_versao: 'manual-c0'`") — mas ninguém percebeu que isso **abre um buraco de proveniência na geração-0 da cadeia que é, por design, eterna e inexpurgável**.
- O ato privativo (M-1): no C0, o contador do escritório assina o laudo, mas os eventos intermediários da trilha são inseridos pelo Breno (ou por mim, AIOS). A trilha de 2026 vai conter eventos cujo `ator` é operacionalmente o fornecedor, não o contador — e essa cadeia é a que o perito lê em 2031.

**O blind spot é este: os invariantes que os 4 exigiram precisam de uma "v0 manual" que os respeite, OU a geração-0 da cadeia é mais fraca que todo o resto — para sempre.** Fowler chegou perto (sua §5.1, "o paradoxo do C0: a parte não-sacrificável nasce na fase mais improvisada") mas focou em payload_versao; o furo real é mais amplo: **TODOS os invariantes de R1 precisam de uma forma manual-mas-conforme no C0.** Isso é trabalho que ninguém orçou e que precede a migration 001.

### 2.2 🟡 O golden-set tem um dono externo, e ele é o caminho crítico real — nenhum dos 5 o tratou como dependência de cronograma

Os cinco falamos do golden-set como artefato técnico (fixture, gate, eval). **Ninguém notou que ele depende de um humano que não é o dev**: o tributarista que rotula os 200-500 itens (doc 17 Spike 2). Eu mesmo, em R1, disse "Spike 2 começa no dia 1" — mas tratei a rotulagem como se fosse teclado. Não é. É um especialista escasso, externo, provavelmente part-time, rotulando casos ambíguos da Reforma. **Se ele demora 6 semanas, o motor inteiro (que os 5 querem testável e versionado) não tem contra o que ser testado.** Esse é o gargalo de calendário que não aparece em nenhuma das 5 análises porque todos nós medimos trabalho de dev. O blind spot coletivo: **o caminho crítico do produto não é código, é rotulagem jurídica, e ela não está sequenciada.**

### 2.3 🟡 Ninguém perguntou se as 28 condições de R0 + os 45 patches de R1 têm o mesmo padrinho-sem-calendário

Eu disse em R1 que o conclave anterior "rejeitou 0 de 28 condições" = comitê, não revisão. **A R1 dos meus colegas acabou de fazer a mesma coisa em escala maior: 45 patches, 0 cortados.** Cada revisor adicionou; nenhum subtraiu (exceto eu). Newman ao menos escreveu "todas cabem numa semana" — afirmação que eu desafio abaixo. O blind spot meta: **um conclave de revisão que só adiciona patches não está revisando a carga, está acumulando rigor.** Alguém tem que ser o padrinho do calendário também na R1 — e por eliminação, sou eu.

---

## 3. Onde CONCORDO (reforço, sem repetir)

- **Ciclo `core→gestao` (Bob V3 / Newman N-W2 / Fowler):** matar `core.usuario.departamento_id`, criar `gestao.usuario_departamento`. Tripla convergência, 10 min de DDL, entra no D0. Reforço com a minha lente: é também *tidy first* — arruma o terreno antes de qualquer feature, custo zero agora, migration de dados chata em 18 meses.
- **Provider dialeto fora do core (Newman N-W4 / Fowler F-3):** `provider_meta`/`ultimo_nsu` em `ingestao.*`, enum `origem` sem `'documentize'`. Concordo e adiciono o argumento da trilha: `'documentize'` entra em **payloads imutáveis** — é o pior lugar para fossilizar um nome de marca. Isso é mais urgente que os dois deixaram claro: não é "antes da F2", é **antes do primeiro evento real do C0**.
- **`ref.motor_versao` com anatomia:** já coberto §1.4. Quádrupla convergência. D0.
- **Re-verificação ≠ re-execução (Kleppmann §5.2 / Bob §4.3 / Newman §4-Predictable):** todos convergimos. A frase do doc 17 §3.3 ("qualquer laudo re-executável contra base_versao_id") é **falsa para a camada RAG** e tem que ser corrigida no documento. Reforço: validar a formulação nova com o Heleno no Spike 6 (Bob já pediu).
- **Particionar `nota_item` (Kleppmann K-10.2):** contrato de dados, D0. Reforço em R1 já dado.

---

## 4. Patch v1.1 — a tabela de reconciliação: o que entra no D0 vs YAGNI-com-gatilho

O critério de R1 mantido e afiado pela R2: **contrato de dados (irrecuperável se não nascer agora) entra no D0; comportamento/operação/job espera o gatilho.** Reconciliei os 45 patches dos quatro + os meus 11 cortes. Deduplicado, eis o veredito do padrinho do calendário:

### 4.1 ENTRA NO D0 (contrato de dados — barato agora, irrecuperável depois)

| Patch (reconciliado) | Origem | Custo | Por que é D0 e não comportamento |
|---|---|---|---|
| `ref.motor_versao` com anatomia (modelo/prompt_hash/embedding/params) + FK em eventos | UB1·NW11·K8·F10 (4×) | ~1 dia | Proveniência computacional não se back-filla. Quádrupla convergência. |
| Corrigir frase de re-executabilidade §3.3 → re-verificação | UB4·K8·NW·Beck | 0 (doc) | Alegação falsa em doc aprovado é dívida probatória. |
| `hash_ver` na coluna + canonicalização com delimitadores + fórmula congelada v1 | K4 | ~horas | Depois do 1º evento, mudar a fórmula = v2 forçada. |
| `UNIQUE (item_id, tipo_divergencia, base_versao_id, motor_versao)` + estado `superado` | K7 | ~meio dia | **Eu cedi aqui** — fabrica gêmeos jurídicos por construção senão. |
| Unicidade parcial de evento por referente (idempotência da trilha) | K6b | ~horas | Ledger que aceita duplicata não é log de fatos. |
| Matar ciclo `core→gestao` (`departamento_id` → `gestao.usuario_departamento`) | V3·NW2·F (3×) | 10 min | Contrato estrutural; tripla convergência. |
| Provider dialeto para fora do core; `origem` sem `'documentize'` | NW4·F3 | ~horas | Nome de marca em payload imutável. |
| Particionar `nota_item` por competência (acompanha a mãe) | K10.2 | ~horas | Migrar tabela viva = migration mais cara que existe. |
| `core.base_adocao` (estado de adoção por tenant — o evento já pressupõe) | NW8·F | ~1 tabela | **Eu cedi aqui** — evento sem estado é história sem presente. |
| `competencia` ≜ derivada da chave por função no banco; `competencia_fiscal` separada; `chave_acesso` nullable + `chave_dedup` | K5·K6a | ~meio dia | Dedup fura na fronteira upload×provider senão. |
| TSTs/laudos em storage WORM fora do banco + tipo de evento `restauracao_sistema` no CHECK | K3 (parcial) | ~horas | O *contrato* do restore; a *operação* (§4.2) espera. |
| Contrato escrito do motor: fila in / RPC out / proibido INSERT direto | NW13·UB9·A8 | 1 página | Habilita TDD do motor hoje (meu §5.1) e extração futura. |
| Verificador independente da cadeia como CLI standalone | UB7 | ~dias | Spec executável + artefato pericial; testável sem Supabase. |
| **Forma manual-mas-conforme dos invariantes no C0** (blind spot §2.1): `motor_versao='manual-c0'`, payload_versao desde o 1º evento, ator correto | Beck R2 (novo) | ~1 dia | A geração-0 da cadeia é eterna; ou nasce conforme ou é fraca para sempre. |
| FF-2 (fronteira de schema), FF-6 (imutabilidade sobrevive a migration) como teste de CI | F4·UB3·NW1 | ~dias | Fronteira não-enforçada = sugestão; barata agora. |

### 4.2 YAGNI COM GATILHO DE RE-ADIÇÃO (comportamento/operação/job — espera a realidade pedir)

| Patch adiado | Origem | Gatilho objetivo de re-adição |
|---|---|---|
| Pacote de domínio TS completo + teste de equivalência trigger↔TS | UB6 | Quando ≥2 regras de negócio (além do motor) precisarem de teste unitário rápido que pgTAP não cobre bem; ou 2º dev entra |
| Protocolo de restore operacional (replay automatizado, RPO contínuo, runbook) | K3 (operação) | 1º tenant com volume real; ou 1º restore de verdade. (Contrato já no D0) |
| `trilha_cabeca` materializada + eventos de lote com Merkle root | K10.1 | p95 do fecho de fila > SLA D+1 em 2 picos; ou tenant full-capture 200 CNPJs |
| Job automatizado de monitor de NT + reanálise de impacto | K9·F·Beck-K9 | 2+ atualizações de base/mês; ou 1ª NT perdida. (Tabela `base_adocao` já no D0) |
| FF-7 (replay do laudo) | F | 1ª release do motor com RAG ligado (= K-1 do meu R1 disparou) |
| FF-8 (contract tests do provider, sandbox Focus/PlugNotas) | F·NW | 1º adapter de captura (F2). Testar feature que não nasceu = desperdício |
| FF-11 (load test do dia-5) | F | Antes do go-live F2, não antes |
| FF-12 (guardrail de COGS como teste) | F·NW | Quando a captura existir (F2) |
| Schemas `ecac`/`billing` próprios | UB4·NW10 | Quando a migration do add-on/billing nascer (já é separada no tempo) |
| `ref.ecac_servico_map` (taxonomia SERPRO na borda) | NW5 | Migration do add-on e-CAC |
| Suíte de conformidade de adapter (LSP executável) | UB8·F8 | Entregável do Spike 3 (provider), não antes |
| Crypto-shredding de PII em payload | K11 | Quando 1º campo de payload precisar de dado pessoal. (Teste anti-PII no CI entra antes — barato) |
| Meus K-1…K-11 de R1 (RAG, PAdES, EFD, billing-jobs, implantação, white-label, lote, SLA-jobs, 2º layout ERP) | Beck R1 | Gatilhos individuais já especificados no meu doc R1 §2 — todos de pé |

### 4.3 A conta, refeita com a R2

D0 da seção 4.1 ≈ **5-8 dias de DDL/doc + ~dias para o verificador CLI + 1 dia para a forma manual-conforme do C0**. Chamemos de **~2-2,5 semanas de trabalho de contrato**, antes da migration 001 ir a produção. Isso **não move** minha conta de R1 da F1 (16-20 semanas para a F1-mínima) — porque é quase tudo DDL barato e decisão de documento, exatamente a categoria que eu sempre disse que nasce no D0. O que **não** entra (seção 4.2) é o que teria estourado o cronograma: os pacotes de domínio, os protocolos operacionais, as 8 fitness functions de features futuras e a suíte de conformidade de provider.

**Veredito do padrinho do calendário:** a v1.1 reconciliada **é construível** — *se e somente se* a régua for "contrato de dados no D0, comportamento no gatilho". Se o conclave aceitar os 45 patches como "todos antes da F1" (a tentação do comitê, que Newman já flertou com "cabem numa semana"), a conta não fecha e voltamos ao 32-45 semanas de R1, agora pior.

---

## 5. Três frases para fechar

1. **Para Bob:** seu verificador CLI (P-UB7) e o contrato do motor (N-W13) são o pacote de domínio que vale ouro; o pacote de domínio *completo* com teste de equivalência (P-UB6) é "twice and prove it's once" para um dev solo — adio com gatilho.
2. **Para Kleppmann:** você me ganhou no K-7 (unicidade do apontamento é contrato, não job) e eu cedo; eu te ganho no K-3 (o *protocolo* de restore é operação, o *contrato* é uma coluna e um tipo de evento — separe-os).
3. **Para Fowler e Newman:** vocês acharam a `base_adocao` que eu não vi (cedo, entra no D0); eu achei que a geração-0 manual do C0 viola os invariantes que todos nós exigimos (blind spot, ninguém viu, entra no D0).

O Concierge ainda é o experimento que tem que falsificar metade deste documento. A diferença que a R2 faz: agora sabemos exatamente quais ~15 itens são contrato-de-dados-irrecuperável (nascem no D0, custam ~2 semanas) e quais ~13 são comportamento que o Concierge deve provar necessário antes de virar código. **Escrevam o primeiro teste do motor esta semana — ele continua pronto para ficar vermelho hoje.**

*Software development is a learning process. A R1 dos meus colegas tornou o sistema mais defensável. Meu trabalho na R2 foi garantir que ele continue construível por uma pessoa.*

— Beck. Write the test first. Always. 🟢
