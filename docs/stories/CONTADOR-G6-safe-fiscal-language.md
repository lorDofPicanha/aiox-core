# CONTADOR-G6: Linguagem Fiscal Segura

## Status: Done

## Description

Fechar a linguagem fiscal/comercial permitida e proibida para demo, concierge e piloto controlado do Contador, evitando promessas de prova juridica plena, credito garantido, economia garantida, acuracia fiscal real, ausencia de multa e substituicao do contador/advogado.

## Acceptance Criteria

- [x] AC1: Matriz de claims separa permitido, condicionado, proibido e resposta segura.
- [x] AC2: Demo sem dados reais tem disclaimer padrao.
- [x] AC3: Piloto com dados reais continua condicionado a LGPD/juridico/golden-set e revisao humana.
- [x] AC4: Concierge kit usa a matriz G6 e remove ambiguidades.
- [x] AC5: Gate F1 marca G6 como artefato pronto com revisao juridica pendente.
- [x] AC6: XML real e claims de acuracia continuam bloqueados.

## Technical Notes

- Nao criar landing page, copy publica, ads ou proposta enviada a terceiro.
- O artefato e controle interno de linguagem, nao parecer juridico.
- Manter "indicio", "evidencia tecnica", "trilha verificavel" e "decisao profissional humana" como termos centrais.

## File List

- `docs/stories/CONTADOR-G6-safe-fiscal-language.md` - story desta entrega.
- `docs/projects/contador/45-safe-fiscal-language-claims-v1.md` - matriz de claims G6.
- `docs/projects/contador/30-signoff-fiscal-juridico-f1.md` - linguagem G6 referenciada.
- `docs/projects/contador/37-concierge-demo-kit-f1.md` - kit concierge alinhado.
- `docs/projects/contador/40-qa-security-gate-f1.md` - gate G6 atualizado.
- `docs/projects/contador/34-yolo-execution-board.md` - board atualizado.

## Dependencies

- Conclave G6 `bfd0b64a-8924-4723-8790-7b7b93b54127`.
- G1-G5 artefatos prontos.

## Definition of Done

- [x] All AC checked.
- [x] Documentation updated.
- [x] No external messaging sent.
- [x] No push/deploy performed.

## Evidence

- Consulta G6: `bfd0b64a-8924-4723-8790-7b7b93b54127`.
- Static doc check via `rg` em termos proibidos/permitidos.
