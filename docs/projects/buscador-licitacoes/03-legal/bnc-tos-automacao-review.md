# BNC — Termos de Uso x Automação Autônoma do Noyce

**Parecer orientativo de risco — Legal Chief (AIOS)**
**Cliente:** ENIAC (CNPJ 36.819.268/0001-05 — ME, obras, GO) · **Produto:** Noyce
**Alvo:** BNC — Bolsa Nacional de Compras (bnccompras.com / bnc.org.br) — operadora **privada** credenciada
**Data:** 2026-06-09 · **Status:** v1
**Régua do cliente:** Noyce faz ~95% sozinho (descobrir→ler→monitorar→baixar→analisar→habilitar→**rascunhar** proposta/declaração/recurso); humano só dá o **clique vinculante** em LANCE, envio de declaração, envio de proposta, protocolo de impugnação/recurso. **O lance autônomo JÁ foi tirado da mesa pelo cliente.**
**Natureza:** apoio à decisão de produto. NÃO é parecer jurídico para caso concreto. Disclaimer ao final.
**Companheiro de leitura:** comparar com `bll-tos-automacao-review.md` (mesmo framework).

---

## 0. Diagnóstico (Tier 0)

| Eixo | Leitura |
|------|---------|
| **Área** | Direito administrativo (Lei 14.133/2021 + INs SEGES) + Direito digital (regulamento privado de adesão, LGPD) |
| **Urgência** | Pré-build. Decisão de arquitetura ANTES de codar login automatizado. Correto travar agora. |
| **Exposição** | **Assimétrica por nível.** Ler ≈ baixa. Coletar autenticado ≈ média (contratual). **Atuar** (lance/declaração/proposta/recurso) ≈ a que tem responsabilidade legal direta do licitante (ENIAC). **Como o cliente já reservou o clique vinculante ao humano, o eixo de maior risco está coberto por design.** |
| **Contexto** | ME real disputando certames reais. Risco recai sobre o CNPJ da ENIAC, sua reputação e seu acesso à plataforma — não sobre o Noyce. |

**Fato estrutural nº 1 — a BNC roda sobre a BLL.** A própria BNC declara que sua "Plataforma Eletrônica de Licitações é **disponibilizada pela BLL COMPRAS**". `[CONFIRMADO — material institucional BNC + busca]` Na prática, **BNC e BLL compartilham o mesmo motor de software e o mesmo template regulamentar** (Regulamento do Sistema Eletrônico de Licitações + Anexos I–III; Termo de Adesão = Anexo X da BNC). Isso significa que **o parecer do BLL se transporta quase integralmente** — com as diferenças de superfície técnica e de acesso público que mapeio abaixo.

**Fato estrutural nº 2 — não é dado aberto.** Como o BLL, a BNC é **operadora privada** regida por **regulamento contratual de adesão** (Anexo X, "Termo de Adesão - BNC", lido na íntegra). O regulamento da operadora é lei privada entre as partes, desde que não contrarie a lei. Não há direito legal de acesso *automatizado*; há direito de *participar do certame* uma vez credenciado. Distinto do PNCP (Lei 14.133 art. 174, dado público).

---

## 1. Termos de Uso / Regulamento BNC — leitura real (fonte primária)

**Documentos analisados:**
- **Anexo X — "Termo de Adesão - BNC"** (PDF oficial, baixado e extraído na íntegra; hospedado por órgão público SC) — texto curto de adesão que **remete ao "Regulamento do Sistema Eletrônico de Pregões Eletrônicos da Bolsa Nacional de Compras 'BNC'"** e ao **Anexo III** (taxas). `[CONFIRMADO por leitura integral]`
- **Edital municipal (Pregão Eletrônico, Nova Trento/SC)** que **reproduz textualmente as cláusulas regulamentares da BNC** (credenciamento, senha, responsabilidade) — usado como espelho fiel do regulamento, baixado e extraído na íntegra. `[CONFIRMADO por leitura integral]`
- **Política de Privacidade BNC** (`bnc.org.br/politica-de-privacidade/`) — lida. `[CONFIRMADO]`
- **Superfície técnica pública** (`bnccompras.com/Process/ProcessSearchPublic`, `ProcessView`) — sondada ao vivo (HTTP 200, sem login). `[CONFIRMADO por requisição real]`

