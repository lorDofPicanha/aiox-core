# MARCA TALOS — VERIFICAÇÃO DE ANTERIORIDADE, DOMÍNIO E COLISÃO

> **Data:** 2026-07-28 · **Autorizado pelo founder** ("pode ser")
> **Escopo:** INPI (classes 42 e 35) · disponibilidade real de domínio · colisão de mercado
> **Regra aplicada:** zero conclusão sem evidência. O que não foi verificado está em §5.

---

## 🔴 VEREDITO EM UMA LINHA

**TROCAR.** A classe 42 — exatamente a classe do negócio — tem **duas marcas TALOS registradas e em vigor no INPI** (Cisco e Progress Rail) e **dois pedidos TALOS já indeferidos** nessa mesma classe; além disso, **duas empresas brasileiras ativas já operam como "Talos" no mesmo nicho** (criação de site + tráfego pago + automação).

---

## 1 · INPI — anterioridade de `TALOS`

### 1.1 Como foi consultado (reprodutível)

Base oficial `busca.inpi.gov.br/pePI`, acessada como usuário convidado. A falha registrada na sessão
anterior (`java.sql.SQLException: Null SQL statement`) tinha causa identificável: o formulário usa
`Action` com **A maiúsculo** e `tipoPesquisa=BY_MARCA_CLASSIF_BASICA` (não `BY_RADICAL`), e a busca
exige **sessão de convidado** criada antes via `POST /pePI/servlet/LoginController` com credenciais vazias.

```
1. GET  https://busca.inpi.gov.br/pePI/                      → cookie JSESSIONID
2. POST /pePI/servlet/LoginController   T_Login=&T_Senha=&action=login&Usuario=
3. POST /pePI/servlet/MarcasServletController
        Action=searchMarca&tipoPesquisa=BY_MARCA_CLASSIF_BASICA
        &marca=TALOS&buscaExata=sim|nao&classeInter=42&registerPerPage=100
```

**Consultas executadas:** exata `TALOS` (todas as classes) → **14 processos** · radical `TALOS`
(todas as classes) → **154 processos** · radical `TALOS` classe 42 → **14** · radical `TALOS`
classe 35 → **47**. Páginas de detalhe abertas para os processos da classe 42.

### 1.2 Classe 42 — serviços de tecnologia e desenvolvimento de software 🔴 BLOQUEADA

| Processo | Depósito | Marca | Situação | Titular | Classe |
|---|---|---|---|---|---|
| **911964932** | 30/05/2016 | **TALOS** | 🔴 **Registro de marca em vigor** | **CISCO TECHNOLOGY, INC.** | NCL(10) **42** |
| **923087966** | 30/11/2020 | **TALOS** | 🔴 **Registro de marca em vigor** | **PROGRESS RAIL SERVICES CORPORATION** | NCL(11) **42** |
| **935698191** | 06/08/2024 | TALOS | ⚠️ **Indeferido** — aguardando recurso | TALOS TRADING, LLC | NCL(12) **42** |
| **916674177** | 03/02/2019 | TALOS THINKING AHEAD | ⚠️ **Indeferido** | TUSCANS PARTICIPAÇÕES LTDA (BR) | NCL(11) **42** |
| 913625922 | 26/10/2017 | Atalos | Registro em vigor | ATALOS GERENCIAMENTO ADMINISTRATIVO LTDA - ME | NCL(11) 42 |
| 928033066 | 15/09/2022 | Atalos Certificados | Arquivado definitivamente | ATALOS CERTIFICACAO DIGITAL LTDA - ME | NCL(11) 42 |

**Detalhe dos dois registros vivos (páginas de detalhe do INPI):**

- **CISCO — 911964932.** Nominativa, natureza *De Serviço*, NCL(10) 42.
  Depósito 25/11/2016 · **Concessão 07/08/2018** · **Vigência até 07/08/2028** (prorrogável
  indefinidamente; prazo ordinário abre 08/08/2027). Prioridade unionista CH 565172016 de 30/05/2016.
  Especificação: *"Serviços científicos e tecnológicos… concepção, projeto e desenvolvimento de
  hardware e software de computador… serviços de informática de proteção anti-vírus; serviços de
  segurança na internet… monitoramento de sistemas de computador."*
  Procurador: MMV Agentes da Propriedade Industrial Ltda.

