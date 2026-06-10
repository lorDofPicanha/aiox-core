# BLL — Termos de Uso x Automação Autônoma do Noyce

**Parecer orientativo de risco — Legal Chief (AIOS)**
**Cliente:** ENIAC (CNPJ 36.819.268/0001-05 — ME, obras, GO) · **Produto:** Noyce
**Alvo:** BLL — Bolsa de Licitações e Leilões (bllcompras.com / bll.org.br) — operadora **privada** credenciada
**Data:** 2026-06-09 · **Status:** v1
**Natureza:** apoio à decisão de produto. NÃO é parecer jurídico para caso concreto. Ver disclaimer ao final.

---

## 0. Diagnóstico (Tier 0)

| Eixo | Leitura |
|------|---------|
| **Área** | Direito administrativo (Lei 14.133/2021 + INs SEGES) + Direito digital (ToS/regulamento privado, LGPD) |
| **Urgência** | Pré-build. Decisão de arquitetura ANTES de codar qualquer login automatizado. Correto travar agora. |
| **Exposição** | **Assimétrica por nível.** Ler ≈ baixa. Coletar em massa ≈ média (contratual). **Atuar** ≈ a que tem responsabilidade legal direta do licitante (ENIAC), não do Noyce. |
| **Contexto** | ME real disputando certames reais. O risco não é abstrato: recai sobre o CNPJ da ENIAC, sua reputação e seu acesso à plataforma. |

**Distinção estrutural que governa todo o parecer:** o BLL **não é dado aberto**. Diferente do PNCP (Lei 14.133 art. 174; dados públicos), o BLL é **operadora privada** cujo acesso é regido por **regulamento contratual de adesão** (Termo de Adesão, Anexo II). Aqui, **o regulamento da operadora prevalece** como lei privada entre as partes — desde que não contrarie a lei. Não há direito legal de acesso *automatizado* à plataforma privada; há, no máximo, direito de *participar do certame* uma vez credenciado.

---

## 1. Termos de Uso do BLL — leitura real (fonte primária)

**Documento analisado:** *Regulamento do Sistema Eletrônico de Licitações — BLL 2024* (PDF oficial, extraído na íntegra via cópia-espelho hospedada por órgão público — Prefeitura de Guapirama/PR — porque o original em `bll.org.br` retornou 403). Texto idêntico ao publicado pela BLL. 525 linhas, 34 artigos + Anexos I–III.

### Achado central — silêncio regulamentar sobre robôs/scraping

**O Regulamento BLL 2024 NÃO contém cláusula expressa** sobre: robôs, bots, scraping, raspagem, mineração de dados, API, limite de requisições, ou vedação de coleta automatizada. Busquei termo a termo (`autom`, `robô`, `scrap`, `rasp`, `coleta`, `API`, `integra`, `extrair`, `minera`, `área restrita`, `interferir`, `invadir`, `segurança`). **Não existe vedação textual.** `[CONFIRMADO por leitura integral do PDF]`

Isso é uma faca de dois gumes: não há proibição expressa a invocar contra o Noyce, **mas também não há autorização** — e o que governa passa a ser o regime de **responsabilidade** e de **uso conforme**, abaixo.

### Cláusulas que efetivamente governam a automação (citadas textualmente)

**(a) O Sistema é, ele próprio, "automatização" — mas automatização DE USUÁRIOS legítimos.**
> **Art. 4º** "A automatização a que se refere o artigo 2º se dá pela utilização do Sistema **pelos usuários representantes das instituições envolvidas** (...) sendo que esta utilização deve estar **em conformidade com as disposições deste Regulamento**."

Leitura: a automação prevista é a do *próprio sistema operado por um representante humano*. O regulamento pressupõe um **usuário representante** por trás dos atos — não veda terceirizar a operação a software, mas tampouco a contempla.

