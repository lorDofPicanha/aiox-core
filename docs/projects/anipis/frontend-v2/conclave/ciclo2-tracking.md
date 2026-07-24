# Rastreamento Ciclo 2 — verificação + notas do orquestrador

## Notas factuais (verificadas pelo orquestrador, não-opinião)
- **Botão "Entrar"**: CSS confirma `.btn-primary` habilitado = verde floresta cheio (`--accent-spot` + texto branco); `:disabled` = creme recess + texto muted. O screenshot de login mostra o FORM VAZIO (botão legitimamente disabled). Logo o "botão que mente" do Ciclo 1 está **RESOLVIDO** — Rams julgou o estado vazio. (Refino possível: estilo disabled mais "à espera" que "quebrado", ex. ghost/outline. Menor.)

## Notas por expert (Ciclo 2)
| Expert | Ciclo 1 | Ciclo 2 |
|---|---|---|
| Dieter Rams | 6.5 | **7.5** |
| Don Norman | 6.0→6.5 | **9.0** (verificou no código-fonte; 6/7 bloqueantes resolvidos) |
| Cathy Pearl | 7.0 | ⏳ |
| Rafael Calvo | 7.0 | ⏳ |
| Julie Zhuo | 6.5 | **8.5** |

## Verificação factual adicional
- **Acentos:** RE-screenshot pós-fix (`c2-onboarding-820.png`) confirma "saúde emocional / experiência / são processadas / Política" CORRETOS. A crítica R5 da Zhuo julgou o screenshot STALE da Fase B (pré-fix). Resolvido.
- **Telas pós-fix re-capturadas:** `c2-onboarding/diario/voce-820.png` (as faseB-* eram pré-fix-pass).

## "O QUE BLOQUEIA 10" — convergência (Norman+Zhuo)
1. **Smoke com IA VIVA** dos estados de cuidado (streaming, "Anipis está escrevendo", crise disparada de dentro) — só vimos mocks. **DOÁVEL pelo orquestrador** (chat funciona em prod).
2. **Gate humano** (5 pessoas reais atravessando o flow) — domínio do FOUNDER (os 20 beta testers servem exatamente isso).
3. Polimento dos resíduos menores (sombra login, emoji→ponto emotion, contraste dark re-medido, empty-state Diário, hint Enter).

## Itens residuais reais (Rams Ciclo 2) — pro fix-pass final
- [ ] Sombra leve no card de login → flat de verdade (única tela com elevação-por-sombra).
- [ ] Emoji 🙂 amarelo no chip = ruído cromático fora da ramp → ponto de cor da emotion-ramp.
- [ ] **CONTESTADO — chip de humor no HOJE:** Rams diz que não foi dissolvido (manteve pílula+emoji e multiplicou). NUANCE: humor dissolvido NO GREETING foi feito; o chip virou "convite editável". No Diário, chip-por-dia é RECORD histórico (defensável, não veredito). Decisão pendente do painel: remover o chip vivo do Hoje (deixar só na fala + ação sutil) OU manter como convite. Esperar voto de Pearl (que queria full-dissolve).
- [ ] Poço vazio (login/Hoje/onboarding herdam composição não-ancorada) → compor.
