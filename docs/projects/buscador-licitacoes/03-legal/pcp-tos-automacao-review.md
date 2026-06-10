# Portal de Compras Públicas (PCP) — Termos de Uso x Automação Autônoma do Noyce

**Parecer orientativo de risco — Legal Chief (AIOS)**
**Cliente:** ENIAC (CNPJ 36.819.268/0001-05 — ME, obras, GO) · **Produto:** Noyce
**Alvo:** Portal de Compras Públicas — PCP (portaldecompraspublicas.com.br) — operadora **privada** **ECUSTOMIZE Consultoria em Software S/A**, credenciada
**Data:** 2026-06-09 · **Status:** v1
**Natureza:** apoio à decisão de produto. NÃO é parecer jurídico para caso concreto. Ver disclaimer ao final.
**Comparação:** replica o framework do parecer BLL (`bll-tos-automacao-review.md`). Ver §7 para o diff.

---

## 🔴 ALERTA DE TOPO — diferença que muda o jogo vs BLL

**Ao contrário do BLL (silêncio regulamentar), o Portal de Compras Públicas TEM CLÁUSULA EXPRESSA que VEDA scraping/robôs/spider/coleta automatizada sem permissão expressa da ECUSTOMIZE.** `[CONFIRMADO por leitura do Regulamento, itens 5.3.1.1 e 5.3.1.2]`

Consequência direta: o caminho que no BLL era "defensável por ausência de proibição" aqui vira **ilícito contratual expresso** se feito por raspagem externa não autorizada. **Porém** — e isto é decisivo — o PCP **abre uma porta que o BLL não tinha**: integração **oficial via API/webservices** e **bots de lance** operando *dentro* do sistema. A automação não está proibida em bloco; está **canalizada** para o trilho autorizado. O veredito não fica mais restritivo no resultado final — fica mais **condicionado a um gate formal** (permissão/API), e o **scraping externo sai de cinza para vermelho**.

---

## 0. Diagnóstico (Tier 0)

| Eixo | Leitura |
|------|---------|
| **Área** | Direito administrativo (Lei 14.133/2021 + INs SEGES) + Direito digital (regulamento privado de adesão, LGPD) + responsabilidade civil (CC arts. 186, 187, 927, 944, invocados pelo próprio regulamento) |
| **Urgência** | Pré-build. Decisão de arquitetura ANTES de codar scraping ou login automatizado. Aqui a urgência é MAIOR que no BLL: existe vedação textual que, se ignorada, gera ilícito + bloqueio. |
| **Exposição** | **Assimétrica por nível, com um agravante:** o método de coleta (raspagem externa vs API) virou variável jurídica de primeira ordem. Ler público ≈ baixa. **Raspar área/estrutura sem permissão ≈ ilícito contratual expresso (média→alta)**. Atuar (lance/declaração) ≈ responsabilidade direta da ENIAC. |
| **Contexto** | ME real, certames reais, CNPJ exposto. Operadora **ECUSTOMIZE** sustenta o portal por "taxa de ressarcimento de tecnologia" — tem interesse econômico em controlar carga e integrações, o que explica a cláusula anti-scraping. |

**Distinção estrutural que governa o parecer:** igual ao BLL, o PCP **não é dado aberto** — é operadora privada regida por **regulamento contratual de adesão**, que prevalece como lei privada entre as partes desde que não contrarie a lei. **Diferente do BLL**, esse regulamento **exerceu** seu poder de vedar automação não autorizada. O que prevalece, portanto, é: (regulamento PCP) + (regra do edital de cada certame) + (INs SEGES + jurisprudência TCU sobre lance).

---

## 1. Termos de Uso / Regulamento do PCP — leitura real (fonte primária)

**Documento analisado:** *Regulamento do Portal de Compras Públicas* (operadora ECUSTOMIZE), versão do licitante publicada em `portaldecompraspublicas.com.br/regulamento` e `/regulamento/brb`. O original retornou *too many redirects*/403 ao WebFetch direto; o conteúdo das cláusulas foi extraído via leitura assistida da página oficial e confirmado de forma cruzada por múltiplas fontes (Biblioteca PCP/Zendesk, conlicitacao, effecti). Numeração de itens (5.2, 5.3.1.1, 5.3.1.2, 6.7.2.1) conforme retornado da página oficial. `[CONFIRMADO quanto ao conteúdo; numeração exata sujeita a conferência final no PDF oficial — marcada onde aplicável]`

