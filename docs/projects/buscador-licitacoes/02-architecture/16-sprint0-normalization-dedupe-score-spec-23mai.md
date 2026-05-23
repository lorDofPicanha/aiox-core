# Noyce - Sprint 0 normalization, dedupe and score spec

Data: 2026-05-23
Status: ready for implementation
Inputs:

- `contracts/source-adapter.contract.ts`
- `contracts/source-adapter.contract-tests.md`
- `fixtures/source-records.v0.json`
- `fixtures/canonical-candidates.v0.json`
- `sql/0001_noyce_equal_priority_canonical_schema.sql`

## Objetivo

Definir a passagem de `CanonicalCandidate` para tabelas canonicas do Sprint 0 sem criar merges destrutivos, sem esconder lacunas e sem transformar inferencia em fato.

## Pipeline

```text
SourceRecord
-> CanonicalCandidate
-> persist source_records
-> upsert buyers
-> create/update opportunities
-> persist opportunity_source_records
-> persist field_evidence
-> compute field_confidence
-> create dedupe_links
-> run score v0
-> persist analysis_runs
```

## Persistencia minima

### `source_records`

Sempre persistir primeiro.

Regras:

- `raw_payload` fica inteiro no banco, mas nunca em log.
- `raw_hash` e chave operacional de rastreabilidade.
- fonte conhecida usa `source_id`.
- fonte candidata usa `source_candidate_id`.
- dedupe por fonte conhecida e candidata segue os indices parciais do SQL.

### `buyers`

Upsert por:

1. `(org_id, cnpj)` quando CNPJ existe;
2. fallback manual/review quando nao existe CNPJ.

Campos sem CNPJ devem gerar `field_confidence` fraca ou lacuna, nao inventar CNPJ.

### `opportunities`

Criar ou atualizar somente depois de dedupe.

`canonical_key` v0:

```text
{uf}-{city_ibge_code|city_slug}-{modality_slug}-{process_number|external_id}-{year}
```

Se a chave vier fraca, marcar `field_confidence.canonical_key = weak` e criar `dedupe_links` para revisao.

### `opportunity_source_records`

Sempre criar link entre oportunidade e registro bruto.

`link_confidence`:

- `confirmed`: identificador forte (`numeroControlePNCP`, external ID de mesma fonte).
- `strong`: mesmo orgao, modalidade, prazo e objeto similar.
- `inferred`: objeto/municipio/data parecidos sem identificador.
- `conflicting`: mesmo processo aparente com campo critico divergente.

## Field evidence

Para cada campo critico:

- se veio da API/HTML/PDF/export, criar `field_evidence`;
- se esta ausente, criar `field_confidence` com `missing`;
- se foi inferido, criar `field_evidence.extraction_method = inference`;
- se ha conflito, preservar ambas evidencias e marcar `field_confidence = conflicting`.

Campos criticos Sprint 0:

- `object`
- `buyer_cnpj`
- `buyer_name`
- `city_ibge_code`
- `modality`
- `process_number`
- `estimated_value`
- `proposal_deadline`
- `dispute_date`
- `items`
- `technical_requirements`
- `winner_supplier`
- `final_value`
- `contract_reference`

## Field confidence v0

Tabela de decisao:

| Situacao | Nivel | Score |
|---|---|---:|
| Identificador oficial ou API estruturada confiavel | `confirmed` | 95 |
| HTML/API da fonte primaria do processo, sem conflito | `strong` | 80 |
| Campo inferido por normalizacao simples | `inferred` | 60 |
| Campo parcial, texto ambigo ou fonte candidata | `weak` | 40 |
| Duas fontes divergem em campo critico | `conflicting` | 30 |
| Campo ausente | `missing` | 0 |

Regra: `confidence_score` nao e score de oportunidade. Ele mede confianca no campo.

## Dedupe/link v0

### Sinais fortes

- mesmo `source_code + external_id`;
- mesmo `numeroControlePNCP`;
- mesmo portal privado com processo/ano igual.

Decisao: `auto_merge`, salvo conflito grave.

### Sinais provaveis

- mesmo `buyer_cnpj`;
- mesma modalidade;
- mesmo numero de processo/ano;
- mesmo prazo de proposta;
- objeto similar.

Decisao:

- score `>=80`: `auto_merge`;
- score `60-79`: `candidate_link`;
- score `<60`: `keep_separate`.

### Sinais que nunca bastam sozinhos

- valor parecido;
- municipio igual;
- palavra-chave parecida;
- data de publicacao proxima.

Contratos, homologacoes e resultados sem identificador forte viram:

- `related_contract`;
- `outcome_signal`;
- `candidate_link`;

Nunca `auto_merge`.

## Score v0

Persistir em `analysis_runs`.

```text
opportunity_score =
  25 fit_company
+ 20 financial_attractiveness
+ 15 expected_competition
+ 15 operational_risk
+ 10 urgency
+ 10 evidence_quality
+ 5 manual_strategy
```

`confidence_total` deve ser calculado separado, usando os campos que sustentam o score:

- objeto;
- valor estimado;
- prazo;
- orgao/municipio;
- requisitos tecnicos;
- historico/preco;
- concorrencia.

## Mensagens de produto

Mapeamento obrigatorio:

- score alto + confianca alta: `priorizar agora`;
- score alto + confianca baixa: `promissora, mas incompleta`;
- score medio + prazo curto: `avaliar rapido`;
- score baixo + risco alto: `ignorar ou revisar manualmente`;
- conflito critico: `revisao obrigatoria`.

## Casos de teste usando fixtures

| Caso | Esperado |
|---|---|
| `same-opportunity-pncp` + `same-opportunity-private-conflict` | `candidate_link` ou `auto_merge` com `estimatedValue = conflicting`, sem sobrescrita silenciosa |
| `missing-estimated-value` | `field_confidence.estimatedValue = missing`, score permitido com baixa confianca |
| `sislog-public-web` | `proposalDeadline = missing`, fonte dry-run ate ToS |
| `new-source-candidate` | cria `source_candidate`, nao descarta portal novo |
| `comprasgov-public-api` | cria lacuna de documentos, mas mantem oportunidade processavel |

## Gate de implementacao

Antes de scaffold:

- fixtures passam no validador;
- schema tem enforcement de tenant para evidencias;
- dedupe de fonte candidata esta coberto;
- score v0 esta documentado;
- automacao autenticada continua bloqueada.

Depois de scaffold:

- transformar este documento em testes unitarios de normalizacao, dedupe e score.

## Dry-run local - 2026-05-23

Implementado em:

- `scripts/sprint0-dry-run.mjs`

Outputs:

- `outputs/sprint0-dry-run/field-confidence.v0.json`
- `outputs/sprint0-dry-run/dedupe-links.v0.json`
- `outputs/sprint0-dry-run/analysis-runs.v0.json`
- `outputs/sprint0-dry-run/summary.v0.json`
- `outputs/sprint0-dry-run/README.md`

Resultado:

- 7 candidatos processados.
- 98 linhas de confianca/lacuna geradas.
- 1 dedupe link gerado.
- 7 analysis runs gerados.
- Nenhuma automacao autenticada.
