# Fase 2 — Nome, promessa, estrutura e wireframe

**Data:** 2026-07-26
**Base:** `00-context/CONTEXT.md` (decisões) · `01-research/01-ux-conversao-fontes-primarias.md` (achados) ·
`02-references/` (5 capturas reais)
**Restrição:** o nome **AIOX não é usado** (decisão do founder, 26/Jul).
**Fidelidade:** wireframe = **estrutura**, não design visual. O tratamento visual sai na Fase 3/4,
forkando o código capturado + ferramentas de design. Nada de mockup HTML artesanal.

---

## PARTE 1 — NOME

### 1.1 Critérios usados

| Critério | Por quê |
|---|---|
| Português nativo, sem ambiguidade de pronúncia | Público é dono de PME brasileira, não-técnico |
| Fugir do clichê "___ AI" / "___ Tech" | Há milhares. Nome genérico = mais um |
| Sugerir **trabalho que acontece sozinho**, não "inteligência artificial" | O empresário compra resultado, não tecnologia |
| Curto, memorizável ao telefone | Venda é consultiva e por indicação |
| Aguentar a direção visual escolhida (produto tech moderno) | Nome fofo quebra o tom |

### 1.2 Candidatos

| # | Nome | Leitura | Força | Risco |
|---|---|---|---|---|
| **1** | **Contínuo** | Duplo sentido: *contínuo* = sempre ligado **e** o "contínuo" do escritório brasileiro — o funcionário que resolvia as tarefas de todo mundo | 🟢 Altíssima. O duplo sentido é ownable e a segunda leitura é exatamente o produto: um funcionário que faz o trabalho chato | Palavra comum → domínio provavelmente disputado |
| **2** | **Turno** | "O turno que não acaba." Sugere trabalho acontecendo enquanto você não está | 🟢 Curto, forte, industrial — casa com público de indústria/PME | Menos distintivo que Contínuo |
| **3** | **Plantão** | Trabalho fora de hora, cobertura permanente | 🟡 Muito claro para o brasileiro | Conotação médica/hospitalar forte |
| **4** | **Folga** | Não nomeia a máquina, nomeia **o que o cliente ganha** | 🟡 Emocionalmente direto, memorável | Pode soar informal demais para indústria |
| **5** | **Cadência** | Ritmo constante de operação | 🟡 Mais premium e abstrato, casa bem com o visual escolhido | Menos concreto — não nomeia dor nem ganho |

### 1.3 Recomendação

**Contínuo**, com **Turno** como segunda opção.

Motivo: é o único da lista em que o nome já **conta a oferta**. "Contínuo" para um dono de empresa
brasileiro carrega a memória do funcionário que dava conta das tarefas que ninguém queria — que é
literalmente o que está sendo vendido. E a leitura técnica (contínuo = ininterrupto) sustenta o tom
de produto tech.

Assinatura possível: **Contínuo — o trabalho que não para.**

### 1.4 NOME ESCOLHIDO (26/Jul): **TALOS**

Τάλως — o autômato de bronze forjado por Hefesto, que dava três voltas por dia em Creta.
O primeiro autômato da literatura ocidental. Candidatos anteriores (Contínuo, Turno, Esteira, Otto,
Vetor) descartados pelo founder.

### 1.5 Checagem de domínio — executada 26/Jul/2026

**`.br` — fonte: registro.br (autoritativa).** `status:0` = livre · `status:2` = registrado.

| Domínio | Status | Nota |
|---|---|---|
| **talos.ia.br** | ✅ **LIVRE** | ⭐ semanticamente perfeito p/ agência de IA brasileira |
| talos.tec.br | ✅ livre | |
| talos.net.br | ✅ livre | |
| talos.dev.br | ✅ livre | |
| talosautomacao.com.br | ✅ livre | |
| talosbr.com.br | ✅ livre | |
| talos.com.br | ❌ registrado | NS Locaweb · expira 25/01/2027 |
| talos.app.br | ❌ registrado | NS Cloudflare · expira 22/07/2027 |
| talosia.com.br | ❌ registrado | NS Cloudflare · expira 05/04/2028 |
| agenciatalos.com.br | ❌ registrado | **parked (dns-parking) · expira 28/10/2026** — pode cair |
| talostech.com.br · usetalos.com.br | ❌ registrado | |

**gTLDs — fonte: RDAP dos registries.** `404` = livre · `200` = registrado.

| Domínio | Status |
|---|---|
| **talos.io** | ✅ livre |
| **talos.co** | ✅ livre |
| **talos.dev** | ✅ livre |
| talos.com · talos.ai · talos.digital · gettalos.com · usetalos.com | ❌ registrados |
| talos.app · talos.work · talos.systems | ⚠️ inconclusivo (sem resposta RDAP) |