### Achado central — silêncio regulamentar sobre robôs/scraping (igual ao BLL)

Não localizei, no Termo de Adesão BNC nem nas cláusulas regulamentares reproduzidas em edital, **nenhuma vedação expressa** a robôs, bots, scraping, raspagem, mineração, API, ou limite de requisições. Idêntico ao silêncio do Regulamento BLL — coerente, já que é o **mesmo template**. **Não há proibição textual a invocar contra o Noyce; também não há autorização.** O que governa é o regime de **responsabilidade** e **uso conforme**. `[CONFIRMADO por leitura dos documentos disponíveis]` · `[NÃO CONFIRMADO]` quanto ao texto integral do Regulamento-mãe (Capítulos I–X) hospedado em área da BNC — o `bnc.org.br` retorna 403 a fetch automatizado; trabalhei com o Anexo X + reprodução fiel em edital.

### Cláusulas que efetivamente governam a automação (citadas textualmente)

**(a) Senha pessoal e intransferível — núcleo do risco autenticado.**
> **Cl. 2.12** "A participação no Pregão, na Forma Eletrônica se dará por meio da digitação da **senha pessoal e intransferível do representante credenciado** (operador da corretora de mercadorias) (...)."
> **Cl. 3.3** "O acesso do operador ao pregão, para efeito de encaminhamento de proposta de preço e lances sucessivos de preços, em nome do licitante, **somente se dará mediante prévia definição de senha privativa**."
> **Cl. 3.5** "É de **exclusiva responsabilidade do usuário o sigilo da senha**, bem como seu uso em qualquer transação efetuada diretamente ou por seu representante, **não cabendo à BNC (...) responsabilidade por eventuais danos decorrentes de uso indevido da senha, ainda que por terceiros**."

Leitura: equivalente ao **Art. 14 do BLL**. Robô que loga com a credencial da ENIAC opera *sob* a senha pessoal de um humano. Não é "transferir" senha a terceiro (o Noyce é ferramenta da própria ENIAC), mas desloca **todo o risco operacional para o titular** — a BNC se exime de dano por uso indevido "ainda que por terceiros". `[CONFIRMADO]`

**(b) Responsabilidade integral do licitante — atos firmes, verdadeiros e próprios.**
> **Cl. 2.14** "O licitante **responsabiliza-se exclusiva e formalmente pelas transações efetuadas em seu nome, assume como firmes e verdadeiras suas propostas e seus lances, inclusive os atos praticados diretamente ou por seu representante**, excluída a responsabilidade do provedor do sistema ou do órgão (...) por eventuais danos decorrentes de uso indevido das credenciais de acesso, ainda que por terceiros."

Leitura: **este é o coração do parecer** — equivale ao **Art. 13 §3 + Art. 27 do BLL**. Qualquer lance, proposta ou declaração disparada pelo Noyce é, perante a BNC e a Administração, ato **da ENIAC, firme, verdadeiro e irretratável**. Não existe "foi o robô que errou". Nuance favorável: a cláusula admite atos praticados **"diretamente ou por seu representante"** — linguagem que *acomoda* a operação por ferramenta/preposto, sem vedá-la. `[CONFIRMADO]`

**(c) Dever de acompanhar a sessão — o humano-no-loop que o próprio regulamento exige.**
> **Cl. 2.13 / Cl. 4.4** "Caberá ao fornecedor **acompanhar as operações no sistema eletrônico durante a sessão pública** do pregão, ficando **responsável pelo ônus decorrente da perda de negócios** diante da inobservância de quaisquer mensagens emitidas pelo sistema ou da desconexão do seu representante."