- **PROGRESS RAIL — 923087966.** Nominativa, NCL(11) 42.
  Depósito 26/05/2021 · **Concessão 30/05/2023** · **Vigência até 30/05/2033**.
  Especificação: *"**Software como serviço** apresentando software para **operação remota e
  automatizada**, monitoramento, análise, diagnóstico, otimização, manutenção, inspeção física,
  geração de alertas, comunicação colaborativa…"*
  → Esta especificação é **mais próxima do negócio do founder que a da Cisco**: é literalmente
  SaaS de operação automatizada de processo.

**O dado decisivo não são os registros — são os indeferimentos.** Duas tentativas de registrar
TALOS em classe 42 foram **negadas** pelo INPI:

- **TUSCANS PARTICIPAÇÕES LTDA**, empresa **brasileira**, pediu **"TALOS THINKING AHEAD"** (marca
  composta, com duas palavras a mais) em 03/02/2019 → **indeferido**. Acrescentar palavras não salvou.
- **TALOS TRADING, LLC**, empresa cujo **nome empresarial é literalmente Talos**, pediu TALOS em
  classe 42 em 06/08/2024 → **indeferido**, hoje aguardando recurso. Ter o nome na razão social
  não salvou.

Isso é o precedente aplicado ao caso concreto: um novo pedido TALOS em classe 42 hoje seria
indeferido com base no art. 124, XIX da LPI (reprodução de marca alheia registrada para
serviço idêntico/semelhante/afim).

### 1.3 Classe 35 — publicidade e gestão de negócios 🟡 SEM `TALOS` EXATO, MAS COM PENDENTE

Nenhum registro de **`TALOS` exato** em classe 35. Porém:

| Processo | Depósito | Marca | Situação | Titular | Classe |
|---|---|---|---|---|---|
| **943211263** | 30/03/2026 | **TALOS SOLUÇÕES INDUSTRIAIS** | ⏳ Aguardando exame de mérito | PEDRO HENRIQUE CORREIA (BR) | NCL(13) **35** |
| 913625620 | 26/10/2017 | Atalos | Registro em vigor | ATALOS GERENCIAMENTO ADMINISTRATIVO LTDA - ME | NCL(11) 35 |
| 941652947 | 22/10/2025 | Atalos | Aguardando exame de mérito | ATALOS GERENCIAMENTO ADMINISTRATIVO LTDA - ME | NCL(12) 35 |
| 926754505 | 25/05/2022 | Talo's Music Produções | Registro em vigor | TALO'S MUSIC PRODUÇÕES | NCL(11) 35 |
| 901799505 | 18/07/2009 | TALO'S JEANS WEAR | Registro extinto | TEREZINHA PIMENTEL PARENTE | NCL(9) 35 |

⚠️ **A classe 35 estar "livre" não resolve nada.** Para uma agência que desenvolve software e
automação, a classe operativa é a **42**. E o registro da Cisco em 42 bloqueia por afinidade mesmo
um depósito feito só em 35 — o art. 124, XIX fala em serviço "idêntico, semelhante **ou afim**".
Registrar em 35 daria uma marca que não cobre o próprio produto e não protege contra a Cisco.

### 1.4 Outras classes com `TALOS` exato (contexto)

| Processo | Depósito | Marca | Situação | Titular | Classe |
|---|---|---|---|---|---|
| 935698159 | 06/08/2024 | TALOS | Registro em vigor (concedido 31/03/2026, vigência até 31/03/2036) | TALOS TRADING, LLC | NCL(12) 36 |
| 923087931 | 30/11/2020 | TALOS | Registro em vigor | PROGRESS RAIL SERVICES CORPORATION | NCL(11) 09 |
| 935698108 | 06/08/2024 | TALOS | Indeferido — aguardando recurso | TALOS TRADING, LLC | NCL(12) 09 |
| 922800871 | 29/04/2021 | TALOS | Registro em vigor | COMERCIAL DX COMPANY LTDA. | NCL(11) 07 |
| 501677514 | 11/08/2022 | Talos | Designação indeferida (mantida em recurso) | TALOS TECHNOLOGY CORPORATION | NCL(11) 11 e 20 |
| 828729948 | 10/05/2006 | Talos | Registro extinto | BIOTRONIK SE & CO KG | NCL(8) 10 |
| 903033070 | 13/10/2010 | Tálos | Indeferido (mantido em recurso) | IZAMAR SANTOS DE MORAIS | NCL(9) 25 |
| 818325640 | 13/02/1995 | TALOS | Arquivado | CRIACOES TALOS LTDA | 25:10 |
| 821909568 | 23/08/1999 | TALO'S | Arquivado | CALCADOS KELLY LTDA | 25:10 |
| 825177600 / 825177596 | 28/11/2002 | TALO' S | Arquivado | IKEDA COMERCIO E INDUSTRIA LTDA | NCL(8) 30 / 29 |

