# 27 — Detector de Licitação Suspeita / Direcionamento (R3) — 04/Jun/2026

**Origem:** requisito **R3** do cliente (doc `25`) — *"comparar exigências do edital atual vs padrões históricos do órgão/objeto → sinalizar discrepâncias; investigar se vitórias recorrentes de um concorrente têm fundamento técnico OU indício de influência externa. **Interesse da liderança.**"*

**Por que ESTE agora (e não parse de balanço):** (a) liderança da ENIAC pediu; (b) **zero dependência de doc do cliente** — roda sobre PNCP/edital que já temos; (c) já tenho a baseline aterrada (corpus dos 12 editais do doc `26 §11` + a market structure do doc `22`); (d) é a entrega que melhor **brilha no teste de Valparaíso**.

**Escopo:** SÓ ARQUITETURA. Aba destino: **Monitorar** (chip de triagem) + **Analisar** (insight + ponte impugnação). Conecta com o §3.2.1 do doc `26` (parcela de maior relevância não designada).

---

## 1. O risco que define o desenho: falso-positivo é DEFAMATÓRIO

Diferente do motor de habilitação (onde o pior erro é a ENIAC perder um edital), aqui **o pior erro é acusar um órgão/concorrente de fraude sem fundamento** — isso é difamação, queima a relação da ENIAC com o órgão e destrói a credibilidade da ferramenta. Logo, **3 princípios não-negociáveis** (alinhados com Justen/Niebuhr, conclave doc 26):

1. **Linguagem de SUSPEITA TÉCNICA, nunca de acusação.** "Exigência atípica — avaliar impugnação", não "licitação fraudada". Disclaimer obrigatório.
2. **Todo flag é GROUNDED**: cita a cláusula do edital + o dado histórico + o **dispositivo legal** que ele potencialmente viola. Sem os três, não há flag.
3. **Conservador por construção**: na dúvida (amostra esparsa, sinal fraco), **não sinaliza**. Falso-negativo aqui é barato; falso-positivo é caríssimo.

---

## 2. O que é "direcionamento" juridicamente (define o que PODE ser sinalizado)

O detector não inventa "anomalia estatística" abstrata — ele procura **desvios que mapeiam a ilegalidades concretas da Lei 14.133/2021**. Isso é o que separa um flag *acionável* (vira impugnação) de ruído:

| Hook legal | O que veda | Vira flag quando |
|---|---|---|
| **Art. 67, §1º** | atestado restrito a parcelas de maior relevância; **vedada restrição indevida de tempo e local** | exige quantitativo sem designar a parcela · restringe local/data do atestado |
| **Súmula TCU 263 / art. 67** | quantitativo mínimo limitado (~50%) | exige quantitativo acima do teto ou desproporcional ao objeto |
| **Art. 69** | qualificação econ-fin **justificada e proporcional** (índices/PL) | índice/PL exigido sem justificativa ou acima do usual |
| **Art. 41, parág. único** | indicação de marca só com justificativa + "ou similar" | edital cita marca/modelo sem "ou equivalente" |
| **Art. 55** | prazos **mínimos** de divulgação por modalidade/objeto | prazo de publicação→sessão **abaixo do mínimo legal** |
| **Art. 58** | garantia de proposta limitada (até ~1%) | garantia exigida acima do limite |
| **Art. 9 / Art. 14** | conflito de interesse / vedações (anti-conluio) | (sinal indireto — vetor C) |

> **Regra de ouro:** a "norma histórica do órgão" (estatística) só agrava um flag que **já tem âncora legal**. Anomalia estatística pura, sem hook legal, é no máximo um `aviso fraco`, nunca uma acusação.

---

## 3. Arquitetura em 3 TIERS (por custo × confiança × dependência de dado)

Decisão central: **não é um "score de suspeita" único**. São 3 camadas independentes, ordenadas por quão barato e defensável é cada uma.

