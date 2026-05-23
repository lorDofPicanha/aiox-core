# Noyce - Source adapter contract tests v0

Data: 2026-05-23
Status: ready for implementation
Fixtures:

- `../fixtures/source-records.v0.json`
- `../fixtures/canonical-candidates.v0.json`

## Objetivo

Definir os testes minimos que qualquer implementacao do contrato `source-adapter.contract.ts` deve passar antes de scaffold de app ou integracao com banco real.

Estes testes sao intencionalmente baseados em fixtures e dry-run. Nenhuma credencial real, login ou portal autenticado deve ser usado.

## Test suite

### 1. Source coverage

Assert:

- `source-records.v0.json` contem exatamente as fontes conhecidas P0/P1 do Sprint 0:
  - `pncp`
  - `pcp`
  - `bll`
  - `bnc`
  - `comprasgov`
  - `sislog`
- contem pelo menos uma fonte candidata com prefixo `candidate:`.

Fail se:

- qualquer fonte conhecida faltar;
- fixture candidata nao usar prefixo `candidate:`;
- qualquer fixture usar `authContext: "user_credential"`.

### 2. Raw record contract

Para cada `SourceRecord`:

- `orgId` obrigatorio;
- `sourceCode` obrigatorio;
- `rawPayload` obrigatorio;
- `rawHash` obrigatorio;
- `fetchedAt` obrigatorio;
- `adapterVersion` obrigatorio;
- `normalizationWarnings` deve existir, mesmo vazio.

Fail se:

- `rawPayload` for string de log em vez de objeto estruturado;
- `rawHash` estiver vazio;
- houver token, cookie, senha, certificado ou login no payload.

### 3. Canonical candidate contract

Para cada `CanonicalCandidate`:

- `orgId` obrigatorio;
- `sourceCode` obrigatorio;
- `sourceRecordHash` deve existir em `source-records.v0.json`;
- `opportunity.object` obrigatorio;
- `fieldEvidence` obrigatorio, podendo ser vazio apenas quando houver `qualityIssues` explicando lacuna;
- `qualityIssues` obrigatorio, mesmo vazio;
- `sourceLinks` obrigatorio;
- `adapterMeta.rawHash` deve bater com `sourceRecordHash`.

Fail se:

- candidate normalizado nao puder ser rastreado ate um `SourceRecord`;
- adapter tentar preencher score final;
- adapter tentar decidir merge final.

### 4. Missing-field behavior

Casos obrigatorios:

- `missing-estimated-value`;
- `sislog-public-web`.

Assert:

- campo ausente vira `QualityIssue` com `severity: "warning"` ou `confidence_level: "missing"` na etapa de persistencia;
- campo ausente nao vira valor default silencioso;
- oportunidade continua processavel quando a lacuna nao for bloqueante.

Fail se:

- valor ausente virar `0`;
- prazo ausente virar data artificial;
- lacuna aparecer como fato.

### 5. Conflict behavior

Caso obrigatorio:

- `same-opportunity-private-conflict`.

Assert:

- conflito de `estimatedValue` vira `QualityIssue`;
- `sourceLinks` deve usar `same_opportunity` com confianca inferior a `confirmed` quando nao houver identificador forte;
- etapa de merge deve preservar ambas as evidencias.

Fail se:

- valor da segunda fonte sobrescrever a primeira sem `field_confidence: conflicting`;
- dedupe fizer `auto_merge` sem justificativa forte.

### 6. Candidate source behavior

Caso obrigatorio:

- `new-source-candidate`.

Assert:

- `sourceCode` usa `candidate:<slug>`;
- `SourceRecord` deve poder criar entrada em `source_candidates`;
- `sourceLinks[0].confidence` nao deve ser `confirmed`;
- `authContext` deve ser `fixture`.

Fail se:

- portal novo for descartado por nao estar na lista original;
- portal novo virar fonte conhecida sem revisao;
- qualquer coleta autenticada for disparada.

### 7. Security checks

Assert global:

- nenhuma string contem `password`, `senha`, `token`, `cookie`, `secret`, `cert`, `private_key`;
- nenhum `externalUrl` aponta para ambiente autenticado real;
- nenhum fixture usa CNPJ real de cliente.

Fail se:

- fixture contem segredo;
- fixture contem credencial;
- fixture depende de login real.

## Implementation hint

Quando houver scaffold TypeScript, estes testes podem virar:

- `adapter-contract.fixture.test.ts`
- `source-record.schema.test.ts`
- `canonical-candidate.schema.test.ts`

Antes disso, podem ser executados com um script Node simples que parseia JSON, percorre arrays e valida os asserts acima.