> ⚠️ RDAP 404 indica ausência de registro, **não é garantia de compra**. Confirmar no registrador
> antes de fechar.

### 1.6 Colisão de marca — encontradas 3 relevantes (verificadas)

| Quem | O que é | Risco para este projeto |
|---|---|---|
| **Cisco Talos** | Grupo de threat intelligence da Cisco (Fulton, MD). Alimenta os produtos Cisco Secure | 🟡 alto se o projeto tocar segurança; baixo em automação p/ PME brasileira |
| **Talos Linux** (Sidero Labs) | Distro Linux para Kubernetes, sem SSH. 538 empresas usando | 🟡 alto se tocar devops/k8s |
| **Talos Energy** (NYSE: TALO) | Óleo e gás, Golfo do México, fundada 2012 | 🟢 setor sem sobreposição |

**Consequência prática:** SEO para a palavra "talos" pura é inviável — a SERP é de Cisco e Sidero.
Irrelevante nesta fase: ninguém busca "talos" procurando agência de automação. O inbound virá de
termos de dor ("automação de processos", "site para empresa"), não de marca.

### 1.7 INPI — ❌ NÃO CONCLUÍDA

Duas tentativas de consulta programática ao `busca.inpi.gov.br/pePI/`. Sessão criada com sucesso,
mas o backend retorna erro próprio do INPI:

```
Banco de Marcas inacessível momentaneamente.
Erro: java.sql.SQLException: Null SQL statement
```

**Pendente — verificação manual (3 min, gratuita, sem cadastro):**
1. `busca.inpi.gov.br` → menu **Marca** → **Busca por Marca**
2. Termo `TALOS`, tipo de busca **Radical** (pega variações e fonética)
3. Filtrar **Classe de Nice 42** (serviços de tecnologia/software) e **35** (serviços de negócio/publicidade)
4. Marca com ícone ® na coluna *Situação* = registro em vigor. Verificar também **pedidos em andamento**

> Marcas iguais podem coexistir em classes diferentes — o que importa é colisão em 42 e 35.

---

## PARTE 2 — A PROMESSA (os 10 segundos)

### 2.1 O problema estrutural que a promessa precisa resolver

O negócio é **automação de workflow**. A porta é **construção de site**. Se o hero vende site, vira
commodity. Se vende automação, o visitante não entende por que a primeira oferta é um site.

**A ponte:** o site **é** o primeiro workflow automatizado — é por onde o lead entra. Não é produto
de entrada arbitrário; é o primeiro elo real da corrente. Isso torna a escada coerente em vez de
oportunista.

### 2.2 Promessa recomendada

> # O trabalho repetitivo da sua empresa não precisa de gente.
> **Eu construo as máquinas que fazem esse trabalho sozinhas — e a primeira delas é o seu site.**

**Por que funciona:**
- Nomeia a dor na língua do dono ("trabalho repetitivo"), não em jargão ("automação de processos com IA")
- Entrega a oferta completa em duas linhas — dentro da janela de 10s medida pela NN/g
- A segunda linha resolve a ponte site→automação sem parecer desconto
- Não promete número que não pode provar

### 2.3 Alternativas testáveis depois (A/B quando houver tráfego)

- "Sua equipe está fazendo o que uma máquina faria melhor." *(mais confrontador)*
- "Quantas horas por semana a sua empresa gasta em trabalho que se repete?" *(pergunta — bom para tráfego frio)*
- "Automatizo o que trava a sua operação. Começando pelo seu site." *(mais direto, menos emocional)*

---

## PARTE 3 — ESTRUTURA DE SEÇÕES

9 seções. Densidade de referência: Resend faz 15 seções em 12.273px sem cansar — 9 é conservador
e deixa espaço para a grade de portfólio crescer.

| # | Seção | Função | Ref. capturada | Achado que sustenta |
|---|---|---|---|---|
| 1 | **Hero** | Promessa + gatilho do demo | resend (ritmo) | 10s decidem |
| 2 | **O problema** | Reconhecimento | trigger.dev | Reconhecimento é o mecanismo de conversão |
| 3 | **Demo ao vivo** | **A prova** | liveblocks | Processo é prova — ver o trabalhador trabalhando |
| 4 | **Como funciona** | Processo em 3 passos | trigger.dev `/product` | Mostrar todos os estágios, não só o resultado |
| 5 | **Por onde começa** | A porta (site) | clerk (densidade) | Upfront disclosure — escopo claro, sem preço |
| 6 | **O que mais dá pra automatizar** | A escada | trigger `/ai-agents` | Cobertura estreita afasta |
| 7 | **Quem faz** | Pessoa por trás | resend | Conexão com o resto da web |
| 8 | **Prova** *(cresce)* | 2–3 sinais hoje, portfólio depois | railway | 1–3 trust signals = +23%; 7+ = −8% |
| 9 | **CTA final** | Conversa | clerk | Formulário longo gera atrito |

