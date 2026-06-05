# 28 — Codex Handoff: Tier 1 Detector + Núcleo de Habilitação (build-ready) — 04/Jun/2026

**Para:** dev que constrói no **Codex** (o AIOS entrega raciocínio/spec; o build é lá). **Consolida:** doc `26` (habilitação) + doc `27` (detector R3) + dados REAIS extraídos (5 CATs + balanços ENIAC + 12 editais). **Objetivo:** o slice mais barato e de maior confiança que **shippa valor e demonstra no teste de Valparaíso** — sem dependência de doc do cliente nem de baseline histórica.

**Princípio de corte:** entra só o que roda **sobre o edital atual + o acervo que já temos**. Fica de fora: Tier 2/3 do detector (precisam baseline cara), parse exato do PL (D-26.1), CAO operacional (não chegou), Docling em produção (usar o que der; gate é manual).

> ⚠️ Linguagem: este doc descreve **o quê** construir (regras, shapes, casos de teste). Não contém código — o Codex implementa em TS no `apps/noyce`.

---

## 0. Onde encaixa no app real (`apps/noyce`)
- Reusa: `lib/noyce-model.ts` (tipos), `lib/noyce-operational.ts` (`buildTriage`/`buildNextStep`), `lib/data/market-snapshot.json` (doc 22), `lib/data/discovery-snapshot.json` (doc 23 PR2).
- Abas afetadas: **Monitorar** (chip de alerta), **Analisar** (frase de risco + GO/NO-GO), **Habilitar** (dossiê + lacunas).
- Server Components por padrão; nada novo client-side neste slice. Persistência fica pro PR4 (Lifecycle) — aqui tudo é derivado em request/build, read-only.

---

## 1. SCHEMA — shapes concretos (3 modelos)

### 1.1 — `CompanyCapabilityProfile` (CCP) — seed estático neste slice
Um JSON versionado em `lib/data/eniac-ccp.json` (o "vault" v0; credenciais NUNCA aqui — só dados de acervo públicos). Shape:

```
CompanyCapabilityProfile {
  identity: { razaoSocial, cnpj, creaEmpresa, porte: "ME", regime: "Simples", sedeMunicipioIbge }
  rts: TechnicalProfessional[]            // engenheiros
  acervo: Acervo[]                        // CATs/atestados, com itens
  financials: FinancialSnapshot[]         // por exercício
  regularity: RegularityDoc[]             // CNDs etc (vazio neste slice)
  derived: { capabilityByService: { [servicoCanonico]: { maxSingle, somaTop2, unidade, fontes[] } } }
}
TechnicalProfessional { id, nome, titulo, crea, rnp, vinculo: { tipo, desde } | null }
Acervo { id, tipo: "CAT_PROFISSIONAL"|"CAO_OPERACIONAL"|"ATESTADO_SIMPLES",
         numero, rtId, participacaoTecnica: "Individual"|"Corresponsavel",
         contratante, tipoContratante, valor, periodo, status,
         itens: { servicoCanonico, qtd, unidade, descricaoOriginal, clausulaOrigem }[] }
FinancialSnapshot { exercicio, patrimonioLiquido|null, capitalSocial, ativoCirc, passivoCirc,
                    receitaBruta, resultado, fonte }
```

`derived.capabilityByService` é **calculado** do `acervo` (somatório por `servicoCanonico`, guardando `maxSingle` e `somaTop2`). É o que o matcher consulta.

### 1.2 — `EditalRequirementsModel` (ERM) — saída do parsing
Neste slice o parsing pode ser **semi-manual** (extração assistida do PDF → JSON), já que o gate é nos 12+1 editais conhecidos. Shape (igual doc 26 §2.B):

```
ERM {
  meta: { orgao, cnpjOrgao, municipioIbge, modalidade, valorEstimado, dataSessao, criterioJulgamento, regimeExecucao }
  economicoFinanceira: { exigePL: bool, percentualPL: number, indices: {LC?,LG?,SG?}, justificativaPresente: bool, garantiaPropostaPct: number, clausula }
  tecnica: { profissional: {servico,qtdMin?,un}[], operacional: {servico,qtdMin,un}[],
             parcelasMaiorRelevancia: string[]|null, tetoQuantitativo: number,
             somatorio: { permitido: bool|null, maxAtestados?: int }, aceitaAcervoConsorcio: bool,
             restricaoTempoLocal: bool, marcaSemSimilar: bool, clausula }
  juridica: { declaracoes: string[], clausula }
  fiscalTrabalhista: { CNDs: string[], SICAF: bool, clausula }
}
```

