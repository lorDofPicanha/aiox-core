# Noyce - Sprint 0 schema and adapters implementation plan

Data: 2026-05-22
Status: ready for build handoff

## Inputs

- `ADR-001-equal-priority-multisource-canonical-model-22mai.md`
- `13-sprint0-council-routing-22mai.md`
- `sql/0001_noyce_equal_priority_canonical_schema.sql`
- `contracts/source-adapter.contract.ts`

## Decision

Sprint 0 deve implementar o nucleo multi-fonte com fontes equivalentes:

- PNCP
- PCP
- BLL
- BNC
- ComprasGov
- SISLOG
- `source_candidates`

Nenhuma fonte e principal. O pipeline deve tratar todas pelo mesmo contrato.

## Sequence

### Step 1 - Schema canonical review

Owner: `@data-engineer`

Entrada:

- `sql/0001_noyce_equal_priority_canonical_schema.sql`

Checklist:

- Validar tipos enum.
- Validar RLS.
- Validar indexes por `org_id`.
- Validar `source_candidates`.
- Validar `field_evidence` e `field_confidence`.
- Validar `dedupe_links`.
- Validar que nenhuma tabela tenant-scoped ficou sem `org_id`.

Gate:

- 0 tabela de dados do cliente sem RLS.
- 0 tabela de dados do cliente sem `org_id`.
- 0 policy que permita cross-tenant.
- Nenhuma policy depende de fonte principal.

### Step 2 - Adapter contract review

Owner: `@architect` + `@data-engineer`

Entrada:

- `contracts/source-adapter.contract.ts`

Checklist:

- Confirmar que todo adapter emite `SourceRecord`.
- Confirmar que todo adapter normaliza para `CanonicalCandidate`.
- Confirmar que `fieldEvidence` e `qualityIssues` sao obrigatorios.
- Confirmar que `fetchEvents` e `fetchOutcomes` sao opcionais.
- Confirmar suporte a `candidate:*`.

Gate:

- Nenhum adapter calcula score final.
- Nenhum adapter decide merge final.
- Nenhum adapter omite origem/evidencia.

### Step 3 - Fixtures multi-fonte

Owner: `@data-engineer` + `@qa`

Entrada:

- 11 editais reais em `01-research/editais-reais/`
- outputs do gate Stage 2
- exports/manuais ou simulacoes fieis das fontes conhecidas

Fixtures esperadas:

- `pncp`
- `pcp`
- `bll`
- `bnc`
- `comprasgov`
- `sislog`
- `candidate:<portal>`

Gate:

- Cada fixture deve conter pelo menos um `rawPayload`.
- Cada fixture deve gerar `rawHash`.
- Cada fixture deve ter exemplo de campo ausente.
- Pelo menos uma fixture deve representar conflito entre fontes.
- Pelo menos uma fixture deve representar portal novo como `source_candidate`.

### Step 4 - Normalization pipeline

Owner: `@backend`

Fluxo:

```text
SourceRecord
-> CanonicalCandidate
-> fieldEvidence
-> fieldConfidence
-> dedupeLinks
-> Opportunity
```

Gate:

- 100% dos campos criticos com evidencia, confianca ou lacuna.
- Inferencia nunca aparece como fato.
- Dado bruto preservado em `source_records`.

### Step 5 - Dedupe/link v0

Owner: `@data-engineer`

Regras:

- `>=80`: auto-merge.
- `60-79`: candidate link.
- `<60`: manter separado.

Bloqueio:

- Contrato, homologacao e resultado nao podem virar merge automatico sem identificador forte.

Gate:

- Caso PNCP sem `numeroControlePncpCompra` deve gerar `related_contract` ou `outcome_signal`, nao merge final.
- Conflito entre fontes deve gerar `conflicting`, nao sobrescrever silenciosamente.

### Step 6 - Score v0

Owner: `@data`

Formula:

```text
25% fit com a empresa
20% atratividade financeira
15% concorrencia esperada
15% risco operacional/habilitacao
10% urgencia/prazo
10% qualidade das evidencias
5% sinal estrategico/manual
```

Gate:

- Score e confianca sao numeros separados.
- `analysis_runs` salva inputs, versao, componentes, motivos e lacunas.
- Score alto + confianca baixa aparece como "promissora, mas incompleta".

### Step 7 - UX operational shell

Owner: `@frontend`

Liberado:

- Inbox operacional.
- Detalhe da oportunidade.
- Evidencias fato/inferencia/lacuna.
- Preco/concorrentes.
- Checklist de habilitacao.
- Timeline.

Bloqueado:

- Landing page.
- Chat-first.
- Dashboard executivo generico.
- Ajuste fino de brand/cor se nao for necessario para fluxo.

### Step 8 - Security and automation gate

Owner: `@security` + `@devops` + `@qa`

Liberado:

- Fontes publicas.
- Fixtures.
- Exports manuais.
- Dry-run.

Bloqueado ate validacao humana:

- Credencial real.
- Login automatico.
- Captura autenticada.
- Protocolo.
- Lance.
- Intencao recursal.
- Assinatura.
- Envio de mensagem em sessao.

## Critical Items Waiting Founder

Estes itens devem esperar o fundador voltar:

- Escolha das empresas/CNPJs reais do cliente.
- Confirmacao de qual empresa licita.
- Confirmacao de usuarios/papeis reais.
- Confirmacao de fontes usadas com mais frequencia pela cliente.
- Autorizacao para qualquer automacao autenticada.
- Uso de credenciais, certificado digital ou login real.
- Qualquer decisao de ToS cinza.
- Qualquer execucao contra banco de producao.

## Non-critical Work Allowed in YOLO Mode

Pode continuar sem esperar:

- Refinar docs.
- Criar fixtures anonimizadas.
- Criar contratos/interfaces.
- Criar SQL de referencia.
- Criar testes de contrato em pseudo-codigo.
- Criar plano de gates.
- Auditar consistencia dos docs.

## Build Gate Definition

Sprint 0 passa quando:

- schema canonico cobre fontes equivalentes;
- adapters/fixtures usam o mesmo contrato;
- `source_candidates` captura portais novos no raio de 500 km;
- 11 editais entram no pipeline;
- campos criticos tem evidencia/confianca/lacuna;
- dedupe nao cria merge indevido;
- score e confidence aparecem separados;
- nenhum segredo aparece em log;
- automacao autenticada permanece bloqueada ate aprovacao.