### TIER 1 — Tripwires legais (só o edital atual; barato; alta confiança) ⭐ ship primeiro
Avalia **somente o edital corrente** (via ERM do doc 26) contra os limites objetivos da Lei 14.133. **Não precisa de baseline histórica** → roda em qualquer edital, inclusive de órgão sem histórico.
- Prazo de divulgação < mínimo legal (art. 55) → **flag duro, objetivo**.
- Atestado com quantitativo sem parcela designada / restrição de tempo-local (art. 67) → flag.
- Índice/PL > limiar usual sem justificativa no edital (art. 69) → flag.
- Marca sem "ou similar" (art. 41) → flag.
- Garantia > limite (art. 58) → flag.
- **Confiança alta, falso-positivo baixo, vira impugnação direta.** É o que ship para Valparaíso.

### TIER 2 — Anomalia vs norma histórica do órgão (precisa baseline; caro; médio)
O "comparar com padrões históricos" do R3. Para cada exigência do edital, compara com a **distribuição típica daquele órgão (ou de órgãos similares/mesmo objeto)**:
- quantitativo de atestado exigido (% do objeto) · índices econ-fin · garantia · prazo · nº médio de participantes.
- Sinaliza desvio relevante (ex.: "este órgão historicamente pede atestado de 10%; este edital pede 50%").
- **Custo real (honesto):** exige **parsear N editais históricos do órgão** (Docling) para montar a baseline de *exigências* — o PNCP dá os PDFs, mas não os requisitos estruturados. Isso é o trabalho caro → é o **moat**, mas vem depois do Tier 1.
- **Amostra esparsa (órgão pequeno):** se N < limiar (ex.: <5 editais), **degrada para "sem baseline"** e NÃO sinaliza (chip "amostra insuficiente"). Crucial: município pequeno é exatamente onde o direcionamento ocorre E onde há menos dado → resistir à tentação de sinalizar no escuro.

### TIER 3 — Padrão de concorrente (reusa market structure; o mais sensível) 🔴 conservador máximo
A hipótese de "direcionamento" propriamente dita. Reusa o que o doc `22` já construiu (HHI, share, incumbente recorrente por órgão):
- Cruza: **um CNPJ vence recorrentemente nesse órgão (share alto/HHI concentrado)** ⨉ **o edital atual tem exigência sob medida que casa com o perfil desse vencedor** (ex.: exige atestado de um serviço de nicho que só o incumbente tem).
- Saída: *"indício — o vencedor recorrente X (share Y%) tem perfil que casa com a exigência atípica Z deste edital; investigar fundamento técnico."*
- **Nunca afirma fraude.** É o tier com maior risco difamatório → exige **dois sinais convergentes** (concentração + exigência casada) e linguagem de hipótese.

---

## 4. Pipeline de dados (o que entra, o que sai)

```
Edital atual ──(Docling+ERM, doc 26)──▶ exigências estruturadas
                                              │
Histórico do órgão (PNCP):                    ▼
  • contratações/vencedores ──(doc 22)──▶ MarketStructure (HHI/share/incumbente)  ──▶ TIER 3
  • editais passados ──(Docling, caro)──▶ baseline de exigências                  ──▶ TIER 2
Lei 14.133 (constantes/limites) ──────────────────────────────────────────────────▶ TIER 1
                                              │
                                              ▼
                              SuspicionReport { tier, sinais[], grounding, hookLegal, severidade }
```

**Tipo de saída `SuspicionSignal`:**
| Campo | Conteúdo |
|---|---|
| `tier` | 1 \| 2 \| 3 |
| `tipo` | prazo-exíguo · quantitativo-excessivo · parcela-não-designada · marca-fechada · índice-injustificado · garantia-acima · incumbente-casado |
| `evidenciaEdital` | cláusula citada (texto + nº) |
| `evidenciaHistorica` | dado da baseline OU market structure (com nº de amostra) |
| `hookLegal` | art. 55 / 67 / 69 / 41 / 58 / Súmula TCU 263 |
| `severidade` | alta (Tier 1 objetivo) · média (Tier 2) · indício (Tier 3) |
| `acao` | "avaliar impugnação até {dataLimite}" · "pedir esclarecimento" · "investigar" |
| `proveniencia` | grounded · inferred · gap (chip) |

