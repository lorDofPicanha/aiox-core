# CONTADOR-G8: Plano Golden-Set Real

## Status: Done

## Description

Consolidar o plano executavel para golden-set real e rotulador tributario, sem contratar, coletar XML real ou processar dados reais nesta etapa. O objetivo e deixar pronto o protocolo de amostragem, rotulagem, metricas, formato de fixture e gates para quando o founder autorizar gasto/coleta.

## Acceptance Criteria

- [x] AC1: Plano G8 define objetivo, escopo, amostragem, fases e gates.
- [x] AC2: Plano define duplo rotulo, cegamento ao motor, criterios de ambiguidade e abstencao.
- [x] AC3: Plano define metricas permitidas e proibidas para claim de acuracia.
- [x] AC4: Formato de fixture real redigido e documentado sem dados reais.
- [x] AC5: Brief do rotulador aponta para o plano G8; protocolo antigo permanece como referencia historica.
- [x] AC6: Gate F1 atualizado: G8 deixa de ser "sem plano" e vira "plano pronto; bloqueado por autorizacao humana/coleta".
- [x] AC7: Nenhum XML real, contato externo, gasto, push ou deploy foi feito.

## Technical Notes

- Golden-set sintetico continua servindo apenas para contrato tecnico.
- Golden-set real nao deve entrar no repositorio sem storage aprovado.
- Claims de acuracia fiscal continuam proibidos ate haver lote real rotulado e metricas aprovadas.

## File List

- `docs/stories/CONTADOR-G8-golden-set-real-plan.md` - story desta entrega.
- `docs/projects/contador/46-golden-set-real-plan-v1.md` - plano G8.
- `docs/projects/contador/47-golden-set-real-fixture-contract-v1.md` - contrato de formato real redigido.
- `docs/projects/contador/32-tributarista-labeling-brief.md` - referencia ao plano G8.
- `docs/projects/contador/40-qa-security-gate-f1.md` - status G8 atualizado.
- `docs/projects/contador/34-yolo-execution-board.md` - board atualizado.

## Dependencies

- Conclave G8 `52d8a034-cd48-400d-9c9e-b34e656efdfd`.
- G4/G5 revisao juridica antes de XML real.
- Founder autorizar recrutamento/coleta/gasto.

## Definition of Done

- [x] All AC checked.
- [x] Documentation updated.
- [x] No real XML processed.
- [x] No external spend/contact performed.
- [x] No push/deploy performed.

## Evidence

- Consulta G8: `52d8a034-cd48-400d-9c9e-b34e656efdfd`.
- Tests unchanged and still passing: `contador-db`, `contador-fitness`.