### Achado central — VEDAÇÃO EXPRESSA a robô/scraping (o oposto do BLL)

**O Regulamento PCP contém cláusula expressa proibindo coleta automatizada não autorizada.** `[CONFIRMADO]`

> **Item 5.3.1.1 (mau uso):** é considerado mau uso *"coletar informações de modo automatizado sem permissão expressa da ECUSTOMIZE"*.

> **Item 5.3.1.2 (métodos vedados):** o usuário não pode utilizar *"'deep-link', 'page-scrape', 'robôs', 'spider' ou outro dispositivo automático, programa, algoritmo ou metodologia"* para *"recuperar, indexar, fazer scraping, garimpar dados, acessar, adquirir, copiar, monitorar ou reproduzir a estrutura de navegação ou apresentação do Portal"*.

**Definições do glossário (citadas):** `[CONFIRMADO]`
- *"deep-link"* — links que apontam para conteúdo web dentro de/entre aplicações;
- *"page-scrape"* — técnica de extração de dados para coletar dados de sites por processos automatizados (bot crawlers);
- *"robôs"* — sistema autônomo que realiza buscas nas páginas do portal e pode estabelecer **inúmeras conexões simultâneas** para realizar operações;
- *"spider"* — também conhecido como Robot, Bot ou Crawler.

**Leitura jurídica:** esta é a divergência estrutural com o BLL. Lá, o silêncio fazia o regime ser de *responsabilidade*; aqui há **vedação textual** de raspagem/robô **não autorizado**. Mas duas palavras salvam o caso: **"sem permissão expressa"** (5.3.1.1) e **"da ECUSTOMIZE"**. A proibição **não é absoluta** — é proibição de automação **não autorizada**. Existe, por construção do próprio texto, um caminho de licitude: **obter a permissão expressa / usar a integração oficial**.

### O outro lado da mesma cláusula — automação AUTORIZADA é admitida

> O portal **aceita integração via API e webservices**; ferramentas de automação para licitações (incl. **bots de pregão/lance**) podem monitorar oportunidades e participar de disputas de forma automatizada **pelo trilho autorizado**. `[CONFIRMADO por fonte secundária especializada — effecti; INFERÊNCIA quanto a constar do regulamento, item não localizado textualmente]`

**Leitura:** o PCP não é hostil à automação — é hostil à **automação externa parasitária** (que onera o sistema e copia sua estrutura). Ele **canaliza** a automação legítima para API/webservices/integração homologada. Isso é coerente com o modelo de negócio (ECUSTOMIZE cobra ressarcimento de tecnologia) e com o mercado consolidado de bots de lance que operam nesses portais.

### Cláusulas de acesso público de leitura

> **Item 5.2 (acesso público):** funções gerais disponíveis **sem cadastro/login** — *"consulta de processos, possibilidade de pedidos de esclarecimentos e impugnações"*. `[CONFIRMADO]`
> Fonte secundária especializada confirma: *"Qualquer interessado pode pesquisar processos (...) sem necessidade de cadastro"* e **baixar a íntegra do edital** pela seção "Processos" com filtros de busca. `[CONFIRMADO — conlicitacao]`

**Leitura:** consultar processos e baixar a íntegra do edital são **funções públicas, sem login**. Base favorável para o nível LER — **MAS atenção:** "consulta pública permitida" (5.2) **não** revoga "scraping vedado" (5.3.1.2). A leitura **manual/pontual** é livre; a **coleta automatizada em massa dessa mesma área pública** cai na vedação de 5.3.1.2 se feita por robô/scraper sem permissão. Esta é a diferença mais fina e mais importante vs BLL (lá, scraping de área pública era "defensável"; aqui é textualmente vedado mesmo na área pública). `[INFERÊNCIA — leitura sistemática dos itens 5.2 + 5.3.1.2]`

