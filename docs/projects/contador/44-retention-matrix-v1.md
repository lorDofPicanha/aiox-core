# Matriz de Retencao v1

**Projeto:** Contador / Apuracao Defensavel
**Status:** v1 candidata - requer validacao juridica/fiscal
**Data:** 2026-06-18
**Gate:** G5 artefato pronto; prazo final depende de DPA e parecer fiscal/juridico.

---

## 1. Principio

Reter pelo menor prazo compativel com finalidade fiscal, contratual, probatoria e de seguranca. Exports temporarios devem ser efemeros; trilha, manifesto e laudo seguem prazo probatorio aprovado.

## 2. Matriz

| Categoria | Exemplos | Retencao candidata | Base/razao operacional | Descarte |
|---|---|---:|---|---|
| XML/documento fiscal | XML NF-e/NFS-e, chave, emitente/destinatario, storage path | Prazo fiscal/probatorio definido pelo controlador, candidato 5 anos + margem contratual | Obrigacao fiscal/prova tecnica | Eliminar do storage; preservar hash se permitido |
| Nota e item normalizados | `core.nota`, `core.nota_item`, NCM, CFOP, valores | Igual ao XML/documento | Reprocessamento e defesa | Expurgo por tenant/periodo |
| Analise tecnica | `analise_execucao`, base/motor versao, parametros | Igual ao laudo/periodo fiscal | Reprodutibilidade | Remover `resposta_bruta` excessiva primeiro |
| Apontamento e decisao humana | `apontamento_auditoria`, motivo, revisor, CRC | Prazo probatorio aprovado | Boa-fe e responsabilizacao profissional | Bloquear alteracao; expurgo controlado quando permitido |
| Trilha de boa-fe | `evento_boa_fe`, hashes, evidencia_ref | Prazo probatorio aprovado | Integridade e auditoria | Preservar hash/head quando defensavel |
| Closeout/manifesto | `closeout_lote`, manifesto_hash, merkle_root | Igual a trilha/laudo | Prova tecnica de janela | Nao apagar sem procedimento de supersedencia/expurgo aprovado |
| Laudo tecnico | Relatorio entregue ao escritorio/cliente | Prazo contratual/probatorio aprovado | Entrega e defesa | Devolucao ou eliminacao conforme contrato |
| Export temporario | `events.json`, SQL gerado por CLI, pacote ZIP | Ate persistencia/validacao; candidato 24h-7d em ambiente real | Operacao transitÃ³ria | Apagar e registrar descarte |
| Logs de acesso/export | Usuario, tenant, acao, timestamp, IP se houver | 6-24 meses candidato | SeguranÃ§a, auditoria e incidente | Rotacao com preservacao em incidente |
| Backups | Snapshots DB/storage | Janela operacional curta definida pelo provider | Recuperacao de desastre | Expirar automaticamente |
| Fixture sintetica | Dados artificiais de teste | Enquanto util ao desenvolvimento | Sem LGPD material se comprovadamente sintetico | Remover quando obsoleto |

## 3. Regras de Expurgo

- Nunca expurgar parcialmente uma cadeia sem registrar impacto no verifier/closeout.
- Antes de apagar XML, confirmar se hash, nota normalizada e evento bastam para a finalidade remanescente.
- Exports temporarios nao devem virar arquivo permanente.
- Em incidente, suspender descarte ate preservacao de evidencias.
- Direito de titular deve ser tratado pelo controlador; operador apoia tecnicamente.

## 4. Pendencias de Validacao

- Confirmar prazo fiscal/probatorio por tipo documental e regime.
- Definir se a margem contratual alem do prazo fiscal sera adotada.
- Confirmar tratamento de documentos contendo CPF/consumidor pessoa natural.
- Validar retencao minima de logs com juridico/security.
- Definir processo operacional de expurgo por tenant/periodo.

## 5. Gate de Saida

Para XML real:

- Matriz assinada/aprovada pelo founder e juridico.
- DPA referenciando esta matriz.
- Storage real com politica de lifecycle.
- Runbook de expurgo e incidente testado em fixture.
