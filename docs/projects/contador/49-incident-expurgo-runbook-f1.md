# Runbook de Incidente e Expurgo - F1 Foundation

> Data: 2026-06-20
> Status: v1 tecnico local-first - controles DB cobertos por contrato 006; smoke Postgres pendente de execucao pelo founder
> Escopo: incidente, congelamento de evidencia e expurgo de exports/manifestos da trilha `evento_boa_fe` e do fecho `closeout_lote`.
> Gate: obrigatorio antes de piloto pago com XML real ou envio de export a terceiro.
> Consultas: reusa Threat Model `39-threat-model-f1.md` (STRIDE) e Politica de Export/Retencao `41-export-retention-policy-f1.md` (secao 6 e 7).

---

## 1. Objetivo

Definir o procedimento operacional minimo para: simular um export temporario, registrar seu descarte, simular e tratar um incidente (tenant mismatch, vazamento, cadeia quebrada, manifesto adulterado) e congelar evidencias antes de qualquer correcao.

Este runbook nao cria storage real, nao substitui DPA e nao libera XML real. Ele operacionaliza decisoes ja travadas em `39` (threat model) e `41` (export/retencao), apontando para a evidencia tecnica executavel quando o controle existe no banco e marcando como controle procedural quando o F1 ainda nao tem mecanismo no DB.

## 2. Premissas

- A fonte de verdade tecnica e `core.evento_boa_fe` e o fecho `core.closeout_lote`.
- O isolamento por tenant e garantido por RLS sobre o papel `authenticated`, com claim Supabase simulada.
- A trilha e append-only por trigger; o manifesto de fecho e imutavel por trigger; escrita de fecho so via `core_api_v1.registrar_closeout`.
- Em F1 ainda nao existe tabela de auditoria de descarte; o registro de descarte e um controle procedural (log operacional).
- Em F1 nao ha dado real: exports sao fixtures sinteticas e o expurgo de XML real ainda nao se aplica.

## 3. Controles e onde sao garantidos

| Controle | Garantia F1 | Onde |
|---|---|---|
| Isolamento de tenant no export | DB (RLS) | Contrato 006 cenario 1 + politica `41` secao 3 |
| Imutabilidade da trilha (sem UPDATE/DELETE) | DB (trigger append-only) | Contrato 006 cenario 2a/2b |
| Imutabilidade do manifesto de fecho | DB (trigger immutable) | Contrato 006 cenario 2c/2d |
| Escrita de fecho so via RPC | DB (grant revogado + RPC) | Contrato 006 cenario 3 + contrato 004 |
| Registro de descarte de export | Procedural (log operacional) | Este runbook secao 5; sem tabela em F1 |
| Congelamento de evidencia em incidente | Procedural + DB imutavel | Este runbook secao 7; reusa `41` secao 7 |
| Carimbo ICP-Brasil / prova plena | Nao implementado | `35` secao 9 e 10 (proibido em F1) |

## 4. Simular export temporario

1. Selecionar `escritorio_id` e janela.
2. Gerar o export de eventos em ordem canonica via `packages/contador-db/queries/export-closeout-events.sql`.

```powershell
psql "$env:DATABASE_URL" `
  -v escritorio_id="'11111111-1111-4111-8111-111111111111'" `
  -v periodo_inicio="'2026-06-15T00:00:00Z'" `
  -v periodo_fim="'2026-06-16T00:00:00Z'" `
  -f packages/contador-db/queries/export-closeout-events.sql > events.json
```

3. O `events.json` e **efemero/descartavel**: serve para gerar e validar o manifesto e deve ser apagado apos a persistencia/validacao do fecho (politica `41` secao 5 e 6).
4. Em F1 o export so e legitimo com fixtures sinteticas. Export real continua FAIL ate DPA, storage controlado e logs de acesso (`41` secao 1, `39` secao 1).
5. Nome de arquivo nao deve conter CNPJ, CPF, razao social ou nome de cliente (`41` secao 4).

## 5. Registrar descarte

Em F1 **nao existe tabela de auditoria de descarte**. O registro e um controle procedural (log operacional), nao uma garantia do banco. Ser honesto sobre essa limitacao.

Registro minimo de descarte (entrada de log operacional):

| Campo | Descricao |
|---|---|
| `descartado_em` | Timestamp UTC do descarte |
| `artefato` | `events.json`, SQL gerado ou manifesto temporario |
| `escritorio_id` | Tenant do artefato |
| `periodo` | Janela exportada |
| `hash_artefato` | SHA-256 do arquivo descartado, para prova de qual versao saiu |
| `motivo` | `pos-persistencia`, `expiracao`, `incidente` |
| `executado_por` | Usuario interno que descartou |
| `manifesto_preservado` | Referencia ao `closeout_lote` que sobreviveu ao descarte |

Regras:

- Apagar exports temporarios apos persistencia/validacao do fecho.
- Preservar manifesto/hash quando necessario para prova tecnica (nunca descartar o `closeout_lote`).
- Em incidente, **congelar o descarte** (secao 7) ate a preservacao de evidencias.
- Quando houver dado real, o descarte deve ser registrado; a tabela de auditoria de descarte e pendencia antes de XML real (secao 9).

## 6. Simular tenant mismatch / incidente

A evidencia executavel do isolamento e da imutabilidade e o contrato runtime:

