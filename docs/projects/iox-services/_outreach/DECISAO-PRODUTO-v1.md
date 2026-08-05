# Decisão de produto — v1 FECHADA

**Data:** 02/Ago/2026 · **Base:** 7 fontes, 6 agentes de pesquisa (`research/00-SINTESE-CONSOLIDADA.md`)
**Status:** decisão. Onde a pesquisa não determinou, está marcado como **[DECISÃO]** — é escolha, não achado.

---

## 1. A decisão em uma tabela

| | |
|---|---|
| **Produto** | Diário de obra por WhatsApp que agrega em relatório mensal de prestação de contas |
| **Nome interno** | RDO Conversacional |
| **Comprador** | Construtora com **4+ obras simultâneas** e **obrigação de prestar contas a um terceiro** |
| **NÃO é para** | Empreiteiro pequeno, arquiteto autônomo, obra única, PME informal |
| **Interface** | WhatsApp. Sem app, sem login, sem treinamento. |
| **Avanço físico** | **Declarado no áudio pelo mestre.** Nunca inferido de imagem. |
| **Preço** | Setup R$ 18.000 + R$ 390/obra/mês (mínimo 3 obras) |
| **Piloto** | 60 dias, 3 obras, R$ 4.500 — abatido do setup se seguir |

---

## 2. Por que este produto e não outro

Quatro fontes independentes convergiram no RDO como ponto de entrada: a matriz de complexidade
do relatório executivo (alto impacto/baixa complexidade), o portfólio internacional (**única
solução com complexidade "Baixa" pura**, cliente "obras de qualquer porte"), a pesquisa de dores
de PME (WhatsApp = 82% dos negócios, 3,9h/dia) e a existência do Zé Obra em produção.

E é a **única arquitetura compatível com as 4 barreiras medidas do canteiro brasileiro**:

| Barreira | Dado | Por que esta arquitetura sobrevive |
|---|---|---|
| Rotatividade | **65,66%/ano** (CAGED) vs 34,74% da média | Não exige treinamento — quem entra amanhã já sabe usar WhatsApp |
| Informalidade | **68%** (PNAD/IBGE) | Não exige trabalhador no sistema formal |
| Terceirização em cascata | — | Não exige que o mesmo subempreiteiro continue |
| Escolaridade | — | Não exige letramento além do que já existe |

> Não é a arquitetura mais sofisticada. É a única que sobrevive ao canteiro real.

---

## 3. Escopo v1 — o que ENTRA

**Captura (WhatsApp, iniciada pelo mestre):**
- Foto → armazenada, associada a obra e data de recebimento
- Áudio → transcrito (Whisper), vira texto do apontamento
- Texto → apontamento direto
- **Localização** → mensagem nativa de Localização do WhatsApp, **passo separado**
- Lembrete diário proativo (única mensagem paga)

**Processamento:**
- Transcrição PT-BR do áudio
- Classificação da foto por **frente de serviço declarada no áudio** — a IA associa, não adivinha
- Clima do dia (INMET, com fallback manual — ver §8)
- Agregação diária → semanal → mensal

**Saída:**
- RDO diário em PDF, enviado para revisão
- **Relatório mensal de prestação de contas** — capa, resumo, avanço por frente, registro
  fotográfico legendado, ocorrências, efetivo, próximos passos
- Revisão e aprovação humana **obrigatória** antes de qualquer envio externo

---

## 4. O que fica FORA — e por quê