**(b) Acesso público de leitura é expressamente permitido.**
> **Art. 5º** "O Sistema é operado via Internet, **permitindo aos interessados acompanhar os certames em tempo real, fazer consultas a editais e a resultados** de licitações realizadas (...)."
> **Art. 9º** "No **acesso público** do Sistema são divulgadas as principais informações do edital, assim como é disponibilizada a **íntegra do mesmo para download**."

Leitura: consultar editais, acompanhar certame e baixar a íntegra do edital são **funções públicas e expressamente autorizadas**. Forte base para o nível (a) — ler/monitorar. `[CONFIRMADO]`

**(c) Senha pessoal e intransferível — núcleo do risco de automação autenticada.**
> **Definição XV** "Senha: código numérico secreto – **pessoal e intransferível**, cadastrado pelo usuário (...)."
> **Art. 14** "A senha para acesso ao Sistema deve ser cadastrada ou personalizada pelo próprio usuário, sendo de **uso pessoal e intransferível** de seu titular, **não cabendo à BLL COMPRAS nenhuma responsabilidade** por eventuais danos ou prejuízos decorrentes de compartilhamento com outra pessoa ou **uso indevido**."

Leitura: esta é a cláusula mais sensível. Um robô que loga com a credencial da ENIAC opera *sob* a senha pessoal de um usuário humano. Isso não é "transferir" a senha a um terceiro (o Noyce é ferramenta da própria ENIAC), mas desloca **todo o risco operacional para o titular** — a BLL se exime de qualquer dano por "uso indevido".

**(d) Responsabilidade integral do licitante por TODA ação no Sistema.**
> **Art. 13, §3º** "O licitante será **responsável por todas as propostas, ofertas de lances ou quaisquer ações** efetuadas no Sistema por seus usuários representantes, **assumindo-as como firmes e verdadeiras**."
> **Art. 27** "As pessoas e instituições as quais representarem são **responsáveis pelo uso indevido de suas senhas** (...) e pelas **ações efetuadas por si mesmos ou por qualquer outra pessoa** que tenha utilizado seu usuário correspondente."

Leitura: **esta dupla é o coração do parecer.** Qualquer lance, proposta ou declaração disparada pelo Noyce é, perante a BLL e perante a Administração, ato **da ENIAC, firme e verdadeiro, irretratável**. Não há "foi o robô que errou". A responsabilidade é objetiva e total. `[CONFIRMADO]`

**(e) Credenciamento presume capacidade e adesão irrestrita ao edital.**
> **Art. 13** "O credenciamento do licitante perante a BLL COMPRAS implicará em sua **responsabilidade legal** e na **presunção de sua capacidade técnica e operacional** (...)."
> **Art. 13, §1º** "(...) não podendo, em nenhum momento de sua participação, **alegar desconhecer as disposições dos editais** ou delas discordar."

Leitura: relevante para o nível (c). Se o Noyce envia proposta sem que um humano tenha lido o edital específico, a ENIAC **não pode depois alegar desconhecimento** — ela se vinculou.

**(f) Penalidades — o que a BLL pode aplicar.**
> **Art. 32** "(...) os fornecedores estarão sujeitos às penalidades de **advertência, multa pecuniária ou suspensão**, a serem aplicadas pela administração da BLL COMPRAS, **além de responder criminalmente**, nos seguintes casos: I. Não apresentação ou apresentação incompleta da documentação (...); II. **Apresentação de declaração falsa** ou não condizente com a real situação dos licitantes."
> **Art. 23 / Art. 33** (desativação automática e negativação por inadimplência — não relacionado a automação, mas é a única "desativação automática" prevista).

Leitura: as penalidades de suspensão/criminal estão **ancoradas em declaração falsa e documentação irregular**, não em "uso de robô". **Não há previsão de descredenciamento por automação.** Mas atenção ao nível (c): se um ato automatizado disparar **declaração falsa** (ex.: declaração de ME/EPP, de habilitação, de inexistência de fato impeditivo) sem conferência humana, cai-se direto no Art. 32, II — com risco **criminal** expresso. `[CONFIRMADO]`

