# STORY-ENIAC-TECH-RESEARCH-AUDIT: Auditoria integral e tech research comparativa

## Status: Done

## Description

Revisar o ENIAC Financeiro de ponta a ponta e produzir uma tech research comparativa que permita ao founder decidir o que manter, corrigir, substituir ou adiar antes de piloto, produção e eventual produtização como SaaS.

## Acceptance Criteria

- [x] AC1: O app inteiro, migrations e configuração são revisados contra a especificação e o contexto do projeto.
- [x] AC2: A auditoria cobre arquitetura, código, segurança, LGPD, RLS, dados, UX, IA, Open Finance, testes, observabilidade, deploy e reprodutibilidade.
- [x] AC3: A research compara alternativas relevantes de frontend/full-stack, banco/backend, Open Finance, LLM, deploy, observabilidade, testes e modelo contábil.
- [x] AC4: O mercado é comparado por concorrentes diretos, indiretos, substitutos e adjacentes, com limites explícitos das evidências.
- [x] AC5: As recomendações usam matrizes multicritério, análise de sensibilidade, riscos e condições de revisão.
- [x] AC6: Claims decisórios externos são apoiados por fontes atuais, preferencialmente primárias, e fontes recebem scoring.
- [x] AC7: Uma revisão adversarial classifica as conclusões como sobrevive, sobrevive com refinamento ou cai.
- [x] AC8: O relatório final contém roadmap priorizado para piloto e produção.

## Technical Notes

- Seguir `tech-research`: estruturação, coleta, síntese dialética, adversarial review e roteamento.
- Seguir `bughunter --full` sobre `apps/eniac-financeiro` sem aplicar correções nesta story.
- Não expor valores de `.env.local`.
- Diferenciar evidência de código, evidência documental, evidência externa e inferência.
- Não declarar compliance jurídico; identificar pontos que exigem validação especializada.

## File List

- `docs/stories/active/STORY-ENIAC-TECH-RESEARCH-AUDIT.md` — governança da auditoria.
- `docs/projects/eniac-financeiro/research/05-tech-research-plan-v1.md` — contrato da pesquisa.
- `docs/projects/eniac-financeiro/research/06-auditoria-tech-research-comparativa.md` — entregável final.

## Dependencies

- `docs/projects/eniac-financeiro/00-context/CONTEXT.md`
- `docs/projects/eniac-financeiro/V1-SPEC-livro-caixa-stafeni.md`
- `apps/eniac-financeiro/`
- Conclave `33efc498-f7e4-49a0-9f2c-2733ad3b9636`

## Definition of Done

- [x] All AC checked
- [x] Tests passing, ou ausência de testes registrada como finding
- [x] Lint clean
- [x] Typecheck clean
- [x] Build de produção validado
- [x] Code reviewed
- [x] Documentation updated