**Placar TALOS no INPI:** 7 registros em vigor · 6 indeferimentos/designações negadas · restante
extinto ou arquivado. É uma marca disputada, não uma marca livre.

---

## 2 · Domínios — disponibilidade real

Fonte `.br`: **registro.br** (autoritativa) — `status:0` = livre, `status:2` = registrado.
Fonte gTLD: **RDAP do registry autoritativo** (Verisign para `.com`, Identity Digital para `.io`/`.ai`,
Google Registry para `.dev`) — HTTP 404 = sem registro, HTTP 200 com evento `registration` = registrado.
Preço `.br`: **R$ 40,00/ano** (registro.br, valor de anuidade divulgado na página de preços).

### 2.1 `.br`

| Domínio | Status | Evidência | Preço |
|---|---|---|---|
| **talos.ia.br** | ✅ **LIVRE** | `status:0` | R$ 40,00/ano |
| **talos.dev.br** | ✅ LIVRE | `status:0` | R$ 40,00/ano |
| **talos.tec.br** | ✅ LIVRE | `status:0` | R$ 40,00/ano |
| **talos.net.br** | ✅ LIVRE | `status:0` | R$ 40,00/ano |
| **talos.eco.br** | ✅ LIVRE | `status:0` | R$ 40,00/ano |
| **talosautomacao.com.br** | ✅ LIVRE | `status:0` | R$ 40,00/ano |
| talos.com.br | ❌ REGISTRADO | NS Locaweb · expira 25/01/2027 | — |
| talos.app.br | ❌ REGISTRADO | NS Cloudflare · expira 22/07/2027 | — |
| usetalos.com.br | ❌ REGISTRADO | NS a.sec.dns.br · DNSSEC · registrado 09/03/2026 · expira 08/03/2027 | — |

### 2.2 gTLDs

| Domínio | Status | Evidência |
|---|---|---|
| **talosautomacao.com** | ✅ LIVRE | Verisign RDAP 404 |
| talos.com | ❌ REGISTRADO | registrado **21/06/1997** · Squarespace Domains II LLC · expira 2033 |
| **talos.io** | ❌ **REGISTRADO** | registrado **13/02/2015** · GoDaddy · titular **Domains By Proxy** · expira 13/02/2027 |
| **talos.dev** | ❌ **REGISTRADO** | registrado **28/02/2019** · Google Registry · expira 28/02/2027 |
| talos.ai | ❌ REGISTRADO | registrado 02/06/2020 · expira 02/06/2028 |
| usetalos.com | ❌ REGISTRADO | registrado 05/06/2026 · NameCheap |
| talos.co | ⚠️ **INCONCLUSIVO** | ver §5 |

### 2.3 🔴 Correção obrigatória de um documento existente

`03-wireframe/WIREFRAME.md` §1.5 (checagem de 26/Jul) afirma:

> | **talos.io** | ✅ livre | · | **talos.co** | ✅ livre | · | **talos.dev** | ✅ livre |

**Duas dessas três afirmações são falsas.** `talos.io` está registrado desde 2015 e `talos.dev`
desde 2019 — ambos com evento `registration` explícito no RDAP do registry autoritativo.

**Causa do erro:** a checagem anterior usou o *bootstrap* `rdap.org`, que devolve **HTTP 404 quando
não consegue rotear a consulta** — o mesmo código que significa "domínio inexistente" no registry.
404 do `rdap.org` foi lido como "livre". Reproduzi o falso-negativo e depois confirmei contra o
registry autoritativo. **Regra:** consultar sempre o RDAP do registry, nunca o agregador.

---

## 3 · Colisão de nome no mercado

### 3.1 🔴 Brasil — mesmo nicho, mesmo país, nome idêntico