Leitura: equivale ao **Art. 26 do BLL**. O regulamento **impõe vigilância humana** da sessão. O robô pode assistir, mas o ônus por não observar mensagem/convocação do pregoeiro é da ENIAC. `[CONFIRMADO]`

**(d) Credenciamento presume capacidade e responsabilidade legal.**
> **Cl. 3.6** "O credenciamento do fornecedor e de seu representante legal junto ao sistema eletrônico implica a **responsabilidade legal pelos atos praticados** e a **presunção de capacidade técnica** para realização das transações inerentes ao pregão eletrônico."
> **Cl. 3.2** "(...) deverá manifestar, por meio de seu operador designado, em campo próprio do sistema, **pleno conhecimento, aceitação e atendimento às exigências de habilitação previstas no Edital**."

Leitura: equivale ao **Art. 13 + §1 do BLL**. Se o Noyce manifesta "pleno conhecimento e aceitação do edital" sem que um humano o tenha lido, a ENIAC **se vincula** e não poderá alegar desconhecimento. `[CONFIRMADO]`

**(e) Anexo X — Termo de Adesão (responsabilidades enumeradas).**
> **Anexo X, item 2** "São responsabilidades do Licitante: i. **Tomar conhecimento e cumprir todos os dispositivos constantes dos editais** (...); ii. Observar e cumprir a regularidade fiscal, apresentando a documentação exigida (...) para fins de habilitação (...); iii. Observar a legislação pertinente (...); iv. **Designar pessoa responsável para operar o Sistema Eletrônico de Licitações**, e se responsabilizar por todos os dados do cadastro (...)."

Leitura: o Anexo X **exige a designação de uma PESSOA responsável para operar o sistema** (item iv) e impõe a ela o dever de conhecer cada edital (item i). Isso **não veda** automação, mas confirma que o ordenamento contratual pressupõe um operador humano responsável por trás dos atos — exatamente o ponto de ancoragem do humano-no-loop. `[CONFIRMADO por leitura integral do Anexo X]`

**(f) Penalidades / declaração falsa.**
`[INFERÊNCIA forte por paralelismo de template + LC 123 e Lei 14.133]` Não tive acesso ao artigo de penalidades do Regulamento-mãe BNC (equivalente ao Art. 32 do BLL). Mas: (i) o template é o mesmo da BLL; (ii) o edital exige diversas **declarações** (inexistência de fato impeditivo, ME/EPP, não emprega menor, cumprimento de requisitos habilitatórios — Anexos III–VII do edital) "sob as penas da lei"; (iii) declaração falsa em licitação atrai sanção administrativa **e responsabilização criminal** (Lei 14.133 art. 155 + tipos penais arts. 337-E e ss.; CP art. 299). **Conclusão prática idêntica à do BLL:** automação de ato declaratório sem conferência humana → risco de declaração falsa → sanção + criminal, **recaindo sobre a ENIAC**.

### Política de Privacidade BNC (LGPD) — `[CONFIRMADO]`
A BNC declara conformidade com a **Lei 13.709/2018 (LGPD)** e a **Lei 12.965/2014 (Marco Civil)**. Coleta nome, e-mail, telefone, endereço, dados de navegação (IP, navegador, SO), localização, método de pagamento e dados de formulários. Usa "cookies e tecnologias similares". **Não há cláusula específica vedando coleta automatizada/scraping/crawler** — coerente com o silêncio regulamentar. Consentimento por adesão implícita ("ao acessar ou usar o site, você concorda"). Compartilha com terceiros apenas em hipóteses legais/segurança/fraude/M&A.

---

## 2. Acesso público de leitura — o que está aberto SEM login (sondagem ao vivo)

Diferença material em relação ao BLL: o BLL **declara no Regulamento** (Art. 5º/9º) que o acesso público permite consulta e **download da íntegra do edital**. Na BNC, **não localizei cláusula regulamentar expressa equivalente**, mas **confirmei a superfície técnica pública por requisição real**:

