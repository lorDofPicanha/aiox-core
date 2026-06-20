# Threat Model F1 - Dados Fiscais, Trilha e Closeout

**Projeto:** Contador / Apuracao Defensavel
**Status:** v1 tecnico - G1/G2/G3 PASS em runtime descartavel; requer juridico/LGPD antes de XML real
**Data:** 2026-06-18
**Escopo:** F1/F1.1/F1.2/F1.3: schema core, RPCs humanas, `evento_boa_fe`, verifier e closeout tecnico.
**Consultas:** Bruce Schneier `aacb01fb-20b8-48d4-a44a-21136177edac`, `bff6b875-63f7-4da3-8786-84ce0744b85e`; Conclave G2/G3 `58cd5fdb-691f-4715-b7d9-5a276defff69`; Patricia Peck `d2eeb203-c4df-4899-b8be-79fd8e5a0f7e`; Heleno Taveira Torres `e6ba0d81-1f02-4bc3-9db8-b6e38dd3978e`.

---

## 1. Decisao de gate

| Uso | Gate security |
|---|---|
| Fixtures sinteticas/dev | PASS |
| Demo sem dados reais | PASS com disclaimer |
| XML real em ambiente controlado | CONCERNS ate LGPD v1 + DPA/storage real + golden-set |
| Captura automatica/provider | FAIL ate vendor/security review |
| RAG/LLM com XML real | FAIL ate DPIA + threat model especifico |

## 2. Assets protegidos

| Asset | Risco principal | Controle F1/F1.3 |
|---|---|---|
| XML/hash/path fiscal | Exposicao de dado fiscal/pessoal | Sem XML real; hash/reference; DPA futuro |
| `core.evento_boa_fe` | Adulteracao da cadeia | Append-only trigger + verifier + closeout |
| RPCs humanas | Impersonacao de contador | F1.2 exige tenant claim, caller `sub`, papel contador e CRC ativo |
| `core.closeout_lote` | Manifesto falso ou alterado | `manifesto_hash`, immutable trigger, provider `none` honesto |
| `core_api_v1.registrar_closeout` | Persistencia cross-tenant ou bypass direto | Tenant claim obrigatoria; INSERT direto revogado |
| Export JSON de eventos | Vazamento fora do DB | So fixtures/dev ate security/LGPD PASS |
| Claims comerciais | Promessa indevida de prova/acuracia | `time_stamp_provider='none'`; sem ICP/PAdES |

## 3. STRIDE resumido

| Categoria | Ameaca | Mitigacao atual | Pendente |
|---|---|---|---|
| Spoofing | Usuario aprova como outro contador | F1.2 vincula caller ao revisor | Teste runtime Supabase/JWT real |
| Tampering | Evento alterado apos gravacao | Trigger append-only; verifier detecta hash mismatch; smoke F1.3 PASS | Storage imutavel de exports reais |
| Repudiation | Contador nega decisao | `revisor_snapshot`, `evidencia_ref`, `evidencia_hash` | Sign-off juridico sobre suficiencia probatoria |
| Information disclosure | Export de eventos vaza dados fiscais | Sem dados reais; minimizacao em payload; politica `41` criada | Storage/logs reais pendentes |
| Denial of service | Closeout falha por cadeia quebrada ou janela grande | CLI local falha fechado; runbook de incidente em `49-incident-expurgo-runbook-f1.md` | Limites de lote |
| Elevation of privilege | Role app escreve direto em tabelas core/closeout | Grants/revokes, RLS e RPC publicada para closeout; contrato 005 PASS | Validar novamente no ambiente real antes de XML |

## 4. Abusos especificos

1. **Manifesto vendido como carimbo ICP sem token real.**
   Mitigacao: `time_stamp_provider='none'` e `time_stamp_token_ref=null`; copy proibida em `35`.

2. **Export JSON com payload sensivel enviado por WhatsApp/email.**
   Mitigacao: bloqueado para dado real; exports reais exigem storage controlado, retention e audit log.

3. **Closeout de janela parcial usado como prova completa.**
   Mitigacao: manifesto registra `periodo_inicio/fim`, `evento_count`, seq primeiro/ultimo e hashes extremos.

4. **PITR/restore trunca cadeia sem re-ancoragem.**
   Mitigacao parcial: verifier/closeout detectam divergencia; pendente runbook de restauracao como evento.

5. **Texto livre em motivo/fundamento carrega PII desnecessaria.**
   Mitigacao parcial: LGPD pack proibe excesso; pendente codigos controlados e lint de texto livre.

## 5. Controles obrigatorios antes de XML real

- [x] Postgres smoke `001+002+003+004` em banco descartavel.
- [x] Teste runtime de RLS/grants com claims Supabase simuladas.
- Provar que `authenticated` nao tem INSERT direto em `core.closeout_lote` e que grava apenas por `core_api_v1.registrar_closeout`.
- [x] Politica tecnica de export: localizacao, criptografia, acesso, retencao e exclusao (`41-export-retention-policy-f1.md`).
- DPA/suboperadores definidos.
- [x] Runbook de incidente para tenant mismatch, vazamento e cadeia quebrada (`49-incident-expurgo-runbook-f1.md`; controles DB cobertos pelo contrato 006). Requer sign-off juridico/security antes de XML real.
- Proibicao formal de envio a LLM/RAG.
- Revisao legal/fiscal do uso de manifesto como evidencia tecnica, nao prova plena.

## 6. Proxima acao

Proxima acao: consolidar DPA, suboperadores, storage real e matriz de retencao final. Nao liberar XML real apenas com os gates tecnicos.