**(g) Ata automática — efeito colateral favorável.**
> **Art. 10, parágrafo único** "O Sistema **expedirá automaticamente a ata** da sessão contendo os dados da licitação e os **registros de todos os eventos** ocorridos na sessão."

Leitura: tudo que o Noyce fizer fica **logado e auditável** na ata. Bom para defesa (transparência), ruim se o ato foi irregular (prova contra a ENIAC).

### Política de Privacidade BLL (LGPD) — `[CONFIRMADO por busca; texto integral não lido]`
A BLL mantém Política de Privacidade declarando conformidade com a **Lei 12.965/2014 (Marco Civil)** e **Lei 13.709/2018 (LGPD)**. Coleta dados de formulários (nome, empresa, e-mail, telefone). O aceite se dá pelo uso do site. Não localizei, nesta política, cláusula específica sobre coleta automatizada de terceiros — coerente com o silêncio do Regulamento.

---

## 2. LER × COLETAR × ATUAR — os três níveis, separados

Esta é a parte que o cliente precisa internalizar. "Fazer tudo sozinho" colapsa três coisas de risco radicalmente diferente:

### (a) MONITORAR / LER — login só para visualizar editais e dados de certame
- **O que é:** Noyce acompanha pregões em tempo real, lê editais, consulta resultados, baixa a íntegra do edital.
- **Base favorável:** Art. 5º e Art. 9º **autorizam expressamente** consulta e download de editais no acesso público. Boa parte disso nem exige login.
- **Risco:** **BAIXO.** O limite é não onerar o sistema (carga/requisições) nem acessar área autenticada de terceiros.
- **Inferência `[INFERÊNCIA]`:** scraping de acesso *público* de dados *de certame* (não pessoais) tende a ser defensável — mas a ausência de cláusula não é o mesmo que permissão; veja §6.

### (b) COLETAR / BAIXAR EM MASSA — download autenticado de documentos em volume
- **O que é:** Noyce, logado como ENIAC, baixa documentos restritos, anexos, propostas de concorrentes, em massa e de forma sistemática.
- **Risco:** **MÉDIO (contratual + LGPD).** Não há vedação textual, mas:
  - opera *sob senha pessoal* (Art. 14) — risco recai no titular;
  - coleta em massa de área autenticada pode caracterizar **uso indevido** / sobrecarga, autorizando a BLL a desativar acesso (poder de fato, ainda que sem cláusula específica);
  - se a massa inclui **dados pessoais** de pregoeiros/concorrentes/representantes → entra a LGPD (§4).
- **Mitigação:** rate-limit, coletar só o necessário ao certame da ENIAC, não armazenar dado pessoal de terceiros além do estritamente necessário.

### (c) ATUAR — enviar proposta, dar lance, declaração, impugnação, recurso de forma automatizada
- **O que é:** Noyce pratica **atos de vontade** vinculantes em nome da ENIAC.
- **Risco:** **AQUI MORA O RISCO GRAVE — e ele NÃO é contra o Noyce, é contra a ENIAC.**
  - **Art. 13 §3 + Art. 27:** todo ato é da ENIAC, "firme e verdadeiro", irretratável. Erro do robô = erro da ENIAC, com consequência contratual e licitatória plena.
  - **Declaração automatizada** (ME/EPP, habilitação, inexistência de fato impeditivo) sem conferência humana → se incorreta, **Art. 32, II**: declaração falsa → suspensão + **responsabilização criminal** (e, na Lei 14.133, sanção do art. 155 e tipos penais dos arts. 337-E e ss.).
  - **Lance automatizado** tem regime próprio (§3) — é o nível menos arriscado *dentro* do "atuar", porque o ordenamento já o disciplina; **impugnação/recurso/declarações** são os mais arriscados, porque envolvem juízo jurídico e fé pública.