### 1.3 — `ServiceTaxonomy` — seed mínimo (dicionário-ponte)
`lib/data/service-taxonomy.json`: ~20 classes que cobrem o nicho obras da ENIAC, cada uma com `sinonimos[]` (frases CONFEA + frases de edital). Seed inicial extraído dos 5 CATs + 12 editais (§4). Match = dicionário primeiro; embedding (BGE-m3) só **sugere** candidato quando o dicionário falha → revisão humana. **Embedding nunca decide.**

---

## 2. TIER 1 DETECTOR — ruleset concreto (checklist de implementação)

Cada regra recebe o `ERM` do edital atual + a tabela de constantes legais (§5). Devolve `SuspicionSignal[]`. **Sem baseline. Sem histórico.** Avalia só o edital contra a Lei 14.133.

| # | Regra (tripwire) | Input do ERM | Dispara quando | Hook legal | Severidade |
|---|---|---|---|---|---|
| T1.1 | **Prazo exíguo** | `meta.dataSessao`, `meta.modalidade`, `meta.criterioJulgamento`, `meta.regimeExecucao`, data de publicação | dias úteis entre publicação e sessão **< mínimo legal** da tabela §5.1 | art. 55 | **alta** |
| T1.2 | **Garantia de proposta acima do limite** | `economicoFinanceira.garantiaPropostaPct` | `> 1%` do valor estimado | art. 58 | **alta** |
| T1.3 | **Quantitativo de atestado sem parcela designada** | `tecnica.operacional[].qtdMin`, `tecnica.parcelasMaiorRelevancia` | exige qtdMin **e** `parcelasMaiorRelevancia == null/vazio` | art. 67 §1º | **alta** |
| T1.4 | **Quantitativo acima do teto** | `tecnica.operacional[].qtdMin`, `meta.valorEstimado`/quantitativo do objeto, `tetoQuantitativo` | qtdMin exigido **> 50%** da parcela no objeto | art. 67 + Súmula TCU 263 | média |
| T1.5 | **Restrição indevida de tempo/local** do atestado | `tecnica.restricaoTempoLocal` | `true` (ex.: "atestado dos últimos 2 anos" / "obra no mesmo município") | art. 67 §1º | média |
| T1.6 | **Marca sem "ou similar"** | `tecnica.marcaSemSimilar` | `true` | art. 41 §único | média |
| T1.7 | **Índice econ-fin sem justificativa** | `economicoFinanceira.exigePL/indices`, `economicoFinanceira.justificativaPresente` | exige índice/PL **e** `justificativaPresente == false` | art. 69 | **revisão** (não acusa; pede leitura humana) |

**Saída `SuspicionSignal`** (doc 27 §4): `{ tier:1, tipo, evidenciaEdital(clausula), hookLegal, severidade, acao, proveniencia:"grounded" }`. `acao` default: T1.1–T1.6 → "avaliar impugnação até {dataLimiteImpugnacao}"; T1.7 → "revisar manualmente".

`dataLimiteImpugnacao` = **`dataSessao` − 3 dias úteis** (art. 164). (D-27.4 confirmado.)

**Invariante Tier 1:** falso-positivo é inaceitável → onde o ERM não tem o campo com confiança (`null`), a regra **NÃO dispara** (silêncio), nunca chuta.

---

## 3. NÚCLEO DE HABILITAÇÃO — 4 avaliadores (spec)

Recebe `ERM` + `CCP`. Devolve `HabilitationResult { porBloco, lacunas[], veredito }`. Cada avaliador → `{status, evidencia, lacuna?, sanabilidade}` com status ∈ `ATENDE | ATENDE_COM_RESSALVA | PARCIAL | NAO_ATENDE | INDETERMINADO`.

### 3.1 Técnico-profissional
Para cada `tecnica.profissional[]`: existe RT no `CCP.rts` cujo acervo cobre o `servicoCanonico`? → `ATENDE`. RT sem `vinculo` → **lacuna SANÁVEL** "gerar declaração de contratação futura do RT" (NÃO bloqueia GO). Sem RT habilitável para a classe → `NAO_ATENDE` INSANÁVEL.