| Superfície | URL | Resultado | Marca |
|------------|-----|-----------|-------|
| Busca pública de processos | `bnccompras.com/Process/ProcessSearchPublic?param1=0` | **HTTP 200**, 119 KB, ~100 processos listados, **sem login** | `[CONFIRMADO]` |
| Busca pública por localização | `/Process/ProcessSearchPublicByLocation` | linkada na home pública | `[CONFIRMADO existência]` |
| Compra direta pública | `/DirectBuy/DirectBuySearchPublic` | linkada na home pública | `[CONFIRMADO existência]` |
| Detalhe do processo | `/Process/ProcessView?param1=...` | **HTTP 200** (sem redirect a login), 40 KB, exibe "Edital", "Documento", "arquivo" | `[CONFIRMADO]` |

**Leitura:** existe um **acesso público de leitura real** na BNC — listagem e detalhe de processos consultáveis **sem autenticação**. Isso dá lastro técnico ao nível (a) ler/monitorar, **mesmo sem a cláusula expressa que o BLL tem**.

**Ressalva honesta sobre o download da íntegra:** no HTML público do `ProcessView` **não encontrei link direto de download do arquivo do edital/anexos** — o botão de download parece ser ação JS autenticada ou atrás de login. `[NÃO CONFIRMADO]` que a íntegra do edital seja baixável publicamente sem login na BNC. **Esta é a principal diferença operacional vs BLL**, onde o Art. 9º garante download público da íntegra. Para a BNC: a *descoberta/monitoramento* é claramente público; o *download da íntegra* pode exigir login (a confirmar com 1 teste manual ou consulta à BNC).

---

## 3. LER × COLETAR × ATUAR — os três níveis (idêntico ao BLL)

### (a) MONITORAR / LER — descobrir, acompanhar, ler metadados de certame
- **Base favorável:** superfície `ProcessSearchPublic`/`ProcessView` pública (HTTP 200 sem login, confirmado ao vivo).
- **Risco:** **BAIXO.** Limite: não onerar o sistema (rate-limit) nem acessar área autenticada de terceiros.
- `[INFERÊNCIA]` scraping do acesso *público* de dados *de certame* (não pessoais) tende a ser defensável; ausência de cláusula ≠ permissão (ver §6).

### (b) COLETAR / BAIXAR (autenticado) — íntegra do edital + documentos do certame
- **Risco:** **MÉDIO (contratual + LGPD).** Se a íntegra exige login (provável na BNC), o download é feito *sob senha pessoal* (Cl. 2.12/3.5) → risco no titular. Coleta em massa de área autenticada pode caracterizar uso indevido/sobrecarga. Se inclui dado pessoal de terceiros → LGPD (§5).
- **Mitigação:** rate-limit, coletar só o necessário ao certame da ENIAC, sem varredura de massa de terceiros.

### (c) ATUAR — lance / declaração / proposta / impugnação / recurso
- **Risco:** **GRAVE — e recai sobre a ENIAC**, via Cl. 2.14 (firme, verdadeiro, irretratável) + 3.5/3.6.
- **A régua do cliente já neutraliza o pior:** o **clique vinculante** (lance, envio de declaração, envio de proposta, protocolo de recurso) fica com o humano. O Noyce **PREPARA/RASCUNHA**; não dispara. Isso alinha o produto exatamente onde a Cl. 2.13/4.4 (dever de acompanhar a sessão) e a Cl. 2.14 (atos próprios e irretratáveis) exigem juízo humano.

---

## 4. Marco legal — Lei 14.133 + INs + TCU (transporta do BLL)