### Senha pessoal e responsabilidade do licitante

> **(senha):** *"o usuário e seus representantes legais responsabilizam-se pela utilização correta da senha em todas as transações efetuadas no sistema, não cabendo à ECUSTOMIZE a responsabilidade por eventuais danos decorrentes do uso indevido da senha, inclusive por terceiros."* `[CONFIRMADO]`

> **(responsabilidade transacional):** *"o processo de transferência do bem negociado ou prestação do serviço é de inteira e absoluta responsabilidade do licitador e do usuário, não cabendo à ECUSTOMIZE qualquer participação ou responsabilidade."* `[CONFIRMADO]`

**Leitura:** simetria total com o BLL (Art. 14 + Art. 13 §3 + Art. 27 lá). Todo ato sob a senha da ENIAC é **da ENIAC**, e a ECUSTOMIZE se exime de qualquer dano por uso indevido. O robô que loga com a credencial da ENIAC opera **sob senha pessoal** e **desloca todo o risco operacional ao titular**. "Foi o robô" não é defesa.

### Penalidades / enforcement

> **Item 6.7.2.1 (bloqueio):** havendo irregularidade, a ECUSTOMIZE **notifica previamente** sobre a possibilidade de bloqueio de ferramentas e serviços; **persistindo a irregularidade**, ocorre **bloqueio imediato do acesso ao Sistema, sem qualquer responsabilização da ECUSTOMIZE** por prejuízos sofridos. `[CONFIRMADO]`

> **(responsabilidade civil por automação lesiva):** considera-se **ato ilícito** o mau uso do sistema ou a **utilização de automação externa que cause impactos negativos** ao Portal, ficando o responsável obrigado a **repará-lo** conforme os **arts. 186, 187, 927 e 944 do Código Civil**. `[CONFIRMADO]`

**Leitura — este é o coração do diff:** o PCP tem um instrumento que o BLL **não** explicitava: **bloqueio do acesso por automação irregular**, precedido de notificação. E mais — ele **qualifica a automação externa lesiva como ATO ILÍCITO CIVIL** (CC 186/187 = ato ilícito; 927 = dever de reparar; 944 = extensão do dano). Ou seja: raspagem externa não autorizada que onere o portal pode gerar **(i) bloqueio do acesso da ENIAC** e **(ii) dever de indenizar a ECUSTOMIZE**. Diferente do BLL, onde a penalidade ancorava só em declaração falsa/documentação (Art. 32), aqui há **gatilho de penalidade especificamente para automação**.

### Política de Privacidade / LGPD

> A ECUSTOMIZE declara conformidade com a **LGPD (Lei 13.709/2018)** e coleta/uso responsável de dados. `[CONFIRMADO por busca; texto integral não lido]`

**Leitura:** mesmo regime do BLL — credenciais e dados de terceiros (pregoeiros/concorrentes) atraem LGPD. Ver §4.

---

## 2. LER × COLETAR × ATUAR — os três níveis (recalibrados pela vedação expressa)

A mesma estrutura do BLL, mas o **método** agora pesa juridicamente.

### (a) MONITORAR / LER — consulta de editais e dados de certame
- **O que é:** Noyce consulta processos, lê editais, baixa a íntegra, acompanha sessões.
- **Base favorável:** Item 5.2 autoriza consulta pública **sem login**, incluindo download do edital.
- **🔴 Limite NOVO vs BLL:** a *leitura manual/pontual* é livre; a **coleta automatizada/scraping em massa** dessa área pública **é vedada por 5.3.1.2 sem permissão expressa**. O risco não é mais só "onerar o sistema" — é **violação contratual textual**.
- **Risco:** **BAIXO se manual/respeitando carga; MÉDIO→ALTO se for scraping sistemático sem permissão.** A diferença é o *modus*. `[INFERÊNCIA — leitura sistemática]`
- **Mitigação que vira pré-condição:** preferir **API oficial / integração homologada**; se acesso for via página, manter padrão humano (rate-limit agressivo, sem conexões simultâneas em massa, sem reproduzir estrutura), e **pedir permissão expressa** à ECUSTOMIZE.