### 3.2 Técnico-operacional (a regra central)
Para cada `tecnica.operacional[] {servico, qtdMin}`:
1. `disponivel = derived.capabilityByService[servico]`.
2. Se `somatorio.permitido === false` → usar `maxSingle`. Se `=== true` → usar `somaTopN` respeitando `maxAtestados` (default sem limite; Novo Gama=2). Se `=== null` (silente) → usar soma **mas** marcar `ATENDE_COM_RESSALVA` + tarefa "confirmar somatório via esclarecimento".
3. `ATENDE` se `disponivel ≥ qtdMin`; senão **lacuna INSANÁVEL** = `qtdMin − disponivel` na classe → contribui p/ NO-GO.

### 3.3 Econômico-financeira
- `tetoSolo = PL(últimoExercício) / percentualPL`. Se `valorEstimado ≤ tetoSolo` → `ATENDE`; senão → `NAO_ATENDE` solo + **sugerir Modo Consórcio** (doc 26 §4).
- Índices LC/LG/SG ≥ limiar quando exigidos.
- ⚠️ `PL` vem do `FinancialSnapshot` mais recente; **se PL==null (D-26.1 pendente) → status INDETERMINADO** + lacuna "obter PL exato do balanço".

### 3.4 Jurídica / fiscal / trabalhista
Casa `juridica/fiscalTrabalhista` × `CCP.regularity` por tipo + validade na `dataSessao`. Neste slice `regularity` está vazio → tudo vira **lacuna SANÁVEL** "providenciar {doc}" (não bloqueia GO; é checklist).

### 3.5 Veredito
`NO-GO` **só** se houver `NAO_ATENDE` **INSANÁVEL** em bloco eliminatório. Caso contrário `GO-com-tarefas` (lista as lacunas sanáveis). `ATENDE_COM_RESSALVA` em qualquer bloco → veredito sinaliza a ressalva. **Nunca inflar NO-GO por lacuna sanável** (doc 26 §3).

---

## 4. SEED REAL — `eniac-ccp.json` (valores concretos p/ os testes)

**Identity:** ENIAC EMPREENDIMENTOS LTDA · CNPJ 36.819.268/0001-05 · CREA-GO 39711 · ME/Simples · sede Águas Lindas (IBGE 5200258).

**RTs:** `alice` = Alice Ramos Silva, Eng. Civil, CREA-GO 1022381563D-GO, vínculo desde 2025-09-17. `rodrigo` = Rodrigo Piloto Amaro, Eng. Civil, CREA 23733/D-DF, vínculo a confirmar.

**Acervo (5):**
| id | RT | partic. | contratante (tipo) | valor | itens (servicoCanonico → qtd un) |
|---|---|---|---|---|---|
| reforma-ceo | alice | Individual | Fundo Saúde Águas Lindas (público) | 103.000 | REFORMA_PREDIAL 208,90 m²; PINTURA 480 m² |
| mestre-zezito | alice | **Corresponsavel** | SCB Engenharia (privado) | 587.860 | EDIFICACAO_ALVENARIA 1.613,12 m²; ESTRUTURA_METALICA 1.613,12 m²; REDE_HIDROSSANITARIA 1.613,12 m² |
| escola-ednalda | rodrigo | Individual | Pref. Águas Lindas (público) | 886.828,39 | EDIFICACAO_ALVENARIA 1.622,59 m²; ESTRUTURA_CONCRETO_ARMADO 1.622,59 m²; LAJE_PRE_FABRICADA 1.622,59 m²; RESERVATORIO_ACO 30 m³ |
| praca | rodrigo | Corresponsavel | Pref. Águas Lindas (público) | 473.300 | TERRAPLENAGEM 3.000 m²; DRENAGEM 500 m²; PAVIMENTACAO_CONCRETO 3.000 m; INSTALACAO_ELETRICA_BT 75 kVA; CONCRETO_USINADO 75 m³; PAISAGISMO 150 un |
| topografia | rodrigo | Individual | Pref. Águas Lindas (público) | — | TOPOGRAFIA 21.829 m²; TERRAPLENAGEM 21.829 m² |

**`derived.capabilityByService` esperado (soma top-2):**
- `EDIFICACAO_ALVENARIA`: maxSingle 1.622,59 · somaTop2 **3.235,71 m²** (ednalda+zezito)
- `ESTRUTURA_CONCRETO_ARMADO`: 1.622,59 m² · `ESTRUTURA_METALICA`: 1.613,12 m²
- `TERRAPLENAGEM`: 21.829 m² · `DRENAGEM`: 500 m² · `PAVIMENTACAO_CONCRETO`: 3.000 m
- `INSTALACAO_ELETRICA_BT`: 75 kVA · `REDE_HIDROSSANITARIA`: 1.613,12 m²