**Calibragem honesta, sem alarmismo:** "atuar" não é proibido em bloco. Lance automatizado é expressamente disciplinado e largamente usado (§3). O que é perigoso é **automação de atos declaratórios e recursais sem humano no loop** — não porque haja lei dizendo "robô não pode", mas porque a responsabilidade objetiva e irretratável do licitante transforma qualquer erro de automação em dano direto, suspensão e até crime para a ENIAC.

---

## 3. Lei 14.133/2021 + marco legal — o robô de lances JÁ é disciplinado

Ponto que muda o veredito do nível (c)-lance e que o cliente precisa saber: **o "robô de lances" não é zona cinzenta — é regulado e admitido.**

- **IN SEGES/ME nº 67/2021 (dispensa eletrônica)** e **IN SEGES/ME nº 73/2022, art. 19 (pregão e concorrência eletrônicos):** o próprio ordenamento prevê o **lance automático**: o licitante parametriza seu **valor mínimo final** (sigiloso) e o **intervalo mínimo** entre lances, e **"os lances serão enviados automaticamente pelo sistema"**, respeitados o valor mínimo e o intervalo. `[CONFIRMADO]`
  - **Nota crítica de distinção:** a IN regula o **lance automático NATIVO** (a própria plataforma dispara, a partir de parâmetro do fornecedor). Um **robô EXTERNO** que opera a interface do BLL é tecnicamente diferente — mas a jurisprudência abaixo trata os dois sob a mesma lente de legitimidade, desde que respeitem as regras.

- **Jurisprudência do TCU — evolução `[CONFIRMADO]`:**
  - **Histórico restritivo:** **Acórdão 2601/2011** e **Acórdão 1216/2014** — entenderam que o robô "confere vantagem competitiva" e tensiona a **isonomia**.
  - **Virada recente:** **Acórdão 2071/2025 (1ª Câmara)** — reconheceu **"inexistência de vícios quanto a suposta utilização de robôs"**. Entendimento predominante atual (TCU, TCE-MG, CGU): **não há infração quando o licitante usa ferramenta automatizada e respeita os limites do edital e do sistema.**
  - **A linha que separa o legítimo do ilícito:** desrespeitar **intervalos mínimos** de lance, **burlar regras** do sistema, **violar cláusula expressa do edital**, ou **fraudar o caráter competitivo** (Lei 14.133, art. 155, III; tipos penais arts. 337-F e ss.). "Cumprir o edital é o limite que separa automação legítima de uso irregular."

- **Responsabilidade pelos atos automatizados:** o entendimento é uniforme — **a estratégia e a responsabilidade permanecem do licitante.** O fornecedor "continua responsável por monitorar operações, mensagens emitidas durante a disputa e eventuais convocações do pregoeiro." `[CONFIRMADO]` Isso reforça o Art. 26 do Regulamento BLL (cabe ao licitante acompanhar o certame; perda de negócio por inobservância de mensagens é risco dele).

- **Regulamento privado prevalece?** Entre ENIAC e BLL, **sim** — é a lei interna da relação de adesão (Termo de Adesão, Anexo II), desde que não contrarie a lei. Mas o regulamento BLL **não veda** automação; então não há conflito a resolver. O que prevalece, na prática, é a **regra do edital de cada certame** (que pode, ele sim, vedar robô) somada às INs e à jurisprudência do TCU.

### Voz dos especialistas (mind clones, Voice DNA real — não role-play)

**Marçal Justen Filho** (doutrina — Lei 14.133):
> "A Lei 14.133 é a lei do futuro, da informática — sem os recursos tecnológicos, toda a abordagem da contratação pública será puramente retórica. A automação, por si, não vicia o certame. O que se reprime é o **formalismo vazio**, não a forma legítima; e, simetricamente, o que se reprime na disputa é a **fraude ao caráter competitivo e a quebra da isonomia**, não o uso da técnica. Mas registre-se a cautela metodológica: *a maior autonomia implica maior responsabilidade*. Quem delega a um sistema a prática de atos vinculantes assume integralmente as consequências — a vinculação ao edital não admite a escusa de que 'o software se equivocou'. **Admite-se** a automação dos atos de disputa; **seria mais seguro** reservar ao juízo humano os atos declaratórios e recursais, onde há fé pública e qualificação jurídica em causa."