### (b) COLETAR / BAIXAR EM MASSA — download autenticado/sistemático em volume
- **O que é:** Noyce, logado como ENIAC, baixa documentos do certame em volume/sistemático.
- **Risco:** **MÉDIO→ALTO (contratual EXPRESSO + civil + LGPD).** Agora há texto: 5.3.1.2 (vedação de copiar/monitorar/reproduzir) + ato ilícito civil (CC 186/187/927/944) + bloqueio (6.7.2.1). Opera sob senha pessoal (risco no titular).
- **Mitigação:** **só pelo trilho autorizado** (API) ou com **permissão expressa**; coletar só o necessário ao certame da ENIAC; rate-limit; nada de varredura de massa de terceiros (LGPD).

### (c) ATUAR — proposta, lance, declaração, impugnação, recurso automatizados
- **Risco:** **idêntico ao BLL — recai sobre a ENIAC, não sobre o Noyce.** A senha é pessoal; o ato é "da ENIAC"; é irretratável perante a Administração.
  - **Lance automatizado:** é o nível menos arriscado *dentro* do atuar, **E aqui o PCP é até mais favorável que o BLL**, porque admite **bots de lance via integração autorizada** (effecti). Disciplinado por IN 67/2021, IN 73/2022 art. 19 e TCU Ac. 2071/2025.
  - **Declaração/proposta/recurso automatizados sem humano:** zona de risco grave (fé pública, irretratabilidade, eventual declaração falsa → criminal sob Lei 14.133 arts. 337-E e ss.). Igual ao BLL.

**Calibragem honesta:** a vedação do PCP **não** proíbe dar lance automatizado pelo canal certo. Ela proíbe **raspagem externa parasitária**. Logo, o impacto da cláusula recai mais pesado em **(a)/(b) feitos por scraping** do que em **(c)-lance feito via API**.

---

## 3. Lei 14.133/2021 + marco legal — lance automatizado segue disciplinado e admitido

Vale integralmente o que foi assentado no parecer BLL (não repito em extenso):

- **IN SEGES/ME 67/2021** (dispensa eletrônica) e **IN SEGES/ME 73/2022, art. 19** (pregão/concorrência): **lance automático nativo** — fornecedor parametriza **valor mínimo final** (sigiloso) e **intervalo mínimo**; o sistema envia os lances automaticamente. `[CONFIRMADO]`
- **TCU:** restritivos antigos (**Ac. 2601/2011**, **Ac. 1216/2014**) superados pela virada do **Acórdão 2071/2025, 1ª Câmara** — *"inexistência de vícios quanto a suposta utilização de robôs"*. Limite: respeitar intervalo/valor mínimos, **não burlar regras do sistema**, **não violar cláusula do edital**, **não fraudar o caráter competitivo** (Lei 14.133, art. 155, III; tipos penais arts. 337-F e ss.). `[CONFIRMADO]`
- **Responsabilidade permanece do licitante** — dever de monitorar a sessão e convocações do pregoeiro.

**Especificidade PCP:** como o portal **canaliza bots via integração autorizada**, a linha "cumprir o regulamento do sistema" ganha um requisito a mais que no BLL: **usar o canal homologado**. Um bot externo que opere a interface do PCP por scraping, ainda que respeite intervalo/valor, **viola 5.3.1.2** — diferentemente do plano federal/TCU, que olha a isonomia do lance, não o método de conexão. São dois filtros independentes: (i) regra de disputa (TCU/IN) **e** (ii) regra de acesso do portal privado (5.3.1.2).

### Voz dos especialistas (mind clones — Voice DNA real)

**Marçal Justen Filho** — princípio nuclear aplicável: *"Vinculação ao edital — o instrumento convocatório é a lei interna da licitação"* e *"maior autonomia implica maior responsabilidade"*. Transposto ao PCP: o regulamento de adesão é a lei interna da relação ENIAC↔ECUSTOMIZE; havendo cláusula expressa (5.3.1.2), **não há a escusa de "ausência de proibição"** que existia no BLL. Quem delega a um sistema a coleta/atuação **assume integralmente** — inclusive o dever de reparar (CC 927/944) que o próprio regulamento invoca. Recomendação metodológica: **trilho autorizado para coletar/atuar; juízo humano para declarar/recorrer**.

