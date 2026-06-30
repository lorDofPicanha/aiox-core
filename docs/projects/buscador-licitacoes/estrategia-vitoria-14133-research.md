# Estratégia de Vitória (Lei 14.133) — Pesquisa Verificada + Mapa Noyce

**Data:** 30/06/2026 · **Método:** deep-research (103 agentes, 21 fontes primárias, 25 afirmações com verificação adversarial 3-votos → 23 confirmadas, 2 mortas). Fontes: Planalto (texto da lei), TCU (licitacoesecontratos.tcu.gov.br), TCE-SP (legislação comentada), Justen/Pereira, Zênite, Conjur.

## Tese central (verificada)

Ganhar obra sob a 14.133 = **(1) SOBREVIVER à habilitação técnica → (2) preço na zona exequível → (3) acionar os trunfos de ME**. Nessa ordem: inabilitado não chega ao preço. O gargalo da ENIAC é sempre o **CAO técnico-OPERACIONAL** (art. 67, II), não o profissional (já tem CAT, inciso I).

## Achados verificados → o que o Noyce deve fazer

| # | Achado (fonte primária, confiança) | O que o Noyce deve calcular/sinalizar | Status hoje |
|---|---|---|---|
| 1 | **Atestados só de parcelas ≥4% do valor total** (art. 67 §1º); **quantitativo ≤50%** (§2º); **vedadas limitações de tempo/local**. Acima disso = restritivo/impugnável (Súmula TCU 263, Ac. 1.604/2025). [alta] | Extrair valor estimado → marcar parcelas ≥4%; flag quantitativo >50% ou restrição tempo/local como **gatilho de impugnação** | 🟡 parcial — suspicion `QUANTITATIVO_ACIMA_TETO` + `RESTRICAO_TEMPO_LOCAL` já existem; falta o gate de 4% e a sugestão de impugnação |
| 2 | **Profissional (I, CAT eng.) ≠ Operacional (II, CAO da PJ)**; gargalo da ENIAC é SEMPRE o inciso II. [alta] | Classificar cada exigência técnica como I ou II; edital que pede CAO operacional → **"risco de inabilitação"** acionando consórcio/subcontratação/somatório | 🔴 falta a classificação explícita I vs II |
| 3 | **Somatório de atestados é a REGRA**; vedação é exceção que exige motivação técnica (TCU Ac. 1153/2024). [alta] | **Somar automaticamente** os quantitativos das CATs da ENIAC vs exigido; flag vedação-sem-motivação como impugnável | 🟡 `somatorio.permitido` extraído; falta a SOMA automática (alvenaria 1.613+1.622=3.235 m²) cruzada com o exigido |
| 4 | **Subcontratação até 25% do objeto** (art. 67 §9º) — só se o edital invocar; vedada total (art. 122). [alta] | Detectar se o edital invoca/omite §9º; calcular se 25% cobre a lacuna técnica | 🔴 falta |
| 5 | **Consórcio (art. 15)**: somatório de acervos; **+10-30% econômico, ISENTO se 100% ME/EPP** (§2º). Trade-off: ME+grande resolve CAO mas perde isenção; ME+ME mantém isenção mas pode não suprir CAO. [alta] | Modelar os 2 cenários (acervo vs custo econômico) e recomendar a composição ótima dado o PL de R$9,19M | 🟡 `aceitaAcervoConsorcio` + doc 06-consorcio; falta o modelo dos 2 cenários |
| 6 | **Empate ficto** (LC 123 arts. 44-45): ME até **10% (obras/concorrência) / 5% (pregão)** do líder pode COBRIR e ser adjudicada; aplica ANTES do art. 60. [alta] | Por certame: calcular se o preço da ENIAC cai na faixa de 5/10% do líder e **alertar p/ cobrir dentro do prazo** (5 min no pregão) | 🔴 **falta — trunfo livre não usado** |
| 7 | **Exclusividade ME até R$80k** (LC 123 art. 48, I); exceção do art. 49 (mín. 3 ME/EPP locais). [média] | Marcar editais ≤R$80k como **"janela de exclusividade ME"** alta prioridade | 🔴 falta |
| 8 | **Regularização fiscal/trabalhista tardia** (art. 43 §1º): 5 dias úteis (prorrogáveis) p/ sanar CND APÓS vencer — não inabilita de imediato. [alta] | Sinalizar que pendência fiscal/trabalhista não inabilita já; iniciar cronômetro de 5 d.u. ao ser declarada vencedora | 🔴 falta |
| 9 | **Exequibilidade** (art. 59 §§4-5): <75% inexequível (presunção RELATIVA, Súmula TCU 262); <85% exige garantia adicional. [alta] | Calcular faixas 75%/85% sobre o orçamento; "zona segura" >85%; 75-85% custo de garantia; <75% risco | ✅ já implementado no clamp da proposta |
| 10 | **Disponibilidade ≠ propriedade** (art. 67, III): edital só pode exigir INDICAÇÃO de equipamento/instalação disponível, não prova de PROPRIEDADE (Súmula TCU 272). [alta] | Flag como impugnável edital que exige prova de propriedade de equipamento/instalação | 🔴 falta (novo suspicion signal) |

## Caveats jurídicos (do relatório)

- Benefícios ME/EPP (empate ficto, R$80k, regularização tardia) vêm da **LC 123/2006**, apenas recepcionada pela 14.133 (art. 4º) — citar a 14.133 sozinha é impreciso.
- Exclusividade R$80k (art. 48 I) teve voto **2-1**: a condição dos "3 fornecedores" está no **art. 49** e exige que os 3 sejam ME/EPP locais — revisar redação.
- **Refutado (0-3):** tese de que o art. 67, III teria peso menor por usar "indicar" — a operacional real é o **inciso II**.
- **Refutado (1-2):** cota de 25% (art. 48, III) para bens divisíveis — não se aplica com segurança a obras (indivisíveis).
- Limiares (4%, 50%, 10-30%, 75/85%) são presunções **relativas** — tratar violação como **gatilho de impugnação**, não nulidade automática.
- SINAPI/SICRO/BDI **não** foram verificados neste lote — só as faixas legais 75/85%.

## Plano priorizado por IMPACTO NA TAXA DE VITÓRIA

**Tier 1 — vitória "de graça" via lei (rápido, alto impacto, ENIAC é ME):**
- **A. Empate ficto** (#6): calculadora 5/10% + alerta de cobrir. Maior ROI — ganha disputa que hoje se perderia por centavos.
- **B. Exclusividade ME ≤R$80k** (#7) + **regularização fiscal tardia** (#8): flags simples no Analisar.

**Tier 2 — ataca o gargalo técnico real (o que mais inabilita):**
- **C. Classificação I vs II + somatório automático** (#2, #3): diz se a ENIAC habilita sozinha, e se não, soma as CATs; aponta consórcio/subcontratação.
- **D. Modelo de consórcio 2-cenários** (#5) + **subcontratação 25%** (#4).

**Tier 3 — defesa/impugnação (não perder por exigência ilegal):**
- **E. Gatilhos de impugnação**: gate dos 4% (#1) + disponibilidade≠propriedade (#10) como novos suspicion signals, com minuta de impugnação fundamentada.

**Já feito:** exequibilidade 75/85% (#9 ✅).