Este é o achado mais grave, e é **maior que a questão do INPI**.

| Quem | O quê | Onde | Sobreposição com o founder |
|---|---|---|---|
| **Agência Talos**<br>`agenciatalos.com.br` | Agência de marketing digital. Serviços declarados no site: **criação de site e e-commerce**, **tráfego pago Google Ads e Meta Ads**, SEO, social media, marketing de conteúdo, **automação de marketing** | São Bernardo do Campo / ABC Paulista, SP | 🔴 **Quase total.** "Criação de site" é o serviço de entrada declarado do founder (D4); tráfego pago Google+Meta é o que ele já opera em Bretda/Tocks; automação é o negócio (D5) |
| **TalosIA**<br>`talosia.com.br` | Consultoria em **IA e automação**, treinamentos, engenharia de dados e BI. Alega 10+ anos. WhatsApp +55 11. Tagline: *"IA e Automação com Inteligência e Simplicidade"* | Brasil (SP) | 🔴 **Quase total.** É a descrição literal do posicionamento pretendido |
| **TALOS SOLUÇÕES INDUSTRIAIS** | Pedido INPI 943211263, classe 35, depositado 30/03/2026 | BR | 🟡 Disputa ativa pela marca na outra classe alvo |
| Talos Serviços Operacionais e Administrativos Ltda | Pessoa jurídica com processos listados no JusBrasil | BR | 🟢 Ruído |

**Agência Talos tem presença de SEO estruturada:** além da home, indexam páginas separadas para
`/sobre-a-agencia/`, `/anuncios-no-google/` e `/agencia-de-marketing-no-abc/`, e mantêm Instagram
ativo `@agenciatalos.com.br`. Não é um domínio parado.

> ⚠️ Isso também corrige o `WIREFRAME.md`, que classificou `agenciatalos.com.br` como
> *"parked (dns-parking) · pode cair"*. O domínio pode estar em NS de parking, mas **o negócio está
> vivo e operando no mesmo mercado**. Não é um domínio a ser capturado — é um concorrente homônimo.

### 3.2 Tecnologia global — quem já é "Talos"

| Quem | O quê | Força |
|---|---|---|
| **Cisco Talos** | Braço de threat intelligence da Cisco. `talosintelligence.com`. Equipe de pesquisa de detecção, vulnerabilidades, incident response; alimenta os produtos de segurança Cisco; integrado a Splunk | 🔴 Marca global forte, **e é a titular do registro INPI classe 42 no Brasil** |
| **Talos Linux** (Sidero Labs) | Distribuição Linux imutável para Kubernetes, API-only, sem SSH/shell. `github.com/siderolabs/talos`, plataforma Omni | 🔴 Muito forte no público devops/infra |
| **Talos Automation** (STR Group) | Recrutamento especializado em automação industrial, 12+ anos, EUA/Europa. `talosautomation.com` | 🔴 **Domina a busca "talos automação"** |
| **Progress Rail Talos™** | Automação de trens. Titular do 2º registro INPI classe 42 | 🟡 Nicho distante, mas dono da marca |
| **Talos Trading, LLC** | Infraestrutura de trading de ativos digitais. Registro INPI classe 36 em vigor | 🟡 |
| **Talos Technology Corporation** | Designação Madri indeferida no BR (classes 11 e 20) | 🟢 |

### 3.3 Risco jurídico real para uma agência brasileira de PME

Avaliação honesta, separando o que é risco de verdade do que é ruído:

- **Cisco não vai processar uma agência de PME em Santa Catarina por confusão de consumidor.** Os
  públicos não se encontram. Esse não é o risco.
- **O risco real é estrutural, e são três:**
  1. **O founder não consegue registrar a própria marca.** Com dois registros vivos em classe 42 e
     dois indeferimentos documentados na mesma classe, o pedido seria indeferido. Ele operaria
     permanentemente sem marca — não pode impedir ninguém de usar o nome, não pode registrar, e
     qualquer investimento em brand equity fica sem dono.
  2. **Notificação extrajudicial é barata e provável.** Cisco e Progress Rail mantêm procuradores de
     PI ativos no Brasil (MMV Agentes da Propriedade Industrial figura como procurador nos dois
     processos). Uma carta de cessação após o site ganhar tração custa quase nada para eles e
     forçaria a troca de nome **depois** do investimento em marca, não antes.
  3. **Os concorrentes brasileiros homônimos são o problema comercial imediato.** Um prospect que
     ouvir "Talos" e pesquisar vai encontrar a Agência Talos de São Bernardo ou a TalosIA — duas
     empresas que vendem exatamente a mesma coisa. Isso não é risco de marca; é **perda de lead
     direta**, e acontece desde o primeiro dia.

