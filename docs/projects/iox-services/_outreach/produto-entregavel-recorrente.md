# Produto-cunha: automação de entregável recorrente

**Tese:** o primeiro produto vendido a qualquer empresa não é "IA no negócio" (abstrato,
invendável). É **um documento específico que alguém monta à mão toda semana ou todo mês**.

O relatório mensal de obra é uma instância. O padrão é geral.

---

## O padrão: como reconhecer em qualquer empresa

Procure um entregável com estas 5 propriedades ao mesmo tempo:

| # | Propriedade | Por que importa |
|---|---|---|
| 1 | **Cadência fixa** (semanal/mensal) | Dor repete e é somável: horas × 12 = número anual |
| 2 | **Montado de fontes espalhadas** | Fotos no WhatsApp, número no ERP, prazo no Project, texto na cabeça de alguém |
| 3 | **Formato estável** | Mesma estrutura todo mês = automatizável de verdade |
| 4 | **Tem público** (cliente, banco, diretoria, órgão) | Se alguém cobra, não pode atrasar — dá urgência |
| 5 | **Ninguém gosta de fazer** | Zero resistência política; você não tira o emprego de ninguém, tira o pior pedaço dele |

**Pergunta única que encontra isso:**

> "Que documento alguém aí monta toda semana ou todo mês, juntando informação de vários
> lugares diferentes?"

Todo empresário sabe responder na hora. E a resposta já entrega o escopo do primeiro projeto.

---

## Por que é o produto-cunha certo

**Quantifica sozinho.** "2 dias de engenheiro × 5 obras × 12 meses" é uma conta que o dono faz
de cabeça. Resolve o pré-requisito da Regra dos 10x sem precisar de auditoria.

**Risco baixo, e isso fecha venda.** É relatório, não decisão. Se errar, alguém corrige antes
de enviar. Casa com a regra de "IA prepara, humano aprova" — o medo do empresário é a IA fazer
besteira na frente do cliente dele, e aqui isso não acontece por desenho.

**Antes/depois é visível.** Você mostra o relatório do mês passado, feito em 2 dias, ao lado do
mesmo relatório gerado em 20 minutos. Não precisa de argumento.

**Dá para demonstrar antes de vender.** Pede o material bruto de UM mês e monta o relatório.
É o padrão de tangibilização do `CONTEXT.md` — chegar com a coisa funcionando, não com PDF de
proposta.

**Coloca você dentro do fluxo de dados.** Para gerar o relatório você passa a ingerir foto,
cronograma e medição todo mês. Dessa posição, o segundo produto (custo, medição, cotação) deixa
de ser venda nova e vira extensão. **É por isso que ele é cunha e não produto avulso.**

---

## Exemplo trabalhado: relatório mensal de obra

### O que tem dentro (estrutura real do mercado)

Resumo executivo · **avanço físico** (% previsto vs realizado por frente de serviço, com datas
previstas vs reais) · **registro fotográfico** legendado (local, data, o que mostra, fase) ·
medição e financeiro · cronograma atualizado · ocorrências e pendências · efetivo · segurança ·
anexos (planilha de medição, NF, certificado de material, ensaio).

### Como é feito hoje

Engenheiro ou estagiário gasta 1-3 dias por obra: baixa foto de grupo de WhatsApp e de celular,
separa por frente, escreve legenda uma a uma, puxa cronograma do MS Project, pega número do ERP
ou da planilha, monta em PowerPoint, exporta PDF. Todo mês. Para cada obra.

### Onde entra automação — e onde entra IA

Nem tudo é modelo. Separar isso é o que faz o projeto entregar no prazo:

| Etapa | Como resolve |
|---|---|
| Coletar foto de WhatsApp/Drive/celular | Engenharia comum (integração) |
| **Agrupar foto por frente de serviço e fase** | Visão computacional |
| **Escrever legenda com local, data e etapa** | Modelo + metadado da foto (EXIF/GPS) |
| Puxar cronograma e medição | Integração com a fonte que o cliente já usa |
| **Redigir o texto do avanço e das ocorrências** | Modelo, a partir dos números |
| Montar e diagramar | Template |
| **Revisar antes de enviar** | **Humano. Sempre.** |

### Quanto vale

Se são 2 dias/mês por obra e a construtora toca 5 obras: **10 dias de engenheiro por mês**.
A R$60-100/h isso dá R$5-8k/mês, R$60-96k/ano — só em montagem de relatório, sem contar o
atraso quando o engenheiro está em obra e o relatório fica para a última hora.

Pela Regra dos 10x: setup de **R$15-30k + R$1-3k/mês** de manutenção se paga em meses.

