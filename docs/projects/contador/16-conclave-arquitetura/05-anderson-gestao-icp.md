# Conclave de Arquitetura — Parecer: Anderson Hernandes (Gestão, Precificação e ICP)

> **Expert:** 📈 anderson-hernandes — Operação, Gestão e Precificação de Escritório Contábil (voz do ICP / dono de escritório)
> **Pergunta:** A arquitetura do core (v0.1→v1.0) sustenta o modelo comercial? O que move a agulha na compra? O que o Renan precisa de demo no dia 30?
> **Data:** 2026-06-11 · **Modo:** análise independente com dado ao vivo (preços pesquisados em jun/2026, fontes no rodapé)
> **Base lida:** `00-context/CONTEXT.md` (D1-D9, §10), `10-prd-core`, `11-arquitetura-core`, `_tmp-comparativo-dump.txt` (planilha do Renan), `15-como-o-mercado-vende-sieg.md`

---

Anderson aqui. Li a arquitetura, li o PRD, li a planilha que o Renan deixou com a Matriz Geral em branco — e fui atrás do preço de cada um dos 8, porque sem número não tem conversa. Vou direto: **a arquitetura técnica está bem pensada para o PRODUTO, mas está muda sobre o que VENDE e o que RETÉM.** Não tem onboarding, não tem prova de valor, não tem medidor da própria métrica de cobrança. Isso a gente conserta barato agora e caro depois. Vamos por partes.

---

## 1. Matriz Geral preenchida (o dever de casa que o Renan deixou)

Pesquisa ao vivo, junho/2026. Onde o preço é oculto, eu digo e estimo pela categoria — que é como o dono de escritório também estima quando recebe a proposta.

| Sistema | Faixa de Preço (jun/2026) | Modelo de cobrança | Foco | Implantação (1-5) | Observações de mercado |
|---|---|---|---|---|---|
| **Tareffa (Ottimizza)** | **Sob consulta** (estimo R$300-800/mês p/ escritório 5-40 pessoas) | **Taxa de adesão + implantação + mensalidade**, sem fidelização; pacote anual com desconto | Gestão de prazos/obrigações + comunicação com cliente + IA (Ottimizza AI) | 3 — exige consultor ("nosso time encontra o melhor plano") | Player técnico maduro, forte em workflow/checklist por serviço e produtividade por departamento. Venda consultiva, demo obrigatória. Cobra implantação à parte — confirma o padrão da categoria. |
| **GClick (Omie)** | **A partir de R$100/mês** (Omie Store) | Mensalidade por escritório, entrada baixa | Gestão de tarefas/obrigações, agenda inteligente, baixa automática de arquivos | 4 — self-service, só precisa de internet | Comprada pela Omie (pós-aporte SoftBank de R$580mi). É o **chão de preço** da categoria. Distribuição pesada via base Omie. Perigo: empurrada "de graça" no ecossistema Omie. |
| **Confi** | **R$250/mês** (tarefas) · **R$500/mês** (tarefas + WhatsApp com IA) | Mensalidade por plano, "a partir de" | Gestão de tarefas contábeis + automação de comunicação | 4 — treinamento por videoconferência + **cadastro de clientes em lote** | 📌 O dado mais importante da matriz: **o WhatsApp com IA DOBRA o preço (R$250→R$500) e o mercado paga.** Prova viva de quanto vale comunicação automatizada pro contador. |
| **MakroSystem** | **R$0 (grátis, 3 empresas) / R$195 / R$295 / R$395 / R$595/mês** | Por plano × nº de empresas (6/12/25/ilimitado); licença adicional R$60-90 | **Outro animal**: sistema contábil COMPLETO (fiscal, contábil, folha, financeiro) | 3 — sistema-mãe, migração de dados dói | Não concorre com a gente nem com Tareffa — concorre com Domínio/Alterdata por baixo. Está na planilha do Renan como **régua de preço**: o dono compara tudo com "quanto custa meu sistema-mãe". Plano grátis = aquisição agressiva. |
| **Acessórias** | **Sob consulta** (estimo R$300-900/mês por faixa de empresas) | Mensalidade por porte, demo obrigatória | Gestão de obrigações + entregas + **app white-label ("com sua cara e sua marca")** + Komunic (WhatsApp) + protocolo digital | 3 — parametrização por departamento/obrigação é trabalhosa | O **líder de categoria** em gestão de obrigações. Vende exatamente o combo das lacunas do Gestorize: app personalizado + WhatsApp + protocolo. É quem define a expectativa do ICP nessa camada. |
| **Nibo** | **R$166-479/mês** (empresa, público); **Nibo Obrigações Plus p/ contador = sob consulta** (descontos de até 40% em campanha) | Por empresa + tarifa por boleto (R$2,99); ecossistema modular | Financeiro + obrigações + **Radar e-CAC** + WhatsApp + NFS-e + MeuApp (portal do cliente) | 2 — ecossistema grande, implantação pesada | O mais completo da lista e o mais perigoso comercialmente: já embute e-CAC (Radar) **dentro** da mensalidade. Faz promoção agressiva ("Black Nibo", 1º mês grátis). Briga pelo bolso do financeiro também. |
| **Neo Controle (Neo Solutions)** | **Sob consulta** (referência interna: produto irmão Neo Fatura = setup R$806 + R$350/mês, usuários/CNPJs ilimitados) | Setup + mensalidade flat ilimitada | Controle de tarefas e obrigações, painéis de gestão, app | 3 — perfil instalador/legado modernizando pra web | Player menor, regional, preço flat "ilimitado" é o argumento. Régua útil: **R$350/mês flat ilimitado** é o que um player simples cobra. |
| **TaskDo** | **Sob consulta** (estimo R$200-500/mês pela categoria) | Mensalidade, demo obrigatória | Rotinas contábeis/fiscal/paralegal, painéis por gestor/equipe, leitura automática de arquivos, protocolo automático | 3 — "de contador para contador", parametrização média | Nicho: painéis exclusivos por departamento (fiscal/pessoal/contábil/societário). Sem músculo de marketing — vive de indicação. |