### 3.4 SEO — o problema concreto

O modelo de negócio do founder é venda consultiva por indicação (`WIREFRAME.md` §1.1: *"curto,
memorizável ao telefone"*). Nesse modelo **o prospect ouve o nome e depois busca**. Se a busca pelo
nome não devolve a empresa, o nome está quebrado como ativo.

| Query | O que domina hoje | Chance de ranquear |
|---|---|---|
| `talos` | Cisco Talos (`cisco.com/…/talos`, `talosintelligence.com`), Talos Linux/Sidero, Talos Energy | ❌ Nenhuma |
| `talos automação` | Talos Automation (STR Group), Progress Rail Talos™, Talos Engineering, LinkedIn/Crunchbase/ZoomInfo de Talos Automation | ❌ Nenhuma — a query exata já tem dono há 12+ anos |
| `talos brasil` / `talos agência` | **Agência Talos** (múltiplas páginas indexadas + Instagram), **TalosIA** | ❌ Dois concorrentes BR já ocupam |

Não existe consulta de marca em que este negócio apareça primeiro. Isso é o oposto do que um nome
deve fazer.

---

## 4 · Impacto nos artefatos pendurados (o motivo de isto ser bloqueante)

| Artefato | Sobrevive à troca? |
|---|---|
| **2,1 MB de fotografia de forja** (`03-assets/fotos/`) | ✅ **SIM.** Verifiquei `CREDITOS.md`: são 6 fotos genéricas do Unsplash — `ferreiro`, `oficina`, `fabrica`, `textura-metal`, `placa-metal`, `esmerilhadeira`. Nenhuma é específica de Talos. Sobrevivem a **qualquer nome no campo semântico forja/metal/indústria** |
| **Cor de marca bronze** (`--bronze: #e9a23b`, `--bronze-2: #c9832a`, `--bronze-dim: #4a3a1e`) | ✅ **SIM**, pela mesma razão — bronze é cor de forja, não de Talos |
| `components/TalosCore.tsx` (objeto 3D que é o nome renderizado) | ❌ Precisa ser refeito com o novo nome — mas o *sistema* (geometria por letra) é reaproveitável |
| `Nav.tsx`, brief de logo | ❌ Refazer (baixo custo) |

**Conclusão prática:** trocar o nome agora custa `TalosCore.tsx` + `Nav.tsx` + brief de logo.
**Não custa a fotografia nem a paleta**, desde que o nome novo fique no registro forja/indústria.
Trocar depois do build custa tudo isso **mais** o site inteiro.

---

## 5 · 🔴 O que NÃO consegui verificar

Honestidade primeiro — isto é o que fica em aberto, e o roteiro para o founder fechar.

### 5.1 `talos.co` — INCONCLUSIVO

O RDAP autoritativo do `.co` (`rdap.nic.co`) não respondeu em 3 tentativas (timeout, HTTP 000).
Endpoints não-autoritativos devolveram 404, o que **não vale como evidência** — foi exatamente esse
o erro que produziu o falso "livre" no `WIREFRAME.md`.

**Roteiro manual (30 segundos):** abrir <https://who.is/whois/talos.co> ou o buscador de qualquer
registrador (GoDaddy/Namecheap) e digitar `talos.co`.
*Nota: mesmo se estiver livre, `.co` não resolve nada — o problema é o INPI e os homônimos brasileiros.*

### 5.2 Busca figurativa e por titular no INPI

Consultei **marca nominativa** por radical e por expressão exata. **Não** rodei:
- busca por **código de figura** (marcas mistas/figurativas contendo TALOS)
- busca por **titular** (para mapear todo o portfólio Cisco/Progress Rail no BR)

Isso não muda o veredito — os bloqueios nominativos já são terminantes — mas é o que faltaria para
um parecer completo de PI.

### 5.3 Opinião jurídica formal

Nada aqui é parecer de advogado. É levantamento de base pública. **Antes de qualquer decisão de
registro**, a leitura deve ser confirmada por agente de PI. O que está documentado acima é
suficiente para uma decisão *de produto* (não usar o nome), não para uma decisão *jurídica*.

### 5.4 Roteiro manual do INPI para o founder (3 minutos)

Caso queira conferir com os próprios olhos — vale a pena, porque é a evidência que sustenta o veredito:

1. Abrir <https://busca.inpi.gov.br/pePI/>
2. Clicar em **"Marcas"** (primeiro quadro do painel de serviços)
3. Na barra superior, clicar em **"Continuar"** / entrar sem login (acesso de convidado — deixar
   usuário e senha em branco)
4. No menu, escolher **"Pesquisa Básica"**
5. Marcar o radio **"Pesquisa Exata"**
6. Campo **"Marca"**: digitar `TALOS`
7. Campo **"Classe"**: digitar `42`
8. Clicar **"pesquisar »"**
9. **O que você vai ver:** `TALOS` — CISCO TECHNOLOGY, INC. — *Registro de marca em vigor* — e
   `TALOS` — PROGRESS RAIL SERVICES CORPORATION — *Registro de marca em vigor*.
   Clicar no número do processo `911964932` mostra vigência até **07/08/2028**.
10. Repetir sem o filtro de classe para ver os 14 processos e os indeferimentos.

---

## 6 · Alternativas — mesmo teste aplicado (INPI + domínio + colisão)

Critério de seleção, além do teste: **preservar os 2,1 MB de fotografia e a paleta bronze**, ou seja
ficar no campo semântico *forja / metal / autômato que trabalha*. Todas foram consultadas no INPI
com a mesma metodologia (busca exata, todas as classes) e no registro.br.

### 6.1 Quadro comparativo

| # | Nome | INPI cl. 42 | INPI cl. 35 | Total de processos | Domínio | Colisão |
|---|---|---|---|---|---|---|
| **1** | **GOLEM** | ✅ **livre** | ✅ **livre** | **1** (arquivado def., cl 32) | `golem.ia.br` ✅ · `golem.app.br` ✅ · `usegolem.com.br` ✅ · `agenciagolem.com.br` ✅ | 🟡 Golem Network (cripto/DePIN), golem.de (news DE) — **nenhum no Brasil, nenhum no nicho** |
| **2** | **CADINHO** | ✅ **livre** | ✅ **livre** | **2** (ambos extintos, 1962 e 1976) | `cadinho.ia.br` ✅ · `cadinho.app.br` ✅ · `usecadinho.com.br` ✅ | 🟢 **Nenhuma** em tech/agência |
| **3** | **BIGORNA** | ✅ **livre** | ✅ **livre** | **4** (1 vivo, cl 32 bebidas) | `bigorna.ia.br` ✅ · `bigorna.app.br` ✅ · `agenciabigorna.com.br` ✅ | 🟢 **Nenhuma** em tech/agência |
| **4** | **MALHO** | ✅ **livre** | ✅ **livre** | **3** (1 vivo: "malhô", cl 41 academia) | `malho.ia.br` ✅ | 🟡 Associação com academia/"malhar" |
| **5** | **DÉDALO** | ✅ **livre** | ✅ **livre** | **1** (vivo, cl 33 vinho) | `dedalo.com.br` ❌ | 🟡 Em português *dédalo* = labirinto |

Testados e **descartados** pelo mesmo método:

| Nome | Por que caiu |
|---|---|
| **HEFESTO** | cl 42: `936644079` HEFESTO ENGENHARIA DO AÇO **indeferido**; `917369262` ENGETOWER *registro nulo*. cl 35: `940327015` pendente de terceiro. 16 processos, 6 registros vivos. `hefesto.com.br` e `hefesto.ia.br` registrados |
| **FORJA** | cl 35 **ocupada**: `924006374` FORJA SERVICOS LTDA, registro em vigor. 16 processos. `forja.com.br` e `forja.ia.br` registrados. Colide também com o squad interno "Forja" do Noyce |
| **TÊMPERA** | cl 35 **ocupada**: `924192011` TEMPERA COMERCIO DE CONDIMENTOS, registro em vigor. 17 processos. Ruído pesado com vidro temperado e tempero |

### 6.2 Recomendação entre as alternativas

**1º — CADINHO.** O mais limpo de todos no INPI: 2 processos na história inteira da base, ambos
extintos, o mais recente de 1976. Classes 42 e 35 completamente livres, zero colisão de mercado,
domínios livres. Semanticamente é preciso: o cadinho é o vaso onde a matéria bruta entra e sai
transformada — que é literalmente o pitch ("seu processo bagunçado entra, sai automatizado"). Mantém
100% da fotografia de forja e do bronze.

**2º — GOLEM.** Conceitualmente é o mais forte de todos: o golem é o ser artificial animado **para
executar trabalho** — a ideia exata que o founder buscou em Talos (autômato que trabalha sozinho),
sem nenhum dos problemas. INPI praticamente virgem, todos os domínios livres. A ressalva é honesta:
existe a Golem Network no mundo cripto, e é uma colisão real — porém **em outro mercado, em outro
país, e sem nenhuma presença brasileira no nicho de automação para PME**. É incomparavelmente menor
que a colisão do Talos (que é dupla: titular do registro na classe do negócio *e* dois concorrentes
homônimos brasileiros no mesmo nicho).

**3º — BIGORNA.** Mais concreto e mais "chão de fábrica" que os dois anteriores — casa muito bem
com o público de indústria/PME declarado em D1. Único registro vivo é em bebidas.

⚠️ **Estas alternativas não estão pré-aprovadas.** O teste acima cobre INPI + domínio + colisão.
A escolha é do founder, e a regra do projeto continua valendo: nome fechado **antes** de refazer
`TalosCore.tsx`, `Nav.tsx` e o brief de logo.

---

## 7 · Resumo executivo

1. **Classe 42 está bloqueada.** Cisco (vigente até 2028, prorrogável) e Progress Rail (até 2033),
   mais dois pedidos TALOS **indeferidos** na mesma classe — um deles de empresa brasileira com
   marca composta, outro de empresa que se chama Talos. O founder não conseguiria registrar.
2. **Duas empresas brasileiras vivas já são "Talos" no mesmo nicho** — Agência Talos (SBC: site +
   tráfego pago + automação) e TalosIA (IA e automação). Esse é o dano comercial imediato, e
   independe do INPI.
3. **SEO é inviável** em `talos`, `talos automação` e `talos brasil` — as três já têm dono.
4. **`WIREFRAME.md` §1.5 contém falsos positivos**: `talos.io` e `talos.dev` estão registrados
   (desde 2015 e 2019). O agregador `rdap.org` devolve 404 quando não roteia, e isso foi lido como
   "livre". Corrigir o documento.
5. **A troca é barata agora**: a fotografia (2,1 MB) e a paleta bronze **sobrevivem** a qualquer
   nome do campo forja/indústria. O custo é `TalosCore.tsx` + `Nav.tsx` + brief de logo.
6. **Aberto:** `talos.co` (registry não respondeu) e busca figurativa/por titular no INPI. Nenhum
   dos dois muda o veredito.

---

### Fontes

- [INPI — Consulta à Base de Dados (pePI)](https://busca.inpi.gov.br/pePI/) — processos 911964932, 923087966, 935698191, 935698159, 916674177, 943211263 e demais listados
- [registro.br — consulta de disponibilidade](https://registro.br/) · [preços](https://registro.br/dominio/precos/)
- RDAP autoritativo: [Verisign (.com)](https://rdap.verisign.com/), [Identity Digital (.io/.ai)](https://rdap.identitydigital.services/), [Google Registry (.dev)](https://pubapi.registry.google/)
- [Cisco Talos](https://www.cisco.com/site/us/en/products/security/talos/index.html) · [talosintelligence.com](https://talosintelligence.com/)
- [Sidero Labs — Talos Linux](https://www.siderolabs.com/talos-linux) · [github.com/siderolabs/talos](https://github.com/siderolabs/talos)
- [Talos Automation](https://talosautomation.com/) · [Progress Rail Talos™](https://www.progressrail.com/en/Segments/RailTechnology/Talos.html)
- [Agência Talos (São Bernardo do Campo)](https://agenciatalos.com.br/) · [Instagram @agenciatalos.com.br](https://www.instagram.com/agenciatalos.com.br/)
- [TalosIA](https://talosia.com.br/)
- [Golem Network (GLM)](https://www.gemini.com/cryptopedia/golem-network-peer-to-peer-computing-power)