- **Lance automático é DISCIPLINADO e admitido:** **IN SEGES/ME 67/2021** (dispensa eletrônica) e **IN SEGES/ME 73/2022, art. 19** (pregão/concorrência) — o licitante parametriza **valor mínimo final** (sigiloso) e **intervalo mínimo**, e os lances "são enviados automaticamente pelo sistema". `[CONFIRMADO]`
- **TCU virou favorável:** **Acórdão 2071/2025 (1ª Câmara)** reconheceu "inexistência de vícios quanto a suposta utilização de robôs", superando os restritivos **2601/2011** e **1216/2014**. Limite = **cumprir o edital + regras do sistema** (intervalo mínimo, não burlar, não fraudar o caráter competitivo — Lei 14.133 art. 155, III; arts. 337-F e ss.). `[CONFIRMADO]`
- **Responsabilidade permanece do licitante:** ele "continua responsável por monitorar operações, mensagens e convocações do pregoeiro" — exatamente a Cl. 2.13/4.4 da BNC. `[CONFIRMADO]`
- **Evidência fática de tolerância a robô na BNC:** **Lance Fácil declara integração com a BNC** (entre "ComprasNet, BLL Compras e BNC, Licitanet (...)"), oferecendo lances automáticos, monitoramento de chat, busca de editais e registro de proposta. Mercado consolidado de robôs operando na BNC = sinal forte de tolerância de fato. `[CONFIRMADO por material do fornecedor Lance Fácil]`

> **Nota:** mesmo com o lance autônomo *tirado da mesa pelo cliente*, registro o marco legal porque ele sustenta que a arquitetura escolhida (humano clica o lance, máquina prepara tudo) é **mais conservadora** do que o teto que a própria jurisprudência já admite — ou seja, há **folga de segurança**.

---

## 5. LGPD — onde há dado pessoal (idêntico ao BLL)

| Dado | Pessoal? | Cuidado |
|------|----------|---------|
| Credenciais ENIAC (login/senha) | Sim | **Vault cifrado**, nunca em log/repo. Vazamento = incidente LGPD + Cl. 3.5 joga risco no titular. |
| Editais, valores, objeto | Não | Sem restrição LGPD. |
| Nome/CPF de pregoeiros, concorrentes, sócios | **Sim** | Coleta exige base legal (art. 7º) + minimização (art. 6º, III). Interesse legítimo arguível *para o certame da ENIAC*; **não** para montar base de terceiros. |

Regra: credenciais em vault; minimização; "ser público" não afasta a LGPD (`[INFERÊNCIA, doutrina LGPD]`).

---

## 6. VEREDITO CALIBRADO por nível — alinhado à política do cliente

Legenda: **PODE SOZINHO** = Noyce autônomo. **PODE C/ MITIGAÇÃO** = autônomo com salvaguardas técnicas. **HUMANO CLICA** = Noyce prepara/rascunha tudo, humano dá o clique vinculante (régua do cliente).