### A leitura que a matriz dá (e que a planilha vazia escondia)

1. **O corredor R$200-400/mês (CONTEXT §10) está DENTRO do bolso que o ICP já abriu.** O dono de 5-40 pessoas já paga R$100-600/mês nessa categoria. Não é preço que assusta — é preço que ele compara. A briga não é de preço, é de **valor percebido**: na régua "gestão de tarefas" a gente sempre vai perder de Tareffa/Acessórias (anos de feature). Na régua "**a multa de ago/2026 que eu evito**" a gente joga sozinho. **Nunca deixar o Renan vender na régua deles.**
2. **Preço oculto é a norma de quem vende valor** (Tareffa, Acessórias, Nibo contador, Neo, TaskDo — 5 de 8). Quem publica preço é commodity (GClick R$100, Makro R$195). O D7 fala em preço transparente na landing — eu concordo como cunha de diferenciação, MAS transparente na **embalagem por faixa de CNPJ** (doc 15 já reconciliou isso) e com a âncora no ganho, nunca tabela de feature.
3. **Implantação é produto e é receita.** Ottimizza cobra "taxa de adesão + implantação + mensalidade" — explícito no site. Confi faz treinamento por vídeo + cadastro em lote. O mercado INTEIRO monetiza a entrada. O CONTEXT §10 já prevê "implantação (fee, cobre CAC)" — mas a arquitetura não tem UM componente pra isso (volto nisso no §3).
4. **A conta de padaria do nosso preço:** escritório com 100 CNPJs pagando R$300/mês = **R$3 por CNPJ/mês**. O honorário médio dele é R$300-600 por CNPJ. Três reais. Se o laudo mostrar UMA divergência relevante por carteira por mês, a conta fecha com folga obscena. O problema nunca vai ser o preço — vai ser **provar o ponteiro todo mês** (§3.2).