---

## PARTE 4 — WIREFRAME SEÇÃO A SEÇÃO

> Notação: `[ ]` botão · `▓` mídia/demo · `───` régua · `·` item de lista

### § 1 — HERO
```
┌──────────────────────────────────────────────────────────┐
│  ● {nome}                    o que faço   contato    [→] │
│ ─────────────────────────────────────────────────────── │
│                                                          │
│   O trabalho repetitivo da sua                           │
│   empresa não precisa de gente.                          │
│                                                          │
│   Eu construo as máquinas que fazem esse trabalho        │
│   sozinhas — e a primeira delas é o seu site.            │
│                                                          │
│   [ ver funcionando ]   [ falar comigo ]                 │
│                                                          │
│   ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓    │
│   ▓  demo compacto já visível — não é imagem estática ▓  │
│   ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓    │
└──────────────────────────────────────────────────────────┘
```
**Regras duras:**
- Headline **sem delay de animação**. Legível no frame 1. A janela é de 10s; queimar 3s revelando
  texto é queimar 30% dela.
- O demo começa **acima da dobra**, mesmo que compacto. É a prova, não pode estar enterrada.
- Sem número inventado, sem "+500 clientes", sem logo de cliente que não é cliente.

**Ref:** `resend/pages/home` — ritmo vertical e respiro do hero.

---

### § 2 — O PROBLEMA (reconhecimento)
```
┌──────────────────────────────────────────────────────────┐
│  Você reconhece algum desses?                            │
│  ───────────────────────────────────────────────────     │
│                                                          │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐           │
│  │ Mensagem   │ │ Alguém     │ │ A mesma    │           │
│  │ chega às   │ │ digita a   │ │ planilha   │           │
│  │ 22h e      │ │ mesma      │ │ preenchida │           │
│  │ ninguém    │ │ coisa em   │ │ toda       │           │
│  │ responde   │ │ 3 sistemas │ │ segunda    │           │
│  └────────────┘ └────────────┘ └────────────┘           │
│                                                          │
│  Nenhum desses problemas é de tecnologia.                │
│  São de processo — e processo se automatiza.             │
└──────────────────────────────────────────────────────────┘
```
**Por quê:** o dono de PME não pensa "preciso de IA". Ele pensa "tô perdendo cliente no WhatsApp".
Reconhecimento — não amplitude — é o que converte. Cada card é uma cena concreta, não um benefício
abstrato.

**Ref:** `trigger/pages/home` — como explicar workflow para quem não é engenheiro.

---

### § 3 — DEMO AO VIVO ← **a seção mais importante do site**
```
┌──────────────────────────────────────────────────────────┐
│  Não vou te contar. Olha acontecendo.                    │
│  ───────────────────────────────────────────────────     │
│                                                          │
│  ┌─────────────────────┐  ┌───────────────────────────┐ │
│  │  VOCÊ ESCREVE        │  │  A MÁQUINA POR DENTRO     │ │
│  │  ┌───────────────┐   │  │  ─────────────────────    │ │
│  │  │ "oi, queria   │   │  │  ✓ mensagem recebida      │ │
│  │  │  um orçamento"│   │  │  ✓ intenção: orçamento    │ │
│  │  └───────────────┘   │  │  ✓ dados faltando: 2      │ │
│  │       [ enviar ]     │  │  ⟳ gerando resposta...    │ │
│  │                      │  │  ✓ registrado no CRM      │ │
│  │  ← resposta aparece  │  │  ✓ dono notificado        │ │
│  └─────────────────────┘  └───────────────────────────┘ │
│                                                          │
│  Isso rodou agora, no seu navegador. Não é vídeo.        │
└──────────────────────────────────────────────────────────┘
```
**Por que o painel da direita é obrigatório:** achado central da NN/g para serviços — em teste com
empresa de limpeza, os usuários queriam ver **os trabalhadores em ação**, não só o quarto impecável;
as fotos precisam mostrar **todos os estágios**, não só o resultado.

Chatbot que só responde é resultado. **O painel mostrando o raciocínio é o trabalhador trabalhando.**
É o que substitui o case que ainda não existe.

**Ref:** `liveblocks/pages/home` — demo embutida na página como mecanismo principal.

---