**Financials:** `2024 {receita ~0}`, `2025 {receitaBruta 314.963,26, resultado +29.170,54, PL: null /* D-26.1 */}`.

---

## 5. CONSTANTES LEGAIS (D-27.1) — tabela de referência

### 5.1 Prazos mínimos de divulgação (art. 55) — ⚠️ confirmar contra texto consolidado
| Objeto | Critério/Regime | Mínimo (dias úteis) |
|---|---|---|
| Bens | menor preço / maior desconto | 8 |
| Bens | demais | 15 |
| **Obras/serviços de engenharia** | **menor preço/maior desconto, empreitada unitária/global/tarefa** | **10** |
| Obras/serviços de engenharia | demais (técnica e preço, contratação integrada/semi-integrada) | 25 |
| Técnica e preço / maior retorno econômico | — | 35 (verificar) |

> 🔴 D-27.1: estes valores precisam de conferência final no texto/regulamento antes de virar tripwire duro. Enquanto não conferidos, T1.1 dispara como **severidade média "verificar prazo"**, não "alta".

### 5.2 Outras constantes
- Garantia de **proposta**: até **1%** do valor estimado (art. 58) → T1.2.
- Garantia **contratual**: até 5% (até 10% obras grande vulto/complexas) — fora do Tier 1 (não é fase de proposta).
- Teto de quantitativo de atestado: **50%** das parcelas de maior relevância (art. 67/Súmula TCU 263) → T1.4.
- Janela de impugnação: **3 dias úteis** antes da sessão (art. 164) → `dataLimiteImpugnacao`.

---

## 6. GATE / CASOS DE TESTE (aceite antes de escalar)

### 6.1 Detector Tier 1 — rodar nos 12 editais (doc 26 §11) + Valparaíso
- ✅ **PASSA** se **0 falso-positivo** (todo flag confirmado por leitura manual) e ≥1 verdadeiro recuperado onde existir.
- Caso conhecido p/ asserção: **EDITAL 7/8 (Novo Gama)** têm `somatorio.maxAtestados=2` e `aceitaAcervoConsorcio=true` → o ERM deve capturar isso; o matcher §3.2 deve respeitar o teto de 2.

### 6.2 Habilitação — asserções com o seed real
| Cenário (edital sintético sobre o seed) | Esperado |
|---|---|
| Exige `EDIFICACAO_ALVENARIA ≥ 3.000 m²`, somatório **silente** | `ATENDE_COM_RESSALVA` (somaTop2 3.235,71 cobre, mas silente → ressalva "confirmar somatório") |
| Exige `EDIFICACAO_ALVENARIA ≥ 3.000 m²`, somatório **maxAtestados=1** | `NAO_ATENDE` INSANÁVEL (maxSingle 1.622,59 < 3.000) → NO-GO |
| Exige `DRENAGEM ≥ 800 m²` | `NAO_ATENDE` INSANÁVEL (só 500 m²) → lacuna 300 m² |
| Exige RT eng. civil c/ atestado de alvenaria, mas `rodrigo.vinculo` ausente | `GO-com-tarefa` "declaração de vínculo do RT" (SANÁVEL, não bloqueia) |
| `valorEstimado` R$ 2.830.000, `percentualPL 10%`, PL=null | econ-fin `INDETERMINADO` + lacuna "obter PL (D-26.1)"; veredito não pode ser GO até resolver |
| Edital admite consórcio, ENIAC(ME)+parceira(ME) | sem acréscimo de 30% (art. 15 §4º) — sinalizar vantagem |

---

## 7. SEQUÊNCIA DE BUILD (ordem sugerida ao Codex)
1. **P1 — Schema + seed** (`eniac-ccp.json`, `service-taxonomy.json`, tipos ERM/CCP/SuspicionSignal em `noyce-model.ts`). Sem UI.
2. **P2 — Tier 1 detector** (regras T1.1–T1.7 puras sobre ERM + constantes §5) + testes do §6.1. Chip em Monitorar + frase em Analisar.
3. **P3 — Matcher habilitação** (4 avaliadores §3 + veredito sanável/insanável) + testes §6.2. Dossiê + lacunas na aba Habilitar (atrás de flag se preciso).
4. **P4 — ERM semi-manual** dos 12+Valparaíso (JSON curado) p/ alimentar o gate real.
Tudo derivado/read-only; persistência (Lifecycle DB) é PR separado, fora deste handoff.