---

## 2. As 21 lacunas: o que move a agulha, o que é higiene, o que é vaidade

A planilha do Renan lista 21 features que concorrentes têm e o Gestorize não. O erro clássico do técnico é tratar isso como backlog ("vamos cobrir tudo"). O empresário contábil pergunta: **qual dessas faz o dono ASSINAR e qual faz ele FICAR?** Minha triagem:

### 🟢 MOVE A AGULHA (ganha o deal — 4 de 21)

| Lacuna | Por quê |
|---|---|
| **Integração oficial do WhatsApp** | O escritório VIVE no WhatsApp — é onde o cliente dele cobra, manda documento e reclama. A Confi provou o preço disso: **dobra a mensalidade (R$250→R$500) e vende**. Acessórias (Komunic) e Nibo também têm. Não é "feature de comunicação", é **o canal onde o valor é percebido**: a divergência que o motor achou só vira valor quando chega no bolso do contador via WhatsApp ("achei R$X na nota do seu cliente Y"). Sem isso, o laudo morre num painel que ninguém abre. ⚠️ Hipótese minha forte; confirmar peso nas entrevistas. |
| **Recálculo automático / auditoria** | É o nosso moat (Auditoria cClassTrib). A planilha confirma que concorrente "tem" recálculo — mas nenhum tem **auditoria da Reforma com trilha de boa-fé**. É a única lacuna onde a gente não alcança o mercado: a gente o ultrapassa. |
| **Diagnóstico fiscal automatizado (e-CAC)** | Já está certo como add-on (D9). Mas atenção comercial: **Nibo (Radar), e-Auditoria (e-Monitor) e Questor (Quiu) embutem e-CAC NA mensalidade**. Cobrar ~R$2k/mês à parte só para de pé se o laudo de carteira mostrar dinheiro/risco concreto, não "consulta de CND". Vender como "diagnóstico da carteira que paga a si mesmo", nunca como "acesso ao e-CAC" — senão o dono compara com o Radar do Nibo que "já vem grátis". |
| **Robôs de leitura automática de documentos** | É a Captura + Documentize. Higiene técnica pro produto, mas na DEMO é o momento mágica ("joguei o XML, ele leu sozinho"). Move agulha na demonstração, não na renovação. |

### 🟡 HIGIENE (precisa ter pra não perder o deal — 8 de 21)

- **Dashboards gerenciais** + **dashboard com desempenho da equipe** + **monitoramento por departamento/colaborador/cliente** — quem assina o cheque é o DONO, e o dono compra "enxergar minha operação". Todo concorrente da matriz tem painel de equipe (TaskDo fez disso o produto inteiro). Sem isso a demo parece ferramenta de analista, não de gestor. MAS: sozinho não fecha deal nenhum — é o que evita a objeção "o Tareffa tem e vocês não". O Gestorize já tem "Dashboard Operacional por Colaborador e Departamento" ✓ — a lacuna real é menor do que a planilha sugere; é polir, não construir.
- **Controle de obrigações contábeis / controle e gestão de tarefas** — o Gestorize já cobre o grosso (Agenda de Tributações ✓, Gerenciamento de Tarefas ✓). Empate técnico; não investir um real além do reuso.
- **Recebimento de documentos + protocolo automático de envio** — higiene da rotina; protocolo é trilha de entrega (e casa com nossa tese de defensabilidade: protocolo = prova de que o escritório entregou). Reusar Gestorize (Envio de Guias ✓, Tratamento de Reenviados ✓) e estender.
- **App personalizado para clientes** — aqui eu divirjo do hype. O cliente final NÃO abre app de contabilidade (uso real baixíssimo — métrica de vaidade clássica). Mas o app white-label é **peça de proposta do CONTADOR pro cliente dele**: faz o escritório de 8 pessoas parecer empresa de tecnologia. Acessórias vende literalmente "com sua cara e sua marca". O Gestorize já tem "Área VIP e Aplicativo" ✓ — manter, rebatizar de white-label de verdade, e NÃO medir sucesso por download de app. É higiene de venda, não driver de uso.