**Joel de Menezes Niebuhr** (prática operacional do pregão):
> "Na prática do pregão, o detalhe procedimental decide o resultado — e há momentos que **precluem**. O robô de lances opera bem a *fase de lances*, que é mecânica e tem regra clara de intervalo e valor mínimo. Mas a **intenção de recurso** tem MOMENTO certo na sessão, aberto pelo pregoeiro, sob pena de preclusão — e não se confunde com as **razões**, que vêm depois, no prazo. Automatizar o *registro* da intenção de recorrer pode até fazer sentido (não perder o momento); automatizar as **razões do recurso** é outra natureza — é peça jurídica, não clique. E lembre: o **recurso não é pedido de reconsideração** — vai à autoridade superior, exige fundamentação. Deixe o robô vigiar o relógio e disputar o preço; deixe o humano decidir *se* e *com que fundamento* recorre. Aplica-se aqui o **formalismo moderado**: o fim é a proposta mais vantajosa, não eliminar concorrente por formalidade — mas isso não dispensa o licitante de acompanhar a sessão, que é dever dele (Art. 26 do próprio Regulamento BLL)."

---

## 4. LGPD — onde há dado pessoal

A LGPD entra **se e quando** o Noyce tratar dado pessoal. Mapa:

| Dado | Há dado pessoal? | Base / cuidado |
|------|------------------|----------------|
| Credenciais (login/senha da ENIAC) | Sim (do representante) | Tratamento legítimo (é a própria empresa). **Guardar com segurança** — vault, criptografado. Vazamento = incidente LGPD + Art. 14 BLL joga risco no titular. |
| Editais, valores, objeto | Não (dado de certame, não pessoal) | Sem restrição LGPD. |
| Nome/CPF de pregoeiros, representantes de concorrentes, sócios | **Sim** | Coleta em massa exige **base legal** (LGPD art. 7º) e **minimização** (art. 6º, III). Interesse legítimo é arguível para *o certame da ENIAC*; **não** para construir base de dados de terceiros. |
| Dados sensíveis | Improvável neste fluxo | — |

**Regras práticas:**
1. **Credenciais em vault** cifrado, nunca em log/repo. (Conecta ao `blocked_until_vault` do roadmap.)
2. **Minimização:** coletar dado pessoal de terceiros só o estritamente necessário ao certame; não reter para outros fins.
3. **Você é controlador** desses dados → eventual obrigação de transparência/eliminação.
4. **Raspagem de dado pessoal público não é livre** `[INFERÊNCIA, doutrina Souto Correa/LGPD]`: "ser público" não afasta a LGPD; exige finalidade e base legal.

---

## 5. VEREDITO ACIONÁVEL — o "fazer tudo sozinho", calibrado