> ⚠️ Esses números são **modelo de cálculo, não medição**. No e-mail e na proposta entram como
> "a conta que eu faria", nunca como "o que você vai economizar". Resultado prometido segue fora.

---

## O mesmo produto em outros setores

| Setor | Entregável recorrente |
|---|---|
| Construtora | Relatório mensal de obra |
| Contabilidade | Fechamento e relatório mensal por cliente |
| Distribuidora | Relatório de vendas, ruptura e giro de estoque |
| Advocacia | Relatório de andamento processual para o cliente |
| Indústria | Relatório de produção, refugo, OEE |
| Clínica / saúde | Relatório de produção e faturamento por convênio |
| Agência / marketing | Relatório de performance para o cliente |

**A estrutura do projeto é a mesma; muda a fonte de dado e o template.** Esse é o ativo
reutilizável — o que protege a margem quando o discurso é "produto sob medida".

---

## ⚠️ O pitch NÃO pode abrir por "isso consome tempo"

Corrigido em 01/Ago após ler [`aiox-site/01-research/02-dores-pme-brasileira.md`](../../aiox-site/01-research/02-dores-pme-brasileira.md)
(pesquisa própria, 28/Jul, fonte institucional primária). O achado que derruba a abordagem óbvia:

> **"Trabalho repetitivo" é dor TOLERADA.** 0 ocorrências espontâneas de "redigitar" ou
> "trabalho repetitivo" em 5.100 comentários. Ausente das 12 edições do Pulso Sebrae
> (n=8.273). O dono conhece a dor, convive com ela há décadas e **não a nomeia**.

Dores que ele trata como **urgentes**: falta de cliente (33%) · custo subiu (31%) · dívida (21%)
· faturamento caindo (−10%; Casa e Construção −11,2%).

### Mas o produto continua certo — muda a porta de entrada

O mesmo corpo de pesquisa valida a automação **no recorte do nosso ICP**, que não é o da amostra
do Sebrae (dominada por MEI/micro):

| Recorte | Achado | Fonte |
|---|---|---|
| **10+ empregados** | **Automação de fluxo de trabalho = aplicação nº 1 de IA (68%)** | CGI.br, TIC Empresas 2025 |
| **Médias industriais** | **85% não acham mão de obra qualificada** | FDC, n=491 |
| Médias em geral | 25% em maturidade de gestão "não estruturada"; 73% têm 20+ anos | FDC |

**As construtoras e distribuidoras porte "Demais" dos lotes 01/02 estão neste recorte, não no do
Sebrae.** Para elas, automação de fluxo já é a aplicação nº 1 — não precisa ser convencida de que
existe, precisa de alguém que faça.

### As três portas que abrem por dor urgente

| Porta | Frase | Por que funciona |
|---|---|---|
| **Não consigo contratar** | "Você acha gente qualificada pra isso?" | 85% das médias industriais dizem não. É dor nomeada. A automação vira "como fazer mais com o time que tem", não "corte custo". |
| **Descubro tarde demais** | "Quando você vê que a obra estourou, dá pra agir ou já era?" | Custo é dor urgente (31%). O relatório mensal é o instrumento de visibilidade — atraso nele **é** o problema de custo. |
| **Meu cliente cobra isso** | "Quem cobra esse relatório de vocês, e o que acontece se atrasar?" | Se há financiador ou contrato exigindo, existe prazo — e prazo cria urgência que "economizar tempo" não cria. |

**Tempo economizado entra depois, como justificativa de preço — nunca como abertura.**

### A oferta de entrada

**"Me manda o material bruto de um mês e eu te devolvo o relatório pronto."** Mais barato de
produzir que um diagnóstico, mais concreto de vender, e já é a demonstração.

> ⚠️ A pesquisa registra também que **"o degrau que ele não pede é 'sistema sob medida'"**.
> Então não vender "produto sob medida" como categoria. Vender **o relatório dele, funcionando** —
> que por acaso é sob medida.

---

## A validar (não sei ainda)

1. Quem hoje monta esse relatório na construtora-alvo — engenheiro, estagiário ou terceirizado.
   Se for terceirizado barato, o valor cai.
2. Se o relatório é exigido por contrato/financiador (aí tem prazo e não pode falhar) ou é
   interno (aí atrasa sem consequência — e a urgência some).
3. Onde as fotos realmente moram. Se estão só no celular do mestre de obras, a ingestão é o
   projeto inteiro.
4. Se já usam Sienge/Mobuss/Obra Prima — parte disso pode já estar coberta, e aí o pitch muda
   de "automatizo" para "integro o que vocês já têm".

**As 3 primeiras conversas são para responder isto, não para vender.**