### 🔴 IRRELEVANTE pro nosso posicionamento (9 de 21 — coragem de NÃO fazer)

- **Fluxo de caixa, rateio de despesas/receitas, conciliação inteligente, Nibo Conciliador Open Finance, Nibo BPO Financeiro** — isso é a guerra do FINANCEIRO (Nibo × Conta Azul, gente com dezenas de milhões de funding). O CONTEXT já matou essa briga ("não brigar com gigante de R$1,7bi"). Entrar aqui é dispersão — o pecado que eu mais vejo matar escritório vale pra produto também: **foca no negócio**.
- **Emissão automatizada de NFS-e e boletos** — emissor já está decidido como revenda Fase 3 (D-sequência). Boleto = nunca (é Nibo cobrando R$2,99/boleto, deixa com eles).
- **Agente de varredura de obrigações** + **painéis fiscal/contábil/societário** — versões genéricas do que nosso core já faz melhor e com foco. Não duplicar.

**Resumo da triagem: das 21 lacunas, só 4 ganham deal, 8 evitam perder, 9 são distração.** A planilha do Renan, lida sem filtro, mandaria construir 21 coisas. Lida com filtro de ponteiro, manda construir 1 (WhatsApp como canal de entrega de valor), polir 3 do Gestorize e ignorar 9.

---

## 3. A arquitetura sustenta o MODELO COMERCIAL? Em 70%, sim. Os 30% que faltam são justamente o que vende e retém.

A v0.1 resolve bem o produto (comprar captura, motor+trilha como moat, humano no loop, multi-tenant RLS). Mas li a tabela de componentes do `11-arquitetura-core.md` §2 procurando o que sustenta venda, implantação e retenção — e não achei. Quatro buracos:

### 3.1 ❌ Não existe módulo de Onboarding/Implantação — e implantação é o produto que cobre o CAC

O mercado inteiro cobra implantação (Ottimizza explicita "taxa de adesão + implantação + mensalidade"; o nosso próprio CONTEXT §10 prevê o fee). Mas implantação assistida **sem produto de implantação** vira custo de gente — e com 8 meses de runway e sem braço de suporte, isso mata a margem. O que a arquitetura precisa (e é barato agora):

- **Entidade `implantacao`** por tenant: checklist de etapas (cadastro carteira → procurações → 1ª captura → 1º laudo aprovado), status, responsável, data-alvo. O dashboard interno de "saúde de onboarding" é o que o CS (que ainda não existe) vai operar.
- **Importação em lote** de clientes/CNPJs (CSV/planilha + puxar dados por CNPJ). A Confi faz "cadastro em lote" como argumento de implantação. Escritório de 200 CNPJs não cadastra um a um — se a primeira semana for digitação, o churn começa no dia 1.
- **Onboarding de procuração eletrônica em lote** — o PRD §8 Fase 2 cita "onboarding de procuração em lote" de passagem, mas não é componente na arquitetura. É O gargalo operacional do e-CAC add-on (a mina de R$2k/mês depende de centenas de procurações outorgadas). Precisa de fluxo guiado + tracking de quais CNPJs já outorgaram.

### 3.2 ❌ Não existe o Relatório de Valor Mensal — a prova de valor é o que segura o churn nas DUAS pontas