## 8. O que NÃO fazer (guardrails)
- ❌ Nenhum flag/veredito derivado de `opportunityScore`/`confidenceScore` (invariante doc 23).
- ❌ Tier 1 não chuta: campo `null` no ERM → regra silencia.
- ❌ Detector nunca afirma "fraude" — só "indício/avaliar impugnação" + disclaimer + revisão humana.
- ❌ Embedding não decide habilitação nem taxonomia — só sugere p/ revisão.
- ❌ Credencial de portal NUNCA no `eniac-ccp.json`/git — só vault (CONTEXT §12).
- ✅ Toda saída ao cliente: disclaimer "não substitui análise jurídica/contábil" + revisão humana (Alice).

## 9. Pendências que este handoff NÃO resolve (rastreio)
- **D-26.1** PL exato (parse limpo balanço) → destrava econ-fin de `INDETERMINADO` p/ número real.
- **D-26.3** Service Taxonomy completa (validar classes com Alice).
- **D-27.1** Confirmar prazos art. 55 (manter T1.1 em "média" até lá).
- **D-27.2/3** Tier 2/3 do detector (baseline + linguagem validada juridicamente).
- **CAO operacional** da ENIAC (R1) ainda não entregue.

---

## 10. Spec refinements — respostas às perguntas do Codex (handoff round 1, 04/Jun)

O Codex leu o spec (read-only, `codex exec`), confirmou os paths do §0 e levantou 10 lacunas. Resolvidas abaixo — **isto fecha o spec; pode construir P1 sem chutar.**

**G1 — `ERM.meta.dataPublicacao` (T1.1 precisa publicação→sessão).** ✅ ADICIONAR `meta.dataPublicacao` (data de divulgação no PNCP/portal; fonte = campo `dataPublicacaoPncp` que já vem no discovery-snapshot). T1.1 = dias úteis entre `dataPublicacao` e `dataSessao` < mínimo §5.1. Sem `dataPublicacao` → T1.1 silencia.

**G2 — quantitativo total do objeto (T1.4).** ✅ ADICIONAR em `ERM.tecnica.operacional[]` o campo `qtdObjeto` (quantidade total da parcela no objeto desta licitação). T1.4 dispara se `qtdMin > 0.5 × qtdObjeto`. Se `qtdObjeto == null` → T1.4 **silencia** (invariante null-silence). Mantém-se separado de `tetoQuantitativo` (=0.50, a constante).

**G3 — `clausula` estruturada (anti-falso-positivo).** ✅ ACEITO (boa sugestão do Codex). `clausula = { numero: string, texto: string, pagina?: int, trecho?: string }` em todo o ERM. String solta não basta para grounding auditável.

**G4 — `indices` = limiar numérico.** ✅ `indices: { LC?: number, LG?: number, SG?: number }` onde o valor é o **mínimo exigido** (ex.: `{LC: 1.0}` = Liquidez Corrente ≥ 1,0). O matcher calcula e compara.

**G5 — `FinancialSnapshot` precisa de totais p/ LG/SG.** ✅ ADICIONAR `ativoTotal`, `realizavelLongoPrazo`, `exigivelLongoPrazo` (além de `ativoCirc/passivoCirc` já previstos). Fórmulas: `LC = AC/PC` · `LG = (AC+RLP)/(PC+ELP)` · `SG = AtivoTotal/(PC+ELP)`. Campos que dependem de parse limpo do balanço ficam `null` até **D-26.1** → índice correspondente vira `INDETERMINADO`, nunca chuta.

**G6 — tensão "PL null → INDETERMINADO" vs "NO-GO só por insanável".** ✅ RESOLVIDO com novo valor de veredito: `HabilitationVerdict ∈ { GO | GO_COM_TAREFAS | PENDENTE_DADO | NO_GO }`. Bloco com `INDETERMINADO` (ex.: econ-fin com PL null) → veredito **`PENDENTE_DADO`** ("aguarda dado", não é GO nem NO-GO). NO-GO continua exclusivo de `NAO_ATENDE` **insanável**. (Adoto a sugestão do Codex.)

