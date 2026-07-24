# Protocolo do Conclave — Frontend v2

> Regra dura do founder (09/Jun): cada expert = agente INDEPENDENTE analisando artefatos reais → rodada ADVERSARIAL → síntese. Velocidade não é critério. Roda a cada entrega de fase; gate final = 10/10 unânime.

## Painel (5 — defs reais em `.aios-core/development/agents/{id}.md`)

| Expert | Lente | Pergunta-norte |
|---|---|---|
| don-norman | Usabilidade/affordances | "Uma pessoa em sofrimento entende o que fazer em cada tela sem pensar?" |
| dieter-rams | Forma/redução | "O que ainda dá pra REMOVER? Algo aqui é decoração?" |
| cathy-pearl | Conversation design | "A conversa parece presença humana calma ou software?" |
| rafael-calvo | Wellbeing tech/ética | "Este design respeita autonomia, evita dependência e protege em crise?" |
| julie-zhuo | Produto/coerência | "As partes formam UM produto? O flow inteiro sustenta a promessa?" |

## Rodada 1 — Pareceres independentes (5 agentes paralelos, sem ver uns aos outros)

Input de cada um: def do expert + screenshots do BUILD real (`build-qa/`) + 00-BRIEF + 02-ux-architecture + acesso ao app local se preciso. Output obrigatório:
- 3+ pontos fortes concretos (com referência à tela)
- 5+ problemas concretos, severidade (bloqueante/maior/menor), com correção proposta
- Nota 0-10 na própria lente + justificativa de por que NÃO é 10

## Rodada 2 — Adversarial (5 agentes, cada um recebe os outros 4 pareceres)

Cada expert: refuta pelo menos 2 pontos dos colegas (com argumento), endossa os 2 mais importantes, e declara o que MUDARIA na própria nota.

## Síntese (orquestrador)

CONSENSO (o que todos confirmam) / DISSENSO (decidir com critério explícito) / PONTOS CEGOS (o que ninguém viu — checar a11y/contraste/legal mecanicamente) / TABELA DE NOTAS por dimensão (flow, chat, visual, calma, a11y, microcopy) / VEREDITO + lista de correções priorizada.

Publicar em `conclave/round-{n}.md`. Iterar build → novo conclave. Gate: todas as dimensões 10.