Esse é o buraco mais caro. O recorrente é o ativo (constraint #5), e recorrente só sobrevive se **todo mês o dono enxergar o ponteiro que o sistema moveu**. Ferramenta que trabalha em silêncio é a primeira a ser cortada quando o caixa aperta — eu vejo isso há 29 anos. E aqui tem uma jogada dupla que ninguém do conclave desenhou:

- **Relatório pro DONO** (nós → contador): "Este mês: X notas capturadas, Y auditadas, Z divergências encontradas, R$W de crédito/risco identificado, N horas de trabalho manual substituídas." É o e-mail que justifica a fatura.
- **Relatório white-label pro CLIENTE FINAL** (contador → cliente dele, com a marca DELE): "Sua contabilidade auditou suas notas este mês e garantiu sua conformidade com a Reforma." Isso transforma nosso produto em **ferramenta de retenção e de aumento de honorário do escritório** — o contador passa a "vender contabilidade sem vender contabilidade" usando o nosso laudo. Quando o nosso relatório vira o argumento do honorário dele, **cancelar a gente custa cliente pra ele**. Esse é o lock-in bom, o que nenhum DPA compra.

Arquitetura: a **trilha de boa-fé já é a matéria-prima** disso (cada apontamento, decisão, timestamp). Falta só um componente "Gerador de Relatório de Valor" (template + agregação mensal por tenant + render com a marca do escritório). Esforço pequeno, é praticamente uma view sobre o que o moat já registra. **Recomendo elevar a requisito de Fase 1, junto com o motor** — porque o Concierge já deveria entregar o laudo NESSE formato, validando o template com escritório real.

### 3.3 ❌ Não existe metering da própria métrica de cobrança

D7 cravou: value metric = **nota auditada**. Então a arquitetura precisa de um componente que **conta, agrega e expõe notas auditadas por tenant/mês** — pra faturar, pra mostrar consumo ("você usou 8.400 das 10k notas do plano"), e pra disparar a conversa de upgrade. Não tem. Sem metering, o pricing por nota vira promessa de slide. Junto: tabela `assinatura/plano` por tenant (hoje o modelo de dados §4 não tem NADA comercial — nem plano, nem status de pagamento, nem trial). Não precisa de billing engine no dia 0 (Stripe/asaas resolve depois), mas o **contador de consumo** precisa nascer com o motor, senão ninguém sabe reconstituir o histórico.

### 3.4 ⚠️ White-label está prometido no pricing e ausente na arquitetura

CONTEXT §10 e PRD §9: "white-label incluso". Na arquitetura: zero menção. White-label real = logo/cores por tenant, e-mails saindo com remetente do escritório, relatório/laudo com a marca dele, subdomínio (escritorio.app.com.br) e — crítico — **nenhuma superfície voltada ao cliente final com a NOSSA marca ou preço**. Isso é coluna no tenant + theming + template de e-mail. Barato agora, refactor doloroso depois. Entra no §5 também.

### ✅ O que a arquitetura JÁ acerta comercialmente (pra registrar)

- Comprar a captura (D2 revisada) — comercialmente certíssimo: o Renan não pode vender um produto cuja demo depende de instalar .exe na máquina do lead. Provider = demo em horas, não dias.
- Observabilidade como feature (heartbeat por CNPJ) — "suporte ruim" é a queixa nº1 da categoria (e a SIEG sofre disso); painel de saúde visível é argumento de venda contra o líder.
- Sem fidelidade + idempotência + XML 15 anos — tudo vendável ("seus dados são seus, guardados por lei, sem multa de saída").

---

## 4. Demo do dia 30: o que o Renan precisa ter na mão (e o que a arquitetura prevê)

O padrão de venda da categoria é **demo consultiva, não preço público** (doc 15, padrão nº4). O Renan vendia SIEG com demo. Então a pergunta certa não é "o que o produto faz no dia 30", é "**o que aparece na tela em 15 minutos de call**". A sequência Concierge → motor → captura está certa pra VALIDAÇÃO (D4), mas o Concierge como está descrito ("XML à mão, laudo nos bastidores") produz um deliverable de consultoria, não uma demo de software. O Renan precisa dos dois. O **Demo Kit do dia 30**:

1. **A isca em 3 passos, ao vivo:** arrasta o XML (Documentize, já existe) → lista de divergências com confiança e R$ estimado → **laudo PDF com a marca do escritório do lead**. Esse é o "momento uau". Mesmo que por trás o motor seja regras parciais + revisão manual nossa (concierge!), a TELA precisa existir. ⚠️ Honestidade calibrada: o Renan diz "análise assistida pelo nosso time nesta fase" — nunca fingir motor pleno; expectativa descalibrada é o pecado que mata a confiança do contador pra sempre.
2. **Painel de carteira com semáforo:** 10-20 CNPJs (dados do piloto, anonimizados ou com autorização), verde/amarelo/vermelho por risco Reforma. O dono compra VISÃO DE CARTEIRA, não nota individual — é a tela que ele se imagina abrindo segunda de manhã.
3. **O Relatório de Valor (§3.2) de um mês de exemplo** — porque a objeção nº1 do dono é "mais um sistema que minha equipe não vai usar"; o relatório responde "esse aqui te manda o resultado todo mês mesmo se ninguém logar".
4. **Uma conta de padaria impressa:** "carteira de 100 CNPJs × R$3/CNPJ/mês vs UMA multa de classificação errada pós-ago/2026 + o crédito que achamos no seu próprio XML na demo". O Renan fecha com essa conta, não com feature list.

**A arquitetura prevê isso? Parcialmente.** Documentize (upload) ✓, motor Fase 1 ✓, laudo existe como conceito no Concierge ✓. Mas ninguém especificou o **laudo como artefato de produto** (template, marca do escritório, R$ no topo) nem o painel-semáforo como entregável da fase Concierge. Recomendação: o Demo Kit é o **critério de aceite da fase Concierge** — não "5 escritórios receberam laudo", e sim "5 escritórios receberam laudo NA TELA que o Renan demonstra pro 6º". Custa quase nada a mais e transforma validação em pipeline.

---

## 5. Conflito de canal (pendência #1): a proteção tem que estar no SCHEMA, não no contrato

O contador adota ferramenta por **confiança** — e a desconfiança nº1 dele com qualquer SaaS que toca o cliente final é "vocês vão me atravessar" (o mercado tem cicatriz disso). Contrato acalma advogado; o que acalma o DONO é ver na ferramenta que é impossível atravessá-lo. Quatro proteções de arquitetura:

1. **Cliente final NUNCA tem conta no nosso sistema.** No modelo de dados §4, `cliente` é registro do tenant, não usuário — manter assim pra sempre. Toda superfície do cliente final (Área VIP/app/relatório) é **do escritório**, brandada como escritório, autenticada contra o tenant do escritório. Nós não temos relação direta com o CNPJ final: tecnicamente impossível, não apenas proibido.
2. **Opacidade de preço estrutural:** nosso preço/fatura/consumo vive em superfície que só papel `admin` do tenant vê. Nenhum template de e-mail, laudo ou tela voltada ao cliente final contém nossa marca, nosso domínio ou qualquer R$ nosso. (O dono faz a conta: ele paga R$3/CNPJ e cobra R$200 de "monitoramento da Reforma" — **a margem dessa revenda é dele, e a ferramenta protege esse segredo**. É ISSO que faz o canal te amar.)
3. **Dados do tenant são do tenant:** export completo + cláusula de não-uso comercial cross-tenant dos dados da carteira (nada de "insights de mercado" vendidos por cima da carteira dos escritórios — é assim que se perde o canal em 6 meses). Benchmarks agregados, só anônimos e opt-in.
4. **Lead inbound de cliente final → roteado pro canal.** Quando a landing pública gerar lead de empresa final (vai gerar), o processo é entregar a um escritório parceiro da região/nicho — vira ARGUMENTO de venda do canal ("ser parceiro dá lead"), em vez de ameaça. Isso é processo + um campo `parceiro_indicado` no CRM, mas nasce da postura de arquitetura: não existe fluxo de signup pra empresa final.

Com isso + white-label real (§3.4), a pendência #1 sai de "risco" pra "feature de venda": *"é o único sistema fiscal onde o seu cliente nunca descobre quanto você paga"*. Eu venderia exatamente com essa frase.

---

## Veredito

**Modelo comercial: o corredor R$200-400 é vendável e está bem posicionado contra a matriz — desde que a venda seja na régua da defensabilidade (multa de ago/2026), nunca na régua de gestão de tarefas, onde Tareffa/Acessórias ganham por W.O.** A arquitetura v0.1 protege o moat certo, mas **vai pra v1.0 só se entrar o andar comercial**: (1) módulo de implantação/onboarding com importação em lote e tracking de procuração; (2) Relatório de Valor mensal nas duas pontas (dono + white-label pro cliente dele) como requisito de Fase 1 — é a feature anti-churn e o melhor lock-in do produto; (3) metering de nota auditada + entidade de plano/assinatura desde o dia 0; (4) white-label e opacidade de preço no schema (proteção de canal estrutural). Do lado do escopo: das 21 lacunas do Renan, construir 1 (WhatsApp como canal de entrega do valor — a Confi provou que isso dobra ticket), polir 3 que o Gestorize já tem, e ter a coragem de ignorar 9 (todo o bloco financeiro). E o critério de aceite do Concierge muda: não é "laudo entregue", é **Demo Kit na mão do Renan no dia 30** — laudo com marca do escritório + painel-semáforo + conta de padaria.

**Fronteira de honestidade:** preços estimados onde o mercado esconde (Tareffa, Acessórias, TaskDo, Neo) estão marcados como estimativa de categoria; o peso real do WhatsApp e do app na decisão do ICP é hipótese minha forte — **confirmar nas entrevistas com contadores antes de fixar roadmap**. Eu oriento a hipótese; quem confirma demanda é o dono de escritório na mesa.

— Anderson. O que importa é o que move o ponteiro: foca no negócio. 📈

---

### Fontes (pesquisa ao vivo, 11/jun/2026)

- Ottimizza/Tareffa: [quanto-custa-ottimizza](https://ottimizza.com.br/quanto-custa-ottimizza/) (adesão+implantação+mensalidade, sem preço público), [gestao-de-servicos-tareffa](https://ottimizza.com.br/gestao-de-servicos-tareffa/)
- GClick: [Omie Store — a partir de R$100/mês](https://store.omie.com.br/apps/omie-g-click), [omie.com.br/gclick](https://www.omie.com.br/gclick/), [Exame — aquisição pós-SoftBank](https://exame.com/insight/omie-compra-startup-g-click-apos-receber-r-580-mi-do-softbank/p)
- Confi: [confi.net.br/precos](https://confi.net.br/precos/) (R$250 / R$500 com WhatsApp+IA; implantação por vídeo + cadastro em lote)
- MakroSystem: [nossos-planos](https://makrosystem.com.br/nossos-planos/) (R$0/195/295/395/595; licença extra R$60-90; sem fidelidade)
- Acessórias: [acessorias.com/site](https://acessorias.com/site/) (sem preço público; app white-label + Komunic WhatsApp + protocolo)
- Nibo: [planos-e-precos (empresa)](https://www.nibo.com.br/empresa/planos-e-precos), [nibo.com.br/contador](https://www.nibo.com.br/contador) (Obrigações Plus sob consulta; Radar e-CAC embutido; campanhas até -40%)
- Neo Controle: [neosolutions.com.br/neo-controle](https://www.neosolutions.com.br/neo-controle), [sistemas.neosolutions.com.br](https://sistemas.neosolutions.com.br/neocontrole.php) (sob consulta; ref. Neo Fatura: setup R$806 + R$350/mês ilimitado)
- TaskDo: [portal.taskdo.com.br](https://www.portal.taskdo.com.br/) (sob consulta; painéis por gestor/departamento)
