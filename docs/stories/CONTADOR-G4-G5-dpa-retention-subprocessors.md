# CONTADOR-G4-G5: DPA, Suboperadores e Retencao

## Status: Done

## Description

Criar artefatos revisaveis para liberar a proxima etapa juridica/LGPD do Contador: minuta operacional de DPA, registro de suboperadores e matriz de retencao para XML, eventos, manifestos, laudos, logs e fixtures. Estes documentos nao liberam XML real sem revisao juridica e aprovacao do founder.

## Acceptance Criteria

- [x] AC1: Minuta DPA define papeis controlador/operador, instrucoes documentadas, finalidade, seguranca, suboperadores, incidente, retorno/eliminacao e proibicoes.
- [x] AC2: Registro de suboperadores lista categorias atuais/futuras, status, riscos e gate de aprovacao.
- [x] AC3: Matriz de retencao separa XML, nota/item, trilha, manifesto, laudo, logs, exports temporarios e fixtures.
- [x] AC4: Artefatos citam fontes oficiais usadas como base juridica operacional.
- [x] AC5: Gate F1 atualizado: G4/G5 saem de pendente para "artefato v1 pronto; requer revisao juridica antes de dado real".
- [x] AC6: XML real continua bloqueado explicitamente.

## Technical Notes

- Nao criar API, UI, captura, provider externo, deploy, push ou envio a terceiro.
- Nao representar estes documentos como aconselhamento juridico final.
- Basear em fontes oficiais: ANPD guia de agentes de tratamento e pagina de comunicacao de incidente.

## File List

- `docs/stories/CONTADOR-G4-G5-dpa-retention-subprocessors.md` - story desta entrega.
- `docs/projects/contador/42-dpa-operador-controlador-v1.md` - minuta operacional DPA.
- `docs/projects/contador/43-suboperadores-register-v1.md` - registro de suboperadores.
- `docs/projects/contador/44-retention-matrix-v1.md` - matriz de retencao.
- `docs/projects/contador/31-data-map-lgpd-f1.md` - gate LGPD atualizado.
- `docs/projects/contador/36-lgpd-operational-pack-f1.md` - referencias G4/G5.
- `docs/projects/contador/40-qa-security-gate-f1.md` - status G4/G5 atualizado.
- `docs/projects/contador/34-yolo-execution-board.md` - board atualizado.

## Dependencies

- G1/G2/G3 PASS tecnico.
- Conclave G4/G5 `c59f6ccb-8afd-45bf-94bd-198c576e7f5b`.

## Definition of Done

- [x] All AC checked.
- [x] Documentation updated.
- [x] No XML real processed.
- [x] No push/deploy performed.

## Evidence

- Consulta legal/product/QA: `c59f6ccb-8afd-45bf-94bd-198c576e7f5b`.
- Fontes oficiais consultadas:
  - ANPD, Guia Orientativo para Definicoes dos Agentes de Tratamento de Dados Pessoais e do Encarregado.
  - ANPD, Comunicacao de Incidente de Seguranca, modificada em 2026-06-02.
