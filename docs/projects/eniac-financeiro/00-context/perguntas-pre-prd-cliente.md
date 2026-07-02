# Perguntas para a ENIAC — antes de desenhar a plataforma financeira

> Para o founder levar ao grupo ENIAC (sócios + contador). Sem essas respostas, o desenho do
> produto fica no escuro em pontos que mudam radicalmente a arquitetura e o risco jurídico.
> Versão cliente (linguagem simples) + o porquê (interno).

---

## Bloco 1 — Sobre as 3 empresas (uma resposta por empresa)

**1.1** Qual o **regime tributário** de cada uma das 3 empresas? (Simples Nacional — e qual anexo? / Lucro Presumido / Lucro Real)

**1.2** Qual o **porte/faturamento aproximado** de cada uma?

**1.3** As empresas **distribuem lucro aos sócios**? Se sim, alguma distribui **acima do percentual de presunção** (ou seja, mais do que o "lucro presumido" da tabela)?

> *Por que importa (interno):* decide se a contabilidade de partida dobrada é **exigência legal**
> (Lucro Real, ou distribuição acima do presumido → escrituração regular obrigatória) ou só escolha
> técnica nossa. E define quais obrigações (ECD/ECF/SPED) o sistema precisa alimentar.

---

## Bloco 2 — O papel da ferramenta e do contador

**2.1** Hoje, **quem cuida da contabilidade** das 3 empresas? É um contador interno ou um escritório externo?

**2.2** Esse contador usa **algum sistema contábil próprio** (Domínio/Thomson Reuters, Calima, Sage, Conta Azul, etc.)?

**2.3** O que vocês esperam da nossa ferramenta: ela deve **ser a contabilidade** (gerar os livros oficiais), ou deve **organizar o financeiro e entregar um relatório/extrato conciliado** que o contador usa no sistema dele?

> *Por que importa (interno):* se for "extrato + relatório para o contador", a partida dobrada vira
> infra invisível de reconciliação (baixo risco jurídico) e a gente NÃO se posiciona como "a
> contabilidade". Se for "ser o livro", entra discussão séria de responsabilidade técnica e CRC.

---

## Bloco 3 — Quem assina e quem responde

**3.1** Quem **assina as obrigações fiscais** (ECD/ECF, apurações) hoje? O contador responde tecnicamente por isso?

**3.2** Vocês esperam que o sistema **emita** alguma peça/declaração, ou apenas **prepare e organize** para o contador emitir e assinar?

**3.3** As 3 empresas têm **relação de controle entre si** (uma controla as outras / holding), ou são **3 empresas do mesmo dono** sem relação societária formal?

**3.4** Existem **operações entre as 3 empresas**? (uma vende/empresta/rateia despesa com a outra) Se sim, com que frequência?

> *Por que importa (interno):* mapeia o risco de "ato privativo do contador" (o copiloto não pode
> aplicar imposto/atestar conformidade). E a relação entre as empresas + operações intercompany
> definem o tratamento anti-DDL/preço-de-transferência e se uma "visão consolidada" é lícita ou vira
> passivo (grupo econômico de fato, responsabilidade solidária).

---

### Quando as respostas chegarem
Com isso destravado → PRD calibrado (@pm) + ADRs + schema (@data-engineer) a partir dos vereditos do
conclave (`conclave/00-sintese-conclave.md`). Em paralelo, dá pra rodar o **trial grátis da Pluggy**
(14 dias, até 20 contas) ligando as 3 contas PJ pra validar cobertura/categorização na prática.