```powershell
# Roda toda a cadeia de migrations + contratos, incluindo 006.
npm run smoke:psql --workspace @synkra/contador-db
```

Arquivo: `packages/contador-db/tests/sql/006_incident_expurgo_runtime_contract.sql`.

O contrato 006 prova, em Postgres descartavel, com `SET ROLE authenticated` e `request.jwt.claims` simulada:

- **Cenario 1 - tenant mismatch no export:** usuario de tenant A nao ve nenhuma linha de tenant B em `core.evento_boa_fe` nem `core.closeout_lote`, e ainda ve as proprias linhas (boundary seletivo, nao deny total).
- **Cenario 2 - adulteracao/imutabilidade:** UPDATE e DELETE diretos em `core.evento_boa_fe` e no manifesto `core.closeout_lote` falham; o contrato passa quando a mutacao e corretamente bloqueada.
- **Cenario 3 - escrita direta de fecho:** INSERT direto em `core.closeout_lote` pelo papel `authenticated` e rejeitado; escrita so via `core_api_v1.registrar_closeout`.

Condicoes que disparam incidente (reusa `41` secao 7 e STRIDE de `39` secao 3):

| Gatilho | Categoria STRIDE (`39`) | Acao imediata |
|---|---|---|
| Tenant mismatch / export com dados de outro escritorio | Information disclosure | Suspender export do tenant; secao 7 |
| Envio a terceiro sem autorizacao (WhatsApp/email/drive) | Information disclosure | Revogar acesso; secao 7; classificar vazamento |
| Perda de arquivo real | Information disclosure | Congelar descarte; secao 7 |
| Manifesto adulterado | Tampering | Bloquear uso probatorio; secao 7; reprocessar fecho corretivo |
| Cadeia quebrada (hash anterior divergente, evento fora de ordem) | Tampering / DoS | Bloquear fecho; `35` secao 7; abrir incidente |
| Armazenamento fora do ambiente aprovado | Elevation of privilege | Suspender export; secao 7 |

## 7. Congelamento de evidencias

Fluxo de congelamento (estende `41` secao 7 com passos concretos):

1. **Suspender export do tenant afetado.** Bloquear qualquer nova geracao de `events.json`/SQL para o `escritorio_id` ate triagem.
2. **Preservar logs, hashes e manifesto.** Nao descartar o `closeout_lote`; a imutabilidade ja e garantida por trigger (contrato 006 cenario 2), entao a evidencia tecnica permanece congelada por desenho.
3. **Revogar credenciais/tokens envolvidos.** Invalidar sessoes/JWT e tokens de quem teve acesso indevido.
4. **Congelar o descarte.** Suspender a rotina de expurgo de exports temporarios (secao 5) para nao apagar evidencia.
5. **Classificar volume e tipo de dados.** Quantos tenants, qual janela, quais artefatos, se houve dado real ou apenas fixture.
6. **Notificar founder, controlador e juridico conforme DPA.** Em F1 com fixtures sinteticas a notificacao e interna; com dado real segue prazos do DPA.
7. **Reabrir apenas apos correcao + novo smoke/gate.** Rodar `npm run smoke:psql` (inclui 006) e revalidar o gate de QA/security antes de retomar export.

Observacao: o congelamento tecnico da trilha e do manifesto e estrutural (triggers append-only/immutable), nao depende de acao manual. As acoes 1, 3, 4 e 6 sao procedurais ate existir storage real com log de acesso.

## 8. Gate

| Uso | Gate |
|---|---|
| Fixtures sinteticas/dev | PASS |
| Demo sem dados reais | PASS com disclaimer |
| Export real de eventos/manifestos | FAIL ate DPA, storage controlado e logs de acesso |
| Envio a terceiro por email/WhatsApp/drive pessoal | FAIL |
| Expurgo de dado real com auditoria de descarte | FAIL ate tabela de auditoria de descarte + DPA |
| Uso do runbook como prova juridica plena de incidente | FAIL ate sign-off juridico |

## 9. Linguagem permitida / proibida

Pode dizer:

> Os controles de isolamento por tenant e de imutabilidade da trilha e do fecho sao verificaveis por contrato runtime em banco descartavel.

> Em incidente, a evidencia tecnica (trilha e manifesto) e congelada por desenho e nao pode ser alterada nem apagada pelo papel da aplicacao.

Nao dizer:

> O sistema possui auditoria completa de descarte de dados reais.

> Este runbook constitui prova juridica plena de tratamento de incidente ou conformidade LGPD integral.

> Existe storage seguro/criptografado de exports em producao.

## 10. Evidencia Tecnica

- `packages/contador-db/tests/sql/006_incident_expurgo_runtime_contract.sql`
- `npm run smoke:psql --workspace @synkra/contador-db`
- `packages/contador-db/queries/export-closeout-events.sql`
- `npm test --workspace @synkra/contador-db` (validacao estatica do contrato 006)

## 11. Pendencias Antes de XML Real

- Storage real definido com criptografia, segregacao por tenant e log de leitura/download (`41` secao 4, `39` secao 5).
- Tabela de auditoria de descarte (`core` ou storage controlado) substituindo o log procedural da secao 5.
- DPA/suboperadores definidos e prazos de notificacao de incidente formalizados.
- Sign-off juridico/security deste runbook como suficiente para tratamento de incidente com dado real.
- Golden-set real ou restricao comercial sem claim de acuracia (`39` secao 6, `40` G8).