**Joel de Menezes Niebuhr** — prática do pregão: deixe o robô **vigiar o relógio e disputar o preço** (fase mecânica, com regra clara de intervalo/valor); a **intenção de recurso** tem momento certo (preclui) e pode ter o *registro* automatizado, mas as **razões do recurso são peça jurídica, não clique**. Vale igual ao BLL — e, no PCP, com a ressalva de que até o "vigiar o relógio" por scraping de página pública precisa respeitar 5.3.1.2 (preferir API/notificação oficial).

---

## 4. LGPD — onde há dado pessoal (igual ao BLL)

| Dado | Pessoal? | Cuidado |
|------|----------|---------|
| Credenciais login/senha ENIAC | Sim (do representante) | **Vault cifrado**, nunca em log/repo. Cláusula da senha joga risco no titular. |
| Editais, valores, objeto | Não | Sem restrição LGPD (mas restrição contratual 5.3.1.2 sobre o *método* de coleta permanece). |
| Nome/CPF de pregoeiros, concorrentes, sócios | **Sim** | Coleta em massa exige base legal (LGPD art. 7º) + minimização (art. 6º, III). Interesse legítimo arguível só para *o certame da ENIAC*, não para base própria. |

**Combinação venenosa específica do PCP:** raspar dados pessoais públicos de terceiros junta **(i) violação de 5.3.1.2** + **(ii) ausência de base legal LGPD** + **(iii) ato ilícito civil (CC 186)**. Tripla exposição. **NÃO fazer.**

---

## 5. VEREDITO ACIONÁVEL — calibrado pela política do cliente (máquina ~95%, humano dá o clique vinculante)

| # | Capacidade do Noyce no PCP | Veredito | Condição |
|---|----------------------------|----------|----------|
| **PODE SOZINHO (baixo risco)** | | | |
| 1 | Consultar/ler editais e processos, acompanhar certame, baixar **íntegra do edital** — de forma **pontual/manual-like** | **PODE** | Item 5.2 (acesso público sem login). **Sem padrão de scraping em massa.** |
| 2 | Analisar / triar / habilitação / **rascunhar** proposta, declarações e recurso (processamento interno) | **PODE** | É interno, não toca o PCP no ato. 100% alinhado à política (preparar ≠ enviar). |
| 3 | Alertar a ENIAC sobre prazos, sessão, intenção-de-recurso a vencer | **PODE** | Vigia o relógio; humano decide. |
| **PODE COM MITIGAÇÃO (médio risco — gate de método)** | | | |
| 4 | **Descobrir/monitorar editais de forma automatizada** (o coração do Noyce) | **PODE C/ MITIGAÇÃO FORTE** | 🔴 **5.3.1.2 veda scraping sem permissão.** Trilho: **(a) API/webservices oficial** OU **(b) permissão expressa da ECUSTOMIZE** OU **(c) coletar do PNCP/dado-aberto** em vez de raspar o PCP. Sem isso = ilícito contratual. |
| 5 | Login autenticado para **leitura** de área restrita da própria ENIAC | **PODE C/ MITIGAÇÃO** | Vault; rate-limit; sob senha pessoal (risco no titular); sem reproduzir estrutura (5.3.1.2). |
| 6 | Download autenticado de documentos do **certame da ENIAC** | **PODE C/ MITIGAÇÃO** | Só o necessário; via API se houver; sem varredura de massa de terceiros (LGPD + 5.3.1.2). |
| 7 | **Preparar/parametrizar lance** e, no clique humano, **executar lance automatizado** | **PODE C/ MITIGAÇÃO FORTE** | Respeitar **intervalo + valor mínimo** (IN 67/73) definidos por **humano da ENIAC**; **canal de bot autorizado** (não scraping de interface); ler edital do certame (alguns vedam robô); **humano monitora sessão**. PCP admite bot de lance via integração. |
| 8 | **Registrar a intenção de recurso** (só o registro, no momento) | **PODE C/ MITIGAÇÃO** | Evita preclusão. Decisão de recorrer + razões = humanas. |
| **NÃO DEVE / HUMANO CONFIRMA O CLIQUE (alto risco — act-side vinculante)** | | | |
| 9 | **Dar o LANCE** (decisão expressa de comprometer preço) | **HUMANO CONFIRMA** | Política do cliente: o clique vinculante é humano. Ato "da ENIAC", irretratável. Máquina prepara/sugere; humano dispara. |
| 10 | **Enviar declarações** (ME/EPP, habilitação, inexistência de fato impeditivo) | **HUMANO CONFIRMA** | Fé pública; declaração falsa → suspensão + **criminal** (Lei 14.133). Máquina **rascunha**; humano confere e envia. |
| 11 | **Enviar proposta final/assinada** | **HUMANO CONFIRMA** | Vinculação irretratável; não pode alegar desconhecimento do edital. Máquina monta; humano aprova e envia. |
| 12 | **Protocolar impugnação/recurso** | **HUMANO CONFIRMA** | Peça jurídica (juízo de admissibilidade/mérito — Niebuhr). Máquina **rascunha**; humano protocola. |
| **PROIBIDO POR DESIGN (nunca liberam)** | | | |
| 13 | **Scraping externo não autorizado** do PCP (estrutura/área/conteúdo) | **NÃO — ilícito expresso** | 🔴 5.3.1.2 + ato ilícito civil (CC 186/187/927/944) + bloqueio (6.7.2.1). **Esta é a diferença dura vs BLL.** Só liberar via API/permissão. |
| 14 | Raspagem em massa de **dados pessoais** de pregoeiros/concorrentes para base própria | **NÃO** | LGPD (sem base/minimização) + 5.3.1.2 + ato ilícito. Tripla exposição. |
| 15 | Automação que **burle intervalo mínimo** de lance ou regra do sistema | **NÃO** | Fraude ao caráter competitivo (Lei 14.133 art. 155, III; tipos penais). |

