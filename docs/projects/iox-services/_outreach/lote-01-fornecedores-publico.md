# Lote 01 — Fornecedores do poder público (SC)

**Dado de contratos:** PNCP `/contratos`, jul/2026 — `scripts/prospect/pncp-sc-suppliers.js`
**Sede + porte + contato:** Receita Federal via `scripts/prospect/enrich-cnpj.js`
**Lista completa enriquecida:** [`prospects-enriquecidos.md`](./prospects-enriquecidos.md) (25 empresas)
**Envio:** 100% humano. Nada aqui dispara sozinho.

---

## Por que o enriquecimento pela Receita não é opcional

Das 25 primeiras da lista bruta, **6 são microempresas** — inclusive a JLM Distribuidora,
que tem **100 contratos em julho**. Volume alto de contrato com porte micro = empresa afogada
que não sustenta R$15k de setup. Sem essa checagem, os primeiros e-mails personalizados
teriam ido para quem não pode comprar.

> **Porte vem da Receita, não de agregador.** Agregador (Econodata etc.) estima headcount e
> erra: classificou a SEBOLD como "micro, 1-10 funcionários" quando a Receita diz "Demais".

Placar dos 25: **9 ⭐ (SC + porte)** · 5 ✅ (fora de SC) · 5 🟡 (EPP) · **6 ❌ (micro)**

---

## Fila de ataque — ⭐ SC + porte que sustenta o ticket

| # | Empresa | Cidade | Contratos jul | E-mail | Telefone |
|---|---|---|---|---|---|
| 1 | **DICAPEL PAPÉIS** | **Blumenau** | 47 · R$ 182k | `blumenau@dicapel.com.br` | (47) 3331-5656 |
| 2 | **ALTERMED** | Rio do Sul | 115 · R$ 253k | `altermed@altermed.com.br` | (47) 3520-9000 |
| 3 | **C & G CONEXÕES** | Lages | 39 · R$ 48k | `licitacao.cgconexoes@gmail.com` | (49) 9193-8635 |
| 4 | PRINTSUL | Guaramirim | 65 · R$ 30k | `printsulatacadista@gmail.com` | (47) 3373-0580 |
| 5 | GOEDERT | Biguaçu | 52 · R$ 24k | `administracao@goedert.com.br` | (48) 3205-2140 |
| 6 | SOMA/SC (Grupo Soma) | Palhoça | 39 · R$ 144k | `contabilidade1.sc@somahospitalar.com.br` | (48) 3348-2629 |
| 7 | SEBOLD COSMÉTICOS | São José | 109 · R$ 147k | — (só telefone) | (48) 4105-3899 |
| 8 | CENTERMEDI (filial SC) | Chapecó | 186 · R$ 580k | `centermedisc@centermedi.com.br` | (54) 3523-2700 |
| 9 | DIMASTER (filial SC) | Chapecó | 44 · R$ 131k | `financeiro@dimaster.com.br` | (54) 3523-2600 |

**Ordem justificada:**
1. **DICAPEL é a #1 apesar de não liderar em volume** — fica em Blumenau. Você pode bater na
   porta. É o único da lista onde a sua vantagem presencial é total, sem custo de deslocamento.
2. **ALTERMED** — maior volume entre as próximas e a 1h de carro. Presencial viável no mesmo dia.
3. **C & G** — o e-mail já é `licitacao@`. Chega direto em quem lê edital, sem triagem de recepção.

**Ressalva nos e-mails genéricos:** `financeiro@` e `contabilidade1.sc@` (SOMA, DIMASTER) não são
o decisor da dor — vão precisar de redirecionamento interno. Converte bem menos. Priorizar os
que têm `licitacao@` ou onde dá pra descobrir o nome no LinkedIn.

---

## ✅ Fora de SC — porte ok, só remoto

PROMEFARMA (Curitiba/PR, 100 contratos) · MEDLIVE (Vera Cruz/RS, 59) · INOVAMED (Erechim/RS, 37)
· CRISTÁLIA (Itapira/SP, 36) · ILG (Pato Branco/PR, 34). Contatos em `prospects-enriquecidos.md`.

Só abordar depois de validar a mensagem nas catarinenses — sem o presencial, a taxa cai e você
queima a lista testando copy.

---

> ⚠️ **Nenhuma peça identifica cidade de origem.** Decisão do founder (01/Ago). Isso removeu
> o gancho "somos da mesma cidade" da DICAPEL — o e-mail abaixo foi reescrito em cima do dado.
> A proximidade continua valendo como *decisão sua* de ir presencialmente; só não se anuncia.

## E-mail pronto — DICAPEL (prioridade 1)

**Para:** `blumenau@dicapel.com.br` · **Assunto:** `47 contratos públicos em julho — e os que não deram em nada?`

```
Bom dia,

Sou o Breno. Construo sistemas de IA dentro de operação — opero duas
indústrias de móveis e desenvolvi um sistema que lê edital do PNCP e
cruza sozinho com os atestados e o portfólio da empresa.

Puxei o dado público do PNCP: a Dicapel fechou 47 contratos com órgãos
públicos em julho, em mais de 40 municípios diferentes.

O número que me interessa é o outro, o que não aparece em relatório
nenhum: quantos editais alguém aí precisou abrir, ler e descartar pra
chegar nesses 47? Essa é a parte que consome uma pessoa o mês inteiro
e nunca vira faturamento.

Não vou prometer resultado — não conheço a operação de vocês. Mas se
quiser, eu te mostro em 20 minutos como mediria esse custo aí dentro.
Presencial ou call, como preferir. Sem apresentação e sem compromisso.

Faz sentido?

Breno de Cerqueira
{telefone}
```

## E-mail pronto — C & G CONEXÕES (vai direto no setor de licitações)

**Para:** `licitacao.cgconexoes@gmail.com` · **Assunto:** `pergunta pra quem lê edital aí na C&G`

```
Bom dia,

Como esse e-mail é o do setor de licitações, vou direto ao ponto com
quem sente o problema.

Sou o Breno. Desenvolvi um sistema que lê edital do PNCP e cruza
automaticamente com os atestados da empresa — separa o que vale
disputar do que é perda de tempo antes de alguém abrir o PDF.

Vi no PNCP que a C&G fechou 39 contratos em julho, em 35 municípios
diferentes. Pra chegar nisso, quantos editais vocês abriram e
descartaram?

Não vou prometer número, não conheço a rotina de vocês. Mas se quiser,
em 15 min eu te mostro como eu mediria essas horas.

Faz sentido?

Breno de Cerqueira
{telefone}
```

---

## Antes de disparar

1. 🔴 **Domínio + SPF/DKIM/DMARC** — ver §7 de [`cold-outreach-v1.md`](./cold-outreach-v1.md).
   Sem isso, e-mail bom vai pra spam do mesmo jeito.
2. 🔴 **Nome do responsável** nas que só têm e-mail genérico (LinkedIn da empresa).
3. 🟡 Opt-out em toda mensagem; se pedir descadastro, remover na hora.
4. 🟡 Máx. 20-30 envios/dia por caixa.

## Correções já aplicadas neste arquivo

- ~~SEBOLD reprovada como micro~~ → **falso**, Receita diz porte "Demais". Está na fila (#7).
- ~~CENTERMEDI é de Barão de Cotegipe/RS~~ → o CNPJ da lista é a **filial de Chapecó/SC**.
