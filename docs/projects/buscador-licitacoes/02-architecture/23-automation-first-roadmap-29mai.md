# 23 - Automation-first roadmap Noyce (29/Mai/2026)

Status: aprovado como direcao de produto/arquitetura, com gates.

## Decisao

Noyce deve seguir automation-first no lado de leitura: descoberta, normalizacao, score, alerta interno e fila operacional. Atos externos continuam human-only.

## Permitido agora

- PNCP publico em dry-run, sem login, segredo, escrita em banco de producao ou mensagem externa.
- Normalizacao de registros publicos para candidatos canonicos.
- Ranking/triagem fixture-only ou dry-run publico.
- Enriquecimento com documentos/anexos publicos quando nao exigir autenticacao.
- Alertas internos marcados como dry-run.

## Bloqueado

- Login em BLL, BNC, PCP, ComprasGov ou SISLOG sem vault.
- Uso de senha, token, cookie, certificado ou 2FA em docs, git, chat, output ou log.
- Automacao autenticada sem revisao de ToS por portal, consentimento documentado, redaction/auditoria e feature flag.
- Envio de mensagem externa, lance, protocolo, impugnacao, recurso ou qualquer ato juridico/processual sem aprovacao humana explicita.
- Escrita em banco de producao sem gate DevOps.

## Gate da proxima automacao

- 0 segredo em log/output.
- 0 login/portal autenticado.
- Output marcado como dry-run.
- Idempotencia por `source + external_id + raw_hash`.
- Evidencia e URL de origem preservadas.
- QA valida regressao antes de qualquer proxima fonte.

## Proxima delegacao

Owner: `@data-engineer`

Council: `@cyber-chief`, `@qa`, `@aios-master`

Tarefa:

- usar os 40 candidatos canonicos PNCP para triagem ENIAC;
- priorizar oportunidades com objeto de obra/engenharia, prazo aberto e valor estimado positivo;
- manter BLL/BNC/PCP como fonte de confirmacao manual ate vault/ToS;
- decidir se a proxima automacao e ranking fixture-only ou enriquecimento PNCP publico de documentos/anexos.

Referencias:

- `17-execution-roadmap-agent-ownership-23mai.md`
- `outputs/pncp-public-dry-run/`
- conclave `35cd914e-7468-4e04-806a-1cf435d2598c`