| # | Capacidade do Noyce no BLL | Veredito | Condição |
|---|----------------------------|----------|----------|
| **PODE SOZINHO (baixo risco)** | | | |
| 1 | Monitorar/ler editais, acompanhar certame em tempo real, consultar resultados | **PODE** | Art. 5º/9º autorizam. Preferir acesso público. |
| 2 | Baixar a **íntegra do edital** público | **PODE** | Art. 9º expresso. |
| 3 | Analisar/triar/recomendar internamente (Mesa, Monitorar, Analisar) | **PODE** | É processamento interno, nem toca o BLL no ato. |
| 4 | Alertar a ENIAC sobre prazos, sessão, intenção-de-recurso a vencer | **PODE** | Vigia o relógio; humano decide. |
| **PODE COM MITIGAÇÃO (médio risco)** | | | |
| 5 | Login autenticado para **leitura** de área restrita da própria ENIAC | **PODE C/ MITIGAÇÃO** | Vault; rate-limit; identificar-se se a BLL exigir; sob senha pessoal (Art.14 — risco no titular). |
| 6 | Download autenticado de documentos do certame da ENIAC | **PODE C/ MITIGAÇÃO** | Só o necessário; rate-limit; sem varredura de massa de terceiros (LGPD). |
| 7 | **Lance automatizado** na fase de disputa | **PODE C/ MITIGAÇÃO FORTE** | Respeitar **intervalo mínimo** e **valor mínimo** parametrizados (IN 67/73). **Parâmetros definidos por humano** da ENIAC. Respeitar cláusula do edital (alguns vedam robô). TCU Ac. 2071/2025 favorável, mas responsabilidade é da ENIAC. **Humano monitora a sessão** (Art. 26). |
| 8 | **Registrar a intenção de recurso** automaticamente (só o registro, no momento) | **PODE C/ MITIGAÇÃO** | Evita preclusão. Mas a **decisão de recorrer e as razões** são humanas (Niebuhr). |
| **NÃO DEVE (alto risco / act-side declaratório)** | | | |
| 9 | Disparar **declarações** (ME/EPP, habilitação, inexistência de fato impeditivo) sem conferência humana | **NÃO** | Art. 32, II BLL: declaração falsa → suspensão + **criminal**. Fé pública. |
| 10 | Enviar **proposta final/assinada** sem aprovação humana do edital específico | **NÃO** | Art. 13 §1: não pode alegar desconhecimento. Art. 13 §3: irretratável. |
| 11 | Redigir+protocolar **impugnação/recurso** de forma autônoma | **NÃO** | Peça jurídica; juízo de admissibilidade e mérito (Niebuhr). Risco de perda do direito + responsabilização. |
| 12 | Raspagem em massa de **dados pessoais** de pregoeiros/concorrentes para base própria | **NÃO** | LGPD: sem base legal e sem minimização. |
| 13 | Qualquer automação que **desrespeite intervalo mínimo** de lance ou burle regra do sistema | **NÃO** | Fraude ao caráter competitivo (Lei 14.133 art. 155, III; tipos penais). |

### Onde o humano (Alice / RT) é JURIDICAMENTE obrigatório no loop
- **Declarações e habilitação** (itens 9): fé pública, risco criminal. Humano confere e assume.
- **Proposta final e preço-base/valor mínimo** (itens 7, 10): a *estratégia* e o *limite* são decisão humana (TCU exige; Art. 13 §3 imputa à ENIAC).
- **Decisão de recorrer + razões do recurso** (item 11): juízo jurídico — papel típico do RT/advogado.
- **Aprovação do edital específico** antes de qualquer envio (item 10): vinculação irretratável.
- **Monitoramento da sessão de disputa** (Art. 26): dever do licitante; o robô assiste, não substitui.

Resumo de uma linha para o cliente: **o Noyce pode ser autônomo para DESCOBRIR, LER, ANALISAR e VIGIAR o relógio; pode ser semiautônomo para DAR LANCE (com parâmetros e limites definidos por humano e dentro das regras); e NÃO deve ser autônomo para DECLARAR, PROPOR ou RECORRER.** Isso não é covardia jurídica — é onde a responsabilidade objetiva e irretratável da ENIAC (Art. 13 §3, Art. 27) e o risco criminal (Art. 32, II) tornam o humano-no-loop uma blindagem, não um obstáculo.

---

## 6. Caminho de conformidade — como desbloquear (gatilho `blocked_until_vault` → `allowedNow`)

1. **API/integração oficial?** `[NÃO CONFIRMADO]` Não localizei documentação pública de API oficial do BLL para parceiros. **Existe um mercado consolidado de robôs de terceiros integrados ao BLL** (Lance Fácil, Licitei, LanceBot) operando lance automático — sinal forte de que a automação de disputa é tolerada na prática. **Ação:** contatar a BLL (canais oficiais em bll.org.br) e perguntar formalmente: (a) existe API/integração homologada? (b) há programa de parceiro? (c) há vedação a acesso automatizado autenticado?