### § 4 — COMO FUNCIONA
```
┌──────────────────────────────────────────────────────────┐
│  Três passos. Sem mistério.                              │
│  ───────────────────────────────────────────────────     │
│                                                          │
│  01 ──────────  02 ──────────  03 ──────────            │
│  A gente olha    Eu construo    Roda sozinho             │
│  sua operação    a máquina      e eu cuido               │
│                                                          │
│  · o que se      · escopo       · manutenção             │
│    repete          fechado        mensal                 │
│  · quanto tempo  · prazo        · ajuste conforme        │
│    consome         definido       a operação muda        │
│  · o que dá      · você vê                               │
│    pra tirar       antes de                              │
│                    aprovar                               │
└──────────────────────────────────────────────────────────┘
```
**Por quê:** com portfólio vazio, *como você trabalha* vende mais que *o que você construiu*.
Escopo e prazo visíveis atacam o medo real do empresário — projeto eterno que não entrega.
Upfront disclosure sem revelar preço.

**Ref:** `trigger/pages/product` — estrutura de explicação em etapas.

---

### § 5 — POR ONDE COMEÇA (a porta)
```
┌──────────────────────────────────────────────────────────┐
│  Começa pelo seu site.                                   │
│  ───────────────────────────────────────────────────     │
│                                                          │
│  Porque é onde o cliente entra — e o primeiro trabalho   │
│  repetitivo de qualquer empresa é atender quem chega.    │
│                                                          │
│  ┌──────────────────────────┬───────────────────────┐   │
│  │ O que está incluso       │ O que vem depois      │   │
│  │ ─────────────────────    │ ─────────────────     │   │
│  │ · site completo          │ · agente de           │   │
│  │ · estrutura mobile       │   atendimento         │   │
│  │ · SEO técnico            │ · integração com      │   │
│  │ · formulário que         │   CRM / WhatsApp      │   │
│  │   funciona               │ · automação dos       │   │
│  │ · manutenção mensal      │   processos internos  │   │
│  └──────────────────────────┴───────────────────────┘   │
│                                                          │
│  [ quero começar por aqui ]                              │
└──────────────────────────────────────────────────────────┘
```
**Regra:** **nenhum valor nesta seção** (decisão do founder). A coluna da direita existe para plantar
a escada sem empurrar. O CTA leva a conversa, não a checkout.

**Ref:** `clerk/pages/pricing` — densidade de informação sem assustar (o layout, não o preço).

---

