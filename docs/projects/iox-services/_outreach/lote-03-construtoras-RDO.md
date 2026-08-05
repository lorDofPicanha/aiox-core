# Lote 03 — Construtoras (produto: RDO / relatório de obra)

**Substitui o `lote-02-construtoras.md`**, que foi escrito na hipótese de triagem de edital —
descartada pelo founder. Mesma lista, produto e pitch diferentes.
**Produto:** `DECISAO-PRODUTO-v1.md` · **Envio:** 100% humano.
**Copy:** sem promessa de resultado · sem identificar cidade de origem.

---

## Por que a lista do PNCP serve a este produto

Não porque vendemos licitação. Porque quem executa obra pública **tem obrigação contratual de
prestar contas ao órgão**: medição mensal, acompanhamento físico-financeiro e diário de obra.

Isso satisfaz o critério de qualificação nº2 da decisão de produto — *presta contas a um terceiro* —
que é o que cria **prazo**, e prazo é o que cria urgência. Uma construtora que só faz obra privada
para cliente pouco exigente pode atrasar relatório sem consequência. Esta não pode.

> ⚠️ **Verificar antes de usar como gancho:** a obrigatoriedade contratual do diário de obra em
> obra pública é prática corrente, mas eu **não confirmei** o dispositivo legal exato nesta sessão
> (orçamento de busca esgotado). Não afirmar "a lei exige" sem checar. Perguntar funciona melhor
> de qualquer forma: *"quem cobra esse relatório de vocês?"*

---

## Duas correções de método aplicadas nesta lista

**1. Removidos fornecedores de material.** Minha regex de obras capturava ATRIUM (ferragens),
FOCO ELÉTRICA, INSTALART, ROTTA (materiais de construção) — empresas que vendem *para* obra, não
executam obra. Filtro corrigido: nome com termo de execução, sem termo de comércio/distribuição.

**2. Contagem de contrato NÃO mede obras simultâneas.** O PNCP só enxerga contrato **público**.
Construtora com 2 contratos de R$3M quase certamente tem obra privada também. Por isso a
qualificação usa **valor**, não número de contratos.

---

## Fila de ataque

⭐ = SC + porte Receita "Demais" · 🟡 = EPP (**em obra, EPP não significa pequena** — contrato é
plurianual, o porte reflete receita declarada, não valor contratado)

| # | Empresa | Cidade | Valor jun+jul | E-mail | Telefone |
|---|---|---|---|---|---|
| 1 | ⭐ **ENGENFOX TERRAPLANAGENS** | Pomerode | R$ 6,18M | **`engenharia@engenfox.com.br`** | (47) 9116-2422 |
| 2 | ⭐ **JR CONSTRUÇÕES E TERRAPLANAGEM** | Içara | **R$ 21,45M** | — buscar no site | — |
| 3 | ⭐ VERSA ENGENHARIA AMBIENTAL | Joinville | R$ 4,05M | `contatoadmempresas@outlook.com` | (47) 3438-0036 |
| 4 | ⭐ GAIA RODOVIAS | Maravilha | R$ 6,89M | `xml@gaiarodovias.com.br` | (49) 3664-2022 |
| 5 | ⭐ CONSTRUTORA NUNES | Criciúma | R$ 4,25M | — buscar | — |
| 6 | 🟡 FATOR3 ENGENHARIA | Joinville | R$ 5,49M | `sik.fator3@gmail.com` | (47) 9974-1507 |
| 7 | 🟡 PINTURAS E OBRAS LITORAL | Sombrio | R$ 5,46M | `pinturaslitoral@gmail.com` | (48) 9943-4232 |
| 8 | 🟡 MAGNUS ENGENHARIA E ARQUITETURA | Itajaí | R$ 1,67M | `magnus@magnusengenharia.com.br` | (47) 3349-9330 |
| 9 | 🟡 POLARIS SERVIÇOS E CONSTRUÇÕES | Blumenau | R$ 2,10M | `polarisservicos@hotmail.com` | (47) 3329-1117 |
| 10 | ⭐ GM INSTALADORA | Canoinhas | R$ 2,83M | `gm_instaladora@hotmail.com` | (47) 3621-0107 |
| 11 | 🟡 GRS ENGENHARIA | Blumenau | R$ 2,73M | — buscar | — |
| 12 | 🟡 LH TERRAPLENAGEM E CONSTRUÇÕES | Joinville | R$ 577k | `terraplenagemlh@gmail.com` | (47) 3424-6101 |

**Prioridade 1 é a ENGENFOX, não a maior.** `engenharia@` chega direto no setor que sofre com o
relatório — não passa por recepção nem por financeiro. A JR Construções tem 3,5× mais valor
(R$21,45M) e vale o esforço de achar o contato, mas o e-mail dela não está na Receita.

