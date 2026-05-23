# Noyce Sprint 0 fixtures

Status: fixture v0 complete for known-source coverage
Data: 2026-05-23
Contrato: `../contracts/source-adapter.contract.ts`

## Objetivo

Fixtures servem para validar o pipeline multi-fonte antes de scaffold de app, banco real ou credenciais.

Elas devem cobrir:

- `SourceRecord`;
- `CanonicalCandidate`;
- evidencia por campo;
- lacunas declaradas;
- conflito entre fontes;
- `source_candidate` para portal novo dentro do raio operacional.

## Regras

- Nao usar segredo, token, cookie, certificado, login ou credencial.
- Nao depender de portal autenticado.
- Usar dados sinteticos ou anonimizados quando o dado real nao for necessario.
- Preservar a estrutura operacional dos 11 editais reais: obras/engenharia, municipio/UF, modalidade, prazos, valor e fonte.
- Todo campo critico deve ter evidencia, confianca ou lacuna.
- Dado conflituoso deve aparecer como conflito, nao como sobrescrita.

## Arquivos iniciais

- `source-records.v0.json` - registros brutos sinteticos por fonte.
- `canonical-candidates.v0.json` - candidatos normalizados esperados a partir dos registros brutos.
- `validate-fixtures.mjs` - validador local dos asserts minimos de contrato.

## Validacao

```bash
node docs/projects/buscador-licitacoes/02-architecture/fixtures/validate-fixtures.mjs
```

## Cobertura v0

Fontes cobertas:

- `pncp`
- `pcp`
- `bll`
- `bnc`
- `comprasgov`
- `sislog`
- `candidate:portal-regional-fixture`

## Casos obrigatorios

1. Mesmo edital observado por duas fontes equivalentes.
2. Fonte privada com valor estimado divergente do PNCP.
3. Fonte sem `estimatedValue`, gerando lacuna declarada.
4. Contrato ou resultado relacionado sem identificador forte, gerando `outcome_signal`, nao merge.
5. Portal novo dentro do raio operacional, gerando `candidate:<portal>`.

## Gate

Sprint 0 so pode passar quando:

- pelo menos 2 fontes normalizam pelo mesmo contrato;
- pelo menos 1 caso de conflito aparece em `fieldEvidence`/`fieldConfidence`;
- pelo menos 1 `candidate:*` vira entrada de `source_candidates`;
- nenhum caso exige automacao autenticada.
