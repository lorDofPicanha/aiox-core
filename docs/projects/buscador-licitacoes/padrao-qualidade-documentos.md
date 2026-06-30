# Padrão de Qualidade dos Documentos — Noyce vs. Proposta Vencedora

**Data:** 30/06/2026 · **Objetivo:** definir o padrão-ouro de uma proposta/habilitação vencedora (Lei 14.133/2021) e mapear, item a item, onde os documentos gerados pelo motor Noyce **já atendem**, **atendem parcial** ou **falham** — para saber onde atacar.

## Fontes do padrão (primárias)

O PNCP **não publica** os documentos do vencedor (só Edital + Aviso/Ato — verificado em 6 compras homologadas). O padrão autoritativo vem de:

1. **Modelos oficiais da AGU** para Lei 14.133 (concorrência/obras) — `gov.br/agu/.../14133`.
2. **ANEXO II de edital real** (Concorrência Barueri/SP) — 15 modelos que o vencedor é obrigado a seguir. `portal.barueri.sp.gov.br/.../Anexo_II_Modelos...pdf` (24 págs, extraído).
3. Checklists de habilitação (ConLicitação, Effecti, TCU 5.5).

## O pacote completo de uma proposta vencedora (15 peças)

| # | Modelo (padrão Barueri/AGU) | Natureza |
|---|---|---|
| A | Termo de aceitação às condições do edital | Declaração |
| B | Pedido de esclarecimentos | Eventual |
| C | Atestado de visita técnica (ou D – renúncia) | Condicional |
| E | **Carta de credenciamento** (representante) | Procuração |
| F | **PROPOSTA COMERCIAL** | Núcleo |
| G | Declaração — não emprega menor (art. 7º XXXIII CF / 68 VI) | Declaração |
| H | Declaração — inexistência de processo falimentar | Declaração |
| I | Declaração — inexistência de fato impeditivo | Declaração |
| J | **Declaração de capacidade financeira** | Declaração |
| K | Declaração de compromisso de garantia | Condicional |
| L | Termo de ciência e notificação | Declaração |
| M | Apólice de seguro-garantia | Anexo externo |
| — | **Habilitação jurídica** (contrato/estatuto social) | Anexo vault |
| — | **Qualificação técnica** (CATs + RTs + registro CREA) | Documento |
| — | **Qualificação econômico-financeira** (balanço + índices) | Documento |
| — | **Regularidade fiscal/trabalhista** (CNDs, FGTS, CNDT) | Anexo vault |

## Marcadores de qualidade (o que separa "rascunho" de "peça vencedora")

Extraídos da prosa real dos Modelos F (proposta) e G–J (declarações):

1. **Cabeçalho formal** — "Prezados Senhores," + endereçada ao órgão/comissão.
2. **Referência ao certame** — "Nos termos do EDITAL e seus ANEXOS, da Concorrência nº [X]…".
3. **Base legal citada** — "para fins do inciso VI, art. 68, da Lei 14.133/2021".
4. **Fórmula de responsabilidade** — "sob as penas da legislação aplicável".
5. **Proposta vinculante** — "vinculante, irrevogável, irretratável e incondicional".
6. **Valor por extenso** — "R$ [•] (valor por extenso)".
7. **Validade explícita** — "validade de 60/180 dias".
8. **Fecho com local e data** — "[LOCAL], [DATA]".
9. **Bloco de assinatura completo** — REPRESENTANTE CREDENCIADO + **RG nº** + **CPF nº** + cargo.
10. **Sem lacuna** em campo assinável (texto pronto, não "[preencher]").

## Mapa Noyce × padrão (onde atacar)

Legenda: ✅ atende · 🟡 parcial · 🔴 falta

| Marcador / Peça | Estado Noyce | Onde atacar |
|---|---|---|
| Corpo das declarações (G, H, I, conflito, PCD, nepotismo, escravo) | ✅ pré-redigido c/ citação legal | — (já forte) |
| Base legal citada | ✅ por declaração | — |
| "sob as penas" | 🟡 em algumas | padronizar em todas |
| **Cabeçalho "Prezados Senhores" + órgão** | ✅ fechado (30/Jun) | envelope formal aplicado |
| **Referência ao certame** no corpo | ✅ fechado | "Ref.: [título] ([órgão])" nas peças |
| **[LOCAL], [DATA]** | ✅ fechado | derivado da sede (CCP) + data |
| **Bloco assinatura: representante + CPF + cargo** | ✅ fechado | Lucas Cardoso Fernandes / CPF / Administrador (RG opcional) |
| Proposta comercial (Modelo F: considerandos, vinculante, validade, extenso) | ✅ fechado (P1) | Proposta Comercial completa + valor por extenso |
| Carta de credenciamento (Modelo E) | ✅ fechado | gerada do representante real |
| Termo de aceitação às condições (Modelo A) | ✅ fechado | gerado do representante real |
| Declaração de capacidade financeira (Modelo J) | 🟡 índices computados, sem a peça-declaração | envelopar como declaração |
| Qualificação técnica (RTs + CATs + matriz) | ✅ preenchida c/ dado real | — (entregue 30/Jun) |
| Qualificação econômico-financeira (índices do balanço) | ✅ computada do balanço real | — (entregue 30/Jun) |
| Habilitação jurídica (contrato social) | 🔴 não listada | anexo vault + item no dossiê |
| Regularidade fiscal (CNDs/FGTS/CNDT) | ✅ listada (anexar vault) | — |

## Prioridade de ataque — situação 30/Jun

1. ✅ **P0 — Envelope formal assinável** (marcadores 1,2,8,9). FEITO: representante legal capturado no perfil (`eniac-ccp.json`) + `signatureBlockHtml` aplicado a todas as peças.
2. ✅ **P1 — Proposta Comercial completa (Modelo F)**. FEITO: considerandos, valor por extenso, validade 60d, piso art. 59.
3. ✅ **P1 — Carta de credenciamento (Modelo E) + Termo de aceitação (Modelo A)**. FEITO: geradas do representante real.
4. 🟡 **P2 — Declaração de capacidade financeira (Modelo J)** como peça (envelopar os índices já computados) + item de **habilitação jurídica** (contrato social/NIRE) no dossiê. PENDENTE.
5. 🟡 **P2 — Padronizar "sob as penas"** em todas as declarações + **RG** do representante (opcional hoje). PENDENTE.

## Dado ainda faltante (menor)

Falta o **RG** do representante (hoje só CPF — suficiente para as declarações da 14.133; o bloco mostra CPF e omite RG). O contrato social / ato constitutivo (habilitação jurídica) é anexo do vault. Os demais campos (representante, sede, NIRE, contador) já estão no perfil.