**Não usar sem checar:** VIGO (`adm@twelvecontabilidade.com.br`) e BRITAFER
(`contabilidade@conferconstrutora.com.br`) — o e-mail cadastrado é do **contador**, não da empresa.
Mandar pitch de IA para o contador da construtora é desperdício.

---

## A abertura — e o que NÃO fazer

❌ **Não abrir por "isso consome tempo".** Trabalho repetitivo é dor **tolerada**: 0 ocorrências
espontâneas em 5.100 comentários, ausente das 12 edições do Pulso Sebrae. Ninguém compra solução
para dor que não nomeia.

✅ **Abrir por prazo e por prestação de contas.** Estas empresas têm um órgão cobrando.

---

## E-mail 1 — ENGENFOX (prioridade)

**Para:** `engenharia@engenfox.com.br`
**Assunto:** `quem monta o relatório de medição aí na Engenfox?`

```
Bom dia,

Sou o Breno. Construo sistemas de IA dentro de operação — opero duas
indústrias e desenvolvo automação de processo para empresas.

Uma pergunta específica, e é por isso que escrevi pra engenharia e não
pro comercial: quem monta o relatório de acompanhamento e a medição
que vocês entregam ao órgão todo mês?

Pergunto porque, nas operações que abro, esse relatório costuma ser
montado no fim do mês por um engenheiro garimpando foto em grupo de
WhatsApp e tentando lembrar o que aconteceu na segunda semana. Funciona,
mas consome a pessoa mais cara da equipe justo quando ela deveria estar
em obra.

O que eu faço é inverter: o apontamento vira uma foto e um áudio de 30
segundos por dia, no WhatsApp que o pessoal já usa, e o relatório do mês
se monta sozinho a partir disso. Sem app novo, sem treinar ninguém.

Não vou prometer número — não conheço a operação de vocês. Mas se
quiser, eu monto o relatório de UM mês com o material bruto que vocês
já têm e te mostro pronto. Sem custo e sem compromisso.

Faz sentido?

Breno de Cerqueira
{telefone}
```

**Por que funciona:** fala com engenharia · a pergunta é específica e respondível ·
descreve a dor sem acusar · a oferta é uma demonstração, não uma reunião ·
sem promessa de resultado · sem cidade.

---

## E-mail 2 — variante "não acho gente" (para 4+ obras)

**Assunto:** `uma pergunta sobre o time de engenharia`

```
Bom dia,

Sou o Breno, construo automação de processo dentro de operação.

Pergunta direta: vocês conseguem contratar engenheiro e técnico na
velocidade que as obras exigem?

Pergunto porque 85% das médias industriais dizem que não (pesquisa da
Fundação Dom Cabral com 491 empresas). E quando falta gente, a primeira
coisa que atrasa não é a obra — é o relatório, a medição, o diário.
O trabalho que só o time qualificado consegue fazer.

O que eu faço é tirar a parte mecânica disso da mão deles: o
apontamento diário entra por WhatsApp — foto e áudio, sem app novo — e
o relatório do mês se monta a partir do que já foi registrado. O
engenheiro revisa e aprova, em vez de montar do zero.

Não prometo resultado, não conheço a operação de vocês. Mas posso
montar o relatório de um mês com o material que vocês já têm, pra você
ver funcionando antes de qualquer conversa comercial.

Faz sentido?

Breno de Cerqueira
{telefone}
```

> O dado da FDC (85%, n=491) é de terceiro e está citado **com fonte** — é o padrão permitido:
> caso alheio com origem, nunca resultado próprio.

---

## Ordem de execução

1. Achar o nome do responsável por engenharia/planejamento nas 12 (LinkedIn da empresa)
2. Buscar o e-mail de **JR Construções**, **Construtora Nunes** e **GRS** — não estão na Receita
3. Configurar domínio + SPF/DKIM/DMARC (`cold-outreach-v1.md` §7) — **bloqueia o disparo**
4. Enviar 5/dia, na ordem da fila, com opt-out em todas
5. Registrar resposta e objeção em planilha — as 3 primeiras conversas são **pesquisa**, não venda

## O que medir

| | Meta inicial |
|---|---|
| E-mails enviados | 12 |
| Taxa de resposta | 5-12% em B2B frio bem feito = 1-2 respostas |
| Aceite da demonstração ("manda o material de um mês") | ≥1 |

Se 12 e-mails derem 0 resposta, o problema é lista ou assunto — não a copy. Se derem resposta mas
ninguém aceitar a demonstração, o problema é a oferta. Diagnósticos diferentes.