### § 6 — O QUE MAIS DÁ PRA AUTOMATIZAR (a escada)
```
┌──────────────────────────────────────────────────────────┐
│  Depois que o site está no ar, o resto aparece.          │
│  ───────────────────────────────────────────────────     │
│                                                          │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐        │
│  │ Atendimento │ │ Processos   │ │ Sistema     │        │
│  │             │ │ internos    │ │ sob medida  │        │
│  │ responde,   │ │             │ │             │        │
│  │ qualifica,  │ │ o que sai   │ │ quando não  │        │
│  │ registra    │ │ de um       │ │ existe      │        │
│  │             │ │ sistema e   │ │ ferramenta  │        │
│  │             │ │ entra em    │ │ que sirva   │        │
│  │             │ │ outro       │ │             │        │
│  └─────────────┘ └─────────────┘ └─────────────┘        │
└──────────────────────────────────────────────────────────┘
```
**Por quê:** achado da NN/g — cobertura estreita afasta cliente ("empresa de mudança que parecia só
fazer corporativo espantou o residencial"). Amplitude fica **aqui**, depois do reconhecimento e da
prova. Não no hero.

**Ref:** `trigger/pages/product__ai-agents`.

---

### § 7 — QUEM FAZ
```
┌──────────────────────────────────────────────────────────┐
│  ┌──────┐                                                │
│  │ foto │   {nome do founder}                            │
│  │ real │   Construo sistemas há {X} anos. Hoje faço     │
│  └──────┘   isso para empresas que não têm time de TI.   │
│                                                          │
│             [ LinkedIn ]  [ GitHub ]                     │
└──────────────────────────────────────────────────────────┘
```
**Por quê:** 4º fator de credibilidade — *conexão com o resto da web*. Site isolado de redes,
reviews ou imprensa lê como **não-estabelecido ou suspeito**. Todo participante do estudo disse que
pesquisaria antes de contratar.

**Seção curta e obrigatória.** Você disse que não quer falar de si — e não precisa falar de
resultado. Mas precisa **existir**, com rosto e link verificável. Anonimato custa mais que modéstia.

**Pré-requisito:** LinkedIn e GitHub precisam estar apresentáveis **antes** do site ir ao ar. Link
para perfil vazio é pior que link nenhum.

---

### § 8 — PROVA *(seção que cresce)*

**Hoje — 0 cases:**
```
┌──────────────────────────────────────────────────────────┐
│  ┌────────────────┐ ┌────────────────┐                  │
│  │ Escopo e prazo │ │ Não gostou,    │                  │
│  │ fechados       │ │ não paga       │                  │
│  └────────────────┘ └────────────────┘                  │
└──────────────────────────────────────────────────────────┘
```
**Em 3 meses — 5+ cases:** mesma faixa, vira grade de portfólio (print + segmento + o que foi
automatizado).

**Regra rígida — Baymard:** **2 a 3 sinais, nunca mais.** 1–3 tipos convertem **+23%** vs. nenhum;
**7+ convertem −8%** vs. 1–3. Empilhar selo destrói prova.

**Isso é design de estado vazio, e é onde site de agência quebra:** grade de portfólio com 1 item
parece abandono. A seção precisa parecer intencional com zero cases e não exigir redesenho com dez.

**Ref:** `railway/pages/home`.

---

### § 9 — CTA FINAL
```
┌──────────────────────────────────────────────────────────┐
│  Me conta o que se repete na sua empresa.                │
│  ───────────────────────────────────────────────────     │
│                                                          │
│  ┌──────────────────────────────────────┐               │
│  │ seu nome                             │               │
│  │ WhatsApp                             │               │
│  │ o que mais consome tempo hoje?       │               │
│  │                          [ enviar ]  │               │
│  └──────────────────────────────────────┘               │
│                                                          │
│  Ou chama direto: [ WhatsApp ]                           │
└──────────────────────────────────────────────────────────┘
```
**Três campos, não sete.** Formulário longo gera atrito (NN/g). O terceiro campo é o mais valioso —
qualifica e já alimenta a conversa de venda.

**Detalhe que fecha o argumento do site inteiro:** este formulário deve ser atendido **pelo mesmo
agente do demo da §3**. O visitante vê a máquina funcionando na §3 e é atendido por ela na §9. A
demonstração e a entrega viram o mesmo objeto — que é exatamente o modelo de negócio (D5).

---

## PARTE 5 — REGRAS DE MOTION

Aplicadas a todas as seções. Toda animação precisa passar no teste: **"isso explica algo ou move alguém?"**
Se não passa, sai.

| Onde | Permitido | Proibido |
|---|---|---|
| Hero | Nada que atrase a headline | Texto entrando por scroll-scrub, preloader, vídeo de fundo pesado |
| Demo §3 | Estado real do processamento (é informação, não enfeite) | Animação falsa simulando trabalho que não está acontecendo |
| Transições de seção | Fade/translate curto ao entrar no viewport | Parallax pesado, pin de scroll, transição de página |
| Cards | Hover sutil | Card virando, tilt 3D |

**Justificativa honesta:** a evidência sobre motion aumentar conversão vem majoritariamente de
material de agência de motion design vendendo motion design — não é estudo. O que se sustenta é
que animação sem função distrai da conversão, e que público B2B anda cético com produção polida
demais. Por isso a régua é restritiva.

---

## PARTE 6 — O QUE ESTE WIREFRAME ASSUME (e pode estar errado)

| # | Suposição | Se estiver errada |
|---|---|---|
| A1 | O demo do §3 é **atendimento/qualificação de lead** | Se o founder preferir outra automação, §3 e §9 mudam de conteúdo — a estrutura fica |
| A2 | Existe LinkedIn/GitHub apresentável para linkar | Sem isso, §7 enfraquece e o 4º fator de credibilidade fica descoberto |
| A3 | Founder aceita foto e nome no site | Se não, §7 vira "quem faz" institucional e perde força |
| A4 | 9 seções é a densidade certa | Ajustável após o primeiro build — Resend sustenta 15 |

---

## PARTE 7 — PRÓXIMOS PASSOS (Fase 3)

1. [ ] Founder escolhe o nome entre **Contínuo** e **Turno** → checar domínio e INPI
2. [ ] Founder confirma qual automação vira o demo da §3 (suposição A1)
3. [ ] Rodar `shoot.cjs` nas 5 referências → baseline de screenshot para comparação A/B
4. [ ] Extrair tokens (cor, tipo, escala, espaçamento) do CSS capturado — **do código, não de print**
5. [ ] Levantar assets: fontes, ícones, imagens — bibliotecas em `mcp-design-studio` (Iconify, Unsplash, Google Fonts)
6. [ ] Só então: build forkando o código real (`build-fork.cjs`), com comparação lado a lado antes de dar por pronto
