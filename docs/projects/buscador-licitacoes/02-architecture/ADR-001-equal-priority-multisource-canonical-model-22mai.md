# ADR-001 - Equal-priority multi-source canonical model

Data: 2026-05-22
Status: Accepted
Projeto: Noyce / buscador-licitacoes

## Contexto

O Noyce deve monitorar editais e acompanhar o processo de licitacao em multiplas fontes:

- PNCP
- PCP
- BLL
- BNC
- ComprasGov
- SISLOG
- novos portais encontrados dentro do raio operacional de 500 km

A pesquisa com PNCP validou filtros uteis por municipio, orgao e contratos, mas tambem mostrou que PNCP nao fecha sozinho vencedor/contrato/concorrencia com confianca suficiente em todos os casos.

O produto tambem nao deve ser desenhado como PNCP-first. A operacao do cliente acontece em varios portais, e a promessa do Noyce e acompanhar o processo completo, nao apenas listar oportunidades de uma fonte.

## Decisao

Adotar um modelo canonico multi-fonte de prioridade equivalente.

Nenhuma fonte tera prioridade estrutural no dominio, no schema ou no pipeline. PNCP, PCP, BLL, BNC, ComprasGov, SISLOG e fontes candidatas descobertas devem entrar pelo mesmo contrato de adapter e produzir candidatos canonicos com evidencia e confianca por campo.

Prioridade pode existir apenas como configuracao operacional do cliente ou peso de score, nunca como premissa fixa do modelo.

## Principios

1. Fonte e observacao, nao verdade absoluta.
2. Registro bruto deve ser preservado e versionado.
3. Adapter retorna candidato canonico, nao decisao final.
4. Todo campo critico precisa ter evidencia, confianca ou lacuna declarada.
5. Dedupe/link nao pode destruir informacao nem esconder conflito.
6. Portais novos dentro do raio de 500 km entram como `source_candidate`.
7. Automacao autenticada nao roda sem ToS, consentimento, vault, logs e auditoria.

## Modelo Canonico Minimo

Tabelas/entidades do Sprint 0:

- `sources`
- `source_candidates`
- `source_records`
- `buyers`
- `suppliers`
- `opportunities`
- `opportunity_items`
- `notice_documents`
- `process_events`
- `deadlines`
- `price_references`
- `competitor_signals`
- `analysis_runs`
- `field_evidence`
- `field_confidence`
- `dedupe_links`

## Source Candidates

`source_candidates` registra portais relevantes ainda nao integrados.

Uma fonte candidata deve ser criada quando:

- edital relevante aparece dentro do raio operacional de 500 km;
- o portal nao esta na lista de fontes conhecidas;
- a oportunidade tem relacao com objeto, municipio, orgao ou perfil de interesse;
- o portal aparece de forma recorrente ou tem alto valor operacional mesmo com baixa recorrencia.

Campos minimos:

- `id`
- `name`
- `base_url`
- `portal_url_example`
- `city_ibge_code`
- `uf`
- `buyer_name`
- `buyer_cnpj`
- `example_opportunity_url`
- `example_object`
- `first_seen_at`
- `last_seen_at`
- `seen_count`
- `access_mode`
- `requires_auth`
- `has_api_signal`
- `tos_risk`
- `adapter_priority`
- `notes`

`adapter_priority` nao significa prioridade do produto. Significa prioridade de implementacao do adapter, calculada por recorrencia, valor, risco e uso real do cliente.

## Contrato de Adapter

Todo adapter deve obedecer ao mesmo contrato conceitual:

```ts
interface SourceAdapter {
  sourceCode: SourceCode;
  discover(params: DiscoverParams): Promise<SourceRecord[]>;
  fetchDetail(record: SourceRecord): Promise<SourceRecord>;
  fetchDocuments(record: SourceRecord): Promise<NoticeDocumentInput[]>;
  normalize(record: SourceRecord): Promise<CanonicalCandidate>;
  fetchEvents?(opportunity: OpportunityRef): Promise<ProcessEventInput[]>;
  fetchOutcomes?(opportunity: OpportunityRef): Promise<OutcomeSignalInput[]>;
  healthcheck(): Promise<AdapterHealth>;
}
```

`CanonicalCandidate` deve conter:

- `opportunity`
- `buyer`
- `items`
- `documents`
- `events`
- `deadlines`
- `fieldEvidence`
- `qualityIssues`
- `sourceLinks`

O adapter tambem deve emitir:

- `adapter_version`
- `source_latency_ms`
- `rate_limit_observed`
- `auth_context`
- `raw_hash`
- `normalization_warnings`

## Evidencia e Confianca

Campos com evidencia/confianca obrigatoria no Sprint 0:

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

Niveis de confianca:

- `confirmed`
- `strong`
- `inferred`
- `weak`
- `conflicting`
- `missing`

Regra: o sistema pode mostrar inferencia, mas nunca pode apresentar inferencia como fato.

## Dedupe e Links

Dedupe deve ser em duas camadas:

1. deterministica;
2. probabilistica/fuzzy.

Chaves fortes:

- `source_code + external_id`
- `numeroControlePNCP`

Chave canonica provavel:

- `buyer_cnpj`
- `normalized_modality`
- `normalized_process_number`
- `publication_year`

Sinais fuzzy:

- `buyer_cnpj`
- `city_ibge_code`
- `date_bucket`
- `object_similarity`
- `estimated_value_similarity`
- `modality`

Decisao:

- `>=80`: auto-merge.
- `60-79`: candidate link/revisao.
- `<60`: manter separado.

Contratos, homologacoes e resultados nao devem ser automaticamente unidos ao edital se nao houver identificador forte. Devem entrar como `related_contract` ou `outcome_signal` com nivel de confianca.

## Consequencias

### Positivas

- Evita lock-in conceitual em PNCP.
- Permite adicionar portais regionais sem redesenhar o dominio.
- Preserva rastreabilidade e auditoria.
- Reduz risco de falsa precisao.
- Sustenta score explicavel, concorrencia, preco e workflow.

### Custos

- Mais tabelas desde o inicio.
- Mais disciplina em fixtures e testes.
- Dedupe/merge fica mais complexo.
- UI precisa mostrar fato, inferencia e lacuna com clareza.

## Gates

Sprint 0 so passa se:

- todas as fontes conhecidas tiverem adapter real, fixture ou export normalizado pelo mesmo contrato;
- novos portais encontrados no raio de 500 km forem registrados como `source_candidate`;
- 100% dos campos criticos tiverem evidencia, confianca ou lacuna;
- dedupe nao fizer merge indevido;
- score explicar componentes e confianca;
- nenhum segredo aparecer em logs;
- nenhuma automacao autenticada rodar sem ToS, consentimento, vault e auditoria.

## Referencias Internas

- `13-sprint0-council-routing-22mai.md`
- `11-build-plan-codex-handoff-21mai.md`
- `STORY-NOYCE-S0-MVP-WORKFLOW.md`
- `12-experimento-cobertura-stage2-21mai.md`