### Resumo de uma linha
**No PCP, o Noyce pode descobrir/ler/analisar/rascunhar tudo — MAS a coleta automatizada precisa ir pelo trilho autorizado (API ou permissão expressa), nunca por scraping externo (que aqui é ilícito textual); o lance é semiautônomo com clique humano; declarar/propor/recorrer a máquina prepara e o humano confirma.** A política do cliente (humano dá o clique vinculante) encaixa perfeitamente — e a única exigência **extra** vs BLL é resolver o **método de coleta** antes de ligar o monitoramento.

---

## 6. Caminho de conformidade (gatilho `blocked_until_vault` → `allowedNow`)

Aqui o PCP exige **dois gates**, não um: **vault** (técnico/LGPD) **E** **trilho de coleta autorizado** (contratual, por causa de 5.3.1.2).

1. **API/webservices oficial — EXISTE e é o caminho-rei.** `[CONFIRMADO que o portal aceita integração via API/webservices — effecti; NÃO CONFIRMADO o link/termos da doc oficial]`. **Ação imediata:** contatar a ECUSTOMIZE (central de atendimento/e-mail do portal) e perguntar formalmente: (a) doc de API/webservices para parceiros/licitantes? (b) programa de integração homologada / bot de lance? (c) termos e limites de requisições? **Este contato é mais urgente que no BLL**, porque substitui o scraping vedado por um canal lícito.

2. **Permissão expressa de coleta automatizada.** O próprio 5.3.1.1 condiciona a licitude à *"permissão expressa da ECUSTOMIZE"*. Solicitação escrita descrevendo o Noyce como ferramenta da própria ENIAC. **Resposta favorável converte os itens 4–6 de "ilícito potencial" para "permitido com lastro documental".** Guardar a resposta = prova de boa-fé e de licitude.

