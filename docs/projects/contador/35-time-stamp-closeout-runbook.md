# Time-stamp Closeout Runbook - F1 Foundation

> Data: 2026-06-16
> Status: v1 tecnico local-first - F1.3 implementado localmente, smoke Postgres pendente
> Escopo: fecho probatorio da trilha `evento_boa_fe` antes de integracao ICP-Brasil/PAdES.
> Gate: obrigatorio antes de piloto pago com promessa de anterioridade/prova.

---

## 1. Objetivo

Criar uma rotina CLI-first para congelar, verificar e registrar o estado da trilha de boa-fe por escritorio e periodo.

Este runbook nao assina documentos, nao emite carimbo ICP-Brasil e nao transforma a trilha em prova juridica plena. Ele define o contrato operacional minimo para que a futura integracao de carimbo/assinatura tenha um artefato estavel para assinar.

## 2. Premissas

- A fonte de verdade tecnica e `core.evento_boa_fe`.
- A ordem canonica da trilha e `evento_boa_fe.criado_em, evento_boa_fe.id`.
- O hash-chain por evento ja e validado pelo `contador-trilha-verifier`.
- O fecho deve ser por `escritorio_id` e por janela temporal.
- Uma janela fechada nao deve receber alteracao sem novo fecho corretivo explicitamente versionado.

## 3. Tipos de fecho

| Tipo | Frequencia | Uso | Status F1 |
|---|---:|---|---|
| Diario | D+1 | Controle operacional e deteccao rapida de adulteracao | Recomendado |
| Mensal | ate D+5 | Pacote probatorio do periodo fiscal | Obrigatorio antes de piloto pago |
| Corretivo | sob evento | Reprocessamento por incidente, bug ou decisao humana documentada | Manual |

## 4. Artefato de fecho

Cada fecho deve produzir um manifesto JSON ou JSONB com:

| Campo | Descricao |
|---|---|
| `closeout_id` | UUID do fecho |
| `escritorio_id` | Tenant fechado |
| `periodo_inicio` / `periodo_fim` | Janela fechada, `timestamptz` |
| `evento_primeiro_id` / `evento_ultimo_id` | Limites materiais da cadeia |
| `evento_count` | Quantidade de eventos fechados |
| `hash_primeiro` / `hash_ultimo` | Hashes extremos da cadeia |
| `merkle_root` | Raiz sobre hashes de eventos da janela, quando implementada |
| `verifier_version` | Versao do verificador usado |
| `schema_version` | Versao das migrations aplicadas |
| `executado_por` | Usuario interno que executou o fecho |
| `executado_em` | Timestamp de execucao |
| `resultado` | `pass`, `fail`, `superseded` |
| `relatorio_path` | Caminho do relatorio exportado |
| `time_stamp_provider` | `none` em F1; futuro ACT/ICP-Brasil |
| `time_stamp_token_ref` | Nulo em F1 |

## 5. Procedimento diario

1. Selecionar `escritorio_id` e janela D-1.
2. Exportar eventos da janela em ordem canonica.
3. Rodar `contador-trilha-verifier` sobre o export.
4. Se falhar, abrir incidente e bloquear fecho mensal ate triagem.
5. Se passar, gerar manifesto de fecho diario.
6. Armazenar manifesto em repositorio operacional ou tabela futura de closeout.
7. Registrar hash do manifesto no log operacional.

Comando local F1.3 para manifesto a partir de export JSON:

```powershell
npm run build --workspace @synkra/contador-trilha-verifier
node packages/contador-trilha-verifier/dist/closeout-cli.js --input events.json --escritorio <uuid> --inicio 2026-06-15T00:00:00Z --fim 2026-06-16T00:00:00Z --tipo diario
```

Para gerar a chamada SQL de persistencia via `core_api_v1.registrar_closeout(...)`:

```powershell
node packages/contador-trilha-verifier/dist/closeout-cli.js --input events.json --escritorio <uuid> --inicio 2026-06-15T00:00:00Z --fim 2026-06-16T00:00:00Z --tipo diario --format sql
```

Status F1.3: comando implementado para fixtures/dev/export JSON. Persistencia em `core.closeout_lote` existe como migration 004; aplicar em Postgres descartavel antes de qualquer uso real.

## 6. Procedimento mensal

1. Confirmar que todos os fechos diarios do mes estao `pass`.
2. Exportar a janela mensal completa.
3. Rodar verificador independente, preferencialmente em ambiente limpo.
4. Gerar manifesto mensal com hash final da cadeia e raiz agregada.
5. Submeter manifesto ao gate fiscal/juridico antes de qualquer uso comercial.
6. No futuro, enviar o manifesto para ACT/ICP-Brasil e anexar token de tempo.
7. No futuro, anexar assinatura do contador/representante quando o laudo exigir.

## 7. Criterios de falha

| Falha | Acao |
|---|---|
| Hash anterior divergente | Bloquear fecho; investigar adulteracao ou bug de canonicalizacao |
| Evento fora de ordem | Reexportar; se persistir, incidente de dados |
| Evento sem tenant correto | Bloquear janela; revisar RLS/RPC |
| Decisao humana sem `revisor_snapshot` | Bloquear uso probatorio; reprocessar apenas com decisao documentada |
| Evento sem `evidencia_hash` em decisao humana | Bloquear piloto pago; migration/contrato incompleto |
| Manifesto sem executor | Rejeitar fecho |

## 8. Mudancas tecnicas futuras

Antes de producao, criar:

- ~~Tabela `core.closeout_lote` para manifestos de fecho.~~ Feito em `004_closeout_lote.sql`; escrita publicada por `core_api_v1.registrar_closeout`.
- Tabela ou storage imutavel para exports assinaveis.
- ~~CLI local para gerar manifesto.~~ Feito em `contador-closeout-manifest`, com `--format sql` para persistencia via RPC.
- ~~Teste runtime que gera evento, fecha janela, valida manifesto e detecta adulteracao.~~ Feito no verifier para fixture local; smoke Postgres pendente.
- Campo de referencia de token ICP-Brasil quando provider for definido.

## 9. Gate comercial

| Uso | Decisao |
|---|---|
| Demo sem dados reais | PASS com explicacao tecnica limitada |
| Piloto pago sem promessa de prova de anterioridade | CONCERNS, exige aceite explicito |
| Promessa de anterioridade/prova juridica plena | FAIL ate ACT/ICP-Brasil + sign-off legal |
| Laudo assinado por contador/tributarista | FAIL ate fluxo de assinatura definido |

## 10. Linguagem permitida

Pode dizer:

> A trilha tecnica e verificavel e esta preparada para fecho periodico.

Nao dizer:

> A trilha ja possui carimbo ICP-Brasil, prova juridica plena ou assinatura digital valida para qualquer disputa.