| Fora do v1 | Motivo, com evidência |
|---|---|
| **Avanço físico inferido de imagem** | CV para avanço **agregado ainda é pesquisa**; nenhum modelo pronto classifica fase construtiva; treinar exigiria ~7.500 fotos rotuladas |
| **Geolocalização automática da foto** | ⚠️ **Testado: o WhatsApp remove o EXIF/GPS.** Só via mensagem de Localização separada |
| **Detecção de EPI por câmera** | Melhor acurácia (90-98%, Fang 2018) **e** pior encaixe legal — é monitoramento de trabalhador; anonimizar rosto derruba ~7pp |
| **Previsão de custo/prazo** | MAPE entre 0,9% e 28% na literatura — impossível prometer |
| **Integração com ERP** | Alonga ciclo de venda e cria dependência do TI do cliente. Só Sienge e Mobuss têm API — **fase 2** |
| **Agente de compras / cotação** | Alto valor, mas exige cadastro de fornecedor + ERP |
| **Qualquer coisa com drone** | ICA 100-40 (DECEA, 01/jul/2026) acabou com a isenção de SARPAS: todo voo exige autorização |

---

## 5. Comprador — critério de qualificação

**Entra (os 4 obrigatórios):**
1. **4+ obras simultâneas** — abaixo disso a conta de horas não fecha o ticket
2. **Presta contas a um terceiro** — cliente contratante, financiador, órgão público, sócio investidor.
   É isso que cria prazo, e prazo cria urgência
3. Porte Receita **"Demais"** ou EPP com contrato milionário (ver ressalva do lote 02)
4. Alguém identificável responsável por montar o relatório hoje

**Sai:**
- Obra única · empreiteiro que só executa · arquiteto autônomo · PME informal
- Quem já usa Sienge/Mobuss **com o módulo de RDO ativo** — aí o pitch muda para integração

> **Por que não PME:** a pesquisa achou 10+ concorrentes de RDO digital operando há mais de uma
> década **sem consolidação**. Padrão: "entra fácil, não consolida, não define preço."
> Incompatível com o piso de R$15k do `00-context/CONTEXT.md`. E todo cliente nomeado de
> tecnologia de campo no Brasil é grande (Cyrela, Brookfield) — **nenhum caso de PME**.

---

## 6. Preço **[DECISÃO]**

```
SETUP                    R$ 18.000
├── Diagnóstico + linha de base (dias 1-15)
├── Implantação, template e fluxo de aprovação
└── 1ª obra no ar + treinamento do responsável (não do campo — campo não precisa)

RECORRENTE               R$ 390 / obra / mês  (mínimo 3 obras = R$ 1.170/mês)

PILOTO                   R$ 4.500 — 60 dias, 3 obras, abatido do setup se seguir
```

**Custo real de operação (pesquisado):** IA R$15-20/mês para 3 obras · WhatsApp quase zero por
desenho (o mestre inicia; só o lembrete diário é template pago) · BSP oficial R$0-499/mês.
**Margem bruta acima de 80%** em qualquer cenário.

**A tensão que preciso declarar:** pela Regra dos 10x do `CONTEXT.md`, uma construtora com 5 obras
economizando ~10 dias de engenheiro/mês (R$58-96k/ano) justificaria R$6-10k — **abaixo do piso de
R$15k**. Por isso o corte em **4+ obras** e a exigência de prestação de contas a terceiro: o valor
não é só hora economizada, é **prazo cumprido e risco contratual**. Se o prospect não presta contas
a ninguém, o produto vale menos e não deve ser vendido por este preço.

---

## 7. Escada da oferta

| Etapa | O que é | Preço | Objetivo |
|---|---|---|---|
| **1. Demonstração** | "Me manda o material bruto de um mês e eu te devolvo o relatório pronto" | Grátis | Tangibilização. Prova antes de proposta. |
| **2. Piloto** | 60 dias, 3 obras, com linha de base medida | R$ 4.500 | Gerar o número dele. Abatido do setup. |
| **3. Contrato** | Setup + recorrente | R$ 18.000 + R$ 390/obra | — |
| 4. Extensão | Copiloto de documentos · integração ERP · agente de compras | — | Só após 3 meses estáveis |

---

## 8. Cláusulas não-negociáveis de contrato

Derivadas dos padrões de fracasso mapeados:

1. **Propriedade do dado definida por escrito ANTES do piloto.** Foto, áudio e relatório são do
   cliente; exportação garantida; formato aberto. *(Lição Sidewalk Labs: o piloto não morre no
   piloto, morre na escala, quando ninguém decidiu de quem é o dado.)*