| # | Capacidade do Noyce na BNC | Veredito | Condição |
|---|----------------------------|----------|----------|
| **PODE SOZINHO (baixo risco)** | | | |
| 1 | Descobrir/monitorar processos, acompanhar em tempo real, ler metadados | **PODE** | `ProcessSearchPublic`/`ProcessView` públicos (HTTP 200 confirmado). Preferir superfície pública. |
| 2 | Baixar a **íntegra do edital** quando exposta no acesso público | **PODE** | Onde for público. **Se exigir login → cai no item 6.** (Diferença vs BLL: BNC não confirma download público da íntegra.) |
| 3 | Analisar/triar/recomendar internamente; **análise de habilitação** | **PODE** | Processamento interno; nem toca a BNC no ato. |
| 4 | Alertar a ENIAC sobre prazos, sessão, janela de intenção-de-recurso | **PODE** | Vigia o relógio; humano decide. Reforça dever da Cl. 2.13/4.4. |
| 5 | **Rascunhar/preparar** proposta, declarações e recurso (sem enviar) | **PODE** | Preparação é interna. O envio é o ato vinculante (itens 9–12). Núcleo da régua do cliente. |
| **PODE C/ MITIGAÇÃO (médio risco)** | | | |
| 6 | Login autenticado para **leitura/coleta** da área da própria ENIAC (incl. download da íntegra se exigir login) | **PODE C/ MITIGAÇÃO** | Vault cifrado; rate-limit; identificar-se se a BNC exigir; opera sob senha pessoal (Cl. 2.12/3.5 — risco no titular). |
| 7 | Download autenticado de documentos do **certame da ENIAC** | **PODE C/ MITIGAÇÃO** | Só o necessário; rate-limit; sem varredura de massa de terceiros (LGPD). |
| 8 | **Registrar a intenção de recurso** no momento da sessão (só o registro) | **PODE C/ MITIGAÇÃO** | Evita preclusão. **Decisão de recorrer + razões = humano.** Confirmar que o cliente aceita o *registro* como não-vinculante; se considerar vinculante → vai para "humano clica". |
| **HUMANO CLICA (ato vinculante — régua do cliente)** | | | |
| 9 | **LANCE** | **HUMANO CLICA** | Cliente expressamente não quer robô dando lance. Noyce sugere valor/estratégia; humano confirma. (Juridicamente o lance automático seria admissível — IN 73/2022 + TCU 2071/2025 — mas é decisão de produto do cliente, **mais conservadora**.) |
| 10 | **Envio de declaração** (ME/EPP, habilitação, inexistência de fato impeditivo) | **HUMANO CLICA** | Fé pública; declaração falsa → sanção + criminal, recai na ENIAC. Noyce rascunha; humano confere e envia. |
| 11 | **Envio de proposta final** | **HUMANO CLICA** | Cl. 3.2/3.6: aceitação do edital se vincula; Cl. 2.14: irretratável. Noyce monta; humano aprova o edital específico e envia. |
| 12 | **Protocolo de impugnação/recurso** | **HUMANO CLICA** | Peça jurídica; juízo de admissibilidade/mérito (RT/advogado). Noyce redige minuta; humano protocola. |
| **NÃO DEVE (proibido por design)** | | | |
| 13 | Raspagem em massa de **dados pessoais** de pregoeiros/concorrentes para base própria | **NÃO** | LGPD: sem base legal e sem minimização. |
| 14 | Qualquer automação que **burle regra do sistema / intervalo / fraude o caráter competitivo** | **NÃO** | Lei 14.133 art. 155, III + tipos penais. Irrelevante que o lance seja humano — vale para toda interação. |

### Resumo de uma linha
**Na BNC o Noyce pode ser autônomo para DESCOBRIR, LER, MONITORAR, BAIXAR (público), ANALISAR, fazer HABILITAÇÃO e RASCUNHAR proposta/declaração/recurso; precisa de mitigação técnica para login/coleta autenticada; e o HUMANO dá o clique em LANCE, ENVIO de declaração, ENVIO de proposta e PROTOCOLO de recurso.** É exatamente a régua do cliente — e ela é **mais conservadora** do que o que a lei já permitiria (o lance automático seria legal), o que dá **folga de segurança**, não risco.

---

## 7. Caminho de conformidade (gatilho `blocked_until_vault` → `allowedNow`)

