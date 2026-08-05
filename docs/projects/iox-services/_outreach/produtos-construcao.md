# Produtos de IA para construtoras — mapa de necessidades

**Corrige:** `lote-02-construtoras.md`, que assumiu "triagem de edital" como dor. Isso foi
hipótese minha, não do mercado — e vem de eu ter usado o PNCP como fonte de lista e confundido
o critério de sourcing com o problema do cliente. **Licitação está fora do escopo aqui.**

**Tese correta:** produto de IA construído para a necessidade real de cada empresa.
**Restrição de margem:** arquétipos reutilizáveis vestidos por cliente — não desenvolvimento
do zero a cada contrato (ver `00-context/CONTEXT.md`: "cada cliente recebe um squad customizado").

---

## Onde o dinheiro vaza numa construtora

Seguindo o fluxo da operação, do orçamento à entrega:

| Etapa | O que consome | Por que a IA entra bem |
|---|---|---|
| **Orçamento / proposta** | Engenheiro lê projeto, extrai quantitativo, precifica | Documento estruturado + tabela de referência = trabalho mecânico disfarçado de técnico |
| **Cotação de insumos** | Ping-pong de e-mail com fornecedor, planilha de comparação | Entrada não estruturada (e-mail, PDF, WhatsApp) → saída estruturada |
| **Compatibilização de projetos** | Conflito entre arquitetônico / estrutural / elétrico / hidráulico | Erro que só aparece na obra custa retrabalho — detectar antes é caro de fazer na mão |
| **Medição** | Levantar executado vs previsto para faturar | Divergência de medição trava recebimento |
| **Custo real vs orçado** | Ninguém vê o desvio até o mês fechar | Onde a margem morre — e onde alerta antecipado vale muito |
| **Diário de obra e NRs** | Registro, foto, ASO, ordem de serviço, treinamento | Puramente burocrático, alto volume, risco de multa |

**A aposta:** orçamento e cotação são as duas de maior retorno. Estão a montante da margem
(erro ali contamina a obra inteira) e o custo é fácil de quantificar — dias de engenheiro
por proposta, número de propostas por mês.

---

## Arquétipos de produto (reutilizáveis)

### P1 — Motor de orçamento
Lê projeto e memorial (PDF/planilha), extrai quantitativo, cruza com tabela de preço
(SINAPI/composição própria), devolve orçamento com rastreabilidade item→origem.
**Vende para:** quem monta muita proposta. **Métrica:** dias de engenheiro por proposta.
**Customização por cliente:** composições próprias, BDI, formato de saída.

### P2 — Mesa de cotação
Dispara RFQ para fornecedores, normaliza resposta (e-mail/PDF/WhatsApp/planilha),
monta mapa comparativo, sinaliza fora-da-curva.
**Métrica:** horas de comprador + delta de preço capturado.
**Customização:** base de fornecedores, categorias, regra de aprovação.

### P3 — Sentinela de custo
Compara realizado vs orçado por centro de custo e **alerta o desvio quando ainda dá pra agir**,
não no fechamento.
**Métrica:** desvio detectado em dias, não meses. **Depende de:** integração com o ERP do cliente.

### P4 — Compatibilizador de projeto
Cruza disciplinas e aponta conflito antes da obra.
**Métrica:** retrabalho evitado. **Ressalva:** o mais técnico e o mais caro de construir —
não é o primeiro a fazer.

### P5 — Dossiê de obra
Diário, foto, medição e documentação de NR num fluxo só, com relatório pronto para fiscalização.
**Métrica:** horas de administrativo + risco de multa. **O mais fácil de entregar rápido.**

> **Regra de margem:** o squad por trás de P1..P5 é o mesmo ativo. O que muda por cliente é
> composição, integração e formato. Se um contrato exigir arquitetura nova, ou é P&D pago à
> parte, ou é não.

---

## Como descobrir a necessidade de CADA empresa

Não dá para saber qual dos cinco vender antes de olhar a operação. É o diagnóstico pago
(já proposto em sessão anterior): **R$3-5k, 2 semanas**, saída = mapa de processo + sangria
quantificada + qual arquétipo ataca + proposta de setup. Abatido do setup se fechar.

Ele resolve três coisas ao mesmo tempo: gera o número que a Regra dos 10x exige, evita
construir para dor imaginada — **o erro que eu mesmo cometi assumindo triagem de edital** — e
faz o cliente pagar para ser qualificado.

---

## Como isso muda a copy

O e-mail não pitcha produto. Pitcha **a pergunta que revela a dor**:

> "Quantos dias de engenheiro custa uma proposta de vocês? E quantas propostas por mês?"

Se ele responde, você já sabe se é P1. Se disser "o problema não é orçamento, é que o custo
estoura na obra", é P3. **A resposta escolhe o produto** — por isso a abertura é pergunta,
não catálogo.

---

## O que precisa ser validado (não sei ainda)

Isto é raciocínio sobre operação de construtora, **não pesquisa de campo**. Antes de virar oferta:

1. Qual desses cinco os construtores de SC **reconhecem** como dor cara — pode ser nenhum.
2. Que ERP usam (Sienge? Mega? planilha?) — decide se P3 é viável ou fantasia.
3. Se orçamento é feito internamente ou terceirizado — se for terceirizado, P1 morre.
4. Porte mínimo que sustenta R$15k+.

**As 3-5 primeiras conversas são pesquisa, não venda.** Quem tenta vender antes de saber a
resposta do item 1 constrói para dor imaginada — exatamente o que este documento corrige.