---

## 5. Entrega (o que o operador leva)

- **Monitorar:** chip ⚠️ "exigência atípica" na fila de triagem (não muda o Vai/Olha/Pula, mas anexa o motivo).
- **Analisar:** vira **1 das 5 frases do Stage 3** (doc `05`) — campo "Risco/Armadilha" — com a cláusula, o dado histórico e a **janela de impugnação** (art. 164 — prazo para impugnar). Conecta direto com a aba **Recorrer/impugnação**.
- **Duplo valor:** defensivo (*"este edital está montado contra o seu perfil — não gaste, OU impugne com este fundamento"*) e ofensivo (*"impugnar isto nivela o jogo até {data}"*).
- **Disclaimer fixo:** "Sinal baseado em dados públicos e na Lei 14.133 — indício para avaliação, não afirmação de irregularidade. Não substitui análise jurídica." + **revisão humana obrigatória** antes de qualquer impugnação (decisão e protocolo são humanos — alinhado ao moat #8/R9).

---

## 6. Invariantes
1. **Nenhum flag sem os 3 grounds** (cláusula + histórico/lei + hook legal). Tier 1 dispensa histórico (a lei é o ground).
2. **Suspeita ≠ acusação.** Linguagem de hipótese; disclaimer; revisão humana antes de agir.
3. **Amostra esparsa → silêncio**, nunca sinal no escuro (Tier 2/3).
4. **Score nunca opaco:** cada sinal é explicável e isolado; não existe "índice de suspeita" agregado sem decomposição.
5. **Severidade ≠ certeza:** Tier 1 alto = "provavelmente impugnável"; Tier 3 = "indício, investigar".

## 7. Gate / Experimento (antes de qualquer build)
- Rodar **Tier 1** nos **12 editais reais** (doc 26 §11) + no **edital de Valparaíso** → medir quantos tripwires legais disparam e se algum é falso-positivo (leitura manual = ground truth).
- ✅ **PASSA** se **0 falso-positivo no Tier 1** (objetivo: tripwire legal não pode errar) e ≥1 sinal verdadeiro recuperado onde existir.
- Tier 2/3 entram só depois, com baseline real e medição de falso-positivo apertada (<5%, dada a severidade do dano).

## 8. Decisões pendentes
- [ ] **D-27.1** Constantes legais por modalidade (prazos mínimos art. 55, limite de garantia art. 58) — tabela de referência a montar (e manter atualizada com regulamentos).
- [ ] **D-27.2** Tier 2 baseline: parsear quantos editais históricos por órgão? Custo Docling × valor. Começar só com órgãos do cluster GO (onde há mais histórico).
- [ ] **D-27.3** Linguagem exata do disclaimer + da frase de "indício" Tier 3 — **validar com justen-filho/niebuhr** (risco difamatório/consultoria não autorizada).
- [ ] **D-27.4** Janela de impugnação (art. 164): calcular `dataLimite` a partir da data da sessão — confirmar a regra de contagem.

---
*Doc por Orion (aios-master). Aterrado em: corpus dos 12 editais (doc 26 §11) + market structure PNCP (doc 22) + Lei 14.133 arts. 9/14/41/55/58/67/69/164 + Súmula TCU 263. Sequência recomendada: **Tier 1 (tripwires legais) primeiro** — barato, alta confiança, sem dependência de baseline, ship para o teste de Valparaíso. Tier 2 (anomalia histórica) = o moat caro; Tier 3 (incumbente casado) = o mais sensível, conservador máximo.*