1. **API/integração oficial BNC?** `[NÃO CONFIRMADO]` Não localizei documentação pública de API/programa de parceiro da BNC. Mas há **mercado de robôs integrados** (Lance Fácil declara integração com a BNC) = tolerância de fato. **Ação:** contatar a BNC (`contato@bnc.org.br` — confirmado em edital) e perguntar formalmente: (a) há API/integração homologada? (b) há programa de parceiro/operador? (c) há vedação a acesso automatizado autenticado? (d) **a íntegra do edital é baixável no acesso público?**
2. **Autorização formal de acesso automatizado** — descrever o Noyce como ferramenta da própria ENIAC. Resposta favorável (ou silêncio + ausência de vedação) move os itens 6–7 de "mitigação" para "permitido com lastro documental". Guardar a resposta = prova de boa-fé.
3. **Ler o edital de CADA certame** antes de qualquer envio — alguns editais vedam robô; aí o edital prevalece (Cl. 3.2/3.6, vinculação). Gate automático: edital com cláusula anti-robô → trava.
4. **Vault de credenciais** cifrado, fora de repo/log — pré-condição técnica e LGPD. **É literalmente o gatilho `blocked_until_vault`.**
5. **Rate-limit + identificação** (User-Agent identificável, janelas humanas) — reduz "uso indevido" (Cl. 3.5) e bloqueio de fato.
6. **Humano-no-loop nos atos vinculantes** (itens 9–12) — gate de produto, não opção. **Já é a política do cliente.**

### `blocked_until_vault` → `allowedNow`
- **Itens 1–5 (descobrir/ler/monitorar/baixar público/rascunhar):** `allowedNow` — **liberáveis HOJE**, não dependem do vault. **Há adapter público liberável hoje** (ver §8).
- **Itens 6–8 (autenticado/registro de intenção):** `allowedNow` **quando** vault implementado **E** (resposta favorável da BNC **OU** ausência de vedação no edital do certame).
- **Itens 9–12 (vinculantes):** **humano clica** por design — não dependem de vault, são gate de produto.
- **Itens 13–14:** **nunca** liberam.

---

## 8. Adapter público liberável HOJE — resposta direta

**SIM.** A BNC tem superfície pública de leitura **confirmada ao vivo** (`ProcessSearchPublic`, `ProcessSearchPublicByLocation`, `DirectBuySearchPublic`, `ProcessView` — todos HTTP 200 sem login). Um **adapter público de descoberta+monitoramento BNC** (itens 1, 3, 4, 5) é **liberável hoje**, sem vault, sem login, em paralelo ao adapter PNCP.

**Ressalva única:** o **download da íntegra do edital** pode exigir login na BNC (não confirmado como público — diferente do BLL, onde o Art. 9º garante). Tratar o download da íntegra como **item 6 (autenticado, pós-vault)** até confirmar o contrário com 1 teste manual ou com a resposta da BNC.

---

## 9. Comparação BNC × BLL

| Eixo | BLL | BNC | Quem é mais permissivo |
|------|-----|-----|------------------------|
| Motor / template regulamentar | Próprio (BLL COMPRAS) | **Roda sobre a BLL COMPRAS** — mesmo motor/template | Equivalentes (são o mesmo software) |
| Vedação expressa a robô/scraping | Nenhuma (silêncio) | Nenhuma (silêncio) | Empate |
| Senha pessoal/intransferível, risco no titular | Art. 14 + def. XV | Cl. 2.12 / 3.3 / **3.5** ("ainda que por terceiros") | Empate (BNC explicita "ainda que por terceiros") |
| Responsabilidade total/irretratável | Art. 13 §3 + Art. 27 | Cl. 2.14 ("firmes e verdadeiras (...) diretamente ou por seu representante") | Empate — **BNC tem linguagem que acomoda atuação por preposto/ferramenta** |
| Dever de acompanhar a sessão | Art. 26 | Cl. 2.13 / 4.4 | Empate |
| **Consulta pública de editais (cláusula expressa)** | **Art. 5º — expresso** | Sem cláusula expressa (mas superfície técnica pública confirmada) | **BLL** (tem o direito *escrito*) |
| **Download público da íntegra do edital** | **Art. 9º — expresso e garantido** | **Não confirmado público** (provável login) | **BLL** (vantagem clara) |
| Superfície técnica pública sondável | Confirmada por leitura do Regulamento | **Confirmada ao vivo** (HTTP 200 em `ProcessSearchPublic`/`ProcessView`) | Empate prático |
| Penalidade/declaração falsa | Art. 32, II — texto lido | Não acessei o artigo (mesmo template + LC123/Lei 14.133) | BLL (texto confirmado); BNC inferido |
| Robôs de terceiros tolerados de fato | Lance Fácil/Licitei/LanceBot | **Lance Fácil integra com BNC** | Empate |
| LGPD na política de privacidade | Sim | Sim (LGPD + Marco Civil) | Empate |