2. **Nenhuma promessa de percentual.** O contrato promete **medir** o antes e o depois, não
   entregar X%. *(A construtora média já viu fornecedor prometer e não entregar.)*
3. **Revisão humana obrigatória** antes de qualquer envio externo. A IA prepara, o responsável aprova.
4. **A IA não assume responsabilidade técnica.** Não dimensiona, não libera, não assina.
5. **Escopo e preço fechados.** *(A pesquisa de PME registra que a falha que o dono conta não é
   técnica — é promessa quebrada e preço que muda.)*
6. **Sem BSP não-oficial.** Z-API e similares usam sessão de WhatsApp Web e arriscam ban do número
   do cliente. Só 360dialog, Chatpro (Oficial) ou Cloud API direta.
7. **LGPD:** finalidade declarada, minimização, retenção definida. Sem reconhecimento facial,
   sem câmera, sem monitoramento de produtividade individual.

---

## 9. Abordagem — as três portas

Nunca abrir por "isso consome tempo": trabalho repetitivo é **dor tolerada** (0 ocorrências
espontâneas em 5.100 comentários; ausente das 12 edições do Pulso Sebrae).

| Porta | Frase de abertura |
|---|---|
| **Não consigo contratar** | "Você acha gente qualificada pra montar isso?" — 85% das médias industriais dizem não (FDC) |
| **Descubro tarde** | "Quando você vê que a obra atrasou, dá pra agir ou já era?" |
| **Meu cliente cobra** | "Quem cobra esse relatório de vocês, e o que acontece se atrasar?" |

Restrições de copy do founder, valendo para toda peça: **não prometer resultado entregue** ·
**não identificar cidade de origem** · caso de terceiro só com fonte e nível de evidência.

---

## 10. Métricas do piloto

Medir **antes** de começar, senão não há piloto — há opinião.

| Indicador | Antes | Depois |
|---|---|---|
| Horas/mês montando RDO e relatório | | |
| % de relatórios entregues no prazo | | |
| Dias entre fim do mês e relatório pronto | | |
| Nº de apontamentos por obra por semana | | |
| **Taxa de uso pelo mestre** (dias com envio ÷ dias úteis) | — | **a métrica que mais importa** |

> A última é a decisiva. Toda a pesquisa aponta que **o fracasso mora na adoção de campo, não na
> acurácia do modelo** (Song & Song 2026, *Organization Studies*). Se o mestre não manda, nada
> mais importa.

---

## 11. Critérios de morte — assinar ANTES do piloto

- Taxa de uso pelo mestre **< 50%** dos dias úteis no mês 2 → o produto não sobrevive ao canteiro
- Cliente não consegue informar a linha de base → não é comprador, é curioso
- Zero prospect aceita o piloto pago em 15 conversas → o comprador está errado, não a copy
- Custo de operação por cliente **> R$ 500/mês** → a margem que justifica o modelo não existe

---

## 12. Pendências antes da primeira proposta

1. 🔴 **Preço do template WhatsApp em BRL por categoria** — calculadora da Meta é 100% JS, não
   extraível. Capturar manualmente. *(Faturamento em BRL para WABAs BR começou 01/jul/2026;
   migração obrigatória até 30/jun/2027.)*
2. 🔴 **Escolher BSP** — 360dialog vs Chatpro (R$499/mês) vs Cloud API direta. Muda o custo fixo por cliente.
3. 🟡 **WER do Whisper em PT-BR com ruído de canteiro** — não confirmado na pesquisa (PDF do paper
   não renderizou; não foi estimado). Testar com áudio real antes de prometer transcrição.
4. 🟡 **INMET instável** — endpoint testado ao vivo, com reset de conexão e resposta vazia.
   Prever preenchimento manual de clima como fallback.
5. 🟡 Domínio de envio + SPF/DKIM/DMARC para o outreach (ver `cold-outreach-v1.md` §7).