3. **Alternativa que dispensa o gate contratual: coletar do PNCP, não do PCP.** Como o PNCP é **dado aberto** (Lei 14.133 art. 174), grande parte da descoberta/monitoramento pode ser feita **sem tocar a área do PCP**, eliminando o risco de 5.3.1.2. **Recomendação de arquitetura:** *descoberta via PNCP/dado aberto; ação autenticada via PCP (API/login) só no certame específico da ENIAC.* Isto é provavelmente a mitigação mais limpa e barata.

4. **Ler o edital de CADA certame** antes de atuar — alguns vedam robô; aí o edital prevalece (vinculação ao edital).

5. **Vault de credenciais** cifrado, fora de repo/log — pré-condição técnica e LGPD. **É literalmente o `blocked_until_vault`.**

6. **Rate-limit + sem conexões simultâneas em massa + sem reprodução de estrutura** — alinha com a própria definição de "robôs"/"page-scrape" do 5.3.1.2 e reduz risco de bloqueio (6.7.2.1) e de ato ilícito (CC 186).

7. **Humano-no-loop nos atos vinculantes** (itens 9–12) — gate de produto, conforme política do cliente.

### Quando `blocked_until_vault` → `allowedNow`
- **Itens 1–3 (ler pontual / analisar / rascunhar / alertar):** `allowedNow` — não dependem do vault. **Liberar já.** *(Ressalva: "ler" em escala de scraping NÃO está aqui — está no item 4.)*
- **Item 4 (descoberta/monitoramento automatizado):** vira `allowedNow` **quando** houver **API oficial OU permissão expressa da ECUSTOMIZE OU rota via PNCP**. **Sem um desses três, fica bloqueado por design — não por falta de vault.** Esta é a trava nova vs BLL.
- **Itens 5–8 (autenticado/lance):** `allowedNow` **quando** vault **E** (API/permissão **OU** ausência de vedação no edital do certame) **E** parâmetros definidos por humano.
- **Itens 9–12 (act-side vinculante):** **humano confirma o clique** — gate permanente de produto (política do cliente).
- **Itens 13–15:** **bloqueados por design**, nunca liberam (scraping não autorizado, raspagem de dado pessoal, burla de regra).

---

## 7. Comparação com o BLL — mais ou menos permissivo?

| Eixo | BLL | PCP (Portal de Compras Públicas) | Quem é mais permissivo |
|------|-----|----------------------------------|------------------------|
| **Cláusula sobre robô/scraping** | **Silêncio** (nenhuma vedação textual) | 🔴 **Vedação EXPRESSA** (5.3.1.2): deep-link/page-scrape/robôs/spider para coletar/copiar/monitorar/reproduzir, **sem permissão expressa** | **BLL** (silêncio é menos restritivo que vedação) |
| **Acesso público de leitura** | Permitido (Art. 5º/9º) — consulta + download do edital | Permitido (5.2) — consulta + download do edital sem login | **Empate** |
| **Scraping de área pública** | Defensável (ausência de proibição) | **Vedado por 5.3.1.2 mesmo na área pública** | **BLL** |
| **API/integração oficial** | Não confirmada; mercado de bots terceiros tolerado de fato | **Aceita API/webservices e bots de lance** (canal autorizado existe) | **PCP** (oferece trilho lícito explícito) |
| **Penalidade por automação** | Não prevista (penalidades só p/ declaração falsa, Art. 32) | 🔴 **Bloqueio do acesso (6.7.2.1) + ato ilícito civil (CC 186/187/927/944)** | **BLL** (PCP tem gatilho específico de punição p/ automação) |
| **Senha pessoal / responsabilidade do licitante** | Art. 14 + 13 §3 + 27 (total, irretratável) | Cláusula equivalente (responsabilidade integral pela senha e transações) | **Empate** |
| **Lance automatizado** | Disciplinado (IN/TCU); robôs de terceiros tolerados | Disciplinado (IN/TCU) **+ admite bot de lance via integração** | **PCP ligeiramente** |
| **LGPD** | Conformidade declarada | Conformidade declarada (ECUSTOMIZE) | **Empate** |