**G7 — CAO operacional não chegou: matcher operacional pode usar CAT profissional?** ✅ DECISÃO: **sim, como PROXY, mas nunca como `ATENDE` duro.** As CATs aqui são de obras em que a **ENIAC foi a contratada** (logo o atestado de execução existe; falta só a formalização do CAO). Então o avaliador técnico-operacional (§3.2), na ausência de CAO, usa o acervo das CATs com `proveniencia: "inferred"` + status no máximo `ATENDE_COM_RESSALVA` + tarefa "emitir/anexar CAO operacional". Quando o CAO real chegar (R1), vira `grounded`.

**G8 — "dias úteis" (T1.1, art. 164).** ✅ Excluir fins de semana **+ feriados nacionais** (lista de feriados nacionais como constante em `lib/data/feriados-nacionais.json`). Feriados **municipais/estaduais = limitação conhecida** (flag): podem alterar a contagem em casos de borda → quando o prazo ficar a ≤1 dia útil do limite, marcar `ATENDE_COM_RESSALVA` "conferir feriado local".

**G9 — ground truth do gate P4.** ✅ Formato: `tests/fixtures/tier1-ground-truth.json` = `{ editalId: { flagsEsperados: SuspicionType[], camposNull: string[] } }`. **Seed conhecido:** Novo Gama (EDITAL 7/8) → `somatorio.permitido=true, maxAtestados=2, aceitaAcervoConsorcio=true`. Os demais 10 + Valparaíso precisam de **anotação manual** (leitura da seção de habilitação) — é tarefa humana (owner/Alice/eu), input do gate, **não** algo que o Codex infere. P4 começa só com os 2 anotados + Valparaíso quando chegar.

**G10 — taxonomia seed (~20 classes).** ✅ Lista provisória abaixo (derivada dos 5 CATs + 12 editais), marcada `provisorio` até validação da Alice (**D-26.3**). Não bloqueia P1.

`service-taxonomy.json` seed (servicoCanonico → unidade · sinônimos-semente):
`EDIFICACAO_ALVENARIA` (m² · "edifício de alvenaria", "construção/execução prédio alvenaria") · `REFORMA_PREDIAL` (m² · "reforma de edifício", "reforma predial") · `ESTRUTURA_CONCRETO_ARMADO` (m² · "estrutura concreto armado") · `ESTRUTURA_METALICA` (m² · "estrutura metálica") · `LAJE_PRE_FABRICADA` (m² · "laje pré-moldada/pré-fabricada") · `ALVENARIA_ESTRUTURAL` (m²) · `COBERTURA_TELHAMENTO` (m² · "telhamento", "cobertura") · `REDE_HIDROSSANITARIA` (m² · "instalações hidráulicas", "rede hidro-sanitária") · `INSTALACAO_ELETRICA_BT` (kVA · "instalação elétrica baixa tensão") · `PAVIMENTACAO_CONCRETO` (m² · "pavimentação de concreto") · `PAVIMENTACAO_ASFALTICA` (m²) · `PAVIMENTACAO_PARALELEPIPEDO` (m²) · `TERRAPLENAGEM` (m² · "terraplenagem", "serviços afins terraplenagem") · `DRENAGEM` (m²/m · "drenagem") · `CONCRETO_USINADO` (m³) · `MEIO_FIO_GUIA` (m · "meio-fio", "guias") · `TOPOGRAFIA` (m² · "topografia georreferenciada", "levantamento topográfico") · `PARCELAMENTO_SOLO` (m²) · `PAISAGISMO_URBANO` (un/m² · "paisagismo", "mobiliário urbano") · `RESERVATORIO` (m³ · "reservatório/tanque") · `ACESSIBILIDADE` (m² · "acessibilidade de praças/parques") · `PINTURA` (m² · "pintura", "emassamento e pintura").

**Estado do handoff:** spec fechado nas 10 lacunas. **Próximo:** greenlight de `build P1` (delegate `--to codex --sandbox workspace-write` → cria schema + seed + testes do §6.2). P4 (ground truth dos 10 editais + Valparaíso) é a única dependência humana pendente.

---
*Doc por Orion (aios-master). Handoff consolidando docs 26+27 com dados reais da ENIAC. Slice escolhido = Tier 1 detector + núcleo habilitação: barato, alta confiança, zero dependência externa, demonstrável no teste de Valparaíso. Gate-first: aprova nos 12 editais + Valparaíso antes de escalar p/ Tier 2/3.*