2. **Pedir autorização formal de acesso automatizado.** Solicitação escrita à BLL descrevendo o Noyce como ferramenta da própria ENIAC. **Resposta favorável (ou silêncio + ausência de vedação) muda o veredito** dos itens 5–6 de "mitigação" para "permitido com lastro documental". Guardar a resposta = prova de boa-fé.

3. **Ler o edital de CADA certame** antes de atuar. Alguns editais vedam robô expressamente — e aí o edital prevalece (vinculação ao edital, Art. 13 §1). Gate automático: se o edital tem cláusula anti-robô → item 7 vira NÃO para aquele certame.

4. **Vault de credenciais** (cifrado, fora de repo/log) — pré-condição técnica e LGPD para qualquer login autenticado. **Este é literalmente o gatilho `blocked_until_vault`.**

5. **Rate-limit + identificação** (User-Agent identificável, janelas humanas) — reduz risco de "uso indevido" (Art. 14) e de bloqueio de fato.

6. **Humano-no-loop nos atos declaratórios/recursais** (itens 9–11) — implementar como gate de produto, não como opção.

### Quando `blocked_until_vault` → `allowedNow`
- **Itens 1–4 (ler/analisar):** já são `allowedNow` — não dependem nem do vault. Liberar agora.
- **Itens 5–8 (autenticado/lance):** viram `allowedNow` **quando**: vault implementado **E** (resposta da BLL favorável **OU** confirmação de ausência de vedação no edital do certame) **E** parâmetros/limites definidos por humano.
- **Itens 9–13:** permanecem **bloqueados por design** (não por falta de vault) — só liberam com humano-no-loop explícito, e o item 12/13 nunca liberam.

---

## Apêndice — Fontes (reais, citadas)

- **Regulamento BLL 2024** (fonte primária, lido na íntegra): `https://bll.org.br/wp-content/uploads/2023/07/Regulamento-BLL-2024.pdf` (original 403) · espelho lido: `https://www.guapirama.pr.gov.br/public/admin/globalarq/uploads/files/Novo%20Regulamento%20bll.pdf` — Arts. 4º, 5º, 9º, 10, 13 (§§1-5), 14, 26, 27, 28, 32, 33; Definições XV, XVI.
- **Política de Privacidade / LGPD BLL** (busca; texto integral não lido): conformidade Lei 12.965/2014 + Lei 13.709/2018.
- **IN SEGES/ME nº 67/2021** (lance automático na dispensa eletrônica): `https://www.gov.br/compras/.../instrucao-normativa-seges-me-no-67-de-8-de-julho-de-2021`
- **IN SEGES/ME nº 73/2022, art. 19** (lance automático no pregão/concorrência): valor mínimo + intervalo mínimo, envio automático pelo sistema.
- **TCU:** Acórdão 2601/2011 e 1216/2014 (restritivos); **Acórdão 2071/2025, 1ª Câmara** (sem vícios em uso de robô). Análises: `effecti.com.br/legalidade-do-robo-de-lances/`, `moac.com.br/roboslicitacoes/`, `conlicitacao.com.br/robo-de-lances-para-licitacao-pode-usar-e-como-funciona/`.
- **Lei 14.133/2021:** art. 155 (sanções); arts. 337-E e ss. (tipos penais — fraude ao caráter competitivo); art. 174 (PNCP/dados).
- **Mercado de robôs integrados ao BLL** (evidência fática de tolerância): Lance Fácil, Licitei, LanceBot.

**Marcação de confiança:** `[CONFIRMADO]` = lido em fonte primária/oficial. `[INFERÊNCIA]` = raciocínio jurídico do parecer. `[NÃO CONFIRMADO]` = não verificado em fonte (ex.: API oficial BLL).

---

⚠️ Esta análise é orientativa e não substitui consulta com advogado.
Para questões específicas, consulte um profissional habilitado.