**Síntese:** **BNC e BLL são juridicamente quase idênticos** (mesmo motor, mesmo template, mesmo regime de responsabilidade e silêncio sobre robô). A **única diferença material** é que o **BLL é expressamente mais permissivo no acesso público de leitura/download** (Art. 5º e Art. 9º escritos no Regulamento), enquanto na BNC o acesso público é **confirmado tecnicamente** mas **sem cláusula escrita garantindo o download da íntegra** — provável login para a íntegra. Em tudo o mais (responsabilidade irretratável, senha pessoal, dever de acompanhar a sessão, tolerância de fato a robô, lance automático legal sob IN/TCU), **o veredito do BLL se transporta integralmente**.

---

## Apêndice — Fontes (reais, citadas)

- **Anexo X — Termo de Adesão BNC** (fonte primária, baixado e lido na íntegra): `https://painel.sc.gov.br/uploads/sites/331/2024/08/ANEXO-X-TERMO-DE-ADESAO-BNC.pdf` — itens 1–5; remete ao Regulamento + Anexo III.
- **Edital Pregão Eletrônico Nova Trento/SC** (reprodução fiel das cláusulas regulamentares BNC, baixado e lido): cláusulas 2.12, 2.13, 2.14, 3.2, 3.3, 3.5, 3.6, 4.4 — `https://novatrento.sc.gov.br/uploads/sites/349/2021/12/2026141_Edital_008___PE_004___SRP___Equipamentos_de_Informatica.pdf`
- **Superfície pública BNC** (sondada ao vivo, HTTP 200 sem login): `https://bnccompras.com/Process/ProcessSearchPublic?param1=0` · `/Process/ProcessView?param1=...` · `/Process/ProcessSearchPublicByLocation` · `/DirectBuy/DirectBuySearchPublic`.
- **Política de Privacidade BNC** (lida): `https://bnc.org.br/politica-de-privacidade/` — LGPD (Lei 13.709/2018) + Marco Civil (Lei 12.965/2014).
- **BNC roda sobre BLL COMPRAS** (material institucional BNC) + conformidade declarada TCU/CGU/TCE: `https://bnc.org.br/blog/o-sistema-da-bolsa-nacional-de-compras-bnc-esta-em-total-conformidade-com-os-requisitos-estabelecidos-pelo-tcu-cgu-e-tce-ma/`
- **Lance Fácil — integração com BNC** (evidência fática de tolerância a robô): `https://www.lancefacil.com/Lances-Automaticos-BNC-Compras`
- **IN SEGES/ME 67/2021** (lance automático, dispensa) · **IN SEGES/ME 73/2022, art. 19** (lance automático, pregão/concorrência).
- **TCU:** Acórdão 2601/2011 e 1216/2014 (restritivos); **Acórdão 2071/2025, 1ª Câmara** (sem vícios em robô).
- **Lei 14.133/2021:** art. 155 (sanções); arts. 337-E e ss. (tipos penais); art. 174 (PNCP/dado público). **CP art. 299** (falsidade ideológica).
- **Comparativo:** `bll-tos-automacao-review.md` (mesmo diretório).

**Marcação de confiança:** `[CONFIRMADO]` = lido em fonte primária/oficial ou requisição real. `[INFERÊNCIA]` = raciocínio jurídico do parecer. `[NÃO CONFIRMADO]` = não verificado (ex.: texto integral do Regulamento-mãe BNC, que dá 403; artigo de penalidades; download público da íntegra do edital).

---

⚠️ Esta análise é orientativa e não substitui consulta com advogado.
Para questões específicas, consulte um profissional habilitado.
