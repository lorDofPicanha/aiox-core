---
title: Perfil da ENIAC — CCP, RTs, acervo, financeiro, teto solo
docId: eniac-perfil
tags: [eniac, ccp, identidade, cnpj, crea, rt, alice, rodrigo, acervo, cat, financialsnapshot, patrimonio-liquido, teto-solo, me-epp]
audience: agents
sourceRefs:
  - docs/projects/buscador-licitacoes/02-architecture/26-modelo-habilitacao-motor-viabilidade-acervo-real-04jun.md
  - apps/noyce/lib/data/eniac-ccp.json
  - apps/noyce/lib/noyce-habilitation.ts
---

## Identidade canônica (verificada no balanço)

| Campo | Valor |
|---|---|
| Razão social | ENIAC EMPREENDIMENTOS LTDA |
| CNPJ | 36.819.268/0001-05 |
| NIRE | 52600939599 (Junta GO) |
| Registro CREA-GO | 39711 |
| Porte / Regime | **ME · Simples Nacional** |
| Sede | Águas Lindas de Goiás-GO (CEP 72916-051) |
| Administrador | Lucas Cardoso Fernandes (CPF 028.045.341-89) |
| Contador | Arisneto Ribeiro Gonçalves (CRC-GO 024935) |

É a **única empresa-licitante** (single-company). O modelo é multi-tenant-ready, mas o onboarding materializa 1 organização + 1 empresa.

> Fonte: doc 26 §0.

## Estrutura do CCP (Company Capability Profile)

O CCP é o "vault" estruturado da ENIAC — o estado persistido que todas as abas consultam (`eniac-ccp.json`). Camadas:
- **`CompanyIdentity`** — dados acima, imutável-ish.
- **`TechnicalProfessional[]`** — os RTs (engenheiros), com `vinculo` (gate da técnico-profissional).
- **`Acervo[]`** — CATs/CAOs/atestados, cada um com `itens[]` (serviço canônico + qtd + unidade).
- **`FinancialSnapshot[]`** — um por exercício (a capacidade econômico-financeira é temporal).
- **`RegularityDoc[]`** — CNDs, CRF/FGTS, contrato social, SICAF.

**Invariante:** todo campo carrega proveniência (`fonte` + `arquivoRef`).

> Fonte: doc 26 §2.A.

## Responsáveis técnicos (RTs)

Dois RTs distintos, dois acervos profissionais diferentes:
- **Alice Ramos Silva** — Engenheira Civil, CREA-GO 1022381563. Acervo: REFORMA CEO (R$103k), MESTRE ZEZITO (R$587.860, execução).
- **Rodrigo Piloto Amaro** — CREA-DF 23733. Acervo: ESCOLA EDNALDA GUEDES (R$886.828,39), PRAÇA (R$473.300), TOPOGRAFIA (ART, serviço).

**Gate da técnico-profissional:** a CAT só vale para a ENIAC se o RT estiver no quadro técnico no momento da habilitação. Vínculo sem formalização é **SANÁVEL** — declaração de contratação futura basta (exigir CLT é ilegal).

> Fonte: doc 26 §1.1 (tabela de acervos), §2.A(b), §3.1.

## Acervo técnico (quantitativos-chave)

| Acervo | RT | Tipo | Valor | Quantitativos-chave |
|---|---|---|---|---|
| REFORMA CEO (CAT 1020250004388) | Alice | Reforma (público) | R$103.000 | edifício alvenaria 208,90 m²; pintura 480 m²; impermeab. 242,54 m² |
| MESTRE ZEZITO (CAT 1020260001207) | Alice | Execução (SCB Engenharia — privado, **Corresponsável**) | R$587.860 | edifício alvenaria 1.613,12 m² + estrutura metálica + rede hidro-sanitária |
| ESCOLA EDNALDA GUEDES | Rodrigo | Execução (público) | R$886.828,39 | edifício alvenaria 1.622,59 m² + laje pré-moldada + concreto armado + reservatório aço 30 m³ |
| PRAÇA (CAT 1020250002836) | Rodrigo | Execução (público) | R$473.300 | terraplenagem 3.000 m²; drenagem 500 m²; pavimentação concreto 3.000 m; elétrica BT 75 kVA; concreto 75 m³; paisagismo 150 un |
| TOPOGRAFIA (ART 1020240151967) | Rodrigo | Serviço (público) | — | terraplenagem/parcelamento solo/urbanismo 21.829 m² |

Notas: MESTRE ZEZITO tem `participacaoTecnica: Corresponsável` — âncora real do Modo Consórcio. Exemplo de **somatório** de alvenaria: 1.613,12 (Zezito) + 1.622,59 (Ednalda) = 3.235,71 m². **Pendência D-26.2:** a ENIAC só tem CATs profissionais; o **CAO operacional** (atestado em nome da PJ) ainda não veio.

> Fonte: doc 26 §1.1, §2.A(c), §3.2.

## Snapshot financeiro e teto solo dinâmico

| Exercício | Receita Bruta | Resultado | Patrimônio Líquido |
|---|---|---|---|
| 2024 | ~R$0 (pré-operacional) | despesas R$15.397 | R$76.361,76 |
| **2025** | **R$314.963,26** | **+R$29.170,54** | **R$919.170,54** |

Índices 2025: **LG/LC/SG = 105,77** (passivo exigível quase nulo, R$8.772,99). O PL saltou ~12× entre 2024 e 2025.

**Teto solo dinâmico:** `valorMaxSolo = PL / 0,10` = **R$ 9.191.705,40** com o snapshot 2025. O maior edital do corpus (R$2,83M) cabe **3,2× dentro do teto solo** → no critério econômico-financeiro a ENIAC habilita **SOZINHA em 100% do corpus atual**. Saída acionável: "habilita solo até R$X; este edital é R$Y; headroom Z×".

> Fonte: doc 26 §1.2, §3.3; eniac-ccp.json (`FinancialSnapshot`).

## Consequência estratégica: o gargalo é TÉCNICO, não econômico

Com o PL real, o consórcio **deixa de ser necessidade econômico-financeira e vira alavanca estratégica TÉCNICA**. O gatilho do Modo Consórcio dispara por **lacuna técnica de acervo** (quantitativo abaixo da parcela de maior relevância — soma integral do art. 15 §2º resolve o que a ENIAC não cobre sozinha), não por PL. A recomendação acionável aponta **qual acervo procurar no parceiro**, não qual PL. Ver doc `06-consorcio`.

> Fonte: doc 26 §1.2 (virada estratégica), §4 (revisão 10-11/Jun), §8.