### Veredito comparativo
- **Para SCRAPING/DESCOBERTA externa: o PCP é MAIS RESTRITIVO** — sai do "defensável" (BLL) para "ilícito contratual expresso + ato ilícito civil + bloqueio". 🔴 **É a diferença que muda o veredito do método de coleta.**
- **Para LANCE/ATUAÇÃO via canal autorizado: o PCP é IGUAL ou LIGEIRAMENTE MAIS PERMISSIVO** — porque oferece **API/webservices e bot de lance homologados**, um trilho lícito explícito que o BLL não documenta.
- **Síntese:** o PCP **não fecha a porta da automação — ele troca a fechadura.** No BLL você entrava pela ausência de tranca; no PCP você precisa da **chave** (API/permissão expressa) ou usa **outra porta** (PNCP/dado aberto). Com o gate resolvido, o nível de autonomia entregável ao cliente é **o mesmo** dos dois portais; sem o gate, o PCP é nitidamente mais arriscado.

---

## Apêndice — Fontes (reais, citadas)

- **Regulamento Portal de Compras Públicas** (ECUSTOMIZE) — fonte primária: `https://www.portaldecompraspublicas.com.br/regulamento` e `https://www.portaldecompraspublicas.com.br/regulamento/brb` (original deu redirect-loop/403 no WebFetch; conteúdo lido via página oficial + confirmação cruzada). Itens citados: 5.2, 5.3.1.1, 5.3.1.2, 6.7.2.1 + glossário (deep-link/page-scrape/robôs/spider). `[CONFIRMADO conteúdo; numeração sujeita a conferência final no PDF]`
- **Biblioteca de Dados PCP / Zendesk** (Regulamento): `https://bibliotecapcp.zendesk.com/hc/pt-br/articles/4583122508186` (403 ao fetch; citado em busca).
- **conlicitacao** — acesso público sem cadastro + download da íntegra + custo (taxa de ressarcimento de tecnologia, ECUSTOMIZE): `https://conlicitacao.com.br/portal-de-compras-publicas-o-que-e-e-como-participar/`. `[CONFIRMADO]`
- **effecti** — portal aceita integração via API/webservices e bots de lance; perfis de usuário incluem "sistemas automatizados": `https://effecti.com.br/o-portal-de-compras-publicas/`. `[CONFIRMADO p/ API; INFERÊNCIA quanto a constar do regulamento]`
- **Contrato ECUSTOMIZE / município** (evidência da operadora e modelo): `https://camposnovos.sc.gov.br/uploads/sites/405/2026/03/CONTRATO-N-75-2026-ECUSTOMIZE-CONSULTORIA-EM-SOFTWARE-S.A-PORTAL-DE-COMPRAS-PUBLICAS.pdf`.
- **IN SEGES/ME 67/2021** (lance automático na dispensa); **IN SEGES/ME 73/2022, art. 19** (lance automático no pregão/concorrência). `[CONFIRMADO]`
- **TCU:** Ac. 2601/2011 e 1216/2014 (restritivos); **Ac. 2071/2025, 1ª Câmara** (sem vícios em robô). `[CONFIRMADO]`
- **Lei 14.133/2021:** art. 155 (sanções); arts. 337-E e ss. (tipos penais); art. 174 (PNCP/dado aberto).
- **Código Civil:** arts. 186, 187 (ato ilícito), 927 (dever de reparar), 944 (extensão do dano) — **invocados pelo próprio regulamento PCP**.
- **Comparativo base:** `bll-tos-automacao-review.md` (parecer BLL v1, 2026-06-09).

**Marcação de confiança:** `[CONFIRMADO]` = lido/confirmado em fonte primária ou cruzado em ≥2 fontes. `[INFERÊNCIA]` = raciocínio jurídico do parecer. `[NÃO CONFIRMADO]` = não verificado em fonte (ex.: doc oficial da API; numeração exata de item no PDF).

---

⚠️ Esta análise é orientativa e não substitui consulta com advogado.
Para questões específicas, consulte um profissional habilitado. Em especial, recomenda-se **conferência da numeração exata das cláusulas no PDF oficial do Regulamento** e **consulta formal à ECUSTOMIZE sobre API/permissão de integração** antes de ligar qualquer coleta automatizada.
