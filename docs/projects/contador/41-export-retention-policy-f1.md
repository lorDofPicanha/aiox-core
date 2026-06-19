# Politica de Export e Retencao F1

**Projeto:** Contador / Apuracao Defensavel
**Status:** v1 tecnica - bloqueia XML real ate revisao juridica/LGPD
**Data:** 2026-06-18
**Escopo:** `events.json`, manifestos de closeout e SQL gerado por `contador-closeout-manifest`.
**Consultas:** Conclave G2/G3 `58cd5fdb-691f-4715-b7d9-5a276defff69`; Bruce Schneier `bff6b875-63f7-4da3-8786-84ce0744b85e`.

---

## 1. Decisao de Gate

| Uso | Gate |
|---|---|
| Fixtures sinteticas/dev | PASS |
| Demo sem dados reais | PASS com disclaimer |
| Export real de eventos/manifestos | FAIL ate DPA, storage controlado e logs de acesso |
| Envio a terceiro por email/WhatsApp/drive pessoal | FAIL |
| Uso em LLM/RAG | FAIL ate DPIA especifica |

## 2. Classificacao

`events.json`, manifestos e SQL de closeout sao **dados operacionais sensiveis do escritorio**. Mesmo sem XML integral, podem conter hashes, timestamps, referencias fiscais, snapshots de decisao humana e metadados suficientes para inferir atividade de cliente.

## 3. Regras de Acesso

- Export so pode ser feito por usuario autenticado do tenant, com papel operacional autorizado.
- O contrato runtime G2/G3 valida RLS com `SET ROLE authenticated` e claim Supabase simulada.
- `authenticated` pode ler apenas seu tenant; `PUBLIC`, `anon` e `motor` nao podem executar RPCs humanas/closeout indevidas.
- `core.closeout_lote` permite `SELECT` ao `authenticated` apenas via RLS; INSERT/UPDATE/DELETE direto seguem revogados.
- Service role/admin so pode exportar em rotina operacional registrada e com justificativa.

## 4. Storage e Transporte

- Ambiente dev: arquivos locais apenas com fixtures sinteticas.
- Ambiente real futuro: bucket/volume segregado por tenant, criptografia em repouso, TLS em transito, acesso por menor privilegio e log de leitura/download.
- Nomes de arquivo devem evitar CNPJ, CPF, razao social ou nome de cliente.
- Proibido enviar export por WhatsApp, email pessoal, drive pessoal ou ferramenta sem DPA/suboperador aprovado.
- Manifestos compartilhados externamente devem ser pacote controlado com hash, periodo, tenant e finalidade documentada.

## 5. Retencao Candidata

| Artefato | Retencao candidata | Observacao |
|---|---:|---|
| `events.json` bruto | Curta, ate manifesto persistido e validado | Preferir regenerar via DB quando possivel |
| Manifesto persistido em `core.closeout_lote` | Prazo probatorio/fiscal aprovado | Alinhado a trilha/laudo |
| SQL gerado por CLI | Efemero, descartar apos execucao | Nao manter em pasta compartilhada |
| Logs de export | 6 a 24 meses candidato | Ajustar no DPA/matriz final |
| Fixtures sinteticas | Sem restricao LGPD material | Marcar como sintetico |

## 6. Descarte

- Apagar exports temporarios apos persistencia/validaÃ§Ã£o do closeout.
- Registrar descarte quando houver dado real.
- Preservar manifesto/hash quando necessario para prova tecnica.
- Em incidente, congelar descarte ate preservacao de evidencias.

## 7. Incidentes

Tratar como incidente: tenant mismatch, export com dados de outro escritorio, envio a terceiro sem autorizacao, perda de arquivo real, manifesto adulterado, ou armazenamento fora do ambiente aprovado.

Fluxo minimo:

1. Suspender export do tenant afetado.
2. Preservar logs, hashes e manifesto.
3. Revogar credenciais/tokens envolvidos.
4. Classificar volume e tipo de dados.
5. Notificar founder, controlador e juridico conforme DPA.
6. Reabrir apenas apos correcao e novo smoke/gate.

## 8. Evidencia Tecnica

- `packages/contador-db/tests/sql/005_rls_export_runtime_contract.sql`
- `npm run smoke:psql --workspace @synkra/contador-db`
- `packages/contador-db/queries/export-closeout-events.sql`

## 9. Pendencias Antes de XML Real

- DPA v1 e suboperadores aprovados.
- Storage real definido com criptografia, logs e segregacao por tenant.
- Matriz de retencao final aprovada.
- Runbook de incidente aprovado por juridico/security.
- Golden-set real ou restricao comercial sem claim de acuracia.
